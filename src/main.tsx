import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { TodoMvc } from './ui/todomvc';
import { createStore } from './app/store';

const store = createStore({
  baseApi: import.meta.env.VITE_BASE_API ?? 'http://localhost:3000/api'
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <TodoMvc />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
