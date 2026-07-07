// config.js
// Chiave pubblica Supabase. Non inserire mai la service_role key.

window.AUTHOR_CONFIG = {
  SUPABASE_URL: "https://dcvxdfuvmrmvugedrokc.supabase.co",
  SUPABASE_PUBLISHABLE_KEY: "sb_publishable_bkfgi6tmYnpHgFOI8RnX-A_UtFAZVQ-",

  TABLES: {
    allowedUsers: "author_allowed_users",
    texts: "author_chapter_texts",
    blocks: "author_chapter_blocks",
    versions: "author_text_versions",
    comments: "author_comments",
    questTexts: "author_quest_texts",
    questVersions: "author_quest_text_versions",
    publishedQuestTexts: "author_published_quest_texts",
    weaponTexts: "author_weapon_texts",
    weaponVersions: "author_weapon_text_versions",
    publishedWeaponTexts: "author_published_weapon_texts"
  }
};
