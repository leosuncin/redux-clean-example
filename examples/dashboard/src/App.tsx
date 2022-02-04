import { keyframes, styled } from '@mui/material';
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import logo from '~/logo.svg';

const Wrapper = styled('div')`
  text-align: center;

  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`;

const Header = styled('header')`
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;

  button {
    font-size: calc(10px + 2vmin);
  }
`;

const LogoSpin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Logo = styled(`img`, {})`
  height: 40vmin;
  pointer-events: none;

  @media (prefers-reduced-motion: no-preference) {
    animation: ${LogoSpin} infinite 20s linear;
  }
`;

const Link = styled('a')`
  color: #61dafb;
`;

function App() {
  const [count, setCount] = useState(0);

  return (
    <Routes>
      <Route
        index
        element={
          <Wrapper>
            <Header>
              <Logo src={logo} alt="logo" />
              <p>Hello Vite + React!</p>
              <p>
                <button
                  type="button"
                  onClick={() => {
                    setCount((count) => count + 1);
                  }}
                >
                  count is: {count}
                </button>
              </p>
              <p>
                Edit <code>App.tsx</code> and save to test HMR updates.
              </p>
              <p>
                <Link
                  href="https://reactjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn React
                </Link>
                {' | '}
                <Link
                  href="https://vitejs.dev/guide/features.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Vite Docs
                </Link>
              </p>
            </Header>
          </Wrapper>
        }
      />
    </Routes>
  );
}

export default App;
