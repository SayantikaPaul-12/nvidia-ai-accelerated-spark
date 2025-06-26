// netlify/functions/gradio-proxy.ts
import type { Handler } from '@netlify/functions';
import { Client } from '@gradio/client';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { user_input, chat_history } = JSON.parse(event.body || '{}');
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

    // Call predict on the /ask_graph or relevant endpoint
    // Note: Adjust if your API expects an object or array — adapt accordingly
    const result = await client.predict('/ask_graph', {
      user_input,
      chat_history,
    });

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
