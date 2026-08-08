import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const defaultSourcePath = path.resolve(
  "C:/Users/Utente/Desktop/abissoinfinito app refactor/dashboard/js/config/fragments-config.js"
);
const sourcePath = process.argv[2]
  ? path.resolve(process.argv[2])
  : defaultSourcePath;
const outputPath = path.resolve("author-fragments-catalog.js");
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

function normalizeImageUrl(imagePath) {
  const cleanPath = cleanText(imagePath);

  if (!cleanPath) return "";
  if (/^https?:\/\//i.test(cleanPath)) return cleanPath;

  return `https://assets.abissoinfinito.it/${cleanPath.replace(/^\/+/, "")}`;
}

function labelFromKey(value) {
  return cleanText(value)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toLocaleUpperCase("it-IT"));
}

const context = {
  console: {
    warn() {},
    error() {},
    log() {}
  }
};

vm.createContext(context);
vm.runInContext(`${source}\nthis.__BEL_FRAGMENTS_CONFIG__ = BEL_FRAGMENTS_CONFIG;`, context, {
  filename: path.basename(sourcePath)
});

const rawFragments = context.__BEL_FRAGMENTS_CONFIG__;

if (!rawFragments || typeof rawFragments !== "object") {
  throw new Error("BEL_FRAGMENTS_CONFIG non trovato o non valido.");
}

const fragments = Object.entries(rawFragments).map(([key, fragment]) => {
  const fragmentId = cleanText(fragment.id || key);
  const rewards = fragment.rewards && typeof fragment.rewards === "object"
    ? {
        anima: Number(fragment.rewards.anima || 0),
        corruzioneReduction: Number(fragment.rewards.corruzioneReduction || 0),
        purificazione: Number(fragment.rewards.purificazione || 0)
      }
    : {};

  return {
    textKey: `fragment:${fragmentId}`,
    sourceFile: path.basename(sourcePath),
    fragmentId,
    fragmentName: cleanText(fragment.nome || labelFromKey(fragmentId)),
    originMonsterId: cleanText(fragment.originMonsterId),
    originType: cleanText(fragment.originType),
    fragmentClass: cleanText(fragment.fragmentClass),
    fragmentClassLabel: labelFromKey(fragment.fragmentClass),
    difficultyTier: cleanText(fragment.difficultyTier),
    difficultyLabel: labelFromKey(fragment.difficultyTier),
    spiritualTier: cleanText(fragment.spiritualTier),
    spiritualLabel: labelFromKey(fragment.spiritualTier),
    image: cleanText(fragment.image),
    imageUrl: normalizeImageUrl(fragment.image),
    rewards,
    provisionalText: cleanText(fragment.description)
  };
}).sort((a, b) => {
  const classCompare = a.fragmentClassLabel.localeCompare(
    b.fragmentClassLabel,
    "it-IT",
    { sensitivity: "base", numeric: true }
  );

  if (classCompare !== 0) return classCompare;

  return a.fragmentName.localeCompare(b.fragmentName, "it-IT", {
    sensitivity: "base",
    numeric: true
  });
});

const classes = [...new Set(fragments.map((fragment) => fragment.fragmentClass))]
  .filter(Boolean)
  .map((key) => ({
    key,
    label: labelFromKey(key),
    count: fragments.filter((fragment) => fragment.fragmentClass === key).length
  }))
  .sort((a, b) => a.label.localeCompare(b.label, "it-IT", { sensitivity: "base" }));

const catalog = {
  sourceFile: path.basename(sourcePath),
  generatedAt: new Date().toISOString(),
  fragmentCount: fragments.length,
  classes,
  fragments
};

const output = `// author-fragments-catalog.js
// Generato da scripts/generate-fragments-catalog.mjs.

window.AuthorFragmentsCatalog = ${JSON.stringify(catalog, null, 2)};
`;

fs.writeFileSync(outputPath, output, "utf8");

console.log(
  `Catalogo echi generato: ${fragments.length} echi -> ${outputPath}`
);
