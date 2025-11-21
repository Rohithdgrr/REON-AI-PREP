
'use server';
/**
 * @fileOverview A simple AI flow to answer general questions or perform text manipulation.
 *
 * - answerQuestionsWithAI - A function that takes a text prompt and returns an AI-generated text response.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { modelRef } from 'genkit';

const AnswerQuestionsInputSchema = z.object({
  prompt: z.string(),
  model: z.enum(['L1', 'L2']).optional().default('L1'),
});
const AnswerQuestionsOutputSchema = z.string();

export async function answerQuestionsWithAI(input: z.infer<typeof AnswerQuestionsInputSchema>): Promise<string> {
  return answerQuestionsFlow(input);
}

const answerQuestionsFlow = ai.defineFlow(
  {
    name: 'answerQuestionsFlow',
    inputSchema: AnswerQuestionsInputSchema,
    outputSchema: AnswerQuestionsOutputSchema,
  },
  async ({ prompt, model }) => {
    const { text } = await ai.generate({
        prompt: prompt,
        model: 'grok-1',
    });
    return text;
  }
);
