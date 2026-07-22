// api/payfast-itn.js
// Handles PayFast payment confirmation and routes orders to correct suppliers.
// SA clothing → OTC Printing (email + PayFast payout)
// SA + INTL sweatpants → Printful
// INTL clothing → Printify
// SA + INTL merchize-flagged items → Merchize (INACTIVE until MERCHIZE_ENABLED=true)

import crypto from "crypto";
import { supabase } from "../lib/supabase.js";
import { fulfillOrder } from "../lib/fulfillment.js";

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
    const passphrase       = process.env.PAYFAST_PASSPHRASE || "";
    const pfData           = { ...data };
    const receivedSig      = pfData.signature;
    delete pfData.signature;

    const queryString = Object.keys(pfData)
      .sort()
      .map(k => `${k}=${encodeURIComponent(pfData[k]).replace(/%20/g, "+")}`)
      .join("&");

    const sigString = passphrase
      ? `${queryString}&passphrase=${encodeURIComponent(passphrase)}`
      : queryString;

    const generatedSig = crypto.createHash("md5").update(sigString).digest("hex");

    if (generatedSig !== receivedSig) {
      console.error("❌ Signature mismatch");
      return res.status(400).send("Invalid signature");
    }

    // ── Verify with PayFast ──────────────────────────────────────────────────
    const verifyRes  = await fetch("https://www.payfast.co.za/eng/query/validate", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: queryString
    });
    if ((await verifyRes.text()) !== "VALID") {
      return res.status(400).send("Validation failed");
    }

    if (data.payment_status !== "COMPLETE") {
      return res.status(200).send("Ignored");
    }

    // ── Fetch order ──────────────────────────────────────────────────────────
    const orderId = data.m_payment_id || data.item_name;
    const { data: order } = await supabase
      .from("orders")
      .select("*")
      .eq("order_id", orderId)
      .single();

    if (!order) return res.status(400).send("Order not found");
    if (order.fulfilled) return res.status(200).send("Already fulfilled");

    const { cart } = order;
    const baseUrl = process.env.BASE_URL || `https://${req.headers.host}`;

    // ── Amount check ─────────────────────────────────────────────────────────
    const expectedAmount = cart.reduce((s, i) => s + (i.price * (i.quantity || 1)), 0);
    const paidAmount     = parseFloat(data.amount_gross);
    if (Math.abs(expectedAmount - paidAmount) > 1) {
      console.error(`❌ Amount mismatch: expected ${expectedAmount}, got ${paidAmount}`);
      return res.status(400).send("Amount mismatch");
    }

    // ── Mark as paid ─────────────────────────────────────────────────────────
    await supabase.from("orders")
      .update({ payment_status: "paid", status: "paid", payfast_payment_id: data.pf_payment_id })
      .eq("order_id", orderId);

    // ── Route to suppliers (shared logic) ────────────────────────────────────
    await fulfillOrder(orderId, order, baseUrl);

    // ── Mark fulfilled ───────────────────────────────────────────────────────
    await supabase.from("orders")
      .update({ fulfilled: true, fulfillment_status: "fulfilled" })
      .eq("order_id", orderId);

    console.log("🎉 Order fully processed:", orderId);
    return res.status(200).send("OK");

  } catch (err) {
    console.error("🔥 ITN ERROR:", err);
    return res.status(500).send("Error");
  }
}
