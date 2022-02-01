import { createAsyncThunkFactory } from "redux-clean-architecture/createAsyncThunks";
import type { AsyncThunkConfig } from "./store";

export const { createAsyncThunk } = createAsyncThunkFactory<AsyncThunkConfig>();

