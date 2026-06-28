// api/otc-order.js
// ─────────────────────────────────────────────────────────────────────────────
// Triggered at checkout when a SA customer orders hoodies, sweatshirts,
// tees, or long sleeve tees. Sends a fulfillment email to OTC Printing
// via your Wix automation webhook.
//
// SETUP (one time in Vercel → Settings → Environment Variables):
//   WIX_OTC_WEBHOOK_URL  = your Wix automation webhook URL
//
// HOW TO SET UP THE WIX AUTOMATION:
//   1. In Wix Studio → Automations → New Automation
//   2. Trigger: "When a webhook is received" → copy the webhook URL → paste into Vercel env
//   3. Action: "Send an email"
//   4. In the email body field, insert the variable: {{emailBody}}
//   5. Set To: OTC Printing's email address
//   6. Set Subject: "New Print Order {{orderId}} — Lunara's Universe"
//   7. Activate the automation
// ─────────────────────────────────────────────────────────────────────────────

import { generatePrinterEmailBody } from "../lib/email.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { orderId, customer, items } = req.body;

  if (!orderId || !customer || !items?.length) {
    return res.status(400).json({ error: "Missing required order fields" });
  }

  const webhookUrl = process.env.WIX_OTC_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("WIX_OTC_WEBHOOK_URL is not configured in environment variables.");
    return res.status(500).json({ error: "Webhook URL not configured" });
  }

  // ── Build customer data shape for email.js ─────────────────────────────────
  const customerData = {
    name:        customer.name,
    email:       customer.email,
    phone:       customer.phone || "—",
    addressLine1: customer.address?.split(",")[0]?.trim() || customer.address || "",
    addressLine2: "",
    city:        customer.city    || customer.address?.split(",")[1]?.trim() || "",
    postalCode:  customer.zip     || customer.address?.split(",")[3]?.trim() || "",
    country:     customer.country || "South Africa"
  };

  // ── Build order items shape for email.js ───────────────────────────────────
  // Each item needs: design, productType, color, size, quantity
  const orderItems = items.map(item => ({
    design:      item.name.replace(/(T-Shirt|Long Sleeve T-Shirt|Hoodie|Sweatshirt)/gi, "").trim(),
    productType: item.type || "t_shirt",
    color:       item.color,
    size:        item.size,
    quantity:    item.quantity
  }));

  // ── Generate the email body text ───────────────────────────────────────────
  const emailBody = generatePrinterEmailBody(customerData, orderItems);

  // ── Send to Wix webhook ────────────────────────────────────────────────────
  // Wix receives this payload and maps the fields into your email template.
  // In your Wix automation email body, use the variable: {{emailBody}}
  const payload = {
    orderId,
    emailBody,
    subject: `New Print Order ${orderId} — Lunara's Universe`,
    customer: customerData,
    items: orderItems
  };

  try {
    const wixRes = await fetch(webhookUrl, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload)
    });

    if (!wixRes.ok) {
      const text = await wixRes.text();
      console.error("Wix webhook error:", wixRes.status, text);
      return res.status(502).json({ error: "Wix webhook failed", detail: text });
    }

    return res.status(200).json({ success: true, orderId });

  } catch (err) {
    console.error("OTC order error:", err);
    return res.status(500).json({ error: "Failed to reach Wix webhook" });
  }
}
