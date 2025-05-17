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
  async getCallTranscript(messageId,locationId) {
    try {
      if (!messageId) {
        throw new Error('Message ID is required');
      }

      if (!locationId) {
        throw new Error('Location ID is required');
      }

      console.log(messageId,'------------------------------messageId in go high level service')
      console.log(locationId,'------------------------------locationId in go high level service')
      
      // Log the full request URL and headers for debugging
      const url = `/conversations/locations/${locationId}/messages/${messageId}/transcription`;
      console.log('Making request to:', ghlConfig.baseUrl + url);
      console.log('Headers:', {
        'Authorization': `Bearer ${ghlConfig.accessToken.substring(0, 10)}...` ,
        'version' : '2021-04-15'
      });
      
      // Using the endpoint from Go High Level documentation: 
      // https://highlevel.stoplight.io/docs/integrations/9f8e2c1696a55-get-transcription-by-message-id
      try {
        const response = await this.axios.get(url, {
          transformResponse: [(data) => {
            // Return the raw data string instead of letting axios parse it
            return data;
          }],
          headers: {
            'version': '2021-04-15'
          }
        });
        
        // Log the raw response for debugging
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        console.log('Raw transcript response:', response.data);

        // Try to parse the JSON response
        try {
          // If it's already an object, return it as is
          if (typeof response.data === 'object') {
            return response.data;
          }
          // Otherwise attempt to parse it
           return JSON.parse(response.data);
        } catch (parseError) {
          console.error('Error parsing transcript response:', parseError);
          // If we can't parse it as JSON, return it as text
          return { rawText: response.data };
        }
      } catch (requestError) {
        console.error('API request error details:', {
          message: requestError.message,
          status: requestError.response?.status,
          statusText: requestError.response?.statusText,
          responseData: requestError.response?.data
        });
        throw requestError;
      }
    } catch (error) {
      console.error('Error fetching call transcript:', error.message);
      throw error;
    }
  }

} 