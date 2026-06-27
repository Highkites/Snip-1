const { customAlphabet } = require('nanoid');
const { supabase } = require('../lib/supabase');
const { extractPlatform, sanitizeAlias, isValidUrl } = require('../lib/utils');

// Generates short random codes like "k3x9pq" when user doesn't pick an alias
const generateCode = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 6);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    const { originalUrl, customAliasInput } = req.body || {};

    if (!originalUrl || !isValidUrl(originalUrl)) {
      return res.status(400).json({ error: 'Please provide a valid URL (must start with http:// or https://).' });
    }

    const platform = extractPlatform(originalUrl);

    let alias = customAliasInput ? sanitizeAlias(customAliasInput) : '';

    // If no alias provided, auto-generate one
    if (!alias) {
      alias = generateCode();
    }

    if (alias.length < 1 || alias.length > 50) {
      return res.status(400).json({ error: 'Alias must be between 1 and 50 characters.' });
    }

    // Check if platform+alias combination already exists
    const { data: existing, error: lookupError } = await supabase
      .from('links')
      .select('id')
      .eq('platform', platform)
      .eq('alias', alias)
      .maybeSingle();

    if (lookupError) {
      console.error('Lookup error:', lookupError);
      return res.status(500).json({ error: 'Something went wrong checking alias availability.' });
    }

    if (existing) {
      // If it was an auto-generated code, just generate a new one and retry once
      if (!customAliasInput) {
        alias = generateCode();
      } else {
        return res.status(409).json({
          error: `"${alias}" is already taken under "${platform}". Try a different alias.`,
          suggestion: `${alias}-2`,
        });
      }
    }

    const { data: inserted, error: insertError } = await supabase
      .from('links')
      .insert([{ platform, alias, original_url: originalUrl }])
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return res.status(500).json({ error: 'Could not create the short link. Please try again.' });
    }

    const host = req.headers.host;
    const protocol = host && host.includes('localhost') ? 'http' : 'https';
    const shortUrl = `${protocol}://${host}/${platform}/${alias}`;

    return res.status(201).json({
      shortUrl,
      platform,
      alias,
      originalUrl,
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ error: 'Unexpected server error.' });
  }
};
