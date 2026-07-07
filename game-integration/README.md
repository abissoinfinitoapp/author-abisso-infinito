# Collegamento al gioco

Il file `quest-text-overrides.js` va copiato in:

```text
dashboard/js/services/quest-text-overrides.js
```

In `dashboard/mappa-zoom.html`, dopo:

```html
<script src="js/config/main-map-interactions-config.js"></script>
<script src="js/services/main-map-interactions-service.js"></script>
```

caricare il loader e avviare `mappa-zoom.js` soltanto dopo il caricamento dei
testi pubblicati:

```html
<script src="js/services/quest-text-overrides.js"></script>
<script>
  window.AbissoQuestTextOverridesReady.finally(() => {
    const script = document.createElement("script");
    script.src = "mappa-zoom.js?v=20260625-author-quest-texts1";
    document.body.appendChild(script);
  });
</script>
```

Rimuovere quindi il vecchio tag diretto:

```html
<script src="mappa-zoom.js"></script>
```

Se il servizio remoto non risponde, il loader risolve comunque la Promise e il
gioco parte usando i testi provvisori presenti nei tre file di configurazione.
