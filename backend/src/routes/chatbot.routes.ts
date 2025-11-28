import express, { Request, Response } from 'express';
import ChatbotService from '../services/chatbot.service';

const router = express.Router();
const chatbot = new ChatbotService();

// Initialize knowledge base when server starts
chatbot.loadKnowledgeBase().catch(error => {
  console.error('❌ Failed to load knowledge base on startup:', error);
});

// POST /api/chatbot/chat
router.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string' || message.trim() === '') {
      return res.status(400).json({ 
        error: 'Message is required and must be a non-empty string' 
      });
    }

    const response = await chatbot.chat(message.trim());
    
    res.json({ 
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('❌ Chatbot error:', error);
    res.status(500).json({ 
      error: 'Failed to process message. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/chatbot/health
router.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'ok',
    message: 'Chatbot service is running',
    knowledgeBaseLoaded: chatbot.knowledgeBase.length > 0
  });
});

module.exports = router;
