// app.js
// Area Autore - Abisso Infinito
// Offline: usa localStorage.
// Online: usa Supabase con le tabelle dedicate author_* definite in supabase-author-schema.sql.

const chapterAssets = window.AuthorChapterAssets || null;

const cfg = window.AUTHOR_CONFIG || {};
const tableNames = {
  allowedUsers: cfg.TABLES?.allowedUsers || "author_allowed_users",
  texts: cfg.TABLES?.texts || "author_chapter_texts",
  blocks: cfg.TABLES?.blocks || "author_chapter_blocks",
  versions: cfg.TABLES?.versions || "author_text_versions",
  comments: cfg.TABLES?.comments || "author_comments",
  questTexts: cfg.TABLES?.questTexts || "author_quest_texts",
  questVersions: cfg.TABLES?.questVersions || "author_quest_text_versions",
  publishedQuestTexts:
    cfg.TABLES?.publishedQuestTexts || "author_published_quest_texts",
  weaponTexts: cfg.TABLES?.weaponTexts || "author_weapon_texts",
  weaponVersions: cfg.TABLES?.weaponVersions || "author_weapon_text_versions",
  publishedWeaponTexts:
    cfg.TABLES?.publishedWeaponTexts || "author_published_weapon_texts",
  creatureTexts: cfg.TABLES?.creatureTexts || "author_creature_texts",
  creatureVersions: cfg.TABLES?.creatureVersions || "author_creature_text_versions",
  publishedCreatureTexts:
    cfg.TABLES?.publishedCreatureTexts || "author_published_creature_texts",
  zoneGuardianTexts:
    cfg.TABLES?.zoneGuardianTexts || "author_zone_guardian_texts",
  zoneGuardianVersions:
    cfg.TABLES?.zoneGuardianVersions || "author_zone_guardian_text_versions",
  publishedZoneGuardianTexts:
    cfg.TABLES?.publishedZoneGuardianTexts || "author_published_zone_guardian_texts",
  fragmentTexts: cfg.TABLES?.fragmentTexts || "author_fragment_texts",
  fragmentVersions:
    cfg.TABLES?.fragmentVersions || "author_fragment_text_versions",
  publishedFragmentTexts:
    cfg.TABLES?.publishedFragmentTexts || "author_published_fragment_texts",
  modalTexts: cfg.TABLES?.modalTexts || "author_modal_texts",
  modalVersions:
    cfg.TABLES?.modalVersions || "author_modal_text_versions",
  publishedModalTexts:
    cfg.TABLES?.publishedModalTexts || "author_published_modal_texts",
  playerTexts: cfg.TABLES?.playerTexts || "author_player_texts",
  playerVersions:
    cfg.TABLES?.playerVersions || "author_player_text_versions",
  publishedPlayerTexts:
    cfg.TABLES?.publishedPlayerTexts || "author_published_player_texts"
};

const cellRulesConfig = window.AbissoCellRulesConfig;
const CELL_RULES = cellRulesConfig?.CELL_RULES || {};

const playerBackgroundsConfig = window.AbissoPlayerBackgroundsConfig || null;
const PLAYER_BACKGROUND_RULES =
  playerBackgroundsConfig?.PLAYER_BACKGROUND_RULES || {};

const AUTHOR_RULES = {
  ...CELL_RULES,
  ...PLAYER_BACKGROUND_RULES
};

const chapterCategoriesConfig = window.AuthorChapterCategories || null;

const BASE_CATEGORY_DEFINITIONS = chapterCategoriesConfig?.categories || [
  { key: "all", label: "Tutti" },
  { key: "luoghi", label: "Luoghi" },
  { key: "mostri", label: "Mostri" },
  { key: "bande", label: "Bande" },
  { key: "eventi", label: "Eventi" },
  { key: "poteri", label: "Poteri" },
  { key: "altro", label: "Altro" }
];

const CATEGORY_DEFINITIONS = [
  ...BASE_CATEGORY_DEFINITIONS.filter((category) => {
    return category.key !== "giocatori";
  }),
  { key: "giocatori", label: "Giocatori" }
];

let activeChapterCategory =
  localStorage.getItem("author_active_chapter_category") || "all";

const CHAPTERS = Object.entries(AUTHOR_RULES)
  .map(([key, value]) => {
    const source = value && typeof value === "object" ? value : {};

    const baseChapter = {
      ...source,
      key,
      title: source.title || key,
      intro: source.intro || "",
      sections: Array.isArray(source.sections) ? source.sections : [],
      official: source
    };

    const category = getChapterCategoryMeta(baseChapter);

    return {
      ...baseChapter,
      categoryKey: category.key,
      categoryLabel: category.label
    };
  })
  .sort((a, b) => {
    const categoryA = String(a.categoryLabel || "").toLocaleLowerCase("it-IT");
    const categoryB = String(b.categoryLabel || "").toLocaleLowerCase("it-IT");

    const categoryCompare = categoryA.localeCompare(categoryB, "it-IT", {
      sensitivity: "base",
      numeric: true
    });

    if (categoryCompare !== 0) {
      return categoryCompare;
    }

    const titleA = String(a.title || a.key || "").toLocaleLowerCase("it-IT");
    const titleB = String(b.title || b.key || "").toLocaleLowerCase("it-IT");

    return titleA.localeCompare(titleB, "it-IT", {
      sensitivity: "base",
      numeric: true
    });
  })
  .map((chapter, index) => ({
    ...chapter,
    number: index + 1
  }));

  window.AUTHOR_DEBUG = {
  AUTHOR_RULES,
  PLAYER_BACKGROUND_RULES,
  CHAPTERS,
  CATEGORY_DEFINITIONS
};

let supabaseClient = null;
let useSupabase = false;
let currentChapter = CHAPTERS[0] || null;
let currentAuthorTextFromDb = "";
let currentAuthorBlocksFromDb = new Map();
let blockStatusTimers = new Map();
let activeBlockSaveKeys = new Set();
let lastLocalAuthorSaveAt = 0;
let pendingBlockStatuses = new Map();
let activeLoadId = 0;
let liveReloadTimer = null;
let lastAuthorEditorInputAt = 0;
let currentAllowedUser = null;
let realtimeChannel = null;
const questCatalog = window.AbissoQuestTextCatalog || { units: [], sources: [] };
let currentQuestUnit = questCatalog.units?.[0] || null;
let currentQuestRows = new Map();
let currentPublishedQuestRows = new Map();
let questLoadId = 0;
const weaponCatalog = window.AuthorWeaponsCatalog || {
  weapons: [],
  characters: []
};
let currentWeapon = weaponCatalog.weapons?.[0] || null;
let currentWeaponRows = new Map();
let currentPublishedWeaponRows = new Map();
let weaponLoadId = 0;
const creatureCatalog = window.AuthorCreaturesCatalog || {
  creatures: [],
  elements: []
};
let currentCreature = creatureCatalog.creatures?.[0] || null;
let currentCreatureRows = new Map();
let currentPublishedCreatureRows = new Map();
let creatureLoadId = 0;
const zoneGuardianCatalog = window.AuthorZoneGuardiansCatalog || {
  guardians: [],
  maps: []
};
let currentZoneGuardian = zoneGuardianCatalog.guardians?.[0] || null;
let currentZoneGuardianRows = new Map();
let currentPublishedZoneGuardianRows = new Map();
let zoneGuardianLoadId = 0;
const fragmentCatalog = window.AuthorFragmentsCatalog || {
  fragments: [],
  classes: []
};
let currentFragment = fragmentCatalog.fragments?.[0] || null;
let currentFragmentRows = new Map();
let currentPublishedFragmentRows = new Map();
let fragmentLoadId = 0;
const baseModalTextCatalog = window.AuthorModalTextsCatalog || {
  units: [],
  modals: []
};
const botNarrativeCatalog = window.AuthorBotNarrativesCatalog || {
  bots: [],
  actions: [],
  units: []
};
const botNarrativeModalId = "bot_narratives";
const modalTextCatalog = {
  ...baseModalTextCatalog,
  units: [...(baseModalTextCatalog.units || []), ...(botNarrativeCatalog.units || [])],
  modals: baseModalTextCatalog.modals || []
};
const playerCatalog = window.AuthorPlayerNonaOraCatalog || {
  players: [],
  fields: []
};
let currentPlayer = playerCatalog.players?.[0] || null;
let currentPlayerRows = new Map();
let currentPublishedPlayerRows = new Map();
let playerLoadId = 0;

const customEventObjectModalId = "custom_event_objects";
let currentModalText =
  getRegularModalTextUnits()[0] || modalTextCatalog.units?.[0] || null;
let currentCustomEventObjectText = getCustomEventObjectTextUnits()[0] || null;
let currentBotNarrativeText = botNarrativeCatalog.units?.[0] || null;
let currentModalTextRows = new Map();
let currentPublishedModalTextRows = new Map();
let modalTextLoadId = 0;
let activeModalTextContext = "modals";
let activeModalTextKey = currentModalText?.textKey || "";

document.addEventListener("DOMContentLoaded", async () => {
  bindSearch();
  bindCategoryFilter();
  bindCommentDraft();
  bindGlobalActionButtons();
  bindQuestWorkspace();
  bindWeaponWorkspace();
  bindCreatureWorkspace();
  bindZoneGuardianWorkspace();
  bindFragmentWorkspace();
  bindModalTextWorkspace();
  bindCustomEventObjectWorkspace();
  bindBotNarrativeWorkspace();
  bindPlayerWorkspace();

  useSupabase = shouldUseSupabase();

  if (useSupabase) {
    supabaseClient = window.supabase.createClient(
      cfg.SUPABASE_URL,
      cfg.SUPABASE_PUBLISHABLE_KEY
    );

    const { data } = await supabaseClient.auth.getSession();

    if (data.session) {
      await enterApp(data.session.user);
    } else {
      showLogin();
    }

    supabaseClient.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await enterApp(session.user);
      } else {
        showLogin();
      }
    });

    return;
  }

  enterLocalApp();
});

function getCurrentChapterKey(chapter) {
  return String(
    chapter?.key ||
    chapter?.id ||
    currentChapter?.key ||
    currentChapter?.id ||
    ""
  ).trim();
}

function getChapterVisualAsset(chapter) {
  const chapterKey = getCurrentChapterKey(chapter);

  if (chapterKey && chapterAssets?.get) {
    const asset = chapterAssets.get(chapterKey);

    if (asset?.imageUrl) {
      return asset;
    }
  }

  if (chapter?.imageUrl) {
    return {
      imageUrl: chapter.imageUrl,
      caption: chapter.caption || chapter.title || ""
    };
  }

  return null;
}

function renderChapterVisual(chapter) {
  const box = document.getElementById("chapterVisual");
  const img = document.getElementById("chapterVisualImg");
  const caption = document.getElementById("chapterVisualCaption");

  if (!box || !img || !caption) return;

  const asset = getChapterVisualAsset(chapter);

  if (!asset?.imageUrl) {
    box.classList.add("hidden");
    img.removeAttribute("src");
    img.alt = "";
    caption.textContent = "";
    return;
  }

  img.src = asset.imageUrl;
  img.alt = chapter?.title || "Immagine capitolo";
  caption.textContent = asset.caption || chapter?.title || "";

  box.classList.remove("hidden");
}

function shouldUseSupabase() {
  if (new URLSearchParams(window.location.search).get("offline") === "1") {
    return false;
  }

  if (cfg.USE_LOCAL_MODE === true) return false;

  return Boolean(
    window.supabase?.createClient &&
    cfg.SUPABASE_URL &&
    cfg.SUPABASE_PUBLISHABLE_KEY
  );
}

function getChapterCategoryMeta(chapter) {
  const directCategoryKey = String(
    chapter?.categoryKey ||
    chapter?.category ||
    ""
  ).trim();

  if (directCategoryKey) {
    const directCategory = CATEGORY_DEFINITIONS.find((item) => {
      return item.key === directCategoryKey;
    });

    if (directCategory) {
      return directCategory;
    }

    return {
      key: directCategoryKey,
      label: chapter?.categoryLabel || directCategoryKey
    };
  }

  if (chapterCategoriesConfig?.getCategory) {
    return chapterCategoriesConfig.getCategory(chapter);
  }

  return CATEGORY_DEFINITIONS.find((item) => item.key === "altro") || {
    key: "altro",
    label: "Altro"
  };
}

function bindCategoryFilter() {
  renderCategoryFilter();

  const select = document.getElementById("chapterCategoryFilter");

  if (!select) return;

  select.addEventListener("change", () => {
    activeChapterCategory = select.value || "all";

    localStorage.setItem(
      "author_active_chapter_category",
      activeChapterCategory
    );

    renderChapters();
  });
}

function renderCategoryFilter() {
  const select = document.getElementById("chapterCategoryFilter");

  if (!select) return;

  const existingCategories = new Set(
    CHAPTERS.map((chapter) => chapter.categoryKey || "altro")
  );

  const categoriesToShow = CATEGORY_DEFINITIONS.filter((category) => {
    return category.key === "all" || existingCategories.has(category.key);
  });

  const hasActiveCategory = categoriesToShow.some((category) => {
    return category.key === activeChapterCategory;
  });

  if (!hasActiveCategory) {
    activeChapterCategory = "all";
  }

  select.innerHTML = categoriesToShow.map((category) => {
    const count = category.key === "all"
      ? CHAPTERS.length
      : CHAPTERS.filter((chapter) => chapter.categoryKey === category.key).length;

    return `
      <option value="${escapeHtml(category.key)}">
        ${escapeHtml(category.label)} (${count})
      </option>
    `;
  }).join("");

  select.value = activeChapterCategory;
}

function bindSearch() {
  const search = document.getElementById("chapterSearch");
  if (search) search.addEventListener("input", renderChapters);
}

function bindCommentDraft() {
  const textarea = document.getElementById("newComment");

  if (!textarea) return;

  textarea.addEventListener("input", () => {
    if (!currentChapter) return;

    localStorage.setItem(
      getCommentDraftKey(currentChapter.key),
      textarea.value
    );
  });
}

function bindGlobalActionButtons() {
  const actions = [
    ["loginBtn", loginUser],
    ["logoutBtn", logoutUser],
    ["saveUserBtn", saveUser],
    ["saveAuthorTextBtn", saveAuthorText],
    ["addCommentBtn", () => addComment()]
  ];

  actions.forEach(([id, handler]) => {
    const button = document.getElementById(id);

    if (!button || button.dataset.bound === "1") return;

    button.dataset.bound = "1";

    button.addEventListener("click", (event) => {
      event.preventDefault();
      handler();
    });
  });
}

function getTextStorageKey(chapterKey) {
  return `author_text_${chapterKey}`;
}

function getBlocksStorageKey(chapterKey) {
  return `author_blocks_${chapterKey}`;
}

function getVersionsStorageKey(chapterKey) {
  return `author_versions_${chapterKey}`;
}

function getCommentsStorageKey(chapterKey) {
  return `author_comments_${chapterKey}`;
}

function getBlockCommentsStorageKey(chapterKey) {
  return `author_block_comments_${chapterKey}`;
}

function getCommentDraftKey(chapterKey) {
  return `author_comment_draft_${chapterKey}`;
}

function saveCurrentCommentDraft() {
  const textarea = document.getElementById("newComment");

  if (!textarea || !currentChapter) return;

  localStorage.setItem(
    getCommentDraftKey(currentChapter.key),
    textarea.value
  );
}

function loadCommentDraftForChapter(chapter) {
  const textarea = document.getElementById("newComment");

  if (!textarea || !chapter) return;

  textarea.value =
    localStorage.getItem(getCommentDraftKey(chapter.key)) || "";

  textarea.placeholder = `Scrivi un commento su "${chapter.title}"...`;
}

function setCommentTarget(chapter) {
  const target = document.getElementById("commentTarget");

  if (!target || !chapter) return;

  target.textContent =
    `I commenti qui sotto riguardano solo: ${String(chapter.number).padStart(2, "0")} - ${chapter.title}`;
}

async function loginUser() {
  if (!useSupabase || !supabaseClient) {
    enterLocalApp();
    return;
  }

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    showLoginMessage("Inserisci email e password", "error");
    return;
  }

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    showLoginMessage("Accesso non riuscito: " + error.message, "error");
  }
}

async function logoutUser() {
  if (useSupabase && supabaseClient) {
    await supabaseClient.auth.signOut();
    return;
  }

  showLogin();
}

async function enterApp(user) {
  const { data, error } = await supabaseClient
    .from(tableNames.allowedUsers)
    .select("*")
    .ilike("email", user.email)
    .maybeSingle();

  if (error || !data) {
    await supabaseClient.auth.signOut();
    showLoginMessage("Email non autorizzata", "error");
    return;
  }

  currentAllowedUser = data;

  localStorage.setItem("author_user_name", data.display_name || user.email);
  localStorage.setItem("author_user_role", data.role || "Autore");

  loadUser();

  document.getElementById("loginView").classList.add("hidden");
  document.getElementById("appView").classList.remove("hidden");

  renderChapters();

  if (currentChapter) {
    await selectChapter(currentChapter);
  }

  startRealtime();
}

function enterLocalApp() {
  currentAllowedUser = {
    email: "offline@local",
    display_name: localStorage.getItem("author_user_name") || "Utente locale",
    role: localStorage.getItem("author_user_role") || "Autore"
  };

  localStorage.setItem("author_user_name", currentAllowedUser.display_name);
  localStorage.setItem("author_user_role", currentAllowedUser.role);

  loadUser();

  document.getElementById("loginView").classList.add("hidden");
  document.getElementById("appView").classList.remove("hidden");

  renderChapters();

  if (currentChapter) {
    selectChapter(currentChapter);
  }
}

function showLogin() {
  document.getElementById("appView").classList.add("hidden");

  if (useSupabase) {
    document.getElementById("loginView").classList.remove("hidden");
  } else {
    document.getElementById("loginView").classList.add("hidden");
  }

  currentAllowedUser = null;

  if (realtimeChannel && supabaseClient) {
    supabaseClient.removeChannel(realtimeChannel);
    realtimeChannel = null;
  }
}

function showLoginMessage(message, type = "") {
  const el = document.getElementById("loginMessage");
  if (!el) return;

  el.textContent = message;
  el.className = `status ${type}`.trim();
}

function saveUser() {
  const name = document.getElementById("userName").value.trim();
  const role = document.getElementById("userRole").value;

  if (!name) {
    alert("Inserisci il tuo nome");
    return;
  }

  localStorage.setItem("author_user_name", name);
  localStorage.setItem("author_user_role", role);

  alert("Utente salvato");
}

function loadUser() {
  document.getElementById("userName").value =
    localStorage.getItem("author_user_name") || "";

  document.getElementById("userRole").value =
    localStorage.getItem("author_user_role") || "Autore";
}

function getUser() {
  const fallbackName =
    currentAllowedUser?.display_name ||
    currentAllowedUser?.email ||
    "Utente";

  return {
    name:
      document.getElementById("userName").value.trim() ||
      localStorage.getItem("author_user_name") ||
      fallbackName,
    role:
      document.getElementById("userRole").value ||
      localStorage.getItem("author_user_role") ||
      currentAllowedUser?.role ||
      "Autore"
  };
}

function renderChapters() {
  const container = document.getElementById("chaptersList");
  const query = document.getElementById("chapterSearch")?.value.trim().toLowerCase() || "";

  if (!container) return;

  container.innerHTML = "";

  const chapters = CHAPTERS.filter((chapter) => {
    const haystack = `${chapter.key} ${chapter.title} ${chapter.intro} ${chapter.categoryLabel}`.toLowerCase();

    const matchesSearch = haystack.includes(query);

    const matchesCategory =
      activeChapterCategory === "all" ||
      chapter.categoryKey === activeChapterCategory;

    return matchesSearch && matchesCategory;
  });

  if (!chapters.length) {
    container.innerHTML = `<p class="empty">Nessun capitolo trovato in questa categoria.</p>`;
    return;
  }

  container.innerHTML = chapters.map((chapter) => {
    const isActive = currentChapter?.key === chapter.key;

    return `
      <button
        type="button"
        class="chapter-btn ${isActive ? "active" : ""}"
        data-chapter-key="${escapeHtml(chapter.key)}"
      >
        <strong>${String(chapter.number).padStart(2, "0")} - ${escapeHtml(chapter.title)}</strong>
        <small>
          <span class="chapter-category-pill">${escapeHtml(chapter.categoryLabel || "Altro")}</span>
          ${escapeHtml(chapter.key)}
        </small>
      </button>
    `;
  }).join("");

  container.querySelectorAll("[data-chapter-key]").forEach((button) => {
    button.addEventListener("click", () => {
      const chapterKey = button.dataset.chapterKey;
      const chapter = CHAPTERS.find((item) => item.key === chapterKey);

      if (chapter) {
        selectChapter(chapter);
      }
    });
  });
}

function setSafeHtml(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

function setSafeText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function showBlocksError(message) {
  setSafeHtml(
    "authorBlocksEditor",
    `<p class="empty error">${escapeHtml(message || "Errore caricamento blocchi.")}</p>`
  );
}

async function selectChapter(chapter) {
  saveCurrentCommentDraft();

  const loadId = ++activeLoadId;
  currentChapter = chapter;

  renderChapterVisual(chapter);

  loadCommentDraftForChapter(chapter);
  setCommentTarget(chapter);

  document.getElementById("chapterTitle").textContent =
    `${String(chapter.number).padStart(2, "0")} - ${chapter.title}`;

  document.getElementById("chapterMeta").textContent =
    `Chiave: ${chapter.key} · Blocchi ufficiali: ${chapter.sections.length}`;

  const legacyEditor = document.getElementById("authorEditor");
  const blocksEditor = document.getElementById("authorBlocksEditor");

  if (legacyEditor) {
    legacyEditor.value = "";
  }

  if (blocksEditor) {
    blocksEditor.innerHTML = `<p class="empty">Caricamento blocchi autore...</p>`;
  }

  document.getElementById("commentsList").innerHTML = "";
  document.getElementById("versionsList").innerHTML = "";

  renderOfficialText(chapter);
  setTextStatus("Caricamento testo autore...");

  renderChapters();

  await reloadCurrentChapter(loadId, chapter.key);
}

async function reloadCurrentChapter(loadId = ++activeLoadId, chapterKey = currentChapter?.key) {
  if (!chapterKey) return;

  try {
    await loadAuthorText(chapterKey, loadId);
  } catch (error) {
    console.error("Errore loadAuthorText:", error);
    setTextStatus("Errore caricamento blocchi autore.", "error");
    showBlocksError("Errore caricamento blocchi autore.");
  }

  try {
    await loadComments(chapterKey, loadId);
  } catch (error) {
    console.error("Errore loadComments:", error);
  }

  try {
    await loadVersions(chapterKey, loadId);
  } catch (error) {
    console.error("Errore loadVersions:", error);
  }
}

function renderOfficialText(chapter) {
  const container = document.getElementById("officialText");

  if (!container || !chapter) return;

  const blocks = [];

  if (chapter.intro) {
    blocks.push(`
      <div class="official-intro">
        ${escapeHtml(chapter.intro)}
      </div>
    `);
  }

  chapter.sections.forEach((section) => {
    blocks.push(renderOfficialSection(section));
  });

  container.innerHTML = blocks.join("") || `<p class="empty">Nessun testo ufficiale disponibile.</p>`;
}

function renderOfficialSection(section = {}) {
  const type = String(section.type || "text").trim();
  const title = escapeHtml(section.title || "Sezione");

  if (Array.isArray(section.items)) {
    return `
      <div class="official-block ${escapeHtml(type)}">
        <h4>${title}</h4>
        <ul>
          ${section.items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}
        </ul>
      </div>
    `;
  }

  if (Array.isArray(section.checks)) {
    return `
      <div class="official-block ${escapeHtml(type)}">
        <h4>${title}</h4>
        ${section.checks.map(check => `
          <div class="check-row">
            <strong>${escapeHtml(check.label || "")}</strong>
            <span>${escapeHtml(check.value || "")}</span>
          </div>
        `).join("")}
      </div>
    `;
  }

  return `
    <div class="official-block ${escapeHtml(type)}">
      <h4>${title}</h4>
      <p>${escapeHtml(section.text || "")}</p>
    </div>
  `;
}

function normalizeBlockKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "_")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function sectionToPlainText(section = {}) {
  if (Array.isArray(section.items)) {
    return section.items.map((item) => `- ${item}`).join("\n");
  }

  if (Array.isArray(section.checks)) {
    return section.checks
      .map((check) => `${check.label || ""}: ${check.value || ""}`)
      .join("\n");
  }

  return String(section.text || "").trim();
}

