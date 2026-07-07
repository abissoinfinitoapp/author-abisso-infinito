import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const authorRoot = path.resolve(scriptDir, "..");
const gameRoot = path.resolve(
  process.argv[2] || path.join(authorRoot, "..", "abissoinfinito app refactor")
);

const sources = [
  {
    id: "map_objects",
    label: "Oggetti e azioni quest",
    file: "dashboard/js/config/map-objects-library.js",
    globalName: "AbissoMapObjectsLibrary"
  },
  {
    id: "mini_maps",
    label: "Mini mappe",
    file: "dashboard/js/config/mini-maps-config.js",
    globalName: "AbissoMiniMapsConfig"
  },
  {
    id: "main_map",
    label: "Interazioni mappa principale",
    file: "dashboard/js/config/main-map-interactions-config.js",
    globalName: "AbissoMainMapInteractionsConfig"
  }
];

const editableFields = new Set([
  "title",
  "description",
  "text",
  "promptTitle",
  "promptBody",
  "promptButtonLabel",
  "buttonLabel",
  "successMessage",
  "alreadyCollectedMessage",
  "blockedPromptBody",
  "failMessage",
  "lockedMessage",
  "actionChoiceTitle",
  "actionChoiceBody",
  "blockedTitle",
  "blockedMessage",
  "blockedFooter",
  "passedTitle",
  "passedMessage"
]);

function loadConfig(source) {
  const absolutePath = path.join(gameRoot, source.file);
  const code = fs.readFileSync(absolutePath, "utf8");
  const window = {};
  const context = vm.createContext({
    window,
    console: {
      log() {},
      warn() {},
      error() {}
    },
    setTimeout,
    clearTimeout
  });

  vm.runInContext(code, context, {
    filename: absolutePath,
    timeout: 10_000
  });

  const config = window[source.globalName];

  if (!config) {
    throw new Error(`Configurazione ${source.globalName} non trovata in ${source.file}`);
  }

  return config;
}

function walkTextFields(value, pathParts = [], fields = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      walkTextFields(item, [...pathParts, String(index)], fields);
    });
    return fields;
  }

  if (!value || typeof value !== "object") {
    return fields;
  }

  Object.entries(value).forEach(([key, child]) => {
    const nextPath = [...pathParts, key];

    if (
      typeof child === "string" &&
      editableFields.has(key) &&
      child.trim()
    ) {
      fields.push({
        fieldPath: nextPath.join("."),
        fieldName: key,
        provisionalText: child
      });
      return;
    }

    if (child && typeof child === "object") {
      walkTextFields(child, nextPath, fields);
    }
  });

  return fields;
}

function makeUnit({
  source,
  groupKey,
  groupLabel,
  entityKey,
  value,
  titleFallback
}) {
  const fields = walkTextFields(value);

  if (!fields.length) return null;

  const title =
    String(value?.title || value?.promptTitle || titleFallback || entityKey).trim();

  return {
    unitKey: `${source.id}:${entityKey}`,
    sourceId: source.id,
    sourceLabel: source.label,
    sourceFile: source.file,
    groupKey,
    groupLabel,
    entityKey,
    title,
    fields: fields.map((field, index) => ({
      textKey: `${source.id}:${entityKey}:${field.fieldPath}`,
      fieldPath: field.fieldPath,
      fieldName: field.fieldName,
      fieldIndex: index,
      provisionalText: field.provisionalText
    }))
  };
}

function extractMapObjects(source, config) {
  const collections = [
    ["items", "Oggetti quest", config.MAP_OBJECT_ITEMS],
    ["pickups", "Raccolte oggetti", config.MAP_OBJECT_PICKUPS],
    ["actions", "Azioni quest", config.MAP_OBJECT_ACTIONS]
  ];

  return collections.flatMap(([groupKey, groupLabel, collection]) => {
    return Object.entries(collection || {})
      .map(([entityKey, value]) =>
        makeUnit({
          source,
          groupKey,
          groupLabel,
          entityKey: `${groupKey}.${entityKey}`,
          value,
          titleFallback: entityKey
        })
      )
      .filter(Boolean);
  });
}

function extractMiniMaps(source, config) {
  return Object.entries(config.MINI_MAPS || {}).flatMap(([mapKey, map]) => {
    const units = [];
    const mapUnit = makeUnit({
      source,
      groupKey: mapKey,
      groupLabel: map.title || mapKey,
      entityKey: `${mapKey}.map`,
      value: {
        title: map.title,
        description: map.description
      },
      titleFallback: map.title || mapKey
    });

    if (mapUnit) units.push(mapUnit);

    Object.entries(map.nodes || {}).forEach(([nodeKey, node]) => {
      const unit = makeUnit({
        source,
        groupKey: mapKey,
        groupLabel: map.title || mapKey,
        entityKey: `${mapKey}.nodes.${nodeKey}`,
        value: node,
        titleFallback: nodeKey
      });

      if (unit) units.push(unit);
    });

    return units;
  });
}

function extractMainMap(source, config) {
  return Object.entries(config.MAIN_MAP_INTERACTIONS || {}).flatMap(
    ([mapKey, interactions]) =>
      Object.entries(interactions || {})
        .map(([nodeKey, interaction]) =>
          makeUnit({
            source,
            groupKey: mapKey,
            groupLabel: `Mappa ${mapKey}`,
            entityKey: `${mapKey}.${nodeKey}`,
            value: interaction,
            titleFallback: interaction.interactionKey || `Nodo ${nodeKey}`
          })
        )
        .filter(Boolean)
  );
}

const units = sources.flatMap((source) => {
  const config = loadConfig(source);

  if (source.id === "map_objects") {
    return extractMapObjects(source, config);
  }

  if (source.id === "mini_maps") {
    return extractMiniMaps(source, config);
  }

  return extractMainMap(source, config);
});

units.sort((a, b) => {
  return (
    a.sourceLabel.localeCompare(b.sourceLabel, "it") ||
    a.groupLabel.localeCompare(b.groupLabel, "it") ||
    a.title.localeCompare(b.title, "it")
  );
});

const catalog = {
  generatedAt: new Date().toISOString(),
  gameRoot: path.basename(gameRoot),
  sources: sources.map(({ id, label, file }) => ({ id, label, file })),
  unitCount: units.length,
  textCount: units.reduce((total, unit) => total + unit.fields.length, 0),
  units
};

const output = `// File generato automaticamente. Non modificare a mano.
window.AbissoQuestTextCatalog = ${JSON.stringify(catalog, null, 2)};
`;

const outputPath = path.join(authorRoot, "quest-text-catalog.js");
fs.writeFileSync(outputPath, output, "utf8");

console.log(
  `Catalogo creato: ${catalog.unitCount} elementi, ${catalog.textCount} campi testuali.`
);
