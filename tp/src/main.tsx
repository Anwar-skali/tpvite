import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { store } from './store';
import 'bootstrap/dist/css/bootstrap.min.css';

/**
 * Provider Redux : state global auth (et futurs slices) + Router pour /login et routes protégées.
 * L’ancien AuthProvider (Context + useReducer) est remplacé par le store — voir commentaires dans AuthContext.tsx.
 */
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
