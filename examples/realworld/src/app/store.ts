import {
  type Action,
  type ThunkAction,
  configureStore,
} from '@reduxjs/toolkit';
import type { KyInstance } from 'ky/distribution/types/ky';
import {
  usecasesToAutoDispatchThunks,
  usecasesToReducer,
  usecasesToSelectors,
} from 'redux-clean-architecture';

/* eslint-disable import/no-namespace */
import type { AuthApi } from '~/app/ports/auth';
import { createAuthApi } from '~/app/secondary-adapters/createAuth';
import * as authUseCase from '~/app/use-cases/auth';
/* eslint-enable import/no-namespace */
import type { SerializedValidationError } from '~/utils/serializeError';

export const useCases = [authUseCase];

export type ThunksExtraArgument = {
  [authUseCase.name]: AuthApi;
};

export type CreateStoreParams = {
  client: KyInstance;
};

export function createStore({ client }: CreateStoreParams) {
  const authApi = createAuthApi({ client });

  const extraArgument: ThunksExtraArgument = {
    [authUseCase.name]: authApi,
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

export type AppThunk<RtnType = void | Promise<void>> = ThunkAction<
  RtnType,
  AppState,
  ThunksExtraArgument,
  Action<string>
>;

export type AsyncThunkConfig = {
  state: AppState;
  dispatch: AppDispatch;
  extra: ThunksExtraArgument;
  serializedErrorType: SerializedValidationError;
};
