import fs from "node:fs";
import path from "node:path";

const GAME_ROOT = "C:/Users/Utente/Desktop/abissoinfinito app refactor";
const outputPath = path.resolve("author-modal-texts-catalog.js");

const modalSources = [
  {
    modalId: "market_food",
    modalLabel: "Banco del Cibo",
    category: "Mercati",
    sourcePath: path.resolve(GAME_ROOT, "dashboard/market-food-modal.html"),
    textExtractors: [
      {
        fieldKey: "document_title",
        fieldLabel: "Titolo documento",
        textType: "title",
        pattern: /<title>([\s\S]*?)<\/title>/i
      },
      {
        fieldKey: "header_title",
        fieldLabel: "Titolo header",
        textType: "heading",
        pattern: /<h1>([\s\S]*?)<\/h1>/i
      },
      {
        fieldKey: "header_description",
        fieldLabel: "Descrizione header",
        textType: "description",
        pattern: /<h1>[\s\S]*?<\/h1>\s*<p>([\s\S]*?)<\/p>/i
      },
      {
        fieldKey: "loading_text",
        fieldLabel: "Testo caricamento",
        textType: "status",
        pattern: /<div\s+id="loadingText"[\s\S]*?>([\s\S]*?)<\/div>/i
      },
      {
        fieldKey: "default_status",
        fieldLabel: "Stato iniziale",
        textType: "status",
        pattern: /"(Scegli una pietanza\. Le scorte sono condivise con[\s\S]*?sessione\.)"/i
      },
      {
        fieldKey: "load_error_empty",
        fieldLabel: "Messaggio errore caricamento",
        textType: "empty",
        pattern: /gridEl\.innerHTML\s*=\s*`\s*<div class="empty">\s*([\s\S]*?Impossibile caricare il Banco del Cibo\.)\s*<\/div>/i
      }
    ]
  },
  {
    modalId: "barracks",
    modalLabel: "Caserma del Regno",
    category: "Regno",
    sourcePath: path.resolve(GAME_ROOT, "dashboard/barracks-modal.html"),
    textExtractors: [
      {
        fieldKey: "document_title",
        fieldLabel: "Titolo documento",
        textType: "title",
        pattern: /<title>([\s\S]*?)<\/title>/i
      },
      {
        fieldKey: "header_title",
        fieldLabel: "Titolo header",
        textType: "heading",
        pattern: /<h1>([\s\S]*?)<\/h1>/i
      },
      {
        fieldKey: "header_description",
        fieldLabel: "Descrizione header",
        textType: "description",
        pattern: /<p class="subtitle">([\s\S]*?)<\/p>/i
      },
      {
        fieldKey: "loading_status",
        fieldLabel: "Stato caricamento",
        textType: "status",
        pattern: /setStatus\("([^"]*Caricamento Caserma del Regno[^"]*)"\)/i
      },
      {
        fieldKey: "ready_status",
        fieldLabel: "Stato pronto",
        textType: "status",
        pattern: /\?\s*"([^"]*Caserma pronta a ricevere ordini[^"]*)"/i
      },
      {
        fieldKey: "command_requirements",
        fieldLabel: "Requisiti comando",
        textType: "description",
        pattern: /<p class="desc" style="margin-top:12px;">([\s\S]*?)<\/p>/i
      }
    ]
  },
  {
    modalId: "cards",
    modalLabel: "Carte Speciali",
    category: "Destino",
    sourcePath: path.resolve(GAME_ROOT, "dashboard/cards-modal.html"),
    textExtractors: [
      {
        fieldKey: "document_title",
        fieldLabel: "Titolo documento",
        textType: "title",
        pattern: /<title>([\s\S]*?)<\/title>/i
      },
      {
        fieldKey: "header_title",
        fieldLabel: "Titolo header",
        textType: "heading",
        pattern: /<h1>([\s\S]*?)<\/h1>/i
      },
      {
        fieldKey: "header_description",
        fieldLabel: "Descrizione header",
        textType: "description",
        pattern: /<p class="subtitle">([\s\S]*?)<\/p>/i
      },
      {
        fieldKey: "empty_cards",
        fieldLabel: "Messaggio nessuna carta",
        textType: "empty",
        pattern: /<div class="empty-state">\s*([\s\S]*?inizializzare le carte\.)\s*<\/div>/i
      }
    ]
  },
  {
    modalId: "environment_effects",
    modalLabel: "Effetti Ambientali dell'Abisso",
    category: "Ambiente",
    sourcePath: path.resolve(GAME_ROOT, "dashboard/environment-effects-modal.html"),
    textExtractors: [
      {
        fieldKey: "document_title",
        fieldLabel: "Titolo documento",
        textType: "title",
        pattern: /<title>([\s\S]*?)<\/title>/i
      },
      {
        fieldKey: "header_title",
        fieldLabel: "Titolo header",
        textType: "heading",
        pattern: /<h1>([\s\S]*?)<\/h1>/i
      },
      {
        fieldKey: "header_description",
        fieldLabel: "Descrizione header",
        textType: "description",
        pattern: /<header class="environment-header">[\s\S]*?<h1>[\s\S]*?<\/h1>\s*<p>([\s\S]*?)<\/p>/i
      },
      {
        fieldKey: "current_effect_label",
        fieldLabel: "Etichetta effetto corrente",
        textType: "label",
        pattern: /<div class="environment-active-title">\s*([\s\S]*?)\s*<\/div>/i
      },
      {
        fieldKey: "loading_status",
        fieldLabel: "Stato caricamento",
        textType: "status",
        pattern: /<div\s+id="activeEffectValue"[\s\S]*?>\s*([\s\S]*?Caricamento[\s\S]*?)\s*<\/div>/i
      },
      {
        fieldKey: "no_active_effect",
        fieldLabel: "Descrizione nessun effetto",
        textType: "empty",
        pattern: /activeEffectDescriptionEl\.textContent\s*=\s*"([^"]*territorio[^"]*)"/i
      },
      {
        fieldKey: "migration_note",
        fieldLabel: "Nota migrazione",
        textType: "description",
        pattern: /<section class="migration-note">\s*([\s\S]*?)<\/section>/i
      }
    ]
  }
];

const foodSources = [
  {
    modalId: "market_food",
    modalLabel: "Banco del Cibo",
    category: "Mercati",
    sourcePath: path.resolve(GAME_ROOT, "app/cibo.html"),
    sourceFile: "cibo.html"
  }
];

const barracksUnitSources = [
  {
    modalId: "barracks",
    modalLabel: "Caserma del Regno",
    category: "Regno",
    sourcePath: path.resolve(GAME_ROOT, "dashboard/barracks-modal.html"),
    sourceFile: "barracks-modal.html"
  }
];

const specialCardSources = [
  {
    modalId: "cards",
    modalLabel: "Carte Speciali",
    category: "Destino",
    sourcePath: path.resolve(GAME_ROOT, "dashboard/cards-modal.html"),
    sourceFile: "cards-modal.html"
  }
];

const environmentEffectSources = [
  {
    modalId: "environment_effects",
    modalLabel: "Effetti Ambientali dell'Abisso",
    category: "Ambiente",
    sourcePath: path.resolve(GAME_ROOT, "dashboard/js/services/world-environment-service.js"),
    sourceFile: "world-environment-service.js"
  }
];

function stripTags(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeHtml(value) {
  return String(value || "")
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", "\"")
    .replaceAll("&#039;", "'")
    .replaceAll("&#39;", "'");
}

function cleanText(value) {
  const text = decodeHtml(stripTags(value))
    .replaceAll("🥖", "")
    .replaceAll("â€™", "’")
    .replaceAll("â€˜", "‘")
    .replaceAll("â€œ", "“")
    .replaceAll("â€", "”")
    .replaceAll("â€“", "–")
    .replaceAll("â€”", "—")
    .replaceAll("Ã€", "À")
    .replaceAll("Ãˆ", "È")
    .replaceAll("Ã‰", "É")
    .replaceAll("Ã¬", "ì")
    .replaceAll("Ã²", "ò")
    .replaceAll("Ã¹", "ù")
    .replaceAll("Ã ", "à")
    .replaceAll("Ã¨", "è")
    .replaceAll("Ã©", "é")
    .replace(/\s+/g, " ")
    .trim();

  if (!/[ÃƒÃ‚Ã¢]/.test(text)) {
    return text;
  }

  try {
    return Buffer.from(text, "latin1").toString("utf8");
  } catch (_error) {
    return text;
  }
}

function extractText(source, extractor) {
  const match = source.match(extractor.pattern);
  if (!match) return "";

  return cleanText(match[1] || match[0] || "");
}

function normalizeImageUrl(imagePath) {
  const cleanPath = cleanText(imagePath);

  if (!cleanPath) return "";
  if (/^https?:\/\//i.test(cleanPath)) return cleanPath;

  return `https://assets.abissoinfinito.it/${cleanPath.replace(/^\/+/, "")}`;
}

function extractBalancedObject(source, declarationName) {
  const declarationIndex = source.indexOf(`const ${declarationName} =`);
  if (declarationIndex < 0) return "";

  const objectStart = source.indexOf("{", declarationIndex);
  if (objectStart < 0) return "";

  let depth = 0;
  let quote = "";
  let escaped = false;

  for (let index = objectStart; index < source.length; index += 1) {
    const char = source[index];

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        quote = "";
      }

      continue;
    }

    if (char === "\"" || char === "'" || char === "`") {
      quote = char;
      continue;
    }

    if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;

      if (depth === 0) {
        return source.slice(objectStart, index + 1);
      }
    }
  }

  return "";
}

