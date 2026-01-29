// ============================================
// ZOMBIE TYPING SHOOTER - FIXED UI/UX
// Clean, Modern, User-Friendly JavaScript
// ============================================

// Game Configuration
const CONFIG = {
  // Display
  CANVAS_WIDTH: 1200,
  CANVAS_HEIGHT: 800,

  // Gameplay
  WORD_LENGTH: 5,
  PLAYER_HEALTH: 3,
  MAX_HEALTH: 5,
  BOSS_HEALTH: 5,

  // Timing
  SPAWN_INTERVAL: 2000, // ms
  WAVE_DURATION: 30000, // ms
  WAVE_ZOMBIES: 8,
  COMBO_TIMEOUT: 5000, // ms

  // Scoring
  SCORE: {
    NORMAL: 100,
    HARD: 250,
    BOSS: 1000,
    BOSS_HIT: 50,
  },

  // Coins
  COINS: {
    NORMAL: 1,
    HARD: 3,
    BOSS: 10,
  },

  // Combo Multipliers
  COMBO_MULTIPLIERS: [1, 1.5, 2, 3, 5],

  // Difficulty
  DIFFICULTY: {
    easy: { speed: 0.8, spawn: 2500, health: 4 },
    normal: { speed: 1.0, spawn: 2000, health: 3 },
    hard: { speed: 1.3, spawn: 1500, health: 2 },
  },
};

// Game State
const GameState = {
  // Current State
  currentScreen: "loading",
  gameActive: false,
  gameTime: 0,
  lastUpdate: 0,

  // Player Stats
  health: CONFIG.PLAYER_HEALTH,
  maxHealth: CONFIG.PLAYER_HEALTH,
  score: 0,
  highScore: 0,
  coins: 0,
  wave: 1,
  zombiesKilled: 0,
  wordsTyped: 0,
  wordsCorrect: 0,
  currentCombo: 1,
  maxCombo: 1,
  killStreak: 0,
  lastKillTime: 0,

  // Equipment
  activeWeapon: "pistol",
  activeSkin: "default",
  ownedWeapons: ["pistol"],
  ownedSkins: ["default"],

  // Input
  currentInput: "",
  wordMatches: [],

  // Game Objects
  zombies: [],
  bullets: [],
  particles: [],
  coins: [],
  notifications: [],

  // Wave Management
  waveStartTime: 0,
  zombiesSpawned: 0,
  zombiesToSpawn: CONFIG.WAVE_ZOMBIES,
  spawnInterval: CONFIG.SPAWN_INTERVAL,
  lastSpawnTime: 0,
  waveActive: false,

  // Settings
  masterVolume: 0.8,
  sfxVolume: 0.9,
  difficulty: "normal",
  wordHints: true,
  screenShake: true,
  particlesEnabled: true,
};

// Word Database (300+ 5-letter words)
const WORD_DATABASE = [
  "ABOUT",
  "ABOVE",
  "ABUSE",
  "ACTOR",
  "ACUTE",
  "ADAPT",
  "ADMIT",
  "ADOPT",
  "ADULT",
  "AFTER",
  "AGAIN",
  "AGENT",
  "AGREE",
  "AHEAD",
  "ALARM",
  "ALBUM",
  "ALERT",
  "ALIKE",
  "ALIVE",
  "ALLOW",
  "ALONE",
  "ALONG",
  "ALTER",
  "AMONG",
  "ANGER",
  "ANGLE",
  "ANGRY",
  "APART",
  "APPLE",
  "APPLY",
  "ARENA",
  "ARGUE",
  "ARISE",
  "ARMED",
  "ARRAY",
  "ASIDE",
  "ASSET",
  "AVOID",
  "AWARD",
  "AWARE",
  "AWFUL",
  "BADGE",
  "BASIC",
  "BASIS",
  "BEACH",
  "BEGIN",
  "BEING",
  "BELOW",
  "BENCH",
  "BILLY",
  "BIRTH",
  "BLACK",
  "BLAME",
  "BLIND",
  "BLOCK",
  "BLOOD",
  "BOARD",
  "BOOST",
  "BOOTH",
  "BRAIN",
  "BRAND",
  "BREAD",
  "BREAK",
  "BREED",
  "BRIEF",
  "BRING",
  "BROAD",
  "BROWN",
  "BUILD",
  "BUILT",
  "BUYER",
  "CABLE",
  "CARRY",
  "CATCH",
  "CAUSE",
  "CHAIN",
  "CHAIR",
  "CHART",
  "CHASE",
  "CHEAP",
  "CHECK",
  "CHEST",
  "CHIEF",
  "CHILD",
  "CHINA",
  "CHOSE",
  "CIVIL",
  "CLAIM",
  "CLASS",
  "CLEAN",
  "CLEAR",
  "CLICK",
  "CLOCK",
  "CLOSE",
  "COACH",
  "COAST",
  "COULD",
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
  "DEALT",
  "DEATH",
  "DEBUT",
  "DELAY",
  "DELTA",
  "DEPTH",
  "DIRTY",
  "DOING",
  "DONOR",
  "DOUBT",
  "DOZEN",
  "DRAFT",
  "DRAMA",
  "DRAWN",
  "DREAM",
  "DRESS",
  "DRILL",
  "DRINK",
  "DRIVE",
  "DYING",
  "EAGER",
  "EARLY",
  "EARTH",
  "EIGHT",
  "ELITE",
  "EMPTY",
  "ENEMY",
  "ENJOY",
  "ENTER",
  "ENTRY",
  "EQUAL",
  "ERROR",
  "EVENT",
  "EVERY",
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
  "FIXED",
  "FLASH",
  "FLOOR",
  "FOCUS",
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
  "GOING",
  "GRACE",
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
  "JOINT",
  "JONES",
  "JUDGE",
  "KNOWN",
  "LABEL",
  "LARGE",
  "LASER",
  "LATER",
  "LAUGH",
  "LAYER",
  "LEARN",
  "LEASE",
  "LEAST",
  "LEAVE",
  "LEGAL",
  "LEVEL",
  "LIGHT",
  "LIMIT",
  "LINKS",
  "LIVES",
  "LOCAL",
  "LOGIC",
  "LOOSE",
  "LOWER",
  "LUCKY",
  "LUNCH",
  "MAGIC",
  "MAJOR",
  "MAKER",
  "MARCH",
  "MATCH",
  "MAYBE",
  "MAYOR",
  "MEANT",
  "MEDIA",
  "METAL",
  "MIGHT",
  "MINOR",
  "MIXED",
  "MODEL",
  "MONEY",
  "MONTH",
  "MORAL",
  "MOTOR",
  "MOUNT",
  "MOUSE",
  "MOUTH",
  "MOVIE",
  "MUSIC",
  "NEEDS",
  "NEVER",
  "NEWLY",
  "NIGHT",
  "NOISE",
  "NORTH",
  "NOTED",
  "NOVEL",
  "NURSE",
  "OCCUR",
  "OCEAN",
  "OFFER",
  "OFTEN",
  "ORDER",
  "OTHER",
  "OUGHT",
  "OWNER",
  "PANEL",
  "PAPER",
  "PARTY",
  "PEACE",
  "PHASE",
  "PHONE",
  "PHOTO",
  "PIANO",
  "PIECE",
  "PILOT",
  "PITCH",
  "PLACE",
  "PLAIN",
  "PLANE",
  "PLANT",
  "PLATE",
  "POINT",
  "POUND",
  "POWER",
  "PRESS",
  "PRICE",
  "PRIDE",
  "PRIME",
  "PRINT",
  "PRIOR",
  "PRIZE",
  "PROOF",
  "PROUD",
  "PROVE",
  "QUEEN",
  "QUICK",
  "QUIET",
  "QUITE",
  "RADIO",
  "RAISE",
  "RANGE",
  "RAPID",
  "RATIO",
  "REACH",
  "READY",
  "REFER",
  "RIGHT",
  "RIVAL",
  "RIVER",
  "ROBOT",
  "ROCKY",
  "ROGER",
  "ROMAN",
  "ROUGH",
  "ROUND",
  "ROUTE",
  "ROYAL",
  "RURAL",
  "SCALE",
  "SCENE",
  "SCOPE",
  "SCORE",
  "SENSE",
  "SERVE",
  "SEVEN",
  "SHALL",
  "SHAPE",
  "SHARE",
  "SHARP",
  "SHEET",
  "SHELL",
  "SHIFT",
  "SHINE",
  "SHIRT",
  "SHOCK",
  "SHOOT",
  "SHORT",
  "SHOWN",
  "SIGHT",
  "SINCE",
  "SIXTH",
  "SIXTY",
  "SIZED",
  "SKILL",
  "SLEEP",
  "SLIDE",
  "SMALL",
  "SMART",
  "SMILE",
  "SMITH",
  "SMOKE",
  "SOLID",
  "SOLVE",
  "SORRY",
  "SOUND",
  "SOUTH",
  "SPACE",
  "SPARE",
  "SPEAK",
  "SPEED",
  "SPEND",
  "SPENT",
  "SPLIT",
  "SPOKE",
  "SPORT",
  "STAFF",
  "STAGE",
  "STAKE",
  "STAND",
  "START",
  "STATE",
  "STEAM",
  "STEEL",
  "STEEP",
  "STEER",
  "STICK",
  "STILL",
  "STOCK",
  "STONE",
  "STOOD",
  "STORE",
  "STORM",
  "STORY",
  "STRIP",
  "STUCK",
  "STUDY",
  "STUFF",
  "STYLE",
  "SUGAR",
  "SUITE",
  "SUNNY",
  "SUPER",
  "SWEET",
  "TABLE",
  "TAKEN",
  "TASTE",
  "TAXES",
  "TEACH",
  "TEETH",
  "TEXAS",
  "THANK",
  "THEFT",
  "THEIR",
  "THEME",
  "THERE",
  "THESE",
  "THICK",
  "THING",
  "THINK",
  "THIRD",
  "THOSE",
  "THREE",
  "THREW",
  "THROW",
  "TIGHT",
  "TIMER",
  "TITLE",
  "TODAY",
  "TOPIC",
  "TOTAL",
  "TOUCH",
  "TOUGH",
  "TOWER",
  "TRACK",
  "TRADE",
  "TRAIL",
  "TRAIN",
  "TREAT",
  "TREND",
  "TRIAL",
  "TRIED",
  "TRIES",
  "TRIPS",
  "TRUCK",
  "TRULY",
  "TRUST",
  "TRUTH",
  "TWICE",
  "UNDER",
  "UNION",
  "UNTIL",
  "UPPER",
  "UPSET",
  "URBAN",
  "USAGE",
  "USUAL",
  "VALID",
  "VALUE",
  "VIDEO",
  "VIEWS",
  "VISIT",
  "VITAL",
  "VOICE",
  "WAGON",
  "WAIST",
  "WASTE",
  "WATCH",
  "WATER",
  "WHEEL",
  "WHERE",
  "WHICH",
  "WHILE",
  "WHITE",
  "WHOLE",
  "WHOSE",
  "WOMAN",
  "WOMEN",
  "WORLD",
  "WORRY",
  "WORSE",
  "WORST",
  "WORTH",
  "WOULD",
  "WOUND",
  "WRITE",
  "WRONG",
  "WROTE",
  "YIELD",
  "YOUNG",
  "YOURS",
  "YOUTH",
  "ZEBRA",
];

