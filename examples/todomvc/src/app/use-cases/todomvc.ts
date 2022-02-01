import {
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import { createAsyncThunk } from "../createAsyncThunk";

import { AppState, AppThunk, AsyncThunkConfig } from '../store';
import type { CreateTodo, Todo, TodoId, UpdateTodo } from '../ports/todomvc';

export enum Filter {
  ALL_TODOS = 'all',
  ACTIVE_TODOS = 'active',
  COMPLETED_TODOS = 'completed',
}

export interface TodoMvcState extends EntityState<Todo> {
  filter: Filter;
  status: 'idle' | 'loading' | 'failed';
}

const adapter = createEntityAdapter<Todo>({
  selectId: (todo) => todo.id,
});

export const initialState: TodoMvcState = adapter.getInitialState({
  items: [],
  filter: Filter.ALL_TODOS,
  status: 'idle',
});

export const { actions, name, reducer } = createSlice({
  name: 'todomvc',
  initialState,
  reducers: {
    changeFilter(state, action: PayloadAction<Filter>) {
      state.filter = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(thunks.fetchTodoList.fulfilled, (state, action) => {
      adapter.setAll(state, action);
      state.status = 'idle';
    });

    builder.addCase(thunks.addTodo.fulfilled, (state, action) => {
      adapter.addOne(state, action.payload);
      state.status = 'idle';
    });

    builder.addCase(thunks.toggle.fulfilled, (state, action) => {
      adapter.updateOne(state, {
        id: action.meta.arg,
        changes: action.payload,
      });
      state.status = 'idle';
    });

    builder.addCase(thunks.destroy.fulfilled, (state, action) => {
      adapter.removeOne(state, action.meta.arg);
      state.status = 'idle';
    });

    builder.addCase(thunks.update.fulfilled, (state, action) => {
      adapter.updateOne(state, {
        id: action.meta.arg.id,
        changes: action.payload,
      });
      state.status = 'idle';
    });

    builder
      .addMatcher(
        (action) => /pending$/.test(action.type),
        (state) => {
          state.status = 'loading';
        }
      )
      .addMatcher(
        (action) => /rejected$/.test(action.type),
        (state) => {
          state.status = 'failed';
        }
      );
  },
});

const todoSelectors = adapter.getSelectors((state: AppState) => state.todomvc);
const selectFilter = (state: AppState) => state.todomvc.filter;

export const selectors = {
  all: todoSelectors.selectAll,
  filter: selectFilter,
  counter: createSelector(todoSelectors.selectAll, (todos) => {
    const activeTodoCount = todos.reduce(
      (accum, todo) => (todo.completed ? accum : accum + 1),
      0
    );
    const completedCount = todos.length - activeTodoCount;

    return { activeTodoCount, completedCount, allCount: todos.length };
  }),
  todos: createSelector(
    selectFilter,
    todoSelectors.selectAll,
    (filter, todos) => {
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
    }
  ),
};

export const thunks = {
  ...createAsyncThunk()(
    `${name}/fetchTodoList`,
    async (_, { extra, signal }) => extra.todoApi.listTodo(signal)
  ),
  ...createAsyncThunk()(
    `${name}/addTodo`,
    async (newTodo: CreateTodo, { extra }) => extra.todoApi.createTodo(newTodo)
  ),
  toggleAll(completed: boolean): AppThunk<Promise<unknown[]>> {
    return (dispatch, getState) => {
      const todos = todoSelectors.selectAll(getState());

      return Promise.all(
        todos.map((todo) => dispatch(thunks.update({ ...todo, completed })))
      );
    };
  },
  ...createAsyncThunk()(
    `${name}/toggle`,
    async (todoId: Todo["id"], { extra, getState }) => {
      const todo = todoSelectors.selectById(getState(), todoId)!;

      return extra.todoApi.updateTodo(todoId, {
        ...todo,
        completed: !todo?.completed,
      });
    }
  ),
  ...createAsyncThunk()(
    `${name}/destroy`,
    async (todoId: Todo['id'], { extra }) => extra.todoApi.deleteTodo(todoId)
  ),
  ...createAsyncThunk()(`${name}/update`, async (payload: Pick<Todo, 'id'> & Partial<UpdateTodo>, { extra, getState }) => {
    const todo = todoSelectors.selectById(getState(), payload.id)!;

    return extra.todoApi.updateTodo(payload.id, { ...todo, ...payload });
  }),
  clearCompleted(): AppThunk<Promise<unknown[]>> {
    return (dispatch, getState) => {
      const todos = todoSelectors.selectAll(getState());

      return Promise.all(
        todos
          .filter((todo) => todo.completed)
          .map((todo) => dispatch(thunks.destroy(todo.id)))
      );
    };
  },
  changeFilter(filter: Filter): AppThunk<unknown> {
    return (dispatch) => dispatch(actions.changeFilter(filter));
  },
};
