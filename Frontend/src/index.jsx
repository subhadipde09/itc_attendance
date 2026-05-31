import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './App.jsx';
import { store } from './redux/store';
import { ThemeModeProvider } from './context/ThemeModeContext.jsx';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeModeProvider>
        <App />
        <ToastContainer position="top-right" autoClose={2500} />
      </ThemeModeProvider>
    </Provider>
  </React.StrictMode>
);
