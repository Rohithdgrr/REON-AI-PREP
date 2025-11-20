import { genkit, modelRef } from 'genkit';
import { openAICompatible } from '@genkit-ai/compat-oai';

export const grokModel = modelRef({
  name: 'openrouter/nous-hermes-2-mixtral-8x7b-dpo',
});

export const llamaL1Model = modelRef({
  name: 'openrouter/meta-llama/llama-3-8b-instruct',
});

export const llamaL2Model = modelRef({
  name: 'openrouter/meta-llama/llama-3-70b-instruct',
});

export const ai = genkit({
  plugins: [
    openAICompatible({
      name: 'openrouter',
      apiKey: process.env.NEXT_PUBLIC_OPENROUTER_API_KEY!,
      baseURL: 'https://openrouter.ai/api/v1',
    }),
  ],
});
