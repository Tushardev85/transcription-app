import express from 'express';
import { GoHighLevelService } from '../services/gohighlevel.js';
import { ghlConfig } from '../config/gohighlevel.js';

const router = express.Router();
const ghlService = new GoHighLevelService();

/**
 * @route GET /api/transcript/:messageId/location/:locationId
 * @description Get call transcript by message ID and location ID
 * @access Private
 */
router.get('/:messageId/location/:locationId', async (req, res) => {
  try {
    const { messageId } = req.params;
    const { locationId } = req.params;

    console.log(messageId,'------------------------------messageId in transcript api')
    console.log(locationId,'------------------------------locationId in transcript api')
    
    if (!messageId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Message ID is required' 
      });
    }
    
    const transcript = await ghlService.getCallTranscript(messageId, locationId);
    
    return res.status(200).json({
      success: true,
      data: transcript
    });
  } catch (error) {
    console.error('Error in transcript route:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch call transcript'
    });
  }
});

/**
 * @route GET /api/transcript/:messageId/location/:locationId/with-token
 * @description Get call transcript with a custom access token
 * @access Private
 */
router.get('/:messageId/location/:locationId/with-token', async (req, res) => {
  try {
    const { messageId, locationId } = req.params;
    // Check for token in query params or header
    const accessToken = req.query.access_token || req.headers.authorization?.split(' ')[1];
    
    console.log('Request for transcript with custom token');
    console.log('MessageID:', messageId);
    console.log('LocationID:', locationId);
    console.log('Token provided:', accessToken ? 'Yes' : 'No');
    
    if (!messageId || !locationId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Message ID and Location ID are required' 
      });
    }
    
    if (!accessToken) {
      return res.status(400).json({ 
        success: false, 
        message: 'Access token is required in query param access_token or Authorization header' 
      });
    }
    
    // Create a custom axios instance with the provided token
    const customAxios = {
      get: async (url, config = {}) => {
        const axios = (await import('axios')).default;
        return axios.get(`${ghlConfig.baseUrl}${url}`, {
          ...config,
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
      }
    };
    
    // Call the API directly
    try {
      const url = `/conversations/locations/${locationId}/messages/${messageId}/transcription`;
      console.log('Making request to:', ghlConfig.baseUrl + url);
      
      const response = await customAxios.get(url);
      
      return res.status(200).json({
        success: true,
        data: response.data
      });
    } catch (apiError) {
      console.error('API Error:', apiError.message);
      console.error('Response:', apiError.response?.data);
      
      return res.status(apiError.response?.status || 500).json({
        success: false,
        message: apiError.message,
        details: apiError.response?.data
      });
    }
  } catch (error) {
    console.error('Error in transcript route with custom token:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch call transcript'
    });
  }
});

export default router;