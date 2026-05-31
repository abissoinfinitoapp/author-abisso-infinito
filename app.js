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
  comments: cfg.TABLES?.comments || "author_comments"
};

const cellRulesConfig = window.AbissoCellRulesConfig;
const CELL_RULES = cellRulesConfig?.CELL_RULES || {};

const CHAPTERS = Object.entries(CELL_RULES)
  .map(([key, value]) => ({
    key,
    title: value?.title || key,
    intro: value?.intro || "",
    sections: Array.isArray(value?.sections) ? value.sections : [],
    official: value || {}
  }))
  .sort((a, b) => {
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

let supabaseClient = null;
let useSupabase = false;
let currentChapter = CHAPTERS[0] || null;
let currentAuthorTextFromDb = "";
let currentAuthorBlocksFromDb = new Map();
let activeLoadId = 0;
let currentAllowedUser = null;
let realtimeChannel = null;

document.addEventListener("DOMContentLoaded", async () => {
  bindSearch();
  bindCommentDraft();

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

  if (!chapterKey || !chapterAssets?.get) {
    return null;
  }

  return chapterAssets.get(chapterKey);
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
  if (cfg.USE_LOCAL_MODE === true) return false;

  return Boolean(
    window.supabase?.createClient &&
    cfg.SUPABASE_URL &&
    cfg.SUPABASE_PUBLISHABLE_KEY
  );
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
    const haystack = `${chapter.key} ${chapter.title} ${chapter.intro}`.toLowerCase();
    return haystack.includes(query);
  });

  if (!chapters.length) {
    container.innerHTML = `<p class="empty">Nessun capitolo trovato.</p>`;
    return;
  }

  chapters.forEach((chapter) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chapter-btn";
    btn.innerHTML = `
      <strong>${String(chapter.number).padStart(2, "0")} - ${escapeHtml(chapter.title)}</strong>
      <small>${escapeHtml(chapter.key)}</small>
    `;

    btn.addEventListener("click", () => selectChapter(chapter));

    if (currentChapter?.key === chapter.key) {
      btn.classList.add("active");
    }

    container.appendChild(btn);
  });
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

  await Promise.all([
    loadAuthorText(chapterKey, loadId),
    loadComments(chapterKey, loadId),
    loadVersions(chapterKey, loadId)
  ]);
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
            class="small-btn"
            data-save-author-block="${escapeHtml(block.block_key)}"
          >
            Salva blocco
          </button>
        </div>

        <div class="author-block-guide">
          <strong>Guida ufficiale</strong>
          <p>${escapeHtml(block.official_text)}</p>
        </div>

        <textarea
          class="author-block-textarea"
          data-author-block-key="${escapeHtml(block.block_key)}"
          placeholder="Scrivi qui il testo autore per: ${escapeHtml(block.block_title)}"
        >${escapeHtml(savedContent)}</textarea>

        <div class="author-block-footer">
          <span data-author-block-counter="${escapeHtml(block.block_key)}">0 caratteri · 0 parole</span>
        </div>

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
              class="small-btn"
              data-add-block-comment="${escapeHtml(block.block_key)}"
            >
              Salva commento
            </button>
          </div>
        </div>
      </section>
    `;
  }).join("");

  guideBlocks.forEach((block) => {
    const textarea = getBlockTextarea(block.block_key);

    if (textarea) {
      textarea.addEventListener("input", () => updateBlockCounter(block.block_key));
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

  setTextStatus("Blocchi autore salvati correttamente", "ok");

  await loadVersions();
}

async function saveAuthorBlock(blockKey) {
  const user = getUser();

  if (!currentChapter) {
    alert("Seleziona un capitolo");
    return;
  }

  const payload = collectAuthorBlockPayloads(currentChapter)
    .find((item) => item.block_key === blockKey);

  if (!payload) {
    alert("Blocco non trovato.");
    return;
  }

  const oldContent = currentAuthorBlocksFromDb.get(payload.block_key)?.content || "";

  if (payload.content === oldContent) {
    setTextStatus(`Nessuna modifica nel blocco: ${payload.block_title}`);
    return;
  }

  setTextStatus(`Salvataggio blocco: ${payload.block_title}...`);

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

  const versionPayload = {
    chapter_key: currentChapter.key,
    content: currentAuthorTextFromDb || "[Prima versione vuota]",
    edited_by: updatedBy,
    edit_note: `Modifica blocco: ${payload.block_title}`,
    created_at: new Date().toISOString()
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

    const { error: blockError } = await supabaseClient
      .from(tableNames.blocks)
      .upsert(blockPayload, {
        onConflict: "chapter_key,block_key"
      });

    if (blockError) {
      console.error(blockError);
      setTextStatus("Errore nel salvataggio del blocco", "error");
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

    rowsMap.set(blockPayload.block_key, blockPayload);

    localStorage.setItem(
      getBlocksStorageKey(currentChapter.key),
      JSON.stringify(Array.from(rowsMap.values()))
    );
  }

  currentAuthorBlocksFromDb.set(blockPayload.block_key, blockPayload);

  const combinedContent = buildCombinedAuthorTextFromCurrentMap(currentChapter);

  const textPayload = {
    chapter_key: currentChapter.key,
    content: combinedContent,
    updated_by: updatedBy,
    updated_at: new Date().toISOString()
  };

  if (useSupabase && supabaseClient) {
    const { error: textError } = await supabaseClient
      .from(tableNames.texts)
      .upsert(textPayload, {
        onConflict: "chapter_key"
      });

    if (textError) {
      console.error(textError);
      setTextStatus("Blocco salvato, ma errore nel testo completo", "error");
      return;
    }
  } else {
    localStorage.setItem(
      getTextStorageKey(currentChapter.key),
      JSON.stringify(textPayload)
    );
  }

  currentAuthorTextFromDb = combinedContent;

  setTextStatus(`Blocco salvato: ${payload.block_title}`, "ok");

  await loadVersions();
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

  if (!body) {
    alert("Scrivi un commento prima di salvare.");
    return;
  }

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
      setTextStatus("Errore salvataggio commento blocco", "error");
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

  if (input) input.value = "";

  await loadBlockComments();
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

  renderComments(comments);
}

function renderComments(comments) {
  const container = document.getElementById("commentsList");
  container.innerHTML = "";

  if (!comments.length) {
    container.innerHTML = `<p class="empty">Nessun commento per questo capitolo.</p>`;
    return;
  }

  const parents = comments.filter(comment => !comment.parent_id);
  const replies = comments.filter(comment => comment.parent_id);

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

        if (!row || row.chapter_key === currentChapter?.key) {
          loadComments?.();
          loadBlockComments?.();
        }
      }
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: tableNames.texts },
      payload => {
        const row = payload.new || payload.old;
        if (row && row.chapter_key === currentChapter?.key) {
          loadAuthorText();
        }
      }
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: tableNames.blocks },
      payload => {
        const row = payload.new || payload.old;
        if (row && row.chapter_key === currentChapter?.key) {
          loadAuthorText();
        }
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
    .subscribe();
}

function setTextStatus(message, type = "") {
  const status = document.getElementById("textStatus");

  if (!status) return;

  status.textContent = message || "";
  status.className = `status ${type}`.trim();
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
