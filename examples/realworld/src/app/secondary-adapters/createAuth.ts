import { HTTPError } from 'ky';
import type { KyInstance } from 'ky/distribution/types/ky';

import type { AuthApi, AuthResponse } from '~/app/ports/auth';
import { ValidationError } from '~/utils/serializeError';

export type CreateAuthApiParams = { client: KyInstance };

export const createAuthApi = ({ client }: CreateAuthApiParams): AuthApi => {
  return {
    async register(payload) {
      try {
        const {
          user: { token, ...user },
        } = await client
          .post('users', {
            json: { user: payload },
          })
          .json<AuthResponse>();

        return { token, user };
      } catch (error) {
        if (error instanceof HTTPError && error.response.status === 422) {
          const { errors } = await error.response.json();

          throw new ValidationError(error.message, errors);
        }

        throw error;
      }
    },
    async login(payload) {
      try {
        const {
          user: { token, ...user },
        } = await client
          .post('users/login', {
            json: { user: payload },
          })
          .json<AuthResponse>();

        return { token, user };
      } catch (error) {
        if (error instanceof HTTPError && error.response.status === 422) {
          const { errors } = await error.response.json();

          throw new ValidationError(error.message, errors);
        }

        throw error;
      }
    },
    async getUser() {
      const {
        user: { token, ...user },
      } = await client.get('user').json<AuthResponse>();

      return { token, user };
    },
    async updateUser(payload) {
      try {
        const {
          user: { token, ...user },
        } = await client
          .put('user', {
            json: { user: payload },
          })
          .json<AuthResponse>();

        return { token, user };
      } catch (error) {
        if (error instanceof HTTPError && error.response.status === 422) {
          const { errors } = await error.response.json();

          throw new ValidationError(error.message, errors);
        }

        throw error;
      }
    },
  };
};
