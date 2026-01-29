document.addEventListener("DOMContentLoaded", async () => {
  console.log("🚀 Zombie Typing Shooter Ultimate Edition Loading...");

  simulateLoading();

  await initializeGame();

  setTimeout(() => {
    document.getElementById("loading-screen").classList.remove("active");
    document.getElementById("game-container").classList.remove("hidden");
    document.getElementById("main-menu").classList.add("active");
    playBackgroundMusic();

    console.log("✅ Game Ready!");
  }, 2000);
});

// Simulate Loading Progress
function simulateLoading() {
  const progressBar = document.querySelector(".loading-progress");
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 10;
    if (progress > 100) {
      progress = 100;
      clearInterval(interval);
    }
    progressBar.style.width = `${progress}%`;
  }, 100);
}

// Initialize Game Systems
async function initializeGame() {
  console.log("🎮 Initializing game systems...");

  // Initialize game state
  await initGameState();

  // Initialize canvas and rendering
  await initCanvas();

  // Initialize UI
  await initUI();

  // Initialize audio
  await initAudio();

  // Initialize shops
  await initShops();

  // Initialize settings
  await initSettings();

  // Set up event listeners
  setupEventListeners();

  console.log("✅ All systems initialized!");
}

// Game State
let gameState = {
  // Core State
  currentScreen: "MENU",
  gameActive: false,
  gameTime: 0,
  lastUpdate: Date.now(),

  // Player Stats
  score: 0,
  highScore: localStorage.getItem("zts_highScore") || 0,
  coins: parseInt(localStorage.getItem("zts_coins")) || 0,
  health: 3,
  maxHealth: 3,
  wave: 1,
  zombiesKilled: 0,
  wordsTyped: 0,
  correctWords: 0,
  currentCombo: 1,
  maxCombo: 1,
  killStreak: 0,
  lastKillTime: 0,

  // Gameplay Settings
  difficulty: "normal",
  wordComplexity: "normal",
  waveDuration: 30,

  // Equipment
  activeGun: localStorage.getItem("zts_activeGun") || "pistol",
  activeSkin: localStorage.getItem("zts_activeSkin") || "default",
  ownedGuns: JSON.parse(localStorage.getItem("zts_ownedGuns")) || ["pistol"],
  ownedSkins: JSON.parse(localStorage.getItem("zts_ownedSkins")) || ["default"],

  // Statistics
  totalGames: parseInt(localStorage.getItem("zts_totalGames")) || 0,
  totalKills: parseInt(localStorage.getItem("zts_totalKills")) || 0,
  totalCoins: parseInt(localStorage.getItem("zts_totalCoins")) || 0,
  totalWords: parseInt(localStorage.getItem("zts_totalWords")) || 0,
  bestScore: parseInt(localStorage.getItem("zts_bestScore")) || 0,
  bestWave: parseInt(localStorage.getItem("zts_bestWave")) || 1,
  bestCombo: parseInt(localStorage.getItem("zts_bestCombo")) || 1,
  playTime: parseInt(localStorage.getItem("zts_playTime")) || 0,

  // Game Objects
  zombies: [],
  bullets: [],
  particles: [],
  coins: [],
  effects: [],
  notifications: [],

  // Input
  currentInput: "",
  lastInputTime: 0,

  // Wave Management
  waveStartTime: 0,
  zombiesSpawned: 0,
  zombiesToSpawn: 5,
  spawnInterval: 1000,
  lastSpawnTime: 0,

  // Settings
  masterVolume: parseFloat(localStorage.getItem("zts_masterVolume")) || 0.8,
  musicVolume: parseFloat(localStorage.getItem("zts_musicVolume")) || 0.7,
  sfxVolume: parseFloat(localStorage.getItem("zts_sfxVolume")) || 0.9,
  uiSounds: localStorage.getItem("zts_uiSounds") !== "false",
  particlesEnabled: localStorage.getItem("zts_particles") !== "false",
  screenShake: localStorage.getItem("zts_screenShake") !== "false",
  wordSuggestions: localStorage.getItem("zts_wordSuggestions") !== "false",
};

