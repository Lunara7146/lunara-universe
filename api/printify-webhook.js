// api/printify-webhook.js
//
// Fixes products getting permanently stuck in "Publishing..." status.
//
// Printify requires custom (non-Shopify/Etsy) integrations to explicitly confirm
// "publishing succeeded" after every publish attempt — otherwise the product stays
// locked forever, even if you clicked Publish manually in their dashboard.
//
// This file does two jobs depending on how it's called:
//
// GET  /api/printify-webhook  → ONE-TIME SETUP. Visit this URL once in your browser
//                                 to register it with Printify as the webhook endpoint.
// POST /api/printify-webhook  → Printify calls this automatically every time someone
//                                 clicks Publish. We immediately confirm it succeeded.

export default async function handler(req, res) {
  const PRINTIFY_TOKEN = process.env.PRINTIFY_API_TOKEN;
  const SHOP_ID = process.env.PRINTIFY_SHOP_ID;
  const baseUrl = process.env.BASE_URL;

  if (!PRINTIFY_TOKEN || !SHOP_ID || !baseUrl) {
    return res.status(500).json({ error: "Missing PRINTIFY_API_TOKEN, PRINTIFY_SHOP_ID, or BASE_URL" });
  }

  // ── ONE-TIME SETUP: visit this URL once in your browser to register the webhook ──
  if (req.method === "GET") {
    try {
      const response = await fetch(`https://api.printify.com/v1/shops/${SHOP_ID}/webhooks.json`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${PRINTIFY_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          topic: "product:publish:started",
          url: `${baseUrl}/api/printify-webhook`
        })
      });
      const data = await response.json();
      if (!response.ok) {
        return res.status(400).json({ step: "registration", error: data });
      }
      return res.status(200).json({ success: true, message: "Webhook registered! Go re-click Publish on your stuck products now.", data });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ── REAL EVENT: Printify tells us a publish just started, we confirm it succeeded ──
  if (req.method === "POST") {
    try {
      const event = req.body;
      console.log("📦 Printify webhook event:", event?.type);

      if (event?.type === "product:publish:started") {
        const productId = event?.resource?.id;
        if (productId) {
          const confirmRes = await fetch(
            `https://api.printify.com/v1/shops/${SHOP_ID}/products/${productId}/publishing_succeeded.json`,
            {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${PRINTIFY_TOKEN}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                external: { id: productId, handle: `${baseUrl}/product/${productId}` }
              })
            }
          );
          if (confirmRes.ok) {
            console.log(`✅ Confirmed publish succeeded for product ${productId}`);
          } else {
            console.error(`❌ Failed to confirm publish for ${productId}:`, await confirmRes.text());
          }
        }
      }
      return res.status(200).json({ received: true });
    } catch (err) {
      console.error("❌ Webhook handling error:", err);
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
