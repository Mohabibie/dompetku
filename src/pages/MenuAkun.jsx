import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  updateProfile,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { doc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { ChevronLeft, User, Mail, Calendar, Pencil, Trash2, X, Check } from "lucide-react";

export default function MenuAkun() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State untuk modal edit nama
  const [showEditNama, setShowEditNama] = useState(false);
  const [namaBaru, setNamaBaru] = useState(user?.displayName || "");
  const [loadingNama, setLoadingNama] = useState(false);
  const [pesanNama, setPesanNama] = useState("");

  // State untuk modal hapus akun
  const [showHapus, setShowHapus] = useState(false);
  const [passwordKonfirmasi, setPasswordKonfirmasi] = useState("");
  const [loadingHapus, setLoadingHapus] = useState(false);
  const [errorHapus, setErrorHapus] = useState("");

  // Format tanggal bergabung dari metadata Firebase
  const tanggalBergabung = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "-";

  // Handler ganti nama
  const handleGantiNama = async () => {
    if (!namaBaru.trim()) {
      setPesanNama("Nama tidak boleh kosong!");
      return;
    }
    setLoadingNama(true);
    setPesanNama("");
    try {
      await updateProfile(auth.currentUser, { displayName: namaBaru.trim() });
      setPesanNama("sukses");
      setTimeout(() => {
        setShowEditNama(false);
        setPesanNama("");
      }, 1000);
    } catch (err) {
      setPesanNama("Gagal mengubah nama. Coba lagi.");
    } finally {
      setLoadingNama(false);
    }
  };

  // Handler hapus akun
  const handleHapusAkun = async () => {
    if (!passwordKonfirmasi) {
      setErrorHapus("Masukkan kata sandi untuk konfirmasi!");
      return;
    }
    setLoadingHapus(true);
    setErrorHapus("");
    try {
      // Re-autentikasi dulu sebelum hapus akun
      const credential = EmailAuthProvider.credential(
        user.email,
        passwordKonfirmasi
      );
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Hapus semua transaksi milik user di Firestore
      const q = query(collection(db, "transaksi"), where("uid", "==", user.uid));
      const snapshot = await getDocs(q);
      const hapusData = snapshot.docs.map((d) => deleteDoc(doc(db, "transaksi", d.id)));
      await Promise.all(hapusData);

      // Hapus akun dari Firebase Auth
      await deleteUser(auth.currentUser);
      navigate("/login");
    } catch (err) {
      if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setErrorHapus("Kata sandi salah!");
      } else {
        setErrorHapus("Gagal menghapus akun. Coba lagi.");
      }
    } finally {
      setLoadingHapus(false);
    }
  };

  return (
    <div className="app-container bg-gray-100 min-h-screen pb-10">
      {/* Header */}
      <div className="bg-white px-5 pt-10 pb-4 flex items-center gap-3">
        <button onClick={() => navigate("/profil")}>
          <ChevronLeft size={24} style={{ color: "#1A1A1A" }} />
        </button>
        <h1 className="text-xl font-bold" style={{ color: "#1A1A1A" }}>
          Manajemen Akun
        </h1>
      </div>

      {/* Kartu Info Akun */}
      <div
        className="mx-4 mt-4 rounded-3xl p-6 flex flex-col items-center"
        style={{ backgroundColor: "#9DC417" }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-white mb-4"
          style={{ backgroundColor: "#E53935" }}
        >
          {user?.displayName?.charAt(0).toUpperCase() || "U"}
        </div>
        <h2 className="text-xl font-bold" style={{ color: "#1A1A1A" }}>
          {user?.displayName || "Pengguna"}
        </h2>
        <p className="text-sm mt-1" style={{ color: "#1A1A1A", opacity: 0.7 }}>
          {user?.email}
        </p>
      </div>

      {/* Detail Info */}
      <div
        className="mx-4 mt-4 rounded-3xl p-5 space-y-4"
        style={{ backgroundColor: "#1A1A1A" }}
      >
        {/* Nama */}
        <div className="flex items-center gap-3">
          <User size={18} color="#9DC417" />
          <div className="flex-1">
            <p className="text-xs" style={{ color: "#9ca3af" }}>Nama Tampilan</p>
            <p className="text-white font-semibold text-sm">
              {user?.displayName || "-"}
            </p>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }} />

        {/* Email */}
        <div className="flex items-center gap-3">
          <Mail size={18} color="#9DC417" />
          <div className="flex-1">
            <p className="text-xs" style={{ color: "#9ca3af" }}>Email</p>
            <p className="text-white font-semibold text-sm">{user?.email || "-"}</p>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }} />

        {/* Tanggal bergabung */}
        <div className="flex items-center gap-3">
          <Calendar size={18} color="#9DC417" />
          <div className="flex-1">
            <p className="text-xs" style={{ color: "#9ca3af" }}>Bergabung Sejak</p>
            <p className="text-white font-semibold text-sm">{tanggalBergabung}</p>
          </div>
        </div>
      </div>

      {/* Tombol Aksi */}
      <div className="mx-4 mt-4 space-y-3">
        {/* Ganti Nama */}
        <button
          onClick={() => {
            setNamaBaru(user?.displayName || "");
            setShowEditNama(true);
          }}
          className="w-full rounded-2xl px-5 py-4 flex items-center gap-4"
          style={{ backgroundColor: "#1A1A1A" }}
        >
          <Pencil size={20} color="#9DC417" />
          <div className="flex-1 text-left">
            <p className="text-white font-semibold text-sm">Ganti Nama Tampilan</p>
            <p className="text-xs" style={{ color: "#9ca3af" }}>
              Ubah nama yang tampil di aplikasi
            </p>
          </div>
        </button>

        {/* Hapus Akun */}
        <button
          onClick={() => setShowHapus(true)}
          className="w-full rounded-2xl px-5 py-4 flex items-center gap-4"
          style={{ backgroundColor: "#1A1A1A" }}
        >
          <Trash2 size={20} color="#E53935" />
          <div className="flex-1 text-left">
            <p className="font-semibold text-sm" style={{ color: "#E53935" }}>
              Hapus Akun
            </p>
            <p className="text-xs" style={{ color: "#9ca3af" }}>
              Hapus akun dan semua data secara permanen
            </p>
          </div>
        </button>
      </div>

      {/* Modal Ganti Nama */}
      {showEditNama && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
          <div
            className="bg-white rounded-t-3xl p-6 w-full"
            style={{ maxWidth: "430px" }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold" style={{ color: "#1A1A1A" }}>
                Ganti Nama Tampilan
              </h2>
              <button onClick={() => setShowEditNama(false)}>
                <X size={22} color="#1A1A1A" />
              </button>
            </div>

            <input
              type="text"
              placeholder="Masukkan nama baru"
              value={namaBaru}
              onChange={(e) => setNamaBaru(e.target.value)}
              className="border border-gray-300 rounded-2xl px-5 py-4 w-full mb-3 text-sm focus:outline-none"
            />

            {pesanNama && (
              <div
                className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl text-sm"
                style={{
                  backgroundColor: pesanNama === "sukses" ? "#f0fdf4" : "#fef2f2",
                  color: pesanNama === "sukses" ? "#16a34a" : "#dc2626",
                }}
              >
                {pesanNama === "sukses" ? (
                  <>
                    <Check size={16} />
                    <span>Nama berhasil diubah!</span>
                  </>
                ) : (
                  <span>{pesanNama}</span>
                )}
              </div>
            )}

            <button
              onClick={handleGantiNama}
              disabled={loadingNama}
              className="w-full text-white rounded-full py-4 font-semibold text-sm disabled:opacity-60"
              style={{ backgroundColor: "#9DC417" }}
            >
              {loadingNama ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Akun */}
      {showHapus && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
          <div
            className="bg-white rounded-t-3xl p-6 w-full"
            style={{ maxWidth: "430px" }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold" style={{ color: "#E53935" }}>
                Hapus Akun
              </h2>
              <button onClick={() => {
                setShowHapus(false);
                setPasswordKonfirmasi("");
                setErrorHapus("");
              }}>
                <X size={22} color="#1A1A1A" />
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-5">
              Akun dan seluruh data transaksi kamu akan dihapus secara permanen
              dan tidak dapat dipulihkan. Masukkan kata sandi untuk konfirmasi.
            </p>

            <input
              type="password"
              placeholder="Masukkan kata sandi"
              value={passwordKonfirmasi}
              onChange={(e) => setPasswordKonfirmasi(e.target.value)}
              className="border border-gray-300 rounded-2xl px-5 py-4 w-full mb-3 text-sm focus:outline-none"
            />

            {errorHapus && (
              <p className="text-sm mb-3" style={{ color: "#E53935" }}>
                {errorHapus}
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowHapus(false);
                  setPasswordKonfirmasi("");
                  setErrorHapus("");
                }}
                className="flex-1 rounded-full py-4 font-semibold text-sm"
                style={{ backgroundColor: "#f3f4f6", color: "#1A1A1A" }}
              >
                Batal
              </button>
              <button
                onClick={handleHapusAkun}
                disabled={loadingHapus}
                className="flex-1 text-white rounded-full py-4 font-semibold text-sm disabled:opacity-60"
                style={{ backgroundColor: "#E53935" }}
              >
                {loadingHapus ? "Menghapus..." : "Hapus Akun"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
