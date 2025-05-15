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
   * Fetch call transcript from Go High Level
   * @param {string} messageId - ID of the message to fetch transcript for
   * @returns {Promise<Object>} - The call transcript data
   */
  async getCallTranscript(messageId) {
    try {
      if (!messageId) {
        throw new Error('Message ID is required');
      }
      
      // Using the endpoint from Go High Level documentation: 
      // https://highlevel.stoplight.io/docs/integrations/9f8e2c1696a55-get-transcription-by-message-id
      const response = await this.axios.get(`/integrations/api/v1/messages/${messageId}/transcription`);
      return response.data;
    } catch (error) {
      console.error('Error fetching call transcript:', error.message);
      throw error;
    }
  }
} 