// Word Lists by Complexity
const WORD_LISTS = {
  simple: [
    "ALPHA",
    "BRAVO",
    "DELTA",
    "ECHO",
    "GOLF",
    "HOTEL",
    "INDIA",
    "JULIA",
    "KILO",
    "LIMA",
    "MIKE",
    "NOVEM",
    "OSCAR",
    "PAPA",
    "QUEEN",
    "ROMEO",
    "SIERA",
    "TANGO",
    "UNITY",
    "VICTOR",
    "WHISK",
    "XRAY",
    "YANK",
    "ZEBRA",
    "APPLE",
    "BEACH",
    "CLOUD",
    "DREAM",
    "EARTH",
    "FLAME",
    "GRASS",
    "HEART",
    "IGLOO",
    "JUICE",
    "KNIFE",
    "LEMON",
    "MONEY",
    "NIGHT",
    "OCEAN",
    "PEACE",
    "QUIET",
    "RIVER",
    "SUNNY",
    "TABLE",
    "UMBRA",
    "VOICE",
    "WATER",
    "YOGUR",
    "ZESTY",
  ],
  normal: [
    "ABOVE",
    "ADAPT",
    "AGENT",
    "ALERT",
    "AMONG",
    "ANGER",
    "ARENA",
    "ARISE",
    "AWAKE",
    "BADGE",
    "BASIC",
    "BEACH",
    "BEGAN",
    "BEGIN",
    "BEING",
    "BLACK",
    "BLOOD",
    "BOARD",
    "BRAIN",
    "BREAD",
    "BREAK",
    "BRIEF",
    "BROAD",
    "BROWN",
    "BUILD",
    "CARRY",
    "CHAIR",
    "CHART",
    "CHECK",
    "CHIEF",
    "CHILD",
    "CHINA",
    "CIVIL",
    "CLAIM",
    "CLASS",
    "CLEAN",
    "CLOSE",
    "COACH",
    "COAST",
    "COUNT",
    "COURT",
    "COVER",
    "CRAFT",
    "CRASH",
    "CRAZY",
    "CREAM",
    "CRIME",
    "CROSS",
    "CROWD",
    "CYCLE",
    "DAILY",
    "DANCE",
    "DEATH",
    "DELTA",
    "DEPTH",
    "DIRTY",
    "DONOR",
    "DOUBT",
    "DOZEN",
    "DRAFT",
    "DRAMA",
    "DREAM",
    "DRESS",
    "DRINK",
    "DRIVE",
    "EARLY",
    "EARTH",
    "EIGHT",
    "EMPTY",
    "ENEMY",
    "ENJOY",
    "ENTER",
    "ENTRY",
    "EQUAL",
    "ERROR",
    "EVENT",
    "EXACT",
    "EXIST",
    "EXTRA",
    "FAITH",
    "FALSE",
    "FAULT",
    "FIELD",
    "FIFTH",
    "FIFTY",
    "FIGHT",
    "FINAL",
    "FIRST",
    "FLOOR",
    "FORCE",
    "FORTH",
    "FORTY",
    "FORUM",
    "FOUND",
    "FRAME",
    "FRESH",
    "FRONT",
    "FRUIT",
    "FULLY",
    "FUNNY",
    "GIANT",
    "GIVEN",
    "GLASS",
    "GLOBE",
    "GRADE",
    "GRAND",
    "GRANT",
    "GRASS",
    "GREAT",
    "GREEN",
    "GROUP",
    "GROWN",
    "GUARD",
    "GUESS",
    "GUEST",
    "GUIDE",
    "HAPPY",
    "HEART",
    "HEAVY",
    "HENCE",
    "HORSE",
    "HOTEL",
    "HOUSE",
    "HUMAN",
    "IDEAL",
    "IMAGE",
    "INDEX",
    "INNER",
    "INPUT",
    "ISSUE",
  ],
  complex: [
    "ABYSS",
    "ACRID",
    "ADAGE",
    "ADEPT",
    "ADORN",
    "AEGIS",
    "AFFIX",
    "AGILE",
    "ALOOF",
    "AMASS",
    "AMPLE",
    "ANGST",
    "ANVIL",
    "APNEA",
    "ARDOR",
    "AROMA",
    "ASSAY",
    "ATONE",
    "AUGUR",
    "AVID",
    "AZURE",
    "BACON",
    "BADLY",
    "BALMY",
    "BANAL",
    "BARD",
    "BATON",
    "BAWDY",
    "BEAST",
    "BEFIT",
    "BELIE",
    "BENCH",
    "BERET",
    "BERRY",
    "BERTH",
    "BEVEL",
    "BEZEL",
    "BIDET",
    "BILLY",
    "BIRCH",
    "BISON",
    "BLARE",
    "BLAZE",
    "BLEAK",
    "BLEND",
    "BLISS",
    "BLITZ",
    "BLOOM",
    "BLUFF",
    "BLURB",
    "BLURT",
    "BOAST",
    "BOGUS",
    "BOLUS",
    "BONUS",
    "BOOST",
    "BOOTH",
    "BORAX",
    "BOSOM",
    "BOTCH",
    "BOUGH",
    "BOUND",
    "BRACE",
    "BRAID",
    "BRAKE",
    "BRAND",
    "BRAWL",
    "BREAD",
    "BREED",
    "BRICK",
    "BRIDE",
    "BRIEF",
    "BRINE",
    "BRINK",
    "BRISK",
    "BROAD",
    "BROIL",
    "BROOK",
    "BROOM",
    "BRUSH",
    "BRUTE",
    "BUDDY",
    "BUFFY",
    "BUGLE",
    "BULGE",
    "BULKY",
    "BULLY",
    "BUNCH",
    "BURNT",
    "BURST",
  ],
  extreme: [
    "XYLYL",
    "XYSTI",
    "YACHT",
    "YAHOO",
    "YEAST",
    "YIELD",
    "YOGIC",
    "YOKED",
    "YOLKY",
    "YONIS",
    "YOWLS",
    "ZAIRE",
    "ZEBEC",
    "ZEBRA",
    "ZEROS",
    "ZESTY",
    "ZIBET",
    "ZILCH",
    "ZINCY",
    "ZINGS",
    "ZINKY",
    "ZIPPY",
    "ZLOTY",
    "ZOAEA",
    "ZOCCO",
    "ZONAE",
    "ZONAL",
    "ZONED",
    "ZONER",
    "ZONES",
    "ZOOMS",
    "ZORIL",
    "ZORIS",
    "ZOUKS",
    "ZOWIE",
    "ZYMES",
    "AARGH",
    "ABACA",
    "ABACI",
    "ABACK",
    "ABAFT",
    "ABAMP",
    "ABASE",
    "ABASH",
    "ABATE",
    "ABBEY",
    "ABBOT",
    "ABEAM",
    "ABELE",
    "ABETS",
    "ABHOR",
    "ABIDE",
    "ABLED",
    "ABLES",
    "ABMHO",
    "ABODE",
    "ABOHM",
    "ABOIL",
    "ABOMA",
    "ABOON",
    "ABORT",
    "ABOUT",
    "ABOVE",
    "ABRIS",
    "ABUSE",
    "ABUTS",
    "ABUZZ",
    "ABYES",
    "ABYSM",
    "ABYSS",
    "ACAIS",
    "ACARI",
    "ACCRA",
    "ACERB",
    "ACETA",
    "ACHED",
    "ACHES",
    "ACIDS",
    "ACIDY",
    "ACING",
    "ACINI",
    "ACKEE",
    "ACME",
    "ACNED",
    "ACNES",
    "ACOCK",
    "ACOLD",
    "ACORN",
    "ACRED",
    "ACRES",
  ],
};

// Weapon Definitions
const WEAPONS = {
  pistol: {
    name: "Pixel Pistol",
    cost: 0,
    color: "#70a1ff",
    icon: "fas fa-gun",
    damage: 6,
    fireRate: 4,
    speed: 8,
    rarity: "common",
    unlocked: true,
    description: "Standard issue sidearm",
  },
  shotgun: {
    name: "Block Shotgun",
    cost: 50,
    color: "#ffa502",
    icon: "fas fa-crosshairs",
    damage: 9,
    fireRate: 2,
    speed: 6,
    rarity: "uncommon",
    unlocked: false,
    description: "Wide spread, devastating up close",
  },
  rifle: {
    name: "Retro Rifle",
    cost: 150,
    color: "#00ff9d",
    icon: "fas fa-bullseye",
    damage: 8,
    fireRate: 6,
    speed: 9,
    rarity: "rare",
    unlocked: false,
    description: "Precise and reliable",
  },
  laser: {
    name: "8-bit Laser",
    cost: 300,
    color: "#00ffff",
    icon: "fas fa-bolt",
    damage: 7,
    fireRate: 8,
    speed: 10,
    rarity: "epic",
    unlocked: false,
    description: "Instant hit, energy weapon",
  },
  plasma: {
    name: "Plasma Blaster",
    cost: 500,
    color: "#ff00ff",
    icon: "fas fa-fire",
    damage: 10,
    fireRate: 5,
    speed: 7,
    rarity: "legendary",
    unlocked: false,
    description: "High damage plasma bolts",
  },
};

// Skin Definitions
const SKINS = {
  default: {
    name: "Default Agent",
    cost: 0,
    color: "#ffffff",
    icon: "fas fa-user",
    rarity: "common",
    unlocked: true,
    description: "Standard operative uniform",
  },
  cyber: {
    name: "Cyber Ninja",
    cost: 100,
    color: "#00ffff",
    icon: "fas fa-robot",
    rarity: "uncommon",
    unlocked: false,
    description: "Advanced cybernetic enhancements",
  },
  retro: {
    name: "Retro Gamer",
    cost: 200,
    color: "#ff00ff",
    icon: "fas fa-gamepad",
    rarity: "rare",
    unlocked: false,
    description: "80s arcade style",
  },
  gold: {
    name: "Golden Typist",
    cost: 500,
    color: "#ffd700",
    icon: "fas fa-crown",
    rarity: "legendary",
    unlocked: false,
    description: "Elite golden armor",
  },
};

// Initialize Game State
async function initGameState() {
  console.log("📊 Initializing game state...");

  // Load from localStorage
  gameState.highScore = parseInt(localStorage.getItem("zts_highScore")) || 0;
  gameState.coins = parseInt(localStorage.getItem("zts_coins")) || 0;
  gameState.activeGun = localStorage.getItem("zts_activeGun") || "pistol";
  gameState.activeSkin = localStorage.getItem("zts_activeSkin") || "default";
  gameState.ownedGuns = JSON.parse(localStorage.getItem("zts_ownedGuns")) || [
    "pistol",
  ];
  gameState.ownedSkins = JSON.parse(localStorage.getItem("zts_ownedSkins")) || [
    "default",
  ];

  // Update UI with loaded values
  document.getElementById("high-score-value").textContent = formatNumber(
    gameState.highScore,
  );
  document.getElementById("shop-coins").textContent = formatNumber(
    gameState.coins,
    0,
  );
  document.getElementById("skin-shop-coins").textContent = formatNumber(
    gameState.coins,
    0,
  );

  console.log("✅ Game state initialized");
}

