import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import BottomNav from "../components/BottomNav";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

function formatRupiah(angka) {
  return new Intl.NumberFormat("id-ID").format(angka);
}

function formatTanggal(timestamp) {
  if (!timestamp) return "";
  const d = timestamp.toDate();
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// Kelompokkan array transaksi berdasarkan tanggal
function kelompokkanPerTanggal(transaksi) {
  const grouped = {};
  transaksi.forEach((t) => {
    const tgl = formatTanggal(t.createdAt);
    if (!grouped[tgl]) grouped[tgl] = [];
    grouped[tgl].push(t);
  });
  return grouped;
}

export default function Histori() {
  const { user } = useAuth();
  const [transaksi, setTransaksi] = useState([]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "transaksi"),
      where("uid", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTransaksi(data);
    });
    return () => unsubscribe();
  }, [user]);

  // Hitung prediksi pengeluaran (rata-rata per kategori)
  const pengeluaran = transaksi.filter((t) => t.jenis === "keluar");
  const prediksiKategori = pengeluaran.reduce((acc, t) => {
    if (!acc[t.kategori]) acc[t.kategori] = 0;
    acc[t.kategori] += t.jumlah;
    return acc;
  }, {});
  const totalPrediksi = Object.values(prediksiKategori).reduce((a, b) => a + b, 0);

  const grouped = kelompokkanPerTanggal(transaksi);

  return (
    <div className="app-container bg-gray-100 min-h-screen pb-28">
      {/* Header */}
      <div className="bg-white px-5 pt-10 pb-4">
        <h1 className="text-xl font-bold text-gelap text-center">Prediksi Pengeluaran</h1>
      </div>

      {/* Kartu Prediksi */}
      <div className="mx-4 mt-4 bg-hijau rounded-3xl p-5">
        {Object.entries(prediksiKategori).slice(0, 3).map(([kat, jumlah]) => (
          <div key={kat} className="flex justify-between items-center mb-2">
            <span className="text-gelap font-semibold">{kat}</span>
            <span className="text-gelap font-semibold">Rp. {formatRupiah(jumlah)}</span>
          </div>
        ))}
        <div className="border-t border-gelap/20 mt-2 pt-2 flex justify-between">
          <span className="text-gelap font-bold">Total</span>
          <span className="text-gelap font-bold">Rp. {formatRupiah(totalPrediksi)}</span>
        </div>
      </div>

      {/* Riwayat Transaksi */}
      <div className="mx-4 mt-5 bg-gelap rounded-3xl p-5">
        <h2 className="text-white font-bold text-lg mb-4">Riwayat</h2>

        {Object.keys(grouped).length === 0 && (
          <p className="text-gray-400 text-sm text-center py-4">
            Belum ada transaksi
          </p>
        )}

        {Object.entries(grouped).map(([tanggal, items]) => (
          <div key={tanggal} className="mb-4">
            <p className="text-gray-400 text-xs mb-3">
              {tanggal === formatTanggal({ toDate: () => new Date() }) ? "Hari ini" : tanggal}
            </p>
            {items.map((t) => (
              <div key={t.id} className="flex items-center gap-3 mb-4">
                {/* Icon transaksi */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  t.jenis === "masuk" ? "bg-hijau/20" : "bg-white/10"
                }`}>
                  {t.jenis === "masuk" ? (
                    <ArrowDownLeft size={18} className="text-hijau" />
                  ) : (
                    <ArrowUpRight size={18} className="text-white" />
                  )}
                </div>

                {/* Info transaksi */}
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">
                    {t.jenis === "masuk" ? "Uang masuk" : "Uang keluar"}
                  </p>
                  <p className="text-gray-400 text-xs">{t.keterangan || t.kategori}</p>
                </div>

                {/* Jumlah */}
                <p className={`font-bold text-sm ${
                  t.jenis === "masuk" ? "text-hijau" : "text-merah"
                }`}>
                  {t.jenis === "masuk" ? "+" : "-"}Rp. {formatRupiah(t.jumlah)}
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
