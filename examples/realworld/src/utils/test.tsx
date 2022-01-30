import { render, type RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, type MemoryRouterProps } from 'react-router-dom';

import { createStore, type AppStore } from '~/app/store';
import { client } from '~/utils/client';

type CustomRenderOptions = {
  store?: AppStore;
} & Pick<MemoryRouterProps, 'initialEntries' | 'initialIndex'> &
  RenderOptions;

function customRender(
  ui: React.ReactElement,
  {
    store = createStore({ client }),
    initialEntries,
    initialIndex,
    ...options
  }: CustomRenderOptions = {}
) {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={initialEntries} initialIndex={initialIndex}>
        {ui}
      </MemoryRouter>
    </Provider>,
    options
  );
}

export { customRender as render };
