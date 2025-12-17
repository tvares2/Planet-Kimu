'use server';
/**
 * @fileOverview A flow that generates reasons why the user loves their girlfriend.
 *
 * - generateReasonForLove - A function that generates a reason for love.
 * - GenerateReasonForLoveInput - The input type for the generateReasonForLove function (void).
 * - GenerateReasonForLoveOutput - The return type for the generateReasonForLove function (string).
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReasonForLoveInputSchema = z.void();
export type GenerateReasonForLoveInput = z.infer<typeof GenerateReasonForLoveInputSchema>;

const GenerateReasonForLoveOutputSchema = z.string().describe('A reason why the user loves their girlfriend.');
export type GenerateReasonForLoveOutput = z.infer<typeof GenerateReasonForLoveOutputSchema>;

export async function generateReasonForLove(): Promise<GenerateReasonForLoveOutput> {
  return generateReasonForLoveFlow();
}

const prompt = ai.definePrompt({
  name: 'generateReasonForLovePrompt',
  input: {schema: GenerateReasonForLoveInputSchema},
  output: {schema: GenerateReasonForLoveOutputSchema},
  prompt: `You are a love expert, skilled at articulating heartfelt reasons why someone might love their girlfriend. Generate a unique and touching reason, keeping it concise and emotionally resonant. Focus on genuine affection and appreciation. Use no more than 20 words.
`,
});

const generateReasonForLoveFlow = ai.defineFlow(
  {
    name: 'generateReasonForLoveFlow',
    inputSchema: GenerateReasonForLoveInputSchema,
    outputSchema: GenerateReasonForLoveOutputSchema,
  },
  async () => {
    const {output} = await prompt({});
    return output!;
  }
);
