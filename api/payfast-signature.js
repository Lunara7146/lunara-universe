// api/payfast-signature.js
import crypto from "crypto";

export function pfUrlEncode(str) {
  return encodeURIComponent(String(str).trim())
    .replace(/%20/g, "+")
    .replace(/!/g, "%21")
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/\*/g, "%2A")
    .replace(/~/g, "%7E");
}

export function payfastQueryString(data) {
  return Object.keys(data)
    .filter(key => key !== "signature" && data[key] !== "" && data[key] !== null && data[key] !== undefined)
    .map(key => `${key}=${pfUrlEncode(data[key])}`)
    .join("&");
}

export function payfastSignature(data, passphrase = "") {
  let queryString = payfastQueryString(data);

  const merchantId = String(data.merchant_id || "").trim();
  const cleanPass = String(passphrase || "").trim();

  // Sandbox default account 10000100 must never append a passphrase
  if (cleanPass && merchantId !== "10000100") {
    queryString += `&passphrase=${pfUrlEncode(cleanPass)}`;
  }

  console.log("🔑 Generated Hash String:", queryString);

  return crypto.createHash("md5").update(queryString).digest("hex");
}