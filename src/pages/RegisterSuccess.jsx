import { useNavigate } from "react-router-dom";

export default function RegisterSuccess() {
  const navigate = useNavigate();

  return (
    <div className="app-container relative overflow-hidden bg-white min-h-screen flex flex-col items-center justify-center">
      {/* Blob kiri */}
      <div
        className="absolute top-0 left-0 w-48 h-72 bg-hijau"
        style={{ clipPath: "ellipse(80% 90% at 10% 10%)" }}
      />
      {/* Blob kanan bawah */}
      <div
        className="absolute bottom-0 right-0 w-40 h-56 bg-hijau"
        style={{ borderRadius: "60% 0 0 0 / 40% 0 0 0" }}
      />
      <div
        className="absolute bottom-16 left-0 w-24 h-32 bg-hijau"
        style={{ borderRadius: "0 80% 80% 0" }}
      />

      {/* Pesan sukses */}
      <div className="relative z-10 text-center px-8">
        <h2 className="text-2xl font-bold text-hijau mb-2">Selamat akun anda</h2>
        <h2 className="text-2xl font-bold text-gelap mb-12">berhasil dibuat!</h2>
        <button
          onClick={() => navigate("/login")}
          className="bg-merah text-white rounded-full px-12 py-4 font-semibold text-lg"
        >
          Login
        </button>
      </div>
    </div>
  );
}
