// api/payfast-itn.js
// ─────────────────────────────────────────────────────────────────────────────
// PayFast Instant Transaction Notification handler.
// Called by PayFast after every successful payment.
//
// ROUTING LOGIC:
//   SA  + hoodie/sweatshirt/tshirt/longsleeve → OTC Printing (email + payout)
//   SA  + sweatpants                          → Printful
//   INTL + any item                           → Printify
//
// ENVIRONMENT VARIABLES (Vercel → Settings → Environment Variables):
//   PAYFAST_PASSPHRASE      = your PayFast passphrase
//   PAYFAST_PAYOUT_API_KEY  = your PayFast Payouts API key
//   PAYFAST_MERCHANT_ID     = your PayFast merchant ID
//   OTC_BANK_ACCOUNT        = OTC's bank account number
//   OTC_BANK_BRANCH         = OTC's branch code (ABSA = 632005)
//   OTC_ACCOUNT_HOLDER      = OTC's account holder name
//   BASE_URL                = your Vercel URL
// ─────────────────────────────────────────────────────────────────────────────

import crypto from "crypto";
import { supabase } from "../lib/supabase";

// ── OTC cost prices (VAT + R100 shipping included) ───────────────────────────
const OTC_COSTS = {
  hoodie:     { black: 698.00, white: 690.00, "stone-blue": 690.00 },
  sweatshirt: { black: 655.50, white: 632.50 },
  tshirt:     { black: 392.73, white: 359.38 },
  longsleeve: { black: 491.63, white: 382.38 }
};

const OTC_TYPES = ["hoodie", "sweatshirt", "tshirt", "longsleeve"];

function getOTCCost(item) {
  const type  = String(item.type  || "").toLowerCase();
  const color = String(item.color || "black").toLowerCase();
  const map   = OTC_COSTS[type];
  if (!map) return 0;
  return (map[color] || map["black"]) * (item.quantity || 1);
}

async function retry(fn, retries = 3) {
  try { return await fn(); }
  catch (err) {
    if (retries <= 0) throw err;
    await new Promise(r => setTimeout(r, 1000));
    return retry(fn, retries - 1);
  }
}

