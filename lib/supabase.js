const { createClient } = require('@supabase/supabase-js');

// These two values come from your Supabase project settings (Project Settings > API)
// Set them as Environment Variables in Vercel (Settings > Environment Variables):
//   SUPABASE_URL
//   SUPABASE_ANON_KEY
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase environment variables are missing. Set SUPABASE_URL and SUPABASE_ANON_KEY.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };
