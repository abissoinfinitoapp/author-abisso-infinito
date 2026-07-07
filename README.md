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