// Weapons
const WEAPONS = {
  pistol: {
    name: "Pixel Pistol",
    cost: 0,
    owned: true,
    equipped: true,
    color: "#70a1ff",
    icon: "fas fa-gun",
    damage: 1,
    fireRate: 1,
    description: "Standard issue sidearm",
  },
  shotgun: {
    name: "Block Shotgun",
    cost: 50,
    owned: false,
    equipped: false,
    color: "#ffa502",
    icon: "fas fa-crosshairs",
    damage: 2,
    fireRate: 0.8,
    description: "Wide spread, devastating",
  },
  rifle: {
    name: "Retro Rifle",
    cost: 150,
    owned: false,
    equipped: false,
    color: "#00ff9d",
    icon: "fas fa-bullseye",
    damage: 1.5,
    fireRate: 1.5,
    description: "Precise and reliable",
  },
  laser: {
    name: "8-bit Laser",
    cost: 300,
    owned: false,
    equipped: false,
    color: "#00ffff",
    icon: "fas fa-bolt",
    damage: 1.2,
    fireRate: 2,
    description: "Instant hit energy weapon",
  },
  plasma: {
    name: "Plasma Blaster",
    cost: 500,
    owned: false,
    equipped: false,
    color: "#ff00ff",
    icon: "fas fa-fire",
    damage: 3,
    fireRate: 1,
    description: "High damage plasma bolts",
  },
};

// Skins
const SKINS = {
  default: {
    name: "Default Agent",
    cost: 0,
    owned: true,
    equipped: true,
    color: "#ffffff",
    icon: "fas fa-user",
    description: "Standard operative uniform",
  },
  cyber: {
    name: "Cyber Ninja",
    cost: 100,
    owned: false,
    equipped: false,
    color: "#00ffff",
    icon: "fas fa-robot",
    description: "Advanced cybernetic suit",
  },
  retro: {
    name: "Retro Gamer",
    cost: 200,
    owned: false,
    equipped: false,
    color: "#ff00ff",
    icon: "fas fa-gamepad",
    description: "80s arcade style",
  },
  gold: {
    name: "Golden Typist",
    cost: 500,
    owned: false,
    equipped: false,
    color: "#ffd700",
    icon: "fas fa-crown",
    description: "Elite golden armor",
  },
};

// DOM Elements
let elements = {};
let canvas, ctx;

// Initialize Game
document.addEventListener("DOMContentLoaded", () => {
  console.log("🎮 Zombie Typing Shooter - Fixed UI/UX");

  initializeGame();
});

// Initialize Game
function initializeGame() {
  initializeElements();
  loadGameData();
  setupEventListeners();

  // Start loading simulation
  simulateLoading();
}

