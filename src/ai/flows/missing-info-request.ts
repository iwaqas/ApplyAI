// missing-info-request.ts
'use server';

/**
 * @fileOverview Prompts the user for missing information required for a job application.
 *
 * - requestMissingInfo - A function that requests missing information from the user.
 * - RequestMissingInfoInput - The input type for the requestMissingInfo function.
 * - RequestMissingInfoOutput - The return type for the requestMissingInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RequestMissingInfoInputSchema = z.object({
  jobDescription: z
    .string()
    .describe('The description of the job for which information is needed.'),
  missingInformation: z
    .array(z.string())
    .describe('An array of missing information needed from the user.'),
  userProfile: z
    .string()
    .describe('The user profile to check for missing information.'),
});
export type RequestMissingInfoInput = z.infer<typeof RequestMissingInfoInputSchema>;

const RequestMissingInfoOutputSchema = z.object({
  missingInfoPrompt: z
    .string()
    .describe(
      'A prompt to the user requesting the missing information, tailored to the job description.'
    ),
});
export type RequestMissingInfoOutput = z.infer<typeof RequestMissingInfoOutputSchema>;

export async function requestMissingInfo(
  input: RequestMissingInfoInput
): Promise<RequestMissingInfoOutput> {
  return requestMissingInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'requestMissingInfoPrompt',
  input: {schema: RequestMissingInfoInputSchema},
  output: {schema: RequestMissingInfoOutputSchema},
  prompt: `You are a helpful AI assistant that identifies missing information from a user profile required for a job application and prompts the user to provide it.

  Job Description: {{{jobDescription}}}
  Missing Information: {{missingInformation}}
  User Profile: {{{userProfile}}}

  Based on the job description and the missing information, create a concise and professional prompt to the user, asking them to provide the missing information. The prompt should be polite and explain why the information is needed for the job application.

  The prompt should be in the format: "Please provide the following information so that we may properly fill out the application: [list of missing information, comma separated]."

  Do not include any introductory or closing remarks. Only provide the prompt.
  `,
});

const requestMissingInfoFlow = ai.defineFlow(
  {
    name: 'requestMissingInfoFlow',
    inputSchema: RequestMissingInfoInputSchema,
    outputSchema: RequestMissingInfoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
