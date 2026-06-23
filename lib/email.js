// lib/email.js

/**
 * Normalizes design name text to align with project standards
 */
function cleanDesignKey(designName) {
  const d = designName.trim().toLowerCase();
  if (d.includes("butterfly")) return "butterfly";
  if (d.includes("compass")) return "compass";
  if (d.includes("cosmic")) return "cosmic_eye";
  if (d.includes("drip")) return "drip_smile";
  if (d.includes("energy")) return "energy_bloom";
  if (d.includes("jellyfish")) return "jellyfish";
  if (d.includes("mushroom")) return "mushroom";
  return d;
}

/**
 * Comprehensive Hardcoded Asset Mapping Matrix
 * Directly contains every filename present in Screenshots: 052706, 052730, 052739, and 052750
 */
const ASSET_MANIFEST_MATRIX = {
  hoodie: {
    black: {
      butterfly: "Butterfly Black Hoodie Back.png",
      compass: "Compass Hoodie Back (1).png",
      cosmic_eye: "Cosmic Eye Hoodie Back (1).png",
      drip_smile: "Drip Smile Hoodie Back (1).png",
      energy_bloom: "Energy Bloom Black Hoodie Back (1).png",
      jellyfish: "Jellyfish Black Hoodie Back.png",
      mushroom: "Mushroom Hoodie Back (1).png",
      brand_front: "Lunara All Black Hoodies & Sweatshirts Front.png",
      brand_sleeve: "Universe All Black Hoodies & Sweatshirts Left Sleeve.png"
    },
    white: {
      butterfly: "Butterfly White Hoodie Back.png",
      compass: "Compass Hoodie Back (1).png",
      cosmic_eye: "Cosmic Eye Hoodie Back (1).png",
      drip_smile: "Drip Smile Hoodie Back (1).png",
      energy_bloom: "Energy Bloom White Hoodie Back.png",
      jellyfish: "Jellyfish White Hoodie Back.png",
      mushroom: "Mushroom Hoodie Back (1).png",
      brand_front: "Lunara All White Hoodies & Sweatshirts Front.png",
      brand_sleeve: "Universe All White Hoodies & Sweatshirts Left Sleeve.png"
    }
  },
  sweatshirt: {
    black: {
      butterfly: "Butterfly Black Sweatshirt Back.png",
      compass: "Compass Sweatshirt Back (1).png",
      cosmic_eye: "Cosmic Eye Sweatshirt Back (1).png",
      drip_smile: "Drip Smile Sweatshirt Back (1).png",
      energy_bloom: "Energy Bloom Black Sweatshirt Back (1).png",
      jellyfish: "Jellyfish Black Sweatshirt Back.png",
      mushroom: "Mushroom Sweatshirt Back.png",
      brand_front: "Lunara All Black Hoodies & Sweatshirts Front.png",
      brand_sleeve: "Universe All Black Hoodies & Sweatshirts Left Sleeve.png"
    },
    white: {
      butterfly: "Butterfly White Sweatshirt Back.png",
      compass: "Compass Sweatshirt Back (1).png",
      cosmic_eye: "Cosmic Eye Sweatshirt Back (1).png",
      drip_smile: "Drip Smile Sweatshirt Back (1).png",
      energy_bloom: "Energy Bloom White Sweatshirt Back.png",
      jellyfish: "Jellyfish White Sweatshirt Back.png",
      mushroom: "Mushroom Sweatshirt Back.png",
      brand_front: "Lunara All White Hoodies & Sweatshirts Front.png",
      brand_sleeve: "Universe All White Hoodies & Sweatshirts Left Sleeve.png"
    }
  },
  long_sleeve: {
    black: {
      butterfly: "Butterfly Black long sleeve t-shirt front.png",
      compass: "Compass Long Sleeve T-shirt front (1).png",
      cosmic_eye: "Cosmic eye long sleeve t-shirt front (1).png",
      drip_smile: "Drip Smile Long Sleeve T-shirt front (1).png",
      energy_bloom: "Energy Bloom Black long sleeve t-shirt front (1).png",
      jellyfish: "Jellyfish Black long sleeve t-shirt front.png",
      mushroom: "Mushroom Long Sleeve T-shirt Front (1).png",
      brand_back: "Lunara All Black Long sleeve T-shirts Back.png",
      brand_sleeve: "Universe All Black Long sleeve T-shirts Right Sleeve.png"
    },
    white: {
      butterfly: "Butterfly White long sleeve t-shirt front.png",
      compass: "Compass Long Sleeve T-shirt front (1).png",
      cosmic_eye: "Cosmic eye long sleeve t-shirt front (1).png",
      drip_smile: "Drip Smile Long Sleeve T-shirt front (1).png",
      energy_bloom: "Energy Bloom White long sleeve t-shirt front.png",
      jellyfish: "Jellyfish White long sleeve t-shirt front.png",
      mushroom: "Mushroom Long Sleeve T-shirt Front (1).png",
      brand_back: "Lunara All White Long sleeve T-shirts Back.png",
      brand_sleeve: "Universe All White Long sleeve T-shirts Right Sleeve.png"
    }
  },
  t_shirt: {
    black: {
      butterfly: "Butterfly Black t-shirt front.png",
      compass: "Compass t-shirt front (1).png",
      cosmic_eye: "Cosmic eye t-shirt front (1).png",
      drip_smile: "Drip Smile T-shirt front (1).png",
      energy_bloom: "Energy Bloom Black T-shirt front (1).png",
      jellyfish: "Jellyfish Black t-shirt front.png",
      mushroom: "Mushroom T-shirt Front.png",
      brand_left_sleeve: "Universe All Black T-shirts Left Sleeve.png",
      brand_right_sleeve: "Lunara All Black T-shirts Right Sleeve.png"
    },
    white: {
      butterfly: "Butterfly White t-shirt front.png",
      compass: "Compass t-shirt front (1).png",
      cosmic_eye: "Cosmic eye t-shirt front (1).png",
      drip_smile: "Drip Smile T-shirt front (1).png",
      energy_bloom: "Energy Bloom White T-shirt front.png",
      jellyfish: "Jellyfish White t-shirt front.png",
      mushroom: "Mushroom T-shirt Front.png",
      brand_left_sleeve: "Universe All White T-shirts Left Sleeve.png",
      brand_right_sleeve: "Lunara All White T-shirts Left Sleeve.png" // Maps to white variant file structure
    }
  }
};

