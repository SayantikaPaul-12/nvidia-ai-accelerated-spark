import express from 'express';
import { Client } from '@gradio/client';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

router.post('/gradio-proxy', async (req, res) => {
  const { action, user_input, chat_history, bot_name } = req.body;
  const gradioEndpoint = process.env['GRADIO_API_URL'];

  if (!gradioEndpoint) {
    return res.status(500).json({ error: 'GRADIO_API_URL is not configured' });
  }

  try {
    const client = await Client.connect(gradioEndpoint);
    let result;

    switch (action) {
      case 'ask_graph':
        result = await client.predict('/ask_graph', { user_input, chat_history });
        break;
      case 'clear_conversation':
        result = await client.predict('/clear_conversation', {});
        break;
      case 'set_bot':
        if (!bot_name) {
          return res.status(400).json({ error: 'bot_name parameter missing' });
        }
        result = await client.predict('/set_bot', { bot_name });
        break;
      default:
        return res.status(400).json({ error: 'Unknown action' });
    }

    return res.status(200).json({ data: result.data });
  } catch (err) {
    console.error('Error calling Gradio API:', err);
    return res.status(500).json({ error: 'Failed to reach Gradio server' });
  }
});

export default router;
