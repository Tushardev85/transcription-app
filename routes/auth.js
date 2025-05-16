import express from 'express';
import { GoHighLevelService } from '../services/gohighlevel.js';

const router = express.Router();
const ghlService = new GoHighLevelService();

/**
 * @route GET /api/auth/callback
 * @description Callback endpoint for GoHighLevel OAuth flow
 * @access Public
 */
router.get('/callback', async (req, res) => {
  try {
    const { code } = req.query;

    console.log(code,'------------------------------code')
    
    if (!code) {
      return res.status(400).json({ 
        success: false, 
        message: 'Authorization code is required' 
      });
    }
    
    const tokenData = await ghlService.exchangeCodeForToken(code);
    
    return res.status(200).json({
      success: true,
      data: tokenData
    });
  } catch (error) {
    console.error('Error in OAuth callback:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to exchange authorization code for token'
    });
  }
});

export default router; 