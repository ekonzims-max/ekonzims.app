const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('✅ Supabase connecté');
} else {
  console.log('⚠️ Supabase non configuré - Mode développement (in-memory)');
}

const isSupabaseEnabled = () => supabase !== null;

module.exports = { supabase, isSupabaseEnabled };
