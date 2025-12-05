
'use server';
/**
 * @fileOverview An AI flow for converting text into a spoken-word podcast.
 *
 * - generatePodcastFromText - A function that handles the text-to-speech conversion.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'genkit/zod';
import wav from 'wav';

// Define the schema for the flow's output
const PodcastOutputSchema = z.object({
  media: z.string().describe("The base64 encoded data URI of the generated WAV audio file."),
});

/**
 * Converts a string of text into a spoken-word audio file.
 * @param text The text to convert to speech.
 * @returns A promise that resolves to an object containing the base64 data URI of the audio.
 */
export async function generatePodcastFromText(text: string): Promise<z.infer<typeof PodcastOutputSchema>> {
  return generatePodcastFlow(text);
}

/**
 * A Genkit flow that converts text to speech using Google AI's TTS model.
 */
const generatePodcastFlow = ai.defineFlow(
  {
    name: 'generatePodcastFromTextFlow',
    inputSchema: z.string(),
    outputSchema: PodcastOutputSchema,
  },
  async (query) => {
    // Generate the raw PCM audio data from the text
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

    if (!media?.url) {
      throw new Error('No audio media was returned from the AI model.');
    }
    
    // The model returns a base64 string with a data URI prefix. We need to extract the raw data.
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    // Convert the raw PCM audio buffer to a WAV format buffer, then to a base64 string.
    const wavBase64 = await toWav(audioBuffer);

    // Return the result in a data URI format that can be used in an <audio> tag.
    return {
      media: 'data:audio/wav;base64,' + wavBase64,
    };
  }
);


/**
 * Converts raw PCM audio data into a WAV file format as a base64 string.
 * @param pcmData The raw PCM audio buffer.
 * @param channels The number of audio channels.
 * @param rate The sample rate.
 * @param sampleWidth The sample width in bytes.
 * @returns A promise that resolves to the base64-encoded WAV file string.
 */
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => bufs.push(d));
    writer.on('end', () => {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}