function getChapterGuideBlocks(chapter) {
  if (!chapter) return [];

  const blocks = [];

  if (chapter.intro) {
    blocks.push({
      block_key: "intro",
      block_index: 0,
      block_title: "Introduzione",
      official_type: "intro",
      official_text: chapter.intro
    });
  }

  chapter.sections.forEach((section, index) => {
    const sectionNumber = index + 1;
    const title = section.title || `Blocco ${sectionNumber}`;

    blocks.push({
      block_key: `section_${String(sectionNumber).padStart(2, "0")}`,
      block_index: sectionNumber,
      block_title: title,
      official_type: section.type || "text",
      official_text: sectionToPlainText(section)
    });
  });

  return blocks;
}

function getBlockTextarea(blockKey) {
  return document.querySelector(`[data-author-block-key="${blockKey}"]`);
}

function getBlockCounter(blockKey) {
  return document.querySelector(`[data-author-block-counter="${blockKey}"]`);
}

function updateBlockCounter(blockKey) {
  const textarea = getBlockTextarea(blockKey);
  const counter = getBlockCounter(blockKey);

  if (!textarea || !counter) return;

  const chars = textarea.value.length;
  const words = textarea.value.trim()
    ? textarea.value.trim().split(/\s+/).length
    : 0;

  counter.textContent = `${chars} caratteri · ${words} parole`;
}

function setBlockInlineStatus(blockKey, message, type = "ok", autoClearMs = 5000) {
  const cleanBlockKey = String(blockKey || "").trim();

  if (!cleanBlockKey) return;

  pendingBlockStatuses.set(cleanBlockKey, {
    message,
    type,
    autoClearMs,
    createdAt: Date.now()
  });

  const statusEl = document.querySelector(
    `[data-author-block-status="${cleanBlockKey}"]`
  );

  if (!statusEl) return;

  if (blockStatusTimers.has(cleanBlockKey)) {
    clearTimeout(blockStatusTimers.get(cleanBlockKey));
    blockStatusTimers.delete(cleanBlockKey);
  }

  statusEl.textContent = message || "";
  statusEl.className = `block-inline-status ${type}`.trim();

  if (!message || !autoClearMs) return;

  const timer = window.setTimeout(() => {
    statusEl.textContent = "";
    statusEl.className = "block-inline-status";

    blockStatusTimers.delete(cleanBlockKey);
    pendingBlockStatuses.delete(cleanBlockKey);
  }, autoClearMs);

  blockStatusTimers.set(cleanBlockKey, timer);
}

function restorePendingBlockStatuses() {
  const now = Date.now();

  pendingBlockStatuses.forEach((status, blockKey) => {
    const elapsed = now - Number(status.createdAt || 0);
    const total = Number(status.autoClearMs || 5000);
    const remaining = Math.max(800, total - elapsed);

    if (elapsed >= total) {
      pendingBlockStatuses.delete(blockKey);
      return;
    }

    setBlockInlineStatus(
      blockKey,
      status.message,
      status.type,
      remaining
    );
  });
}

function getBlockSaveButton(blockKey) {
  return document.querySelector(`[data-save-author-block="${blockKey}"]`);
}

function setBlockSaveButtonState(blockKey, isSaving) {
  const button = getBlockSaveButton(blockKey);

  if (!button) return;

  button.disabled = !!isSaving;
  button.textContent = isSaving
    ? "Salvataggio..."
    : "💾 Salva blocco";
}

function renderAuthorBlockEditors(chapter, rows = []) {
  const container = document.getElementById("authorBlocksEditor");

  if (!container || !chapter) return;

  const guideBlocks = getChapterGuideBlocks(chapter);
  const rowsMap = new Map();

  rows.forEach((row) => {
    rowsMap.set(String(row.block_key || "").trim(), row);
  });

  currentAuthorBlocksFromDb = rowsMap;

  if (!guideBlocks.length) {
    container.innerHTML = `<p class="empty">Nessun blocco guida disponibile per questo capitolo.</p>`;
    return;
  }

  container.innerHTML = guideBlocks.map((block) => {
    const savedRow = rowsMap.get(block.block_key);
    const savedContent = savedRow?.content || "";

    return `
  <section class="author-block-card" data-author-block-card="${escapeHtml(block.block_key)}">
    <div class="author-block-head">
      <div>
        <small>Blocco ${String(block.block_index).padStart(2, "0")} · ${escapeHtml(block.official_type)}</small>
        <h3>${escapeHtml(block.block_title)}</h3>
      </div>

      <button
        type="button"
        class="small-btn block-save-btn"
        data-save-author-block="${escapeHtml(block.block_key)}"
      >
        💾 Salva blocco
      </button>
    </div>

    <textarea
      class="author-block-textarea"
      data-author-block-key="${escapeHtml(block.block_key)}"
      placeholder="Scrivi qui il testo autore per: ${escapeHtml(block.block_title)}"
    >${escapeHtml(savedContent)}</textarea>

    <div class="author-block-footer">
      <span data-author-block-counter="${escapeHtml(block.block_key)}">0 caratteri · 0 parole</span>
    </div>
    <p
      class="block-inline-status"
      data-author-block-status="${escapeHtml(block.block_key)}"
      aria-live="polite"
    ></p>

    <div class="block-comments-box">
      <div class="block-comments-head">
        <h4>Commenti revisione</h4>
        <span data-block-comments-count="${escapeHtml(block.block_key)}">0 commenti</span>
      </div>

      <div
        class="block-comments-list"
        data-block-comments-list="${escapeHtml(block.block_key)}"
      >
        <p class="empty">Nessun commento per questo blocco.</p>
      </div>

      <div class="block-comment-form">
        <textarea
          data-block-comment-input="${escapeHtml(block.block_key)}"
          placeholder="Scrivi un commento su questo blocco..."
        ></textarea>

        <button
          type="button"
          class="small-btn block-comment-save-btn"
          data-add-block-comment="${escapeHtml(block.block_key)}"
        >
          💬 Salva commento
        </button>
      </div>
    </div>
  </section>
`;
  }).join("");

  guideBlocks.forEach((block) => {
    const textarea = getBlockTextarea(block.block_key);

    if (textarea) {
      textarea.addEventListener("input", () => {
  markAuthorInputActivity();
  updateBlockCounter(block.block_key);
});
      updateBlockCounter(block.block_key);
    }
  });

  container.querySelectorAll("[data-save-author-block]").forEach((button) => {
    button.addEventListener("click", () => {
      saveAuthorBlock(button.dataset.saveAuthorBlock);
    });
  });

  container.querySelectorAll("[data-add-block-comment]").forEach((button) => {
    button.addEventListener("click", () => {
      addBlockComment(button.dataset.addBlockComment);
    });
  });

  restorePendingBlockStatuses();
}

function collectAuthorBlockPayloads(chapter = currentChapter) {
  if (!chapter) return [];

  return getChapterGuideBlocks(chapter).map((block) => {
    const textarea = getBlockTextarea(block.block_key);

    return {
      chapter_key: chapter.key,
      block_key: block.block_key,
      block_index: block.block_index,
      block_title: block.block_title,
      official_type: block.official_type,
      content: textarea?.value.trimEnd() || "",
      updated_at: new Date().toISOString()
    };
  });
}

function buildCombinedAuthorTextFromPayloads(payloads = []) {
  return payloads
    .filter((block) => String(block.content || "").trim())
    .map((block) => {
      const title = String(block.block_title || "").trim();
      const content = String(block.content || "").trimEnd();

      return title
        ? `## ${title}\n\n${content}`
        : content;
    })
    .join("\n\n---\n\n")
    .trimEnd();
}

function buildCombinedAuthorTextFromCurrentMap(chapter = currentChapter) {
  const guideBlocks = getChapterGuideBlocks(chapter);

  const payloads = guideBlocks.map((block) => {
    const row = currentAuthorBlocksFromDb.get(block.block_key);

    return {
      ...block,
      chapter_key: chapter.key,
      content: row?.content || ""
    };
  });

  return buildCombinedAuthorTextFromPayloads(payloads);
}

function markAuthorInputActivity() {
  lastAuthorEditorInputAt = Date.now();
}

function hasUnsavedAuthorBlockChanges(chapter = currentChapter) {
  if (!chapter) return false;

  return collectAuthorBlockPayloads(chapter).some((payload) => {
    const oldContent =
      currentAuthorBlocksFromDb.get(payload.block_key)?.content || "";

    return payload.content !== oldContent;
  });
}

function requestCurrentChapterReload(reason = "realtime", delay = 500) {
  if (!currentChapter) return;

  if (liveReloadTimer) {
    clearTimeout(liveReloadTimer);
    liveReloadTimer = null;
  }

  liveReloadTimer = window.setTimeout(async () => {
    liveReloadTimer = null;

    if (!currentChapter) return;

    const typedRecently = Date.now() - lastAuthorEditorInputAt < 1200;

    if (typedRecently || hasUnsavedAuthorBlockChanges(currentChapter)) {
      setTextStatus(
        "Aggiornamento live sospeso: ci sono modifiche non salvate.",
        "warning"
      );
      return;
    }

    const chapterKey = currentChapter.key;
    const loadId = ++activeLoadId;

    try {
      await reloadCurrentChapter(loadId, chapterKey);
    } catch (error) {
      console.error("Errore reload live author:", reason, error);
      setTextStatus("Errore aggiornamento live.", "error");
    }
  }, Math.max(0, Number(delay) || 0));
}

async function loadAuthorText(chapterKey = currentChapter?.key, loadId = activeLoadId) {
  if (!chapterKey) return;

  setTextStatus("Caricamento blocchi autore...");

  let blockRows = [];
  let legacyRow = null;
  let error = null;

  if (useSupabase && supabaseClient) {
    const [blocksResult, legacyResult] = await Promise.all([
      supabaseClient
        .from(tableNames.blocks)
        .select("*")
        .eq("chapter_key", chapterKey)
        .order("block_index", { ascending: true }),

      supabaseClient
        .from(tableNames.texts)
        .select("*")
        .eq("chapter_key", chapterKey)
        .maybeSingle()
    ]);

    blockRows = blocksResult.data || [];
    legacyRow = legacyResult.data || null;
    error = blocksResult.error || legacyResult.error;
  } else {
    blockRows = readLocalJson(getBlocksStorageKey(chapterKey), []);
    legacyRow = readLocalJson(getTextStorageKey(chapterKey), null);
  }

  if (loadId !== activeLoadId || chapterKey !== currentChapter?.key) {
    return;
  }

  if (error) {
    console.error(error);
    setTextStatus("Errore caricamento blocchi autore", "error");
    return;
  }

  /*
    Compatibilità:
    se esiste un vecchio testo unico ma non esistono ancora blocchi,
    lo mettiamo nel primo blocco disponibile.
  */
  if ((!blockRows || blockRows.length === 0) && legacyRow?.content) {
    const firstBlock = getChapterGuideBlocks(currentChapter)[0];

    if (firstBlock) {
      blockRows = [{
        chapter_key: chapterKey,
        block_key: firstBlock.block_key,
        block_index: firstBlock.block_index,
        block_title: firstBlock.block_title,
        official_type: firstBlock.official_type,
        content: legacyRow.content,
        updated_by: legacyRow.updated_by,
        updated_at: legacyRow.updated_at
      }];
    }
  }

  renderAuthorBlockEditors(currentChapter, blockRows);

  await loadBlockComments(chapterKey);

  currentAuthorTextFromDb = buildCombinedAuthorTextFromCurrentMap(currentChapter);

  if (legacyRow?.updated_at) {
    setTextStatus(
      `Ultima modifica: ${new Date(legacyRow.updated_at).toLocaleString("it-IT")} - ${legacyRow.updated_by || ""}`,
      "ok"
    );
  } else if (blockRows.length) {
    setTextStatus("Blocchi autore caricati.", "ok");
  } else {
    setTextStatus("Nessun testo autore salvato per questo capitolo.");
  }

  const editNote = document.getElementById("editNote");
  if (editNote) editNote.value = "";
}

async function saveAuthorText() {
  const user = getUser();
  const editNote = document.getElementById("editNote")?.value.trim() || "";

  if (!currentChapter) {
    alert("Seleziona un capitolo");
    return;
  }

  const payloads = collectAuthorBlockPayloads(currentChapter);
  const combinedContent = buildCombinedAuthorTextFromPayloads(payloads);

  const hasChanges = payloads.some((payload) => {
    const oldContent = currentAuthorBlocksFromDb.get(payload.block_key)?.content || "";
    return payload.content !== oldContent;
  });

  if (!hasChanges) {
    setTextStatus("Nessuna modifica da salvare.");
    return;
  }

  setTextStatus("Salvataggio blocchi in corso...");

  const updatedBy = `${user.name} - ${user.role}`;

  const changedPayloads = payloads
    .filter((payload) => {
      const oldContent = currentAuthorBlocksFromDb.get(payload.block_key)?.content || "";
      return payload.content !== oldContent;
    })
    .map((payload) => ({
      chapter_key: payload.chapter_key,
      block_key: payload.block_key,
      block_index: payload.block_index,
      block_title: payload.block_title,
      official_type: payload.official_type,
      content: payload.content,
      updated_by: updatedBy,
      updated_at: new Date().toISOString()
    }));

  const versionPayload = {
    chapter_key: currentChapter.key,
    content: currentAuthorTextFromDb || "[Prima versione vuota]",
    edited_by: updatedBy,
    edit_note: editNote || "Modifica blocchi autore",
    created_at: new Date().toISOString()
  };

  const textPayload = {
    chapter_key: currentChapter.key,
    content: combinedContent,
    updated_by: updatedBy,
    updated_at: new Date().toISOString()
  };

  if (useSupabase && supabaseClient) {
    const { error: versionError } = await supabaseClient
      .from(tableNames.versions)
      .insert({
        chapter_key: versionPayload.chapter_key,
        content: versionPayload.content,
        edited_by: versionPayload.edited_by,
        edit_note: versionPayload.edit_note
      });

    if (versionError) {
      console.error(versionError);
      setTextStatus("Errore nel salvataggio della cronologia", "error");
      return;
    }

    const { error: blocksError } = await supabaseClient
      .from(tableNames.blocks)
      .upsert(changedPayloads, {
        onConflict: "chapter_key,block_key"
      });

    if (blocksError) {
      console.error(blocksError);
      setTextStatus("Errore nel salvataggio dei blocchi autore", "error");
      return;
    }

    const { error: textError } = await supabaseClient
      .from(tableNames.texts)
      .upsert(textPayload, {
        onConflict: "chapter_key"
      });

    if (textError) {
      console.error(textError);
      setTextStatus("Errore nel salvataggio del testo completo", "error");
      return;
    }
  } else {
    const versions = readLocalJson(getVersionsStorageKey(currentChapter.key), []);
    versions.unshift({
      ...versionPayload,
      id: cryptoRandomId()
    });

    localStorage.setItem(
      getVersionsStorageKey(currentChapter.key),
      JSON.stringify(versions)
    );

    const existingRows = readLocalJson(getBlocksStorageKey(currentChapter.key), []);
    const rowsMap = new Map();

    existingRows.forEach((row) => {
      rowsMap.set(row.block_key, row);
    });

    changedPayloads.forEach((row) => {
      rowsMap.set(row.block_key, row);
    });

    localStorage.setItem(
      getBlocksStorageKey(currentChapter.key),
      JSON.stringify(Array.from(rowsMap.values()))
    );

    localStorage.setItem(
      getTextStorageKey(currentChapter.key),
      JSON.stringify(textPayload)
    );
  }

  changedPayloads.forEach((row) => {
    currentAuthorBlocksFromDb.set(row.block_key, row);
  });

  currentAuthorTextFromDb = combinedContent;

  const editNoteEl = document.getElementById("editNote");
  if (editNoteEl) editNoteEl.value = "";

  await reloadCurrentChapter(++activeLoadId, currentChapter.key);

setTextStatus("Blocchi autore salvati correttamente", "ok");
}

async function saveAuthorBlock(blockKey) {
  const cleanBlockKey = String(blockKey || "").trim();

  if (!cleanBlockKey) {
    alert("Blocco non valido.");
    return;
  }

  if (activeBlockSaveKeys.has(cleanBlockKey)) {
    setBlockInlineStatus(
      cleanBlockKey,
      "Salvataggio già in corso...",
      "loading",
      0
    );
    return;
  }

  const user = getUser();

  if (!currentChapter) {
    alert("Seleziona un capitolo");
    return;
  }

  const payload = collectAuthorBlockPayloads(currentChapter)
    .find((item) => item.block_key === cleanBlockKey);

  if (!payload) {
    alert("Blocco non trovato.");
    return;
  }

  const oldContent =
    currentAuthorBlocksFromDb.get(payload.block_key)?.content || "";

  if (payload.content === oldContent) {
    setTextStatus(`Nessuna modifica nel blocco: ${payload.block_title}`);
    setBlockInlineStatus(
      payload.block_key,
      "Nessuna modifica da salvare.",
      "muted"
    );
    return;
  }

  activeBlockSaveKeys.add(cleanBlockKey);
  setBlockSaveButtonState(cleanBlockKey, true);

  setTextStatus(`Salvataggio blocco: ${payload.block_title}...`);
  setBlockInlineStatus(
    payload.block_key,
    "Salvataggio in corso...",
    "loading",
    0
  );

  try {
    const updatedBy = `${user.name} - ${user.role}`;

    const blockPayload = {
      chapter_key: payload.chapter_key,
      block_key: payload.block_key,
      block_index: payload.block_index,
      block_title: payload.block_title,
      official_type: payload.official_type,
      content: payload.content,
      updated_by: updatedBy,
      updated_at: new Date().toISOString()
    };

    const allPayloads = collectAuthorBlockPayloads(currentChapter);
    const combinedContent = buildCombinedAuthorTextFromPayloads(allPayloads);

    const textPayload = {
      chapter_key: currentChapter.key,
      content: combinedContent,
      updated_by: updatedBy,
      updated_at: new Date().toISOString()
    };

    const versionPayload = {
      chapter_key: currentChapter.key,
      content: currentAuthorTextFromDb || "[Prima versione vuota]",
      edited_by: updatedBy,
      edit_note: `Modifica blocco: ${payload.block_title}`,
      created_at: new Date().toISOString()
    };

    if (useSupabase && supabaseClient) {
      const { error: blockError } = await supabaseClient
        .from(tableNames.blocks)
        .upsert(blockPayload, {
          onConflict: "chapter_key,block_key"
        });

      if (blockError) {
        throw blockError;
      }

      const { error: textError } = await supabaseClient
        .from(tableNames.texts)
        .upsert(textPayload, {
          onConflict: "chapter_key"
        });

      if (textError) {
        throw textError;
      }

      const { error: versionError } = await supabaseClient
        .from(tableNames.versions)
        .insert({
          chapter_key: versionPayload.chapter_key,
          content: versionPayload.content,
          edited_by: versionPayload.edited_by,
          edit_note: versionPayload.edit_note
        });

      if (versionError) {
        console.warn("Cronologia non salvata, ma blocco salvato:", versionError);
      }
    } else {
      const versions = readLocalJson(getVersionsStorageKey(currentChapter.key), []);
      versions.unshift({
        ...versionPayload,
        id: cryptoRandomId()
      });

      localStorage.setItem(
        getVersionsStorageKey(currentChapter.key),
        JSON.stringify(versions)
      );

      const existingRows = readLocalJson(getBlocksStorageKey(currentChapter.key), []);
      const rowsMap = new Map();

      existingRows.forEach((row) => {
        rowsMap.set(row.block_key, row);
      });

      rowsMap.set(blockPayload.block_key, blockPayload);

      localStorage.setItem(
        getBlocksStorageKey(currentChapter.key),
        JSON.stringify(Array.from(rowsMap.values()))
      );

      localStorage.setItem(
        getTextStorageKey(currentChapter.key),
        JSON.stringify(textPayload)
      );
    }

    currentAuthorBlocksFromDb.set(blockPayload.block_key, blockPayload);
    currentAuthorTextFromDb = combinedContent;
    lastLocalAuthorSaveAt = Date.now();

    setTextStatus(`Blocco salvato: ${payload.block_title}`, "ok");
    setBlockInlineStatus(
      payload.block_key,
      "✅ Blocco salvato correttamente.",
      "ok"
    );

    await loadVersions(currentChapter.key, activeLoadId);
  } catch (error) {
    console.error("Errore saveAuthorBlock:", error);

    setTextStatus("Errore nel salvataggio del blocco", "error");
    setBlockInlineStatus(
      payload.block_key,
      `Errore salvataggio: ${error.message || "controlla console"}`,
      "error",
      0
    );
  } finally {
    activeBlockSaveKeys.delete(cleanBlockKey);
    setBlockSaveButtonState(cleanBlockKey, false);
  }
}

let currentBlockCommentsFromDb = [];

async function loadBlockComments(chapterKey = currentChapter?.key) {
  if (!chapterKey) return;

  let rows = [];
  let error = null;

  if (useSupabase && supabaseClient) {
    const result = await supabaseClient
      .from(tableNames.comments)
      .select("*")
      .eq("chapter_key", chapterKey)
      .order("created_at", { ascending: true });

    rows = result.data || [];
    error = result.error;
  } else {
    rows = readLocalJson(getBlockCommentsStorageKey(chapterKey), []);
  }

  if (error) {
    console.error(error);
    setTextStatus("Errore caricamento commenti blocco", "error");
    return;
  }

  currentBlockCommentsFromDb = rows.filter((row) => {
    return String(row.block_key || "").trim();
  });

  renderBlockComments();
}

