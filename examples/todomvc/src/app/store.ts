import type {
  Action,
  ThunkAction as GenericThunkAction,
} from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import {
  usecasesToAutoDispatchThunks,
  usecasesToReducer,
  usecasesToSelectors,
} from 'redux-clean-architecture';

/* eslint-disable import/no-namespace */
import type { TodoApi } from './ports/todomvc';
import type { CreateTodoApiParams } from './secondary-adapters/createTodoApi';
import { createTodoApi } from './secondary-adapters/createTodoApi';
import * as todomvcUseCase from './use-cases/todomvc';
/* eslint-enable import/no-namespace */

export const useCases = [todomvcUseCase];

export type ThunksExtraArgument = {
  todoApi: TodoApi;
};

export type CreateStoreParams = {
  [todomvcUseCase.name]: CreateTodoApiParams;
};

export function createStore(config: CreateStoreParams) {
  const todoApi = createTodoApi(config.todomvc);

  const extraArgument: ThunksExtraArgument = {
    todoApi,
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
