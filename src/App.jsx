import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RegisterSuccess from "./pages/RegisterSuccess";
import Beranda from "./pages/Beranda";
import Histori from "./pages/Histori";
import Statistik from "./pages/Statistik";
import Profil from "./pages/Profil";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-success" element={<RegisterSuccess />} />
        <Route path="/beranda" element={<PrivateRoute><Beranda /></PrivateRoute>} />
        <Route path="/histori" element={<PrivateRoute><Histori /></PrivateRoute>} />
        <Route path="/statistik" element={<PrivateRoute><Statistik /></PrivateRoute>} />
        <Route path="/profil" element={<PrivateRoute><Profil /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
