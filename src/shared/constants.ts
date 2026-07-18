export const XMLAPI = "https://boardgamegeek.com/xmlapi/";
export const XMLAPI2 = "https://boardgamegeek.com/xmlapi2/";
export const LANGUAGE_DEPENDENCE_LABELS = [
  "No necessary in-game text",
  "Some necessary text - easily memorized or small crib sheet",
  "Moderate in-game text - needs crib sheet or paste ups",
  "Extensive use of text - massive conversion needed to be playable",
  "Unplayable in another language",
] as const;
export const MAX_RETRIES = 20;
export const RETRY_DELAY_ACCEPTED = 5;
export const RETRY_DELAY_RATE_LIMIT = 10;
export const CHUNK_DELAY = 2;
export const TERMS_OF_USE = "https://boardgamegeek.com/xmlapi/termsofuse";