function renderBlockComments() {
  if (!currentChapter) return;

  const commentsByBlock = new Map();

  currentBlockCommentsFromDb.forEach((comment) => {
    const blockKey = String(comment.block_key || "").trim();
    if (!blockKey) return;

    if (!commentsByBlock.has(blockKey)) {
      commentsByBlock.set(blockKey, []);
    }

    commentsByBlock.get(blockKey).push(comment);
  });

  getChapterGuideBlocks(currentChapter).forEach((block) => {
    const listEl = document.querySelector(`[data-block-comments-list="${block.block_key}"]`);
    const countEl = document.querySelector(`[data-block-comments-count="${block.block_key}"]`);

    if (!listEl) return;

    const comments = commentsByBlock.get(block.block_key) || [];
    const parentComments = comments.filter((comment) => !comment.parent_id);

    if (countEl) {
      countEl.textContent = `${comments.length} commenti`;
    }

    if (!comments.length) {
      listEl.innerHTML = `<p class="empty">Nessun commento per questo blocco.</p>`;
      return;
    }

    listEl.innerHTML = parentComments.map((comment) => {
      const replies = comments.filter((reply) => {
        return String(reply.parent_id || "") === String(comment.id || "");
      });

      return renderBlockCommentItem(comment, replies);
    }).join("");

    listEl.querySelectorAll("[data-edit-block-comment]").forEach((button) => {
      button.addEventListener("click", () => {
        editBlockComment(button.dataset.editBlockComment);
      });
    });

    listEl.querySelectorAll("[data-delete-block-comment]").forEach((button) => {
      button.addEventListener("click", () => {
        deleteBlockComment(button.dataset.deleteBlockComment);
      });
    });

    listEl.querySelectorAll("[data-reply-block-comment]").forEach((button) => {
      button.addEventListener("click", () => {
        replyBlockComment(button.dataset.replyBlockComment);
      });
    });
  });
}

function renderBlockCommentItem(comment, replies = []) {
  const createdAt = comment.created_at
    ? new Date(comment.created_at).toLocaleString("it-IT")
    : "";

  return `
    <article class="block-comment-item">
      <div class="block-comment-meta">
        <strong>${escapeHtml(comment.author || "Utente")}</strong>
        <span>${escapeHtml(comment.role || "")}</span>
        <small>${escapeHtml(createdAt)}</small>
      </div>

      <p>${escapeHtml(comment.body || "")}</p>

      <div class="block-comment-actions">
        <button type="button" data-reply-block-comment="${escapeHtml(comment.id)}">Rispondi</button>
        <button type="button" data-edit-block-comment="${escapeHtml(comment.id)}">Modifica</button>
        <button type="button" data-delete-block-comment="${escapeHtml(comment.id)}">Cancella</button>
      </div>

      ${
        replies.length
          ? `<div class="block-comment-replies">
              ${replies.map((reply) => renderBlockCommentReply(reply)).join("")}
            </div>`
          : ""
      }
    </article>
  `;
}

function renderBlockCommentReply(reply) {
  const createdAt = reply.created_at
    ? new Date(reply.created_at).toLocaleString("it-IT")
    : "";

  return `
    <article class="block-comment-reply">
      <div class="block-comment-meta">
        <strong>${escapeHtml(reply.author || "Utente")}</strong>
        <span>${escapeHtml(reply.role || "")}</span>
        <small>${escapeHtml(createdAt)}</small>
      </div>

      <p>${escapeHtml(reply.body || "")}</p>

      <div class="block-comment-actions">
        <button type="button" data-edit-block-comment="${escapeHtml(reply.id)}">Modifica</button>
        <button type="button" data-delete-block-comment="${escapeHtml(reply.id)}">Cancella</button>
      </div>
    </article>
  `;
}

async function addBlockComment(blockKey) {
  const cleanBlockKey = String(blockKey || "").trim();
  const input = document.querySelector(`[data-block-comment-input="${cleanBlockKey}"]`);
  const body = String(input?.value || "").trim();
  const user = getUser();

  if (!currentChapter || !cleanBlockKey) {
    alert("Blocco non valido.");
    return;
  }

  if (!input) {
    setBlockInlineStatus(cleanBlockKey, "Campo commento non trovato.", "error", 0);
    return;
  }

  if (!body) {
    setBlockInlineStatus(cleanBlockKey, "Scrivi un commento prima di salvare.", "muted");
    return;
  }

  setBlockInlineStatus(cleanBlockKey, "Salvataggio commento in corso...", "loading", 0);

  const payload = {
    chapter_key: currentChapter.key,
    block_key: cleanBlockKey,
    parent_id: null,
    author: user.name,
    role: user.role,
    body,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  if (useSupabase && supabaseClient) {
    const { data, error } = await supabaseClient
      .from(tableNames.comments)
      .insert({
        chapter_key: payload.chapter_key,
        block_key: payload.block_key,
        parent_id: payload.parent_id,
        author: payload.author,
        role: payload.role,
        body: payload.body
      })
      .select("*")
      .single();

    if (error) {
      console.error("Errore salvataggio commento blocco:", error);

      setTextStatus("Errore salvataggio commento blocco", "error");
      setBlockInlineStatus(
        cleanBlockKey,
        `Errore commento: ${error.message || "controlla Supabase"}`,
        "error",
        0
      );

      return;
    }

    currentBlockCommentsFromDb.push(data);
  } else {
    const rows = readLocalJson(getBlockCommentsStorageKey(currentChapter.key), []);

    rows.push({
      ...payload,
      id: cryptoRandomId()
    });

    localStorage.setItem(
      getBlockCommentsStorageKey(currentChapter.key),
      JSON.stringify(rows)
    );

    currentBlockCommentsFromDb = rows.filter((row) => {
      return String(row.block_key || "").trim();
    });
  }

  input.value = "";

  renderBlockComments();

  setTextStatus("Commento salvato correttamente", "ok");
  setBlockInlineStatus(cleanBlockKey, "✅ Commento salvato.", "ok");

  if (typeof requestCurrentChapterReload === "function") {
    requestCurrentChapterReload("block-comment-save", 700);
  }
}

async function replyBlockComment(commentId) {
  const cleanCommentId = String(commentId || "").trim();
  const parent = currentBlockCommentsFromDb.find((comment) => {
    return String(comment.id || "") === cleanCommentId;
  });

  if (!parent) {
    alert("Commento non trovato.");
    return;
  }

  const body = prompt("Risposta al commento:", "");

  if (body === null) return;

  const cleanBody = String(body || "").trim();

  if (!cleanBody) {
    alert("Risposta vuota.");
    return;
  }

  const user = getUser();

  const payload = {
    chapter_key: currentChapter.key,
    block_key: parent.block_key,
    parent_id: parent.id,
    author: user.name,
    role: user.role,
    body: cleanBody,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  if (useSupabase && supabaseClient) {
    const { error } = await supabaseClient
      .from(tableNames.comments)
      .insert({
        chapter_key: payload.chapter_key,
        block_key: payload.block_key,
        parent_id: payload.parent_id,
        author: payload.author,
        role: payload.role,
        body: payload.body
      });

    if (error) {
      console.error(error);
      setTextStatus("Errore salvataggio risposta", "error");
      return;
    }
  } else {
    const rows = readLocalJson(getBlockCommentsStorageKey(currentChapter.key), []);
    rows.push({
      ...payload,
      id: cryptoRandomId()
    });

    localStorage.setItem(
      getBlockCommentsStorageKey(currentChapter.key),
      JSON.stringify(rows)
    );
  }

  await loadBlockComments();
}

async function editBlockComment(commentId) {
  const cleanCommentId = String(commentId || "").trim();
  const comment = currentBlockCommentsFromDb.find((item) => {
    return String(item.id || "") === cleanCommentId;
  });

  if (!comment) {
    alert("Commento non trovato.");
    return;
  }

  const nextBody = prompt("Modifica commento:", comment.body || "");

  if (nextBody === null) return;

  const cleanBody = String(nextBody || "").trim();

  if (!cleanBody) {
    alert("Il commento non può essere vuoto.");
    return;
  }

  if (useSupabase && supabaseClient) {
    const { error } = await supabaseClient
      .from(tableNames.comments)
      .update({
        body: cleanBody,
        updated_at: new Date().toISOString()
      })
      .eq("id", cleanCommentId);

    if (error) {
      console.error(error);
      setTextStatus("Errore modifica commento", "error");
      return;
    }
  } else {
    const rows = readLocalJson(getBlockCommentsStorageKey(currentChapter.key), []);
    const nextRows = rows.map((row) => {
      if (String(row.id || "") !== cleanCommentId) return row;

      return {
        ...row,
        body: cleanBody,
        updated_at: new Date().toISOString()
      };
    });

    localStorage.setItem(
      getBlockCommentsStorageKey(currentChapter.key),
      JSON.stringify(nextRows)
    );
  }

  await loadBlockComments();
}

async function deleteBlockComment(commentId) {
  const cleanCommentId = String(commentId || "").trim();

  if (!cleanCommentId) return;

  const ok = confirm("Vuoi cancellare questo commento?");

  if (!ok) return;

  if (useSupabase && supabaseClient) {
    const { error } = await supabaseClient
      .from(tableNames.comments)
      .delete()
      .eq("id", cleanCommentId);

    if (error) {
      console.error(error);
      setTextStatus("Errore cancellazione commento", "error");
      return;
    }
  } else {
    const rows = readLocalJson(getBlockCommentsStorageKey(currentChapter.key), []);
    const nextRows = rows.filter((row) => {
      return (
        String(row.id || "") !== cleanCommentId &&
        String(row.parent_id || "") !== cleanCommentId
      );
    });

    localStorage.setItem(
      getBlockCommentsStorageKey(currentChapter.key),
      JSON.stringify(nextRows)
    );
  }

  await loadBlockComments();
}

async function addComment(parentId = null, textAreaId = "newComment") {
  const user = getUser();
  const textarea = document.getElementById(textAreaId);
  const body = textarea?.value.trim() || "";

  if (!currentChapter) {
    alert("Seleziona un capitolo");
    return;
  }

  if (!body) {
    alert("Scrivi un commento");
    return;
  }

  const payload = {
    id: cryptoRandomId(),
    chapter_key: currentChapter.key,
    parent_id: parentId,
    author: user.name,
    role: user.role,
    body,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  if (useSupabase && supabaseClient) {
    const { error } = await supabaseClient
      .from(tableNames.comments)
      .insert({
        chapter_key: payload.chapter_key,
        parent_id: parentId,
        author: payload.author,
        role: payload.role,
        body: payload.body
      });

    if (error) {
      console.error(error);
      alert("Errore nel salvataggio del commento");
      return;
    }
  } else {
    const comments = readLocalJson(getCommentsStorageKey(currentChapter.key), []);
    comments.push(payload);

    localStorage.setItem(
      getCommentsStorageKey(currentChapter.key),
      JSON.stringify(comments)
    );
  }

  textarea.value = "";

  if (textAreaId === "newComment") {
    localStorage.removeItem(getCommentDraftKey(currentChapter.key));
  }

  await loadComments();
}

async function loadComments(chapterKey = currentChapter?.key, loadId = activeLoadId) {
  if (!chapterKey) return;

  let comments = [];
  let error = null;

  if (useSupabase && supabaseClient) {
    const result = await supabaseClient
      .from(tableNames.comments)
      .select("*")
      .eq("chapter_key", chapterKey)
      .order("created_at", { ascending: true });

    comments = result.data || [];
    error = result.error;
  } else {
    comments = readLocalJson(getCommentsStorageKey(chapterKey), []);
  }

  if (loadId !== activeLoadId || chapterKey !== currentChapter?.key) {
    return;
  }

  if (error) {
    console.error(error);
    document.getElementById("commentsList").innerHTML =
      `<p class="empty">Errore nel caricamento dei commenti.</p>`;
    return;
  }

  renderComments(
  comments.filter((comment) => !String(comment.block_key || "").trim())
);
}

function renderComments(comments) {
  const container = document.getElementById("commentsList");

  if (!container) {
    return;
  }

  container.innerHTML = "";

  const generalComments = comments.filter((comment) => {
    return !String(comment.block_key || "").trim();
  });

  if (!generalComments.length) {
    container.innerHTML = `<p class="empty">Nessun commento generale per questo capitolo.</p>`;
    return;
  }

  const parents = generalComments.filter(comment => !comment.parent_id);
  const replies = generalComments.filter(comment => comment.parent_id);

  parents.forEach(comment => {
    container.appendChild(createCommentElement(comment, replies));
  });
}

function createCommentElement(comment, replies) {
  const div = document.createElement("div");
  div.className = "comment";

  const date = new Date(comment.created_at).toLocaleString("it-IT");
  const replyId = `reply-${comment.id}`;

  div.innerHTML = `
    <div class="comment-head">
      <div>
        <strong>${escapeHtml(comment.author)}</strong>
        <small>(${escapeHtml(comment.role || "")}) - ${date}</small>
      </div>

      <div class="comment-actions">
        <button class="small-btn" data-action="edit">Modifica</button>
        <button class="small-btn danger" data-action="delete">Cancella</button>
      </div>
    </div>

    <p>${escapeHtml(comment.body)}</p>

    <div class="reply-box">
      <textarea id="${replyId}" placeholder="Rispondi a questo commento..."></textarea>
      <button onclick="addComment('${comment.id}', '${replyId}')">Rispondi</button>
    </div>
  `;

  div.querySelector('[data-action="edit"]').addEventListener("click", () => {
    editComment(comment);
  });

  div.querySelector('[data-action="delete"]').addEventListener("click", () => {
    deleteComment(comment);
  });

  const childReplies = replies.filter(reply => reply.parent_id === comment.id);

  childReplies.forEach(reply => {
    div.appendChild(createReplyElement(reply));
  });

  return div;
}

function createReplyElement(reply) {
  const div = document.createElement("div");
  div.className = "comment reply";

  const date = new Date(reply.created_at).toLocaleString("it-IT");

  div.innerHTML = `
    <div class="comment-head">
      <div>
        <strong>${escapeHtml(reply.author)}</strong>
        <small>(${escapeHtml(reply.role || "")}) - ${date}</small>
      </div>

      <div class="comment-actions">
        <button class="small-btn" data-action="edit">Modifica</button>
        <button class="small-btn danger" data-action="delete">Cancella</button>
      </div>
    </div>

    <p>${escapeHtml(reply.body)}</p>
  `;

  div.querySelector('[data-action="edit"]').addEventListener("click", () => {
    editComment(reply);
  });

  div.querySelector('[data-action="delete"]').addEventListener("click", () => {
    deleteComment(reply);
  });

  return div;
}

async function editComment(comment) {
  const newBody = prompt("Modifica commento:", comment.body);

  if (newBody === null) return;

  const cleanBody = newBody.trim();

  if (!cleanBody) {
    alert("Il commento non può essere vuoto.");
    return;
  }

  if (cleanBody === comment.body) {
    return;
  }

  if (useSupabase && supabaseClient) {
    const { error } = await supabaseClient
      .from(tableNames.comments)
      .update({
        body: cleanBody,
        updated_at: new Date().toISOString()
      })
      .eq("id", comment.id);

    if (error) {
      console.error(error);
      alert("Errore durante la modifica del commento.");
      return;
    }
  } else {
    const comments = readLocalJson(getCommentsStorageKey(currentChapter.key), []);
    const nextComments = comments.map(item =>
      item.id === comment.id
        ? { ...item, body: cleanBody, updated_at: new Date().toISOString() }
        : item
    );

    localStorage.setItem(
      getCommentsStorageKey(currentChapter.key),
      JSON.stringify(nextComments)
    );
  }

  await loadComments();
}

async function deleteComment(comment) {
  const isParent = !comment.parent_id;

  const message = isParent
    ? "Vuoi cancellare questo commento? Verranno cancellate anche eventuali risposte."
    : "Vuoi cancellare questa risposta?";

  const confirmDelete = confirm(message);

  if (!confirmDelete) return;

  if (useSupabase && supabaseClient) {
    const { error } = await supabaseClient
      .from(tableNames.comments)
      .delete()
      .eq("id", comment.id);

    if (error) {
      console.error(error);
      alert("Errore durante la cancellazione del commento.");
      return;
    }
  } else {
    const comments = readLocalJson(getCommentsStorageKey(currentChapter.key), []);
    const nextComments = comments.filter(item =>
      item.id !== comment.id && item.parent_id !== comment.id
    );

    localStorage.setItem(
      getCommentsStorageKey(currentChapter.key),
      JSON.stringify(nextComments)
    );
  }

  await loadComments();
}

async function loadVersions(chapterKey = currentChapter?.key, loadId = activeLoadId) {
  if (!chapterKey) return;

  let versions = [];
  let error = null;

  if (useSupabase && supabaseClient) {
    const result = await supabaseClient
      .from(tableNames.versions)
      .select("*")
      .eq("chapter_key", chapterKey)
      .order("created_at", { ascending: false })
      .limit(50);

    versions = result.data || [];
    error = result.error;
  } else {
    versions = readLocalJson(getVersionsStorageKey(chapterKey), []);
  }

  if (loadId !== activeLoadId || chapterKey !== currentChapter?.key) {
    return;
  }

  if (error) {
    console.error(error);
    document.getElementById("versionsList").innerHTML =
      `<p class="empty">Errore nel caricamento della cronologia.</p>`;
    return;
  }

  const container = document.getElementById("versionsList");

if (!container) {
  return;
}

container.innerHTML = "";

  if (!versions || versions.length === 0) {
    container.innerHTML = `<p class="empty">Nessuna modifica precedente.</p>`;
    return;
  }

  versions.forEach(version => {
    const div = document.createElement("div");
    div.className = "version";

    const date = new Date(version.created_at).toLocaleString("it-IT");

    div.innerHTML = `
      <strong>${escapeHtml(version.edited_by || "Utente")}</strong>
      <small>${date}</small>
      <p><em>${escapeHtml(version.edit_note || "")}</em></p>

      <details>
        <summary>Vedi testo precedente</summary>
        <pre>${escapeHtml(version.content || "[vuoto]")}</pre>
      </details>
    `;

    container.appendChild(div);
  });
}

function startRealtime() {
  if (!useSupabase || !supabaseClient || realtimeChannel) return;

  realtimeChannel = supabaseClient
    .channel("author_realtime")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: tableNames.comments },
      payload => {
        const row = payload.new || payload.old;

        if (!row || row.chapter_key !== currentChapter?.key) return;

        loadComments?.();
        loadBlockComments?.();
      }
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: tableNames.blocks },
      payload => {
        const row = payload.new || payload.old;

        if (!row || row.chapter_key !== currentChapter?.key) return;

        const isLocalSaveRecent = Date.now() - lastLocalAuthorSaveAt < 2500;
        const isSavingNow = activeBlockSaveKeys.size > 0;

        if (isLocalSaveRecent || isSavingNow) {
          return;
        }

        if (hasUnsavedAuthorBlockChanges?.(currentChapter)) {
          setTextStatus(
            "Aggiornamento live sospeso: ci sono modifiche non salvate.",
            "warning"
          );
          return;
        }

        requestCurrentChapterReload?.("blocks", 600);
      }
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: tableNames.texts },
      payload => {
        const row = payload.new || payload.old;

        if (!row || row.chapter_key !== currentChapter?.key) return;

        const isLocalSaveRecent = Date.now() - lastLocalAuthorSaveAt < 2500;
        const isSavingNow = activeBlockSaveKeys.size > 0;

        if (isLocalSaveRecent || isSavingNow) {
          return;
        }

        if (hasUnsavedAuthorBlockChanges?.(currentChapter)) {
          setTextStatus(
            "Aggiornamento live sospeso: ci sono modifiche non salvate.",
            "warning"
          );
          return;
        }

        requestCurrentChapterReload?.("texts", 800);
      }
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: tableNames.versions },
      payload => {
        const row = payload.new || payload.old;

        if (row && row.chapter_key === currentChapter?.key) {
          loadVersions();
        }
      }
    )
    .subscribe((status) => {
      console.log("[AUTHOR REALTIME]", status);
    });
}

function setTextStatus(message, type = "") {
  const status = document.getElementById("textStatus");

  if (!status) return;

  status.textContent = message || "";
  status.className = `status ${type}`.trim();
}

function bindQuestWorkspace() {
  const chaptersTab = document.getElementById("chaptersTabBtn");
  const questsTab = document.getElementById("questsTabBtn");
  const sourceFilter = document.getElementById("questSourceFilter");
  const search = document.getElementById("questSearch");
  const reloadButton = document.getElementById("reloadQuestUnitBtn");

  chaptersTab?.addEventListener("click", () => switchAuthorWorkspace("chapters"));
  questsTab?.addEventListener("click", () => switchAuthorWorkspace("quests"));
  sourceFilter?.addEventListener("change", renderQuestUnits);
  search?.addEventListener("input", renderQuestUnits);
  reloadButton?.addEventListener("click", () => loadCurrentQuestUnit());

  if (sourceFilter) {
    sourceFilter.innerHTML = [
      `<option value="all">Tutti i file</option>`,
      ...(questCatalog.sources || []).map((source) => `
        <option value="${escapeHtml(source.id)}">${escapeHtml(source.label)}</option>
      `)
    ].join("");
  }

  const meta = document.getElementById("questCatalogMeta");

  if (meta) {
    meta.textContent =
      `${questCatalog.unitCount || 0} elementi · ${questCatalog.textCount || 0} campi testuali`;
  }

  renderQuestUnits();
}

function switchAuthorWorkspace(workspace) {
  const showChapters = workspace === "chapters";
  const showQuests = workspace === "quests";
  const showWeapons = workspace === "weapons";
  const showCreatures = workspace === "creatures";
  const showZoneGuardians = workspace === "zoneGuardians";
  const showFragments = workspace === "fragments";
  const showModals = workspace === "modals";
  const showCustomEventObjects = workspace === "customEventObjects";
  const showBots = workspace === "bots";
  const showMappe = workspace === "mappe";
  const showPlayers = workspace === "players";

  document.getElementById("chaptersWorkspace")?.classList.toggle("hidden", !showChapters);
  document.getElementById("questsWorkspace")?.classList.toggle("hidden", !showQuests);
  document.getElementById("weaponsWorkspace")?.classList.toggle("hidden", !showWeapons);
  document.getElementById("creaturesWorkspace")?.classList.toggle("hidden", !showCreatures);
  document.getElementById("zoneGuardiansWorkspace")?.classList.toggle("hidden", !showZoneGuardians);
  document.getElementById("fragmentsWorkspace")?.classList.toggle("hidden", !showFragments);
  document.getElementById("modalsWorkspace")?.classList.toggle("hidden", !showModals);
  document.getElementById("customEventObjectsWorkspace")?.classList.toggle("hidden", !showCustomEventObjects);
  document.getElementById("botsWorkspace")?.classList.toggle("hidden", !showBots);
  document.getElementById("mappeWorkspace")?.classList.toggle("hidden", !showMappe);
  document.getElementById("playersWorkspace")?.classList.toggle("hidden", !showPlayers);
  document.getElementById("chaptersTabBtn")?.classList.toggle("active", showChapters);
  document.getElementById("questsTabBtn")?.classList.toggle("active", showQuests);
  document.getElementById("weaponsTabBtn")?.classList.toggle("active", showWeapons);
  document.getElementById("creaturesTabBtn")?.classList.toggle("active", showCreatures);
  document.getElementById("zoneGuardiansTabBtn")?.classList.toggle("active", showZoneGuardians);
  document.getElementById("fragmentsTabBtn")?.classList.toggle("active", showFragments);
  document.getElementById("modalsTabBtn")?.classList.toggle("active", showModals);
  document.getElementById("customEventObjectsTabBtn")?.classList.toggle("active", showCustomEventObjects);
  document.getElementById("botsTabBtn")?.classList.toggle("active", showBots);
  document.getElementById("mappeTabBtn")?.classList.toggle("active", showMappe);
  document.getElementById("playersTabBtn")?.classList.toggle("active", showPlayers);

  if (showMappe) {
    window.AuthorMapPlanner?.onShow();
  }

  if (showPlayers && currentPlayer) {
    loadCurrentPlayer();
  }

  if (showQuests && currentQuestUnit) {
    loadCurrentQuestUnit();
  }

  if (showWeapons && currentWeapon) {
    loadCurrentWeapon();
  }

  if (showCreatures && currentCreature) {
    loadCurrentCreature();
  }

  if (showZoneGuardians && currentZoneGuardian) {
    loadCurrentZoneGuardian();
  }

  if (showFragments && currentFragment) {
    loadCurrentFragment();
  }

  if (showModals && currentModalText) {
    loadCurrentModalText();
  }

  if (showCustomEventObjects && currentCustomEventObjectText) {
    loadCurrentModalText({
      context: "customEventObjects",
      unit: currentCustomEventObjectText
    });
  }

  if (showBots && currentBotNarrativeText) {
    loadCurrentModalText({
      context: "bots",
      unit: currentBotNarrativeText
    });
  }
}

