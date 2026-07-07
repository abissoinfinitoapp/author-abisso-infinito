(function initAbissoQuestTextOverrides() {
  const AUTHOR_SUPABASE_URL = "https://dcvxdfuvmrmvugedrokc.supabase.co";
  const AUTHOR_PUBLISHABLE_KEY = "sb_publishable_bkfgi6tmYnpHgFOI8RnX-A_UtFAZVQ-";

  function setByPath(target, fieldPath, value) {
    const parts = String(fieldPath || "").split(".").filter(Boolean);

    if (!target || !parts.length) return false;

    let cursor = target;

    for (let index = 0; index < parts.length - 1; index += 1) {
      const part = parts[index];

      if (cursor?.[part] === undefined || cursor?.[part] === null) {
        return false;
      }

      cursor = cursor[part];
    }

    cursor[parts.at(-1)] = value;
    return true;
  }

  function resolveTarget(row) {
    const entityKey = String(row.entity_key || "");

    if (row.source_id === "map_objects") {
      const [collectionKey, ...entityParts] = entityKey.split(".");
      const itemKey = entityParts.join(".");
      const library = window.AbissoMapObjectsLibrary;
      const collections = {
        items: library?.MAP_OBJECT_ITEMS,
        pickups: library?.MAP_OBJECT_PICKUPS,
        actions: library?.MAP_OBJECT_ACTIONS
      };

      return collections[collectionKey]?.[itemKey] || null;
    }

    if (row.source_id === "mini_maps") {
      const marker = ".nodes.";
      const markerIndex = entityKey.indexOf(marker);
      const maps = window.AbissoMiniMapsConfig?.MINI_MAPS;

      if (entityKey.endsWith(".map")) {
        return maps?.[entityKey.slice(0, -4)] || null;
      }

      if (markerIndex >= 0) {
        const mapKey = entityKey.slice(0, markerIndex);
        const nodeKey = entityKey.slice(markerIndex + marker.length);
        return maps?.[mapKey]?.nodes?.[nodeKey] || null;
      }
    }

    if (row.source_id === "main_map") {
      const separatorIndex = entityKey.indexOf(".");

      if (separatorIndex >= 0) {
        const mapKey = entityKey.slice(0, separatorIndex);
        const nodeKey = entityKey.slice(separatorIndex + 1);

        return window.AbissoMainMapInteractionsConfig
          ?.MAIN_MAP_INTERACTIONS?.[mapKey]?.[nodeKey] || null;
      }
    }

    return null;
  }

  async function loadAndApplyOverrides() {
    const endpoint = new URL(
      "/rest/v1/author_published_quest_texts",
      AUTHOR_SUPABASE_URL
    );

    endpoint.searchParams.set(
      "select",
      "text_key,source_id,entity_key,field_path,content"
    );

    const response = await fetch(endpoint, {
      headers: {
        apikey: AUTHOR_PUBLISHABLE_KEY
      }
    });

    if (!response.ok) {
      throw new Error(`Caricamento testi pubblicati fallito: HTTP ${response.status}`);
    }

    const rows = await response.json();
    let applied = 0;

    rows.forEach((row) => {
      const target = resolveTarget(row);

      if (target && setByPath(target, row.field_path, row.content)) {
        applied += 1;
      }
    });

    console.log(
      `[QUEST TEXT OVERRIDES] Applicati ${applied} testi pubblicati su ${rows.length}.`
    );

    return { applied, total: rows.length };
  }

  window.AbissoQuestTextOverridesReady = loadAndApplyOverrides().catch((error) => {
    console.warn(
      "[QUEST TEXT OVERRIDES] Uso dei testi provvisori locali:",
      error
    );

    return { applied: 0, total: 0, error };
  });
})();
