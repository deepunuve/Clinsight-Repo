// src/api/authService.js
import { validateUserSecret } from '../api/user';

// Mock login function using data from local JSON file
export const login = async (username, password) => {
    try {
        // Fetch user data from the local JSON file
        const response = await validateUserSecret(username, password);
        // Find the user in the JSON data
        const user = response.find(user => user.username === username && user.password === password);
        if (user) {
            // Return a mock token and user info if credentials are correct
            return {
                user: {
                    username: user.username,
                    role: user.role,
                    email: user.email
                },
                token: 'mock-jwt-token' // Placeholder token for demonstration
            };
        } else {
            // Throw an error if credentials are incorrect
            throw new Error('Invalid username or password');
        }
    } catch (error) {
        console.error('Error during login:', error);
        throw new Error('Unable to authenticate user');
    }
};

// Mock logout function
export const logout = async () => {
    // Placeholder for logout functionality
    return true;
};


// const API_URL = process.env.REACT_APP_API_URL;

// export const login = async (username, password) => {
//   const response = await axios.post(`${API_URL}/auth/login`, { username, password });
//   return response.data;
// };

// export const logout = async () => {
//   await axios.post(`${API_URL}/auth/logout`);
// };