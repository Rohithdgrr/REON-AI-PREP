'use server';
/**
 * @fileOverview A simple AI flow to answer general questions or perform text manipulation.
 *
 * - answerQuestionsWithAI - A function that takes a text prompt and returns an AI-generated text response.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const AnswerQuestionsInputSchema = z.string();
const AnswerQuestionsOutputSchema = z.string();

export async function answerQuestionsWithAI(prompt: string): Promise<string> {
  return answerQuestionsFlow(prompt);
}

const answerQuestionsFlow = ai.defineFlow(
  {
    name: 'answerQuestionsFlow',
    inputSchema: AnswerQuestionsInputSchema,
    outputSchema: AnswerQuestionsOutputSchema,
  },
  async (prompt) => {
    const { text } = await ai.generate({
        prompt: prompt,
        model: 'x-ai/grok-4.1-fast',
    });
    return text;
  }
);