export default async function handler(req, res) {
  try {
    const data = req.body;
    console.log("🔔 PayFast ITN received:", data);

    // ── Signature verification ───────────────────────────────────────────────
    const passphrase = process.env.PAYFAST_PASSPHRASE || "";
    const pfData = { ...data };
    const receivedSignature = pfData.signature;
    delete pfData.signature;

    const queryString = Object.keys(pfData)
      .sort()
      .map(k => `${k}=${encodeURIComponent(pfData[k]).replace(/%20/g, "+")}`)
      .join("&");

    const signatureString = passphrase
      ? `${queryString}&passphrase=${encodeURIComponent(passphrase)}`
      : queryString;

    const generatedSignature = crypto
      .createHash("md5")
      .update(signatureString)
      .digest("hex");

    if (generatedSignature !== receivedSignature) {
      console.error("❌ Signature mismatch");
      return res.status(400).send("Invalid signature");
    }

    // ── Verify with PayFast ──────────────────────────────────────────────────
    const verifyRes  = await fetch("https://www.payfast.co.za/eng/query/validate", {
      method:  "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body:    queryString
    });
    const verifyText = await verifyRes.text();
    if (verifyText !== "VALID") {
      console.error("❌ PayFast validation failed:", verifyText);
      return res.status(400).send("Validation failed");
    }

    // ── Payment status ───────────────────────────────────────────────────────
    if (data.payment_status !== "COMPLETE") {
      return res.status(200).send("Ignored");
    }

    const orderId   = data.m_payment_id;
    const paidAmount = parseFloat(data.amount_gross);

    // ── Fetch order from Supabase ────────────────────────────────────────────
    const { data: order } = await supabase
      .from("orders")
      .select("*")
      .eq("order_id", orderId)
      .single();

    if (!order) return res.status(400).send("Order not found");
    if (order.fulfilled) return res.status(200).send("Already fulfilled");

    const { cart, customer, region } = order;
    const isZA = region === "ZA" || String(customer?.country || "").toLowerCase().includes("south africa");

    // ── Amount check ─────────────────────────────────────────────────────────
    const expectedAmount = cart.reduce((s, i) => s + (i.price * (i.quantity || 1)), 0);
    if (Math.abs(expectedAmount - paidAmount) > 1) {
      console.error(`❌ Amount mismatch: expected ${expectedAmount}, got ${paidAmount}`);
      return res.status(400).send("Amount mismatch");
    }

    // ── Update payment status ────────────────────────────────────────────────
    await supabase
      .from("orders")
      .update({ payment_status: "paid", status: "paid", payfast_payment_id: data.pf_payment_id })
      .eq("order_id", orderId);

    const baseUrl = process.env.BASE_URL || `https://${req.headers.host}`;

    // ── Split cart by supplier ───────────────────────────────────────────────
    const otcItems      = isZA ? cart.filter(i => OTC_TYPES.includes(String(i.type||"").toLowerCase())) : [];
    const printfulItems = cart.filter(i => String(i.type||"").toLowerCase() === "sweatpants");
    const printifyItems = !isZA ? cart.filter(i => String(i.type||"").toLowerCase() !== "sweatpants") : [];

    // ═══════════════════════════════════════════════════════════════════════
    // 🇿🇦 OTC PRINTING — SA hoodies, sweatshirts, tshirts, longsleeves
    // ═══════════════════════════════════════════════════════════════════════
    if (otcItems.length > 0) {

      // 1. Send order email to OTC
      await retry(() =>
        fetch(`${baseUrl}/api/otc-order`, {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId,
            customer,
            items: otcItems
          })
        })
      );

      // 2. Calculate exact OTC cost
      const otcTotal = otcItems.reduce((sum, item) => sum + getOTCCost(item), 0);
      console.log(`💸 OTC payout: R${otcTotal.toFixed(2)}`);

      // 3. PayFast Payouts API — send OTC's cut to their bank account
      const payoutApiKey     = process.env.PAYFAST_PAYOUT_API_KEY;
      const merchantId       = process.env.PAYFAST_MERCHANT_ID;
      const otcBankAccount   = process.env.OTC_BANK_ACCOUNT;
      const otcBranchCode    = process.env.OTC_BANK_BRANCH   || "632005"; // ABSA universal
      const otcAccountHolder = process.env.OTC_ACCOUNT_HOLDER;

      if (payoutApiKey && merchantId && otcBankAccount && otcAccountHolder) {
        try {
          const payoutRes = await fetch("https://api.payfast.co.za/transfers/1.0.0/send", {
            method:  "POST",
            headers: {
              "merchant-id":  merchantId,
              "version":      "v1",
              "timestamp":    new Date().toISOString(),
              "Content-Type": "application/json",
              "Authorization": payoutApiKey
            },
            body: JSON.stringify({
              amount:         Math.round(otcTotal * 100), // in cents
              group:          "banks",
              recipient: {
                name:          otcAccountHolder,
                bank_name:     "absa",
                account_number: otcBankAccount,
                branch_code:   otcBranchCode,
                account_type:  "current"
              },
              reference:      orderId,
              beneficiary_reference: `LUNARA-${orderId}`
            })
          });

          if (!payoutRes.ok) {
            const txt = await payoutRes.text();
            console.error("❌ PayFast payout failed:", txt);
          } else {
            console.log(`✅ PayFast payout of R${otcTotal.toFixed(2)} sent to OTC`);
          }
        } catch (payoutErr) {
          console.error("❌ Payout error:", payoutErr);
          // Don't block fulfillment if payout fails — email already sent to OTC
        }
      } else {
        console.warn("⚠️ PayFast payout skipped — missing env vars");
      }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 👟 PRINTFUL — Sweatpants (SA + International)
    // ═══════════════════════════════════════════════════════════════════════
    if (printfulItems.length > 0) {
      try {
        const printfulKey = process.env.PRINTFUL_API_KEY;
        if (!printfulKey) throw new Error("PRINTFUL_API_KEY not set");

        const printfulRes = await retry(() =>
          fetch("https://api.printful.com/orders", {
            method:  "POST",
            headers: {
              "Authorization": `Bearer ${printfulKey}`,
              "Content-Type":  "application/json"
            },
            body: JSON.stringify({
              external_id: orderId,
              recipient: {
                name:     `${customer.firstName} ${customer.lastName}`,
                address1: customer.address1,
                city:     customer.city,
                state_code: customer.region,
                country_code: customer.country || "ZA",
                zip:      customer.zip,
                email:    customer.email,
                phone:    customer.phone
              },
              items: printfulItems.map(item => ({
                sync_variant_id: item.printful_variant_id || item.sku,
                quantity: item.quantity || 1
              }))
            })
          })
        );

        if (!printfulRes.ok) {
          const txt = await printfulRes.text();
          console.error("❌ Printful order failed:", txt);
        } else {
          console.log(`✅ Printful order submitted for ${orderId}`);
        }
      } catch (printfulErr) {
        console.error("❌ Printful error:", printfulErr);
      }
    }

    // ═══════════════════════════════════════════════════════════════════════
    // 🌍 PRINTIFY — International orders (non-sweatpants)
    // ═══════════════════════════════════════════════════════════════════════
    if (printifyItems.length > 0) {
      const line_items = printifyItems.map(item => {
        const variant = item.variants?.find(v =>
          v.size  === item.size?.toLowerCase() &&
          v.color === item.color?.toLowerCase()
        );
        if (!variant) throw new Error(`Printify variant not found for ${item.name}`);
        return {
          product_id: item.printify?.productId,
          variant_id: variant.id,
          quantity:   item.quantity || 1
        };
      });

      await retry(() =>
        fetch(`${baseUrl}/api/printify-orders`, {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            external_id: orderId,
            line_items,
            address_to: {
              first_name: customer.firstName,
              last_name:  customer.lastName,
              email:      customer.email,
              phone:      customer.phone,
              address1:   customer.address1,
              city:       customer.city,
              region:     customer.region,
              zip:        customer.zip,
              country:    customer.country
            }
          })
        })
      );
      console.log(`✅ Printify order submitted for ${orderId}`);
    }

    // ── Mark order as fulfilled ──────────────────────────────────────────────
    await supabase
      .from("orders")
      .update({ fulfilled: true, fulfillment_status: "fulfilled" })
      .eq("order_id", orderId);

    console.log("🎉 Order fully processed:", orderId);
    return res.status(200).send("OK");

  } catch (err) {
    console.error("🔥 ITN ERROR:", err);
    return res.status(500).send("Error");
  }
}