// Initialize DOM Elements
function initializeElements() {
  // Cache elements
  elements = {
    // Game Elements
    gameContainer: document.getElementById("game-container"),
    gameCanvas: document.getElementById("game-canvas"),

    // Loading Screen
    loadingScreen: document.getElementById("loading-screen"),
    loadingBar: document.getElementById("loading-bar"),
    loadingTip: document.getElementById("loading-tip"),

    // HUD Elements
    healthBar: document.getElementById("health-bar"),
    healthHearts: document.getElementById("health-hearts"),
    scoreValue: document.getElementById("score-value"),
    waveValue: document.getElementById("wave-value"),
    coinsValue: document.getElementById("coins-value"),
    comboValue: document.getElementById("combo-value"),
    accuracyValue: document.getElementById("accuracy-value"),
    killsCount: document.getElementById("kills-count"),
    wordsCount: document.getElementById("words-count"),
    streakCount: document.getElementById("streak-count"),

    // Typing Elements
    wordInput: document.getElementById("word-input"),
    wordPreview: document.getElementById("word-preview"),
    currentLength: document.getElementById("current-length"),

    // Zombie List
    zombieList: document.getElementById("zombie-list"),
    zombieCount: document.getElementById("zombie-count"),

    // Notifications
    notificationsContainer: document.getElementById("notifications-container"),

    // Weapon Display
    weaponIcon: document.getElementById("weapon-icon"),
    weaponName: document.getElementById("weapon-name"),

    // Menus
    mainMenu: document.getElementById("main-menu"),
    pauseMenu: document.getElementById("pause-menu"),
    gameOver: document.getElementById("game-over"),
    weaponShop: document.getElementById("weapon-shop"),
    skinShop: document.getElementById("skin-shop"),
    howToPlay: document.getElementById("how-to-play"),
    settings: document.getElementById("settings"),

    // High Score
    highScoreDisplay: document.getElementById("high-score-display"),

    // Game Over Stats
    finalScoreValue: document.getElementById("final-score-value"),
    finalWaveValue: document.getElementById("final-wave-value"),
    finalKillsValue: document.getElementById("final-kills-value"),
    finalWordsValue: document.getElementById("final-words-value"),
    finalAccuracyValue: document.getElementById("final-accuracy-value"),
    finalCoinsValue: document.getElementById("final-coins-value"),
    finalComboValue: document.getElementById("final-combo-value"),
    newHighScore: document.getElementById("new-high-score"),

    // Shop Elements
    weaponShopCoins: document.getElementById("weapon-shop-coins"),
    skinShopCoins: document.getElementById("skin-shop-coins"),
    weaponItemsGrid: document.getElementById("weapon-items-grid"),
    skinItemsGrid: document.getElementById("skin-items-grid"),
    currentWeaponDisplay: document.getElementById("current-weapon-display"),
    currentSkinDisplay: document.getElementById("current-skin-display"),

    // Settings Elements
    masterVolume: document.getElementById("master-volume"),
    masterVolumeValue: document.getElementById("master-volume-value"),
    sfxVolume: document.getElementById("sfx-volume"),
    sfxVolumeValue: document.getElementById("sfx-volume-value"),
    difficulty: document.getElementById("difficulty"),
    wordHints: document.getElementById("word-hints"),
    screenShake: document.getElementById("screen-shake"),
    particles: document.getElementById("particles"),
    visualQuality: document.getElementById("visual-quality"),
    inputSensitivity: document.getElementById("input-sensitivity"),
    soundEffects: document.getElementById("sound-effects"),
  };

  // Initialize canvas
  canvas = elements.gameCanvas;
  ctx = canvas.getContext("2d");
  canvas.width = CONFIG.CANVAS_WIDTH;
  canvas.height = CONFIG.CANVAS_HEIGHT;
}

// Load Game Data
function loadGameData() {
  try {
    // Load from localStorage
    GameState.highScore = parseInt(localStorage.getItem("zts_highScore")) || 0;
    GameState.coins = parseInt(localStorage.getItem("zts_coins")) || 0;
    GameState.activeWeapon =
      localStorage.getItem("zts_activeWeapon") || "pistol";
    GameState.activeSkin = localStorage.getItem("zts_activeSkin") || "default";
    GameState.ownedWeapons = JSON.parse(
      localStorage.getItem("zts_ownedWeapons"),
    ) || ["pistol"];
    GameState.ownedSkins = JSON.parse(
      localStorage.getItem("zts_ownedSkins"),
    ) || ["default"];

    // Load settings
    GameState.masterVolume =
      parseFloat(localStorage.getItem("zts_masterVolume")) || 0.8;
    GameState.sfxVolume =
      parseFloat(localStorage.getItem("zts_sfxVolume")) || 0.9;
    GameState.difficulty = localStorage.getItem("zts_difficulty") || "normal";
    GameState.wordHints = localStorage.getItem("zts_wordHints") !== "false";
    GameState.screenShake = localStorage.getItem("zts_screenShake") !== "false";
    GameState.particlesEnabled =
      localStorage.getItem("zts_particles") !== "false";

    // Update UI with loaded values
    updateHighScore();
    elements.highScoreDisplay.textContent = GameState.highScore;

    // Update settings UI
    elements.masterVolume.value = GameState.masterVolume * 100;
    elements.masterVolumeValue.textContent = `${Math.round(GameState.masterVolume * 100)}%`;
    elements.sfxVolume.value = GameState.sfxVolume * 100;
    elements.sfxVolumeValue.textContent = `${Math.round(GameState.sfxVolume * 100)}%`;
    elements.difficulty.value = GameState.difficulty;
    elements.wordHints.checked = GameState.wordHints;
    elements.screenShake.checked = GameState.screenShake;
    elements.particles.checked = GameState.particlesEnabled;
    elements.soundEffects.checked = GameState.sfxVolume > 0;

    console.log("💾 Game data loaded");
  } catch (error) {
    console.error("Error loading game data:", error);
  }
}

// Save Game Data
function saveGameData() {
  try {
    localStorage.setItem("zts_highScore", GameState.highScore);
    localStorage.setItem("zts_coins", GameState.coins);
    localStorage.setItem("zts_activeWeapon", GameState.activeWeapon);
    localStorage.setItem("zts_activeSkin", GameState.activeSkin);
    localStorage.setItem(
      "zts_ownedWeapons",
      JSON.stringify(GameState.ownedWeapons),
    );
    localStorage.setItem(
      "zts_ownedSkins",
      JSON.stringify(GameState.ownedSkins),
    );

    localStorage.setItem("zts_masterVolume", GameState.masterVolume);
    localStorage.setItem("zts_sfxVolume", GameState.sfxVolume);
    localStorage.setItem("zts_difficulty", GameState.difficulty);
    localStorage.setItem("zts_wordHints", GameState.wordHints);
    localStorage.setItem("zts_screenShake", GameState.screenShake);
    localStorage.setItem("zts_particles", GameState.particlesEnabled);

    console.log("💾 Game data saved");
  } catch (error) {
    console.error("Error saving game data:", error);
  }
}

// Simulate Loading
function simulateLoading() {
  const tips = [
    "Loading zombie database...",
    "Initializing typing engine...",
    "Preparing pixel graphics...",
    "Loading sound effects...",
    "Almost ready to type!",
  ];

  let progress = 0;
  let tipIndex = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 10 + 5;

    // Update loading tip
    if (progress > tipIndex * 20 && tipIndex < tips.length) {
      elements.loadingTip.textContent = tips[tipIndex];
      tipIndex++;
    }

    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);

      // Loading complete
      setTimeout(() => {
        showScreen("main-menu");
        elements.loadingScreen.classList.remove("active");
        elements.gameContainer.classList.remove("hidden");
      }, 500);
    }

    elements.loadingBar.style.width = `${progress}%`;
  }, 100);
}

// Setup Event Listeners
function setupEventListeners() {
  console.log("🎯 Setting up event listeners...");

  // Game Control Buttons
  document.getElementById("start-game").addEventListener("click", startNewGame);
  document
    .getElementById("continue-game")
    .addEventListener("click", continueGame);
  document.getElementById("resume-game").addEventListener("click", resumeGame);
  document
    .getElementById("restart-game")
    .addEventListener("click", restartGame);
  document
    .getElementById("play-again-btn")
    .addEventListener("click", startNewGame);

  // Navigation Buttons
  document
    .getElementById("main-menu-btn")
    .addEventListener("click", showMainMenu);
  document
    .getElementById("game-over-menu-btn")
    .addEventListener("click", showMainMenu);
  document
    .getElementById("back-from-weapons")
    .addEventListener("click", showMainMenu);
  document
    .getElementById("back-from-skins")
    .addEventListener("click", showMainMenu);
  document
    .getElementById("back-from-tutorial")
    .addEventListener("click", showMainMenu);
  document
    .getElementById("back-from-settings")
    .addEventListener("click", showMainMenu);

  // Shop Navigation
  document
    .getElementById("weapon-shop")
    .addEventListener("click", () => showScreen("weapon-shop"));
  document
    .getElementById("skin-shop")
    .addEventListener("click", () => showScreen("skin-shop"));
  document
    .getElementById("how-to-play")
    .addEventListener("click", () => showScreen("how-to-play"));
  document
    .getElementById("settings")
    .addEventListener("click", () => showScreen("settings"));

  // Tutorial Navigation
  document
    .getElementById("prev-tutorial")
    .addEventListener("click", prevTutorialStep);
  document
    .getElementById("next-tutorial")
    .addEventListener("click", nextTutorialStep);

  // Settings
  document
    .getElementById("save-settings")
    .addEventListener("click", saveSettings);
  document
    .getElementById("reset-settings")
    .addEventListener("click", resetSettings);
  document
    .getElementById("share-score-btn")
    .addEventListener("click", shareScore);

  // Volume Sliders
  elements.masterVolume.addEventListener("input", updateVolumeDisplay);
  elements.sfxVolume.addEventListener("input", updateVolumeDisplay);

  // Word Input
  elements.wordInput.addEventListener("input", handleWordInput);
  elements.wordInput.addEventListener("keydown", handleWordKeydown);

  // Tutorial Tabs
  document.querySelectorAll(".tab-btn").forEach((tab) => {
    tab.addEventListener("click", switchSettingsTab);
  });

  // Global Keyboard Shortcuts
  document.addEventListener("keydown", handleGlobalKeydown);

  // Click to focus input
  canvas.addEventListener("click", () => {
    if (GameState.gameActive) {
      elements.wordInput.focus();
    }
  });

  console.log("✅ Event listeners set up");
}