function getFilteredQuestUnits() {
  const source = document.getElementById("questSourceFilter")?.value || "all";
  const query = (
    document.getElementById("questSearch")?.value || ""
  ).trim().toLocaleLowerCase("it-IT");

  return (questCatalog.units || []).filter((unit) => {
    if (source !== "all" && unit.sourceId !== source) return false;
    if (!query) return true;

    const text = [
      unit.title,
      unit.entityKey,
      unit.groupLabel,
      unit.sourceLabel,
      ...unit.fields.map((field) => field.provisionalText)
    ].join(" ").toLocaleLowerCase("it-IT");

    return text.includes(query);
  });
}

function renderQuestUnits() {
  const container = document.getElementById("questUnitsList");
  if (!container) return;

  const units = getFilteredQuestUnits();

  if (!units.length) {
    container.innerHTML = `<p class="empty">Nessun testo quest trovato.</p>`;
    return;
  }

  let previousGroup = "";

  container.innerHTML = units.map((unit) => {
    const groupId = `${unit.sourceId}:${unit.groupKey}`;
    const heading = groupId !== previousGroup
      ? `<h3 class="quest-group-heading">${escapeHtml(unit.groupLabel)}</h3>`
      : "";

    previousGroup = groupId;

    return `
      ${heading}
      <button
        type="button"
        class="quest-unit-btn ${currentQuestUnit?.unitKey === unit.unitKey ? "active" : ""}"
        data-quest-unit-key="${escapeHtml(unit.unitKey)}"
      >
        <strong>${escapeHtml(unit.title)}</strong>
        <small>${escapeHtml(unit.entityKey)} · ${unit.fields.length} testi</small>
      </button>
    `;
  }).join("");

  container.querySelectorAll("[data-quest-unit-key]").forEach((button) => {
    button.addEventListener("click", () => {
      const unit = (questCatalog.units || []).find(
        (item) => item.unitKey === button.dataset.questUnitKey
      );

      if (!unit) return;

      currentQuestUnit = unit;
      renderQuestUnits();
      loadCurrentQuestUnit();
    });
  });
}

function questLocalDraftKey(textKey) {
  return `author_quest_text_${textKey}`;
}

function questLocalPublishedKey(textKey) {
  return `author_published_quest_text_${textKey}`;
}

function canPublishQuestTexts() {
  const role = String(currentAllowedUser?.role || getUser().role || "")
    .trim()
    .toLowerCase();

  return ["admin", "owner", "revisore"].includes(role);
}

async function loadCurrentQuestUnit() {
  if (!currentQuestUnit) return;

  const loadId = ++questLoadId;
  const keys = currentQuestUnit.fields.map((field) => field.textKey);

  document.getElementById("questUnitTitle").textContent = currentQuestUnit.title;
  document.getElementById("questUnitMeta").textContent =
    `${currentQuestUnit.sourceFile} · ${currentQuestUnit.entityKey}`;
  document.getElementById("questFieldsEditor").innerHTML =
    `<div class="card"><p class="empty">Caricamento testi quest...</p></div>`;

  let drafts = [];
  let published = [];

  if (useSupabase && supabaseClient) {
    const [draftResult, publishedResult] = await Promise.all([
      supabaseClient
        .from(tableNames.questTexts)
        .select("*")
        .in("text_key", keys),
      supabaseClient
        .from(tableNames.publishedQuestTexts)
        .select("*")
        .in("text_key", keys)
    ]);

    if (loadId !== questLoadId) return;

    if (draftResult.error || publishedResult.error) {
      console.error(draftResult.error || publishedResult.error);
      document.getElementById("questFieldsEditor").innerHTML =
        `<div class="card"><p class="empty error">Errore nel caricamento dei testi quest.</p></div>`;
      return;
    }

    drafts = draftResult.data || [];
    published = publishedResult.data || [];
  } else {
    drafts = keys
      .map((key) => readLocalJson(questLocalDraftKey(key), null))
      .filter(Boolean);
    published = keys
      .map((key) => readLocalJson(questLocalPublishedKey(key), null))
      .filter(Boolean);
  }

  currentQuestRows = new Map(drafts.map((row) => [row.text_key, row]));
  currentPublishedQuestRows = new Map(
    published.map((row) => [row.text_key, row])
  );

  renderQuestFields();
}

function renderQuestFields() {
  const container = document.getElementById("questFieldsEditor");
  if (!container || !currentQuestUnit) return;

  const allowPublish = canPublishQuestTexts();

  container.innerHTML = currentQuestUnit.fields.map((field, index) => {
    const draft = currentQuestRows.get(field.textKey);
    const published = currentPublishedQuestRows.get(field.textKey);
    const isPublished =
      published && published.content === String(draft?.content || "").trim();

    return `
      <section class="card quest-field-card" data-quest-field-card="${escapeHtml(field.textKey)}">
        <div class="card-header">
          <div>
            <p class="eyebrow">Campo ${String(index + 1).padStart(2, "0")}</p>
            <h3>${escapeHtml(field.fieldName)}</h3>
            <small class="status">${escapeHtml(field.fieldPath)}</small>
          </div>
          <span class="quest-status-pill ${isPublished ? "published" : ""}">
            ${isPublished ? "Pubblicato" : draft?.content ? "Bozza salvata" : "Da riscrivere"}
          </span>
        </div>

        <div class="quest-field-grid">
          <div class="quest-field-column">
            <span class="quest-field-label">Traccia provvisoria</span>
            <p class="quest-provisional-text">${escapeHtml(field.provisionalText)}</p>
          </div>

          <div class="quest-field-column">
            <label class="quest-field-label" for="quest-${index}">Testo autore</label>
            <textarea
              id="quest-${index}"
              class="quest-author-text"
              data-quest-text-key="${escapeHtml(field.textKey)}"
              placeholder="Riscrivi qui il testo seguendo la traccia..."
            >${escapeHtml(draft?.content || "")}</textarea>
          </div>
        </div>

        <div class="quest-field-actions">
          <button type="button" data-copy-provisional="${escapeHtml(field.textKey)}">
            Copia la traccia
          </button>
          <button type="button" data-save-quest-text="${escapeHtml(field.textKey)}">
            Salva bozza
          </button>
          ${allowPublish ? `
            <button
              type="button"
              class="quest-publish-btn"
              data-publish-quest-text="${escapeHtml(field.textKey)}"
            >
              Pubblica nel gioco
            </button>
          ` : ""}
          <span class="status" data-quest-field-status="${escapeHtml(field.textKey)}"></span>
        </div>
      </section>
    `;
  }).join("");

  container.querySelectorAll("[data-copy-provisional]").forEach((button) => {
    button.addEventListener("click", () => copyQuestProvisional(button.dataset.copyProvisional));
  });

  container.querySelectorAll("[data-save-quest-text]").forEach((button) => {
    button.addEventListener("click", () => saveQuestText(button.dataset.saveQuestText));
  });

  container.querySelectorAll("[data-publish-quest-text]").forEach((button) => {
    button.addEventListener("click", () => publishQuestText(button.dataset.publishQuestText));
  });
}

function getQuestField(textKey) {
  return currentQuestUnit?.fields.find((field) => field.textKey === textKey) || null;
}

function getQuestTextarea(textKey) {
  return document.querySelector(`[data-quest-text-key="${textKey}"]`);
}

function setQuestFieldStatus(textKey, message, type = "") {
  const status = document.querySelector(`[data-quest-field-status="${textKey}"]`);
  if (!status) return;

  status.textContent = message || "";
  status.className = `status ${type}`.trim();
}

function copyQuestProvisional(textKey) {
  const field = getQuestField(textKey);
  const textarea = getQuestTextarea(textKey);

  if (!field || !textarea) return;

  textarea.value = field.provisionalText;
  textarea.focus();
  setQuestFieldStatus(textKey, "Traccia copiata. Salva la bozza.", "ok");
}

async function saveQuestText(textKey, { quiet = false } = {}) {
  const field = getQuestField(textKey);
  const textarea = getQuestTextarea(textKey);

  if (!field || !textarea || !currentQuestUnit) return null;

  const content = textarea.value.trim();
  const previous = currentQuestRows.get(textKey);

  if (previous?.content === content) {
    if (!quiet) setQuestFieldStatus(textKey, "Nessuna modifica da salvare.");
    return previous;
  }

  const user = getUser();
  const now = new Date().toISOString();
  const payload = {
    text_key: textKey,
    source_file: currentQuestUnit.sourceFile,
    source_id: currentQuestUnit.sourceId,
    group_key: currentQuestUnit.groupKey,
    entity_key: currentQuestUnit.entityKey,
    field_path: field.fieldPath,
    field_name: field.fieldName,
    provisional_text: field.provisionalText,
    content,
    status: "draft",
    updated_by: `${user.name} - ${user.role}`,
    updated_at: now
  };

  if (!quiet) setQuestFieldStatus(textKey, "Salvataggio...");

  if (useSupabase && supabaseClient) {
    if (previous) {
      const { error: versionError } = await supabaseClient
        .from(tableNames.questVersions)
        .insert({
          text_key: textKey,
          content: previous.content || "",
          edited_by: payload.updated_by
        });

      if (versionError) {
        console.warn("Cronologia testo quest non salvata:", versionError);
      }
    }

    const { error } = await supabaseClient
      .from(tableNames.questTexts)
      .upsert(payload, { onConflict: "text_key" });

    if (error) {
      console.error(error);
      setQuestFieldStatus(textKey, "Errore nel salvataggio.", "error");
      return null;
    }
  } else {
    localStorage.setItem(questLocalDraftKey(textKey), JSON.stringify(payload));
  }

  currentQuestRows.set(textKey, payload);

  if (!quiet) {
    setQuestFieldStatus(textKey, "Bozza salvata.", "ok");
    renderQuestFields();
  }

  return payload;
}

async function publishQuestText(textKey) {
  if (!canPublishQuestTexts()) {
    setQuestFieldStatus(textKey, "Solo revisore o admin può pubblicare.", "error");
    return;
  }

  const draft = await saveQuestText(textKey, { quiet: true });

  if (!draft?.content) {
    setQuestFieldStatus(textKey, "Scrivi e salva un testo prima di pubblicare.", "error");
    return;
  }

  const user = getUser();
  const payload = {
    text_key: draft.text_key,
    source_file: draft.source_file,
    source_id: draft.source_id,
    group_key: draft.group_key,
    entity_key: draft.entity_key,
    field_path: draft.field_path,
    field_name: draft.field_name,
    content: draft.content,
    published_by: `${user.name} - ${user.role}`,
    published_at: new Date().toISOString()
  };

  setQuestFieldStatus(textKey, "Pubblicazione...");

  if (useSupabase && supabaseClient) {
    const { error } = await supabaseClient
      .from(tableNames.publishedQuestTexts)
      .upsert(payload, { onConflict: "text_key" });

    if (error) {
      console.error(error);
      setQuestFieldStatus(textKey, "Errore nella pubblicazione.", "error");
      return;
    }
  } else {
    localStorage.setItem(questLocalPublishedKey(textKey), JSON.stringify(payload));
  }

  currentPublishedQuestRows.set(textKey, payload);
  setQuestFieldStatus(textKey, "Testo pubblicato.", "ok");
  renderQuestFields();
}

/* =========================================================================
   Player "Nona Ora" — catalogo personaggi giocanti, 7 blocchi editoriali
   per personaggio. Stesso flusso bozza/versioni/pubblicazione dei testi quest.
   ========================================================================= */

function bindPlayerWorkspace() {
  const tab = document.getElementById("playersTabBtn");
  const search = document.getElementById("playerSearch");
  const reloadButton = document.getElementById("reloadPlayerBtn");

  tab?.addEventListener("click", () => switchAuthorWorkspace("players"));
  search?.addEventListener("input", renderPlayersList);
  reloadButton?.addEventListener("click", () => loadCurrentPlayer());

  const meta = document.getElementById("playerCatalogMeta");
  if (meta) {
    meta.textContent =
      `${playerCatalog.playerCount || 0} personaggi · ${playerCatalog.fieldCount || 0} blocchi`;
  }

  renderPlayersList();
}

function getFilteredPlayers() {
  const query = (
    document.getElementById("playerSearch")?.value || ""
  ).trim().toLocaleLowerCase("it-IT");

  return (playerCatalog.players || []).filter((player) => {
    if (!query) return true;

    const text = [
      player.name,
      player.playerId,
      ...player.fields.map((field) => field.provisionalText)
    ].join(" ").toLocaleLowerCase("it-IT");

    return text.includes(query);
  });
}

function renderPlayersList() {
  const container = document.getElementById("playersList");
  if (!container) return;

  const players = getFilteredPlayers();

  if (!players.length) {
    container.innerHTML = `<p class="empty">Nessun personaggio trovato.</p>`;
    return;
  }

  container.innerHTML = players.map((player) => `
    <button
      type="button"
      class="quest-unit-btn player-unit-btn ${currentPlayer?.textKey === player.textKey ? "active" : ""}"
      data-player-text-key="${escapeHtml(player.textKey)}"
    >
      <strong>${escapeHtml(player.name)}</strong>
      <small>${escapeHtml(player.fields.find((f) => f.fieldKey === "caratteristica")?.provisionalText || "")}</small>
    </button>
  `).join("");

  container.querySelectorAll("[data-player-text-key]").forEach((button) => {
    button.addEventListener("click", () => {
      const player = (playerCatalog.players || []).find(
        (item) => item.textKey === button.dataset.playerTextKey
      );

      if (!player) return;

      currentPlayer = player;
      renderPlayersList();
      loadCurrentPlayer();
    });
  });
}

function playerLocalDraftKey(textKey) {
  return `author_player_text_${textKey}`;
}

function playerLocalPublishedKey(textKey) {
  return `author_published_player_text_${textKey}`;
}

async function loadCurrentPlayer() {
  if (!currentPlayer) return;

  const loadId = ++playerLoadId;
  const keys = currentPlayer.fields.map((field) => field.textKey);

  document.getElementById("playerTitle").textContent = currentPlayer.name;
  document.getElementById("playerMeta").textContent =
    `${currentPlayer.playerId} · ${currentPlayer.fields.filter((f) => f.fieldKey !== "nome").length} blocchi`;
  document.getElementById("playerFieldsEditor").innerHTML =
    `<div class="card"><p class="empty">Caricamento personaggio...</p></div>`;

  let drafts = [];
  let published = [];

  if (useSupabase && supabaseClient) {
    const [draftResult, publishedResult] = await Promise.all([
      supabaseClient
        .from(tableNames.playerTexts)
        .select("*")
        .in("text_key", keys),
      supabaseClient
        .from(tableNames.publishedPlayerTexts)
        .select("*")
        .in("text_key", keys)
    ]);

    if (loadId !== playerLoadId) return;

    if (draftResult.error || publishedResult.error) {
      console.error(draftResult.error || publishedResult.error);
      document.getElementById("playerFieldsEditor").innerHTML =
        `<div class="card"><p class="empty error">Errore nel caricamento del personaggio.</p></div>`;
      return;
    }

    drafts = draftResult.data || [];
    published = publishedResult.data || [];
  } else {
    drafts = keys
      .map((key) => readLocalJson(playerLocalDraftKey(key), null))
      .filter(Boolean);
    published = keys
      .map((key) => readLocalJson(playerLocalPublishedKey(key), null))
      .filter(Boolean);
  }

  currentPlayerRows = new Map(drafts.map((row) => [row.text_key, row]));
  currentPublishedPlayerRows = new Map(
    published.map((row) => [row.text_key, row])
  );

  renderPlayerFields();
}

function getPlayerNomeField() {
  return currentPlayer?.fields.find((field) => field.fieldKey === "nome") || null;
}

function getPlayerDisplayName() {
  const nomeField = getPlayerNomeField();
  const draft = nomeField && currentPlayerRows.get(nomeField.textKey);
  return (
    String(draft?.content || "").trim() ||
    nomeField?.provisionalText ||
    currentPlayer?.name ||
    ""
  );
}

function renderPlayerFields() {
  const container = document.getElementById("playerFieldsEditor");
  if (!container || !currentPlayer) return;

  const allowPublish = canPublishQuestTexts();
  const displayName = getPlayerDisplayName();

  const titleEl = document.getElementById("playerTitle");
  if (titleEl) titleEl.textContent = displayName || currentPlayer.name;

  const nomeField = getPlayerNomeField();
  const nomeDraft = nomeField && currentPlayerRows.get(nomeField.textKey);
  const nomePublished = nomeField && currentPublishedPlayerRows.get(nomeField.textKey);
  const nomeIsPublished =
    nomePublished &&
    nomePublished.content === String(nomeDraft?.content || "").trim();

  const heroHtml = `
    <section class="card player-hero">
      ${currentPlayer.imageUrl ? `
        <figure class="player-hero-image">
          <img
            src="${escapeHtml(currentPlayer.imageUrl)}"
            alt="${escapeHtml(displayName)}"
            onerror="this.closest('.player-hero-image').classList.add('is-broken')"
          />
        </figure>
      ` : ""}

      <div class="player-hero-info">
        <p class="eyebrow">Personaggio giocante</p>
        ${nomeField ? `
          <label class="quest-field-label" for="player-nome">Nome del personaggio</label>
          <div class="player-hero-name-row">
            <input
              id="player-nome"
              type="text"
              class="player-name-input"
              data-player-text-key="${escapeHtml(nomeField.textKey)}"
              value="${escapeHtml(String(nomeDraft?.content || "") || nomeField.provisionalText || currentPlayer.name)}"
              placeholder="Nome del personaggio"
            />
            <button type="button" data-save-player-text="${escapeHtml(nomeField.textKey)}">Salva</button>
            ${allowPublish ? `
              <button type="button" class="quest-publish-btn" data-publish-player-text="${escapeHtml(nomeField.textKey)}">
                Pubblica
              </button>
            ` : ""}
          </div>
          <div class="player-hero-name-status">
            <span class="quest-status-pill ${nomeIsPublished ? "published" : ""}">
              ${nomeIsPublished ? "Pubblicato" : nomeDraft?.content ? "Bozza salvata" : "Nome originale"}
            </span>
            <span class="status" data-player-field-status="${escapeHtml(nomeField.textKey)}"></span>
          </div>
        ` : ""}
        <p class="player-hero-file">${escapeHtml(currentPlayer.image)}</p>
      </div>
    </section>
  `;

  const blockFields = currentPlayer.fields.filter(
    (field) => field.fieldKey !== "nome"
  );

  const fieldsHtml = blockFields.map((field, index) => {
    const draft = currentPlayerRows.get(field.textKey);
    const published = currentPublishedPlayerRows.get(field.textKey);
    const isPublished =
      published && published.content === String(draft?.content || "").trim();
    const hasProvisional = Boolean(field.provisionalText);

    const bodyHtml = hasProvisional
      ? `
        <div class="quest-field-grid">
          <div class="quest-field-column">
            <span class="quest-field-label">Traccia provvisoria</span>
            <p class="quest-provisional-text">${escapeHtml(field.provisionalText)}</p>
          </div>

          <div class="quest-field-column">
            <label class="quest-field-label" for="player-${index}">Testo autore</label>
            <textarea
              id="player-${index}"
              class="quest-author-text"
              data-player-text-key="${escapeHtml(field.textKey)}"
              placeholder="Scrivi qui il testo del blocco..."
            >${escapeHtml(draft?.content || "")}</textarea>
          </div>
        </div>
      `
      : `
        <div class="player-single-field">
          <label class="quest-field-label" for="player-${index}">Testo autore</label>
          <textarea
            id="player-${index}"
            class="quest-author-text"
            data-player-text-key="${escapeHtml(field.textKey)}"
            placeholder="Scrivi qui il testo del blocco..."
          >${escapeHtml(draft?.content || "")}</textarea>
        </div>
      `;

    return `
      <section class="card quest-field-card" data-player-field-card="${escapeHtml(field.textKey)}">
        <div class="card-header">
          <div>
            <p class="eyebrow">Blocco ${String(index + 1).padStart(2, "0")}</p>
            <h3>${escapeHtml(field.fieldLabel)}</h3>
          </div>
          <span class="quest-status-pill ${isPublished ? "published" : ""}">
            ${isPublished ? "Pubblicato" : draft?.content ? "Bozza salvata" : "Da scrivere"}
          </span>
        </div>

        ${bodyHtml}

        <div class="quest-field-actions">
          ${hasProvisional ? `
            <button type="button" data-copy-player-provisional="${escapeHtml(field.textKey)}">
              Copia la traccia
            </button>
          ` : ""}
          <button type="button" data-save-player-text="${escapeHtml(field.textKey)}">
            Salva bozza
          </button>
          ${allowPublish ? `
            <button
              type="button"
              class="quest-publish-btn"
              data-publish-player-text="${escapeHtml(field.textKey)}"
            >
              Pubblica nel gioco
            </button>
          ` : ""}
          <span class="status" data-player-field-status="${escapeHtml(field.textKey)}"></span>
        </div>
      </section>
    `;
  }).join("");

  container.innerHTML = heroHtml + fieldsHtml;

  container.querySelectorAll("[data-copy-player-provisional]").forEach((button) => {
    button.addEventListener("click", () => copyPlayerProvisional(button.dataset.copyPlayerProvisional));
  });

  container.querySelectorAll("[data-save-player-text]").forEach((button) => {
    button.addEventListener("click", () => savePlayerText(button.dataset.savePlayerText));
  });

  container.querySelectorAll("[data-publish-player-text]").forEach((button) => {
    button.addEventListener("click", () => publishPlayerText(button.dataset.publishPlayerText));
  });
}

function getPlayerField(textKey) {
  return currentPlayer?.fields.find((field) => field.textKey === textKey) || null;
}

function getPlayerTextarea(textKey) {
  return document.querySelector(`[data-player-text-key="${textKey}"]`);
}

function setPlayerFieldStatus(textKey, message, type = "") {
  const status = document.querySelector(`[data-player-field-status="${textKey}"]`);
  if (!status) return;

  status.textContent = message || "";
  status.className = `status ${type}`.trim();
}

