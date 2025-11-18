'use server';

/**
 * @fileOverview A question answering AI agent.
 *
 * - answerQuestionsWithAI - A function that answers user questions.
 * - AnswerQuestionsWithAIInput - The input type for the answerQuestionsWithAI function.
 * - AnswerQuestionsWithAIOutput - The return type for the answerQuestionsWithAI function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerQuestionsWithAIInputSchema = z.string().describe('The question to be answered.');
export type AnswerQuestionsWithAIInput = z.infer<typeof AnswerQuestionsWithAIInputSchema>;

const AnswerQuestionsWithAIOutputSchema = z.string().describe('The answer to the question.');
export type AnswerQuestionsWithAIOutput = z.infer<typeof AnswerQuestionsWithAIOutputSchema>;

export async function answerQuestionsWithAI(input: AnswerQuestionsWithAIInput): Promise<AnswerQuestionsWithAIOutput> {
  return answerQuestionsWithAIFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerQuestionsWithAIPrompt',
  input: {schema: AnswerQuestionsWithAIInputSchema},
  output: {schema: AnswerQuestionsWithAIOutputSchema},
  prompt: `You are LIBRA, an AI-powered chatbot that answers user questions.

  Answer the following question: {{{$input}}}`,
});

const answerQuestionsWithAIFlow = ai.defineFlow(
  {
    name: 'answerQuestionsWithAIFlow',
    inputSchema: AnswerQuestionsWithAIInputSchema,
    outputSchema: AnswerQuestionsWithAIOutputSchema,
  },
  async input => {
    const {text} = await prompt(input);
    return text!;
  }
);