// Show Screen
function showScreen(screenName) {
  console.log(`📺 Showing screen: ${screenName}`);

  // Hide all screens
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.classList.remove("active");
  });

  // Update game state
  GameState.currentScreen = screenName;

  // Show requested screen
  switch (screenName) {
    case "main-menu":
      updateMainMenu();
      elements.mainMenu.classList.add("active");
      break;
    case "game":
      // Game is rendered on canvas
      break;
    case "pause":
      updatePauseStats();
      elements.pauseMenu.classList.add("active");
      break;
    case "game-over":
      updateGameOverStats();
      elements.gameOver.classList.add("active");
      break;
    case "weapon-shop":
      updateWeaponShop();
      elements.weaponShop.classList.add("active");
      break;
    case "skin-shop":
      updateSkinShop();
      elements.skinShop.classList.add("active");
      break;
    case "how-to-play":
      elements.howToPlay.classList.add("active");
      break;
    case "settings":
      elements.settings.classList.add("active");
      break;
  }

  // Blur input when not in game
  if (screenName !== "game") {
    elements.wordInput.blur();
  }
}

// Update Main Menu
function updateMainMenu() {
  elements.highScoreDisplay.textContent = GameState.highScore;
}

// Update Pause Stats
function updatePauseStats() {
  document.getElementById("pause-wave-value").textContent = GameState.wave;
  document.getElementById("pause-kills-value").textContent =
    GameState.zombiesKilled;
  document.getElementById("pause-coins-value").textContent = GameState.coins;

  const accuracy =
    GameState.wordsTyped > 0
      ? Math.round((GameState.wordsCorrect / GameState.wordsTyped) * 100)
      : 100;
  document.getElementById("pause-accuracy-value").textContent = `${accuracy}%`;
}

// Update Game Over Stats
function updateGameOverStats() {
  elements.finalScoreValue.textContent = GameState.score;
  elements.finalWaveValue.textContent = GameState.wave;
  elements.finalKillsValue.textContent = GameState.zombiesKilled;
  elements.finalWordsValue.textContent = GameState.wordsTyped;

  const accuracy =
    GameState.wordsTyped > 0
      ? Math.round((GameState.wordsCorrect / GameState.wordsTyped) * 100)
      : 100;
  elements.finalAccuracyValue.textContent = `${accuracy}%`;
  elements.finalCoinsValue.textContent = GameState.coins;
  elements.finalComboValue.textContent = `x${GameState.maxCombo}`;

  // Show new high score if achieved
  if (GameState.score > GameState.highScore) {
    elements.newHighScore.style.display = "flex";
  } else {
    elements.newHighScore.style.display = "none";
  }
}

// Update Weapon Shop
function updateWeaponShop() {
  elements.weaponShopCoins.textContent = GameState.coins;

  // Update current weapon display
  const currentWeapon = WEAPONS[GameState.activeWeapon];
  elements.currentWeaponDisplay.innerHTML = `
        <div class="equipment-icon" style="color: ${currentWeapon.color}">
            <i class="${currentWeapon.icon}"></i>
        </div>
        <div class="equipment-info">
            <div class="equipment-name">${currentWeapon.name}</div>
            <div class="equipment-status">EQUIPPED</div>
        </div>
    `;

  // Clear and reload weapon grid
  elements.weaponItemsGrid.innerHTML = "";

  Object.entries(WEAPONS).forEach(([id, weapon]) => {
    const isOwned = GameState.ownedWeapons.includes(id);
    const isEquipped = GameState.activeWeapon === id;

    const item = document.createElement("div");
    item.className = `shop-item ${isOwned ? "owned" : ""} ${isEquipped ? "equipped" : ""}`;
    item.innerHTML = `
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
                    <span class="item-stat-value">${weapon.damage}/3</span>
                </div>
                <div class="item-stat">
                    <span>Fire Rate</span>
                    <span class="item-stat-value">${weapon.fireRate}/2</span>
                </div>
            </div>
            ${isOwned ? '<div class="item-owned">OWNED</div>' : ""}
            ${isEquipped ? '<div class="item-equipped">EQUIPPED</div>' : ""}
        `;

    item.addEventListener("click", () => handleWeaponPurchase(id));
    elements.weaponItemsGrid.appendChild(item);
  });
}

// Update Skin Shop
function updateSkinShop() {
  elements.skinShopCoins.textContent = GameState.coins;

  // Update current skin display
  const currentSkin = SKINS[GameState.activeSkin];
  elements.currentSkinDisplay.innerHTML = `
        <div class="equipment-icon" style="color: ${currentSkin.color}">
            <i class="${currentSkin.icon}"></i>
        </div>
        <div class="equipment-info">
            <div class="equipment-name">${currentSkin.name}</div>
            <div class="equipment-status">EQUIPPED</div>
        </div>
    `;

  // Clear and reload skin grid
  elements.skinItemsGrid.innerHTML = "";

  Object.entries(SKINS).forEach(([id, skin]) => {
    const isOwned = GameState.ownedSkins.includes(id);
    const isEquipped = GameState.activeSkin === id;

    const item = document.createElement("div");
    item.className = `shop-item ${isOwned ? "owned" : ""} ${isEquipped ? "equipped" : ""}`;
    item.innerHTML = `
            <div class="item-icon" style="color: ${skin.color}">
                <i class="${skin.icon}"></i>
            </div>
            <div class="item-name">${skin.name}</div>
            <div class="item-cost ${skin.cost === 0 ? "free" : ""}">
                ${skin.cost === 0 ? "FREE" : `<i class="fas fa-coins"></i> ${skin.cost}`}
            </div>
            ${isOwned ? '<div class="item-owned">OWNED</div>' : ""}
            ${isEquipped ? '<div class="item-equipped">EQUIPPED</div>' : ""}
        `;

    item.addEventListener("click", () => handleSkinPurchase(id));
    elements.skinItemsGrid.appendChild(item);
  });
}

// Handle Weapon Purchase
function handleWeaponPurchase(weaponId) {
  const weapon = WEAPONS[weaponId];

  if (GameState.ownedWeapons.includes(weaponId)) {
    // Already owned, equip it
    GameState.activeWeapon = weaponId;
    saveGameData();
    updateWeaponDisplay();
    showNotification(`${weapon.name} equipped!`, "info");
    updateWeaponShop();
  } else if (GameState.coins >= weapon.cost) {
    // Purchase weapon
    GameState.coins -= weapon.cost;
    GameState.ownedWeapons.push(weaponId);
    GameState.activeWeapon = weaponId;

    saveGameData();
    updateCoinsDisplay();
    updateWeaponDisplay();
    updateWeaponShop();

    showNotification(`${weapon.name} purchased!`, "coin");
  } else {
    // Not enough coins
    showNotification(
      `Need ${weapon.cost - GameState.coins} more coins!`,
      "error",
    );
  }
}

