// checked-1
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ta from './locales/ta.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ta: { translation: ta },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);