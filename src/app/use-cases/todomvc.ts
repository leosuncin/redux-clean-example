import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppState, AppThunk } from '../store';
import type { CreateTodo, Todo, TodoId } from '../ports/todomvc';

export enum Filter {
  ALL_TODOS = 'all',
  ACTIVE_TODOS = 'active',
  COMPLETED_TODOS = 'completed',
}

export interface TodoMvcState {
  items: Todo[];
  filter: Filter;
}

export const initialState: TodoMvcState = {
  items: [],
  filter: Filter.ALL_TODOS,
};

export const { actions, name, reducer } = createSlice({
  name: 'todomvc',
  initialState,
  reducers: {
    addTodo: {
      prepare(payload: CreateTodo) {
        return {
          payload: {
            id: (Math.random() * 1e3 + Date.now()) as TodoId,
            title: payload.title,
            completed: false,
          },
        };
      },
      reducer(state, action: PayloadAction<Todo>) {
        state.items.push(action.payload);
      },
    },
    toggleAll(state, action: PayloadAction<boolean>) {
      state.items = state.items.map((todo) => ({
        ...todo,
        completed: action.payload,
      }));
    },
    toggle(state, action: PayloadAction<TodoId>) {
      state.items = state.items.map((todo) =>
        todo.id === action.payload
          ? { ...todo, completed: !todo.completed }
          : todo
      );
    },
    destroy(state, action: PayloadAction<TodoId>) {
      state.items = state.items.filter((todo) => todo.id !== action.payload);
    },
    update(state, action: PayloadAction<Pick<Todo, 'id' | 'title'>>) {
      state.items = state.items.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, title: action.payload.title }
          : todo
      );
    },
    clearCompleted(state) {
      state.items = state.items.filter((todo) => !todo.completed);
    },
    changeFilter(state, action: PayloadAction<Filter>) {
      state.filter = action.payload;
    },
  },
});

const selectTodos = (state: AppState) => state.todomvc.items;
const selectFilter = (state: AppState) => state.todomvc.filter;

export const selectors = {
  all: selectTodos,
  filter: selectFilter,
  counter: createSelector(selectTodos, (todos) => {
    const activeTodoCount = todos.reduce(
      (accum, todo) => (todo.completed ? accum : accum + 1),
      0
    );
    const completedCount = todos.length - activeTodoCount;

    return { activeTodoCount, completedCount, allCount: todos.length };
  }),
  todos: createSelector(selectFilter, selectTodos, (filter, todos) => {
    return todos.filter((todo) => {
      switch (filter) {
        case Filter.ACTIVE_TODOS:
          return !todo.completed;
        case Filter.COMPLETED_TODOS:
          return todo.completed;
        default:
          return true;
      }
    });
  }),
};

export const thunks = {
  addTodo(newTodo: CreateTodo): AppThunk<unknown> {
    return (dispatch) => dispatch(actions.addTodo(newTodo));
  },
  toggleAll(completed: boolean): AppThunk<unknown> {
    return (dispatch) => dispatch(actions.toggleAll(completed));
  },
  toggle(todoId: TodoId): AppThunk<unknown> {
    return (dispatch) => dispatch(actions.toggle(todoId));
  },
  destroy(todoId: TodoId): AppThunk<unknown> {
    return (dispatch) => dispatch(actions.destroy(todoId));
  },
  update(payload: Pick<Todo, 'id' | 'title'>): AppThunk<unknown> {
    return (dispatch) => dispatch(actions.update(payload));
  },
  clearCompleted(): AppThunk<unknown> {
    return (dispatch) => dispatch(actions.clearCompleted());
  },
  changeFilter(filter: Filter): AppThunk<unknown> {
    return (dispatch) => dispatch(actions.changeFilter(filter));
  },
};
