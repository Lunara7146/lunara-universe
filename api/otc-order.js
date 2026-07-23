// api/otc-order.js
// ─────────────────────────────────────────────────────────────────────────────
// Sends a fulfillment email directly from your Gmail to OTC Printing
// and a copy to yourself when a SA customer places an order.
// Uses Gmail SMTP — completely free, no custom domain needed.
//
// SETUP (one time in Vercel → Settings → Environment Variables):
//   GMAIL_USER         = lunarasuniverse@gmail.com
//   GMAIL_APP_PASSWORD = 16-character app password from Google Account → Security
//   OTC_EMAIL          = OTC Printing's email address
// ─────────────────────────────────────────────────────────────────────────────

import nodemailer from "nodemailer";
import { generatePrinterEmailBody } from "../lib/email.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { orderId, customer, items } = req.body;

  if (!orderId || !customer || !items?.length) {
    return res.status(400).json({ error: "Missing required order fields" });
  }

  const gmailUser    = process.env.GMAIL_USER;
  const gmailPass    = process.env.GMAIL_APP_PASSWORD;
  const otcEmail     = process.env.OTC_EMAIL;
  const lunaEmail    = gmailUser || "lunarasuniverse@gmail.com";

  if (!gmailUser || !gmailPass || !otcEmail) {
    console.error("Missing GMAIL_USER, GMAIL_APP_PASSWORD or OTC_EMAIL");
    return res.status(500).json({ error: "Email config not set" });
  }

  // ── Build customer data for email.js ──────────────────────────────────────
  const customerData = {
    name:         customer.name || `${customer.firstName || ""} ${customer.lastName || ""}`.trim(),
    email:        customer.email,
    phone:        customer.phone || "—",
    addressLine1: customer.address1 || customer.address || "",
    addressLine2: "",
    city:         customer.city    || "",
    postalCode:   customer.zip     || "",
    country:      customer.country || "South Africa"
  };

  // ── Build order items for email.js ────────────────────────────────────────
  const orderItems = items.map(item => ({
    design:      item.name
      .replace(/(T-Shirt|Long Sleeve T-Shirt|Hoodie|Sweatshirt)/gi, "")
      .trim(),
    productType: item.type || "t_shirt",
    color:       item.color,
    size:        item.size,
    quantity:    item.quantity
  }));

  const emailBody = generatePrinterEmailBody(customerData, orderItems)
    + "\n\n— Shipping cost (R100) is included in this order's payment. —";
  const subject   = `New Print Order ${orderId} — Lunara's Universe`;

  // ── Send via Gmail SMTP ───────────────────────────────────────────────────
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailPass
      }
    });

    // Send to OTC + copy to Luna in one call
    await transporter.sendMail({
      from:    `"Lunara's Universe" <${gmailUser}>`,
      to:      otcEmail,
      cc:      lunaEmail,
      subject,
      text:    emailBody
    });

    console.log(`✅ OTC order email sent for ${orderId}`);
    return res.status(200).json({ success: true, orderId });

  } catch (err) {
    console.error("❌ Gmail send error:", err);
    return res.status(500).json({ error: "Failed to send order email", detail: err.message });
  }
}
