// app.js
// Area Autore - Abisso Infinito
// Offline: usa localStorage.
// Online: usa Supabase con le tabelle dedicate author_* definite in supabase-author-schema.sql.

const cfg = window.AUTHOR_CONFIG || {};
const tableNames = {
  allowedUsers: cfg.TABLES?.allowedUsers || "author_allowed_users",
  texts: cfg.TABLES?.texts || "author_chapter_texts",
  versions: cfg.TABLES?.versions || "author_text_versions",
  comments: cfg.TABLES?.comments || "author_comments"
};

const cellRulesConfig = window.AbissoCellRulesConfig;
const CELL_RULES = cellRulesConfig?.CELL_RULES || {};

const CHAPTERS = Object.entries(CELL_RULES).map(([key, value], index) => ({
  key,
  number: index + 1,
  title: value?.title || key,
  intro: value?.intro || "",
  sections: Array.isArray(value?.sections) ? value.sections : [],
  official: value || {}
}));

let supabaseClient = null;
let useSupabase = false;
let currentChapter = CHAPTERS[0] || null;
let currentAuthorTextFromDb = "";
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

function getVersionsStorageKey(chapterKey) {
  return `author_versions_${chapterKey}`;
}

function getCommentsStorageKey(chapterKey) {
  return `author_comments_${chapterKey}`;
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

  loadCommentDraftForChapter(chapter);
  setCommentTarget(chapter);

  document.getElementById("chapterTitle").textContent =
    `${String(chapter.number).padStart(2, "0")} - ${chapter.title}`;

  document.getElementById("chapterMeta").textContent =
    `Chiave: ${chapter.key} · Blocchi ufficiali: ${chapter.sections.length}`;

  document.getElementById("authorEditor").value = "";
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

async function loadAuthorText(chapterKey = currentChapter?.key, loadId = activeLoadId) {
  if (!chapterKey) return;

  setTextStatus("Caricamento testo autore...");

  let row = null;
  let error = null;

  if (useSupabase && supabaseClient) {
    const result = await supabaseClient
      .from(tableNames.texts)
      .select("*")
      .eq("chapter_key", chapterKey)
      .maybeSingle();

    row = result.data;
    error = result.error;
  } else {
    row = readLocalJson(getTextStorageKey(chapterKey), null);
  }

  if (loadId !== activeLoadId || chapterKey !== currentChapter?.key) {
    return;
  }

  if (error) {
    console.error(error);
    setTextStatus("Errore caricamento testo autore", "error");
    return;
  }

  currentAuthorTextFromDb = row?.content || "";
  document.getElementById("authorEditor").value = currentAuthorTextFromDb;
  document.getElementById("editNote").value = "";

  if (row?.updated_at) {
    setTextStatus(
      `Ultima modifica: ${new Date(row.updated_at).toLocaleString("it-IT")} - ${row.updated_by || ""}`,
      "ok"
    );
  } else {
    setTextStatus("Nessun testo autore salvato per questo capitolo.");
  }
}

async function saveAuthorText() {
  const user = getUser();
  const content = document.getElementById("authorEditor").value.trimEnd();
  const editNote = document.getElementById("editNote").value.trim();

  if (!currentChapter) {
    alert("Seleziona un capitolo");
    return;
  }

  if (content === currentAuthorTextFromDb) {
    setTextStatus("Nessuna modifica da salvare.");
    return;
  }

  setTextStatus("Salvataggio in corso...");

  const versionPayload = {
    chapter_key: currentChapter.key,
    content: currentAuthorTextFromDb || "[Prima versione vuota]",
    edited_by: `${user.name} - ${user.role}`,
    edit_note: editNote || "Modifica testo autore",
    created_at: new Date().toISOString()
  };

  const textPayload = {
    chapter_key: currentChapter.key,
    content,
    updated_by: `${user.name} - ${user.role}`,
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

    const { error } = await supabaseClient
      .from(tableNames.texts)
      .upsert(textPayload, { onConflict: "chapter_key" });

    if (error) {
      console.error(error);
      setTextStatus("Errore nel salvataggio del testo autore", "error");
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

    localStorage.setItem(
      getTextStorageKey(currentChapter.key),
      JSON.stringify(textPayload)
    );
  }

  currentAuthorTextFromDb = content;
  document.getElementById("editNote").value = "";
  setTextStatus("Testo autore salvato correttamente", "ok");

  await loadVersions();
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
          loadComments();
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
