// lib/fulfillment.js
// Shared order-routing logic, used by api/payfast-itn.js.
// Whichever payment processor confirms a paid order, it hands off here.
//
// SA clothing (hoodie/sweatshirt/tshirt/longsleeve) → OTC Printing (email + PayFast payout)
// SA + INTL sweatpants                              → Printful
// INTL everything else                               → Printify
// SA + INTL merchize-flagged items                   → Merchize (INACTIVE until MERCHIZE_ENABLED=true)

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
  // ════════════════════════════════════════════════════════════════════════
  if (otcItems.length > 0) {
    try {
      await retry(() => fetch(`${baseUrl}/api/otc-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, customer, items: otcItems })
      }));
      console.log(`✅ OTC email sent for ${orderId}`);
    } catch (e) {
      console.error("❌ OTC email failed:", e);
    }

    const itemsTotal = otcItems.reduce((sum, item) => sum + getItemCost(item), 0);
    const otcTotal    = itemsTotal + OTC_SHIPPING;
    console.log(`💸 OTC total: R${otcTotal.toFixed(2)} (items R${itemsTotal.toFixed(2)} + R${OTC_SHIPPING} shipping)`);

    const payoutKey  = process.env.PAYFAST_PAYOUT_API_KEY;
    const merchantId = process.env.PAYFAST_MERCHANT_ID;
    const otcAccount = process.env.OTC_BANK_ACCOUNT;
    const otcBranch  = process.env.OTC_BANK_BRANCH || "632005";
    const otcHolder  = process.env.OTC_ACCOUNT_HOLDER;

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
              bank_name:      "absa",
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
}
