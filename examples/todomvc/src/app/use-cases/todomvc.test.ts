import { faker } from '@faker-js/faker';
import { mockFetch } from 'vi-fetch';

import type { Todo, TodoId } from '../ports/todomvc';
import { createTodoApi } from '../secondary-adapters/createTodoApi';
import type { AppThunk } from '../store';
import {
  type TodoMvcState,
  adapter,
  initialState,
  reducer,
  selectors,
  thunks,
  Filter,
} from './todomvc';

const todoList: readonly Todo[] = Object.freeze([
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
]);

describe('TodoMVC reducer', () => {
  const todoApi = createTodoApi({
    baseApi: import.meta.env.VITE_BASE_API ?? 'http://localhost:4000',
  });
  const listState: TodoMvcState = adapter.setMany(
    { ...initialState, status: 'idle' },
    todoList
  );

  beforeEach(() => {
    mockFetch.clearAll();
  });

  it('should get the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle the fetch of the list of todo', async () => {
    const mock = mockFetch('GET', /.*\/todo$/u).willResolve(todoList);
    const dispatch = vi.fn();
    const thunk = thunks.fetchTodoList();

    await thunk(dispatch, () => ({ todomvc: initialState }), { todoApi });

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(mock).toHaveFetched();

    const [[pendingAction], [fulfilledAction]] = dispatch.mock.calls;

    expect(thunks.fetchTodoList.pending.match(pendingAction)).toBe(true);
    expect(thunks.fetchTodoList.fulfilled.match(fulfilledAction)).toBe(true);

    const loadingState = reducer(initialState, pendingAction);

    expect(loadingState).toMatchObject<TodoMvcState>({
      ...initialState,
      status: 'loading',
    });

    const idleState = reducer(loadingState, fulfilledAction);

    expect(idleState).toMatchObject<TodoMvcState>({
      ...adapter.setMany(loadingState, fulfilledAction.payload),
      status: 'idle',
    });
  });

  it('should handle the add of one todo', async () => {
    const todo: Todo = {
      id: todoList.length as TodoId,
      title: faker.lorem.sentence(),
      completed: true,
    };
    const mock = mockFetch('POST', /.*\/todo$/u).willResolve(todo);
    const dispatch = vi.fn();
    const thunk = thunks.addTodo({ title: todo.title });

    await thunk(dispatch, () => ({ todomvc: initialState }), { todoApi });

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(mock).toHaveFetched();

    const [[pendingAction], [fulfilledAction]] = dispatch.mock.calls;

    expect(thunks.addTodo.pending.match(pendingAction)).toBe(true);
    expect(thunks.addTodo.fulfilled.match(fulfilledAction)).toBe(true);

    const loadingState = reducer(initialState, pendingAction);

    expect(loadingState).toMatchObject<TodoMvcState>({
      ...initialState,
      status: 'loading',
    });

    const idleState = reducer(loadingState, fulfilledAction);

    expect(idleState).toMatchObject<TodoMvcState>({
      ...adapter.addOne(loadingState, fulfilledAction.payload),
      status: 'idle',
    });

    expect(selectors.all({ todomvc: idleState })).toContain(todo);
  });

  it('should handle the toggle of one todo', async () => {
    const mock = mockFetch('PUT', /.*\/todo\/\d+$/u).willResolve({
      ...todoList[0],
      completed: !todoList[0].completed,
    });
    const dispatch = vi.fn();
    const thunk = thunks.toggle(todoList[0].id);

    await thunk(dispatch, () => ({ todomvc: listState }), { todoApi });

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(mock).toHaveFetched();

    const [[pendingAction], [fulfilledAction]] = dispatch.mock.calls;

    expect(thunks.toggle.pending.match(pendingAction)).toBe(true);
    expect(thunks.toggle.fulfilled.match(fulfilledAction)).toBe(true);

    const loadingState = reducer(listState, pendingAction);

    expect(loadingState).toMatchObject<TodoMvcState>({
      ...listState,
      status: 'loading',
    });

    const idleState = reducer(loadingState, fulfilledAction);

    expect(idleState).toMatchObject<TodoMvcState>({
      ...adapter.updateOne(listState, {
        id: todoList[0].id,
        changes: fulfilledAction.payload,
      }),
      status: 'idle',
    });
  });

  it('should handle the update of one todo', async () => {
    const todo: Todo = {
      ...todoList[0],
      title: faker.lorem.sentence(),
    };
    const mock = mockFetch('PUT', /.*\/todo\/\d+$/u).willResolve({
      ...todoList[0],
      completed: !todoList[0].completed,
    });
    const dispatch = vi.fn();
    const thunk = thunks.update(todo);

    await thunk(dispatch, () => ({ todomvc: listState }), { todoApi });

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(mock).toHaveFetched();

    const [[pendingAction], [fulfilledAction]] = dispatch.mock.calls;

    expect(thunks.update.pending.match(pendingAction)).toBe(true);
    expect(thunks.update.fulfilled.match(fulfilledAction)).toBe(true);

    const loadingState = reducer(listState, pendingAction);

    expect(loadingState).toMatchObject<TodoMvcState>({
      ...listState,
      status: 'loading',
    });

    const idleState = reducer(loadingState, fulfilledAction);

    expect(idleState).toMatchObject<TodoMvcState>({
      ...adapter.updateOne(listState, {
        id: todoList[0].id,
        changes: fulfilledAction.payload,
      }),
      status: 'idle',
    });
  });

  it('should handle the destroy of one todo', async () => {
    const mock = mockFetch('DELETE', /.*\/todo\/\d+$/u).willResolve();
    const dispatch = vi.fn();
    const thunk = thunks.destroy(todoList[0].id);

    await thunk(dispatch, () => ({ todomvc: listState }), { todoApi });

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(mock).toHaveFetched();

    const [[pendingAction], [fulfilledAction]] = dispatch.mock.calls;

    expect(thunks.destroy.pending.match(pendingAction)).toBe(true);
    expect(thunks.destroy.fulfilled.match(fulfilledAction)).toBe(true);

    const loadingState = reducer(listState, pendingAction);

    expect(loadingState).toMatchObject<TodoMvcState>({
      ...listState,
      status: 'loading',
    });

    const idleState = reducer(loadingState, fulfilledAction);

    expect(idleState).toMatchObject<TodoMvcState>({
      ...adapter.removeOne(listState, todoList[0].id),
      status: 'idle',
    });
    expect(selectors.all({ todomvc: idleState })).not.contains(todoList[0]);
  });

  it('should handle toggle all todo', async () => {
    const completed = true;
    const regex = /.*\/todo\/(?<id>\d+)$/u;
    const mock = mockFetch('PUT', regex).willDo((url) => {
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
    const dispatch = vi.fn();
    const dispatch2 = vi.fn();
    const getState = vi.fn(() => ({ todomvc: listState }));
    const extraArgument = { todoApi };
    const thunk = thunks.toggleAll(completed);

    await thunk(dispatch, getState, extraArgument);

    expect(dispatch).toHaveBeenCalledTimes(todoList.length);

    await Promise.all(
      dispatch.mock.calls
        .flat<AppThunk<Promise<unknown>>[][]>()
        .map(async (update) => update(dispatch2, getState, extraArgument))
    );

    expect(mock).toFetchTimes(todoList.length);

    const finalState = dispatch2.mock.calls
      .flat()
      .reduce((state, action) => reducer(state, action), listState);

    expect(
      selectors
        .all({ todomvc: finalState })
        .every((todo) => todo.completed === completed)
    ).toBe(true);
  });

  it('should handle clear all completed', async () => {
    const mock = mockFetch('DELETE', /.*\/todo\/\d+$/u).willResolve();
    const dispatch = vi.fn();
    const dispatch2 = vi.fn();
    const getState = vi.fn(() => ({ todomvc: listState }));
    const extraArgument = { todoApi };
    const { completedCount } = selectors.counter({ todomvc: listState });
    const thunk = thunks.clearCompleted();

    await thunk(dispatch, getState, extraArgument);

    expect(dispatch).toHaveBeenCalledTimes(completedCount);

    await Promise.all(
      dispatch.mock.calls
        .flat<AppThunk<Promise<unknown>>[][]>()
        .map(async (update) => update(dispatch2, getState, extraArgument))
    );

    expect(mock).toFetchTimes(completedCount);

    const finalState = dispatch2.mock.calls
      .flat()
      .reduce((state, action) => reducer(state, action), listState);

    expect(selectors.counter({ todomvc: finalState })).toHaveProperty(
      'completedCount',
      0
    );
  });

  it('should handle the change of the filter', () => {
    const dispatch = vi.fn();
    const thunk = thunks.changeFilter(Filter.ACTIVE_TODOS);

    thunk(dispatch, () => ({ todomvc: listState }), { todoApi });

    expect(dispatch).toHaveBeenCalledTimes(1);

    const [[changeFilterAction]] = dispatch.mock.calls;

    expect(reducer(listState, changeFilterAction)).toHaveProperty(
      'filter',
      Filter.ACTIVE_TODOS
    );
  });

  it('should handle a failed request', async () => {
    const mock = mockFetch('GET', /.*\/todo$/u).willThrow('Network Error');
    const dispatch = vi.fn();
    const thunk = thunks.fetchTodoList();

    await thunk(dispatch, () => ({ todomvc: initialState }), { todoApi });

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(mock).toHaveFetched();

    const [[pendingAction], [rejectedAction]] = dispatch.mock.calls;

    expect(thunks.fetchTodoList.pending.match(pendingAction)).toBe(true);
    expect(thunks.fetchTodoList.rejected.match(rejectedAction)).toBe(true);

    const loadingState = reducer(initialState, pendingAction);

    expect(loadingState).toMatchObject<TodoMvcState>({
      ...initialState,
      status: 'loading',
    });

    const failedState = reducer(loadingState, rejectedAction);

    expect(failedState).toMatchObject<TodoMvcState>({
      ...loadingState,
      status: 'failed',
    });
  });
});
