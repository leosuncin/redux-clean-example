import { Routes, Route } from 'react-router-dom';

import LoginPage from '~/ui/auth/LoginPage';
import ProtectedRoute from '~/ui/auth/ProtectedRoute';
import RegisterPage from '~/ui/auth/RegisterPage';
import SettingsPage from '~/ui/auth/SettingsPage';
import Header from '~/ui/common/Header';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route index element={<h1>Conduit - Real World</h1>} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route
          path="settings"
          element={<ProtectedRoute element={<SettingsPage />} />}
        />
      </Routes>
    </>
  );
}

export default App;
