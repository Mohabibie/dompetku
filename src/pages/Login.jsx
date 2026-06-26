import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";

export default function Login() {
  const navigate = useNavigate();
  // State untuk menyimpan input form
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Username dan kata sandi harus diisi!");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Firebase Auth: login dengan email dan password
      // Username di sini kita perlakukan sebagai email
      await signInWithEmailAndPassword(auth, username, password);
      navigate("/beranda");
    } catch (err) {
      setError("Username atau kata sandi salah!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container relative bg-white min-h-screen flex flex-col">
      {/* Blob atas */}
      <div
        className="absolute top-0 left-0 right-0 h-56 bg-hijau"
        style={{ borderRadius: "0 0 50% 50% / 0 0 40% 40%" }}
      />

      {/* Konten */}
      <div className="relative z-10 flex flex-col px-8 pt-64">
        <h1 className="text-4xl font-bold mb-8">
          <span className="text-hijau">Log</span>
          <span className="text-gelap">in</span>
        </h1>

        {/* Input Username */}
        <input
          type="text"
          placeholder="Masukkan Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-gray-300 rounded-2xl px-5 py-4 mb-4 text-sm focus:outline-none focus:border-hijau"
        />

        {/* Input Password */}
        <input
          type="password"
          placeholder="Masukkan kata sandi"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 rounded-2xl px-5 py-4 mb-2 text-sm focus:outline-none focus:border-hijau"
        />

        <p className="text-xs text-gray-500 mb-4 underline cursor-pointer">
          Lupa kata sandi?
        </p>

        {/* Pesan error */}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      </div>

      {/* Blob tengah bawah */}
      <div className="flex-1" />
      <div
        className="absolute bottom-24 left-0 right-0 h-40 bg-hijau"
        style={{ borderRadius: "50% 50% 0 0 / 40% 40% 0 0" }}
      />

      {/* Tombol */}
      <div className="relative z-10 flex gap-4 px-8 pb-10">
        <button
          onClick={() => navigate("/register")}
          className="flex-1 bg-merah text-white rounded-full py-4 font-semibold text-lg"
        >
          Sign-up
        </button>
        <button
          onClick={handleLogin}
          disabled={loading}
          className="flex-1 bg-gelap text-white rounded-full py-4 font-semibold text-lg disabled:opacity-60"
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </div>
    </div>
  );
}
