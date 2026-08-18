// lib/fulfillment.js
// Shared order-routing logic, used by api/payfast-itn.js.
// Whichever payment processor confirms a paid order, it hands off here.
//
// SA clothing (hoodie/sweatshirt/tshirt/longsleeve) → OTC Printing (email + PayFast payout)
// SA + INTL sweatpants                              → Printful
// INTL everything else                               → Printify
// SA + INTL merchize-flagged items                   → Merchize (INACTIVE until MERCHIZE_ENABLED=true)

import nodemailer from "nodemailer";

// ── OTC confirmed prices (VAT incl, confirmed 14 Jul 2026) ───────────────────
const OTC_COSTS = {
  hoodie:     { black: 598.00, white: 575.00, "stone-blue": 575.00 },
  sweatshirt: { black: 540.50, white: 517.50 },
  tshirt:     { black: 277.73, white: 244.38 },
  longsleeve: { black: 358.23, white: 301.88 }
};
const OTC_SHIPPING = 100.00; // R100 express shipping — charged ONCE per order
const OTC_TYPES    = ["hoodie", "sweatshirt", "tshirt", "longsleeve"];

function getItemCost(item) {
  const type  = String(item.type  || "").toLowerCase();
  const color = String(item.color || "black").toLowerCase();
  const map   = OTC_COSTS[type];
  if (!map) return 0;
  const unitCost = map[color] || map["black"];
  return unitCost * (item.quantity || 1);
}

async function retry(fn, retries = 3) {
  try { return await fn(); }
  catch (err) {
    if (retries <= 0) throw err;
    await new Promise(r => setTimeout(r, 1000));
    return retry(fn, retries - 1);
  }
}

// Sends a simple "your order is confirmed" email to the customer.
// Uses the same working Gmail SMTP setup as the OTC email — no new env vars needed.
// Alerts YOU (not the customer) when an SA order had to reroute from OTC to Printify.
// Important because the cost basis is different — no R100 goes to OTC on this order,
// and Printify bills your card directly instead.
async function sendOwnerFallbackAlert(orderId, items, bothFailed = false) {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  if (!gmailUser || !gmailPass) return;

  const itemLines = items.map(i => `  • ${i.name} (${i.size}/${i.color}) x${i.quantity || 1}`).join("\n");

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailPass }
    });

    await transporter.sendMail({
      from: `"Lunara's Universe Alerts" <${gmailUser}>`,
      to: gmailUser,
      subject: bothFailed
        ? `🚨 URGENT — Order ${orderId} failed BOTH OTC and Printify`
        : `⚠️ Order ${orderId} rerouted: OTC failed, sent to Printify instead`,
      text: bothFailed
        ? `Order ${orderId} failed to reach BOTH OTC and Printify. This order needs your manual attention right away.\n\nItems:\n${itemLines}`
        : `Heads up — OTC didn't respond for order ${orderId}, so it was automatically sent to Printify instead.\n\nThis order won't show in your OTC payout tracker, since OTC never received it. Printify will bill your account directly for it, same as an international order.\n\nItems:\n${itemLines}`
    });
  } catch (err) {
    console.error("❌ Owner fallback alert email failed:", err);
  }
}

async function sendCustomerConfirmation(orderId, order) {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  const customer  = order.customer || {};
  const toEmail   = customer.email || order.email;

  if (!gmailUser || !gmailPass || !toEmail) {
    console.warn("⚠️ Skipping customer confirmation email — missing config or email address");
    return;
  }

  const itemLines = (order.cart || [])
    .map(i => `  • ${i.name} (${i.size}/${i.color}) x${i.quantity || 1}`)
    .join("\n");

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: gmailUser, pass: gmailPass }
    });

    await transporter.sendMail({
      from: `"Lunara's Universe" <${gmailUser}>`,
      to: toEmail,
      subject: `🌙 Your Lunara's Universe order is confirmed — ${orderId}`,
      text: `Hi ${customer.firstName || "there"},

Your order has been confirmed and is on its way to production!

Order ID: ${orderId}

Your items:
${itemLines}

We'll be in touch if anything needs your attention. Thank you for shopping with Lunara's Universe 🌙

— Lunara's Universe`
    });
    console.log(`✅ Customer confirmation email sent for ${orderId}`);
  } catch (err) {
    console.error("❌ Customer confirmation email failed:", err);
  }
}

