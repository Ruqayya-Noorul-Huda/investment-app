import axios from 'axios';

const BASE_URL = 'https://investsmart-backend-yfa4.onrender.com/api';

const getToken = () => localStorage.getItem('token');

export const registerUser = (data) =>
  axios.post(`${BASE_URL}/auth/register`, data);

export const loginUser = (data) =>
  axios.post(`${BASE_URL}/auth/login`, data);

export const updateProfile = (data) =>
  axios.put(`${BASE_URL}/auth/profile`, data, {
    headers: { Authorization: getToken() }
  });

export const getProfile = () =>
  axios.get(`${BASE_URL}/auth/profile`, {
    headers: { Authorization: getToken() }
  });

export const getSuggestions = () =>
  axios.get(`${BASE_URL}/ai/suggestions`, {
    headers: { Authorization: getToken() }
  });