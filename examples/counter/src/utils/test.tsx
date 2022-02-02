import { type RenderOptions, render } from '@testing-library/react';
import { Provider } from 'react-redux';

import { type AppStore, createStore } from '../app/store';

type CustomRenderOptions = RenderOptions & { store?: AppStore };

function customRender(
  ui: React.ReactElement,
  { store = createStore(), ...options }: CustomRenderOptions = {},
) {
  return render(<Provider store={store}>{ui}</Provider>, options);
}

export { customRender as render };
