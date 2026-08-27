import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const GAME_ROOT_CANDIDATES = [
  process.env.GAME_ROOT,
  "C:/Users/Utente/Desktop/abissoinfinito app refactor",
  "C:/Users/Angelo/Desktop/abissoinfinito app refactor"
].filter(Boolean);
const GAME_ROOT =
  GAME_ROOT_CANDIDATES.find((candidate) => fs.existsSync(candidate)) ||
  GAME_ROOT_CANDIDATES[0];
const outputPath = path.resolve("author-modal-texts-catalog.js");
const customEventObjectLibrarySource = {
  modalId: "custom_event_objects",
  modalLabel: "Libreria oggetti evento",
  category: "Eventi custom",
  sourcePath: path.resolve(
    GAME_ROOT,
    "dashboard/js/config/dynamic-object-templates-config.js"
  )
};
const interactionItemsLibrarySource = {
  modalId: "custom_event_objects",
  modalLabel: "Catalogo oggetti",
  category: "Oggetti",
  sourcePath: path.resolve(
    GAME_ROOT,
    "dashboard/js/config/interaction-items-library.js"
  )
};

const modalSources = [
  {
    modalId: "market_food",
    modalLabel: "Banco del Cibo",
    category: "Mercati",
    sourcePath: path.resolve(GAME_ROOT, "dashboard/market-food-modal.html"),
    textExtractors: [
      {
        fieldKey: "document_title",
        fieldLabel: "Titolo documento",
        textType: "title",
        pattern: /<title>([\s\S]*?)<\/title>/i
      },
      {
        fieldKey: "header_title",
        fieldLabel: "Titolo header",
        textType: "heading",
        pattern: /<h1>([\s\S]*?)<\/h1>/i
      },
      {
        fieldKey: "header_description",
        fieldLabel: "Descrizione header",
        textType: "description",
        pattern: /<h1>[\s\S]*?<\/h1>\s*<p>([\s\S]*?)<\/p>/i
      },
      {
        fieldKey: "loading_text",
        fieldLabel: "Testo caricamento",
        textType: "status",
        pattern: /<div\s+id="loadingText"[\s\S]*?>([\s\S]*?)<\/div>/i
      },
      {
        fieldKey: "default_status",
        fieldLabel: "Stato iniziale",
        textType: "status",
        pattern: /"([^"\n]*Scegli la tua pietanza[^"\n]*)"/i
      },
      {
        fieldKey: "load_error_empty",
        fieldLabel: "Messaggio errore caricamento",
        textType: "empty",
        pattern: /gridEl\.innerHTML\s*=\s*`\s*<div class="empty">\s*([\s\S]*?)\s*<\/div>/i
      }
    ]
  },
  {
    modalId: "chef_gustav",
    modalLabel: "Chef Gustav",
    category: "Locanda",
    sourcePath: path.resolve(GAME_ROOT, "dashboard/chef-gustav-modal.html"),
    textExtractors: [
      {
        fieldKey: "document_title",
        fieldLabel: "Titolo documento",
        textType: "title",
        pattern: /<title>([\s\S]*?)<\/title>/i
      },
      {
        fieldKey: "loading_text",
        fieldLabel: "Testo caricamento",
        textType: "status",
        pattern: /<div\s+id="loadingText"[\s\S]*?>([\s\S]*?)<\/div>/i
      },
      {
        fieldKey: "header_title",
        fieldLabel: "Titolo header",
        textType: "heading",
        pattern: /<h1>([\s\S]*?)<\/h1>/i
      },
      {
        fieldKey: "header_description",
        fieldLabel: "Descrizione header",
        textType: "description",
        pattern: /<section class="panel header">[\s\S]*?<h1>[\s\S]*?<\/h1>\s*<p>([\s\S]*?)<\/p>/i
      },
      {
        fieldKey: "player_label",
        fieldLabel: "Etichetta giocatore",
        textType: "label",
        pattern: /<div class="eyebrow">\s*([\s\S]*?)\s*<\/div>/i
      },
      {
        fieldKey: "default_status",
        fieldLabel: "Stato iniziale ordine",
        textType: "status",
        pattern: /"([^"\n]*Scegli il tuo men[^"\n]*Chef Gustav[^"\n]*)"/i
      },
      {
        fieldKey: "load_error_empty",
        fieldLabel: "Messaggio errore caricamento",
        textType: "empty",
        pattern: /menuGridEl\.innerHTML\s*=\s*`\s*<div class="empty">\s*([\s\S]*?)\s*<\/div>/i
      }
    ]
  },
  {
    modalId: "messenger_pact",
    modalLabel: "Messaggero del Patto",
    category: "Destino",
    sourcePath: path.resolve(GAME_ROOT, "dashboard/messenger-modal.html"),
    textExtractors: [
      {
        fieldKey: "document_title",
        fieldLabel: "Titolo documento",
        textType: "title",
        pattern: /<title>([\s\S]*?)<\/title>/i
      },
      {
        fieldKey: "hero_eyebrow",
        fieldLabel: "Eyebrow hero",
        textType: "label",
        pattern: /<div class="eyebrow">\s*([\s\S]*?)\s*<\/div>/i
      },
      {
        fieldKey: "hero_title",
        fieldLabel: "Titolo hero",
        textType: "heading",
        pattern: /<h1>\s*([\s\S]*?)\s*<\/h1>/i
      },
      {
        fieldKey: "hero_description",
        fieldLabel: "Descrizione hero",
        textType: "description",
        pattern: /<section class="panel hero">[\s\S]*?<h1>[\s\S]*?<\/h1>\s*<p>([\s\S]*?)<\/p>/i
      },
      {
        fieldKey: "loading_status",
        fieldLabel: "Stato caricamento",
        textType: "status",
        pattern: /<div\s+id="status"[\s\S]*?>\s*([\s\S]*?)\s*<\/div>/i
      },
      {
        fieldKey: "choice_title",
        fieldLabel: "Titolo scelte",
        textType: "heading",
        pattern: /<article class="choice-card">[\s\S]*?<h2>\s*([\s\S]*?)\s*<\/h2>/i
      },
      {
        fieldKey: "choice_placeholder",
        fieldLabel: "Placeholder scelte",
        textType: "description",
        pattern: /<div id="choicePlaceholder">\s*([\s\S]*?)\s*<\/div>/i
      },
      {
        fieldKey: "collect_label",
        fieldLabel: "Etichetta riscuoti",
        textType: "label",
        pattern: /<strong>\s*(Riscuoti)\s*<\/strong>/i
      },
      {
        fieldKey: "invert_label",
        fieldLabel: "Etichetta ribalta evento",
        textType: "label",
        pattern: /<strong>\s*(Ribalta evento)\s*<\/strong>/i
      },
      {
        fieldKey: "no_material_reward",
        fieldLabel: "Messaggio nessun premio materiale",
        textType: "empty",
        pattern: /<div class="effect-line">\s*(Nessun bottino da reclamare\.)\s*<\/div>/i
      },
      {
        fieldKey: "history_title",
        fieldLabel: "Titolo cronologia",
        textType: "heading",
        pattern: /<section class="panel">\s*<h2>\s*([\s\S]*?Ultimi Patti[\s\S]*?)\s*<\/h2>/i
      },
      {
        fieldKey: "empty_history",
        fieldLabel: "Messaggio cronologia vuota",
        textType: "empty",
        pattern: /<div\s+id="history"[\s\S]*?>\s*([\s\S]*?Nessun Patto concluso\.)\s*<\/div>/i
      }
    ]
  },
  {
    modalId: "saloon",
    modalLabel: "Saloon del Regno",
    category: "Regno",
    sourcePath: path.resolve(GAME_ROOT, "dashboard/saloon-modal.html"),
    textExtractors: [
      {
        fieldKey: "document_title",
        fieldLabel: "Titolo documento",
        textType: "title",
        pattern: /<title>([\s\S]*?)<\/title>/i
      },
      {
        fieldKey: "hero_kicker",
        fieldLabel: "Eyebrow hero",
        textType: "label",
        pattern: /<div class="saloon-kicker">\s*([\s\S]*?)\s*<\/div>/i
      },
      {
        fieldKey: "header_title",
        fieldLabel: "Titolo header",
        textType: "heading",
        pattern: /<h1>\s*([\s\S]*?)\s*<\/h1>/i
      },
      {
        fieldKey: "header_description",
        fieldLabel: "Descrizione header",
        textType: "description",
        pattern: /<p class="saloon-subtitle">\s*([\s\S]*?)\s*<\/p>/i
      },
      {
        fieldKey: "initial_status",
        fieldLabel: "Stato iniziale",
        textType: "status",
        pattern: /<div\s+id="statusLine"[\s\S]*?>\s*([\s\S]*?)\s*<\/div>/i
      },
      {
        fieldKey: "services_title",
        fieldLabel: "Titolo servizi",
        textType: "heading",
        pattern: /<h2>[\s\S]*?(Servizi e consumazioni)\s*<\/h2>/i
      },
      {
        fieldKey: "services_description",
        fieldLabel: "Descrizione servizi",
        textType: "description",
        pattern: /<h2>[\s\S]*?Servizi e consumazioni[\s\S]*?<\/h2>\s*<p>\s*([\s\S]*?)\s*<\/p>/i
      },
      {
        fieldKey: "location_pending",
        fieldLabel: "Stato posizione in verifica",
        textType: "status",
        pattern: /<span id="locationBadge"[\s\S]*?>\s*([\s\S]*?Posizione in verifica[\s\S]*?)\s*<\/span>/i
      },
      {
        fieldKey: "jewels_title",
        fieldLabel: "Titolo gioielli",
        textType: "heading",
        pattern: /<h2>[\s\S]*?(Gioielli prestigiosi)\s*<\/h2>/i
      },
      {
        fieldKey: "jewels_description",
        fieldLabel: "Descrizione gioielli",
        textType: "description",
        pattern: /<h2>[\s\S]*?Gioielli prestigiosi[\s\S]*?<\/h2>\s*<p>\s*([\s\S]*?)\s*<\/p>/i
      },
      {
        fieldKey: "lottery_title",
        fieldLabel: "Titolo lotteria",
        textType: "heading",
        pattern: /<h2>[\s\S]*?(Banco della Lotteria)\s*<\/h2>/i
      },
      {
        fieldKey: "lottery_description",
        fieldLabel: "Descrizione lotteria",
        textType: "description",
        pattern: /<h2>[\s\S]*?Banco della Lotteria[\s\S]*?<\/h2>\s*<p>\s*([\s\S]*?)\s*<\/p>/i
      },
      {
        fieldKey: "ticket_badge_initial",
        fieldLabel: "Badge biglietto iniziale",
        textType: "label",
        pattern: /<span id="ticketBadge"[\s\S]*?>\s*([\s\S]*?Biglietto:[\s\S]*?)\s*<\/span>/i
      },
      {
        fieldKey: "history_title",
        fieldLabel: "Titolo cronologia",
        textType: "heading",
        pattern: /<aside class="history-box">\s*<h3>\s*([\s\S]*?)\s*<\/h3>/i
      },
      {
        fieldKey: "no_lottery_title",
        fieldLabel: "Titolo nessuna estrazione",
        textType: "heading",
        pattern: /<h3>\s*(Nessuna estrazione aperta)\s*<\/h3>/i
      },
      {
        fieldKey: "no_lottery_description",
        fieldLabel: "Descrizione nessuna estrazione",
        textType: "empty",
        pattern: /<h3>\s*Nessuna estrazione aperta\s*<\/h3>\s*<p>\s*([\s\S]*?)\s*<\/p>/i
      },
      {
        fieldKey: "empty_history",
        fieldLabel: "Messaggio cronologia vuota",
        textType: "empty",
        pattern: /<div class="history-row">\s*([\s\S]*?)\s*<\/div>/i
      },
      {
        fieldKey: "loading_offers_status",
        fieldLabel: "Stato caricamento offerte",
        textType: "status",
        pattern: /setStatus\("([^"]*Il Saloon prepara le sue tentazioni[^"]*)"\)/i
      },
      {
        fieldKey: "ready_status",
        fieldLabel: "Stato pronto",
        textType: "status",
        pattern: /\?\s*"([^"]*Il Saloon è aperto:[^"]*)"/i
      },
      {
        fieldKey: "operation_status",
        fieldLabel: "Stato operazione",
        textType: "status",
        pattern: /setStatus\("([^"]*oste sta prendendo l'ordine[^"]*)"\)/i
      },
      {
        fieldKey: "load_error_status",
        fieldLabel: "Messaggio errore caricamento",
        textType: "empty",
        pattern: /error\?\.message\s*\|\|\s*"([^"]*Le porte del Saloon[^"]*)"/i
      }
    ]
  },
  {
    modalId: "commercial_bank",
    modalLabel: "Banca del Regno",
    category: "Regno",
    sourcePath: path.resolve(GAME_ROOT, "dashboard/commercial-bank-modal.html"),
    textExtractors: [
      {
        fieldKey: "document_title",
        fieldLabel: "Titolo documento",
        textType: "title",
        pattern: /<title>([\s\S]*?)<\/title>/i
      },
      {
        fieldKey: "hero_eyebrow",
        fieldLabel: "Eyebrow hero",
        textType: "label",
        pattern: /<div class="eyebrow">\s*([\s\S]*?)\s*<\/div>/i
      },
      {
        fieldKey: "header_title",
        fieldLabel: "Titolo header",
        textType: "heading",
        pattern: /<h1>\s*([\s\S]*?)\s*<\/h1>/i
      },
      {
        fieldKey: "header_description",
        fieldLabel: "Descrizione header",
        textType: "description",
        pattern: /<p class="hero-copy">\s*([\s\S]*?)\s*<\/p>/i
      },
      {
        fieldKey: "loading_text",
        fieldLabel: "Testo caricamento",
        textType: "status",
        pattern: /<div id="loading" class="loading">\s*([\s\S]*?)\s*<\/div>/i
      },
      {
        fieldKey: "summary_money_label",
        fieldLabel: "Etichetta riepilogo denaro",
        textType: "label",
        pattern: /<div class="summary-label">\s*([^<]*?Denaro disponibile)\s*<\/div>/i
      },
      {
        fieldKey: "summary_free_gold_label",
        fieldLabel: "Etichetta riepilogo oro libero",
        textType: "label",
        pattern: /<div class="summary-label">\s*([^<]*?Oro libero)\s*<\/div>/i
      },
      {
        fieldKey: "summary_deposited_gold_label",
        fieldLabel: "Etichetta riepilogo oro depositato",
        textType: "label",
        pattern: /<div class="summary-label">\s*([^<]*?Oro depositato)\s*<\/div>/i
      },
      {
        fieldKey: "summary_max_loan_label",
        fieldLabel: "Etichetta riepilogo credito massimo",
        textType: "label",
        pattern: /<div class="summary-label">\s*([^<]*?Credito massimo)\s*<\/div>/i
      },
      {
        fieldKey: "deposit_title",
        fieldLabel: "Titolo deposito",
        textType: "heading",
        pattern: /<h2>\s*[\s\S]*?(Deposito e garanzia)\s*<\/h2>/i
      },
      {
        fieldKey: "deposit_description",
        fieldLabel: "Descrizione deposito",
        textType: "description",
        pattern: /<h2>\s*[\s\S]*?Deposito e garanzia[\s\S]*?<\/h2>\s*<p class="panel-copy">\s*([\s\S]*?)\s*<\/p>/i
      },
      {
        fieldKey: "deposit_input_label",
        fieldLabel: "Etichetta input deposito",
        textType: "label",
        pattern: /<label for="depositAmount">\s*([\s\S]*?)\s*<\/label>/i
      },
      {
        fieldKey: "deposit_input_placeholder",
        fieldLabel: "Placeholder deposito",
        textType: "label",
        pattern: /<input id="depositAmount"[\s\S]*?placeholder="([^"]+)"/i
      },
      {
        fieldKey: "deposit_button",
        fieldLabel: "Pulsante deposito",
        textType: "button",
        pattern: /<button id="depositBtn"[\s\S]*?>\s*([\s\S]*?)\s*<\/button>/i
      },
      {
        fieldKey: "withdraw_button",
        fieldLabel: "Pulsante ritiro oro",
        textType: "button",
        pattern: /<button id="withdrawBtn"[\s\S]*?>\s*([\s\S]*?)\s*<\/button>/i
      },
      {
        fieldKey: "gold_dust_label",
        fieldLabel: "Etichetta polvere d'oro",
        textType: "label",
        pattern: /<span>\s*(Polvere d[\s\S]*?oro maturata)\s*<\/span>/i
      },
      {
        fieldKey: "yield_label",
        fieldLabel: "Etichetta rendimento",
        textType: "label",
        pattern: /<span>\s*(Rendimento per ciclo)\s*<\/span>/i
      },
      {
        fieldKey: "loan_guarantee_label",
        fieldLabel: "Etichetta garanzia prestito",
        textType: "label",
        pattern: /<span>\s*(Garanzia prestito)\s*<\/span>/i
      },
      {
        fieldKey: "loan_title",
        fieldLabel: "Titolo prestito",
        textType: "heading",
        pattern: /<h2>\s*[\s\S]*?(Prestito)\s*<\/h2>/i
      },
      {
        fieldKey: "loan_description",
        fieldLabel: "Descrizione prestito",
        textType: "description",
        pattern: /<h2>\s*[\s\S]*?Prestito[\s\S]*?<\/h2>\s*<p class="panel-copy">\s*([\s\S]*?)\s*<\/p>/i
      },
      {
        fieldKey: "loan_input_label",
        fieldLabel: "Etichetta input prestito",
        textType: "label",
        pattern: /<label for="loanAmount">\s*([\s\S]*?)\s*<\/label>/i
      },
      {
        fieldKey: "loan_input_placeholder",
        fieldLabel: "Placeholder prestito",
        textType: "label",
        pattern: /<input id="loanAmount"[\s\S]*?placeholder="([^"]+)"/i
      },
      {
        fieldKey: "loan_button",
        fieldLabel: "Pulsante richiesta prestito",
        textType: "button",
        pattern: /<button id="loanBtn"[\s\S]*?>\s*([\s\S]*?)\s*<\/button>/i
      },
      {
        fieldKey: "close_loan_button",
        fieldLabel: "Pulsante estinzione prestito",
        textType: "button",
        pattern: /<button id="closeLoanBtn"[\s\S]*?>\s*([\s\S]*?)\s*<\/button>/i
      },
      {
        fieldKey: "loan_status_label",
        fieldLabel: "Etichetta stato prestito",
        textType: "label",
        pattern: /<div class="data-row"><span>\s*(Stato)\s*<\/span><strong id="loanStatus">/i
      },
      {
        fieldKey: "loan_remaining_label",
        fieldLabel: "Etichetta debito residuo",
        textType: "label",
        pattern: /<span>\s*(Debito residuo)\s*<\/span>/i
      },
      {
        fieldKey: "loan_installment_label",
        fieldLabel: "Etichetta rata automatica",
        textType: "label",
        pattern: /<span>\s*(Rata automatica)\s*<\/span>/i
      },
      {
        fieldKey: "loan_cycles_label",
        fieldLabel: "Etichetta rate rimaste",
        textType: "label",
        pattern: /<span>\s*(Rate rimaste)\s*<\/span>/i
      },
      {
        fieldKey: "insurance_title",
        fieldLabel: "Titolo assicurazione",
        textType: "heading",
        pattern: /<h2>\s*[\s\S]*?(Assicurazione del deposito)\s*<\/h2>/i
      },
      {
        fieldKey: "insurance_description",
        fieldLabel: "Descrizione assicurazione",
        textType: "description",
        pattern: /<h2>\s*[\s\S]*?Assicurazione del deposito[\s\S]*?<\/h2>\s*<p class="panel-copy">\s*([\s\S]*?)\s*<\/p>/i
      },
      {
        fieldKey: "enable_insurance_button",
        fieldLabel: "Pulsante attiva assicurazione",
        textType: "button",
        pattern: /<button id="enableInsuranceBtn"[\s\S]*?>\s*([\s\S]*?)\s*<\/button>/i
      },
      {
        fieldKey: "disable_insurance_button",
        fieldLabel: "Pulsante disattiva assicurazione",
        textType: "button",
        pattern: /<button id="disableInsuranceBtn"[\s\S]*?>\s*([\s\S]*?)\s*<\/button>/i
      },
      {
        fieldKey: "insurance_paid_cycle_label",
        fieldLabel: "Etichetta ultimo ciclo pagato",
        textType: "label",
        pattern: /<span>\s*(Ultimo ciclo pagato)\s*<\/span>/i
      },
      {
        fieldKey: "insurance_paid_total_label",
        fieldLabel: "Etichetta totale versato",
        textType: "label",
        pattern: /<span>\s*(Totale versato)\s*<\/span>/i
      },
      {
        fieldKey: "insurance_missed_label",
        fieldLabel: "Etichetta pagamenti mancati",
        textType: "label",
        pattern: /<span>\s*(Pagamenti mancati)\s*<\/span>/i
      },
      {
        fieldKey: "history_title",
        fieldLabel: "Titolo ultime operazioni",
        textType: "heading",
        pattern: /<h2>\s*[\s\S]*?(Ultime operazioni)\s*<\/h2>/i
      },
      {
        fieldKey: "rules_title",
        fieldLabel: "Titolo regole sportello",
        textType: "heading",
        pattern: /<h2>\s*(Regole dello sportello)\s*<\/h2>/i
      },
      {
        fieldKey: "rule_loan",
        fieldLabel: "Regola prestito",
        textType: "description",
        pattern: /<div class="rule-card"><strong>Prestito<\/strong>([\s\S]*?)<\/div>/i
      },
      {
        fieldKey: "rule_repayment",
        fieldLabel: "Regola rimborso",
        textType: "description",
        pattern: /<div class="rule-card"><strong>Rimborso<\/strong>([\s\S]*?)<\/div>/i
      },
      {
        fieldKey: "rule_insolvency",
        fieldLabel: "Regola insolvenza",
        textType: "description",
        pattern: /<div class="rule-card"><strong>Insolvenza<\/strong>([\s\S]*?)<\/div>/i
      },
      {
        fieldKey: "bank_locked_status",
        fieldLabel: "Stato banca sotto assalto",
        textType: "status",
        pattern: /state\.bankEventLocked[\s\S]*?\?\s*\(\s*"([^"]*La Banca del Regno[^"]*)"/i
      },
      {
        fieldKey: "loan_active_status",
        fieldLabel: "Stato prestito attivo",
        textType: "status",
        pattern: /<span class="loan-badge active">\s*([\s\S]*?Attivo[\s\S]*?)\s*<\/span>/i
      },
      {
        fieldKey: "loan_empty_status",
        fieldLabel: "Stato nessun prestito",
        textType: "status",
        pattern: /<span class="loan-badge">\s*([\s\S]*?Nessun prestito[\s\S]*?)\s*<\/span>/i
      },
      {
        fieldKey: "insurance_active_paid_status",
        fieldLabel: "Stato assicurazione attiva",
        textType: "status",
        pattern: /\?\s*"([^"]*Attiva e pagata[^"]*)"/i
      },
      {
        fieldKey: "insurance_pending_status",
        fieldLabel: "Stato assicurazione in attesa",
        textType: "status",
        pattern: /:\s*"([^"]*Attiva, in attesa del prossimo ciclo[^"]*)"/i
      },
      {
        fieldKey: "insurance_inactive_status",
        fieldLabel: "Stato assicurazione non attiva",
        textType: "status",
        pattern: /<span class="insurance-badge">\s*([\s\S]*?Non attiva[\s\S]*?)\s*<\/span>/i
      },
      {
        fieldKey: "load_invalid_error",
        fieldLabel: "Errore dati banca non validi",
        textType: "empty",
        pattern: /throw new Error\(\s*"([^"]*La banca non ha restituito dati validi[^"]*)"\s*\)/i
      },
      {
        fieldKey: "load_error",
        fieldLabel: "Errore apertura banca",
        textType: "empty",
        pattern: /error\?\.message\s*\|\|\s*"([^"]*Impossibile aprire la banca[^"]*)"/i
      },
      {
        fieldKey: "unavailable_error",
        fieldLabel: "Errore banca non disponibile",
        textType: "empty",
        pattern: /error\?\.message\s*\|\|\s*"([^"]*Banca non disponibile[^"]*)"/i
      },
      {
        fieldKey: "deposit_invalid_error",
        fieldLabel: "Errore deposito non valido",
        textType: "empty",
        pattern: /showFeedback\("([^"]*quantit[^"]*oro valida[^"]*)"/i
      },
      {
        fieldKey: "loan_invalid_error",
        fieldLabel: "Errore prestito non valido",
        textType: "empty",
        pattern: /showFeedback\("([^"]*Inserisci un prestito valido[^"]*)"/i
      }
    ]
  },
  {
    modalId: "potion_market",
    modalLabel: "Emporio Alchemico",
    category: "Mercati",
    sourcePath: path.resolve(GAME_ROOT, "dashboard/potion-market-modal.html"),
    textExtractors: [
      {
        fieldKey: "document_title",
        fieldLabel: "Titolo documento",
        textType: "title",
        pattern: /<title>([\s\S]*?)<\/title>/i
      },
      {
        fieldKey: "header_title",
        fieldLabel: "Titolo header",
        textType: "heading",
        pattern: /<h1>\s*([\s\S]*?)\s*<\/h1>/i
      },
      {
        fieldKey: "header_description",
        fieldLabel: "Descrizione header",
        textType: "description",
        pattern: /<p class="subtitle">\s*([\s\S]*?)\s*<\/p>/i
      },
      {
        fieldKey: "refresh_button",
        fieldLabel: "Pulsante aggiorna emporio",
        textType: "button",
        pattern: /<button id="potionRefreshBtn"[\s\S]*?>\s*([\s\S]*?)\s*<\/button>/i
      },
      {
        fieldKey: "initial_status",
        fieldLabel: "Stato iniziale",
        textType: "status",
        pattern: /<div id="potionStatus"[\s\S]*?>\s*([\s\S]*?)\s*<\/div>/i
      },
      {
        fieldKey: "market_title",
        fieldLabel: "Titolo pozioni mercato",
        textType: "heading",
        pattern: /<h2>\s*(Pozioni del mercato)\s*<\/h2>/i
      },
      {
        fieldKey: "market_description",
        fieldLabel: "Descrizione pozioni mercato",
        textType: "description",
        pattern: /<h2>\s*Pozioni del mercato\s*<\/h2>\s*<p class="subtitle">\s*([\s\S]*?)\s*<\/p>/i
      },
      {
        fieldKey: "alchemy_title",
        fieldLabel: "Titolo preparazioni Alchimista",
        textType: "heading",
        pattern: /<h2>\s*(Preparazioni dell[\s\S]*?Alchimista)\s*<\/h2>/i
      },
      {
        fieldKey: "alchemy_description",
        fieldLabel: "Descrizione preparazioni Alchimista",
        textType: "description",
        pattern: /<h2>\s*Preparazioni dell[\s\S]*?Alchimista\s*<\/h2>\s*<p class="subtitle">\s*([\s\S]*?)\s*<\/p>/i
      },
      {
        fieldKey: "history_title",
        fieldLabel: "Titolo ultime operazioni",
        textType: "heading",
        pattern: /<h2>\s*(Ultime operazioni)\s*<\/h2>/i
      },
      {
        fieldKey: "load_status",
        fieldLabel: "Stato caricamento dati",
        textType: "status",
        pattern: /setStatus\("([^"]*Lettura di scorte[^"]*)"\)/i
      },
      {
        fieldKey: "ready_status",
        fieldLabel: "Stato emporio sincronizzato",
        textType: "status",
        pattern: /setStatus\("([^"]*Emporio sincronizzato con Supabase[^"]*)"/i
      },
      {
        fieldKey: "empty_market",
        fieldLabel: "Messaggio nessuna pozione mercato",
        textType: "empty",
        pattern: /marketGridEl\.innerHTML\s*=\s*`<div class="empty-state"[\s\S]*?>\s*([\s\S]*?Nessuna pozione disponibile\.)\s*<\/div>`/i
      },
      {
        fieldKey: "empty_alchemy",
        fieldLabel: "Messaggio nessuna preparazione",
        textType: "empty",
        pattern: /alchemyGridEl\.innerHTML\s*=\s*`<div class="empty-state"[\s\S]*?>\s*([\s\S]*?Nessuna preparazione disponibile\.)\s*<\/div>`/i
      },
      {
        fieldKey: "empty_history",
        fieldLabel: "Messaggio cronologia vuota",
        textType: "empty",
        pattern: /historyEl\.innerHTML\s*=\s*`<div class="empty-state">\s*([\s\S]*?Nessuna operazione registrata\.)\s*<\/div>`/i
      },
      {
        fieldKey: "buy_portable_confirmation",
        fieldLabel: "Conferma acquisto trasportabile",
        textType: "description",
        pattern: /`(La pozione verr[\s\S]*?Inventario generale\.)`/i
      },
      {
        fieldKey: "alchemy_auto_note",
        fieldLabel: "Nota effetto automatico",
        textType: "description",
        pattern: /(L’effetto viene applicato automaticamente alla scadenza\.)/i
      },
      {
        fieldKey: "use_portable_button",
        fieldLabel: "Pulsante acquista e trasporta",
        textType: "button",
        pattern: /\?\s*"([^"]*Acquista e trasporta[^"]*)"/i
      },
      {
        fieldKey: "consume_button",
        fieldLabel: "Pulsante acquista e consuma",
        textType: "button",
        pattern: /:\s*"([^"]*Acquista e consuma[^"]*)"/i
      },
      {
        fieldKey: "order_alchemy_button",
        fieldLabel: "Pulsante avvia preparazione",
        textType: "button",
        pattern: /<button[\s\S]*data-potion-action="order_alchemy"[\s\S]*?>\s*([\s\S]*?Avvia preparazione)\s*<\/button>/i
      },
      {
        fieldKey: "load_error",
        fieldLabel: "Errore caricamento emporio",
        textType: "empty",
        pattern: /setStatus\(error\?\.message\s*\|\|\s*"([^"]*Impossibile caricare[^"]*Emporio[^"]*)"/i
      }
    ]
  },
  {
    modalId: "barracks",
    modalLabel: "Caserma del Regno",
    category: "Regno",
    sourcePath: path.resolve(GAME_ROOT, "dashboard/barracks-modal.html"),
    textExtractors: [
      {
        fieldKey: "document_title",
        fieldLabel: "Titolo documento",
        textType: "title",
        pattern: /<title>([\s\S]*?)<\/title>/i
      },
      {
        fieldKey: "header_title",
        fieldLabel: "Titolo header",
        textType: "heading",
        pattern: /<h1>([\s\S]*?)<\/h1>/i
      },
      {
        fieldKey: "header_description",
        fieldLabel: "Descrizione header",
        textType: "description",
        pattern: /<p class="subtitle">([\s\S]*?)<\/p>/i
      },
      {
        fieldKey: "loading_status",
        fieldLabel: "Stato caricamento",
        textType: "status",
        pattern: /setStatus\("([^"]*Caricamento Caserma del Regno[^"]*)"\)/i
      },
      {
        fieldKey: "ready_status",
        fieldLabel: "Stato pronto",
        textType: "status",
        pattern: /\?\s*"([^"]*Caserma pronta a ricevere ordini[^"]*)"/i
      },
      {
        fieldKey: "command_requirements",
        fieldLabel: "Requisiti comando",
        textType: "description",
        pattern: /<p class="desc" style="margin-top:12px;">([\s\S]*?)<\/p>/i
      }
    ]
  },
  {
    modalId: "cards",
    modalLabel: "Carte Speciali",
    category: "Destino",
    sourcePath: path.resolve(GAME_ROOT, "dashboard/cards-modal.html"),
    textExtractors: [
      {
        fieldKey: "document_title",
        fieldLabel: "Titolo documento",
        textType: "title",
        pattern: /<title>([\s\S]*?)<\/title>/i
      },
      {
        fieldKey: "header_title",
        fieldLabel: "Titolo header",
        textType: "heading",
        pattern: /<h1>([\s\S]*?)<\/h1>/i
      },
      {
        fieldKey: "header_description",
        fieldLabel: "Descrizione header",
        textType: "description",
        pattern: /<p class="subtitle">([\s\S]*?)<\/p>/i
      },
      {
        fieldKey: "empty_cards",
        fieldLabel: "Messaggio nessuna carta",
        textType: "empty",
        pattern: /<div class="empty-state">\s*([\s\S]*?inizializzare le carte\.)\s*<\/div>/i
      }
    ]
  },
  {
    modalId: "environment_effects",
    modalLabel: "Effetti Ambientali dell'Abisso",
    category: "Ambiente",
    sourcePath: path.resolve(GAME_ROOT, "dashboard/environment-effects-modal.html"),
    textExtractors: [
      {
        fieldKey: "document_title",
        fieldLabel: "Titolo documento",
        textType: "title",
        pattern: /<title>([\s\S]*?)<\/title>/i
      },
      {
        fieldKey: "header_title",
        fieldLabel: "Titolo header",
        textType: "heading",
        pattern: /<h1>([\s\S]*?)<\/h1>/i
      },
      {
        fieldKey: "header_description",
        fieldLabel: "Descrizione header",
        textType: "description",
        pattern: /<header class="environment-header">[\s\S]*?<h1>[\s\S]*?<\/h1>\s*<p>([\s\S]*?)<\/p>/i
      },
      {
        fieldKey: "current_effect_label",
        fieldLabel: "Etichetta effetto corrente",
        textType: "label",
        pattern: /<div class="environment-active-title">\s*([\s\S]*?)\s*<\/div>/i
      },
      {
        fieldKey: "loading_status",
        fieldLabel: "Stato caricamento",
        textType: "status",
        pattern: /<div\s+id="activeEffectValue"[\s\S]*?>\s*([\s\S]*?Caricamento[\s\S]*?)\s*<\/div>/i
      },
      {
        fieldKey: "no_active_effect",
        fieldLabel: "Descrizione nessun effetto",
        textType: "empty",
        pattern: /activeEffectDescriptionEl\.textContent\s*=\s*"([^"]*territorio[^"]*)"/i
      },
      {
        fieldKey: "migration_note",
        fieldLabel: "Nota migrazione",
        textType: "description",
        pattern: /<section class="migration-note">\s*([\s\S]*?)<\/section>/i
      }
    ]
  },
  {
    modalId: "materials_market",
    modalLabel: "Mercato dei Materiali",
    category: "Mercati",
    sourcePath: path.resolve(GAME_ROOT, "dashboard/materials-market-modal.html"),
    textExtractors: [
      {
        fieldKey: "document_title",
        fieldLabel: "Titolo documento",
        textType: "title",
        pattern: /<title>([\s\S]*?)<\/title>/i
      },
      {
        fieldKey: "header_title",
        fieldLabel: "Titolo header",
        textType: "heading",
        pattern: /<h1[^>]*>([\s\S]*?)<\/h1>/i
      },
      {
        fieldKey: "header_description",
        fieldLabel: "Descrizione header",
        textType: "description",
        pattern: /<h1[^>]*>[\s\S]*?<\/h1>\s*<p>([\s\S]*?)<\/p>/i
      },
      {
        fieldKey: "loading_status",
        fieldLabel: "Stato caricamento",
        textType: "status",
        pattern: /(Apertura del registro dei materiali[.…]*)/i
      },
      {
        fieldKey: "empty_catalog",
        fieldLabel: "Messaggio catalogo vuoto",
        textType: "empty",
        pattern: /(Nessun materiale disponibile nel catalogo\.)/i
      },
      {
        fieldKey: "empty_history",
        fieldLabel: "Messaggio cronologia vuota",
        textType: "empty",
        pattern: /(Nessuna operazione registrata per questo guerriero\.)/i
      }
    ]
  },
  {
    modalId: "workers_market",
    modalLabel: "Mercato del Lavoro",
    category: "Mercati",
    sourcePath: path.resolve(GAME_ROOT, "dashboard/workers-market-modal.html"),
    textExtractors: [
      {
        fieldKey: "document_title",
        fieldLabel: "Titolo documento",
        textType: "title",
        pattern: /<title>([\s\S]*?)<\/title>/i
      },
      {
        fieldKey: "header_title",
        fieldLabel: "Titolo header",
        textType: "heading",
        pattern: /<h1[^>]*>([\s\S]*?)<\/h1>/i
      },
      {
        fieldKey: "header_description",
        fieldLabel: "Descrizione header",
        textType: "description",
        pattern: /<h1[^>]*>[\s\S]*?<\/h1>\s*<p>([\s\S]*?)<\/p>/i
      },
      {
        fieldKey: "loading_status",
        fieldLabel: "Stato caricamento",
        textType: "status",
        pattern: /(Consultazione del registro delle maestranze[.…]*)/i
      },
      {
        fieldKey: "empty_catalog",
        fieldLabel: "Messaggio catalogo vuoto",
        textType: "empty",
        pattern: /(Nessuna maestranza disponibile nel catalogo\.)/i
      },
      {
        fieldKey: "empty_history",
        fieldLabel: "Messaggio cronologia vuota",
        textType: "empty",
        pattern: /(Nessun contratto registrato per questo guerriero\.)/i
      }
    ]
  },
  {
    modalId: "mercenaries",
    modalLabel: "Taverna dei Mercenari",
    category: "Regno",
    sourcePath: path.resolve(GAME_ROOT, "dashboard/mercenaries-modal.html"),
    textExtractors: [
      {
        fieldKey: "document_title",
        fieldLabel: "Titolo documento",
        textType: "title",
        pattern: /<title>([\s\S]*?)<\/title>/i
      },
      {
        fieldKey: "header_title",
        fieldLabel: "Titolo header",
        textType: "heading",
        pattern: /<h1[^>]*>([\s\S]*?)<\/h1>/i
      },
      {
        fieldKey: "header_eyebrow",
        fieldLabel: "Eyebrow header",
        textType: "label",
        pattern: /<div class="eyebrow">([\s\S]*?)<\/div>/i
      },
      {
        fieldKey: "header_description",
        fieldLabel: "Descrizione header",
        textType: "description",
        pattern: /<p class="subtitle">([\s\S]*?)<\/p>/i
      },
      {
        fieldKey: "loading_status",
        fieldLabel: "Stato caricamento",
        textType: "status",
        pattern: /(Apertura della Taverna[.…]*)/i
      },
      {
        fieldKey: "empty_catalog",
        fieldLabel: "Messaggio catalogo non disponibile",
        textType: "empty",
        pattern: /(Catalogo mercenari non disponibile\.)/i
      }
    ]
  },
  {
    modalId: "weapons",
    modalLabel: "Armeria del Regno",
    category: "Regno",
    sourcePath: path.resolve(GAME_ROOT, "dashboard/weapons-modal.html"),
    textExtractors: [
      {
        fieldKey: "document_title",
        fieldLabel: "Titolo documento",
        textType: "title",
        pattern: /<title>([\s\S]*?)<\/title>/i
      },
      {
        fieldKey: "header_title",
        fieldLabel: "Titolo header",
        textType: "heading",
        pattern: /<h1[^>]*>([\s\S]*?)<\/h1>/i
      },
      {
        fieldKey: "header_description",
        fieldLabel: "Descrizione header",
        textType: "description",
        pattern: /<p class="subtitle">([\s\S]*?)<\/p>/i
      },
      {
        fieldKey: "loading_status",
        fieldLabel: "Stato caricamento",
        textType: "status",
        pattern: /(Apertura dei registri del Fabbro[.…]*)/i
      },
      {
        fieldKey: "order_status",
        fieldLabel: "Stato ordine in corso",
        textType: "status",
        pattern: /(Il Fabbro sta eseguendo l['’]ordine[.…]*)/i
      },
      {
        fieldKey: "empty_weapons",
        fieldLabel: "Messaggio nessuna arma",
        textType: "empty",
        pattern: /(Nessuna arma configurata per questo guerriero\.)/i
      }
    ]
  },
  {
    modalId: "warehouse",
    modalLabel: "Magazzino Generale",
    category: "Regno",
    sourcePath: path.resolve(GAME_ROOT, "dashboard/warehouse-modal.html"),
    textExtractors: [
      {
        fieldKey: "document_title",
        fieldLabel: "Titolo documento",
        textType: "title",
        pattern: /<title>([\s\S]*?)<\/title>/i
      },
      {
        fieldKey: "header_title",
        fieldLabel: "Titolo header",
        textType: "heading",
        pattern: /<h1[^>]*>([\s\S]*?)<\/h1>/i
      },
      {
        fieldKey: "header_description",
        fieldLabel: "Descrizione header",
        textType: "description",
        pattern: /<h1[^>]*>[\s\S]*?<\/h1>\s*<p>([\s\S]*?)<\/p>/i
      },
      {
        fieldKey: "loading_status",
        fieldLabel: "Stato caricamento",
        textType: "status",
        pattern: /(Apertura del Magazzino Generale[.…]*)/i
      },
      {
        fieldKey: "empty_resources",
        fieldLabel: "Messaggio nessuna risorsa",
        textType: "empty",
        pattern: /(Nessuna risorsa posseduta\.)/i
      }
    ]
  },
  {
    modalId: "training",
    modalLabel: "Campo di Allenamento",
    category: "Regno",
    sourcePath: path.resolve(GAME_ROOT, "dashboard/training-modal.html"),
    textExtractors: [
      {
        fieldKey: "document_title",
        fieldLabel: "Titolo documento",
        textType: "title",
        pattern: /<title>([\s\S]*?)<\/title>/i
      },
      {
        fieldKey: "header_title",
        fieldLabel: "Titolo header",
        textType: "heading",
        pattern: /<h1[^>]*>([\s\S]*?)<\/h1>/i
      },
      {
        fieldKey: "header_eyebrow",
        fieldLabel: "Eyebrow header",
        textType: "label",
        pattern: /<div class="eyebrow">([\s\S]*?)<\/div>/i
      },
      {
        fieldKey: "header_description",
        fieldLabel: "Descrizione header",
        textType: "description",
        pattern: /<p id="trainingRulesText">([\s\S]*?)<\/p>/i
      },
      {
        fieldKey: "preparing_status",
        fieldLabel: "Stato preparazione",
        textType: "status",
        pattern: /(Preparazione del campo[.…]*)/i
      },
      {
        fieldKey: "loading_status",
        fieldLabel: "Stato caricamento",
        textType: "status",
        pattern: /(Consultazione del registro degli allenamenti[.…]*)/i
      }
    ]
  },
  {
    modalId: "scrigni",
    modalLabel: "Scrigni",
    category: "Regno",
    sourcePath: path.resolve(GAME_ROOT, "dashboard/scrigni-modal.html"),
    textExtractors: [
      {
        fieldKey: "document_title",
        fieldLabel: "Titolo documento",
        textType: "title",
        pattern: /<title>([\s\S]*?)<\/title>/i
      },
      {
        fieldKey: "header_title",
        fieldLabel: "Titolo header",
        textType: "heading",
        pattern: /<h1[^>]*>([\s\S]*?)<\/h1>/i
      },
      {
        fieldKey: "header_description",
        fieldLabel: "Descrizione header",
        textType: "description",
        pattern: /<h1[^>]*>[\s\S]*?<\/h1>\s*<p>([\s\S]*?)<\/p>/i
      },
      {
        fieldKey: "empty_catalog",
        fieldLabel: "Messaggio nessuno Scrigno",
        textType: "empty",
        pattern: /(Nessuno Scrigno disponibile[\s\S]*?nel catalogo del regno\.)/i
      },
      {
        fieldKey: "load_error",
        fieldLabel: "Messaggio errore caricamento",
        textType: "empty",
        pattern: /<div class="empty">\s*(Impossibile caricare[\s\S]*?dal database\.)\s*<\/div>/i
      }
    ]
  },
  {
    modalId: "inventory",
    modalLabel: "Zaino",
    category: "Regno",
    sourcePath: path.resolve(GAME_ROOT, "dashboard/inventory-modal.html"),
    textExtractors: [
      {
        fieldKey: "document_title",
        fieldLabel: "Titolo documento",
        textType: "title",
        pattern: /<title>([\s\S]*?)<\/title>/i
      },
      {
        fieldKey: "header_title",
        fieldLabel: "Titolo header",
        textType: "heading",
        pattern: /<h1[^>]*>([\s\S]*?)<\/h1>/i
      },
      {
        fieldKey: "header_description",
        fieldLabel: "Descrizione header",
        textType: "description",
        pattern: /<p class="subtitle">([\s\S]*?)<\/p>/i
      },
      {
        fieldKey: "loading_status",
        fieldLabel: "Stato caricamento",
        textType: "status",
        pattern: /(Apertura dello Zaino[.…]*)/i
      },
      {
        fieldKey: "empty_history",
        fieldLabel: "Messaggio cronologia vuota",
        textType: "empty",
        pattern: /(Nessuna operazione registrata\.)/i
      }
    ]
  },
  {
    modalId: "items_progress",
    modalLabel: "Kit per l'Abisso",
    category: "Regno",
    sourcePath: path.resolve(GAME_ROOT, "dashboard/items-progress-modal.html"),
    textExtractors: [
      {
        fieldKey: "document_title",
        fieldLabel: "Titolo documento",
        textType: "title",
        pattern: /<title>([\s\S]*?)<\/title>/i
      },
      {
        fieldKey: "header_title",
        fieldLabel: "Titolo header",
        textType: "heading",
        pattern: /<h1[^>]*>([\s\S]*?)<\/h1>/i
      },
      {
        fieldKey: "header_description",
        fieldLabel: "Descrizione header",
        textType: "description",
        pattern: /<h1[^>]*>[\s\S]*?<\/h1>\s*<p>([\s\S]*?)<\/p>/i
      },
      {
        fieldKey: "loading_status",
        fieldLabel: "Stato caricamento",
        textType: "status",
        pattern: /(Preparazione del Kit per l['’]Abisso[.…]*)/i
      },
      {
        fieldKey: "empty_catalog",
        fieldLabel: "Messaggio catalogo non disponibile",
        textType: "empty",
        pattern: /(Catalogo del Kit non disponibile\.)/i
      },
      {
        fieldKey: "empty_history",
        fieldLabel: "Messaggio cronologia vuota",
        textType: "empty",
        pattern: /(Nessuna azione registrata per il Kit\.)/i
      }
    ]
  },
  {
    modalId: "resource_gather",
    modalLabel: "Raccolta Materiali",
    category: "Ambiente",
    sourcePath: path.resolve(GAME_ROOT, "dashboard/resource-gather-modal.html"),
    textExtractors: [
      {
        fieldKey: "document_title",
        fieldLabel: "Titolo documento",
        textType: "title",
        pattern: /<title>([\s\S]*?)<\/title>/i
      },
      {
        fieldKey: "header_title",
        fieldLabel: "Titolo header",
        textType: "heading",
        pattern: /<h1[^>]*>([\s\S]*?)<\/h1>/i
      },
      {
        fieldKey: "header_description",
        fieldLabel: "Descrizione header",
        textType: "description",
        pattern: /<p id="description">([\s\S]*?)<\/p>/i
      },
      {
        fieldKey: "loading_status",
        fieldLabel: "Stato caricamento",
        textType: "status",
        pattern: /(Controllo del luogo di raccolta[.…]*)/i
      }
    ]
  },
  {
    modalId: "destiny_resurrection",
    modalLabel: "Resurrezione del Destino",
    category: "Destino",
    sourcePath: path.resolve(GAME_ROOT, "dashboard/destiny-resurrection-modal.html"),
    textExtractors: [
      {
        fieldKey: "document_title",
        fieldLabel: "Titolo documento",
        textType: "title",
        pattern: /<title>([\s\S]*?)<\/title>/i
      },
      {
        fieldKey: "header_title",
        fieldLabel: "Titolo header",
        textType: "heading",
        pattern: /<h1[^>]*>([\s\S]*?)<\/h1>/i
      },
      {
        fieldKey: "header_eyebrow",
        fieldLabel: "Eyebrow header",
        textType: "label",
        pattern: /<div class="eyebrow">([\s\S]*?)<\/div>/i
      },
      {
        fieldKey: "header_description",
        fieldLabel: "Descrizione header",
        textType: "description",
        pattern: /<h1[^>]*>[\s\S]*?<\/h1>\s*<p>([\s\S]*?)<\/p>/i
      },
      {
        fieldKey: "loading_status",
        fieldLabel: "Stato caricamento",
        textType: "status",
        pattern: /(Caricamento del rituale[.…]*)/i
      }
    ]
  },
  {
    modalId: "bank_robbery",
    modalLabel: "Rapina alla Banca",
    category: "Regno",
    sourcePath: path.resolve(GAME_ROOT, "dashboard/bank-robbery-modal.html"),
    textExtractors: [
      {
        fieldKey: "document_title",
        fieldLabel: "Titolo documento",
        textType: "title",
        pattern: /<title>([\s\S]*?)<\/title>/i
      },
      {
        fieldKey: "header_title",
        fieldLabel: "Titolo header",
        textType: "heading",
        pattern: /<h1[^>]*>([\s\S]*?)<\/h1>/i
      },
      {
        fieldKey: "header_eyebrow",
        fieldLabel: "Eyebrow header",
        textType: "label",
        pattern: /<div class="eyebrow">([\s\S]*?)<\/div>/i
      },
      {
        fieldKey: "header_description",
        fieldLabel: "Descrizione header",
        textType: "description",
        pattern: /<h1[^>]*>[\s\S]*?<\/h1>\s*<p>([\s\S]*?)<\/p>/i
      },
      {
        fieldKey: "loading_status",
        fieldLabel: "Stato caricamento",
        textType: "status",
        pattern: /(Caricamento della sala operativa[.…]*)/i
      }
    ]
  }
];

const foodSources = [
  {
    modalId: "market_food",
    modalLabel: "Banco del Cibo",
    category: "Mercati",
    sourcePath: path.resolve(GAME_ROOT, "app/cibo.html"),
    sourceFile: "cibo.html"
  }
];

const chefMenuSources = [
  {
    modalId: "chef_gustav",
    modalLabel: "Chef Gustav",
    category: "Locanda",
    sourcePath: path.resolve(GAME_ROOT, "app/cibo.html"),
    sourceFile: "cibo.html"
  }
];

const messengerPactSources = [
  {
    modalId: "messenger_pact",
    modalLabel: "Messaggero del Patto",
    category: "Destino",
    sourcePath: path.resolve(GAME_ROOT, "app/movimenti.html"),
    sourceFile: "movimenti.html"
  }
];

const messengerMapContentSources = [
  {
    modalId: "messenger_pact",
    modalLabel: "Messaggero del Patto",
    category: "Destino",
    sourcePath: path.resolve(GAME_ROOT, "dashboard/js/config/map-content-library.js"),
    sourceFile: "map-content-library.js"
  }
];

const saloonOfferSources = [
  {
    modalId: "saloon",
    modalLabel: "Saloon del Regno",
    category: "Regno",
    sourcePath: path.resolve(GAME_ROOT, "docs/saloon_full_system_migration.sql"),
    sourceFile: "saloon_full_system_migration.sql"
  }
];

const saloonProductionOfferSnapshot = [
  {
    offerKey: "companion_lady",
    title: "Dama di compagnia",
    description: "Riposo, mondanità e relazioni influenti. Recupera parzialmente il guerriero, aumenta il prestigio e accresce la corruzione.",
    image: "img/dama-compagnia.png",
    category: "entertainment",
    actionType: "service",
    price: 5000,
    effectJson: {
      health_gain: 10,
      hunger_gain: 0,
      usage_group: "companion_service",
      stamina_gain: 10,
      ebbrezza_gain: 0,
      prestige_gain: 10,
      corruption_gain: 3,
      intoxication_gain: 0
    },
    maxPerTurn: 1,
    sortOrder: 10,
    catalogVersion: 2
  },
  {
    offerKey: "gentlemen",
    title: "Gentlemen",
    description: "Riposo, mondanità e relazioni influenti. Recupera parzialmente il guerriero, aumenta il prestigio e accresce la corruzione.",
    image: "img/gentlemen.png",
    category: "entertainment",
    actionType: "service",
    price: 5000,
    effectJson: {
      health_gain: 10,
      hunger_gain: 0,
      usage_group: "companion_service",
      stamina_gain: 10,
      ebbrezza_gain: 0,
      prestige_gain: 10,
      corruption_gain: 3,
      intoxication_gain: 0
    },
    maxPerTurn: 1,
    sortOrder: 15,
    catalogVersion: 2
  },
  {
    offerKey: "inebriating_wine",
    title: "Vino inebriante",
    description: "Un bicchiere che restituisce poca stamina, alimenta la fama mondana e prepara future conseguenze dell’ebbrezza.",
    image: "img/vino-inebriante.png",
    category: "entertainment",
    actionType: "drink",
    price: 500,
    effectJson: {
      health_gain: 0,
      hunger_gain: 2,
      stamina_gain: 10,
      wine_glasses: 1,
      ebbrezza_gain: 1,
      prestige_gain: 2,
      corruption_gain: 1,
      intoxication_gain: 1,
      altered_state_source: "alcohol"
    },
    maxPerTurn: 0,
    sortOrder: 20,
    catalogVersion: 2
  },
  {
    offerKey: "mandragora",
    title: "Mandragora",
    description: "Una preparazione euforica che triplica gli effetti del Vino inebriante e alimenta uno stato alterato.",
    image: "img/mandragora.png",
    category: "entertainment",
    actionType: "drink",
    price: 1500,
    effectJson: {
      health_gain: 0,
      hunger_gain: 6,
      stamina_gain: 30,
      ebbrezza_gain: 3,
      prestige_gain: 6,
      corruption_gain: 3,
      intoxication_gain: 3,
      altered_state_turns: 1,
      altered_state_source: "mandragora"
    },
    maxPerTurn: 0,
    sortOrder: 25,
    catalogVersion: 2
  },
  {
    offerKey: "prestige_jewel_10",
    title: "Monile raffinato",
    description: "Un ornamento di buona fattura che rende il nome del guerriero più riconoscibile.",
    image: "img/monile-raffinato.png",
    category: "jewel",
    actionType: "prestige",
    price: 10000,
    effectJson: {
      health_gain: 0,
      hunger_gain: 0,
      stamina_gain: 0,
      prestige_gain: 10,
      corruption_gain: 1,
      intoxication_gain: 0
    },
    maxPerTurn: 0,
    sortOrder: 30,
    catalogVersion: 1
  },
  {
    offerKey: "prestige_jewel_25",
    title: "Anello nobiliare",
    description: "Un anello costoso che apre porte e rende più autorevole ogni pretesa territoriale.",
    image: "img/anello-nobiliare.png",
    category: "jewel",
    actionType: "prestige",
    price: 25000,
    effectJson: {
      health_gain: 0,
      hunger_gain: 0,
      stamina_gain: 0,
      prestige_gain: 25,
      corruption_gain: 3,
      intoxication_gain: 0
    },
    maxPerTurn: 0,
    sortOrder: 40,
    catalogVersion: 1
  },
  {
    offerKey: "prestige_jewel_50",
    title: "Collana dell’alta corte",
    description: "Un gioiello appariscente capace di trasformare ricchezza in influenza politica.",
    image: "img/collana-alta-corte.png",
    category: "jewel",
    actionType: "prestige",
    price: 50000,
    effectJson: {
      health_gain: 0,
      hunger_gain: 0,
      stamina_gain: 0,
      prestige_gain: 50,
      corruption_gain: 6,
      intoxication_gain: 0
    },
    maxPerTurn: 0,
    sortOrder: 50,
    catalogVersion: 1
  },
  {
    offerKey: "prestige_jewel_100",
    title: "Gioiello del Sovrano",
    description: "Un simbolo di opulenza assoluta. Conferisce enorme prestigio, ma lega profondamente il guerriero alla corruzione del potere.",
    image: "img/gioiello-sovrano.png",
    category: "jewel",
    actionType: "prestige",
    price: 100000,
    effectJson: {
      health_gain: 0,
      hunger_gain: 0,
      stamina_gain: 0,
      prestige_gain: 100,
      corruption_gain: 12,
      intoxication_gain: 0
    },
    maxPerTurn: 0,
    sortOrder: 60,
    catalogVersion: 1
  },
  {
    offerKey: "lottery_ticket",
    title: "Biglietto della Lotteria",
    description: "Un biglietto conservabile. Può esserne posseduto soltanto uno e viene consumato quando il giocatore conferma la partecipazione a una lotteria.",
    image: "img/biglietto-lotteria.png",
    category: "lottery",
    actionType: "inventory_item",
    price: 500,
    effectJson: {
      item_key: "lottery_ticket",
      quantity: 1,
      health_gain: 0,
      hunger_gain: 0,
      stamina_gain: 0,
      prestige_gain: 0,
      corruption_gain: 0,
      intoxication_gain: 0
    },
    maxPerTurn: 0,
    sortOrder: 70,
    catalogVersion: 1
  }
];

const potionCatalogSnapshot = [
  {
    potionKey: "mini_pozione_cura",
    name: "Mini Pozione di Cura",
    description: "Una fiala leggera da conservare per le ferite meno profonde.",
    image: "img/piccola_pozione_di_cura.webp",
    useMode: "portable",
    transportable: true,
    carryCost: 1,
    maxStack: 3,
    sortOrder: 10,
    legacyIndex: 0,
    basePrice: 500,
    healthGain: 20,
    staminaGain: 10,
    stockMax: 10,
    restockEveryTurns: 20,
    scarcityThresholdPercent: 25,
    scarcityMarkupPercent: 30,
    personalLimitPerCycle: 3,
    marketAvailable: true,
    alchemyOrderable: false,
    progression: []
  },
  {
    potionKey: "pozione_cura_piccola",
    name: "Pozione di Cura Piccola",
    description: "Un distillato affidabile per recuperare salute e vigore durante il viaggio.",
    image: "img/pozione_cura_completa.webp",
    useMode: "portable",
    transportable: true,
    carryCost: 1,
    maxStack: 2,
    sortOrder: 20,
    legacyIndex: 1,
    basePrice: 700,
    healthGain: 40,
    staminaGain: 20,
    stockMax: 8,
    restockEveryTurns: 20,
    scarcityThresholdPercent: 25,
    scarcityMarkupPercent: 30,
    personalLimitPerCycle: 2,
    marketAvailable: true,
    alchemyOrderable: false,
    progression: []
  },
  {
    potionKey: "pozione_minore",
    name: "Pozione Minore",
    description: "Una riserva alchemica più concentrata, adatta ai combattimenti prolungati.",
    image: "img/pozione_riserva_minore.webp",
    useMode: "portable",
    transportable: true,
    carryCost: 1,
    maxStack: 2,
    sortOrder: 30,
    legacyIndex: 2,
    basePrice: 1000,
    healthGain: 50,
    staminaGain: 25,
    stockMax: 6,
    restockEveryTurns: 20,
    scarcityThresholdPercent: 25,
    scarcityMarkupPercent: 30,
    personalLimitPerCycle: 2,
    marketAvailable: true,
    alchemyOrderable: false,
    progression: []
  },
  {
    potionKey: "pozione_media",
    name: "Pozione Media",
    description: "Una fiala potente ma ingombrante nella disponibilità personale.",
    image: "img/pozione_riserva.webp",
    useMode: "portable",
    transportable: true,
    carryCost: 1,
    maxStack: 1,
    sortOrder: 40,
    legacyIndex: 3,
    basePrice: 1500,
    healthGain: 80,
    staminaGain: 40,
    stockMax: 5,
    restockEveryTurns: 20,
    scarcityThresholdPercent: 25,
    scarcityMarkupPercent: 30,
    personalLimitPerCycle: 1,
    marketAvailable: true,
    alchemyOrderable: false,
    progression: []
  },
  {
    potionKey: "pozione_leggendaria",
    name: "Pozione Leggendaria",
    description: "La cura più potente dell’Emporio. Deve essere consumata davanti al venditore.",
    image: "img/pozione_riserva_leggendaria.webp",
    useMode: "instant_at_vendor",
    transportable: false,
    carryCost: 0,
    maxStack: 0,
    sortOrder: 50,
    legacyIndex: 4,
    basePrice: 2000,
    healthGain: 150,
    staminaGain: 75,
    stockMax: 3,
    restockEveryTurns: 20,
    scarcityThresholdPercent: 25,
    scarcityMarkupPercent: 30,
    personalLimitPerCycle: 1,
    marketAvailable: true,
    alchemyOrderable: false,
    progression: []
  },
  {
    potionKey: "pozione_rigenerante",
    name: "Pozione Rigenerante",
    description: "Distillato dell’Alchimista che riduce progressivamente la corruzione.",
    image: "img/pozione_rigenerante.png",
    useMode: "delayed_auto_apply",
    transportable: false,
    carryCost: 0,
    maxStack: 0,
    sortOrder: 60,
    legacyIndex: 5,
    basePrice: 0,
    healthGain: 0,
    staminaGain: 0,
    stockMax: 0,
    restockEveryTurns: 20,
    scarcityThresholdPercent: 25,
    scarcityMarkupPercent: 30,
    personalLimitPerCycle: 0,
    marketAvailable: false,
    alchemyOrderable: true,
    progression: [
      { cost: 20000, tier: 1, effect: { type: "corruption_reduce_percent", reduction_percent: 15 }, wait_minutes: 30 },
      { cost: 40000, tier: 2, effect: { type: "corruption_reduce_percent", reduction_percent: 25 }, wait_minutes: 25 },
      { cost: 60000, tier: 3, effect: { type: "corruption_reduce_percent", reduction_percent: 35 }, wait_minutes: 20 },
      { cost: 80000, tier: 4, effect: { type: "corruption_reduce_percent", reduction_percent: 45 }, wait_minutes: 15 },
      { cost: 100000, tier: 5, effect: { type: "corruption_reduce_percent", reduction_percent: 60 }, wait_minutes: 10 }
    ]
  },
  {
    potionKey: "fiala_vigore_infinito",
    name: "Fiala del Vigore Infinito",
    description: "Preparato alchemico che restituisce 200 punti stamina alla maturazione.",
    image: "img/fiala_infinito.webp",
    useMode: "delayed_auto_apply",
    transportable: false,
    carryCost: 0,
    maxStack: 0,
    sortOrder: 70,
    legacyIndex: 7,
    basePrice: 0,
    healthGain: 0,
    staminaGain: 200,
    stockMax: 0,
    restockEveryTurns: 20,
    scarcityThresholdPercent: 25,
    scarcityMarkupPercent: 30,
    personalLimitPerCycle: 0,
    marketAvailable: false,
    alchemyOrderable: true,
    progression: [
      { cost: 1500, tier: 1, effect: { type: "stamina_gain", stamina_gain: 200 }, wait_minutes: 15 },
      { cost: 3000, tier: 2, effect: { type: "stamina_gain", stamina_gain: 200 }, wait_minutes: 12 },
      { cost: 4500, tier: 3, effect: { type: "stamina_gain", stamina_gain: 200 }, wait_minutes: 10 },
      { cost: 6000, tier: 4, effect: { type: "stamina_gain", stamina_gain: 200 }, wait_minutes: 7 },
      { cost: 7000, tier: 5, effect: { type: "stamina_gain", stamina_gain: 200 }, wait_minutes: 5 }
    ]
  },
  {
    potionKey: "elisir_luce_astrale",
    name: "Elisir di Luce Astrale",
    description: "Elisir rarissimo che porta la salute al massimo al termine della preparazione.",
    image: "img/elisir_luce_astrale.webp",
    useMode: "delayed_auto_apply",
    transportable: false,
    carryCost: 0,
    maxStack: 0,
    sortOrder: 80,
    legacyIndex: 6,
    basePrice: 0,
    healthGain: 0,
    staminaGain: 0,
    stockMax: 0,
    restockEveryTurns: 20,
    scarcityThresholdPercent: 25,
    scarcityMarkupPercent: 30,
    personalLimitPerCycle: 0,
    marketAvailable: false,
    alchemyOrderable: true,
    progression: [
      { cost: 25000, tier: 1, effect: { type: "health_full" }, wait_minutes: 60 }
    ]
  }
];

const barracksUnitSources = [
  {
    modalId: "barracks",
    modalLabel: "Caserma del Regno",
    category: "Regno",
    sourcePath: path.resolve(GAME_ROOT, "dashboard/barracks-modal.html"),
    sourceFile: "barracks-modal.html"
  }
];

const specialCardSources = [
  {
    modalId: "cards",
    modalLabel: "Carte Speciali",
    category: "Destino",
    sourcePath: path.resolve(GAME_ROOT, "app/defaultData.json"),
    sourceFile: "defaultData.json"
  }
];

const environmentEffectSources = [
  {
    modalId: "environment_effects",
    modalLabel: "Effetti Ambientali dell'Abisso",
    category: "Ambiente",
    sourcePath: path.resolve(GAME_ROOT, "dashboard/js/services/world-environment-service.js"),
    sourceFile: "world-environment-service.js"
  }
];

function stripTags(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeHtml(value) {
  return String(value || "")
    .replaceAll("&nbsp;", " ")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&quot;", "\"")
    .replaceAll("&#039;", "'")
    .replaceAll("&#39;", "'");
}

function cleanText(value) {
  const text = decodeHtml(stripTags(value))
    .replaceAll("🥖", "")
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
    .replace(/\s+/g, " ")
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

function extractText(source, extractor) {
  const match = source.match(extractor.pattern);
  if (!match) return "";

  return cleanText(match[1] || match[0] || "");
}

function normalizeImageUrl(imagePath) {
  const cleanPath = cleanText(imagePath);
  const assetBaseUrl = "https://assets.abissoinfinito.it";
  const legacyBaseUrls = [
    "https://wjlmxnvrelazvbhrpegb.supabase.co/storage/v1/object/public/abisso-assets",
    "https://cbhxijmfmigfsnqtisyw.supabase.co/storage/v1/object/public/abisso-assets"
  ];

  if (!cleanPath) return "";

  for (const legacyBaseUrl of legacyBaseUrls) {
    if (cleanPath.startsWith(legacyBaseUrl)) {
      return `${assetBaseUrl}/${cleanPath
        .slice(legacyBaseUrl.length)
        .replace(/^\/+/, "")}`;
    }
  }

  if (/^https?:\/\//i.test(cleanPath)) return cleanPath;

  return `${assetBaseUrl}/${cleanPath.replace(/^\/+/, "")}`;
}

function loadDynamicObjectLibraryEntries(sourcePath) {
  const source = fs.readFileSync(sourcePath, "utf8");
  const context = {
    window: {},
    console: {
      log() {},
      warn() {},
      error() {}
    }
  };

  vm.createContext(context);
  vm.runInContext(source, context, { filename: sourcePath });

  const config = context.window.AbissoDynamicObjectTemplatesConfig;
  if (!config?.getDynamicObjectLibraryEntries) {
    throw new Error("Config libreria oggetti evento non disponibile.");
  }

  return config.getDynamicObjectLibraryEntries();
}

function loadInteractionItems(sourcePath) {
  const source = fs.readFileSync(sourcePath, "utf8");
  const context = {
    window: {},
    console: {
      log() {},
      warn() {},
      error() {}
    }
  };

  vm.createContext(context);
  vm.runInContext(source, context, { filename: sourcePath });

  const library = context.window.AbissoInteractionItemsLibrary;
  if (!library?.listItems) {
    throw new Error("Catalogo ufficiale oggetti non disponibile.");
  }

  return library.listItems();
}

function extractBalancedObject(source, declarationName) {
  const declarationIndex = source.indexOf(`const ${declarationName} =`);
  if (declarationIndex < 0) return "";

  const objectStart = source.indexOf("{", declarationIndex);
  if (objectStart < 0) return "";

  let depth = 0;
  let quote = "";
  let escaped = false;

  for (let index = objectStart; index < source.length; index += 1) {
    const char = source[index];

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

    if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;

      if (depth === 0) {
        return source.slice(objectStart, index + 1);
      }
    }
  }

  return "";
}

function extractBalancedArray(source, declarationName) {
  const declarationIndex = source.indexOf(`const ${declarationName} =`);
  if (declarationIndex < 0) return "";

  const arrayStart = source.indexOf("[", declarationIndex);
  if (arrayStart < 0) return "";

  let depth = 0;
  let quote = "";
  let escaped = false;

  for (let index = arrayStart; index < source.length; index += 1) {
    const char = source[index];

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
        return source.slice(arrayStart, index + 1);
      }
    }
  }

  return "";
}

function extractObjectByKey(source, objectKey) {
  const keyIndex = source.indexOf(`${objectKey}:`);
  if (keyIndex < 0) return "";

  const objectStart = source.indexOf("{", keyIndex);
  if (objectStart < 0) return "";

  let depth = 0;
  let quote = "";
  let escaped = false;

  for (let index = objectStart; index < source.length; index += 1) {
    const char = source[index];

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

    if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;

      if (depth === 0) {
        return source.slice(objectStart, index + 1);
      }
    }
  }

  return "";
}

function extractFunctionConstObject(source, functionName, constName) {
  const functionIndex = source.indexOf(`function ${functionName}`);
  if (functionIndex < 0) return "";

  const declarationIndex = source.indexOf(`const ${constName} =`, functionIndex);
  if (declarationIndex < 0) return "";

  const objectStart = source.indexOf("{", declarationIndex);
  if (objectStart < 0) return "";

  let depth = 0;
  let quote = "";
  let escaped = false;

  for (let index = objectStart; index < source.length; index += 1) {
    const char = source[index];

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

    if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;

      if (depth === 0) {
        return source.slice(objectStart, index + 1);
      }
    }
  }

  return "";
}

