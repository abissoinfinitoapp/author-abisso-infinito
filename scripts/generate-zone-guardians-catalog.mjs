import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const defaultSourcePath = path.resolve(
  "C:/Users/Utente/Desktop/abissoinfinito app refactor/dashboard/js/config/maps-config.js"
);
const sourcePath = process.argv[2]
  ? path.resolve(process.argv[2])
  : defaultSourcePath;
const outputPath = path.resolve("author-zone-guardians-catalog.js");
const source = fs.readFileSync(sourcePath, "utf8");

function cleanText(value) {
  const text = String(value || "")
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

function slug(value) {
  return cleanText(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function normalizeImageUrl(imagePath) {
  const cleanPath = cleanText(imagePath);

  if (!cleanPath) return "";
  if (/^https?:\/\//i.test(cleanPath)) return cleanPath;

  return `https://assets.abissoinfinito.it/${cleanPath.replace(/^\/+/, "")}`;
}

function buildProvisionalText(guardian) {
  const existingText = [
    guardian.description,
    guardian.guardianDescription,
    guardian.lore,
    guardian.quickTip
  ].find((value) => cleanText(value));

  if (existingText) {
    return cleanText(existingText);
  }

  const fullName = cleanText(guardian.guardianFullName || guardian.guardianName);
  const zoneLabel = cleanText(guardian.zoneLabel);
  const title = cleanText(guardian.guardianTitle);

  return [
    `${fullName} presidia ${zoneLabel}.`,
    title
      ? `Come ${title}, definisce la soglia narrativa e meccanica della conquista della zona.`
      : "Definisce la soglia narrativa e meccanica della conquista della zona."
  ].join(" ");
}

const context = {
  window: {},
  console: {
    warn() {},
    error() {},
    log() {}
  }
};

vm.createContext(context);
vm.runInContext(source, context, {
  filename: path.basename(sourcePath)
});

const rawGuardians =
  context.window.AbissoMapsConfig?.CONQUERABLE_ZONE_GUARDIANS;

if (!rawGuardians || typeof rawGuardians !== "object") {
  throw new Error(
    "window.AbissoMapsConfig.CONQUERABLE_ZONE_GUARDIANS non trovato o non valido."
  );
}

const guardians = Object.entries(rawGuardians).flatMap(
  ([mapKey, zones]) => {
    return Object.entries(zones || {}).map(([zoneKey, guardian]) => {
      const normalizedMapKey = cleanText(guardian.mapKey || mapKey);
      const normalizedZoneKey = cleanText(guardian.zoneKey || zoneKey);
      const guardianKey = cleanText(
        guardian.guardianKey || slug(guardian.guardianName)
      );

      return {
        textKey: `zone_guardian:${normalizedMapKey}:${normalizedZoneKey}:${guardianKey}`,
        sourceFile: path.basename(sourcePath),
        mapKey: normalizedMapKey,
        zoneKey: normalizedZoneKey,
        zoneLabel: cleanText(guardian.zoneLabel || normalizedZoneKey),
        guardianKey,
        guardianName: cleanText(guardian.guardianName || guardianKey),
        guardianTitle: cleanText(guardian.guardianTitle),
        guardianFullName: cleanText(
          guardian.guardianFullName || guardian.guardianName || guardianKey
        ),
        image: cleanText(guardian.image),
        imageUrl: normalizeImageUrl(guardian.image),
        conquerable: Boolean(guardian.conquerable),
        armyAllowed: Boolean(guardian.armyAllowed),
        prestigeEnabled: Boolean(guardian.prestigeEnabled),
        provisionalText: buildProvisionalText(guardian)
      };
    });
  }
).sort((a, b) => {
  const mapCompare = a.mapKey.localeCompare(b.mapKey, "it-IT", {
    sensitivity: "base",
    numeric: true
  });

  if (mapCompare !== 0) return mapCompare;

  return a.zoneLabel.localeCompare(b.zoneLabel, "it-IT", {
    sensitivity: "base",
    numeric: true
  });
});

const maps = [...new Set(guardians.map((guardian) => guardian.mapKey))]
  .filter(Boolean)
  .sort((a, b) => a.localeCompare(b, "it-IT", { sensitivity: "base" }));

const catalog = {
  sourceFile: path.basename(sourcePath),
  generatedAt: new Date().toISOString(),
  guardianCount: guardians.length,
  maps,
  guardians
};

const output = `// author-zone-guardians-catalog.js
// Generato da scripts/generate-zone-guardians-catalog.mjs.

window.AuthorZoneGuardiansCatalog = ${JSON.stringify(catalog, null, 2)};
`;

fs.writeFileSync(outputPath, output, "utf8");

console.log(
  `Catalogo guardiani zone generato: ${guardians.length} guardiani -> ${outputPath}`
);
