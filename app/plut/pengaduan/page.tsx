import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pengaduan & Layanan Aspirasi - PLUT Buleleng",
  description: "Layanan aspirasi, kritik, saran, dan pengaduan masyarakat terintegrasi PLUT Kabupaten Buleleng.",
};

export default function PengaduanPlutPage() {
  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      

      {/* HERO SECTION */}
      <section className="bg-neutral-900 text-white py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-[#FF3C00] font-bold text-sm tracking-widest uppercase mb-4 block">Layanan Aspirasi</span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
            Pengaduan & <span className="text-[#FF3C00]">Kritik Saran</span>
          </h1>
          <p className="text-lg text-neutral-400">
            Suara Anda sangat berarti bagi kemajuan UMKM Buleleng. Sampaikan aspirasi, pengaduan, maupun saran untuk pelayanan PLUT yang lebih baik.
          </p>
        </div>
      </section>

      <main className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* BAGIAN 1: INTEGRASI SP4N-LAPOR! */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-neutral-100">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-6 border border-red-100">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
            <h2 className="text-2xl font-extrabold text-neutral-900 mb-4">Pengaduan Resmi (LAPOR!)</h2>
            <p className="text-neutral-600 mb-6 leading-relaxed">
              Untuk pengaduan terkait dugaan pelanggaran, pungutan liar, atau ketidakpuasan terhadap standar pelayanan publik, silakan gunakan portal <strong>SP4N-LAPOR!</strong> (Sistem Pengelolaan Pengaduan Pelayanan Publik Nasional).
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <div className="shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mt-0.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="text-sm text-neutral-700">Rahasia pelapor dijamin (Bisa Anonim).</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mt-0.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="text-sm text-neutral-700">Terintegrasi langsung dengan Kementerian PANRB.</span>
              </li>
            </ul>
            <a 
              href="https://www.lapor.go.id/" 
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3.5 text-center bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors shadow-md"
            >
              Kunjungi Portal LAPOR!
            </a>
          </div>

          {/* BAGIAN 2: FORM KRITIK & SARAN LOKAL */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-lg border border-neutral-100 relative overflow-hidden">
            {/* Dekorasi kecil di sudut form */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FF3C00]/5 rounded-full"></div>
            
            <div className="relative z-10">
              <h2 className="text-2xl font-extrabold text-neutral-900 mb-2">Kritik & Saran</h2>
              <p className="text-neutral-500 mb-8 text-sm">
                Bantu kita meningkatkan kualitas pendampingan UMKM dengan memberikan masukan yang membangun.
              </p>

              <form className="space-y-5">
                <div>
                  <label htmlFor="nama" className="block text-sm font-semibold text-neutral-700 mb-1.5">Nama Lengkap / Nama Usaha</label>
                  <input 
                    type="text" 
                    id="nama" 
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-[#FF3C00] focus:border-transparent transition-all outline-none"
                    placeholder="Contoh: Budi Santoso / Kopi Buleleng"
                  />
                </div>
                
                <div>
                  <label htmlFor="kontak" className="block text-sm font-semibold text-neutral-700 mb-1.5">Email / No. WhatsApp (Opsional)</label>
                  <input 
                    type="text" 
                    id="kontak" 
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-[#FF3C00] focus:border-transparent transition-all outline-none"
                    placeholder="Agar kami bisa merespons masukan Anda"
                  />
                </div>

                <div>
                  <label htmlFor="kategori" className="block text-sm font-semibold text-neutral-700 mb-1.5">Kategori Masukan</label>
                  <select 
                    id="kategori"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-[#FF3C00] focus:border-transparent transition-all outline-none text-neutral-700"
                  >
                    <option value="">-- Pilih Kategori --</option>
                    <option value="fasilitas">Fasilitas Gedung PLUT</option>
                    <option value="pelayanan">Pelayanan Konsultan / Staf</option>
                    <option value="program">Program Pelatihan / Event</option>
                    <option value="website">Kendala Website / Buleleng Mall</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="pesan" className="block text-sm font-semibold text-neutral-700 mb-1.5">Pesan Anda</label>
                  <textarea 
                    id="pesan" 
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-[#FF3C00] focus:border-transparent transition-all outline-none resize-none"
                    placeholder="Tuliskan kritik, saran, atau pertanyaan Anda di sini..."
                  ></textarea>
                </div>

                <button 
                  type="button" // Ubah ke submit jika sudah dihubungkan ke backend (Supabase)
                  className="w-full py-4 mt-2 bg-[#FF3C00] hover:bg-[#e03500] text-white font-bold rounded-xl transition-colors shadow-md flex justify-center items-center gap-2"
                >
                  Kirim Masukan
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </form>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}