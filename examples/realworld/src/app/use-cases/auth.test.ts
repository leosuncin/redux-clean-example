import { faker } from '@faker-js/faker';
import type { PayloadAction } from '@reduxjs/toolkit';
import { setupServer } from 'msw/node';

import type { AuthReturned } from '~/app/ports/auth';
import { createAuthApi } from '~/app/secondary-adapters/createAuth';
import {
  type AuthSliceState,
  initialState,
  name,
  reducer,
  thunks,
} from '~/app/use-cases/auth';
import { client, setToken } from '~/utils/client';
import {
  getUserHandler,
  loginHandler,
  registerHandler,
  updateUserHandler,
} from '~/utils/mocks/auth';
import type { SerializedValidationError } from '~/utils/serializeError';

const server = setupServer(
  registerHandler,
  loginHandler,
  getUserHandler,
  updateUserHandler
);

describe('Auth reducer', () => {
  const authApi = createAuthApi({ client });
  const authenticatedState: Omit<Required<AuthSliceState>, 'errors'> = {
    status: 'fulfilled',
    token: 'eyJzdWIiOiJhZG1pbiJ9',
    user: {
      email: 'admin@example.com',
      username: 'admin',
      bio: 'The secret life of a Dev',
      image: 'https://thispersondoesnotexist.com/image',
    },
  };

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

    const [[pendingAction], [fulfilledAction]] = dispatch.mock
      .calls as PayloadAction<AuthReturned>[][];

    expect(thunks.register.pending.match(pendingAction)).toBe(true);
    expect(thunks.register.fulfilled.match(fulfilledAction)).toBe(true);

    const pendingState = reducer(initialState, pendingAction);
    const fulfilledState = reducer(pendingState, fulfilledAction);

    expect(pendingState).toMatchObject<AuthSliceState>({
      status: 'pending',
    });
    expect(fulfilledState).toMatchObject<AuthSliceState>({
      status: 'fulfilled',
      token: fulfilledAction.payload.token,
      user: fulfilledAction.payload.user,
    });
  });

  it('should handle the errors of registering', async () => {
    const dispatch = vi.fn();
    const thunk = thunks.register({
      username: authenticatedState.user.username,
      email: authenticatedState.user.email,
      password: faker.internet.password(),
    });

    await thunk(dispatch, () => ({ auth: initialState }), {
      auth: authApi,
    });

    expect(dispatch).toHaveBeenCalledTimes(2);

    const [[pendingAction], [rejectedAction]] = dispatch.mock
      .calls as PayloadAction<
      undefined,
      string,
      unknown,
      SerializedValidationError
    >[][];

    expect(thunks.register.pending.match(pendingAction)).toBe(true);
    expect(thunks.register.rejected.match(rejectedAction)).toBe(true);

    const pendingState = reducer(initialState, pendingAction);
    const rejectedState = reducer(pendingState, rejectedAction);

    expect(pendingState).toMatchObject<AuthSliceState>({
      status: 'pending',
    });
    expect(rejectedState).toMatchObject<AuthSliceState>({
      status: 'rejected',
      errors: rejectedAction.error.errors,
    });
  });

  it('should handle the login of an existing user', async () => {
    const dispatch = vi.fn();
    const thunk = thunks.login({
      email: authenticatedState.user.email,
      password: 'Pa$$w0rd!',
    });

    await thunk(dispatch, () => ({ auth: initialState }), { auth: authApi });

    expect(dispatch).toHaveBeenCalledTimes(2);

    const [[pendingAction], [fulfilledAction]] = dispatch.mock
      .calls as PayloadAction<AuthReturned>[][];

    expect(thunks.login.pending.match(pendingAction)).toBe(true);
    expect(thunks.login.fulfilled.match(fulfilledAction)).toBe(true);

    const pendingState = reducer(initialState, pendingAction);
    const fulfilledState = reducer(pendingState, fulfilledAction);

    expect(pendingState).toMatchObject<AuthSliceState>({
      status: 'pending',
    });
    expect(fulfilledState).toMatchObject<AuthSliceState>({
      status: 'fulfilled',
      token: fulfilledAction.payload.token,
      user: fulfilledAction.payload.user,
    });
  });

  it('should handle the errors of logging in a user', async () => {
    const dispatch = vi.fn();
    const thunk = thunks.login({
      email: faker.internet.exampleEmail(),
      password: faker.internet.password(4),
    });

    await thunk(dispatch, () => ({ auth: initialState }), { auth: authApi });

    expect(dispatch).toHaveBeenCalledTimes(2);

    const [[pendingAction], [rejectedAction]] = dispatch.mock
      .calls as PayloadAction<
      undefined,
      string,
      unknown,
      SerializedValidationError
    >[][];

    expect(thunks.login.pending.match(pendingAction)).toBe(true);
    expect(thunks.login.rejected.match(rejectedAction)).toBe(true);

    const pendingState = reducer(initialState, pendingAction);
    const rejectedState = reducer(pendingState, rejectedAction);

    expect(pendingState).toMatchObject<AuthSliceState>({
      status: 'pending',
    });
    expect(rejectedState).toMatchObject<AuthSliceState>({
      status: 'rejected',
      errors: rejectedAction.error.errors,
    });
  });

  it('should handle get the current user', async () => {
    const dispatch = vi.fn();
    const thunk = thunks.getUser();

    setToken(authenticatedState.token);
    await thunk(dispatch, () => ({ auth: authenticatedState }), {
      auth: authApi,
    });

    expect(dispatch).toHaveBeenCalledTimes(2);

    const [[pendingAction], [fulfilledAction]] = dispatch.mock
      .calls as PayloadAction<AuthReturned>[][];

    expect(thunks.getUser.pending.match(pendingAction)).toBe(true);
    expect(thunks.getUser.fulfilled.match(fulfilledAction)).toBe(true);

    const pendingState = reducer(authenticatedState, pendingAction);
    const fulfilledState = reducer(pendingState, fulfilledAction);

    expect(pendingState).toMatchObject<AuthSliceState>({
      ...authenticatedState,
      status: 'pending',
    });
    expect(fulfilledState).toMatchObject<AuthSliceState>({
      status: 'fulfilled',
      token: fulfilledAction.payload.token,
      user: fulfilledAction.payload.user,
    });
  });

  it('should handle the update of the current user', async () => {
    const dispatch = vi.fn();
    const thunk = thunks.updateUser({
      image: faker.internet.avatar(),
      bio: faker.hacker.phrase(),
    });

    setToken(authenticatedState.token);
    await thunk(dispatch, () => ({ auth: authenticatedState }), {
      auth: authApi,
    });

    expect(dispatch).toHaveBeenCalledTimes(2);

    const [[pendingAction], [fulfilledAction]] = dispatch.mock
      .calls as PayloadAction<AuthReturned>[][];

    expect(thunks.updateUser.pending.match(pendingAction)).toBe(true);
    expect(thunks.updateUser.fulfilled.match(fulfilledAction)).toBe(true);

    const pendingState = reducer(authenticatedState, pendingAction);
    const fulfilledState = reducer(pendingState, fulfilledAction);

    expect(pendingState).toMatchObject<AuthSliceState>({
      ...authenticatedState,
      status: 'pending',
    });
    expect(fulfilledState).toMatchObject<AuthSliceState>({
      status: 'fulfilled',
      token: fulfilledAction.payload.token,
      user: fulfilledAction.payload.user,
    });
  });

  it('should handle the errors of the update', async () => {
    const dispatch = vi.fn();
    const thunk = thunks.updateUser({
      password: 'pwd',
    });

    setToken(authenticatedState.token);
    await thunk(dispatch, () => ({ auth: authenticatedState }), {
      auth: authApi,
    });

    expect(dispatch).toHaveBeenCalledTimes(2);

    const [[pendingAction], [rejectedAction]] = dispatch.mock
      .calls as PayloadAction<
      undefined,
      string,
      unknown,
      SerializedValidationError
    >[][];

    expect(thunks.updateUser.pending.match(pendingAction)).toBe(true);
    expect(thunks.updateUser.rejected.match(rejectedAction)).toBe(true);

    const pendingState = reducer(authenticatedState, pendingAction);
    const rejectedState = reducer(pendingState, rejectedAction);

    expect(pendingState).toMatchObject<AuthSliceState>({
      ...authenticatedState,
      status: 'pending',
    });
    expect(rejectedState).toMatchObject<AuthSliceState>({
      status: 'rejected',
      errors: rejectedAction.error.errors,
    });
  });

  it('should handle the logout', () => {
    const dispatch = vi.fn();
    const thunk = thunks.logout();

    thunk(dispatch, () => ({ auth: authenticatedState }), {
      auth: authApi,
    });

    expect(dispatch).toHaveBeenCalledTimes(1);

    const [[logoutAction]] = dispatch.mock.calls as PayloadAction[][];

    expect(logoutAction).toHaveProperty('type', `${name}/logout`);

    expect(reducer(authenticatedState, logoutAction)).toEqual(initialState);
  });
});
