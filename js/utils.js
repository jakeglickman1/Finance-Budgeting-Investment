/**
 * Utility Functions
 * Common utility functions used throughout the application
 */

import { CURRENCY_FORMAT, DATE_FORMAT, VALIDATION_RULES, ERROR_MESSAGES } from './constants.js';

/**
 * Format a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency code (default: USD)
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, currency = 'USD') {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '$0.00';
  }
  
  const formatter = new Intl.NumberFormat('en-US', {
    ...CURRENCY_FORMAT,
    currency
  });
  
  return formatter.format(Number(amount));
}

/**
 * Format a number with commas
 * @param {number} number - The number to format
 * @returns {string} Formatted number string
 */
export function formatNumber(number) {
  if (number === null || number === undefined || isNaN(number)) {
    return '0';
  }
  
  return new Intl.NumberFormat('en-US').format(Number(number));
}

/**
 * Format a date
 * @param {Date|string} date - The date to format
 * @param {string} format - The format type ('short', 'long', 'time')
 * @returns {string} Formatted date string
 */
export function formatDate(date, format = 'short') {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  return new Intl.DateTimeFormat('en-US', DATE_FORMAT[format]).format(dateObj);
}

/**
 * Sanitize and validate a number input
 * @param {string|number} value - The value to sanitize
 * @param {number} defaultValue - Default value if invalid
 * @returns {number} Sanitized number
 */
export function sanitizeNumber(value, defaultValue = 0) {
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }
  
  const num = parseFloat(String(value).replace(/,/g, ''));
  return isNaN(num) ? defaultValue : num;
}

/**
 * Validate input against rules
 * @param {any} value - The value to validate
 * @param {Object} rules - Validation rules
 * @returns {Object} Validation result
 */
export function validateInput(value, rules = {}) {
  const errors = [];
  
  for (const [rule, ruleValue] of Object.entries(rules)) {
    if (rule === 'required' && !VALIDATION_RULES.required(value)) {
      errors.push(ERROR_MESSAGES.REQUIRED);
    } else if (rule === 'min' && !VALIDATION_RULES.min(value, ruleValue)) {
      errors.push(ERROR_MESSAGES.MIN_VALUE(ruleValue));
    } else if (rule === 'max' && !VALIDATION_RULES.max(value, ruleValue)) {
      errors.push(ERROR_MESSAGES.MAX_VALUE(ruleValue));
    } else if (rule === 'email' && !VALIDATION_RULES.email(value)) {
      errors.push(ERROR_MESSAGES.INVALID_EMAIL);
    } else if (rule === 'phone' && !VALIDATION_RULES.phone(value)) {
      errors.push(ERROR_MESSAGES.INVALID_PHONE);
    } else if (rule === 'zipCode' && !VALIDATION_RULES.zipCode(value)) {
      errors.push(ERROR_MESSAGES.INVALID_ZIP);
    } else if (rule === 'ssn' && !VALIDATION_RULES.ssn(value)) {
      errors.push(ERROR_MESSAGES.INVALID_SSN);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Execute immediately
 * @returns {Function} Debounced function
 */
export function debounce(func, wait, immediate = false) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
}

/**
 * Throttle function to limit function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit) {
  let inThrottle;
  
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Generate a unique ID
 * @param {string} prefix - Optional prefix
 * @returns {string} Unique ID
 */
export function generateId(prefix = '') {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return prefix ? `${prefix}_${timestamp}_${random}` : `${timestamp}_${random}`;
}

/**
 * Deep clone an object
 * @param {any} obj - Object to clone
 * @returns {any} Cloned object
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item));
  }
  
  if (typeof obj === 'object') {
    const cloned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
}

/**
 * Calculate percentage
 * @param {number} value - The value
 * @param {number} total - The total
 * @param {number} decimals - Number of decimal places
 * @returns {number} Percentage
 */
export function calculatePercentage(value, total, decimals = 2) {
  if (total === 0) return 0;
  return Number(((value / total) * 100).toFixed(decimals));
}

/**
 * Calculate compound interest
 * @param {number} principal - Initial amount
 * @param {number} rate - Annual interest rate (as decimal)
 * @param {number} time - Time in years
 * @param {number} frequency - Compounding frequency per year
 * @returns {number} Final amount
 */
export function calculateCompoundInterest(principal, rate, time, frequency = 1) {
  const amount = principal * Math.pow(1 + (rate / frequency), frequency * time);
  return Number(amount.toFixed(2));
}

/**
 * Calculate monthly payment for loan
 * @param {number} principal - Loan amount
 * @param {number} rate - Annual interest rate (as decimal)
 * @param {number} months - Loan term in months
 * @returns {number} Monthly payment
 */
export function calculateMonthlyPayment(principal, rate, months) {
  if (rate === 0) {
    return principal / months;
  }
  
  const monthlyRate = rate / 12;
  const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                  (Math.pow(1 + monthlyRate, months) - 1);
  
  return Number(payment.toFixed(2));
}

/**
 * Get age from birth date
 * @param {Date|string} birthDate - Birth date
 * @returns {number} Age in years
 */
export function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Check if value is empty
 * @param {any} value - Value to check
 * @returns {boolean} True if empty
 */
export function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export function capitalize(str) {
  if (typeof str !== 'string' || str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Convert string to title case
 * @param {string} str - String to convert
 * @returns {string} Title case string
 */
export function toTitleCase(str) {
  if (typeof str !== 'string') return str;
  
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

/**
 * Get random item from array
 * @param {Array} array - Array to get item from
 * @returns {any} Random item
 */
export function getRandomItem(array) {
  if (!Array.isArray(array) || array.length === 0) return null;
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Shuffle array
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Sleep/delay function
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after delay
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} retries - Number of retries
 * @param {number} delay - Initial delay in ms
 * @returns {Promise} Promise that resolves with function result
 */
export async function retry(fn, retries = 3, delay = 1000) {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await sleep(delay);
      return retry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

/**
 * Safe JSON parse
 * @param {string} str - JSON string
 * @param {any} defaultValue - Default value if parse fails
 * @returns {any} Parsed object or default value
 */
export function safeJsonParse(str, defaultValue = null) {
  try {
    return JSON.parse(str);
  } catch (error) {
    console.warn('JSON parse error:', error);
    return defaultValue;
  }
}

/**
 * Safe JSON stringify
 * @param {any} obj - Object to stringify
 * @param {string} defaultValue - Default value if stringify fails
 * @returns {string} JSON string or default value
 */
export function safeJsonStringify(obj, defaultValue = '{}') {
  try {
    return JSON.stringify(obj);
  } catch (error) {
    console.warn('JSON stringify error:', error);
    return defaultValue;
  }
}


