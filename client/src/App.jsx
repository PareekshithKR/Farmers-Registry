import {
  Routes,
  Route
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import RegistryPage from "./pages/RegistryPage";

function App() {
  return (
    <Routes>

      <Route
        path="/"
        element={<HomePage />}
      />

      <Route
        path="/registry"
        element={<RegistryPage />}
      />

    </Routes>
  );
}

export default App;