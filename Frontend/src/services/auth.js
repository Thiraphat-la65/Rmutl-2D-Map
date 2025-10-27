import axios from 'axios';

let apiUrl;
try {
    if (typeof import.meta.env !== 'undefined' && import.meta.env.VITE_API_URL) {
        
        apiUrl = import.meta.env.VITE_API_URL;
    } else if (process.env.REACT_APP_API_URL) {
        
        apiUrl = process.env.REACT_APP_API_URL;
    } else {
        apiUrl = 'http://localhost:3000';
        console.warn('No API URL found in .env. Using fallback:', apiUrl);
    }
} catch (error) {
    console.error('Error loading environment variables:', error);
    apiUrl = 'http://localhost:3000'; 
}

console.log('Loaded API URL:', apiUrl);

const login = async (credentials) => {
    console.log('Login function called with:', credentials);
    console.log('Using API URL:', apiUrl);
    try {
        const response = await axios.post(`${apiUrl}/api/login`, credentials, {
            headers: { 'Content-Type': 'application/json' },
        });
        console.log('Login Response:', response.data);
        return response.data; 
    } catch (error) {
        console.error('Login Error Details:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
        });
        throw new Error(error.response?.data?.error || 'เกิดข้อผิดพลาดในการล็อกอิน');
    }
};

const register = async (userData) => {
    await new Promise((resolve) => setTimeout(resolve, 500)); 
    const { email, password, name } = userData;

    const existingEmails = ['admin@example.com', 'user@example.com'];
    if (existingEmails.includes(email)) {
        throw new Error('Email already exists');
    }

    const newUser = {
        id: Math.floor(Math.random() * 1000) + 3,
        name,
        role: 'user',
        password,
    };

    const token = `mock-token-${Math.random().toString(36).substr(2, 9)}`;

    return {
        token,
        user: { id: newUser.id, name: newUser.name, role: newUser.role },
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
};

export { login as default, register };