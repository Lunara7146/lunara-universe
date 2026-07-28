// api/admin-orders.js
// Returns ALL orders for the private admin dashboard, grouped/sorted client-side.
// Protected by ADMIN_API_KEY — separate from the dashboard's visible login password,
// so knowing one doesn't automatically give access to the other.
//
// ENV VAR NEEDED: ADMIN_API_KEY = any long random string you choose

import { supabase } from "../lib/supabase.js";

export default async function handler(req, res) {
  const providedKey = req.headers["x-admin-key"];
  if (!providedKey || providedKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

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