function copyPlayerProvisional(textKey) {
  const field = getPlayerField(textKey);
  const textarea = getPlayerTextarea(textKey);

  if (!field || !textarea) return;

  textarea.value = field.provisionalText;
  textarea.focus();
  setPlayerFieldStatus(textKey, "Traccia copiata. Salva la bozza.", "ok");
}

async function savePlayerText(textKey, { quiet = false } = {}) {
  const field = getPlayerField(textKey);
  const textarea = getPlayerTextarea(textKey);

  if (!field || !textarea || !currentPlayer) return null;

  const content = textarea.value.trim();
  const previous = currentPlayerRows.get(textKey);

  if (previous?.content === content) {
    if (!quiet) setPlayerFieldStatus(textKey, "Nessuna modifica da salvare.");
    return previous;
  }

  const user = getUser();
  const now = new Date().toISOString();
  const payload = {
    text_key: textKey,
    player_id: currentPlayer.playerId,
    player_name: currentPlayer.name,
    field_key: field.fieldKey,
    field_label: field.fieldLabel,
    provisional_text: field.provisionalText,
    content,
    status: "draft",
    updated_by: `${user.name} - ${user.role}`,
    updated_at: now
  };

  if (!quiet) setPlayerFieldStatus(textKey, "Salvataggio...");

  if (useSupabase && supabaseClient) {
    if (previous) {
      const { error: versionError } = await supabaseClient
        .from(tableNames.playerVersions)
        .insert({
          text_key: textKey,
          content: previous.content || "",
          edited_by: payload.updated_by
        });

      if (versionError) {
        console.warn("Cronologia testo player non salvata:", versionError);
      }
    }

    const { error } = await supabaseClient
      .from(tableNames.playerTexts)
      .upsert(payload, { onConflict: "text_key" });

    if (error) {
      console.error(error);
      setPlayerFieldStatus(textKey, "Errore nel salvataggio.", "error");
      return null;
    }
  } else {
    localStorage.setItem(playerLocalDraftKey(textKey), JSON.stringify(payload));
  }

  currentPlayerRows.set(textKey, payload);

  if (!quiet) {
    setPlayerFieldStatus(textKey, "Bozza salvata.", "ok");
    renderPlayerFields();
  }

  return payload;
}

async function publishPlayerText(textKey) {
  if (!canPublishQuestTexts()) {
    setPlayerFieldStatus(textKey, "Solo revisore o admin può pubblicare.", "error");
    return;
  }

  const draft = await savePlayerText(textKey, { quiet: true });

  if (!draft?.content) {
    setPlayerFieldStatus(textKey, "Scrivi e salva un testo prima di pubblicare.", "error");
    return;
  }

  const user = getUser();
  const payload = {
    text_key: draft.text_key,
    player_id: draft.player_id,
    player_name: draft.player_name,
    field_key: draft.field_key,
    field_label: draft.field_label,
    content: draft.content,
    published_by: `${user.name} - ${user.role}`,
    published_at: new Date().toISOString()
  };

  setPlayerFieldStatus(textKey, "Pubblicazione...");

  if (useSupabase && supabaseClient) {
    const { error } = await supabaseClient
      .from(tableNames.publishedPlayerTexts)
      .upsert(payload, { onConflict: "text_key" });

    if (error) {
      console.error(error);
      setPlayerFieldStatus(textKey, "Errore nella pubblicazione.", "error");
      return;
    }
  } else {
    localStorage.setItem(playerLocalPublishedKey(textKey), JSON.stringify(payload));
  }

  currentPublishedPlayerRows.set(textKey, payload);
  setPlayerFieldStatus(textKey, "Testo pubblicato.", "ok");
  renderPlayerFields();
}

function bindWeaponWorkspace() {
  const weaponsTab = document.getElementById("weaponsTabBtn");
  const characterFilter = document.getElementById("weaponCharacterFilter");
  const search = document.getElementById("weaponSearch");
  const reloadButton = document.getElementById("reloadWeaponBtn");

  weaponsTab?.addEventListener("click", () => switchAuthorWorkspace("weapons"));
  characterFilter?.addEventListener("change", renderWeaponsList);
  search?.addEventListener("input", renderWeaponsList);
  reloadButton?.addEventListener("click", () => loadCurrentWeapon());

  if (characterFilter) {
    characterFilter.innerHTML = [
      `<option value="all">Tutti i personaggi</option>`,
      ...(weaponCatalog.characters || []).map((character) => `
        <option value="${escapeHtml(character.key)}">
          ${escapeHtml(character.label)} (${Number(character.weaponCount || 0)})
        </option>
      `)
    ].join("");
  }

  const meta = document.getElementById("weaponCatalogMeta");

  if (meta) {
    meta.textContent =
      `${weaponCatalog.weaponCount || 0} armi · ${weaponCatalog.characterCount || 0} personaggi`;
  }

  renderWeaponsList();
}

function getFilteredWeapons() {
  const character =
    document.getElementById("weaponCharacterFilter")?.value || "all";
  const query = (
    document.getElementById("weaponSearch")?.value || ""
  ).trim().toLocaleLowerCase("it-IT");

  return (weaponCatalog.weapons || []).filter((weapon) => {
    if (character !== "all" && weapon.characterKey !== character) return false;
    if (!query) return true;

    const text = [
      weapon.name,
      weapon.weaponId,
      weapon.characterLabel,
      weapon.provisionalText,
      weapon.tier
    ].join(" ").toLocaleLowerCase("it-IT");

    return text.includes(query);
  });
}

function renderWeaponsList() {
  const container = document.getElementById("weaponsList");
  if (!container) return;

  const weapons = getFilteredWeapons();

  if (!weapons.length) {
    container.innerHTML = `<p class="empty">Nessuna arma trovata.</p>`;
    return;
  }

  let previousCharacter = "";

  container.innerHTML = weapons.map((weapon) => {
    const heading = weapon.characterKey !== previousCharacter
      ? `<h3 class="quest-group-heading">${escapeHtml(weapon.characterLabel)}</h3>`
      : "";

    previousCharacter = weapon.characterKey;

    return `
      ${heading}
      <button
        type="button"
        class="quest-unit-btn weapon-unit-btn ${currentWeapon?.textKey === weapon.textKey ? "active" : ""}"
        data-weapon-text-key="${escapeHtml(weapon.textKey)}"
      >
        <strong>${escapeHtml(weapon.name)}</strong>
        <small>${escapeHtml(weapon.characterLabel)} · Maestria ${Number(weapon.mastery || 1)} · ${escapeHtml(weapon.tier)}</small>
      </button>
    `;
  }).join("");

  container.querySelectorAll("[data-weapon-text-key]").forEach((button) => {
    button.addEventListener("click", () => {
      const weapon = (weaponCatalog.weapons || []).find(
        (item) => item.textKey === button.dataset.weaponTextKey
      );

      if (!weapon) return;

      currentWeapon = weapon;
      renderWeaponsList();
      loadCurrentWeapon();
    });
  });
}

function weaponLocalDraftKey(textKey) {
  return `author_weapon_text_${textKey}`;
}

function weaponLocalPublishedKey(textKey) {
  return `author_published_weapon_text_${textKey}`;
}

async function loadCurrentWeapon() {
  if (!currentWeapon) return;

  const loadId = ++weaponLoadId;
  const textKey = currentWeapon.textKey;

  document.getElementById("weaponTitle").textContent = currentWeapon.name;
  document.getElementById("weaponMeta").textContent =
    `${currentWeapon.characterLabel} · Maestria ${Number(currentWeapon.mastery || 1)} · Costo ${Number(currentWeapon.cost || 0)}`;
  document.getElementById("weaponBlockEditor").innerHTML =
    `<div class="card"><p class="empty">Caricamento arma...</p></div>`;

  let drafts = [];
  let published = [];

  if (useSupabase && supabaseClient) {
    const [draftResult, publishedResult] = await Promise.all([
      supabaseClient
        .from(tableNames.weaponTexts)
        .select("*")
        .eq("text_key", textKey),
      supabaseClient
        .from(tableNames.publishedWeaponTexts)
        .select("*")
        .eq("text_key", textKey)
    ]);

    if (loadId !== weaponLoadId) return;

    if (draftResult.error || publishedResult.error) {
      console.error(draftResult.error || publishedResult.error);
      document.getElementById("weaponBlockEditor").innerHTML =
        `<div class="card"><p class="empty error">Errore nel caricamento dell'arma.</p></div>`;
      return;
    }

    drafts = draftResult.data || [];
    published = publishedResult.data || [];
  } else {
    drafts = [readLocalJson(weaponLocalDraftKey(textKey), null)].filter(Boolean);
    published = [readLocalJson(weaponLocalPublishedKey(textKey), null)].filter(Boolean);
  }

  currentWeaponRows = new Map(drafts.map((row) => [row.text_key, row]));
  currentPublishedWeaponRows = new Map(
    published.map((row) => [row.text_key, row])
  );

  renderWeaponBlock();
}

function renderWeaponBlock() {
  const container = document.getElementById("weaponBlockEditor");
  if (!container || !currentWeapon) return;

  const draft = currentWeaponRows.get(currentWeapon.textKey);
  const published = currentPublishedWeaponRows.get(currentWeapon.textKey);
  const isPublished =
    published && published.content === String(draft?.content || "").trim();
  const allowPublish = canPublishQuestTexts();
  const incrementText = Object.entries(currentWeapon.increment || {})
    .map(([attribute, value]) => `${attribute}: +${value}`)
    .join(", ");

  container.innerHTML = `
    <section class="card quest-field-card weapon-field-card">
      <div class="card-header">
        <div>
          <p class="eyebrow">Blocco arma</p>
          <h3>${escapeHtml(currentWeapon.name)}</h3>
          <small class="status">
            ${escapeHtml(currentWeapon.characterLabel)} · ${escapeHtml(currentWeapon.weaponId)}
          </small>
        </div>
        <span class="quest-status-pill ${isPublished ? "published" : ""}">
          ${isPublished ? "Pubblicato" : draft?.content ? "Bozza salvata" : "Da riscrivere"}
        </span>
      </div>

      <div class="weapon-detail-grid">
        ${currentWeapon.imageUrl ? `
          <figure class="weapon-preview">
            <img src="${escapeHtml(currentWeapon.imageUrl)}" alt="${escapeHtml(currentWeapon.name)}" />
          </figure>
        ` : ""}

        <div class="weapon-facts">
          <span>Maestria <strong>${Number(currentWeapon.mastery || 1)}</strong></span>
          <span>Tier <strong>${escapeHtml(currentWeapon.tier || "common")}</strong></span>
          <span>Costo <strong>${Number(currentWeapon.cost || 0)}</strong></span>
          <span>Bonus <strong>${escapeHtml(incrementText || "-")}</strong></span>
        </div>
      </div>

      <div class="quest-field-grid">
        <div class="quest-field-column">
          <span class="quest-field-label">Descrizione provvisoria</span>
          <p class="quest-provisional-text">${escapeHtml(currentWeapon.provisionalText)}</p>
        </div>

        <div class="quest-field-column">
          <label class="quest-field-label" for="weapon-author-text">Testo autore</label>
          <textarea
            id="weapon-author-text"
            class="quest-author-text weapon-author-text"
            data-weapon-author-text="${escapeHtml(currentWeapon.textKey)}"
            placeholder="Riscrivi qui la descrizione dell'arma..."
          >${escapeHtml(draft?.content || "")}</textarea>
        </div>
      </div>

      <div class="quest-field-actions">
        <button type="button" data-copy-weapon-text="${escapeHtml(currentWeapon.textKey)}">
          Copia descrizione
        </button>
        <button type="button" data-save-weapon-text="${escapeHtml(currentWeapon.textKey)}">
          Salva bozza
        </button>
        ${allowPublish ? `
          <button
            type="button"
            class="quest-publish-btn"
            data-publish-weapon-text="${escapeHtml(currentWeapon.textKey)}"
          >
            Pubblica nel gioco
          </button>
        ` : ""}
        <span class="status" data-weapon-status="${escapeHtml(currentWeapon.textKey)}"></span>
      </div>
    </section>
  `;

  container.querySelector("[data-copy-weapon-text]")?.addEventListener(
    "click",
    () => copyWeaponProvisional(currentWeapon.textKey)
  );
  container.querySelector("[data-save-weapon-text]")?.addEventListener(
    "click",
    () => saveWeaponText(currentWeapon.textKey)
  );
  container.querySelector("[data-publish-weapon-text]")?.addEventListener(
    "click",
    () => publishWeaponText(currentWeapon.textKey)
  );
}

function getWeaponByTextKey(textKey) {
  return (weaponCatalog.weapons || []).find((weapon) => {
    return weapon.textKey === textKey;
  }) || null;
}

function getWeaponTextarea(textKey) {
  return document.querySelector(`[data-weapon-author-text="${textKey}"]`);
}

function setWeaponStatus(textKey, message, type = "") {
  const status = document.querySelector(`[data-weapon-status="${textKey}"]`);
  if (!status) return;

  status.textContent = message || "";
  status.className = `status ${type}`.trim();
}

function copyWeaponProvisional(textKey) {
  const weapon = getWeaponByTextKey(textKey);
  const textarea = getWeaponTextarea(textKey);

  if (!weapon || !textarea) return;

  textarea.value = weapon.provisionalText;
  textarea.focus();
  setWeaponStatus(textKey, "Descrizione copiata. Salva la bozza.", "ok");
}

async function saveWeaponText(textKey, { quiet = false } = {}) {
  const weapon = getWeaponByTextKey(textKey);
  const textarea = getWeaponTextarea(textKey);

  if (!weapon || !textarea) return null;

  const content = textarea.value.trim();
  const previous = currentWeaponRows.get(textKey);

  if (previous?.content === content) {
    if (!quiet) setWeaponStatus(textKey, "Nessuna modifica da salvare.");
    return previous;
  }

  const user = getUser();
  const now = new Date().toISOString();
  const payload = {
    text_key: textKey,
    source_file: weaponCatalog.sourceFile || "armi.html",
    character_key: weapon.characterKey,
    character_label: weapon.characterLabel,
    weapon_id: weapon.weaponId,
    weapon_name: weapon.name,
    provisional_text: weapon.provisionalText,
    content,
    status: "draft",
    updated_by: `${user.name} - ${user.role}`,
    updated_at: now
  };

  if (!quiet) setWeaponStatus(textKey, "Salvataggio...");

  if (useSupabase && supabaseClient) {
    if (previous) {
      const { error: versionError } = await supabaseClient
        .from(tableNames.weaponVersions)
        .insert({
          text_key: textKey,
          content: previous.content || "",
          edited_by: payload.updated_by
        });

      if (versionError) {
        console.warn("Cronologia testo arma non salvata:", versionError);
      }
    }

    const { error } = await supabaseClient
      .from(tableNames.weaponTexts)
      .upsert(payload, { onConflict: "text_key" });

    if (error) {
      console.error(error);
      setWeaponStatus(textKey, "Errore nel salvataggio.", "error");
      return null;
    }
  } else {
    localStorage.setItem(weaponLocalDraftKey(textKey), JSON.stringify(payload));
  }

  currentWeaponRows.set(textKey, payload);

  if (!quiet) {
    setWeaponStatus(textKey, "Bozza salvata.", "ok");
    renderWeaponBlock();
  }

  return payload;
}

async function publishWeaponText(textKey) {
  if (!canPublishQuestTexts()) {
    setWeaponStatus(textKey, "Solo revisore o admin può pubblicare.", "error");
    return;
  }

  const draft = await saveWeaponText(textKey, { quiet: true });

  if (!draft?.content) {
    setWeaponStatus(textKey, "Scrivi e salva un testo prima di pubblicare.", "error");
    return;
  }

  const user = getUser();
  const payload = {
    text_key: draft.text_key,
    source_file: draft.source_file,
    character_key: draft.character_key,
    character_label: draft.character_label,
    weapon_id: draft.weapon_id,
    weapon_name: draft.weapon_name,
    content: draft.content,
    published_by: `${user.name} - ${user.role}`,
    published_at: new Date().toISOString()
  };

  setWeaponStatus(textKey, "Pubblicazione...");

  if (useSupabase && supabaseClient) {
    const { error } = await supabaseClient
      .from(tableNames.publishedWeaponTexts)
      .upsert(payload, { onConflict: "text_key" });

    if (error) {
      console.error(error);
      setWeaponStatus(textKey, "Errore nella pubblicazione.", "error");
      return;
    }
  } else {
    localStorage.setItem(weaponLocalPublishedKey(textKey), JSON.stringify(payload));
  }

  currentPublishedWeaponRows.set(textKey, payload);
  setWeaponStatus(textKey, "Testo pubblicato.", "ok");
  renderWeaponBlock();
}

function bindCreatureWorkspace() {
  const creaturesTab = document.getElementById("creaturesTabBtn");
  const elementFilter = document.getElementById("creatureElementFilter");
  const search = document.getElementById("creatureSearch");
  const reloadButton = document.getElementById("reloadCreatureBtn");

  creaturesTab?.addEventListener("click", () => switchAuthorWorkspace("creatures"));
  elementFilter?.addEventListener("change", renderCreaturesList);
  search?.addEventListener("input", renderCreaturesList);
  reloadButton?.addEventListener("click", () => loadCurrentCreature());

  if (elementFilter) {
    elementFilter.innerHTML = [
      `<option value="all">Tutti gli elementi</option>`,
      ...(creatureCatalog.elements || []).map((element) => `
        <option value="${escapeHtml(element)}">${escapeHtml(element)}</option>
      `)
    ].join("");
  }

  const meta = document.getElementById("creatureCatalogMeta");

  if (meta) {
    meta.textContent = `${creatureCatalog.creatureCount || 0} creature`;
  }

  renderCreaturesList();
}

function getFilteredCreatures() {
  const element =
    document.getElementById("creatureElementFilter")?.value || "all";
  const query = (
    document.getElementById("creatureSearch")?.value || ""
  ).trim().toLocaleLowerCase("it-IT");

  return (creatureCatalog.creatures || []).filter((creature) => {
    if (element !== "all" && creature.element !== element) return false;
    if (!query) return true;

    const text = [
      creature.name,
      creature.element,
      creature.nature,
      creature.category,
      ...(creature.vehicles || []),
      creature.provisionalText
    ].join(" ").toLocaleLowerCase("it-IT");

    return text.includes(query);
  });
}

function renderCreaturesList() {
  const container = document.getElementById("creaturesList");
  if (!container) return;

  const creatures = getFilteredCreatures();

  if (!creatures.length) {
    container.innerHTML = `<p class="empty">Nessuna creatura trovata.</p>`;
    return;
  }

  let previousElement = "";

  container.innerHTML = creatures.map((creature) => {
    const heading = creature.element !== previousElement
      ? `<h3 class="quest-group-heading">${escapeHtml(creature.element || "Senza elemento")}</h3>`
      : "";

    previousElement = creature.element;

    return `
      ${heading}
      <button
        type="button"
        class="quest-unit-btn creature-unit-btn ${currentCreature?.textKey === creature.textKey ? "active" : ""}"
        data-creature-text-key="${escapeHtml(creature.textKey)}"
      >
        <strong>${escapeHtml(creature.name)}</strong>
        <small>${escapeHtml(creature.nature)} · ${escapeHtml(creature.category)} · ${escapeHtml(creature.element)}</small>
      </button>
    `;
  }).join("");

  container.querySelectorAll("[data-creature-text-key]").forEach((button) => {
    button.addEventListener("click", () => {
      const creature = (creatureCatalog.creatures || []).find(
        (item) => item.textKey === button.dataset.creatureTextKey
      );

      if (!creature) return;

      currentCreature = creature;
      renderCreaturesList();
      loadCurrentCreature();
    });
  });
}

function creatureLocalDraftKey(textKey) {
  return `author_creature_text_${textKey}`;
}

function creatureLocalPublishedKey(textKey) {
  return `author_published_creature_text_${textKey}`;
}

async function loadCurrentCreature() {
  if (!currentCreature) return;

  const loadId = ++creatureLoadId;
  const textKey = currentCreature.textKey;

  document.getElementById("creatureTitle").textContent = currentCreature.name;
  document.getElementById("creatureMeta").textContent =
    `${currentCreature.element} · ${currentCreature.nature} · ${currentCreature.category}`;
  document.getElementById("creatureBlockEditor").innerHTML =
    `<div class="card"><p class="empty">Caricamento creatura...</p></div>`;

  let drafts = [];
  let published = [];

  if (useSupabase && supabaseClient) {
    const [draftResult, publishedResult] = await Promise.all([
      supabaseClient
        .from(tableNames.creatureTexts)
        .select("*")
        .eq("text_key", textKey),
      supabaseClient
        .from(tableNames.publishedCreatureTexts)
        .select("*")
        .eq("text_key", textKey)
    ]);

    if (loadId !== creatureLoadId) return;

    if (draftResult.error || publishedResult.error) {
      console.error(draftResult.error || publishedResult.error);
      document.getElementById("creatureBlockEditor").innerHTML =
        `<div class="card"><p class="empty error">Errore nel caricamento della creatura.</p></div>`;
      return;
    }

    drafts = draftResult.data || [];
    published = publishedResult.data || [];
  } else {
    drafts = [readLocalJson(creatureLocalDraftKey(textKey), null)].filter(Boolean);
    published = [readLocalJson(creatureLocalPublishedKey(textKey), null)].filter(Boolean);
  }

  currentCreatureRows = new Map(drafts.map((row) => [row.text_key, row]));
  currentPublishedCreatureRows = new Map(
    published.map((row) => [row.text_key, row])
  );

  renderCreatureBlock();
}

