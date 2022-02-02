import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import './index.css';

import App from './App';
import { createStore } from './app/store';

const store = createStore({
  todomvc: {
    baseApi: import.meta.env.VITE_BASE_API ?? 'http://localhost:4000',
  },
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.querySelector('#root'),
);
