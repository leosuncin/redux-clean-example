import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { CounterPage } from './ui/counter';
import { createStore } from './app/store';

const store = createStore();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <CounterPage />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
