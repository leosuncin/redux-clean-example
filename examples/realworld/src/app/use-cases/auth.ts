import {
  type AsyncThunk,
  type PayloadAction,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';

import type {
  AuthReturned,
  Login,
  Register,
  UpdateUser,
  User,
} from '~/app/ports/auth';
import type { AppState, AsyncThunkConfig } from '~/app/store';

export type AuthSliceState = {
  status: 'pending' | 'fulfilled' | 'rejected' | 'idle';
  user?: User;
  token?: string;
  errors?: Record<string, string[]>;
};

type AuthAsyncThunk = AsyncThunk<AuthReturned, unknown, AsyncThunkConfig>;
type PendingAction = ReturnType<AuthAsyncThunk['pending']>;
type RejectedAction = ReturnType<AuthAsyncThunk['rejected']>;
type FulfilledAction = ReturnType<AuthAsyncThunk['fulfilled']>;

export const initialState: AuthSliceState = {
  status: 'idle',
};

export const { actions, name, reducer } = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    logout: () => initialState,
  },
  extraReducers(builder) {
    const pendingRegex = new RegExp(`${name}\\/\\w+\\/pending`, 'ui');
    const fulfilledRegex = new RegExp(`${name}\\/\\w+\\/fulfilled`, 'ui');
    const rejectedRegex = new RegExp(`${name}\\/\\w+\\/rejected`, 'ui');

    builder
      .addMatcher(
        (action): action is PendingAction => pendingRegex.test(action.type),
        (state, action) => {
          state.status = action.meta.requestStatus;
        }
      )
      .addMatcher(
        (action): action is FulfilledAction => fulfilledRegex.test(action.type),
        (state, action) => {
          state.status = action.meta.requestStatus;
          state.token = action.payload.token;
          state.user = action.payload.user;
          delete state.errors;
        }
      )
      .addMatcher(
        (action): action is RejectedAction => rejectedRegex.test(action.type),
        (state, action) => {
          state.status = action.meta.requestStatus;
        }
      );
  },
});

export const selectors = {
  isAuthenticated: (state: AppState): boolean => Boolean(state.auth.token),
  user: (state: AppState): AuthSliceState['user'] => state.auth.user,
  errors: (state: AppState): AuthSliceState['errors'] => state.auth.errors,
  isLoading: (state: AppState): boolean => state.auth.status === 'pending',
};

export const thunks = {
  register: createAsyncThunk<AuthReturned, Register, AsyncThunkConfig>(
    `${name}/register`,
    async (payload, { extra }) => extra.auth.register(payload)
  ),
  login: createAsyncThunk<AuthReturned, Login, AsyncThunkConfig>(
    `${name}/login`,
    async (payload, { extra }) => extra.auth.login(payload)
  ),
  getUser: createAsyncThunk<AuthReturned, never, AsyncThunkConfig>(
    `${name}/getUser`,
    async (_, { extra }) => extra.auth.getUser()
  ),
  updateUser: createAsyncThunk<AuthReturned, UpdateUser, AsyncThunkConfig>(
    `${name}/updateUser`,
    async (payload, { extra }) => extra.auth.updateUser(payload)
  ),
};
