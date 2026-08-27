// author-map-planner.js
// Area Autore - Abisso Infinito
// Planner dei collegamenti tra minimappe (tab "Mappe").
// Persistenza: tabella Supabase author_map_documents (documento JSON unico
// per map_key). Fallback offline: localStorage.
// Portato da nona-ora/school-map-planner.html mantenendo tutte le feature.

(() => {
  "use strict";

  const MAP_KEY = "nona-ora";
  const STORAGE_KEY = "abisso_author_map_planner_v1";
  const IMAGE_DIR =
    (window.AuthorChapterAssets?.baseUrl || "https://assets.abissoinfinito.it") +
    "/img/nona-ora/";

  const TABLE =
    window.AUTHOR_CONFIG?.TABLES?.mapDocuments || "author_map_documents";

  const DEFAULT_ROOM_FILES = [
    "ala-chiusa.png",
    "archivio.png",
    "atrio.png",
    "aula-arte.png",
    "aula-letteratura.png",
    "aula-matematica.png",
    "aula-musica.png",
    "aula-storia.png",
    "aule-piano-1.png",
    "backstage-teatro.png",
    "bagni-femminili.png",
    "bagni-maschili.png",
    "biblioteca.png",
    "camerini-teatro.png",
    "campo-calcio.png",
    "cancello-principale.png",
    "cappella.png",
    "cassetta-compiti.png",
    "centrale-elettrica.png",
    "classe-5.png",
    "classe-27.png",
    "classi.png",
    "corridoio-principale-lungo.png",
    "corridoio-secondario.png",
    "cortile-esterno.png",
    "cortile-secondario.png",
    "deposito-confische.png",
    "deposito-documenti.png",
    "deposito-provviste.png",
    "fontana.png",
    "guardiola.png",
    "infermeria.png",
    "ingresso-b.png",
    "ingresso-principale.png",
    "lab-piano-1.png",
    "laboratorio-chimica.png",
    "laboratorio-fisica.png",
    "laboratorio-informatico.png",
    "locale-caldaie.png",
    "magazzino-sportivo.png",
    "mensa-esterna.png",
    "palestra-interna.png",
    "parcheggio.png",
    "parco-giochi.png",
    "sala-campanelle.png",
    "sala-professori.png",
    "sala-proiezione.png",
    "sala-punizioni.png",
    "sala-riscaldamento.png",
    "segreteria.png",
    "serra.png",
    "sotteranei.png",
    "spogliatoi.png",
    "teatro.png",
    "torre-orologio.png",
    "tunnel-manutenzione.png",
    "zona-armadietti.png",
    "zona-macchinari.png"
  ];

  const CARD_W = 260;
  const CARD_H = 180;
  const GRID_GAP_X = 50;
  const GRID_GAP_Y = 50;
  const GRID_START_X = 80;
  const GRID_START_Y = 80;
  const GRID_COLUMNS = 6;

  // Il canvas cresce da solo quando trascini le mappe verso i bordi, così si
  // possono riordinare liberamente sia in orizzontale che in verticale.
  const SCENE_MIN_W = 2200;
  const SCENE_MIN_H = 2400;
  const SCENE_PADDING = 700;

  const ZOOM_MIN = 0.5;
  const ZOOM_MAX = 1.25;
  const ZOOM_STEP = 0.05;

  let initialized = false;
  let dom = {};

  let state = createDefaultState();
  let selectedRoomId = "";
  let mode = "select";
  let connectionSourceId = "";
  let zoom = 0.8;

  let drag = null;
  let pan = null;
  let modalZoom = 1;
  let modalRoomId = "";
  let selectedAnnotationId = "";
  let pendingAnnotationText = "";
  let annotationDrag = null;
  let annotationMode = "select"; // "select" | "link"
  let annotationLinkSourceId = "";
  let selectedAnnotationLinkId = "";
  let imagePan = null;
  let modalImageBaseWidth = 0;
  let modalImageBaseHeight = 0;

  let realtimeChannel = null;
  let lastLocalSaveAt = 0;
  let saveTimer = null;
  let saveStatusTimer = null;
  let remoteLoaded = false;

  // ---------------------------------------------------------------------------
  // Accesso lazy allo stato Supabase inizializzato da app.js
  // ---------------------------------------------------------------------------

  function sbClient() {
    return typeof supabaseClient !== "undefined" ? supabaseClient : null;
  }

  function isOnline() {
    return (
      typeof useSupabase !== "undefined" &&
      useSupabase === true &&
      Boolean(sbClient())
    );
  }

  function currentUserLabel() {
    try {
      const user = typeof getUser === "function" ? getUser() : null;
      return user?.name || "Utente";
    } catch (error) {
      return "Utente";
    }
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  function escapeHtmlLocal(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function humanizeFileName(fileName = "") {
    return String(fileName)
      .replace(/\.[^.]+$/, "")
      .split("-")
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  function makeRoomId(fileName = "") {
    return String(fileName).trim().toLowerCase();
  }

  function createInitialRooms(files = DEFAULT_ROOM_FILES) {
    const rooms = {};
    files.forEach((fileName, index) => {
      const column = index % GRID_COLUMNS;
      const row = Math.floor(index / GRID_COLUMNS);
      const id = makeRoomId(fileName);

      rooms[id] = {
        id,
        fileName,
        title: humanizeFileName(fileName),
        comment: "",
        annotations: [],
        annotationLinks: [],
        x: GRID_START_X + column * (CARD_W + GRID_GAP_X),
        y: GRID_START_Y + row * (CARD_H + GRID_GAP_Y)
      };
    });
    return rooms;
  }

  function mergeRoomsWithDefaultCatalog(storedRooms = {}) {
    const defaultRooms = createInitialRooms();

    const sourceRooms =
      storedRooms && typeof storedRooms === "object" && !Array.isArray(storedRooms)
        ? storedRooms
        : {};

    const roomIds = new Set([
      ...Object.keys(defaultRooms),
      ...Object.keys(sourceRooms)
    ]);

    const rooms = {};

    roomIds.forEach((roomId) => {
      const baseRoom = defaultRooms[roomId] || {};
      const storedRoom = sourceRooms[roomId] || {};
      const fileName = String(
        storedRoom.fileName || baseRoom.fileName || roomId
      );

      rooms[roomId] = {
        ...baseRoom,
        ...storedRoom,
        id: String(storedRoom.id || baseRoom.id || roomId),
        fileName,
        title: String(
          storedRoom.title || baseRoom.title || humanizeFileName(fileName)
        ),
        comment: String(storedRoom.comment || ""),
        x: Number.isFinite(Number(storedRoom.x))
          ? Number(storedRoom.x)
          : Number(baseRoom.x) || 0,
        y: Number.isFinite(Number(storedRoom.y))
          ? Number(storedRoom.y)
          : Number(baseRoom.y) || 0,
        annotations: Array.isArray(storedRoom.annotations)
          ? storedRoom.annotations.map((annotation) => ({
              id: String(
                annotation.id ||
                  `annotation_${Math.random().toString(16).slice(2)}`
              ),
              text: String(annotation.text || ""),
              x: Number.isFinite(Number(annotation.x))
                ? Number(annotation.x)
                : 0.5,
              y: Number.isFinite(Number(annotation.y))
                ? Number(annotation.y)
                : 0.5
            }))
          : [],
        annotationLinks: Array.isArray(storedRoom.annotationLinks)
          ? storedRoom.annotationLinks
              .filter(
                (link) =>
                  link &&
                  link.from &&
                  link.to &&
                  String(link.from) !== String(link.to)
              )
              .map((link) => ({
                id: String(
                  link.id ||
                    `annlink_${Date.now()}_${Math.random()
                      .toString(16)
                      .slice(2)}`
                ),
                from: String(link.from),
                to: String(link.to),
                direction: link.direction === "both" ? "both" : "forward",
                comment: String(link.comment || "")
              }))
          : []
      };
    });

    return rooms;
  }

  function createDefaultState() {
    return {
      version: 1,
      rooms: createInitialRooms(),
      edges: []
    };
  }

  function normalizeState(parsed) {
    if (!parsed || typeof parsed !== "object") {
      return createDefaultState();
    }

    return {
      version: 1,
      rooms: mergeRoomsWithDefaultCatalog(parsed.rooms),
      edges: Array.isArray(parsed.edges) ? parsed.edges : []
    };
  }

  function serializeState() {
    return {
      version: 1,
      rooms: state.rooms,
      edges: state.edges
    };
  }

  // ---------------------------------------------------------------------------
  // Persistenza
  // ---------------------------------------------------------------------------

  function loadLocalState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return createDefaultState();
      return normalizeState(JSON.parse(raw));
    } catch (error) {
      console.warn("Planner mappe: stato locale non leggibile.", error);
      return createDefaultState();
    }
  }

  function writeLocalCache() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(serializeState()));
    } catch (error) {
      /* quota o modalità privata: ignora */
    }
  }

  async function loadRemoteState() {
    const client = sbClient();
    if (!client) return null;

    try {
      const { data, error } = await client
        .from(TABLE)
        .select("data")
        .eq("map_key", MAP_KEY)
        .maybeSingle();

      if (error) {
        console.warn("Planner mappe: lettura DB fallita.", error);
        return null;
      }

      remoteLoaded = true;
      return normalizeState(data?.data || {});
    } catch (error) {
      console.warn("Planner mappe: lettura DB fallita.", error);
      return null;
    }
  }

  function scheduleSave() {
    writeLocalCache();
    window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(persistState, 600);
    setSaveStatus("Salvataggio...");
  }

  async function persistState() {
    lastLocalSaveAt = Date.now();

    if (!isOnline()) {
      setSaveStatus("Salvato sul dispositivo");
      return;
    }

    const client = sbClient();

    try {
      const { error } = await client.from(TABLE).upsert(
        {
          map_key: MAP_KEY,
          data: serializeState(),
          updated_by: currentUserLabel(),
          updated_at: new Date().toISOString()
        },
        { onConflict: "map_key" }
      );

      if (error) {
        console.warn("Planner mappe: salvataggio DB fallito.", error);
        setSaveStatus("Errore salvataggio DB", true);
        return;
      }

      lastLocalSaveAt = Date.now();
      setSaveStatus("Salvato sul database");
    } catch (error) {
      console.warn("Planner mappe: salvataggio DB fallito.", error);
      setSaveStatus("Errore salvataggio DB", true);
    }
  }

  function setSaveStatus(text, isError = false) {
    if (!dom.saveStatus) return;
    dom.saveStatus.textContent = text;
    dom.saveStatus.classList.toggle("is-error", Boolean(isError));

    window.clearTimeout(saveStatusTimer);
    if (!isError) {
      saveStatusTimer = window.setTimeout(() => {
        dom.saveStatus.textContent = "Pronto";
      }, 1500);
    }
  }

  function startRealtime() {
    const client = sbClient();
    if (!client || realtimeChannel) return;

    realtimeChannel = client
      .channel("author_map_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: TABLE },
        (payload) => {
          const row = payload.new || payload.old;
          if (!row || row.map_key !== MAP_KEY) return;

          const isLocalSaveRecent = Date.now() - lastLocalSaveAt < 3000;
          if (isLocalSaveRecent) return;
          if (drag || annotationDrag || pan || imagePan) return;

          const nextData = payload.new?.data;
          if (!nextData) return;

          state = normalizeState(nextData);
          writeLocalCache();
          renderAll();
          setSaveStatus("Aggiornato da " + (row.updated_by || "un altro autore"));
        }
      )
      .subscribe();
  }

  // ---------------------------------------------------------------------------
  // Micro-modale (sostituisce prompt / confirm / alert nativi)
  // ---------------------------------------------------------------------------

  function askDialog({ title, message, withInput, defaultValue, confirmLabel, danger }) {
    return new Promise((resolve) => {
      const backdrop = document.createElement("div");
      backdrop.className = "map-dialog-backdrop";

      const panel = document.createElement("div");
      panel.className = "map-dialog";

      panel.innerHTML = `
        <h4>${escapeHtmlLocal(title || "Conferma")}</h4>
        <p>${escapeHtmlLocal(message || "")}</p>
        ${
          withInput
            ? `<input type="text" class="map-dialog-input" value="${escapeHtmlLocal(
                defaultValue || ""
              )}" />`
            : ""
        }
        <div class="map-dialog-actions">
          <button type="button" class="map-btn" data-act="cancel">Annulla</button>
          <button type="button" class="map-btn ${
            danger ? "map-btn-danger" : "map-btn-primary"
          }" data-act="ok">${escapeHtmlLocal(confirmLabel || "Conferma")}</button>
        </div>
      `;

      backdrop.appendChild(panel);
      dom.workspace.appendChild(backdrop);

      const input = panel.querySelector(".map-dialog-input");
      if (input) {
        input.focus();
        input.select();
      }

      function close(result) {
        backdrop.remove();
        window.removeEventListener("keydown", onKey, true);
        resolve(result);
      }

      function onKey(event) {
        if (event.key === "Escape") {
          event.stopPropagation();
          close(withInput ? null : false);
        }
        if (event.key === "Enter" && withInput) {
          event.stopPropagation();
          close(input.value);
        }
      }

      window.addEventListener("keydown", onKey, true);

      panel.addEventListener("click", (event) => {
        const act = event.target.closest("[data-act]")?.dataset.act;
        if (!act) return;
        if (act === "cancel") close(withInput ? null : false);
        if (act === "ok") close(withInput ? input.value : true);
      });

      backdrop.addEventListener("click", (event) => {
        if (event.target === backdrop) close(withInput ? null : false);
      });
    });
  }

  function mapConfirm(message, { danger = true, confirmLabel = "Conferma" } = {}) {
    return askDialog({ title: "Conferma", message, danger, confirmLabel });
  }

  function mapPrompt(message, defaultValue = "", confirmLabel = "Salva") {
    return askDialog({
      title: "Testo",
      message,
      withInput: true,
      defaultValue,
      confirmLabel
    });
  }

  function mapAlert(message) {
    return askDialog({
      title: "Avviso",
      message,
      confirmLabel: "Ho capito"
    }).then(() => undefined);
  }

  // ---------------------------------------------------------------------------
  // Stato di dominio (identico all'originale)
  // ---------------------------------------------------------------------------

  function getRoom(id = "") {
    return state.rooms[id] || null;
  }

  function getRoomDegree(roomId = "") {
    return state.edges.filter(
      (edge) => edge.from === roomId || edge.to === roomId
    ).length;
  }

  function getRoomConnections(roomId = "") {
    return state.edges.filter(
      (edge) => edge.from === roomId || edge.to === roomId
    );
  }

  function setMode(nextMode) {
    mode = nextMode === "connect" ? "connect" : "select";
    connectionSourceId = "";
    dom.selectModeBtn.classList.toggle("is-active", mode === "select");
    dom.connectModeBtn.classList.toggle("is-active", mode === "connect");
    renderConnectionHint();
    renderCards();
  }

  function addRoom(fileName) {
    const normalizedFileName = String(fileName || "").trim();
    if (!normalizedFileName) return;

    const id = makeRoomId(normalizedFileName);
    if (state.rooms[id]) {
      selectedRoomId = id;
      renderAll();
      focusRoom(id);
      return;
    }

    const index = Object.keys(state.rooms).length;
    const column = index % GRID_COLUMNS;
    const row = Math.floor(index / GRID_COLUMNS);

    state.rooms[id] = {
      id,
      fileName: normalizedFileName,
      title: humanizeFileName(normalizedFileName),
      comment: "",
      annotations: [],
      annotationLinks: [],
      x: GRID_START_X + column * (CARD_W + GRID_GAP_X),
      y: GRID_START_Y + row * (CARD_H + GRID_GAP_Y)
    };

    selectedRoomId = id;
    scheduleSave();
    renderAll();
  }

  function createEdge(fromId, toId) {
    if (!fromId || !toId || fromId === toId) return;

    const type = dom.connectionType.value || "porta";
    const direction = dom.connectionDirection.value || "both";

    const duplicate = state.edges.some((edge) => {
      if (direction === "both" && edge.direction === "both") {
        return (
          (edge.from === fromId && edge.to === toId) ||
          (edge.from === toId && edge.to === fromId)
        );
      }
      return (
        edge.from === fromId && edge.to === toId && edge.direction === direction
      );
    });

    if (duplicate) {
      setSaveStatus("Collegamento già presente");
      return;
    }

    state.edges.push({
      id: `edge_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      from: fromId,
      to: toId,
      type,
      direction
    });

    connectionSourceId = "";
    selectedRoomId = toId;
    scheduleSave();
    renderAll();
  }

  function deleteEdge(edgeId = "") {
    state.edges = state.edges.filter((edge) => edge.id !== edgeId);
    scheduleSave();
    renderAll();
  }

  function resetLayout() {
    const ids = Object.keys(state.rooms).sort((a, b) => {
      return state.rooms[a].title.localeCompare(state.rooms[b].title, "it");
    });

    ids.forEach((id, index) => {
      const column = index % GRID_COLUMNS;
      const row = Math.floor(index / GRID_COLUMNS);
      state.rooms[id].x = GRID_START_X + column * (CARD_W + GRID_GAP_X);
      state.rooms[id].y = GRID_START_Y + row * (CARD_H + GRID_GAP_Y);
    });

    scheduleSave();
    renderAll();
  }

  async function clearProject() {
    const confirmed = await mapConfirm(
      "Azzerare posizioni e collegamenti? Le immagini restano nell'elenco.",
      { confirmLabel: "Azzera" }
    );
    if (!confirmed) return;

    state = createDefaultState();
    selectedRoomId = "";
    connectionSourceId = "";
    scheduleSave();
    renderAll();
  }

  function exportJson() {
    const payload = {
      schema: "abisso-author-map-planner-v1",
      exportedAt: new Date().toISOString(),
      ...serializeState()
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "abisso-collegamenti-mappe.json";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  function importJsonFile(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result || "{}"));
        if (
          !parsed ||
          typeof parsed !== "object" ||
          !parsed.rooms ||
          !Array.isArray(parsed.edges)
        ) {
          throw new Error("Formato JSON non riconosciuto.");
        }

        state = normalizeState(parsed);
        selectedRoomId = "";
        connectionSourceId = "";
        scheduleSave();
        renderAll();
      } catch (error) {
        mapAlert(`Importazione fallita: ${error.message || error}`);
      }
    };
    reader.readAsText(file);
  }

  // ---------------------------------------------------------------------------
  // Rendering
  // ---------------------------------------------------------------------------

  function renderRoomList() {
    const query = String(dom.roomSearch.value || "").trim().toLowerCase();
    dom.roomList.innerHTML = "";

    const totalRooms = Object.keys(state.rooms).length;
    if (dom.roomCount) dom.roomCount.textContent = String(totalRooms);

    Object.values(state.rooms)
      .sort((a, b) => a.title.localeCompare(b.title, "it"))
      .filter((room) => {
        return (
          !query ||
          room.title.toLowerCase().includes(query) ||
          room.fileName.toLowerCase().includes(query)
        );
      })
      .forEach((room) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "map-room-item";
        if (room.id === selectedRoomId) button.classList.add("is-active");

        const name = document.createElement("span");
        name.className = "map-room-item-name";
        name.textContent = room.title;

        const degree = document.createElement("span");
        degree.className = "map-pill";
        degree.textContent = String(getRoomDegree(room.id));

        button.append(name, degree);

        button.addEventListener("click", () => {
          selectedRoomId = room.id;
          renderAll();
          focusRoom(room.id);
        });

        dom.roomList.appendChild(button);
      });
  }

  function renderCards() {
    dom.cardsLayer.innerHTML = "";
    updateSceneSize();

    Object.values(state.rooms).forEach((room) => {
      const card = document.createElement("article");
      card.className = "map-room-card";
      card.dataset.roomId = room.id;
      card.style.left = `${room.x}px`;
      card.style.top = `${room.y}px`;

      if (room.id === selectedRoomId) card.classList.add("is-selected");
      if (room.id === connectionSourceId) card.classList.add("is-source");

      const img = document.createElement("img");
      img.src = IMAGE_DIR + room.fileName;
      img.alt = room.title;
      img.draggable = false;
      img.addEventListener("error", () => card.classList.add("is-broken"));

      img.addEventListener("click", (event) => {
        if (mode !== "select" || drag?.moved === true) return;
        event.stopPropagation();
        selectedRoomId = room.id;
        renderSelectionOnly();
        openImageMagnifier(room.id);
      });

      const fallback = document.createElement("div");
      fallback.className = "map-room-card-fallback";
      fallback.textContent = `Immagine non trovata\n${room.fileName}`;

      const footer = document.createElement("div");
      footer.className = "map-room-card-footer";

      const title = document.createElement("div");
      title.className = "map-room-card-title";
      title.textContent = room.title;

      const degree = document.createElement("div");
      degree.className = "map-pill";
      degree.title = "Numero collegamenti";
      degree.textContent = String(getRoomDegree(room.id));

      footer.append(title, degree);
      card.append(img, fallback, footer);

      card.addEventListener("pointerdown", (event) => {
        if (event.button !== 0) return;

        if (mode === "connect") {
          event.preventDefault();
          handleConnectClick(room.id);
          return;
        }

        selectedRoomId = room.id;
        drag = {
          roomId: room.id,
          pointerId: event.pointerId,
          startClientX: event.clientX,
          startClientY: event.clientY,
          startX: room.x,
          startY: room.y,
          moved: false
        };

        card.setPointerCapture(event.pointerId);
        renderSelectionOnly();
      });

      card.addEventListener("pointermove", (event) => {
        if (!drag || drag.roomId !== room.id || drag.pointerId !== event.pointerId)
          return;

        const dx = (event.clientX - drag.startClientX) / zoom;
        const dy = (event.clientY - drag.startClientY) / zoom;

        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) drag.moved = true;

        room.x = Math.max(0, Math.round(drag.startX + dx));
        room.y = Math.max(0, Math.round(drag.startY + dy));

        card.style.left = `${room.x}px`;
        card.style.top = `${room.y}px`;
        updateSceneSize();
        applyZoom();
        renderEdges();
      });

      card.addEventListener("pointerup", (event) => {
        if (!drag || drag.roomId !== room.id || drag.pointerId !== event.pointerId)
          return;

        card.releasePointerCapture(event.pointerId);
        const moved = drag.moved;
        drag = null;
        if (moved) scheduleSave();
        renderAll();
      });

      dom.cardsLayer.appendChild(card);
    });
  }

  function handleConnectClick(roomId) {
    selectedRoomId = roomId;

    if (!connectionSourceId) {
      connectionSourceId = roomId;
      renderAll();
      return;
    }

    if (connectionSourceId === roomId) {
      connectionSourceId = "";
      renderAll();
      return;
    }

    const source = connectionSourceId;
    createEdge(source, roomId);
  }

  function renderEdges() {
    const defs = dom.linksSvg.querySelector("defs");
    dom.linksSvg.innerHTML = "";
    dom.linksSvg.appendChild(defs);

    state.edges.forEach((edge) => {
      const from = getRoom(edge.from);
      const to = getRoom(edge.to);
      if (!from || !to) return;

      const x1 = from.x + CARD_W / 2;
      const y1 = from.y + CARD_H / 2;
      const x2 = to.x + CARD_W / 2;
      const y2 = to.y + CARD_H / 2;

      const dx = x2 - x1;
      const dy = y2 - y1;
      const curve = Math.min(
        180,
        Math.max(50, Math.abs(dx) * 0.25 + Math.abs(dy) * 0.08)
      );

      const c1x = x1 + Math.sign(dx || 1) * curve;
      const c1y = y1;
      const c2x = x2 - Math.sign(dx || 1) * curve;
      const c2y = y2;

      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path.setAttribute(
        "d",
        `M ${x1} ${y1} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x2} ${y2}`
      );
      path.setAttribute("class", "map-edge-line");
      path.dataset.type = edge.type || "porta";

      if (edge.direction === "both") {
        path.setAttribute("marker-start", "url(#mapArrowStart)");
        path.setAttribute("marker-end", "url(#mapArrowEnd)");
      } else {
        path.setAttribute("marker-end", "url(#mapArrowEnd)");
      }

      dom.linksSvg.appendChild(path);
    });
  }

  function getRoomAnnotations(roomId = "") {
    const room = getRoom(roomId);
    if (!room) return [];
    if (!Array.isArray(room.annotations)) room.annotations = [];
    return room.annotations;
  }

  // ---------------------------------------------------------------------------
  // Collegamenti logici tra etichette della stessa mappa (dentro la modale)
  // ---------------------------------------------------------------------------

  const SVG_NS = "http://www.w3.org/2000/svg";

  function getRoomAnnotationLinks(roomId = "") {
    const room = getRoom(roomId);
    if (!room) return [];
    if (!Array.isArray(room.annotationLinks)) room.annotationLinks = [];
    return room.annotationLinks;
  }

  function updateAnnotationHint() {
    if (pendingAnnotationText) return;

    if (annotationMode === "link") {
      dom.imageModalHint.innerHTML = annotationLinkSourceId
        ? "Collegamento etichette: clicca l'etichetta di <b>destinazione</b> — la freccia punterà lì."
        : "Collegamento etichette: clicca l'etichetta di <b>partenza</b>, poi quella di destinazione.";
      return;
    }

    dom.imageModalHint.innerHTML =
      "Trascina per esplorare, rotella = zoom. <b>Nuova etichetta</b> per aggiungere un riferimento, <b>Collega etichette</b> per tracciare una freccia tra due etichette.";
  }

  function setAnnotationMode(next) {
    annotationMode = next === "link" ? "link" : "select";
    annotationLinkSourceId = "";
    if (annotationMode === "link") {
      pendingAnnotationText = "";
      selectedAnnotationLinkId = "";
      closeAnnotationLinkEditor();
    }
    dom.annotationLinkModeBtn?.classList.toggle(
      "is-active",
      annotationMode === "link"
    );
    updateAnnotationHint();
    renderImageAnnotations();
  }

  function handleAnnotationLinkClick(annotationId) {
    if (!annotationLinkSourceId) {
      annotationLinkSourceId = annotationId;
      selectedAnnotationId = annotationId;
      updateAnnotationHint();
      renderImageAnnotations();
      return;
    }

    if (annotationLinkSourceId === annotationId) {
      annotationLinkSourceId = "";
      updateAnnotationHint();
      renderImageAnnotations();
      return;
    }

    createAnnotationLink(modalRoomId, annotationLinkSourceId, annotationId);
    annotationLinkSourceId = "";
    updateAnnotationHint();
  }

  function createAnnotationLink(roomId, fromId, toId) {
    const room = getRoom(roomId);
    if (!room || !fromId || !toId || fromId === toId) return false;

    const links = getRoomAnnotationLinks(roomId);
    const duplicate = links.find(
      (link) =>
        (link.from === fromId && link.to === toId) ||
        (link.from === toId && link.to === fromId)
    );

    if (duplicate) {
      selectedAnnotationLinkId = duplicate.id;
      setSaveStatus("Collegamento già presente");
      renderImageAnnotations();
      openAnnotationLinkEditor();
      return false;
    }

    const link = {
      id: `annlink_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      from: fromId,
      to: toId,
      direction: "forward",
      comment: ""
    };

    links.push(link);
    selectedAnnotationLinkId = link.id;
    scheduleSave();
    renderImageAnnotations();
    openAnnotationLinkEditor();
    return link;
  }

  function updateAnnotationLink(roomId, linkId, patch) {
    const link = getRoomAnnotationLinks(roomId).find(
      (entry) => entry.id === linkId
    );
    if (!link) return false;
    Object.assign(link, patch);
    scheduleSave();
    return true;
  }

  function deleteAnnotationLink(roomId, linkId) {
    const room = getRoom(roomId);
    if (!room) return false;
    room.annotationLinks = getRoomAnnotationLinks(roomId).filter(
      (entry) => entry.id !== linkId
    );
    if (selectedAnnotationLinkId === linkId) selectedAnnotationLinkId = "";
    closeAnnotationLinkEditor();
    scheduleSave();
    renderImageAnnotations();
    return true;
  }

  function renderAnnotationLinks(room) {
    // Può essere richiamata da sola durante il drag: rimuovo l'eventuale
    // layer precedente prima di ricrearlo.
    dom.imageModalOverlay
      .querySelector(".map-annotation-links")
      ?.remove();

    const links = getRoomAnnotationLinks(room.id);
    if (!links.length) return;

    const annById = new Map(
      getRoomAnnotations(room.id).map((entry) => [entry.id, entry])
    );

    const w = Math.max(
      1,
      Number(dom.imageModalCanvas.dataset.renderWidth) ||
        dom.imageModalOverlay.clientWidth ||
        1
    );
    const h = Math.max(
      1,
      Number(dom.imageModalCanvas.dataset.renderHeight) ||
        dom.imageModalOverlay.clientHeight ||
        1
    );

    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "map-annotation-links");
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    svg.setAttribute("preserveAspectRatio", "none");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");

    const defs = document.createElementNS(SVG_NS, "defs");
    defs.innerHTML =
      '<marker id="mapAnnArrow" markerWidth="9" markerHeight="9" refX="7.5" refY="3" orient="auto" markerUnits="strokeWidth">' +
      '<path d="M0,0 L0,6 L8,3 z" fill="#2dd4bf"></path></marker>' +
      '<marker id="mapAnnArrowSel" markerWidth="9" markerHeight="9" refX="7.5" refY="3" orient="auto" markerUnits="strokeWidth">' +
      '<path d="M0,0 L0,6 L8,3 z" fill="#5eead4"></path></marker>';
    svg.appendChild(defs);

    links.forEach((link) => {
      const from = annById.get(link.from);
      const to = annById.get(link.to);
      if (!from || !to) return;

      const px1 = from.x * w;
      const py1 = from.y * h;
      const px2 = to.x * w;
      const py2 = to.y * h;

      const dx = px2 - px1;
      const dy = py2 - py1;
      const len = Math.hypot(dx, dy) || 1;

      // Stacco il tratto dai nodi (raggio ~9px) così la punta della freccia
      // arriva appena fuori dal nodo di destinazione.
      const gap = len > 30 ? 11 : 0;
      const ux = dx / len;
      const uy = dy / len;
      const x1 = px1 + ux * gap;
      const y1 = py1 + uy * gap;
      const x2 = px2 - ux * gap;
      const y2 = py2 - uy * gap;

      const bow = Math.min(60, len * 0.16);
      const cx = (x1 + x2) / 2 + (-dy / len) * bow;
      const cy = (y1 + y2) / 2 + (dx / len) * bow;
      const d = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;

      const group = document.createElementNS(SVG_NS, "g");
      group.setAttribute(
        "class",
        "map-annotation-link-group" +
          (link.id === selectedAnnotationLinkId ? " is-selected" : "")
      );

      const hit = document.createElementNS(SVG_NS, "path");
      hit.setAttribute("d", d);
      hit.setAttribute("class", "map-annotation-link-hit");

      const arrow =
        link.id === selectedAnnotationLinkId
          ? "url(#mapAnnArrowSel)"
          : "url(#mapAnnArrow)";
      const line = document.createElementNS(SVG_NS, "path");
      line.setAttribute("d", d);
      line.setAttribute("class", "map-annotation-link");
      line.setAttribute("marker-end", arrow);
      if (link.direction === "both") {
        line.setAttribute("marker-start", arrow);
      }

      group.append(hit, line);

      if (link.comment) {
        const badge = document.createElementNS(SVG_NS, "circle");
        badge.setAttribute("cx", String(cx));
        badge.setAttribute("cy", String(cy));
        badge.setAttribute("r", "5");
        badge.setAttribute("class", "map-annotation-link-badge");
        group.appendChild(badge);

        const title = document.createElementNS(SVG_NS, "title");
        title.textContent = link.comment;
        group.appendChild(title);
      }

      group.addEventListener("click", (event) => {
        event.stopPropagation();
        selectedAnnotationLinkId = link.id;
        renderImageAnnotations();
        openAnnotationLinkEditor();
      });

      svg.appendChild(group);
    });

    // Sempre come primo figlio: i nodi/etichette restano cliccabili sopra.
    dom.imageModalOverlay.prepend(svg);
  }

  function openAnnotationLinkEditor() {
    const editor = dom.annotationLinkEditor;
    if (!editor) return;

    const link = getRoomAnnotationLinks(modalRoomId).find(
      (entry) => entry.id === selectedAnnotationLinkId
    );

    if (!link) {
      closeAnnotationLinkEditor();
      return;
    }

    const anns = getRoomAnnotations(modalRoomId);
    const from = anns.find((entry) => entry.id === link.from);
    const to = anns.find((entry) => entry.id === link.to);

    editor.hidden = false;
    editor.innerHTML = `
      <div class="map-ann-link-route">
        <b>${escapeHtmlLocal(from?.text || "?")}</b>
        <button type="button" class="map-ann-link-dir" data-act="dir" title="Cambia direzione">${
          link.direction === "both" ? "↔" : "→"
        }</button>
        <b>${escapeHtmlLocal(to?.text || "?")}</b>
      </div>
      <input
        type="text"
        class="map-ann-link-comment"
        placeholder="Commento sul collegamento..."
        value="${escapeHtmlLocal(link.comment || "")}"
      />
      <button type="button" class="map-btn map-btn-danger map-btn-icon" data-act="delete" aria-label="Elimina collegamento">✕</button>
      <button type="button" class="map-btn map-btn-icon" data-act="close" aria-label="Chiudi">▾</button>
    `;

    const commentInput = editor.querySelector(".map-ann-link-comment");
    commentInput.addEventListener("input", () => {
      updateAnnotationLink(modalRoomId, link.id, { comment: commentInput.value });
    });
    commentInput.addEventListener("change", () => renderImageAnnotations());

    editor.querySelector('[data-act="dir"]').addEventListener("click", () => {
      updateAnnotationLink(modalRoomId, link.id, {
        direction: link.direction === "both" ? "forward" : "both"
      });
      renderImageAnnotations();
      openAnnotationLinkEditor();
    });

    editor.querySelector('[data-act="delete"]').addEventListener("click", () => {
      deleteAnnotationLink(modalRoomId, link.id);
    });

    editor.querySelector('[data-act="close"]').addEventListener("click", () => {
      selectedAnnotationLinkId = "";
      closeAnnotationLinkEditor();
      renderImageAnnotations();
    });
  }

  function closeAnnotationLinkEditor() {
    if (!dom.annotationLinkEditor) return;
    dom.annotationLinkEditor.hidden = true;
    dom.annotationLinkEditor.innerHTML = "";
  }

  function getModalImageBaseSize() {
    const naturalWidth = Math.max(
      1,
      Number(dom.imageModalImage.naturalWidth) || 1
    );
    const naturalHeight = Math.max(
      1,
      Number(dom.imageModalImage.naturalHeight) || 1
    );

    const stageWidth = Math.max(320, dom.imageModalStage.clientWidth - 36);
    const stageHeight = Math.max(240, dom.imageModalStage.clientHeight - 36);

    const fitScale = Math.min(
      1,
      stageWidth / naturalWidth,
      stageHeight / naturalHeight
    );

    modalImageBaseWidth = Math.max(1, Math.round(naturalWidth * fitScale));
    modalImageBaseHeight = Math.max(1, Math.round(naturalHeight * fitScale));

    return { width: modalImageBaseWidth, height: modalImageBaseHeight };
  }

  function applyModalZoom({ preserveCenter = true } = {}) {
    if (!modalImageBaseWidth || !modalImageBaseHeight) {
      getModalImageBaseSize();
    }

    const stage = dom.imageModalStage;

    const previousWidth = Math.max(
      1,
      Number(dom.imageModalCanvas.dataset.renderWidth) || modalImageBaseWidth
    );
    const previousHeight = Math.max(
      1,
      Number(dom.imageModalCanvas.dataset.renderHeight) || modalImageBaseHeight
    );

    const centerRatioX = preserveCenter
      ? (stage.scrollLeft + stage.clientWidth / 2) / previousWidth
      : 0.5;
    const centerRatioY = preserveCenter
      ? (stage.scrollTop + stage.clientHeight / 2) / previousHeight
      : 0.5;

    const renderWidth = Math.max(
      1,
      Math.round(modalImageBaseWidth * modalZoom)
    );
    const renderHeight = Math.max(
      1,
      Math.round(modalImageBaseHeight * modalZoom)
    );

    dom.imageModalCanvas.style.width = `${renderWidth}px`;
    dom.imageModalCanvas.style.height = `${renderHeight}px`;
    dom.imageModalCanvas.dataset.renderWidth = String(renderWidth);
    dom.imageModalCanvas.dataset.renderHeight = String(renderHeight);

    // Le frecce tra etichette sono disegnate in pixel: vanno ridisegnate
    // quando cambia la dimensione del canvas.
    if (modalRoomId) renderImageAnnotations();

    dom.imageZoomLabel.textContent = `${Math.round(modalZoom * 100)}%`;
    dom.imageZoomResetBtn.textContent = `${Math.round(modalZoom * 100)}%`;

    window.requestAnimationFrame(() => {
      if (!preserveCenter) {
        stage.scrollLeft = 0;
        stage.scrollTop = 0;
        return;
      }
      stage.scrollLeft = Math.max(
        0,
        centerRatioX * renderWidth - stage.clientWidth / 2
      );
      stage.scrollTop = Math.max(
        0,
        centerRatioY * renderHeight - stage.clientHeight / 2
      );
    });

    return { width: renderWidth, height: renderHeight };
  }

  function setModalZoom(nextZoom = 1, { preserveCenter = true } = {}) {
    modalZoom = Math.max(0.4, Math.min(4, Number(nextZoom) || 1));
    applyModalZoom({ preserveCenter });
    return modalZoom;
  }

  function clearAnnotationSelection() {
    selectedAnnotationId = "";
    renderImageAnnotations();
    return true;
  }

  function renderImageAnnotations() {
    const room = getRoom(modalRoomId);
    dom.imageModalOverlay.innerHTML = "";
    if (!room) return false;

    dom.imageModalOverlay.classList.toggle(
      "is-linking",
      annotationMode === "link"
    );

    renderAnnotationLinks(room);

    getRoomAnnotations(room.id).forEach((annotation) => {
      const wrap = document.createElement("div");
      wrap.className = "map-annotation";
      wrap.dataset.annotationId = annotation.id;
      wrap.style.left = `${annotation.x * 100}%`;
      wrap.style.top = `${annotation.y * 100}%`;
      if (annotation.id === selectedAnnotationId) wrap.classList.add("is-selected");
      if (annotation.id === annotationLinkSourceId) {
        wrap.classList.add("is-link-source");
      }

      // Nodo: il punto preciso (ancora del collegamento). Resta di dimensione
      // costante a qualunque zoom perché è un elemento in px, non scalato.
      const node = document.createElement("div");
      node.className = "map-annotation-node";

      // Etichetta di testo: sta sopra il nodo, collegata da uno stelo.
      const label = document.createElement("div");
      label.className = "map-annotation-label";

      const text = document.createElement("span");
      text.className = "map-annotation-text";
      text.textContent = annotation.text;

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "map-annotation-delete";
      remove.textContent = "✕";
      remove.title = "Elimina etichetta";
      remove.addEventListener("click", (event) => {
        event.stopPropagation();
        deleteAnnotation(room.id, annotation.id);
      });

      label.append(text, remove);
      wrap.append(node, label);

      wrap.addEventListener("click", (event) => {
        event.stopPropagation();
        if (annotationMode === "link") return; // gestito in pointerdown
        selectedAnnotationId = annotation.id;
        selectedAnnotationLinkId = "";
        renderImageAnnotations();
      });

      wrap.addEventListener("dblclick", async (event) => {
        event.stopPropagation();
        if (annotationMode === "link") return;
        const nextText = await mapPrompt("Modifica etichetta", annotation.text);
        if (nextText === null) return;
        updateAnnotationText(room.id, annotation.id, nextText);
      });

      wrap.addEventListener("pointerdown", (event) => {
        if (event.button !== 0) return;
        event.stopPropagation();

        if (annotationMode === "link") {
          handleAnnotationLinkClick(annotation.id);
          return;
        }

        selectedAnnotationId = annotation.id;
        selectedAnnotationLinkId = "";
        annotationDrag = {
          pointerId: event.pointerId,
          annotationId: annotation.id,
          roomId: room.id,
          moved: false
        };

        try {
          wrap.setPointerCapture(event.pointerId);
        } catch (error) {
          /* pointer non più attivo: il drag continua comunque via bubbling */
        }

        // Solo classi di selezione: non ricostruisco il layer, così la
        // pointer capture sul wrapper resta valida per tutto il drag.
        dom.imageModalOverlay
          .querySelectorAll(".map-annotation")
          .forEach((el) => {
            el.classList.toggle(
              "is-selected",
              el.dataset.annotationId === annotation.id
            );
          });
      });

      wrap.addEventListener("pointermove", (event) => {
        if (
          !annotationDrag ||
          annotationDrag.annotationId !== annotation.id ||
          annotationDrag.pointerId !== event.pointerId
        )
          return;

        annotationDrag.moved = true;
        const rect = dom.imageModalOverlay.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        moveAnnotation(room.id, annotation.id, x, y, false);
      });

      const endDrag = (event) => {
        if (
          !annotationDrag ||
          annotationDrag.annotationId !== annotation.id ||
          annotationDrag.pointerId !== event.pointerId
        )
          return;

        if (wrap.hasPointerCapture(event.pointerId)) {
          wrap.releasePointerCapture(event.pointerId);
        }
        const moved = annotationDrag.moved;
        annotationDrag = null;
        if (moved) scheduleSave();
        renderImageAnnotations();
      };

      wrap.addEventListener("pointerup", endDrag);
      wrap.addEventListener("pointercancel", endDrag);

      dom.imageModalOverlay.appendChild(wrap);
    });

    return true;
  }

  function createAnnotation(roomId = modalRoomId, text = "", x = 0.5, y = 0.5) {
    const room = getRoom(roomId);
    if (!room) return false;

    const cleanText = String(text || "").trim();
    if (!cleanText) return false;

    const annotation = {
      id: `annotation_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      text: cleanText,
      x: Math.max(0.02, Math.min(0.98, Number(x) || 0.5)),
      y: Math.max(0.02, Math.min(0.98, Number(y) || 0.5))
    };

    getRoomAnnotations(roomId).push(annotation);
    selectedAnnotationId = annotation.id;
    scheduleSave();
    renderImageAnnotations();
    return annotation;
  }

  function updateAnnotationText(roomId = modalRoomId, annotationId = "", text = "") {
    const annotation = getRoomAnnotations(roomId).find(
      (entry) => entry.id === annotationId
    );
    if (!annotation) return false;

    const cleanText = String(text || "").trim();
    if (!cleanText) return false;

    annotation.text = cleanText;
    scheduleSave();
    renderImageAnnotations();
    return true;
  }

  function moveAnnotation(
    roomId = modalRoomId,
    annotationId = "",
    x = 0.5,
    y = 0.5,
    persist = true
  ) {
    const annotation = getRoomAnnotations(roomId).find(
      (entry) => entry.id === annotationId
    );
    if (!annotation) return false;

    annotation.x = Math.max(0.02, Math.min(0.98, Number(x) || 0.5));
    annotation.y = Math.max(0.02, Math.min(0.98, Number(y) || 0.5));

    if (persist) {
      scheduleSave();
      renderImageAnnotations();
      return true;
    }

    // Drag live: sposto solo il wrapper trascinato e ridisegno le frecce,
    // senza ricostruire tutto (mantiene la pointer capture stabile).
    const room = getRoom(roomId);
    const wrap = dom.imageModalOverlay.querySelector(
      `.map-annotation[data-annotation-id="${annotationId}"]`
    );
    if (wrap) {
      wrap.style.left = `${annotation.x * 100}%`;
      wrap.style.top = `${annotation.y * 100}%`;
    }
    if (room) renderAnnotationLinks(room);
    return true;
  }

  function deleteAnnotation(
    roomId = modalRoomId,
    annotationId = selectedAnnotationId
  ) {
    const room = getRoom(roomId);
    if (!room) return false;

    room.annotations = getRoomAnnotations(roomId).filter(
      (entry) => entry.id !== annotationId
    );
    room.annotationLinks = getRoomAnnotationLinks(roomId).filter(
      (link) => link.from !== annotationId && link.to !== annotationId
    );
    if (selectedAnnotationId === annotationId) selectedAnnotationId = "";
    if (annotationLinkSourceId === annotationId) annotationLinkSourceId = "";
    closeAnnotationLinkEditor();
    scheduleSave();
    renderImageAnnotations();
    return true;
  }

  function openImageMagnifier(roomId = "") {
    const room = getRoom(roomId);
    if (!room) return false;

    modalRoomId = room.id;
    pendingAnnotationText = "";
    selectedAnnotationId = "";
    annotationDrag = null;
    imagePan = null;
    modalImageBaseWidth = 0;
    modalImageBaseHeight = 0;
    annotationMode = "select";
    annotationLinkSourceId = "";
    selectedAnnotationLinkId = "";
    dom.annotationLinkModeBtn?.classList.remove("is-active");
    closeAnnotationLinkEditor();

    dom.imageModalImage.alt = room.title;
    dom.imageModalTitle.textContent = room.title;
    if (dom.imageModalNote) dom.imageModalNote.value = room.comment || "";
    updateAnnotationHint();

    dom.imageModal.classList.add("is-open");
    dom.imageModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    const onImageReady = () => {
      getModalImageBaseSize();
      setModalZoom(1, { preserveCenter: false });
      renderImageAnnotations();
      dom.imageModalStage.scrollTop = 0;
      dom.imageModalStage.scrollLeft = 0;
    };

    dom.imageModalImage.onload = onImageReady;
    dom.imageModalImage.src = IMAGE_DIR + room.fileName;

    if (dom.imageModalImage.complete && dom.imageModalImage.naturalWidth > 0) {
      onImageReady();
    }

    return true;
  }

  function closeImageMagnifier() {
    dom.imageModal.classList.remove("is-open");
    dom.imageModal.setAttribute("aria-hidden", "true");
    dom.imageModalStage.classList.remove("is-dragging");
    dom.imageModalImage.onload = null;
    dom.imageModalImage.src = "";
    dom.imageModalOverlay.innerHTML = "";
    dom.imageModalOverlay.classList.remove("is-linking");
    dom.imageModalCanvas.style.width = "";
    dom.imageModalCanvas.style.height = "";
    dom.imageModalCanvas.removeAttribute("data-render-width");
    dom.imageModalCanvas.removeAttribute("data-render-height");
    document.body.style.overflow = "";

    modalRoomId = "";
    selectedAnnotationId = "";
    pendingAnnotationText = "";
    annotationDrag = null;
    imagePan = null;
    modalImageBaseWidth = 0;
    modalImageBaseHeight = 0;
    modalZoom = 1;
    annotationMode = "select";
    annotationLinkSourceId = "";
    selectedAnnotationLinkId = "";
    dom.annotationLinkModeBtn?.classList.remove("is-active");
    closeAnnotationLinkEditor();
    dom.imageZoomLabel.textContent = "100%";
    dom.imageZoomResetBtn.textContent = "100%";

    // Riflette nel pannello dettaglio etichette e collegamenti aggiunti
    // mentre la modale era aperta.
    renderSelectedPanel();

    return true;
  }

  function beginImagePan(event) {
    if (!dom.imageModal.classList.contains("is-open") || event.button !== 0) {
      return false;
    }

    if (event.target?.closest?.(".map-annotation")) return false;
    if (event.target?.closest?.(".map-annotation-link-group")) return false;
    if (pendingAnnotationText) return false;

    imagePan = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startScrollLeft: dom.imageModalStage.scrollLeft,
      startScrollTop: dom.imageModalStage.scrollTop,
      moved: false
    };

    dom.imageModalStage.setPointerCapture(event.pointerId);
    dom.imageModalStage.classList.add("is-dragging");
    event.preventDefault();
    return true;
  }

  function moveImagePan(event) {
    if (!imagePan || imagePan.pointerId !== event.pointerId) return false;

    const deltaX = event.clientX - imagePan.startClientX;
    const deltaY = event.clientY - imagePan.startClientY;

    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) imagePan.moved = true;

    dom.imageModalStage.scrollLeft = imagePan.startScrollLeft - deltaX;
    dom.imageModalStage.scrollTop = imagePan.startScrollTop - deltaY;
    event.preventDefault();
    return true;
  }

  function endImagePan(event) {
    if (!imagePan || imagePan.pointerId !== event.pointerId) return false;

    if (dom.imageModalStage.hasPointerCapture(event.pointerId)) {
      dom.imageModalStage.releasePointerCapture(event.pointerId);
    }

    dom.imageModalStage.classList.remove("is-dragging");
    imagePan = null;
    return true;
  }

  function updateRoomComment(roomId = "", comment = "") {
    const room = getRoom(roomId);
    if (!room) return false;
    room.comment = String(comment || "");
    scheduleSave();
    return true;
  }

  function renderSelectedPanel() {
    const room = getRoom(selectedRoomId);

    if (!room) {
      dom.selectedPanel.className = "map-empty";
      dom.selectedPanel.innerHTML =
        "Seleziona una stanza per vedere immagine e collegamenti.";
      dom.connectionList.innerHTML = "";
      return;
    }

    const annotations = getRoomAnnotations(room.id);
    const annLinks = getRoomAnnotationLinks(room.id);
    const annById = new Map(annotations.map((entry) => [entry.id, entry]));

    const annLinksHtml = annLinks.length
      ? `
        <div class="map-ann-link-summary">
          <div class="map-muted">
            ${annLinks.length} collegament${annLinks.length === 1 ? "o" : "i"} tra etichette
          </div>
          ${annLinks
            .map((link) => {
              const from = annById.get(link.from);
              const to = annById.get(link.to);
              if (!from || !to) return "";
              return `
                <button type="button" class="map-ann-link-summary-row" data-open-magnifier="1">
                  <span>${escapeHtmlLocal(from.text)} ${
                    link.direction === "both" ? "↔" : "→"
                  } ${escapeHtmlLocal(to.text)}</span>
                  ${
                    link.comment
                      ? `<span class="map-muted">${escapeHtmlLocal(link.comment)}</span>`
                      : ""
                  }
                </button>`;
            })
            .join("")}
        </div>`
      : "";

    dom.selectedPanel.className = "map-selected-preview";
    dom.selectedPanel.innerHTML = `
      <img
        class="map-selected-thumb"
        src="${IMAGE_DIR + room.fileName}"
        alt="${escapeHtmlLocal(room.title)}"
        title="Clicca per ingrandire"
      >
      <div class="map-selected-info">
        <strong>${escapeHtmlLocal(room.title)}</strong>
        <div class="map-muted">${escapeHtmlLocal(room.fileName)}</div>
        <div class="map-muted">${getRoomDegree(room.id)} collegamenti &middot; ${
          annotations.length
        } etichette</div>
        ${annLinksHtml}
        <div class="map-comment-wrap">
          <label for="mapSelectedRoomComment">Commenti</label>
          <textarea
            id="mapSelectedRoomComment"
            class="map-comment"
            placeholder="Annotazioni, idee, collegamenti narrativi, variazioni..."
          >${escapeHtmlLocal(room.comment || "")}</textarea>
        </div>
      </div>
    `;

    dom.selectedPanel
      .querySelector(".map-selected-thumb")
      ?.addEventListener("click", () => openImageMagnifier(room.id));

    dom.selectedPanel
      .querySelectorAll("[data-open-magnifier]")
      .forEach((element) => {
        element.addEventListener("click", () => openImageMagnifier(room.id));
      });

    const commentField = dom.selectedPanel.querySelector(
      "#mapSelectedRoomComment"
    );
    commentField?.addEventListener("input", () => {
      updateRoomComment(room.id, commentField.value);
    });

    const connections = getRoomConnections(room.id);
    dom.connectionList.innerHTML = "";

    if (!connections.length) {
      dom.connectionList.innerHTML =
        `<div class="map-empty">Nessun collegamento definito.</div>`;
      return;
    }

    connections.forEach((edge) => {
      const isFrom = edge.from === room.id;
      const otherId = isFrom ? edge.to : edge.from;
      const other = getRoom(otherId);
      if (!other) return;

      const directionText =
        edge.direction === "both" ? "↔" : isFrom ? "→" : "←";

      const row = document.createElement("div");
      row.className = "map-connection-row";
      row.innerHTML = `
        <div class="map-connection-top">
          <div class="map-connection-text">
            <b>${directionText} ${escapeHtmlLocal(other.title)}</b>
            <div class="map-connection-type">
              ${escapeHtmlLocal(edge.type || "porta")}
              &middot;
              ${edge.direction === "both" ? "bidirezionale" : "solo andata"}
            </div>
          </div>
          <button type="button" class="map-btn map-btn-danger map-btn-icon" aria-label="Rimuovi collegamento">✕</button>
        </div>
      `;

      row.querySelector("button").addEventListener("click", () => {
        deleteEdge(edge.id);
      });

      row.querySelector(".map-connection-text").addEventListener("click", () => {
        selectedRoomId = other.id;
        renderAll();
        focusRoom(other.id);
      });

      dom.connectionList.appendChild(row);
    });
  }

  function renderConnectionHint() {
    if (mode !== "connect") {
      dom.connectionHint.hidden = true;
      return;
    }

    dom.connectionHint.hidden = false;

    if (!connectionSourceId) {
      dom.connectionHint.textContent =
        "Modalità collegamento attiva: clicca la prima stanza (A), poi la seconda (B).";
      return;
    }

    const source = getRoom(connectionSourceId);
    dom.connectionHint.textContent = `Partenza: ${
      source ? source.title : connectionSourceId
    }. Ora clicca la stanza di destinazione.`;
  }

  function renderSelectionOnly() {
    dom.cardsLayer.querySelectorAll(".map-room-card").forEach((card) => {
      card.classList.toggle(
        "is-selected",
        card.dataset.roomId === selectedRoomId
      );
    });
    renderRoomList();
    renderSelectedPanel();
  }

  function renderAll() {
    renderRoomList();
    renderCards();
    renderEdges();
    renderSelectedPanel();
    renderConnectionHint();
  }

  function focusRoom(roomId) {
    const room = getRoom(roomId);
    if (!room) return;

    const targetLeft = Math.max(
      0,
      room.x * zoom - dom.viewport.clientWidth / 2 + (CARD_W * zoom) / 2
    );
    const targetTop = Math.max(
      0,
      room.y * zoom - dom.viewport.clientHeight / 2 + (CARD_H * zoom) / 2
    );

    dom.viewport.scrollTo({
      left: targetLeft,
      top: targetTop,
      behavior: "smooth"
    });
  }

  // Dimensiona il canvas in base alla mappa più a destra / più in basso,
  // con margine extra per continuare a trascinare oltre. Restringe fino al
  // minimo quando le mappe vengono ricompattate ("Riordina griglia").
  function updateSceneSize() {
    let width = SCENE_MIN_W;
    let height = SCENE_MIN_H;

    Object.values(state.rooms).forEach((room) => {
      width = Math.max(width, (Number(room.x) || 0) + CARD_W + SCENE_PADDING);
      height = Math.max(height, (Number(room.y) || 0) + CARD_H + SCENE_PADDING);
    });

    dom.scene.style.width = `${Math.round(width)}px`;
    dom.scene.style.height = `${Math.round(height)}px`;
  }

  function applyZoom() {
    zoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, zoom));
    dom.scene.style.transform = `scale(${zoom})`;
    dom.scene.style.marginRight = `${dom.scene.offsetWidth * (zoom - 1)}px`;
    dom.scene.style.marginBottom = `${dom.scene.offsetHeight * (zoom - 1)}px`;
    dom.zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
  }

  // Zoom del canvas mantenendo fermo il punto sotto il cursore (o il centro
  // della viewport se non viene passato un ancoraggio: es. pulsanti).
  function zoomCanvas(delta, anchorClientX, anchorClientY) {
    const prevZoom = zoom;
    const nextZoom = Math.max(
      ZOOM_MIN,
      Math.min(ZOOM_MAX, Number((zoom + delta).toFixed(4)))
    );
    if (nextZoom === prevZoom) return;

    const rect = dom.viewport.getBoundingClientRect();
    const hasAnchor =
      Number.isFinite(anchorClientX) && Number.isFinite(anchorClientY);
    const anchorX = hasAnchor
      ? anchorClientX - rect.left
      : dom.viewport.clientWidth / 2;
    const anchorY = hasAnchor
      ? anchorClientY - rect.top
      : dom.viewport.clientHeight / 2;

    const sceneX = (dom.viewport.scrollLeft + anchorX) / prevZoom;
    const sceneY = (dom.viewport.scrollTop + anchorY) / prevZoom;

    zoom = nextZoom;
    applyZoom();

    dom.viewport.scrollLeft = Math.max(0, sceneX * zoom - anchorX);
    dom.viewport.scrollTop = Math.max(0, sceneY * zoom - anchorY);
  }

  // ---------------------------------------------------------------------------
  // Pan del canvas principale
  // ---------------------------------------------------------------------------

  function canStartMainGridPan(event) {
    if (event.button !== 0 && event.button !== 1) return false;
    if (event.target?.closest?.(".map-room-card")) return false;
    return true;
  }

  function beginMainGridPan(event) {
    if (!canStartMainGridPan(event)) return false;

    pan = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startScrollLeft: dom.viewport.scrollLeft,
      startScrollTop: dom.viewport.scrollTop
    };

    dom.viewport.setPointerCapture(event.pointerId);
    dom.viewport.classList.add("is-panning");
    event.preventDefault();
    return true;
  }

  function moveMainGridPan(event) {
    if (!pan || pan.pointerId !== event.pointerId) return false;

    const deltaX = event.clientX - pan.startClientX;
    const deltaY = event.clientY - pan.startClientY;

    const maxLeft = Math.max(
      0,
      dom.viewport.scrollWidth - dom.viewport.clientWidth
    );
    const maxTop = Math.max(
      0,
      dom.viewport.scrollHeight - dom.viewport.clientHeight
    );

    dom.viewport.scrollLeft = Math.max(
      0,
      Math.min(maxLeft, pan.startScrollLeft - deltaX)
    );
    dom.viewport.scrollTop = Math.max(
      0,
      Math.min(maxTop, pan.startScrollTop - deltaY)
    );

    event.preventDefault();
    return true;
  }

  function endMainGridPan(event) {
    if (!pan || pan.pointerId !== event.pointerId) return false;

    if (dom.viewport.hasPointerCapture(event.pointerId)) {
      dom.viewport.releasePointerCapture(event.pointerId);
    }

    dom.viewport.classList.remove("is-panning");
    pan = null;
    return true;
  }

  // ---------------------------------------------------------------------------
  // Bind
  // ---------------------------------------------------------------------------

  function collectDom() {
    const $ = (id) => document.getElementById(id);
    dom = {
      workspace: $("mappeWorkspace"),
      viewport: $("mapViewport"),
      scene: $("mapScene"),
      cardsLayer: $("mapCardsLayer"),
      linksSvg: $("mapLinksSvg"),
      roomList: $("mapRoomList"),
      roomCount: $("mapRoomCount"),
      roomSearch: $("mapRoomSearch"),
      newRoomFile: $("mapNewRoomFile"),
      addRoomBtn: $("mapAddRoomBtn"),
      selectModeBtn: $("mapSelectModeBtn"),
      connectModeBtn: $("mapConnectModeBtn"),
      connectionType: $("mapConnectionType"),
      connectionDirection: $("mapConnectionDirection"),
      zoomOutBtn: $("mapZoomOutBtn"),
      zoomInBtn: $("mapZoomInBtn"),
      zoomLabel: $("mapZoomLabel"),
      resetLayoutBtn: $("mapResetLayoutBtn"),
      exportBtn: $("mapExportBtn"),
      importBtn: $("mapImportBtn"),
      importFile: $("mapImportFile"),
      clearBtn: $("mapClearBtn"),
      saveStatus: $("mapSaveStatus"),
      selectedPanel: $("mapSelectedPanel"),
      connectionList: $("mapConnectionList"),
      connectionHint: $("mapConnectionHint"),
      detailToggle: $("mapDetailToggle"),
      detail: document.querySelector("#mappeWorkspace .map-detail"),
      imageModal: $("mapImageModal"),
      imageModalBackdrop: $("mapImageModalBackdrop"),
      imageModalClose: $("mapImageModalClose"),
      imageModalImage: $("mapImageModalImage"),
      imageModalTitle: $("mapImageModalTitle"),
      imageModalStage: $("mapImageModalStage"),
      imageModalCanvas: $("mapImageModalCanvas"),
      imageModalOverlay: $("mapImageModalOverlay"),
      imageModalHint: $("mapImageModalHint"),
      imageZoomOutBtn: $("mapImageZoomOutBtn"),
      imageZoomResetBtn: $("mapImageZoomResetBtn"),
      imageZoomInBtn: $("mapImageZoomInBtn"),
      imageZoomLabel: $("mapImageZoomLabel"),
      annotationAddBtn: $("mapAnnotationAddBtn"),
      annotationDeleteBtn: $("mapAnnotationDeleteBtn"),
      annotationLinkModeBtn: $("mapAnnotationLinkModeBtn"),
      annotationLinkEditor: $("mapAnnotationLinkEditor"),
      imageModalNote: $("mapImageModalNote")
    };
  }

  function bindEvents() {
    dom.roomSearch.addEventListener("input", renderRoomList);

    dom.addRoomBtn.addEventListener("click", () => {
      addRoom(dom.newRoomFile.value);
      dom.newRoomFile.value = "";
    });

    dom.newRoomFile.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        addRoom(dom.newRoomFile.value);
        dom.newRoomFile.value = "";
      }
    });

    dom.selectModeBtn.addEventListener("click", () => setMode("select"));
    dom.connectModeBtn.addEventListener("click", () => setMode("connect"));

    dom.resetLayoutBtn.addEventListener("click", resetLayout);
    dom.exportBtn.addEventListener("click", exportJson);
    dom.importBtn.addEventListener("click", () => dom.importFile.click());
    dom.importFile.addEventListener("change", () => {
      importJsonFile(dom.importFile.files?.[0] || null);
      dom.importFile.value = "";
    });
    dom.clearBtn.addEventListener("click", clearProject);

    dom.zoomOutBtn.addEventListener("click", () => zoomCanvas(-ZOOM_STEP));
    dom.zoomInBtn.addEventListener("click", () => zoomCanvas(ZOOM_STEP));

    dom.detailToggle.addEventListener("click", () => {
      dom.detail.classList.toggle("is-open");
    });

    // Modale immagine
    dom.imageModalClose.addEventListener("click", closeImageMagnifier);
    dom.imageModalBackdrop.addEventListener("click", closeImageMagnifier);

    dom.imageModalStage.addEventListener("pointerdown", beginImagePan);
    dom.imageModalStage.addEventListener("pointermove", moveImagePan);
    dom.imageModalStage.addEventListener("pointerup", endImagePan);
    dom.imageModalStage.addEventListener("pointercancel", endImagePan);

    dom.imageModalStage.addEventListener(
      "wheel",
      (event) => {
        if (!event.ctrlKey) return;
        event.preventDefault();
        const direction = event.deltaY < 0 ? 1 : -1;
        setModalZoom(modalZoom + direction * 0.1);
      },
      { passive: false }
    );

    dom.imageZoomOutBtn.addEventListener("click", () =>
      setModalZoom(modalZoom - 0.1)
    );
    dom.imageZoomInBtn.addEventListener("click", () =>
      setModalZoom(modalZoom + 0.1)
    );
    dom.imageZoomResetBtn.addEventListener("click", () => setModalZoom(1));

    dom.annotationAddBtn.addEventListener("click", async () => {
      if (annotationMode === "link") setAnnotationMode("select");
      const text = await mapPrompt("Testo etichetta", pendingAnnotationText || "");
      if (text === null) return;

      pendingAnnotationText = String(text || "").trim();
      if (!pendingAnnotationText) return;

      dom.imageModalHint.innerHTML = `Etichetta pronta: <b>${escapeHtmlLocal(
        pendingAnnotationText
      )}</b>. Ora clicca un punto dell'immagine per posizionarla.`;
    });

    dom.annotationDeleteBtn.addEventListener("click", async () => {
      if (!selectedAnnotationId) {
        await mapAlert("Seleziona prima una etichetta da eliminare.");
        return;
      }
      deleteAnnotation(modalRoomId, selectedAnnotationId);
    });

    dom.annotationLinkModeBtn?.addEventListener("click", () => {
      setAnnotationMode(annotationMode === "link" ? "select" : "link");
    });

    dom.imageModalNote?.addEventListener("input", () => {
      if (!modalRoomId) return;
      updateRoomComment(modalRoomId, dom.imageModalNote.value);
    });

    dom.imageModalOverlay.addEventListener("click", (event) => {
      if (pendingAnnotationText) {
        const rect = dom.imageModalOverlay.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;

        createAnnotation(modalRoomId, pendingAnnotationText, x, y);
        pendingAnnotationText = "";
        updateAnnotationHint();
        return;
      }

      if (annotationMode === "link") {
        // Click sul vuoto: annulla l'eventuale partenza selezionata.
        if (annotationLinkSourceId) {
          annotationLinkSourceId = "";
          updateAnnotationHint();
          renderImageAnnotations();
        }
        return;
      }

      selectedAnnotationLinkId = "";
      closeAnnotationLinkEditor();
      clearAnnotationSelection();
    });

    window.addEventListener("keydown", (event) => {
      if (
        event.key === "Escape" &&
        dom.imageModal.classList.contains("is-open")
      ) {
        if (pendingAnnotationText) {
          pendingAnnotationText = "";
          dom.imageModalHint.innerHTML = "Posizionamento annullato.";
          return;
        }
        if (annotationMode === "link") {
          setAnnotationMode("select");
          return;
        }
        if (selectedAnnotationLinkId) {
          selectedAnnotationLinkId = "";
          closeAnnotationLinkEditor();
          renderImageAnnotations();
          return;
        }
        closeImageMagnifier();
      }

      if (
        (event.key === "Delete" || event.key === "Backspace") &&
        dom.imageModal.classList.contains("is-open") &&
        document.activeElement?.tagName !== "TEXTAREA" &&
        document.activeElement?.tagName !== "INPUT"
      ) {
        if (selectedAnnotationLinkId) {
          event.preventDefault();
          deleteAnnotationLink(modalRoomId, selectedAnnotationLinkId);
          return;
        }
        if (selectedAnnotationId) {
          event.preventDefault();
          deleteAnnotation(modalRoomId, selectedAnnotationId);
        }
      }
    });

    // Pan canvas
    dom.viewport.addEventListener("pointerdown", beginMainGridPan);
    dom.viewport.addEventListener("pointermove", moveMainGridPan);
    dom.viewport.addEventListener("pointerup", endMainGridPan);
    dom.viewport.addEventListener("pointercancel", endMainGridPan);

    dom.viewport.addEventListener(
      "wheel",
      (event) => {
        // Ctrl + rotella = zoom del canvas verso il cursore.
        if (event.ctrlKey === true) {
          event.preventDefault();
          const direction = event.deltaY < 0 ? 1 : -1;
          zoomCanvas(direction * ZOOM_STEP, event.clientX, event.clientY);
          return;
        }

        // Shift + rotella = scorrimento orizzontale.
        if (event.shiftKey === true) {
          event.preventDefault();
          dom.viewport.scrollLeft += event.deltaY || event.deltaX || 0;
          return;
        }

        // Rotella normale = scorrimento verticale nativo della viewport.
      },
      { passive: false }
    );

    window.addEventListener("resize", () => {
      if (!dom.workspace.classList.contains("hidden")) renderEdges();
    });
  }

  // ---------------------------------------------------------------------------
  // Init / onShow
  // ---------------------------------------------------------------------------

  async function initialize() {
    if (initialized) return;
    initialized = true;

    collectDom();
    if (!dom.workspace) {
      initialized = false;
      return;
    }

    bindEvents();

    state = loadLocalState();
    applyZoom();
    renderAll();

    if (isOnline()) {
      setSaveStatus("Carico dal database...");
      const remote = await loadRemoteState();
      if (remote) {
        state = remote;
        writeLocalCache();
        applyZoom();
        renderAll();
        setSaveStatus("Sincronizzato");
      } else if (!remoteLoaded) {
        setSaveStatus("Offline: salvataggio locale", true);
      }
      startRealtime();
    } else {
      setSaveStatus("Offline: salvataggio locale");
    }
  }

  async function onShow() {
    await initialize();

    // Riallinea gli archi (il layout della viewport può essere cambiato
    // mentre il workspace era nascosto) e riprende la sync remota.
    applyZoom();
    renderEdges();

    if (isOnline()) {
      if (!realtimeChannel) startRealtime();
      const remote = await loadRemoteState();
      if (remote && Date.now() - lastLocalSaveAt > 3000) {
        state = remote;
        writeLocalCache();
        renderAll();
      }
    }
  }

  window.AuthorMapPlanner = { onShow };

  function bindTab() {
    const tab = document.getElementById("mappeTabBtn");
    if (!tab) return;
    tab.addEventListener("click", () => {
      if (typeof switchAuthorWorkspace === "function") {
        switchAuthorWorkspace("mappe");
      } else {
        document
          .getElementById("mappeWorkspace")
          ?.classList.remove("hidden");
        onShow();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindTab);
  } else {
    bindTab();
  }
})();