function extractFunctionConstObject(source, functionName, constName) {
  const functionIndex = source.indexOf(`function ${functionName}`);
  if (functionIndex < 0) return "";

  const declarationIndex = source.indexOf(`const ${constName} =`, functionIndex);
  if (declarationIndex < 0) return "";

  const objectStart = source.indexOf("{", declarationIndex);
  if (objectStart < 0) return "";

  let depth = 0;
  let quote = "";
  let escaped = false;

  for (let index = objectStart; index < source.length; index += 1) {
    const char = source[index];

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        quote = "";
      }

      continue;
    }

    if (char === "\"" || char === "'" || char === "`") {
      quote = char;
      continue;
    }

    if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;

      if (depth === 0) {
        return source.slice(objectStart, index + 1);
      }
    }
  }

  return "";
}

function extractFoodImages(source) {
  const images = new Map();
  const cardPattern =
    /<div class="cibo-card" id="([^"]+)">[\s\S]*?<img src="([^"]+)"/g;
  let match = null;

  while ((match = cardPattern.exec(source))) {
    images.set(cleanText(match[1]), cleanText(match[2]));
  }

  return images;
}

function parseFoodCatalog(source) {
  const objectSource = extractBalancedObject(source, "cibo");
  if (!objectSource) return [];

  const cibo = Function(`"use strict"; return (${objectSource});`)();
  const images = extractFoodImages(source);

  return Object.entries(cibo).map(([foodKey, item]) => {
    const image = images.get(foodKey) || `img/${foodKey}.webp`;
    const incremento = item.incremento && typeof item.incremento === "object"
      ? {
          fame: Number(item.incremento.fame || 0),
          salute: Number(item.incremento.salute || 0),
          stamina: Number(item.incremento.stamina || 0),
          forza: Number(item.incremento.forza || 0)
        }
      : {};

    return {
      foodKey,
      foodName: cleanText(item.nome || foodKey),
      description: cleanText(item.descrizione),
      image,
      imageUrl: normalizeImageUrl(image),
      cost: Number(item.costo || 0),
      incremento
    };
  });
}

function parseBarracksUnits(source) {
  const defsSource = extractBalancedObject(source, "UNIT_DEFS");
  if (!defsSource) return [];

  const costSource = extractFunctionConstObject(source, "materialCostByUnit", "map");
  const trainingSource = extractFunctionConstObject(source, "trainingMsPerUnit", "map");
  const unitDefs = Function(`"use strict"; return (${defsSource});`)();
  const materialCosts = costSource
    ? Function(`"use strict"; return (${costSource});`)()
    : {};
  const trainingMs = trainingSource
    ? Function(`"use strict"; return (${trainingSource});`)()
    : {};

  return Object.entries(unitDefs).map(([unitKey, unit]) => {
    const power = Number(unit.power || 0);
    const level = Number(unit.level || 1);
    const materialCost = materialCosts[unitKey] || {};
    const durationMs = Number(trainingMs[unitKey] || 90000);
    const coinCost = power * 150;

    return {
      unitKey,
      unitName: cleanText(unit.name || unitKey),
      level,
      power,
      coinCost,
      materialCost,
      durationMs,
      description: [
        `${cleanText(unit.name || unitKey)} è una unità della Caserma del Regno.`,
        `Si sblocca al livello ${level}, ha potenza ${power}, costa ${coinCost} monete e richiede ${formatPlainCost(materialCost)}.`,
        `Tempo base di addestramento: ${formatPlainDuration(durationMs)}.`
      ].join(" ")
    };
  });
}

function parseSpecialCardsCatalog(source) {
  const playersSource = extractBalancedObject(source, "playersIndex");
  const cardsSource = extractBalancedObject(source, "specialCardsByPlayer");

  if (!cardsSource) return [];

  const playersIndex = playersSource
    ? Function(`"use strict"; return (${playersSource});`)()
    : {};
  const cardsByPlayer = Function(`"use strict"; return (${cardsSource});`)();
  const cards = [];

  for (const [playerKey, playerCards] of Object.entries(cardsByPlayer)) {
    const playerLabel = cleanText(playersIndex[playerKey]?.nome || playerKey);

    for (const [index, card] of (playerCards || []).entries()) {
      const attribute = cleanText(card.attributo || "");
      const title = cleanText(card.descrizione || "Carta Speciale");
      const feature = cleanText(card.caratteristica || "");
      const image = cleanText(card.image || "");

      cards.push({
        playerKey,
        playerLabel,
        cardIndex: index,
        cardKey: `${playerKey}:${attribute || index}`,
        title,
        feature,
        attribute,
        usesLeft: Number(card.usesLeft || 0),
        purifyPct: Number(card.purifyPct || 0),
        image,
        imageUrl: normalizeImageUrl(image)
      });
    }
  }

  return cards;
}

function parseEnvironmentEffectsCatalog(source) {
  const effectsSource = extractBalancedObject(source, "ENVIRONMENT_EFFECTS");
  if (!effectsSource) return [];

  const effects = Function(`"use strict"; return (${effectsSource});`)();

  return Object.values(effects).map((effect) => ({
    effectKey: cleanText(effect.key || ""),
    legacyKey: cleanText(effect.legacyKey || ""),
    label: cleanText(effect.label || effect.key || "Effetto ambientale"),
    description: cleanText(effect.description || ""),
    image: cleanText(effect.imageUrl || ""),
    imageUrl: normalizeImageUrl(effect.imageUrl || ""),
    overlayImageUrl: normalizeImageUrl(effect.overlayImageUrl || ""),
    icon: cleanText(effect.icon || ""),
    percentage: Number(effect.percentage || 0),
    attributesAffected: Array.isArray(effect.attributesAffected)
      ? effect.attributesAffected.map((attribute) => cleanText(attribute))
      : [],
    modifiers: effect.modifiers || {},
    visualMode: cleanText(effect.visualMode || ""),
    enterDurationMs: Number(effect.enterDurationMs || 0),
    exitDurationMs: Number(effect.exitDurationMs || 0)
  }));
}

function formatPlainCost(cost = {}) {
  const entries = Object.entries(cost || {});

  if (!entries.length) return "nessun materiale";

  return entries
    .map(([key, value]) => `${Number(value || 0)} ${key}`)
    .join(", ");
}

function formatPlainDuration(milliseconds = 0) {
  const totalSeconds = Math.max(0, Math.ceil(Number(milliseconds || 0) / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes && seconds) return `${minutes} min ${seconds} sec`;
  if (minutes) return `${minutes} min`;
  return `${seconds} sec`;
}

const units = [];

for (const modal of modalSources) {
  const source = fs.readFileSync(modal.sourcePath, "utf8");
  const sourceFile = path.basename(modal.sourcePath);

  for (const extractor of modal.textExtractors) {
    const provisionalText = extractText(source, extractor);

    if (!provisionalText) continue;

    units.push({
      textKey: `modal:${modal.modalId}:${extractor.fieldKey}`,
      modalId: modal.modalId,
      modalLabel: modal.modalLabel,
      category: modal.category,
      sourceFile,
      sourcePath: modal.sourcePath,
      fieldKey: extractor.fieldKey,
      fieldLabel: extractor.fieldLabel,
      textType: extractor.textType,
      provisionalText
    });
  }
}

for (const sourceConfig of foodSources) {
  const source = fs.readFileSync(sourceConfig.sourcePath, "utf8");
  const foods = parseFoodCatalog(source);

  for (const food of foods) {
    units.push({
      textKey: `modal:${sourceConfig.modalId}:food:${food.foodKey}:description`,
      modalId: sourceConfig.modalId,
      modalLabel: sourceConfig.modalLabel,
      category: sourceConfig.category,
      sourceFile: sourceConfig.sourceFile,
      sourcePath: sourceConfig.sourcePath,
      fieldKey: `food:${food.foodKey}:description`,
      fieldLabel: `Descrizione pietanza: ${food.foodName}`,
      textType: "food_description",
      itemKey: food.foodKey,
      itemLabel: food.foodName,
      image: food.image,
      imageUrl: food.imageUrl,
      metadata: {
        cost: food.cost,
        incremento: food.incremento
      },
      provisionalText: food.description
    });
  }
}

for (const sourceConfig of barracksUnitSources) {
  const source = fs.readFileSync(sourceConfig.sourcePath, "utf8");
  const soldiers = parseBarracksUnits(source);

  for (const soldier of soldiers) {
    units.push({
      textKey: `modal:${sourceConfig.modalId}:soldier:${soldier.unitKey}:description`,
      modalId: sourceConfig.modalId,
      modalLabel: sourceConfig.modalLabel,
      category: sourceConfig.category,
      sourceFile: sourceConfig.sourceFile,
      sourcePath: sourceConfig.sourcePath,
      fieldKey: `soldier:${soldier.unitKey}:description`,
      fieldLabel: `Descrizione soldato: ${soldier.unitName}`,
      textType: "soldier_description",
      itemKey: soldier.unitKey,
      itemLabel: soldier.unitName,
      metadata: {
        level: soldier.level,
        power: soldier.power,
        coinCost: soldier.coinCost,
        materialCost: soldier.materialCost,
        durationMs: soldier.durationMs
      },
      provisionalText: soldier.description
    });
  }
}

for (const sourceConfig of specialCardSources) {
  const source = fs.readFileSync(sourceConfig.sourcePath, "utf8");
  const cards = parseSpecialCardsCatalog(source);

  for (const card of cards) {
    units.push({
      textKey: `modal:${sourceConfig.modalId}:card:${card.playerKey}:${card.attribute}:description`,
      modalId: sourceConfig.modalId,
      modalLabel: sourceConfig.modalLabel,
      category: sourceConfig.category,
      sourceFile: sourceConfig.sourceFile,
      sourcePath: sourceConfig.sourcePath,
      fieldKey: `card:${card.playerKey}:${card.attribute}:description`,
      fieldLabel: `Descrizione carta: ${card.title}`,
      textType: "card_description",
      itemKey: card.cardKey,
      itemLabel: card.title,
      image: card.image,
      imageUrl: card.imageUrl,
      metadata: {
        playerKey: card.playerKey,
        playerLabel: card.playerLabel,
        cardIndex: card.cardIndex,
        attribute: card.attribute,
        usesLeft: card.usesLeft,
        purifyPct: card.purifyPct
      },
      provisionalText: card.feature
    });
  }
}

for (const sourceConfig of environmentEffectSources) {
  const source = fs.readFileSync(sourceConfig.sourcePath, "utf8");
  const effects = parseEnvironmentEffectsCatalog(source);

  for (const effect of effects) {
    units.push({
      textKey: `modal:${sourceConfig.modalId}:environment_effect:${effect.effectKey}:description`,
      modalId: sourceConfig.modalId,
      modalLabel: sourceConfig.modalLabel,
      category: sourceConfig.category,
      sourceFile: sourceConfig.sourceFile,
      sourcePath: sourceConfig.sourcePath,
      fieldKey: `environment_effect:${effect.effectKey}:description`,
      fieldLabel: `Descrizione effetto ambientale: ${effect.label}`,
      textType: "environment_effect_description",
      itemKey: effect.effectKey,
      itemLabel: effect.label,
      image: effect.image,
      imageUrl: effect.imageUrl,
      metadata: {
        legacyKey: effect.legacyKey,
        icon: effect.icon,
        overlayImageUrl: effect.overlayImageUrl,
        percentage: effect.percentage,
        attributesAffected: effect.attributesAffected,
        modifiers: effect.modifiers,
        visualMode: effect.visualMode,
        enterDurationMs: effect.enterDurationMs,
        exitDurationMs: effect.exitDurationMs
      },
      provisionalText: effect.description
    });
  }
}

const modals = modalSources.map((modal) => ({
  id: modal.modalId,
  label: modal.modalLabel,
  category: modal.category,
  sourceFile: path.basename(modal.sourcePath),
  textCount: units.filter((unit) => unit.modalId === modal.modalId).length
}));

const categories = [...new Set(modals.map((modal) => modal.category))]
  .filter(Boolean)
  .sort((a, b) => a.localeCompare(b, "it-IT", { sensitivity: "base" }));

const catalog = {
  generatedAt: new Date().toISOString(),
  modalCount: modals.length,
  textCount: units.length,
  categories,
  modals,
  units
};

const output = `// author-modal-texts-catalog.js
// Generato da scripts/generate-modal-texts-catalog.mjs.

window.AuthorModalTextsCatalog = ${JSON.stringify(catalog, null, 2)};
`;

fs.writeFileSync(outputPath, output, "utf8");

console.log(
  `Catalogo testi modali generato: ${units.length} testi da ${modals.length} modali -> ${outputPath}`
);
