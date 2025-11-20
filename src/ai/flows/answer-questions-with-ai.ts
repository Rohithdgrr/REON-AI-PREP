'use server';
/**
 * @fileOverview A simple AI flow to answer general questions or perform text manipulation.
 *
 * - answerQuestionsWithAI - A function that takes a text prompt and returns an AI-generated text response.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const AnswerQuestionsInputSchema = z.object({
  prompt: z.string(),
  model: z.string().optional(),
});
const AnswerQuestionsOutputSchema = z.string();

export async function answerQuestionsWithAI(input: { prompt: string, model?: string }): Promise<string> {
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
        model: model || 'meta-llama/llama-3-8b-instruct',
    });
    return text;
  }
);
