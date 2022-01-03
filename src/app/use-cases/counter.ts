import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { AppThunk, AppState } from '../store';

export interface CounterState {
  value: number;
  status: 'idle' | 'loading' | 'failed';
}

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
    incrementAsyncStarted(state) {
      state.status = 'loading';
    },
    incrementAsyncCompleted(state, action: PayloadAction<number>) {
      state.status = 'idle';
      state.value += action.payload;
    },
    incrementAsyncFailed(state) {
      state.status = 'failed';
    },
  },
});

export const selectors = {
  count: (state: AppState) => state.counter.value,
};

export const thunks = {
  incrementAsync(amount: number): AppThunk {
    return async (dispatch, _, thunkExtraArgument) => {
      try {
        dispatch(actions.incrementAsyncStarted);

        const { data } = await thunkExtraArgument.counterApi.fetchCount(amount);

        dispatch(actions.incrementAsyncCompleted(data));
      } catch (error) {
        dispatch(actions.incrementAsyncFailed());
      }
    };
  },
  incrementIfOdd(amount: number): AppThunk {
    return (dispatch, getState) => {
      const currentValue = selectors.count(getState());

      if (currentValue % 2 === 1) {
        dispatch(actions.incrementByAmount(amount));
      }
    };
  },
  increment(): AppThunk {
    return (dispatch) => {
      dispatch(actions.increment());
    };
  },
  decrement(): AppThunk {
    return (dispatch) => {
      dispatch(actions.decrement());
    };
  },
  incrementByAmount(amount: number): AppThunk {
    return (dispatch) => {
      dispatch(actions.incrementByAmount(amount));
    };
  },
};
