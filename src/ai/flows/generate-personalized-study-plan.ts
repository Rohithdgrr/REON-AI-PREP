'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating personalized study plans.
 *
 * The flow takes into account the user's target exam, weak subjects, and available hours
 * to create an efficient study schedule.
 *
 * @interface GeneratePersonalizedStudyPlanInput - Defines the input schema for the flow.
 * @interface GeneratePersonalizedStudyPlanOutput - Defines the output schema for the flow.
 * @function generatePersonalizedStudyPlan - The exported function that calls the flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GeneratePersonalizedStudyPlanInputSchema = z.object({
  targetExam: z.string().describe('The target exam for which the study plan is being generated (e.g., Railway NTPC, SBI PO).'),
  weakSubjects: z.array(z.string()).describe('An array of subjects in which the user is weak (e.g., [Reasoning, English]).'),
  availableHours: z.number().describe('The number of hours the user has available for studying per day.'),
  previousPerformance: z.string().optional().describe('The previous performance of the user in mock tests.')
});

export type GeneratePersonalizedStudyPlanInput = z.infer<typeof GeneratePersonalizedStudyPlanInputSchema>;

const GeneratePersonalizedStudyPlanOutputSchema = z.object({
  studyPlan: z.string().describe('A personalized study plan outlining topics to study and time allocation for each subject.')
});

export type GeneratePersonalizedStudyPlanOutput = z.infer<typeof GeneratePersonalizedStudyPlanOutputSchema>;

const prompt = ai.definePrompt({
  name: 'generatePersonalizedStudyPlanPrompt',
  input: {schema: GeneratePersonalizedStudyPlanInputSchema},
  output: {schema: GeneratePersonalizedStudyPlanOutputSchema},
  prompt: `You are an AI study plan generator. You will generate a personalized study plan based on the user's target exam, weak subjects, and available hours.

Target Exam: {{{targetExam}}}
Weak Subjects: {{#each weakSubjects}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
Available Hours: {{{availableHours}}}

{{#if previousPerformance}}
Previous Performance: {{{previousPerformance}}}
Use the previous performance to optimize the generated study plan.
{{/if}}

Generate a study plan that allocates time appropriately to each subject, focusing more on the weak subjects. The study plan should be a markdown string with a clear heading and bullet points for each day or subject.
`,
});

const generatePersonalizedStudyPlanFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedStudyPlanFlow',
    inputSchema: GeneratePersonalizedStudyPlanInputSchema,
    outputSchema: GeneratePersonalizedStudyPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);


export async function generatePersonalizedStudyPlan(input: GeneratePersonalizedStudyPlanInput): Promise<GeneratePersonalizedStudyPlanOutput> {
  return generatePersonalizedStudyPlanFlow(input);
}
