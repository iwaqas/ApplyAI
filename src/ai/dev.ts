import { config } from 'dotenv';
config();

import '@/ai/flows/draft-cv-cover-letter.ts';
import '@/ai/flows/profile-import.ts';
import '@/ai/flows/missing-info-request.ts';
import '@/ai/flows/scrape-url.ts';
