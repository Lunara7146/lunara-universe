import crypto from "crypto";
import { Resend } from "resend";
import { supabase } from "../lib/supabase.js";
import { generatePrinterEmailTemplate } from "../lib/email.js";

const resend = new Resend(process.env.RESEND_API_KEY);
const processedOrders = new Set();

// ==========================
// 🔐 SIGNATURE
// ==========================
function encodeValue(value = "") {
  return encodeURIComponent(String(value).trim()).replace(/%20/g, "+");
}

function buildSignatureString(data, passphrase = "") {
  const keys = Object.keys(data)
    .filter((k) => k !== "signature" && data[k] !== "" && data[k] !== undefined)
    .sort();

  let str = keys.map((k) => `${k}=${encodeValue(data[k])}`).join("&");

  if (passphrase) {
    str += `&passphrase=${encodeValue(passphrase)}`;
  }

  return str;
}

function generateSignature(data, passphrase = "") {
  return crypto
    .createHash("md5")
    .update(buildSignatureString(data, passphrase))
    .digest("hex");
}

// ==========================
// 🚀 MAIN
// ==========================
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  try {
    const body = req.body || {};
    const passphrase = process.env.PAYFAST_PASSPHRASE || "";

    const receivedSig = (body.signature || "").toLowerCase();
    const expectedSig = generateSignature(body, passphrase).toLowerCase();

    if (!receivedSig || receivedSig !== expectedSig) {
      return res.status(400).send("Invalid signature");
    }

    if (body.payment_status !== "COMPLETE") {
      return res.status(200).send("Ignored");
    }

    const orderId = body.m_payment_id;

    if (processedOrders.has(orderId)) {
      return res.status(200).send("Already processed");
    }
    processedOrders.add(orderId);

    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("order_id", orderId)
      .single();

    if (orderError || !orderData) {
      console.error("❌ Order not found:", orderError);
      return res.status(404).send("Order not found");
    }

    const cart = orderData.cart || [];
    const customer = orderData.customer || {};

    const country =
      req.headers["x-vercel-ip-country"] ||
      customer.country ||
      "UNKNOWN";

    const isSA = country === "ZA";

    // 🇿🇦 1. OTC Printing local SA items (Hoodies, Sweatshirts, T-Shirts, Long sleeves)
    const otcItems = cart.filter(
      (item) =>
        isSA &&
        (item.type === "hoodie" || 
         item.type === "tshirt" || 
         item.type === "sweatshirt" || 
         item.type === "long sleeve")
    );

    // 🇿🇦 2. Printful local SA items (Sweatpants only)
    const printfulItems = cart.filter(
      (item) => isSA && item.type === "sweatpants"
    );

    // 🌍 3. Printify global items (Anything outside of SA, including global sweatpants)
    const printifyItems = cart.filter(
      (item) =>
        !(
          isSA &&
          (item.type === "hoodie" || 
           item.type === "tshirt" || 
           item.type === "sweatshirt" || 
           item.type === "long sleeve" ||
           item.type === "sweatpants")
        )
    );

    const results = [];

    // ==========================
    // 🖨️ OTC PRINTING FULFILLMENT (SA)
    // ==========================
    if (otcItems.length) {
      try {
        const formattedCustomer = {
          name: `${customer.firstName || ""} ${customer.lastName || ""}`.trim() || "Valued Customer",
          phone: customer.phone || "N/A",
          email: orderData.email || "N/A",
          addressLine1: customer.address1 || "",
          addressLine2: customer.address2 || "",
          city: customer.city || "",
          postalCode: customer.zip || "",
          country: customer.country || "ZA"
        };

        const formattedItems = otcItems.map((item) => ({
          productType: item.type || "t_shirt",
          design: item.name || item.design || "",
          color: item.color || "black",
          size: item.size || "M",
          quantity: Number(item.quantity || 1)
        }));

        const otcEmailBody = generatePrinterEmailTemplate(formattedCustomer, formattedItems);

        const emailResponse = await resend.emails.send({
          from: "Lunara's Universe Orders <lunarasuniverse@gmail.com>", 
          to: ["info@otcprinting.co.za"],       
          subject: `New Local Production Order Fulfillment - ${formattedCustomer.name}`,
          text: otcEmailBody
        });

        results.push({ provider: "OTC_PRINTING", status: "EMAIL_SENT", id: emailResponse.id });
      } catch (err) {
        console.error("❌ OTC Printing failed → falling back to Printify", err);
        printifyItems.push(...otcItems);
      }
    }

    // ==========================
    // 🛍️ PRINTFUL API FULFILLMENT (SA SWEATPANTS)
    // ==========================
    if (printfulItems.length) {
      try {
        const result = await sendToPrintful({
          ...orderData,
          cart: printfulItems
        });
        results.push({ provider: "PRINTFUL", result });
      } catch (err) {
        console.error("❌ Printful API production assignment failed → falling back to Printify", err);
        printifyItems.push(...printfulItems);
      }
    }

    // ==========================
    // 🌍 PRINTIFY FULFILLMENT (GLOBAL)
    // ==========================
    if (printifyItems.length) {
      try {
        const safeItems = printifyItems.filter(
          (item) => item.printify?.productId && item.printify?.variantId
        );

        if (safeItems.length) {
          const result = await sendToPrintify({
            ...orderData,
            cart: safeItems
          });

          results.push({ provider: "PRINTIFY", result });
        }
      } catch (err) {
        console.error("❌ Printify failed:", err);
      }
    }

    const providerUsed =
      results.length > 1
        ? "SPLIT"
        : results[0]?.provider || "FAILED";

    await supabase
      .from("orders")
      .update({
        status: "paid",
        payment_status: "complete",
        provider: providerUsed,
        split: results.length > 1,
        fulfillment_response: results
      })
      .eq("order_id", orderId);

    try {
      await resend.emails.send({
        from: "Lunara <onboarding@resend.dev>",
        to: orderData.email,
        subject: "🌙 Your Lunara Order is Confirmed",
        html: `
          <h2>Order Confirmed</h2>
          <p>Order ID: ${orderId}</p>
          <p>Fulfillment Status: Securely transmitted for design production processing.</p>
        `
      });
    } catch (e) {
      console.error("Buyer receipt email transmission error:", e);
    }

    return res.status(200).send("Order processed");
  } catch (err) {
    console.error("🔥 ERROR:", err);
    return res.status(500).send("Server error");
  }
}

