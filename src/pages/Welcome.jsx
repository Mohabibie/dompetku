import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="app-container relative overflow-hidden bg-white min-h-screen flex flex-col">
      {/* Blob kiri atas */}
      <div
        className="absolute top-0 left-0 w-48 h-72 bg-hijau"
        style={{
          borderRadius: "0 0 60% 0 / 0 0 40% 0",
          clipPath: "ellipse(80% 90% at 10% 10%)",
        }}
      />

      {/* Blob kanan atas */}
      <div
        className="absolute top-0 right-0 w-32 h-48 bg-hijau"
        style={{ borderRadius: "0 0 0 80%" }}
      />

      {/* Teks Welcome di tengah */}
      <div className="flex-1 flex items-center justify-center">
        <h1 className="text-5xl font-bold">
          <span className="text-hijau">Welco</span>
          <span className="text-gelap">me</span>
        </h1>
      </div>

      {/* Blob bawah kiri */}
      <div
        className="absolute bottom-16 left-0 w-24 h-32 bg-hijau"
        style={{ borderRadius: "0 80% 80% 0" }}
      />

      {/* Blob bawah kanan */}
      <div
        className="absolute bottom-0 right-0 w-40 h-56 bg-hijau"
        style={{ borderRadius: "60% 0 0 0 / 40% 0 0 0" }}
      />

      {/* Tombol Geser untuk mulai */}
      <div className="relative z-10 flex items-center justify-between mx-6 mb-10 bg-white rounded-full shadow-lg px-6 py-4">
        <span className="text-gelap font-medium">Geser untuk mulai</span>
        <button
          onClick={() => navigate("/login")}
          className="bg-gelap text-white rounded-full p-3 flex items-center justify-center"
        >
          <ArrowLeft size={20} />
        </button>
      </div>
    </div>
  );
}
