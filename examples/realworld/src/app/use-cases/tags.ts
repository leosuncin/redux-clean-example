import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { AppState, AsyncThunkConfig } from '~/app/store';

export type TagsSliceState = {
  status: 'pending' | 'fulfilled' | 'idle';
  list: string[];
};

export const initialState: TagsSliceState = {
  status: 'idle',
  list: [],
};

export const { actions, name, reducer } = createSlice({
  name: 'tags',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(thunks.getAll.pending, (state, action) => {
        state.status = action.meta.requestStatus;
      })
      .addCase(thunks.getAll.fulfilled, (state, action) => {
        state.status = action.meta.requestStatus;
        state.list = action.payload;
      });
  },
});

export const selectors = {
  isLoading: (state: AppState): boolean => state.auth.status === 'pending',
  tags: (state: AppState): string[] => state.tags.list,
};

export const thunks = {
  getAll: createAsyncThunk<string[], undefined, AsyncThunkConfig>(
    `${name}/getAll`,
    async (_, { extra, signal }) => extra.tags.getAll(signal),
  ),
};
