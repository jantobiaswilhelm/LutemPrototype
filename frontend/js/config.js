/**
 * Lutem - Configuration Module
 * Auto-detects environment and sets appropriate API URL
 * 
 * This module MUST be loaded BEFORE api.js and any other module that uses API calls
 */

const Config = (function() {
    // Detect environment based on hostname
    const hostname = window.location.hostname;
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    const isProduction = !isLocalhost;
    
    // API URLs
    const PRODUCTION_API_URL = 'https://lutemprototype-production.up.railway.app';
    const DEVELOPMENT_API_URL = 'http://localhost:8080';
    
    const API_URL = isProduction ? PRODUCTION_API_URL : DEVELOPMENT_API_URL;
    
    // Log environment info (helpful for debugging)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`[Lutem Config] Environment: ${isProduction ? '🌐 PRODUCTION' : '💻 DEVELOPMENT'}`);
    console.log(`[Lutem Config] Hostname: ${hostname}`);
    console.log(`[Lutem Config] API URL: ${API_URL}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    return {
        // API endpoints
        API_URL: API_URL,
        API_BASE_URL: API_URL,
        
        // Environment flags
        isProduction: isProduction,
        isDevelopment: !isProduction,
        isLocalhost: isLocalhost,
        
        // Version info
        version: '1.0.0',
        
        // Helper method to build API URLs
        getApiUrl: function(endpoint) {
            // Remove leading slash if present to avoid double slashes
            if (endpoint.startsWith('/')) {
                endpoint = endpoint.substring(1);
            }
            return `${API_URL}/${endpoint}`;
        }
    };
})();

// Make Config globally available
window.LutemConfig = Config;
