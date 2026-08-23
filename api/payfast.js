// api/payfast.js
import crypto from "crypto";
import { supabase } from "../lib/supabase.js";

// Exact PHP urlencode implementation required for PayFast MD5 verification
function pfUrlEncode(str) {
  return encodeURIComponent(String(str).trim())
    .replace(/%20/g, "+")
    .replace(/!/g, "%21")
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/\*/g, "%2A")
    .replace(/~/g, "%7E")
    .replace(/@/g, "%40");
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
      orderId, userRegion, promoCode
    } = req.body;

    if (!cart?.length || !firstName || !lastName || !email || !orderId) {
      return res.status(400).json({ error: "Missing required checkout parameters" });
    }

    // Save order to Supabase safely
    try {
      await supabase.from("orders").insert([{
        order_id: orderId,
        email: email.trim(),
        amount: Number(amount),
        status: "pending",
        region: userRegion || "ZA",
        cart,
        promo_code: promoCode || null,
        customer: { firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim(), address1, city, region, zip, country, phone }
      }]);
    } catch (dbErr) {
      console.warn("⚠️ Supabase logging warning:", dbErr.message);
    }

    // Sanitize environment variables (strips rogue quotes/whitespace)
    const merchant_id  = String(process.env.PAYFAST_MERCHANT_ID || "10000100").replace(/['"]/g, "").trim();
    const merchant_key = String(process.env.PAYFAST_MERCHANT_KEY || "46f0cd694581a").replace(/['"]/g, "").trim();
    const passphrase   = String(process.env.PAYFAST_PASSPHRASE || "").replace(/['"]/g, "").trim();
    const baseUrl      = (process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");

    // Dynamically switch endpoint between Sandbox and Live
    const isSandbox = process.env.PAYFAST_SANDBOX === "true";
    const actionUrl = isSandbox
      ? "https://sandbox.payfast.co.za/eng/process"
      : "https://www.payfast.co.za/eng/process";

    // PayFast parameters in required sequence
    const payfastFields = {
      merchant_id,
      merchant_key,
      return_url:    `${baseUrl}/success.html`,
      cancel_url:    `${baseUrl}/cancel.html`,
      notify_url:    `${baseUrl}/api/payfast-itn`,
      name_first:    firstName.trim(),
      name_last:     lastName.trim(),
      email_address: email.trim(),
      m_payment_id:  String(orderId).trim(),
      amount:        Number(amount).toFixed(2),
      item_name:     `Order ${orderId}`.trim()
    };

    // Construct signature string with PHP urlencode rules
    let signatureString = Object.keys(payfastFields)
      .filter(key => payfastFields[key] !== undefined && payfastFields[key] !== null && String(payfastFields[key]).trim() !== "")
      .map(key => `${key}=${pfUrlEncode(payfastFields[key])}`)
      .join("&");

    if (passphrase) {
      signatureString += `&passphrase=${pfUrlEncode(passphrase)}`;
    }

    if (process.env.NODE_ENV !== "production") {
      console.log("PayFast signature input:", signatureString);
    }

    payfastFields.signature = crypto.createHash("md5").update(signatureString, "utf8").digest("hex");

    return res.status(200).json({
      success: true,
      action: actionUrl,
      fields: payfastFields
    });

  } catch (err) {
    console.error("🔥 PayFast handler error:", err);
    return res.status(500).json({ error: "Checkout failed", details: err.message });
  }
}
