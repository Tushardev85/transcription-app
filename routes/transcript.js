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
    const { messageId, locationId } = req.params;
    const authHeader = req.headers.authorization;

    console.log('Incoming Request:');
    console.log('- Message ID:', messageId);
    console.log('- Location ID:', locationId);
    console.log('- Auth Header:', authHeader ? `${authHeader.substring(0, 20)}...` : 'Not provided');
    
    if (!messageId || !locationId) { 
      return res.status(400).json({ 
        success: false, 
        message: 'Message ID and Location ID are required',
        details: {
          messageId: messageId ? 'provided' : 'missing',
          locationId: locationId ? 'provided' : 'missing'
        }
      });
    }

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Authorization header is required',
        details: {
          provided_headers: Object.keys(req.headers)
        }
      });
    }

    // Set the authorization header for this request
    ghlService.axios.defaults.headers['Authorization'] = authHeader;
    
    const transcript = await ghlService.getCallTranscript(messageId, locationId);
    
    return res.status(200).json({
      success: true,
      data: transcript
    });
  } catch (error) {
    console.error('Transcript Route Error:', {
      message: error.message,
      stack: error.stack
    });

    // Try to parse the error message if it's a JSON string
    let errorDetails;
    try {
      errorDetails = JSON.parse(error.message);
    } catch {
      errorDetails = {
        message: error.message,
        status: 500
      };
    }

    return res.status(errorDetails.status || 500).json({
      success: false,
      message: errorDetails.message || 'Failed to fetch call transcript',
      details: errorDetails.details || error.message
    });
  }
});

// /**
//  * @route GET /api/transcript/:messageId/location/:locationId/with-token
//  * @description Get call transcript with a custom access token
//  * @access Private
//  */
// router.get('/:messageId/location/:locationId/with-token', async (req, res) => {
//   try {
//     const { messageId, locationId } = req.params;
//     // Check for token in query params or header
//     const accessToken = req.query.access_token || req.headers.authorization?.split(' ')[1];
    
//     console.log('Request for transcript with custom token');
//     console.log('MessageID:', messageId);
//     console.log('LocationID:', locationId);
//     console.log('Token provided:', accessToken ? 'Yes' : 'No');
    
//     if (!messageId || !locationId) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'Message ID and Location ID are required' 
//       });
//     }
    
//     if (!accessToken) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'Access token is required in query param access_token or Authorization header' 
//       });
//     }
    
//     // Create a custom axios instance with the provided token
//     const customAxios = {
//       get: async (url, config = {}) => {
//         const axios = (await import('axios')).default;
//         return axios.get(`${ghlConfig.baseUrl}${url}`, {
//           ...config,
//           headers: {
//             'Authorization': `Bearer ${accessToken}`,
//             'Content-Type': 'application/json',
//             'version': '2021-04-15'
//           }
//         });
//       }
//     };
    
//     // Call the API directly
//     try {
//       const url = `/conversations/locations/${locationId}/messages/${messageId}/transcription`;
//       console.log('Making request to:', ghlConfig.baseUrl + url);
      
//       const response = await customAxios.get(url);
      
//       return res.status(200).json({
//         success: true,
//         data: response.data
//       });
//     } catch (apiError) {
//       console.error('API Error:', apiError.message);
//       console.error('Response:', apiError.response?.data);
      
//       return res.status(apiError.response?.status || 500).json({
//         success: false,
//         message: apiError.message,
//         details: apiError.response?.data
//       });
//     }
//   } catch (error) {
//     console.error('Error in transcript route with custom token:', error);
//     return res.status(500).json({
//       success: false,
//       message: error.message || 'Failed to fetch call transcript'
//     });
//   }
// });

/**
 * @route POST /api/transcript/webhook
 * @description Webhook endpoint to receive events from Go High Level
 * @access Public
 */
router.post('/webhook', async (req, res) => {
   try {
    // Log the incoming webhook data
    console.log('Received webhook event:', {
      headers: req.headers,
      body: req.body,
      timestamp: new Date().toISOString()
    });

    // Verify the webhook signature if provided
    const signature = req.headers['x-ghl-signature'];
    if (signature) {
      // TODO: Implement signature verification if needed
      console.log('Webhook signature:', signature);
    }

    // Process the webhook data
    const eventData = req.body;
    
    console.log(eventData,'------------------------------eventData in transcript api');
    console.log(eventData.messageType === 'CALL','------------------------------eventData.body type call in transcript api');

    // Only process if the message type is CALL
    if (eventData.messageType === 'CALL') {
      const messageId = eventData.messageId;
      const locationId = eventData.locationId;

      console.log(`Found CALL message - MessageID: ${messageId}, LocationID: ${locationId}`);

      if (messageId && locationId) {
        // Send an immediate acknowledgment response
        res.status(200).json({
          success: true,
          message: 'Webhook received, transcript processing initiated',
          data: {
            messageType: 'CALL',
            messageId,
            locationId
          }
        });

        // Process transcript in the background with retries
        const maxRetries = 3;
        const retryDelay = 10000; // 10 seconds

        const fetchTranscriptWithRetry = async (attempt = 1) => {
          try {
            console.log(`Attempting to fetch transcript (attempt ${attempt}/${maxRetries}) for messageId: ${messageId}`);
            const transcript = await ghlService.getCallTranscript(messageId, locationId);
            
            if (transcript && Array.isArray(transcript) && transcript.length > 0) {
              console.log('Successfully fetched transcript:', transcript);
              // Here you could store the transcript or process it further
            } else if (attempt < maxRetries) {
              console.log(`Empty transcript received, retrying in ${retryDelay/1000} seconds...`);
              await new Promise(resolve => setTimeout(resolve, retryDelay));
              return fetchTranscriptWithRetry(attempt + 1);
            } else {
              console.log('Max retries reached, no transcript available');
            }
          } catch (error) {
            console.error('Error fetching transcript:', error);
            if (attempt < maxRetries) {
              console.log(`Retry attempt ${attempt + 1} in ${retryDelay/1000} seconds...`);
              await new Promise(resolve => setTimeout(resolve, retryDelay));
              return fetchTranscriptWithRetry(attempt + 1);
            }
          }
        };

        // Start the background processing
        fetchTranscriptWithRetry().catch(error => {
          console.error('Background transcript processing failed:', error);
        });

        return;
      }
      
      return res.status(200).json({
        success: false,
        message: 'Missing messageId or locationId for CALL message'
      });
    }

    // If not a CALL message or missing required data, just acknowledge
    return res.status(200).json({
      success: true,
      message: 'Webhook received successfully (non-CALL message)'
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({
      success: false,
      message: 'Error processing webhook'
    });
  }
});

export default router;