// Initialize Canvas
async function initCanvas() {
  console.log("🎨 Initializing canvas...");

  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");

  // Set canvas size
  canvas.width = 1200;
  canvas.height = 800;

  // Store in global scope
  window.gameCanvas = canvas;
  window.gameCtx = ctx;

  console.log("✅ Canvas initialized");
}

// Initialize UI
async function initUI() {
  console.log("🖥️ Initializing UI...");

  // Update high score display
  document.getElementById("high-score-value").textContent = formatNumber(
    gameState.highScore,
  );
  document.getElementById("stats-high-score").textContent = formatNumber(
    gameState.highScore,
  );

  // Update statistics
  updateStatisticsDisplay();

  console.log("✅ UI initialized");
}

// Initialize Audio
async function initAudio() {
  console.log("🎵 Initializing audio...");

  // Set volume from settings
  const bgMusic = document.getElementById("bg-music");
  bgMusic.volume = gameState.musicVolume * gameState.masterVolume;

  // Preload sounds
  const sounds = ["shoot-sound", "hit-sound", "coin-sound", "type-sound"];
  sounds.forEach((soundId) => {
    const audio = document.getElementById(soundId);
    audio.volume = gameState.sfxVolume * gameState.masterVolume;
  });

  console.log("✅ Audio initialized");
}

// Initialize Shops
async function initShops() {
  console.log("🏪 Initializing shops...");

  // Generate weapon shop items
  const weaponItemsContainer = document.getElementById("weapon-items");
  weaponItemsContainer.innerHTML = "";

  Object.entries(WEAPONS).forEach(([id, weapon]) => {
    const isOwned = gameState.ownedGuns.includes(id);
    const isEquipped = gameState.activeGun === id;

    const itemElement = document.createElement("div");
    itemElement.className = `shop-item ${isOwned ? "owned" : ""} ${isEquipped ? "equipped" : ""}`;
    itemElement.innerHTML = `
            <div class="item-icon" style="color: ${weapon.color}">
                <i class="${weapon.icon}"></i>
            </div>
            <div class="item-name">${weapon.name}</div>
            <div class="item-cost ${weapon.cost === 0 ? "free" : ""}">
                ${weapon.cost === 0 ? "FREE" : `<i class="fas fa-coins"></i> ${weapon.cost}`}
            </div>
            <div class="item-stats">
                <div class="item-stat">
                    <span>Damage</span>
                    <span class="item-stat-value">${weapon.damage}/10</span>
                </div>
                <div class="item-stat">
                    <span>Fire Rate</span>
                    <span class="item-stat-value">${weapon.fireRate}/10</span>
                </div>
                <div class="item-stat">
                    <span>Speed</span>
                    <span class="item-stat-value">${weapon.speed}/10</span>
                </div>
            </div>
            ${isOwned ? '<div class="item-owned">OWNED</div>' : ""}
            ${isEquipped ? '<div class="item-equipped">EQUIPPED</div>' : ""}
        `;

    itemElement.addEventListener("click", () => handleWeaponPurchase(id));
    weaponItemsContainer.appendChild(itemElement);
  });

  // Generate skin shop items
  const skinItemsContainer = document.getElementById("skin-items");
  skinItemsContainer.innerHTML = "";

  Object.entries(SKINS).forEach(([id, skin]) => {
    const isOwned = gameState.ownedSkins.includes(id);
    const isEquipped = gameState.activeSkin === id;

    const itemElement = document.createElement("div");
    itemElement.className = `shop-item ${isOwned ? "owned" : ""} ${isEquipped ? "equipped" : ""}`;
    itemElement.innerHTML = `
            <div class="item-icon" style="color: ${skin.color}">
                <i class="${skin.icon}"></i>
            </div>
            <div class="item-name">${skin.name}</div>
            <div class="item-cost ${skin.cost === 0 ? "free" : ""}">
                ${skin.cost === 0 ? "FREE" : `<i class="fas fa-coins"></i> ${skin.cost}`}
            </div>
            <div class="item-stats">
                <div class="item-stat">
                    <span>Rarity</span>
                    <span class="item-stat-value">${skin.rarity.toUpperCase()}</span>
                </div>
            </div>
            ${isOwned ? '<div class="item-owned">OWNED</div>' : ""}
            ${isEquipped ? '<div class="item-equipped">EQUIPPED</div>' : ""}
        `;

    itemElement.addEventListener("click", () => handleSkinPurchase(id));
    skinItemsContainer.appendChild(itemElement);
  });

  console.log("✅ Shops initialized");
}

// Initialize Settings
async function initSettings() {
  console.log("⚙️ Initializing settings...");

  // Load settings from localStorage or defaults
  const settings = {
    masterVolume: localStorage.getItem("zts_masterVolume") || 80,
    musicVolume: localStorage.getItem("zts_musicVolume") || 70,
    sfxVolume: localStorage.getItem("zts_sfxVolume") || 90,
    uiSounds: localStorage.getItem("zts_uiSounds") !== "false",
    particles: localStorage.getItem("zts_particles") !== "false",
    screenShake: localStorage.getItem("zts_screenShake") !== "false",
    wordSuggestions: localStorage.getItem("zts_wordSuggestions") !== "false",
    difficulty: localStorage.getItem("zts_difficulty") || "normal",
    startingHealth: localStorage.getItem("zts_startingHealth") || 3,
    waveDuration: localStorage.getItem("zts_waveDuration") || 30,
    wordComplexity: localStorage.getItem("zts_wordComplexity") || "normal",
  };

  // Apply settings to UI
  document.getElementById("master-volume").value = settings.masterVolume;
  document.getElementById("master-volume").nextElementSibling.textContent =
    `${settings.masterVolume}%`;

  document.getElementById("music-volume").value = settings.musicVolume;
  document.getElementById("music-volume").nextElementSibling.textContent =
    `${settings.musicVolume}%`;

  document.getElementById("sfx-volume").value = settings.sfxVolume;
  document.getElementById("sfx-volume").nextElementSibling.textContent =
    `${settings.sfxVolume}%`;

  document.getElementById("ui-sounds").checked = settings.uiSounds;
  document.getElementById("particles").checked = settings.particles;
  document.getElementById("screen-shake").checked = settings.screenShake;
  document.getElementById("word-suggestions").checked =
    settings.wordSuggestions;

  document.getElementById("difficulty").value = settings.difficulty;
  document.getElementById("starting-health").value = settings.startingHealth;
  document.getElementById("wave-duration").value = settings.waveDuration;
  document.getElementById("word-complexity").value = settings.wordComplexity;

  console.log("✅ Settings initialized");
}

