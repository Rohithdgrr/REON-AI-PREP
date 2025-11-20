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
  studyPlan: z.string().describe('A personalized study plan outlining topics to study and time allocation for each subject. The output must be a well-formatted markdown string.')
});

export type GeneratePersonalizedStudyPlanOutput = z.infer<typeof GeneratePersonalizedStudyPlanOutputSchema>;

const prompt = ai.definePrompt({
  name: 'generatePersonalizedStudyPlanPrompt',
  input: {schema: GeneratePersonalizedStudyPlanInputSchema},
  output: {schema: GeneratePersonalizedStudyPlanOutputSchema},
  prompt: `You are an expert AI career counselor who creates personalized study plans for competitive exam aspirants in India.

Generate a detailed, actionable, and encouraging study plan based on the following user inputs:

- Target Exam: {{{targetExam}}}
- Weak Subjects: {{#each weakSubjects}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
- Available Hours Per Day: {{{availableHours}}}

{{#if previousPerformance}}
- Previous Performance Context: {{{previousPerformance}}}
Take this previous performance into account to specifically address areas of improvement.
{{/if}}

**Instructions for the Output:**

1.  **Format**: The entire output must be a single string formatted in clean **Markdown**.
2.  **Structure**:
    *   Start with a main heading, like \`# Your Personalized Study Plan for {{{targetExam}}}\`.
    *   Create sections for different timeframes (e.g., \`## Daily Schedule\`, \`## Weekly Breakdown\`, \`## Subject-wise Focus\`).
    *   Use bullet points (\`-\`) or numbered lists (\`1.\`) for tasks and topics.
    *   Use bold (\`**\`) to highlight key subjects, topics, or actions.
3.  **Content**:
    *   Allocate more time to the specified **weak subjects**.
    *   The plan should be realistic for the given \`availableHours\`.
    *   Include a mix of learning new concepts, practice sessions, and revision.
    *   Suggest specific, actionable tasks (e.g., "Solve 20 PYQs of Profit & Loss," "Take a sectional mock test for Reasoning").
    *   Add a concluding motivational sentence.

Example Snippet:
\`\`\`markdown
# Your Personalized Study Plan for SBI PO

Here is a plan tailored to your needs.

## Daily Schedule ({{availableHours}} hours)
- **Reasoning (Weak Subject)**: 1.5 hours
- **Quantitative Aptitude**: 1 hour
- **English**: 1 hour
- **Revision & Current Affairs**: 0.5 hours

## Weekly Breakdown
- **Monday**: Focus on Puzzles (Reasoning) & Percentages (Quant).
- **Tuesday**: English Grammar rules & Reading Comprehension practice.
...
\`\`\`
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
