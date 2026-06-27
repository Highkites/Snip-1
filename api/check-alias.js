const { supabase } = require('../lib/supabase');
const { sanitizeAlias } = require('../lib/utils');

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed. Use GET.' });
  }

  try {
    const { platform, alias } = req.query;

    if (!platform || !alias) {
      return res.status(400).json({ error: 'platform and alias query params are required.' });
    }

    const cleanAlias = sanitizeAlias(alias);

    const { data, error } = await supabase
      .from('links')
      .select('id')
      .eq('platform', platform.toLowerCase())
      .eq('alias', cleanAlias)
      .maybeSingle();

    if (error) {
      console.error('Check-alias error:', error);
      return res.status(500).json({ error: 'Could not check availability.' });
    }

    return res.status(200).json({ available: !data, alias: cleanAlias });
  } catch (err) {
    console.error('Unexpected error:', err);
    return res.status(500).json({ error: 'Unexpected server error.' });
  }
};
