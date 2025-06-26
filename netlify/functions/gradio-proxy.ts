// netlify/functions/gradio-proxy.ts
import type { Handler } from '@netlify/functions';
import { Client } from '@gradio/client';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const body = JSON.parse(event.body || '{}');
  const { action } = body;
  const gradioEndpoint = process.env['GRADIO_API_URL'];
  console.log('GRADIO_API_URL:', gradioEndpoint);

  if (!gradioEndpoint) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'GRADIO_API_URL is not configured' }),
    };
  }

  try {
    // Connect to Gradio client
    const client = await Client.connect(gradioEndpoint);

    let result;

    switch (action) {
      case 'ask_graph':
        result = await client.predict('/ask_graph', {
          user_input: body.user_input,
          chat_history: body.chat_history,
        });
        break;

      case 'clear_conversation':
        // If your Gradio API has a clear endpoint, adjust accordingly.
        // Otherwise, mimic clearing by sending an empty input or special flag.
        result = await client.predict('/clear_conversation', {});
        break;

      case 'set_bot':
        if (!body.bot_name) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'bot_name parameter missing' }),
          };
        }
        result = await client.predict('/set_bot', {
          bot_name: body.bot_name,
        });
        break;

      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Unknown action' }),
        };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ data: result.data }),
    };
  } catch (err) {
    console.error('Error calling Gradio API:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to reach Gradio server' }),
    };
  }
};

export { handler };
