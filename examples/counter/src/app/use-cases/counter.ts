import {
  type PayloadAction,
  createAsyncThunk,
  createSlice,
} from '@reduxjs/toolkit';

import type { AppThunk, AppState, AsyncThunkConfig } from '../store';

export type CounterState = {
  value: number;
  status: 'idle' | 'loading' | 'failed';
};

export const initialState: CounterState = {
  value: 0,
  status: 'idle',
};

export const { reducer, actions, name } = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment(state) {
      state.value += 1;
    },
    decrement(state) {
      state.value -= 1;
    },
    incrementByAmount(state, action: PayloadAction<number>) {
      state.value += action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(thunks.incrementAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(thunks.incrementAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.value += action.payload;
      })
      .addCase(thunks.incrementAsync.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const selectors = {
  count: (state: AppState): number => state.counter.value,
};

export const thunks = {
  incrementAsync: createAsyncThunk<number, number, AsyncThunkConfig>(
    `${name}/incrementAsync`,
    async (amount, { extra }) => {
      const { data } = await extra.counterApi.fetchCount(amount);

      return data;
    },
  ),
  incrementIfOdd(amount: number): AppThunk<void> {
    return (dispatch, getState) => {
      const currentValue = selectors.count(getState());

      if (currentValue % 2 === 1) {
        dispatch(actions.incrementByAmount(amount));
      }
    };
  },
  increment(): AppThunk<void> {
    return (dispatch) => {
      dispatch(actions.increment());
    };
  },
  decrement(): AppThunk<void> {
    return (dispatch) => {
      dispatch(actions.decrement());
    };
  },
  incrementByAmount(amount: number): AppThunk<void> {
    return (dispatch) => {
      dispatch(actions.incrementByAmount(amount));
    };
  },
};
