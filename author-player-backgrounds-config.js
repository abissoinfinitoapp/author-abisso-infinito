// author-player-backgrounds-config.js
// Converte background-dei-giocatori.txt in capitoli autore.
// Mantiene la SECONDA versione di Vornax se nel file esistono due Vornax.

(function initAbissoPlayerBackgroundsConfig() {
  const PLAYER_NAME_TO_KEY = {
    "Xanthor": "xanthor",
    "Vexor": "vexor",
    "Umbrax": "umbrax",
    "Mortax": "mortax",
    "Nocturon": "nocturon",
    "Lupo Mannaro": "lupo",
    "Goblin": "goblin",
    "Arcanista": "arcanista",
    "Psion": "psion",
    "Necromante": "necromante",
    "Vornax": "vornax",
    "Hextor": "hextor",
    "Strega della Luna": "strega_della_luna",
    "Custode della Foresta": "custode_della_foresta",
    "Regina delle Ombre": "regina_delle_ombre",
    "Cacciatrice di Anime": "cacciatrice_di_anime"
  };

  const PLAYER_IMAGE_BY_KEY = {
    xanthor: "https://assets.abissoinfinito.it/img/xanthor.png",
    vexor: "https://assets.abissoinfinito.it/img/vexor.png",
    umbrax: "https://assets.abissoinfinito.it/img/umbrax.png",
    mortax: "https://assets.abissoinfinito.it/img/mortax.png",
    nocturon: "https://assets.abissoinfinito.it/img/nocturon.png",
    lupo: "https://assets.abissoinfinito.it/img/lupo.png",
    goblin: "https://assets.abissoinfinito.it/img/goblin.png",
    arcanista: "https://assets.abissoinfinito.it/img/arcanista.png",
    psion: "https://assets.abissoinfinito.it/img/psion.png",
    necromante: "https://assets.abissoinfinito.it/img/necromante.png",
    vornax: "https://assets.abissoinfinito.it/img/vornax.png",
    hextor: "https://assets.abissoinfinito.it/img/hextor.png",
    strega_della_luna: "https://assets.abissoinfinito.it/img/strega_della_luna.png",
    custode_della_foresta: "https://assets.abissoinfinito.it/img/custode_della_foresta.png",
    regina_delle_ombre: "https://assets.abissoinfinito.it/img/regina_delle_ombre.png",
    cacciatrice_di_anime: "https://assets.abissoinfinito.it/img/cacciatrice_di_anime.png"
  };

  const PLAYER_RELATIONSHIPS = {
    xanthor: [
      {
        label: "Strega della Luna",
        value: "Antichi amanti. Il loro legame nasce prima della corruzione dell’Abisso: una promessa interrotta che può riaccendersi come alleanza, rimorso o scelta dolorosa."
      }
    ],

    strega_della_luna: [
      {
        label: "Xanthor",
        value: "Antichi amanti. Lo conosceva prima che la guerra e l’Abisso deformassero il destino dei guerrieri. Ogni incontro tra loro può diventare memoria, ferita o scelta."
      }
    ],

    hextor: [
      {
        label: "Nocturon",
        value: "Antichi rivali. Si sono già affrontati in passato: non per semplice odio, ma per due visioni opposte della forza, dell’onore e del controllo."
      }
    ],

    nocturon: [
      {
        label: "Hextor",
        value: "Antichi rivali. Hextor rappresenta la violenza che Nocturon tenta di contenere. Il loro passato può riemergere come duello, sfida o prova personale."
      }
    ],

    vornax: [
      {
        label: "Custode della Foresta",
        value: "Fratelli. Il sangue li unisce, ma il destino li ha portati su strade diverse. Questo legame può generare protezione, conflitto, sacrificio o scelta morale."
      }
    ],

    custode_della_foresta: [
      {
        label: "Vornax",
        value: "Fratelli. Il Custode vede in Vornax qualcosa che non è ancora del tutto perduto. Il loro legame può diventare una delle prove più forti contro la corruzione."
      }
    ],

    psion: [
      {
        label: "Vexor",
        value: "Destino incrociato. Il Psion è una delle poche menti che Vexor non riesce a leggere senza rischiare di perdersi tra voci, traumi e fratture interiori."
      }
    ],

    vexor: [
      {
        label: "Psion",
        value: "Destino incrociato. Vexor percepisce nel Psion una mente spezzata ma non dominabile. Tra loro può nascere attrazione mentale, diffidenza o guerra silenziosa."
      }
    ],

    mortax: [
      {
        label: "Necromante",
        value: "Antico contrasto rituale. Mortax custodisce il confine dei morti; il Necromante tenta di piegarlo. Non sono nemici obbligati, ma le loro arti si sfidano per natura."
      }
    ],

    necromante: [
      {
        label: "Mortax",
        value: "Antico contrasto rituale. Mortax protegge ciò che il Necromante vorrebbe richiamare. Il loro incontro può trasformarsi in patto, disputa o profanazione."
      }
    ],

    cacciatrice_di_anime: [
      {
        label: "Regina delle Ombre",
        value: "Destino incrociato spirituale. La Cacciatrice segue le anime che la Regina avvolge nel suo velo. In passato i loro sentieri si sono già sfiorati senza concludersi."
      }
    ],

    regina_delle_ombre: [
      {
        label: "Cacciatrice di Anime",
        value: "Destino incrociato spirituale. La Regina percepisce nella Cacciatrice una minaccia al proprio dominio sulle anime smarrite, ma anche uno strumento possibile."
      }
    ]
  };

  function loadRawBackgroundText() {
    if (typeof window.AbissoPlayerBackgroundsRaw === "string") {
      return window.AbissoPlayerBackgroundsRaw;
    }

    const paths = [
      "background-dei-giocatori.txt",
      "background dei giocatori.txt"
    ];

    for (const path of paths) {
      try {
        const xhr = new XMLHttpRequest();

        xhr.open("GET", path, false);
        xhr.send(null);

        if (xhr.status >= 200 && xhr.status < 300 && xhr.responseText) {
          return xhr.responseText;
        }
      } catch (error) {
        console.warn("[PLAYER BACKGROUNDS] Impossibile leggere:", path, error);
      }
    }

    console.warn(
      "[PLAYER BACKGROUNDS] File background-dei-giocatori.txt non trovato."
    );

    return "";
  }

  function normalizeLine(line) {
    return String(line || "")
      .replace(/\r/g, "")
      .trim();
  }

  function isKnownPlayerHeading(line) {
    const cleanLine = normalizeLine(line);

    return Object.keys(PLAYER_NAME_TO_KEY).some((name) => {
      return cleanLine.startsWith(`${name} – `);
    });
  }

  function getPlayerNameFromHeading(heading) {
    const cleanHeading = normalizeLine(heading);

    return Object.keys(PLAYER_NAME_TO_KEY).find((name) => {
      return cleanHeading.startsWith(`${name} – `);
    }) || "";
  }

  function splitPlayerBlocks(rawText) {
    const lines = String(rawText || "").split("\n");
    const blocks = [];
    let currentBlock = null;

    lines.forEach((line) => {
      const cleanLine = normalizeLine(line);

      if (!cleanLine && !currentBlock) return;

      if (isKnownPlayerHeading(cleanLine)) {
        if (currentBlock) {
          blocks.push(currentBlock);
        }

        const playerName = getPlayerNameFromHeading(cleanLine);
        const playerKey = PLAYER_NAME_TO_KEY[playerName];

        currentBlock = {
          playerName,
          playerKey,
          heading: cleanLine,
          lines: []
        };

        return;
      }

      if (currentBlock) {
        currentBlock.lines.push(line);
      }
    });

    if (currentBlock) {
      blocks.push(currentBlock);
    }

    return blocks;
  }

  function readMetaValue(lines, label) {
    const prefix = `${label}:`;

    const found = lines.find((line) => {
      return normalizeLine(line).startsWith(prefix);
    });

    if (!found) return "";

    return normalizeLine(found).slice(prefix.length).trim();
  }

function normalizeSectionName(value) {
  return String(value || "")
    .replace(/\r/g, "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\wÀ-ÿ\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getKnownSectionNames() {
  return [
    "Background",
    "Personalità",
    "Poteri e Abilità",
    "Equipaggiamento Tipico",
    "Suggerimenti di Gioco"
  ].map(normalizeSectionName);
}

function isSectionHeadingLine(line) {
  const cleanName = normalizeSectionName(line);

  if (!cleanName) return false;

  return getKnownSectionNames().includes(cleanName);
}

function getSectionContent(lines, sectionTitle) {
  const targetName = normalizeSectionName(sectionTitle);

  if (!targetName) return [];

  const startIndex = lines.findIndex((line) => {
    return normalizeSectionName(line) === targetName;
  });

  if (startIndex < 0) {
    return [];
  }

  let endIndex = lines.length;

  for (let i = startIndex + 1; i < lines.length; i += 1) {
    if (isSectionHeadingLine(lines[i])) {
      endIndex = i;
      break;
    }
  }

  return lines
    .slice(startIndex + 1, endIndex)
    .map(normalizeLine)
    .filter(Boolean);
}

function getSectionText(lines, sectionTitle) {
  return getSectionContent(lines, sectionTitle).join("\n\n").trim();
}

  function getFirstParagraph(text) {
    return String(text || "")
      .split(/\n\s*\n/)
      .map((item) => item.trim())
      .filter(Boolean)[0] || "";
  }

  function createListSection(title, items) {
    const cleanItems = Array.isArray(items)
      ? items.map(normalizeLine).filter(Boolean)
      : [];

    if (!cleanItems.length) return null;

    return {
      type: "list",
      title,
      items: cleanItems
    };
  }

  function createRelationshipSection(playerKey) {
    const checks = PLAYER_RELATIONSHIPS[playerKey] || [];

    if (!checks.length) return null;

    return {
      type: "requirements",
      title: "Legami e destini incrociati",
      checks
    };
  }

  function createRelationshipWarning(playerKey) {
    const checks = PLAYER_RELATIONSHIPS[playerKey] || [];

    if (!checks.length) return null;

    return {
      type: "warning",
      title: "Uso narrativo nel gioco",
      text: "Questo legame non obbliga alleanze o conflitti automatici: serve come leva narrativa per eventi speciali, dialoghi, prove personali, bonus situazionali o scelte morali tra i personaggi coinvolti."
    };
  }

  function parsePlayerBlock(block) {
    const playerKey = block.playerKey;
    const chapterKey = `player_${playerKey}`;

    const backgroundText = getSectionText(block.lines, "Background");
    const personalita = getSectionContent(block.lines, "Personalità");
    const poteri = getSectionContent(block.lines, "Poteri e Abilità");
    const equipaggiamento = getSectionContent(block.lines, "Equipaggiamento Tipico");
    const suggerimenti = getSectionContent(block.lines, "Suggerimenti di Gioco");

    const sections = [
      {
        type: "requirements",
        title: "Identità del giocatore",
        checks: [
          {
            label: "Allineamento",
            value: readMetaValue(block.lines, "Allineamento") || "Da definire"
          },
          {
            label: "Razza",
            value: readMetaValue(block.lines, "Razza") || "Da definire"
          },
          {
            label: "Classe",
            value: readMetaValue(block.lines, "Classe") || "Da definire"
          },
          {
            label: "Ruolo",
            value: readMetaValue(block.lines, "Ruolo") || "Da definire"
          }
        ]
      },
      createRelationshipSection(playerKey),
      createRelationshipWarning(playerKey),
      backgroundText
        ? {
            type: "text",
            title: "Background",
            text: backgroundText
          }
        : null,
      createListSection("Personalità", personalita),
      createListSection("Poteri e Abilità", poteri),
      createListSection("Equipaggiamento Tipico", equipaggiamento),
      createListSection("Suggerimenti di Gioco", suggerimenti)
    ].filter(Boolean);

    return {
      key: chapterKey,
      title: block.heading,
      categoryKey: "giocatori",
      categoryLabel: "Giocatori",
      imageUrl: PLAYER_IMAGE_BY_KEY[playerKey] || "",
      caption: `${block.playerName}, background e identità narrativa del personaggio.`,
      intro: getFirstParagraph(backgroundText),
      sections
    };
  }

  function buildPlayerBackgroundRules(rawText) {
    const blocks = splitPlayerBlocks(rawText);
    const rulesByPlayerKey = new Map();

    blocks.forEach((block) => {
      if (!block.playerKey) return;

      /*
        Se il file contiene due Vornax, questa assegnazione sovrascrive
        la prima versione con la seconda.
      */
      rulesByPlayerKey.set(block.playerKey, parsePlayerBlock(block));
    });

    const rules = {};

    rulesByPlayerKey.forEach((chapter) => {
      rules[chapter.key] = chapter;
    });

    return rules;
  }

  const rawText = loadRawBackgroundText();
  const PLAYER_BACKGROUND_RULES = buildPlayerBackgroundRules(rawText);

  window.AbissoPlayerBackgroundsConfig = {
    PLAYER_BACKGROUND_RULES,
    PLAYER_RELATIONSHIPS,
    rawText
  };

  console.log("[PLAYER BACKGROUNDS] Capitoli caricati:", {
    count: Object.keys(PLAYER_BACKGROUND_RULES).length,
    keys: Object.keys(PLAYER_BACKGROUND_RULES)
  });
})();