import { JARVIS_SYSTEM_PROMPT } from '../constants/prompts';

const GEMINI_API_KEY = 'AIzaSyA6hRBbdkCSzfqM-RCc3YzzQX6vj1TAPN8';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// Conversation history
let conversationHistory = [];

export const askJarvis = async (userMessage) => {
  try {
    // Add user message
    conversationHistory.push({
      role: 'user',
      parts: [{ text: userMessage }],
    });

    // Build request body
    const body = {
      system_instruction: {
        parts: [{ text: JARVIS_SYSTEM_PROMPT }],
      },
      contents: conversationHistory,
      generationConfig: {
        maxOutputTokens: 2048,
        temperature: 0.7,
      },
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text
      || 'I encountered an error, sir.';

    // Save assistant reply to history
    conversationHistory.push({
      role: 'model',
      parts: [{ text: reply }],
    });

    // Keep last 40 messages
    if (conversationHistory.length > 40) {
      conversationHistory = conversationHistory.slice(-40);
    }

    return { success: true, message: reply };

  }  catch (error) {
    console.error('Gemini error full:', JSON.stringify(error), error.message);
    let errorMessage = 'System error. Please try again, sir.';
    if (error.message?.includes('API_KEY_INVALID')) {
      errorMessage = 'Invalid API key, sir.';
    } else if (error.message?.includes('quota')) {
      errorMessage = 'Quota exceeded. Please wait, sir.';
    } else if (error.message?.includes('fetch')) {
      errorMessage = 'Network error. Check your connection, sir.';
    }
    return { success: false, message: errorMessage };
  }
};

export const resetConversation = () => {
  conversationHistory = [];
};

export const getHistory = () => conversationHistory;