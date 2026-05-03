import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import BottomNav from "../components/BottomNav";
import {
  User, Lock, Globe, Bell, BookOpen, LogOut, ChevronRight,
} from "lucide-react";

const menuProfil = [
  { label: "Akun", sub: "Manajemen Akun", icon: User },
  { label: "Privasi", sub: "Ganti Username dan Kata Sandi", icon: Lock },
  { label: "Bahasa", sub: "Inggris, Indonesia, Vietnam, Melayu", icon: Globe },
  { label: "Notifikasi", sub: "Aktifkan/Nonaktifkan", icon: Bell },
  { label: "Preferensi Konten", sub: "Konten Bermanfaat Tentang Menabung", icon: BookOpen },
];

export default function Profil() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      // Firebase: logout user
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className="app-container bg-gray-100 min-h-screen pb-28">
      {/* Header profil */}
      <div className="bg-white px-5 pt-10 pb-4">
        <h1 className="text-xl font-bold text-gelap text-center">Profil</h1>
      </div>

      {/* Kartu identitas pengguna */}
      <div className="mx-4 mt-4 bg-hijau rounded-3xl p-6 flex flex-col items-center">
        {/* Avatar */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-merah flex items-center justify-center text-white text-3xl font-bold border-4 border-white">
            {user?.displayName?.charAt(0).toUpperCase() || "U"}
          </div>
          {/* Badge level */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-hijau-muda text-gelap text-xs font-bold px-2 py-0.5 rounded-full border-2 border-white">
            10
          </div>
        </div>

        <h2 className="mt-5 text-xl font-bold text-gelap">
          {user?.displayName || "Pengguna"}
        </h2>
        <p className="text-sm text-gelap/70">{user?.email || "Anak Kost Baru"}</p>
      </div>

      {/* Menu pengaturan */}
      <div className="mx-4 mt-4 space-y-2">
        {menuProfil.map(({ label, sub, icon: Icon }) => (
          <button
            key={label}
            className="w-full bg-gelap rounded-2xl px-5 py-4 flex items-center gap-4 text-left"
          >
            <Icon size={20} className="text-gray-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-white font-semibold text-sm">{label}</p>
              <p className="text-gray-400 text-xs">{sub}</p>
            </div>
            <ChevronRight size={16} className="text-gray-500" />
          </button>
        ))}

        {/* Tombol Keluar */}
        <button
          onClick={handleLogout}
          className="w-full bg-gelap rounded-2xl px-5 py-4 flex items-center gap-4 text-left"
        >
          <LogOut size={20} className="text-merah flex-shrink-0" />
          <div className="flex-1">
            <p className="text-merah font-semibold text-sm">Keluar</p>
            <p className="text-gray-400 text-xs">Ganti Akun</p>
          </div>
          <ChevronRight size={16} className="text-gray-500" />
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