// Set up Event Listeners
function setupEventListeners() {
  console.log("🎯 Setting up event listeners...");

  // Navigation Buttons
  document.getElementById("play-btn").addEventListener("click", startGame);
  document.getElementById("resume-btn").addEventListener("click", resumeGame);
  document.getElementById("restart-btn").addEventListener("click", restartGame);
  document
    .getElementById("pause-menu-btn")
    .addEventListener("click", showMainMenu);
  document
    .getElementById("over-menu-btn")
    .addEventListener("click", showMainMenu);
  document
    .getElementById("shop-btn")
    .addEventListener("click", () => showScreen("weapon-shop"));
  document
    .getElementById("skin-btn")
    .addEventListener("click", () => showScreen("skin-shop"));
  document
    .getElementById("how-to-btn")
    .addEventListener("click", () => showScreen("how-to-play"));
  document
    .getElementById("stats-btn")
    .addEventListener("click", () => showScreen("statistics"));
  document
    .getElementById("settings-btn")
    .addEventListener("click", () => showScreen("settings"));

  // Back buttons
  document
    .getElementById("shop-back-btn")
    .addEventListener("click", showMainMenu);
  document
    .getElementById("skin-back-btn")
    .addEventListener("click", showMainMenu);
  document
    .getElementById("tutorial-back-btn")
    .addEventListener("click", showMainMenu);
  document
    .getElementById("stats-back-btn")
    .addEventListener("click", showMainMenu);
  document
    .getElementById("settings-back-btn")
    .addEventListener("click", showMainMenu);

  // Tutorial navigation
  document
    .getElementById("prev-step")
    .addEventListener("click", prevTutorialStep);
  document
    .getElementById("next-step")
    .addEventListener("click", nextTutorialStep);

  // Settings
  document
    .getElementById("save-settings")
    .addEventListener("click", saveSettings);
  document
    .getElementById("reset-settings")
    .addEventListener("click", resetSettings);
  document
    .getElementById("reset-stats-btn")
    .addEventListener("click", resetStatistics);

  // Settings sliders
  document.querySelectorAll(".slider").forEach((slider) => {
    slider.addEventListener("input", updateSliderValue);
  });

  // Settings tabs
  document.querySelectorAll(".tab-btn").forEach((tab) => {
    tab.addEventListener("click", switchSettingsTab);
  });

  // Input handling
  const wordInput = document.getElementById("word-input");
  const wordPreview = document.getElementById("word-preview");

  wordInput.addEventListener("input", (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, "");
    wordInput.value = value.slice(0, 5);
    gameState.currentInput = value;
    wordPreview.textContent = value;

    // Update length display
    document.querySelector(".current-length").textContent = value.length;

    // Play typing sound
    if (value.length > 0 && gameState.uiSounds) {
      playSound("type-sound");
    }
  });

  wordInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && gameState.gameActive) {
      submitWord();
    } else if (e.key === "Escape") {
      if (gameState.gameActive) {
        pauseGame();
      } else if (gameState.currentScreen === "PAUSED") {
        resumeGame();
      }
    }
  });

  // Global keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    // Focus input when typing letters
    if (
      gameState.gameActive &&
      /^[a-zA-Z]$/.test(e.key) &&
      document.activeElement !== wordInput
    ) {
      wordInput.focus();
      wordInput.value = "";
      gameState.currentInput = "";
      wordPreview.textContent = "";
    }

    // Mute music with M key
    if (e.key.toLowerCase() === "m") {
      toggleMusic();
    }
  });

  console.log("✅ Event listeners set up");
}

// Game Loop
let lastFrameTime = 0;
let frameCount = 0;
let fps = 60;

function gameLoop(currentTime) {
  // Calculate delta time
  const deltaTime = Math.min((currentTime - lastFrameTime) / 1000, 0.1);
  lastFrameTime = currentTime;

  // Calculate FPS
  frameCount++;
  if (currentTime > 1000) {
    fps = Math.round((frameCount * 1000) / (currentTime - lastFrameTime));
    frameCount = 0;
  }

  // Update game state if active
  if (gameState.gameActive) {
    updateGame(deltaTime);
  }

  // Render game
  renderGame();

  // Request next frame
  requestAnimationFrame(gameLoop);
}

// Start the game loop
requestAnimationFrame(gameLoop);

// Update Game State
function updateGame(deltaTime) {
  // Update game time
  gameState.gameTime += deltaTime;

  // Update wave progress
  updateWaveProgress();

  // Spawn zombies
  spawnZombies();

  // Update game objects
  updateZombies(deltaTime);
  updateBullets(deltaTime);
  updateParticles(deltaTime);
  updateCoins(deltaTime);
  updateEffects(deltaTime);

  // Update combo system
  updateComboSystem();

  // Check for game over
  checkGameOver();
}

// Render Game
function renderGame() {
  const ctx = window.gameCtx;
  const canvas = window.gameCanvas;

  // Clear canvas
  ctx.fillStyle = "#0a0a14";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw background grid
  drawGrid();

  // Draw game objects
  drawZombies();
  drawBullets();
  drawParticles();
  drawCoins();
  drawEffects();

  // Draw player
  drawPlayer();

  // Draw wave indicator
  drawWaveIndicator();

  // Draw combo display
  if (gameState.currentCombo > 1) {
    drawComboDisplay();
  }
}

// Start Game
function startGame() {
  console.log("🚀 Starting game...");

  // Reset game state
  resetGameState();

  // Set game as active
  gameState.gameActive = true;
  gameState.currentScreen = "PLAYING";

  // Show game screen
  showScreen("PLAYING");

  // Focus input
  setTimeout(() => {
    document.getElementById("word-input").focus();
  }, 100);

  // Start wave
  startWave();

  // Update HUD
  updateHUD();

  // Play start sound
  playSound("shoot-sound");

  console.log("✅ Game started!");
}

// Pause Game
function pauseGame() {
  console.log("⏸️ Pausing game...");

  gameState.gameActive = false;
  gameState.currentScreen = "PAUSED";

  // Update pause stats
  document.getElementById("pause-wave").textContent = formatNumber(
    gameState.wave,
    2,
  );
  document.getElementById("pause-kills").textContent = gameState.zombiesKilled;
  document.getElementById("pause-coins").textContent = gameState.coins;
  document.getElementById("pause-accuracy").textContent = calculateAccuracy();

  showScreen("pause-menu");

  console.log("✅ Game paused");
}

// Resume Game
function resumeGame() {
  console.log("▶️ Resuming game...");

  gameState.gameActive = true;
  gameState.currentScreen = "PLAYING";

  showScreen("PLAYING");

  // Focus input
  setTimeout(() => {
    document.getElementById("word-input").focus();
  }, 100);

  console.log("✅ Game resumed");
}

// Restart Game
function restartGame() {
  console.log("🔄 Restarting game...");

  startGame();
}

// Show Main Menu
function showMainMenu() {
  console.log("🏠 Showing main menu...");

  gameState.gameActive = false;
  gameState.currentScreen = "MENU";

  // Update shop coin displays
  document.getElementById("shop-coins").textContent = formatNumber(
    gameState.coins,
    0,
  );
  document.getElementById("skin-shop-coins").textContent = formatNumber(
    gameState.coins,
    0,
  );

  // Update statistics
  updateStatisticsDisplay();

  showScreen("main-menu");

  console.log("✅ Main menu shown");
}

// Show Screen
function showScreen(screenName) {
  console.log(`📺 Showing screen: ${screenName}`);

  // Hide all screens
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });

  // Show requested screen
  switch (screenName) {
    case "PLAYING":
      // Game is already visible
      break;
    case "MENU":
      document.getElementById("main-menu").classList.add("active");
      break;
    case "PAUSED":
      document.getElementById("pause-menu").classList.add("active");
      break;
    case "GAME_OVER":
      document.getElementById("game-over").classList.add("active");
      break;
    case "weapon-shop":
      document.getElementById("weapon-shop").classList.add("active");
      break;
    case "skin-shop":
      document.getElementById("skin-shop").classList.add("active");
      break;
    case "how-to-play":
      document.getElementById("how-to-play").classList.add("active");
      break;
    case "statistics":
      document.getElementById("statistics").classList.add("active");
      break;
    case "settings":
      document.getElementById("settings").classList.add("active");
      break;
  }

  gameState.currentScreen = screenName;
}

