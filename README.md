# Area Autore - Abisso Infinito

## Dove inserire i file

Crea una cartella separata, per esempio:

```text
/author
  index.html
  style.css
  app.js
  config.js
  cell-rules-config.js
  supabase-author-schema.sql
```

In locale puoi aprire `index.html`.  
Per ora `config.js` è in modalità offline con `USE_LOCAL_MODE: true`, quindi salva testi, commenti e cronologia in `localStorage`.

## Quando vai online

1. Esegui `supabase-author-schema.sql` nel progetto Supabase della musical app.
2. Inserisci gli utenti autorizzati in `author_allowed_users`.
3. In `config.js` imposta:
   - `USE_LOCAL_MODE: false`
   - `SUPABASE_URL`
   - `SUPABASE_PUBLISHABLE_KEY`
4. Pubblica il sito su Vercel come progetto separato.
5. Collega il dominio `author.abissoinfinito.it`.

## Logica dati

- `cell-rules-config.js`: sorgente ufficiale dei capitoli.
- `author_chapter_texts`: testo scritto/modificato dall'autore.
- `author_text_versions`: cronologia dei testi precedenti.
- `author_comments`: commenti e risposte.
- `author_allowed_users`: whitelist accesso.

## Testi delle quest

- `quest-text-catalog.js`: catalogo generato dai tre file del gioco.
- `author_quest_texts`: bozze private dell'autore.
- `author_quest_text_versions`: cronologia delle riscritture.
- `author_published_quest_texts`: soli testi approvati, leggibili dal gioco.
- `scripts/generate-quest-text-catalog.mjs`: rigenera il catalogo quando cambiano
  `map-objects-library.js`, `mini-maps-config.js` o
  `main-map-interactions-config.js`.

Per rigenerare:

```powershell
node scripts/generate-quest-text-catalog.mjs
```

L'integrazione da copiare nel progetto gioco si trova in `game-integration/`.

## Descrizioni armi

- `author-weapons-catalog.js`: catalogo generato da `armi.html`.
- `author_weapon_texts`: un blocco bozza per ogni arma.
- `author_weapon_text_versions`: cronologia delle riscritture.
- `author_published_weapon_texts`: descrizioni approvate, leggibili dal gioco.
- `scripts/generate-weapon-catalog.mjs`: rigenera il catalogo quando cambia `armi.html`.

Per rigenerare dal percorso predefinito:

```powershell
node scripts/generate-weapon-catalog.mjs
```

## Descrizioni creature

- `author-creatures-catalog.js`: catalogo generato da `creatures-data.js`.
- `author_creature_texts`: un blocco bozza per ogni creatura.
- `author_creature_text_versions`: cronologia delle riscritture.
- `author_published_creature_texts`: descrizioni approvate, leggibili dal gioco.
- `scripts/generate-creatures-catalog.mjs`: rigenera il catalogo quando cambia `creatures-data.js`.

Per rigenerare dal percorso predefinito:

```powershell
node scripts/generate-creatures-catalog.mjs
```

## Descrizioni guardiani zone

- `author-zone-guardians-catalog.js`: catalogo generato da `maps-config.js`, sezione `CONQUERABLE_ZONE_GUARDIANS`.
- `author_zone_guardian_texts`: un blocco bozza per ogni guardiano territoriale.
- `author_zone_guardian_text_versions`: cronologia delle riscritture.
- `author_published_zone_guardian_texts`: descrizioni approvate, leggibili dal gioco.
- `scripts/generate-zone-guardians-catalog.mjs`: rigenera il catalogo quando cambia `maps-config.js`.

Per rigenerare dal percorso predefinito:

```powershell
node scripts/generate-zone-guardians-catalog.mjs
```

## Descrizioni echi

- `author-fragments-catalog.js`: catalogo generato da `dashboard/js/config/fragments-config.js`, sezione `BEL_FRAGMENTS_CONFIG`.
- `author_fragment_texts`: un blocco bozza per ogni eco/frammento.
- `author_fragment_text_versions`: cronologia delle riscritture.
- `author_published_fragment_texts`: descrizioni approvate, leggibili dal gioco.
- `scripts/generate-fragments-catalog.mjs`: rigenera il catalogo quando cambia `fragments-config.js`.

Per rigenerare dal percorso predefinito:

```powershell
node scripts/generate-fragments-catalog.mjs
```

## Testi modali

- `author-modal-texts-catalog.js`: catalogo generale dei testi editoriali delle modali.
- `author_modal_texts`: un blocco bozza per ogni testo modale o pietanza.
- `author_modal_text_versions`: cronologia delle riscritture.
- `author_published_modal_texts`: testi approvati, leggibili dal gioco.
- `scripts/generate-modal-texts-catalog.mjs`: rigenera il catalogo dai file modale registrati nello script.

Sorgenti collegate:

- `dashboard/market-food-modal.html`: Banco del Cibo.
- `app/cibo.html`: nomi, descrizioni, immagini, costo ed effetti delle pietanze del Banco del Cibo.
- `dashboard/chef-gustav-modal.html`: testi della modale Chef Gustav.
- `app/cibo.html`: menu, descrizioni, fame, costo e immagini collegate dei servizi di Chef Gustav.
- `dashboard/messenger-modal.html`: testi della modale Messaggero del Patto.
- `app/movimenti.html`: missioni, descrizioni, bersagli e ricompense del Messaggero del Patto.
- `dashboard/js/config/map-content-library.js`: descrizione e consiglio rapido del nodo Messaggero del Patto.
- `dashboard/saloon-modal.html`: testi della modale Saloon del Regno.
- `docs/saloon_full_system_migration.sql`: offerte, descrizioni, immagini, costo ed effetti del Saloon.
- `public.game_saloon_offer_catalog`: snapshot delle offerte Saloon attive in Supabase, incluse Gentlemen e Mandragora.
- `dashboard/commercial-bank-modal.html`: testi, operazioni e regole della modale Banca del Regno.
- `dashboard/potion-market-modal.html`: testi della modale Emporio Alchemico.
- `public.game_potion_catalog` + `public.game_item_catalog`: snapshot delle pozioni attive, con descrizioni, immagini, prezzi, scorte ed effetti.
- `dashboard/barracks-modal.html`: testi della Caserma del Regno e blocchi descrizione per ogni soldato addestrabile.
- `dashboard/cards-modal.html`: testi della modale Carte Speciali.
- `app/defaultData.json`: blocchi descrizione per ogni carta dei personaggi.
- `dashboard/environment-effects-modal.html`: testi della modale Effetti Ambientali.
- `dashboard/js/services/world-environment-service.js`: descrizioni, immagini, percentuali e attributi degli effetti ambientali.

Per rigenerare dal percorso predefinito:

```powershell
node scripts/generate-modal-texts-catalog.mjs
```
