'use server';
/**
 * @fileOverview A quiz generation AI agent.
 *
 * - generateQuiz - A function that handles the quiz generation process.
 * - GenerateQuizInput - The input type for the generateQuiz function.
 * - GenerateQuizOutput - The return type for the generateQuiz function.
 */

import { ai, grokModel } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateQuizInputSchema = z.object({
  topic: z.string().describe('The main topic for the quiz (e.g., "Indian History", "Time & Work").'),
  subTopics: z.array(z.string()).optional().describe('A list of more specific sub-topics within the main topic.'),
  numQuestions: z.number().describe('The number of questions to generate.'),
  difficultyLevel: z.enum(['Easy', 'Medium', 'Hard']).optional().describe('The desired difficulty level of the quiz.'),
  specialization: z.string().optional().describe('A special focus for the quiz, like "time management" (questions that are tricky under time pressure) or "based on previous mistakes" (requires context not provided here, but can influence question style).')
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const GenerateQuizOutputSchema = z.object({
  title: z.string().describe('A suitable title for the generated quiz based on the topic.'),
  questions: z.array(z.object({
    question: z.string().describe('The question text.'),
    options: z.array(z.string()).describe('A list of possible answers.'),
    correctAnswer: z.string().describe('The correct answer from the options.'),
    explanation: z.string().describe('A detailed explanation of the correct answer.'),
    fastSolveTricks: z.string().optional().describe('Tips or tricks to solve the question quickly.'),
    analogies: z.string().optional().describe('Analogies to help understand the core concept.'),
  })).describe('An array of quiz questions.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;


function buildPrompt(input: GenerateQuizInput): string {
    let prompt = `You are an expert quiz creator for competitive exams like Railway and Bank exams in India.

Generate a quiz with ${input.numQuestions} multiple-choice questions on the topic of "${input.topic}".
`;

    if (input.subTopics && input.subTopics.length > 0) {
        prompt += `Focus on the following sub-topics: ${input.subTopics.join(', ')}.\n`;
    }

    if (input.difficultyLevel) {
        prompt += `The difficulty of the questions should be: ${input.difficultyLevel}.\n`;
    }

    if (input.specialization) {
        prompt += `Specialize the quiz with a focus on: ${input.specialization}. For example, if the focus is "time management", include questions that are tricky to solve quickly.\n`;
    }

    prompt += `
For each question, provide 4 options and clearly indicate the correct answer. 
Also provide a detailed explanation for the answer, some tricks to solve the question faster, and an analogy to better understand the concept.
The questions should be challenging and relevant to the exam syllabus.
`;
    return prompt.trim();
}


export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async input => {
    const {output} = await ai.generate({
      model: grokModel,
      prompt: buildPrompt(input),
      output: { schema: GenerateQuizOutputSchema },
    });
    
    if (!output) {
      throw new Error('Model response did not match the expected schema.');
    }

    return output;
  }
);