// orderId: string · order: the Supabase order row (cart, customer, region) · baseUrl: site base URL
export async function fulfillOrder(orderId, order, baseUrl) {
  const { cart, customer, region } = order;
  const isZA = (region || "ZA") === "ZA";

  const merchizeEnabled = process.env.MERCHIZE_ENABLED === "true";
  const otcItems       = isZA ? cart.filter(i => OTC_TYPES.includes(String(i.type||"").toLowerCase())) : [];
  const printfulItems  = cart.filter(i => String(i.type||"").toLowerCase() === "sweatpants");
  const printifyItems  = !isZA ? cart.filter(i => String(i.type||"").toLowerCase() !== "sweatpants") : [];
  const merchizeItems  = merchizeEnabled ? cart.filter(i => i.merchize) : [];

  // ════════════════════════════════════════════════════════════════════════
  // 🇿🇦  OTC PRINTING — SA hoodies, sweatshirts, tees, longsleeves
  // If OTC fails, automatically reroute these items to Printify instead —
  // same fallback pattern sweatpants already use (one supplier, both regions).
  // ════════════════════════════════════════════════════════════════════════
  if (otcItems.length > 0) {
    let otcSucceeded = false;

    try {
      await retry(() => fetch(`${baseUrl}/api/otc-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, customer, items: otcItems })
      }));
      otcSucceeded = true;
      console.log(`✅ OTC email sent for ${orderId}`);
    } catch (e) {
      console.error("❌ OTC email failed after retries:", e);
    }

    if (otcSucceeded) {
      // ── Normal path: OTC got the order, now calculate and attempt their payout ──
      const itemsTotal = otcItems.reduce((sum, item) => sum + getItemCost(item), 0);
      const otcTotal    = itemsTotal + OTC_SHIPPING;
      console.log(`💸 OTC total: R${otcTotal.toFixed(2)} (items R${itemsTotal.toFixed(2)} + R${OTC_SHIPPING} shipping)`);

      const payoutKey  = process.env.PAYFAST_PAYOUT_API_KEY;
      const merchantId = process.env.PAYFAST_MERCHANT_ID;
      const otcAccount = process.env.OTC_BANK_ACCOUNT;
      const otcBranch  = process.env.OTC_BANK_BRANCH || "210414";
      const otcHolder  = process.env.OTC_ACCOUNT_HOLDER;
      const otcBank    = process.env.OTC_BANK_NAME || "fnb";

      if (payoutKey && merchantId && otcAccount && otcHolder) {
        try {
          const payoutRes = await fetch("https://api.payfast.co.za/transfers/1.0.0/send", {
            method: "POST",
            headers: {
              "merchant-id":   merchantId,
              "version":       "v1",
              "timestamp":     new Date().toISOString(),
              "Content-Type":  "application/json",
              "Authorization": payoutKey
            },
            body: JSON.stringify({
              amount: Math.round(otcTotal * 100), // in cents
              group:  "banks",
              recipient: {
                name:           otcHolder,
                bank_name:      otcBank,
                account_number: otcAccount,
                branch_code:    otcBranch,
                account_type:   "current"
              },
              reference:             orderId,
              beneficiary_reference: `LUNARA-${orderId}`
            })
          });

          if (!payoutRes.ok) {
            console.error("❌ PayFast payout failed:", await payoutRes.text());
          } else {
            console.log(`✅ R${otcTotal.toFixed(2)} sent to OTC for order ${orderId}`);
          }
        } catch (pe) {
          console.error("❌ Payout error:", pe);
        }
      } else {
        console.warn("⚠️ Payout skipped — missing env vars (OTC will invoice manually)");
      }

    } else {
      // ── Fallback path: OTC failed — reroute to Printify instead ──
      // No OTC payout happens here since OTC never received the order.
      // Printify bills your Printify account directly, same as any international order.
      console.warn(`⚠️ OTC failed for ${orderId} — rerouting to Printify as fallback`);
      try {
        const fallbackLineItems = otcItems.map(item => {
          if (!item.sku || item.sku === "LOCAL-PROD") {
            throw new Error(`Missing Printify SKU for fallback item ${item.name} (${item.size}/${item.color})`);
          }
          return { sku: item.sku, quantity: item.quantity || 1 };
        });

        await retry(() => fetch(`${baseUrl}/api/printify-orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            external_id: orderId,
            line_items: fallbackLineItems,
            address_to: {
              first_name: customer.firstName,
              last_name:  customer.lastName,
              email:      customer.email,
              phone:      customer.phone,
              address1:   customer.address1,
              city:       customer.city,
              region:     customer.region,
              zip:        customer.zip,
              country:    customer.country || "ZA"
            }
          })
        }));
        console.log(`✅ Fallback Printify order submitted for ${orderId}`);

        // Alert you directly — this order's cost basis is now different (Printify, not OTC)
        await sendOwnerFallbackAlert(orderId, otcItems);

      } catch (fallbackError) {
        console.error("❌ Fallback to Printify ALSO failed:", fallbackError);
        await sendOwnerFallbackAlert(orderId, otcItems, true);
      }
    }
  }

  // ════════════════════════════════════════════════════════════════════════
  // 👟  PRINTFUL — Sweatpants (SA + International)
  // ════════════════════════════════════════════════════════════════════════
  if (printfulItems.length > 0) {
    try {
      const { sendToPrintful } = await import("./printful.js");
      await retry(() => sendToPrintful({
        order_id: orderId,
        email:    customer.email,
        items:    printfulItems,
        shipping: {
          firstName: customer.firstName,
          lastName:  customer.lastName,
          address1:  customer.address1,
          city:      customer.city,
          zip:       customer.zip,
          country:   customer.country || "ZA",
          phone:     customer.phone,
          email:     customer.email
        }
      }));
      console.log(`✅ Printful order submitted for ${orderId}`);
    } catch (e) {
      console.error("❌ Printful error:", e);
    }
  }

  // ════════════════════════════════════════════════════════════════════════
  // 🧵  MERCHIZE — SA + International (INACTIVE until MERCHIZE_ENABLED=true)
  // ════════════════════════════════════════════════════════════════════════
  if (merchizeEnabled && merchizeItems.length > 0) {
    try {
      const { sendToMerchize } = await import("./merchize.js");
      await retry(() => sendToMerchize({
        order_id: orderId,
        email:    customer.email,
        items:    merchizeItems,
        shipping: {
          firstName: customer.firstName,
          lastName:  customer.lastName,
          address1:  customer.address1,
          city:      customer.city,
          zip:       customer.zip,
          country:   customer.country || "ZA",
          phone:     customer.phone,
          email:     customer.email
        }
      }));
      console.log(`✅ Merchize order submitted for ${orderId}`);
    } catch (e) {
      console.error("❌ Merchize error:", e);
    }
  }

  // ════════════════════════════════════════════════════════════════════════
  // 🌍  PRINTIFY — International clothing orders
  // ════════════════════════════════════════════════════════════════════════
  if (printifyItems.length > 0) {
    try {
      // Printify's API accepts a plain SKU as a complete line item — no product_id
      // or variant_id lookup needed. This matches the real SKU data already stored
      // per size/color in collections.js and copied onto the cart item at checkout.
      const line_items = printifyItems.map(item => {
        if (!item.sku || item.sku === "LOCAL-PROD") {
          throw new Error(`Missing real Printify SKU for ${item.name} (${item.size}/${item.color})`);
        }
        return {
          sku: item.sku,
          quantity: item.quantity || 1
        };
      });

      await retry(() => fetch(`${baseUrl}/api/printify-orders`, {
        method: "POST",
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
      }));
      console.log(`✅ Printify order submitted for ${orderId}`);
    } catch (e) {
      console.error("❌ Printify error:", e);
    }
  }

  // ════════════════════════════════════════════════════════════════════════
  // 📧 CUSTOMER CONFIRMATION — sent for every order, every supplier
  // ════════════════════════════════════════════════════════════════════════
  await sendCustomerConfirmation(orderId, order);
}