// Handle Skin Purchase
function handleSkinPurchase(skinId) {
  const skin = SKINS[skinId];

  if (GameState.ownedSkins.includes(skinId)) {
    // Already owned, equip it
    GameState.activeSkin = skinId;
    saveGameData();
    showNotification(`${skin.name} equipped!`, "info");
    updateSkinShop();
  } else if (GameState.coins >= skin.cost) {
    // Purchase skin
    GameState.coins -= skin.cost;
    GameState.ownedSkins.push(skinId);
    GameState.activeSkin = skinId;

    saveGameData();
    updateCoinsDisplay();
    updateSkinShop();

    showNotification(`${skin.name} purchased!`, "coin");
  } else {
    // Not enough coins
    showNotification(
      `Need ${skin.cost - GameState.coins} more coins!`,
      "error",
    );
  }
}

// Start New Game
function startNewGame() {
  resetGameState();
  startGame();
}

// Continue Game
function continueGame() {
  if (!GameState.gameActive) {
    startNewGame();
  } else {
    resumeGame();
  }
}

// Start Game
function startGame() {
  GameState.gameActive = true;
  GameState.currentScreen = "game";

  // Start wave
  startWave();

  // Focus input
  setTimeout(() => {
    elements.wordInput.focus();
    elements.wordInput.value = "";
    updateWordPreview();
  }, 100);

  // Start game loop
  requestAnimationFrame(gameLoop);

  // Show notification
  showNotification("Game started! Type zombie words to shoot!", "info");

  console.log("✅ Game started");
}

// Pause Game
function pauseGame() {
  GameState.gameActive = false;
  showScreen("pause");
}

// Resume Game
function resumeGame() {
  GameState.gameActive = true;
  GameState.currentScreen = "game";

  // Focus input
  setTimeout(() => {
    elements.wordInput.focus();
  }, 100);

  // Resume game loop
  requestAnimationFrame(gameLoop);
}

// Restart Game
function restartGame() {
  resetGameState();
  startGame();
}

// Show Main Menu
function showMainMenu() {
  GameState.gameActive = false;
  showScreen("main-menu");
}

// Reset Game State
function resetGameState() {
  console.log("🔄 Resetting game state...");

  // Reset stats
  GameState.health = CONFIG.PLAYER_HEALTH;
  GameState.maxHealth = CONFIG.PLAYER_HEALTH;
  GameState.score = 0;
  GameState.wave = 1;
  GameState.zombiesKilled = 0;
  GameState.wordsTyped = 0;
  GameState.wordsCorrect = 0;
  GameState.currentCombo = 1;
  GameState.maxCombo = 1;
  GameState.killStreak = 0;
  GameState.lastKillTime = 0;

  // Reset input
  GameState.currentInput = "";
  GameState.wordMatches = [];

  // Clear game objects
  GameState.zombies = [];
  GameState.bullets = [];
  GameState.particles = [];
  GameState.coins = [];
  GameState.notifications = [];

  // Reset wave
  GameState.waveStartTime = 0;
  GameState.zombiesSpawned = 0;
  GameState.zombiesToSpawn = CONFIG.WAVE_ZOMBIES;
  GameState.spawnInterval = CONFIG.SPAWN_INTERVAL;
  GameState.lastSpawnTime = 0;
  GameState.waveActive = false;

  // Update UI
  updateHealthDisplay();
  updateScoreDisplay();
  updateWaveDisplay();
  updateCoinsDisplay();
  updateComboDisplay();
  updateAccuracyDisplay();
  updateStatsDisplay();
  updateZombieList();
  updateWordPreview();

  console.log("✅ Game state reset");
}

// Start Wave
function startWave() {
  GameState.waveStartTime = Date.now();
  GameState.zombiesSpawned = 0;
  GameState.zombiesToSpawn = CONFIG.WAVE_ZOMBIES + (GameState.wave - 1) * 2;
  GameState.spawnInterval = CONFIG.DIFFICULTY[GameState.difficulty].spawn;
  GameState.waveActive = true;

  updateWaveDisplay();
  showNotification(`WAVE ${GameState.wave} STARTED!`, "warning");
}

// Spawn Zombie
function spawnZombie() {
  const now = Date.now();
  if (now - GameState.lastSpawnTime < GameState.spawnInterval) return;
  if (GameState.zombiesSpawned >= GameState.zombiesToSpawn) return;

  GameState.lastSpawnTime = now;
  GameState.zombiesSpawned++;

  // Determine zombie type
  let type = "normal";
  const rand = Math.random();

  if (GameState.wave >= 3 && rand < 0.2) {
    type = "hard";
  }

  // Spawn boss every 5 waves
  if (
    GameState.wave % 5 === 0 &&
    GameState.zombies.filter((z) => z.type === "boss").length === 0
  ) {
    type = "boss";
  }

  // Get random word
  const word = WORD_DATABASE[Math.floor(Math.random() * WORD_DATABASE.length)];

  // Check word not already in use
  if (GameState.zombies.some((z) => z.word === word)) {
    return; // Try again next frame
  }

  // Create zombie
  const zombie = {
    id: Date.now() + Math.random(),
    x: CONFIG.CANVAS_WIDTH,
    y: 100 + Math.random() * (CONFIG.CANVAS_HEIGHT - 200),
    speed: CONFIG.DIFFICULTY[GameState.difficulty].speed,
    word: word,
    type: type,
    health: type === "boss" ? CONFIG.BOSS_HEALTH : 1,
    maxHealth: type === "boss" ? CONFIG.BOSS_HEALTH : 1,
    width: type === "boss" ? 48 : 32,
    height: type === "boss" ? 48 : 32,
    lastHit: 0,
  };

  // Adjust speed for type
  if (type === "hard") zombie.speed *= 1.5;
  if (type === "boss") zombie.speed *= 0.7;

  GameState.zombies.push(zombie);
  updateZombieList();
}

// Handle Word Input
function handleWordInput(e) {
  const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, "");
  const displayValue = value.slice(0, CONFIG.WORD_LENGTH);

  elements.wordInput.value = displayValue;
  GameState.currentInput = displayValue;

  updateWordPreview();
  updateWordMatches();

  // Play typing sound
  if (displayValue.length > 0 && GameState.sfxVolume > 0) {
    playSound("type-sound");
  }
}

// Handle Word Keydown
function handleWordKeydown(e) {
  if (e.key === "Enter") {
    submitWord();
    e.preventDefault();
  } else if (e.key === "Backspace") {
    // Allow backspace
  } else if (!/[a-zA-Z]/.test(e.key)) {
    e.preventDefault();
  }
}

// Handle Global Keydown
function handleGlobalKeydown(e) {
  // Pause with ESC
  if (e.key === "Escape" && GameState.gameActive) {
    pauseGame();
    return;
  }

  // Resume with ESC from pause
  if (e.key === "Escape" && GameState.currentScreen === "pause") {
    resumeGame();
    return;
  }

  // Focus input when typing letters during gameplay
  if (
    GameState.gameActive &&
    /^[a-zA-Z]$/.test(e.key) &&
    document.activeElement !== elements.wordInput
  ) {
    elements.wordInput.focus();
  }

  // Mute with M
  if (e.key === "m" || e.key === "M") {
    toggleMute();
  }
}

// Update Word Preview
function updateWordPreview() {
  const letters = elements.wordPreview.querySelectorAll(".letter");
  const input = GameState.currentInput;

  letters.forEach((letter, index) => {
    if (index < input.length) {
      letter.textContent = input.charAt(index);
      letter.classList.add("filled");
    } else {
      letter.textContent = "";
      letter.classList.remove("filled");
    }
  });

  // Update length display
  elements.currentLength.textContent = input.length;
}

// Update Word Matches
function updateWordMatches() {
  if (!GameState.wordHints) return;

  GameState.wordMatches = GameState.zombies
    .filter((zombie) => zombie.word.startsWith(GameState.currentInput))
    .map((zombie) => zombie.word);

  updateZombieList();
}

