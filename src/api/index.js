import axios from 'axios';
import { toast } from 'react-toastify';

const API_ERRORS = {
  'Empty key!': 'Не указан ключ покупателя',
  'Invalid key client!': 'Неверный ключ покупателя, покупатель не найден',
  'Empty number goods!': 'Не указан номер детали',
  'Request quota exceeded!': 'Превышен лимит запросов по грузовому ассортименту',
};

const parseApiError = (error) => {
  const text = Array.isArray(error) ? error.join(' ') : String(error);
  const known = Object.keys(API_ERRORS).filter((key) => text.includes(key));

  return known.length ? known.map((key) => API_ERRORS[key]).join('. ') : text;
};

const getNetworkErrorMessage = (error) => {
  if (error.code === 'ECONNABORTED') return 'Сервер не ответил вовремя. Попробуйте ещё раз.';
  if (error.response) return `Ошибка сервера: ${error.response.status}`;
  return 'Не удалось связаться с сервером. Проверьте подключение к сети.';
};

const rejectWithToast = (message) => {
  toast.error(message);
  return Promise.reject(new Error(message));
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => {
    const apiError = response.data?.error;
    return apiError ? rejectWithToast(parseApiError(apiError)) : response;
  },
  (error) => rejectWithToast(getNetworkErrorMessage(error)),
);
