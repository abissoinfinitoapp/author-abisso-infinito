// author-player-nona-ora-catalog.js
// Catalogo dei personaggi giocanti dell'ambientazione "Nona Ora".
// Ogni personaggio ha 7 blocchi editoriali (un text_key per blocco), come la
// tab Testi quest. I placeholder sono la traccia di partenza per l'autore;
// non tutti i blocchi ne hanno uno.

(function initAuthorPlayerNonaOraCatalog() {
  const IMAGE_BASE = "https://assets.abissoinfinito.it/img/nona-ora/";

  // "nome" è il nome modificabile del personaggio (reso come input in cima,
  // non come blocco). Gli altri sono i blocchi editoriali: quelli senza
  // provisionalText mostrano solo il campo autore.
  const FIELD_DEFS = [
    { key: "nome", label: "Nome" },
    { key: "personaggio", label: "Personaggio" },
    { key: "caratteristica", label: "Caratteristica speciale" },
    { key: "dotazione", label: "Dotazione iniziale" },
    { key: "background", label: "Background" },
    { key: "aspetto", label: "Aspetto fisico" },
    { key: "parentele", label: "Parentele" },
    { key: "libero", label: "Campo libero" }
  ];

  const RAW = [
    {
      name: "Giulia Ferri",
      caratteristica: "Occhio Clinico – nota più facilmente dettagli visivi fuori posto e piccoli indizi ambientali",
      dotazione: "Fotocamera digitale, torcia tascabile",
      background: "Frequenta il club fotografico e documenta continuamente luoghi e persone. È la prima a rendersi conto che alcune fotografie della scuola non corrispondono alla realtà."
    },
    {
      name: "Matteo Rinaldi",
      caratteristica: "Memoria Fotografica – conserva meglio informazioni, simboli, numeri e testi già incontrati",
      dotazione: "Quaderno, penna, agenda scolastica",
      background: "Studente metodico e ossessionato dagli appunti. Ricorda dettagli che gli altri considerano irrilevanti."
    },
    {
      name: "Luca Moretti",
      caratteristica: "Mani Esperte – comprende più facilmente meccanismi, impianti e apparecchiature",
      dotazione: "Multitool, piccolo tester elettrico",
      background: "Passa molto tempo nei laboratori e sa riparare quasi qualsiasi cosa, anche se spesso non sa spiegare come ci riesce."
    },
    {
      name: "Elena Conti",
      caratteristica: "Empatia – ottiene più informazioni da personaggi impauriti, confusi o ostili",
      dotazione: "Lettore MP3, auricolari, diario",
      background: "È quella a cui tutti raccontano i propri problemi. Riesce a percepire quando qualcuno sta nascondendo qualcosa."
    },
    {
      name: "Marco Bellini",
      caratteristica: "Agilità – supera più facilmente ostacoli fisici, arrampicate e percorsi instabili",
      dotazione: "Torcia potente, borraccia",
      background: "Sportivo senza essere un combattente. È abituato a muoversi velocemente e a trovare una strada dove gli altri vedono un ostacolo."
    },
    {
      name: "Irene De Luca",
      caratteristica: "Intuito – percepisce più facilmente incongruenze nelle situazioni e nei comportamenti",
      dotazione: "Accendino, portachiavi portafortuna",
      background: "Non è superstiziosa, almeno secondo lei. Ha però una capacità inquietante di capire quando qualcosa “non torna”."
    },
    {
      name: "Andrea Serra",
      caratteristica: "Sangue Freddo – resiste meglio a paura, suggestione e manifestazioni dell'Istituto",
      dotazione: "Orologio digitale, pennarello indelebile",
      background: "Scettico cronico. Cerca sempre una spiegazione razionale anche quando ormai non dovrebbe più essercene una."
    },
    {
      name: "Sofia Greco",
      caratteristica: "Documentazione – fotografie e registrazioni possono rivelare dettagli non immediatamente visibili",
      dotazione: "Videocamera compatta, batterie",
      background: "Sta preparando un progetto scolastico e registra praticamente tutto. Alcune immagini iniziano a mostrare cose che nessuno ricorda di aver visto."
    },
    {
      name: "Davide Romano",
      caratteristica: "Orientamento – ricostruisce più facilmente percorsi, collegamenti e modifiche della scuola",
      dotazione: "Pianta dell'Istituto, bussola",
      background: "Ama esplorare edifici e luoghi abbandonati. È il primo a capire che i corridoi non mantengono sempre la stessa geometria."
    },
    {
      name: "Nina Bassi",
      caratteristica: "Primo Soccorso – utilizza meglio medicinali e oggetti di recupero della Salute",
      dotazione: "Kit di primo soccorso",
      background: "Ha seguito corsi di assistenza sanitaria e mantiene la calma davanti a ferite e incidenti."
    },
    {
      name: "Giulio Marchetti",
      caratteristica: "Improvvisazione – trova utilizzi alternativi agli oggetti raccolti",
      dotazione: "Nastro telato, cacciavite, cordino",
      background: "Smonta, combina e modifica qualunque cosa. Per lui un oggetto raramente serve soltanto allo scopo per cui è stato costruito."
    },
    {
      name: "Alessia Vitale",
      caratteristica: "Rete Sociale – riconosce relazioni, voci, rivalità e informazioni legate agli studenti",
      dotazione: "Vecchio annuario, telefono",
      background: "Conosce praticamente tutti, direttamente o indirettamente. Le fotografie degli annuari diventano presto una delle sue ossessioni."
    },
    {
      name: "Samuele Costa",
      caratteristica: "Presenza Rassicurante – aiuta il gruppo a mantenere lucidità durante eventi inquietanti",
      dotazione: "Walkie-talkie, batterie di riserva",
      background: "È quello che generalmente impedisce agli amici di perdere la testa. Quando Samuele comincia ad avere paura, significa che la situazione è davvero grave."
    },
    {
      name: "Chiara Galli",
      caratteristica: "Ricerca – interpreta più facilmente libri, documenti, riferimenti storici e testi incompleti",
      dotazione: "Libro tascabile, segnalibri, matita",
      background: "Passa molto tempo in biblioteca e conosce parti dell'archivio scolastico che quasi nessuno frequenta."
    },
    {
      name: "Riccardo Leone",
      caratteristica: "Passo Leggero – attraversa più facilmente zone sorvegliate o pericolose senza provocare eventi",
      dotazione: "Piccola torcia, guanti, chiavi personali",
      background: "È abituato a entrare dove non dovrebbe, più per curiosità che per cattive intenzioni. Conosce molti accessi secondari dell'Istituto."
    },
    {
      name: "Eva Mancini",
      caratteristica: "Pensiero Laterale – ottiene vantaggi nella soluzione di enigmi, sequenze e puzzle logici",
      dotazione: "Calcolatrice, blocco a quadretti",
      background: "Ama enigmi, codici e schemi. Comincia presto a sospettare che il numero 27 e le campanelle seguano una struttura precisa."
    }
  ];

  const COMBINING_MARKS = /[̀-ͯ]/g;

  function slugify(value) {
    return String(value || "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(COMBINING_MARKS, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  const players = RAW.map((entry) => {
    const playerId = slugify(entry.name);
    const placeholders = {
      nome: entry.name,
      caratteristica: entry.caratteristica || "",
      dotazione: entry.dotazione || "",
      background: entry.background || ""
    };

    return {
      textKey: `player:${playerId}`,
      playerId,
      name: entry.name,
      image: `${playerId}.png`,
      imageUrl: `${IMAGE_BASE}${playerId}.png`,
      fields: FIELD_DEFS.map((def, index) => ({
        textKey: `player:${playerId}:${def.key}`,
        fieldKey: def.key,
        fieldLabel: def.label,
        fieldIndex: index,
        provisionalText: placeholders[def.key] || ""
      }))
    };
  });

  window.AuthorPlayerNonaOraCatalog = {
    generatedAt: "2026-08-27",
    playerCount: players.length,
    // "nome" non è un blocco editoriale: è il nome modificabile in cima.
    fieldCount: players.length * (FIELD_DEFS.length - 1),
    fields: FIELD_DEFS.slice(),
    players
  };
})();
