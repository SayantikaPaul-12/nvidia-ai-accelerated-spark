require('dotenv').config();
const express = require('express');
const axios   = require('axios');
const app     = express();
const PORT    = process.env.PORT || 3000;
// parse JSON bodies
app.use(express.json());
// in-memory store
const messages = [];
// GET all messages
app.get('/api/messages', (req, res) => {
  return res.json(messages);
});
// POST a new message and forward to myAI Builder
app.post('/api/messages', async (req, res) => {
  const { text, user } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Missing text field' });
  }
  // store the incoming user message
  const userMsg = {
    id:        messages.length + 1,
    text,
    user:      user || 'anonymous',
    timestamp: new Date().toISOString()
  };
  messages.push(userMsg);
  try {
    // call the myAI Builder API
    const response = await axios.post(
      process.env.MYAI_URL,
      { prompt: text },
      { headers: { Authorization: `Bearer ${process.env.MYAI_API_KEY}` } }
    );
    // extract AI reply (adjust field names as needed)
    console.log('AI Response:', response.data);
    const aiText = response.data.reply
      || response.data.choices?.[0]?.message?.content
      || 'No reply field in response';
    const aiMsg = {
      id:        messages.length + 1,
      text:      aiText,
      user:      'AI',
      timestamp: new Date().toISOString()
    };
    messages.push(aiMsg);
    // return both user and AI messages
    return res.status(201).json({ user: userMsg, ai: aiMsg });
  } catch (err) {
    console.error('AI Builder error:', err.response?.data || err.message);
    return res.status(502).json({ error: 'AI service error' });
  }
});
// start the API server
app.listen(PORT, () => {
  console.log(`API + AI proxy running at http://localhost:${PORT}`);
});