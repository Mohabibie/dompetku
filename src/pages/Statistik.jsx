import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import BottomNav from "../components/BottomNav";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Warna untuk setiap kategori
const WARNA_KATEGORI = {
  Makan: "#4FC3F7",      // biru muda
  Bensin: "#FF8A65",     // oranye
  Hiburan: "#FF5252",    // merah
  Nongkrong: "#81C784",  // hijau muda
  Lainnya: "#9DC417",    // hijau utama
  Pemasukan: "#26C6DA",  // cyan
};

const namaBulan = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export default function Statistik() {
  const { user } = useAuth();
  const [transaksi, setTransaksi] = useState([]);
  // State untuk bulan yang sedang dilihat (0 = Januari, 11 = Desember)
  const [bulanAktif, setBulanAktif] = useState(new Date().getMonth());
  const [tahunAktif, setTahunAktif] = useState(new Date().getFullYear());

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "transaksi"),
      where("uid", "==", user.uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTransaksi(data);
    });
    return () => unsubscribe();
  }, [user]);

  // Filter transaksi sesuai bulan dan tahun yang aktif
  const transaksiFiltered = transaksi.filter((t) => {
    if (!t.createdAt) return false;
    const d = t.createdAt.toDate();
    return d.getMonth() === bulanAktif && d.getFullYear() === tahunAktif;
  });

  // Kelompokkan pengeluaran per kategori untuk chart
  const pengeluaran = transaksiFiltered.filter((t) => t.jenis === "keluar");
  const dataKategori = pengeluaran.reduce((acc, t) => {
    const existing = acc.find((item) => item.name === t.kategori);
    if (existing) {
      existing.value += t.jumlah;
    } else {
      acc.push({ name: t.kategori, value: t.jumlah });
    }
    return acc;
  }, []);

  // Navigasi bulan sebelumnya
  const bulanSebelumnya = () => {
    if (bulanAktif === 0) {
      setBulanAktif(11);
      setTahunAktif((t) => t - 1);
    } else {
      setBulanAktif((b) => b - 1);
    }
  };

  // Navigasi bulan berikutnya
  const bulanBerikutnya = () => {
    if (bulanAktif === 11) {
      setBulanAktif(0);
      setTahunAktif((t) => t + 1);
    } else {
      setBulanAktif((b) => b + 1);
    }
  };

  return (
    <div className="app-container bg-gray-100 min-h-screen pb-28">
      {/* Header */}
      <div className="bg-white px-5 pt-10 pb-4">
        <h1 className="text-xl font-bold text-gelap text-center">Stats</h1>
      </div>

      {/* Navigasi bulan */}
      <div className="flex items-center justify-center gap-6 mt-6 mb-4">
        <button onClick={bulanSebelumnya}>
          <ChevronLeft size={28} className="text-gelap" />
        </button>
        <span className="text-xl font-bold text-gelap">
          {namaBulan[bulanAktif]} {tahunAktif}
        </span>
        <button onClick={bulanBerikutnya}>
          <ChevronRight size={28} className="text-gelap" />
        </button>
      </div>

      {/* Pie Chart */}
      <div className="bg-white mx-4 rounded-3xl py-4">
        {dataKategori.length === 0 ? (
          <p className="text-center text-gray-400 py-10 text-sm">
            Tidak ada data untuk bulan ini
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={dataKategori}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
              >
                {dataKategori.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={WARNA_KATEGORI[entry.name] || "#ccc"}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) =>
                  `Rp. ${new Intl.NumberFormat("id-ID").format(value)}`
                }
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Legend kategori */}
      <div className="mx-4 mt-4 bg-gelap rounded-3xl p-5">
        {dataKategori.length === 0 ? (
          <p className="text-gray-400 text-sm text-center">Belum ada pengeluaran</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {dataKategori.map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-medium"
                style={{ backgroundColor: WARNA_KATEGORI[item.name] || "#ccc" }}
              >
                {item.name}
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
