// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AuthProvider } from './ServiceHelper/AuthContext';
import { LoaderProvider } from './ServiceHelper/LoaderContext';

ReactDOM.render(
  <AuthProvider>
    <LoaderProvider>
      <App />
    </LoaderProvider>
  </AuthProvider>,
  document.getElementById('root')
);
