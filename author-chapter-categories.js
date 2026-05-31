// author-chapter-categories.js
// Categorie editoriali per author.abissoinfinito.it
// Non modifica il database: serve solo a organizzare la sidebar autore.

(function initAuthorChapterCategories() {
  const CATEGORIES = [
    { key: "all", label: "Tutti" },
    { key: "intro", label: "Introduzione" },
    { key: "luoghi", label: "Luoghi" },
    { key: "risorse", label: "Risorse" },
    { key: "pozioni", label: "Pozioni" },
    { key: "bande", label: "Bande" },
    { key: "mostri", label: "Mostri" },
    { key: "boss", label: "Boss" },
    { key: "poteri", label: "Poteri" },
    { key: "eventi", label: "Eventi" },
    { key: "percorsi", label: "Percorsi" },
    { key: "giocatori", label: "Giocatori" },
    { key: "modalita", label: "Modalità di gioco" },
    { key: "regole", label: "Regole" },
    { key: "altro", label: "Altro" }
  ];

  const CHAPTER_CATEGORY_MAP = {
    // INTRO
    abisso_infinito_intro: "intro",

    // LUOGHI
    mercato_regno: "luoghi",
    locanda_regno: "luoghi",
    fabbro_base: "luoghi",
    allenamento_giocatori: "luoghi",
    casella_destino: "luoghi",
    banca_regno: "luoghi",
    caserma_regno: "luoghi",
    prigione_regno: "luoghi",
    portale_viaggio: "luoghi",
    messaggero: "luoghi",
    messaggero_del_patto: "luoghi",

    // RISORSE
    raccolta_legno: "risorse",
    raccolta_ferro: "risorse",
    raccolta_rame: "risorse",
    raccolta_oro: "risorse",
    raccolta_diamanti: "risorse",
    legno: "risorse",
    ferro: "risorse",
    rame: "risorse",
    oro: "risorse",
    diamanti: "risorse",

    // POZIONI
    pozione_emporio: "pozioni",
    mini_pozione_cura: "pozioni",
    pozione_cura_piccola: "pozioni",
    pozione_minore: "pozioni",
    pozione_media: "pozioni",
    pozione_generica: "pozioni",
    pozione_leggendaria: "pozioni",

    // BANDE
    banda_nera: "bande",
    guerrieri_oscuri: "bande",
    bande_dei_pirati: "bande",
    banda_dei_pirati: "bande",
    ladri_di_tesori: "bande",
    nani_del_chaos: "bande",
    spettri_urlanti: "bande",
    assassini_dell_ombra: "bande",
    assassini_ombra: "bande",
    cavalieri_ardenti: "bande",
    elfi_silvani: "bande",
    druidi_oscuri: "bande",

    // MOSTRI
    ninfa: "mostri",
    zombie: "mostri",
    mostro_ghiaccio: "mostri",
    mostro_di_ghiaccio: "mostri",
    mostro_fuoco: "mostri",
    mostro_di_fuoco: "mostri",
    mostro_terra: "mostri",
    mostro_di_terra: "mostri",
    mostro_degli_abissi: "mostri",
    mostro_abissi: "mostri",
    eroe_vento: "mostri",
    eroe_del_vento: "mostri",
    dragone_nero: "mostri",
    laceratore_grigio: "mostri",
    guardia_nera: "mostri",
    diavolo_delle_catene: "mostri",
    celebrilith: "mostri",
    albero_sacro_corrotto: "mostri",
    hezrou: "mostri",
    troll_delle_montagne: "mostri",
    troll_montagne: "mostri",
    veggente: "mostri",
    mago_nero: "mostri",
    spettro_cremisi: "mostri",

    // BOSS
    bel: "boss",
    bel_boss_finale: "boss",
    demonio_della_lava: "boss",
    bel_il_demonio_della_lava: "boss",

    // POTERI
    potere_fuoco: "poteri",
    potere_elementale_fuoco: "poteri",
    potere_acqua: "poteri",
    potere_elementale_acqua: "poteri",
    potere_terra: "poteri",
    potere_elementale_terra: "poteri",
    potere_aria: "poteri",
    potere_elementale_aria: "poteri",

    // PERCORSI / EVENTI MAPPA
    porta_dei_teschi: "percorsi",
    precipizio_di_lava: "percorsi",
    ponte_infuocato: "percorsi",
    stanza_dei_fili_taglienti: "percorsi",
    sentiero_delle_ombre: "percorsi",
    selva_delle_lame: "percorsi",

    // FUTURI CONTENUTI
    giocatori: "giocatori",
    personaggi: "giocatori",
    modalita_gioco: "modalita",
    modalita_di_gioco: "modalita",
    eventi_speciali: "eventi",
    eventi_negli_eventi: "eventi",
    regole_base: "regole",
    regole_avanzate: "regole"
  };

  const FALLBACK_RULES = [
    {
      category: "luoghi",
      words: [
        "mercato",
        "locanda",
        "fabbro",
        "allenamento",
        "destino",
        "banca",
        "caserma",
        "prigione",
        "portale",
        "messaggero"
      ]
    },
    {
      category: "risorse",
      words: [
        "legno",
        "ferro",
        "rame",
        "oro",
        "diamanti",
        "risorsa",
        "raccolta"
      ]
    },
    {
      category: "pozioni",
      words: [
        "pozione",
        "pozioni",
        "cura",
        "emporio"
      ]
    },
    {
      category: "bande",
      words: [
        "banda",
        "bande",
        "pirati",
        "ladri",
        "nani",
        "spettri",
        "assassini",
        "cavalieri",
        "elfi",
        "druidi"
      ]
    },
    {
      category: "mostri",
      words: [
        "mostro",
        "zombie",
        "ninfa",
        "dragone",
        "laceratore",
        "guardia",
        "diavolo",
        "celebrilith",
        "hezrou",
        "troll",
        "veggente",
        "mago",
        "spettro",
        "eroe"
      ]
    },
    {
      category: "boss",
      words: [
        "bel",
        "boss",
        "demonio"
      ]
    },
    {
      category: "poteri",
      words: [
        "potere",
        "elementale",
        "fuoco",
        "acqua",
        "terra",
        "aria"
      ]
    },
    {
      category: "percorsi",
      words: [
        "porta",
        "precipizio",
        "ponte",
        "stanza",
        "sentiero",
        "selva",
        "lame",
        "lava",
        "teschi",
        "fili"
      ]
    },
    {
      category: "giocatori",
      words: [
        "giocatore",
        "giocatori",
        "personaggio",
        "personaggi",
        "eroi"
      ]
    },
    {
      category: "modalita",
      words: [
        "modalita",
        "partita",
        "gioco",
        "campagna"
      ]
    },
    {
      category: "eventi",
      words: [
        "evento",
        "eventi",
        "scelta",
        "prova"
      ]
    },
    {
      category: "regole",
      words: [
        "regola",
        "regole",
        "manuale",
        "sistema"
      ]
    }
  ];

  function normalize(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[’']/g, "_")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  }

  function getCategoryMeta(categoryKey) {
    const normalizedKey = normalize(categoryKey);
    return CATEGORIES.find((item) => item.key === normalizedKey) ||
      CATEGORIES.find((item) => item.key === "altro");
  }

  function getCategory(chapter) {
    const key = normalize(chapter?.key);
    const title = normalize(chapter?.title);
    const intro = normalize(chapter?.intro);
    const haystack = `${key} ${title} ${intro}`;

    const mappedCategory = CHAPTER_CATEGORY_MAP[key];

    if (mappedCategory) {
      return getCategoryMeta(mappedCategory);
    }

    const fallback = FALLBACK_RULES.find((rule) => {
      return rule.words.some((word) => haystack.includes(normalize(word)));
    });

    if (fallback) {
      return getCategoryMeta(fallback.category);
    }

    return getCategoryMeta("altro");
  }

  window.AuthorChapterCategories = {
    categories: CATEGORIES,
    map: CHAPTER_CATEGORY_MAP,
    getCategory,
    getCategoryMeta,
    normalize
  };
})();