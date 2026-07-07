import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const defaultSourcePath = path.resolve(
  "C:/Users/Utente/Desktop/abissoinfinito app refactor/app/armi.html"
);
const sourcePath = process.argv[2]
  ? path.resolve(process.argv[2])
  : defaultSourcePath;
const outputPath = path.resolve("author-weapons-catalog.js");
const source = fs.readFileSync(sourcePath, "utf8");

function findMatchingBracket(text, startIndex) {
  let depth = 0;
  let quote = "";
  let escaped = false;

  for (let index = startIndex; index < text.length; index += 1) {
    const char = text[index];

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

    if (char === "[") {
      depth += 1;
    } else if (char === "]") {
      depth -= 1;

      if (depth === 0) {
        return index;
      }
    }
  }

  throw new Error(`Array non chiuso a partire da ${startIndex}`);
}

function titleFromKey(key) {
  return String(key || "")
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toLocaleUpperCase("it-IT") + part.slice(1))
    .join(" ");
}

function getTierForMastery(mastery) {
  const value = Number(mastery || 1);

  if (value >= 8) return "legend";
  if (value >= 5) return "epic";
  if (value >= 3) return "rare";

  return "common";
}

function normalizeImageUrl(imagePath) {
  const cleanPath = String(imagePath || "").trim();

  if (!cleanPath) return "";
  if (/^https?:\/\//i.test(cleanPath)) return cleanPath;

  return `https://assets.abissoinfinito.it/${cleanPath.replace(/^\/+/, "")}`;
}

const arrayByVar = new Map();
const arrayRegex = /const\s+(weaponsFor[A-Za-z0-9_]+)\s*=\s*\[/g;
let match;

while ((match = arrayRegex.exec(source)) !== null) {
  const varName = match[1];
  const arrayStart = source.indexOf("[", match.index);
  const arrayEnd = findMatchingBracket(source, arrayStart);
  const arraySource = source.slice(arrayStart, arrayEnd + 1);
  const value = vm.runInNewContext(`(${arraySource})`, {}, {
    filename: `${path.basename(sourcePath)}:${varName}`
  });

  arrayByVar.set(varName, Array.isArray(value) ? value : []);
  arrayRegex.lastIndex = arrayEnd + 1;
}

const mappingSourceMatch = source.match(
  /const\s+playerWeaponsMapping\s*=\s*\{([\s\S]*?)\};/
);

if (!mappingSourceMatch) {
  throw new Error("Mappatura playerWeaponsMapping non trovata.");
}

const mappingEntries = [...mappingSourceMatch[1].matchAll(
  /([A-Za-z0-9_]+)\s*:\s*(weaponsFor[A-Za-z0-9_]+)/g
)];

const characters = mappingEntries.map((entry) => {
  const [, characterKey, varName] = entry;
  const weapons = arrayByVar.get(varName) || [];

  return {
    key: characterKey,
    label: titleFromKey(characterKey),
    weaponCount: weapons.length
  };
});

const weapons = mappingEntries.flatMap((entry) => {
  const [, characterKey, varName] = entry;
  const characterLabel = titleFromKey(characterKey);
  const weaponList = arrayByVar.get(varName) || [];

  return weaponList.map((weapon, index) => {
    const weaponId = String(weapon.id || weapon.nome || `weapon_${index + 1}`)
      .trim();

    return {
      textKey: `${characterKey}:${weaponId}`,
      characterKey,
      characterLabel,
      weaponId,
      name: String(weapon.nome || weaponId),
      mastery: Number(weapon.mastery || 1),
      tier: getTierForMastery(weapon.mastery),
      cost: Number(weapon.costo || 0),
      image: String(weapon.image || ""),
      imageUrl: normalizeImageUrl(weapon.image),
      provisionalText: String(weapon.descrizione || "").trim(),
      increment: weapon.increment && typeof weapon.increment === "object"
        ? weapon.increment
        : {}
    };
  });
});

const catalog = {
  sourceFile: path.basename(sourcePath),
  generatedAt: new Date().toISOString(),
  characterCount: characters.length,
  weaponCount: weapons.length,
  characters,
  weapons
};

const output = `// author-weapons-catalog.js
// Generato da scripts/generate-weapon-catalog.mjs.

window.AuthorWeaponsCatalog = ${JSON.stringify(catalog, null, 2)};
`;

fs.writeFileSync(outputPath, output, "utf8");

console.log(
  `Catalogo armi generato: ${weapons.length} armi, ${characters.length} personaggi -> ${outputPath}`
);
