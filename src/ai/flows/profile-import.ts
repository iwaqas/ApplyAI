'use server';

/**
 * @fileOverview LinkedIn profile import and rephrasing flow.
 *
 * - importLinkedInProfile - A function that imports and rephrases LinkedIn profile information.
 * - ImportLinkedInProfileInput - The input type for the importLinkedInProfile function.
 * - ImportLinkedInProfileOutput - The return type for the importLinkedInProfile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImportLinkedInProfileInputSchema = z.object({
  linkedinProfile: z
    .string()
    .describe('The user\'s LinkedIn profile information as a string.'),
});
export type ImportLinkedInProfileInput = z.infer<typeof ImportLinkedInProfileInputSchema>;

const ImportLinkedInProfileOutputSchema = z.object({
  rephrasedProfile: z
    .string()
    .describe('The rephrased LinkedIn profile information.'),
});
export type ImportLinkedInProfileOutput = z.infer<typeof ImportLinkedInProfileOutputSchema>;

export async function importLinkedInProfile(input: ImportLinkedInProfileInput): Promise<ImportLinkedInProfileOutput> {
  return importLinkedInProfileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'importLinkedInProfilePrompt',
  input: {schema: ImportLinkedInProfileInputSchema},
  output: {schema: ImportLinkedInProfileOutputSchema},
  prompt: `You are an AI assistant that rephrases LinkedIn profile information to create an initial template for a job application profile.

Rephrase the following LinkedIn profile information:

{{{linkedinProfile}}}

Make sure to preserve the original intent and meaning of the information.

Output the rephrased profile information.`,
});

const importLinkedInProfileFlow = ai.defineFlow(
  {
    name: 'importLinkedInProfileFlow',
    inputSchema: ImportLinkedInProfileInputSchema,
    outputSchema: ImportLinkedInProfileOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
