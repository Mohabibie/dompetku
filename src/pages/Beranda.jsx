import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import BottomNav from "../components/BottomNav";
import ModalTransaksi from "../components/ModalTransaksi";
import { Bell, Eye, EyeOff, Plus } from "lucide-react";

// Format angka ke format Rupiah
function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID").format(angka);
}

// Ambil hari dalam Bahasa Indonesia
const hariIndo = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export default function Beranda() {
  const { user } = useAuth();
  const [transaksi, setTransaksi] = useState([]);
  const [showSaldo, setShowSaldo] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Query Firestore: ambil semua transaksi milik user ini
    // onSnapshot = listener real-time, data otomatis update
    const q = query(
      collection(db, "transaksi"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTransaksi(data);
    });

    // Cleanup: hentikan listener saat component unmount
    return () => unsubscribe();
  }, [user]);

  // Hitung total uang masuk, keluar, dan tabungan
  const totalMasuk = transaksi
    .filter((t) => t.jenis === "masuk")
    .reduce((acc, t) => acc + t.jumlah, 0);

  const totalKeluar = transaksi
    .filter((t) => t.jenis === "keluar")
    .reduce((acc, t) => acc + t.jumlah, 0);

  const tabungan = totalMasuk - totalKeluar;

  // Ambil tanggal hari ini
  const today = new Date();
  const tanggalHariIni = today.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // Buat data batas pengeluaran 4 hari ke depan (simulasi)
  const batasHarian = Array.from({ length: 4 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const totalHariItu = transaksi
      .filter((t) => {
        if (!t.createdAt) return false;
        const tgl = t.createdAt.toDate();
        return (
          t.jenis === "keluar" &&
          tgl.toDateString() === d.toDateString()
        );
      })
      .reduce((acc, t) => acc + t.jumlah, 0);
    const batas = 100000; // Batas maksimal per hari (bisa diubah)
    return {
      hari: hariIndo[d.getDay()],
      tanggal: d.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" }),
      total: totalHariItu,
      status: totalHariItu <= batas ? "Min" : "Max",
      batas,
    };
  });

  return (
    <div className="app-container bg-gray-100 min-h-screen pb-28">
      {/* Header */}
      <div className="bg-white px-5 pt-10 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-hijau flex items-center justify-center text-white font-bold">
            {user?.displayName?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <p className="text-sm font-semibold text-gelap">
              Hi, {user?.displayName || "Pengguna"}!
            </p>
            <p className="text-xs text-gray-500">Ayo Berhemat!</p>
          </div>
        </div>
        <div className="relative">
          <Bell size={22} className="text-gelap" />
          <span className="absolute -top-1 -right-1 bg-merah text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center">
            1
          </span>
        </div>
      </div>

      {/* Kartu Saldo */}
      <div className="mx-4 mt-4 bg-hijau rounded-3xl p-5">
        <div className="flex justify-between items-center mb-4">
          <span className="text-white font-semibold text-sm">{tanggalHariIni}</span>
          <button onClick={() => setShowSaldo(!showSaldo)}>
            {showSaldo ? (
              <EyeOff size={18} className="text-white" />
            ) : (
              <Eye size={18} className="text-white" />
            )}
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          {[
            { label: "UANG MASUK", value: `+${formatRupiah(totalMasuk)}`, color: "text-white" },
            { label: "TABUNGAN", value: formatRupiah(tabungan), color: "text-white font-bold" },
            { label: "UANG KELUAR", value: `-${formatRupiah(totalKeluar)}`, color: "text-white" },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <p className="text-[10px] text-white/70 mb-1">{label}</p>
              <p className={`text-sm font-semibold ${color}`}>
                {showSaldo ? value : "••••••"}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Batas Pengeluaran Harian */}
      <div className="mx-4 mt-5">
        <h2 className="text-hijau font-bold text-center mb-3 text-sm">
          Batas Pengeluaran Harian
        </h2>
        <div className="bg-gelap rounded-3xl p-5 space-y-4">
          {batasHarian.map((item, i) => (
            <div key={i} className="flex justify-between items-start">
              <div>
                <p className="text-white font-semibold text-sm">{item.hari}</p>
                <p className="text-gray-400 text-xs">{item.tanggal}</p>
              </div>
              <div className="text-right">
                <p className={`text-xs font-bold ${item.status === "Max" ? "text-merah" : "text-hijau"}`}>
                  {item.status}
                </p>
                <p className="text-white text-sm font-semibold">
                  Rp. {formatRupiah(item.batas)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tombol Tambah Transaksi */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-24 right-1/2 translate-x-[195px] bg-gelap text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg z-40"
      >
        <Plus size={24} />
      </button>

      {/* Modal Tambah Transaksi */}
      {showModal && <ModalTransaksi onClose={() => setShowModal(false)} />}

      <BottomNav />
    </div>
  );
}