// Submit Word
function submitWord() {
  const word = GameState.currentInput;

  if (word.length !== CONFIG.WORD_LENGTH) {
    showNotification("Word must be 5 letters!", "error");
    elements.wordInput.classList.add("shake");
    setTimeout(() => elements.wordInput.classList.remove("shake"), 300);
    return;
  }

  GameState.wordsTyped++;

  // Check for matching zombie
  let zombieKilled = null;
  let zombieIndex = -1;

  for (let i = 0; i < GameState.zombies.length; i++) {
    if (GameState.zombies[i].word === word) {
      zombieKilled = GameState.zombies[i];
      zombieIndex = i;
      break;
    }
  }

  if (zombieKilled) {
    // Correct word
    GameState.wordsCorrect++;

    // Update combo
    updateCombo();

    // Handle kill
    handleZombieKill(zombieKilled, zombieIndex);

    // Create bullet effect
    createBullet(zombieKilled);

    // Play sound
    playSound("shoot-sound");
  } else {
    // Wrong word
    resetCombo();
    showNotification("No matching zombie!", "error");
    elements.wordInput.classList.add("shake");
    setTimeout(() => elements.wordInput.classList.remove("shake"), 300);
  }

  // Clear input
  clearInput();
}

// Update Combo
function updateCombo() {
  const now = Date.now();

  if (now - GameState.lastKillTime < CONFIG.COMBO_TIMEOUT) {
    GameState.killStreak++;
    GameState.currentCombo =
      CONFIG.COMBO_MULTIPLIERS[Math.min(GameState.killStreak - 1, 4)];
  } else {
    GameState.killStreak = 1;
    GameState.currentCombo = 1;
  }

  GameState.lastKillTime = now;
  GameState.maxCombo = Math.max(GameState.maxCombo, GameState.currentCombo);

  updateComboDisplay();
}

// Reset Combo
function resetCombo() {
  GameState.killStreak = 0;
  GameState.currentCombo = 1;
  GameState.lastKillTime = 0;

  updateComboDisplay();
}

// Handle Zombie Kill
function handleZombieKill(zombie, index) {
  if (zombie.type === "boss") {
    // Boss takes damage
    zombie.health--;

    if (zombie.health <= 0) {
      // Boss killed
      GameState.zombies.splice(index, 1);
      addScore(CONFIG.SCORE.BOSS * GameState.currentCombo);
      addCoins(CONFIG.COINS.BOSS);
      GameState.zombiesKilled++;
      createKillEffect(zombie);
      showNotification(
        `BOSS KILLED! +${CONFIG.SCORE.BOSS * GameState.currentCombo}`,
        "boss",
      );
    } else {
      // Boss hit
      addScore(CONFIG.SCORE.BOSS_HIT * GameState.currentCombo);
      createHitEffect(zombie);
      showNotification(
        `BOSS HIT! ${zombie.health}/${zombie.maxHealth}`,
        "warning",
      );
      zombie.lastHit = Date.now();
    }
  } else {
    // Normal or hard zombie killed
    GameState.zombies.splice(index, 1);

    const score =
      zombie.type === "hard" ? CONFIG.SCORE.HARD : CONFIG.SCORE.NORMAL;
    const coins =
      zombie.type === "hard" ? CONFIG.COINS.HARD : CONFIG.COINS.NORMAL;

    addScore(score * GameState.currentCombo);
    addCoins(coins);
    GameState.zombiesKilled++;
    createKillEffect(zombie);

    const typeText = zombie.type === "hard" ? "HARD " : "";
    showNotification(
      `${typeText}ZOMBIE KILLED! +${score * GameState.currentCombo}`,
      "kill",
    );
  }

  updateStatsDisplay();
}

// Create Bullet
function createBullet(target) {
  const weapon = WEAPONS[GameState.activeWeapon];

  GameState.bullets.push({
    x: 50,
    y: CONFIG.CANVAS_HEIGHT - 100,
    targetX: target.x + target.width / 2,
    targetY: target.y + target.height / 2,
    color: weapon.color,
    progress: 0,
    speed: 0.05 + weapon.fireRate * 0.01,
  });
}

// Create Kill Effect
function createKillEffect(zombie) {
  // Create particles
  if (GameState.particlesEnabled) {
    for (let i = 0; i < 15; i++) {
      GameState.particles.push({
        x: zombie.x + zombie.width / 2,
        y: zombie.y + zombie.height / 2,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        size: Math.random() * 3 + 2,
        color: getZombieColor(zombie.type),
        life: 30,
        decay: 0.9,
      });
    }
  }

  // Create coins
  const coinCount =
    zombie.type === "boss"
      ? CONFIG.COINS.BOSS
      : zombie.type === "hard"
        ? CONFIG.COINS.HARD
        : CONFIG.COINS.NORMAL;
  createCoinEffect(
    zombie.x + zombie.width / 2,
    zombie.y + zombie.height / 2,
    coinCount,
  );

  // Screen shake
  if (GameState.screenShake) {
    createScreenShake();
  }

  playSound("hit-sound");
}

// Create Hit Effect
function createHitEffect(zombie) {
  if (GameState.particlesEnabled) {
    for (let i = 0; i < 8; i++) {
      GameState.particles.push({
        x: zombie.x + zombie.width / 2,
        y: zombie.y + zombie.height / 2,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        size: Math.random() * 2 + 1,
        color: getZombieColor(zombie.type),
        life: 20,
        decay: 0.8,
      });
    }
  }

  playSound("hit-sound");
}

// Create Coin Effect
function createCoinEffect(x, y, count) {
  for (let i = 0; i < count; i++) {
    GameState.coins.push({
      x: x + Math.random() * 20 - 10,
      y: y + Math.random() * 20 - 10,
      vx: (Math.random() - 0.5) * 3,
      vy: -2 - Math.random() * 2,
      size: 6,
      life: 60 + Math.random() * 60,
      collected: false,
    });
  }
}

// Create Screen Shake
function createScreenShake() {
  const container = elements.gameContainer;
  container.style.transform = "translate(3px, 3px)";

  setTimeout(() => {
    container.style.transform = "translate(-3px, -3px)";
  }, 50);

  setTimeout(() => {
    container.style.transform = "translate(0, 0)";
  }, 100);
}

// Get Zombie Color
function getZombieColor(type) {
  switch (type) {
    case "hard":
      return "#ffa502";
    case "boss":
      return "#ff4757";
    default:
      return "#70a1ff";
  }
}

// Clear Input
function clearInput() {
  elements.wordInput.value = "";
  GameState.currentInput = "";
  updateWordPreview();
  updateWordMatches();
}

// Add Score
function addScore(amount) {
  GameState.score += amount;
  updateScoreDisplay();
}

// Add Coins
function addCoins(amount) {
  GameState.coins += amount;
  updateCoinsDisplay();
}

// Update UI Displays
function updateHealthDisplay() {
  const healthPercent = (GameState.health / GameState.maxHealth) * 100;
  elements.healthBar.style.width = `${healthPercent}%`;

  // Update hearts
  elements.healthHearts.innerHTML = "";
  for (let i = 0; i < GameState.maxHealth; i++) {
    const heart = document.createElement("i");
    heart.className = "fas fa-heart";
    heart.style.color = i < GameState.health ? "#ff4757" : "#444";
    elements.healthHearts.appendChild(heart);
  }
}

function updateScoreDisplay() {
  elements.scoreValue.textContent = GameState.score.toString().padStart(7, "0");
}

function updateWaveDisplay() {
  elements.waveValue.textContent = GameState.wave.toString().padStart(2, "0");
}

function updateCoinsDisplay() {
  elements.coinsValue.textContent = GameState.coins.toString().padStart(3, "0");
}

function updateComboDisplay() {
  elements.comboValue.textContent = GameState.currentCombo;

  // Show/hide combo display
  const comboDisplay = document.getElementById("combo-display");
  if (GameState.currentCombo > 1) {
    comboDisplay.style.display = "flex";
  } else {
    comboDisplay.style.display = "none";
  }
}

