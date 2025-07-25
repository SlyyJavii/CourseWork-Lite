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

// --- Response Interceptor ---
// This new part inspects every incoming response from the API.
apiClient.interceptors.response.use(
  // If the response is successful (status 2xx), just return it.
  (response) => response,

  // If the response has an error...
  (error) => {
    // Check if the error is a 401 Unauthorized response.
    if (error.response && error.response.status === 401) {
      console.log("Caught 401 Unauthorized. Logging out.");

      // Remove the invalid token from storage.
      localStorage.removeItem('token');

      // Redirect the user to the login page.
      // We use window.location.hash to work with our simple router.
      // A full reload might be even better to clear all state.
      window.location.hash = '/login';
      // window.location.reload(); // Optional: force a full page reload
    }

    // For all other errors, just pass them along.
    return Promise.reject(error);
  }
);

// 3. Export the configured apiClient so other parts of our app can use it.
export default apiClient;
