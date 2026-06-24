// ==========================
// 🌍 GEO DETECTION & REGION SELECTOR
// ==========================
let userCountry = "ZA";

async function detectCountry() {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    // Check if the user has a manually saved preference first; otherwise use IP
    const savedRegion = localStorage.getItem("selectedRegion");
    userCountry = savedRegion || data.country_code || "ZA";
  } catch {
    userCountry = localStorage.getItem("selectedRegion") || "ZA";
  }
}

function initRegionSelector() {
  const regionBtn = document.getElementById("regionBtn");
  const regionDropdown = document.getElementById("regionDropdown");
  if (!regionBtn || !regionDropdown) return;

  const regionLinks = regionDropdown.querySelectorAll("a");

  updateRegionUI(userCountry);

  // Toggle dropdown
  regionBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    regionDropdown.style.display = regionDropdown.style.display === "block" ? "none" : "block";
  });

  // Close dropdown on outside click
  document.addEventListener("click", () => {
    regionDropdown.style.display = "none";
  });

  // Handle choice selection
  regionLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const chosenRegion = link.getAttribute("data-region");
      
      localStorage.setItem("selectedRegion", chosenRegion);
      userCountry = chosenRegion;

      updateRegionUI(chosenRegion);
      
      // Rerender products and update cart totals instantly
      if (storeProducts.length > 0) {
        displayProducts(storeProducts);
      }
      updateCart();
    });
  });
}

function updateRegionUI(region) {
  const regionBtn = document.getElementById("regionBtn");
  if (!regionBtn) return;
  
  if (region === "ZA") {
    regionBtn.innerHTML = "🇿🇦 South Africa (ZAR)";
  } else {
    regionBtn.innerHTML = "🇺🇸 USA / Global (USD)";
  }
}

// ==========================
// 🧠 STATE
// ==========================
let cart = JSON.parse(localStorage.getItem("lunaraCart")) || [];
let favorites = JSON.parse(localStorage.getItem("lunaraFavorites")) || [];
let storeProducts = [];

