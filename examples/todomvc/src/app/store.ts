import {
  Action,
  configureStore,
  ThunkAction as GenericThunkAction,
} from '@reduxjs/toolkit';
import {
  usecasesToAutoDispatchThunks,
  usecasesToReducer,
  usecasesToSelectors,
} from 'redux-clean-architecture';

import type { TodoApi } from './ports/todomvc';
import { createTodoApi } from './secondary-adapters/createTodoApi';
import * as todomvcUseCase from './use-cases/todomvc';

export const useCases = [todomvcUseCase];

export type ThunksExtraArgument = {
  todoApi: TodoApi;
};

export function createStore() {
  const todoApi = createTodoApi(import.meta.env.VITE_BASE_API ?? 'http://localhost:4000');

  const extraArgument: ThunksExtraArgument = {
    todoApi,
  };

  const store = configureStore({
    reducer: usecasesToReducer(useCases),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument,
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
