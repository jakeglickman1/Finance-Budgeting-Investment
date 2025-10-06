import { APP_CONFIG, AI_RESPONSES, STORAGE_KEYS, DATE_FORMAT } from './constants.js';
import { formatCurrency, formatDate, generateId, getRandomItem, sleep, safeJsonParse, safeJsonStringify } from './utils.js';

/**
 * AI Financial Assistant Module
 * Handles AI chat functionality, API integration, and financial context
 * Enhanced with real-time market data and Gemini AI integration
 */

class AIAssistant {
  constructor() {
    this.config = {
      ...APP_CONFIG.api, // Use API config from constants
      geminiApiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
      maxMessagesHistory: APP_CONFIG.ui.chatHistoryLimit, // Use chat history limit from constants
      apiKey: null // This should ideally be loaded securely from an environment variable or backend
    };

    this.elements = {};
    this.messageHistory = safeJsonParse(localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY), []);
    this.isInitialized = false;
    this.isTyping = false;
    this.financialData = null;

    // Initialize API key if available in a global variable or through other means
    if (window.FINANCEPRO_API_KEY) {
      this.config.apiKey = window.FINANCEPRO_API_KEY;
    } else {
      // Try loading from local storage
      this.config.apiKey = localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY);
    }

    this.init();
  }

  /**
   * Initialize AI Assistant
   */
  init() {
    if (this.isInitialized) return;

    this.cacheElements();
    this.loadApiKey();
    this.attachEventListeners();
    this.renderChatHistory(); // Render history on init
    this.updateStatus();

    this.isInitialized = true;
  }

  /**
   * Cache DOM elements for performance
   */
  cacheElements() {
    this.elements = {
      chatInput: document.getElementById('ai-message-input'),
      sendButton: document.querySelector('.send-button'),
      clearButton: document.getElementById('clear-chat-btn'),
      chatMessages: document.getElementById('chat-messages'),
      chatForm: document.getElementById('ai-chat-form'),
      suggestionChips: document.querySelectorAll('.suggestion-chip'),
      apiKeyInput: document.getElementById('gemini-api-key'),
      saveApiKeyButton: document.getElementById('save-api-key'),
      apiKeySetup: document.getElementById('api-key-setup'),
      aiStatus: document.getElementById('ai-status')
    };
  }

  /**
   * Load saved API key from localStorage
   */
  loadApiKey() {
    const savedApiKey = localStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY);
    if (savedApiKey) {
      this.config.apiKey = savedApiKey;
      if (this.elements.apiKeyInput) {
        this.elements.apiKeyInput.value = savedApiKey;
      }
      if (this.elements.apiKeySetup) {
        this.elements.apiKeySetup.style.display = 'none';
      }
    } else if (this.elements.apiKeySetup) {
      this.elements.apiKeySetup.style.display = 'flex'; // Show setup if no key
    }
    this.updateSendButton();
  }

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Chat form submission
    if (this.elements.chatForm) {
      this.elements.chatForm.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    // Chat input events
    if (this.elements.chatInput && this.elements.sendButton) {
      this.elements.chatInput.addEventListener('input', () => this.updateSendButton());
      this.elements.chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.handleSubmit(e);
        }
      });
    }

    // Clear chat button
    if (this.elements.clearButton) {
      this.elements.clearButton.addEventListener('click', () => this.clearChatHistory());
    }

    // Suggestion chips
    this.elements.suggestionChips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        const suggestion = e.target.getAttribute('data-suggestion');
        if (suggestion) {
          this.sendMessage(suggestion);
        }
      });
    });

    // API key setup
    if (this.elements.saveApiKeyButton && this.elements.apiKeyInput) {
      this.elements.saveApiKeyButton.addEventListener('click', () => this.saveApiKey());
      this.elements.apiKeyInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.saveApiKey();
      });
    }
  }

  /**
   * Handle form submission
   */
  handleSubmit(e) {
    e.preventDefault();
    const message = this.elements.chatInput.value.trim();

    if (message) {
      this.sendMessage(message);
      this.elements.chatInput.value = '';
      this.updateSendButton();
    }
  }

  /**
   * Save API key
   */
  saveApiKey() {
    if (!this.elements.apiKeyInput) return;

    const apiKey = this.elements.apiKeyInput.value.trim();
    if (apiKey) {
      this.config.apiKey = apiKey;
      localStorage.setItem(STORAGE_KEYS.GEMINI_API_KEY, apiKey);

      if (this.elements.apiKeySetup) {
        this.elements.apiKeySetup.style.display = 'none';
      }

      this.updateStatus(AI_RESPONSES.STATUS_READY);
      this.showNotification(AI_RESPONSES.API_KEY_SAVED, 'success');
      this.updateSendButton();
    }
  }

  /**
   * Send message to AI
   */
  async sendMessage(message) {
    if (!message.trim()) return;

    this.addMessage(message, 'user');
    this.showTypingIndicator();

    try {
      const [financialContext, marketData] = await Promise.all([
        this.getFinancialContext(),
        window.MarketDataService ? window.MarketDataService.getRelevantMarketData(message) : null
      ]);

      const response = await this.generateResponse(message, financialContext, marketData);

      this.hideTypingIndicator();
      this.addMessage(response, 'ai');

      // No need for updateMessageHistory here as addMessage handles it now

    } catch (error) {
      console.error('AI Assistant Error:', error);
      this.hideTypingIndicator();
      this.addMessage(AI_RESPONSES.GENERIC_ERROR + " " + getRandomItem(AI_RESPONSES.GENERAL_ADVICE), 'ai');
    }
  }

  /**
   * Add message to chat
   */
  addMessage(content, sender, save = true) {
    const chatMessages = this.elements.chatMessages;
    if (!chatMessages) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `${sender}-message`;
    
    const time = formatDate(new Date(), DATE_FORMAT.time); // Use DATE_FORMAT constant
    
    messageDiv.innerHTML = `
      <div class="message-avatar">
        ${sender === 'ai' ? this.getAIIcon() : this.getUserIcon()}
      </div>
      <div class="message-content">
        <div class="message-header">
          <span class="message-sender">${sender === 'ai' ? 'AI Assistant' : 'You'}</span>
          <span class="message-time">${time}</span>
        </div>
        <div class="message-text">${this.formatMessage(content)}</div>
      </div>
    `;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Save to chat history
    if (save) {
      this.messageHistory.push({ content, sender, timestamp: new Date().toISOString() });
      localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, safeJsonStringify(this.messageHistory));
    }
  }

  /**
   * Format message content
   */
  formatMessage(message) {
    return message
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener" class="text-primary hover:underline">$1</a>');
  }

  /**
   * Show typing indicator
   */
  showTypingIndicator() {
    if (!this.elements.chatMessages) return;

    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typing-indicator';
    typingDiv.innerHTML = `
      <div class="message-avatar">
        ${this.getAIIcon()}
      </div>
      <div class="typing-dots">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;

    this.elements.chatMessages.appendChild(typingDiv);
    this.elements.chatMessages.scrollTop = this.elements.chatMessages.scrollHeight; // Direct scroll
    this.isTyping = true;
  }

  /**
   * Hide typing indicator
   */
  hideTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
    this.isTyping = false;
  }

  /**
   * Update send button state
   */
  updateSendButton() {
    if (!this.elements.chatInput || !this.elements.sendButton) return;

    const hasText = this.elements.chatInput.value.trim().length > 0;
    this.elements.sendButton.disabled = !hasText || this.isTyping || !this.config.apiKey;
  }

  /**
   * Get financial context from the application
   */
  getFinancialContext() {
    // Try to get data from the data manager if available
    let context = {
      income: {
        annual: 0,
        netMonthly: 0,
      },
      expenses: 0,
      savings: 0,
      debt: 0,
      goals: []
    };

    if (window.dataManager) {
      const data = window.dataManager.getData();
      context = {
        income: {
          annual: data.income?.annualIncome || 0,
          netMonthly: data.income?.netMonthly || 0,
        },
        expenses: data.expenses || 0,
        savings: data.savings || 0,
        debt: data.debt || 0,
        goals: data.goals || []
      };
    }

    return context;
  }

  /**
   * Generate AI response (orchestrates API call and formatting)
   */
  async generateResponse(userMessage, financialContext, marketData) {
    if (!this.config.apiKey) {
      return AI_RESPONSES.API_KEY_MISSING + " " + getRandomItem(AI_RESPONSES.GENERAL_ADVICE);
    }

    try {
      const prompt = this.buildPrompt(userMessage, financialContext, marketData);
      const rawResponse = await this.callGeminiAPI(prompt);
      // Gemini's rawResponse should be the primary source of advice
      return this.formatAIResponse(rawResponse, marketData);
    } catch (error) {
      console.error('AI Response Error:', error);
      return AI_RESPONSES.SERVER_ERROR + " " + getRandomItem(AI_RESPONSES.GENERAL_ADVICE);
    }
  }

  /**
   * Build context-aware prompt
   */
  buildPrompt(userMessage, financialContext, marketData) {
    let systemPrompt = `You are a helpful financial advisor AI assistant. Provide accurate, personalized financial advice.\n\nUser's Financial Context:`;

    if (financialContext.income) {
      systemPrompt += `\n- Annual Income: ${formatCurrency(financialContext.income.annual)}`;
      systemPrompt += `\n- Monthly Net Income: ${formatCurrency(financialContext.income.netMonthly)}`;
    }

    if (financialContext.budget) {
      systemPrompt += `\n- Budget Information: Available`; // More detailed budget info could be added here
    }

    if (financialContext.emergency) {
      systemPrompt += `\n- Emergency Fund: ${formatCurrency(financialContext.emergency.savings || 0)} (Target: ${formatCurrency(financialContext.emergency.targetAmount || 0)})`;
    }

    if (financialContext.goals && financialContext.goals.length > 0) {
      systemPrompt += `\n- Goals: ${financialContext.goals.map(g => `${g.name} (${formatCurrency(g.current)}/${formatCurrency(g.amount)})`).join(', ')}`; // Assuming goals have name, current, and amount
    }

    if (marketData && Object.keys(marketData).length > 0) {
      systemPrompt += `\n\nCurrent Market Data:`;
      Object.entries(marketData).forEach(([key, data]) => {
        if (data) {
          const changeSymbol = data.changePercent >= 0 ? '+' : '';
          systemPrompt += `\n- **${data.symbol}**: ${formatCurrency(data.price || 0)} (${changeSymbol}${data.changePercent?.toFixed(2)}%)`;
        }
      });
    }

    systemPrompt += `\n\nProvide helpful, specific advice. Keep responses under ${APP_CONFIG.ai.maxResponseWords || 200} words unless detailed explanation is needed. Use bullet points when appropriate.`;

    return `${systemPrompt}\n\nUser Question: ${userMessage}`;
  }

  /**
   * Call Gemini API
   */
  async callGeminiAPI(prompt) {
    const response = await fetch(`${this.config.geminiApiUrl}?key=${this.config.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();

    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }

    throw new Error('Invalid API response format');
  }

  /**
   * Format AI response with market data (no longer generating advice here, just appending market data if relevant)
   */
  formatAIResponse(response, marketData) {
    let finalResponse = response;
    if (marketData && Object.keys(marketData).length > 0) {
      finalResponse += this.formatMarketDataDisplay(marketData);
    }
    return finalResponse;
  }

  /**
   * Format market data for display
   */
  formatMarketDataDisplay(marketData) {
    let display = `\n\n**Current Market Snapshot:**\n`;

    Object.entries(marketData).forEach(([key, data]) => {
      if (data) {
        const changeSymbol = data.changePercent >= 0 ? '+' : '';
        display += `\n• **${data.symbol}**: ${formatCurrency(data.price || 0)} (${changeSymbol}${data.changePercent?.toFixed(2)}%)`;
      }
    });

    return display;
  }

  /**
   * Get general financial advice (now uses constants)
   */
  getGeneralAdvice(message, financialContext) {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('budget') || lowerMessage.includes('spending')) {
      return getRandomItem(AI_RESPONSES.BUDGET_ADVICE);
    }

    if (lowerMessage.includes('invest') || lowerMessage.includes('stock') || lowerMessage.includes('portfolio')) {
      return getRandomItem(AI_RESPONSES.INVESTMENT_ADVICE);
    }

    if (lowerMessage.includes('debt') || lowerMessage.includes('pay off') || lowerMessage.includes('loan')) {
      return getRandomItem(AI_RESPONSES.DEBT_ADVICE);
    }

    if (lowerMessage.includes('emergency') || lowerMessage.includes('savings') || lowerMessage.includes('fund')) {
      return getRandomItem(AI_RESPONSES.EMERGENCY_FUND_ADVICE);
    }

    if (lowerMessage.includes('goal') || lowerMessage.includes('save') || lowerMessage.includes('target')) {
      return getRandomItem(AI_RESPONSES.GOALS_ADVICE);
    }

    if (lowerMessage.includes('tax') || lowerMessage.includes('deduction') || lowerMessage.includes('refund')) {
      return getRandomItem(AI_RESPONSES.TAX_ADVICE);
    }

    return getRandomItem(AI_RESPONSES.GENERAL_ADVICE);
  }

  /**
   * Update status indicator
   */
  updateStatus(status = null) {
    if (!this.elements.aiStatus) return;

    if (status) {
      this.elements.aiStatus.textContent = status;
    } else {
      this.elements.aiStatus.textContent = this.config.apiKey ? AI_RESPONSES.STATUS_READY : AI_RESPONSES.STATUS_SETUP_REQUIRED;
    }
  }

  /**
   * Show notification (delegated to dataManager if available)
   */
  showNotification(message, type) {
    if (window.dataManager && typeof window.dataManager.showNotification === 'function') {
      window.dataManager.showNotification(message, type);
    } else {
      console.warn(`Notification: ${message} (Type: ${type}) - Data Manager not available`);
    }
  }

  /**
   * Get AI icon SVG
   */
  getAIIcon() {
    return `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
    </svg>`;
  }

  /**
   * Get user icon SVG
   */
  getUserIcon() {
    return `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>`;
  }
}

// Global AI Assistant instance
let aiAssistant = null;

// Initialize when DOM is ready
function initializeAIAssistant() {
  if (!aiAssistant) {
    aiAssistant = new AIAssistant();
  }
}

// Auto-initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAIAssistant);
} else {
  initializeAIAssistant();
}