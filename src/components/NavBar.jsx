import { Link, useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav
      style={{
        padding: "10px 20px",
        borderBottom: "1px solid #ccc",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {/* Left: Navigation Links */}
      <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
        <Link to="/">Home</Link>

        {!isLoggedIn ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <Link to="/trips">Trips</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>

      {/* Right: Currency Converter Button (only if logged in) */}
      {isLoggedIn && (
        <button
          onClick={() => navigate("/currency")}
          style={{
            padding: "6px 10px",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Currency Converter
        </button>
      )}
    </nav>
  );
}

export default NavBar;
