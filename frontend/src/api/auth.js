import API from './axios';

// Register
export const registerUser = async (userData) => {
  const res = await API.post('/users/register', userData);
  return res.data;
};

// Login
export const loginUser = async (formData) => {
  const res = await API.post('/users/login', new URLSearchParams(formData));
  return res.data;
};

