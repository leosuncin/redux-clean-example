import type { EntityState, PayloadAction } from '@reduxjs/toolkit';
import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';

import type { CreateTodo, Todo, UpdateTodo } from '../ports/todomvc';
import type { AppState, AppThunk, AsyncThunkConfig } from '../store';

export enum Filter {
  ALL_TODOS = 'all',
  ACTIVE_TODOS = 'active',
  COMPLETED_TODOS = 'completed',
}

export type TodoMvcState = {
  filter: Filter;
  status: 'idle' | 'loading' | 'failed';
} & EntityState<Todo>;

export const adapter = createEntityAdapter<Todo>({
  selectId: (todo) => todo.id,
});

export const initialState: TodoMvcState = adapter.getInitialState({
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
        (action) => action.type.endsWith('pending'),
        (state) => {
          state.status = 'loading';
        },
      )
      .addMatcher(
        (action) => action.type.endsWith('rejected'),
        (state) => {
          state.status = 'failed';
        },
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
      0,
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
    },
  ),
};

export const thunks = {
  fetchTodoList: createAsyncThunk<Todo[], undefined, AsyncThunkConfig>(
    ``,
    async (_, { extra, signal }) => extra.todoApi.listTodo(signal),
  ),
  addTodo: createAsyncThunk<Todo, CreateTodo, AsyncThunkConfig>(
    `${name}/addTodo`,
    async (newTodo, { extra }) => extra.todoApi.createTodo(newTodo),
  ),
  toggleAll(completed: boolean): AppThunk<Promise<unknown[]>> {
    return (dispatch, getState) => {
      const todos = todoSelectors.selectAll(getState());

      return Promise.all(
        todos.map((todo) => dispatch(thunks.update({ ...todo, completed }))),
      );
    };
  },
  toggle: createAsyncThunk<Todo, Todo['id'], AsyncThunkConfig>(
    `${name}/toggle`,
    async (todoId, { extra, getState }) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const todo = todoSelectors.selectById(getState(), todoId)!;

      return extra.todoApi.updateTodo(todoId, {
        ...todo,
        completed: !todo?.completed,
      });
    },
  ),
  destroy: createAsyncThunk<unknown, Todo['id'], AsyncThunkConfig>(
    `${name}/destroy`,
    async (todoId, { extra }) => extra.todoApi.deleteTodo(todoId),
  ),
  update: createAsyncThunk<
    Todo,
    Pick<Todo, 'id'> & Partial<UpdateTodo>,
    AsyncThunkConfig
  >(`${name}/update`, async (payload, { extra, getState }) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const todo = todoSelectors.selectById(getState(), payload.id)!;

    return extra.todoApi.updateTodo(payload.id, { ...todo, ...payload });
  }),
  clearCompleted(): AppThunk<Promise<unknown[]>> {
    return (dispatch, getState) => {
      const todos = todoSelectors.selectAll(getState());

      return Promise.all(
        todos
          .filter((todo) => todo.completed)
          .map((todo) => dispatch(thunks.destroy(todo.id))),
      );
    };
  },
  changeFilter(filter: Filter): AppThunk<unknown> {
    return (dispatch) => dispatch(actions.changeFilter(filter));
  },
};
