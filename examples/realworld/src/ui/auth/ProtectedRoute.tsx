import { type Location, useLocation, Navigate } from 'react-router-dom';

import { selectors, useAppSelector } from '~/ui/hooks';

function hasRedirectTo(
  state: unknown,
): state is { [key: string]: unknown; redirectTo: Location } {
  return state !== null && typeof state === 'object' && 'redirectTo' in state;
}

export function getRedirectToFromState(location: Location): string {
  return hasRedirectTo(location.state)
    ? location.state.redirectTo.pathname
    : '/';
}

function ProtectedRoute({ element }: { element: JSX.Element }) {
  const location = useLocation();
  const { isAuthenticated } = useAppSelector(selectors.auth.isAuthenticated);

  return isAuthenticated ? (
    element
  ) : (
    <Navigate to="/login" state={{ redirectTo: location }} />
  );
}

export default ProtectedRoute;
