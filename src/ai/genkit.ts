
import { genkit, ai } from '@genkit-ai/next';
import { googleAI } from '@genkit-ai/google-genai';

export const config = genkit({
  plugins: [
    googleAI({
      apiVersion: 'v1beta',
    }),
  ],
  logLevel: 'debug',
  enableTracingAndMetrics: true,
});

export { ai };
