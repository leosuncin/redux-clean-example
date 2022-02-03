import { faker } from '@faker-js/faker';
import { screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import { setupServer } from 'msw/node';

import type { Login } from '~/app/ports/auth';
import LoginPage from '~/ui/auth/LoginPage';
import { loginHandler } from '~/utils/mocks/auth';
import { render } from '~/utils/test';

const server = setupServer(loginHandler);

describe('<LoginPage />', () => {
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

  it('should render', () => {
    render(<LoginPage />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Sign In',
    );
  });

  it('should login an existing user', async () => {
    const data: Login = {
      email: 'admin@example.com',
      password: 'Pa$$w0rd!',
    };
    render(<LoginPage />);

    user.type(screen.getByRole('textbox', { name: /Email/iu }), data.email);
    user.type(screen.getByPlaceholderText(/Password/iu), data.password);
    user.click(screen.getByRole('button', { name: /Sign in/iu }));

    expect(screen.getByRole('button', { name: /Sign in/iu })).toBeDisabled();

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /Sign in/iu }),
      ).not.toBeDisabled();
    });

    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('should show the errors of a failed login', async () => {
    const data: Login = {
      email: 'admin@example.com',
      password: faker.internet.password(),
    };

    render(<LoginPage />);

    user.type(screen.getByRole('textbox', { name: /Email/iu }), data.email);
    user.type(screen.getByPlaceholderText(/Password/iu), data.password);
    user.click(screen.getByRole('button', { name: /Sign in/iu }));

    await waitFor(() => {
      expect(screen.getByRole('button')).not.toBeDisabled();
    });

    expect(screen.getByRole('list')).toBeVisible();
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });
});
