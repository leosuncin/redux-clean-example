import { useEffect } from 'react';

import type { UpdateUser } from '~/app/ports/auth';
import ListErrors from '~/ui/common/ListErrors';
import { useAppThunks, selectors, useAppSelector } from '~/ui/hooks';

function SettingsPage() {
  const { authThunks } = useAppThunks();
  const { isLoading } = useAppSelector(selectors.auth.isLoading);
  const { errors } = useAppSelector(selectors.auth.errors);
  const { user } = useAppSelector(selectors.auth.user);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries()) as UpdateUser;

    await authThunks.updateUser(payload);
  }

  useEffect(() => {
    void authThunks.getUser();
  }, [authThunks]);

  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>

            <ListErrors errors={errors} />

            <form onSubmit={handleSubmit}>
              <fieldset disabled={isLoading}>
                <fieldset className="form-group">
                  <input
                    className="form-control"
                    type="url"
                    placeholder="URL of profile picture"
                    aria-label="URL of profile picture"
                    name="image"
                    defaultValue={user.image ?? ''}
                  />
                </fieldset>

                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Username"
                    aria-label="Username"
                    name="username"
                    defaultValue={user.username}
                    max={30}
                  />
                </fieldset>

                <fieldset className="form-group">
                  <textarea
                    className="form-control form-control-lg"
                    rows={8}
                    placeholder="Short bio about you"
                    aria-label="Short bio about you"
                    name="bio"
                    defaultValue={user.bio ?? ''}
                  />
                </fieldset>

                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    autoComplete="email"
                    type="email"
                    placeholder="Email"
                    aria-label="Email"
                    name="email"
                    defaultValue={user.email}
                  />
                </fieldset>

                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="password"
                    autoComplete="new-password"
                    placeholder="New Password"
                    aria-label="New Password"
                    name="password"
                    min={8}
                    max={72}
                  />
                </fieldset>

                <button
                  className="btn btn-lg btn-primary pull-xs-right"
                  type="submit"
                >
                  Update Settings
                </button>
              </fieldset>
            </form>

            <hr />

            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => authThunks.logout()}
            >
              Or click here to logout.
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
