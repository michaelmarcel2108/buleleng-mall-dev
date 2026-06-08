import Link from "next/link";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Agenda & Regulasi (JDIH) - PLUT Buleleng",
  description: "Jadwal kegiatan, pelatihan UMKM, serta transparansi data regulasi dan landasan hukum PLUT Kabupaten Buleleng.",
};

// Fungsi format tanggal untuk kalender agenda
const formatTanggalAgenda = (dateString: string) => {
  if (!dateString) return { hari: "", bulan: "", tahun: "" };
  const date = new Date(dateString);
  return {
    hari: date.toLocaleDateString("id-ID", { day: "2-digit" }),
    bulan: date.toLocaleDateString("id-ID", { month: "short" }).toUpperCase(),
    tahun: date.toLocaleDateString("id-ID", { year: "numeric" }),
    full: date.toLocaleDateString("id-ID", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  };
};

export default async function AgendaRegulasiPage() {
  const supabase = await createClient();

  // 1. Mengambil data Agenda Kegiatan (Diurutkan dari yang terdekat)
  const { data: agendas } = await supabase
    .from("plut_agendas")
    .select("*")
    .order("tanggal_mulai", { ascending: true })
    .limit(5); // Ambil 5 agenda terdekat

  // 2. Mengambil data Regulasi/JDIH (Diurutkan dari tahun terbaru)
  const { data: regulations } = await supabase
    .from("plut_regulations")
    .select("*")
    .order("tahun", { ascending: false });

  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      

      {/* HERO SECTION */}
      <section className="bg-neutral-900 text-white py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-[#FF3C00] font-bold text-sm tracking-widest uppercase mb-4 block">Transparansi & Informasi Terbuka</span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
            Agenda & <span className="text-[#FF3C00]">Regulasi</span>
          </h1>
          <p className="text-lg text-neutral-400">
            Ketahui jadwal pelatihan terbaru yang bisa Anda ikuti, serta unduh berbagai dokumen regulasi, landasan hukum, dan informasi publik (PPID/JDIH) yang kita sediakan.
          </p>
        </div>
      </section>

      <main className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* KOLOM KIRI: AGENDA KEGIATAN (Ukuran lebih lebar, misal col-span-7) */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <h2 className="text-3xl font-extrabold text-neutral-900 mb-2">Agenda Kegiatan</h2>
            <p className="text-neutral-500 mb-8">Jadwal pelatihan, pameran, dan kurasi produk UMKM.</p>
          </div>

          <div className="space-y-6">
            {agendas && agendas.length > 0 ? (
              agendas.map((agenda) => {
                const tgl = formatTanggalAgenda(agenda.tanggal_mulai);
                return (
                  <div key={agenda.id} className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm hover:shadow-md transition-shadow flex gap-6 items-start group">
                    {/* Kotak Tanggal */}
                    <div className="shrink-0 w-20 h-24 bg-neutral-50 rounded-xl border border-neutral-100 flex flex-col items-center justify-center text-center group-hover:border-[#FF3C00]/30 group-hover:bg-[#FF3C00]/5 transition-colors">
                      <span className="text-sm font-bold text-[#FF3C00]">{tgl.bulan}</span>
                      <span className="text-3xl font-extrabold text-neutral-900 leading-none my-1">{tgl.hari}</span>
                      <span className="text-xs font-semibold text-neutral-500">{tgl.tahun}</span>
                    </div>

                    {/* Detail Agenda */}
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-[#FF3C00] transition-colors">{agenda.judul_kegiatan}</h3>
                      <p className="text-neutral-600 text-sm mb-4 line-clamp-2">{agenda.deskripsi}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-neutral-500">
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          {agenda.lokasi || "Gedung PLUT Buleleng"}
                        </div>
                        {agenda.link_pendaftaran && (
                          <a href={agenda.link_pendaftaran} target="_blank" rel="noopener noreferrer" className="text-[#FF3C00] hover:underline flex items-center gap-1">
                            Daftar Sekarang
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="bg-white rounded-2xl p-8 border border-neutral-100 text-center">
                <p className="text-neutral-500">Belum ada agenda kegiatan dalam waktu dekat.</p>
              </div>
            )}
          </div>
        </div>

        {/* KOLOM KANAN: REGULASI / JDIH (Ukuran col-span-5) */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <h2 className="text-3xl font-extrabold text-neutral-900 mb-2">JDIH & Regulasi</h2>
            <p className="text-neutral-500 mb-8">Dokumen legalitas dan transparansi publik.</p>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-neutral-100 bg-neutral-50 flex justify-between items-center">
              <h3 className="font-bold text-neutral-900">Daftar Dokumen</h3>
              <span className="text-xs font-semibold px-2 py-1 bg-neutral-200 text-neutral-700 rounded-md">
                {regulations?.length || 0} File
              </span>
            </div>
            
            <div className="divide-y divide-neutral-100">
              {regulations && regulations.length > 0 ? (
                regulations.map((reg) => (
                  <div key={reg.id} className="p-5 hover:bg-neutral-50 transition-colors flex gap-4 items-start">
                    {/* Icon PDF */}
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-sm font-bold text-neutral-900 mb-1 leading-tight">{reg.judul_regulasi}</h4>
                      <p className="text-xs text-neutral-500 mb-2">
                        {reg.nomor_dokumen} • Tahun {reg.tahun} • {reg.kategori}
                      </p>
                      <a href={reg.file_url} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#FF3C00] hover:underline flex items-center gap-1 w-fit">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        Unduh Dokumen
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <p className="text-neutral-500 text-sm">Belum ada dokumen regulasi yang diunggah.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}