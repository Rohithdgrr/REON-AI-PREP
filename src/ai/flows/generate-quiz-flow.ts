'use server';
/**
 * @fileOverview A quiz generation AI agent.
 *
 * - generateQuiz - A function that handles the quiz generation process.
 * - GenerateQuizInput - The input type for the generateQuiz function.
 * - GenerateQuizOutput - The return type for the generateQuiz function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const QuizQuestionSchema = z.object({
  question: z.string().describe('The question text.'),
  options: z.array(z.string()).describe('A list of possible answers.'),
  correctAnswer: z.string().describe('The correct answer from the options.'),
});

const GenerateQuizInputSchema = z.object({
  topic: z.string().describe('The topic for the quiz (e.g., "Indian History", "Time & Work").'),
  numQuestions: z.number().describe('The number of questions to generate.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const GenerateQuizOutputSchema = z.object({
  title: z.string().describe('A suitable title for the generated quiz based on the topic.'),
  questions: z.array(QuizQuestionSchema).describe('An array of quiz questions.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: { schema: GenerateQuizInputSchema },
  output: { schema: GenerateQuizOutputSchema },
  prompt: `You are an expert quiz creator for competitive exams like Railway and Bank exams in India.

Generate a quiz with {{{numQuestions}}} multiple-choice questions on the topic of "{{{topic}}}".

For each question, provide 4 options and clearly indicate the correct answer. The questions should be challenging and relevant to the exam syllabus.
`,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
