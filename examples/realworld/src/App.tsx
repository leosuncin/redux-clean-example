import { Routes, Route } from 'react-router-dom';

import Header from '~/ui/common/Header';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route index element={<h1>Conduit - Real World</h1>} />
      </Routes>
    </>
  );
}

export default App;
