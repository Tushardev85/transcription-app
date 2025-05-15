import dotenv from 'dotenv';

dotenv.config();

export const ghlConfig = {
  apiKey: process.env.GO_HIGH_LEVEL_API_KEY || '',
  accessToken: process.env.GO_HIGH_LEVEL_ACCESS_TOKEN || '',
  baseUrl: process.env.GO_HIGH_LEVEL_BASE_URL || 'https://api.gohighlevel.com'
}; 