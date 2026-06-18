import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter
} from "react-router-dom";

import App from "./App";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

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