function extractFoodImages(source) {
  const images = new Map();
  const cardPattern =
    /<div class="cibo-card" id="([^"]+)">[\s\S]*?<img src="([^"]+)"/g;
  let match = null;

  while ((match = cardPattern.exec(source))) {
    images.set(cleanText(match[1]), cleanText(match[2]));
  }

  return images;
}

function parseFoodCatalog(source) {
  const objectSource = extractBalancedObject(source, "cibo");
  if (!objectSource) return [];

  const cibo = Function(`"use strict"; return (${objectSource});`)();
  const images = extractFoodImages(source);

  return Object.entries(cibo).map(([foodKey, item]) => {
    const image = images.get(foodKey) || `img/${foodKey}.webp`;
    const incremento = item.incremento && typeof item.incremento === "object"
      ? {
          fame: Number(item.incremento.fame || 0),
          salute: Number(item.incremento.salute || 0),
          stamina: Number(item.incremento.stamina || 0),
          forza: Number(item.incremento.forza || 0)
        }
      : {};

    return {
      foodKey,
      foodName: cleanText(item.nome || foodKey),
      description: cleanText(item.descrizione),
      image,
      imageUrl: normalizeImageUrl(image),
      cost: Number(item.costo || 0),
      incremento
    };
  });
}

function parseChefMenuCatalog(source) {
  const objectSource = extractBalancedObject(source, "CHEF_MENU_CATALOG");
  if (!objectSource) return [];

  const menuCatalog = Function(`"use strict"; return (${objectSource});`)();
  const images = extractFoodImages(source);
  const imageFallbacks = {
    zuppa_borgo: "zuppa_rustica",
    tagliere_mercante: "merenda_mercante",
    stufato_cavaliere: "pranzo_cavaliere",
    banchetto_elyndar: "cena_viandante"
  };
  const serviceMsMatch = source.match(/const\s+CHEF_SERVICE_MS\s*=\s*([^;]+);/);
  const serviceDurationMs = serviceMsMatch
    ? Number(Function(`"use strict"; return (${serviceMsMatch[1]});`)())
    : 30 * 60 * 1000;

  return Object.entries(menuCatalog).map(([menuKey, menu]) => {
    const imageKey = images.has(menuKey)
      ? menuKey
      : imageFallbacks[menuKey] || "";
    const image = imageKey
      ? images.get(imageKey) || `img/${imageKey}.webp`
      : "";

    return {
      menuKey,
      menuName: cleanText(menu.nome || menuKey),
      description: cleanText(menu.descrizione || ""),
      image,
      imageUrl: normalizeImageUrl(image),
      hungerGain: Number(menu.fame || 0),
      cost: Number(menu.costo || 0),
      serviceDurationMs
    };
  });
}

function parseMessengerPactMissions(source) {
  const arraySource = extractBalancedArray(source, "messengerEvents");
  if (!arraySource) return [];

  const events = Function(`"use strict"; return (${arraySource});`)();

  return events.map((event) => ({
    eventKey: cleanText(event.id || ""),
    title: cleanText(event.title || event.id || "Missione del Messaggero"),
    description: cleanText(event.description || ""),
    target: Number(event.target || 0),
    collectEffects: Array.isArray(event.collectEffects)
      ? event.collectEffects.map((effect) => ({
          stat: cleanText(effect.stat || ""),
          label: cleanText(effect.label || effect.stat || ""),
          percent: Number(effect.percent || 0)
        }))
      : []
  }));
}

function parseMessengerMapContent(source) {
  const objectSource = extractObjectByKey(source, "messaggero_del_patto");
  if (!objectSource) return null;

  const content = Function(`"use strict"; return (${objectSource});`)();

  return {
    key: cleanText(content.key || "messaggero_del_patto"),
    title: cleanText(content.title || "Messaggero del Patto"),
    image: cleanText(content.image || ""),
    imageUrl: normalizeImageUrl(content.image || ""),
    mapIcon: cleanText(content.mapIcon || ""),
    description: cleanText(content.description || ""),
    quickTip: cleanText(content.quickTip || ""),
    rulesKey: cleanText(content.rulesKey || "")
  };
}

function parseBarracksUnits(source) {
  const defsSource = extractBalancedObject(source, "UNIT_DEFS");
  if (!defsSource) return [];

  const costSource = extractFunctionConstObject(source, "materialCostByUnit", "map");
  const trainingSource = extractFunctionConstObject(source, "trainingMsPerUnit", "map");
  const unitDefs = Function(`"use strict"; return (${defsSource});`)();
  const materialCosts = costSource
    ? Function(`"use strict"; return (${costSource});`)()
    : {};
  const trainingMs = trainingSource
    ? Function(`"use strict"; return (${trainingSource});`)()
    : {};

  return Object.entries(unitDefs).map(([unitKey, unit]) => {
    const power = Number(unit.power || 0);
    const level = Number(unit.level || 1);
    const materialCost = materialCosts[unitKey] || {};
    const durationMs = Number(trainingMs[unitKey] || 90000);
    const coinCost = power * 150;

    return {
      unitKey,
      unitName: cleanText(unit.name || unitKey),
      level,
      power,
      coinCost,
      materialCost,
      durationMs,
      description: [
        `${cleanText(unit.name || unitKey)} è una unità della Caserma del Regno.`,
        `Si sblocca al livello ${level}, ha potenza ${power}, costa ${coinCost} monete e richiede ${formatPlainCost(materialCost)}.`,
        `Tempo base di addestramento: ${formatPlainDuration(durationMs)}.`
      ].join(" ")
    };
  });
}

function parseSpecialCardsCatalog(source) {
  try {
    const data = JSON.parse(source);
    const players = data?.gamePlayers || {};
    const cards = [];

    for (const [playerKey, player] of Object.entries(players)) {
      const playerLabel = cleanText(
        player.nome ||
        player.name ||
        playerKey.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
      );

      for (const [index, card] of (player.specialCards || []).entries()) {
        const attribute = cleanText(card.attributo || "");
        const title = cleanText(card.descrizione || "Carta Speciale");
        const feature = cleanText(card.caratteristica || "");
        const image = cleanText(card.image || "");

        cards.push({
          playerKey,
          playerLabel,
          cardIndex: index,
          cardKey: `${playerKey}:${attribute || index}`,
          title,
          feature,
          attribute,
          usesLeft: Number(card.usesLeft || 0),
          purifyPct: Number(card.purifyPct || 0),
          image,
          imageUrl: normalizeImageUrl(image)
        });
      }
    }

    return cards;
  } catch (_error) {
    // Not a JSON player catalog; fall back to the legacy inline modal parser.
  }

  const playersSource = extractBalancedObject(source, "playersIndex");
  const cardsSource = extractBalancedObject(source, "specialCardsByPlayer");

  if (!cardsSource) return [];

  const playersIndex = playersSource
    ? Function(`"use strict"; return (${playersSource});`)()
    : {};
  const cardsByPlayer = Function(`"use strict"; return (${cardsSource});`)();
  const cards = [];

  for (const [playerKey, playerCards] of Object.entries(cardsByPlayer)) {
    const playerLabel = cleanText(playersIndex[playerKey]?.nome || playerKey);

    for (const [index, card] of (playerCards || []).entries()) {
      const attribute = cleanText(card.attributo || "");
      const title = cleanText(card.descrizione || "Carta Speciale");
      const feature = cleanText(card.caratteristica || "");
      const image = cleanText(card.image || "");

      cards.push({
        playerKey,
        playerLabel,
        cardIndex: index,
        cardKey: `${playerKey}:${attribute || index}`,
        title,
        feature,
        attribute,
        usesLeft: Number(card.usesLeft || 0),
        purifyPct: Number(card.purifyPct || 0),
        image,
        imageUrl: normalizeImageUrl(image)
      });
    }
  }

  return cards;
}

function parseEnvironmentEffectsCatalog(source) {
  const effectsSource = extractBalancedObject(source, "ENVIRONMENT_EFFECTS");
  if (!effectsSource) return [];

  const effects = Function(`"use strict"; return (${effectsSource});`)();

  return Object.values(effects).map((effect) => ({
    effectKey: cleanText(effect.key || ""),
    legacyKey: cleanText(effect.legacyKey || ""),
    label: cleanText(effect.label || effect.key || "Effetto ambientale"),
    description: cleanText(effect.description || ""),
    image: cleanText(effect.imageUrl || ""),
    imageUrl: normalizeImageUrl(effect.imageUrl || ""),
    overlayImageUrl: normalizeImageUrl(effect.overlayImageUrl || ""),
    icon: cleanText(effect.icon || ""),
    percentage: Number(effect.percentage || 0),
    attributesAffected: Array.isArray(effect.attributesAffected)
      ? effect.attributesAffected.map((attribute) => cleanText(attribute))
      : [],
    modifiers: effect.modifiers || {},
    visualMode: cleanText(effect.visualMode || ""),
    enterDurationMs: Number(effect.enterDurationMs || 0),
    exitDurationMs: Number(effect.exitDurationMs || 0)
  }));
}

function splitTopLevelList(source) {
  const parts = [];
  let start = 0;
  let depth = 0;
  let quote = "";

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];

    if (quote) {
      if (char === quote) {
        if (quote === "'" && source[index + 1] === "'") {
          index += 1;
        } else {
          quote = "";
        }
      }

      continue;
    }

    if (char === "'" || char === "\"") {
      quote = char;
      continue;
    }

    if (char === "(" || char === "[" || char === "{") {
      depth += 1;
    } else if (char === ")" || char === "]" || char === "}") {
      depth -= 1;
    } else if (char === "," && depth === 0) {
      parts.push(source.slice(start, index).trim());
      start = index + 1;
    }
  }

  const last = source.slice(start).trim();
  if (last) parts.push(last);

  return parts;
}

