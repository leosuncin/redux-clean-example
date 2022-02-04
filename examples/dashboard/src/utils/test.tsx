import { type RenderOptions, render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { type MemoryRouterProps, MemoryRouter } from 'react-router-dom';

import { type AppStore, createStore } from '~/app/store';

type CustomRenderOptions = RenderOptions &
  Pick<MemoryRouterProps, 'initialEntries' | 'initialIndex'> & {
    store?: AppStore;
  };

function customRender(
  ui: React.ReactElement,
  {
    store = createStore(),
    initialEntries,
    initialIndex,
    ...options
  }: CustomRenderOptions = {},
) {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries} initialIndex={initialIndex}>
        {ui}
      </MemoryRouter>
    </Provider>,
    options,
  );
}

export { customRender as render };