function updateAccuracyDisplay() {
  const accuracy =
    GameState.wordsTyped > 0
      ? Math.round((GameState.wordsCorrect / GameState.wordsTyped) * 100)
      : 100;
  elements.accuracyValue.textContent = `${accuracy}%`;
}

function updateStatsDisplay() {
  elements.killsCount.textContent = GameState.zombiesKilled;
  elements.wordsCount.textContent = GameState.wordsTyped;
  elements.streakCount.textContent = GameState.killStreak;

  updateAccuracyDisplay();
}

function updateHighScore() {
  if (GameState.score > GameState.highScore) {
    GameState.highScore = GameState.score;
    elements.highScoreDisplay.textContent = GameState.highScore;
  }
}

function updateWeaponDisplay() {
  const weapon = WEAPONS[GameState.activeWeapon];
  elements.weaponIcon.innerHTML = `<i class="${weapon.icon}"></i>`;
  elements.weaponIcon.style.color = weapon.color;
  elements.weaponName.textContent = weapon.name;
}

function updateZombieList() {
  const zombieList = elements.zombieList;
  zombieList.innerHTML = "";

  if (GameState.zombies.length === 0) {
    zombieList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-ghost"></i>
                <p>No zombies yet.<br>Start typing to spawn!</p>
            </div>
        `;
    elements.zombieCount.textContent = "0";
    return;
  }

  elements.zombieCount.textContent = GameState.zombies.length;

  GameState.zombies.forEach((zombie) => {
    const isMatching =
      GameState.wordHints &&
      GameState.currentInput &&
      zombie.word.startsWith(GameState.currentInput);

    const item = document.createElement("div");
    item.className = `zombie-item ${isMatching ? "active" : ""}`;
    item.innerHTML = `
            <div class="zombie-type ${zombie.type}"></div>
            <div class="zombie-word">${zombie.word}</div>
            ${
              zombie.type === "boss"
                ? `<div class="zombie-health">${zombie.health}/${zombie.maxHealth}</div>`
                : ""
            }
        `;

    zombieList.appendChild(item);
  });
}

// Show Notification
function showNotification(text, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;

  let icon = "info-circle";
  switch (type) {
    case "kill":
      icon = "skull-crossbones";
      break;
    case "boss":
      icon = "crown";
      break;
    case "warning":
      icon = "exclamation-triangle";
      break;
    case "error":
      icon = "times-circle";
      break;
    case "coin":
      icon = "coins";
      break;
    case "info":
      icon = "info-circle";
      break;
  }

  notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${text}</span>
    `;

  elements.notificationsContainer.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 3000);
}

// Game Loop
let lastTime = 0;
function gameLoop(timestamp) {
  if (!GameState.gameActive) return;

  const deltaTime = Math.min((timestamp - lastTime) / 16, 2);
  lastTime = timestamp;

  // Update game state
  updateGame(deltaTime);

  // Render game
  renderGame();

  // Continue loop
  requestAnimationFrame(gameLoop);
}

// Update Game
function updateGame(deltaTime) {
  GameState.gameTime += deltaTime;

  // Update wave
  updateWaveProgress();

  // Spawn zombies
  spawnZombie();

  // Update game objects
  updateZombies(deltaTime);
  updateBullets(deltaTime);
  updateParticles(deltaTime);
  updateCoins(deltaTime);

  // Check game over
  checkGameOver();
}

// Update Wave Progress
function updateWaveProgress() {
  if (!GameState.waveActive) return;

  const elapsed = Date.now() - GameState.waveStartTime;
  const progress = elapsed / CONFIG.WAVE_DURATION;

  // Check if wave should end
  if (progress >= 1 && GameState.zombies.length === 0) {
    nextWave();
  }
}

// Next Wave
function nextWave() {
  GameState.wave++;
  resetCombo();
  startWave();
}

// Update Zombies
function updateZombies(deltaTime) {
  for (let i = GameState.zombies.length - 1; i >= 0; i--) {
    const zombie = GameState.zombies[i];

    // Move zombie
    zombie.x -= zombie.speed * deltaTime;

    // Check if zombie reached player
    if (zombie.x < 50) {
      // Zombie hits player
      GameState.health--;
      GameState.zombies.splice(i, 1);

      createHitEffect(zombie);
      updateHealthDisplay();
      updateZombieList();

      showNotification("ZOMBIE HIT!", "error");

      if (GameState.health <= 0) {
        gameOver();
      }

      continue;
    }
  }

  updateZombieList();
}

// Update Bullets
function updateBullets(deltaTime) {
  for (let i = GameState.bullets.length - 1; i >= 0; i--) {
    const bullet = GameState.bullets[i];
    bullet.progress += bullet.speed * deltaTime;

    if (bullet.progress >= 1) {
      GameState.bullets.splice(i, 1);
    }
  }
}

// Update Particles
function updateParticles(deltaTime) {
  for (let i = GameState.particles.length - 1; i >= 0; i--) {
    const particle = GameState.particles[i];

    particle.x += particle.vx * deltaTime;
    particle.y += particle.vy * deltaTime;
    particle.vy += 0.1 * deltaTime;
    particle.life--;

    if (particle.life <= 0) {
      GameState.particles.splice(i, 1);
    }
  }
}

// Update Coins
function updateCoins(deltaTime) {
  for (let i = GameState.coins.length - 1; i >= 0; i--) {
    const coin = GameState.coins[i];

    coin.x += coin.vx * deltaTime;
    coin.y += coin.vy * deltaTime;
    coin.vy += 0.2 * deltaTime;
    coin.life--;

    // Check if coin collected
    if (
      !coin.collected &&
      coin.x > 30 &&
      coin.x < 70 &&
      coin.y > CONFIG.CANVAS_HEIGHT - 120 &&
      coin.y < CONFIG.CANVAS_HEIGHT - 80
    ) {
      coin.collected = true;
      playSound("coin-sound");
    }

    if (coin.life <= 0 || coin.collected) {
      GameState.coins.splice(i, 1);
    }
  }
}

// Check Game Over
function checkGameOver() {
  if (GameState.health <= 0) {
    gameOver();
  }
}

// Game Over
function gameOver() {
  console.log("💀 Game Over!");

  GameState.gameActive = false;

  // Update high score
  updateHighScore();
  saveGameData();

  // Play sound
  playSound("game-over-sound");

  // Show game over screen
  showScreen("game-over");
}

// Render Game
function renderGame() {
  // Clear canvas
  ctx.fillStyle = "#0a0a14";
  ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

  // Draw background grid
  drawGrid();

  // Draw game objects
  drawZombies();
  drawBullets();
  drawParticles();
  drawCoins();

  // Draw player
  drawPlayer();

  // Draw wave progress
  if (GameState.waveActive) {
    drawWaveProgress();
  }
}

// Draw Grid
function drawGrid() {
  ctx.strokeStyle = "rgba(74, 74, 109, 0.1)";
  ctx.lineWidth = 1;

  // Vertical lines
  for (let x = 0; x < CONFIG.CANVAS_WIDTH; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, CONFIG.CANVAS_HEIGHT);
    ctx.stroke();
  }

  // Horizontal lines
  for (let y = 0; y < CONFIG.CANVAS_HEIGHT; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(CONFIG.CANVAS_WIDTH, y);
    ctx.stroke();
  }
}

// Draw Player
function drawPlayer() {
  const skin = SKINS[GameState.activeSkin];
  const weapon = WEAPONS[GameState.activeWeapon];

  // Draw player
  ctx.fillStyle = skin.color;
  ctx.fillRect(30, CONFIG.CANVAS_HEIGHT - 100, 40, 60);

  // Draw weapon
  ctx.fillStyle = weapon.color;
  ctx.fillRect(70, CONFIG.CANVAS_HEIGHT - 90, 30, 10);
  ctx.fillRect(95, CONFIG.CANVAS_HEIGHT - 95, 10, 20);
}

