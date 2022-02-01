import { Link } from 'react-router-dom';

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

function LoggedInNavbar() {
  const { user } = useAppSelector(selectors.auth.user);
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
        <Link to={`/@${user.username}`} className="nav-link">
          <img
            src={
              user.image ??
              'https://static.productionready.io/images/smiley-cyrus.jpg'
            }
            className="user-pic"
            alt={user.username}
          />
          {user.username}
        </Link>
      </li>
    </ul>
  );
}

function Header() {
  const { isAuthenticated } = useAppSelector(selectors.auth.isAuthenticated);

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <Link to="/" className="navbar-brand">
          conduit
        </Link>

        {isAuthenticated ? <LoggedInNavbar /> : <LoggedOutNavbar />}
      </div>
    </nav>
  );
}

export default Header;