function renderCreatureBlock() {
  const container = document.getElementById("creatureBlockEditor");
  if (!container || !currentCreature) return;

  const draft = currentCreatureRows.get(currentCreature.textKey);
  const published = currentPublishedCreatureRows.get(currentCreature.textKey);
  const isPublished =
    published && published.content === String(draft?.content || "").trim();
  const allowPublish = canPublishQuestTexts();
  const vehiclesText = (currentCreature.vehicles || []).join(", ") || "-";

  container.innerHTML = `
    <section class="card quest-field-card weapon-field-card creature-field-card">
      <div class="card-header">
        <div>
          <p class="eyebrow">Blocco creatura</p>
          <h3>${escapeHtml(currentCreature.name)}</h3>
          <small class="status">
            ${escapeHtml(currentCreature.creatureId)} · ${escapeHtml(currentCreature.element)}
          </small>
        </div>
        <span class="quest-status-pill ${isPublished ? "published" : ""}">
          ${isPublished ? "Pubblicato" : draft?.content ? "Bozza salvata" : "Da riscrivere"}
        </span>
      </div>

      <div class="weapon-detail-grid creature-detail-grid">
        ${currentCreature.imageUrl ? `
          <figure class="weapon-preview creature-preview">
            <img src="${escapeHtml(currentCreature.imageUrl)}" alt="${escapeHtml(currentCreature.name)}" />
          </figure>
        ` : ""}

        <div class="weapon-facts creature-facts">
          <span>Elemento <strong>${escapeHtml(currentCreature.element || "-")}</strong></span>
          <span>Natura <strong>${escapeHtml(currentCreature.nature || "-")}</strong></span>
          <span>Categoria <strong>${escapeHtml(currentCreature.category || "-")}</strong></span>
          <span>Veicolo <strong>${escapeHtml(vehiclesText)}</strong></span>
        </div>
      </div>

      <div class="quest-field-grid">
        <div class="quest-field-column">
          <span class="quest-field-label">Motivazione provvisoria</span>
          <p class="quest-provisional-text">${escapeHtml(currentCreature.provisionalText)}</p>
        </div>

        <div class="quest-field-column">
          <label class="quest-field-label" for="creature-author-text">Testo autore</label>
          <textarea
            id="creature-author-text"
            class="quest-author-text creature-author-text"
            data-creature-author-text="${escapeHtml(currentCreature.textKey)}"
            placeholder="Riscrivi qui la descrizione della creatura..."
          >${escapeHtml(draft?.content || "")}</textarea>
        </div>
      </div>

      <div class="quest-field-actions">
        <button type="button" data-copy-creature-text="${escapeHtml(currentCreature.textKey)}">
          Copia motivazione
        </button>
        <button type="button" data-save-creature-text="${escapeHtml(currentCreature.textKey)}">
          Salva bozza
        </button>
        ${allowPublish ? `
          <button
            type="button"
            class="quest-publish-btn"
            data-publish-creature-text="${escapeHtml(currentCreature.textKey)}"
          >
            Pubblica nel gioco
          </button>
        ` : ""}
        <span class="status" data-creature-status="${escapeHtml(currentCreature.textKey)}"></span>
      </div>
    </section>
  `;

  container.querySelector("[data-copy-creature-text]")?.addEventListener(
    "click",
    () => copyCreatureProvisional(currentCreature.textKey)
  );
  container.querySelector("[data-save-creature-text]")?.addEventListener(
    "click",
    () => saveCreatureText(currentCreature.textKey)
  );
  container.querySelector("[data-publish-creature-text]")?.addEventListener(
    "click",
    () => publishCreatureText(currentCreature.textKey)
  );
}

function getCreatureByTextKey(textKey) {
  return (creatureCatalog.creatures || []).find((creature) => {
    return creature.textKey === textKey;
  }) || null;
}

function getCreatureTextarea(textKey) {
  return document.querySelector(`[data-creature-author-text="${textKey}"]`);
}

function setCreatureStatus(textKey, message, type = "") {
  const status = document.querySelector(`[data-creature-status="${textKey}"]`);
  if (!status) return;

  status.textContent = message || "";
  status.className = `status ${type}`.trim();
}

function copyCreatureProvisional(textKey) {
  const creature = getCreatureByTextKey(textKey);
  const textarea = getCreatureTextarea(textKey);

  if (!creature || !textarea) return;

  textarea.value = creature.provisionalText;
  textarea.focus();
  setCreatureStatus(textKey, "Motivazione copiata. Salva la bozza.", "ok");
}

async function saveCreatureText(textKey, { quiet = false } = {}) {
  const creature = getCreatureByTextKey(textKey);
  const textarea = getCreatureTextarea(textKey);

  if (!creature || !textarea) return null;

  const content = textarea.value.trim();
  const previous = currentCreatureRows.get(textKey);

  if (previous?.content === content) {
    if (!quiet) setCreatureStatus(textKey, "Nessuna modifica da salvare.");
    return previous;
  }

  const user = getUser();
  const now = new Date().toISOString();
  const payload = {
    text_key: textKey,
    source_file: creatureCatalog.sourceFile || "creatures-data.js",
    creature_id: creature.creatureId,
    creature_name: creature.name,
    element: creature.element,
    nature: creature.nature,
    category: creature.category,
    vehicles: creature.vehicles || [],
    provisional_text: creature.provisionalText,
    content,
    status: "draft",
    updated_by: `${user.name} - ${user.role}`,
    updated_at: now
  };

  if (!quiet) setCreatureStatus(textKey, "Salvataggio...");

  if (useSupabase && supabaseClient) {
    if (previous) {
      const { error: versionError } = await supabaseClient
        .from(tableNames.creatureVersions)
        .insert({
          text_key: textKey,
          content: previous.content || "",
          edited_by: payload.updated_by
        });

      if (versionError) {
        console.warn("Cronologia testo creatura non salvata:", versionError);
      }
    }

    const { error } = await supabaseClient
      .from(tableNames.creatureTexts)
      .upsert(payload, { onConflict: "text_key" });

    if (error) {
      console.error(error);
      setCreatureStatus(textKey, "Errore nel salvataggio.", "error");
      return null;
    }
  } else {
    localStorage.setItem(creatureLocalDraftKey(textKey), JSON.stringify(payload));
  }

  currentCreatureRows.set(textKey, payload);

  if (!quiet) {
    setCreatureStatus(textKey, "Bozza salvata.", "ok");
    renderCreatureBlock();
  }

  return payload;
}

async function publishCreatureText(textKey) {
  if (!canPublishQuestTexts()) {
    setCreatureStatus(textKey, "Solo revisore o admin può pubblicare.", "error");
    return;
  }

  const draft = await saveCreatureText(textKey, { quiet: true });

  if (!draft?.content) {
    setCreatureStatus(textKey, "Scrivi e salva un testo prima di pubblicare.", "error");
    return;
  }

  const user = getUser();
  const payload = {
    text_key: draft.text_key,
    source_file: draft.source_file,
    creature_id: draft.creature_id,
    creature_name: draft.creature_name,
    element: draft.element,
    nature: draft.nature,
    category: draft.category,
    vehicles: draft.vehicles || [],
    content: draft.content,
    published_by: `${user.name} - ${user.role}`,
    published_at: new Date().toISOString()
  };

  setCreatureStatus(textKey, "Pubblicazione...");

  if (useSupabase && supabaseClient) {
    const { error } = await supabaseClient
      .from(tableNames.publishedCreatureTexts)
      .upsert(payload, { onConflict: "text_key" });

    if (error) {
      console.error(error);
      setCreatureStatus(textKey, "Errore nella pubblicazione.", "error");
      return;
    }
  } else {
    localStorage.setItem(creatureLocalPublishedKey(textKey), JSON.stringify(payload));
  }

  currentPublishedCreatureRows.set(textKey, payload);
  setCreatureStatus(textKey, "Testo pubblicato.", "ok");
  renderCreatureBlock();
}

function bindZoneGuardianWorkspace() {
  const guardiansTab = document.getElementById("zoneGuardiansTabBtn");
  const mapFilter = document.getElementById("zoneGuardianMapFilter");
  const search = document.getElementById("zoneGuardianSearch");
  const reloadButton = document.getElementById("reloadZoneGuardianBtn");

  guardiansTab?.addEventListener("click", () => switchAuthorWorkspace("zoneGuardians"));
  mapFilter?.addEventListener("change", renderZoneGuardiansList);
  search?.addEventListener("input", renderZoneGuardiansList);
  reloadButton?.addEventListener("click", () => loadCurrentZoneGuardian());

  if (mapFilter) {
    mapFilter.innerHTML = [
      `<option value="all">Tutte le mappe</option>`,
      ...(zoneGuardianCatalog.maps || []).map((mapKey) => `
        <option value="${escapeHtml(mapKey)}">${escapeHtml(mapKey)}</option>
      `)
    ].join("");
  }

  const meta = document.getElementById("zoneGuardianCatalogMeta");

  if (meta) {
    meta.textContent = `${zoneGuardianCatalog.guardianCount || 0} guardiani`;
  }

  renderZoneGuardiansList();
}

function getFilteredZoneGuardians() {
  const mapKey =
    document.getElementById("zoneGuardianMapFilter")?.value || "all";
  const query = (
    document.getElementById("zoneGuardianSearch")?.value || ""
  ).trim().toLocaleLowerCase("it-IT");

  return (zoneGuardianCatalog.guardians || []).filter((guardian) => {
    if (mapKey !== "all" && guardian.mapKey !== mapKey) return false;
    if (!query) return true;

    const text = [
      guardian.mapKey,
      guardian.zoneKey,
      guardian.zoneLabel,
      guardian.guardianKey,
      guardian.guardianName,
      guardian.guardianTitle,
      guardian.guardianFullName,
      guardian.provisionalText
    ].join(" ").toLocaleLowerCase("it-IT");

    return text.includes(query);
  });
}

function renderZoneGuardiansList() {
  const container = document.getElementById("zoneGuardiansList");
  if (!container) return;

  const guardians = getFilteredZoneGuardians();

  if (!guardians.length) {
    container.innerHTML = `<p class="empty">Nessun guardiano trovato.</p>`;
    return;
  }

  let previousMap = "";

  container.innerHTML = guardians.map((guardian) => {
    const heading = guardian.mapKey !== previousMap
      ? `<h3 class="quest-group-heading">${escapeHtml(guardian.mapKey || "Senza mappa")}</h3>`
      : "";

    previousMap = guardian.mapKey;

    return `
      ${heading}
      <button
        type="button"
        class="quest-unit-btn zone-guardian-unit-btn ${currentZoneGuardian?.textKey === guardian.textKey ? "active" : ""}"
        data-zone-guardian-text-key="${escapeHtml(guardian.textKey)}"
      >
        <strong>${escapeHtml(guardian.guardianFullName || guardian.guardianName)}</strong>
        <small>${escapeHtml(guardian.zoneLabel)} - ${escapeHtml(guardian.guardianTitle || guardian.guardianKey)}</small>
      </button>
    `;
  }).join("");

  container.querySelectorAll("[data-zone-guardian-text-key]").forEach((button) => {
    button.addEventListener("click", () => {
      const guardian = (zoneGuardianCatalog.guardians || []).find(
        (item) => item.textKey === button.dataset.zoneGuardianTextKey
      );

      if (!guardian) return;

      currentZoneGuardian = guardian;
      renderZoneGuardiansList();
      loadCurrentZoneGuardian();
    });
  });
}

function zoneGuardianLocalDraftKey(textKey) {
  return `author_zone_guardian_text_${textKey}`;
}

function zoneGuardianLocalPublishedKey(textKey) {
  return `author_published_zone_guardian_text_${textKey}`;
}

async function loadCurrentZoneGuardian() {
  if (!currentZoneGuardian) return;

  const loadId = ++zoneGuardianLoadId;
  const textKey = currentZoneGuardian.textKey;

  document.getElementById("zoneGuardianTitle").textContent =
    currentZoneGuardian.guardianFullName || currentZoneGuardian.guardianName;
  document.getElementById("zoneGuardianMeta").textContent =
    `${currentZoneGuardian.zoneLabel} - ${currentZoneGuardian.mapKey}`;
  document.getElementById("zoneGuardianBlockEditor").innerHTML =
    `<div class="card"><p class="empty">Caricamento guardiano...</p></div>`;

  let drafts = [];
  let published = [];

  if (useSupabase && supabaseClient) {
    const [draftResult, publishedResult] = await Promise.all([
      supabaseClient
        .from(tableNames.zoneGuardianTexts)
        .select("*")
        .eq("text_key", textKey),
      supabaseClient
        .from(tableNames.publishedZoneGuardianTexts)
        .select("*")
        .eq("text_key", textKey)
    ]);

    if (loadId !== zoneGuardianLoadId) return;

    if (draftResult.error || publishedResult.error) {
      console.error(draftResult.error || publishedResult.error);
      document.getElementById("zoneGuardianBlockEditor").innerHTML =
        `<div class="card"><p class="empty error">Errore nel caricamento del guardiano.</p></div>`;
      return;
    }

    drafts = draftResult.data || [];
    published = publishedResult.data || [];
  } else {
    drafts = [readLocalJson(zoneGuardianLocalDraftKey(textKey), null)].filter(Boolean);
    published = [readLocalJson(zoneGuardianLocalPublishedKey(textKey), null)].filter(Boolean);
  }

  currentZoneGuardianRows = new Map(drafts.map((row) => [row.text_key, row]));
  currentPublishedZoneGuardianRows = new Map(
    published.map((row) => [row.text_key, row])
  );

  renderZoneGuardianBlock();
}

function renderZoneGuardianBlock() {
  const container = document.getElementById("zoneGuardianBlockEditor");
  if (!container || !currentZoneGuardian) return;

  const draft = currentZoneGuardianRows.get(currentZoneGuardian.textKey);
  const published = currentPublishedZoneGuardianRows.get(currentZoneGuardian.textKey);
  const isPublished =
    published && published.content === String(draft?.content || "").trim();
  const allowPublish = canPublishQuestTexts();

  container.innerHTML = `
    <section class="card quest-field-card weapon-field-card zone-guardian-field-card">
      <div class="card-header">
        <div>
          <p class="eyebrow">Blocco guardiano zona</p>
          <h3>${escapeHtml(currentZoneGuardian.guardianFullName || currentZoneGuardian.guardianName)}</h3>
          <small class="status">
            ${escapeHtml(currentZoneGuardian.zoneLabel)} - ${escapeHtml(currentZoneGuardian.zoneKey)}
          </small>
        </div>
        <span class="quest-status-pill ${isPublished ? "published" : ""}">
          ${isPublished ? "Pubblicato" : draft?.content ? "Bozza salvata" : "Da riscrivere"}
        </span>
      </div>

      <div class="weapon-detail-grid zone-guardian-detail-grid">
        ${currentZoneGuardian.imageUrl ? `
          <figure class="weapon-preview zone-guardian-preview">
            <img src="${escapeHtml(currentZoneGuardian.imageUrl)}" alt="${escapeHtml(currentZoneGuardian.guardianName)}" />
          </figure>
        ` : ""}

        <div class="weapon-facts zone-guardian-facts">
          <span>Mappa <strong>${escapeHtml(currentZoneGuardian.mapKey || "-")}</strong></span>
          <span>Zona <strong>${escapeHtml(currentZoneGuardian.zoneLabel || "-")}</strong></span>
          <span>Guardiano <strong>${escapeHtml(currentZoneGuardian.guardianName || "-")}</strong></span>
          <span>Titolo <strong>${escapeHtml(currentZoneGuardian.guardianTitle || "-")}</strong></span>
        </div>
      </div>

      <div class="quest-field-grid">
        <div class="quest-field-column">
          <span class="quest-field-label">Testo provvisorio</span>
          <p class="quest-provisional-text">${escapeHtml(currentZoneGuardian.provisionalText)}</p>
        </div>

        <div class="quest-field-column">
          <label class="quest-field-label" for="zone-guardian-author-text">Testo autore</label>
          <textarea
            id="zone-guardian-author-text"
            class="quest-author-text zone-guardian-author-text"
            data-zone-guardian-author-text="${escapeHtml(currentZoneGuardian.textKey)}"
            placeholder="Riscrivi qui la descrizione del guardiano della zona..."
          >${escapeHtml(draft?.content || "")}</textarea>
        </div>
      </div>

      <div class="quest-field-actions">
        <button type="button" data-copy-zone-guardian-text="${escapeHtml(currentZoneGuardian.textKey)}">
          Copia testo provvisorio
        </button>
        <button type="button" data-save-zone-guardian-text="${escapeHtml(currentZoneGuardian.textKey)}">
          Salva bozza
        </button>
        ${allowPublish ? `
          <button
            type="button"
            class="quest-publish-btn"
            data-publish-zone-guardian-text="${escapeHtml(currentZoneGuardian.textKey)}"
          >
            Pubblica nel gioco
          </button>
        ` : ""}
        <span class="status" data-zone-guardian-status="${escapeHtml(currentZoneGuardian.textKey)}"></span>
      </div>
    </section>
  `;

  container.querySelector("[data-copy-zone-guardian-text]")?.addEventListener(
    "click",
    () => copyZoneGuardianProvisional(currentZoneGuardian.textKey)
  );
  container.querySelector("[data-save-zone-guardian-text]")?.addEventListener(
    "click",
    () => saveZoneGuardianText(currentZoneGuardian.textKey)
  );
  container.querySelector("[data-publish-zone-guardian-text]")?.addEventListener(
    "click",
    () => publishZoneGuardianText(currentZoneGuardian.textKey)
  );
}

function getZoneGuardianByTextKey(textKey) {
  return (zoneGuardianCatalog.guardians || []).find((guardian) => {
    return guardian.textKey === textKey;
  }) || null;
}

function getZoneGuardianTextarea(textKey) {
  return document.querySelector(`[data-zone-guardian-author-text="${textKey}"]`);
}

function setZoneGuardianStatus(textKey, message, type = "") {
  const status = document.querySelector(`[data-zone-guardian-status="${textKey}"]`);
  if (!status) return;

  status.textContent = message || "";
  status.className = `status ${type}`.trim();
}

function copyZoneGuardianProvisional(textKey) {
  const guardian = getZoneGuardianByTextKey(textKey);
  const textarea = getZoneGuardianTextarea(textKey);

  if (!guardian || !textarea) return;

  textarea.value = guardian.provisionalText;
  textarea.focus();
  setZoneGuardianStatus(textKey, "Testo provvisorio copiato. Salva la bozza.", "ok");
}

async function saveZoneGuardianText(textKey, { quiet = false } = {}) {
  const guardian = getZoneGuardianByTextKey(textKey);
  const textarea = getZoneGuardianTextarea(textKey);

  if (!guardian || !textarea) return null;

  const content = textarea.value.trim();
  const previous = currentZoneGuardianRows.get(textKey);

  if (previous?.content === content) {
    if (!quiet) setZoneGuardianStatus(textKey, "Nessuna modifica da salvare.");
    return previous;
  }

  const user = getUser();
  const now = new Date().toISOString();
  const payload = {
    text_key: textKey,
    source_file: zoneGuardianCatalog.sourceFile || guardian.sourceFile || "maps-config.js",
    map_key: guardian.mapKey,
    zone_key: guardian.zoneKey,
    zone_label: guardian.zoneLabel,
    guardian_key: guardian.guardianKey,
    guardian_name: guardian.guardianName,
    guardian_title: guardian.guardianTitle,
    guardian_full_name: guardian.guardianFullName,
    image: guardian.image,
    provisional_text: guardian.provisionalText,
    content,
    status: "draft",
    updated_by: `${user.name} - ${user.role}`,
    updated_at: now
  };

  if (!quiet) setZoneGuardianStatus(textKey, "Salvataggio...");

  if (useSupabase && supabaseClient) {
    if (previous) {
      const { error: versionError } = await supabaseClient
        .from(tableNames.zoneGuardianVersions)
        .insert({
          text_key: textKey,
          content: previous.content || "",
          edited_by: payload.updated_by
        });

      if (versionError) {
        console.warn("Cronologia testo guardiano zona non salvata:", versionError);
      }
    }

    const { error } = await supabaseClient
      .from(tableNames.zoneGuardianTexts)
      .upsert(payload, { onConflict: "text_key" });

    if (error) {
      console.error(error);
      setZoneGuardianStatus(textKey, "Errore nel salvataggio.", "error");
      return null;
    }
  } else {
    localStorage.setItem(zoneGuardianLocalDraftKey(textKey), JSON.stringify(payload));
  }

  currentZoneGuardianRows.set(textKey, payload);

  if (!quiet) {
    setZoneGuardianStatus(textKey, "Bozza salvata.", "ok");
    renderZoneGuardianBlock();
  }

  return payload;
}

async function publishZoneGuardianText(textKey) {
  if (!canPublishQuestTexts()) {
    setZoneGuardianStatus(textKey, "Solo revisore o admin puo pubblicare.", "error");
    return;
  }

  const draft = await saveZoneGuardianText(textKey, { quiet: true });

  if (!draft?.content) {
    setZoneGuardianStatus(textKey, "Scrivi e salva un testo prima di pubblicare.", "error");
    return;
  }

  const user = getUser();
  const payload = {
    text_key: draft.text_key,
    source_file: draft.source_file,
    map_key: draft.map_key,
    zone_key: draft.zone_key,
    zone_label: draft.zone_label,
    guardian_key: draft.guardian_key,
    guardian_name: draft.guardian_name,
    guardian_title: draft.guardian_title,
    guardian_full_name: draft.guardian_full_name,
    image: draft.image,
    content: draft.content,
    published_by: `${user.name} - ${user.role}`,
    published_at: new Date().toISOString()
  };

  setZoneGuardianStatus(textKey, "Pubblicazione...");

  if (useSupabase && supabaseClient) {
    const { error } = await supabaseClient
      .from(tableNames.publishedZoneGuardianTexts)
      .upsert(payload, { onConflict: "text_key" });

    if (error) {
      console.error(error);
      setZoneGuardianStatus(textKey, "Errore nella pubblicazione.", "error");
      return;
    }
  } else {
    localStorage.setItem(zoneGuardianLocalPublishedKey(textKey), JSON.stringify(payload));
  }

  currentPublishedZoneGuardianRows.set(textKey, payload);
  setZoneGuardianStatus(textKey, "Testo pubblicato.", "ok");
  renderZoneGuardianBlock();
}

function bindFragmentWorkspace() {
  const fragmentsTab = document.getElementById("fragmentsTabBtn");
  const classFilter = document.getElementById("fragmentClassFilter");
  const search = document.getElementById("fragmentSearch");
  const reloadButton = document.getElementById("reloadFragmentBtn");

  fragmentsTab?.addEventListener("click", () => switchAuthorWorkspace("fragments"));
  classFilter?.addEventListener("change", renderFragmentsList);
  search?.addEventListener("input", renderFragmentsList);
  reloadButton?.addEventListener("click", () => loadCurrentFragment());

  if (classFilter) {
    classFilter.innerHTML = [
      `<option value="all">Tutte le classi</option>`,
      ...(fragmentCatalog.classes || []).map((fragmentClass) => `
        <option value="${escapeHtml(fragmentClass.key)}">
          ${escapeHtml(fragmentClass.label)} (${Number(fragmentClass.count || 0)})
        </option>
      `)
    ].join("");
  }

  const meta = document.getElementById("fragmentCatalogMeta");

  if (meta) {
    meta.textContent = `${fragmentCatalog.fragmentCount || 0} echi`;
  }

  renderFragmentsList();
}

function getFilteredFragments() {
  const fragmentClass =
    document.getElementById("fragmentClassFilter")?.value || "all";
  const query = (
    document.getElementById("fragmentSearch")?.value || ""
  ).trim().toLocaleLowerCase("it-IT");

  return (fragmentCatalog.fragments || []).filter((fragment) => {
    if (fragmentClass !== "all" && fragment.fragmentClass !== fragmentClass) return false;
    if (!query) return true;

    const text = [
      fragment.fragmentId,
      fragment.fragmentName,
      fragment.originMonsterId,
      fragment.originType,
      fragment.fragmentClass,
      fragment.fragmentClassLabel,
      fragment.difficultyTier,
      fragment.spiritualTier,
      fragment.provisionalText
    ].join(" ").toLocaleLowerCase("it-IT");

    return text.includes(query);
  });
}

