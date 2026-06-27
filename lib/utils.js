/**
 * Extracts a clean "platform" tag from a URL's domain.
 * e.g. https://open.spotify.com/playlist/xyz -> "spotify"
 *      https://www.youtube.com/watch?v=xyz   -> "youtube"
 *      https://example.com/page              -> "example"
 */
function extractPlatform(rawUrl) {
  try {
    const url = new URL(rawUrl);
    let hostname = url.hostname.toLowerCase();

    // Strip common prefixes
    hostname = hostname.replace(/^www\./, '').replace(/^open\./, '').replace(/^m\./, '');

    // Split by dots, e.g. "spotify.com" -> ["spotify", "com"]
    const parts = hostname.split('.');

    // Handle cases like "co.uk", "com.au" by taking the part before the last 2 segments
    // Simple heuristic: take the first segment as the platform name
    const platform = parts[0];

    // Sanitize: only allow lowercase letters, numbers, hyphens
    return platform.replace(/[^a-z0-9-]/g, '') || 'link';
  } catch (err) {
    return 'link';
  }
}

/**
 * Sanitizes a user-provided alias: lowercase, only letters/numbers/hyphens,
 * spaces become hyphens.
 */
function sanitizeAlias(rawAlias) {
  return rawAlias
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

/**
 * Basic validation that the input is a usable http/https URL.
 */
function isValidUrl(rawUrl) {
  try {
    const url = new URL(rawUrl);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (err) {
    return false;
  }
}

module.exports = { extractPlatform, sanitizeAlias, isValidUrl };