function parseSqlScalar(value) {
  const text = String(value || "").trim();

  if (/^'.*'$/s.test(text)) {
    return cleanText(text.slice(1, -1).replaceAll("''", "'"));
  }

  if (/^(true|false)$/i.test(text)) {
    return text.toLowerCase() === "true";
  }

  if (/^-?\d+(\.\d+)?$/.test(text)) {
    return Number(text);
  }

  return cleanText(text);
}

function extractSqlFunctionArgs(value, functionName) {
  const lowerValue = String(value || "").toLowerCase();
  const functionIndex = lowerValue.indexOf(functionName.toLowerCase());
  if (functionIndex < 0) return "";

  const start = String(value).indexOf("(", functionIndex);
  if (start < 0) return "";

  let depth = 0;
  let quote = "";

  for (let index = start; index < value.length; index += 1) {
    const char = value[index];

    if (quote) {
      if (char === quote) {
        if (quote === "'" && value[index + 1] === "'") {
          index += 1;
        } else {
          quote = "";
        }
      }

      continue;
    }

    if (char === "'" || char === "\"") {
      quote = char;
      continue;
    }

    if (char === "(") {
      depth += 1;
    } else if (char === ")") {
      depth -= 1;

      if (depth === 0) {
        return value.slice(start + 1, index);
      }
    }
  }

  return "";
}

