import axios from 'axios';
import { JARVIS_SYSTEM_PROMPT } from '../constants/prompts';

// ── Replace with your actual Anthropic API key ──
const ANTHROPIC_API_KEY = 'your-api-key-here';
const API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-opus-4-5';
const MAX_TOKENS = 2048;

// Keeps full conversation history for memory
let conversationHistory = [];

export const askJarvis = async (userMessage) => {
  try {
    // Add user message to history
    conversationHistory.push({
      role: 'user',
      content: userMessage,
    });

    const response = await axios.post(
      API_URL,
      {
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: JARVIS_SYSTEM_PROMPT,
        messages: conversationHistory,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
      }
    );

    const reply = response.data.content[0]?.text || 
      'I seem to have encountered an error, sir.';

    // Add JARVIS reply to history so it remembers
    conversationHistory.push({
      role: 'assistant',
      content: reply,
    });

    // Keep last 40 messages max to avoid token overflow
    if (conversationHistory.length > 40) {
      conversationHistory = conversationHistory.slice(-40);
    }

    return { success: true, message: reply };

  } catch (error) {
    const status = error?.response?.status;
    let errorMessage = 'System error. Please try again, sir.';

    if (status === 401) errorMessage = 'Invalid API key, sir. Please check your credentials.';
    else if (status === 429) errorMessage = 'Rate limit reached. Give me a moment, sir.';
    else if (status === 500) errorMessage = 'Anthropic servers are down. Try again shortly.';

    return { success: false, message: errorMessage };
  }
};

// Call this to wipe memory and start fresh
export const resetConversation = () => {
  conversationHistory = [];
};

// Get current history (useful for displaying chat)
export const getHistory = () => conversationHistory;