// api/admin.js
// Combines what used to be two separate files (admin-orders.js + mark-otc-paid.js)
// into one, to stay under Vercel Hobby's 12-serverless-function limit.
//
// GET  /api/admin        → returns all orders (for the dashboard)
// POST /api/admin        → { orderId, paid } → marks an order's OTC payout as paid/unpaid
//
// Both require the x-admin-key header matching ADMIN_API_KEY.

import { supabase } from "../lib/supabase.js";

export default async function handler(req, res) {
  const providedKey = req.headers["x-admin-key"];
  if (!providedKey || providedKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method === "GET") {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return res.status(200).json(data || []);
    } catch (err) {
      console.error("Admin orders fetch error:", err);
      return res.status(500).json({ error: "Failed to fetch orders" });
    }
  }

  if (req.method === "POST") {
    try {
      const { orderId, paid } = req.body;
      if (!orderId) return res.status(400).json({ error: "Missing orderId" });

      const { error } = await supabase
        .from("orders")
        .update({ otc_paid: Boolean(paid) })
        .eq("order_id", orderId);
      if (error) throw error;

      return res.status(200).json({ success: true });
    } catch (err) {
      console.error("Mark OTC paid error:", err);
      return res.status(500).json({ error: "Failed to update" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
