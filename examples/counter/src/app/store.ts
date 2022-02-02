import {
  type Action,
  type ThunkAction as GenericThunkAction,
  configureStore,
} from '@reduxjs/toolkit';
import {
  usecasesToAutoDispatchThunks,
  usecasesToReducer,
  usecasesToSelectors,
} from 'redux-clean-architecture';

/* eslint-disable import/no-namespace */
import type { CounterApi } from './ports/counter';
import { createCounter } from './secondary-adapters/createCounter';
import * as counterUseCase from './use-cases/counter';
/* eslint-enable import/no-namespace */

export const useCases = [counterUseCase];

export type ThunksExtraArgument = {
  counterApi: CounterApi;
};

export function createStore() {
  const counterApi = createCounter();

  const extraArgument: ThunksExtraArgument = {
    counterApi,
  };

  return configureStore({
    reducer: usecasesToReducer(useCases),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument,
        },
      }),
  });
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
