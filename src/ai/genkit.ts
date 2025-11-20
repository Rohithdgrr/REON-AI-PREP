import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY,
      apiEndpoint: 'https://openrouter.ai/api/v1',
    }),
  ],
});
