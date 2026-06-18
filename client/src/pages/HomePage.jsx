import { useNavigate } from "react-router-dom";

function HomePage() {

  const navigate = useNavigate();

  return (
    <div className="landing">

      <h1>
        🌾 Farmer Land Registry
      </h1>

      <p>
        GIS Based Agricultural
        Land Management System
      </p>

      <button
        onClick={() =>
          navigate("/registry")
        }
      >
        Get Started
      </button>

    </div>
  );
}

export default HomePage;