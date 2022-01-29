import type { KyInstance } from 'ky/distribution/types/ky';

import type { AuthApi, AuthResponse } from '~/app/ports/auth';

export type CreateAuthApiParams = { client: KyInstance };

export const createAuthApi = ({ client }: CreateAuthApiParams): AuthApi => {
  return {
    async register(payload) {
      const {
        user: { token, ...user },
      } = await client
        .post('/users', {
          json: { user: payload },
        })
        .json<AuthResponse>();

      return { token, user };
    },
    async login(payload) {
      const {
        user: { token, ...user },
      } = await client
        .post('/users/login', {
          json: { user: payload },
        })
        .json<AuthResponse>();

      return { token, user };
    },
    async getUser() {
      const {
        user: { token, ...user },
      } = await client.get('/user').json<AuthResponse>();

      return { token, user };
    },
    async updateUser(payload) {
      const {
        user: { token, ...user },
      } = await client
        .put('/user', {
          json: { user: payload },
        })
        .json<AuthResponse>();

      return { token, user };
    },
  };
};