// ==========================
// 🛍️ PRINTFUL API ENGINE
// ==========================
async function sendToPrintful(orderData) {
  const cart = orderData.cart || [];
  const customer = orderData.customer || {};

  const items = cart.map((item) => ({
    external_variant_id: item.printful?.variantId || String(item.variant_id),
    quantity: Number(item.quantity || 1),
    name: item.name
  }));

  const response = await fetch("https://api.printful.com/orders", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PRINTFUL_API_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      external_id: orderData.order_id,
      recipient: {
        name: `${customer.firstName || ""} ${customer.lastName || ""}`.trim(),
        address1: customer.address1,
        city: customer.city,
        zip: customer.zip,
        country_code: customer.country || "ZA",
        phone: customer.phone,
        email: orderData.email
      },
      items
    })
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("❌ Printful API error Details:", data);
    throw new Error("Printful API transmission failed");
  }

  return data;
}

// ==========================
// 🌍 PRINTIFY API ENGINE
// ==========================
async function sendToPrintify(orderData) {
  const cart = orderData.cart || [];
  const customer = orderData.customer || {};

  const line_items = cart.map((item) => ({
    product_id: item.printify.productId,
    variant_id: Number(item.printify.variantId),
    quantity: Number(item.quantity || 1)
  }));

  const response = await fetch(
    `https://api.printify.com/v1/shops/${process.env.PRINTIFY_SHOP_ID}/orders.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PRINTIFY_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        external_id: orderData.order_id,
        line_items,
        address_to: {
          first_name: customer.firstName,
          last_name: customer.lastName,
          email: orderData.email,
          phone: customer.phone,
          country: customer.country,
          region: customer.region,
          address1: customer.address1,
          city: customer.city,
          zip: customer.zip
        },
        shipping_method: 1,
        send_shipping_notification: true
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("❌ Printify error:", data);
    throw new Error("Printify failed");
  }

  return data;
  }
