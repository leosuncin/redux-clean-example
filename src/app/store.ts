import {
  Action,
  configureStore,
  ThunkAction as GenericThunkAction,
} from '@reduxjs/toolkit';
import {
  createMiddlewareEvtActionFactory,
  usecasesToAutoDispatchThunks,
  usecasesToReducer,
  usecasesToSelectors,
} from 'clean-redux';

import type { CounterApi } from './ports/counter';
import { createCounter } from './secondary-adapters/createCounter';
import * as counterUseCase from './use-cases/counter';

export const useCases = [counterUseCase];

const { createMiddlewareEvtAction } = createMiddlewareEvtActionFactory(
  useCases
);

export type ThunksExtraArgument = {
  counterApi: CounterApi;
  evtAction: ReturnType<typeof createMiddlewareEvtAction>['evtAction'];
};

export function createStore() {
  const [counterApi] = [createCounter()];

  const { evtAction, middlewareEvtAction } = createMiddlewareEvtAction();

  const store = configureStore({
    reducer: usecasesToReducer(useCases),
    middleware: (getDefaultMiddleware) =>
      [
        ...getDefaultMiddleware({
          thunk: {
            extraArgument: {
              counterApi,
              evtAction,
            },
          },
        }),
        middlewareEvtAction,
      ] as const,
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
