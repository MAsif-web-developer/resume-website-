const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

export default async function handler(req, res) {
  let dbStatus = 'offline (serverless fallback active)';

  if (supabase) {
    try {
      const { error } = await supabase.from('contact_submissions').select('id').limit(1);
      dbStatus = error ? `supabase error: ${error.message}` : 'supabase connected';
    } catch {
      dbStatus = 'supabase unreachable';
    }
  } else {
    dbStatus = 'supabase credentials missing';
  }

  res.status(200).json({
    status: 'online',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
}
