// Central API configuration - reads from environment variable
// In development: set VITE_API_URL in root .env
// In production: set VITE_API_URL to your deployed backend URL (e.g. https://your-app.railway.app)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default API_URL;

// build: 2026-03-31 21:47:02
