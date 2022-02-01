import { Link, useLocation, useNavigate } from 'react-router-dom';

import type { Login } from '~/app/ports/auth';
import { getRedirectToFromState } from '~/ui/auth/ProtectedRoute';
import ListErrors from '~/ui/common/ListErrors';
import { useAppThunks, selectors, useAppSelector } from '~/ui/hooks';

function LoginPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    authThunks: { login },
  } = useAppThunks();
  const { isLoading } = useAppSelector(selectors.auth.isLoading);
  const { errors } = useAppSelector(selectors.auth.errors);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries()) as Login;
    const resultAction = await login(payload);

    if (resultAction.meta.requestStatus === 'fulfilled') {
      const redirectTo = getRedirectToFromState(location);

      navigate(redirectTo, { replace: true });
    }
  }

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign In</h1>
            <p className="text-xs-center">
              <Link to="/register">Need an account?</Link>
            </p>

            <ListErrors errors={errors} />

            <form onSubmit={handleSubmit}>
              <fieldset disabled={isLoading}>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="email"
                    placeholder="Email"
                    aria-label="Email"
                    autoComplete="email"
                    name="email"
                    required
                  />
                </fieldset>

                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Password"
                    aria-label="Password"
                    name="password"
                    min={8}
                    max={72}
                    required
                  />
                </fieldset>

                <button
                  className="btn btn-lg btn-primary pull-xs-right"
                  type="submit"
                >
                  Sign in
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