// Reset Game State
function resetGameState() {
  console.log("🔄 Resetting game state...");

  gameState.score = 0;
  gameState.health = parseInt(localStorage.getItem("zts_startingHealth")) || 3;
  gameState.maxHealth = gameState.health;
  gameState.wave = 1;
  gameState.zombiesKilled = 0;
  gameState.wordsTyped = 0;
  gameState.correctWords = 0;
  gameState.currentCombo = 1;
  gameState.killStreak = 0;
  gameState.lastKillTime = 0;

  gameState.zombies = [];
  gameState.bullets = [];
  gameState.particles = [];
  gameState.coins = [];
  gameState.effects = [];
  gameState.notifications = [];

  gameState.currentInput = "";
  gameState.waveStartTime = Date.now();
  gameState.zombiesSpawned = 0;
  gameState.zombiesToSpawn = 5;
  gameState.spawnInterval = 1000;
  gameState.lastSpawnTime = 0;

  console.log("✅ Game state reset");
}

// Submit Word
function submitWord() {
  const word = gameState.currentInput.toUpperCase();

  if (word.length !== 5) {
    // Show error notification
    showNotification("Word must be 5 letters!", "error");
    return;
  }

  // Increment words typed
  gameState.wordsTyped++;

  // Check if word matches any zombie
  let zombieKilled = null;
  for (let i = gameState.zombies.length - 1; i >= 0; i--) {
    const zombie = gameState.zombies[i];
    if (zombie.word === word) {
      zombieKilled = zombie;
      gameState.zombies.splice(i, 1);
      break;
    }
  }

  if (zombieKilled) {
    // Correct word - kill zombie
    gameState.correctWords++;

    // Update combo
    const currentTime = Date.now();
    if (currentTime - gameState.lastKillTime < 5000) {
      gameState.killStreak++;
      gameState.currentCombo = Math.min(
        5,
        Math.floor(gameState.killStreak / 2) + 1,
      );
    } else {
      gameState.killStreak = 1;
      gameState.currentCombo = 1;
    }
    gameState.lastKillTime = currentTime;

    // Calculate score
    const baseScore =
      zombieKilled.type === "boss"
        ? 200
        : zombieKilled.type === "hard"
          ? 50
          : 10;
    const comboBonus = gameState.currentCombo;
    const scoreEarned = baseScore * comboBonus;

    gameState.score += scoreEarned;
    gameState.zombiesKilled++;

    // Add coins
    const coinsEarned =
      zombieKilled.type === "boss" ? 10 : zombieKilled.type === "hard" ? 3 : 1;
    gameState.coins += coinsEarned;

    // Create effects
    createKillEffect(zombieKilled);
    createCoinEffect(zombieKilled.x, zombieKilled.y, coinsEarned);

    // Create bullet
    createBullet(word, zombieKilled);

    // Play sound
    playSound(zombieKilled.type === "boss" ? "hit-sound" : "shoot-sound");

    // Show notification
    const notificationText =
      gameState.currentCombo > 1
        ? `COMBO x${gameState.currentCombo}! +${scoreEarned}`
        : `+${scoreEarned}`;
    showNotification(notificationText, "kill");
  } else {
    // Wrong word
    gameState.currentCombo = 1;
    gameState.killStreak = 0;

    // Shake input
    document.getElementById("word-input").classList.add("shake");
    setTimeout(() => {
      document.getElementById("word-input").classList.remove("shake");
    }, 300);

    // Show error notification
    showNotification("No matching zombie!", "error");
  }

  // Clear input
  document.getElementById("word-input").value = "";
  gameState.currentInput = "";
  document.getElementById("word-preview").textContent = "";
  document.querySelector(".current-length").textContent = "0";

  // Update HUD
  updateHUD();
}

// Create Bullet Effect
function createBullet(word, target) {
  const weapon = WEAPONS[gameState.activeGun];

  gameState.bullets.push({
    x: 100,
    y: 700,
    targetX: target.x,
    targetY: target.y,
    word: word,
    color: weapon.color,
    progress: 0,
    speed: 0.05 + weapon.speed * 0.005,
    trail: [],
  });
}

// Create Kill Effect
function createKillEffect(zombie) {
  const color =
    zombie.type === "boss"
      ? "#ff00ff"
      : zombie.type === "hard"
        ? "#ffa502"
        : "#70a1ff";

  // Create explosion particles
  for (let i = 0; i < 20; i++) {
    gameState.particles.push({
      x: zombie.x,
      y: zombie.y,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      size: Math.random() * 4 + 2,
      color: color,
      life: 30,
      decay: 0.9,
    });
  }

  // Create screen shake if enabled
  if (gameState.screenShake) {
    createScreenShake();
  }
}

// Create Coin Effect
function createCoinEffect(x, y, amount) {
  for (let i = 0; i < amount; i++) {
    gameState.coins.push({
      x: x + Math.random() * 30 - 15,
      y: y + Math.random() * 30 - 15,
      vx: (Math.random() - 0.5) * 4,
      vy: -2 - Math.random() * 3,
      size: 8,
      life: 60 + Math.random() * 60,
      collected: false,
    });
  }
}

// Create Screen Shake
function createScreenShake() {
  const container = document.getElementById("game-container");
  container.style.transform = "translate(5px, 5px)";

  setTimeout(() => {
    container.style.transform = "translate(-5px, -5px)";
  }, 50);

  setTimeout(() => {
    container.style.transform = "translate(0, 0)";
  }, 100);
}

// Spawn Zombies
function spawnZombies() {
  const currentTime = Date.now();

  if (
    currentTime - gameState.lastSpawnTime > gameState.spawnInterval &&
    gameState.zombiesSpawned < gameState.zombiesToSpawn
  ) {
    // Determine zombie type
    let type = "normal";
    const rand = Math.random();

    if (gameState.wave >= 3 && rand < 0.2) {
      type = "hard";
    }

    if (
      gameState.wave % 5 === 0 &&
      gameState.zombies.filter((z) => z.type === "boss").length === 0
    ) {
      type = "boss";
    }

    // Get word based on complexity
    const wordList = WORD_LISTS[gameState.wordComplexity];
    const word = wordList[Math.floor(Math.random() * wordList.length)];

    // Ensure word not already on screen
    if (gameState.zombies.some((z) => z.word === word)) {
      return;
    }

    // Create zombie
    const zombie = {
      x: 1200,
      y: 100 + Math.random() * 600,
      speed:
        (0.5 + gameState.wave * 0.1) *
        (type === "hard" ? 1.5 : type === "boss" ? 0.7 : 1),
      word: word,
      type: type,
      health: type === "boss" ? 5 : 1,
      maxHealth: type === "boss" ? 5 : 1,
      frame: Math.floor(Math.random() * 4),
      frameTime: 0,
    };

    gameState.zombies.push(zombie);
    gameState.zombiesSpawned++;
    gameState.lastSpawnTime = currentTime;

    // Update spawn interval based on wave
    gameState.spawnInterval = Math.max(300, 1000 - gameState.wave * 20);
  }
}

// Update Wave Progress
function updateWaveProgress() {
  const waveProgress = document.querySelector(".wave-progress-fill");
  const elapsed = Date.now() - gameState.waveStartTime;
  const progress = Math.min(elapsed / (gameState.waveDuration * 1000), 1);

  waveProgress.style.width = `${progress * 100}%`;

  // Check if wave should end
  if (progress >= 1 && gameState.zombies.length === 0) {
    nextWave();
  }
}