function parseJsonbBuildObject(value) {
  const args = extractSqlFunctionArgs(value, "jsonb_build_object");
  if (!args) return {};

  const parts = splitTopLevelList(args);
  const result = {};

  for (let index = 0; index < parts.length - 1; index += 2) {
    const key = parseSqlScalar(parts[index]);
    result[key] = parseSqlScalar(parts[index + 1]);
  }

  return result;
}

function extractSqlValueGroups(source, tableName) {
  const groups = [];
  const lowerSource = source.toLowerCase();
  const lowerTable = tableName.toLowerCase();
  let searchFrom = 0;

  while (searchFrom < source.length) {
    const insertIndex = lowerSource.indexOf(`insert into ${lowerTable}`, searchFrom);
    if (insertIndex < 0) break;

    const valuesIndex = lowerSource.indexOf("values", insertIndex);
    if (valuesIndex < 0) break;

    const conflictIndex = lowerSource.indexOf("on conflict", valuesIndex);
    const blockEnd = conflictIndex < 0 ? source.length : conflictIndex;
    const block = source.slice(valuesIndex + "values".length, blockEnd);

    let depth = 0;
    let quote = "";
    let groupStart = -1;

    for (let index = 0; index < block.length; index += 1) {
      const char = block[index];

      if (quote) {
        if (char === quote) {
          if (quote === "'" && block[index + 1] === "'") {
            index += 1;
          } else {
            quote = "";
          }
        }

        continue;
      }

      if (char === "'" || char === "\"") {
        quote = char;
        continue;
      }

      if (char === "(") {
        if (depth === 0) groupStart = index + 1;
        depth += 1;
      } else if (char === ")") {
        depth -= 1;

        if (depth === 0 && groupStart >= 0) {
          groups.push(block.slice(groupStart, index).trim());
          groupStart = -1;
        }
      }
    }

    searchFrom = blockEnd + 1;
  }

  return groups;
}

