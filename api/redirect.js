const { supabase } = require('../lib/supabase');

module.exports = async (req, res) => {
  try {
    const { platform, alias } = req.query;

    if (!platform || !alias) {
      return res.status(400).send('Invalid link.');
    }

    const { data, error } = await supabase
      .from('links')
      .select('original_url')
      .eq('platform', platform.toLowerCase())
      .eq('alias', alias.toLowerCase())
      .maybeSingle();

    if (error) {
      console.error('Redirect lookup error:', error);
      return res.status(500).send('Something went wrong.');
    }

    if (!data) {
      return res.status(404).send('Link not found. It may have been removed or never existed.');
    }

    res.writeHead(302, { Location: data.original_url });
    return res.end();
  } catch (err) {
    console.error('Unexpected redirect error:', err);
    return res.status(500).send('Unexpected server error.');
  }
};
