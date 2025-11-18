'use server';
/**
 * @fileOverview Converts a PDF document into interactive flashcards with AI-generated mnemonics and highlighted sections.
 *
 * - convertPdfToFlashcards - A function that handles the PDF to flashcards conversion process.
 * - ConvertPdfToFlashcardsInput - The input type for the convertPdfToFlashcards function.
 * - ConvertPdfToFlashcardsOutput - The return type for the convertPdfToFlashcards function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ConvertPdfToFlashcardsInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "A PDF document as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ConvertPdfToFlashcardsInput = z.infer<typeof ConvertPdfToFlashcardsInputSchema>;

const ConvertPdfToFlashcardsOutputSchema = z.object({
  flashcards: z.array(
    z.object({
      question: z.string().describe('The question for the flashcard.'),
      answer: z.string().describe('The answer to the question.'),
      mnemonic: z.string().describe('An AI-generated mnemonic to help remember the answer.'),
      highlightedSections: z.array(
        z.object({
          start: z.number().describe('The starting index of the highlighted section in the answer.'),
          end: z.number().describe('The ending index of the highlighted section in the answer.'),
        })
      ).describe('Highlighted sections in the answer.'),
    })
  ).describe('An array of flashcards generated from the PDF document.'),
});
export type ConvertPdfToFlashcardsOutput = z.infer<typeof ConvertPdfToFlashcardsOutputSchema>;

export async function convertPdfToFlashcards(input: ConvertPdfToFlashcardsInput): Promise<ConvertPdfToFlashcardsOutput> {
  return convertPdfToFlashcardsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'convertPdfToFlashcardsPrompt',
  input: {schema: ConvertPdfToFlashcardsInputSchema},
  output: {schema: ConvertPdfToFlashcardsOutputSchema},
  prompt: `You are an expert in converting PDF documents into interactive flashcards.

You will receive a PDF document as a data URI. Your task is to extract the content from the PDF and generate a set of flashcards.

For each flashcard, create a question and an answer based on the content of the PDF. Also, generate a mnemonic to help the user remember the answer. Highlight the key sections in the answer that are most important for memorization.

Ensure that the output is a JSON array of flashcards, each containing a question, an answer, a mnemonic, and highlighted sections.

PDF Document: {{media url=pdfDataUri}}`,
});

const convertPdfToFlashcardsFlow = ai.defineFlow(
  {
    name: 'convertPdfToFlashcardsFlow',
    inputSchema: ConvertPdfToFlashcardsInputSchema,
    outputSchema: ConvertPdfToFlashcardsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
