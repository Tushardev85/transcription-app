import dotenv from 'dotenv';

dotenv.config();

export const ghlConfig = {
  apiKey: process.env.GO_HIGH_LEVEL_API_KEY || '',
  accessToken: process.env.GO_HIGH_LEVEL_ACCESS_TOKEN || '',
  baseUrl: process.env.GO_HIGH_LEVEL_BASE_URL || 'https://services.leadconnectorhq.com/',
  clientId: process.env.GO_HIGH_LEVEL_CLIENT_ID || '',
  clientSecret: process.env.GO_HIGH_LEVEL_CLIENT_SECRET || '',
  redirectUri: process.env.GO_HIGH_LEVEL_REDIRECT_URI || 'https://qw6jptxx-8000.inc1.devtunnels.ms/api/auth/callback',
  userType: process.env.GO_HIGH_LEVEL_USER_TYPE || 'Location'
}; 