export const XMLAPI = "https://boardgamegeek.com/xmlapi/";
export const XMLAPI2 = "https://boardgamegeek.com/xmlapi2/";
export const MAX_RETRIES = 20;
/** Seconds to wait after a 202 Accepted before polling again. */
export const RETRY_DELAY_ACCEPTED = 5;
/** Seconds to wait after a 429 Too Many Requests. */
export const RETRY_DELAY_RATE_LIMIT = 10;
/** Seconds to wait between successful thing() chunks. */
export const CHUNK_DELAY = 2;
export const TERMS_OF_USE = "https://boardgamegeek.com/xmlapi/termsofuse";
