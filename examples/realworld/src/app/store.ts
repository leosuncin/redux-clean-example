import {
  type Action,
  type PreloadedState,
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
import type { TagsApi } from '~/app/ports/tags';
import { createAuthApi } from '~/app/secondary-adapters/createAuthApi';
import { createTagsApi } from '~/app/secondary-adapters/createTagsApi';
import * as authUseCase from '~/app/use-cases/auth';
import * as tagsUseCase from '~/app/use-cases/tags';
/* eslint-enable import/no-namespace */
import type { SerializedValidationError } from '~/utils/serializeError';

export const useCases = [authUseCase, tagsUseCase];

export type ThunksExtraArgument = {
  [authUseCase.name]: AuthApi;
  [tagsUseCase.name]: TagsApi;
};

export type CreateStoreParams = {
  client: KyInstance;
  preloadedState?: PreloadedState<AppState>;
};

export function createStore({ client, preloadedState }: CreateStoreParams) {
  const authApi = createAuthApi({ client });
  const tagsApi = createTagsApi({ client });

  const extraArgument: ThunksExtraArgument = {
    [authUseCase.name]: authApi,
    [tagsUseCase.name]: tagsApi,
  };

  return configureStore({
    reducer: usecasesToReducer(useCases),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument,
        },
      }),
    preloadedState,
  });
}

export const selectors = usecasesToSelectors(useCases);

export const { getAutoDispatchThunks } = usecasesToAutoDispatchThunks(useCases);

export type AppStore = ReturnType<typeof createStore>;

export type AppDispatch = AppStore['dispatch'];

export type AppState = {
  [authUseCase.name]: authUseCase.AuthSliceState;
  [tagsUseCase.name]: tagsUseCase.TagsSliceState;
};

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
