// src/ai/flows/draft-cv-cover-letter.ts
'use server';
/**
 * @fileOverview This file defines a Genkit flow for drafting CVs and cover letters based on user profile data and job preferences.
 *
 * - draftCvCoverLetter - A function that takes user profile data and job preferences to generate a tailored CV and cover letter.
 * - DraftCvCoverLetterInput - The input type for the draftCvCoverLetter function.
 * - DraftCvCoverLetterOutput - The return type for the draftCvCoverLetter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DraftCvCoverLetterInputSchema = z.object({
  profileData: z.string().describe('A comprehensive collection of the user\u2019s professional data including resume, CV, experience, awards, certifications, publications, etc.'),
  jobPreferences: z.string().describe('The user\u2019s job preferences, including years of experience, career level, top 5 preferred job titles, and any other relevant preferences.'),
  jobDescription: z.string().describe('The job description for which the CV and cover letter are being drafted.'),
  includeCoverLetter: z.boolean().describe('Whether or not to include a cover letter in addition to the CV.'),
});
export type DraftCvCoverLetterInput = z.infer<typeof DraftCvCoverLetterInputSchema>;

const DraftCvCoverLetterOutputSchema = z.object({
  cv: z.string().describe('The drafted CV tailored to the job description and user preferences.'),
  coverLetter: z.string().optional().describe('The drafted cover letter tailored to the job description and user preferences, if requested.'),
});
export type DraftCvCoverLetterOutput = z.infer<typeof DraftCvCoverLetterOutputSchema>;

export async function draftCvCoverLetter(input: DraftCvCoverLetterInput): Promise<DraftCvCoverLetterOutput> {
  return draftCvCoverLetterFlow(input);
}

const draftCvCoverLetterPrompt = ai.definePrompt({
  name: 'draftCvCoverLetterPrompt',
  input: {schema: DraftCvCoverLetterInputSchema},
  output: {schema: DraftCvCoverLetterOutputSchema},
  prompt: `You are an expert career advisor specializing in crafting compelling CVs and cover letters. Given the following user profile data, job preferences, and job description, draft a CV and, if requested, a cover letter tailored to the job.

User Profile Data: {{{profileData}}}
Job Preferences: {{{jobPreferences}}}
Job Description: {{{jobDescription}}}

{{#if includeCoverLetter}}
Include a cover letter in addition to the CV.
{{/if}}

Ensure the CV and cover letter highlight the most relevant skills and experiences for the job, and are formatted professionally.
`,
});

const draftCvCoverLetterFlow = ai.defineFlow(
  {
    name: 'draftCvCoverLetterFlow',
    inputSchema: DraftCvCoverLetterInputSchema,
    outputSchema: DraftCvCoverLetterOutputSchema,
  },
  async input => {
    const {output} = await draftCvCoverLetterPrompt(input);
    return output!;
  }
);
