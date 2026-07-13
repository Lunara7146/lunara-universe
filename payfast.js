// api/payfast.js
// ─────────────────────────────────────────────────────────────────────────────
// Creates a PayFast payment URL and saves the pending order to Supabase.
//
// ENVIRONMENT VARIABLES (Vercel → Settings → Environment Variables):
//   PAYFAST_MERCHANT_ID   = your PayFast merchant ID
//   PAYFAST_MERCHANT_KEY  = your PayFast merchant key
//   PAYFAST_PASSPHRASE    = your PayFast passphrase
//   BASE_URL              = your Vercel URL e.g. https://lunara-universe.vercel.app
// ─────────────────────────────────────────────────────────────────────────────

import crypto from "crypto";
import { supabase } from "../lib/supabase";

function generateSignature(data, passphrase = "") {
  const filtered = Object.keys(data)
    .filter(k => data[k] !== undefined && data[k] !== null && data[k] !== "")
    .sort()
    .map(k => `${k}=${encodeURIComponent(String(data[k])).replace(/%20/g, "+")}`)
    .join("&");

  const string = passphrase
    ? `${filtered}&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, "+")}`
    : filtered;

  return crypto.createHash("md5").update(string).digest("hex");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      firstName, lastName, email,
      amount, cart,
      address1, city, region, zip, country, phone,
      orderId,
      userRegion   // "ZA" or "INTL" — passed from the frontend
    } = req.body;

    // ── Validation ───────────────────────────────────────────────────────────
    if (!cart?.length)               return res.status(400).json({ error: "Cart is empty" });
    if (!firstName || !lastName || !email) return res.status(400).json({ error: "Missing customer info" });
    if (!orderId)                    return res.status(400).json({ error: "Missing order ID" });

    // ── Save order to Supabase (pending) ─────────────────────────────────────
    const { error: dbError } = await supabase.from("orders").insert([{
      order_id: orderId,
      email,
      amount,
      status:   "pending",
      region:   userRegion || "ZA",
      cart,
      customer: {
        firstName, lastName, email,
        address1, city, region, zip, country, phone
      }
    }]);

    if (dbError) {
      console.error("❌ Supabase error:", dbError);
      return res.status(500).json({ error: "Database error" });
    }

    // ── PayFast config ───────────────────────────────────────────────────────
    const merchant_id  = process.env.PAYFAST_MERCHANT_ID;
    const merchant_key = process.env.PAYFAST_MERCHANT_KEY;
    const passphrase   = process.env.PAYFAST_PASSPHRASE || "";
    const baseUrl      = process.env.BASE_URL;

    if (!merchant_id || !merchant_key || !baseUrl) {
      return res.status(500).json({ error: "Missing PayFast config" });
    }

    // ── Encode customer data into PayFast custom fields ──────────────────────
    // PayFast supports custom_str1–5 only. We pack all shipping data into str2.
    const customerJson = JSON.stringify({
      firstName, lastName, email, phone,
      address1, city, region, zip, country
    });

    const paymentData = {
      merchant_id,
      merchant_key,

      return_url: `${baseUrl}/success.html`,
      cancel_url: `${baseUrl}/cancel.html`,
      notify_url: `${baseUrl}/api/payfast-itn`,

      name_first:    firstName,
      name_last:     lastName,
      email_address: email,

      m_payment_id: orderId,
      amount:       Number(amount).toFixed(2),
      item_name:    `Order ${orderId}`,

      // custom_str1 = cart JSON
      // custom_str2 = customer JSON
      // custom_str3 = region (ZA / INTL)
      custom_str1: JSON.stringify(cart),
      custom_str2: customerJson,
      custom_str3: userRegion || "ZA"
    };

    const signature  = generateSignature(paymentData, passphrase);
    const query      = new URLSearchParams({ ...paymentData, signature }).toString();
    const paymentUrl = `https://www.payfast.co.za/eng/process?${query}`;

    console.log(`✅ PayFast URL created for order ${orderId}`);
    return res.status(200).json({ success: true, url: paymentUrl });

  } catch (err) {
    console.error("🔥 Checkout error:", err);
    return res.status(500).json({ error: "Checkout failed", details: err.message });
  }
}
