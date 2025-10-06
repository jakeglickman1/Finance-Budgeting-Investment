/**
 * Application Constants
 * Centralized configuration and constants for the FinancePro application
 */

export const APP_CONFIG = {
  name: 'FinancePro',
  version: '2.0.0',
  description: 'Smart financial planning & investment guidance',
  author: 'FinancePro Team',
  
  // API Configuration
  api: {
    timeout: 10000,
    retryAttempts: 3,
    baseUrl: 'https://api.example.com'
  },
  
  // Storage Configuration
  storage: {
    prefix: 'financepro_',
    version: '1.0',
    maxHistoryItems: 50
  },
  
  // UI Configuration
  ui: {
    animationDuration: 300,
    debounceDelay: 500,
    maxSuggestions: 5,
    chatHistoryLimit: 100
  },
  
  // Financial Configuration
  financial: {
    defaultTaxYear: 2024,
    maxInvestmentYears: 100,
    minEmergencyFundMonths: 3,
    maxEmergencyFundMonths: 12,
    defaultReturnRate: 7.0,
    inflationRate: 3.0
  },
  // AI specific configurations
  ai: {
    maxResponseWords: 200,
    mockResponseDelay: 1000 // In milliseconds
  }
};

export const TAX_BRACKETS_2024 = [
  { min: 0, max: 11000, rate: 0.10 },
  { min: 11000, max: 44725, rate: 0.12 },
  { min: 44725, max: 95375, rate: 0.22 },
  { min: 95375, max: 182050, rate: 0.24 },
  { min: 182050, max: 231250, rate: 0.32 },
  { min: 231250, max: 578125, rate: 0.35 },
  { min: 578125, max: Infinity, rate: 0.37 }
];

export const STATE_TAX_RATES = {
  'AL': 0.05, 'AR': 0.049, 'AZ': 0.025, 'CA': 0.07, 'CO': 0.044, 
  'CT': 0.05, 'DC': 0.06, 'DE': 0.052, 'GA': 0.047, 'HI': 0.07, 
  'IA': 0.05, 'ID': 0.056, 'IL': 0.0495, 'IN': 0.0315, 'KS': 0.052, 
  'KY': 0.045, 'LA': 0.045, 'MA': 0.05, 'MD': 0.055, 'ME': 0.058,
  'MI': 0.0425, 'MN': 0.058, 'MO': 0.048, 'MS': 0.05, 'MT': 0.055, 
  'NC': 0.0475, 'ND': 0.02, 'NE': 0.05, 'NJ': 0.055, 'NM': 0.049, 
  'NY': 0.058, 'OH': 0.0275, 'OK': 0.0475, 'OR': 0.075, 'PA': 0.0307, 
  'RI': 0.05, 'SC': 0.053, 'UT': 0.0465, 'VA': 0.05, 'VT': 0.06, 
  'WI': 0.053, 'WV': 0.05
};

export const NO_TAX_STATES = new Set(['AK', 'FL', 'NV', 'NH', 'SD', 'TN', 'TX', 'WA', 'WY']);

export const EXPENSE_CATEGORIES = [
  'Housing',
  'Transportation', 
  'Food',
  'Utilities',
  'Insurance',
  'Healthcare',
  'Entertainment',
  'Personal Care',
  'Education',
  'Savings',
  'Debt Payment',
  'Other'
];

export const INVESTMENT_TYPES = [
  'Stocks',
  'Bonds',
  'Mutual Funds',
  'ETFs',
  'Real Estate',
  'Commodities',
  'Cryptocurrency',
  'Savings Account',
  'CDs',
  'Treasury Bills'
];

export const GOAL_PRIORITIES = {
  HIGH: 'high',
  MEDIUM: 'medium', 
  LOW: 'low'
};

export const GOAL_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  PAUSED: 'paused'
};

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

export const THEME_MODES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

export const CURRENCY_FORMAT = {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
};

export const DATE_FORMAT = {
  short: { year: 'numeric', month: 'short', day: 'numeric' },
  long: { year: 'numeric', month: 'long', day: 'numeric' },
  time: { hour: '2-digit', minute: '2-digit' }
};

