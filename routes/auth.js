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

/**
 * @route POST /api/auth/refresh-token
 * @description Get new access token through refresh token
 * @access Private
 */

router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required'
      });
    }
    const tokenData = await ghlService.getAccesToken(refreshToken);
    return res.status(200).json({
      success: true,
      data: tokenData
    });
  } catch (error) {
    console.error('Error in refresh token:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to refresh access token'
    });
  }
});

export default router; 