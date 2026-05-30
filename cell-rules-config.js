(function initAbissoCellRulesConfig() {
  const CELL_RULES = {
    abisso_infinito_intro: {
  title: "Abisso Infinito",
  intro: "Quando il cielo sopra Elyndar si tinse di rosso e la terra iniziò a tremare, ogni cronaca parlò dello stesso nome: Bel, il demonio della lava. Dalle profondità dell’Abisso Infinito egli emerse, portando con sé fuoco, distruzione e un sigillo maledetto capace di piegare il destino stesso.",

  sections: [
    {
      type: "text",
      title: "Il Richiamo di Abistaele",
      text: "Il sovrano Abistaele, ultimo baluardo della luce nel regno, ha convocato i guerrieri più forti e temerari. Non per gloria, ma per necessità. Il sigillo in mano a Bel sta corrompendo le terre, e ogni giorno che passa Elyndar perde un frammento della sua anima."
    },
    {
      type: "text",
      title: "Il Destino dei Guerrieri",
      text: "Solo coloro che avranno il coraggio di discendere nell’Abisso potranno affrontare il demonio. Il viaggio sarà lungo, fatto di battaglie, alleanze e scelte che segneranno il cammino. Non tutti torneranno… ma chi riuscirà potrà riscrivere il destino del regno."
    },
    {
      type: "warning",
      title: "Avvertimento",
      text: "L’Abisso non perdona. Ogni passo falso, ogni errore di valutazione può costarti risorse, potere… o la tua stessa sopravvivenza."
    },
    {
      type: "reward",
      title: "Obiettivo Finale",
      text: "Sconfiggere Bel, reclamare il Sigillo Maledetto e riportarlo a Elyndar per spezzare la corruzione e ristabilire la pace nel regno."
    }
  ]
},

allenamento_giocatori: {
  title: "Allenamento dei Giocatori",
  intro: "Fra tende consunte, armi scheggiate e urla di guerra che squarciano l’alba, sorge il campo dove i guerrieri temprano corpo e spirito. Qui non si combatte per uccidere, ma per diventare degni dell’Abisso. Ogni prova forgia il valore, ogni sconfitta insegna dolore, e ogni vittoria avvicina l’eroe al destino che lo attende.",

  sections: [
    {
      type: "text",
      title: "Scopo dell’allenamento",
      text: "L’allenamento serve a far crescere gli attributi del personaggio, guadagnare XP e aumentare il prestigio. È una delle vie più importanti per prepararsi agli scontri futuri, alle bande, ai mostri e alle prove del regno."
    },
    {
      type: "steps",
      title: "Come si svolge",
      items: [
        "Scegli il giocatore da allenare.",
        "Scegli l’attributo da allenare: forza, destrezza, magia, ingegno o astuzia.",
        "Inserisci il totale del tuo tiro, che deve essere compreso tra 2 e 12.",
        "Il sistema effettua a sua volta un tiro casuale da 2 a 12.",
        "Confronta i due risultati: il margine tra il tuo tiro e quello del sistema determina esito e ricompense."
      ]
    },
    {
      type: "requirements",
      title: "Regole base",
      checks: [
        { label: "Tiro giocatore", value: "Da 2 a 12" },
        { label: "Tiro sistema", value: "Casuale da 2 a 12" },
        { label: "Allenamenti massimi", value: "12 per partita" },
        { label: "Attributi allenabili", value: "Forza, Destrezza, Magia, Ingegno, Astuzia" }
      ]
    },
    {
      type: "text",
      title: "Allenamento normale",
      text: "Nell’allenamento normale il progresso è più controllato. In caso di vittoria, l’attributo scelto cresce e il personaggio ottiene anche prestigio e XP. Più grande è il margine sul tiro del sistema, più generosa sarà la crescita."
    },
    {
      type: "text",
      title: "Allenamento speciale",
      text: "L’allenamento speciale è una prova più intensa e più redditizia. Se riesce, concede una crescita superiore rispetto a quello normale e aumenta con più forza il potere complessivo del personaggio. È la scelta ideale per chi vuole accelerare il proprio sviluppo e rischiare di più per ottenere di più. Per ottenere l'allenamento speciale bisogna affrontare il destino e vincere la caratteristica, altrimenti è possibile solo l'allenamento normale"
    },
    {
      type: "list",
      title: "Esiti possibili",
      items: [
        "Vittoria: aumenti l’attributo scelto e ottieni prestigio e XP.",
        "Pareggio: ottieni comunque un piccolo avanzamento e ricompense ridotte.",
        "Sconfitta: non aumenti l’attributo scelto, perdi salute e salti il prossimo turno."
      ]
    },
    {
      type: "reward",
      title: "Premi in caso di vittoria",
      text: "Quando vinci, il tuo personaggio ottiene crescita dell’attributo allenato, XP e prestigio. Inoltre il sistema assegna anche un potenziamento percentuale della potenza totale del personaggio, che rafforza soprattutto l’attributo scelto e in parte anche gli altri."
    },
    {
      type: "reward",
      title: "Vittoria schiacciante",
      text: "Se superi il sistema con un margine molto alto, l’allenamento si trasforma in un trionfo memorabile: tutti gli attributi ricevono un incremento bonus e il personaggio guadagna anche monete aggiuntive come premio straordinario."
    },
    {
      type: "warning",
      title: "Prezzo della sconfitta",
      text: "Fallire un allenamento non è privo di conseguenze. Il personaggio perde salute, non ottiene aumento dell’attributo scelto e viene segnato dalla fatica al punto da dover saltare il turno successivo."
    },
    {
      type: "warning",
      title: "Limitazione importante",
      text: "Ogni personaggio può completare al massimo 12 allenamenti per partita. Questo limite rende preziosa ogni scelta: allenati con giudizio e non sprecare le prove quando sei impreparato."
    },
    {
      type: "text",
      title: "Consiglio per i novizi",
      text: "All’inizio conviene allenare gli attributi più utili al tuo stile di gioco e non cercare subito il rischio massimo. Accumula crescita, prestigio e XP con costanza: un guerriero saggio non cerca solo la gloria, ma costruisce la propria forza un passo alla volta."
    }
  ]
},

raccolta_ferro: {
  title: "Ferro",
  intro: "Fra vene scure di roccia e colpi d’acciaio che risuonano come antichi canti di guerra, il ferro attende mani degne di strapparlo alla terra. Non è soltanto una risorsa: è l’ossatura del regno, il metallo che alimenta forgia, eserciti e grandezza.",

  sections: [
    {
      type: "text",
      title: "Natura della risorsa",
      text: "Il ferro è una delle materie fondamentali di Abisso Infinito. Ogni giocatore può raccoglierlo nelle caselle dedicate alle risorse, conservarlo nello zaino e poi trasferirlo nell’inventario quando raggiunge il mercato o il punto adatto al deposito."
    },
    {
      type: "steps",
      title: "Come funziona la raccolta",
      items: [
        "Raggiungi una casella risorsa dedicata al ferro.",
        "Tira 2 dadi e calcola la somma totale.",
        "Moltiplica il risultato per 2 per conoscere la quantità raccolta.",
        "La risorsa ottenuta viene inserita prima nello zaino.",
        "Quando possibile, deposita il contenuto dello zaino nell’inventario per renderlo utilizzabile."
      ]
    },
    {
      type: "requirements",
      title: "Regole di raccolta",
      checks: [
        { label: "Dadi usati", value: "2d6" },
        { label: "Valore tiro valido", value: "Da 2 a 12" },
        { label: "Quantità ottenuta", value: "Somma dei dadi ×2" },
        { label: "Primo deposito", value: "Zaino" },
        { label: "Uso effettivo", value: "Dopo deposito in inventario" }
      ]
    },
    {
      type: "warning",
      title: "Limite dello zaino",
      text: "Le risorse raccolte non diventano subito disponibili per ogni utilizzo. Prima finiscono nello zaino, che ha uno spazio limitato. Se lo zaino è colmo, non potrai accumulare altro finché non avrai depositato o svuotato il contenuto."
    },
    {
      type: "text",
      title: "Deposito e utilizzo",
      text: "Il ferro raccolto nello zaino deve essere trasferito nell’inventario per entrare davvero nelle disponibilità del giocatore. Solo dopo il deposito potrà essere speso, venduto, impiegato nelle costruzioni o investito nei potenziamenti."
    },
    {
      type: "list",
      title: "A cosa servono le risorse",
      items: [
        "Costruire e sviluppare il villaggio",
        "Assoldare o sostenere lavoratori",
        "Costruire e potenziare caserme",
        "Formare ed espandere l’esercito",
        "Sostenere forgia e miglioramento delle armi",
        "Vendere materiali al mercato per ottenere monete",
        "Acquistare materiali mancanti quando necessario"
      ]
    },
    {
      type: "text",
      title: "Il ruolo del ferro",
      text: "Fra tutte le risorse, il ferro è una delle più preziose per la crescita militare e artigianale. Dove il legno apre la via alle prime strutture, il ferro rafforza ciò che deve durare: armi, difese, costruzioni avanzate e preparazione alla guerra."
    },
    {
      type: "reward",
      title: "Valore strategico",
      text: "Un giocatore che accumula ferro con costanza costruisce le basi della propria potenza. Anche quando non viene usato subito, può essere conservato per future costruzioni, convertito in denaro o trasformato in vantaggio tattico nel lungo periodo."
    },
    {
      type: "warning",
      title: "Errore comune dei novizi",
      text: "Molti raccolgono risorse senza pensare alla gestione. Ma accumulare senza depositare o spendere con criterio rallenta la crescita. Le risorse non servono solo a essere possedute: servono a sostenere il tuo sviluppo nel momento giusto."
    },
    {
      type: "text",
      title: "Consiglio del regno",
      text: "Se sei agli inizi, considera il ferro come una riserva di forza futura. Non sprecarlo subito. Può diventare il fondamento della tua economia, della tua forgia o delle tue ambizioni militari."
    }
  ]
},

pozione_generica: {
  title: "Pozione Generica",
  intro: "Fra alambicchi fumanti, ampolle opache e vapori dai colori innaturali, la Pozione Generica riposa come un dono incostante del destino. Nessuno può sapere con esattezza quale forza risveglierà nel sangue di chi la beve, ma una cosa è certa: ogni sorso cambia il cammino del guerriero.",

  sections: [
    {
      type: "text",
      title: "Natura della pozione",
      text: "La Pozione Generica è un potenziamento gratuito che concede benefici casuali al personaggio. Non segue una sola formula fissa: ogni utilizzo può favorire attributi diversi, rendendola una fonte di crescita imprevedibile ma spesso molto utile."
    },
    {
      type: "steps",
      title: "Come si usa",
      items: [
        "Seleziona il giocatore che deve bere la pozione.",
        "Attiva l’uso della Pozione Generica.",
        "Il sistema estrae casualmente uno dei suoi effetti disponibili.",
        "Gli attributi indicati dalla pozione vengono aumentati.",
        "Il giocatore riceve anche un premio extra in monete."
      ]
    },
    {
      type: "requirements",
      title: "Regole principali",
      checks: [
        { label: "Costo", value: "Gratuita" },
        { label: "Utilizzi massimi", value: "6 per giocatore" },
        { label: "Effetto", value: "Bonus casuali agli attributi" },
        { label: "Premio extra", value: "Monete casuali" }
      ]
    },
    {
      type: "text",
      title: "Effetti della bevanda",
      text: "Ogni pozione può incrementare forza, destrezza, magia, ingegno o astuzia secondo una combinazione già definita dal sistema. Alcune formule distribuiscono piccoli bonus equilibrati, altre concentrano una spinta molto più forte su specifici attributi."
    },
    {
      type: "reward",
      title: "Dono del fato",
      text: "Oltre al potenziamento sugli attributi, ogni utilizzo concede anche un guadagno in denaro. Questo rende la Pozione Generica non solo un aiuto alla crescita del personaggio, ma anche una piccola occasione di arricchimento."
    },
    {
      type: "warning",
      title: "Limite severo",
      text: "Ogni giocatore può bere la Pozione Generica al massimo 6 volte. Dopo il sesto utilizzo, la fonte si considera esaurita per quel personaggio e non può più essere sfruttata."
    },
    {
      type: "warning",
      title: "Potere imprevedibile",
      text: "La pozione non garantisce sempre il tipo di crescita che desideri. A volte favorirà l’attributo che cerchi, altre volte rafforzerà aspetti secondari del personaggio. È una benedizione instabile, non uno strumento di precisione."
    },
    {
      type: "text",
      title: "Quando conviene usarla",
      text: "La Pozione Generica è ideale nelle prime fasi della partita o nei momenti in cui serve una crescita rapida senza spendere risorse. Può aiutare a colmare debolezze, rafforzare un personaggio ancora acerbo o regalare un vantaggio inatteso prima di una prova importante."
    },
    {
      type: "text",
      title: "Consiglio per i nuovi giocatori",
      text: "Non aspettare sempre il momento perfetto. Poiché la pozione è gratuita ma limitata, spesso conviene sfruttarla quando il tuo personaggio ha ancora molto margine di crescita, così ogni beneficio ottenuto avrà un impatto più grande sul viaggio."
    }
  ]
},

pozione_leggendaria: {
  title: "Pozione Leggendaria",
  intro: "Custodita come reliquia fra le mani degli speziali più esperti, la Pozione Leggendaria non è una semplice mistura, ma un distillato di sopravvivenza. Il suo liquido brilla come brace viva e chi la beve sente tornare nelle vene una forza che pare strappata agli dèi della guerra.",

  sections: [
    {
      type: "text",
      title: "Natura della pozione",
      text: "La Pozione Leggendaria è una riserva preziosa di recupero, pensata per i momenti in cui il corpo del guerriero vacilla e la battaglia non concede tregua. Non serve a potenziare gli attributi, ma a restituire vigore e resistenza a chi è stato logorato dal viaggio o dallo scontro."
    },
    {
      type: "steps",
      title: "Come funziona",
      items: [
        "Seleziona il giocatore che deve usare la pozione.",
        "Acquista la Pozione Leggendaria pagando il suo costo attuale.",
        "L’effetto viene applicato subito al personaggio.",
        "La salute viene ripristinata.",
        "Anche la stamina viene recuperata in aggiunta."
      ]
    },
    {
      type: "requirements",
      title: "Regole principali",
      checks: [
        { label: "Salute ripristinata", value: "150" },
        { label: "Stamina ripristinata", value: "In proporzione alla cura" },
        { label: "Costo base", value: "2000 monete" },
        { label: "Trasportabile", value: "No" },
        { label: "Prezzo successivo", value: "Raddoppia a ogni acquisto" }
      ]
    },
    {
      type: "text",
      title: "Effetto immediato",
      text: "La Pozione Leggendaria agisce nell’istante stesso in cui viene bevuta. Non viene conservata nello zaino né accumulata come scorta: il suo potere si riversa subito nel corpo del personaggio, restaurando la salute e rinvigorendo la stamina."
    },
    {
      type: "warning",
      title: "Prezzo crescente",
      text: "Ogni volta che lo stesso giocatore acquista di nuovo questa pozione, il suo costo aumenta in modo brutale. Il primo acquisto è oneroso, i successivi diventano sempre più pesanti per le casse del personaggio."
    },
    {
      type: "warning",
      title: "Non è una risorsa infinita",
      text: "Affidarsi troppo alla Pozione Leggendaria può diventare un errore strategico. È potente, ma il suo prezzo crescente la rende una soluzione da usare con criterio e non una scorciatoia continua."
    },
    {
      type: "reward",
      title: "Valore strategico",
      text: "Usata nel momento giusto, questa pozione può salvare una spedizione, permettere di affrontare un nuovo scontro senza ritirata o sostenere un personaggio in una fase critica della partita."
    },
    {
      type: "text",
      title: "Quando conviene usarla",
      text: "Conviene ricorrere alla Pozione Leggendaria quando il tuo personaggio è vicino al limite e una sconfitta comprometterebbe il turno, la progressione o una prova importante. È una medicina da guerra, non un lusso da sprecare."
    },
    {
      type: "text",
      title: "Consiglio del veterano",
      text: "Chi amministra bene le proprie monete non beve questa pozione alla prima ferita. La conserva per i momenti in cui continuare a combattere vale più dell’oro speso per restare in piedi."
    }
  ]
},

guerrieri_oscuri: {
  title: "Guerrieri Oscuri",
  intro: "Dalle profondità dove la luce non osa posarsi, emergono i Guerrieri Oscuri. Non sono semplici soldati, ma anime forgiate nell’ombra, addestrate a combattere senza pietà e senza paura. Ogni loro passo lascia dietro di sé silenzio… e rovina.",

  sections: [
    {
      type: "text",
      title: "Origine della banda",
      text: "Si narra che questi guerrieri siano stati scelti da forze antiche e corrotti lentamente, fino a perdere ogni legame con il mondo degli uomini. Combattono con disciplina assoluta e una freddezza che li rende tra gli avversari più pericolosi del regno."
    },
    {
      type: "requirements",
      title: "Requisiti per affrontarli",
      checks: [
        { label: "XP minimi", value: "400" },
        { label: "Stamina richiesta", value: "Almeno 50" },
        { label: "Tentativi massimi", value: "6" },
        { label: "Cooldown", value: "5 minuti tra una sfida e l’altra" }
      ]
    },
    {
      type: "steps",
      title: "Come funziona la sfida",
      items: [
        "Scegli il giocatore che affronta la banda.",
        "Inserisci il tuo tiro dadi (tra 2 e 12).",
        "La banda tira automaticamente in base alla sua potenza.",
        "Confronta i risultati per determinare l’esito.",
        "Indipendentemente dal risultato, perdi 50 stamina."
      ]
    },
    {
      type: "text",
      title: "Esito dello scontro",
      text: "Se il tuo tiro supera quello della banda, ottieni la vittoria. Se il margine è elevato, la vittoria diventa schiacciante e garantisce premi maggiori. In caso di pareggio ottieni un piccolo prestigio, mentre la sconfitta rafforza la banda e ti espone al saccheggio."
    },
    {
      type: "reward",
      title: "Ricompense",
      text: "Sconfiggere i Guerrieri Oscuri garantisce una ricompensa di 23000 monete, prestigio e materiali. Le vittorie più nette offrono bottini superiori e risorse aggiuntive utili alla crescita del tuo dominio."
    },
    {
      type: "warning",
      title: "Conseguenze della sconfitta",
      text: "Se fallisci, la banda diventa più forte aumentando la propria potenza. Inoltre può saccheggiare le tue ricchezze, sottraendo monete e oro in base alla sua forza crescente."
    },
    {
      type: "warning",
      title: "Limiti e fatica",
      text: "Ogni giocatore può affrontare questa banda al massimo 6 volte. Dopo ogni scontro dovrai attendere prima di tentare di nuovo. La fatica della battaglia è reale e limita la tua capacità di insistere."
    },
    {
      type: "warning",
      title: "Scala di potenza della banda",
      text: "I Guerrieri Oscuri iniziano con un tiro massimo di 12. Ogni sconfitta aumenta questo valore di 1. Non esiste un limite massimo: se continui a perdere, la banda diventerà progressivamente quasi impossibile da battere."
    },
    {
      type: "text",
      title: "Reclutare la banda",
      text: "Una volta sconfitti, i Guerrieri Oscuri possono essere reclutati al tuo servizio. Tuttavia, richiedono un tributo: 80 oro e 18 diamanti. Solo chi ha dimostrato superiorità può piegarli al proprio comando."
    },
    {
      type: "reward",
      title: "Potere della banda",
      text: "Quando la banda viene reclutata, i suoi attributi vengono aggiunti al tuo personaggio, aumentando drasticamente la tua potenza complessiva e rendendoti una minaccia per chiunque osi sfidarti."
    },
    {
      type: "warning",
      title: "Regola importante",
      text: "Puoi controllare una sola banda alla volta. Per ottenerne un’altra, dovrai prima liberarti di quella attuale."
    },
    
    {
      type: "text",
      title: "Consiglio strategico",
      text: "I Guerrieri Oscuri rappresentano un punto di svolta. Affrontali solo quando il tuo personaggio è pronto, perché una sconfitta ripetuta li renderà sempre più pericolosi… mentre una vittoria ti proietterà tra i dominatori del regno."
    }
  ]
},

porta_dei_teschi: {
  title: "Porta dei Teschi",
  intro: "Fra pietre annerite dal tempo e cavità scolpite come volti dannati, la Porta dei Teschi si erge come una soglia maledetta. Chiunque la osservi troppo a lungo avverte un peso sul petto, come se mille anime osservassero in silenzio il suo giudizio. Non è un semplice passaggio: è una prova per coloro che osano sfidare il terrore antico.",

  sections: [
    {
      type: "text",
      title: "Natura del percorso",
      text: "La Porta dei Teschi è un percorso di difficoltà alta. Quando viene affrontata, il giocatore non incontra una prova fissa, ma uno tra diversi eventi casuali legati alla maledizione della soglia, agli spiriti, alle ombre e ai teschi giudicanti."
    },
    {
      type: "steps",
      title: "Come si affronta",
      items: [
        "Il giocatore tira prima un dado contro il Master.",
        "Se il giocatore vince il confronto iniziale, affronta solo l’evento del percorso.",
        "Se il giocatore perde il confronto iniziale, affronta l’evento ma con l’opposizione del Master.",
        "Viene poi generato un evento casuale della Porta dei Teschi.",
        "L’esito finale dipende dalla prova generata e dalla modalità in cui il giocatore è arrivato all’evento."
      ]
    },
    {
      type: "requirements",
      title: "Regole del percorso",
      checks: [
        { label: "Difficoltà", value: "Difficile" },
        { label: "Ingresso alla prova", value: "Confronto dado giocatore vs Master" },
        { label: "Esito favorevole", value: "Evento affrontato da solo" },
        { label: "Esito sfavorevole", value: "Evento affrontato contro il Master" },
        { label: "Completamento", value: "Una sola volta per giocatore" }
      ]
    },
    {
      type: "text",
      title: "Primo giudizio della soglia",
      text: "Prima ancora che l’evento si manifesti, la Porta dei Teschi pretende un confronto iniziale. Questo primo tiro rappresenta il favore del destino: se il giocatore prevale, affronta solo la minaccia del luogo; se fallisce, il Master entra nel conflitto e rende la prova molto più ostile."
    },
    {
      type: "text",
      title: "Eventi possibili",
      text: "Fra le prove della Porta dei Teschi si celano eventi come I Sussurri dei Teschi, Occhi di Fiamma, Giudizio degli Spiriti, Le Ombre che Strisciano, Guardiani Spirituali, Prova di Astuzia, Vento del Passato, Teschi del Giudizio e Maledizione della Porta. Ogni evento possiede una sua forza, una sua atmosfera e ricompense o penalità differenti."
    },
    {
      type: "warning",
      title: "Forza dell’evento",
      text: "Ogni evento non ha una potenza fissa: viene generato con una forza variabile entro un intervallo prestabilito. Questo significa che anche la stessa prova può risultare più gestibile o molto più feroce a seconda del momento in cui viene affrontata."
    },
    {
      type: "text",
      title: "Evento semplice o evento col Master",
      text: "Quando il giocatore vince il dado iniziale, affronta la prova nella sua forma diretta, contro il solo evento. Quando invece perde il dado iniziale, il Master partecipa allo scontro e altera l’equilibrio della prova, rendendola più imprevedibile e pericolosa."
    },
    {
      type: "reward",
      title: "Premi del successo",
      text: "Se il giocatore supera l’evento, ottiene i benefici indicati da quella specifica prova, come denaro, crescita di attributi e prestigio di percorso. Chi supera la Porta dei Teschi conquista non solo bottino, ma anche riconoscimento."
    },
    {
      type: "warning",
      title: "Prezzo del fallimento",
      text: "Se il giocatore fallisce, subisce le penalità dell’evento: perdita di salute, stamina e talvolta riduzione degli attributi. Se la prova è stata affrontata contro il Master, il rischio di uscire spezzati dal giudizio della porta è ancora maggiore."
    },
    {
      type: "warning",
      title: "Regola importante",
      text: "Un giocatore che ha già completato questo percorso non può affrontarlo di nuovo. La Porta dei Teschi mette alla prova una sola volta: dopo il giudizio, la soglia resta chiusa a chi ha già dimostrato il proprio valore."
    },
    {
      type: "text",
      title: "Consiglio del viandante",
      text: "La Porta dei Teschi non premia soltanto la forza. Qui conta anche saper vincere il primo confronto col Master, perché è quello che decide se entrerai nella prova con un sentiero più pulito… oppure con il buio contro di te."
    }
  ]
},

pozione_cura_piccola: {
  title: "Pozione di Cura Piccola",
  intro: "Una semplice ampolla dal liquido tenue, spesso sottovalutata dai guerrieri più esperti. Eppure, nei momenti di bisogno, anche la più modesta delle cure può fare la differenza tra continuare il viaggio… o cadere lungo il cammino.",

  sections: [
    {
      type: "text",
      title: "Natura della pozione",
      text: "La Pozione di Cura Piccola è un rimedio rapido e accessibile per recuperare salute e mantenere il personaggio in gioco. È pensata per essere usata con facilità, senza richiedere grandi sacrifici economici."
    },
    {
      type: "steps",
      title: "Come si usa",
      items: [
        "Acquista la pozione dal punto disponibile.",
        "Assegna la pozione al giocatore selezionato.",
        "L’effetto viene applicato subito al momento dell’uso.",
        "La salute viene ripristinata immediatamente.",
        "Anche la stamina recupera una parte proporzionata."
      ]
    },
    {
      type: "requirements",
      title: "Regole principali",
      checks: [
        { label: "Salute ripristinata", value: "50" },
        { label: "Stamina ripristinata", value: "In proporzione alla cura" },
        { label: "Costo", value: "50 monete" },
        { label: "Trasportabile", value: "No, per ora uso immediato" }
      ]
    },
    {
      type: "text",
      title: "Effetto della cura",
      text: "Una volta utilizzata, la pozione ripristina immediatamente una parte della salute del personaggio e contribuisce anche al recupero della stamina, permettendo di continuare il viaggio o affrontare nuove prove."
    },
    {
      type: "reward",
      title: "Utilità costante",
      text: "Grazie al suo costo contenuto, questa pozione rappresenta una risorsa fondamentale per la sopravvivenza. Anche una cura modesta, usata al momento giusto, può evitare una sconfitta o sostenere il personaggio nel tratto successivo del cammino."
    },
    {
      type: "warning",
      title: "Uso immediato",
      text: "Per ora questa pozione non viene trasportata nello zaino. Quando viene acquistata o usata, il suo effetto si applica subito e non viene conservata come scorta."
    },
    {
      type: "warning",
      title: "Non sottovalutarla",
      text: "Molti guerrieri inesperti ignorano le cure minori, cercando solo rimedi più potenti. Ma spesso è proprio una piccola cura al momento giusto a permettere di vincere uno scontro o completare un percorso."
    },
    {
      type: "text",
      title: "Quando conviene usarla",
      text: "Conviene usarla quando la salute scende ma non è ancora in stato critico, così da mantenere stabilità e non arrivare impreparati alle prove più dure."
    },
    {
      type: "text",
      title: "Consiglio del veterano",
      text: "Non aspettare sempre l’ultimo respiro. Un guerriero prudente preferisce restare saldo lungo il cammino, invece di rischiare tutto sperando in una cura più grande."
    }
  ]
},

banca_regno: {
  title: "Banca del Regno",
  intro: "Nel cuore del Distretto Aureo sorge la Banca del Regno, una fortezza di pietra, ferro e sigilli, dove il denaro decide il destino degli uomini quanto la spada decide il destino dei campi di battaglia. Qui i ricchi si fanno più ricchi, i disperati si indebitano, e i folli tentano la sorte sfidando le guardie e le leggi del regno.",

  sections: [
    {
      type: "text",
      title: "Natura del luogo",
      text: "La Banca del Regno è il centro finanziario del gioco. Qui un giocatore può depositare oro come garanzia, chiedere prestiti in monete, chiudere i propri debiti, ritirare l’oro depositato, tentare una rapina organizzata o pagare una cauzione per liberarsi dalla prigione."
    },
    {
      type: "list",
      title: "Cosa puoi fare",
      items: [
        "Depositare oro come garanzia",
        "Richiedere un prestito in monete",
        "Chiudere un prestito attivo",
        "Ritirare l’oro depositato",
        "Tentare una rapina alla banca",
        "Pagare una cauzione per uscire di prigione"
      ]
    },
    {
      type: "requirements",
      title: "Regole del prestito",
      checks: [
        { label: "Garanzia", value: "Oro depositato" },
        { label: "Prestito massimo", value: "3000 monete per ogni oro depositato" },
        { label: "Interesse", value: "+20%" },
        { label: "Durata rimborso", value: "5 turni" },
        { label: "Valore oro per emergenza", value: "1 oro = 500 monete" }
      ]
    },
    {
      type: "steps",
      title: "Come funziona il deposito",
      items: [
        "Seleziona il giocatore.",
        "Deposita una quantità di oro nella banca.",
        "L’oro depositato viene bloccato come garanzia.",
        "In base all’oro depositato si sblocca il limite massimo di prestito.",
        "L’oro depositato può maturare interessi nel tempo."
      ]
    },
    {
      type: "text",
      title: "Prestiti e debiti",
      text: "Quando chiedi un prestito, ricevi immediatamente monete, ma la banca registra un debito maggiorato dagli interessi. Il rimborso viene distribuito in rate nei turni successivi. Se possiedi denaro sufficiente, la rata viene pagata automaticamente; altrimenti la banca tenterà di compensare usando il tuo oro libero."
    },
    {
      type: "warning",
      title: "Insolvenza",
      text: "Se il giocatore non riesce a pagare né in monete né in oro, viene considerato insolvente. In quel caso la banca non tratta più con clemenza: il personaggio finisce in prigione per 2 turni."
    },
    {
      type: "reward",
      title: "Interessi sul deposito",
      text: "L’oro lasciato in banca non resta immobile. Col passare dei turni genera un rendimento, che si accumula gradualmente fino a trasformarsi in nuovo oro libero per il giocatore."
    },
    {
      type: "warning",
      title: "Ritiro della garanzia",
      text: "L’oro depositato non può essere ritirato se esiste ancora un prestito attivo non estinto. Solo quando il debito è completamente chiuso la garanzia torna nelle mani del proprietario."
    },
    {
      type: "text",
      title: "Rapina alla banca",
      text: "La rapina è una delle azioni più rischiose del regno. Per tentarla servono tre giocatori con ruoli distinti: Capo, Braccio destro e Palo. Se intervengono le guardie, la rapina si trasforma in uno scontro diretto tra banditi e difensori della banca."
    },
    {
      type: "requirements",
      title: "Regole della rapina",
      checks: [
        { label: "Banditi richiesti", value: "3 giocatori" },
        { label: "Ruoli", value: "Capo, Braccio destro, Palo" },
        { label: "Guardie", value: "Da 1 a 3 giocatori" },
        { label: "Tiro banda", value: "Totale 6d6" },
        { label: "Tiro guardie", value: "2d6 per ogni guardia" }
      ]
    },
    {
      type: "text",
      title: "Esiti della rapina",
      text: "Se la banda supera la resistenza delle guardie, può ottenere un successo normale o perfino critico, con una forte ricompensa in monete distribuita fra i tre complici. Se invece fallisce, i rapinatori possono finire in prigione con pene diverse in base al ruolo ricoperto."
    },
    {
      type: "warning",
      title: "Ruoli e conseguenze",
      text: "Il Capo corre il rischio maggiore, il Braccio destro condivide gran parte della responsabilità, mentre il Palo subisce pene più leggere. Più grave è il fallimento, più lunga sarà la permanenza in prigione."
    },
    {
      type: "text",
      title: "Cauzione",
      text: "Un detenuto può essere liberato prima del termine della pena pagando una cauzione in monete. Il costo dipende dai turni di prigione rimanenti: più è lunga la pena, più cara sarà la libertà."
    },
    {
      type: "warning",
      title: "Consiglio per i nuovi giocatori",
      text: "La banca può accelerare enormemente la crescita di un personaggio, ma punisce chi agisce senza calcolo. Deposita oro se vuoi costruire potere economico, chiedi prestiti solo se sai come ripagarli, e tenta una rapina soltanto se sei pronto ad accettare il prezzo del fallimento."
    }
  ]
},

raccolta_rame: {
  title: "Rame",
  intro: "Nascosto fra vene rossastre e pietre che sembrano ancora custodire il calore della terra, il rame è un dono silenzioso ma prezioso. Non possiede la durezza del ferro né il prestigio dell’oro, eppure molti regni sono cresciuti proprio grazie a chi ha saputo estrarlo, conservarlo e impiegarlo con saggezza.",

  sections: [
    {
      type: "text",
      title: "Natura della risorsa",
      text: "Il rame è una materia utile e versatile, raccolta nelle caselle dedicate alle risorse. Come tutte le risorse principali, viene ottenuto con il tiro dei dadi, conservato nello zaino e reso davvero disponibile solo dopo il deposito nell’inventario."
    },
    {
      type: "steps",
      title: "Come funziona la raccolta",
      items: [
        "Raggiungi una casella risorsa dedicata al rame.",
        "Tira 2 dadi e calcola la somma totale.",
        "Moltiplica il risultato per 2 per conoscere la quantità raccolta.",
        "Il rame ottenuto viene inserito prima nello zaino.",
        "Deposita il contenuto dello zaino nell’inventario per poter usare davvero la risorsa."
      ]
    },
    {
      type: "requirements",
      title: "Regole di raccolta",
      checks: [
        { label: "Dadi usati", value: "2d6" },
        { label: "Valore tiro valido", value: "Da 2 a 12" },
        { label: "Quantità ottenuta", value: "Somma dei dadi ×2" },
        { label: "Primo deposito", value: "Zaino" },
        { label: "Uso effettivo", value: "Dopo deposito in inventario" }
      ]
    },
    {
      type: "warning",
      title: "Limite dello zaino",
      text: "Il rame raccolto non è subito pronto all’uso. Prima occupa spazio nello zaino, che è condiviso con le altre risorse e ha una capienza limitata. Se lo zaino è pieno, dovrai depositare prima di continuare a raccogliere."
    },
    {
      type: "text",
      title: "Deposito e disponibilità",
      text: "Solo una volta trasferito nell’inventario il rame entra davvero tra le risorse spendibili del giocatore. Da quel momento può essere impiegato nelle attività del regno, nelle strutture, nella crescita economica o nelle operazioni di mercato."
    },
    {
      type: "list",
      title: "A cosa servono le risorse",
      items: [
        "Costruire e sviluppare il villaggio",
        "Assoldare o mantenere lavoratori",
        "Costruire e potenziare caserme",
        "Formare ed espandere l’esercito",
        "Sostenere forgia e miglioramenti",
        "Vendere materiali al mercato",
        "Comprare risorse mancanti quando necessario"
      ]
    },
    {
      type: "text",
      title: "Il ruolo del rame",
      text: "Il rame è spesso il materiale del progresso silenzioso. Non è sempre al centro dell’attenzione, ma si rivela decisivo quando serve sostenere la crescita, completare strutture o mantenere equilibrio tra raccolta, commercio e sviluppo."
    },
    {
      type: "reward",
      title: "Valore strategico",
      text: "Accumulare rame con costanza offre stabilità. Può diventare una riserva preziosa da impiegare nelle costruzioni, una merce utile da vendere o una base intermedia per sostenere i progetti più ambiziosi del tuo dominio."
    },
    {
      type: "warning",
      title: "Errore comune dei novizi",
      text: "Molti giocatori cercano solo ferro, oro o diamanti e trascurano il rame. Ma chi ignora le risorse intermedie spesso si ritrova bloccato quando serve completare una costruzione, sostenere un villaggio o bilanciare la propria economia."
    },
    {
      type: "text",
      title: "Consiglio del regno",
      text: "Non guardare il rame come una risorsa minore. In mani sagge, ciò che sembra umile diventa fondamento. Un regno solido non si costruisce solo con metalli gloriosi, ma anche con materiali affidabili e ben amministrati."
    }
  ]
},

mostro_ghiaccio: {
  title: "Mostro di Ghiaccio",
  intro: "Nelle terre dove il vento non porta più vita ma solo silenzio, si muove il Mostro di Ghiaccio. Non è nato… è stato forgiato dal gelo stesso, una creatura che non respira, non sanguina e non prova pietà. Ogni passo congela la terra, ogni sguardo rallenta il cuore di chi osa affrontarlo.",

  sections: [
    {
      type: "text",
      title: "Origine della creatura",
      text: "Si dice che il Mostro di Ghiaccio sia nato da un antico incantesimo fallito, quando un mago cercò di dominare l’essenza del gelo eterno. Il risultato fu una creatura senza volontà propria, ma con un solo scopo: fermare chiunque osi attraversare il suo dominio."
    },
    {
      type: "requirements",
      title: "Identità del mostro",
      checks: [
        { label: "Categoria", value: "Mostro Minore" },
        { label: "Difficoltà", value: "Difficile" },
        { label: "Livello", value: "1" },
        { label: "Potenza Totale", value: "900" },
        { label: "Salute", value: "60" }
      ]
    },
    {
      type: "requirements",
      title: "Distribuzione del Potere",
      checks: [
        { label: "Forza", value: "120" },
        { label: "Astuzia", value: "80" },
        { label: "Ingegno", value: "180" },
        { label: "Magia", value: "240" },
        { label: "Destrezza", value: "280" }
      ]
    },
    {
      type: "requirements",
      title: "Accesso ai mostri",
      checks: [
        { label: "Per Mostri Minori", value: "Serve almeno 1 scrigno aperto" },
        { label: "Per Mostri Maggiori", value: "Servono almeno 4 scrigni aperti" }
      ]
    },
    {
      type: "warning",
      title: "Sigillo d’accesso",
      text: "Nessun guerriero può sfidare liberamente le creature del regno. Per affrontare un Mostro Minore devi aver già aperto almeno uno scrigno durante la partita. I Mostri Maggiori, invece, si concedono solo a chi ha già spezzato il sigillo di quattro scrigni."
    },
    {
      type: "text",
      title: "Stile di combattimento",
      text: "Il Mostro di Ghiaccio non attacca con furia cieca, ma con precisione glaciale. Ogni suo movimento è lento ma inevitabile, ogni colpo sembra calcolato per logorare il nemico. Non è la velocità a renderlo pericoloso, ma la sua capacità di resistere e adattarsi."
    },
    {
      type: "text",
      title: "La minaccia del gelo",
      text: "Chi affronta questa creatura percepisce subito un cambiamento: il corpo si irrigidisce, i movimenti rallentano e la mente fatica a restare lucida. Il gelo non è solo un elemento… è un ostacolo che indebolisce chi non è preparato."
    },
    {
      type: "steps",
      title: "Come affrontarlo",
      items: [
        "Seleziona il giocatore che combatterà.",
        "Verifica di aver aperto almeno 1 scrigno, requisito necessario per i mostri minori.",
        "Scegli da 1 a 5 attributi da utilizzare nello scontro.",
        "Inserisci i risultati dei dadi per ogni attributo scelto.",
        "Confronta la tua potenza con quella del mostro per determinare l’esito."
      ]
    },
    {
      type: "warning",
      title: "Perché è pericoloso",
      text: "Il Mostro di Ghiaccio ha un equilibrio tra attacco e difesa che lo rende imprevedibile. Non eccelle in un solo aspetto, ma non ha nemmeno punti deboli evidenti. Sottovalutarlo porta spesso a sconfitte inattese."
    },
    {
      type: "reward",
      title: "Ricompense",
      text: "Sconfiggere il Mostro di Ghiaccio garantisce 12400 monete e una crescita importante della forza. Il gelo temprato della battaglia si trasforma in potere per il guerriero che sopravvive."
    },
    {
      type: "text",
      title: "Crescita del mostro",
      text: "Se non viene sconfitto completamente, il Mostro di Ghiaccio evolve. I suoi attributi aumentano progressivamente, rendendo ogni tentativo successivo più difficile del precedente."
    },
    {
      type: "warning",
      title: "Usura e fatica",
      text: "Affrontare questa creatura comporta un consumo di stamina e un deterioramento dell’equipaggiamento. Anche in caso di vittoria, il prezzo dello scontro si farà sentire."
    },
    {
      type: "text",
      title: "Consiglio del veterano",
      text: "Non affrontare il gelo con leggerezza. Il Mostro di Ghiaccio non punisce l’errore… lo congela. Preparati, scegli bene gli attributi e non affidarti solo alla forza: qui serve equilibrio."
    }
  ]
},

mercato_regno: {
  title: "Mercato del Regno",
  intro: "Fra banchi carichi di merci, monete che tintinnano e mercanti dalle lingue affilate, il Mercato del Regno è il luogo dove il viandante trasforma bottino in potere. Qui si mangia, si commercia, si svuota lo zaino, si assoldano uomini per il villaggio e si gettano le basi per aprire gli scrigni più ambiti del regno.",

  sections: [
    {
      type: "text",
      title: "Natura del luogo",
      text: "Il mercato non è soltanto un punto di scambio. È il centro vivo dell’economia del giocatore. Qui puoi nutrirti, depositare le risorse raccolte, vendere materiali, comprare ciò che ti manca, gestire i lavoratori del villaggio e preparare strumenti preziosi come le chiavi per gli scrigni."
    },
    {
      type: "list",
      title: "Cosa puoi fare al mercato",
      items: [
        "Mangiare le pietanze semplici disponibili al banco",
        "Depositare le risorse dallo zaino all’inventario",
        "Vendere materiali per ottenere monete",
        "Comprare materiali mancanti",
        "Assoldare lavoratori del villaggio",
        "Licenziare lavoratori attivi",
        "Forgiare chiavi per aprire gli scrigni",
        "Preparare lo zaino per affrontare il Dungeon"
      ]
    },
    {
      type: "warning",
      title: "Cibo: mercato e locanda non sono uguali",
      text: "Nel mercato il giocatore può consumare solo le pietanze semplici, dalla Carne Arrosto in poi. I pasti completi come Cena del Viandante, Pranzo del Cavaliere, Merenda del Mercante e Spuntino del Monaco appartengono alla locanda e non possono essere acquistati qui."
    },
    {
      type: "requirements",
      title: "Pietanze disponibili al mercato",
      checks: [
        { label: "Carne Arrosto", value: "+70 fame, +30 salute, +20 stamina, +25 forza — 120 monete" },
        { label: "Zuppa Rustica", value: "+60 fame, +25 salute, +20 stamina, +15 forza — 100 monete" },
        { label: "Formaggio Stagionato", value: "+40 fame, +20 salute, +15 stamina, +10 forza — 90 monete" },
        { label: "Pane Nero", value: "+20 fame, +5 salute, +5 stamina, +5 forza — 30 monete" },
        { label: "Pesce Affumicato", value: "+50 fame, +20 salute, +15 stamina, +15 forza — 110 monete" },
        { label: "Frutta Secca e Miele", value: "+30 fame, +10 salute, +20 stamina, +5 forza — 70 monete" },
        { label: "Idromele", value: "+10 fame, +5 salute, +10 stamina, +5 forza — 60 monete" },
        { label: "Birra Scura", value: "+5 fame, +5 salute, +5 stamina, +5 forza — 50 monete" }
      ]
    },
    {
      type: "warning",
      title: "Prezzo del cibo",
      text: "Le pietanze hanno un costo personale crescente: ogni acquisto dello stesso cibo da parte dello stesso giocatore fa aumentare il prezzo successivo. Conviene quindi mangiare con criterio e non abusare sempre dello stesso pasto."
    },
    {
      type: "text",
      title: "Deposito dello zaino",
      text: "Le risorse raccolte nel mondo finiscono prima nello zaino. Il mercato è il luogo in cui puoi trasferirle davvero nell’inventario. Finché restano nello zaino occupano spazio e rischiano di bloccare nuove raccolte. Lo zaino ha capienza mista massima di 50 unità, mentre l’inventario non ha limite pratico. "
    },
    {
      type: "steps",
      title: "Come gestire le risorse",
      items: [
        "Raccogli le risorse nel mondo con il tiro di 2d6.",
        "Le risorse ottenute finiscono nello zaino.",
        "Raggiungi il mercato.",
        "Deposita il contenuto dello zaino nell’inventario.",
        "Da lì puoi vendere o comprare materiali secondo i tuoi bisogni."
      ]
    },
    {
      type: "requirements",
      title: "Prezzi di vendita materiali",
      checks: [
        { label: "Legno", value: "50 monete" },
        { label: "Ferro", value: "100 monete" },
        { label: "Rame", value: "300 monete" },
        { label: "Diamanti", value: "500 monete" },
        { label: "Oro", value: "1000 monete" }
      ]
    },
    {
      type: "requirements",
      title: "Prezzi di acquisto materiali",
      checks: [
        { label: "Legno", value: "100 monete" },
        { label: "Ferro", value: "200 monete" },
        { label: "Rame", value: "600 monete" },
        { label: "Diamanti", value: "1000 monete" },
        { label: "Oro", value: "2000 monete" }
      ]
    },
    {
      type: "text",
      title: "Commercio e strategia",
      text: "Vendere risorse permette di convertire il raccolto in denaro liquido, mentre comprare materiali consente di colmare le mancanze senza dover attendere nuova raccolta. Il mercato è quindi il luogo dove il giocatore decide se monetizzare subito o investire per costruzioni, forgia e progresso. "
    },
    {
      type: "requirements",
      title: "Lavoratori assoldabili",
      checks: [
        { label: "Boscaiolo", value: "200 monete" },
        { label: "Fabbro", value: "400 monete" },
        { label: "Minatore Rame", value: "500 monete" },
        { label: "Cercatore Oro", value: "800 monete" },
        { label: "Cercatore Diamanti", value: "600 monete" }
      ]
    },
    {
      type: "text",
      title: "Assoldare lavoratori",
      text: "Dal mercato puoi inviare uomini al villaggio per la produzione automatica controllata. Ogni tipo di lavoratore genera una risorsa specifica e contribuisce alla crescita economica nel tempo. Tuttavia il villaggio ha un limite massimo di lavoratori, determinato dal suo livello. "
    },
    {
      type: "warning",
      title: "Licenziare costa",
      text: "Un lavoratore non può essere scacciato senza prezzo. Il licenziamento richiede un’indennità pari a tre volte il costo di assunzione. Conviene quindi scegliere bene chi arruolare, perché correggere un errore pesa sulle casse del regno. "
    },
    {
      type: "text",
      title: "Forgia delle chiavi",
      text: "Il mercato è anche un punto cruciale per la preparazione agli scrigni. Come da regola del tuo mondo, qui il giocatore può forgiare le chiavi necessarie per aprirli. Le chiavi non sono solo oggetti utili: sono strumenti di accesso al bottino, alla progressione e a molte delle sfide più importanti del gioco."
    },
    {
  type: "text",
  title: "Preparazione al Dungeon",
  text: "Il mercato è anche l’ultimo luogo sicuro in cui prepararsi prima di scendere nel Dungeon. Una volta oltrepassata la soglia, non potrai più acquistare risorse, pozioni o cibo: potrai consumare soltanto ciò che hai già caricato nello zaino."
},
{
  type: "requirements",
  title: "Scorte acquistabili per il Dungeon",
  checks: [
    { label: "Fiala Salute", value: "+100 salute — 5000 monete — max 3 nello zaino" },
    { label: "Fiala Stamina", value: "+100 stamina — 5000 monete — max 3 nello zaino" },
    { label: "Pozione Rigenerante", value: "Rigenerazione completa — 10000 monete — max 3 nello zaino" },
    { label: "Pane elfico", value: "+50 fame — 5000 monete" },
    { label: "Carne affumicata", value: "+50 fame — 5000 monete" },
    { label: "Frutta luminosa", value: "+50 fame — 5000 monete" }
  ]
},
{
  type: "warning",
  title: "Regola del Dungeon",
  text: "Nel Dungeon non esistono banchi, mercanti o rifornimenti. Nessuna risorsa di alcun tipo può essere acquistata una volta entrati. Sopravvive meglio chi ha avuto la saggezza di preparare lo zaino prima della discesa."
},
{
  type: "text",
  title: "Lo zaino del viandante",
  text: "Preparare bene lo zaino significa decidere in anticipo quanto rischio affrontare. Pozioni e cibo caricati al mercato diventano la tua unica riserva nel Dungeon. Una cattiva preparazione può trasformare una buona spedizione in una ritirata disperata."
},
    {
      type: "reward",
      title: "Valore strategico del mercato",
      text: "Un giocatore che domina il mercato domina il ritmo della partita. Qui trasforma raccolta in monete, monete in lavoratori, lavoratori in produzione, produzione in crescita, e crescita in accesso a scrigni, forgia e sviluppo del regno."
    },
    {
      type: "text",
      title: "Consiglio del mercante anziano",
      text: "Non spendere tutto appena incassi, ma non accumulare senza scopo. Il mercato premia chi sa bilanciare fame, materiali, lavoro e opportunità. Ogni moneta spesa bene qui prepara una vittoria altrove."
    }
  ]
},

caserma_regno: {
  title: "Caserma del Regno",
  intro: "Fra tamburi di guerra, acciaio battuto e ordini gridati all’alba, la Caserma del Regno è il luogo in cui il semplice villaggio smette di essere una dimora… e comincia a diventare una forza armata. Qui si forgiano le file dell’esercito, si spendono risorse per il futuro e si decide quanto potere militare potrà un giorno marciare sotto il tuo stendardo.",

  sections: [
    {
      type: "text",
      title: "Natura del luogo",
      text: "La caserma è il centro dell’addestramento militare. Qui il giocatore costruisce la propria struttura bellica, la potenzia nel tempo e converte denaro e materiali in soldati, potenza esercito e comando strategico."
    },
    {
      type: "list",
      title: "Cosa puoi fare in caserma",
      items: [
        "Costruire la caserma",
        "Potenziare la struttura fino ai livelli più alti",
        "Scegliere il tipo di unità da addestrare",
        "Addestrare da 1 a 10 unità per volta",
        "Aumentare la potenza totale dell’esercito",
        "Sbloccare ufficiale e comandante supremo"
      ]
    },
    {
      type: "warning",
      title: "Prima va costruita",
      text: "Finché la caserma non viene costruita, non può esistere alcun addestramento. La fondazione iniziale richiede materiali base, e solo dopo quella fase il regno può iniziare a reclutare soldati."
    },
    {
      type: "requirements",
      title: "Fondazione e crescita",
      checks: [
        { label: "Costruzione iniziale", value: "500 legno, 300 ferro" },
        { label: "Livello massimo", value: "10" },
        { label: "Prestigio ottenuto", value: "Aumenta con costruzione e upgrade" },
        { label: "Unità per sessione", value: "Da 1 a 10 per addestramento" }
      ]
    },
    {
      type: "text",
      title: "Come funziona l’addestramento",
      text: "Il giocatore sceglie prima il tipo di unità da produrre, poi decide la quantità. Il costo viene pagato subito, mentre il tempo totale dipende dal numero di soldati ordinati moltiplicato per la durata della singola unità."
    },
    {
      type: "steps",
      title: "Procedura di addestramento",
      items: [
        "Seleziona il giocatore.",
        "Verifica che la caserma sia costruita.",
        "Scegli l’unità disponibile in base al livello della caserma.",
        "Imposta una quantità da 1 a 10.",
        "Paga subito monete e materiali.",
        "Attendi il completamento dell’addestramento.",
        "Le unità entrano nell’esercito e ne aumentano la potenza."
      ]
    },
    {
      type: "requirements",
      title: "Unità addestrabili",
      checks: [
        { label: "Livello 1", value: "Recluta — Potenza 5" },
        { label: "Livello 2", value: "Arcere — Potenza 9" },
        { label: "Livello 3", value: "Spadaccino — Potenza 15" },
        { label: "Livello 4", value: "Cavaliere — Potenza 25" },
        { label: "Livello 5", value: "Paladino — Potenza 50" },
        { label: "Livello 6", value: "Guardiano d’Acciaio — Potenza 75" },
        { label: "Livello 7", value: "Mago da Battaglia — Potenza 90" },
        { label: "Livello 8", value: "Assassino Ombra — Potenza 135" },
        { label: "Livello 9", value: "Generale — Potenza 150" },
        { label: "Livello 10", value: "Eroe del Regno — Potenza 200" }
      ]
    },
    {
      type: "text",
      title: "Costo dell’esercito",
      text: "Ogni unità possiede un costo in monete e un costo in materiali. Più il soldato è avanzato, più pesante diventa il tributo richiesto in legno, ferro, rame, diamanti e oro. Costruire un grande esercito senza economia stabile porta facilmente al blocco della produzione."
    },
    {
      type: "warning",
      title: "Tempo e pianificazione",
      text: "L’addestramento non è istantaneo. Le unità piccole richiedono meno tempo, quelle d’élite molto di più. Un comandante saggio non aspetta il momento del bisogno per produrre soldati: prepara il proprio esercito in anticipo."
    },
    {
      type: "reward",
      title: "Potenza esercito",
      text: "Ogni unità completata aumenta il numero totale di soldati e la potenza complessiva dell’esercito. Questa forza accumulata rappresenta una riserva strategica che può influenzare gli scontri e il peso militare del tuo dominio."
    },
    {
      type: "requirements",
      title: "Comando militare avanzato",
      checks: [
        { label: "Ufficiale", value: "Richiede livello 5, almeno 50 soldati, bonus +10%" },
        { label: "Comandante Supremo", value: "Richiede livello 10, almeno 200 soldati, bonus +25%" }
      ]
    },
    {
      type: "text",
      title: "Ufficiale e Comandante Supremo",
      text: "Quando l’esercito cresce abbastanza, la sola quantità non basta più. Serve disciplina. L’Ufficiale migliora l’efficienza della forza armata, mentre il Comandante Supremo trasforma la tua armata in un vero strumento di dominio. Con loro la potenza finale dell’esercito viene moltiplicata dal comando."
    },
    {
      type: "warning",
      title: "Errore comune dei novizi",
      text: "Molti puntano subito ai soldati più forti, ma senza una caserma ben sviluppata e senza risorse adeguate restano bloccati. La potenza militare non nasce solo dall’élite: nasce dalla costruzione ordinata della catena di addestramento."
    },
    {
      type: "text",
      title: "Consiglio del maresciallo",
      text: "Costruisci prima le fondamenta, poi le file, poi il comando. Un esercito improvvisato vince una battaglia, ma un esercito ben cresciuto può sostenere un intero regno."
    }
  ]
},

bande_dei_pirati: {
  title: "Bande dei Pirati",
  intro: "Là dove il commercio si spezza e il viaggio si trasforma in paura, le Bande dei Pirati alzano vessilli corrosi dal sale e dal sangue. Non hanno patria né legge, solo fame di bottino. Dove passano loro, restano carri vuoti, mercanti rovinati e il suono amaro di monete finite in mani sbagliate.",

  sections: [
    {
      type: "text",
      title: "Origine della banda",
      text: "Un tempo erano mercenari, marinai, razziatori e fuorilegge dispersi. Col tempo si unirono sotto un’unica sete di ricchezza, fino a diventare una forza organizzata che vive di assalti, saccheggi e tributi imposti con la violenza. Non combattono per gloria: combattono per prendere ciò che altri hanno costruito."
    },
    {
      type: "requirements",
      title: "Identità della banda",
      checks: [
        { label: "XP minimi", value: "350" },
        { label: "Ricompensa", value: "21500 monete" },
        { label: "Potenza totale", value: "350" },
        { label: "Potenza dadi iniziale", value: "12" },
        { label: "Costo reclutamento", value: "60 oro, 15 diamanti" }
      ]
    },
    {
      type: "requirements",
      title: "Distribuzione del potere",
      checks: [
        { label: "Forza", value: "30" },
        { label: "Astuzia", value: "130" },
        { label: "Ingegno", value: "130" },
        { label: "Magia", value: "10" },
        { label: "Destrezza", value: "50" }
      ]
    },
    {
      type: "steps",
      title: "Come funziona la sfida",
      items: [
        "Scegli il giocatore che affronta la banda.",
        "Inserisci il tuo tiro dadi.",
        "La banda tira automaticamente con un valore casuale fino alla sua potenza dadi massima.",
        "Confronta i risultati per determinare vittoria, sconfitta o pareggio.",
        "Alla fine dello scontro perdi comunque 50 stamina."
      ]
    },
    {
      type: "requirements",
      title: "Regole della sfida",
      checks: [
        { label: "Tentativi massimi", value: "6 per giocatore" },
        { label: "Stamina minima", value: "50" },
        { label: "Cooldown", value: "5 minuti tra una sfida e l’altra" },
        { label: "Reclutamento", value: "Solo dopo averla sconfitta" }
      ]
    },
    {
      type: "text",
      title: "Esito dello scontro",
      text: "Se il tuo tiro supera quello della banda, ottieni la vittoria e spezzi il loro dominio su quella tratta. Se il margine è alto, la vittoria diventa schiacciante e il premio aumenta insieme alle risorse guadagnate. Se invece fallisci, i pirati rispondono come sanno fare meglio: saccheggiando."
    },
    {
      type: "warning",
      title: "Conseguenze della sconfitta",
      text: "Se perdi, la banda si rafforza immediatamente. Il suo tiro massimo aumenta di 1: da 12 passa a 13, poi 14, 15 e così via a ogni sconfitta. Inoltre i pirati ti saccheggiano monete e oro in misura crescente, accumulando il bottino rubato nella propria cassa."
    },
    {
      type: "warning",
      title: "Scala di saccheggio",
      text: "Finché la banda resta a 12, il saccheggio è leggero. Ma quando cresce a 13, 14, 15 o oltre, la quantità di monete e oro che può rubarti aumenta sempre di più. Sfidarla senza preparazione significa arricchire i tuoi nemici."
    },
    {
      type: "reward",
      title: "Ricompense della vittoria",
      text: "Sconfiggere le Bande dei Pirati garantisce 21500 monete. In caso di vittoria ottieni anche prestigio e risorse, mentre nelle vittorie più nette puoi recuperare parte del bottino accumulato nella cassa della banda."
    },
    {
      type: "text",
      title: "Reclutare la banda",
      text: "Una volta sconfitti, i pirati possono essere piegati al tuo servizio. Ma uomini simili non giurano fedeltà per onore: vogliono convenienza, ricchezza e dominio. Per reclutarli devi pagare 60 oro e 15 diamanti, e solo dopo aver dimostrato la tua superiorità in battaglia."
    },
    {
      type: "reward",
      title: "Potere della banda",
      text: "Quando le Bande dei Pirati vengono reclutate, i loro attributi si sommano a quelli del giocatore. Non ottieni soltanto alleati: ottieni una forza opportunista, veloce nel colpire e molto utile per trasformare ricchezza e pressione economica in vantaggio reale."
    },
    {
      type: "warning",
      title: "Regola importante",
      text: "Puoi controllare una sola banda alla volta. Se desideri reclutarne un’altra, devi prima vendere o liberare quella attuale."
    },
    {
      type: "text",
      title: "Consiglio strategico",
      text: "Le Bande dei Pirati sono perfette per chi vuole crescere attraverso denaro, saccheggio e pressione economica. Ma se le sottovaluti, ogni sconfitta le renderà più forti e più ricche… usando proprio le tue risorse."
    }
  ]
},

portale_viaggio: {
  title: "Portale",
  intro: "Nel silenzio tra due mondi si apre il Portale, una soglia di energia antica che piega lo spazio e spezza la distanza. Le sue luci pulsano come un cuore arcano e chi vi si avvicina sente subito che quel passaggio non appartiene alle leggi comuni del cammino.",

  sections: [
    {
      type: "text",
      title: "Natura del luogo",
      text: "Il Portale non è una semplice casella di passaggio, ma un varco strategico che permette di muoversi nella mappa in modo rapido e speciale. Dove gli altri percorrono sentieri, chi domina il Portale attraversa lo spazio con un solo passo."
    },
    {
      type: "text",
      title: "Funzione principale",
      text: "Questa casella serve a spostarsi tra punti differenti della mappa. È uno strumento di mobilità e controllo del territorio, utile per raggiungere più velocemente zone strategiche, risorse, percorsi, bande o obiettivi lontani."
    },
    {
      type: "steps",
      title: "Come si usa",
      items: [
        "Raggiungi la casella Portale.",
        "Attiva il passaggio.",
        "Seleziona la destinazione disponibile.",
        "Completa lo spostamento verso il punto collegato."
      ]
    },
    {
      type: "warning",
      title: "Varco strategico",
      text: "Un Portale non va visto solo come scorciatoia. Usarlo nel momento giusto può farti arrivare prima a una risorsa, sfuggire a una zona sfavorevole o anticipare altri giocatori nella conquista di luoghi importanti."
    },
    {
      type: "text",
      title: "Il valore del movimento",
      text: "In Abisso Infinito la distanza è potere. Arrivare per primi significa spesso raccogliere prima, prepararsi meglio e scegliere lo scontro alle proprie condizioni. Per questo il Portale è uno dei luoghi più preziosi per chi sa leggere la mappa con intelligenza."
    },
    {
      type: "reward",
      title: "Vantaggio del Portale",
      text: "Chi sfrutta bene il Portale guadagna tempo, posizione e controllo. Non offre monete né risorse dirette, ma può valere più di un tesoro se usato per entrare nel posto giusto al momento giusto."
    },
    {
      type: "warning",
      title: "Errore comune dei novizi",
      text: "Molti usano il Portale appena possono, senza un vero piano. Ma spostarsi non basta: bisogna sapere dove andare e perché. Un teletrasporto sprecato è un’occasione perduta."
    },
    {
      type: "text",
      title: "Consiglio del viandante",
      text: "Non guardare il Portale come un semplice passaggio. Guardalo come una decisione. Ogni volta che lo attraversi, stai scegliendo quale parte del regno avrà il tuo tempo, la tua forza… e il tuo destino."
    }
  ]
},

raccolta_legno: {
  title: "Legno",
  intro: "Fra tronchi antichi, cortecce spezzate e sentieri che odorano di resina e terra umida, il legno rappresenta la prima vera ricchezza di chi vuole costruire. Non ha il luccichio dell’oro né il prestigio dei diamanti, ma senza di esso nessun regno può davvero alzarsi dalle proprie fondamenta.",

  sections: [
    {
      type: "text",
      title: "Natura della risorsa",
      text: "Il legno è una delle risorse più importanti nelle fasi iniziali e intermedie del gioco. È il materiale della costruzione, del lavoro e della stabilità. Viene raccolto nelle caselle dedicate, finisce nello zaino e diventa davvero disponibile solo dopo il deposito nell’inventario."
    },
    {
      type: "steps",
      title: "Come funziona la raccolta",
      items: [
        "Raggiungi una casella risorsa dedicata al legno.",
        "Tira 2 dadi e calcola la somma totale.",
        "Moltiplica il risultato per 2 per conoscere la quantità raccolta.",
        "Il legno ottenuto viene inserito prima nello zaino.",
        "Deposita il contenuto dello zaino nell’inventario per usare davvero la risorsa."
      ]
    },
    {
      type: "requirements",
      title: "Regole di raccolta",
      checks: [
        { label: "Dadi usati", value: "2d6" },
        { label: "Valore tiro valido", value: "Da 2 a 12" },
        { label: "Quantità ottenuta", value: "Somma dei dadi ×2" },
        { label: "Primo deposito", value: "Zaino" },
        { label: "Uso effettivo", value: "Dopo deposito in inventario" }
      ]
    },
    {
      type: "warning",
      title: "Limite dello zaino",
      text: "Il legno raccolto occupa spazio nello zaino insieme alle altre risorse. Finché resta lì, blocca capienza utile per nuove raccolte. Se vuoi continuare a fare scorte in modo efficiente, devi depositarlo appena possibile."
    },
    {
      type: "text",
      title: "Deposito e disponibilità",
      text: "Solo una volta trasferito nell’inventario il legno entra davvero tra i materiali spendibili del giocatore. Da quel momento può essere usato per costruzioni, lavoratori, sviluppo del villaggio e altre attività fondamentali del regno."
    },
    {
      type: "list",
      title: "A cosa servono le risorse",
      items: [
        "Costruire e sviluppare il villaggio",
        "Sostenere edifici e strutture",
        "Assoldare o mantenere lavoratori",
        "Potenziare la produzione",
        "Contribuire alla crescita dell’esercito",
        "Vendere materiali al mercato",
        "Comprare altre risorse quando mancano"
      ]
    },
    {
      type: "text",
      title: "Il ruolo del legno",
      text: "Il legno è il materiale delle fondamenta. Dove altre risorse entrano in gioco più avanti, il legno è spesso ciò che permette di iniziare davvero a costruire. Chi lo trascura troppo presto rischia di rallentare tutto il proprio sviluppo."
    },
    {
      type: "reward",
      title: "Valore strategico",
      text: "Accumulare legno con continuità dà stabilità economica e costruttiva. È una riserva meno appariscente di altre, ma spesso è quella che rende possibili gli edifici, i potenziamenti e la crescita ordinata del regno."
    },
    {
      type: "warning",
      title: "Errore comune dei novizi",
      text: "Molti giocatori pensano che il legno sia una risorsa povera e la vendono troppo in fretta. Ma chi svuota le proprie scorte senza un piano si accorge presto che perfino le ambizioni più grandi crollano se mancano le basi."
    },
    {
      type: "text",
      title: "Consiglio del capomastro",
      text: "Prima di inseguire il raro, impara a dominare il necessario. Un regno che possiede buon legno possiede travi, mura, strumenti e futuro. Il potere non nasce solo dalla ricchezza: nasce anche da ciò che sostiene tutto il resto."
    }
  ]
},

locanda_regno: {
  title: "Locanda del Regno",
  intro: "Fra travi annerite dal fumo, tavoli consumati da mille viandanti e profumo di carne, pane e spezie, la Locanda del Regno è il rifugio dove il guerriero può tornare a respirare. Qui non si commercia come al mercato: qui si mangia, si recupera e si sceglie se investire nel ristoro immediato… o nel servizio raffinato dello chef.",

  sections: [
    {
      type: "text",
      title: "Natura del luogo",
      text: "La locanda è il principale punto di ristoro del gioco. Qui il giocatore può acquistare ogni tipo di pietanza, incluse quelle complete che non sono disponibili al mercato, e può anche assoldare uno chef per una produzione temporanea di fame."
    },
    {
      type: "list",
      title: "Cosa puoi fare in locanda",
      items: [
        "Acquistare pasti completi",
        "Acquistare anche le pietanze semplici del mercato",
        "Recuperare fame, salute, stamina e forza tramite il cibo",
        "Assoldare uno Chef Gourmet",
        "Riscuotere il cibo prodotto durante il servizio cucina"
      ]
    },
    {
      type: "warning",
      title: "Differenza tra locanda e mercato",
      text: "Nel mercato il giocatore può acquistare soltanto le pietanze semplici. In locanda, invece, può acquistare tutto il cibo disponibile, compresi i pasti completi come Cena del Viandante, Pranzo del Cavaliere, Merenda del Mercante e Spuntino del Monaco. :contentReference[oaicite:1]{index=1}"
    },
    {
      type: "requirements",
      title: "Pasti completi della locanda",
      checks: [
        { label: "Cena del Viandante", value: "+100 fame, +50 salute, +30 stamina, +20 forza — 500 monete" },
        { label: "Pranzo del Cavaliere", value: "+80 fame, +40 salute, +25 stamina, +15 forza — 350 monete" },
        { label: "Merenda del Mercante", value: "+50 fame, +20 salute, +15 stamina, +10 forza — 180 monete" },
        { label: "Spuntino del Monaco", value: "+30 fame, +10 salute, +10 stamina, +5 forza — 120 monete" }
      ]
    },
    {
      type: "requirements",
      title: "Pietanze semplici disponibili anche in locanda",
      checks: [
        { label: "Carne Arrosto", value: "+70 fame, +30 salute, +20 stamina, +25 forza — 120 monete" },
        { label: "Zuppa Rustica", value: "+60 fame, +25 salute, +20 stamina, +15 forza — 100 monete" },
        { label: "Formaggio Stagionato", value: "+40 fame, +20 salute, +15 stamina, +10 forza — 90 monete" },
        { label: "Pane Nero", value: "+20 fame, +5 salute, +5 stamina, +5 forza — 30 monete" },
        { label: "Pesce Affumicato", value: "+50 fame, +20 salute, +15 stamina, +15 forza — 110 monete" },
        { label: "Frutta Secca e Miele", value: "+30 fame, +10 salute, +20 stamina, +5 forza — 70 monete" },
        { label: "Idromele", value: "+10 fame, +5 salute, +10 stamina, +5 forza — 60 monete" },
        { label: "Birra Scura", value: "+5 fame, +5 salute, +5 stamina, +5 forza — 50 monete" }
      ]
    },
    {
      type: "warning",
      title: "Prezzo crescente del cibo",
      text: "Ogni pietanza segue una logica di prezzo dinamico per giocatore: più volte lo stesso personaggio compra lo stesso cibo, più il costo successivo aumenta. Questo impedisce di abusare sempre della stessa scelta e rende importante variare o pianificare bene i pasti. :contentReference[oaicite:2]{index=2}"
    },
    {
      type: "text",
      title: "Limite della fame",
      text: "Il cibo non può essere acquistato senza misura. Se il personaggio è già vicino al massimo consentito, l’acquisto viene bloccato per evitare di superare il limite di fame. Mangiare bene è essenziale, ma sprecare monete in eccesso inutile è da stolti."
    },
    {
      type: "requirements",
      title: "Chef Gourmet",
      checks: [
        { label: "Costo assunzione", value: "10.000 monete" },
        { label: "Durata servizio", value: "30 minuti" },
        { label: "Produzione", value: "+20 fame ogni 2 minuti" },
        { label: "Tacche massime", value: "15" },
        { label: "Assegnazione finale", value: "Automatica a fine servizio o riscossione manuale" }
      ]
    },
    {
      type: "text",
      title: "Servizio dello chef",
      text: "Lo Chef Gourmet lavora dentro una finestra temporale di 30 minuti. Durante quel periodo prepara piatti a intervalli regolari, generando fame per il giocatore che lo ha assoldato. Il risultato può essere riscosso nel tempo oppure assegnato automaticamente alla fine del servizio."
    },
    {
      type: "steps",
      title: "Come usare lo chef",
      items: [
        "Avvia la finestra del servizio cucina da 30 minuti.",
        "Seleziona il giocatore che deve assoldare lo chef.",
        "Paga 10.000 monete.",
        "Attendi che il servizio produca fame a intervalli regolari.",
        "Riscuoti i piatti durante la finestra oppure attendi l’assegnazione finale automatica."
      ]
    },
    {
      type: "warning",
      title: "Lo chef non lavora per sempre",
      text: "Quando la finestra di 30 minuti termina, il servizio si interrompe e lo chef riposa. Se vuoi ripartire, devi avviare una nuova finestra. Inoltre, se il giocatore ha già fame molto alta, parte del beneficio rischia di essere sprecato. :contentReference[oaicite:4]{index=4}"
    },
    {
      type: "reward",
      title: "Valore strategico della locanda",
      text: "La locanda è il luogo dove si trasforma il denaro in recupero efficiente. Qui il giocatore sceglie se puntare su un grande pasto immediato o su una gestione più estesa attraverso lo chef. Non è soltanto un luogo di ristoro: è una riserva di continuità per il viaggio."
    },
    {
      type: "text",
      title: "Consiglio dell’oste",
      text: "Non aspettare di essere svuotato per cercare un tavolo. Un guerriero che mangia con saggezza tiene alto il passo, conserva forza per la battaglia e arriva alle prove dure con il corpo ancora pronto a reggere il peso del destino."
    }
  ]
},

casella_destino: {
  title: "Casella del Destino",
  intro: "Vi sono luoghi nel regno dove la spada non basta e il coraggio da solo non salva. La Casella del Destino è uno di essi. Qui il guerriero non affronta una creatura di carne, ma il giudizio invisibile del fato. E quando perfino la morte ha già messo le mani sul suo nome, è ancora qui che può tentare di strappare alla tenebra un ultimo ritorno.",

  sections: [
    {
      type: "text",
      title: "Natura del luogo",
      text: "La Casella del Destino è un luogo mistico e pericoloso. Qui il giocatore può sfidare il fato per ottenere ricompense, oppure tentare la resurrezione quando è caduto. Non è una casella economica né militare: è una prova di sorte, volontà e sopravvivenza."
    },
    {
      type: "list",
      title: "Cosa puoi fare qui",
      items: [
        "Combattere contro il destino",
        "Ottenere premi casuali in caso di vittoria",
        "Subire perdita di stamina in caso di sconfitta",
        "Tentare la resurrezione se il personaggio è morto"
      ]
    },
    {
      type: "text",
      title: "Combattere contro il destino",
      text: "Quando sfidi il destino, il tuo personaggio usa la propria forza complessiva come base dello scontro. Il tuo total skill viene moltiplicato per il totale dei tuoi dadi, mentre il destino risponde con una potenza propria, influenzata dal livello suggerito e dal suo stesso tiro. Se riesci a superarlo, il fato si piega e concede un premio."
    },
    {
      type: "steps",
      title: "Come funziona la sfida",
      items: [
        "Seleziona il giocatore.",
        "Inserisci il totale di 2d6, oppure lascia che venga generato automaticamente.",
        "Il destino effettua il proprio tiro.",
        "Vengono confrontate la tua potenza e quella del destino.",
        "Se vinci, ottieni una ricompensa. Se perdi, subisci una perdita di stamina."
      ]
    },
    {
      type: "requirements",
      title: "Esiti della sfida",
      checks: [
        { label: "Vittoria", value: "Premio casuale" },
        { label: "Sconfitta", value: "Perdita di stamina" },
        { label: "Progressione", value: "Conta tentativi e vittorie contro il destino" }
      ]
    },
    {
      type: "reward",
      title: "Premi del destino",
      text: "Se sconfiggi il destino puoi ottenere ricompense molto diverse: salute, stamina, denaro, oro, incremento di forza, magia, astuzia, destrezza o ingegno. Talvolta il fato concede anche premi speciali più rari, capaci di alterare davvero il percorso del personaggio."
    },
    {
      type: "warning",
      title: "Prezzo della sconfitta",
      text: "Se il destino ti supera, non muori, ma paghi comunque un prezzo. La stamina viene ridotta, e con essa la tua capacità di continuare a combattere o affrontare altre prove subito dopo. Sfida il fato quando sei pronto, non solo quando sei curioso."
    },
    {
      type: "text",
      title: "Resurrezione del Destino",
      text: "Quando il personaggio è morto, la Casella del Destino diventa l’unico luogo dove può tentare il ritorno. La resurrezione non è immediata: si svolge in tre turni, e in ognuno di essi il giocatore affronta di nuovo il fato con il tiro dei dadi."
    },
    {
      type: "steps",
      title: "Come funziona la resurrezione",
      items: [
        "Seleziona il giocatore da resuscitare.",
        "Avvia la resurrezione del destino.",
        "Gioca 3 turni di confronto contro il destino.",
        "In caso di pareggio il turno non conta e si ritira.",
        "Alla fine dei 3 turni il personaggio torna in vita, ma con una penalità variabile in base alle vittorie del destino."
      ]
    },
    {
      type: "requirements",
      title: "Esito finale della resurrezione",
      checks: [
        { label: "0 vittorie del destino", value: "Nessuna penalità" },
        { label: "1 vittoria del destino", value: "-20% total skill" },
        { label: "2 vittorie del destino", value: "-40% total skill" },
        { label: "3 vittorie del destino", value: "-60% total skill" },
        { label: "Ritorno in vita", value: "Salute ripristinata a 30" }
      ]
    },
    {
      type: "warning",
      title: "La resurrezione ha un prezzo",
      text: "Risorgere non significa tornare intatti. Più il destino vince durante il rituale, più grande sarà il taglio agli attributi del personaggio. Si può tornare dal buio, ma non sempre si torna con la stessa forza di prima."
    },
    {
      type: "text",
      title: "Il giudizio del fato",
      text: "La Casella del Destino non appartiene ai forti né ai deboli. Appartiene a chi osa. Alcuni vi cercano ricompense, altri vi arrivano da sconfitti in cerca di una seconda possibilità. In entrambi i casi, è sempre il fato a decidere quanto sei disposto a perdere per continuare."
    },
    {
      type: "text",
      title: "Consiglio dell’oracolo",
      text: "Sfida il destino quando hai qualcosa da guadagnare, ma cerca la resurrezione solo quando sei pronto ad accettare che tornare in vita non è la stessa cosa che tornare vittorioso."
    }
  ]
},

eroe_vento: {
  title: "Eroe del Vento",
  intro: "Non tutti gli eroi appartengono alla luce degli uomini. Alcuni vengono reclamati dagli elementi, svuotati del proprio nome e trasformati in custodi di una forza più antica. L’Eroe del Vento è uno di questi: una figura rapida come la tempesta, elegante come una lama d’aria e letale come un uragano che non annuncia il proprio arrivo.",

  sections: [
    {
      type: "text",
      title: "Origine della creatura",
      text: "Le cronache parlano di un campione che un tempo difendeva le alture del regno, finché il potere dell’aria non lo consumò del tutto. Da allora non marcia più come uomo, ma scivola fra le raffiche come incarnazione del vento stesso. Non presidia il Bastione dell’Aria per dovere, ma per natura."
    },
    {
      type: "requirements",
      title: "Identità del mostro",
      checks: [
        { label: "Categoria", value: "Mostro Minore" },
        { label: "Difficoltà", value: "Media" },
        { label: "Livello", value: "5" },
        { label: "Potenza Totale", value: "2800" },
        { label: "Salute", value: "130" }
      ]
    },
    {
      type: "requirements",
      title: "Distribuzione del Potere",
      checks: [
        { label: "Forza", value: "300" },
        { label: "Astuzia", value: "520" },
        { label: "Ingegno", value: "420" },
        { label: "Magia", value: "620" },
        { label: "Destrezza", value: "940" }
      ]
    },
    {
      type: "requirements",
      title: "Accesso ai mostri",
      checks: [
        { label: "Per Mostri Minori", value: "Serve almeno 1 scrigno aperto" },
        { label: "Per Mostri Maggiori", value: "Servono almeno 4 scrigni aperti" }
      ]
    },
    {
      type: "warning",
      title: "Sigillo d’accesso",
      text: "L’Eroe del Vento appartiene ai Mostri Minori, ma non può essere sfidato da chiunque. Per affrontarlo devi aver già aperto almeno uno scrigno. I Mostri Maggiori, invece, attendono soltanto chi ha spezzato il sigillo di quattro scrigni."
    },
    {
      type: "text",
      title: "Stile di combattimento",
      text: "L’Eroe del Vento non domina con la brutalità, ma con il movimento assoluto. La sua forza più terribile è la destrezza: colpisce dove non lo aspetti, si sposta dove non riesci a seguirlo e piega lo scontro con velocità, magia e precisione."
    },
    {
      type: "text",
      title: "La minaccia dell’aria",
      text: "Contro questa creatura il pericolo non è soltanto subire un colpo, ma perdere il ritmo della battaglia. Le raffiche confondono, l’aria taglia, i passi diventano incerti. Chi combatte contro il vento rischia di sentirsi sempre in ritardo, come se il mostro conoscesse ogni movimento un istante prima che accada."
    },
    {
      type: "steps",
      title: "Come affrontarlo",
      items: [
        "Seleziona il giocatore che combatterà.",
        "Verifica di aver aperto almeno 1 scrigno, requisito necessario per i mostri minori.",
        "Scegli da 1 a 5 attributi da utilizzare nello scontro.",
        "Inserisci i risultati dei dadi per ogni attributo scelto.",
        "Confronta la tua potenza con quella dell’Eroe del Vento per determinare l’esito."
      ]
    },
    {
      type: "warning",
      title: "Perché è pericoloso",
      text: "Pur essendo un mostro minore, l’Eroe del Vento possiede una potenza totale di 2800 e una distribuzione molto insidiosa. La sua destrezza domina nettamente lo scontro, mentre magia e astuzia gli permettono di restare imprevedibile. Non è un avversario da affrontare con una build sbilanciata o lenta. "
    },
    {
      type: "reward",
      title: "Ricompense",
      text: "Sconfiggere l’Eroe del Vento garantisce 34000 monete. Inoltre il vincitore ottiene una crescita importante di astuzia e ingegno, come se una parte della lucidità e della leggerezza del vento passasse nelle mani di chi è riuscito a dominarlo. "
    },
    {
      type: "requirements",
      title: "Premio del vincitore",
      checks: [
        { label: "Monete", value: "34000" },
        { label: "Astuzia", value: "+126" },
        { label: "Ingegno", value: "+240" }
      ]
    },
    {
      type: "text",
      title: "Potere elementale",
      text: "L’Eroe del Vento è legato all’elemento Aria. Questo non lo rende solo rapido: lo rende mobile, mutevole e difficile da incatenare a uno schema fisso. Combatterlo significa affrontare una presenza che usa il campo di battaglia come se fosse esso stesso parte del vento. :contentReference[oaicite:3]{index=3}"
    },
    {
      type: "text",
      title: "Consiglio del veterano",
      text: "Non sfidarlo contando soltanto sulla forza grezza. L’Eroe del Vento premia chi sa reggere il ritmo, leggere lo scontro e colpire con equilibrio. Se entri impreparato, non ti travolgerà con una sola tempesta: ti consumerà un passo alla volta."
    }
  ]
},

ladri_di_tesori: {
  title: "Ladri di Tesori",
  intro: "Non marciano in file ordinate e non issano vessilli di guerra. I Ladri di Tesori vivono nell’ombra delle rovine, nei cunicoli dimenticati e nei luoghi dove l’oro chiama più forte della paura. Non cercano gloria, ma reliquie, chiavi, bottini perduti e tutto ciò che può essere strappato a chi abbassa la guardia.",

  sections: [
    {
      type: "text",
      title: "Origine della banda",
      text: "I Ladri di Tesori non sono guerrieri nel senso tradizionale. Sono cercatori, scassinatori, predoni di reliquie e razziatori di antiche ricchezze. Hanno imparato a vivere fra trappole, mappe spezzate e passaggi segreti, fino a trasformarsi in una banda capace di rubare non solo oro, ma anche occasioni e vantaggi strategici."
    },
    {
      type: "requirements",
      title: "Identità della banda",
      checks: [
        { label: "XP minimi", value: "300" },
        { label: "Ricompensa", value: "11200 monete" },
        { label: "Potenza totale", value: "340" },
        { label: "Potenza dadi iniziale", value: "12" },
        { label: "Costo reclutamento", value: "50 oro, 17 diamanti" }
      ]
    },
    {
      type: "requirements",
      title: "Distribuzione del potere",
      checks: [
        { label: "Forza", value: "30" },
        { label: "Astuzia", value: "150" },
        { label: "Ingegno", value: "100" },
        { label: "Magia", value: "50" },
        { label: "Destrezza", value: "10" }
      ]
    },
    {
      type: "steps",
      title: "Come funziona la sfida",
      items: [
        "Scegli il giocatore che affronta la banda.",
        "Inserisci il tuo tiro dadi.",
        "La banda tira automaticamente fino al suo valore massimo attuale.",
        "Confronta i risultati per determinare vittoria, sconfitta o pareggio.",
        "A fine scontro perdi comunque 50 stamina."
      ]
    },
    {
      type: "requirements",
      title: "Regole della sfida",
      checks: [
        { label: "Tentativi massimi", value: "6 per giocatore" },
        { label: "Stamina minima", value: "50" },
        { label: "Cooldown", value: "5 minuti tra una sfida e l’altra" },
        { label: "Reclutamento", value: "Solo dopo averla sconfitta" }
      ]
    },
    {
      type: "text",
      title: "Stile di combattimento",
      text: "I Ladri di Tesori non travolgono con la forza grezza. Colpiscono con astuzia, inganno e intuito. La loro vera minaccia è la capacità di leggere il momento giusto, trovare il varco e sparire con il bottino prima che la vittima capisca cosa ha perso."
    },
    {
      type: "warning",
      title: "Conseguenze della sconfitta",
      text: "Se perdi, la banda si rafforza immediatamente. Il suo tiro massimo aumenta di 1: da 12 passa a 13, poi 14, 15 e così via a ogni sconfitta. Inoltre i Ladri di Tesori possono saccheggiare monete e oro, accumulando il bottino rubato nella loro cassa."
    },
    {
      type: "warning",
      title: "Scala di saccheggio",
      text: "Finché la banda resta al valore iniziale, il saccheggio è contenuto. Ma se continui a perdere, i Ladri di Tesori diventano sempre più efficienti nel derubarti. Più li lasci crescere, più costoso diventa ogni nuovo tentativo."
    },
    {
      type: "reward",
      title: "Ricompense della vittoria",
      text: "Sconfiggere i Ladri di Tesori garantisce 11200 monete, oltre a prestigio e risorse da bottino. Se la vittoria è netta, puoi anche recuperare una parte di quanto la banda aveva già sottratto ad altri viandanti."
    },
    {
      type: "text",
      title: "Reclutare la banda",
      text: "Dopo averli sconfitti, puoi piegare i Ladri di Tesori al tuo servizio pagando 50 oro e 17 diamanti. Una forza simile non si compra con promesse: si compra con ricchezza e superiorità dimostrata."
    },
    {
      type: "reward",
      title: "Potere della banda",
      text: "Quando i Ladri di Tesori vengono reclutati, i loro attributi si sommano a quelli del giocatore. Non ottieni una semplice banda da strada, ma una rete di mani esperte, occhi rapidi e menti affilate utili a trasformare opportunità nascoste in vantaggio reale."
    },
    {
      type: "warning",
      title: "Regola importante",
      text: "Puoi controllare una sola banda alla volta. Se vuoi reclutarne un’altra, devi prima vendere o liberare quella che già possiedi."
    },
    {
      type: "text",
      title: "Consiglio strategico",
      text: "I Ladri di Tesori sono perfetti per chi preferisce astuzia, risorse e controllo sottile invece dello scontro brutale. Ma non sottovalutarli: proprio perché non sembrano schiaccianti, molti li affrontano troppo presto… e finiscono alleggeriti di tutto ciò che avevano."
    }
  ]
},

banda_nera: {
  title: "Banda Nera",
  intro: "Fra sentieri sporchi di cenere, ruderi anneriti e notti in cui persino i cani tacciono, si muove la Banda Nera. Non è la più grande tra le bande del regno, ma è spesso la prima a insegnare ai viandanti una lezione crudele: nell’Abisso non basta partire armati, bisogna anche saper difendere ciò che si possiede.",

  sections: [
    {
      type: "text",
      title: "Origine della banda",
      text: "La Banda Nera è composta da predoni rapidi, spietati e opportunisti. Non cercano guerre gloriose né campi di battaglia illustri: preferiscono colpire dove il viandante si sente ancora inesperto, rubando denaro, risorse e fiducia a chi entra troppo presto nelle zone d’ombra del regno."
    },
    {
      type: "requirements",
      title: "Identità della banda",
      checks: [
        { label: "XP minimi", value: "50" },
        { label: "Ricompensa", value: "5400 monete" },
        { label: "Potenza totale", value: "190" },
        { label: "Potenza dadi iniziale", value: "12" },
        { label: "Costo reclutamento", value: "20 oro, 5 diamanti" }
      ]
    },
    {
      type: "requirements",
      title: "Distribuzione del potere",
      checks: [
        { label: "Forza", value: "20" },
        { label: "Astuzia", value: "10" },
        { label: "Ingegno", value: "50" },
        { label: "Magia", value: "10" },
        { label: "Destrezza", value: "100" }
      ]
    },
    {
      type: "steps",
      title: "Come funziona la sfida",
      items: [
        "Scegli il giocatore che affronta la banda.",
        "Inserisci il tuo tiro dadi.",
        "La banda tira automaticamente fino al suo valore massimo attuale.",
        "Confronta i risultati per determinare vittoria, sconfitta o pareggio.",
        "A fine scontro perdi comunque 50 stamina."
      ]
    },
    {
      type: "requirements",
      title: "Regole della sfida",
      checks: [
        { label: "Tentativi massimi", value: "6 per giocatore" },
        { label: "Stamina minima", value: "50" },
        { label: "Cooldown", value: "5 minuti tra una sfida e l’altra" },
        { label: "Reclutamento", value: "Solo dopo averla sconfitta" }
      ]
    },
    {
      type: "text",
      title: "Stile di combattimento",
      text: "La Banda Nera non vince con potenza schiacciante, ma con mobilità e colpi rapidi. La sua vera forza è la destrezza, sostenuta da un ingegno sufficiente a rendere ogni assalto più insidioso di quanto sembri a prima vista."
    },
    {
      type: "warning",
      title: "Conseguenze della sconfitta",
      text: "Se perdi, la banda si rafforza immediatamente. Il suo tiro massimo aumenta di 1: da 12 passa a 13, poi 14, 15 e così via a ogni sconfitta. Inoltre la Banda Nera può saccheggiarti monete e oro, accumulando il bottino rubato nella propria cassa."
    },
    {
      type: "warning",
      title: "Scala di saccheggio",
      text: "All’inizio la banda ruba poco, ma se continui a fallire la renderai sempre più pericolosa. Una banda che hai sottovalutato al primo incontro può diventare, dopo poche sconfitte, una minaccia molto più seria del previsto."
    },
    {
      type: "reward",
      title: "Ricompense della vittoria",
      text: "Sconfiggere la Banda Nera garantisce 5400 monete, oltre a prestigio e risorse da bottino. Nelle vittorie più nette puoi anche recuperare parte del denaro che la banda aveva già sottratto ai viaggiatori caduti prima di te."
    },
    {
      type: "text",
      title: "Reclutare la banda",
      text: "Dopo averla sconfitta, puoi piegare la Banda Nera al tuo servizio pagando 20 oro e 5 diamanti. È una delle bande più accessibili da reclutare, ma proprio per questo spesso rappresenta il primo vero salto di potere per un giocatore agli inizi."
    },
    {
      type: "reward",
      title: "Potere della banda",
      text: "Quando la Banda Nera viene reclutata, i suoi attributi si sommano a quelli del giocatore. Non offre soltanto forza aggiuntiva: offre soprattutto agilità, presenza sul territorio e un primo assaggio di cosa significhi comandare una banda al proprio fianco."
    },
    {
      type: "warning",
      title: "Regola importante",
      text: "Puoi controllare una sola banda alla volta. Se desideri reclutarne un’altra, devi prima vendere o liberare quella che già possiedi."
    },
    {
      type: "text",
      title: "Consiglio strategico",
      text: "La Banda Nera è ideale come prima prova seria contro le bande del regno. Non affrontarla troppo presto per leggerezza, ma nemmeno troppo tardi: per molti guerrieri è il primo gradino verso il controllo del sottobosco criminale dell’Abisso."
    }
  ]
},

prigione_regno: {
  title: "Prigione del Regno",
  intro: "Fra sbarre fredde, pietra umida e passi lenti delle guardie, la Prigione del Regno attende chi ha sfidato le leggi dell’oro e della corona. Qui non si entra per gloria, ma per errore, avidità o sventura. E una volta chiusa la cella, il tempo stesso sembra diventare parte della condanna.",

  sections: [
    {
      type: "text",
      title: "Natura del luogo",
      text: "La prigione è il luogo dove finiscono i giocatori che non riescono a pagare i propri debiti oppure che falliscono una rapina alla banca. Non è un punto attivo di crescita, ma una fase di blocco e punizione che rallenta il progresso del personaggio."
    },
    {
      type: "list",
      title: "Come si può finire in prigione",
      items: [
        "Per insolvenza verso la banca",
        "Per fallimento durante una rapina",
        "Per intervento delle guardie durante un colpo fallito"
      ]
    },
    {
      type: "text",
      title: "Debiti e condanna",
      text: "Se il giocatore ha un prestito attivo e non riesce a pagare né con le monete né con l’oro disponibile, la banca lo considera insolvente. In quel momento la prigione diventa la punizione diretta per il mancato rimborso. :contentReference[oaicite:1]{index=1}"
    },
    {
      type: "warning",
      title: "Rapina fallita",
      text: "La rapina alla banca è uno dei modi più pericolosi per ritrovarsi in cella. Se la banda dei rapinatori non supera le guardie, i partecipanti possono essere arrestati e ricevere una pena diversa in base al ruolo ricoperto: Capo, Braccio destro o Palo. :contentReference[oaicite:2]{index=2}"
    },
    {
      type: "requirements",
      title: "Regole della detenzione",
      checks: [
        { label: "Insolvenza bancaria", value: "2 turni di prigione" },
        { label: "Rapina fallita", value: "Pena variabile in base al ruolo" },
        { label: "Uscita anticipata", value: "Possibile con cauzione" },
        { label: "Costo cauzione", value: "Dipende dai turni rimanenti" }
      ]
    },
    {
      type: "text",
      title: "La cauzione",
      text: "La prigione non è sempre una sentenza da scontare fino in fondo. Il giocatore può pagare una cauzione in monete per uscire prima del termine. Più lunga è la pena residua, più pesante sarà il prezzo della libertà. :contentReference[oaicite:3]{index=3}"
    },
    {
      type: "reward",
      title: "Valore della libertà",
      text: "Anche se non offre premi diretti, la prigione insegna una regola centrale del regno: la libertà ha un costo. Chi riesce a uscirne in fretta salva turni preziosi e limita i danni alla propria strategia."
    },
    {
      type: "warning",
      title: "Errore comune dei novizi",
      text: "Molti giocatori sottovalutano i rischi della banca e della rapina, pensando solo al premio possibile. Ma il carcere spezza il ritmo, blocca le azioni e può trasformare un colpo ambizioso in un lungo rallentamento."
    },
    {
      type: "text",
      title: "Consiglio del secondino",
      text: "Nel regno si può perdere denaro e tornare a guadagnarlo. Si può perdere potere e ricostruirlo. Ma perdere il tempo in prigione è una ferita più sottile: mentre tu aspetti dietro le sbarre, gli altri continuano a muoversi."
    }
  ]
},

nani_del_chaos: {
  title: "Nani del Chaos",
  intro: "Dalle miniere spezzate e dalle forge consumate dal fuoco oscuro emergono i Nani del Chaos. Un tempo maestri del metallo e della pietra, ora sono guerrieri corrotti, duri come incudini maledette e feroci come il magma che un giorno giurarono di dominare.",

  sections: [
    {
      type: "text",
      title: "Origine della banda",
      text: "I Nani del Chaos nacquero da antiche stirpi di fabbri e combattenti, ma il contatto con poteri proibiti deformò la loro disciplina in brutalità. Conservano ancora l’arte della guerra e della forgia, ma la impiegano per saccheggiare, distruggere e imporre il proprio dominio sulle vie più ricche del regno."
    },
    {
      type: "requirements",
      title: "Identità della banda",
      checks: [
        { label: "XP minimi", value: "100" },
        { label: "Ricompensa", value: "4300 monete" },
        { label: "Potenza totale", value: "230" },
        { label: "Potenza dadi iniziale", value: "12" },
        { label: "Costo reclutamento", value: "30 oro, 10 diamanti" }
      ]
    },
    {
      type: "requirements",
      title: "Distribuzione del potere",
      checks: [
        { label: "Forza", value: "120" },
        { label: "Astuzia", value: "40" },
        { label: "Ingegno", value: "20" },
        { label: "Magia", value: "50" },
        { label: "Destrezza", value: "0" }
      ]
    },
    {
      type: "steps",
      title: "Come funziona la sfida",
      items: [
        "Scegli il giocatore che affronta la banda.",
        "Inserisci il tuo tiro dadi.",
        "La banda tira automaticamente fino al suo valore massimo attuale.",
        "Confronta i risultati per determinare vittoria, sconfitta o pareggio.",
        "A fine scontro perdi comunque 50 stamina."
      ]
    },
    {
      type: "requirements",
      title: "Regole della sfida",
      checks: [
        { label: "Tentativi massimi", value: "6 per giocatore" },
        { label: "Stamina minima", value: "50" },
        { label: "Cooldown", value: "5 minuti tra una sfida e l’altra" },
        { label: "Reclutamento", value: "Solo dopo averla sconfitta" }
      ]
    },
    {
      type: "text",
      title: "Stile di combattimento",
      text: "I Nani del Chaos non fanno affidamento sulla velocità. La loro forza sta nell’impatto, nella resistenza e nell’aggressione frontale. Ogni colpo è pesante, ogni avanzata è ostinata, e la magia corrotta che li accompagna rende il loro assalto ancora più minaccioso."
    },
    {
      type: "warning",
      title: "Conseguenze della sconfitta",
      text: "Se perdi, la banda si rafforza immediatamente. Il suo tiro massimo aumenta di 1: da 12 passa a 13, poi 14, 15 e così via a ogni sconfitta. Inoltre i Nani del Chaos possono saccheggiarti monete e oro, accumulando il bottino rubato nella loro cassa."
    },
    {
      type: "warning",
      title: "Scala di saccheggio",
      text: "Finché restano al valore iniziale, il danno economico è contenuto. Ma se continui a cadere contro di loro, il saccheggio cresce e la banda diventa progressivamente più difficile da fermare. Un avversario lento non è per forza un avversario innocuo."
    },
    {
      type: "reward",
      title: "Ricompense della vittoria",
      text: "Sconfiggere i Nani del Chaos garantisce 4300 monete, oltre a prestigio e risorse da bottino. Nelle vittorie migliori puoi anche recuperare una parte del tesoro che la banda ha già sottratto ad altri malcapitati."
    },
    {
      type: "text",
      title: "Reclutare la banda",
      text: "Dopo averli sconfitti, puoi piegare i Nani del Chaos al tuo servizio pagando 30 oro e 10 diamanti. Non è una banda raffinata, ma è una forza robusta e solida, ideale per chi vuole consolidare il proprio potere con guerrieri duri e poco inclini a cedere."
    },
    {
      type: "reward",
      title: "Potere della banda",
      text: "Quando i Nani del Chaos vengono reclutati, i loro attributi si sommano a quelli del giocatore. Il loro contributo è soprattutto offensivo e resistente: meno eleganza, più peso, più solidità e una presenza militare che si fa sentire."
    },
    {
      type: "warning",
      title: "Regola importante",
      text: "Puoi controllare una sola banda alla volta. Se vuoi reclutarne un’altra, devi prima vendere o liberare quella attuale."
    },
    {
      type: "text",
      title: "Consiglio strategico",
      text: "I Nani del Chaos sono ottimi per chi vuole una banda compatta e robusta nelle prime fasi di crescita. Non sottovalutare la loro forza frontale: chi prova a superarli solo con leggerezza spesso scopre troppo tardi che contro un martello non basta essere veloci."
    }
  ]
},

fabbro_base: {
  title: "Fabbro",
  intro: "Fra incudini annerite, ferri incandescenti e colpi che risuonano come tamburi di guerra, il Fabbro del Regno è il luogo dove un semplice combattente comincia a distinguersi. Qui non si comprano soltanto armi: qui si costruisce la propria identità in battaglia.",

  sections: [
    {
      type: "text",
      title: "Natura del luogo",
      text: "Il fabbro è il centro dell’armeria personale del giocatore. Qui puoi consultare il catalogo delle armi del tuo personaggio, acquistarle, potenziarle di livello, impostarne una come arma attiva, avviare la forgia e occuparti della loro durabilità."
    },
    {
      type: "list",
      title: "Cosa puoi fare dal fabbro",
      items: [
        "Consultare il catalogo armi del personaggio",
        "Acquistare una nuova arma",
        "Potenziare un’arma già posseduta",
        "Impostare un’arma come arma attiva",
        "Forgiare un’arma al cap massimo",
        "Controllare livello, forgia e durabilità",
        "Riparare un’arma consumata"
      ]
    },
    {
      type: "text",
      title: "Catalogo personale",
      text: "Ogni personaggio possiede un proprio catalogo di armi. Le armi non sono uguali per tutti: cambiano nome, immagine, costo, descrizione e incrementi base. Il fabbro non offre una collezione universale, ma un arsenale coerente con l’identità del guerriero selezionato. "
    },
    {
      type: "requirements",
      title: "Informazioni mostrate per ogni arma",
      checks: [
        { label: "Mastery richiesta", value: "Necessaria per sbloccare l’arma" },
        { label: "Costo", value: "Prezzo base dell’arma" },
        { label: "Incrementi base", value: "Bonus alle statistiche dell’arma" },
        { label: "Stato possesso", value: "Posseduta o non posseduta" },
        { label: "Stato runtime", value: "Livello, forgia, durabilità, arma attiva" }
      ]
    },
    {
      type: "steps",
      title: "Come cresce un’arma",
      items: [
        "Scegli il giocatore.",
        "Consulta il catalogo disponibile per quel personaggio.",
        "Acquista un’arma se possiedi i requisiti necessari.",
        "Potenziala di livello spendendo il costo richiesto.",
        "Raggiungi il cap massimo effettivo dell’arma.",
        "Solo allora puoi avviare la forgia."
      ]
    },
    {
      type: "warning",
      title: "Mastery e cap arma",
      text: "Le armi non crescono liberamente. Ogni arma ha un legame con la mastery del giocatore e con un cap effettivo. Finché non raggiungi il livello massimo consentito per quell’arma, la forgia resta bloccata. :contentReference[oaicite:6]{index=6}"
    },
    {
      type: "text",
      title: "Arma attiva",
      text: "Fra tutte le armi possedute, puoi sceglierne una come arma attiva. È quella che il sistema considera come riferimento per il combattimento. Un’arma non basta possederla: per farla valere davvero nello scontro, devi equipaggiarla come arma principale. "
    },
    {
      type: "requirements",
      title: "Stato forgia del giocatore",
      checks: [
        { label: "Forge disponibili", value: "Risorsa spendibile per la forgia" },
        { label: "Forge spese", value: "Totale forge già consumate" },
        { label: "Forge totali raccolte", value: "Progressione complessiva della forgia" },
        { label: "Arma attiva", value: "Arma attualmente usata in combattimento" }
      ]
    },
    {
      type: "text",
      title: "Forgia dell’arma",
      text: "La forgia rappresenta il vero salto di qualità dell’arma. Quando hai raggiunto il cap massimo, puoi usare le forge disponibili per portare l’arma oltre il semplice livello, aumentando il suo valore strategico in combattimento. La forgia però non è infinita e va amministrata con giudizio. "
    },
    {
      type: "warning",
      title: "Durabilità e usura",
      text: "Un’arma forgiata non resta perfetta per sempre. La durabilità misura quanto il metallo regge il peso delle battaglie. Più un’arma viene usata, più rischia di consumarsi. Per questo il fabbro non è solo luogo di potere, ma anche di manutenzione."
    },
    {
      type: "text",
      title: "Riparazione",
      text: "Quando un’arma si deteriora, il fabbro permette di ripararla. Il costo della riparazione cresce in base al tier dell’arma e al suo livello di forgia: più l’arma è importante, più sarà costoso rimetterla in sesto. :contentReference[oaicite:9]{index=9}"
    },
    {
      type: "reward",
      title: "Valore strategico del fabbro",
      text: "Il fabbro non offre solo bonus numerici: offre continuità, identità e potere personale. Un giocatore ben armato sceglie meglio i propri scontri, resiste di più e valorizza la propria build. Chi trascura il fabbro combatte con il proprio potenziale a metà."
    },
    {
      type: "text",
      title: "Consiglio del mastro armaiolo",
      text: "Non inseguire subito l’arma più appariscente. Scegli prima ciò che si accorda davvero con il tuo personaggio, portala al suo limite, poi forgiala. Un’arma compresa e mantenuta vale più di un arsenale comprato senza visione."
    }
  ]
},

mini_pozione_cura: {
  title: "Mini Pozione di Cura",
  intro: "Piccola, semplice e spesso ignorata dai guerrieri più avidi di potere, la Mini Pozione di Cura è il rimedio dei prudenti. Non salva dagli abissi più profondi, ma può bastare per rimettersi in piedi quando il corpo vacilla e il viaggio deve continuare.",

  sections: [
    {
      type: "text",
      title: "Natura della pozione",
      text: "La Mini Pozione di Cura è il rimedio più leggero tra le cure. Serve a recuperare una piccola parte di salute e stamina, mantenendo il personaggio operativo senza richiedere grandi spese."
    },
    {
      type: "steps",
      title: "Come si usa",
      items: [
        "Raggiungi la casella della mini pozione.",
        "Seleziona il giocatore che deve ricevere la cura.",
        "Acquista o attiva la pozione.",
        "L’effetto viene applicato subito.",
        "La salute e la stamina recuperano una piccola quantità."
      ]
    },
    {
      type: "requirements",
      title: "Regole principali",
      checks: [
        { label: "Tipo", value: "Cura leggera" },
        { label: "Effetto", value: "Recupero immediato" },
        { label: "Uso", value: "Diretto, non trasportabile per ora" },
        { label: "Ruolo", value: "Supporto rapido e contenuto" }
      ]
    },
    {
      type: "text",
      title: "Effetto della cura",
      text: "La Mini Pozione di Cura agisce subito e permette di recuperare una porzione modesta di risorse vitali. Non è pensata per ribaltare da sola uno scontro, ma per evitare che una ferita minore diventi un problema più grande."
    },
    {
      type: "warning",
      title: "Uso immediato",
      text: "Per ora questa pozione non viene conservata nello zaino. Quando viene usata, il suo effetto si applica subito e non resta come scorta trasportabile."
    },
    {
      type: "reward",
      title: "Valore strategico",
      text: "Anche una cura piccola può fare la differenza. Usata al momento giusto, la mini pozione permette di continuare il cammino, sostenere un altro incontro o evitare di arrivare troppo scoperti alla prova successiva."
    },
    {
      type: "warning",
      title: "Non basta nelle emergenze grandi",
      text: "La Mini Pozione di Cura non è fatta per salvare un personaggio quasi distrutto. È una cura di mantenimento, non una resurrezione rapida. Va usata con intelligenza, non con disperazione."
    },
    {
      type: "text",
      title: "Consiglio del viandante",
      text: "Chi aspetta sempre la cura perfetta spesso cade prima di trovarla. Una piccola guarigione al momento giusto vale più di una grande pozione usata troppo tardi."
    }
  ]
},

raccolta_diamanti: {
  title: "Diamanti",
  intro: "Nelle profondità dove la roccia custodisce i propri segreti più preziosi, giacciono i diamanti: gemme dure, rare e splendenti, nate sotto pressioni che spezzerebbero qualsiasi cosa viva. Non sono semplici ricchezze, ma simboli di potere, prestigio e possibilità superiori.",

  sections: [
    {
      type: "text",
      title: "Natura della risorsa",
      text: "I diamanti sono una delle risorse più pregiate del regno. Come le altre materie prime, vengono raccolti tramite il tiro dei dadi, passano prima nello zaino e diventano davvero utilizzabili solo dopo il deposito nell’inventario."
    },
    {
      type: "steps",
      title: "Come funziona la raccolta",
      items: [
        "Raggiungi una casella risorsa dedicata ai diamanti.",
        "Tira 2 dadi e calcola la somma totale.",
        "Moltiplica il risultato per 2 per conoscere la quantità raccolta.",
        "I diamanti ottenuti finiscono prima nello zaino.",
        "Deposita il contenuto dello zaino nell’inventario per poterli usare davvero."
      ]
    },
    {
      type: "requirements",
      title: "Regole di raccolta",
      checks: [
        { label: "Dadi usati", value: "2d6" },
        { label: "Valore tiro valido", value: "Da 2 a 12" },
        { label: "Quantità ottenuta", value: "Somma dei dadi ×2" },
        { label: "Primo deposito", value: "Zaino" },
        { label: "Uso effettivo", value: "Dopo deposito in inventario" }
      ]
    },
    {
      type: "warning",
      title: "Limite dello zaino",
      text: "Anche i diamanti occupano spazio nello zaino insieme alle altre risorse. Finché restano lì, non possono essere spesi davvero e sottraggono capienza alle raccolte future. Chi accumula senza depositare rischia di bloccare la propria efficienza."
    },
    {
      type: "text",
      title: "Deposito e disponibilità",
      text: "Solo una volta trasferiti nell’inventario i diamanti diventano una risorsa spendibile. Da quel momento possono essere usati per forgia, reclutamenti avanzati, economie di alto livello e tutte le operazioni che richiedono materiali preziosi."
    },
    {
      type: "list",
      title: "A cosa servono le risorse preziose",
      items: [
        "Reclutare bande avanzate",
        "Sostenere forgia e miglioramenti",
        "Acquistare o completare operazioni costose",
        "Potenziare la crescita del regno",
        "Vendere materiali di grande valore al mercato",
        "Bilanciare le carenze nelle fasi avanzate"
      ]
    },
    {
      type: "text",
      title: "Il ruolo dei diamanti",
      text: "I diamanti non servono tanto alla semplice sopravvivenza, quanto al salto di qualità. Dove il legno costruisce, il ferro sostiene e il rame accompagna la crescita, i diamanti intervengono quando il giocatore vuole accedere a strumenti più rari e forme di potere superiori."
    },
    {
      type: "reward",
      title: "Valore strategico",
      text: "Accumulare diamanti significa prepararsi alle spese più nobili e più dure del regno. Sono merce di prestigio, riserva di scambio e chiave indiretta per molti dei progressi più importanti."
    },
    {
      type: "warning",
      title: "Errore comune dei novizi",
      text: "Molti vendono i diamanti appena li trovano, attratti dal denaro immediato. Ma chi li disperde troppo in fretta spesso si ritrova più avanti senza la risorsa necessaria per reclutare, forgiare o completare un passaggio decisivo."
    },
    {
      type: "text",
      title: "Consiglio del gioielliere del regno",
      text: "Non guardare il diamante solo per il suo prezzo. Guardalo per ciò che rende possibile. Una gemma ben custodita non è solo ricchezza: è una porta aperta verso un potere che gli altri non potranno comprare all’ultimo momento."
    }
  ]
},

dragone_nero: {
  title: "Dragone Nero",
  intro: "Al limite del mondo conosciuto, dove la terra si spezza e il respiro stesso del regno si fa pesante, veglia il Dragone Nero. Non custodisce un tesoro, ma una soglia. È il guardiano dell’ingresso al Dungeon, l’ultima sentenza posta fra i vivi e l’abisso profondo. Finché il drago resta in piedi, nessuno entra.",

  sections: [
    {
      type: "text",
      title: "Ruolo nel mondo",
      text: "Il Dragone Nero non è soltanto un nemico da sconfiggere: è il guardiano della porta del Dungeon. La sua presenza segna il confine fra il mondo esterno e le profondità più oscure del regno. Solo chi riesce ad abbatterlo conquista il diritto di oltrepassare la soglia."
    },
    {
      type: "requirements",
      title: "Identità del mostro",
      checks: [
        { label: "Categoria", value: "Mostro Maggiore" },
        { label: "Difficoltà", value: "Difficile" },
        { label: "Livello", value: "6" },
        { label: "Funzione", value: "Guardiano dell’ingresso al Dungeon" }
      ]
    },
    {
      type: "requirements",
      title: "Potenza del Mostro",
      checks: [
        { label: "Potenza Totale", value: "5200" },
        { label: "Salute", value: "230" }
      ]
    },
    {
      type: "requirements",
      title: "Distribuzione del Potere",
      checks: [
        { label: "Forza", value: "1200" },
        { label: "Astuzia", value: "850" },
        { label: "Ingegno", value: "900" },
        { label: "Magia", value: "950" },
        { label: "Destrezza", value: "1300" }
      ]
    },
    {
      type: "requirements",
      title: "Accesso ai mostri",
      checks: [
        { label: "Per Mostri Minori", value: "Serve almeno 1 scrigno aperto" },
        { label: "Per Mostri Maggiori", value: "Servono almeno 4 scrigni aperti" }
      ]
    },
    {
      type: "warning",
      title: "Sigillo d’accesso",
      text: "Il Dragone Nero appartiene ai Mostri Maggiori. Nessun guerriero può sfidarlo senza aver prima aperto almeno quattro scrigni. Questa non è solo una regola di accesso: è il segno che la soglia del Dungeon non si apre ai deboli né agli impreparati."
    },
    {
      type: "text",
      title: "Origine della creatura",
      text: "Le antiche cronache narrano che il Dragone Nero fu posto a guardia dell’abisso quando il regno comprese che certe profondità non dovevano essere raggiunte con leggerezza. Da allora non è più soltanto una creatura, ma una prova vivente: un confine armato di artigli, fuoco e volontà."
    },
    {
      type: "text",
      title: "Stile di combattimento",
      text: "Il Dragone Nero domina lo scontro con una potenza equilibrata e mostruosa. Non dipende da un solo aspetto: forza, magia, ingegno, astuzia e destrezza si sostengono a vicenda, rendendolo un avversario completo. È il tipo di mostro che punisce ogni build fragile o troppo sbilanciata."
    },
    {
      type: "warning",
      title: "Perché è pericoloso",
      text: "La sua destrezza è altissima, ma non è quello il solo problema. Il Dragone Nero supera la soglia della semplice brutalità: è rapido, resistente, lucido e arcano. Ogni errore contro di lui pesa più del normale, perché non concede quasi mai un fronte davvero debole. "
    },
    {
      type: "steps",
      title: "Come affrontarlo",
      items: [
        "Seleziona il giocatore che combatterà.",
        "Verifica di aver aperto almeno 4 scrigni.",
        "Scegli da 1 a 5 attributi da utilizzare nello scontro.",
        "Inserisci i risultati dei dadi per ogni attributo scelto.",
        "Confronta la tua potenza con quella del Dragone Nero.",
        "Se lo sconfiggi, la soglia del Dungeon viene spezzata."
      ]
    },
    {
      type: "reward",
      title: "Ricompense",
      text: "Sconfiggere il Dragone Nero garantisce 129000 monete, +330 magia e +310 forza. Ma il premio più importante non è soltanto materiale: con la sua caduta si apre finalmente l’accesso al Dungeon."
    },
    {
      type: "requirements",
      title: "Premio del vincitore",
      checks: [
        { label: "Monete", value: "129000" },
        { label: "Magia", value: "+330" },
        { label: "Forza", value: "+310" },
        { label: "Effetto mondo", value: "Accesso al Dungeon" }
      ]
    },
    {
      type: "text",
      title: "Consiglio del veterano",
      text: "Non guardare il Dragone Nero come un semplice boss. Guardalo come una porta vivente. Se lo affronti troppo presto, non perderai solo uno scontro: resterai escluso dall’abisso che attende oltre. Preparati come se stessi combattendo per entrare in una nuova era del gioco, perché è esattamente ciò che accade."
    }
  ]
},

zombie: {
  title: "Zombie",
  intro: "Non corre come una belva e non splende come una creatura magica, ma avanza con la pazienza della morte stessa. Lo Zombie è carne rimasta in piedi per odio, un corpo svuotato di anima che continua a muoversi solo per trascinare altri nel proprio silenzio marcio.",

  sections: [
    {
      type: "text",
      title: "Origine della creatura",
      text: "Si dice che gli zombie nascano dove la morte non trova pace. Cadaveri dimenticati, guerrieri spezzati o viandanti divorati dalla rovina si rialzano senza volontà, guidati soltanto da un impulso oscuro. Non combattono per gloria, ma per fame e contaminazione."
    },
    {
      type: "requirements",
      title: "Identità del mostro",
      checks: [
        { label: "Categoria", value: "Mostro Minore" },
        { label: "Difficoltà", value: "Media" },
        { label: "Livello", value: "1" },
        { label: "Potenza Totale", value: "500" },
        { label: "Salute", value: "40" }
      ]
    },
    {
      type: "requirements",
      title: "Distribuzione del Potere",
      checks: [
        { label: "Forza", value: "180" },
        { label: "Astuzia", value: "70" },
        { label: "Ingegno", value: "60" },
        { label: "Magia", value: "40" },
        { label: "Destrezza", value: "150" }
      ]
    },
    {
      type: "requirements",
      title: "Accesso ai mostri",
      checks: [
        { label: "Per Mostri Minori", value: "Serve almeno 1 scrigno aperto" },
        { label: "Per Mostri Maggiori", value: "Servono almeno 4 scrigni aperti" }
      ]
    },
    {
      type: "warning",
      title: "Sigillo d’accesso",
      text: "Lo Zombie appartiene ai Mostri Minori. Per affrontarlo devi aver già aperto almeno uno scrigno. I Mostri Maggiori, invece, attendono solo chi ha già spezzato il sigillo di quattro scrigni."
    },
    {
      type: "text",
      title: "Stile di combattimento",
      text: "Lo Zombie non è raffinato, ma è più pericoloso di quanto sembri. Colpisce soprattutto con forza e resistenza grezza, sostenuto da una destrezza sporca e imprevedibile. Non vince per eleganza: vince logorando chi gli resta troppo vicino."
    },
    {
      type: "text",
      title: "La minaccia dei non morti",
      text: "Contro uno zombie il pericolo non è soltanto il colpo ricevuto, ma la sensazione di dover abbattere qualcosa che continua a tornare avanti. La sua presenza mette pressione, costringe a non sprecare risorse e punisce chi pensa che un cadavere ambulante sia una sfida banale."
    },
    {
      type: "steps",
      title: "Come affrontarlo",
      items: [
        "Seleziona il giocatore che combatterà.",
        "Verifica di aver aperto almeno 1 scrigno, requisito dei mostri minori.",
        "Scegli da 1 a 5 attributi da utilizzare nello scontro.",
        "Inserisci i risultati dei dadi per ogni attributo scelto.",
        "Confronta la tua potenza con quella dello Zombie per determinare l’esito."
      ]
    },
    {
      type: "warning",
      title: "Perché è pericoloso",
      text: "Anche se è un mostro minore di livello 1, lo Zombie possiede una potenza reale di 500. Questo lo rende una minaccia iniziale concreta, soprattutto per i giocatori che entrano nel sistema mostri senza essersi ancora preparati abbastanza. "
    },
    {
      type: "reward",
      title: "Ricompense",
      text: "Sconfiggere lo Zombie garantisce 12400 monete, oltre a una crescita di +32 destrezza e +30 forza. Non è solo una vittoria di denaro: è il primo vero passo contro la corruzione vivente del regno."
    },
    {
      type: "requirements",
      title: "Premio del vincitore",
      checks: [
        { label: "Monete", value: "12400" },
        { label: "Destrezza", value: "+32" },
        { label: "Forza", value: "+30" }
      ]
    },
    {
      type: "text",
      title: "Consiglio del veterano",
      text: "Non sottovalutare i primi non morti. Molti guerrieri cercano sfide più spettacolari e finiscono battuti da ciò che ritenevano troppo semplice. Lo Zombie non impressiona per nobiltà o magia, ma è abbastanza forte da insegnare subito il rispetto per i mostri dell’Abisso."
    }
  ]
},

potere_terra: {
  title: "Potere Elementale della Terra",
  intro: "Dalle profondità silenziose del regno sale una forza antica e immobile: la Terra. Non brilla, non esplode, non corre. Resiste. E chi riesce ad assorbirne una parte porta con sé una stabilità che può fare la differenza nello scontro.",

  sections: [
    {
      type: "text",
      title: "Natura del potere",
      text: "Il Potere Elementale della Terra è una forma di energia primordiale che il giocatore può acquisire. Non è un’arma né una risorsa, ma un’influenza che rafforza il personaggio durante gli scontri contro i mostri."
    },
    {
      type: "text",
      title: "Effetto",
      text: "Una volta ottenuto, il potere della terra conferisce un piccolo bonus alla potenza del giocatore nei combattimenti contro i mostri. È un vantaggio semplice, ma costante, che può aiutare a superare scontri al limite."
    },
    {
      type: "requirements",
      title: "Caratteristiche del potere",
      checks: [
        { label: "Tipo", value: "Potere elementale" },
        { label: "Effetto", value: "Bonus contro i mostri" },
        { label: "Intensità", value: "Leggera" },
        { label: "Uso", value: "Automatico durante il combattimento" }
      ]
    },
    {
      type: "text",
      title: "Forza della Terra",
      text: "La Terra non colpisce per velocità o magia, ma per solidità. Il suo potere si manifesta nel rendere più stabile il combattimento, permettendo al giocatore di reggere meglio lo scontro e trasformare piccoli margini in vittorie."
    },
    {
      type: "warning",
      title: "Potere limitato",
      text: "Il Potere della Terra non è pensato per ribaltare da solo uno scontro difficile. È un vantaggio di supporto, utile ma non decisivo, soprattutto nelle fasi iniziali del gioco."
    },
    {
      type: "reward",
      title: "Valore strategico",
      text: "Anche un piccolo bonus può fare la differenza nei combattimenti contro i mostri. Il Potere della Terra è spesso ciò che permette di trasformare uno scontro incerto in una vittoria controllata."
    },
    {
      type: "text",
      title: "Evoluzione futura",
      text: "Questo potere rappresenta solo una prima forma di connessione con gli elementi. In futuro, le forze elementali potranno essere più profonde, più complesse e più determinanti nel definire lo stile di gioco del personaggio."
    },
    {
      type: "text",
      title: "Consiglio dell’antico druido",
      text: "Non disprezzare ciò che sembra piccolo. La Terra insegna che la forza più grande non è quella che si vede subito, ma quella che regge tutto il resto senza cedere."
    }
  ]
},

pozione_media: {
  title: "Pozione Media",
  intro: "Non umile come le cure minori e non rara come i rimedi leggendari, la Pozione Media è il punto d’equilibrio del viandante saggio. È la cura di chi vuole restare saldo, senza aspettare di precipitare nell’emergenza.",

  sections: [
    {
      type: "text",
      title: "Natura della pozione",
      text: "La Pozione Media è una cura intermedia pensata per riportare il personaggio in uno stato stabile. Offre un recupero più consistente rispetto alle cure leggere, senza appartenere ancora alla categoria dei rimedi eccezionali."
    },
    {
      type: "steps",
      title: "Come si usa",
      items: [
        "Raggiungi la casella o il punto in cui la pozione è disponibile.",
        "Seleziona il giocatore che deve ricevere la cura.",
        "Attiva o acquista la pozione.",
        "L’effetto viene applicato immediatamente.",
        "Salute e stamina recuperano una quantità intermedia."
      ]
    },
    {
      type: "requirements",
      title: "Regole principali",
      checks: [
        { label: "Tipo", value: "Cura intermedia" },
        { label: "Effetto", value: "Recupero immediato" },
        { label: "Uso", value: "Diretto, non trasportabile per ora" },
        { label: "Ruolo", value: "Stabilizzazione del personaggio" }
      ]
    },
    {
      type: "text",
      title: "Effetto della cura",
      text: "La Pozione Media agisce subito e permette di recuperare una quantità significativa di salute e stamina. Non è una cura definitiva, ma è abbastanza forte da riportare il personaggio in condizioni molto più sicure prima di una nuova prova."
    },
    {
      type: "warning",
      title: "Uso immediato",
      text: "Per ora questa pozione non viene conservata nello zaino. Una volta attivata, l’effetto si applica subito e non resta come scorta trasportabile."
    },
    {
      type: "reward",
      title: "Valore strategico",
      text: "La Pozione Media è spesso il miglior compromesso tra costo, recupero e affidabilità. È ideale quando una cura piccola non basta più, ma non vuoi ancora ricorrere a un rimedio raro o troppo prezioso."
    },
    {
      type: "warning",
      title: "Non sprecarla",
      text: "Usare una Pozione Media quando il danno subito è minimo può essere uno spreco. Il suo valore emerge davvero quando il personaggio è indebolito ma ancora in grado di rientrare in controllo con un recupero consistente."
    },
    {
      type: "text",
      title: "Quando conviene usarla",
      text: "Conviene usarla quando hai già perso una parte importante delle tue risorse vitali ma vuoi restare competitivo. È la cura del guerriero previdente, che preferisce ristabilirsi in tempo invece di aspettare il limite."
    },
    {
      type: "text",
      title: "Consiglio del cerusico",
      text: "Le cure migliori non sono quelle più rare, ma quelle usate al momento giusto. Una pozione media bevuta con saggezza salva più battaglie di una reliquia custodita troppo a lungo."
    }
  ]
},

potere_acqua: {
  title: "Potere Elementale dell’Acqua",
  intro: "L’acqua non avanza con rumore, eppure scava la pietra, piega i sentieri e trova sempre una via. Chi riesce ad assorbirne l’essenza non ottiene una forza brutale, ma un vantaggio sottile, fluido e costante contro le creature del regno.",

  sections: [
    {
      type: "text",
      title: "Natura del potere",
      text: "Il Potere Elementale dell’Acqua è una forma di energia primordiale che il giocatore può acquisire. Non è un’arma né una risorsa materiale, ma una presenza che accompagna il personaggio e ne aumenta leggermente l’efficacia contro i mostri."
    },
    {
      type: "text",
      title: "Effetto",
      text: "Una volta ottenuto, il potere dell’acqua conferisce un piccolo bonus alla potenza del giocatore durante i combattimenti contro i mostri. È un aiuto leggero, ma utile, soprattutto quando lo scontro si decide su margini ridotti."
    },
    {
      type: "requirements",
      title: "Caratteristiche del potere",
      checks: [
        { label: "Tipo", value: "Potere elementale" },
        { label: "Effetto", value: "Bonus contro i mostri" },
        { label: "Intensità", value: "Leggera (per ora)" },
        { label: "Uso", value: "Automatico durante il combattimento" }
      ]
    },
    {
      type: "text",
      title: "Forza dell’Acqua",
      text: "L’acqua non domina con l’impatto, ma con il flusso. Il suo potere aiuta il giocatore a mantenere continuità nello scontro, a reggere meglio la pressione e a trasformare una spinta lieve in un vantaggio concreto."
    },
    {
      type: "warning",
      title: "Potere limitato",
      text: "Il Potere dell’Acqua non è pensato per capovolgere da solo una battaglia difficile. È un supporto elementale leggero, pensato per accompagnare il giocatore e non per sostituire la sua preparazione."
    },
    {
      type: "reward",
      title: "Valore strategico",
      text: "Anche un piccolo bonus può diventare prezioso contro i mostri. Il Potere dell’Acqua è utile proprio perché lavora in silenzio: non si impone con eccesso, ma sostiene il personaggio nei punti in cui una piccola differenza cambia l’esito dello scontro."
    },
    {
      type: "text",
      title: "Evoluzione futura",
      text: "Questa è solo una forma iniziale del legame con l’acqua. In futuro i poteri elementali potranno essere più profondi, più distinti e capaci di influenzare in modo molto più marcato lo stile di gioco del personaggio."
    },
    {
      type: "text",
      title: "Consiglio dell’antico custode",
      text: "Non cercare sempre la forza che travolge. A volte vince di più ciò che sa adattarsi, scorrere e restare presente fino alla fine. L’acqua insegna che non tutto il potere ha bisogno di gridare."
    }
  ]
},

messaggero_del_patto: {
  title: "Messaggero del Patto",
  intro: "Non porta guerra, non porta pace. Il Messaggero del Patto arriva solo quando il destino vuole porre una scelta davanti al viandante. La sua voce offre ricompense, ma ogni dono porta con sé un prezzo. Davanti a lui non si decide solo cosa ottenere… si decide cosa diventare.",

  sections: [
    {
      type: "text",
      title: "Natura del luogo",
      text: "Il Messaggero del Patto è una casella di evento speciale. Qui il giocatore riceve una missione casuale legata a ricchezze, risorse, forza, magia, fame, esperienza o altri vantaggi. Ma il vero cuore dell’incontro non è il premio: è la scelta finale fra guadagno materiale e salvaguardia spirituale."
    },
    {
      type: "list",
      title: "Cosa può accadere",
      items: [
        "Il Messaggero genera una missione casuale",
        "Ogni missione ha un bersaglio preciso su 2d6",
        "Il giocatore tira 2d6 per rivelare il giudizio del destino",
        "In base allo scarto si determina la qualità del risultato",
        "Alla fine il giocatore sceglie se Riscuotere o Ribaltare l’evento"
      ]
    },
    {
      type: "steps",
      title: "Come funziona",
      items: [
        "Seleziona il giocatore.",
        "Genera una missione del Messaggero.",
        "Osserva il bersaglio richiesto dalla missione.",
        "Tira o inserisci il risultato di 2d6.",
        "Confronta il tiro con il bersaglio.",
        "Scopri le due vie finali: Riscuoti oppure Ribalta evento."
      ]
    },
    {
      type: "requirements",
      title: "Giudizio del dado",
      checks: [
        { label: "Scarto 0", value: "Premio pieno, impatto spirituale forte" },
        { label: "Scarto 1-4", value: "Premio medio" },
        { label: "Scarto 5-7", value: "Premio ridotto" },
        { label: "Scarto 8-10", value: "Nessun premio materiale, forte purificazione" }
      ]
    },
    {
      type: "text",
      title: "Le missioni del Messaggero",
      text: "Le prove offerte dal Messaggero possono riguardare tesori d’oro, arsenali perduti, fonti di conoscenza, sigilli di forza, visioni d’astuzia, vigore predatorio, cave di diamanti, banchetti oscuri, fiamme abissali o reliquiari colmi di bottino. Ogni missione promette ricompense diverse, ma tutte sono governate dallo stesso patto. :contentReference[oaicite:1]{index=1}"
    },
    {
      type: "reward",
      title: "Scelta: Riscuoti",
      text: "Se scegli di Riscuotere, accetti il premio materiale secondo la qualità del risultato ottenuto. Puoi guadagnare monete, oro, ferro, rame, legno, diamanti, esperienza, forza, magia, salute, stamina, fame e altri vantaggi. Ma il patto non è gratuito: la tua Anima diminuisce, mentre la Corruzione cresce. :contentReference[oaicite:2]{index=2}"
    },
    {
      type: "reward",
      title: "Scelta: Ribalta evento",
      text: "Se scegli di Ribaltare l’evento, il guadagno materiale si riduce o si annulla, ma l’equilibrio spirituale migliora. In questa via l’Anima cresce, la Corruzione non aumenta e la Purificazione sale. È la scelta di chi rinuncia a una parte del bottino per non piegarsi troppo al patto oscuro. :contentReference[oaicite:3]{index=3}"
    },
    {
      type: "warning",
      title: "Prezzo spirituale",
      text: "Il Messaggero non offre mai un dono innocente. Chi prende troppo spesso la via del guadagno immediato rischia di consumare l’Anima e lasciare spazio alla Corruzione. Chi invece ribalta sempre il patto protegge il proprio spirito, ma rinuncia a parte della crescita materiale."
    },
    {
      type: "text",
      title: "Equilibrio tra materia e spirito",
      text: "Questa casella rappresenta una delle scelte più profonde del gioco: diventare più ricco e più forte nel breve periodo, oppure restare più puro e saldo nel lungo cammino. Il Messaggero non misura solo la fortuna del dado, ma anche la direzione morale del personaggio."
    },
    {
      type: "warning",
      title: "Regola importante",
      text: "Il risultato finale non dipende soltanto dal tiro, ma anche dalla distanza dal bersaglio. Più il dado si avvicina al centro perfetto, più il patto si fa intenso. Talvolta il premio cresce… e con esso cresce anche il costo dell’anima."
    },
    {
      type: "text",
      title: "Consiglio dell’oracolo errante",
      text: "Non chiederti solo cosa puoi ottenere. Chiediti cosa il patto prenderà da te. Alcuni guerrieri si arricchiscono a ogni incontro col Messaggero, ma arrivano alla fine del cammino con il cuore già venduto."
    }
  ]
},

potere_fuoco: {
  title: "Potere Elementale del Fuoco",
  intro: "Il fuoco non chiede permesso, non attende e non si piega. Divampa, consuma e impone la propria presenza. Chi riesce ad assorbirne una scintilla porta con sé una forza breve ma feroce, capace di rendere più incisivo lo scontro contro i mostri.",

  sections: [
    {
      type: "text",
      title: "Natura del potere",
      text: "Il Potere Elementale del Fuoco è una forma di energia primordiale che il giocatore può acquisire. Non è un oggetto né una risorsa materiale, ma un’influenza che aumenta leggermente la capacità offensiva del personaggio contro i mostri."
    },
    {
      type: "text",
      title: "Effetto",
      text: "Una volta ottenuto, il potere del fuoco conferisce un piccolo bonus alla potenza del giocatore durante i combattimenti contro i mostri. È un vantaggio leggero, ma utile per rendere più incisivi gli scontri."
    },
    {
      type: "requirements",
      title: "Caratteristiche del potere",
      checks: [
        { label: "Tipo", value: "Potere elementale" },
        { label: "Effetto", value: "Bonus contro i mostri" },
        { label: "Intensità", value: "Leggera (per ora)" },
        { label: "Uso", value: "Automatico durante il combattimento" }
      ]
    },
    {
      type: "text",
      title: "Forza del Fuoco",
      text: "Il fuoco rappresenta pressione, impatto e slancio. Il suo potere aiuta il giocatore a spingere di più nei combattimenti, trasformando una forza contenuta in una presenza più aggressiva contro le creature del regno."
    },
    {
      type: "warning",
      title: "Potere limitato",
      text: "Il Potere del Fuoco non è pensato per ribaltare da solo uno scontro difficile. È un supporto elementale leggero, utile ma non sufficiente a sostituire preparazione, attributi e strategia."
    },
    {
      type: "reward",
      title: "Valore strategico",
      text: "Anche un piccolo incremento può fare la differenza quando lo scontro si decide su margini ridotti. Il Potere del Fuoco è prezioso proprio perché aggiunge spinta dove serve colpire con maggiore decisione."
    },
    {
      type: "text",
      title: "Evoluzione futura",
      text: "Questa è solo una prima forma del legame con il fuoco. In futuro i poteri elementali potranno avere identità più marcate, effetti distinti e un impatto maggiore sullo stile di gioco del personaggio."
    },
    {
      type: "text",
      title: "Consiglio del custode della fiamma",
      text: "Il fuoco insegna che non tutta la forza nasce dalla misura. A volte basta una scintilla ben guidata per cambiare il peso di uno scontro."
    }
  ]
},

mostro_terra: {
  title: "Mostro di Terra",
  intro: "Là dove il suolo si spezza e le rocce sembrano respirare, si erge il Mostro di Terra. Non corre, non fugge e non conosce esitazione. È una massa viva di pietra, radici e forza sepolta, una creatura che avanza come una frana e schiaccia tutto ciò che non riesce a reggerne il peso.",

  sections: [
    {
      type: "text",
      title: "Origine della creatura",
      text: "Le leggende raccontano che il Mostro di Terra nacque nelle viscere del regno, quando antichi sigilli si spezzarono e la materia stessa cominciò a mutare. Non è soltanto un mostro: è la pazienza brutale della pietra, un potere antico che si è alzato per difendere ciò che dorme sotto il mondo."
    },
    {
      type: "requirements",
      title: "Identità del mostro",
      checks: [
        { label: "Categoria", value: "Mostro Minore" },
        { label: "Difficoltà", value: "Difficile" },
        { label: "Livello", value: "3" },
        { label: "Potenza Totale", value: "1700" },
        { label: "Salute", value: "95" }
      ]
    },
    {
      type: "requirements",
      title: "Distribuzione del Potere",
      checks: [
        { label: "Forza", value: "420" },
        { label: "Astuzia", value: "180" },
        { label: "Ingegno", value: "260" },
        { label: "Magia", value: "300" },
        { label: "Destrezza", value: "540" }
      ]
    },
    {
      type: "requirements",
      title: "Accesso ai mostri",
      checks: [
        { label: "Per Mostri Minori", value: "Serve almeno 1 scrigno aperto" },
        { label: "Per Mostri Maggiori", value: "Servono almeno 4 scrigni aperti" }
      ]
    },
    {
      type: "warning",
      title: "Sigillo d’accesso",
      text: "Il Mostro di Terra appartiene ai Mostri Minori. Per affrontarlo devi aver già aperto almeno uno scrigno. I Mostri Maggiori, invece, attendono solo chi ha già spezzato il sigillo di quattro scrigni."
    },
    {
      type: "text",
      title: "Stile di combattimento",
      text: "Il Mostro di Terra non combatte con eleganza, ma con pressione costante. La sua forza è alta, la sua presenza è pesante e la sua resistenza trasforma ogni scontro in una prova di tenuta. Non travolge con un lampo: soffoca lentamente ogni tentativo di opposizione."
    },
    {
      type: "text",
      title: "La minaccia della pietra",
      text: "Contro questa creatura il vero pericolo è sentirsi rallentati, compressi, schiacciati dalla sua solidità. Ogni colpo sembra arrivare dal terreno stesso, e chi non possiede abbastanza stabilità rischia di cedere prima ancora di capire quanto il peso della battaglia stia crescendo."
    },
    {
      type: "steps",
      title: "Come affrontarlo",
      items: [
        "Seleziona il giocatore che combatterà.",
        "Verifica di aver aperto almeno 1 scrigno, requisito dei mostri minori.",
        "Scegli da 1 a 5 attributi da utilizzare nello scontro.",
        "Inserisci i risultati dei dadi per ogni attributo scelto.",
        "Confronta la tua potenza con quella del Mostro di Terra per determinare l’esito."
      ]
    },
    {
      type: "warning",
      title: "Perché è pericoloso",
      text: "Pur essendo un mostro minore, il Mostro di Terra possiede una potenza reale di 1700. Ha una struttura molto più solida di quanto sembri, con forza alta, buona magia e una destrezza sorprendentemente elevata per una creatura così massiccia. "
    },
    {
      type: "reward",
      title: "Ricompense",
      text: "Sconfiggere il Mostro di Terra garantisce 14600 monete, oltre a una crescita di +74 forza e +70 salute. Chi resiste al peso della terra ne assorbe una parte della durezza, tornando dal combattimento più robusto e più saldo. :contentReference[oaicite:3]{index=3}"
    },
    {
      type: "requirements",
      title: "Premio del vincitore",
      checks: [
        { label: "Monete", value: "14600" },
        { label: "Forza", value: "+74" },
        { label: "Salute", value: "+70" }
      ]
    },
    {
      type: "text",
      title: "Consiglio del veterano",
      text: "Non affrontarlo pensando solo a colpire più forte. Il Mostro di Terra si batte meglio con equilibrio, continuità e capacità di reggere pressione. Contro la pietra non basta essere rapidi: bisogna anche restare in piedi abbastanza a lungo da spezzarla."
    }
  ]
},

pozione_minore: {
  title: "Pozione Minore",
  intro: "Piccola ma affidabile, la Pozione Minore è il rimedio di chi conosce il valore della prudenza. Non promette miracoli, ma offre abbastanza sollievo da permettere al viandante di restare in cammino senza cedere troppo presto alla fatica o alle ferite.",

  sections: [
    {
      type: "text",
      title: "Natura della pozione",
      text: "La Pozione Minore è una cura leggera ma più solida di una mini cura. Serve a recuperare una parte moderata di salute e stamina, mantenendo il personaggio in condizioni più stabili senza ricorrere a rimedi più costosi o rari."
    },
    {
      type: "steps",
      title: "Come si usa",
      items: [
        "Raggiungi la casella o il punto in cui la pozione è disponibile.",
        "Seleziona il giocatore che deve ricevere la cura.",
        "Attiva o acquista la pozione.",
        "L’effetto viene applicato immediatamente.",
        "Salute e stamina recuperano una quantità leggera ma utile."
      ]
    },
    {
      type: "requirements",
      title: "Regole principali",
      checks: [
        { label: "Tipo", value: "Cura leggera" },
        { label: "Effetto", value: "Recupero immediato" },
        { label: "Uso", value: "Diretto, non trasportabile per ora" },
        { label: "Ruolo", value: "Supporto costante e mantenimento" }
      ]
    },
    {
      type: "text",
      title: "Effetto della cura",
      text: "La Pozione Minore agisce subito e permette di recuperare una quantità utile di salute e stamina. Non è una cura ampia, ma è abbastanza efficace da evitare che un danno contenuto si trasformi in un problema più grave."
    },
    {
      type: "warning",
      title: "Uso immediato",
      text: "Per ora questa pozione non viene conservata nello zaino. Una volta attivata, l’effetto si applica subito e non resta come scorta trasportabile."
    },
    {
      type: "reward",
      title: "Valore strategico",
      text: "La Pozione Minore è preziosa perché aiuta a mantenere continuità nel viaggio. È utile quando una mini cura non basta più, ma non vuoi ancora spendere una cura media o superiore."
    },
    {
      type: "warning",
      title: "Non è una cura d’emergenza",
      text: "La Pozione Minore non è pensata per salvare un personaggio quasi sconfitto. Rende meglio quando viene usata per stabilizzare in anticipo, non quando il personaggio è già al limite."
    },
    {
      type: "text",
      title: "Quando conviene usarla",
      text: "Conviene usarla quando hai subito un danno moderato e vuoi restare in controllo senza sprecare risorse più importanti. È la cura di chi preferisce gestire il rischio prima che diventi pericoloso."
    },
    {
      type: "text",
      title: "Consiglio del guaritore",
      text: "Chi sa curarsi con misura percorre più strada di chi aspetta sempre il momento disperato. Una pozione minore usata bene vale più di una cura grande cercata troppo tardi."
    }
  ]
},

mostro_degli_abissi: {
  title: "Mostro degli Abissi",
  intro: "Là dove la luce si spegne e il silenzio diventa peso, si muove il Mostro degli Abissi. Non appartiene del tutto alla terra né all’acqua, ma a qualcosa di più antico e più profondo. Chi lo guarda troppo a lungo ha la sensazione di essere osservato da un buio che pensa.",

  sections: [
    {
      type: "text",
      title: "Origine della creatura",
      text: "Le cronache più oscure narrano che questa creatura sia nata nei recessi sommersi del mondo, in luoghi dove il regno non ha mai davvero portato il proprio dominio. Non è un semplice predatore: è una presenza abissale, una forma vivente di pressione, oscurità e volontà corrotta."
    },
    {
      type: "requirements",
      title: "Identità del mostro",
      checks: [
        { label: "Categoria", value: "Mostro Minore" },
        { label: "Difficoltà", value: "Difficile" },
        { label: "Livello", value: "6" },
        { label: "Potenza Totale", value: "3500" },
        { label: "Salute", value: "160" }
      ]
    },
    {
      type: "requirements",
      title: "Distribuzione del Potere",
      checks: [
        { label: "Forza", value: "700" },
        { label: "Astuzia", value: "500" },
        { label: "Ingegno", value: "700" },
        { label: "Magia", value: "650" },
        { label: "Destrezza", value: "950" }
      ]
    },
    {
      type: "requirements",
      title: "Accesso ai mostri",
      checks: [
        { label: "Per Mostri Minori", value: "Serve almeno 1 scrigno aperto" },
        { label: "Per Mostri Maggiori", value: "Servono almeno 4 scrigni aperti" }
      ]
    },
    {
      type: "warning",
      title: "Sigillo d’accesso",
      text: "Il Mostro degli Abissi appartiene ai Mostri Minori. Per affrontarlo devi aver già aperto almeno uno scrigno. I Mostri Maggiori, invece, attendono solo chi ha già spezzato il sigillo di quattro scrigni."
    },
    {
      type: "text",
      title: "Stile di combattimento",
      text: "Il Mostro degli Abissi non colpisce solo con la forza. La sua vera minaccia è l’equilibrio mostruoso fra velocità, mente e pressione costante. È rapido, intelligente e abbastanza potente da schiacciare sia chi entra impreparato sia chi si affida a una sola statistica."
    },
    {
      type: "text",
      title: "La minaccia dell’abisso",
      text: "Contro questa creatura il pericolo non è soltanto il danno subito, ma la sensazione di essere trascinati sempre più a fondo. Ogni fase dello scontro sembra togliere respiro, chiarezza e controllo. Combatterlo significa resistere a qualcosa che vuole consumarti poco a poco."
    },
    {
      type: "steps",
      title: "Come affrontarlo",
      items: [
        "Seleziona il giocatore che combatterà.",
        "Verifica di aver aperto almeno 1 scrigno, requisito dei mostri minori.",
        "Scegli da 1 a 5 attributi da utilizzare nello scontro.",
        "Inserisci i risultati dei dadi per ogni attributo scelto.",
        "Confronta la tua potenza con quella del Mostro degli Abissi per determinare l’esito."
      ]
    },
    {
      type: "warning",
      title: "Perché è pericoloso",
      text: "Pur essendo classificato come mostro minore, il Mostro degli Abissi possiede una potenza reale di 3500. La sua destrezza altissima, unita a forza, ingegno e magia molto elevati, lo rende una delle prove più dure tra i minori. "
    },
    {
      type: "reward",
      title: "Ricompense",
      text: "Sconfiggere il Mostro degli Abissi garantisce 46000 monete, oltre a una crescita di +180 magia e +140 salute. Chi torna vivo da questo scontro non porta con sé solo bottino, ma anche una parte della profondità che è riuscito a dominare. :contentReference[oaicite:3]{index=3}"
    },
    {
      type: "requirements",
      title: "Premio del vincitore",
      checks: [
        { label: "Monete", value: "46000" },
        { label: "Magia", value: "+180" },
        { label: "Salute", value: "+140" }
      ]
    },
    {
      type: "text",
      title: "Consiglio del veterano",
      text: "Non affrontarlo cercando solo di colpire più forte. Il Mostro degli Abissi richiede equilibrio, tenuta mentale e capacità di reggere la pressione di uno scontro lungo. Nell’abisso non vince solo chi ferisce: vince chi non si lascia trascinare sotto."
    }
  ]
},

cavalieri_ardenti: {
  title: "Cavalieri Ardenti",
  intro: "Davanti all’ingresso del Dungeon non attendono mercenari, predoni o bande da piegare al proprio volere. Attendono i Cavalieri Ardenti, guardiani obbligatori della soglia, esseri avvolti da fiamme eterne che non proteggono un tesoro, ma il diritto stesso di entrare nelle profondità.",

  sections: [
    {
      type: "text",
      title: "Natura della banda",
      text: "I Cavalieri Ardenti non sono una banda normale. Non possono essere acquistati, non possono essere reclutati e non seguono il classico sistema delle bande con ricompensa e proprietà. Sono una prova obbligatoria: o li sconfiggi, o il Dungeon resta chiuso."
    },
    {
      type: "requirements",
      title: "Identità della banda",
      checks: [
        { label: "Tipo", value: "Banda speciale obbligatoria" },
        { label: "Accesso", value: "Guardiani dell’ingresso del Dungeon" },
        { label: "Acquisto", value: "Non acquistabili" },
        { label: "Reclutamento", value: "Non reclutabili" },
        { label: "XP minimi", value: "500" },
        { label: "Ricompensa monete", value: "Nessuna" }
      ]
    },
    {
      type: "requirements",
      title: "Potenza della banda",
      checks: [
        { label: "Potenza Totale", value: "6500" },
        { label: "Forza", value: "1320" },
        { label: "Astuzia", value: "1280" },
        { label: "Ingegno", value: "1300" },
        { label: "Magia", value: "1260" },
        { label: "Destrezza", value: "1340" }
      ]
    },
    {
      type: "text",
      title: "Nuova logica di combattimento",
      text: "Lo scontro contro i Cavalieri Ardenti non usa la logica classica delle bande. Qui non conta il semplice confronto di un tiro contro la potenza dadi della banda: si affrontano invece la Total Skill del giocatore e la Total Skill della banda, entrambe modificate dal tiro del dado."
    },
    {
      type: "steps",
      title: "Come si affrontano",
      items: [
        "Seleziona il giocatore che affronta la banda.",
        "Verifica di avere almeno 500 XP.",
        "Calcola la Total Skill del giocatore sommando forza, astuzia, ingegno, magia e destrezza.",
        "Inserisci il tiro dado del giocatore.",
        "La banda effettua il proprio tiro dado.",
        "Somma dado e Total Skill da entrambe le parti.",
        "Se il totale del giocatore è pari o superiore, i Cavalieri Ardenti vengono sconfitti."
      ]
    },
    {
      type: "requirements",
      title: "Regole speciali",
      checks: [
        { label: "Sistema di scontro", value: "Total Skill contro Total Skill" },
        { label: "Sistema salute banda", value: "Assente" },
        { label: "Vittoria", value: "Accesso al Dungeon" },
        { label: "Prestigio vittoria", value: "+10" },
        { label: "Sconfitta", value: "Devi ritentare finché non vinci" }
      ]
    },
    {
      type: "warning",
      title: "Penalità di sconfitta",
      text: "Se il giocatore perde contro i Cavalieri Ardenti, subisce subito una penalità pesante: -40 salute, -30 stamina, -20 fame e -3% a tutte le caratteristiche principali. Non esiste scorciatoia: finché non vinci, il passaggio resta negato."
    },
    {
      type: "requirements",
      title: "Dettaglio penalità",
      checks: [
        { label: "Salute", value: "-40" },
        { label: "Stamina", value: "-30" },
        { label: "Fame", value: "-20" },
        { label: "Caratteristiche", value: "-3%" }
      ]
    },
    {
      type: "text",
      title: "Ruolo nel gioco",
      text: "I Cavalieri Ardenti non sono un incontro opzionale. Sono una soglia. La loro funzione è verificare se il giocatore possiede davvero la forza minima per entrare nel Dungeon. Per questo non danno ricchezza: il loro premio è il diritto di proseguire."
    },
    {
      type: "warning",
      title: "Errore da evitare",
      text: "Trattarli come una banda normale porta fuori strada. Non vanno pensati come bottino, investimento o potere reclutabile. Sono una prova secca di accesso, e vanno affrontati solo quando il personaggio è davvero pronto a sostenere il confronto di Total Skill."
    },
    {
      type: "text",
      title: "Consiglio del veterano",
      text: "Non presentarti ai Cavalieri Ardenti per tentare. Presentati per passare. Se entri davanti alla soglia senza abbastanza forza, saranno loro a decidere quanto ti costerà aver osato troppo presto."
    }
  ]
},

spettri_urlanti: {
  title: "Spettri Urlanti",
  intro: "Non marciano, non galoppano, non respirano. Gli Spettri Urlanti scivolano nell’aria come ferite aperte del mondo, portando con sé l’eco di voci spezzate e promesse morte. Dove compaiono, il coraggio vacilla e anche il silenzio sembra avere paura.",

  sections: [
    {
      type: "text",
      title: "Origine della banda",
      text: "Si dice che gli Spettri Urlanti siano nati da guerrieri, traditori e innocenti morti senza pace. Le loro anime non trovarono riposo e si fusero in una schiera inquieta, legata al dolore e al richiamo della vendetta. Non cercano ricchezza per bisogno, ma per trascinare i vivi nello stesso vuoto che li consuma."
    },
    {
      type: "requirements",
      title: "Identità della banda",
      checks: [
        { label: "XP minimi", value: "250" },
        { label: "Ricompensa", value: "17600 monete" },
        { label: "Potenza totale", value: "700" },
        { label: "Potenza dadi iniziale", value: "12" },
        { label: "Costo reclutamento", value: "45 oro, 14 diamanti" }
      ]
    },
    {
      type: "requirements",
      title: "Distribuzione del potere",
      checks: [
        { label: "Forza", value: "60" },
        { label: "Astuzia", value: "180" },
        { label: "Ingegno", value: "140" },
        { label: "Magia", value: "220" },
        { label: "Destrezza", value: "100" }
      ]
    },
    {
      type: "steps",
      title: "Come funziona la sfida",
      items: [
        "Scegli il giocatore che affronta la banda.",
        "Inserisci il tuo tiro dadi.",
        "La banda tira automaticamente fino al suo valore massimo attuale.",
        "Confronta i risultati per determinare vittoria, sconfitta o pareggio.",
        "A fine scontro perdi comunque 50 stamina."
      ]
    },
    {
      type: "requirements",
      title: "Regole della sfida",
      checks: [
        { label: "Tentativi massimi", value: "6 per giocatore" },
        { label: "Stamina minima", value: "50" },
        { label: "Cooldown", value: "5 minuti tra una sfida e l’altra" },
        { label: "Reclutamento", value: "Solo dopo averla sconfitta" }
      ]
    },
    {
      type: "text",
      title: "Stile di combattimento",
      text: "Gli Spettri Urlanti non vincono con la forza bruta. Dominano lo scontro con magia, astuzia e pressione mentale. Il loro assalto sembra confondere il giudizio, piegare la volontà e consumare sicurezza prima ancora della carne."
    },
    {
      type: "warning",
      title: "Conseguenze della sconfitta",
      text: "Se perdi, la banda si rafforza immediatamente. Il suo tiro massimo aumenta di 1: da 12 passa a 13, poi 14, 15 e così via a ogni sconfitta. Inoltre gli Spettri Urlanti possono saccheggiarti monete e oro, accumulando il bottino nella loro cassa."
    },
    {
      type: "warning",
      title: "Eco del fallimento",
      text: "Ogni sconfitta rende questa banda più oppressiva. Più a lungo la lasci crescere, più il loro richiamo diventa difficile da sopportare e più costoso diventa ogni nuovo tentativo."
    },
    {
      type: "reward",
      title: "Ricompense della vittoria",
      text: "Sconfiggere gli Spettri Urlanti garantisce 17600 monete, oltre a prestigio e bottino. Una vittoria netta può permetterti di strappare parte delle ricchezze che gli spettri avevano già sottratto ai vivi."
    },
    {
      type: "text",
      title: "Reclutare la banda",
      text: "Dopo averli sconfitti, puoi piegare gli Spettri Urlanti al tuo servizio pagando 45 oro e 14 diamanti. Non sono alleati stabili nel senso umano del termine, ma una presenza spirituale che amplifica pressione, controllo e minaccia."
    },
    {
      type: "reward",
      title: "Potere della banda",
      text: "Quando vengono reclutati, i loro attributi si sommano a quelli del giocatore. Offrono soprattutto magia, astuzia e controllo sottile, rendendoli ideali per chi vuole una forza più inquietante che brutale."
    },
    {
      type: "warning",
      title: "Regola importante",
      text: "Puoi controllare una sola banda alla volta. Per reclutarne un’altra, devi prima liberare quella attuale."
    },
    {
      type: "text",
      title: "Consiglio strategico",
      text: "Gli Spettri Urlanti sono ideali per chi preferisce pressione mentale, magia e vantaggio sottile. Non sottovalutarli per la loro forza fisica modesta: il loro vero pericolo è farti cedere prima ancora di capire dove stai perdendo."
    }
  ]
},

precipizio_di_lava: {
  title: "Precipizio di Lava",
  intro: "Là dove la roccia si apre e il fuoco del mondo affiora senza catene, si estende il Precipizio di Lava. Il terreno vibra, l’aria brucia e ogni passo sembra chiedere al viandante se il suo coraggio valga davvero più della sua carne.",

  sections: [
    {
      type: "text",
      title: "Natura del percorso",
      text: "Il Precipizio di Lava è un percorso pericoloso e instabile. Non rappresenta solo un evento casuale, ma una prova contro un ambiente ostile, capace di punire il giocatore con ferite, perdita di equilibrio e rischio costante."
    },
    {
      type: "steps",
      title: "Come si affronta",
      items: [
        "Il giocatore tira prima un dado contro il Master.",
        "Se il giocatore vince il confronto iniziale, affronta solo l’evento del percorso.",
        "Se il giocatore perde il confronto iniziale, affronta l’evento ma con l’opposizione del Master.",
        "Viene poi generato un evento casuale del Precipizio di Lava.",
        "L’esito finale dipende dalla prova generata e dalla modalità in cui il giocatore è arrivato all’evento."
      ]
    },
    {
      type: "requirements",
      title: "Regole del percorso",
      checks: [
        { label: "Difficoltà", value: "Difficile" },
        { label: "Ingresso alla prova", value: "Confronto dado giocatore vs Master" },
        { label: "Esito favorevole", value: "Evento affrontato da solo" },
        { label: "Esito sfavorevole", value: "Evento affrontato contro il Master" },
        { label: "Completamento", value: "Una sola volta per giocatore" }
      ]
    },
    {
      type: "text",
      title: "Primo giudizio del cammino",
      text: "Prima ancora che la prova si manifesti, il percorso decide quanto il destino ti sarà ostile. Se il giocatore vince il dado iniziale, entra nell’evento da solo; se lo perde, il Master entra nella prova e trasforma il sentiero in una minaccia molto più aspra."
    },
    {
      type: "text",
      title: "Eventi possibili",
      text: "Fra le prove del Precipizio di Lava possono emergere crepe infuocate, crolli improvvisi, ponti di roccia instabile, lingue di magma, esplosioni di calore e passaggi in cui il viandante deve scegliere fra velocità, resistenza o sangue freddo. Ogni evento cambia il tono della sfida."
    },
    {
      type: "warning",
      title: "Forza dell’evento",
      text: "Ogni evento del percorso viene generato con intensità variabile. Questo significa che anche una prova già affrontata in passato può diventare molto più severa o più gestibile a seconda della forza con cui il precipizio si manifesta."
    },
    {
      type: "text",
      title: "Evento semplice o evento col Master",
      text: "Quando il giocatore vince il dado iniziale, affronta il pericolo nella sua forma diretta. Quando invece perde, il Master entra nella dinamica dello scontro e rende il percorso più duro, più instabile e più difficile da leggere."
    },
    {
      type: "reward",
      title: "Premi del successo",
      text: "Se il giocatore supera l’evento, ottiene i benefici previsti dalla prova generata: denaro, crescita, avanzamento o ricompense di percorso. Superare il Precipizio di Lava non significa solo sopravvivere, ma dimostrare di poter attraversare il fuoco senza piegarsi."
    },
    {
      type: "warning",
      title: "Prezzo del fallimento",
      text: "Se fallisci, il percorso colpisce con durezza: perdita di salute, stamina e talvolta penalità aggiuntive legate alla violenza dell’evento. Se la prova è stata affrontata contro il Master, il rischio di uscire gravemente logorati è ancora più alto."
    },
    {
      type: "warning",
      title: "Regola importante",
      text: "Un giocatore che ha già completato questo percorso non può affrontarlo di nuovo. Il Precipizio di Lava mette alla prova una sola volta: chi lo supera conquista il passaggio, chi lo fallisce ne conserva la cicatrice."
    },
    {
      type: "text",
      title: "Consiglio del viandante",
      text: "Il fuoco non perdona chi esita. Al Precipizio di Lava contano sangue freddo, preparazione e il primo dado contro il Master. Se entri bene nella prova, puoi ancora dominare il sentiero. Se entri male, sarà il sentiero a provare a divorare te."
    }
  ]
},

ponte_infuocato: {
  title: "Ponte Infuocato",
  intro: "Sospeso sopra un abisso ardente, il Ponte Infuocato non offre riparo né margine d’errore. Le travi roventi gemono, il calore piega il respiro e ogni passo sembra chiedere se la tua volontà sia più salda del fuoco che ti circonda.",

  sections: [
    {
      type: "text",
      title: "Natura del percorso",
      text: "Il Ponte Infuocato è un percorso di attraversamento e sopravvivenza. Qui il giocatore non affronta soltanto un evento, ma una prova di controllo, tenuta e sangue freddo in uno spazio stretto e pericoloso."
    },
    {
      type: "steps",
      title: "Come si affronta",
      items: [
        "Il giocatore tira prima un dado contro il Master.",
        "Se il giocatore vince il confronto iniziale, affronta solo l’evento del percorso.",
        "Se il giocatore perde il confronto iniziale, affronta l’evento contro il Master.",
        "Viene poi generato un evento casuale del Ponte Infuocato.",
        "L’esito finale dipende dalla prova generata e da come il giocatore è entrato nel percorso."
      ]
    },
    {
      type: "requirements",
      title: "Regole del percorso",
      checks: [
        { label: "Difficoltà", value: "Difficile" },
        { label: "Ingresso alla prova", value: "Confronto dado giocatore vs Master" },
        { label: "Esito favorevole", value: "Evento affrontato da solo" },
        { label: "Esito sfavorevole", value: "Evento affrontato contro il Master" },
        { label: "Completamento", value: "Una sola volta per giocatore" }
      ]
    },
    {
      type: "text",
      title: "Primo giudizio del cammino",
      text: "Prima ancora che il ponte riveli la sua prova, il destino decide se il passaggio sarà relativamente puro o aggravato dalla presenza del Master. Vincere il dado iniziale significa affrontare il fuoco da solo; perderlo significa attraversarlo sotto una pressione maggiore."
    },
    {
      type: "text",
      title: "Eventi possibili",
      text: "Sul Ponte Infuocato possono manifestarsi tavole ardenti, raffiche di calore, crolli parziali, fiammate improvvise, tratti di corsa forzata o passaggi in cui il giocatore deve resistere abbastanza a lungo da non essere travolto dal fuoco."
    },
    {
      type: "warning",
      title: "Passaggio stretto",
      text: "A differenza di altri percorsi, qui il pericolo non si disperde nello spazio: si concentra. Il Ponte Infuocato punisce l’errore in modo immediato, perché ogni esitazione avviene in un luogo dove non esiste vera via laterale di fuga."
    },
    {
      type: "text",
      title: "Evento semplice o evento col Master",
      text: "Se il giocatore entra bene nel percorso, affronta il pericolo nella sua forma diretta. Se invece perde il dado iniziale, il Master entra nella dinamica e trasforma il ponte in una prova ancora più severa, più imprevedibile e più punitiva."
    },
    {
      type: "reward",
      title: "Premi del successo",
      text: "Se il giocatore supera l’evento, ottiene i benefici previsti dalla prova generata: avanzamento, denaro, crescita o ricompense di percorso. Attraversare il Ponte Infuocato significa dimostrare di saper tenere il passo anche quando il mondo sotto di te brucia."
    },
    {
      type: "warning",
      title: "Prezzo del fallimento",
      text: "Se fallisci, il fuoco del ponte lascia il segno: perdita di salute, stamina e possibili penalità aggiuntive legate alla violenza dell’evento. Quando il percorso è affrontato contro il Master, il rischio di uscire logorati aumenta sensibilmente."
    },
    {
      type: "warning",
      title: "Regola importante",
      text: "Un giocatore che ha già completato questo percorso non può affrontarlo di nuovo. Il Ponte Infuocato mette alla prova una sola volta: chi passa conquista il varco, chi fallisce ne ricorda la bruciatura."
    },
    {
      type: "text",
      title: "Consiglio del viandante",
      text: "Sul Ponte Infuocato non serve solo forza. Serve passo fermo, mente lucida e un buon ingresso nella prova. Il vero errore non è avere paura del fuoco: è lasciare che quella paura decida il ritmo dei tuoi passi."
    }
  ]
},

stanza_dei_fili_taglienti: {
  title: "Stanza dei Fili Taglienti",
  intro: "Non tutte le morti arrivano con fragore. Alcune attendono in silenzio. Nella Stanza dei Fili Taglienti, l’aria stessa sembra innocua finché la luce non rivela una rete sottile di lame invisibili, tese fra pareti immobili e pronte a punire ogni passo sbagliato.",

  sections: [
    {
      type: "text",
      title: "Natura del percorso",
      text: "La Stanza dei Fili Taglienti è un percorso basato su precisione, sangue freddo e controllo del movimento. Non premia la furia né la fretta: qui sopravvive chi osserva, misura e attraversa il pericolo senza concedere errori."
    },
    {
      type: "steps",
      title: "Come si affronta",
      items: [
        "Il giocatore tira prima un dado contro il Master.",
        "Se il giocatore vince il confronto iniziale, affronta solo l’evento del percorso.",
        "Se il giocatore perde il confronto iniziale, affronta l’evento contro il Master.",
        "Viene poi generato un evento casuale della Stanza dei Fili Taglienti.",
        "L’esito finale dipende dalla prova generata e da come il giocatore è entrato nel percorso."
      ]
    },
    {
      type: "requirements",
      title: "Regole del percorso",
      checks: [
        { label: "Difficoltà", value: "Difficile" },
        { label: "Ingresso alla prova", value: "Confronto dado giocatore vs Master" },
        { label: "Esito favorevole", value: "Evento affrontato da solo" },
        { label: "Esito sfavorevole", value: "Evento affrontato contro il Master" },
        { label: "Completamento", value: "Una sola volta per giocatore" }
      ]
    },
    {
      type: "text",
      title: "Primo giudizio del cammino",
      text: "Prima ancora che i fili si mostrino, il destino decide quanto la stanza sarà crudele. Se il giocatore vince il dado iniziale, entra nella prova da solo. Se lo perde, la presenza del Master rende l’attraversamento più severo, più teso e più difficile da leggere."
    },
    {
      type: "text",
      title: "Eventi possibili",
      text: "Nella Stanza dei Fili Taglienti possono emergere corridoi di lame sottili, passaggi da attraversare con equilibrio, trappole tese all’altezza del volto o delle gambe, sequenze di movimento obbligato e zone in cui un solo errore basta a trasformare il cammino in ferita."
    },
    {
      type: "warning",
      title: "Pericolo silenzioso",
      text: "Questo percorso è insidioso perché non impressiona con il rumore, ma con l’invisibile. I fili non travolgono: aspettano. E proprio per questo puniscono con durezza chi entra troppo sicuro o troppo in fretta."
    },
    {
      type: "text",
      title: "Evento semplice o evento col Master",
      text: "Se il giocatore entra bene nella stanza, affronta la prova nella sua forma diretta. Se invece perde il dado iniziale, il Master entra nella dinamica del percorso e trasforma la rete di fili in una sfida ancora più crudele."
    },
    {
      type: "reward",
      title: "Premi del successo",
      text: "Se il giocatore supera l’evento, ottiene i benefici previsti dalla prova generata: avanzamento, ricompense, crescita o vantaggi di percorso. Uscire vivi da questa stanza significa dimostrare che il controllo può vincere anche dove la forza bruta fallirebbe."
    },
    {
      type: "warning",
      title: "Prezzo del fallimento",
      text: "Se fallisci, i fili colpiscono con precisione. Il percorso può infliggere perdita di salute, stamina e altre penalità legate alla severità dell’evento. Quando la prova è affrontata contro il Master, il rischio di uscire gravemente logorati cresce ancora di più."
    },
    {
      type: "warning",
      title: "Regola importante",
      text: "Un giocatore che ha già completato questo percorso non può affrontarlo di nuovo. La Stanza dei Fili Taglienti concede un solo passaggio: chi lo supera se ne libera, chi fallisce ne conserva le cicatrici."
    },
    {
      type: "text",
      title: "Consiglio del viandante",
      text: "Qui non serve correre. Serve vedere prima degli occhi, respirare prima del passo e scegliere ogni movimento come se fosse l’unico. Nella Stanza dei Fili Taglienti spesso sopravvive chi si controlla meglio, non chi si crede più forte."
    }
  ]
},

assassini_dell_ombra: {
  title: "Assassini dell’Ombra",
  intro: "Non annunciano il proprio arrivo, non sfidano apertamente e non lasciano spazio all’onore. Gli Assassini dell’Ombra colpiscono dove la luce è più debole, trasformando il silenzio in arma e l’attesa in condanna. Nelle Sale delle Trappole, la loro presenza è più vicina a un sussurro che a un esercito… ed è proprio questo a renderli così letali.",

  sections: [
    {
      type: "text",
      title: "Origine della banda",
      text: "Gli Assassini dell’Ombra non nascono come soldati comuni. Sono predatori addestrati alla pazienza, al varco nascosto e al colpo che arriva quando il bersaglio si crede ormai salvo. Vivono fra trappole, corridoi ciechi e passaggi dove anche il respiro sembra un errore."
    },
    {
      type: "requirements",
      title: "Identità della banda",
      checks: [
        { label: "XP minimi", value: "190" },
        { label: "Ricompensa", value: "26000 monete" },
        { label: "Costo reclutamento", value: "90 oro, 20 diamanti" },
        { label: "Zona", value: "Sale delle Trappole" }
      ]
    },
    {
      type: "steps",
      title: "Come funziona la sfida",
      items: [
        "Scegli il giocatore che affronta la banda.",
        "Inserisci il tuo tiro dadi.",
        "La banda tira automaticamente fino al suo valore massimo attuale.",
        "Confronta i risultati per determinare vittoria, sconfitta o pareggio.",
        "A fine scontro perdi comunque 50 stamina."
      ]
    },
    {
      type: "requirements",
      title: "Regole della sfida",
      checks: [
        { label: "Tentativi massimi", value: "6 per giocatore" },
        { label: "Stamina minima", value: "50" },
        { label: "Cooldown", value: "5 minuti tra una sfida e l’altra" },
        { label: "Reclutamento", value: "Solo dopo averla sconfitta" }
      ]
    },
    {
      type: "text",
      title: "Stile di combattimento",
      text: "Gli Assassini dell’Ombra non vincono con il peso, ma con precisione, velocità e vantaggio tattico. La loro vera minaccia è la capacità di scegliere il momento giusto per colpire, spezzando il ritmo del nemico prima ancora che lo scontro sembri davvero iniziato."
    },
    {
      type: "warning",
      title: "Conseguenze della sconfitta",
      text: "Se perdi, la banda si rafforza immediatamente. Il suo tiro massimo aumenta di 1: da 12 passa a 13, poi 14, 15 e così via a ogni sconfitta. Inoltre gli Assassini dell’Ombra possono saccheggiarti monete e oro, accumulando bottino nella loro cassa."
    },
    {
      type: "warning",
      title: "Minaccia crescente",
      text: "Più volte fallisci contro di loro, più la banda diventa spietata. Una sconfitta contro gli Assassini dell’Ombra non è solo una battuta d’arresto: è un modo per renderli ancora più difficili da inseguire e da punire."
    },
    {
      type: "reward",
      title: "Ricompense della vittoria",
      text: "Sconfiggere gli Assassini dell’Ombra garantisce 26000 monete, oltre a prestigio e bottino. Una vittoria netta può permetterti di recuperare parte delle ricchezze che la banda aveva già sottratto a viandanti meno pronti. "
    },
    {
      type: "text",
      title: "Reclutare la banda",
      text: "Dopo averli sconfitti, puoi piegare gli Assassini dell’Ombra al tuo servizio pagando 90 oro e 20 diamanti. Non sono una banda facile da mantenere in termini simbolici: obbediscono solo a chi dimostra di essere più pericoloso di loro."
    },
    {
      type: "reward",
      title: "Potere della banda",
      text: "Quando vengono reclutati, gli Assassini dell’Ombra diventano una forza di pressione e intimidazione. Non rappresentano solo alleati, ma una minaccia costante capace di trasformare rapidità, controllo e opportunismo in vantaggio reale."
    },
    {
      type: "warning",
      title: "Regola importante",
      text: "Puoi controllare una sola banda alla volta. Per reclutarne un’altra, devi prima liberare quella attuale."
    },
    {
      type: "text",
      title: "Consiglio strategico",
      text: "Gli Assassini dell’Ombra sono ideali per chi vuole una banda elegante, letale e legata al controllo del ritmo. Non affrontarli con leggerezza: nelle Sale delle Trappole, chi sbaglia un solo passo spesso non ha il tempo di correggere il secondo."
    }
  ]
},

laceratore_grigio: {
  title: "Laceratore Grigio",
  intro: "Nelle viscere incandescenti della Forgia di Lava si muove il Laceratore Grigio, una creatura che sembra scolpita nel metallo morto e nel dolore antico. Non ha la maestosità di un drago né la nobiltà corrotta dei grandi demoni: è puro istinto di distruzione, una lama vivente che lacera tutto ciò che osa entrare nel suo dominio.",

  sections: [
    {
      type: "text",
      title: "Origine della creatura",
      text: "Le cronache lo descrivono come un essere nato dove il calore della forgia incontra la furia dell’abisso. Il Laceratore Grigio non è una semplice bestia: è una presenza costruita per distruggere, un guardiano feroce delle profondità più ostili del Dungeon."
    },
    {
      type: "requirements",
      title: "Identità del mostro",
      checks: [
        { label: "Categoria", value: "Mostro Maggiore" },
        { label: "Zona", value: "Forgia di Lava" },
        { label: "Mappa", value: "Dungeon" },
        { label: "Potere Elementale", value: "Aria" },
        { label: "Potenza Totale", value: "10500" },
        { label: "Salute", value: "520" }
      ]
    },
    {
      type: "requirements",
      title: "Distribuzione del Potere",
      checks: [
        { label: "Forza", value: "2400" },
        { label: "Astuzia", value: "1900" },
        { label: "Ingegno", value: "2000" },
        { label: "Magia", value: "1950" },
        { label: "Destrezza", value: "2250" }
      ]
    },
    {
      type: "requirements",
      title: "Accesso ai mostri",
      checks: [
        { label: "Per Mostri Minori", value: "Serve almeno 1 scrigno aperto" },
        { label: "Per Mostri Maggiori", value: "Servono almeno 4 scrigni aperti" }
      ]
    },
    {
      type: "warning",
      title: "Sigillo d’accesso",
      text: "Il Laceratore Grigio appartiene ai Mostri Maggiori. Nessun guerriero può affrontarlo senza aver prima aperto almeno quattro scrigni. È una prova destinata solo a chi è già sopravvissuto abbastanza da meritare l’ingresso nelle sfide più crudeli del Dungeon."
    },
    {
      type: "text",
      title: "Stile di combattimento",
      text: "Il Laceratore Grigio non domina con una sola qualità: è devastante quasi ovunque. Colpisce con forza brutale, mantiene lucidità feroce, possiede magia oscura e una destrezza altissima. È il tipo di mostro che non lascia spazi sicuri e costringe il giocatore a reggere pressione continua."
    },
    {
      type: "text",
      title: "La minaccia del Laceratore",
      text: "Combatterlo significa affrontare una creatura che non si limita a vincere lo scontro: lo frantuma. La sua presenza trasmette l’idea di una macchina di guerra viva, capace di punire sia l’imprudenza sia l’eccesso di fiducia."
    },
    {
      type: "steps",
      title: "Come affrontarlo",
      items: [
        "Seleziona il giocatore che combatterà.",
        "Verifica di aver aperto almeno 4 scrigni.",
        "Scegli da 1 a 5 attributi da utilizzare nello scontro.",
        "Inserisci i risultati dei dadi per ogni attributo scelto.",
        "Confronta la tua potenza con quella del Laceratore Grigio per determinare l’esito."
      ]
    },
    {
      type: "warning",
      title: "Perché è pericoloso",
      text: "Con una potenza totale di 10500, il Laceratore Grigio è una delle presenze più oppressive del Dungeon. La sua distribuzione delle statistiche è estremamente alta e molto equilibrata, il che lo rende letale contro build troppo specializzate o insufficientemente preparate. "
    },
    {
      type: "reward",
      title: "Valore della vittoria",
      text: "Abbattere il Laceratore Grigio non significa solo ottenere una vittoria numerica. Significa superare una soglia del Dungeon e dimostrare di poter resistere a una delle incarnazioni più pure della distruzione."
    },
    {
      type: "text",
      title: "Consiglio del veterano",
      text: "Non affrontarlo con l’idea di resistere appena abbastanza. Contro il Laceratore Grigio serve una preparazione completa, una build solida e sangue freddo costante. Qui non basta colpire forte: bisogna restare interi mentre lui prova a strapparti via ogni certezza."
    }
  ]
},

guardia_nera: {
  title: "Guardia Nera",
  intro: "Fra le ombre più profonde del Dungeon veglia la Guardia Nera, sentinella senza misericordia e lama fedele delle profondità. Non è una belva nata dal caos, ma una presenza disciplinata e spietata, forgiata per impedire il passaggio a chiunque non sia degno di avanzare oltre.",

  sections: [
    {
      type: "text",
      title: "Origine della creatura",
      text: "Si narra che la Guardia Nera non sia nata come semplice mostro, ma come custode consacrato ai segreti del sottosuolo. Nel tempo, la sua volontà fu divorata dall’oscurità, finché non rimase altro che una sentinella perfetta: fredda, precisa e letale."
    },
    {
      type: "requirements",
      title: "Identità del mostro",
      checks: [
        { label: "Categoria", value: "Mostro Maggiore" },
        { label: "Mappa", value: "Dungeon" },
        { label: "Potenza Totale", value: "4300" },
        { label: "Salute", value: "190" }
      ]
    },
    {
      type: "requirements",
      title: "Distribuzione del Potere",
      checks: [
        { label: "Forza", value: "1050" },
        { label: "Astuzia", value: "650" },
        { label: "Ingegno", value: "780" },
        { label: "Magia", value: "520" },
        { label: "Destrezza", value: "1300" }
      ]
    },
    {
      type: "requirements",
      title: "Accesso ai mostri",
      checks: [
        { label: "Per Mostri Minori", value: "Serve almeno 1 scrigno aperto" },
        { label: "Per Mostri Maggiori", value: "Servono almeno 4 scrigni aperti" }
      ]
    },
    {
      type: "warning",
      title: "Sigillo d’accesso",
      text: "La Guardia Nera appartiene ai Mostri Maggiori. Nessun guerriero può affrontarla senza aver prima aperto almeno quattro scrigni. È una prova riservata a chi è già sopravvissuto abbastanza da meritare il diritto di avanzare nelle profondità."
    },
    {
      type: "text",
      title: "Stile di combattimento",
      text: "La Guardia Nera non combatte con furia disordinata, ma con disciplina e pressione costante. La sua destrezza domina il ritmo dello scontro, mentre forza, ingegno e astuzia le permettono di colpire con precisione e mantenere il controllo del campo."
    },
    {
      type: "text",
      title: "La minaccia della sentinella",
      text: "Contro la Guardia Nera il vero pericolo è la sensazione di non trovare mai un punto cieco. È una creatura costruita per presidiare, leggere il nemico e punire l’errore appena si manifesta."
    },
    {
      type: "steps",
      title: "Come affrontarla",
      items: [
        "Seleziona il giocatore che combatterà.",
        "Verifica di aver aperto almeno 4 scrigni.",
        "Scegli da 1 a 5 attributi da utilizzare nello scontro.",
        "Inserisci i risultati dei dadi per ogni attributo scelto.",
        "Confronta la tua potenza con quella della Guardia Nera per determinare l’esito."
      ]
    },
    {
      type: "warning",
      title: "Perché è pericolosa",
      text: "Con una potenza totale di 4300, la Guardia Nera è una presenza molto severa del Dungeon. La sua destrezza altissima, unita a forza solida e buona lucidità tattica, la rende una minaccia difficile da affrontare con build sbilanciate o frettolose. :contentReference[oaicite:2]{index=2}"
    },
    {
      type: "reward",
      title: "Valore della vittoria",
      text: "Sconfiggere la Guardia Nera significa abbattere una delle sentinelle più implacabili del Dungeon. Non è solo una vittoria di potenza, ma una prova di maturità del giocatore contro un guardiano costruito per non cedere."
    },
    {
      type: "text",
      title: "Consiglio del veterano",
      text: "Non affrontarla cercando un colpo fortunato. La Guardia Nera si supera con equilibrio, tenuta e lettura dello scontro. Contro una sentinella perfetta, spesso vince chi resta lucido più a lungo."
    }
  ]
},

bel_boss_finale: {
  title: "Bel, il Demonio della Lava",
  intro: "Nel cuore più profondo dell’Abisso attende Bel, il Demonio della Lava. Non è un semplice signore del fuoco, ma la volontà stessa della rovina, una presenza che fonde guerra, corruzione e giudizio in un’unica creatura. Chi giunge davanti a lui non affronta solo un nemico: affronta il peso finale dell’intero cammino.",

  sections: [
    {
      type: "text",
      title: "Natura del boss finale",
      text: "Bel è il boss finale del gioco e non si affronta come un mostro comune. La sua battaglia è una prova collettiva, pensata come un vero raid, in cui più giocatori uniscono i propri attributi per cercare di spezzarne la salute. Se resiste, il prezzo della sfida ricade sui partecipanti."
    },
    {
      type: "requirements",
      title: "Identità di Bel",
      checks: [
        { label: "Categoria", value: "Boss Finale" },
        { label: "Stato iniziale", value: "Attivo" },
        { label: "Salute iniziale", value: "1400 / 1400" },
        { label: "Forza", value: "3000" },
        { label: "Astuzia", value: "2100" },
        { label: "Ingegno", value: "2200" },
        { label: "Magia", value: "2400" },
        { label: "Destrezza", value: "700" }
      ]
    },
    {
      type: "requirements",
      title: "Accesso al raid finale",
      checks: [
        { label: "Mostri maggiori sconfitti", value: "Almeno 3 personali" },
        { label: "Mostri validi", value: "Guardia Nera, Dragone, Diavolo delle Catene, Celebrilith, Hezrou, Laceratore Grigio" },
        { label: "Party", value: "Capofila + fino a 4 aiutanti" },
        { label: "Tipo di scontro", value: "Raid di gruppo" }
      ]
    },
    {
      type: "warning",
      title: "Sigillo d’accesso",
      text: "Non tutti possono presentarsi davanti a Bel. Ogni giocatore deve aver sconfitto almeno 3 mostri maggiori personali per poter entrare nel party finale. Il boss non accetta presenze impreparate: pretende prove già compiute nel Dungeon."
    },
    {
      type: "text",
      title: "Come funziona il raid",
      text: "Il party sceglie un capofila e fino a quattro aiutanti. I cinque attributi del raid — forza, destrezza, magia, ingegno e astuzia — vengono assegnati ai membri del gruppo. Ogni attributo usa il valore del giocatore assegnato, moltiplicato per il dado scelto in quello slot. La somma di tutti gli slot genera la potenza totale del raid contro Bel. :contentReference[oaicite:0]{index=0}"
    },
    {
      type: "steps",
      title: "Procedura del raid",
      items: [
        "Seleziona il capofila e gli eventuali aiutanti.",
        "Assegna un giocatore a ciascuno dei 5 attributi del raid.",
        "Inserisci i dadi per ogni slot attributo.",
        "Calcola la potenza totale del raid.",
        "Confronta la potenza del gruppo con il total skill di Bel.",
        "Applica l’esito: vittoria di Bel oppure ferita inflitta al boss."
      ]
    },
    {
      type: "warning",
      title: "Se Bel vince",
      text: "Se il total skill di Bel è uguale o superiore alla potenza del raid, il party viene respinto. I partecipanti perdono salute e stamina, gli attributi usati nello scontro aumentano di +1 e il gruppo riceve anima. È una sconfitta, ma non sterile: Bel concede crescita a chi sopravvive al suo giudizio. :contentReference[oaicite:1]{index=1}"
    },
    {
      type: "reward",
      title: "Se il party vince il round",
      text: "Se la potenza del raid supera il total skill di Bel, il boss subisce danno diretto alla salute. Tuttavia Bel reagisce subito: dopo ogni ferita si potenzia, aumentando forza, destrezza, magia, ingegno e astuzia. Vincere un round non significa dominarlo, ma costringerlo a mutare in una forma ancora più pericolosa. :contentReference[oaicite:2]{index=2}"
    },
    {
      type: "warning",
      title: "Potenziamento di Bel",
      text: "Ogni volta che Bel viene ferito, la sua potenza cresce. Questo significa che i raid successivi diventano più difficili. Il party deve quindi infliggere danni importanti prima che il boss salga troppo e renda lo scontro progressivamente insostenibile."
    },
    {
      type: "text",
      title: "La frammentazione di Bel",
      text: "Quando la salute di Bel arriva a 0, il boss non viene distrutto definitivamente: si frammenta. Il suo corpo crolla, ma i suoi spiriti maledetti si separano e ritornano nel mondo sotto forma di frammenti. Da quel momento la battaglia finale entra nella sua seconda fase."
    },
    {
      type: "requirements",
      title: "Frammenti di Bel",
      checks: [
        { label: "Attivazione", value: "Quando Bel raggiunge 0 salute" },
        { label: "Origine", value: "Ritorno agli antichi mostri" },
        { label: "Ex minori", value: "Più difficili ma più purificanti" },
        { label: "Ex maggiori", value: "Più facili ma meno purificanti" }
      ]
    },
    {
      type: "text",
      title: "Scontro con i frammenti",
      text: "Ogni frammento può essere affrontato da un giocatore selezionato. Il giocatore tira 2d6 e vi aggiunge bonus derivati da anima e corruzione; il frammento risponde con il proprio tiro e il proprio valore di entità. Se il giocatore vince, ottiene anima, riduzione corruzione e purificazione. Se perde, subisce una perdita di purificazione, ma guadagna comunque una piccola crescita spirituale."
    },
    {
      type: "requirements",
      title: "Redenzione finale",
      checks: [
        { label: "Purificazione necessaria", value: "100" },
        { label: "Corruzione necessaria", value: "0" },
        { label: "Checkpoint", value: "25, 50, 75, 100" },
        { label: "Vittoria finale", value: "Solo con purificazione completa e corruzione azzerata" }
      ]
    },
    {
      type: "warning",
      title: "La vera condizione di vittoria",
      text: "Frammentare Bel non basta. La vittoria finale è possibile solo quando il giocatore raggiunge Purificazione 100 e Corruzione 0. Se la purificazione è alta ma la corruzione non è stata scaricata del tutto, il cammino resta incompleto. :contentReference[oaicite:4]{index=4}"
    },
    {
      type: "text",
      title: "Bel e il destino del regno",
      text: "Bel non è soltanto il nemico finale: è la misura ultima di tutto ciò che i guerrieri hanno accumulato, perso e sacrificato. Contro di lui contano la forza del gruppo, la continuità del raid, la gestione dell’anima, la corruzione e il lungo cammino della purificazione."
    },
    {
      type: "text",
      title: "Consiglio del veterano",
      text: "Non arrivare a Bel pensando solo al danno. Il boss finale si vince in due metà: prima abbattendo il suo corpo, poi spezzando i suoi frammenti senza perdere sé stessi. Molti riescono a ferirlo. Pochi riescono davvero a purificare ciò che resta."
    }
  ]
},

elfi_silvani: {
  title: "Elfi Silvani",
  intro: "Non tutti gli elfi cantano alla luce della foresta. Gli Elfi Silvani di queste profondità sono guardiani antichi, letali e silenziosi, cresciuti fra radici oscure, archi tesi e giuramenti mai dimenticati. Non difendono soltanto un territorio: difendono un ordine che considera ogni intruso una ferita da recidere.",

  sections: [
    {
      type: "text",
      title: "Origine della banda",
      text: "Gli Elfi Silvani appartengono a una stirpe che ha imparato a vivere fra ombra, disciplina e precisione. Non si gettano nello scontro con brutalità cieca: osservano, attendono e colpiscono quando il nemico ha già commesso il primo errore."
    },
    {
      type: "requirements",
      title: "Identità della banda",
      checks: [
        { label: "XP minimi", value: "800" },
        { label: "Ricompensa", value: "117000 monete" },
        { label: "Costo reclutamento", value: "170 oro, 40 diamanti" },
        { label: "Zona", value: "Profondità del Trono" }
      ]
    },
    {
      type: "steps",
      title: "Come funziona la sfida",
      items: [
        "Scegli il giocatore che affronta la banda.",
        "Inserisci il tuo tiro dadi.",
        "La banda tira automaticamente fino al suo valore massimo attuale.",
        "Confronta i risultati per determinare vittoria, sconfitta o pareggio.",
        "A fine scontro perdi comunque 50 stamina."
      ]
    },
    {
      type: "requirements",
      title: "Regole della sfida",
      checks: [
        { label: "Tentativi massimi", value: "6 per giocatore" },
        { label: "Stamina minima", value: "50" },
        { label: "Cooldown", value: "5 minuti tra una sfida e l’altra" },
        { label: "Reclutamento", value: "Solo dopo averla sconfitta" }
      ]
    },
    {
      type: "text",
      title: "Stile di combattimento",
      text: "Gli Elfi Silvani non sono fatti per la confusione del massacro frontale. La loro forza sta nella disciplina, nella mira, nel controllo del ritmo e nella capacità di trasformare il terreno in un alleato. Affrontarli significa entrare in uno scontro dove ogni movimento sembra già previsto."
    },
    {
      type: "warning",
      title: "Conseguenze della sconfitta",
      text: "Se perdi, la banda si rafforza immediatamente. Il suo tiro massimo aumenta di 1: da 12 passa a 13, poi 14, 15 e così via a ogni sconfitta. Inoltre gli Elfi Silvani possono saccheggiarti monete e oro, accumulando bottino nella loro cassa."
    },
    {
      type: "warning",
      title: "Precisione crescente",
      text: "Più li lasci crescere, più gli Elfi Silvani diventano pericolosi. Non danno l’idea di una forza brutale, ma proprio questa eleganza li rende insidiosi: ogni sconfitta li trasforma in avversari sempre più difficili da sorprendere."
    },
    {
      type: "reward",
      title: "Ricompense della vittoria",
      text: "Sconfiggere gli Elfi Silvani garantisce 117000 monete, oltre a prestigio e bottino. È una vittoria di altissimo valore, degna di una banda che abita le profondità più nobili e pericolose del regno. "
    },
    {
      type: "text",
      title: "Reclutare la banda",
      text: "Dopo averli sconfitti, puoi piegare gli Elfi Silvani al tuo servizio pagando 170 oro e 40 diamanti. Non si tratta di una banda comune: conquistarne la fedeltà significa imporsi su guerrieri raffinati, antichi e difficili da domare."
    },
    {
      type: "reward",
      title: "Potere della banda",
      text: "Quando vengono reclutati, gli Elfi Silvani diventano una forza di altissimo prestigio. Più che semplice potenza, portano precisione, disciplina e presenza dominante nelle zone più elevate del gioco."
    },
    {
      type: "warning",
      title: "Regola importante",
      text: "Puoi controllare una sola banda alla volta. Per reclutarne un’altra, devi prima liberare quella attuale."
    },
    {
      type: "text",
      title: "Consiglio strategico",
      text: "Gli Elfi Silvani non sono una banda da affrontare per impulso. Richiedono preparazione vera, perché rappresentano una soglia avanzata del mondo di gioco. Se li sfidi troppo presto, rischi di offrire loro il tuo bottino prima ancora di aver capito quanto sono superiori."
    }
  ]
},

celebrilith: {
  title: "Celebrilith, l’Albero Sacro Corrotto",
  intro: "Un tempo simbolo di vita, equilibrio e rinascita, Celebrilith era l’albero sacro che custodiva il respiro del mondo. Ora è diventato qualcosa di diverso: una creatura immensa, radicata nella corruzione, che non protegge più… ma trattiene, avvolge e consuma chiunque osi avvicinarsi.",

  sections: [
    {
      type: "text",
      title: "Origine della creatura",
      text: "Celebrilith non è nato come mostro. Era un pilastro vivente dell’equilibrio naturale, ma la corruzione dell’Abisso ha penetrato le sue radici, trasformandolo lentamente in una presenza oscura. Ciò che resta non è più un guardiano: è una forza antica che difende il proprio dominio con volontà assoluta."
    },
    {
      type: "requirements",
      title: "Identità del mostro",
      checks: [
        { label: "Categoria", value: "Mostro Maggiore" },
        { label: "Potenza Totale", value: "6300" },
        { label: "Salute", value: "280" }
      ]
    },
    {
      type: "requirements",
      title: "Distribuzione del Potere",
      checks: [
        { label: "Forza", value: "1300" },
        { label: "Astuzia", value: "1050" },
        { label: "Ingegno", value: "1150" },
        { label: "Magia", value: "1500" },
        { label: "Destrezza", value: "1300" }
      ]
    },
    {
      type: "requirements",
      title: "Accesso ai mostri",
      checks: [
        { label: "Per Mostri Minori", value: "Serve almeno 1 scrigno aperto" },
        { label: "Per Mostri Maggiori", value: "Servono almeno 4 scrigni aperti" }
      ]
    },
    {
      type: "warning",
      title: "Sigillo d’accesso",
      text: "Celebrilith è un Mostro Maggiore. Per affrontarlo devi aver già aperto almeno quattro scrigni. Non è una prova per chi sta iniziando: è un confronto con una forza antica che richiede preparazione reale."
    },
    {
      type: "text",
      title: "Stile di combattimento",
      text: "Celebrilith è una creatura completa e stabile. Non eccelle in un solo aspetto, ma domina in equilibrio: forza, magia e destrezza sono tutte alte, mentre ingegno e astuzia rendono difficile prevedere il suo comportamento. È un avversario che non cede facilmente in nessuna fase dello scontro."
    },
    {
      type: "text",
      title: "La minaccia della radice",
      text: "Affrontare Celebrilith significa entrare in un territorio vivo. Non è solo il mostro a combattere: è tutto ciò che lo circonda. Le sue radici sembrano trattenere, la sua presenza opprime e il suo dominio trasforma lo scontro in una prova di resistenza continua."
    },
    {
      type: "steps",
      title: "Come affrontarlo",
      items: [
        "Seleziona il giocatore che combatterà.",
        "Verifica di aver aperto almeno 4 scrigni.",
        "Scegli da 1 a 5 attributi da utilizzare nello scontro.",
        "Inserisci i risultati dei dadi per ogni attributo scelto.",
        "Confronta la tua potenza con quella di Celebrilith per determinare l’esito."
      ]
    },
    {
      type: "warning",
      title: "Perché è pericoloso",
      text: "Con una potenza totale di 6300, Celebrilith è uno dei Mostri Maggiori più equilibrati e difficili da sbilanciare. Non presenta punti deboli evidenti: ogni approccio richiede preparazione completa e una strategia ben costruita. :contentReference[oaicite:1]{index=1}"
    },
    {
      type: "reward",
      title: "Valore della vittoria",
      text: "Sconfiggere Celebrilith significa abbattere una delle ultime forme di equilibrio corrotto del mondo. Non è solo una vittoria di potenza, ma la dimostrazione di aver superato una prova che unisce forza, resistenza e controllo."
    },
    {
      type: "text",
      title: "Consiglio del veterano",
      text: "Non cercare un punto debole che non esiste. Celebrilith si affronta con equilibrio: se entri nello scontro sbilanciato, sarà lui a riportarti al suo ritmo… e a vincere nel momento in cui perdi il controllo."
    }
  ]
},

druidi_oscuri: {
  title: "Druidi Oscuri",
  intro: "Non custodiscono più la foresta: ne portano addosso la rovina. I Druidi Oscuri hanno spezzato il patto con la natura viva e ora piegano radici, spine e spiriti del bosco a una volontà corrotta. Dove passano loro, la selva non cresce… si contorce.",

  sections: [
    {
      type: "text",
      title: "Origine della banda",
      text: "Un tempo erano custodi dell’equilibrio naturale, ma il richiamo dell’Abisso ha infettato i loro riti. Le loro invocazioni non proteggono più la vita: la imprigionano, la piegano e la trasformano in arma. Nei Druidi Oscuri la sapienza del bosco è diventata dominio."
    },
    {
      type: "requirements",
      title: "Identità della banda",
      checks: [
        { label: "XP minimi", value: "550" },
        { label: "Ricompensa", value: "69000 monete" },
        { label: "Costo reclutamento", value: "120 oro, 30 diamanti" },
        { label: "Zona", value: "Profondità del Trono" }
      ]
    },
    {
      type: "steps",
      title: "Come funziona la sfida",
      items: [
        "Scegli il giocatore che affronta la banda.",
        "Inserisci il tuo tiro dadi.",
        "La banda tira automaticamente fino al suo valore massimo attuale.",
        "Confronta i risultati per determinare vittoria, sconfitta o pareggio.",
        "A fine scontro perdi comunque 50 stamina."
      ]
    },
    {
      type: "requirements",
      title: "Regole della sfida",
      checks: [
        { label: "Tentativi massimi", value: "6 per giocatore" },
        { label: "Stamina minima", value: "50" },
        { label: "Cooldown", value: "5 minuti tra una sfida e l’altra" },
        { label: "Reclutamento", value: "Solo dopo averla sconfitta" }
      ]
    },
    {
      type: "text",
      title: "Stile di combattimento",
      text: "I Druidi Oscuri non puntano sul semplice assalto. Combattono con controllo, ritualità corrotta e pressione continua. Le loro forze sembrano emergere dal terreno stesso, trasformando lo scontro in una prova di resistenza contro una natura divenuta nemica."
    },
    {
      type: "warning",
      title: "Conseguenze della sconfitta",
      text: "Se perdi, la banda si rafforza immediatamente. Il suo tiro massimo aumenta di 1: da 12 passa a 13, poi 14, 15 e così via a ogni sconfitta. Inoltre i Druidi Oscuri possono saccheggiarti monete e oro, accumulando bottino nella loro cassa."
    },
    {
      type: "warning",
      title: "Crescita della minaccia",
      text: "Più a lungo li lasci prosperare, più la banda diventa difficile da fermare. I Druidi Oscuri non travolgono solo con la forza: logorano, imprigionano e costringono il giocatore a combattere secondo il loro ritmo."
    },
    {
      type: "reward",
      title: "Ricompense della vittoria",
      text: "Sconfiggere i Druidi Oscuri garantisce 69000 monete, oltre a prestigio e bottino. È una vittoria importante contro una forza che non rappresenta solo potere militare, ma una corruzione profonda del legame con la natura. :contentReference[oaicite:1]{index=1}"
    },
    {
      type: "text",
      title: "Reclutare la banda",
      text: "Dopo averli sconfitti, puoi piegare i Druidi Oscuri al tuo servizio pagando 120 oro e 30 diamanti. Non si tratta di una banda comune: reclutarli significa assoggettare una forza rituale, antica e profondamente instabile."
    },
    {
      type: "reward",
      title: "Potere della banda",
      text: "Quando vengono reclutati, i Druidi Oscuri offrono una presenza di alto livello, legata a controllo, pressione e dominio del campo. Non sono semplici guerrieri: sono un’estensione corrotta del territorio stesso."
    },
    {
      type: "warning",
      title: "Regola importante",
      text: "Puoi controllare una sola banda alla volta. Per reclutarne un’altra, devi prima liberare quella attuale."
    },
    {
      type: "text",
      title: "Consiglio strategico",
      text: "I Druidi Oscuri sono una banda da affrontare con preparazione vera. La loro forza non sta soltanto nel tiro o nel bottino, ma nella capacità di rendere lo scontro più pesante e opprimente di quanto sembri all’inizio."
    }
  ]
},

diavolo_delle_catene: {
  title: "Diavolo delle Catene",
  intro: "Nel cuore delle profondità dove il fuoco non illumina ma condanna, si trascina il Diavolo delle Catene. Ogni anello che lo avvolge porta il suono della prigionia, ogni colpo sembra una sentenza, ogni movimento ricorda che alcune creature non sono nate per uccidere soltanto… ma per dominare e trattenere.",

  sections: [
    {
      type: "text",
      title: "Origine della creatura",
      text: "Le leggende raccontano che il Diavolo delle Catene nacque da un antico giuramento spezzato nelle profondità del Dungeon. Le sue catene non sono strumenti: sono parte del suo stesso essere, simboli di una volontà infernale che lega, schiaccia e punisce tutto ciò che tenta di sottrarsi al suo dominio."
    },
    {
      type: "requirements",
      title: "Identità del mostro",
      checks: [
        { label: "Categoria", value: "Mostro Maggiore" },
        { label: "Potenza Totale", value: "7600" },
        { label: "Salute", value: "340" }
      ]
    },
    {
      type: "requirements",
      title: "Distribuzione del Potere",
      checks: [
        { label: "Forza", value: "1600" },
        { label: "Astuzia", value: "1300" },
        { label: "Ingegno", value: "1450" },
        { label: "Magia", value: "1350" },
        { label: "Destrezza", value: "1900" }
      ]
    },
    {
      type: "requirements",
      title: "Accesso ai mostri",
      checks: [
        { label: "Per Mostri Minori", value: "Serve almeno 1 scrigno aperto" },
        { label: "Per Mostri Maggiori", value: "Servono almeno 4 scrigni aperti" }
      ]
    },
    {
      type: "warning",
      title: "Sigillo d’accesso",
      text: "Il Diavolo delle Catene appartiene ai Mostri Maggiori. Per affrontarlo devi aver già aperto almeno quattro scrigni. È una sfida destinata solo a chi ha già dimostrato di poter sopravvivere abbastanza a lungo da entrare fra i veri dominatori del Dungeon."
    },
    {
      type: "text",
      title: "Stile di combattimento",
      text: "Il Diavolo delle Catene domina con una combinazione feroce di forza, destrezza e controllo. Non è soltanto rapido o potente: è una creatura che impone pressione continua, obbligando l’avversario a combattere in uno spazio mentale e fisico sempre più stretto."
    },
    {
      type: "text",
      title: "La minaccia delle catene",
      text: "Contro questa creatura il pericolo non è solo essere colpiti, ma sentirsi progressivamente intrappolati. Ogni fase dello scontro sembra ridurre libertà, respiro e margine di recupero. Le sue catene non servono soltanto a ferire: servono a togliere speranza."
    },
    {
      type: "steps",
      title: "Come affrontarlo",
      items: [
        "Seleziona il giocatore che combatterà.",
        "Verifica di aver aperto almeno 4 scrigni.",
        "Scegli da 1 a 5 attributi da utilizzare nello scontro.",
        "Inserisci i risultati dei dadi per ogni attributo scelto.",
        "Confronta la tua potenza con quella del Diavolo delle Catene per determinare l’esito."
      ]
    },
    {
      type: "warning",
      title: "Perché è pericoloso",
      text: "Con una potenza totale di 7600, il Diavolo delle Catene è uno dei Mostri Maggiori più oppressivi. La sua destrezza è altissima, ma il vero problema è il modo in cui tutte le sue statistiche restano elevate insieme, rendendolo difficile da sbilanciare e ancora più difficile da controllare."
    },
    {
      type: "reward",
      title: "Valore della vittoria",
      text: "Sconfiggere il Diavolo delle Catene significa spezzare una delle forme più crudeli di dominio del Dungeon. È una vittoria che non misura solo il danno inflitto, ma la capacità del giocatore di liberarsi da una pressione costante senza cedere."
    },
    {
      type: "text",
      title: "Consiglio del veterano",
      text: "Non affrontarlo pensando di travolgerlo con un solo slancio. Il Diavolo delle Catene si vince restando lucidi mentre prova a stringere il controllo su tutto lo scontro. Qui non basta colpire forte: bisogna anche non lasciarsi imprigionare dal suo ritmo."
    }
  ]
},

hezrou: {
  title: "Hezrou",
  intro: "Dalle profondità più corrotte dell’Abisso emerge Hezrou, massa demoniaca di carne, forza e fetore sacrilego. Non porta con sé la nobiltà nera dei grandi signori del male, ma qualcosa di peggiore: una brutalità antica, viscerale e inarrestabile, capace di trasformare lo scontro in una prova di pura sopravvivenza.",

  sections: [
    {
      type: "text",
      title: "Origine della creatura",
      text: "Hezrou appartiene alle stirpi demoniache più antiche e deformi, generate non per governare con eleganza, ma per spezzare, travolgere e contaminare. La sua presenza non ispira timore per intelligenza sottile, ma per la sensazione immediata di trovarsi davanti a qualcosa che esiste solo per distruggere."
    },
    {
      type: "requirements",
      title: "Identità del mostro",
      checks: [
        { label: "Categoria", value: "Mostro Maggiore" },
        { label: "Potenza Totale", value: "9000" },
        { label: "Salute", value: "420" }
      ]
    },
    {
      type: "requirements",
      title: "Distribuzione del Potere",
      checks: [
        { label: "Forza", value: "2200" },
        { label: "Astuzia", value: "1500" },
        { label: "Ingegno", value: "1450" },
        { label: "Magia", value: "1550" },
        { label: "Destrezza", value: "2300" }
      ]
    },
    {
      type: "requirements",
      title: "Accesso ai mostri",
      checks: [
        { label: "Per Mostri Minori", value: "Serve almeno 1 scrigno aperto" },
        { label: "Per Mostri Maggiori", value: "Servono almeno 4 scrigni aperti" }
      ]
    },
    {
      type: "warning",
      title: "Sigillo d’accesso",
      text: "Hezrou appartiene ai Mostri Maggiori. Per affrontarlo devi aver già aperto almeno quattro scrigni. Non è una prova per chi cerca solo di tentare: è una soglia riservata a chi ha già dimostrato di poter sopravvivere alle profondità del Dungeon."
    },
    {
      type: "text",
      title: "Stile di combattimento",
      text: "Hezrou domina con pressione brutale e continuità feroce. La sua forza è immensa, ma non è il suo unico terrore: possiede anche destrezza altissima e statistiche generali tutte elevate, il che lo rende devastante sia nello scontro diretto sia nella tenuta prolungata."
    },
    {
      type: "text",
      title: "La minaccia del demone",
      text: "Contro Hezrou il vero pericolo è sentirsi schiacciati da una presenza che non concede respiro. Non sembra mai rallentare, non sembra mai perdere pressione, e costringe il giocatore a combattere sapendo che ogni errore viene subito punito con violenza."
    },
    {
      type: "steps",
      title: "Come affrontarlo",
      items: [
        "Seleziona il giocatore che combatterà.",
        "Verifica di aver aperto almeno 4 scrigni.",
        "Scegli da 1 a 5 attributi da utilizzare nello scontro.",
        "Inserisci i risultati dei dadi per ogni attributo scelto.",
        "Confronta la tua potenza con quella di Hezrou per determinare l’esito."
      ]
    },
    {
      type: "warning",
      title: "Perché è pericoloso",
      text: "Con una potenza totale di 9000, Hezrou è uno dei Mostri Maggiori più brutali dell’intero gioco. La combinazione di forza e destrezza enormi, unita a valori alti anche in magia, astuzia e ingegno, lo rende una creatura che può travolgere quasi ogni approccio sbilanciato. :contentReference[oaicite:1]{index=1}"
    },
    {
      type: "reward",
      title: "Valore della vittoria",
      text: "Sconfiggere Hezrou significa abbattere una delle incarnazioni più feroci dell’Abisso. Non è solo una vittoria numerica: è la prova di aver resistito a una forza demoniaca costruita per spezzare la volontà prima ancora del corpo."
    },
    {
      type: "text",
      title: "Consiglio del veterano",
      text: "Non affrontarlo contando solo sul danno. Hezrou si vince con preparazione completa, tenuta lunga e sangue freddo. Se entri nello scontro senza equilibrio, il demone non ti concederà il tempo di correggere l’errore."
    }
  ]
},

troll_delle_montagne: {
  title: "Troll delle Montagne",
  intro: "Fra creste battute dal vento, caverne immense e pareti di pietra che sembrano vive, dominano i Troll delle Montagne. Non sono soltanto bestie gigantesche: sono antichi signori dell’altura, creature immense che portano nella carne il peso delle rocce e nella furia la violenza delle tempeste.",

  sections: [
    {
      type: "text",
      title: "Origine della banda",
      text: "I Troll delle Montagne appartengono a una stirpe brutale e antichissima, cresciuta fra precipizi, nebbie e pareti spezzate. Ma questi non sono semplici colossi. Hanno sviluppato una forza rituale e oscura che li rende più di una massa selvaggia: sono una banda capace di travolgere, resistere e schiacciare ogni opposizione."
    },
    {
      type: "requirements",
      title: "Identità della banda",
      checks: [
        { label: "XP minimi", value: "1000" },
        { label: "Ricompensa", value: "132000 monete" },
        { label: "Potenza totale", value: "9000" },
        { label: "Potenza dadi iniziale", value: "12" },
        { label: "Costo reclutamento", value: "200 oro, 50 diamanti" }
      ]
    },
    {
      type: "requirements",
      title: "Distribuzione del potere",
      checks: [
        { label: "Forza", value: "1600" },
        { label: "Astuzia", value: "1350" },
        { label: "Ingegno", value: "1550" },
        { label: "Magia", value: "3300" },
        { label: "Destrezza", value: "1200" }
      ]
    },
    {
      type: "steps",
      title: "Come funziona la sfida",
      items: [
        "Scegli il giocatore che affronta la banda.",
        "Inserisci il tuo tiro dadi.",
        "La banda tira automaticamente fino al suo valore massimo attuale.",
        "Confronta i risultati per determinare vittoria, sconfitta o pareggio.",
        "A fine scontro perdi comunque 50 stamina."
      ]
    },
    {
      type: "requirements",
      title: "Regole della sfida",
      checks: [
        { label: "Tentativi massimi", value: "6 per giocatore" },
        { label: "Stamina minima", value: "50" },
        { label: "Cooldown", value: "5 minuti tra una sfida e l’altra" },
        { label: "Reclutamento", value: "Solo dopo averla sconfitta" }
      ]
    },
    {
      type: "text",
      title: "Stile di combattimento",
      text: "I Troll delle Montagne non si limitano a travolgere con la massa. La loro magia è mostruosamente alta, e questo li rende molto più pericolosi di quanto il nome lasci pensare. Uniscono brutalità, resistenza e potere arcano in una combinazione che può schiacciare sia i guerrieri fisici sia chi si affida soltanto alla tecnica."
    },
    {
      type: "warning",
      title: "Conseguenze della sconfitta",
      text: "Se perdi, la banda si rafforza immediatamente. Il suo tiro massimo aumenta di 1: da 12 passa a 13, poi 14, 15 e così via a ogni sconfitta. Inoltre i Troll delle Montagne possono saccheggiarti monete e oro, accumulando bottino nella loro cassa."
    },
    {
      type: "warning",
      title: "Pressione crescente",
      text: "Più volte fallisci, più questa banda diventa terrificante. I Troll delle Montagne non sono avversari da testare alla leggera: ogni sconfitta li rende più duri, più ricchi e più pericolosi per il tentativo successivo."
    },
    {
      type: "reward",
      title: "Ricompense della vittoria",
      text: "Sconfiggere i Troll delle Montagne garantisce 132000 monete, oltre a prestigio e bottino. È una vittoria enorme contro una delle bande più opprimenti e potenti del regno. :contentReference[oaicite:1]{index=1}"
    },
    {
      type: "text",
      title: "Reclutare la banda",
      text: "Dopo averli sconfitti, puoi piegare i Troll delle Montagne al tuo servizio pagando 200 oro e 50 diamanti. Non si tratta di una banda comune: reclutarli significa ottenere una forza colossale, antica e capace di cambiare il peso della tua presenza nel mondo di gioco."
    },
    {
      type: "reward",
      title: "Potere della banda",
      text: "Quando vengono reclutati, i Troll delle Montagne si sommano al potere del giocatore come una vera macchina di schiacciamento. Offrono una quantità enorme di total skill e una presenza capace di trasformare chi li controlla in una minaccia di altissimo livello."
    },
    {
      type: "warning",
      title: "Regola importante",
      text: "Puoi controllare una sola banda alla volta. Per reclutarne un’altra, devi prima liberare quella attuale."
    },
    {
      type: "text",
      title: "Consiglio strategico",
      text: "I Troll delle Montagne non sono una banda da inseguire troppo presto. Richiedono preparazione vera, grande crescita e una build già solida. Se li affronti senza essere pronto, non troverai semplici giganti… troverai una muraglia viva che ti restituirà indietro più debole di prima."
    }
  ]
},

mostro_fuoco: {
  title: "Mostro di Fuoco",
  intro: "Dalle crepe incandescenti della terra nasce il Mostro di Fuoco, creatura di brace viva e furia instabile. Non cammina davvero: divampa. Ogni suo passo annerisce il suolo, ogni respiro porta con sé il calore di una fornace antica.",

  sections: [
    {
      type: "text",
      title: "Origine della creatura",
      text: "Si narra che il Mostro di Fuoco sia nato dove la lava ha incontrato la corruzione dell’Abisso. Non è una semplice bestia ardente, ma una manifestazione selvaggia del fuoco fuori controllo, spinta dal desiderio di consumare tutto ciò che incontra."
    },
    {
      type: "requirements",
      title: "Identità del mostro",
      checks: [
        { label: "Categoria", value: "Mostro Minore" },
        { label: "Potenza Totale", value: "700" },
        { label: "Salute", value: "50" }
      ]
    },
    {
      type: "requirements",
      title: "Distribuzione del Potere",
      checks: [
        { label: "Forza", value: "140" },
        { label: "Astuzia", value: "90" },
        { label: "Ingegno", value: "80" },
        { label: "Magia", value: "220" },
        { label: "Destrezza", value: "170" }
      ]
    },
    {
      type: "requirements",
      title: "Accesso ai mostri",
      checks: [
        { label: "Per Mostri Minori", value: "Serve almeno 1 scrigno aperto" },
        { label: "Per Mostri Maggiori", value: "Servono almeno 4 scrigni aperti" }
      ]
    },
    {
      type: "warning",
      title: "Sigillo d’accesso",
      text: "Il Mostro di Fuoco appartiene ai Mostri Minori. Per affrontarlo devi aver già aperto almeno uno scrigno."
    },
    {
      type: "text",
      title: "Stile di combattimento",
      text: "Il Mostro di Fuoco punta soprattutto su magia e destrezza. È rapido, aggressivo e imprevedibile, capace di trasformare uno scontro apparentemente semplice in una fiammata difficile da contenere."
    },
    {
      type: "steps",
      title: "Come affrontarlo",
      items: [
        "Seleziona il giocatore che combatterà.",
        "Verifica di aver aperto almeno 1 scrigno.",
        "Scegli da 1 a 5 attributi da usare nello scontro.",
        "Inserisci i risultati dei dadi per ogni attributo scelto.",
        "Confronta la tua potenza con quella del Mostro di Fuoco."
      ]
    },
    {
      type: "warning",
      title: "Perché è pericoloso",
      text: "Con una potenza totale di 700, il Mostro di Fuoco è una minaccia iniziale seria. La sua magia elevata lo rende più insidioso di un semplice avversario fisico."
    },
    {
      type: "reward",
      title: "Valore della vittoria",
      text: "Sconfiggerlo significa domare una prima forma della furia elementale. È una vittoria utile per prepararsi a mostri più duri e imparare quanto il fuoco possa essere rapido a punire l’imprudenza."
    },
    {
      type: "text",
      title: "Consiglio del veterano",
      text: "Non sottovalutarlo perché è un mostro minore. Il fuoco sembra piccolo finché resta scintilla, ma basta un errore perché diventi incendio."
    }
  ]
},

pozione_emporio: {
  title: "Emporio delle Pozioni",
  intro: "Fra scaffali colmi di ampolle curative, vetri colorati e vapori d’erbe rare, l’Emporio delle Pozioni accoglie i viandanti feriti prima che il cammino li spezzi del tutto. Qui si acquistano cure immediate: piccole, minori, medie o leggendarie, ognuna con un prezzo e un momento giusto per essere usata.",

  sections: [
    {
      type: "text",
      title: "Natura dell’emporio",
      text: "L’Emporio delle Pozioni raccoglie solo le pozioni curative acquistabili dai giocatori. Ogni pozione agisce subito sul personaggio selezionato, ripristinando salute e una parte di stamina."
    },
    {
      type: "warning",
      title: "Fiale escluse dall’emporio",
      text: "Pozione Generica, Pozione Rigenerante, Elisir di Luce Astrale e Fiala del Vigore Infinito non sono vendute qui. Sono fiale speciali riservate al Master o a dinamiche particolari."
    },
    {
      type: "requirements",
      title: "Pozioni disponibili",
      checks: [
        { label: "Mini Pozione di Cura", value: "+20 salute, +10 stamina, 500 monete" },
        { label: "Pozione di Cura Piccola", value: "+40 salute, +20 stamina, 700 monete" },
        { label: "Pozione Minore", value: "+50 salute, +25 stamina, 1000 monete" },
        { label: "Pozione Media", value: "+80 salute, +40 stamina, 1500 monete" },
        { label: "Pozione Leggendaria", value: "+150 salute, +75 stamina, 2000 monete" }
      ]
    },
    {
      type: "steps",
      title: "Come funziona",
      items: [
        "Seleziona il giocatore da curare.",
        "Scegli una delle 5 pozioni disponibili.",
        "Verifica il prezzo attuale.",
        "Paga il costo richiesto.",
        "La cura viene applicata subito a salute e stamina."
      ]
    },
    {
      type: "warning",
      title: "Prezzo crescente",
      text: "Ogni pozione acquistata raddoppia il proprio prezzo per quel giocatore. Il costo parte dal valore base e cresce dopo ogni acquisto della stessa pozione."
    },
    {
      type: "warning",
      title: "Uso immediato",
      text: "Le pozioni dell’emporio non sono trasportabili per ora. Non finiscono nello zaino: vengono usate subito sul personaggio selezionato."
    },
    {
      type: "reward",
      title: "Valore strategico",
      text: "Le cure piccole servono a restare stabili senza spendere troppo. Le pozioni superiori vanno usate quando il danno è serio o prima di prove decisive."
    },
    {
      type: "text",
      title: "Consiglio del cerusico",
      text: "Non comprare sempre la pozione più grande. La cura giusta è quella che ti rimette in piedi senza svuotarti le tasche."
    }
  ]
},

  };

  window.AbissoCellRulesConfig = {
    CELL_RULES
  };
})();