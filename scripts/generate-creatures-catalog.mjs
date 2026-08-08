import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const defaultSourcePath = path.resolve(
  "C:/Users/Utente/Desktop/inserimento giocatori lidia/creatures-data.js"
);
const sourcePath = process.argv[2]
  ? path.resolve(process.argv[2])
  : defaultSourcePath;
const outputPath = path.resolve("author-creatures-catalog.js");
const source = fs.readFileSync(sourcePath, "utf8");

function slug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function normalizeImageUrl(imagePath) {
  const cleanPath = String(imagePath || "").trim();

  if (!cleanPath) return "";
  if (/^https?:\/\//i.test(cleanPath)) return cleanPath;

  return `https://assets.abissoinfinito.it/${cleanPath.replace(/^\/+/, "")}`;
}

function cleanText(value) {
  const text = String(value || "").trim();

  if (!/[ÃÂâ]/.test(text)) {
    return text;
  }

  try {
    return Buffer.from(text, "latin1").toString("utf8");
  } catch (_error) {
    return text;
  }
}

const context = {
  window: {}
};

vm.createContext(context);
vm.runInContext(source, context, {
  filename: path.basename(sourcePath)
});

const rawCreatures = context.window.AbissoCreaturesCatalog;

if (!Array.isArray(rawCreatures)) {
  throw new Error("window.AbissoCreaturesCatalog non trovato o non valido.");
}

const creatures = rawCreatures.map((creature) => {
  const creatureId = slug(creature.name);

  return {
    textKey: `creature:${creatureId}`,
    creatureId,
    name: cleanText(creature.name || creatureId),
    element: cleanText(creature.element),
    nature: cleanText(creature.nature),
    category: cleanText(creature.category),
    vehicles: Array.isArray(creature.vehicles)
      ? creature.vehicles.map((vehicle) => cleanText(vehicle)).filter(Boolean)
      : [],
    image: cleanText(creature.image),
    imageUrl: normalizeImageUrl(creature.image),
    provisionalText: cleanText(creature.reason)
  };
});

const elements = [...new Set(creatures.map((creature) => creature.element).filter(Boolean))]
  .sort((a, b) => a.localeCompare(b, "it-IT", { sensitivity: "base" }));

const catalog = {
  sourceFile: path.basename(sourcePath),
  generatedAt: new Date().toISOString(),
  creatureCount: creatures.length,
  elements,
  creatures
};

const output = `// author-creatures-catalog.js
// Generato da scripts/generate-creatures-catalog.mjs.

window.AuthorCreaturesCatalog = ${JSON.stringify(catalog, null, 2)};
`;

fs.writeFileSync(outputPath, output, "utf8");

console.log(
  `Catalogo creature generato: ${creatures.length} creature -> ${outputPath}`
);
