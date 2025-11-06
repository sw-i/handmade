const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemInstruction = `You are a helpful assistant for the Handmade Hub platform. 
Assist home-based entrepreneurs and vendors with product listings, order management, event participation, and business analytics. 
Provide clear, step-by-step guidance while maintaining user privacy and data security. 
Keep responses concise and professional.`;

// @desc    Chat with AI assistant
// @route   POST /api/chat
// @access  Public
exports.chat = async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        message: 'AI service is not configured. Please contact support.' 
      });
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      systemInstruction: systemInstruction
    });

    // Build chat history - ensure it starts with user role
    const history = [];
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationHistory.forEach((msg, index) => {
        // Skip if first message is not from user
        if (index === 0 && msg.role !== 'user') return;
        
        history.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        });
      });
    }

    // Start chat with history
    const chat = model.startChat({ history });

    // Set headers for streaming
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Send message and stream response
    const result = await chat.sendMessageStream(message);

    // Stream the response chunks
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      if (chunkText) {
        res.write(chunkText);
      }
    }

    res.end();
  } catch (error) {
    console.error('Chat error:', error);
    
    // If streaming hasn't started, send JSON error
    if (!res.headersSent) {
      res.status(500).json({ 
        message: 'Failed to get AI response. Please try again.',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    } else {
      // If streaming started, just end the response
      res.end();
    }
  }
};

// @desc    Chat with AI assistant (non-streaming for simpler clients)
// @route   POST /api/chat/simple
// @access  Public
exports.chatSimple = async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ 
        message: 'AI service is not configured. Please contact support.' 
      });
    }

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      systemInstruction: systemInstruction
    });

    // Build chat history - ensure it starts with user role
    const history = [];
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationHistory.forEach((msg, index) => {
        // Skip if first message is not from user
        if (index === 0 && msg.role !== 'user') return;
        
        history.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        });
      });
    }

    // Start chat with history
    const chat = model.startChat({ history });

    // Send message and get response
    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    res.json({ 
      response: responseText,
      success: true
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      message: 'Failed to get AI response. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
