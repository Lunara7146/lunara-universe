// api/track.js
export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Order ID is required" });
  }

  try {
    // Replace this mock object with your database fetch logic (e.g., Supabase / MySQL)
    const orderData = {
      orderId: id,
      status: "paid", // Expected values: "pending" (Step 1), "paid" (Step 2), "shipped" (Step 3)
      shipments: [
        {
          provider: "Courier Guy",
          status: "Package in transit",
          tracking: "https://www.thecourierguy.co.za/" // Set to null or string URL
        }
      ]
    };

    return res.status(200).json(orderData);
  } catch (error) {
    console.error("Tracking lookup error:", error);
    return res.status(500).json({ error: "Failed to fetch order tracking." });
  }
}