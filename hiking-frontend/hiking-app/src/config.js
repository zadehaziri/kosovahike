// Environment-based configuration
const getBaseUrl = () => {
  // Check if we're in production
  if (process.env.NODE_ENV === 'production') {
    // Use environment variable if available, otherwise use relative URL
    return process.env.REACT_APP_API_URL || '/api';
  }
  // Development: use localhost
  return process.env.REACT_APP_API_URL || 'http://localhost:5000';
};

export const config = {
  BASE_URL: getBaseUrl(),
  // Other config values
  APP_NAME: 'KosovaHike',
  VERSION: '1.0.0',
};