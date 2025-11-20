
'use server';

/**
 * @fileOverview Converts text into a spoken-word audio podcast.
 *
 * - generatePodcastFromText - A function that handles the text-to-speech conversion.
 * - GeneratePodcastFromTextInput - The input type for the generatePodcastFromText function.
 * - GeneratePodcastFromTextOutput - The return type for the generatePodcastFromText function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import wav from 'wav';

const GeneratePodcastFromTextInputSchema = z.string().describe('The text content to be converted into a podcast.');
export type GeneratePodcastFromTextInput = z.infer<typeof GeneratePodcastFromTextInputSchema>;

const GeneratePodcastFromTextOutputSchema = z.object({
  media: z.string().describe("A data URI of the generated audio file. Expected format: 'data:audio/wav;base64,<encoded_data>'."),
});
export type GeneratePodcastFromTextOutput = z.infer<typeof GeneratePodcastFromTextOutputSchema>;

async function toWav(pcmData: Buffer, channels = 1, rate = 24000, sampleWidth = 2): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const generatePodcastFromTextFlow = ai.defineFlow(
  {
    name: 'generatePodcastFromTextFlow',
    inputSchema: GeneratePodcastFromTextInputSchema,
    outputSchema: GeneratePodcastFromTextOutputSchema,
  },
  async (query) => {
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: query,
    });
    if (!media) {
      throw new Error('No media was returned from the model.');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    return {
      media: 'data:audio/wav;base64,' + (await toWav(audioBuffer)),
    };
  }
);


export async function generatePodcastFromText(input: GeneratePodcastFromTextInput): Promise<GeneratePodcastFromTextOutput> {
  return generatePodcastFromTextFlow(input);
}

    