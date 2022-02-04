import { Routes, Route } from 'react-router-dom';

import DashboardContent from '~/ui/dashboard/DashboardContent';
import DashboardLayout from '~/ui/dashboard/DashboardLayout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<DashboardContent />} />
      </Route>
    </Routes>
  );
}

export default App;
