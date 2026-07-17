// /lib/merchize.js
//
// ⚠️ IMPORTANT — VERIFY BEFORE ENABLING ⚠️
// This is modeled on your printful.js pattern and on Merchize's publicly
// documented order structure, but the exact field names (variant ID key,
// endpoint path, recipient field names) are NOT verified against your
// account. Check your Merchize dashboard's API reference (same place you
// got your access token) and adjust the marked lines below before you
// flip MERCHIZE_ENABLED to true in production.

export async function sendToMerchize(order) {
  const MERCHIZE_API_TOKEN = process.env.MERCHIZE_API_TOKEN;

  // Transform the local order schema to match Merchize's expected order payload
  const merchizeOrder = {
    external_id: order.order_id || order.id,
    recipient: {
      name: `${order.shipping?.firstName || ""} ${order.shipping?.lastName || ""}`.trim() || "Customer",
      address1: order.shipping?.address1,
      city: order.shipping?.city,
      zip: order.shipping?.zip,
      country_code: order.shipping?.country || "ZA",
      phone: order.shipping?.phone,
      email: order.email
    },
    // 🔎 VERIFY: field name for variant/SKU and the array key ("line_items" vs "items")
    line_items: order.items.map((item) => ({
      variant_id: item.merchize?.variantId || String(item.variant_id || item.id),
      quantity: Number(item.quantity || 1),
      name: item.name
    }))
  };

  // 🔎 VERIFY: endpoint path — this is a placeholder based on common PoD API shape
  const response = await fetch("https://api.merchize.com/v1/orders", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${MERCHIZE_API_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(merchizeOrder)
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("❌ Merchize API error details:", data);
    throw new Error("Merchize order submission failed");
  }

  return data;
}
