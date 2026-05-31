// author-chapter-assets.js
// Mapping immagini dedicato solo al sito autore.
// Non dipende dal progetto principale.
// Le immagini vengono lette da R2 / Cloudflare assets.

(function initAuthorChapterAssets() {
  const ASSET_BASE_URL = "https://assets.abissoinfinito.it";

  const CHAPTER_ASSETS = {
    abisso_infinito_intro: {
      image: "img/accampamento.png",
      caption: "Atmosfera iniziale del viaggio nell'Abisso."
    },

    allenamento_giocatori: {
      image: "img/allenamento.png",
      caption: "Campo di allenamento dei guerrieri."
    },

    raccolta_ferro: {
      image: "img/ferro.png",
      caption: "Risorsa ferro, utile per economia, armi e costruzioni."
    },

    raccolta_legno: {
      image: "img/legno.png",
      caption: "Risorsa legno, base per costruzione e sviluppo."
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

    caserma_regno: {
      image: "img/caserma.png",
      caption: "Caserma del Regno, sviluppo militare."
    },

    banca_regno: {
      image: "img/banca.png",
      caption: "Banca del Regno, prestiti, oro e rischio."
    },

    prigione_regno: {
      image: "img/prigione.png",
      caption: "Prigione del Regno, punizione e conseguenze."
    },

    casella_destino: {
      image: "img/destino.png",
      caption: "Casella del Destino, prova mistica e resurrezione."
    },

    portale_viaggio: {
      image: "img/portale.png",
      caption: "Portale Magico, passaggio tra zone lontane."
    },

    pozione_generica: {
      image: "img/pozione_generica.png",
      caption: "Pozione generica, crescita casuale e imprevedibile."
    },

    pozione_leggendaria: {
      image: "img/pozione_leggendaria.png",
      caption: "Pozione leggendaria, cura potente nei momenti critici."
    },

    pozione_emporio: {
      image: "img/potion_shop.png",
      caption: "Emporio delle Pozioni."
    },

    guerrieri_oscuri: {
      image: "img/guerrieri_oscuri.png",
      caption: "Banda dei Guerrieri Oscuri."
    }
  };

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

  function getChapterAsset(chapterKey) {
    const key = String(chapterKey || "").trim();
    const asset = CHAPTER_ASSETS[key];

    if (!asset) return null;

    return {
      ...asset,
      imageUrl: resolveAsset(asset.image)
    };
  }

  window.AuthorChapterAssets = {
    baseUrl: ASSET_BASE_URL,
    all: CHAPTER_ASSETS,
    get: getChapterAsset,
    resolve: resolveAsset
  };
})();