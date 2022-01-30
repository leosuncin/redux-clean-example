import { Routes, Route } from 'react-router-dom';

import RegisterPage from '~/ui/auth/RegisterPage';
import Header from '~/ui/common/Header';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route index element={<h1>Conduit - Real World</h1>} />
        <Route path="register" element={<RegisterPage />} />
      </Routes>
    </>
  );
}

export default App;
