import express from 'express';
import { GoHighLevelService } from '../services/gohighlevel.js';

const router = express.Router();
const ghlService = new GoHighLevelService();

/**
 * @route GET /api/transcript/:messageId
 * @description Get call transcript by message ID
 * @access Private
 */
router.get('/:messageId', async (req, res) => {
  try {
    const { messageId } = req.params;
    
    if (!messageId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Message ID is required' 
      });
    }
    
    const transcript = await ghlService.getCallTranscript(messageId);
    
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

export default router;