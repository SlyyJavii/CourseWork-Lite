// This file centralizes all our API communication logic.

import axios from 'axios';

// 1. Create a new Axios instance with a custom configuration.
const apiClient = axios.create({
  // Use the environment variable for the base URL. This allows us to easily
  // switch between a local backend and the deployed backend on Render.
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// 2. Use an Interceptor to automatically add the JWT to every request.
// An interceptor is a function that runs before a request is sent or after a response is received.
apiClient.interceptors.request.use(
  (config) => {
    // Retrieve the token from localStorage (where we will store it after login).
    const token = localStorage.getItem('token');

    // If the token exists, add it to the Authorization header.
    // The backend will use this header to identify the logged-in user.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config; // Return the modified configuration
  },
  (error) => {
    // Handle any errors that occur during the request setup.
    return Promise.reject(error);
  }
);

// 3. Export the configured apiClient so other parts of our app can use it.
export default apiClient;