export const VALIDATION_RULES = {
  required: (value) => value !== null && value !== undefined && value !== '',
  min: (value, min) => Number(value) >= min,
  max: (value, max) => Number(value) <= max,
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  phone: (value) => /^[\+]?[1-9][\d]{0,15}$/.test(value),
  zipCode: (value) => /^\d{5}(-\d{4})?$/.test(value),
  ssn: (value) => /^\d{3}-?\d{2}-?\d{4}$/.test(value)
};

export const ERROR_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_ZIP: 'Please enter a valid ZIP code',
  INVALID_SSN: 'Please enter a valid Social Security Number',
  MIN_VALUE: (min) => `Value must be at least ${min}`,
  MAX_VALUE: (max) => `Value must be no more than ${max}`,
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.'
};

export const SUCCESS_MESSAGES = {
  SAVED: 'Data saved successfully',
  UPDATED: 'Data updated successfully',
  DELETED: 'Item deleted successfully',
  CALCULATED: 'Calculation completed successfully',
  GOAL_ADDED: 'Goal added successfully',
  GOAL_UPDATED: 'Goal updated successfully',
  GOAL_COMPLETED: 'Congratulations! Goal completed!'
};

export const AI_RESPONSES = {
  API_KEY_MISSING: "I can't connect to the AI service without an API key. Please set it up in the settings.",
  API_KEY_SAVED: "Gemini API key saved successfully! You can now ask me questions.",
  GENERIC_ERROR: "I apologize, but I encountered an error. Please try again or check your API key.",
  SERVER_ERROR: "I'm having trouble connecting to the AI service right now. Please try again later.",
  NETWORK_ERROR: "It seems there's a network issue. Please check your internet connection.",
  FALLBACK_ERROR: "I'm having trouble connecting to the AI service right now.",
  STATUS_READY: 'Ready',
  STATUS_SETUP_REQUIRED: 'Setup Required',
  GREETING: "Hello! I'm your AI financial assistant. I can help you with:\n\n• Budget planning and optimization\n• Investment strategies and recommendations\n• Debt payoff strategies\n• Emergency fund planning\n• Financial goal setting\n• Tax planning basics\n\nWhat would you like to know about your finances?",
  BUDGET_ADVICE: [
    "Here's a solid budgeting strategy: Follow the 50/30/20 rule - 50% for needs (rent, utilities, groceries), 30% for wants (entertainment, dining), and 20% for savings and debt repayment.",
    "To create an effective budget, start by tracking all your expenses for one month. Categorize them and identify areas where you can cut back. Even small changes can make a big difference!",
    "Consider using the envelope method for discretionary spending. Allocate cash for different categories and when it's gone, it's gone. This helps prevent overspending.",
    "A good budget should include: fixed expenses (rent, insurance), variable expenses (groceries, utilities), savings goals, and an emergency fund contribution."
  ],
  INVESTMENT_ADVICE: [
    "Start with low-cost index funds or ETFs. They provide broad market exposure with minimal fees. Consider a target-date fund if you're unsure about asset allocation.",
    "The key to successful investing is time in the market, not timing the market. Start early, invest consistently, and stay the course during market volatility.",
    "Diversification is crucial. Don't put all your eggs in one basket. Consider a mix of stocks, bonds, and other assets based on your risk tolerance and timeline.",
    "Before investing, make sure you have an emergency fund (3-6 months of expenses) and are contributing to any employer 401(k) match - that's free money!"
  ],
  DEBT_ADVICE: [
    "Two popular debt payoff strategies: 1) Debt avalanche - pay minimums on all debts, then put extra money toward the highest interest rate debt. 2) Debt snowball - pay off smallest debts first for psychological wins.",
    "Consider debt consolidation if you have multiple high-interest debts. A personal loan or balance transfer card with 0% APR can help you pay off debt faster.",
    "Stop using credit cards while paying off debt. Cut them up or freeze them in ice. Focus on paying more than the minimum payment each month.",
    "If you're struggling with debt, contact your creditors. Many offer hardship programs, payment plans, or even debt settlement options."
  ],
  EMERGENCY_FUND_ADVICE: [
    "Aim for 3-6 months of essential expenses in your emergency fund. If you have a stable job, 3 months is fine. If your income is variable, aim for 6-12 months.",
    "Start small with your emergency fund - even $500 can help with unexpected car repairs or medical bills. Build it up gradually by setting up automatic transfers.",
    "Keep your emergency fund in a high-yield savings account or money market account. It should be easily accessible but separate from your checking account.",
    "Only use your emergency fund for true emergencies: job loss, major medical expenses, or urgent home/car repairs. Not for vacations or shopping!"
  ],
  GOALS_ADVICE: [
    "Set SMART financial goals: Specific, Measurable, Achievable, Relevant, and Time-bound. For example: 'Save $10,000 for a house down payment in 2 years.'",
    "Break large goals into smaller milestones. If you want to save $12,000 in a year, that's $1,000 per month or about $33 per day. Track your progress monthly.",
    "Prioritize your goals. Focus on high-priority items like emergency fund and retirement before saving for wants like vacations or luxury items.",
    "Use the 'pay yourself first' principle. Set up automatic transfers to your savings goals before you have a chance to spend the money elsewhere."
  ],
  TAX_ADVICE: [
    "Maximize your 401(k) contributions to reduce taxable income. In 2024, you can contribute up to $23,000 (or $30,500 if 50+).",
    "Consider contributing to an IRA for additional tax benefits. Traditional IRAs offer tax-deferred growth, while Roth IRAs provide tax-free withdrawals in retirement.",
    "Keep detailed records of all deductible expenses: charitable donations, medical expenses, business expenses, and home office costs.",
    "Don't forget about tax credits like the Earned Income Tax Credit, Child Tax Credit, or education credits. These can significantly reduce your tax bill."
  ],
  GENERAL_ADVICE: [
    "Great question! Financial success comes from consistent habits: spend less than you earn, save regularly, invest for the long term, and avoid high-interest debt.",
    "The most important financial habit is living below your means. Even if you earn a lot, spending more than you make will lead to financial stress.",
    "Start with the basics: build an emergency fund, pay off high-interest debt, and contribute to retirement accounts. These three steps will put you on solid financial ground.",
    "Remember, personal finance is personal. What works for others might not work for you. Focus on your own goals, timeline, and risk tolerance.",
    "Consider working with a financial advisor for complex situations, but you can handle most financial planning yourself with education and discipline."
  ]
};

