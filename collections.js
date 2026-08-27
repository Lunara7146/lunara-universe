// ============================================================
//  LUNARA'S UNIVERSE — COLLECTIONS CONFIG
//
//  ✦ This is the ONLY file you need to edit to:
//      • Change prices
//      • Add or remove products
//      • Launch a new collection
//
//  ✦ NEVER edit script.js for product or pricing changes.
//  ✦ script.js is the engine — this file is the content.
// ============================================================


// ============================================================
//  HOW TO ADD A NEW COLLECTION (e.g. Festival Collection)
// ============================================================
//
//  1. Scroll to the bottom of this file
//  2. Copy the FESTIVAL_COLLECTION template block
//  3. Uncomment it and fill in:
//       - collectionName & sectionId
//       - zarPrices (your ZAR prices per garment type)
//       - imageFolders (image paths in your repo)
//       - noBackIds (products with front design only)
//       - products (one entry per product card)
//  4. Add it to LUNARA_COLLECTIONS array at the bottom
//  5. Upload only this file — website updates automatically
//
// ============================================================


// ============================================================
//  NOVA COLLECTION — Live / Active
// ============================================================
const NOVA_COLLECTION = {

  collectionName: "Nova",
  sectionId: "nova",

  // ── ZAR prices for South African customers ───────────────
  // For hoodies/sweatshirts/tshirts/longsleeves:
  //   zarPrices.type.color.size = price
  // For sweatpants:
  //   zarPrices.sweatpants.size = price  (anchor = price × 1.20, auto-calculated)
  // R100 OTC shipping is baked directly into these prices (added 2026) — the
  // customer pays it explicitly on every item. Only ONE R100 actually gets
  // paid out to OTC per order (see fulfillment.js OTC_SHIPPING) — any extra
  // R100s from additional items in the same order become pure profit.
  zarPrices: {
    hoodie: {
      black:        { "S": 1049.99, "M": 1049.99, "L": 1049.99, "XL": 1049.99, "2XL": 1049.99, "3XL": 1049.99, "4XL": 1049.99, "5XL": 1049.99 },
      white:        { "S": 959.99, "M": 959.99, "L": 959.99, "XL": 959.99, "2XL": 959.99, "3XL": 959.99, "4XL": 959.99, "5XL": 959.99 },
      "stone-blue": { "S": 859.99, "M": 859.99, "L": 859.99, "XL": 859.99, "2XL": 859.99, "3XL": 859.99, "4XL": 859.99, "5XL": 859.99 }
    },
    sweatshirt: {
      black: { "S": 979.99, "M": 979.99, "L": 979.99, "XL": 979.99, "2XL": 979.99, "3XL": 979.99, "4XL": 979.99, "5XL": 979.99 },
      white: { "S": 849.99, "M": 849.99, "L": 849.99, "XL": 849.99, "2XL": 849.99, "3XL": 849.99, "4XL": 849.99, "5XL": 849.99 }
    },
    tshirt: {
      black: { "S": 649.99, "M": 649.99, "L": 649.99, "XL": 649.99, "2XL": 649.99, "3XL": 649.99, "4XL": 649.99 },
      white: { "S": 569.99, "M": 569.99, "L": 569.99, "XL": 569.99, "2XL": 569.99, "3XL": 569.99, "4XL": 569.99 }
    },
    longsleeve: {
      black: { "S": 689.99, "M": 689.99, "L": 689.99, "XL": 689.99, "2XL": 689.99, "3XL": 689.99, "4XL": 689.99 },
      white: { "S": 579.99, "M": 579.99, "L": 579.99, "XL": 579.99, "2XL": 579.99, "3XL": 579.99, "4XL": 579.99 }
    },
    // ZAR prices below = Printful USD retail price × ~16.50 exchange rate,
    // rounded up to the nearest R5, plus 50c. Re-check the USD/ZAR rate
    // periodically since it fluctuates — these aren't locked in forever.
    sweatpants: {
      "2XS": 1085.50, "XS": 1085.50, "S": 1085.50, "M": 1085.50, "L": 1085.50, "XL": 1085.50,
      "2XL": 1085.50, "3XL": 1085.50, "4XL": 1150.50, "5XL": 1150.50, "6XL": 1230.50
    }
  },

  // ── Image folders (relative to /images/) ─────────────────
  // Format: "product-id": "folder/subfolder"
  // Files inside each folder: front-black.png, front-white.png, back-black.png etc.
  imageFolders: {
    // Hoodies
    "nova-cosmic-eye-hoodie":         "nova-collection/cosmic-eye-hoodie",
    "nova-energy-bloom-hoodie":       "nova-collection/energy-bloom-hoodie",
    "nova-compass-hoodie":            "nova-collection/compass-hoodie",
    "nova-butterfly-hoodie":          "nova-collection/butterfly-hoodie",
    "nova-mushroom-hoodie":           "nova-collection/mushroom-hoodie",
    "nova-jellyfish-hoodie":          "nova-collection/jellyfish-hoodie",
    "nova-drip-smile-hoodie":         "nova-collection/drip-smile-hoodie",
    "nova-plain-hoodie":              "nova-collection/plain-hoodie",
    // Sweatshirts
    "lunara-jellyfish-sweatshirt":    "sweatshirts/jellyfish-sweatshirt",
    "lunara-mushroom-sweatshirt":     "sweatshirts/mushroom-sweatshirt",
    "lunara-compass-sweatshirt":      "sweatshirts/compass-sweatshirt",
    "lunara-butterfly-sweatshirt":    "sweatshirts/butterfly-sweatshirt",
    "lunara-cosmic-eye-sweatshirt":   "sweatshirts/cosmic-eye-sweatshirt",
    "lunara-energy-bloom-sweatshirt": "sweatshirts/energy-bloom-sweatshirt",
    "lunara-drip-smile-sweatshirt":   "sweatshirts/drip-smile-sweatshirt",
    "lunara-plain-sweatshirt":        "sweatshirts/plain-sweatshirt",
    // T-Shirts
    "lunara-drip-smile-tshirt":       "shirts/drip-smile-tee",
    "lunara-energy-bloom-tshirt":     "shirts/energy-bloom-tee",
    "lunara-cosmic-eye-tshirt":       "shirts/cosmic-eye-tee",
    "lunara-butterfly-tshirt":        "shirts/butterfly-tee",
    "lunara-compass-tshirt":          "shirts/compass-tee",
    "lunara-jellyfish-tshirt":        "shirts/jellyfish-tee",
    "lunara-mushrooms-tshirt":        "shirts/mushroom-tee",
    // Long Sleeves
    "lunara-butterfly-longsleeve":    "long-sleeve-shirts/butterfly-long-sleeve-shirts",
    "lunara-compass-longsleeve":      "long-sleeve-shirts/Compass-long-sleeve-shirts",
    "lunara-cosmic-eye-longsleeve":   "long-sleeve-shirts/Cosmic-eye-long-sleeve-shirts",
    "lunara-drip-smile-longsleeve":   "long-sleeve-shirts/drip-smile-long-sleeve-shirts",
    "lunara-energy-bloom-longsleeve": "long-sleeve-shirts/energy-bloom-long-sleeve-shirts",
    "lunara-jellyfish-longsleeve":    "long-sleeve-shirts/jellyfish-long-sleeve-shirts",
    "lunara-mushroom-longsleeve":     "long-sleeve-shirts/mushroom-long-sleeve-shirts",
    // Sweatpants
    "lunara-energy-bloom-sweatpants": "sweatpants/energy-bloom-sweatpants",
    "lunara-plain-sweatpants":        "sweatpants/plain-sweatpants",
    "lunara-drip-smile-sweatpants":   "sweatpants/drip-smile-sweatpants",
    "lunara-mushroom-sweatpants":     "sweatpants/mushroom-sweatpants",
    "lunara-compass-sweatpants":      "sweatpants/compass-sweatpants",
    "lunara-butterfly-sweatpants":    "sweatpants/butterfly-sweatpants",
    "lunara-jellyfish-sweatpants":    "sweatpants/jellyfish-sweatpants",
    "lunara-cosmic-eye-sweatpants":   "sweatpants/cosmic-eye-sweatpants"
  },

  // ── Products with front design only (no swipe/back image) ─
  noBackIds: ["nova-plain-hoodie"],

  // ── All Nova products ─────────────────────────────────────
  products: [
  // --- NOVA HOODIES COLLECTION ---
  {
    id: "nova-cosmic-eye-hoodie",
    name: "Cosmic Eye Hoodie",
    collection: "Nova",
    type: "hoodie",
    printify: true,
    prodigi: false,
    yoycol: false,
    pricing: {
      "S": 75.50, "M": 75.50, "L": 75.50, "XL": 75.50, "2XL": 75.50,
      "3XL": 86.50, "4XL": 86.50, "5XL": 86.50
    },
    variants: {
      "S-white": { sku: "21940095079773517440" },
      "S-black": { sku: "28803941621666358721" },
      "S-stone-blue": { sku: "19736270507704943748" },
      "M-white": { sku: "10625427457407301291" },
      "M-black": { sku: "33528614728772770623" },
      "M-stone-blue": { sku: "94211804136171568014" },
      "L-white": { sku: "54635103370103615431" },
      "L-black": { sku: "15844072470042516443" },
      "L-stone-blue": { sku: "20641646109967364713" },
      "XL-white": { sku: "13112300077643582417" },
      "XL-black": { sku: "15289988555814629503" },
      "XL-stone-blue": { sku: "14656341802324864429" },
      "2XL-white": { sku: "22617047205410047286" },
      "2XL-black": { sku: "32557585117421110006" },
      "2XL-stone-blue": { sku: "86775748367603084210" },
      "3XL-white": { sku: "97496097380466972757" },
      "3XL-black": { sku: "21032419713830309414" },
      "3XL-stone-blue": { sku: "33185826819319170748" },
      "4XL-white": { sku: "12016002484492520444" },
      "4XL-black": { sku: "90087760466327573391" },
      "4XL-stone-blue": { sku: "31605743796885651984" },
      "5XL-white": { sku: "93950320151732628239" },
      "5XL-black": { sku: "22184238832479170158" }
    }
  },
  {
    id: "nova-energy-bloom-hoodie",
    name: "Energy Bloom Hoodie",
    collection: "Nova",
    type: "hoodie",
    printify: true,
    prodigi: false,
    yoycol: false,
    pricing: {
      "S": 75.50, "M": 75.50, "L": 75.50, "XL": 75.50, "2XL": 75.50,
      "3XL": 86.50, "4XL": 86.50, "5XL": 86.50
    },
    variants: {
      "S-white": { sku: "28571040350495723673" },
      "S-black": { sku: "22589713717102939361" },
      "S-stone-blue": { sku: "25001693369458924054" },
      "M-white": { sku: "20299639771147542011" },
      "M-black": { sku: "11625579437949960048" },
      "M-stone-blue": { sku: "9587404241404751468" },
      "L-white": { sku: "16250726620441545058" },
      "L-black": { sku: "2190234839039939449" },
      "L-stone-blue": { sku: "26970271054667710191" },
      "XL-white": { sku: "16023402175315064169" },
      "XL-black": { sku: "108209450736889831" },
      "XL-stone-blue": { sku: "19024281274697083093" },
      "2XL-white": { sku: "18477898743344987811" },
      "2XL-black": { sku: "31398133810071328241" },
      "2XL-stone-blue": { sku: "12246692948707277757" },
      "3XL-white": { sku: "32989593834064465658" },
      "3XL-black": { sku: "3232586622676925159" },
      "3XL-stone-blue": { sku: "50477147475813932180" },
      "4XL-white": { sku: "18897610169145745377" },
      "4XL-black": { sku: "21196575293073278118" },
      "4XL-stone-blue": { sku: "99582358666431715480" },
      "5XL-white": { sku: "16413980038708937864" },
      "5XL-black": { sku: "34083957491035714731" }
    }
  },
  {
    id: "nova-compass-hoodie",
    name: "Compass Hoodie",
    collection: "Nova",
    type: "hoodie",
    printify: true,
    prodigi: false,
    yoycol: false,
    pricing: {
      "S": 75.50, "M": 75.50, "L": 75.50, "XL": 75.50, "2XL": 75.50,
      "3XL": 86.50, "4XL": 86.50, "5XL": 86.50
    },
    variants: {
      "S-white": { sku: "30118873665581099432" },
      "S-black": { sku: "13202569850585592710" },
      "S-stone-blue": { sku: "88501407821996358496" },
      "M-white": { sku: "10020581723053813850" },
      "M-black": { sku: "28197297677768397182" },
      "M-stone-blue": { sku: "21345641160602899691" },
      "L-white": { sku: "12208278821009785979" },
      "L-black": { sku: "10200985132445903672" },
      "L-stone-blue": { sku: "23968484465007060478" },
      "XL-white": { sku: "15754344795120681254" },
      "XL-black": { sku: "17343392179417220990" },
      "XL-stone-blue": { sku: "32691312004557390111" },
      "2XL-white": { sku: "22085189480663275161" },
      "2XL-black": { sku: "21673830883355377062" },
      "2XL-stone-blue": { sku: "45106110048353477717" },
      "3XL-white": { sku: "14156048002851576233" },
      "3XL-black": { sku: "93385963359552571756" },
      "3XL-stone-blue": { sku: "11866584281715221413" },
      "4XL-white": { sku: "22017532621201382649" },
      "4XL-black": { sku: "21179880782372270028" },
      "4XL-stone-blue": { sku: "31202973689209750482" },
      "5XL-white": { sku: "15121351869130854737" },
      "5XL-black": { sku: "71677625140968693500" }
    }
  },
  {
    id: "nova-butterfly-hoodie",
    name: "Butterfly Hoodie",
    collection: "Nova",
    type: "hoodie",
    printify: true,
    prodigi: false,
    yoycol: false,
    pricing: {
      "S": 75.50, "M": 75.50, "L": 75.50, "XL": 75.50, "2XL": 75.50,
      "3XL": 86.50, "4XL": 86.50, "5XL": 86.50
    },
    variants: {
      "S-white": { sku: "17793786073888751435" },
      "S-black": { sku: "9278143739889412791" },
      "S-stone-blue": { sku: "96681919261915089895" },
      "M-white": { sku: "29561881868890064719" },
      "M-black": { sku: "25611302128351222568" },
      "M-stone-blue": { sku: "82638869167113682650" },
      "L-white": { sku: "29275805969539569660" },
      "L-black": { sku: "22903516249321071383" },
      "L-stone-blue": { sku: "28171025621565305157" },
      "XL-white": { sku: "15750574493074950193" },
      "XL-black": { sku: "13564486866368057210" },
      "XL-stone-blue": { sku: "30048606112147266626" },
      "2XL-white": { sku: "1306873798497529866" },
      "2XL-black": { sku: "644859158282209724" },
      "2XL-stone-blue": { sku: "79135527124740302" },
      "3XL-white": { sku: "29876775698525853010" },
      "3XL-black": { sku: "29686145209009650225" },
      "3XL-stone-blue": { sku: "14857434863719888169" },
      "4XL-white": { sku: "29668270031316515666" },
      "4XL-black": { sku: "31517108688322348361" },
      "4XL-stone-blue": { sku: "74518374022417951261" },
      "5XL-white": { sku: "91599787838452249478" },
      "5XL-black": { sku: "32864945200411326612" }
    }
  },
  {
    id: "nova-mushroom-hoodie",
    name: "Mushroom Hoodie",
    collection: "Nova",
    type: "hoodie",
    printify: true,
    prodigi: false,
    yoycol: false,
    pricing: {
      "S": 75.50, "M": 75.50, "L": 75.50, "XL": 75.50, "2XL": 75.50,
      "3XL": 86.50, "4XL": 86.50, "5XL": 86.50
    },
    variants: {
      "S-white": { sku: "12105606950059646796" },
      "S-black": { sku: "33911513340861673990" },
      "S-stone-blue": { sku: "82311738676198627512" },
      "M-white": { sku: "19560531761500728284" },
      "M-black": { sku: "31426708317109697344" },
      "M-stone-blue": { sku: "87861511622921669945" },
      "L-white": { sku: "2415130413401771241" },
      "L-black": { sku: "5479828556161797808" },
      "L-stone-blue": { sku: "10969550428149863543" },
      "XL-white": { sku: "1978198584090259131" },
      "XL-black": { sku: "559120406128879300" },
      "XL-stone-blue": { sku: "7012022524113605521" },
      "2XL-white": { sku: "26011674476283634468" },
      "2XL-black": { sku: "15162599183384836550" },
      "2XL-stone-blue": { sku: "19114557715170368913" },
      "3XL-white": { sku: "29758096233592078487" },
      "3XL-black": { sku: "35061469627668596557" },
      "3XL-stone-blue": { sku: "27543791272567503402" },
      "4XL-white": { sku: "20605704657480297877" },
      "4XL-black": { sku: "98357034270864322039" },
      "4XL-stone-blue": { sku: "31052174242526635951" },
      "5XL-white": { sku: "19859471010887995520" },
      "5XL-black": { sku: "18344169412427180479" }
    }
  },
  {
    id: "nova-jellyfish-hoodie",
    name: "Jellyfish Hoodie",
    collection: "Nova",
    type: "hoodie",
    printify: true,
    prodigi: false,
    yoycol: false,
    pricing: {
      "S": 75.50, "M": 75.50, "L": 75.50, "XL": 75.50, "2XL": 75.50,
      "3XL": 86.50, "4XL": 86.50, "5XL": 86.50
    },
    variants: {
      "S-white": { sku: "25001590446010187334" },
      "S-black": { sku: "2572049038698484702" },
      "S-stone-blue": { sku: "27239037014124292096" },
      "M-white": { sku: "21165887557550255557" },
      "M-black": { sku: "23946028602518928764" },
      "M-stone-blue": { sku: "74252469197508970977" },
      "L-white": { sku: "18378426409596810389" },
      "L-black": { sku: "10473234629042863050" },
      "L-stone-blue": { sku: "33594357298370552662" },
      "XL-white": { sku: "33490260011882368451" },
      "XL-black": { sku: "18680636455750995772" },
      "XL-stone-blue": { sku: "31073727065195157603" },
      "2XL-white": { sku: "64357174990362306205" },
      "2XL-black": { sku: "1498267974664987866" },
      "2XL-stone-blue": { sku: "29502058970933873481" },
      "3XL-white": { sku: "18026657926024728400" },
      "3XL-black": { sku: "29266865661035633298" },
      "3XL-stone-blue": { sku: "27123705890525356406" },
      "4XL-white": { sku: "31544066470528648575" },
      "4XL-black": { sku: "23223002441666106853" },
      "4XL-stone-blue": { sku: "99169777460818505349" },
      "5XL-white": { sku: "31656820462180913341" },
      "5XL-black": { sku: "17269023240082400660" }
    }
  },
  {
    id: "nova-drip-smile-hoodie",
    name: "Drip Smile Hoodie",
    collection: "Nova",
    type: "hoodie",
    printify: true,
    prodigi: false,
    yoycol: false,
    pricing: {
      "S": 75.50, "M": 75.50, "L": 75.50, "XL": 75.50, "2XL": 75.50,
      "3XL": 86.50, "4XL": 86.50, "5XL": 86.50
    },
    variants: {
      "S-white": { sku: "21798205749017144152" },
      "S-black": { sku: "22753884683958843106" },
      "S-stone-blue": { sku: "65585258157995636877" },
      "M-white": { sku: "94463121101156273028" },
      "M-black": { sku: "31428772149822279497" },
      "M-stone-blue": { sku: "79276814035090120946" },
      "L-white": { sku: "18592196389054181398" },
      "L-black": { sku: "11724328137676602229" },
      "L-stone-blue": { sku: "57447029524400289475" },
      "XL-white": { sku: "78311569932472268981" },
      "XL-black": { sku: "34365567084095419509" },
      "XL-stone-blue": { sku: "23791115854591151513" },
      "2XL-white": { sku: "28260780355748881584" },
      "2XL-black": { sku: "17628581029784118780" },
      "2XL-stone-blue": { sku: "10732442090371416915" },
      "3XL-white": { sku: "20969321299797475950" },
      "3XL-black": { sku: "13198281786843362464" },
      "3XL-stone-blue": { sku: "32801368123834915122" },
      "4XL-white": { sku: "29812210420943532390" },
      "4XL-black": { sku: "12417104995227921510" },
      "4XL-stone-blue": { sku: "11391830227191814358" },
      "5XL-white": { sku: "31283430224315006045" },
      "5XL-black": { sku: "12812475098192162351" }
    }
  },
  {
    id: "nova-plain-hoodie",
    name: "Plain Hoodie",
    collection: "Nova",
    type: "hoodie",
    printify: true,
    prodigi: false,
    yoycol: false,
    pricing: {
      "S": 75.50, "M": 75.50, "L": 75.50, "XL": 75.50, "2XL": 75.50,
      "3XL": 86.50, "4XL": 86.50
    },
    variants: {
      "S-white": { sku: "14547336435723357435" },
      "S-black": { sku: "10628287876127334280" },
      "S-stone-blue": { sku: "19556250686828577043" },
      "M-white": { sku: "13664038334972040962" },
      "M-black": { sku: "63969360247676453127" },
      "M-stone-blue": { sku: "13298689482205952372" },
      "L-white": { sku: "21934110185807228596" },
      "L-black": { sku: "91460922337710552327" },
      "L-stone-blue": { sku: "49556416145226574810" },
      "XL-white": { sku: "54466171099667832006" },
      "XL-black": { sku: "28899637412836300185" },
      "XL-stone-blue": { sku: "85020612834013745069" },
      "2XL-white": { sku: "17492771839403241595" },
      "2XL-black": { sku: "30043925759683915947" },
      "2XL-stone-blue": { sku: "32999839384178054120" },
      "3XL-white": { sku: "33526484529323871830" },
      "3XL-black": { sku: "11587120201108060783" },
      "3XL-stone-blue": { sku: "25337942176338681308" },
      "4XL-white": { sku: "22284558952837555394" },
      "4XL-black": { sku: "13208350795344857621" },
      "4XL-stone-blue": { sku: "11664090176307062423" }
    }
  },
  // --- SWEATSHIRTS COLLECTION ---
  {
    id: "lunara-jellyfish-sweatshirt",
    name: "Lunara Jellyfish Sweatshirt",
    collection: "Lunara Universe",
    type: "sweatshirt",
    printify: true,
    prodigi: false,
    yoycol: false,
    pricing: {
      "S": 51.73, "M": 51.73, "L": 51.73, "XL": 51.73,
      "2XL": 56.28, "3XL": 58.72, "4XL": 63.17, "5XL": 63.62
    },
    variants: {
      "S-white": { sku: "18331652938496481169" },
      "S-black": { sku: "24631015165310317100" },
      "M-white": { sku: "13460258357394905211" },
      "M-black": { sku: "33324236992482900553" },
      "L-white": { sku: "23427790856125641861" },
      "L-black": { sku: "21657557713520318766" },
      "XL-white": { sku: "29046169501032127703" },
      "XL-black": { sku: "16012244718632757544" },
      "2XL-white": { sku: "15806208735413344528" },
      "2XL-black": { sku: "30304202691330203783" },
      "3XL-black": { sku: "76422968806654328650" },
      "3XL-white": { sku: "33473858487768400650" },
      "4XL-black": { sku: "12499244012520692396" },
      "4XL-white": { sku: "88133614565513988378" },
      "5XL-black": { sku: "86614819400947125219" },
      "5XL-white": { sku: "75543751436145232412" }
    }
  },
  {
    id: "lunara-mushroom-sweatshirt",
    name: "Lunara Mushroom Sweatshirt",
    collection: "Lunara Universe",
    type: "sweatshirt",
    printify: true,
    prodigi: false,
    yoycol: false,
    pricing: {
      "S": 51.73, "M": 51.73, "L": 51.73, "XL": 51.73,
      "2XL": 56.28, "3XL": 58.72, "4XL": 63.17, "5XL": 63.62
    },
    variants: {
      "S-white": { sku: "13674911365403138220" },
      "S-black": { sku: "73032160290020757851" },
      "M-white": { sku: "13298925301418461935" },
      "M-black": { sku: "58442742614011876354" },
      "L-white": { sku: "80152872017959639054" },
      "L-black": { sku: "26644200739954292690" },
      "XL-white": { sku: "20092949285693937527" },
      "XL-black": { sku: "21311157100559999777" },
      "2XL-white": { sku: "22751707291675983401" },
      "2XL-black": { sku: "43879862214327954237" },
      "3XL-black": { sku: "27599127514575672929" },
      "3XL-white": { sku: "19446101005744552783" },
      "4XL-black": { sku: "15963221405433188558" },
      "4XL-white": { sku: "32901253841780025680" },
      "5XL-black": { sku: "10750178932880962565" },
      "5XL-white": { sku: "21904513221265305904" }
    }
  },
  {
    id: "lunara-compass-sweatshirt",
    name: "Lunara Compass Sweatshirt",
    collection: "Lunara Universe",
    type: "sweatshirt",
    printify: true,
    prodigi: false,
    yoycol: false,
    pricing: {
      "S": 51.73, "M": 51.73, "L": 51.73, "XL": 51.73,
      "2XL": 56.28, "3XL": 58.72, "4XL": 63.17, "5XL": 63.62
    },
    variants: {
      "S-white": { sku: "96415669192076906012" },
      "S-black": { sku: "26041517872963122433" },
      "M-white": { sku: "31182465038949062694" },
      "M-black": { sku: "22343068625591034366" },
      "L-white": { sku: "27476560524769324017" },
      "L-black": { sku: "73425770746357623830" },
      "XL-white": { sku: "24301218744078327042" },
      "XL-black": { sku: "10382935906459838058" },
      "2XL-white": { sku: "25884878190291014742" },
      "2XL-black": { sku: "22008560295700193177" },
      "3XL-black": { sku: "23500946951145240514" },
      "3XL-white": { sku: "84812862975092210813" },
      "4XL-black": { sku: "16897250292303368270" },
      "4XL-white": { sku: "23143655994908822459" },
      "5XL-black": { sku: "17451567832417747818" },
      "5XL-white": { sku: "16322627370141341502" }
    }
  },
  {
    id: "lunara-butterfly-sweatshirt",
    name: "Lunara Butterfly Sweatshirt",
    collection: "Lunara Universe",
    type: "sweatshirt",
    printify: true,
    prodigi: false,
    yoycol: false,
    pricing: {
      "S": 51.73, "M": 51.73, "L": 51.73, "XL": 51.73,
      "2XL": 56.28, "3XL": 58.72, "4XL": 63.17, "5XL": 63.62
    },
    variants: {
      "S-white": { sku: "31399357233428262937" },
      "S-black": { sku: "27990956296143039157" },
      "M-white": { sku: "10374193030224711374" },
      "M-black": { sku: "45076012205370714861" },
      "L-white": { sku: "41249070267847852824" },
      "L-black": { sku: "16499418885500901359" },
      "XL-white": { sku: "21760673054981705249" },
      "XL-black": { sku: "27442951998836904422" },
      "2XL-white": { sku: "12218449220993814005" },
      "2XL-black": { sku: "15060495708123849027" },
      "3XL-black": { sku: "32292186486174501844" },
      "3XL-white": { sku: "18772248127909282798" },
      "4XL-black": { sku: "43376323761124375663" },
      "4XL-white": { sku: "13058839598535256174" },
      "5XL-black": { sku: "95013560173509217980" },
      "5XL-white": { sku: "65929825085594804582" }
    }
  },
  {
    id: "lunara-cosmic-eye-sweatshirt",
    name: "Lunara Cosmic Eye Sweatshirt",
    collection: "Lunara Universe",
    type: "sweatshirt",
    printify: true,
    prodigi: false,
    yoycol: false,
    pricing: {
      "S": 51.73, "M": 51.73, "L": 51.73, "XL": 51.73,
      "2XL": 56.28, "3XL": 58.72, "4XL": 63.17, "5XL": 63.62
    },
    variants: {
      "S-white": { sku: "15474145155561742392" },
      "S-black": { sku: "17389024618206620870" },
      "M-white": { sku: "14761209861828546480" },
      "M-black": { sku: "75047348029595802767" },
      "L-white": { sku: "66890207968512142912" },
      "L-black": { sku: "77277673283780457693" },
      "XL-white": { sku: "90008488800754301385" },
      "XL-black": { sku: "12381111603066114224" },
      "2XL-white": { sku: "32115637305453903437" },
      "2XL-black": { sku: "11259194904383930752" },
      "3XL-black": { sku: "61392030485788013696" },
      "3XL-white": { sku: "30307527919692977830" },
      "4XL-black": { sku: "95086350464230776424" },
      "4XL-white": { sku: "21706604915892270831" },
      "5XL-black": { sku: "29461106386873727696" },
      "5XL-white": { sku: "14952965388188435351" }
    }
  },
  {
    id: "lunara-energy-bloom-sweatshirt",
    name: "Lunara Energy Bloom Sweatshirt",
    collection: "Lunara Universe",
    type: "sweatshirt",
    printify: true,
    prodigi: false,
    yoycol: false,
    pricing: {
      "S": 51.73, "M": 51.73, "L": 51.73, "XL": 51.73,
      "2XL": 56.28, "3XL": 58.72, "4XL": 63.17, "5XL": 63.62
    },
    variants: {
      "S-white": { sku: "82680715048169659053" },
      "S-black": { sku: "37813780986731116562" },
      "M-white": { sku: "19443349304603337572" },
      "M-black": { sku: "24293494557733243944" },
      "L-white": { sku: "80555306484815182801" },
      "L-black": { sku: "13384751925153788645" },
      "XL-white": { sku: "68129367448226473403" },
      "XL-black": { sku: "36441012145912598371" },
      "2XL-white": { sku: "33643748138820142754" },
      "2XL-black": { sku: "12126492357582655798" },
      "3XL-black": { sku: "24206025000955082296" },
      "3XL-white": { sku: "28816081612677032232" },
      "4XL-black": { sku: "25038601112718042499" },
      "4XL-white": { sku: "24727570780437970086" },
      "5XL-black": { sku: "30162005270147218415" },
      "5XL-white": { sku: "12765612229554756941" }
    }
  },
  {
    id: "lunara-drip-smile-sweatshirt",
    name: "Lunara Drip Smile Sweatshirt",
    collection: "Lunara Universe",
    type: "sweatshirt",
    printify: true,
    prodigi: false,
    yoycol: false,
    pricing: {
      "S": 51.73, "M": 51.73, "L": 51.73, "XL": 51.73,
      "2XL": 56.28, "3XL": 58.72, "4XL": 63.17, "5XL": 63.62
    },
    variants: {
      "S-white": { sku: "18464253009236376221" },
      "S-black": { sku: "32567554154530724790" },
      "M-white": { sku: "62712067368205881124" },
      "M-black": { sku: "26359237586687951785" },
      "L-white": { sku: "17630792174957691367" },
      "L-black": { sku: "25058668526293491315" },
      "XL-white": { sku: "19186804922206578543" },
      "XL-black": { sku: "15902571110213551515" },
      "2XL-white": { sku: "25012703597802060412" },
      "2XL-black": { sku: "26639824230236389002" },
      "3XL-black": { sku: "32305427616771168025" },
      "3XL-white": { sku: "74026198037253760320" },
      "4XL-black": { sku: "10039752692465751035" },
      "4XL-white": { sku: "33757685467154447700" },
      "5XL-black": { sku: "25452902390525527691" },
      "5XL-white": { sku: "15589578905871838165" }
    }
  },
  {
    id: "lunara-plain-sweatshirt",
    name: "Plain Sweatshirt",
    collection: "Lunara Universe",
    type: "sweatshirt",
    printify: true,
    prodigi: false,
    yoycol: false,
    pricing: {
      "S": 41.22, "M": 41.22, "L": 41.22, "XL": 41.22,
      "2XL": 45.75, "3XL": 48.17, "4XL": 52.88, "5XL": 53.33
    },
    variants: {
      "S-white": { sku: "26626158553865409069" },
      "S-black": { sku: "17830768839256014851" },
      "M-white": { sku: "50731988003153405223" },
      "M-black": { sku: "20289892934577817549" },
      "L-white": { sku: "58176878437271502674" },
      "L-black": { sku: "55491167014163696305" },
      "XL-white": { sku: "16722388000313992145" },
      "XL-black": { sku: "11572738750860475940" },
      "2XL-white": { sku: "20939979495533971946" },
      "2XL-black": { sku: "21314120822172997739" },
      "3XL-black": { sku: "18745173641710462745" },
      "3XL-white": { sku: "31413485036163299147" },
      "4XL-black": { sku: "33465291605315691693" },
      "4XL-white": { sku: "11731318830413888117" },
      "5XL-black": { sku: "28061553840273171484" },
      "5XL-white": { sku: "24944924874241366348" }
    }
  },
  // --- T-SHIRTS COLLECTION ---
  {
    id: "lunara-drip-smile-tshirt",
    name: "Lunara Drip Smile T-Shirt",
    collection: "Lunara Universe",
    type: "tshirt",
    printify: true,
    images: {
      white: "images/tshirts/drip-smile-white.png",
      black: "images/tshirts/drip-smile-black.png"
    },
    pricing: {
      "S": 25.50, "M": 25.50, "L": 25.50, "XL": 25.50,
      "2XL": 29.50, "3XL": 29.50, "4XL": 29.50
    },
    variants: {
      "S-white": { sku: "29719655575795381164" },
      "S-black": { sku: "25852935848773931386" },
      "M-white": { sku: "52316754513977509224" },
      "M-black": { sku: "18551160184982214855" },
      "L-white": { sku: "86560628193098714134" },
      "L-black": { sku: "86092870195477402287" },
      "XL-white": { sku: "14183275960155709509" },
      "XL-black": { sku: "30677760208562500467" },
      "2XL-white": { sku: "18222579473880651195", oos: true },
      "2XL-black": { sku: "18373096900490092635" },
      "3XL-white": { sku: "32880920940057287934" },
      "3XL-black": { sku: "22659138806563501047" },
      "4XL-white": { sku: "27841362707442162052", oos: true },
      "4XL-black": { sku: "22471221235136520597", oos: true }
    }
  },
  {
    id: "lunara-energy-bloom-tshirt",
    name: "Lunara Energy Bloom T-Shirt",
    collection: "Lunara Universe",
    type: "tshirt",
    printify: true,
    images: {
      white: "images/tshirts/energy-bloom-white.png",
      black: "images/tshirts/energy-bloom-black.png"
    },
    pricing: {
      "S": 25.50, "M": 25.50, "L": 25.50, "XL": 25.50,
      "2XL": 29.50, "3XL": 29.50, "4XL": 29.50
    },
    variants: {
      "S-white": { sku: "22223449383717038040" },
      "S-black": { sku: "27633943506594050656" },
      "M-white": { sku: "37575590109205748835" },
      "M-black": { sku: "63628325875360377817" },
      "L-white": { sku: "29640023329738987131" },
      "L-black": { sku: "28009360648561687713" },
      "XL-white": { sku: "28966026650026357057" },
      "XL-black": { sku: "15875581130735196680" },
      "2XL-white": { sku: "23051845271475993962", oos: true },
      "2XL-black": { sku: "33634509928274666914" },
      "3XL-white": { sku: "13847113651209091373" },
      "3XL-black": { sku: "15728085147586074160" },
      "4XL-white": { sku: "62016702945998611435", oos: true },
      "4XL-black": { sku: "18771887954258957360", oos: true }
    }
  },
  {
    id: "lunara-cosmic-eye-tshirt",
    name: "Lunara Cosmic Eye T-Shirt",
    collection: "Lunara Universe",
    type: "tshirt",
    printify: true,
    images: {
      white: "images/tshirts/cosmic-eye-white.png",
      black: "images/tshirts/cosmic-eye-black.png"
    },
    pricing: {
      "S": 25.50, "M": 25.50, "L": 25.50, "XL": 25.50,
      "2XL": 29.50, "3XL": 29.50, "4XL": 29.50
    },
    variants: {
      "S-white": { sku: "11284324430853904842" },
      "S-black": { sku: "27413917998749914909" },
      "M-white": { sku: "24131503092797027748" },
      "M-black": { sku: "17269301998753838263" },
      "L-white": { sku: "17638696106675960806" },
      "L-black": { sku: "15308855126782646179" },
      "XL-white": { sku: "13335081889941419356" },
      "XL-black": { sku: "19451453455791265515" },
      "2XL-white": { sku: "93478367746518390787", oos: true },
      "2XL-black": { sku: "31325546101839162348" },
      "3XL-white": { sku: "25441391198930854243" },
      "3XL-black": { sku: "30046711220812155539" },
      "4XL-white": { sku: "62486245686343097055", oos: true },
      "4XL-black": { sku: "10026129967271403241", oos: true }
    }
  },
  {
    id: "lunara-butterfly-tshirt",
    name: "Lunara Butterfly T-Shirt",
    collection: "Lunara Universe",
    type: "tshirt",
    printify: true,
    images: {
      white: "images/tshirts/butterfly-white.png",
      black: "images/tshirts/butterfly-black.png"
    },
    pricing: {
      "S": 25.50, "M": 25.50, "L": 25.50, "XL": 25.50,
      "2XL": 29.50, "3XL": 29.50, "4XL": 29.50
    },
    variants: {
      "S-white": { sku: "51785286841295804704" },
      "S-black": { sku: "30452440845452490472" },
      "M-white": { sku: "21663356497004784705" },
      "M-black": { sku: "29121118777507983588" },
      "L-white": { sku: "60083091582755400067" },
      "L-black": { sku: "13291646211481900421" },
      "XL-white": { sku: "3037359768877132152" },
      "XL-black": { sku: "26802229116317769044" },
      "2XL-white": { sku: "15142785974651145122", oos: true },
      "2XL-black": { sku: "27584916188044441523" },
      "3XL-white": { sku: "18186098789812436813" },
      "3XL-black": { sku: "31081933570032050376" },
      "4XL-white": { sku: "20161655131828782921", oos: true },
      "4XL-black": { sku: "97080409409248952112", oos: true }
    }
  },
  {
    id: "lunara-compass-tshirt",
    name: "Lunara Compass T-Shirt",
    collection: "Lunara Universe",
    type: "tshirt",
    printify: true,
    images: {
      white: "images/tshirts/compass-white.png",
      black: "images/tshirts/compass-black.png"
    },
    pricing: {
      "S": 25.50, "M": 25.50, "L": 25.50, "XL": 25.50,
      "2XL": 29.50, "3XL": 29.50, "4XL": 29.50
    },
    variants: {
      "S-white": { sku: "19886627746431602842" },
      "S-black": { sku: "25841488476484347135" },
      "M-white": { sku: "17204881356211298822" },
      "M-black": { sku: "24308797661815653125" },
      "L-white": { sku: "29121569882056901223" },
      "L-black": { sku: "17296680339117261461" },
      "XL-white": { sku: "18900938941001840799" },
      "XL-black": { sku: "26121469273895813320" },
      "2XL-white": { sku: "85076127362541278797", oos: true },
      "2XL-black": { sku: "15009944495621124913" },
      "3XL-white": { sku: "15350411342797195051" },
      "3XL-black": { sku: "23515353610018828319" },
      "4XL-white": { sku: "58574159372241371123", oos: true },
      "4XL-black": { sku: "21693229190894127189", oos: true }
    }
  },
  {
    id: "lunara-jellyfish-tshirt",
    name: "Lunara Jellyfish T-Shirt",
    collection: "Lunara Universe",
    type: "tshirt",
    printify: true,
    images: {
      white: "images/tshirts/jellyfish-white.png",
      black: "images/tshirts/jellyfish-black.png"
    },
    pricing: {
      "S": 25.50, "M": 25.50, "L": 25.50, "XL": 25.50,
      "2XL": 29.50, "3XL": 29.50, "4XL": 29.50
    },
    variants: {
      "S-white": { sku: "26950914780223382864" },
      "S-black": { sku: "51069324269230523066" },
      "M-white": { sku: "17152554140523534160" },
      "M-black": { sku: "26940775204788446359" },
      "L-white": { sku: "23645533216668999281" },
      "L-black": { sku: "31669799038856770904" },
      "XL-white": { sku: "13286798142505985290" },
      "XL-black": { sku: "62558323017134266139" },
      "2XL-white": { sku: "27028038860593691715", oos: true },
      "2XL-black": { sku: "31282386501427941109" },
      "3XL-white": { sku: "32522912846651898494" },
      "3XL-black": { sku: "11242774795222426239" },
      "4XL-white": { sku: "52208983978534390407", oos: true },
      "4XL-black": { sku: "25480522136243318229", oos: true }
    }
  },
  {
    id: "lunara-mushrooms-tshirt",
    name: "Lunara Mushrooms T-Shirt",
    collection: "Lunara Universe",
    type: "tshirt",
    printify: true,
    images: {
      white: "images/tshirts/mushrooms-white.png",
      black: "images/tshirts/mushrooms-black.png"
    },
    pricing: {
      "S": 25.50, "M": 25.50, "L": 25.50, "XL": 25.50,
      "2XL": 29.50, "3XL": 29.50, "4XL": 29.50
    },
    variants: {
      "S-white": { sku: "80684890803304168302" },
      "S-black": { sku: "16155588907058954702" },
      "M-white": { sku: "32410087567639762677" },
      "M-black": { sku: "32335367432741972243" },
      "L-white": { sku: "22602710947262870742" },
      "L-black": { sku: "30573791106650814568" },
      "XL-white": { sku: "28298451143813804321" },
      "XL-black": { sku: "16693707665401910461" },
      "2XL-white": { sku: "20747926282845407838", oos: true },
      "2XL-black": { sku: "20742537930292100255" },
      "3XL-white": { sku: "50825802006898611707" },
      "3XL-black": { sku: "15928390249386417081" },
      "4XL-white": { sku: "25115173507227879370", oos: true },
      "4XL-black": { sku: "20629885225715410412", oos: true }
    }
  },

  // --- LONG SLEEVE T-SHIRTS ---
  // SA customers     → OTC Printing (ZAR prices from SA_PRICING)
  // International   → Printify (USD $49.50 XS-XL / $54.50 2XL)
  {
    id: "lunara-butterfly-longsleeve",
    name: "Butterfly Long Sleeve T-Shirt",
    collection: "Lunara Universe",
    type: "longsleeve",
    printify: true,
    printful: false,
    prodigi: false,
    yoycol: false,
    colors: ["black", "white"],
    pricing: {
      "XS": 49.50, "S": 49.50, "M": 49.50, "L": 49.50, "XL": 49.50,
      "2XL": 54.50
    },
    variants: {
      "XS-black": { sku: "14565843900138959191" },
      "XS-white": { sku: "26410651627673067066" },
      "S-black":  { sku: "81584176113948857909" },
      "S-white":  { sku: "28373863970426204104" },
      "M-black":  { sku: "23943270092017147025" },
      "M-white":  { sku: "25705907267131221912" },
      "L-black":  { sku: "30789742103485919528" },
      "L-white":  { sku: "18241130225016781334" },
      "XL-black": { sku: "28332567464158279382" },
      "XL-white": { sku: "23353409748973109936" },
      "2XL-white":{ sku: "20171440562231360501" }
    }
  },
  {
    id: "lunara-compass-longsleeve",
    name: "Compass Long Sleeve T-Shirt",
    collection: "Lunara Universe",
    type: "longsleeve",
    printify: true,
    printful: false,
    prodigi: false,
    yoycol: false,
    colors: ["black", "white"],
    pricing: {
      "XS": 49.50, "S": 49.50, "M": 49.50, "L": 49.50, "XL": 49.50,
      "2XL": 54.50
    },
    variants: {
      "XS-black": { sku: "3105257932000892338"  },
      "XS-white": { sku: "29630365646563435557" },
      "S-black":  { sku: "21771220169141056438" },
      "S-white":  { sku: "29552704848172701034" },
      "M-black":  { sku: "3616259852727930422"  },
      "M-white":  { sku: "30537207119108652785" },
      "L-black":  { sku: "4176325873650855379"  },
      "L-white":  { sku: "9026700705353617080"  },
      "XL-black": { sku: "22496162783723378570" },
      "XL-white": { sku: "33280130269550608307" },
      "2XL-white":{ sku: "29472541580089519725" }
    }
  },
  {
    id: "lunara-cosmic-eye-longsleeve",
    name: "Cosmic Eye Long Sleeve T-Shirt",
    collection: "Lunara Universe",
    type: "longsleeve",
    printify: true,
    printful: false,
    prodigi: false,
    yoycol: false,
    colors: ["black", "white"],
    pricing: {
      "XS": 49.50, "S": 49.50, "M": 49.50, "L": 49.50, "XL": 49.50,
      "2XL": 54.50
    },
    variants: {
      "XS-black": { sku: "30228667861757543765" },
      "XS-white": { sku: "18872622006121012211" },
      "S-black":  { sku: "83512501154251646386" },
      "S-white":  { sku: "69827785653944413146" },
      "M-black":  { sku: "17671565403802240752" },
      "M-white":  { sku: "29328753320400494765" },
      "L-black":  { sku: "17817609076552194185" },
      "L-white":  { sku: "24976451175691314073" },
      "XL-black": { sku: "28052688190586620924" },
      "XL-white": { sku: "13337411034531563767" },
      "2XL-white":{ sku: "13146993700717900529" }
    }
  },
  {
    id: "lunara-drip-smile-longsleeve",
    name: "Drip Smile Long Sleeve T-Shirt",
    collection: "Lunara Universe",
    type: "longsleeve",
    printify: true,
    printful: false,
    prodigi: false,
    yoycol: false,
    colors: ["black", "white"],
    pricing: {
      "XS": 49.50, "S": 49.50, "M": 49.50, "L": 49.50, "XL": 49.50,
      "2XL": 54.50
    },
    variants: {
      "XS-black": { sku: "24454639172267251019" },
      "XS-white": { sku: "18384445783577218746" },
      "S-black":  { sku: "76957830229637310489" },
      "S-white":  { sku: "17127858506466993683" },
      "M-black":  { sku: "19794592023943583304" },
      "M-white":  { sku: "16913701406987381047" },
      "L-black":  { sku: "26974053077775510651" },
      "L-white":  { sku: "23969963391439807417" },
      "XL-black": { sku: "23394728484858148193" },
      "XL-white": { sku: "89404772781522808169" },
      "2XL-white":{ sku: "87284252587320622231" }
    }
  },
  {
    id: "lunara-energy-bloom-longsleeve",
    name: "Energy Bloom Long Sleeve T-Shirt",
    collection: "Lunara Universe",
    type: "longsleeve",
    printify: true,
    printful: false,
    prodigi: false,
    yoycol: false,
    colors: ["black", "white"],
    pricing: {
      "XS": 49.50, "S": 49.50, "M": 49.50, "L": 49.50, "XL": 49.50,
      "2XL": 54.50
    },
    variants: {
      "XS-black": { sku: "10136865203835994259" },
      "XS-white": { sku: "32235786470473565744" },
      "S-black":  { sku: "24661074206292532397" },
      "S-white":  { sku: "17602058477926100650" },
      "M-black":  { sku: "32000678911132172320" },
      "M-white":  { sku: "27900690267882963108" },
      "L-black":  { sku: "24890105363156421577" },
      "L-white":  { sku: "28694654922580425688" },
      "XL-black": { sku: "14182076356075359136" },
      "XL-white": { sku: "99422204397989511959" },
      "2XL-white":{ sku: "54999599047848514719" }
    }
  },
  {
    id: "lunara-jellyfish-longsleeve",
    name: "Jellyfish Long Sleeve T-Shirt",
    collection: "Lunara Universe",
    type: "longsleeve",
    printify: true,
    printful: false,
    prodigi: false,
    yoycol: false,
    colors: ["black", "white"],
    pricing: {
      "XS": 49.50, "S": 49.50, "M": 49.50, "L": 49.50, "XL": 49.50,
      "2XL": 54.50
    },
    variants: {
      "XS-black": { sku: "66290131641490892448" },
      "XS-white": { sku: "19712933345322208982" },
      "S-black":  { sku: "44046928739335443550" },
      "S-white":  { sku: "61259566729093043582" },
      "M-black":  { sku: "28775851443639598686" },
      "M-white":  { sku: "30105334568752371858" },
      "L-black":  { sku: "44413714705082201228" },
      "L-white":  { sku: "94064776703493232092" },
      "XL-black": { sku: "20008603761881466757" },
      "XL-white": { sku: "59715783342891979834" },
      "2XL-white":{ sku: "14658634095715963429" }
    }
  },
  {
    id: "lunara-mushroom-longsleeve",
    name: "Mushroom Long Sleeve T-Shirt",
    collection: "Lunara Universe",
    type: "longsleeve",
    printify: true,
    printful: false,
    prodigi: false,
    yoycol: false,
    colors: ["black", "white"],
    pricing: {
      "XS": 49.50, "S": 49.50, "M": 49.50, "L": 49.50, "XL": 49.50,
      "2XL": 54.50
    },
    variants: {
      "XS-black": { sku: "14567290856872514994" },
      "XS-white": { sku: "11851480867459002726" },
      "S-black":  { sku: "23238739909709174870" },
      "S-white":  { sku: "24066698913727411242" },
      "M-black":  { sku: "22265406401555312470" },
      "M-white":  { sku: "29494512874943019259" },
      "L-black":  { sku: "6530441793898370244"  },
      "L-white":  { sku: "25455250967645106613" },
      "XL-black": { sku: "15386825704044288522" },
      "XL-white": { sku: "3290274276655079180"  },
      "2XL-white":{ sku: "13556925967088277095" }
    }
  },
  // --- SWEATPANTS COLLECTION (white only, XS–6XL) ---
  // SA + International   → fulfilled by Printful (confirmed pricing from Printful dashboard)
  // Routing is by product type ("sweatpants") in lib/fulfillment.js — same for both regions
  {
    id: "lunara-energy-bloom-sweatpants",
    name: "Energy Bloom Sweatpants",
    collection: "Lunara Universe",
    type: "sweatpants",
    printify: true,
    printful: false,
    prodigi: false,
    yoycol: false,
    printfulId: "6a39cd8d70c186",
    colors: ["white"],
    pricing: {
      "2XS": 65.50, "XS": 65.50, "S": 65.50, "M": 65.50, "L": 65.50, "XL": 65.50,
      "2XL": 65.50, "3XL": 65.50, "4XL": 69.50, "5XL": 69.50, "6XL": 74.50
    },
    variants: {
      "XS-white":  { sku: "energy-bloom-sweatpants-XS-white" },
      "S-white":   { sku: "energy-bloom-sweatpants-S-white" },
      "M-white":   { sku: "energy-bloom-sweatpants-M-white" },
      "L-white":   { sku: "energy-bloom-sweatpants-L-white" },
      "XL-white":  { sku: "energy-bloom-sweatpants-XL-white" },
      "2XL-white": { sku: "energy-bloom-sweatpants-2XL-white" },
      "3XL-white": { sku: "energy-bloom-sweatpants-3XL-white" },
      "4XL-white": { sku: "energy-bloom-sweatpants-4XL-white" },
      "5XL-white": { sku: "energy-bloom-sweatpants-5XL-white" },
      "6XL-white": { sku: "energy-bloom-sweatpants-6XL-white" }
    }
  },
  {
    id: "lunara-plain-sweatpants",
    name: "Plain Sweatpants",
    collection: "Lunara Universe",
    type: "sweatpants",
    printify: true,
    printful: false,
    prodigi: false,
    yoycol: false,
    printfulId: "6a39ca43d9f616",
    colors: ["white"],
    pricing: {
      "2XS": 65.50, "XS": 65.50, "S": 65.50, "M": 65.50, "L": 65.50, "XL": 65.50,
      "2XL": 65.50, "3XL": 65.50, "4XL": 69.50, "5XL": 69.50, "6XL": 74.50
    },
    variants: {
      "XS-white":  { sku: "plain-sweatpants-XS-white" },
      "S-white":   { sku: "plain-sweatpants-S-white" },
      "M-white":   { sku: "plain-sweatpants-M-white" },
      "L-white":   { sku: "plain-sweatpants-L-white" },
      "XL-white":  { sku: "plain-sweatpants-XL-white" },
      "2XL-white": { sku: "plain-sweatpants-2XL-white" },
      "3XL-white": { sku: "plain-sweatpants-3XL-white" },
      "4XL-white": { sku: "plain-sweatpants-4XL-white" },
      "5XL-white": { sku: "plain-sweatpants-5XL-white" },
      "6XL-white": { sku: "plain-sweatpants-6XL-white" }
    }
  },
  {
    id: "lunara-drip-smile-sweatpants",
    name: "Drip Smile Sweatpants",
    collection: "Lunara Universe",
    type: "sweatpants",
    printify: true,
    printful: false,
    prodigi: false,
    yoycol: false,
    printfulId: "6a39c9067d5643",
    colors: ["white"],
    pricing: {
      "2XS": 65.50, "XS": 65.50, "S": 65.50, "M": 65.50, "L": 65.50, "XL": 65.50,
      "2XL": 65.50, "3XL": 65.50, "4XL": 69.50, "5XL": 69.50, "6XL": 74.50
    },
    variants: {
      "XS-white":  { sku: "drip-smile-sweatpants-XS-white" },
      "S-white":   { sku: "drip-smile-sweatpants-S-white" },
      "M-white":   { sku: "drip-smile-sweatpants-M-white" },
      "L-white":   { sku: "drip-smile-sweatpants-L-white" },
      "XL-white":  { sku: "drip-smile-sweatpants-XL-white" },
      "2XL-white": { sku: "drip-smile-sweatpants-2XL-white" },
      "3XL-white": { sku: "drip-smile-sweatpants-3XL-white" },
      "4XL-white": { sku: "drip-smile-sweatpants-4XL-white" },
      "5XL-white": { sku: "drip-smile-sweatpants-5XL-white" },
      "6XL-white": { sku: "drip-smile-sweatpants-6XL-white" }
    }
  },
  {
    id: "lunara-mushroom-sweatpants",
    name: "Mushroom Sweatpants",
    collection: "Lunara Universe",
    type: "sweatpants",
    printify: true,
    printful: false,
    prodigi: false,
    yoycol: false,
    printfulId: "6a39c65b1e87d9",
    colors: ["white"],
    pricing: {
      "2XS": 65.50, "XS": 65.50, "S": 65.50, "M": 65.50, "L": 65.50, "XL": 65.50,
      "2XL": 65.50, "3XL": 65.50, "4XL": 69.50, "5XL": 69.50, "6XL": 74.50
    },
    variants: {
      "XS-white":  { sku: "mushroom-sweatpants-XS-white" },
      "S-white":   { sku: "mushroom-sweatpants-S-white" },
      "M-white":   { sku: "mushroom-sweatpants-M-white" },
      "L-white":   { sku: "mushroom-sweatpants-L-white" },
      "XL-white":  { sku: "mushroom-sweatpants-XL-white" },
      "2XL-white": { sku: "mushroom-sweatpants-2XL-white" },
      "3XL-white": { sku: "mushroom-sweatpants-3XL-white" },
      "4XL-white": { sku: "mushroom-sweatpants-4XL-white" },
      "5XL-white": { sku: "mushroom-sweatpants-5XL-white" },
      "6XL-white": { sku: "mushroom-sweatpants-6XL-white" }
    }
  },
  {
    id: "lunara-compass-sweatpants",
    name: "Compass Sweatpants",
    collection: "Lunara Universe",
    type: "sweatpants",
    printify: true,
    printful: false,
    prodigi: false,
    yoycol: false,
    printfulId: "6a39c391f41f91",
    colors: ["white"],
    pricing: {
      "2XS": 65.50, "XS": 65.50, "S": 65.50, "M": 65.50, "L": 65.50, "XL": 65.50,
      "2XL": 65.50, "3XL": 65.50, "4XL": 69.50, "5XL": 69.50, "6XL": 74.50
    },
    variants: {
      "XS-white":  { sku: "compass-sweatpants-XS-white" },
      "S-white":   { sku: "compass-sweatpants-S-white" },
      "M-white":   { sku: "compass-sweatpants-M-white" },
      "L-white":   { sku: "compass-sweatpants-L-white" },
      "XL-white":  { sku: "compass-sweatpants-XL-white" },
      "2XL-white": { sku: "compass-sweatpants-2XL-white" },
      "3XL-white": { sku: "compass-sweatpants-3XL-white" },
      "4XL-white": { sku: "compass-sweatpants-4XL-white" },
      "5XL-white": { sku: "compass-sweatpants-5XL-white" },
      "6XL-white": { sku: "compass-sweatpants-6XL-white" }
    }
  },
  {
    id: "lunara-butterfly-sweatpants",
    name: "Butterfly Sweatpants",
    collection: "Lunara Universe",
    type: "sweatpants",
    printify: true,
    printful: false,
    prodigi: false,
    yoycol: false,
    printfulId: "6a39bf6076fbe5",
    colors: ["white"],
    pricing: {
      "2XS": 65.50, "XS": 65.50, "S": 65.50, "M": 65.50, "L": 65.50, "XL": 65.50,
      "2XL": 65.50, "3XL": 65.50, "4XL": 69.50, "5XL": 69.50, "6XL": 74.50
    },
    variants: {
      "XS-white":  { sku: "butterfly-sweatpants-XS-white" },
      "S-white":   { sku: "butterfly-sweatpants-S-white" },
      "M-white":   { sku: "butterfly-sweatpants-M-white" },
      "L-white":   { sku: "butterfly-sweatpants-L-white" },
      "XL-white":  { sku: "butterfly-sweatpants-XL-white" },
      "2XL-white": { sku: "butterfly-sweatpants-2XL-white" },
      "3XL-white": { sku: "butterfly-sweatpants-3XL-white" },
      "4XL-white": { sku: "butterfly-sweatpants-4XL-white" },
      "5XL-white": { sku: "butterfly-sweatpants-5XL-white" },
      "6XL-white": { sku: "butterfly-sweatpants-6XL-white" }
    }
  },
  {
    id: "lunara-jellyfish-sweatpants",
    name: "Jellyfish Sweatpants",
    collection: "Lunara Universe",
    type: "sweatpants",
    printify: true,
    printful: false,
    prodigi: false,
    yoycol: false,
    printfulId: "6a38cd71dc9f44",
    colors: ["white"],
    pricing: {
      "2XS": 65.50, "XS": 65.50, "S": 65.50, "M": 65.50, "L": 65.50, "XL": 65.50,
      "2XL": 65.50, "3XL": 65.50, "4XL": 69.50, "5XL": 69.50, "6XL": 74.50
    },
    variants: {
      "XS-white":  { sku: "jellyfish-sweatpants-XS-white" },
      "S-white":   { sku: "jellyfish-sweatpants-S-white" },
      "M-white":   { sku: "jellyfish-sweatpants-M-white" },
      "L-white":   { sku: "jellyfish-sweatpants-L-white" },
      "XL-white":  { sku: "jellyfish-sweatpants-XL-white" },
      "2XL-white": { sku: "jellyfish-sweatpants-2XL-white" },
      "3XL-white": { sku: "jellyfish-sweatpants-3XL-white" },
      "4XL-white": { sku: "jellyfish-sweatpants-4XL-white" },
      "5XL-white": { sku: "jellyfish-sweatpants-5XL-white" },
      "6XL-white": { sku: "jellyfish-sweatpants-6XL-white" }
    }
  },
  {
    id: "lunara-cosmic-eye-sweatpants",
    name: "Cosmic Eye Sweatpants",
    collection: "Lunara Universe",
    type: "sweatpants",
    printify: true,
    printful: false,
    prodigi: false,
    yoycol: false,
    printfulId: "6a38cb06256fd9",
    colors: ["white"],
    pricing: {
      "2XS": 65.50, "XS": 65.50, "S": 65.50, "M": 65.50, "L": 65.50, "XL": 65.50,
      "2XL": 65.50, "3XL": 65.50, "4XL": 69.50, "5XL": 69.50, "6XL": 74.50
    },
    variants: {
      "XS-white":  { sku: "cosmic-eye-sweatpants-XS-white" },
      "S-white":   { sku: "cosmic-eye-sweatpants-S-white" },
      "M-white":   { sku: "cosmic-eye-sweatpants-M-white" },
      "L-white":   { sku: "cosmic-eye-sweatpants-L-white" },
      "XL-white":  { sku: "cosmic-eye-sweatpants-XL-white" },
      "2XL-white": { sku: "cosmic-eye-sweatpants-2XL-white" },
      "3XL-white": { sku: "cosmic-eye-sweatpants-3XL-white" },
      "4XL-white": { sku: "cosmic-eye-sweatpants-4XL-white" },
      "5XL-white": { sku: "cosmic-eye-sweatpants-5XL-white" },
      "6XL-white": { sku: "cosmic-eye-sweatpants-6XL-white" }
    }
  }

  ]
};


