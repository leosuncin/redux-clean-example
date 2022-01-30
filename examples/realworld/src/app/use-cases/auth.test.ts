import { faker } from '@faker-js/faker';
import type { PayloadAction } from '@reduxjs/toolkit';
import { setupServer } from 'msw/node';

import {
  reducer,
  thunks,
  initialState,
  type AuthSliceState,
} from './auth';
import type { AuthReturned } from '~/app/ports/auth';
import { createAuthApi } from '~/app/secondary-adapters/createAuth';
import { client } from '~/utils/client';
import { registerHandler, loginHandler } from '~/utils/mocks/auth';
import type { SerializedValidationError } from '~/utils/serializeError';

const server = setupServer(registerHandler, loginHandler);

describe('Auth reducer', () => {
  const authApi = createAuthApi({ client });

  beforeAll(() => {
    server.listen({
      onUnhandledRequest: 'error',
    });
  });

  afterAll(() => {
    server.close();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  it('should get the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle the register of a new user', async () => {
    const dispatch = vi.fn();
    const thunk = thunks.register({
      username: faker.internet.userName().toLowerCase(),
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password(),
    });

    await thunk(dispatch, () => ({ auth: initialState }), {
      auth: authApi,
    });

    expect(dispatch).toHaveBeenCalledTimes(2);

    const [[pending], [fulfilled]] = dispatch.mock
      .calls as PayloadAction<AuthReturned>[][];

    expect(thunks.register.pending.match(pending)).toBe(true);
    expect(thunks.register.fulfilled.match(fulfilled)).toBe(true);

    const pendingState = reducer(initialState, pending);
    const fulfilledState = reducer(pendingState, fulfilled);

    expect(pendingState).toMatchObject<AuthSliceState>({
      status: 'pending',
    });
    expect(fulfilledState).toMatchObject<AuthSliceState>({
      status: 'fulfilled',
      token: fulfilled.payload.token,
      user: fulfilled.payload.user,
    });
  });

  it('should handle the errors of registering', async () => {
    const dispatch = vi.fn();
    const thunk = thunks.register({
      username: 'admin',
      email: 'admin@example.com',
      password: faker.internet.password(),
    });

    await thunk(dispatch, () => ({ auth: initialState }), {
      auth: authApi,
    });

    expect(dispatch).toHaveBeenCalledTimes(2);

    const [[pending], [rejected]] = dispatch.mock.calls as PayloadAction<
      undefined,
      string,
      unknown,
      SerializedValidationError
    >[][];

    expect(thunks.register.pending.match(pending)).toBe(true);
    expect(thunks.register.rejected.match(rejected)).toBe(true);

    const pendingState = reducer(initialState, pending);
    const rejectedState = reducer(pendingState, rejected);

    expect(pendingState).toMatchObject<AuthSliceState>({
      status: 'pending',
    });
    expect(rejectedState).toMatchObject<AuthSliceState>({
      status: 'rejected',
      errors: rejected.error.errors,
    });
  });

  it('should handle the login of an existing user', async () => {
    const dispatch = vi.fn();
    const thunk = thunks.login({
      email: 'admin@example.com',
      password: 'Pa$$w0rd!',
    });

    await thunk(dispatch, () => ({ auth: initialState }), { auth: authApi });

    expect(dispatch).toHaveBeenCalledTimes(2);

    const [[pending], [fulfilled]] = dispatch.mock
      .calls as PayloadAction<AuthReturned>[][];

    expect(thunks.login.pending.match(pending)).toBe(true);
    expect(thunks.login.fulfilled.match(fulfilled)).toBe(true);

    const pendingState = reducer(initialState, pending);
    const fulfilledState = reducer(pendingState, fulfilled);

    expect(pendingState).toMatchObject<AuthSliceState>({
      status: 'pending',
    });
    expect(fulfilledState).toMatchObject<AuthSliceState>({
      status: 'fulfilled',
      token: fulfilled.payload.token,
      user: fulfilled.payload.user,
    });
  });

  it('should handle the errors of loging in a user', async () => {
    const dispatch = vi.fn();
    const thunk = thunks.login({
      email: faker.internet.exampleEmail(),
      password: faker.internet.password(),
    });

    await thunk(dispatch, () => ({ auth: initialState }), { auth: authApi });

    expect(dispatch).toHaveBeenCalledTimes(2);

    const [[pending], [rejected]] = dispatch.mock.calls as PayloadAction<
      undefined,
      string,
      unknown,
      SerializedValidationError
    >[][];

    expect(thunks.login.pending.match(pending)).toBe(true);
    expect(thunks.login.rejected.match(rejected)).toBe(true);

    const pendingState = reducer(initialState, pending);
    const rejectedState = reducer(pendingState, rejected);

    expect(pendingState).toMatchObject<AuthSliceState>({
      status: 'pending',
    });
    expect(rejectedState).toMatchObject<AuthSliceState>({
      status: 'rejected',
      errors: rejected.error.errors,
    });
  });
});
