"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function EditUmkmPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const router = useRouter();
  const supabase = createClient();
  
  // Menggunakan React.use() untuk unwrap params di Next.js 15+
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const isNewUmkm = resolvedParams.id === "new";

  const [isLoading, setIsLoading] = useState(!isNewUmkm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [formData, setFormData] = useState({
    nama_pemilik: "",
    nama_usaha: "",
    kecamatan: "Buleleng", // Default
    alamat_lengkap: "",
    nomor_whatsapp: "",
    bidang_usaha: "",
    nib: "",
    is_verified: false,
  });

  const kecamatanList = [
    "Buleleng", "Sawan", "Kubutambahan", "Tejakula", 
    "Gerokgak", "Seririt", "Busungbiu", "Banjar", "Sukasada"
  ];

  // Fetch data UMKM jika ini adalah mode Edit
  useEffect(() => {
    if (!isNewUmkm) {
      const fetchUmkm = async () => {
        const { data, error } = await supabase
          .from("plut_umkm")
          .select("*")
          .eq("id", resolvedParams.id)
          .single();

        if (error) {
          setErrorMsg("Gagal memuat data UMKM.");
          setIsLoading(false);
          return;
        }

        if (data) {
          setFormData({
            nama_pemilik: data.nama_pemilik || "",
            nama_usaha: data.nama_usaha || "",
            kecamatan: data.kecamatan || "Buleleng",
            alamat_lengkap: data.alamat_lengkap || "",
            nomor_whatsapp: data.nomor_whatsapp || "",
            bidang_usaha: data.bidang_usaha || "",
            nib: data.nib || "",
            is_verified: data.is_verified || false,
          });
        }
        setIsLoading(false);
      };
      
      fetchUmkm();
    }
  }, [isNewUmkm, resolvedParams.id, supabase]);

  // Handle Perubahan Input Teks
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Toggle Checkbox (Verifikasi)
  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  // Handle Submit (Create / Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      if (isNewUmkm) {
        // Mode INSERT
        const { error } = await supabase.from("plut_umkm").insert([formData]);
        if (error) throw error;
      } else {
        // Mode UPDATE
        const { error } = await supabase
          .from("plut_umkm")
          .update(formData)
          .eq("id", resolvedParams.id);
        if (error) throw error;
      }

      router.push("/admin/plut/umkm");
      router.refresh();
      
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat menyimpan data.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <p className="text-neutral-500 font-bold">Memuat data UMKM...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col md:flex-row font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-full md:w-64 bg-neutral-900 text-white flex flex-col shrink-0 hidden md:flex">
        <div className="p-6 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#FF3C00] rounded-lg flex items-center justify-center text-white font-bold shadow-md">P</div>
            <span className="font-bold text-lg tracking-wide">Admin PLUT</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin/plut" className="block px-4 py-3 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl font-medium transition-colors">Dashboard</Link>
          <Link href="/admin/plut/manage" className="block px-4 py-3 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl font-medium transition-colors">Kelola Postingan</Link>
          <Link href="/admin/plut/umkm" className="block px-4 py-3 bg-[#FF3C00] text-white rounded-xl font-medium shadow-md">Database UMKM</Link>
        </nav>
      </aside>

      {/* MAIN KONTEN */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white border-b border-neutral-200 px-8 py-5 flex items-center gap-4 sticky top-0 z-10">
          <Link href="/admin/plut/umkm" className="text-neutral-400 hover:text-[#FF3C00] transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-neutral-900">
              {isNewUmkm ? "Pendaftaran UMKM Baru" : "Edit Profil UMKM"}
            </h1>
          </div>
        </header>

        <div className="p-8 max-w-4xl">
          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="md:col-span-2 flex items-center justify-between p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                <div>
                  <h3 className="font-bold text-neutral-900">Status Verifikasi UMKM</h3>
                  <p className="text-sm text-neutral-500">UMKM terverifikasi akan tampil di halaman publik PLUT.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="is_verified"
                    checked={formData.is_verified}
                    onChange={handleToggle}
                    className="sr-only peer" 
                  />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  <span className="ml-3 text-sm font-bold text-neutral-900">
                    {formData.is_verified ? "Terverifikasi" : "Menunggu"}
                  </span>
                </label>
              </div>

              {/* NAMA USAHA */}
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Nama Usaha / Merek *</label>
                <input 
                  type="text" 
                  name="nama_usaha"
                  required
                  value={formData.nama_usaha}
                  onChange={handleChange}
                  placeholder="Contoh: Kopi Bubuk Banyuatis"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-[#FF3C00] focus:border-transparent transition-all outline-none"
                />
              </div>

              {/* NAMA PEMILIK */}
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Nama Pemilik (Owner) *</label>
                <input 
                  type="text" 
                  name="nama_pemilik"
                  required
                  value={formData.nama_pemilik}
                  onChange={handleChange}
                  placeholder="Nama lengkap pemilik usaha"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-[#FF3C00] focus:border-transparent transition-all outline-none"
                />
              </div>

              {/* BIDANG USAHA */}
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Bidang Usaha *</label>
                <input 
                  type="text" 
                  name="bidang_usaha"
                  required
                  value={formData.bidang_usaha}
                  onChange={handleChange}
                  placeholder="Kuliner, Kriya, Fashion, Jasa, dll."
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-[#FF3C00] focus:border-transparent transition-all outline-none"
                />
              </div>

              {/* NIB */}
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Nomor Induk Berusaha (NIB)</label>
                <input 
                  type="text" 
                  name="nib"
                  value={formData.nib}
                  onChange={handleChange}
                  placeholder="Masukkan NIB jika ada"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-[#FF3C00] focus:border-transparent transition-all outline-none font-mono"
                />
              </div>

              {/* KECAMATAN */}
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Kecamatan *</label>
                <select 
                  name="kecamatan"
                  value={formData.kecamatan}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-[#FF3C00] focus:border-transparent transition-all outline-none"
                >
                  {kecamatanList.map((kec) => (
                    <option key={kec} value={kec}>{kec}</option>
                  ))}
                </select>
              </div>

              {/* WHATSAPP */}
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Nomor WhatsApp *</label>
                <input 
                  type="tel" 
                  name="nomor_whatsapp"
                  required
                  value={formData.nomor_whatsapp}
                  onChange={handleChange}
                  placeholder="Contoh: 628123456789"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-[#FF3C00] focus:border-transparent transition-all outline-none"
                />
              </div>

              {/* ALAMAT LENGKAP */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-neutral-700 mb-2">Alamat Lengkap</label>
                <textarea 
                  name="alamat_lengkap"
                  rows={3}
                  value={formData.alamat_lengkap}
                  onChange={handleChange}
                  placeholder="Nama jalan, gang, nomor rumah..."
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-[#FF3C00] focus:border-transparent transition-all outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-neutral-100">
              <button 
                type="button"
                onClick={() => router.push('/admin/plut/umkm')}
                className="px-6 py-3 mr-4 text-neutral-600 font-bold hover:bg-neutral-100 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-[#FF3C00] hover:bg-[#e03500] text-white font-bold rounded-xl transition-colors shadow-md disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? "Menyimpan..." : "Simpan Data UMKM"}
              </button>
            </div>
            
          </form>
        </div>
      </main>
    </div>
  );
}