function renderFragmentsList() {
  const container = document.getElementById("fragmentsList");
  if (!container) return;

  const fragments = getFilteredFragments();

  if (!fragments.length) {
    container.innerHTML = `<p class="empty">Nessun eco trovato.</p>`;
    return;
  }

  let previousClass = "";

  container.innerHTML = fragments.map((fragment) => {
    const heading = fragment.fragmentClass !== previousClass
      ? `<h3 class="quest-group-heading">${escapeHtml(fragment.fragmentClassLabel || "Senza classe")}</h3>`
      : "";

    previousClass = fragment.fragmentClass;

    return `
      ${heading}
      <button
        type="button"
        class="quest-unit-btn fragment-unit-btn ${currentFragment?.textKey === fragment.textKey ? "active" : ""}"
        data-fragment-text-key="${escapeHtml(fragment.textKey)}"
      >
        <strong>${escapeHtml(fragment.fragmentName)}</strong>
        <small>${escapeHtml(fragment.originMonsterId)} - ${escapeHtml(fragment.difficultyLabel)} - ${escapeHtml(fragment.spiritualLabel)}</small>
      </button>
    `;
  }).join("");

  container.querySelectorAll("[data-fragment-text-key]").forEach((button) => {
    button.addEventListener("click", () => {
      const fragment = (fragmentCatalog.fragments || []).find(
        (item) => item.textKey === button.dataset.fragmentTextKey
      );

      if (!fragment) return;

      currentFragment = fragment;
      renderFragmentsList();
      loadCurrentFragment();
    });
  });
}

function fragmentLocalDraftKey(textKey) {
  return `author_fragment_text_${textKey}`;
}

function fragmentLocalPublishedKey(textKey) {
  return `author_published_fragment_text_${textKey}`;
}

async function loadCurrentFragment() {
  if (!currentFragment) return;

  const loadId = ++fragmentLoadId;
  const textKey = currentFragment.textKey;

  document.getElementById("fragmentTitle").textContent = currentFragment.fragmentName;
  document.getElementById("fragmentMeta").textContent =
    `${currentFragment.fragmentClassLabel} - origine ${currentFragment.originMonsterId}`;
  document.getElementById("fragmentBlockEditor").innerHTML =
    `<div class="card"><p class="empty">Caricamento eco...</p></div>`;

  let drafts = [];
  let published = [];

  if (useSupabase && supabaseClient) {
    const [draftResult, publishedResult] = await Promise.all([
      supabaseClient
        .from(tableNames.fragmentTexts)
        .select("*")
        .eq("text_key", textKey),
      supabaseClient
        .from(tableNames.publishedFragmentTexts)
        .select("*")
        .eq("text_key", textKey)
    ]);

    if (loadId !== fragmentLoadId) return;

    if (draftResult.error || publishedResult.error) {
      console.error(draftResult.error || publishedResult.error);
      document.getElementById("fragmentBlockEditor").innerHTML =
        `<div class="card"><p class="empty error">Errore nel caricamento dell'eco.</p></div>`;
      return;
    }

    drafts = draftResult.data || [];
    published = publishedResult.data || [];
  } else {
    drafts = [readLocalJson(fragmentLocalDraftKey(textKey), null)].filter(Boolean);
    published = [readLocalJson(fragmentLocalPublishedKey(textKey), null)].filter(Boolean);
  }

  currentFragmentRows = new Map(drafts.map((row) => [row.text_key, row]));
  currentPublishedFragmentRows = new Map(
    published.map((row) => [row.text_key, row])
  );

  renderFragmentBlock();
}

function renderFragmentBlock() {
  const container = document.getElementById("fragmentBlockEditor");
  if (!container || !currentFragment) return;

  const draft = currentFragmentRows.get(currentFragment.textKey);
  const published = currentPublishedFragmentRows.get(currentFragment.textKey);
  const isPublished =
    published && published.content === String(draft?.content || "").trim();
  const allowPublish = canPublishQuestTexts();
  const rewards = currentFragment.rewards || {};

  container.innerHTML = `
    <section class="card quest-field-card weapon-field-card fragment-field-card">
      <div class="card-header">
        <div>
          <p class="eyebrow">Blocco eco</p>
          <h3>${escapeHtml(currentFragment.fragmentName)}</h3>
          <small class="status">
            ${escapeHtml(currentFragment.fragmentId)} - ${escapeHtml(currentFragment.fragmentClassLabel)}
          </small>
        </div>
        <span class="quest-status-pill ${isPublished ? "published" : ""}">
          ${isPublished ? "Pubblicato" : draft?.content ? "Bozza salvata" : "Da riscrivere"}
        </span>
      </div>

      <div class="weapon-detail-grid fragment-detail-grid">
        ${currentFragment.imageUrl ? `
          <figure class="weapon-preview fragment-preview">
            <img src="${escapeHtml(currentFragment.imageUrl)}" alt="${escapeHtml(currentFragment.fragmentName)}" />
          </figure>
        ` : ""}

        <div class="weapon-facts fragment-facts">
          <span>Origine <strong>${escapeHtml(currentFragment.originMonsterId || "-")}</strong></span>
          <span>Tipo origine <strong>${escapeHtml(currentFragment.originType || "-")}</strong></span>
          <span>Difficolta <strong>${escapeHtml(currentFragment.difficultyLabel || "-")}</strong></span>
          <span>Tier spirituale <strong>${escapeHtml(currentFragment.spiritualLabel || "-")}</strong></span>
          <span>Ricompense <strong>${escapeHtml(`Anima ${rewards.anima || 0}, Purificazione ${rewards.purificazione || 0}`)}</strong></span>
        </div>
      </div>

      <div class="quest-field-grid">
        <div class="quest-field-column">
          <span class="quest-field-label">Descrizione provvisoria</span>
          <p class="quest-provisional-text">${escapeHtml(currentFragment.provisionalText)}</p>
        </div>

        <div class="quest-field-column">
          <label class="quest-field-label" for="fragment-author-text">Testo autore</label>
          <textarea
            id="fragment-author-text"
            class="quest-author-text fragment-author-text"
            data-fragment-author-text="${escapeHtml(currentFragment.textKey)}"
            placeholder="Riscrivi qui la descrizione dell'eco..."
          >${escapeHtml(draft?.content || "")}</textarea>
        </div>
      </div>

      <div class="quest-field-actions">
        <button type="button" data-copy-fragment-text="${escapeHtml(currentFragment.textKey)}">
          Copia descrizione
        </button>
        <button type="button" data-save-fragment-text="${escapeHtml(currentFragment.textKey)}">
          Salva bozza
        </button>
        ${allowPublish ? `
          <button
            type="button"
            class="quest-publish-btn"
            data-publish-fragment-text="${escapeHtml(currentFragment.textKey)}"
          >
            Pubblica nel gioco
          </button>
        ` : ""}
        <span class="status" data-fragment-status="${escapeHtml(currentFragment.textKey)}"></span>
      </div>
    </section>
  `;

  container.querySelector("[data-copy-fragment-text]")?.addEventListener(
    "click",
    () => copyFragmentProvisional(currentFragment.textKey)
  );
  container.querySelector("[data-save-fragment-text]")?.addEventListener(
    "click",
    () => saveFragmentText(currentFragment.textKey)
  );
  container.querySelector("[data-publish-fragment-text]")?.addEventListener(
    "click",
    () => publishFragmentText(currentFragment.textKey)
  );
}

function getFragmentByTextKey(textKey) {
  return (fragmentCatalog.fragments || []).find((fragment) => {
    return fragment.textKey === textKey;
  }) || null;
}

function getFragmentTextarea(textKey) {
  return document.querySelector(`[data-fragment-author-text="${textKey}"]`);
}

function setFragmentStatus(textKey, message, type = "") {
  const status = document.querySelector(`[data-fragment-status="${textKey}"]`);
  if (!status) return;

  status.textContent = message || "";
  status.className = `status ${type}`.trim();
}

function copyFragmentProvisional(textKey) {
  const fragment = getFragmentByTextKey(textKey);
  const textarea = getFragmentTextarea(textKey);

  if (!fragment || !textarea) return;

  textarea.value = fragment.provisionalText;
  textarea.focus();
  setFragmentStatus(textKey, "Descrizione copiata. Salva la bozza.", "ok");
}

async function saveFragmentText(textKey, { quiet = false } = {}) {
  const fragment = getFragmentByTextKey(textKey);
  const textarea = getFragmentTextarea(textKey);

  if (!fragment || !textarea) return null;

  const content = textarea.value.trim();
  const previous = currentFragmentRows.get(textKey);

  if (previous?.content === content) {
    if (!quiet) setFragmentStatus(textKey, "Nessuna modifica da salvare.");
    return previous;
  }

  const user = getUser();
  const now = new Date().toISOString();
  const payload = {
    text_key: textKey,
    source_file: fragmentCatalog.sourceFile || fragment.sourceFile || "fragments-config.js",
    fragment_id: fragment.fragmentId,
    fragment_name: fragment.fragmentName,
    origin_monster_id: fragment.originMonsterId,
    origin_type: fragment.originType,
    fragment_class: fragment.fragmentClass,
    difficulty_tier: fragment.difficultyTier,
    spiritual_tier: fragment.spiritualTier,
    image: fragment.image,
    rewards: fragment.rewards || {},
    provisional_text: fragment.provisionalText,
    content,
    status: "draft",
    updated_by: `${user.name} - ${user.role}`,
    updated_at: now
  };

  if (!quiet) setFragmentStatus(textKey, "Salvataggio...");

  if (useSupabase && supabaseClient) {
    if (previous) {
      const { error: versionError } = await supabaseClient
        .from(tableNames.fragmentVersions)
        .insert({
          text_key: textKey,
          content: previous.content || "",
          edited_by: payload.updated_by
        });

      if (versionError) {
        console.warn("Cronologia testo eco non salvata:", versionError);
      }
    }

    const { error } = await supabaseClient
      .from(tableNames.fragmentTexts)
      .upsert(payload, { onConflict: "text_key" });

    if (error) {
      console.error(error);
      setFragmentStatus(textKey, "Errore nel salvataggio.", "error");
      return null;
    }
  } else {
    localStorage.setItem(fragmentLocalDraftKey(textKey), JSON.stringify(payload));
  }

  currentFragmentRows.set(textKey, payload);

  if (!quiet) {
    setFragmentStatus(textKey, "Bozza salvata.", "ok");
    renderFragmentBlock();
  }

  return payload;
}

async function publishFragmentText(textKey) {
  if (!canPublishQuestTexts()) {
    setFragmentStatus(textKey, "Solo revisore o admin puo pubblicare.", "error");
    return;
  }

  const draft = await saveFragmentText(textKey, { quiet: true });

  if (!draft?.content) {
    setFragmentStatus(textKey, "Scrivi e salva un testo prima di pubblicare.", "error");
    return;
  }

  const user = getUser();
  const payload = {
    text_key: draft.text_key,
    source_file: draft.source_file,
    fragment_id: draft.fragment_id,
    fragment_name: draft.fragment_name,
    origin_monster_id: draft.origin_monster_id,
    origin_type: draft.origin_type,
    fragment_class: draft.fragment_class,
    difficulty_tier: draft.difficulty_tier,
    spiritual_tier: draft.spiritual_tier,
    image: draft.image,
    rewards: draft.rewards || {},
    content: draft.content,
    published_by: `${user.name} - ${user.role}`,
    published_at: new Date().toISOString()
  };

  setFragmentStatus(textKey, "Pubblicazione...");

  if (useSupabase && supabaseClient) {
    const { error } = await supabaseClient
      .from(tableNames.publishedFragmentTexts)
      .upsert(payload, { onConflict: "text_key" });

    if (error) {
      console.error(error);
      setFragmentStatus(textKey, "Errore nella pubblicazione.", "error");
      return;
    }
  } else {
    localStorage.setItem(fragmentLocalPublishedKey(textKey), JSON.stringify(payload));
  }

  currentPublishedFragmentRows.set(textKey, payload);
  setFragmentStatus(textKey, "Testo pubblicato.", "ok");
  renderFragmentBlock();
}

function getRegularModalTextUnits() {
  return (modalTextCatalog.units || []).filter((unit) => {
    return unit.modalId !== customEventObjectModalId &&
      unit.modalId !== botNarrativeModalId;
  });
}

function getCustomEventObjectTextUnits() {
  return (modalTextCatalog.units || []).filter((unit) => {
    return unit.modalId === customEventObjectModalId;
  });
}

function getRegularModalDefinitions() {
  return (modalTextCatalog.modals || []).filter((modal) => {
    return modal.id !== customEventObjectModalId;
  });
}

function getModalTextWorkspaceUi(context = "modals") {
  if (context === "bots") {
    return {
      titleId: "botNarrativeTitle",
      metaId: "botNarrativeMeta",
      editorId: "botNarrativeBlockEditor",
      loadingText: "Caricamento frase del bot...",
      errorText: "Errore nel caricamento della frase del bot.",
      blockEyebrow: "Voce del bot",
      placeholder: "Scrivi qui la frase pronunciata dal bot..."
    };
  }

  if (context === "customEventObjects") {
    return {
      titleId: "customEventObjectTitle",
      metaId: "customEventObjectMeta",
      editorId: "customEventObjectBlockEditor",
      loadingText: "Caricamento oggetto evento...",
      errorText: "Errore nel caricamento dell'oggetto evento.",
      blockEyebrow: "Blocco oggetto evento",
      placeholder: "Riscrivi qui la descrizione dell'oggetto..."
    };
  }

  return {
    titleId: "modalTextTitle",
    metaId: "modalTextMeta",
    editorId: "modalTextBlockEditor",
    loadingText: "Caricamento testo modale...",
    errorText: "Errore nel caricamento del testo modale.",
    blockEyebrow: "Blocco modale",
    placeholder: "Riscrivi qui il testo della modale..."
  };
}

function renderActiveModalTextBlock() {
  const unit = getModalTextByTextKey(activeModalTextKey);
  if (!unit) return;
  renderModalTextBlock(activeModalTextContext, unit);
}

function bindModalTextWorkspace() {
  const modalsTab = document.getElementById("modalsTabBtn");
  const modalFilter = document.getElementById("modalTextModalFilter");
  const search = document.getElementById("modalTextSearch");
  const reloadButton = document.getElementById("reloadModalTextBtn");

  modalsTab?.addEventListener("click", () => switchAuthorWorkspace("modals"));
  modalFilter?.addEventListener("change", renderModalTextsList);
  search?.addEventListener("input", renderModalTextsList);
  reloadButton?.addEventListener("click", () => loadCurrentModalText());

  if (modalFilter) {
    modalFilter.innerHTML = [
      `<option value="all">Tutte le modali</option>`,
      ...getRegularModalDefinitions().map((modal) => `
        <option value="${escapeHtml(modal.id)}">
          ${escapeHtml(modal.label)} (${Number(modal.textCount || 0)})
        </option>
      `)
    ].join("");
  }

  const meta = document.getElementById("modalTextCatalogMeta");

  if (meta) {
    const units = getRegularModalTextUnits();
    const modals = getRegularModalDefinitions();
    meta.textContent =
      `${modals.length} modali - ${units.length} testi`;
  }

  renderModalTextsList();
}

function getFilteredModalTexts() {
  const modalId =
    document.getElementById("modalTextModalFilter")?.value || "all";
  const query = (
    document.getElementById("modalTextSearch")?.value || ""
  ).trim().toLocaleLowerCase("it-IT");

  return (modalTextCatalog.units || []).filter((unit) => {
    if (modalId !== "all" && unit.modalId !== modalId) return false;
    if (!query) return true;

    const text = [
      unit.modalLabel,
      unit.category,
      unit.sourceFile,
      unit.fieldKey,
      unit.fieldLabel,
      unit.itemKey,
      unit.itemLabel,
      unit.metadata?.playerLabel,
      unit.metadata?.attribute,
      unit.metadata?.legacyKey,
      Array.isArray(unit.metadata?.attributesAffected)
        ? unit.metadata.attributesAffected.join(" ")
        : "",
      Array.isArray(unit.metadata?.collectEffects)
        ? unit.metadata.collectEffects.map((effect) => `${effect.label} ${effect.stat}`).join(" ")
        : "",
      unit.metadata?.hungerGain,
      unit.metadata?.target,
      unit.metadata?.rulesKey,
      unit.metadata?.category,
      unit.metadata?.actionType,
      unit.metadata?.price,
      unit.metadata?.maxPerTurn,
      unit.metadata?.effectJson
        ? Object.entries(unit.metadata.effectJson).map(([key, value]) => `${key} ${value}`).join(" ")
        : "",
      unit.metadata?.useMode,
      unit.metadata?.basePrice,
      unit.metadata?.healthGain,
      unit.metadata?.staminaGain,
      unit.metadata?.marketAvailable,
      unit.metadata?.alchemyOrderable,
      Array.isArray(unit.metadata?.progression)
        ? unit.metadata.progression.map((step) => `${step.tier} ${step.cost} ${step.wait_minutes} ${step.effect?.type}`).join(" ")
        : "",
      unit.textType,
      unit.provisionalText
    ].join(" ").toLocaleLowerCase("it-IT");

    return text.includes(query);
  });
}

function renderModalTextsList() {
  const container = document.getElementById("modalTextsList");
  if (!container) return;

  const units = getFilteredModalTexts();

  if (!units.length) {
    container.innerHTML = `<p class="empty">Nessun testo modale trovato.</p>`;
    return;
  }

  let previousModal = "";

  container.innerHTML = units.map((unit) => {
    const heading = unit.modalId !== previousModal
      ? `<h3 class="quest-group-heading">${escapeHtml(unit.modalLabel || "Modale")}</h3>`
      : "";

    previousModal = unit.modalId;

    return `
      ${heading}
      <button
        type="button"
        class="quest-unit-btn modal-text-unit-btn ${currentModalText?.textKey === unit.textKey ? "active" : ""}"
        data-modal-text-key="${escapeHtml(unit.textKey)}"
      >
        <strong>${escapeHtml(unit.fieldLabel)}</strong>
        <small>${escapeHtml(unit.itemLabel || unit.textType)} - ${escapeHtml(unit.sourceFile)}</small>
      </button>
    `;
  }).join("");

  container.querySelectorAll("[data-modal-text-key]").forEach((button) => {
    button.addEventListener("click", () => {
      const unit = getRegularModalTextUnits().find(
        (item) => item.textKey === button.dataset.modalTextKey
      );

      if (!unit) return;

      currentModalText = unit;
      renderModalTextsList();
      loadCurrentModalText();
    });
  });
}

function bindCustomEventObjectWorkspace() {
  const tab = document.getElementById("customEventObjectsTabBtn");
  const categoryFilter = document.getElementById("customEventObjectCategoryFilter");
  const search = document.getElementById("customEventObjectSearch");
  const reloadButton = document.getElementById("reloadCustomEventObjectBtn");

  tab?.addEventListener("click", () => switchAuthorWorkspace("customEventObjects"));
  categoryFilter?.addEventListener("change", renderCustomEventObjectsList);
  search?.addEventListener("input", renderCustomEventObjectsList);
  reloadButton?.addEventListener("click", () => {
    if (!currentCustomEventObjectText) return;
    loadCurrentModalText({
      context: "customEventObjects",
      unit: currentCustomEventObjectText
    });
  });

  const units = getCustomEventObjectTextUnits();

  if (categoryFilter) {
    const categories = [...new Set(units.map((unit) => unit.metadata?.category || unit.category))]
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, "it-IT", { sensitivity: "base" }));

    categoryFilter.innerHTML = [
      `<option value="all">Tutte le categorie</option>`,
      ...categories.map((category) => `
        <option value="${escapeHtml(category)}">${escapeHtml(category)}</option>
      `)
    ].join("");
  }

  const meta = document.getElementById("customEventObjectCatalogMeta");

  if (meta) {
    const officialItems = units.filter((unit) => unit.textType === "interaction_item_description").length;
    const templates = units.filter((unit) => unit.textType === "dynamic_object_template_description").length;
    const bundles = units.filter((unit) => unit.textType === "dynamic_object_bundle_description").length;
    meta.textContent = `${officialItems} ufficiali - ${templates} template - ${bundles} pacchetti`;
  }

  renderCustomEventObjectsList();
}

function bindBotNarrativeWorkspace() {
  const tab = document.getElementById("botsTabBtn");
  const botFilter = document.getElementById("botNarrativeBotFilter");
  const search = document.getElementById("botNarrativeSearch");
  const reloadButton = document.getElementById("reloadBotNarrativeBtn");

  tab?.addEventListener("click", () => switchAuthorWorkspace("bots"));
  botFilter?.addEventListener("change", () => {
    const first = getFilteredBotNarrativeTexts()[0] || null;
    currentBotNarrativeText = first;
    renderBotNarrativesList();
    if (first) loadCurrentModalText({ context: "bots", unit: first });
  });
  search?.addEventListener("input", renderBotNarrativesList);
  reloadButton?.addEventListener("click", () => {
    if (currentBotNarrativeText) {
      loadCurrentModalText({ context: "bots", unit: currentBotNarrativeText });
    }
  });

  if (botFilter) {
    botFilter.innerHTML = (botNarrativeCatalog.bots || []).map((bot) => `
      <option value="${escapeHtml(bot.key)}">${escapeHtml(bot.label)}</option>
    `).join("");
  }

  const meta = document.getElementById("botNarrativeCatalogMeta");
  if (meta) {
    meta.textContent = `${botNarrativeCatalog.botCount || 0} bot - ${botNarrativeCatalog.actionCount || 0} azioni - ${botNarrativeCatalog.phraseCount || 0} frasi`;
  }

  renderBotNarrativesList();
}

function getFilteredBotNarrativeTexts() {
  const botKey = document.getElementById("botNarrativeBotFilter")?.value ||
    botNarrativeCatalog.bots?.[0]?.key || "";
  const query = (document.getElementById("botNarrativeSearch")?.value || "")
    .trim()
    .toLocaleLowerCase("it-IT");

  return (botNarrativeCatalog.units || []).filter((unit) => {
    if (unit.metadata?.botKey !== botKey) return false;
    if (!query) return true;
    return [
      unit.metadata?.actionLabel,
      unit.metadata?.actionMeaning,
      ...(unit.metadata?.providers || [])
    ].join(" ").toLocaleLowerCase("it-IT").includes(query);
  });
}

function renderBotNarrativesList() {
  const container = document.getElementById("botNarrativesList");
  if (!container) return;
  const units = getFilteredBotNarrativeTexts();

  if (!units.length) {
    container.innerHTML = `<p class="empty">Nessuna azione trovata.</p>`;
    return;
  }

  let previousAction = "";
  container.innerHTML = units.map((unit) => {
    const actionKey = unit.metadata?.actionKey || "";
    const heading = actionKey !== previousAction
      ? `<h3 class="quest-group-heading">${Number(unit.metadata?.actionIndex || 0)}. ${escapeHtml(unit.metadata?.actionLabel || "Azione")}</h3>`
      : "";
    previousAction = actionKey;
    return `
      ${heading}
      <button
        type="button"
        class="quest-unit-btn modal-text-unit-btn ${currentBotNarrativeText?.textKey === unit.textKey ? "active" : ""}"
        data-bot-narrative-key="${escapeHtml(unit.textKey)}"
      >
        <strong>Frase ${Number(unit.metadata?.phraseSlot || 0)}</strong>
        <small>${escapeHtml(unit.metadata?.actionMeaning || "")}</small>
      </button>
    `;
  }).join("");

  container.querySelectorAll("[data-bot-narrative-key]").forEach((button) => {
    button.addEventListener("click", () => {
      const unit = (botNarrativeCatalog.units || []).find(
        (item) => item.textKey === button.dataset.botNarrativeKey
      );
      if (!unit) return;
      currentBotNarrativeText = unit;
      renderBotNarrativesList();
      loadCurrentModalText({ context: "bots", unit });
    });
  });
}

