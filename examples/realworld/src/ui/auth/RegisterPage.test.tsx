import { faker } from '@faker-js/faker';
import { screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import { setupServer } from 'msw/node';

import type { Register } from '~/app/ports/auth';
import RegisterPage from '~/ui/auth/RegisterPage';
import { registerHandler } from '~/utils/mocks/auth';
import { render } from '~/utils/test';

const server = setupServer(registerHandler);

describe('<RegisterPage />', () => {
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
    render(<RegisterPage />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Sign Up'
    );
  });

  it('should register a new user', async () => {
    const data: Register = {
      username: faker.internet.userName().toLowerCase(),
      email: faker.internet.email().toLowerCase(),
      password: faker.internet.password(),
    };
    render(<RegisterPage />);

    user.type(
      screen.getByRole('textbox', { name: /username/iu }),
      data.username
    );
    user.type(screen.getByRole('textbox', { name: /email/iu }), data.email);
    user.type(screen.getByPlaceholderText(/password/iu), data.password);
    user.click(screen.getByRole('button', { name: /sign up/iu }));

    expect(screen.getByRole('button', { name: /sign up/iu })).toBeDisabled();

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /sign up/iu })
      ).not.toBeDisabled();
    });

    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('should show the errors of a failed register', async () => {
    const data: Register = {
      username: 'admin',
      email: 'admin@example.com',
      password: faker.internet.password(),
    };

    render(<RegisterPage />);

    user.type(
      screen.getByRole('textbox', { name: /username/iu }),
      data.username
    );
    user.type(screen.getByRole('textbox', { name: /email/iu }), data.email);
    user.type(screen.getByPlaceholderText(/password/iu), data.password);
    user.click(screen.getByRole('button', { name: /sign up/iu }));

    await waitFor(() => {
      expect(screen.getByRole('button')).not.toBeDisabled();
    });

    expect(screen.getByRole('list')).toBeVisible();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });
});
