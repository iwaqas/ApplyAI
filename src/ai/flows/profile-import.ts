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
import { scrapeUrl } from './scrape-url';

const ImportLinkedInProfileInputSchema = z.object({
  linkedinProfileUrl: z
    .string().url()
    .describe('The URL of the user\'s LinkedIn profile.'),
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
  input: {schema: z.object({
    scrapedContent: z.string()
  })},
  output: {schema: ImportLinkedInProfileOutputSchema},
  prompt: `You are an AI assistant that rephrases scraped LinkedIn profile information to create an initial template for a job application profile.

Rephrase the following LinkedIn profile information:

{{{scrapedContent}}}

Extract and summarize the user's experience, education, skills, and accomplishments into a professional brief. Focus on creating a clear and concise summary that can be used as a master document for job applications.

Output the rephrased profile information.`,
});

const importLinkedInProfileFlow = ai.defineFlow(
  {
    name: 'importLinkedInProfileFlow',
    inputSchema: ImportLinkedInProfileInputSchema,
    outputSchema: ImportLinkedInProfileOutputSchema,
  },
  async ({linkedinProfileUrl}) => {
    const scrapedContent = await scrapeUrl({url: linkedinProfileUrl});

    if (!scrapedContent || scrapedContent.length < 100) {
        throw new Error("Could not scrape valid content from the provided URL. The profile might be private or the URL is incorrect.");
    }
    
    const {output} = await prompt({scrapedContent});
    return output!;
  }
);
