import { faker } from '@faker-js/faker';
import { render, screen, waitFor } from '@testing-library/react';
import user from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { mockFetch } from 'vi-fetch';

import App from './App';
import type { Todo, TodoId } from './app/ports/todomvc';
import { createStore } from './app/store';

const wrapper: React.FC = ({ children }) => {
  const store = createStore({
    todomvc: {
      baseApi: import.meta.env.VITE_BASE_API ?? 'http://localhost:4000',
    },
  });
  return <Provider store={store}>{children}</Provider>;
};
const todoList = [
  {
    title: 'Learn @redux/toolkit',
    completed: true,
    id: 1 as TodoId,
  },
  {
    title: 'Give redux-clean-architecture a try',
    completed: false,
    id: 2 as TodoId,
  },
];

describe('<App />', () => {
  beforeEach(() => {
    mockFetch.clearAll();
  });

  it('should render', async () => {
    mockFetch('GET', /.*\/todo$/u).willResolve(todoList);

    render(<App />, { wrapper });

    expect(screen.getByRole('heading', { name: 'todos' })).toBeDefined();
  });

  it('should fetch the list of todo', async () => {
    const mock = mockFetch('GET', /.*\/todo$/u).willResolve(todoList);

    render(<App />, { wrapper });

    await waitFor(() => {
      expect(mock).toHaveFetched();
    });

    todoList.forEach((todo) => {
      expect(screen.getByText(todo.title)).toBeDefined();
    });
  });

  it('should add one todo', async () => {
    const todo: Todo = {
      id: Date.now() as TodoId,
      title: faker.lorem.sentence(),
      completed: true,
    };
    const mockedList = mockFetch('GET', /.*\/todo$/u).willResolve(todoList);
    const mockedCreate = mockFetch('POST', /.*\/todo$/u).willResolve(todo);

    render(<App />, { wrapper });

    await waitFor(() => {
      expect(mockedList).toHaveFetched();
    });

    user.type(
      screen.getByRole('textbox', { name: 'Add a new todo' }),
      `${todo.title}{enter}`
    );

    await waitFor(() => {
      expect(mockedCreate).toHaveFetched();
    });

    expect(screen.getByText(todo.title)).toBeDefined();
  });

  it('should toggle one todo', async () => {
    const mockedList = mockFetch('GET', /.*\/todo$/u).willResolve(todoList);
    const mockedUpdate = mockFetch('PUT', /.*\/todo\/\d+$/u).willResolve({
      ...todoList[0],
      completed: !todoList[0].completed,
    });

    render(<App />, { wrapper });

    await waitFor(() => {
      expect(mockedList).toHaveFetched();
    });

    expect(
      screen.getByRole<HTMLInputElement>('checkbox', {
        name: `Toggle ${todoList[0].title}`,
      }).checked
    ).toBe(todoList[0].completed);

    user.click(
      screen.getByRole('checkbox', { name: `Toggle ${todoList[0].title}` })
    );

    await waitFor(() => {
      expect(mockedUpdate).toHaveFetched();
    });

    expect(
      screen.getByRole<HTMLInputElement>('checkbox', {
        name: `Toggle ${todoList[0].title}`,
      }).checked
    ).toBe(!todoList[0].completed);
  });

  it('should update one todo', async () => {
    const todo: Todo = {
      ...todoList[0],
      title: faker.lorem.sentence(),
    };
    const mockedList = mockFetch('GET', /.*\/todo$/u).willResolve(todoList);
    const mockedUpdate = mockFetch('PUT', /.*\/todo\/\d+$/u).willResolve(todo);

    render(<App />, { wrapper });

    await waitFor(() => {
      expect(mockedList).toHaveFetched();
    });

    user.dblClick(screen.getByText(todoList[0].title));
    user.type(
      screen.getByRole('textbox', { name: `Edit ${todoList[0].title}` }),
      `${todo.title}{enter}`
    );

    await waitFor(() => {
      expect(mockedUpdate).toHaveFetched();
    });

    expect(screen.getByText(todo.title)).toBeDefined();
  });

  it('should destroy one todo', async () => {
    const mockedList = mockFetch('GET', /.*\/todo$/u).willResolve(todoList);
    const mockedDestroy = mockFetch('DELETE', /.*\/todo\/\d+$/u).willResolve();

    render(<App />, { wrapper });

    await waitFor(() => {
      expect(mockedList).toHaveFetched();
    });

    user.click(
      screen.getByRole('button', { name: `Remove ${todoList[1].title}` })
    );

    await waitFor(() => {
      expect(mockedDestroy).toHaveFetched();
    });

    expect(screen.queryByText(todoList[1].title)).toBeNull();
  });

  it('should toggle all todo', async () => {
    const completed = true;
    const regex = /.*\/todo\/(?<id>\d+)$/u;
    const mockedList = mockFetch('GET', /.*\/todo$/u).willResolve(todoList);
    const mockedUpdate = mockFetch('PUT', /.*\/todo\/\d+$/u).willDo((url) => {
      /* eslint-disable @typescript-eslint/no-non-null-assertion */
      const matches = regex.exec(url.pathname)!;
      const todo = todoList.find(
        (todo) => todo.id === Number(matches.groups!.id)
      )!;

      return {
        body: {
          ...todo,
          completed,
        },
      };
      /* eslint-enable @typescript-eslint/no-non-null-assertion */
    });

    render(<App />, { wrapper });

    await waitFor(() => {
      expect(mockedList).toHaveFetched();
    });

    user.click(screen.getByRole('checkbox', { name: 'Toggle all' }));

    await waitFor(() => {
      expect(mockedUpdate).toHaveFetchedTimes(todoList.length);
    });

    expect(
      todoList.every(
        (todo) =>
          screen.getByRole<HTMLInputElement>('checkbox', {
            name: `Toggle ${todo.title}`,
          }).checked === completed
      )
    ).toBe(true);
  });

  it('should clear all completed', async () => {
    const completedCount = todoList.filter(({ completed }) => completed).length;
    const mockedList = mockFetch('GET', /.*\/todo$/u).willResolve(todoList);
    const mockedDestroy = mockFetch('DELETE', /.*\/todo\/\d+$/u).willResolve();

    render(<App />, { wrapper });

    await waitFor(() => {
      expect(mockedList).toHaveFetched();
    });

    user.click(screen.getByRole('button', { name: 'Clear completed' }));

    await waitFor(() => {
      expect(mockedDestroy).toHaveFetchedTimes(completedCount);
    });

    expect(
      todoList
        .filter(({ completed }) => completed)
        .every((todo) => !document.contains(screen.queryByText(todo.title)))
    ).toBe(true);
  });
});