export const CHART_COLORS = {
  primary: '#3b82f6',
  secondary: '#10b981', 
  accent: '#f59e0b',
  danger: '#ef4444',
  success: '#22c55e',
  warning: '#f59e0b',
  info: '#06b6d4',
  income: '#22c55e',
  expense: '#ef4444',
  savings: '#3b82f6',
  investment: '#8b5cf6',
  debt: '#f59e0b',
  emergency: '#06b6d4'
};

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px', 
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

export const STORAGE_KEYS = {
  THEME: 'financepro_theme',
  USER_DATA: 'financepro_user_data',
  CHAT_HISTORY: 'financepro_chat_history',
  GOALS: 'financepro_goals',
  BUDGET: 'financepro_budget',
  INVESTMENTS: 'financepro_investments',
  SETTINGS: 'financepro_settings'
};

export const CURRENCY_FORMAT = {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
};

export const DATE_FORMAT = {
  short: { year: 'numeric', month: 'short', day: 'numeric' },
  long: { year: 'numeric', month: 'long', day: 'numeric' },
  time: { hour: '2-digit', minute: '2-digit' }
};

export const VALIDATION_RULES = {
  required: (value) => value !== null && value !== undefined && value !== '',
  min: (value, min) => Number(value) >= min,
  max: (value, max) => Number(value) <= max,
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  phone: (value) => /^[\+]?[1-9][\d]{0,15}$/.test(value),
  zipCode: (value) => /^\d{5}(-\d{4})?$/.test(value),
  ssn: (value) => /^\d{3}-?\d{2}-?\d{4}$/.test(value)
};

export const ERROR_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_ZIP: 'Please enter a valid ZIP code',
  INVALID_SSN: 'Please enter a valid Social Security Number',
  MIN_VALUE: (min) => `Value must be at least ${min}`,
  MAX_VALUE: (max) => `Value must be no more than ${max}`,
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.'
};

export const SUCCESS_MESSAGES = {
  SAVED: 'Data saved successfully',
  UPDATED: 'Data updated successfully',
  DELETED: 'Item deleted successfully',
  CALCULATED: 'Calculation completed successfully',
  GOAL_ADDED: 'Goal added successfully',
  GOAL_UPDATED: 'Goal updated successfully',
  GOAL_COMPLETED: 'Congratulations! Goal completed!'
};
