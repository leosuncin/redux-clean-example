import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import {
  AppDispatch,
  AppState,
  getAutoDispatchThunks,
  selectors,
} from '../app/store';

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

export function useAppThunks() {
  const dispatch = useAppDispatch();

  return getAutoDispatchThunks(dispatch);
}

export { selectors };
