import { rest } from 'msw';

import type { Register } from '~/app/ports/auth';
import { db } from '~/utils/mocks/db';

function generateToken(username: string): string {
  return btoa(JSON.stringify({ sub: username }));
}

export const registerHandler = rest.post<{ user: Register }>(
  `${import.meta.env.VITE_BACKEND_URL}/users`,
  (request, response, context) => {
    const user = db.user.create(request.body.user);
    const token = generateToken(user.username);
    const errors: Record<string, string[]> = {};

    if (!request.body.user.email) {
      errors.email = ["can't be blank"];
    }

    if (!request.body.user.email.includes('@')) {
      errors.email = ['is invalid'];
    }

    if (!request.body.user.password) {
      errors.password = ["can't be blank"];
    }

    if (request.body.user.password.length < 8) {
      errors.password = ['is too short (minimum is 8 characters)'];
    }

    if (request.body.user.password.length > 72) {
      errors.password = ['is too long (maximum is 72 characters)'];
    }

    if (!request.body.user.username) {
      errors.username = ["can't be blank"];
    }

    if (request.body.user.username.length === 0) {
      errors.username = ['is too short (minimum is 1 character)'];
    }

    if (request.body.user.username.length > 20) {
      errors.username = ['is too long (maximum is 20 characters)'];
    }

    if (Object.keys(errors).length > 0) {
      return response(
        context.status(422),
        context.json({ errors }),
        context.delay()
      );
    }

    return response(
      context.json({ user: { ...user, token } }),
      context.delay()
    );
  }
);
