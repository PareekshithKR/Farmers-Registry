import {
  Routes,
  Route
} from "react-router-dom";

import HomePage from "./HomePage.jsx/HomePage";
import RegistryPage from "./HomePage.jsx/RegistryPage";
import AdminDashboard
from "./HomePage.jsx/AdminDashboard";
import LoginPage from "./HomePage.jsx/LoginPage";

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

      <Route
  path="/admin"
  element={<AdminDashboard />}
/>

<Route
  path="/login"
  element={<LoginPage />}
/>

    </Routes>

    
  );
}

export default App;