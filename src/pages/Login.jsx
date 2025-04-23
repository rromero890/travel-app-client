import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${baseURL}/api/auth/login`, {
        email,
        password,
      });

      // Save token to local storage
      localStorage.setItem("token", res.data.token);

      // Redirect to trips page
      navigate("/trips");
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(
        err.response?.data?.message || "Login failed. Check your credentials."
      );
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-600">
        Login
      </h2>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
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
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
