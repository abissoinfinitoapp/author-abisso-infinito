// author-chapter-assets.js
// Asset immagini dedicati solo al sito author.abissoinfinito.it
// Non dipende dal progetto principale.
// Le immagini vengono lette da R2 / Cloudflare assets.

(function initAuthorChapterAssets() {
  const ASSET_BASE_URL = "https://assets.abissoinfinito.it";

  const CHAPTER_ASSETS = {
    // =========================
    // INTRO / LUOGHI
    // =========================

    abisso_infinito_intro: {
      image: "img/logo_abisso.png",
      caption: "Introduzione narrativa al mondo di Abisso Infinito."
    },

    mercato_regno: {
      image: "img/mercato.png",
      caption: "Mercato del Regno, centro di scambi e preparazione."
    },

    locanda_regno: {
      image: "img/locanda.png",
      caption: "Locanda del Regno, ristoro e recupero."
    },

    fabbro_base: {
      image: "img/fabbro.png",
      caption: "Fabbro, armi, forgia e riparazioni."
    },

    allenamento_giocatori: {
      image: "img/allenamento.png",
      caption: "Campo di allenamento dei guerrieri."
    },

    casella_destino: {
      image: "img/destino.png",
      caption: "Casella del Destino, prova mistica e resurrezione."
    },

    banca_regno: {
      image: "img/banca.png",
      caption: "Banca del Regno, prestiti, oro e rischio."
    },

    caserma_regno: {
      image: "img/caserma.png",
      caption: "Caserma del Regno, sviluppo militare."
    },

    prigione_regno: {
      image: "img/prigione.png",
      caption: "Prigione del Regno, punizione e conseguenze."
    },

    portale_viaggio: {
      image: "img/portale.png",
      caption: "Portale Magico, passaggio tra zone lontane."
    },

    messaggero: {
      image: "img/messaggero.jpg",
      caption: "Messaggero del Patto, nodo missioni e scelte narrative."
    },

    messaggero_del_patto: {
      image: "img/messaggero.jpg",
      caption: "Messaggero del Patto, nodo missioni e scelte narrative."
    },

    // =========================
    // RISORSE
    // =========================

    raccolta_legno: {
      image: "img/legna.png",
      caption: "Legno, risorsa base per costruzione e sviluppo."
    },

    raccolta_ferro: {
      image: "img/ferro.png",
      caption: "Ferro, risorsa utile per economia, armi e costruzioni."
    },

    raccolta_rame: {
      image: "img/rame.png",
      caption: "Rame, risorsa preziosa per sviluppo e commercio."
    },

    raccolta_diamanti: {
      image: "img/diamanti.png",
      caption: "Diamanti, risorsa rara e strategica."
    },

    raccolta_oro: {
      image: "img/oro.png",
      caption: "Oro, ricchezza primaria del regno."
    },

    rame: {
      image: "img/rame.png",
      caption: "Rame, risorsa preziosa per sviluppo e commercio."
    },

    diamanti: {
      image: "img/diamanti.png",
      caption: "Diamanti, risorsa rara e strategica."
    },

    // =========================
    // POZIONI
    // =========================

    pozione_emporio: {
      image: "img/potion_shop.png",
      caption: "Emporio delle Pozioni."
    },

    mini_pozione_cura: {
      image: "img/mini_pozione.png",
      caption: "Mini Pozione di Cura, recupero leggero e immediato."
    },

    pozione_cura_piccola: {
      image: "img/pozione_cura_piccola.png",
      caption: "Pozione di Cura Piccola."
    },

    pozione_minore: {
      image: "img/pozione_minore.png",
      caption: "Pozione Minore, cura leggera ma stabile."
    },

    pozione_media: {
      image: "img/pozione_media.png",
      caption: "Pozione Media, recupero utile prima di nuove prove."
    },

    pozione_generica: {
      image: "img/pozione_generica.png",
      caption: "Pozione Generica, crescita casuale e imprevedibile."
    },

    pozione_leggendaria: {
      image: "img/pozione_leggendaria.png",
      caption: "Pozione Leggendaria, cura potente nei momenti critici."
    },

    // =========================
    // BANDE
    // =========================

    banda_nera: {
      image: "img/banda_nera.png",
      caption: "Banda Nera, prima grande prova del regno."
    },

    guerrieri_oscuri: {
      image: "img/guerrieri_oscuri.png",
      caption: "Guerrieri Oscuri, banda potente e disciplinata."
    },

    bande_dei_pirati: {
      image: "img/bande_dei_pirati.png",
      caption: "Bande dei Pirati, saccheggio, ricchezza e rischio."
    },

    banda_dei_pirati: {
      image: "img/bande_dei_pirati.png",
      caption: "Bande dei Pirati, saccheggio, ricchezza e rischio."
    },

    ladri_di_tesori: {
      image: "img/ladri_di_tesori.png",
      caption: "Ladri di Tesori, banda astuta specializzata in furti e bottini."
    },

    nani_del_chaos: {
      image: "img/nani_del_chaos.png",
      caption: "Nani del Chaos, banda robusta e frontale."
    },

    spettri_urlanti: {
      image: "img/spettri_urlanti.png",
      caption: "Spettri Urlanti, banda spirituale e inquietante."
    },

    assassini_dell_ombra: {
      image: "img/assassini_dell_ombra.png",
      caption: "Assassini dell’Ombra, banda letale legata a trappole e silenzio."
    },

    assassini_ombra: {
      image: "img/assassini_dell_ombra.png",
      caption: "Assassini dell’Ombra, banda letale legata a trappole e silenzio."
    },

    cavalieri_ardenti: {
      image: "img/cavalieri_ardenti.png",
      caption: "Cavalieri Ardenti, guardiani obbligatori dell’ingresso al Dungeon."
    },

    elfi_silvani: {
      image: "img/elfi_silvani.png",
      caption: "Elfi Silvani, alleati o avversari legati alla natura antica."
    },

    druidi_oscuri: {
      image: "img/druidi_oscuri.png",
      caption: "Druidi Oscuri, custodi corrotti di antichi riti naturali."
    },

    // =========================
    // MOSTRI MINORI / MAGGIORI
    // =========================

    mostro_fuoco: {
      image: "img/mostro_di_fuoco_square.png",
      caption: "Mostro di Fuoco, creatura ardente e devastante."
    },

    mostro_di_fuoco: {
      image: "img/mostro_di_fuoco_square.png",
      caption: "Mostro di Fuoco, creatura ardente e devastante."
    },

    mostro_ghiaccio: {
      image: "img/mostro_ghiaccio.png",
      caption: "Mostro di Ghiaccio, creatura minore legata al gelo."
    },

    mostro_di_ghiaccio: {
      image: "img/mostro_ghiaccio.png",
      caption: "Mostro di Ghiaccio, creatura minore legata al gelo."
    },

    mostro_terra: {
      image: "img/mostro_terra.png",
      caption: "Mostro di Terra, creatura pesante e resistente."
    },

    mostro_di_terra: {
      image: "img/mostro_terra.png",
      caption: "Mostro di Terra, creatura pesante e resistente."
    },

    mostro_degli_abissi: {
      image: "img/mostro_degli_abissi.png",
      caption: "Mostro degli Abissi, creatura avanzata e pericolosa."
    },

    eroe_vento: {
      image: "img/eroe_vento.png",
      caption: "Eroe del Vento, creatura rapida legata all’aria."
    },

    eroe_del_vento: {
      image: "img/eroe_vento.png",
      caption: "Eroe del Vento, creatura rapida legata all’aria."
    },

    zombie: {
      image: "img/zombie.png",
      caption: "Zombie, primo contatto con i non morti."
    },

    dragone_nero: {
      image: "img/dragone_nero.png",
      caption: "Dragone Nero, guardiano dell’ingresso al Dungeon."
    },

    laceratore_grigio: {
      image: "img/laceratore_grigio.png",
      caption: "Laceratore Grigio, mostro maggiore del Dungeon."
    },

    guardia_nera: {
      image: "img/guardia_nera.png",
      caption: "Guardia Nera, sentinella maggiore del Dungeon."
    },

    diavolo_delle_catene: {
      image: "img/diavolo_delle_catene.png",
      caption: "Diavolo delle Catene, mostro maggiore legato al controllo."
    },

    celebrilith: {
      image: "img/celebrilith.png",
      caption: "Celebrilith, l’Albero Sacro Corrotto."
    },

    albero_sacro_corrotto: {
      image: "img/celebrilith.png",
      caption: "Celebrilith, l’Albero Sacro Corrotto."
    },

    hezrou: {
      image: "img/hezrou.png",
      caption: "Hezrou, mostro maggiore demoniaco e brutale."
    },

    troll_delle_montagne: {
      image: "img/troll_delle_montagne.png",
      caption: "Troll delle Montagne, creatura massiccia e feroce."
    },

    troll_montagne: {
      image: "img/troll_delle_montagne.png",
      caption: "Troll delle Montagne, creatura massiccia e feroce."
    },

    ninfa: {
      image: "img/ninfa.png",
      caption: "Ninfa, creatura sottile legata a grazia e magia naturale."
    },

    veggente: {
      image: "img/veggente.png",
      caption: "Veggente, creatura capace di leggere il destino."
    },

    mago_nero: {
      image: "img/mago_nero.png",
      caption: "Mago Nero, nemico arcano specializzato in magia oscura."
    },

    spettro_cremisi: {
      image: "img/spettro_cremisi.png",
      caption: "Spettro Cremisi, mostro maggiore fisico e devastante."
    },

    // =========================
    // BOSS
    // =========================

    bel_boss_finale: {
      image: "img/bel_square.png",
      caption: "Bel, il Demonio della Lava. Boss finale di Abisso Infinito."
    },

    bel: {
      image: "img/bel_square.png",
      caption: "Bel, il Demonio della Lava. Boss finale di Abisso Infinito."
    },

    demonio_della_lava: {
      image: "img/bel_square.png",
      caption: "Bel, il Demonio della Lava. Boss finale di Abisso Infinito."
    },

    // =========================
    // POTERI ELEMENTALI
    // =========================

    potere_fuoco: {
      image: "img/fuoco.png",
      caption: "Potere Elementale del Fuoco."
    },

    potere_elementale_fuoco: {
      image: "img/fuoco.png",
      caption: "Potere Elementale del Fuoco."
    },

    potere_acqua: {
      image: "img/acqua.png",
      caption: "Potere Elementale dell’Acqua."
    },

    potere_elementale_acqua: {
      image: "img/acqua.png",
      caption: "Potere Elementale dell’Acqua."
    },

    potere_terra: {
      image: "img/terra.png",
      caption: "Potere Elementale della Terra."
    },

    potere_elementale_terra: {
      image: "img/terra.png",
      caption: "Potere Elementale della Terra."
    },

    potere_aria: {
      image: "img/aria.png",
      caption: "Potere Elementale dell’Aria."
    },

    potere_elementale_aria: {
      image: "img/aria.png",
      caption: "Potere Elementale dell’Aria."
    },

    // =========================
    // PERCORSI / EVENTI
    // =========================

    porta_dei_teschi: {
      image: "img/porta_dei_teschi.png",
      caption: "Porta dei Teschi, percorso ad alto rischio narrativo."
    },

    precipizio_di_lava: {
      image: "img/precipizio_di_lava.png",
      caption: "Precipizio di Lava, prova ambientale tra fuoco e instabilità."
    },

    ponte_infuocato: {
      image: "img/ponte_infuocato.png",
      caption: "Ponte Infuocato, percorso stretto e pericoloso sopra il fuoco."
    },

    stanza_dei_fili_taglienti: {
      image: "img/stanza_dei_fili_taglienti.png",
      caption: "Stanza dei Fili Taglienti, percorso di precisione e controllo."
    },

    sentiero_delle_ombre: {
      image: "img/sentiero_delle_ombre.png",
      caption: "Sentiero delle Ombre, prova di paura, silenzio e inganno."
    },

    selva_delle_lame: {
      image: "img/selva_delle_lame.png",
      caption: "Selva delle Lame, percorso letale tra rovi metallici e tagli improvvisi."
    }
  };

  const ALIASES = {
    "messaggero_del_patto": "messaggero",
    "bel_il_demonio_della_lava": "bel_boss_finale",
    "boss_finale": "bel_boss_finale",
    "celebrilith_l_albero_sacro_corrotto": "celebrilith",
    "celebrilith_albero_sacro_corrotto": "celebrilith",
    "banda_pirati": "bande_dei_pirati",
    "pirati": "bande_dei_pirati",
    "assassini_ombra": "assassini_dell_ombra",
    "mostro_abissi": "mostro_degli_abissi",
    "fuoco": "potere_fuoco",
    "acqua": "potere_acqua",
    "terra": "potere_terra",
    "aria": "potere_aria"
  };

  function normalizeKey(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[’']/g, "_")
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  }

  function resolveAsset(path) {
    const rawPath = String(path || "").trim();

    if (!rawPath) return "";

    if (
      rawPath.startsWith("http://") ||
      rawPath.startsWith("https://") ||
      rawPath.startsWith("data:") ||
      rawPath.startsWith("blob:")
    ) {
      return rawPath;
    }

    return `${ASSET_BASE_URL}/${rawPath.replace(/^\/+/, "")}`;
  }

  function getChapterAsset(chapterKeyOrTitle) {
    const rawKey = String(chapterKeyOrTitle || "").trim();
    const normalizedKey = normalizeKey(rawKey);

    const direct =
      CHAPTER_ASSETS[rawKey] ||
      CHAPTER_ASSETS[normalizedKey] ||
      CHAPTER_ASSETS[ALIASES[rawKey]] ||
      CHAPTER_ASSETS[ALIASES[normalizedKey]] ||
      null;

    if (!direct) return null;

    return {
      ...direct,
      imageUrl: resolveAsset(direct.image)
    };
  }

  window.AuthorChapterAssets = {
    baseUrl: ASSET_BASE_URL,
    all: CHAPTER_ASSETS,
    aliases: ALIASES,
    get: getChapterAsset,
    resolve: resolveAsset,
    normalizeKey
  };
})();