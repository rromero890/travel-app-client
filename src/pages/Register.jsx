import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [phase, setPhase] = useState(""); // "", "registering", "redirecting"
  const navigate = useNavigate();

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setPhase("registering");

    try {
      await axios.post(`${baseURL}/api/auth/register`, { email, password });

      setSuccess("Registration successful!");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        setPhase("redirecting");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }, 2000);
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      setError(
        err.response?.data?.message || "Registration failed. Try again."
      );
      setPhase("");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
        Register
      </h2>

      {error && <p className="text-red-500 mb-3">{error}</p>}
      {success && <p className="text-green-600 mb-3">{success}</p>}

      {(phase === "registering" || phase === "redirecting") && (
        <div className="flex flex-col items-center py-4 animate-bounce">
          <span className="text-4xl">🛫</span>
          <p className="text-gray-600 mt-2">
            {phase === "registering"
              ? "Registering... Please wait"
              : "Taking off to login..."}
          </p>
        </div>
      )}

      {phase === "" && (
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Register
          </button>
        </form>
      )}
    </div>
  );
}

export default Register;