// Draw Zombies
function drawZombies() {
  GameState.zombies.forEach((zombie) => {
    // Draw zombie body
    ctx.fillStyle = getZombieColor(zombie.type);
    ctx.fillRect(zombie.x, zombie.y, zombie.width, zombie.height);

    // Draw zombie word
    drawZombieWord(zombie);

    // Draw boss health bar
    if (zombie.type === "boss") {
      drawBossHealthBar(zombie);
    }
  });
}

// Draw Zombie Word
function drawZombieWord(zombie) {
  const isMatching =
    GameState.wordHints &&
    GameState.currentInput &&
    zombie.word.startsWith(GameState.currentInput);

  // Draw word background
  ctx.fillStyle = isMatching
    ? "rgba(255, 255, 0, 0.9)"
    : "rgba(255, 255, 255, 0.9)";
  ctx.strokeStyle = isMatching ? "#ffaa00" : "#000000";
  ctx.lineWidth = 2;

  const x = zombie.x + zombie.width / 2;
  const y = zombie.y - 10;
  const textWidth = ctx.measureText(zombie.word).width;
  const padding = 10;

  // Draw rounded rectangle
  const rectX = x - textWidth / 2 - padding;
  const rectY = y - 25;
  const rectWidth = textWidth + padding * 2;
  const rectHeight = 25;

  drawRoundedRect(ctx, rectX, rectY, rectWidth, rectHeight, 5);
  ctx.fill();
  ctx.stroke();

  // Draw pointer
  ctx.beginPath();
  ctx.moveTo(x, rectY + rectHeight);
  ctx.lineTo(x - 5, rectY + rectHeight + 5);
  ctx.lineTo(x + 5, rectY + rectHeight + 5);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Draw text
  ctx.fillStyle = "#000000";
  ctx.font = 'bold 16px "Press Start 2P"';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(zombie.word, x, rectY + rectHeight / 2);
}

// Draw Boss Health Bar
function drawBossHealthBar(zombie) {
  const x = zombie.x;
  const y = zombie.y - 20;
  const width = zombie.width;
  const height = 6;

  // Background
  ctx.fillStyle = "#ff0000";
  ctx.fillRect(x, y, width, height);

  // Health
  const healthWidth = width * (zombie.health / zombie.maxHealth);
  ctx.fillStyle = "#00ff00";
  ctx.fillRect(x, y, healthWidth, height);

  // Border
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, width, height);
}

// Draw Bullets
function drawBullets() {
  GameState.bullets.forEach((bullet) => {
    const currentX = bullet.x + (bullet.targetX - bullet.x) * bullet.progress;
    const currentY = bullet.y + (bullet.targetY - bullet.y) * bullet.progress;

    // Draw trail
    ctx.strokeStyle = bullet.color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bullet.x, bullet.y);
    ctx.lineTo(currentX, currentY);
    ctx.stroke();

    // Draw bullet
    ctx.fillStyle = bullet.color;
    ctx.beginPath();
    ctx.arc(currentX, currentY, 4, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Draw Particles
function drawParticles() {
  if (!GameState.particlesEnabled) return;

  GameState.particles.forEach((particle) => {
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Draw Coins
function drawCoins() {
  GameState.coins.forEach((coin) => {
    // Draw coin
    ctx.fillStyle = "#ffd700";
    ctx.beginPath();
    ctx.arc(coin.x, coin.y, coin.size, 0, Math.PI * 2);
    ctx.fill();

    // Draw coin detail
    ctx.fillStyle = "#ccaa00";
    ctx.beginPath();
    ctx.arc(coin.x, coin.y, coin.size * 0.6, 0, Math.PI * 2);
    ctx.fill();

    // Draw $ symbol
    ctx.fillStyle = "#ffffff";
    ctx.font = 'bold 10px "Press Start 2P"';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("$", coin.x, coin.y);
  });
}

// Draw Wave Progress
function drawWaveProgress() {
  const elapsed = Date.now() - GameState.waveStartTime;
  const progress = elapsed / CONFIG.WAVE_DURATION;
  const width = 200;
  const height = 10;
  const x = CONFIG.CANVAS_WIDTH - width - 20;
  const y = 20;

  // Draw background
  ctx.fillStyle = "#4a4a6d";
  ctx.fillRect(x, y, width, height);

  // Draw progress
  ctx.fillStyle = "#00ff9d";
  ctx.fillRect(x, y, width * progress, height);

  // Draw border
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);

  // Draw text
  ctx.fillStyle = "#ffffff";
  ctx.font = '10px "Press Start 2P"';
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  ctx.fillText(`WAVE ${GameState.wave}`, x - 10, y);
}

// Draw Rounded Rectangle
function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// Play Sound
function playSound(soundId) {
  if (GameState.sfxVolume === 0) return;

  const audio = document.getElementById(soundId);
  if (audio) {
    audio.volume = GameState.sfxVolume;
    audio.currentTime = 0;
    audio.play().catch((e) => {
      // Silently handle autoplay restrictions
    });
  }
}

// Toggle Mute
function toggleMute() {
  GameState.sfxVolume = GameState.sfxVolume === 0 ? 0.9 : 0;
  elements.sfxVolume.value = GameState.sfxVolume * 100;
  elements.sfxVolumeValue.textContent = `${Math.round(GameState.sfxVolume * 100)}%`;

  showNotification(
    GameState.sfxVolume === 0 ? "Sound muted" : "Sound unmuted",
    "info",
  );
}

// Update Volume Display
function updateVolumeDisplay() {
  elements.masterVolumeValue.textContent = `${elements.masterVolume.value}%`;
  elements.sfxVolumeValue.textContent = `${elements.sfxVolume.value}%`;
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
  GameState.masterVolume = elements.masterVolume.value / 100;
  GameState.sfxVolume = elements.sfxVolume.value / 100;
  GameState.difficulty = elements.difficulty.value;
  GameState.wordHints = elements.wordHints.checked;
  GameState.screenShake = elements.screenShake.checked;
  GameState.particlesEnabled = elements.particles.checked;

  saveGameData();
  showNotification("Settings saved!", "info");
}

// Reset Settings
function resetSettings() {
  if (confirm("Reset all settings to default?")) {
    // Reset to defaults
    GameState.masterVolume = 0.8;
    GameState.sfxVolume = 0.9;
    GameState.difficulty = "normal";
    GameState.wordHints = true;
    GameState.screenShake = true;
    GameState.particlesEnabled = true;

    // Update UI
    elements.masterVolume.value = 80;
    elements.masterVolumeValue.textContent = "80%";
    elements.sfxVolume.value = 90;
    elements.sfxVolumeValue.textContent = "90%";
    elements.difficulty.value = "normal";
    elements.wordHints.checked = true;
    elements.screenShake.checked = true;
    elements.particles.checked = true;
    elements.soundEffects.checked = true;

    showNotification("Settings reset to default!", "info");
  }
}

// Share Score
function shareScore() {
  const text = `I scored ${GameState.score} points in Zombie Typing Shooter! Can you beat my score?`;

  if (navigator.share) {
    navigator
      .share({
        title: "Zombie Typing Shooter Score",
        text: text,
        url: window.location.href,
      })
      .catch(console.error);
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard
      .writeText(text)
      .then(() => {
        showNotification("Score copied to clipboard!", "info");
      })
      .catch(console.error);
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
  document.querySelectorAll(".tutorial-section").forEach((section) => {
    section.classList.remove("active");
    if (
      parseInt(section.querySelector(".section-number").textContent) ===
      currentTutorialStep
    ) {
      section.classList.add("active");
    }
  });

  // Update indicators
  document.querySelectorAll(".indicator").forEach((indicator, index) => {
    indicator.classList.toggle("active", index + 1 === currentTutorialStep);
  });
}

// Export for debugging
window.GameState = GameState;
window.startGame = startGame;
window.pauseGame = pauseGame;
window.showScreen = showScreen;

console.log("✅ Zombie Typing Shooter - Fixed UI/UX Ready!");
