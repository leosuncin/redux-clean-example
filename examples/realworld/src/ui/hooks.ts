import {
  type TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from 'react-redux';

import {
  type AppDispatch,
  type AppState,
  getAutoDispatchThunks,
} from '~/app/store';

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

export function useAppThunks() {
  const dispatch = useAppDispatch();

  return getAutoDispatchThunks(dispatch);
}

export { selectors } from '~/app/store';