/**
 * Extracts explicit production assets based on order profiles
 */
export function getRequiredPrintAssets(design, productType, color) {
  const designKey = cleanDesignKey(design);
  const garmentColor = color.trim().toLowerCase() === "white" ? "white" : "black";
  const typeText = productType.toLowerCase();
  
  let categoryKey = "t_shirt";
  if (typeText.includes("hoodie")) categoryKey = "hoodie";
  else if (typeText.includes("sweatshirt")) categoryKey = "sweatshirt";
  else if (typeText.includes("long sleeve") || typeText.includes("longsleeve")) categoryKey = "long_sleeve";

  const targetCategory = ASSET_MANIFEST_MATRIX[categoryKey][garmentColor];
  let filesNeeded = [];

  // Add the specific artwork design print file
  if (targetCategory[designKey]) {
    filesNeeded.push(targetCategory[designKey]);
  }

  // Add corresponding brand asset layers exactly where they belong
  if (categoryKey === "hoodie" || categoryKey === "sweatshirt") {
    filesNeeded.push(targetCategory.brand_front);
    filesNeeded.push(targetCategory.brand_sleeve);
  } else if (categoryKey === "long_sleeve") {
    filesNeeded.push(targetCategory.brand_back);
    filesNeeded.push(targetCategory.brand_sleeve);
  } else {
    filesNeeded.push(targetCategory.brand_left_sleeve);
    filesNeeded.push(targetCategory.brand_right_sleeve);
  }

  return filesNeeded;
}

/**
 * Compiles the complete structured distribution mail body for OTC Printing production lines
 */
export function generatePrinterEmailTemplate(customerData, orderItems) {
  let itemsListText = "";

  orderItems.forEach((item, index) => {
    const assets = getRequiredPrintAssets(item.design, item.productType, item.color);
    const assetListFormatted = assets.map(file => `     - ${file}`).join("\n");
    const formattedSize = item.size.trim().toUpperCase();
    const garmentColorLabel = item.color.trim().toUpperCase();

    itemsListText += `
   [Item #${index + 1}]
   Product Type: ${item.productType.toUpperCase()}
   Design Selected: ${item.design}
   Garment Color: ${garmentColorLabel}
   Size: ${formattedSize} (Available Range: S to 3XL)
   Quantity Ordered: ${item.quantity}
   
   PRODUCTION ARTWORK PRINT LAYERS:
${assetListFormatted}
   -----------------------------------------`;
  });

  return `
Dear OTC Printing Team,

You have received a new production fulfillment order from Lunara's Universe.

CUSTOMER SHIPPING PROFILE DETAILS:
Name: ${customerData.name}
Phone: ${customerData.phone}
Shipping Destination Address:
${customerData.addressLine1}
${customerData.addressLine2 || ""}
${customerData.city}, ${customerData.postalCode}
${customerData.country}

ORDER CONFIGURATION SPECIFICATIONS:
${itemsListText}

Please review this manifest layout and respond with tracking updates as soon as the fulfillment package handles distribution.

Best regards,
Lunara's Universe
  `.trim();
      }
