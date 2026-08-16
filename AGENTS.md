# Contesto database del sito autore

Codex e' collegato normalmente al database **Abisso Infinito dev**. Il sito autore
usa un database Supabase parallelo, che potrebbe non essere accessibile direttamente.

## Tabelle note del database parallelo

Tabelle dell'area autore:

- `author_allowed_users`
- `author_chapter_blocks`
- `author_chapter_texts`
- `author_comments`
- `author_creature_text_versions`
- `author_creature_texts`
- `author_fragment_text_versions`
- `author_fragment_texts`
- `author_modal_text_versions`
- `author_modal_texts`
- `author_published_creature_texts`
- `author_published_fragment_texts`
- `author_published_modal_texts`
- `author_published_quest_texts`
- `author_published_weapon_texts`
- `author_published_zone_guardian_texts`
- `author_quest_text_versions`
- `author_quest_texts`
- `author_text_versions`
- `author_weapon_text_versions`
- `author_weapon_texts`
- `author_zone_guardian_text_versions`
- `author_zone_guardian_texts`

Tabelle dell'area musical:

- `musical_allowed_users`
- `musical_comments`
- `musical_lyrics`
- `musical_versions`

## Regola per le integrazioni nel gioco

Quando un'implementazione in **Abisso Infinito dev** richiede testi provenienti dal
database parallelo:

1. usare questo elenco per identificare la tabella sorgente probabile;
2. non presumere nomi o tipi delle colonne, chiavi, vincoli, policy RLS o trigger;
3. se lo schema necessario non e' gia' presente in `supabase-author-schema.sql`,
   chiedere all'utente di eseguire nel database parallelo una query SQL di
   introspezione mirata e di incollare il risultato;
4. preparare una query di sola lettura che restituisca solo metadati o righe utili
   all'implementazione, evitando segreti e dati personali;
5. applicare modifiche al database solo dopo conferma esplicita e verificare sempre
   il risultato.

Nota: `supabase-author-schema.sql` descrive gran parte delle tabelle `author_*`, ma
la schermata del database resta la fonte dell'elenco sopra. In particolare,
`author_chapter_blocks` e le tabelle `musical_*` potrebbero richiedere introspezione
perche' non sono definite in quel file.

## Snapshot autorevole di `author_chapter_blocks`

Il dump completo fornito dall'utente e' salvato in:

- `data/author_chapter_blocks_rows.sql`

Questa tabella contiene quasi tutti i personaggi e le strutture del gioco ed e' la
fonte editoriale principale per sostituire i placeholder presenti in Abisso
Infinito. Prima di chiedere un'altra query SQL o concludere che un personaggio o una
struttura non esiste nel database autore, cercare sempre il relativo `chapter_key`
in questo dump completo.

Un risultato incollato o un export filtrato/parziale non deve essere usato per
dedurre la copertura dell'intera tabella. In particolare, il precedente JSON con 12
personaggi era parziale: nel dump completo sono presenti anche chapter come
`player_umbrax`, `player_vexor`, `player_vornax` e `player_xanthor`.

Per le integrazioni dei testi:

1. considerare autorevoli i contenuti di `author_chapter_blocks`;
2. mappare `chapter_key`, `block_key`, `block_title`, `official_type` e `content`
   verso il placeholder corrispondente nel gioco;
3. non usare come sostituto editoriale i placeholder, i testi provvisori o copie
   presenti in altre pagine del gioco, salvo autorizzazione esplicita dell'utente;
4. se un contenuto non compare nello snapshot, verificare prima che il dump non sia
   diventato obsoleto e solo dopo chiedere un export o una query mirata aggiornata;
5. prima di modificare il delicato progetto del gioco, comunicare eventuali buchi o
   ambiguita' della mappatura e non cambiare fonte in autonomia.

## Percorsi non attivi

I seguenti capitoli descrivono percorsi che non esistono piu' nel gioco attuale e
devono restare esclusi dalle integrazioni per ora, come placeholder per un possibile
uso futuro:

- `ponte_infuocato`
- `porta_dei_teschi`
- `precipizio_di_lava`
- `selva_delle_lame`
- `sentiero_delle_ombre`
- `stanza_dei_fili_taglienti`