// ==========================
// 🏪 LOCAL FALLBACK PRODUCTS
// ==========================
const localProducts = [
  // --- NOVA HOODIES COLLECTION ---
  {
    id: "nova-cosmic-eye-hoodie",
    name: "Nova Cosmic Eye Hoodie",
    collection: "Nova",
    type: "hoodie",
    printify: true,
    prodigi: false,
    yoycol: false,
    pricing: {
      "S": 75.50, "M": 75.50, "L": 75.50, "XL": 75.50, "2XL": 75.50,
      "3XL": 86.15, "4XL": 86.15, "5XL": 86.15
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
    name: "Nova Energy Bloom Hoodie",
    collection: "Nova",
    type: "hoodie",
    printify: true,
    prodigi: false,
    yoycol: false,
    pricing: {
      "S": 75.50, "M": 75.50, "L": 75.50, "XL": 75.50, "2XL": 75.50,
      "3XL": 86.15, "4XL": 86.15, "5XL": 86.15
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
    name: "Nova Compass Hoodie",
    collection: "Nova",
    type: "hoodie",
    printify: true,
    prodigi: false,
    yoycol: false,
    pricing: {
      "S": 75.50, "M": 75.50, "L": 75.50, "XL": 75.50, "2XL": 75.50,
      "3XL": 86.15, "4XL": 86.15, "5XL": 86.15
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
    name: "Nova Butterfly Hoodie",
    collection: "Nova",
    type: "hoodie",
    printify: true,
    prodigi: false,
    yoycol: false,
    pricing: {
      "S": 75.50, "M": 75.50, "L": 75.50, "XL": 75.50, "2XL": 75.50,
      "3XL": 86.15, "4XL": 86.15, "5XL": 86.15
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
    name: "Nova Mushroom Hoodie",
    collection: "Nova",
    type: "hoodie",
    printify: true,
    prodigi: false,
    yoycol: false,
    pricing: {
      "S": 75.50, "M": 75.50, "L": 75.50, "XL": 75.50, "2XL": 75.50,
      "3XL": 86.15, "4XL": 86.15, "5XL": 86.15
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
    name: "Nova Jellyfish Hoodie",
    collection: "Nova",
    type: "hoodie",
    printify: true,
    prodigi: false,
    yoycol: false,
    pricing: {
      "S": 75.50, "M": 75.50, "L": 75.50, "XL": 75.50, "2XL": 75.50,
      "3XL": 86.15, "4XL": 86.15, "5XL": 86.15
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
    name: "Nova Drip Smile Hoodie",
    collection: "Nova",
    type: "hoodie",
    printify: true,
    prodigi: false,
    yoycol: false,
    pricing: {
      "S": 75.50, "M": 75.50, "L": 75.50, "XL": 75.50, "2XL": 75.50,
      "3XL": 86.15, "4XL": 86.15, "5XL": 86.15
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
    name: "Nova Plain Hoodie",
    collection: "Nova",
    type: "hoodie",
    printify: true,
    prodigi: false,
    yoycol: false,
    pricing: {
      "S": 75.50, "M": 75.50, "L": 75.50, "XL": 75.50, "2XL": 75.50,
      "3XL": 86.15, "4XL": 86.15
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
      "S": 47.30, "M": 47.30, "L": 47.30, "XL": 47.30, "2XL": 47.30,
      "3XL-white": 53.97, "3XL-black": 57.23,
      "4XL-white": 53.97, "4XL-black": 57.23,
      "5XL-white": 53.97, "5XL-black": 57.23
    },
    variants: {
      "S-white": { sku: "12215601454483147981" },
      "S-black": { sku: "18460107805304022560" },
      "M-white": { sku: "13388008786764603379" },
      "M-black": { sku: "16240964139055126048" },
      "L-white": { sku: "25388160816972802882" },
      "L-black": { sku: "23684284592022657316" },
      "XL-white": { sku: "18976497576217052854" },
      "XL-black": { sku: "22811399460748677090" },
      "2XL-white": { sku: "26949322636823360132" },
      "2XL-black": { sku: "18374163293565711974" },
      "3XL-white": { sku: "31201173251251887315" },
      "3XL-black": { sku: "20388193471138421678" },
      "4XL-white": { sku: "31076396039105155972" },
      "4XL-black": { sku: "19459197704590718251" },
      "5XL-white": { sku: "13719935434937716337" },
      "5XL-black": { sku: "17294148851660403326" }
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
      "S": 47.30, "M": 47.30, "L": 47.30, "XL": 47.30, "2XL": 47.30,
      "3XL-white": 53.97, "3XL-black": 57.23,
      "4XL-white": 53.97, "4XL-black": 57.23,
      "5XL-white": 53.97, "5XL-black": 57.23
    },
    variants: {
      "S-white": { sku: "98664956381073655910" },
      "S-black": { sku: "28760083514720856003" },
      "M-white": { sku: "30620226554977932099" },
      "M-black": { sku: "12714409629294935300" },
      "L-white": { sku: "23611302128351222568" },
      "L-black": { sku: "16391920759125748852" },
      "XL-white": { sku: "99854332896934578594" },
      "XL-black": { sku: "41745540707145875778" },
      "2XL-white": { sku: "24228696985407082662" },
      "2XL-black": { sku: "14655623059862040714" },
      "3XL-white": { sku: "50889578725337581575" },
      "3XL-black": { sku: "27723068866720615350" },
      "4XL-white": { sku: "13226448841786542624" },
      "4XL-black": { sku: "43576177132983209903" },
      "5XL-white": { sku: "99972795477531001329" },
      "5XL-black": { sku: "28799341072380209055" }
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
      "S": 47.30, "M": 47.30, "L": 47.30, "XL": 47.30, "2XL": 47.30,
      "3XL-white": 53.97, "3XL-black": 57.23,
      "4XL-white": 53.97, "4XL-black": 57.23,
      "5XL-white": 53.97, "5XL-black": 57.23
    },
    variants: {
      "S-white": { sku: "15269016618941423882" },
      "S-black": { sku: "4699437126713076" },
      "M-white": { sku: "16827234635393510166" },
      "M-black": { sku: "69737591653177494915" },
      "L-white": { sku: "86850306456760473830" },
      "L-black": { sku: "21918551959936973317" },
      "XL-white": { sku: "26579641201435278972" },
      "XL-black": { sku: "29718258726386357981" },
      "2XL-white": { sku: "20363603198452013853" },
      "2XL-black": { sku: "56547864419894957452" },
      "3XL-white": { sku: "26067258079542137409" },
      "3XL-black": { sku: "96378791098242236310" },
      "4XL-white": { sku: "60445294278514042497" },
      "4XL-black": { sku: "26283886174496085826" },
      "5XL-white": { sku: "18936494439695625824" },
      "5XL-black": { sku: "25596949449011580746" }
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
      "S": 47.30, "M": 47.30, "L": 47.30, "XL": 47.30, "2XL": 47.30,
      "3XL-white": 53.97, "3XL-black": 57.23,
      "4XL-white": 53.97, "4XL-black": 57.23,
      "5XL-white": 53.97, "5XL-black": 57.23
    },
    variants: {
      "S-white": { sku: "18375061045631364680" },
      "S-black": { sku: "81623585981780965442" },
      "M-white": { sku: "15885770059697140444" },
      "M-black": { sku: "11061010824658063532" },
      "L-white": { sku: "32165602543985714191" },
      "L-black": { sku: "25440855243959869196" },
      "XL-white": { sku: "97136779166898523110" },
      "XL-black": { sku: "52661867331516737269" },
      "2XL-white": { sku: "95226926024516306828" },
      "2XL-black": { sku: "30966762254663741640" },
      "3XL-white": { sku: "62684317391553086575" },
      "3XL-black": { sku: "19094509003647119678" },
      "4XL-white": { sku: "19065117358425939457" },
      "4XL-black": { sku: "23357298016376133350" },
      "5XL-white": { sku: "24584961845856904862" },
      "5XL-black": { sku: "33445579223442074434" }
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
      "S": 47.30, "M": 47.30, "L": 47.30, "XL": 47.30, "2XL": 47.30,
      "3XL-white": 53.97, "3XL-black": 57.23,
      "4XL-white": 53.97, "4XL-black": 57.23,
      "5XL-white": 53.97, "5XL-black": 57.23
    },
    variants: {
      "S-white": { sku: "18114924691398441951" },
      "S-black": { sku: "18121666390331829151" },
      "M-white": { sku: "52052257250308852137" },
      "M-black": { sku: "99734467962187976590" },
      "L-white": { sku: "24860873314098878073" },
      "L-black": { sku: "16178225950945306713" },
      "XL-white": { sku: "19265294427686353415" },
      "XL-black": { sku: "33670643637711773210" },
      "2XL-white": { sku: "29994746537134631444" },
      "2XL-black": { sku: "96214644975592614469" },
      "3XL-white": { sku: "31739420204558600422" },
      "3XL-black": { sku: "20826598495463578543" },
      "4XL-white": { sku: "98399083347436907888" },
      "4XL-black": { sku: "31923313289965808973" },
      "5XL-white": { sku: "28305364065247068096" },
      "5XL-black": { sku: "27496207433221685844" }
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
      "S": 47.30, "M": 47.30, "L": 47.30, "XL": 47.30, "2XL": 47.30,
      "3XL-white": 53.97, "3XL-black": 57.23,
      "4XL-white": 53.97, "4XL-black": 57.23,
      "5XL-white": 53.97, "5XL-black": 57.23
    },
    variants: {
      "S-white": { sku: "28977423494072789834" },
      "S-black": { sku: "15687505237385937727" },
      "M-white": { sku: "17405984976020008250" },
      "M-black": { sku: "12975953659648353008" },
      "L-white": { sku: "29625273970881379128" },
      "L-black": { sku: "28619968918112161360" },
      "XL-white": { sku: "32191430709274746583" },
      "XL-black": { sku: "14782417484684035778" },
      "2XL-white": { sku: "14020076837375433006" },
      "2XL-black": { sku: "16392224679883219587" },
      "3XL-white": { sku: "14625086041252803924" },
      "3XL-black": { sku: "13237150022706909362" },
      "4XL-white": { sku: "23336567338104555206" },
      "4XL-black": { sku: "19730002365684307501" },
      "5XL-white": { sku: "19256325342498052950" },
      "5XL-black": { sku: "17122315733192996291" }
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
      "S": 47.30, "M": 47.30, "L": 47.30, "XL": 47.30, "2XL": 47.30,
      "3XL-white": 53.97, "3XL-black": 57.23,
      "4XL-white": 53.97, "4XL-black": 57.23,
      "5XL-white": 53.97, "5XL-black": 57.23
    },
    variants: {
      "S-white": { sku: "71752840872619484676" },
      "S-black": { sku: "94284199021227162244" },
      "M-white": { sku: "33176024627081646724" },
      "M-black": { sku: "16487333655008313038" },
      "L-white": { sku: "13613114476024368230" },
      "L-black": { sku: "31921069933557670202" },
      "XL-white": { sku: "32230327262019853780" },
      "XL-black": { sku: "23153788794813944288" },
      "2XL-white": { sku: "26183072349651811735" },
      "2XL-black": { sku: "65125977105472564502" },
      "3XL-white": { sku: "15837973330248693095" },
      "3XL-black": { sku: "69799538088827000172" },
      "4XL-white": { sku: "26734808676629062800" },
      "4XL-black": { sku: "38893830202157743318" },
      "5XL-white": { sku: "30893779222488129362" },
      "5XL-black": { sku: "26529820608487258500" }
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
      "S": 25.48, "M": 25.48, "L": 25.48, "XL": 25.48, "2XL": 25.48,
      "3XL": 29.17, "4XL": 29.17
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
      "S": 25.48, "M": 25.48, "L": 25.48, "XL": 25.48, "2XL": 25.48,
      "3XL": 29.17, "4XL": 29.17
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
      "S": 25.48, "M": 25.48, "L": 25.48, "XL": 25.48, "2XL": 25.48,
      "3XL": 29.17, "4XL": 29.17
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
      "S": 25.48, "M": 25.48, "L": 25.48, "XL": 25.48, "2XL": 25.48,
      "3XL": 29.17, "4XL": 29.17
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
      "S": 25.48, "M": 25.48, "L": 25.48, "XL": 25.48, "2XL": 25.48,
      "3XL": 29.17, "4XL": 29.17
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
      "S": 25.48, "M": 25.48, "L": 25.48, "XL": 25.48, "2XL": 25.48,
      "3XL": 29.17, "4XL": 29.17
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
      "S": 25.48, "M": 25.48, "L": 25.48, "XL": 25.48, "2XL": 25.48,
      "3XL": 29.17, "4XL": 29.17
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
  // --- SWEATPANTS COLLECTION (white only, XS–6XL) ---
  // SA customers     → fulfilled by Printful (ZAR prices from SA_PRICING)
  // International   → fulfilled by Printify (USD prices from your Printify dashboard)
  // Routing is automatic based on userCountry — set in addToCart
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
      "XS": 58, "S": 58, "M": 58, "L": 58, "XL": 58,
      "2XL": 63, "3XL": 63, "4XL": 68, "5XL": 68, "6XL": 68
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
      "XS": 58, "S": 58, "M": 58, "L": 58, "XL": 58,
      "2XL": 63, "3XL": 63, "4XL": 68, "5XL": 68, "6XL": 68
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
      "XS": 58, "S": 58, "M": 58, "L": 58, "XL": 58,
      "2XL": 63, "3XL": 63, "4XL": 68, "5XL": 68, "6XL": 68
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
      "XS": 58, "S": 58, "M": 58, "L": 58, "XL": 58,
      "2XL": 63, "3XL": 63, "4XL": 68, "5XL": 68, "6XL": 68
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
      "XS": 58, "S": 58, "M": 58, "L": 58, "XL": 58,
      "2XL": 63, "3XL": 63, "4XL": 68, "5XL": 68, "6XL": 68
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
      "XS": 58, "S": 58, "M": 58, "L": 58, "XL": 58,
      "2XL": 63, "3XL": 63, "4XL": 68, "5XL": 68, "6XL": 68
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
      "XS": 58, "S": 58, "M": 58, "L": 58, "XL": 58,
      "2XL": 63, "3XL": 63, "4XL": 68, "5XL": 68, "6XL": 68
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
];

// ==========================
// ⚙️ HELPERS & CURRENCY
// ==========================
function saveCart() {
  localStorage.setItem("lunaraCart", JSON.stringify(cart));
}

function saveFavorites() {
  localStorage.setItem("lunaraFavorites", JSON.stringify(favorites));
}

// ==========================
// 💰 YOUR PRICING TABLES
// Edit these to set the prices customers see.
//
// SA_PRICING  → ZAR prices shown to South African customers.
//               Applies to ALL product types (hoodies, tees, sweatpants etc.).
//               Sweatpants use SA_PRICING.sweatpants — fulfilled by Printful.
//               Hoodies / sweatshirts / tees — fulfilled by OTC Printing.
//
// International customers → prices come from your Printify published prices
//               via /api/products. Set your USD prices in your Printify dashboard.
//               Your repo images (mockups downloaded from Printify) show for everyone.
// ==========================
const SA_PRICING = {
  hoodie: {
    "S": 750, "M": 750, "L": 750, "XL": 750, "2XL": 750,
    "3XL": 860, "4XL": 860, "5XL": 860
  },
  sweatshirt: {
    "S": 480, "M": 480, "L": 480, "XL": 480, "2XL": 480,
    "3XL": 550, "4XL": 550, "5XL": 550
  },
  tshirt: {
    "S": 280, "M": 280, "L": 280, "XL": 280, "2XL": 280,
    "3XL": 320, "4XL": 320
  },
  sweatpants: {
    "XS": 58, "S": 58, "M": 58, "L": 58, "XL": 58,
    "2XL": 63, "3XL": 63, "4XL": 68, "5XL": 68, "6XL": 68
  }
};

// Returns the correct display price for a product + size.
// SA  → your ZAR price from SA_PRICING (ZAR).
// INT → Printify's published USD price from product.pricing (set in your Printify dashboard).
function getCalculatedRegionalPrice(product, size) {
  const type = String(product?.type || "").toLowerCase();

  if (userCountry === "ZA") {
    const saPrice = SA_PRICING[type]?.[size];
    if (saPrice !== undefined) return saPrice;
    // Fallback if size not in table
    return product.pricing?.[size] || product.price || 0;
  }

  // International: use Printify's published price
  return product.pricing?.[size] || product.price || 0;
        }
// ==========================
// 🖼️ PRODUCT IMAGES
// All customers see images from your GitHub repo.
// Images live at: /images/{typeFolder}/{slug}/{color}.png
// Upload your mockup photos from Printify directly into those folders.
// ==========================

function getSlug(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/t-shirt/g, "tee")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function getTypeFolder(product) {
  const type = String(product?.type || "").toLowerCase();
  if (type === "tshirt" || type === "shirt" || type === "tee") return "shirts";
  if (type === "hoodie") return "hoodies";
  if (type === "sweatshirt") return "sweatshirts";
  if (type === "sweatpants") return "sweatpants";
  return "pants";
}

function getImagePath(product, color = "black") {
  const slug = product.slug || getSlug(product.name);
  const typeFolder = getTypeFolder(product);
  return `/images/${typeFolder}/${slug}/${color}.png`;
}

function normalizeApiProduct(product = {}) {
  const rawType = String(product.type || product.category || "").toLowerCase();
  const rawName = String(product.name || "").toLowerCase();

  let normalizedType = "tshirt";
  if (rawType.includes("hoodie") || rawName.includes("hoodie")) normalizedType = "hoodie";
  else if (rawType.includes("sweatpants") || rawName.includes("sweatpants")) normalizedType = "sweatpants";
  else if (rawType.includes("sweatshirt") || rawName.includes("sweatshirt")) normalizedType = "sweatshirt";
  else if (rawType.includes("pant") || rawName.includes("pant")) normalizedType = "pants";
  else if (rawType.includes("shirt") || rawType.includes("tee") || rawName.includes("shirt") || rawName.includes("tee")) normalizedType = "tshirt";

  const fallbackPrice = product.pricing?.S || product.variants?.[0]?.price || 25.48;

  return {
    ...product,
    id: product.id || product.slug || getSlug(product.name || "product"),
    slug: product.slug || getSlug(product.name || "product"),
    type: normalizedType,
    price: Number(product.price || fallbackPrice),
    printify: product.printify ?? true,
    prodigi: product.prodigi ?? false
  };
}

// ==========================
// 🛍️ DISPLAY PRODUCTS
// ==========================
const productsContainer = document.querySelector(".products");

function displayProducts(products) {
  if (!productsContainer) return;
  productsContainer.innerHTML = "";

  if (!products.length) {
    productsContainer.innerHTML = `<p>No products found.</p>`;
    return;
  }

  products.forEach((product, index) => {
    const stock = Math.floor(Math.random() * 6) + 3;
    const reviews = Math.floor(Math.random() * 1500) + 300;
    const isFav = favorites.includes(product.id);
    const isSweatpants = String(product.type || "").toLowerCase() === "sweatpants";

    // Sweatpants are white only; everything else defaults to black
    const defaultColor = isSweatpants ? "white" : "black";
    const imageSrc = getImagePath(product, defaultColor);

    const defaultSize = product.pricing?.["M"] !== undefined ? "M" : Object.keys(product.pricing || {})[0] || "M";
    const activeDisplayPrice = getCalculatedRegionalPrice(product, defaultSize);

    const sizes = Object.keys(product.pricing || { "S": 0, "M": 0, "L": 0, "XL": 0 });

    // Colors: sweatpants are white only; other products derive colors from variant keys
    let finalColors;
    if (isSweatpants) {
      finalColors = ["white"];
    } else if (product.colors && product.colors.length) {
      finalColors = product.colors;
    } else {
      const dynamicColors = [...new Set(Object.keys(product.variants || {}).map(k => k.split("-").slice(1).join("-")))];
      finalColors = dynamicColors.length ? dynamicColors : ["black", "white"];
    }

    const card = document.createElement("div");
    card.className = "product-card";

                   card.innerHTML = `
      <div class="product-image-wrap">
        <img
          id="img-${index}"
          src="${imageSrc}"
          class="product-image"
          alt="${product.name}"
          onerror="this.onerror=null;this.src='${getImagePath(product, "white")}'"
        >
      </div>

      <div class="product-info">
        <div class="product-top">
          <h4>${product.name}</h4>
          <button class="fav-btn ${isFav ? "active" : ""}" onclick="toggleFavorite('${product.id}', this)">
            🦋
          </button>
        </div>

        <p class="product-price" id="price-display-${index}">${formatCurrency(activeDisplayPrice)}</p>
        <p class="product-tag">🔥 Almost sold out</p>
        <p class="product-stock">Only ${stock} left</p>
        <p class="product-reviews">★★★★★ (${reviews})</p>

        <select id="size-${index}" onchange="updatePremiumPricing(${index})">
          ${sizes.map(size => `<option value="${size}" ${size === defaultSize ? "selected" : ""}>${size}</option>`).join("")}
        </select>

        ${finalColors.length > 1
          ? `<select id="color-${index}" onchange="changeColor(${index})">
              ${finalColors.map(color => `<option value="${color}" ${color === defaultColor ? "selected" : ""}>${color.charAt(0).toUpperCase() + color.slice(1)}</option>`).join("")}
            </select>`
          : `<input type="hidden" id="color-${index}" value="${finalColors[0] || defaultColor}">`
        }

        <button onclick="addToCart(${index}, event)">
          Add to Cart →
        </button>
      </div>
    `;

    productsContainer.appendChild(card);

  });
}

window.updatePremiumPricing = function(index) {
  const product = storeProducts[index];
  if (!product) return;
  const size = document.getElementById(`size-${index}`)?.value || "M";
  const priceDisplay = document.getElementById(`price-display-${index}`);
  if (priceDisplay) {
    priceDisplay.innerText = formatCurrency(getCalculatedRegionalPrice(product, size));
  }
};

// ==========================
// 🎨 COLOR SWITCHING
// ==========================
function changeColor(index) {
  const product = storeProducts[index];
  const color = document.getElementById(`color-${index}`)?.value || "black";
  const img = document.getElementById(`img-${index}`);
  if (!img || !product) return;

  // Set local image immediately as placeholder
  img.src = getImagePath(product, color);

}

// ==========================
// ❤️ FAVORITES
// ==========================
function toggleFavorite(id, el) {
  if (favorites.includes(id)) {
    favorites = favorites.filter((f) => f !== id);
    el.classList.remove("active");
  } else {
    favorites.push(id);
    el.classList.add("active");
  }
  saveFavorites();
}

// ==========================
// 🛒 ADD TO CART
// ==========================
function addToCart(index, event) {
  const product = storeProducts[index];
  if (!product) return;

  const size = document.getElementById(`size-${index}`)?.value || "M";
  const color = document.getElementById(`color-${index}`)?.value || "white";
  const image = getImagePath(product, color);
  const type = String(product.type || "").toLowerCase();

  if (!product.printify && !product.printful && !product.prodigi && !product.yoycol) {
    alert("This product is currently unavailable.");
    return;
  }

  const variantKey = `${size}-${color}`;
  const regionalPrice = getCalculatedRegionalPrice(product, size);
  const variantSku = product.variants?.[variantKey]?.sku || product.variants?.[`S-${color}`]?.sku || "LOCAL-PROD";

  // Fulfillment routing:
  // SA  + hoodie/sweatshirt/tshirt/longsleeve → OTC Printing (email triggered at checkout)
  // SA  + sweatpants                          → Printful
  // INT + anything                            → Printify
  const otcTypes = ["hoodie", "sweatshirt", "tshirt", "longsleeve"];
  const fulfilledByOTC = userCountry === "ZA" && otcTypes.includes(type);
  const fulfilledByPrintful = userCountry === "ZA" && type === "sweatpants";
  const fulfilledByPrintify = userCountry !== "ZA";

  const existing = cart.find(
    (item) => item.id === product.id && item.size === size && item.color === color
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: Number(regionalPrice),
      size,
      color,
      quantity: 1,
      type: product.type,
      slug: product.slug,
      sku: variantSku,
      printify: product.printify,
      printful: product.printful || false,
      printfulId: product.printfulId || null,
      prodigi: product.prodigi,
      fulfilledByOTC,
      fulfilledByPrintful,
      fulfilledByPrintify,
      designUrl: image
    });
  }

  saveCart();
  updateCart();
  openCart();

  if (event?.target) {
    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = "Added ✓";
    btn.style.background = "var(--success)";
    setTimeout(() => {
      btn.innerText = originalText || "Add to Cart →";
      btn.style.background = "";
    }, 1200);
  }
}

// ==========================
// 🧾 CART UI MANAGEMENT
// ==========================
function updateCart() {
  const items = document.getElementById("cart-items");
  if (!items) return;
  items.innerHTML = "";

  if (!cart.length) {
    items.innerHTML = `<p>Your cart is empty.</p>`;
    if (document.getElementById("cart-total")) document.getElementById("cart-total").innerText = formatCurrency(0);
    if (document.getElementById("cart-count")) document.getElementById("cart-count").innerText = "0";
    return;
  }

  cart.forEach((item, i) => {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div>
        <h5>${item.name}</h5>
        <p>Size: ${item.size} | Color: ${item.color}</p>
        <p>Qty: ${item.quantity}</p>
      </div>
      <div>
        <strong>${formatCurrency(item.price * item.quantity)}</strong>
        <br>
        <button onclick="removeFromCart(${i})">Remove</button>
      </div>
    `;
    items.appendChild(row);
  });

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  if (document.getElementById("cart-total")) document.getElementById("cart-total").innerText = formatCurrency(total);
  if (document.getElementById("cart-count")) document.getElementById("cart-count").innerText = cart.reduce((sum, i) => sum + i.quantity, 0);
                                                   }
  function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  updateCart();
}

function openCart() {
  document.getElementById("cart-panel")?.classList.add("open");
  document.body.classList.add("cart-open");
}

function closeCart() {
  document.getElementById("cart-panel")?.classList.remove("open");
  document.body.classList.remove("cart-open");
}

// ==========================
// 👤 CUSTOMER PROFILE AUTO-FILL
// ==========================
function autoFillUserProfile() {
  // Pull existing session variables from localStorage or global object contexts if available
  const savedProfile = JSON.parse(localStorage.getItem("lunaraCustomerProfile"));
  if (!savedProfile) return;

  const emailField = document.getElementById("customer-email");
  const addressField = document.getElementById("customer-address1");
  const countryField = document.getElementById("customer-country");
  const phoneField = document.getElementById("customer-phone");
  const cityField = document.getElementById("customer-city");
  const regionField = document.getElementById("customer-region");
  const zipField = document.getElementById("customer-zip");
  const firstField = document.getElementById("customer-first-name");
  const lastField = document.getElementById("customer-last-name");

  if (emailField && savedProfile.email) emailField.value = savedProfile.email;
  if (addressField && savedProfile.address1) addressField.value = savedProfile.address1;
  if (countryField && savedProfile.country) countryField.value = savedProfile.country;
  if (phoneField && savedProfile.phone) phoneField.value = savedProfile.phone;
  if (cityField && savedProfile.city) cityField.value = savedProfile.city;
  if (regionField && savedProfile.region) regionField.value = savedProfile.region;
  if (zipField && savedProfile.zip) zipField.value = savedProfile.zip;
  if (firstField && savedProfile.firstName) firstField.value = savedProfile.firstName;
  if (lastField && savedProfile.lastName) lastField.value = savedProfile.lastName;
}

// ==========================
// 📦 OTC PRINTING — PLACEMENT RULES
// Each product type has defined print placement zones.
// These are included in the automated OTC order email so the printer
// knows exactly where each design goes on each garment.
//
// ⚠️  Update these placements once you send your placement guide.
//     The structure is: productId → array of placement instructions.
//     If a product isn't listed here, it falls back to type-level defaults.
// ==========================
const OTC_PLACEMENTS = {
  // --- TYPE-LEVEL DEFAULTS (apply to all products of that type) ---
  _defaults: {
    tshirt: [
      { zone: "Front chest",  detail: "Main design — centred" },
      { zone: "Left sleeve",  detail: "Lunara Universe wordmark" }
    ],
    hoodie: [
      { zone: "Front chest",  detail: "Main design — centred" },
      { zone: "Left sleeve",  detail: "Lunara Universe wordmark" },
      { zone: "Hood lining",  detail: "Accent print if applicable" }
    ],
    sweatshirt: [
      { zone: "Front chest",  detail: "Main design — centred" },
      { zone: "Left sleeve",  detail: "Lunara Universe wordmark" }
    ],
    longsleeve: [
      { zone: "Front chest",  detail: "Main design — centred" },
      { zone: "Full sleeves", detail: "Lunara Universe wordmark — both sleeves" }
    ]
  }
  // --- PRODUCT-SPECIFIC OVERRIDES (add when you send your placement guide) ---
  // Example:
  // "lunara-butterfly-tshirt": [
  //   { zone: "Front chest", detail: "Butterfly — centred, full chest" },
  //   { zone: "Left sleeve", detail: "Lunara Universe — vertical" }
  // ]
};

function getOTCPlacements(product) {
  const type = String(product?.type || "").toLowerCase();
  return OTC_PLACEMENTS[product?.id] || OTC_PLACEMENTS._defaults[type] || [
    { zone: "Front chest", detail: "Main design — centred" }
  ];
}

// Builds the structured data payload for the OTC order.
// This gets sent to /api/otc-order which will trigger your Wix automation.
// Each item includes: name, size, color, quantity, and placement instructions.
function buildOTCPayload(customer, items) {
  return {
    orderId: localStorage.getItem("lunara_order_id") || "LUNARA-" + Date.now(),
    customer: {
      name: `${customer.firstName} ${customer.lastName}`,
      email: customer.email,
      phone: customer.phone || "",
      address: [
        customer.address1,
        customer.city,
        customer.region,
        customer.zip,
        "South Africa"
      ].filter(Boolean).join(", ")
    },
    items: items.map(item => {
      const product = storeProducts.find(p => p.id === item.id) || {};
      const placements = getOTCPlacements(product);
      return {
        productName: item.name,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        placements
      };
    })
  };
    }
     // ==========================
// 💳 CHECKOUT
// ==========================
async function checkout() {
  if (!cart.length) {
    alert("Your cart is empty.");
    return;
  }

  const firstName = document.getElementById("customer-first-name")?.value;
  const lastName = document.getElementById("customer-last-name")?.value;
  const email = document.getElementById("customer-email")?.value;
  const country = document.getElementById("customer-country")?.value || userCountry;

  if (!firstName || !lastName || !email) {
    alert("Please fill in your details.");
    return;
  }

  const phone = document.getElementById("customer-phone")?.value;
  const address1 = document.getElementById("customer-address1")?.value;
  const city = document.getElementById("customer-city")?.value;
  const region = document.getElementById("customer-region")?.value;
  const zip = document.getElementById("customer-zip")?.value;

  // Cache shipping info for next visit
  const customerProfile = { firstName, lastName, email, country, phone, address1, city, region, zip };
  localStorage.setItem("lunaraCustomerProfile", JSON.stringify(customerProfile));

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const orderId = "LUNARA-" + Date.now();
  localStorage.setItem("lunara_order_id", orderId);

  // Split cart: OTC items (SA local fulfillment) vs Printful items (sweatpants, all regions)
  const otcItems = cart.filter(i => i.fulfilledByOTC);
  const printfulItems = cart.filter(i => i.printful && !i.fulfilledByOTC);

  // SA customers with hoodies/sweatshirts/tees:
  // Fire OTC Printing email trigger via /api/otc-order.
  // This is a non-blocking background call — PayFast payment still proceeds.
  // Your Wix automation picks up from there once you wire it in.
  if (otcItems.length > 0) {
    try {
      const otcPayload = buildOTCPayload(
        { firstName, lastName, email, phone, address1, city, region, zip },
        otcItems
      );
      await fetch("/api/otc-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(otcPayload)
      });
    } catch (err) {
      console.error("OTC order email failed:", err);
      // Non-blocking — PayFast payment still proceeds
    }
}
    // Proceed to PayFast payment (covers the full cart total)
  const res = await fetch("/api/payfast", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      amount: total,
      cart,
      address1,
      city,
      region,
      zip,
      country,
      phone,
      orderId
    })
  });

  const data = await res.json();
  if (!res.ok || !data.url) {
    console.error("Checkout failed:", data);
    alert("Checkout failed. Please try again.");
    return;
  }

  window.location.href = data.url;
}

// ==========================
// 📦 LOAD PRODUCTS
// ==========================
async function loadProducts() {
  if (productsContainer) {
    productsContainer.innerHTML = `<p>Loading products...</p>`;
  }

  try {
    const res = await fetch("/api/products");
    const data = await res.json();

    if (!res.ok || !data.success) throw new Error(data.error || "API failed");

    const apiProducts = Array.isArray(data.data) ? data.data.map(normalizeApiProduct) : [];
    const apiIds = new Set(apiProducts.map((p) => p.id));
    const mergedProducts = [...apiProducts, ...localProducts.filter((p) => !apiIds.has(p.id))];

    storeProducts = mergedProducts;
    displayProducts(storeProducts);
    updateCart();
  } catch (err) {
    console.error("Fallback triggered", err);
    storeProducts = [...localProducts];
    displayProducts(storeProducts);
    updateCart();
  }
}

// ==========================
// 🌙 SMART HEADER SCROLL
// ==========================
function initSmartHeader() {
  const header = document.getElementById("site-header");
  if (!header) return;
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;
    const scrollingDown = currentScrollY > lastScrollY;
    const nearTop = currentScrollY < 140;

    if (currentScrollY > 25) header.classList.add("shrink");
    else header.classList.remove("shrink");

    if (nearTop) header.classList.remove("header-hidden");
    else if (scrollingDown) header.classList.add("header-hidden");
    else header.classList.remove("header-hidden");

    lastScrollY = Math.max(currentScrollY, 0);
  });
}

// ==========================
// 🚀 INIT
// ==========================
async function init() {
  initSmartHeader();
  await detectCountry();
  initRegionSelector();
  autoFillUserProfile();
  await loadProducts();
  updateCart();
}

init();
