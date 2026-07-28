// api/mark-otc-paid.js
// Toggles whether OTC has been manually paid for a given order — used by the
// "Pending OTC Payouts" tracker in the admin dashboard.
//
// REQUIRES a new column on your Supabase "orders" table:
//   otc_paid   boolean   default: false

import { supabase } from "../lib/supabase.js";

export default async function handler(req, res) {
  const providedKey = req.headers["x-admin-key"];
  if (!providedKey || providedKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

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
