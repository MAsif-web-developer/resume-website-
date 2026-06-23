const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

let supabase = null;
let isSupabaseConnected = false;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
  isSupabaseConnected = true;
}

export default async function handler(req, res) {
  // CORS handling
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, email, message } = req.body;

  // Simple validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please fill in all fields.' });
  }

  // Email format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  // Save to Supabase
  if (isSupabaseConnected && supabase) {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([{ name, email, message }]);

      if (error) {
        console.error('Supabase insert error:', error.message);
        return res.status(500).json({ error: 'Database error: Could not save message.' });
      } else {
        return res.status(200).json({
          success: true,
          message: 'Message received successfully!',
          storedIn: 'Supabase'
        });
      }
    } catch (dbErr) {
      console.error('Error saving to Supabase:', dbErr.message);
      return res.status(500).json({ error: 'Internal server error: Could not save message.' });
    }
  } else {
    // Cannot save locally on Vercel, so we return error if Supabase isn't connected
    return res.status(500).json({ error: 'Database connection not configured.' });
  }
}
