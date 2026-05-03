import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase/config";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [konfirmasi, setKonfirmasi] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Validasi input
    if (!email || !username || !password || !konfirmasi) {
      setError("Semua field harus diisi!");
      return;
    }
    if (password !== konfirmasi) {
      setError("Kata sandi tidak cocok!");
      return;
    }
    if (password.length < 6) {
      setError("Kata sandi minimal 6 karakter!");
      return;
    }

    setLoading(true);
    setError("");
    try {
      // Firebase: buat akun baru
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Simpan username sebagai displayName
      await updateProfile(userCredential.user, { displayName: username });
      navigate("/register-success");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Email sudah digunakan!");
      } else if (err.code === "auth/invalid-email") {
        setError("Format email tidak valid!");
      } else {
        setError("Terjadi kesalahan. Coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container relative bg-white min-h-screen flex flex-col">
      {/* Blob atas */}
      <div
        className="absolute top-0 left-0 right-0 h-48 bg-hijau"
        style={{ borderRadius: "0 0 50% 50% / 0 0 40% 40%" }}
      />

      {/* Konten */}
      <div className="relative z-10 flex flex-col px-8 pt-52">
        <h1 className="text-4xl font-bold mb-8">
          <span className="text-hijau">Sign</span>
          <span className="text-gelap">up</span>
        </h1>

        <input
          type="email"
          placeholder="Masukkan e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded-2xl px-5 py-4 mb-4 text-sm focus:outline-none focus:border-hijau"
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-gray-300 rounded-2xl px-5 py-4 mb-4 text-sm focus:outline-none focus:border-hijau"
        />
        <input
          type="password"
          placeholder="Kata sandi"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 rounded-2xl px-5 py-4 mb-4 text-sm focus:outline-none focus:border-hijau"
        />
        <input
          type="password"
          placeholder="Ulangi kata sandi"
          value={konfirmasi}
          onChange={(e) => setKonfirmasi(e.target.value)}
          className="border border-gray-300 rounded-2xl px-5 py-4 mb-4 text-sm focus:outline-none focus:border-hijau"
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      </div>

      <div className="flex-1" />
      <div
        className="absolute bottom-24 left-0 right-0 h-40 bg-hijau"
        style={{ borderRadius: "50% 50% 0 0 / 40% 40% 0 0" }}
      />

      <div className="relative z-10 flex gap-4 px-8 pb-10">
        <button
          onClick={() => navigate("/login")}
          className="flex-1 bg-merah text-white rounded-full py-4 font-semibold text-lg"
        >
          Login
        </button>
        <button
          onClick={handleRegister}
          disabled={loading}
          className="flex-1 bg-gelap text-white rounded-full py-4 font-semibold text-lg disabled:opacity-60"
        >
          {loading ? "Loading..." : "Register"}
        </button>
      </div>
    </div>
  );
}
