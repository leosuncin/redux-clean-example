import {
  Action,
  configureStore,
  ThunkAction as GenericThunkAction,
} from '@reduxjs/toolkit';
import {
  usecasesToAutoDispatchThunks,
  usecasesToReducer,
  usecasesToSelectors,
} from 'clean-redux';

import type { CounterApi } from './ports/counter';
import { createCounter } from './secondary-adapters/createCounter';
import * as counterUseCase from './use-cases/counter';
import * as todomvcUseCase from './use-cases/todomvc';

export const useCases = [counterUseCase, todomvcUseCase];

export type ThunksExtraArgument = {
  counterApi: CounterApi;
};

export function createStore() {
  const [counterApi] = [createCounter()];

  const store = configureStore({
    reducer: usecasesToReducer(useCases),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: {
            counterApi,
          },
        },
      }),
  });

  return store;
}

export const selectors = usecasesToSelectors(useCases);

export const { getAutoDispatchThunks } = usecasesToAutoDispatchThunks(useCases);

export type AppStore = ReturnType<typeof createStore>;

export type AppDispatch = AppStore['dispatch'];

export type AppState = ReturnType<AppStore['getState']>;

export type AppThunk<RtnType = void | Promise<void>> = GenericThunkAction<
  RtnType,
  AppState,
  ThunksExtraArgument,
  Action<string>
>;

export type AsyncThunkConfig = {
  state: AppState;
  dispatch: AppDispatch;
  extra: ThunksExtraArgument;
};
