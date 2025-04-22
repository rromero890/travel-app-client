import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Trips from "./pages/Trips";
import Home from "./pages/Home";
import NavBar from "./components/NavBar";
import CurrencyPage from "./pages/CurrencyPage";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800 font-sans">
      <NavBar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={
            <div className="max-w-4xl mx-auto px-4 py-8">
              <Login />
            </div>
          } />
          <Route path="/register" element={
            <div className="max-w-4xl mx-auto px-4 py-8">
              <Register />
            </div>
          } />
          <Route path="/currency" element={
            <div className="max-w-4xl mx-auto px-4 py-8">
              <CurrencyPage />
           </div>
          } />

          <Route path="/trips" element={
            <div className="max-w-4xl mx-auto px-4 py-8">
              <Trips />
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;
