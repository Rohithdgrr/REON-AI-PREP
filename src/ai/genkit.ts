
'use client';

import { genkit, googleAI } from 'genkit/plugins';

export const ai = genkit({
  plugins: [googleAI()],
  logLevel: 'debug',
  enableTracing: true,
});
