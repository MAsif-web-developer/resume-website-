const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

let supabase = null;
let isSupabaseConnected = false;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
  isSupabaseConnected = true;
  console.log('Supabase client initialized successfully.');
} else {
  console.warn('Supabase credentials missing. Fallback to local JSON file saving will be active.');
}

// Middlewares
app.use(cors({
  origin: '*', // In production, replace with specific frontend URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Fallback save to JSON function
const saveToLocalFile = async (data) => {
  const filePath = path.join(__dirname, 'submissions.json');
  let submissions = [];

  try {
    if (fs.existsSync(filePath)) {
      const fileData = fs.readFileSync(filePath, 'utf8');
      submissions = JSON.parse(fileData);
    }
  } catch (err) {
    console.error('Error reading submissions.json, starting fresh.', err);
  }

  const newSubmission = {
    id: Date.now().toString(),
    ...data,
    created_at: new Date().toISOString()
  };

  submissions.push(newSubmission);

  try {
    fs.writeFileSync(filePath, JSON.stringify(submissions, null, 2), 'utf8');
    console.log('Submission saved locally to submissions.json');
    return true;
  } catch (err) {
    console.error('Error writing to submissions.json:', err);
    return false;
  }
};

// API Routes
app.get('/api/health', async (req, res) => {
  let dbStatus = 'offline (local fallback active)';

  if (supabase) {
    try {
      const { error } = await supabase.from('contact_submissions').select('id').limit(1);
      dbStatus = error ? `supabase error: ${error.message}` : 'supabase connected';
    } catch {
      dbStatus = 'supabase unreachable';
    }
  }

  res.json({
    status: 'online',
    database: dbStatus
  });
});

app.post('/api/contact', async (req, res) => {
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

  const submissionData = { name, email, message };
  let dbSaved = false;
  let fileSaved = false;

  // Try saving to Supabase if connected
  if (isSupabaseConnected && supabase) {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([{ name, email, message }]);

      if (error) {
        console.error('Supabase insert error, falling back to local file:', error.message);
      } else {
        dbSaved = true;
        console.log('Submission saved to Supabase.');
      }
    } catch (dbErr) {
      console.error('Error saving to Supabase, falling back to local file:', dbErr.message);
    }
  }

  // Save to local file as fallback or double safety
  if (!dbSaved) {
    fileSaved = await saveToLocalFile(submissionData);
  }

  if (dbSaved || fileSaved) {
    return res.json({
      success: true,
      message: 'Message received successfully!',
      storedIn: dbSaved ? 'Supabase' : 'local file system'
    });
  } else {
    return res.status(500).json({ error: 'Internal server error: Could not save message.' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
