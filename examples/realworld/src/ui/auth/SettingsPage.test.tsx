import { faker } from '@faker-js/faker';
import { screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import { setupServer } from 'msw/node';

import { createStore } from '~/app/store';
import SettingsPage from '~/ui/auth/SettingsPage';
import { client } from '~/utils/client';
import { getUserHandler, updateUserHandler } from '~/utils/mocks/auth';
import { render } from '~/utils/test';

const server = setupServer(getUserHandler, updateUserHandler);

describe('<SettingsPage />', () => {
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
    const store = createStore({
      client,
      preloadedState: {
        auth: {
          status: 'fulfilled',
          token: '{"sub":"admin"}',
          user: {
            username: 'admin',
            email: 'admin@example.com',
          },
        },
      },
    });

    render(<SettingsPage />, { store, initialEntries: ['/settings', '/'] });

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Your Settings'
    );
  });

  it('should update the user information', async () => {
    const store = createStore({
      client,
      preloadedState: {
        auth: {
          status: 'fulfilled',
          token: '{"sub":"username"}',
          user: {
            email: 'username@example.com',
            username: 'username',
            bio: 'I am nobody',
            image: 'https://static.productionready.io/images/smiley-cyrus.jpg',
          },
        },
      },
    });
    const data = {
      image: faker.internet.avatar(),
      bio: faker.hacker.phrase(),
    };

    render(<SettingsPage />, {
      store,
      initialEntries: ['/settings', '/'],
    });

    user.type(
      screen.getByRole('textbox', { name: 'URL of profile picture' }),
      data.image
    );
    user.type(
      screen.getByRole('textbox', { name: 'Short bio about you' }),
      data.bio
    );
    user.click(screen.getByRole('button', { name: /update settings/iu }));

    expect(
      screen.getByRole('button', { name: /update settings/iu })
    ).toBeDisabled();

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /update settings/iu })
      ).not.toBeDisabled();
    });

    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('should log out the current user', () => {
    const store = createStore({
      client,
      preloadedState: {
        auth: {
          status: 'fulfilled',
          token: '{"sub":"admin"}',
          user: {
            username: 'admin',
            email: 'admin@example.com',
          },
        },
      },
    });

    render(<SettingsPage />, { store });

    user.click(
      screen.getByRole('button', { name: /or click here to logout/iu })
    );

    expect(store.getState().auth).not.toHaveProperty('user');
    expect(store.getState().auth).not.toHaveProperty('token');
  });
});
