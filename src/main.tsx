import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { TodoMvc } from './ui/todomvc';
import { createStore } from './app/store';

const store = createStore();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <TodoMvc />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
