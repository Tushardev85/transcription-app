import axios from 'axios';
import { ghlConfig } from '../config/gohighlevel.js';

/**
 * Service for interacting with the Go High Level API
 */
export class GoHighLevelService {
  constructor() {
    this.axios = axios.create({
      baseURL: ghlConfig.baseUrl,
      headers: {
        'Authorization': `Bearer ${ghlConfig.accessToken}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Exchange authorization code for access token
   * @param {string} code - The authorization code from GoHighLevel
   * @returns {Promise<Object>} - The token response data
   */
  async exchangeCodeForToken(code) {
    try {
      if (!code) {
        throw new Error('Authorization code is required');
      }
      
      const params = new URLSearchParams();
      params.append('client_id', ghlConfig.clientId);
      params.append('client_secret', ghlConfig.clientSecret);
      params.append('grant_type', 'authorization_code');
      params.append('code', code);
      params.append('redirect_uri', ghlConfig.redirectUri);
      params.append('user_type', ghlConfig.userType || 'Location');
      
      console.log('Sending token request with params:', Object.fromEntries(params));
      
      const response = await axios.post('https://services.leadconnectorhq.com/oauth/token', 
        params,
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error exchanging code for token:', error.response?.data || error.message);
      throw error;
    }
  }

    /**
   * Get new acess token through refresh token
   * @param {string} refershToken - Get new access token through refresh token
   * @returns {Promise<Object>} - The token response data
   */

    async getAccesToken(refershToken){
      try{
        if (!refershToken){
          throw new Error('Refresh token is required');
        }

        const params = new URLSearchParams();   
        params.append('client_id', ghlConfig.clientId);
        params.append('client_secret', ghlConfig.clientSecret);
        params.append('grant_type', 'refresh_token');
        params.append('refresh_token', refershToken);

        const response = await axios.post('https://services.leadconnectorhq.com/oauth/token', 
        params,
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
      );

      return response.data;

      }catch(error){
        console.error('Error exchanging code for token:', error.response?.data || error.message);
        throw error;
      }
    }

  /**
   * Fetch call transcript from Go High Level
   * @param {string} messageId - ID of the message to fetch transcript for
   * @returns {Promise<Object>} - The call transcript data
   */
  async getCallTranscript(messageId, locationId) {
    try {
      if (!messageId) {
        throw new Error('Message ID is required');
      }

      if (!locationId) {
        throw new Error('Location ID is required');
      }

      console.log('Transcript Request Details:');
      console.log('- Message ID:', messageId);
      console.log('- Location ID:', locationId);
      
      const url = `conversations/locations/${locationId}/messages/${messageId}/transcription`;
      console.log('- API URL:', ghlConfig.baseUrl + url);
      console.log('- Headers:', {
        Version: '2021-04-15',
        Authorization: this.axios.defaults.headers['Authorization']?.substring(0, 20) + '...'
      });
      
      try {
        const response = await this.axios.get(url, {
          transformResponse: [(data) => data], // Return raw data
          headers: {
            'Version': '2021-04-15',
            'Authorization': this.axios.defaults.headers['Authorization']
          }
        });
        
        console.log('API Response:');
        console.log('- Status:', response.status);
        console.log('- Status Text:', response.statusText);


        // Try to parse the JSON response
        try {
          // If it's already an object, return it as is
          if (typeof response.data === 'object') {
            return response.data;
          }

          const parsedData = JSON.parse(response.data);
          console.log('- Parsed Response:', parsedData);
          return parsedData;
        } catch (parseError) {
          console.error('Failed to parse response as JSON:', {
            error: parseError.message,
            rawData: response.data
          });
          return { rawText: response.data };
        }
      } catch (requestError) {
        const errorDetails = {
          message: requestError.message,
          status: requestError.response?.status,
          statusText: requestError.response?.statusText,
          data: requestError.response?.data,
          url: ghlConfig.baseUrl + url,
          headers: requestError.response?.headers
        };

        console.error('API Request Failed:', JSON.stringify(errorDetails, null, 2));

        // Throw a more informative error
        throw new Error(JSON.stringify({
          message: 'Failed to fetch transcript',
          status: errorDetails.status,
          details: typeof errorDetails.data === 'string' ? JSON.parse(errorDetails.data) : errorDetails.data
        }));
      }
    } catch (error) {
      console.error('Transcript Service Error:', {
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

} 