// Start Wave
function startWave() {
  gameState.waveStartTime = Date.now();
  gameState.zombiesSpawned = 0;
  gameState.zombiesToSpawn = 5 + gameState.wave * 2;

  // Show wave start notification
  showNotification(`WAVE ${gameState.wave}`, "combo");
}

// Next Wave
function nextWave() {
  gameState.wave++;
  gameState.currentCombo = 1;
  gameState.killStreak = 0;

  startWave();

  // Update HUD
  document.getElementById("wave-value").textContent = formatNumber(
    gameState.wave,
    2,
  );
  document.querySelector(".wave-number").textContent = formatNumber(
    gameState.wave,
    2,
  );
}

// Check Game Over
function checkGameOver() {
  if (gameState.health <= 0) {
    gameOver();
  }

  // Check if zombie reached player
  gameState.zombies.forEach((zombie) => {
    if (zombie.x < 50) {
      // Zombie hit player
      gameState.health--;
      createHitEffect(zombie);
      gameState.zombies.splice(gameState.zombies.indexOf(zombie), 1);

      // Update HUD
      updateHealthDisplay();

      // Show damage notification
      showNotification("ZOMBIE HIT!", "error");

      // Check game over
      if (gameState.health <= 0) {
        gameOver();
      }
    }
  });
}

// Game Over
function gameOver() {
  console.log("💀 Game Over!");

  gameState.gameActive = false;
  gameState.currentScreen = "GAME_OVER";

  // Update statistics
  gameState.totalGames++;
  gameState.totalKills += gameState.zombiesKilled;
  gameState.totalCoins += gameState.coins;
  gameState.totalWords += gameState.wordsTyped;
  gameState.playTime += Math.floor(gameState.gameTime);

  // Check for high score
  if (gameState.score > gameState.highScore) {
    gameState.highScore = gameState.score;
    localStorage.setItem("zts_highScore", gameState.highScore);
    document.getElementById("new-high-score").classList.remove("hidden");
  }

  // Update best stats
  if (gameState.score > gameState.bestScore) {
    gameState.bestScore = gameState.score;
    localStorage.setItem("zts_bestScore", gameState.bestScore);
  }

  if (gameState.wave > gameState.bestWave) {
    gameState.bestWave = gameState.wave;
    localStorage.setItem("zts_bestWave", gameState.bestWave);
  }

  if (gameState.currentCombo > gameState.bestCombo) {
    gameState.bestCombo = gameState.currentCombo;
    localStorage.setItem("zts_bestCombo", gameState.bestCombo);
  }

  // Save statistics
  saveStatistics();

  // Update game over screen
  document.getElementById("final-score").textContent = formatNumber(
    gameState.score,
  );
  document.getElementById("final-wave").textContent = formatNumber(
    gameState.wave,
    2,
  );
  document.getElementById("final-kills").textContent = gameState.zombiesKilled;
  document.getElementById("final-coins").textContent = gameState.coins;
  document.getElementById("final-accuracy").textContent = calculateAccuracy();
  document.getElementById("final-words").textContent = gameState.wordsTyped;
  document.getElementById("final-combo").textContent =
    `x${gameState.currentCombo}`;

  showScreen("game-over");

  console.log("✅ Game over screen shown");
}

// Update HUD
function updateHUD() {
  // Update score
  document.getElementById("score-value").textContent = formatNumber(
    gameState.score,
    7,
  );
  document.getElementById("coin-value").textContent = formatNumber(
    gameState.coins,
    5,
  );
  document.getElementById("wave-value").textContent = formatNumber(
    gameState.wave,
    2,
  );
  document.querySelector(".wave-number").textContent = formatNumber(
    gameState.wave,
    2,
  );

  // Update stats
  document.getElementById("kill-count").textContent = gameState.zombiesKilled;
  document.getElementById("accuracy").textContent = calculateAccuracy();
  document.getElementById("streak").textContent = gameState.killStreak;
  document.getElementById("combo-value").textContent = gameState.currentCombo;

  // Update quick stats
  document.getElementById("quick-kills").textContent = gameState.zombiesKilled;
  document.getElementById("quick-streak").textContent = gameState.killStreak;
  document.getElementById("quick-acc").textContent = calculateAccuracy();

  // Update health
  updateHealthDisplay();

  // Update weapon display
  const weapon = WEAPONS[gameState.activeGun];
  document.getElementById("weapon-icon").innerHTML =
    `<i class="${weapon.icon}"></i>`;
  document.getElementById("weapon-name").textContent = weapon.name;
  document.getElementById("weapon-icon").style.color = weapon.color;
}

// Update Health Display
function updateHealthDisplay() {
  const healthFill = document.querySelector(".health-fill");
  const healthPercent = (gameState.health / gameState.maxHealth) * 100;
  healthFill.style.width = `${healthPercent}%`;

  // Update heart icons
  const heartsContainer = document.querySelector(".health-hearts");
  heartsContainer.innerHTML = "";

  for (let i = 0; i < gameState.maxHealth; i++) {
    const heart = document.createElement("i");
    heart.className = "fas fa-heart";
    heart.style.color = i < gameState.health ? "#ff4757" : "#444";
    heartsContainer.appendChild(heart);
  }
}

