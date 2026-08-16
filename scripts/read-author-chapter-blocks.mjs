import fs from "node:fs";
import { fileURLToPath } from "node:url";

export function parseAuthorChapterBlocksSql(source) {
  const marker = " VALUES ";
  let index = source.indexOf(marker);
  if (index < 0) throw new Error("Clausola VALUES non trovata");
  index += marker.length;

  const rows = [];
  const skipWhitespace = () => {
    while (/\s/.test(source[index] || "")) index += 1;
  };

  const readValue = () => {
    skipWhitespace();
    if (source[index] === "'") {
      index += 1;
      let value = "";
      while (index < source.length) {
        if (source[index] === "'" && source[index + 1] === "'") {
          value += "'";
          index += 2;
        } else if (source[index] === "'") {
          index += 1;
          return value;
        } else {
          value += source[index];
          index += 1;
        }
      }
      throw new Error("Stringa SQL non terminata");
    }

    const start = index;
    while (index < source.length && source[index] !== "," && source[index] !== ")") {
      index += 1;
    }
    const raw = source.slice(start, index).trim();
    if (/^null$/i.test(raw)) return null;
    if (/^-?\d+$/.test(raw)) return Number(raw);
    return raw;
  };

  while (index < source.length) {
    skipWhitespace();
    if (source[index] === ";") break;
    if (source[index] === ",") {
      index += 1;
      continue;
    }
    if (source[index] !== "(") throw new Error(`Tupla attesa alla posizione ${index}`);
    index += 1;

    const values = [];
    while (index < source.length) {
      values.push(readValue());
      skipWhitespace();
      if (source[index] === ",") {
        index += 1;
      } else if (source[index] === ")") {
        index += 1;
        break;
      } else {
        throw new Error(`Separatore inatteso alla posizione ${index}`);
      }
    }

    if (values.length !== 9) throw new Error(`Riga con ${values.length} valori invece di 9`);
    rows.push({
      id: values[0],
      chapter_key: values[1],
      block_key: values[2],
      block_index: values[3],
      block_title: values[4],
      official_type: values[5],
      content: values[6],
      updated_by: values[7],
      updated_at: values[8]
    });
  }

  return rows;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const path = process.argv[2] || "data/author_chapter_blocks_rows.sql";
  const rows = parseAuthorChapterBlocksSql(fs.readFileSync(path, "utf8"));
  console.log(JSON.stringify(rows, null, 2));
}