function parseSaloonOfferCatalog(source) {
  const groups = extractSqlValueGroups(source, "public.game_saloon_offer_catalog");
  const offersByKey = new Map();

  for (const group of groups) {
    const values = splitTopLevelList(group);
    if (values.length < 13) continue;

    const offerKey = cleanText(parseSqlScalar(values[0]));
    if (!offerKey) continue;

    const isActive = parseSqlScalar(values[9]);
    if (isActive === false) continue;

    offersByKey.set(offerKey, {
      offerKey,
      title: cleanText(parseSqlScalar(values[1])),
      description: cleanText(parseSqlScalar(values[2])),
      image: cleanText(parseSqlScalar(values[3])),
      imageUrl: normalizeImageUrl(parseSqlScalar(values[3])),
      category: cleanText(parseSqlScalar(values[4])),
      actionType: cleanText(parseSqlScalar(values[5])),
      price: Number(parseSqlScalar(values[6]) || 0),
      effectJson: parseJsonbBuildObject(values[7]),
      maxPerTurn: Number(parseSqlScalar(values[8]) || 0),
      sortOrder: Number(parseSqlScalar(values[10]) || 0),
      catalogVersion: Number(parseSqlScalar(values[11]) || 0)
    });
  }

  for (const offer of saloonProductionOfferSnapshot) {
    const offerKey = cleanText(offer.offerKey);

    if (!offerKey) continue;

    offersByKey.set(offerKey, {
      offerKey,
      title: cleanText(offer.title),
      description: cleanText(offer.description),
      image: cleanText(offer.image),
      imageUrl: normalizeImageUrl(offer.image),
      category: cleanText(offer.category),
      actionType: cleanText(offer.actionType),
      price: Number(offer.price || 0),
      effectJson: offer.effectJson || {},
      maxPerTurn: Number(offer.maxPerTurn || 0),
      sortOrder: Number(offer.sortOrder || 0),
      catalogVersion: Number(offer.catalogVersion || 0),
      sourceFile: offer.sourceFile || "game_saloon_offer_catalog",
      sourcePath:
        offer.sourcePath ||
        "supabase://cbhxijmfmigfsnqtisyw/public.game_saloon_offer_catalog"
    });
  }

  return [...offersByKey.values()].sort((a, b) => {
    return a.sortOrder - b.sortOrder || a.title.localeCompare(b.title, "it-IT");
  });
}

