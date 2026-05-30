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
