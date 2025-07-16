import React from 'react';
import ReactDOM from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';         
import store from './store';                     

import App from './App';
import './App.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement as HTMLElement);

root.render(
  <React.StrictMode>
    <Provider store={store}>         
      <CssBaseline />
      <App />
    </Provider>
  </React.StrictMode>
);