function formatPlainCost(cost = {}) {
  const entries = Object.entries(cost || {});

  if (!entries.length) return "nessun materiale";

  return entries
    .map(([key, value]) => `${Number(value || 0)} ${key}`)
    .join(", ");
}

function formatPlainDuration(milliseconds = 0) {
  const totalSeconds = Math.max(0, Math.ceil(Number(milliseconds || 0) / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes && seconds) return `${minutes} min ${seconds} sec`;
  if (minutes) return `${minutes} min`;
  return `${seconds} sec`;
}

const units = [];

for (const modal of modalSources) {
  const source = fs.readFileSync(modal.sourcePath, "utf8");
  const sourceFile = path.basename(modal.sourcePath);

  for (const extractor of modal.textExtractors) {
    const provisionalText = extractText(source, extractor);

    if (!provisionalText) {
      console.warn(
        `Testo non estratto, chiave mantenuta nel catalogo: modal:${modal.modalId}:${extractor.fieldKey}`
      );
    }

    units.push({
      textKey: `modal:${modal.modalId}:${extractor.fieldKey}`,
      modalId: modal.modalId,
      modalLabel: modal.modalLabel,
      category: modal.category,
      sourceFile,
      sourcePath: modal.sourcePath,
      fieldKey: extractor.fieldKey,
      fieldLabel: extractor.fieldLabel,
      textType: extractor.textType,
      provisionalText
    });
  }
}

for (const sourceConfig of foodSources) {
  const source = fs.readFileSync(sourceConfig.sourcePath, "utf8");
  const foods = parseFoodCatalog(source);

  for (const food of foods) {
    units.push({
      textKey: `modal:${sourceConfig.modalId}:food:${food.foodKey}:description`,
      modalId: sourceConfig.modalId,
      modalLabel: sourceConfig.modalLabel,
      category: sourceConfig.category,
      sourceFile: sourceConfig.sourceFile,
      sourcePath: sourceConfig.sourcePath,
      fieldKey: `food:${food.foodKey}:description`,
      fieldLabel: `Descrizione pietanza: ${food.foodName}`,
      textType: "food_description",
      itemKey: food.foodKey,
      itemLabel: food.foodName,
      image: food.image,
      imageUrl: food.imageUrl,
      metadata: {
        cost: food.cost,
        incremento: food.incremento
      },
      provisionalText: food.description
    });
  }
}

for (const sourceConfig of chefMenuSources) {
  const source = fs.readFileSync(sourceConfig.sourcePath, "utf8");
  const menus = parseChefMenuCatalog(source);

  for (const menu of menus) {
    units.push({
      textKey: `modal:${sourceConfig.modalId}:chef_menu:${menu.menuKey}:description`,
      modalId: sourceConfig.modalId,
      modalLabel: sourceConfig.modalLabel,
      category: sourceConfig.category,
      sourceFile: sourceConfig.sourceFile,
      sourcePath: sourceConfig.sourcePath,
      fieldKey: `chef_menu:${menu.menuKey}:description`,
      fieldLabel: `Descrizione menu Chef: ${menu.menuName}`,
      textType: "chef_menu_description",
      itemKey: menu.menuKey,
      itemLabel: menu.menuName,
      image: menu.image,
      imageUrl: menu.imageUrl,
      metadata: {
        cost: menu.cost,
        hungerGain: menu.hungerGain,
        serviceDurationMs: menu.serviceDurationMs
      },
      provisionalText: menu.description
    });
  }
}

for (const sourceConfig of messengerPactSources) {
  const source = fs.readFileSync(sourceConfig.sourcePath, "utf8");
  const missions = parseMessengerPactMissions(source);

  for (const mission of missions) {
    units.push({
      textKey: `modal:${sourceConfig.modalId}:messenger_mission:${mission.eventKey}:description`,
      modalId: sourceConfig.modalId,
      modalLabel: sourceConfig.modalLabel,
      category: sourceConfig.category,
      sourceFile: sourceConfig.sourceFile,
      sourcePath: sourceConfig.sourcePath,
      fieldKey: `messenger_mission:${mission.eventKey}:description`,
      fieldLabel: `Descrizione missione Messaggero: ${mission.title}`,
      textType: "messenger_pact_mission_description",
      itemKey: mission.eventKey,
      itemLabel: mission.title,
      image: "img/messaggero.jpg",
      imageUrl: normalizeImageUrl("img/messaggero.jpg"),
      metadata: {
        target: mission.target,
        collectEffects: mission.collectEffects
      },
      provisionalText: mission.description
    });
  }
}

for (const sourceConfig of messengerMapContentSources) {
  const source = fs.readFileSync(sourceConfig.sourcePath, "utf8");
  const content = parseMessengerMapContent(source);

  if (!content) continue;

  units.push(
    {
      textKey: `modal:${sourceConfig.modalId}:map_node:${content.key}:description`,
      modalId: sourceConfig.modalId,
      modalLabel: sourceConfig.modalLabel,
      category: sourceConfig.category,
      sourceFile: sourceConfig.sourceFile,
      sourcePath: sourceConfig.sourcePath,
      fieldKey: `map_node:${content.key}:description`,
      fieldLabel: `Descrizione nodo mappa: ${content.title}`,
      textType: "messenger_pact_node_description",
      itemKey: content.key,
      itemLabel: content.title,
      image: content.image,
      imageUrl: content.imageUrl,
      metadata: {
        rulesKey: content.rulesKey,
        mapIcon: content.mapIcon
      },
      provisionalText: content.description
    },
    {
      textKey: `modal:${sourceConfig.modalId}:map_node:${content.key}:quick_tip`,
      modalId: sourceConfig.modalId,
      modalLabel: sourceConfig.modalLabel,
      category: sourceConfig.category,
      sourceFile: sourceConfig.sourceFile,
      sourcePath: sourceConfig.sourcePath,
      fieldKey: `map_node:${content.key}:quick_tip`,
      fieldLabel: `Consiglio rapido nodo: ${content.title}`,
      textType: "messenger_pact_node_quick_tip",
      itemKey: content.key,
      itemLabel: content.title,
      image: content.image,
      imageUrl: content.imageUrl,
      metadata: {
        rulesKey: content.rulesKey,
        mapIcon: content.mapIcon
      },
      provisionalText: content.quickTip
    }
  );
}

for (const sourceConfig of saloonOfferSources) {
  const source = fs.readFileSync(sourceConfig.sourcePath, "utf8");
  const offers = parseSaloonOfferCatalog(source);

  for (const offer of offers) {
    units.push({
      textKey: `modal:${sourceConfig.modalId}:saloon_offer:${offer.offerKey}:description`,
      modalId: sourceConfig.modalId,
      modalLabel: sourceConfig.modalLabel,
      category: sourceConfig.category,
      sourceFile: offer.sourceFile || sourceConfig.sourceFile,
      sourcePath: offer.sourcePath || sourceConfig.sourcePath,
      fieldKey: `saloon_offer:${offer.offerKey}:description`,
      fieldLabel: `Descrizione offerta Saloon: ${offer.title}`,
      textType: "saloon_offer_description",
      itemKey: offer.offerKey,
      itemLabel: offer.title,
      image: offer.image,
      imageUrl: offer.imageUrl,
      metadata: {
        category: offer.category,
        actionType: offer.actionType,
        price: offer.price,
        effectJson: offer.effectJson,
        maxPerTurn: offer.maxPerTurn,
        sortOrder: offer.sortOrder,
        catalogVersion: offer.catalogVersion
      },
      provisionalText: offer.description
    });
  }
}

for (const potion of potionCatalogSnapshot) {
  const potionKey = cleanText(potion.potionKey);
  const potionName = cleanText(potion.name || potionKey);
  const image = cleanText(potion.image || "");

  if (!potionKey || !potionName) continue;

  units.push({
    textKey: `modal:potion_market:potion:${potionKey}:description`,
    modalId: "potion_market",
    modalLabel: "Emporio Alchemico",
    category: "Mercati",
    sourceFile: "game_potion_catalog",
    sourcePath:
      "supabase://cbhxijmfmigfsnqtisyw/public.game_potion_catalog+public.game_item_catalog",
    fieldKey: `potion:${potionKey}:description`,
    fieldLabel: `Descrizione pozione: ${potionName}`,
    textType: "potion_description",
    itemKey: potionKey,
    itemLabel: potionName,
    image,
    imageUrl: normalizeImageUrl(image),
    metadata: {
      useMode: cleanText(potion.useMode),
      transportable: Boolean(potion.transportable),
      carryCost: Number(potion.carryCost || 0),
      maxStack: Number(potion.maxStack || 0),
      legacyIndex: Number(potion.legacyIndex || 0),
      sortOrder: Number(potion.sortOrder || 0),
      basePrice: Number(potion.basePrice || 0),
      healthGain: Number(potion.healthGain || 0),
      staminaGain: Number(potion.staminaGain || 0),
      stockMax: Number(potion.stockMax || 0),
      restockEveryTurns: Number(potion.restockEveryTurns || 0),
      scarcityThresholdPercent: Number(potion.scarcityThresholdPercent || 0),
      scarcityMarkupPercent: Number(potion.scarcityMarkupPercent || 0),
      personalLimitPerCycle: Number(potion.personalLimitPerCycle || 0),
      marketAvailable: Boolean(potion.marketAvailable),
      alchemyOrderable: Boolean(potion.alchemyOrderable),
      progression: Array.isArray(potion.progression) ? potion.progression : []
    },
    provisionalText: cleanText(potion.description)
  });
}

for (const sourceConfig of barracksUnitSources) {
  const source = fs.readFileSync(sourceConfig.sourcePath, "utf8");
  const soldiers = parseBarracksUnits(source);

  for (const soldier of soldiers) {
    units.push({
      textKey: `modal:${sourceConfig.modalId}:soldier:${soldier.unitKey}:description`,
      modalId: sourceConfig.modalId,
      modalLabel: sourceConfig.modalLabel,
      category: sourceConfig.category,
      sourceFile: sourceConfig.sourceFile,
      sourcePath: sourceConfig.sourcePath,
      fieldKey: `soldier:${soldier.unitKey}:description`,
      fieldLabel: `Descrizione soldato: ${soldier.unitName}`,
      textType: "soldier_description",
      itemKey: soldier.unitKey,
      itemLabel: soldier.unitName,
      metadata: {
        level: soldier.level,
        power: soldier.power,
        coinCost: soldier.coinCost,
        materialCost: soldier.materialCost,
        durationMs: soldier.durationMs
      },
      provisionalText: soldier.description
    });
  }
}

for (const sourceConfig of specialCardSources) {
  const source = fs.readFileSync(sourceConfig.sourcePath, "utf8");
  const cards = parseSpecialCardsCatalog(source);

  for (const card of cards) {
    units.push({
      textKey: `modal:${sourceConfig.modalId}:card:${card.playerKey}:${card.attribute}:description`,
      modalId: sourceConfig.modalId,
      modalLabel: sourceConfig.modalLabel,
      category: sourceConfig.category,
      sourceFile: sourceConfig.sourceFile,
      sourcePath: sourceConfig.sourcePath,
      fieldKey: `card:${card.playerKey}:${card.attribute}:description`,
      fieldLabel: `Descrizione carta: ${card.title}`,
      textType: "card_description",
      itemKey: card.cardKey,
      itemLabel: card.title,
      image: card.imageUrl,
      imageUrl: card.imageUrl,
      metadata: {
        playerKey: card.playerKey,
        playerLabel: card.playerLabel,
        cardIndex: card.cardIndex,
        attribute: card.attribute,
        usesLeft: card.usesLeft,
        purifyPct: card.purifyPct
      },
      provisionalText: card.feature
    });
  }
}

for (const sourceConfig of environmentEffectSources) {
  const source = fs.readFileSync(sourceConfig.sourcePath, "utf8");
  const effects = parseEnvironmentEffectsCatalog(source);

  for (const effect of effects) {
    units.push({
      textKey: `modal:${sourceConfig.modalId}:environment_effect:${effect.effectKey}:description`,
      modalId: sourceConfig.modalId,
      modalLabel: sourceConfig.modalLabel,
      category: sourceConfig.category,
      sourceFile: sourceConfig.sourceFile,
      sourcePath: sourceConfig.sourcePath,
      fieldKey: `environment_effect:${effect.effectKey}:description`,
      fieldLabel: `Descrizione effetto ambientale: ${effect.label}`,
      textType: "environment_effect_description",
      itemKey: effect.effectKey,
      itemLabel: effect.label,
      image: effect.image,
      imageUrl: effect.imageUrl,
      metadata: {
        legacyKey: effect.legacyKey,
        icon: effect.icon,
        overlayImageUrl: effect.overlayImageUrl,
        percentage: effect.percentage,
        attributesAffected: effect.attributesAffected,
        modifiers: effect.modifiers,
        visualMode: effect.visualMode,
        enterDurationMs: effect.enterDurationMs,
        exitDurationMs: effect.exitDurationMs
      },
      provisionalText: effect.description
    });
  }
}

const interactionItems = loadInteractionItems(
  interactionItemsLibrarySource.sourcePath
);

for (const item of interactionItems) {
  const itemKey = cleanText(item.key);
  const title = cleanText(item.title || itemKey);
  const image = cleanText(item.imageUrl || item.image || "");
  const interactionNature = cleanText(item.interactionNature);

  if (!itemKey || !title) continue;

  units.push({
    textKey: `modal:${interactionItemsLibrarySource.modalId}:official_item:${itemKey}:description`,
    modalId: interactionItemsLibrarySource.modalId,
    modalLabel: interactionItemsLibrarySource.modalLabel,
    category: interactionItemsLibrarySource.category,
    sourceFile: path.basename(interactionItemsLibrarySource.sourcePath),
    sourcePath: interactionItemsLibrarySource.sourcePath,
    fieldKey: `official_item:${itemKey}:description`,
    fieldLabel: `Descrizione oggetto ufficiale: ${title}`,
    textType: "interaction_item_description",
    itemKey,
    itemLabel: title,
    image,
    imageUrl: normalizeImageUrl(image),
    metadata: {
      entryType: "official_item",
      category:
        interactionNature === "magical"
          ? "Catalogo ufficiale · Magici"
          : "Catalogo ufficiale · Reali",
      interactionNature,
      interactionSkill: cleanText(item.interactionSkill),
      type: cleanText(item.type),
      family: cleanText(item.family),
      itemSource: cleanText(item.itemSource),
      catalogSource: cleanText(item.catalogSource),
      stackable: Boolean(item.stackable),
      maxQuantity: Number(item.maxQuantity || 0),
      cargoMode: cleanText(item.cargoMode),
      unitSpace: Number(item.unitSpace || 0),
      consumable: Boolean(item.consumable),
      starterItem: Boolean(item.starterItem),
      marketAvailable: Boolean(item.marketAvailable),
      customEventSelectable: Boolean(item.customEventSelectable),
      placementAllowed: Boolean(item.placementAllowed),
      defaultUsePolicy: cleanText(item.defaultUsePolicy),
      possibleUses: Array.isArray(item.possibleUses)
        ? item.possibleUses.map(cleanText).filter(Boolean)
        : [],
      tags: Array.isArray(item.tags) ? item.tags.map(cleanText).filter(Boolean) : []
    },
    provisionalText: cleanText(item.description)
  });
}

const dynamicObjectLibraryEntries = loadDynamicObjectLibraryEntries(
  customEventObjectLibrarySource.sourcePath
);

for (const entry of dynamicObjectLibraryEntries) {
  const entryKey = cleanText(entry.entryKey || entry.templateKey || entry.bundleKey);
  const title = cleanText(entry.title || entryKey);
  const entryType = cleanText(entry.entryType || "template");
  const image = cleanText(entry.imageUrl || entry.objectDefinition?.imageUrl || "");
  const objectDefinition = entry.objectDefinition || {};
  const useConfig = objectDefinition.useConfig || {};
  const commerceConfig = objectDefinition.commerceConfig || {};

  if (!entryKey || !title) continue;

  units.push({
    textKey: `modal:${customEventObjectLibrarySource.modalId}:${entryType}:${entryKey}:description`,
    modalId: customEventObjectLibrarySource.modalId,
    modalLabel: customEventObjectLibrarySource.modalLabel,
    category: customEventObjectLibrarySource.category,
    sourceFile: path.basename(customEventObjectLibrarySource.sourcePath),
    sourcePath: customEventObjectLibrarySource.sourcePath,
    fieldKey: `${entryType}:${entryKey}:description`,
    fieldLabel:
      entryType === "bundle"
        ? `Descrizione pacchetto oggetti: ${title}`
        : `Descrizione oggetto: ${title}`,
    textType:
      entryType === "bundle"
        ? "dynamic_object_bundle_description"
        : "dynamic_object_template_description",
    itemKey: entryKey,
    itemLabel: title,
    image,
    imageUrl: normalizeImageUrl(image),
    metadata: {
      entryType,
      accessType: cleanText(entry.accessType),
      category: cleanText(entry.category),
      libraryVisibility: cleanText(entry.libraryVisibility),
      sortOrder: Number(entry.sortOrder || 0),
      templateVersion: Number(entry.templateVersion || entry.bundleVersion || 0),
      tags: Array.isArray(entry.tags) ? entry.tags.map(cleanText).filter(Boolean) : [],
      memberCount: Array.isArray(entry.members) ? entry.members.length : 0,
      members: Array.isArray(entry.members)
        ? entry.members.map((member) => ({
            memberKey: cleanText(member.memberKey),
            templateKey: cleanText(member.templateKey),
            role: cleanText(member.role)
          }))
        : [],
      placementMode: cleanText(objectDefinition.placementMode),
      quantity: Number(objectDefinition.quantity || 0),
      stackable: Boolean(objectDefinition.stackable),
      maxQuantity: Number(objectDefinition.maxQuantity || 0),
      claimMode: cleanText(objectDefinition.claimMode),
      useEnabled: Boolean(useConfig.enabled),
      useMode: cleanText(useConfig.mode),
      consumeOnUse: Boolean(useConfig.consumeOnUse),
      commerceEnabled: Boolean(commerceConfig.enabled),
      price: Number(commerceConfig.price || 0)
    },
    provisionalText: cleanText(entry.description || entry.shortDescription)
  });
}

const modalDefinitions = [
  ...modalSources,
  customEventObjectLibrarySource
];

const modals = modalDefinitions.map((modal) => ({
  id: modal.modalId,
  label: modal.modalLabel,
  category: modal.category,
  sourceFile: path.basename(modal.sourcePath),
  textCount: units.filter((unit) => unit.modalId === modal.modalId).length
}));

const categories = [...new Set(modals.map((modal) => modal.category))]
  .filter(Boolean)
  .sort((a, b) => a.localeCompare(b, "it-IT", { sensitivity: "base" }));

// Normalizza sourcePath in percorso relativo a GAME_ROOT con separatori POSIX:
// il catalogo generato resta identico su qualsiasi macchina.
for (const unit of units) {
  if (unit.sourcePath) {
    unit.sourcePath = path
      .relative(GAME_ROOT, unit.sourcePath)
      .split(path.sep)
      .join("/");
  }
}

const catalog = {
  generatedAt: new Date().toISOString(),
  modalCount: modals.length,
  textCount: units.length,
  categories,
  modals,
  units
};

const output = `// author-modal-texts-catalog.js
// Generato da scripts/generate-modal-texts-catalog.mjs.

window.AuthorModalTextsCatalog = ${JSON.stringify(catalog, null, 2)};
`;

fs.writeFileSync(outputPath, output, "utf8");

console.log(
  `Catalogo testi modali generato: ${units.length} testi da ${modals.length} modali -> ${outputPath}`
);
