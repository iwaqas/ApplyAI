'use server';
/**
 * @fileOverview A flow for scraping content from a URL.
 *
 * - scrapeUrl - A function that takes a URL and returns its text content.
 * - ScrapeUrlInput - The input type for the scrapeUrl function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import * as cheerio from 'cheerio';

const ScrapeUrlInputSchema = z.object({
  url: z.string().url().describe('The URL to scrape.'),
});
export type ScrapeUrlInput = z.infer<typeof ScrapeUrlInputSchema>;

export async function scrapeUrl(input: ScrapeUrlInput): Promise<string> {
  return scrapeUrlFlow(input);
}

const scrapeUrlFlow = ai.defineFlow(
  {
    name: 'scrapeUrlFlow',
    inputSchema: ScrapeUrlInputSchema,
    outputSchema: z.string(),
  },
  async ({url}) => {
    try {
      const response = await fetch(url, {
        headers: {
          // A generic user agent can sometimes help bypass simple anti-scraping measures.
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
      }
      
      const html = await response.text();
      const $ = cheerio.load(html);

      // Remove script and style tags to clean up the content
      $('script, style, noscript, svg').remove();
      
      // Select the main content area of a typical LinkedIn profile.
      // This is a bit fragile and might need updates if LinkedIn changes its structure.
      const mainContent = $('main').text();

      // Fallback to body if main isn't found
      const bodyContent = mainContent || $('body').text();
      
      // Clean up the text by removing excessive whitespace and newlines
      const cleanedText = bodyContent.replace(/\s\s+/g, ' ').replace(/\n+/g, '\n').trim();

      return cleanedText;
    } catch (error) {
      console.error(`Error scraping URL ${url}:`, error);
      throw new Error(`Could not scrape the URL. It might be down or blocking requests. Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
);