function getFilteredCustomEventObjectTexts() {
  const category =
    document.getElementById("customEventObjectCategoryFilter")?.value || "all";
  const query = (
    document.getElementById("customEventObjectSearch")?.value || ""
  ).trim().toLocaleLowerCase("it-IT");

  return getCustomEventObjectTextUnits().filter((unit) => {
    const unitCategory = unit.metadata?.category || unit.category || "";
    if (category !== "all" && unitCategory !== category) return false;
    if (!query) return true;

    const metadata = unit.metadata || {};
    const members = Array.isArray(metadata.members)
      ? metadata.members.map((member) => `${member.templateKey} ${member.role}`).join(" ")
      : "";
    const text = [
      unit.fieldLabel,
      unit.itemKey,
      unit.itemLabel,
      unit.provisionalText,
      unitCategory,
      metadata.entryType,
      metadata.accessType,
      metadata.placementMode,
      metadata.claimMode,
      metadata.useMode,
      Array.isArray(metadata.tags) ? metadata.tags.join(" ") : "",
      members
    ].join(" ").toLocaleLowerCase("it-IT");

    return text.includes(query);
  });
}

function renderCustomEventObjectsList() {
  const container = document.getElementById("customEventObjectsList");
  if (!container) return;

  const units = getFilteredCustomEventObjectTexts();

  if (!units.length) {
    container.innerHTML = `<p class="empty">Nessun oggetto evento trovato.</p>`;
    return;
  }

  let previousGroup = "";

  container.innerHTML = units.map((unit) => {
    const group = unit.textType === "interaction_item_description"
      ? "Catalogo ufficiale"
      : unit.textType === "dynamic_object_bundle_description"
        ? "Pacchetti oggetto"
        : "Template eventi custom";
    const heading = group !== previousGroup
      ? `<h3 class="quest-group-heading">${escapeHtml(group)}</h3>`
      : "";

    previousGroup = group;

    return `
      ${heading}
      <button
        type="button"
        class="quest-unit-btn modal-text-unit-btn ${currentCustomEventObjectText?.textKey === unit.textKey ? "active" : ""}"
        data-custom-event-object-key="${escapeHtml(unit.textKey)}"
      >
        <strong>${escapeHtml(unit.itemLabel || unit.fieldLabel)}</strong>
        <small>${escapeHtml(unit.metadata?.category || unit.category || "Oggetti")} - ${escapeHtml(
          unit.textType === "interaction_item_description"
            ? "Ufficiale"
            : unit.textType === "dynamic_object_bundle_description"
              ? "Pacchetto"
              : "Template"
        )}</small>
      </button>
    `;
  }).join("");

  container.querySelectorAll("[data-custom-event-object-key]").forEach((button) => {
    button.addEventListener("click", () => {
      const unit = getCustomEventObjectTextUnits().find(
        (item) => item.textKey === button.dataset.customEventObjectKey
      );

      if (!unit) return;

      currentCustomEventObjectText = unit;
      renderCustomEventObjectsList();
      loadCurrentModalText({
        context: "customEventObjects",
        unit: currentCustomEventObjectText
      });
    });
  });
}

function modalTextLocalDraftKey(textKey) {
  return `author_modal_text_${textKey}`;
}

function modalTextLocalPublishedKey(textKey) {
  return `author_published_modal_text_${textKey}`;
}

async function loadCurrentModalText(options = {}) {
  const context = options.context || "modals";
  const unit =
    options.unit ||
    (context === "customEventObjects"
      ? currentCustomEventObjectText
      : context === "bots"
        ? currentBotNarrativeText
        : currentModalText);

  if (!unit) return;

  const loadId = ++modalTextLoadId;
  const textKey = unit.textKey;
  const ui = getModalTextWorkspaceUi(context);

  activeModalTextContext = context;
  activeModalTextKey = textKey;

  document.getElementById(ui.titleId).textContent = unit.fieldLabel;
  document.getElementById(ui.metaId).textContent =
    `${unit.modalLabel} - ${unit.textType}`;
  document.getElementById(ui.editorId).innerHTML =
    `<div class="card"><p class="empty">${escapeHtml(ui.loadingText)}</p></div>`;

  let drafts = [];
  let published = [];

  if (useSupabase && supabaseClient) {
    const [draftResult, publishedResult] = await Promise.all([
      supabaseClient
        .from(tableNames.modalTexts)
        .select("*")
        .eq("text_key", textKey),
      supabaseClient
        .from(tableNames.publishedModalTexts)
        .select("*")
        .eq("text_key", textKey)
    ]);

    if (loadId !== modalTextLoadId) return;

    if (draftResult.error || publishedResult.error) {
      console.error(draftResult.error || publishedResult.error);
      document.getElementById(ui.editorId).innerHTML =
        `<div class="card"><p class="empty error">${escapeHtml(ui.errorText)}</p></div>`;
      return;
    }

    drafts = draftResult.data || [];
    published = publishedResult.data || [];
  } else {
    drafts = [readLocalJson(modalTextLocalDraftKey(textKey), null)].filter(Boolean);
    published = [readLocalJson(modalTextLocalPublishedKey(textKey), null)].filter(Boolean);
  }

  currentModalTextRows = new Map(drafts.map((row) => [row.text_key, row]));
  currentPublishedModalTextRows = new Map(
    published.map((row) => [row.text_key, row])
  );

  renderModalTextBlock(context, unit);
}

function formatModalMetadataCost(cost = {}) {
  const entries = Object.entries(cost || {});

  if (!entries.length) return "-";

  return entries
    .map(([key, value]) => `${Number(value || 0)} ${key}`)
    .join(", ");
}

function formatModalDuration(milliseconds = 0) {
  const totalSeconds = Math.max(0, Math.ceil(Number(milliseconds || 0) / 1000));
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");

  return `${minutes}:${seconds}`;
}

function formatModalEffectJson(effectJson = {}) {
  const labels = {
    health_gain: "Salute",
    stamina_gain: "Stamina",
    hunger_gain: "Fame",
    prestige_gain: "Prestigio",
    corruption_gain: "Corruzione",
    intoxication_gain: "Ebbrezza",
    ebbrezza_gain: "Ebbrezza",
    quantity: "Quantita",
    wine_glasses: "Calici vino",
    altered_state_turns: "Turni alterati",
    altered_state_source: "Fonte stato alterato",
    usage_group: "Gruppo uso"
  };
  const parts = [];

  for (const [key, value] of Object.entries(effectJson || {})) {
    if (key === "item_key" && value) {
      parts.push(`Oggetto: ${value}`);
      continue;
    }

    const numericValue = Number(value || 0);

    const label = labels[key] || key;

    if (typeof value === "string" && value.trim()) {
      parts.push(`${label}: ${value}`);
    } else if (!Number.isNaN(numericValue) && (numericValue !== 0 || key === "quantity")) {
      const sign = numericValue > 0 && key !== "quantity" ? "+" : "";
      parts.push(`${label} ${sign}${numericValue}`);
    }
  }

  return parts.join(", ") || "-";
}

function formatModalPotionProgression(progression = []) {
  if (!Array.isArray(progression) || !progression.length) return "-";

  return progression
    .map((step = {}) => {
      const effect = step.effect || {};
      const effectLabel =
        effect.type === "corruption_reduce_percent"
          ? `Corruzione -${Number(effect.reduction_percent || 0)}%`
          : effect.type === "stamina_gain"
            ? `Stamina +${Number(effect.stamina_gain || 0)}`
            : effect.type === "health_full"
              ? "Salute al massimo"
              : effect.type || "effetto speciale";

      return `T${Number(step.tier || 0)}: ${Number(step.cost || 0)} monete, ${Number(step.wait_minutes || 0)} min, ${effectLabel}`;
    })
    .join(" | ");
}

function getModalItemLabel(unit) {
  if (unit.textType === "bot_narrative_phrase") return "Bot";
  if (unit.textType === "food_description") return "Pietanza";
  if (unit.textType === "soldier_description") return "Unità";
  if (unit.textType === "card_description") return "Carta";
  if (unit.textType === "environment_effect_description") return "Effetto";
  if (unit.textType === "chef_menu_description") return "Menu Chef";
  if (unit.textType === "messenger_pact_mission_description") return "Missione";
  if (unit.textType === "messenger_pact_node_description") return "Nodo";
  if (unit.textType === "messenger_pact_node_quick_tip") return "Nodo";
  if (unit.textType === "saloon_offer_description") return "Offerta";
  if (unit.textType === "potion_description") return "Pozione";
  if (unit.textType === "dynamic_object_template_description") return "Oggetto";
  if (unit.textType === "dynamic_object_bundle_description") return "Pacchetto";

  return "Elemento";
}

function getModalTextFacts(unit) {
  const metadata = unit.metadata || {};
  const facts = [["Modale", unit.modalLabel || "-"]];

  if (unit.itemLabel || unit.itemKey) {
    facts.push([getModalItemLabel(unit), unit.itemLabel || unit.itemKey]);
  }

  if (unit.textType === "bot_narrative_phrase") {
    facts.push(
      ["Azione", metadata.actionLabel || "-"],
      ["Significato", metadata.actionMeaning || "-"],
      ["Action / Provider", Array.isArray(metadata.providers) ? metadata.providers.join(", ") : "-"],
      ["Variante", `Frase ${Number(metadata.phraseSlot || 0)} di 3`]
    );
  } else if (unit.textType === "food_description") {
    const incremento = metadata.incremento || {};

    facts.push(
      ["Costo", metadata.cost || "-"],
      [
        "Effetti",
        `Fame +${incremento.fame || 0}, Salute +${incremento.salute || 0}, Stamina +${incremento.stamina || 0}, Forza +${incremento.forza || 0}`
      ]
    );
  } else if (unit.textType === "chef_menu_description") {
    facts.push(
      ["Costo", metadata.cost || "-"],
      ["Fame", `+${Number(metadata.hungerGain || 0)}`],
      ["Durata", formatModalDuration(metadata.serviceDurationMs)]
    );
  } else if (unit.textType === "messenger_pact_mission_description") {
    const effects = Array.isArray(metadata.collectEffects)
      ? metadata.collectEffects
          .map((effect) => {
            const label = effect.label || effect.stat || "";
            const percent = Number(effect.percent || 0);
            return `${label} ${percent}%`;
          })
          .join(", ")
      : "";

    facts.push(
      ["Bersaglio 2d6", metadata.target || "-"],
      ["Premi", effects || "-"]
    );
  } else if (
    unit.textType === "messenger_pact_node_description" ||
    unit.textType === "messenger_pact_node_quick_tip"
  ) {
    facts.push(
      ["Chiave regole", metadata.rulesKey || "-"],
      ["Icona mappa", metadata.mapIcon || "-"]
    );
  } else if (unit.textType === "saloon_offer_description") {
    facts.push(
      ["Categoria", metadata.category || "-"],
      ["Azione", metadata.actionType || "-"],
      ["Costo", metadata.price || "-"],
      ["Limite turno", metadata.maxPerTurn || "-"],
      ["Effetti", formatModalEffectJson(metadata.effectJson)]
    );
  } else if (unit.textType === "potion_description") {
    facts.push(
      ["Uso", metadata.useMode || "-"],
      ["Mercato", metadata.marketAvailable ? "si" : "-"],
      ["Alchimista", metadata.alchemyOrderable ? "si" : "-"],
      ["Prezzo base", metadata.basePrice || "-"],
      [
        "Recupero",
        `Salute +${Number(metadata.healthGain || 0)}, Stamina +${Number(metadata.staminaGain || 0)}`
      ],
      ["Scorte", metadata.stockMax || "-"],
      ["Quota", metadata.personalLimitPerCycle || "-"],
      [
        "Trasporto",
        metadata.transportable
          ? `stack ${metadata.maxStack || 0}, spazio ${metadata.carryCost || 0}`
          : "-"
      ],
      ["Progressione", formatModalPotionProgression(metadata.progression)]
    );
  } else if (unit.textType === "dynamic_object_template_description") {
    facts.push(
      ["Categoria", metadata.category || "-"],
      ["Visibilita", metadata.libraryVisibility || "-"],
      ["Raccolta", metadata.claimMode || "-"],
      ["Uso", metadata.useEnabled ? metadata.useMode || "attivo" : "passivo"],
      [
        "Quantita",
        metadata.stackable
          ? `${Number(metadata.quantity || 0)} / max ${Number(metadata.maxQuantity || 0)}`
          : `${Number(metadata.quantity || 0)}`
      ],
      ["Prezzo", metadata.commerceEnabled ? `${Number(metadata.price || 0)} monete` : "-"]
    );
  } else if (unit.textType === "dynamic_object_bundle_description") {
    const members = Array.isArray(metadata.members)
      ? metadata.members
          .map((member) => member.templateKey || member.memberKey)
          .filter(Boolean)
          .join(", ")
      : "";

    facts.push(
      ["Categoria", metadata.category || "-"],
      ["Oggetti inclusi", `${Number(metadata.memberCount || 0)}`],
      ["Membri", members || "-"]
    );
  } else if (unit.textType === "soldier_description") {
    facts.push(
      ["Livello", metadata.level || "-"],
      ["Potenza", metadata.power || "-"],
      ["Monete", metadata.coinCost || "-"],
      ["Materiali", formatModalMetadataCost(metadata.materialCost)],
      ["Durata", formatModalDuration(metadata.durationMs)]
    );
  } else if (unit.textType === "card_description") {
    facts.push(
      ["Personaggio", metadata.playerLabel || metadata.playerKey || "-"],
      ["Attributo", metadata.attribute || "-"],
      ["Usi", metadata.usesLeft || "-"],
      ["Purificazione", `${Number(metadata.purifyPct || 0) * 100}%`]
    );
  } else if (unit.textType === "environment_effect_description") {
    const attributes = Array.isArray(metadata.attributesAffected)
      ? metadata.attributesAffected.join(", ")
      : "";

    facts.push(
      ["Riduzione", `${Number(metadata.percentage || 0)}%`],
      ["Attributi", attributes || "-"],
      ["Modalita", metadata.visualMode || "-"],
      ["Overlay", metadata.overlayImageUrl ? "presente" : "-"]
    );
  } else {
    facts.push(
      ["Categoria", unit.category || "-"],
      ["Tipo testo", unit.textType || "-"],
      ["File", unit.sourceFile || "-"]
    );
  }

  return facts;
}

function renderModalTextBlock(context = "modals", unit = null) {
  const activeUnit = unit || getModalTextByTextKey(activeModalTextKey) || currentModalText;
  const ui = getModalTextWorkspaceUi(context);
  const container = document.getElementById(ui.editorId);
  if (!container || !activeUnit) return;

  const draft = currentModalTextRows.get(activeUnit.textKey);
  const published = currentPublishedModalTextRows.get(activeUnit.textKey);
  const isPublished =
    published && published.content === String(draft?.content || "").trim();
  const allowPublish = canPublishQuestTexts();
  const hasImagePreview = Boolean(activeUnit.imageUrl);
  const factsHtml = getModalTextFacts(activeUnit).map(([label, value]) => `
    <span>${escapeHtml(label)} <strong>${escapeHtml(value)}</strong></span>
  `).join("");

  container.innerHTML = `
    <section class="card quest-field-card weapon-field-card modal-text-field-card">
      <div class="card-header">
        <div>
          <p class="eyebrow">${escapeHtml(ui.blockEyebrow)}</p>
          <h3>${escapeHtml(activeUnit.fieldLabel)}</h3>
          <small class="status">
            ${escapeHtml(activeUnit.modalLabel)} - ${escapeHtml(activeUnit.fieldKey)}
          </small>
        </div>
        <span class="quest-status-pill ${isPublished ? "published" : ""}">
          ${isPublished ? "Pubblicato" : draft?.content ? "Bozza salvata" : "Da riscrivere"}
        </span>
      </div>

      ${hasImagePreview ? `
        <div class="weapon-detail-grid modal-text-detail-grid">
          <figure class="weapon-preview modal-text-preview">
            <img src="${escapeHtml(activeUnit.imageUrl)}" alt="${escapeHtml(activeUnit.itemLabel || activeUnit.fieldLabel)}" />
          </figure>

          <div class="weapon-facts modal-text-facts">
            ${factsHtml}
          </div>
        </div>
      ` : `
        <div class="weapon-facts modal-text-facts">
          ${factsHtml}
        </div>
      `}

      <div class="quest-field-grid">
        <div class="quest-field-column">
          <span class="quest-field-label">${activeUnit.textType === "bot_narrative_phrase" ? "Indicazione editoriale" : "Testo provvisorio"}</span>
          <p class="quest-provisional-text">${escapeHtml(activeUnit.textType === "bot_narrative_phrase" ? activeUnit.metadata?.actionMeaning : activeUnit.provisionalText)}</p>
        </div>

        <div class="quest-field-column">
          <label class="quest-field-label" for="modal-text-author-text">Testo autore</label>
          <textarea
            id="modal-text-author-text"
            class="quest-author-text modal-text-author-text"
            data-modal-text-author-text="${escapeHtml(activeUnit.textKey)}"
            placeholder="${escapeHtml(ui.placeholder)}"
          >${escapeHtml(draft?.content || "")}</textarea>
        </div>
      </div>

      <div class="quest-field-actions">
        ${activeUnit.textType === "bot_narrative_phrase" ? "" : `
          <button type="button" data-copy-modal-text="${escapeHtml(activeUnit.textKey)}">
            Copia testo
          </button>
        `}
        <button type="button" data-save-modal-text="${escapeHtml(activeUnit.textKey)}">
          Salva bozza
        </button>
        ${allowPublish ? `
          <button
            type="button"
            class="quest-publish-btn"
            data-publish-modal-text="${escapeHtml(activeUnit.textKey)}"
          >
            Pubblica nel gioco
          </button>
        ` : ""}
        <span class="status" data-modal-text-status="${escapeHtml(activeUnit.textKey)}"></span>
      </div>
    </section>
  `;

  container.querySelector("[data-copy-modal-text]")?.addEventListener(
    "click",
    () => copyModalTextProvisional(activeUnit.textKey)
  );
  container.querySelector("[data-save-modal-text]")?.addEventListener(
    "click",
    () => saveModalText(activeUnit.textKey)
  );
  container.querySelector("[data-publish-modal-text]")?.addEventListener(
    "click",
    () => publishModalText(activeUnit.textKey)
  );
}

function getModalTextByTextKey(textKey) {
  return (modalTextCatalog.units || []).find((unit) => {
    return unit.textKey === textKey;
  }) || null;
}

function getModalTextTextarea(textKey) {
  return document.querySelector(`[data-modal-text-author-text="${textKey}"]`);
}

function setModalTextStatus(textKey, message, type = "") {
  const status = document.querySelector(`[data-modal-text-status="${textKey}"]`);
  if (!status) return;

  status.textContent = message || "";
  status.className = `status ${type}`.trim();
}

function copyModalTextProvisional(textKey) {
  const unit = getModalTextByTextKey(textKey);
  const textarea = getModalTextTextarea(textKey);

  if (!unit || !textarea) return;

  textarea.value = unit.provisionalText;
  textarea.focus();
  setModalTextStatus(textKey, "Testo copiato. Salva la bozza.", "ok");
}

async function saveModalText(textKey, { quiet = false } = {}) {
  const unit = getModalTextByTextKey(textKey);
  const textarea = getModalTextTextarea(textKey);

  if (!unit || !textarea) return null;

  const content = textarea.value.trim();
  const previous = currentModalTextRows.get(textKey);

  if (previous?.content === content) {
    if (!quiet) setModalTextStatus(textKey, "Nessuna modifica da salvare.");
    return previous;
  }

  const user = getUser();
  const now = new Date().toISOString();
  const payload = {
    text_key: textKey,
    source_file: unit.sourceFile,
    modal_id: unit.modalId,
    modal_label: unit.modalLabel,
    category: unit.category,
    field_key: unit.fieldKey,
    field_label: unit.fieldLabel,
    text_type: unit.textType,
    item_key: unit.itemKey || null,
    item_label: unit.itemLabel || null,
    image: unit.image || null,
    metadata: unit.metadata || {},
    provisional_text: unit.provisionalText,
    content,
    status: "draft",
    updated_by: `${user.name} - ${user.role}`,
    updated_at: now
  };

  if (!quiet) setModalTextStatus(textKey, "Salvataggio...");

  if (useSupabase && supabaseClient) {
    if (previous) {
      const { error: versionError } = await supabaseClient
        .from(tableNames.modalVersions)
        .insert({
          text_key: textKey,
          content: previous.content || "",
          edited_by: payload.updated_by
        });

      if (versionError) {
        console.warn("Cronologia testo modale non salvata:", versionError);
      }
    }

    const { error } = await supabaseClient
      .from(tableNames.modalTexts)
      .upsert(payload, { onConflict: "text_key" });

    if (error) {
      console.error(error);
      setModalTextStatus(textKey, "Errore nel salvataggio.", "error");
      return null;
    }
  } else {
    localStorage.setItem(modalTextLocalDraftKey(textKey), JSON.stringify(payload));
  }

  currentModalTextRows.set(textKey, payload);

  if (!quiet) {
    setModalTextStatus(textKey, "Bozza salvata.", "ok");
    renderActiveModalTextBlock();
  }

  return payload;
}

async function publishModalText(textKey) {
  if (!canPublishQuestTexts()) {
    setModalTextStatus(textKey, "Solo revisore o admin puo pubblicare.", "error");
    return;
  }

  const draft = await saveModalText(textKey, { quiet: true });

  if (!draft?.content) {
    setModalTextStatus(textKey, "Scrivi e salva un testo prima di pubblicare.", "error");
    return;
  }

  const user = getUser();
  const payload = {
    text_key: draft.text_key,
    source_file: draft.source_file,
    modal_id: draft.modal_id,
    modal_label: draft.modal_label,
    category: draft.category,
    field_key: draft.field_key,
    field_label: draft.field_label,
    text_type: draft.text_type,
    item_key: draft.item_key || null,
    item_label: draft.item_label || null,
    image: draft.image || null,
    metadata: draft.metadata || {},
    content: draft.content,
    published_by: `${user.name} - ${user.role}`,
    published_at: new Date().toISOString()
  };

  setModalTextStatus(textKey, "Pubblicazione...");

  if (useSupabase && supabaseClient) {
    const { error } = await supabaseClient
      .from(tableNames.publishedModalTexts)
      .upsert(payload, { onConflict: "text_key" });

    if (error) {
      console.error(error);
      setModalTextStatus(textKey, "Errore nella pubblicazione.", "error");
      return;
    }
  } else {
    localStorage.setItem(modalTextLocalPublishedKey(textKey), JSON.stringify(payload));
  }

  currentPublishedModalTextRows.set(textKey, payload);
  setModalTextStatus(textKey, "Testo pubblicato.", "ok");
  renderActiveModalTextBlock();
}

function readLocalJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (error) {
    console.warn("LocalStorage JSON non valido:", key, error);
    return fallback;
  }
}

function cryptoRandomId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function escapeHtml(text) {
  return String(text || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.saveUser = saveUser;
window.saveAuthorText = saveAuthorText;
window.addComment = addComment;

window.addBlockComment = addBlockComment;
window.replyBlockComment = replyBlockComment;
window.editBlockComment = editBlockComment;
window.deleteBlockComment = deleteBlockComment;