// Show Notification
function showNotification(text, type = "info") {
  const notificationArea = document.getElementById("notification-area");

  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${text}</span>
    `;

  notificationArea.appendChild(notification);

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.remove();
  }, 3000);
}

// Get Notification Icon
function getNotificationIcon(type) {
  switch (type) {
    case "kill":
      return "skull-crossbones";
    case "coin":
      return "coins";
    case "combo":
      return "bolt";
    case "error":
      return "exclamation-triangle";
    default:
      return "info-circle";
  }
}

// Calculate Accuracy
function calculateAccuracy() {
  if (gameState.wordsTyped === 0) return "100%";
  const accuracy = Math.round(
    (gameState.correctWords / gameState.wordsTyped) * 100,
  );
  return `${accuracy}%`;
}

// Format Number
function formatNumber(num, digits = 0) {
  return num.toString().padStart(digits, "0");
}

// Play Sound
function playSound(soundId) {
  if (!gameState.sfxVolume) return;

  const audio = document.getElementById(soundId);
  if (audio) {
    audio.currentTime = 0;
    audio.volume = gameState.sfxVolume * gameState.masterVolume;
    audio.play().catch((e) => console.log("Audio play failed:", e));
  }
}

// Play Background Music
function playBackgroundMusic() {
  const bgMusic = document.getElementById("bg-music");
  bgMusic.volume = gameState.musicVolume * gameState.masterVolume;
  bgMusic.play().catch((e) => console.log("Background music play failed:", e));
}

// Toggle Music
function toggleMusic() {
  const bgMusic = document.getElementById("bg-music");
  if (bgMusic.paused) {
    bgMusic.play();
    showNotification("Music ON", "info");
  } else {
    bgMusic.pause();
    showNotification("Music OFF", "info");
  }
}

// Handle Weapon Purchase
function handleWeaponPurchase(weaponId) {
  const weapon = WEAPONS[weaponId];

  if (gameState.ownedGuns.includes(weaponId)) {
    // Already owned, equip it
    gameState.activeGun = weaponId;
    localStorage.setItem("zts_activeGun", weaponId);
    showNotification(`${weapon.name} equipped!`, "info");
  } else if (gameState.coins >= weapon.cost) {
    // Purchase weapon
    gameState.coins -= weapon.cost;
    gameState.ownedGuns.push(weaponId);
    gameState.activeGun = weaponId;

    // Save to localStorage
    localStorage.setItem("zts_coins", gameState.coins);
    localStorage.setItem("zts_ownedGuns", JSON.stringify(gameState.ownedGuns));
    localStorage.setItem("zts_activeGun", weaponId);

    // Update UI
    document.getElementById("shop-coins").textContent = formatNumber(
      gameState.coins,
      0,
    );
    document.getElementById("coin-value").textContent = formatNumber(
      gameState.coins,
      5,
    );

    showNotification(`${weapon.name} purchased!`, "coin");
  } else {
    // Not enough coins
    showNotification(
      `Need ${weapon.cost - gameState.coins} more coins!`,
      "error",
    );
  }

  // Refresh shop
  initShops();
}

// Handle Skin Purchase
function handleSkinPurchase(skinId) {
  const skin = SKINS[skinId];

  if (gameState.ownedSkins.includes(skinId)) {
    // Already owned, equip it
    gameState.activeSkin = skinId;
    localStorage.setItem("zts_activeSkin", skinId);
    showNotification(`${skin.name} equipped!`, "info");
  } else if (gameState.coins >= skin.cost) {
    // Purchase skin
    gameState.coins -= skin.cost;
    gameState.ownedSkins.push(skinId);
    gameState.activeSkin = skinId;

    // Save to localStorage
    localStorage.setItem("zts_coins", gameState.coins);
    localStorage.setItem(
      "zts_ownedSkins",
      JSON.stringify(gameState.ownedSkins),
    );
    localStorage.setItem("zts_activeSkin", skinId);

    // Update UI
    document.getElementById("skin-shop-coins").textContent = formatNumber(
      gameState.coins,
      0,
    );
    document.getElementById("coin-value").textContent = formatNumber(
      gameState.coins,
      5,
    );

    showNotification(`${skin.name} purchased!`, "coin");
  } else {
    // Not enough coins
    showNotification(
      `Need ${skin.cost - gameState.coins} more coins!`,
      "error",
    );
  }

  // Refresh shop
  initShops();
}

// Update Statistics Display
function updateStatisticsDisplay() {
  document.getElementById("stats-high-score").textContent = formatNumber(
    gameState.highScore,
  );
  document.getElementById("stats-total-kills").textContent =
    gameState.totalKills;
  document.getElementById("stats-total-coins").textContent =
    gameState.totalCoins;
  document.getElementById("stats-words-typed").textContent =
    gameState.totalWords;

  // Calculate accuracy
  const accuracy =
    gameState.totalWords > 0
      ? Math.round((gameState.correctWords / gameState.totalWords) * 100)
      : 100;
  document.getElementById("stats-accuracy").textContent = `${accuracy}%`;

  document.getElementById("stats-best-combo").textContent =
    `x${gameState.bestCombo}`;
  document.getElementById("stats-wpm").textContent = calculateWPM();
  document.getElementById("stats-normal-kills").textContent = "N/A"; // Would need tracking per type
  document.getElementById("stats-hard-kills").textContent = "N/A";
  document.getElementById("stats-boss-kills").textContent = "N/A";
  document.getElementById("stats-highest-wave").textContent =
    gameState.bestWave;
  document.getElementById("stats-games-played").textContent =
    gameState.totalGames;
  document.getElementById("stats-total-time").textContent = formatPlayTime(
    gameState.playTime,
  );
  document.getElementById("stats-best-session").textContent = formatNumber(
    gameState.bestScore,
  );
  document.getElementById("stats-win-rate").textContent = "N/A"; // Would need win/loss tracking
}

// Calculate WPM
function calculateWPM() {
  if (gameState.playTime === 0) return "0";
  const minutes = gameState.playTime / 60;
  const wpm = Math.round(gameState.totalWords / minutes);
  return isNaN(wpm) ? "0" : wpm.toString();
}

// Format Play Time
function formatPlayTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
}

// Save Statistics
function saveStatistics() {
  localStorage.setItem("zts_totalGames", gameState.totalGames);
  localStorage.setItem("zts_totalKills", gameState.totalKills);
  localStorage.setItem("zts_totalCoins", gameState.totalCoins);
  localStorage.setItem("zts_totalWords", gameState.totalWords);
  localStorage.setItem("zts_playTime", gameState.playTime);
}

// Reset Statistics
function resetStatistics() {
  if (
    confirm(
      "Are you sure you want to reset all statistics? This cannot be undone.",
    )
  ) {
    localStorage.removeItem("zts_totalGames");
    localStorage.removeItem("zts_totalKills");
    localStorage.removeItem("zts_totalCoins");
    localStorage.removeItem("zts_totalWords");
    localStorage.removeItem("zts_playTime");
    localStorage.removeItem("zts_bestScore");
    localStorage.removeItem("zts_bestWave");
    localStorage.removeItem("zts_bestCombo");

    // Reset in-game state
    gameState.totalGames = 0;
    gameState.totalKills = 0;
    gameState.totalCoins = 0;
    gameState.totalWords = 0;
    gameState.playTime = 0;
    gameState.bestScore = 0;
    gameState.bestWave = 1;
    gameState.bestCombo = 1;

    updateStatisticsDisplay();
    showNotification("Statistics reset!", "info");
  }
}

// Update Slider Value Display
function updateSliderValue(e) {
  const slider = e.target;
  const valueDisplay = slider.nextElementSibling;
  valueDisplay.textContent = `${slider.value}%`;
}

// Switch Settings Tab
function switchSettingsTab(e) {
  const tab = e.target;
  const tabId = tab.dataset.tab;

  // Update active tab
  document
    .querySelectorAll(".tab-btn")
    .forEach((t) => t.classList.remove("active"));
  tab.classList.add("active");

  // Show corresponding panel
  document
    .querySelectorAll(".settings-panel")
    .forEach((panel) => panel.classList.remove("active"));
  document.getElementById(`${tabId}-panel`).classList.add("active");
}

// Save Settings
function saveSettings() {
  console.log("💾 Saving settings...");

  // Get values from UI
  const settings = {
    masterVolume: document.getElementById("master-volume").value,
    musicVolume: document.getElementById("music-volume").value,
    sfxVolume: document.getElementById("sfx-volume").value,
    uiSounds: document.getElementById("ui-sounds").checked,
    particles: document.getElementById("particles").checked,
    screenShake: document.getElementById("screen-shake").checked,
    wordSuggestions: document.getElementById("word-suggestions").checked,
    difficulty: document.getElementById("difficulty").value,
    startingHealth: document.getElementById("starting-health").value,
    waveDuration: document.getElementById("wave-duration").value,
    wordComplexity: document.getElementById("word-complexity").value,
  };

  // Save to localStorage
  Object.entries(settings).forEach(([key, value]) => {
    localStorage.setItem(`zts_${key}`, value);
  });

  // Apply to game state
  gameState.masterVolume = settings.masterVolume / 100;
  gameState.musicVolume = settings.musicVolume / 100;
  gameState.sfxVolume = settings.sfxVolume / 100;
  gameState.uiSounds = settings.uiSounds;
  gameState.particlesEnabled = settings.particles;
  gameState.screenShake = settings.screenShake;
  gameState.wordSuggestions = settings.wordSuggestions;
  gameState.difficulty = settings.difficulty;
  gameState.wordComplexity = settings.wordComplexity;

  // Update audio volumes
  document.getElementById("bg-music").volume =
    gameState.musicVolume * gameState.masterVolume;

  showNotification("Settings saved!", "info");
  console.log("✅ Settings saved");
}

// Reset Settings
function resetSettings() {
  if (confirm("Reset all settings to default?")) {
    // Clear settings from localStorage
    const settingsKeys = [
      "masterVolume",
      "musicVolume",
      "sfxVolume",
      "uiSounds",
      "particles",
      "screenShake",
      "wordSuggestions",
      "difficulty",
      "startingHealth",
      "waveDuration",
      "wordComplexity",
    ];

    settingsKeys.forEach((key) => {
      localStorage.removeItem(`zts_${key}`);
    });

    // Reload settings
    initSettings();

    showNotification("Settings reset to default!", "info");
  }
}

// Tutorial Navigation
let currentTutorialStep = 1;

function prevTutorialStep() {
  if (currentTutorialStep > 1) {
    currentTutorialStep--;
    updateTutorialStep();
  }
}

function nextTutorialStep() {
  if (currentTutorialStep < 4) {
    currentTutorialStep++;
    updateTutorialStep();
  }
}

function updateTutorialStep() {
  // Update step display
  document.querySelectorAll(".step").forEach((step) => {
    step.classList.remove("active");
    if (parseInt(step.dataset.step) === currentTutorialStep) {
      step.classList.add("active");
    }
  });

  // Update indicators
  document.querySelectorAll(".indicator").forEach((indicator, index) => {
    indicator.classList.toggle("active", index + 1 === currentTutorialStep);
  });
}

// Drawing Functions (simplified for example)
function drawGrid() {
  const ctx = window.gameCtx;
  const canvas = window.gameCanvas;

  ctx.strokeStyle = "rgba(74, 74, 109, 0.1)";
  ctx.lineWidth = 1;

  // Draw vertical lines
  for (let x = 0; x < canvas.width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  // Draw horizontal lines
  for (let y = 0; y < canvas.height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function drawPlayer() {
  const ctx = window.gameCtx;
  const skin = SKINS[gameState.activeSkin];

  // Draw player at bottom left
  ctx.fillStyle = skin.color;
  ctx.fillRect(30, 700, 40, 60);

  // Draw weapon
  const weapon = WEAPONS[gameState.activeGun];
  ctx.fillStyle = weapon.color;
  ctx.fillRect(70, 720, 40, 10);
}

function drawZombies() {
  const ctx = window.gameCtx;

  gameState.zombies.forEach((zombie) => {
    // Set color based on type
    let color;
    switch (zombie.type) {
      case "hard":
        color = "#ffa502";
        break;
      case "boss":
        color = "#ff4757";
        break;
      default:
        color = "#70a1ff";
    }

    // Draw zombie body
    ctx.fillStyle = color;
    ctx.fillRect(zombie.x, zombie.y, 32, 32);

    // Draw word above
    ctx.fillStyle = "#ffffff";
    ctx.font = 'bold 14px "Press Start 2P"';
    ctx.textAlign = "center";
    ctx.fillText(zombie.word, zombie.x + 16, zombie.y - 10);

    // Draw health bar for boss
    if (zombie.type === "boss") {
      ctx.fillStyle = "#ff0000";
      ctx.fillRect(zombie.x, zombie.y - 20, 32, 4);
      ctx.fillStyle = "#00ff00";
      ctx.fillRect(
        zombie.x,
        zombie.y - 20,
        32 * (zombie.health / zombie.maxHealth),
        4,
      );
    }
  });
}

function drawBullets() {
  const ctx = window.gameCtx;

  gameState.bullets.forEach((bullet) => {
    const x = bullet.x + (bullet.targetX - bullet.x) * bullet.progress;
    const y = bullet.y + (bullet.targetY - bullet.y) * bullet.progress;

    // Draw bullet
    ctx.fillStyle = bullet.color;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();

    // Draw word
    ctx.fillStyle = "#ffffff";
    ctx.font = 'bold 10px "Press Start 2P"';
    ctx.textAlign = "center";
    ctx.fillText(bullet.word, x, y - 15);
  });
}

function drawWaveIndicator() {
  const ctx = window.gameCtx;
  const waveText = `WAVE ${gameState.wave}`;

  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(10, 10, 120, 40);

  ctx.fillStyle = "#00ff9d";
  ctx.font = 'bold 16px "Press Start 2P"';
  ctx.textAlign = "left";
  ctx.fillText(waveText, 20, 35);
}

function drawComboDisplay() {
  const ctx = window.gameCtx;
  const comboText = `COMBO x${gameState.currentCombo}`;

  ctx.fillStyle = "rgba(255, 165, 2, 0.3)";
  ctx.fillRect(500, 50, 200, 60);

  ctx.fillStyle = "#ffa502";
  ctx.font = 'bold 24px "Press Start 2P"';
  ctx.textAlign = "center";
  ctx.fillText(comboText, 600, 85);
}

// Update Functions (simplified for example)
function updateZombies(deltaTime) {
  gameState.zombies.forEach((zombie) => {
    zombie.x -= zombie.speed * 60 * deltaTime;
    zombie.frameTime += deltaTime * 60;

    if (zombie.frameTime > 10) {
      zombie.frame = (zombie.frame + 1) % 4;
      zombie.frameTime = 0;
    }
  });
}

function updateBullets(deltaTime) {
  for (let i = gameState.bullets.length - 1; i >= 0; i--) {
    const bullet = gameState.bullets[i];
    bullet.progress += bullet.speed * deltaTime * 60;

    if (bullet.progress >= 1) {
      gameState.bullets.splice(i, 1);
    }
  }
}

function updateParticles(deltaTime) {
  for (let i = gameState.particles.length - 1; i >= 0; i--) {
    const particle = gameState.particles[i];
    particle.x += particle.vx * deltaTime * 60;
    particle.y += particle.vy * deltaTime * 60;
    particle.life--;

    if (particle.life <= 0) {
      gameState.particles.splice(i, 1);
    }
  }
}

function updateCoins(deltaTime) {
  gameState.coins.forEach((coin) => {
    coin.x += coin.vx * deltaTime * 60;
    coin.y += coin.vy * deltaTime * 60;
    coin.vy += 0.5 * deltaTime * 60; // Gravity
    coin.life--;

    // Check if collected (player collision)
    if (
      !coin.collected &&
      coin.x > 30 &&
      coin.x < 70 &&
      coin.y > 700 &&
      coin.y < 760
    ) {
      coin.collected = true;
      playSound("coin-sound");
    }

    if (coin.life <= 0) {
      gameState.coins.splice(gameState.coins.indexOf(coin), 1);
    }
  });
}

function updateEffects(deltaTime) {
  // Update effects (simplified)
}

function updateComboSystem() {
  // Reset combo if too much time passed
  if (Date.now() - gameState.lastKillTime > 5000) {
    gameState.currentCombo = 1;
    gameState.killStreak = 0;
  }
}

// Create Hit Effect
function createHitEffect(zombie) {
  for (let i = 0; i < 10; i++) {
    gameState.particles.push({
      x: zombie.x,
      y: zombie.y,
      vx: (Math.random() - 0.5) * 5,
      vy: (Math.random() - 0.5) * 5,
      size: Math.random() * 3 + 1,
      color: "#ff4757",
      life: 15,
      decay: 0.8,
    });
  }
}

// Export game functions to global scope
window.gameState = gameState;
window.startGame = startGame;
window.pauseGame = pauseGame;
window.resumeGame = resumeGame;
window.showMainMenu = showMainMenu;
window.showScreen = showScreen;

console.log("🎮 Zombie Typing Shooter Ultimate Edition Ready!");