// ============================================================
//  FESTIVAL COLLECTION — Template (uncomment when ready)
// ============================================================
/*
const FESTIVAL_COLLECTION = {

  collectionName: "Festival",
  sectionId: "festival",

  zarPrices: {
    hoodie:     { black: { "S": 949.99, "M": 949.99, "L": 949.99, "XL": 949.99 }, white: { "S": 859.99, "M": 859.99, "L": 859.99, "XL": 859.99 } },
    tshirt:     { black: { "S": 549.99, "M": 549.99, "L": 549.99, "XL": 549.99 }, white: { "S": 469.99, "M": 469.99, "L": 469.99, "XL": 469.99 } },
    sweatpants: { "XS": 969.99, "S": 969.99, "M": 969.99, "L": 969.99, "XL": 969.99, "2XL": 1099.99 }
  },

  imageFolders: {
    "festival-neon-hoodie":   "festival-collection/neon-hoodie",
    "festival-sunset-tshirt": "festival-collection/sunset-tee"
  },

  noBackIds: [],

  products: [
    {
      id: "festival-neon-hoodie",
      name: "Neon Hoodie",
      collection: "Festival",
      type: "hoodie",
      printify: true, printful: false, prodigi: false, yoycol: false,
      colors: ["black", "white"],
      pricing: {
      "S": 75.50, "M": 75.50, "L": 75.50, "XL": 75.50, "2XL": 75.50,
      "3XL": 86.50, "4XL": 86.50, "5XL": 86.50
    },
      variants: {
        "S-black":  { sku: "PASTE_SKU_FROM_PRINTIFY" },
        "M-black":  { sku: "PASTE_SKU_FROM_PRINTIFY" },
        "L-black":  { sku: "PASTE_SKU_FROM_PRINTIFY" },
        "XL-black": { sku: "PASTE_SKU_FROM_PRINTIFY" },
        "S-white":  { sku: "PASTE_SKU_FROM_PRINTIFY" },
        "M-white":  { sku: "PASTE_SKU_FROM_PRINTIFY" },
        "L-white":  { sku: "PASTE_SKU_FROM_PRINTIFY" },
        "XL-white": { sku: "PASTE_SKU_FROM_PRINTIFY" }
      }
    }
    // Add more Festival products here...
  ]
};
*/


// ============================================================
//  ACTIVE COLLECTIONS — controls what shows on the website
//  Add a new collection to this array to make it go live.
//  Comment one out to hide it without deleting it.
// ============================================================
const LUNARA_COLLECTIONS = [
  NOVA_COLLECTION,
  // FESTIVAL_COLLECTION,   // ← uncomment when ready to launch
];
