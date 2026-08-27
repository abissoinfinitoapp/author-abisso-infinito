(function () {
  const assetBase = "https://assets.abissoinfinito.it/img";

  const bots = [
    { key: "nix", label: "Nix", image: "nix.png" },
    { key: "tork", label: "Tork", image: "tork.png" },
    { key: "zorbie", label: "Zorbie", image: "zorbie.png" },
    { key: "brakk", label: "Brakk", image: "brakk.png" },
    { key: "fiz", label: "Fiz", image: "fiz.png" }
  ].map((bot) => ({
    ...bot,
    imageUrl: `${assetBase}/${bot.image}`
  }));

  const actions = [
    ["esplorare", "Esplorare", "Fallback esplorazione del Brain", ["Brain"]],
    ["curarsi", "Curarsi", "Usare una pozione o un oggetto curativo dall'inventario", ["apply_potion_command", "use_inventory_item"]],
    ["mangiare", "Mangiare", "Comprare cibo al mercato o ordinare un menu dello Chef", ["buy_market_food", "order_chef_menu"]],
    ["recuperare_stamina", "Recuperare Stamina", "Recuperare Stamina tramite un'offerta del Saloon", ["saloon_buy_offer"]],
    ["preparare_la_luce", "Preparare la luce", "Attivare una lanterna o la torcia iniziale", ["activate_lantern", "activate_starter_torch"]],
    ["acquistare_equipaggiamento", "Acquistare equipaggiamento", "Comprare un oggetto da avventura", ["buy_adventure_item"]],
    ["fare_acquisti_in_vhar", "Fare acquisti in Vhar", "Effettuare acquisti nella città di Vhar", ["vhar_shopping_command"]],
    ["raccogliere_risorse", "Raccogliere risorse", "Raccogliere una risorsa disponibile", ["collect_resource"]],
    ["gestire_le_risorse", "Gestire le risorse", "Depositare, trasferire o commerciare risorse", ["deposit_all_resources", "transfer_cargo_item", "trade_material_resource"]],
    ["assoldare_maestranze", "Assoldare Maestranze", "Assoldare lavoratori", ["hire_workers"]],
    ["recuperare_denaro", "Recuperare denaro", "Prelevare oro dalla banca", ["bank_withdraw_gold"]],
    ["mettere_al_sicuro_denaro", "Mettere al sicuro denaro", "Depositare oro in banca", ["bank_deposit_gold"]],
    ["ricorrere_a_un_prestito", "Ricorrere a un prestito", "Aprire o chiudere un prestito bancario", ["bank_create_loan", "bank_close_loan"]],
    ["proteggere_il_patrimonio", "Proteggere il patrimonio", "Attivare o disattivare l'assicurazione bancaria", ["bank_enable_insurance", "bank_disable_insurance"]],
    ["allenarsi", "Allenarsi", "Svolgere una sessione di allenamento", ["perform_training"]],
    ["migliorare_le_armi", "Migliorare le armi", "Gestire o potenziare un'arma", ["weapon_command"]],
    ["sviluppare_lesercito", "Sviluppare l'esercito", "Gestire lo sviluppo dell'esercito", ["barracks_command"]],
    ["conquistare_una_banda", "Conquistare una Banda", "Conquistare o gestire una Banda", ["band_command", "provider:Banda"]],
    ["saccheggiare_con_la_banda", "Saccheggiare con la Banda", "Compiere un'incursione con la Banda", ["band_raid"]],
    ["conquistare_una_zona", "Conquistare una Zona", "Tentare la conquista di una Zona", ["zone_conquest_command"]],
    ["preparare_uno_scrigno", "Preparare uno Scrigno", "Depositare materiali chiave per preparare uno Scrigno", ["deposit_key_material"]],
    ["aprire_uno_scrigno", "Aprire uno Scrigno", "Aprire uno Scrigno disponibile", ["open_chest"]],
    ["affrontare_un_mostro", "Affrontare un Mostro", "Iniziare o sostenere una battaglia contro un Mostro", ["monster_battle_command"]],
    ["affrontare_i_minimostri", "Affrontare i Minimostri", "Attaccare i Minimostri con il gruppo", ["party_attack_command"]],
    ["affrontare_un_evento", "Affrontare un Evento", "Interagire con un evento personalizzato", ["custom_event_command"]],
    ["seguire_una_quest", "Seguire una Quest", "Proseguire verso un obiettivo di avventura", ["Target/Goal di avventura"]],
    ["stringere_un_patto", "Stringere un Patto", "Stringere un patto tramite il Messaggero", ["messenger_pact_command"]],
    ["tornare_dalla_morte", "Tornare dalla morte", "Tentare la resurrezione affidandosi al destino", ["roll_destiny_resurrection"]]
  ].map(([key, label, meaning, providers], index) => ({
    key,
    label,
    meaning,
    providers,
    index: index + 1
  }));

  const units = bots.flatMap((bot) => actions.flatMap((action) => {
    return [1, 2, 3].map((phraseSlot) => ({
      textKey: `bot:${bot.key}:${action.key}:phrase_${phraseSlot}`,
      sourceFile: "dashboard/automation/player-bot",
      modalId: "bot_narratives",
      modalLabel: "Bot",
      category: "Bot",
      fieldKey: `${bot.key}_${action.key}_phrase_${phraseSlot}`,
      fieldLabel: `${action.label} · Frase ${phraseSlot}`,
      textType: "bot_narrative_phrase",
      itemKey: `${bot.key}:${action.key}`,
      itemLabel: bot.label,
      image: bot.image,
      imageUrl: bot.imageUrl,
      provisionalText: "",
      metadata: {
        botKey: bot.key,
        botLabel: bot.label,
        actionKey: action.key,
        actionLabel: action.label,
        actionIndex: action.index,
        actionMeaning: action.meaning,
        providers: action.providers,
        phraseSlot
      }
    }));
  }));

  window.AuthorBotNarrativesCatalog = {
    bots,
    actions,
    units,
    botCount: bots.length,
    actionCount: actions.length,
    phraseCount: units.length
  };
})();
