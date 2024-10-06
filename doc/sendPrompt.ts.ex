// /* eslint-disable no-undef */
import axios from 'axios';
import { Anthropic } from '@anthropic-ai/sdk';
import corsMiddleware from '../middleware/cors';

export default defineEventHandler(async (event) => {
  // Apply the CORS and security middleware
  await corsMiddleware(event);

  const body = await readBody(event);
  const { prompt, provider } = body;

  const config = useRuntimeConfig();
  const apiKeyOpenAI = config.private.OPENAI_API_KEY;
  const apiKeyAnthropic = config.private.ANTHROPIC_API_KEY;

  if (provider === 'openai') {
    return await sendToChatGPT(prompt, apiKeyOpenAI);
  } else if (provider === 'anthropic') {
    return await sendToAnthropic(prompt, apiKeyAnthropic);
  } else {
    throw createError({ statusCode: 400, statusMessage: 'Invalid provider' });
  }
});

const sendToChatGPT = async (prompt, apiKey) => {
  const apiUrl = 'https://api.openai.com/v1/chat/completions';
  console.log('apiUrl', apiUrl);
  const response = await axios.post(
    apiUrl,
    {
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    },
  );

  console.log('response', response);

  return response.data.choices[0].message.content;
};

const sendToAnthropic = async (prompt, apiKey) => {
  const anthropic = new Anthropic({
    apiKey: apiKey,
  });

  console.log('prompt', prompt);
  console.log('apiKey', apiKey);

  const response = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20240620',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  console.log('response', response);

  return response.content[0].text;
};
