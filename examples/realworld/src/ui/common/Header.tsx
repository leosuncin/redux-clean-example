import { Link } from 'react-router-dom';

import type { User } from '~/app/ports/auth';
import { selectors, useAppSelector } from '~/ui/hooks';

function LoggedOutNavbar() {
  return (
    <ul className="nav navbar-nav pull-xs-right">
      <li className="nav-item">
        <Link to="/" className="nav-link">
          Home
        </Link>
      </li>

      <li className="nav-item">
        <Link to="/login" className="nav-link">
          Sign in
        </Link>
      </li>

      <li className="nav-item">
        <Link to="/register" className="nav-link">
          Sign up
        </Link>
      </li>
    </ul>
  );
}

export type Props = {
  currentUser: User;
};

function LoggedInNavbar({ currentUser }: Props) {
  return (
    <ul className="nav navbar-nav pull-xs-right">
      <li className="nav-item">
        <Link to="/" className="nav-link">
          Home
        </Link>
      </li>

      <li className="nav-item">
        <Link to="/editor" className="nav-link">
          <i className="ion-compose" />
          &nbsp;New Post
        </Link>
      </li>

      <li className="nav-item">
        <Link to="/settings" className="nav-link">
          <i className="ion-gear-a" />
          &nbsp;Settings
        </Link>
      </li>

      <li className="nav-item">
        <Link to={`/@${currentUser.username}`} className="nav-link">
          <img
            src={
              currentUser.image ??
              'https://static.productionready.io/images/smiley-cyrus.jpg'
            }
            className="user-pic"
            alt={currentUser.username}
          />
          {currentUser.username}
        </Link>
      </li>
    </ul>
  );
}

function Header() {
  const { user: currentUser } = useAppSelector(selectors.auth.user);

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link to="/" className="navbar-brand">
          conduit
        </Link>

        {currentUser ? (
          <LoggedInNavbar currentUser={currentUser} />
        ) : (
          <LoggedOutNavbar />
        )}
      </div>
    </nav>
  );
}

export default Header;
