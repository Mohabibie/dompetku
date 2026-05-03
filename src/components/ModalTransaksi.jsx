import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import { X } from "lucide-react";

const kategoriList = ["Makan", "Bensin", "Hiburan", "Nongkrong", "Lainnya"];

export default function ModalTransaksi({ onClose }) {
  const { user } = useAuth();
  const [jenis, setJenis] = useState("keluar"); // "masuk" atau "keluar"
  const [jumlah, setJumlah] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [kategori, setKategori] = useState("Makan");
  const [loading, setLoading] = useState(false);

  const handleSimpan = async () => {
    if (!jumlah || isNaN(jumlah)) return;
    setLoading(true);
    try {
      // Simpan transaksi ke Firestore
      // Collection: "transaksi" > Document otomatis dengan ID unik
      await addDoc(collection(db, "transaksi"), {
        uid: user.uid, // ID pengguna agar data terpisah per user
        jenis,
        jumlah: Number(jumlah),
        keterangan,
        kategori: jenis === "keluar" ? kategori : "Pemasukan",
        createdAt: serverTimestamp(), // Timestamp dari server Firebase
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">
      <div className="bg-white w-full max-w-[430px] rounded-t-3xl p-6 overflow-y-auto max-h-[85vh] pb-24">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Tambah Transaksi</h2>
          <button onClick={onClose}><X /></button>
        </div>

        {/* Pilih jenis transaksi */}
        <div className="flex gap-3 mb-5">
          {["masuk", "keluar"].map((j) => (
            <button
              key={j}
              onClick={() => setJenis(j)}
              className={`flex-1 py-3 rounded-full font-semibold capitalize ${
                jenis === j
                  ? j === "masuk" ? "bg-hijau text-white" : "bg-merah text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              Uang {j}
            </button>
          ))}
        </div>

        {/* Input jumlah */}
        <input
          type="number"
          placeholder="Jumlah (Rp)"
          value={jumlah}
          onChange={(e) => setJumlah(e.target.value)}
          className="border border-gray-300 rounded-2xl px-5 py-4 w-full mb-4 text-sm focus:outline-none focus:border-hijau"
        />

        {/* Input keterangan */}
        <input
          type="text"
          placeholder="Keterangan (contoh: Buat makan)"
          value={keterangan}
          onChange={(e) => setKeterangan(e.target.value)}
          className="border border-gray-300 rounded-2xl px-5 py-4 w-full mb-4 text-sm focus:outline-none focus:border-hijau"
        />

        {/* Pilih kategori (hanya jika uang keluar) */}
        {jenis === "keluar" && (
          <div className="flex flex-wrap gap-2 mb-5">
            {kategoriList.map((kat) => (
              <button
                key={kat}
                onClick={() => setKategori(kat)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  kategori === kat ? "bg-hijau text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                {kat}
              </button>
            ))}
          </div>
        )}

        <button
          onClick={handleSimpan}
          disabled={loading}
          className="w-full bg-gelap text-white rounded-full py-4 font-semibold text-lg disabled:opacity-60"
        >
          {loading ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </div>
  );
}
