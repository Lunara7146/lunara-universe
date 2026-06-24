// /lib/printful.js

export async function sendToPrintful(order) {
  const PRINTFUL_API_TOKEN = process.env.PRINTFUL_API_TOKEN;

  // Transform the local order schema to match Printful's required recipient and item payload
  const printfulOrder = {
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
    items: order.items.map((item) => ({
      external_variant_id: item.printful?.variantId || String(item.variant_id || item.id),
      quantity: Number(item.quantity || 1),
      name: item.name
    }))
  };

  const response = await fetch("https://api.printful.com/orders", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PRINTFUL_API_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(printfulOrder)
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("❌ Printful API error details:", data);
    throw new Error("Printful order submission failed");
  }

  return data;
}
