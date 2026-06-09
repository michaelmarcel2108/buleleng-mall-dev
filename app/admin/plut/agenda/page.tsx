"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";

interface Agenda {
  id: string;
  judul_kegiatan: string;
  deskripsi: string;
  tanggal_mulai: string;
  tanggal_selesai: string | null;
  lokasi: string | null;
  link_pendaftaran: string | null;
  gambar_url: string | null;
  slug: string;
}

export default function AdminAgendaPage() {
  const supabase = createClient();
  const [agendas, setAgendas] = useState<Agenda[]>([]);
  
  // State Form
  const [judulKegiatan, setJudulKegiatan] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [linkPendaftaran, setLinkPendaftaran] = useState("");
  const [gambarFile, setGambarFile] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(false);

  // Ambil Data
  const fetchAgendas = async () => {
    const { data, error } = await supabase
      .from("plut_agendas")
      .select("*")
      .order("tanggal_mulai", { ascending: false });

    if (error) console.error("Error fetching agendas:", error);
    else setAgendas(data || []);
  };

  useEffect(() => {
    fetchAgendas();
  }, [supabase]);

  // Generate Slug
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  // Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!judulKegiatan || !tanggalMulai) {
      return alert("Judul Kegiatan dan Tanggal Mulai wajib diisi!");
    }
    setLoading(true);

    try {
      const slug = `${generateSlug(judulKegiatan)}-${Date.now()}`;
      let gambarUrl = null;

      // 1. Upload Gambar Jika Ada
      if (gambarFile) {
        const fileExt = gambarFile.name.split(".").pop();
        const fileName = `agenda-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("plut-public")
          .upload(`agendas/${fileName}`, gambarFile);
          
        if (uploadError) throw uploadError;
        
        const { data: publicUrlData } = supabase.storage
          .from("plut-public")
          .getPublicUrl(`agendas/${fileName}`);
          
        gambarUrl = publicUrlData.publicUrl;
      }

      // 2. Insert ke tabel plut_agendas
      const { error } = await supabase.from("plut_agendas").insert({
        judul_kegiatan: judulKegiatan,
        deskripsi: deskripsi || null,
        tanggal_mulai: new Date(tanggalMulai).toISOString(),
        tanggal_selesai: tanggalSelesai ? new Date(tanggalSelesai).toISOString() : null,
        lokasi: lokasi || null,
        link_pendaftaran: linkPendaftaran || null,
        gambar_url: gambarUrl,
        slug: slug,
      });

      if (error) throw error;

      alert("Agenda berhasil ditambahkan!");
      // Reset Form
      setJudulKegiatan("");
      setDeskripsi("");
      setTanggalMulai("");
      setTanggalSelesai("");
      setLokasi("");
      setLinkPendaftaran("");
      setGambarFile(null);
      // Refresh Data
      fetchAgendas();
    } catch (err: any) {
      alert("Gagal menyimpan agenda: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Hapus Data
  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus agenda ini?")) return;
    try {
      const { error } = await supabase.from("plut_agendas").delete().eq("id", id);
      if (error) throw error;
      alert("Agenda berhasil dihapus!");
      fetchAgendas();
    } catch (err: any) {
      alert("Gagal menghapus agenda: " + err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-6 font-sans">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900">Kelola Agenda & Kegiatan</h1>
          <p className="text-neutral-500 text-sm">Tambahkan jadwal kegiatan resmi, pelatihan, atau event PLUT.</p>
        </div>
        <Link href="/admin/plut" className="text-sm font-bold text-neutral-500 hover:text-[#407d99] transition-colors">
          &larr; Kembali ke Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* FORM TAMBAH AGENDA */}
        <form onSubmit={handleSubmit} className="lg:col-span-4 bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm h-fit space-y-5">
          <h2 className="text-lg font-bold text-neutral-900 border-b pb-2">Tambah Agenda Baru</h2>
          
          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-1">Judul Kegiatan <span className="text-red-500">*</span></label>
            <input type="text" value={judulKegiatan} onChange={(e) => setJudulKegiatan(e.target.value)} placeholder="Contoh: Pelatihan Digital Marketing" className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#407d99] text-sm" required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-1">Mulai <span className="text-red-500">*</span></label>
              <input type="datetime-local" value={tanggalMulai} onChange={(e) => setTanggalMulai(e.target.value)} className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#407d99] text-xs" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-neutral-700 mb-1">Selesai (Opsional)</label>
              <input type="datetime-local" value={tanggalSelesai} onChange={(e) => setTanggalSelesai(e.target.value)} className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#407d99] text-xs" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-1">Lokasi Kegiatan</label>
            <input type="text" value={lokasi} onChange={(e) => setLokasi(e.target.value)} placeholder="Contoh: Gedung PLUT Buleleng" className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#407d99] text-sm" />
          </div>

          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-1">Link Pendaftaran (Opsional)</label>
            <input type="url" value={linkPendaftaran} onChange={(e) => setLinkPendaftaran(e.target.value)} placeholder="https://forms.gle/..." className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#407d99] text-sm" />
          </div>

          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-1">Deskripsi Singkat</label>
            <textarea value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} placeholder="Detail tambahan terkait kegiatan..." rows={3} className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#407d99] text-sm resize-none" />
          </div>

          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-1">Poster / Gambar Kegiatan</label>
            <input type="file" accept="image/*" onChange={(e) => setGambarFile(e.target.files?.[0] || null)} className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-sm" />
          </div>

          <button type="submit" disabled={loading} className="w-full py-3 bg-[#407d99] text-white font-bold rounded-xl hover:bg-[#326278] transition-colors disabled:bg-neutral-400 mt-4">
            {loading ? "Menyimpan..." : "Simpan Agenda"}
          </button>
        </form>

        {/* DAFTAR AGENDA */}
        <div className="lg:col-span-8 space-y-4">
          <h2 className="text-lg font-bold text-neutral-900 border-b pb-2">Daftar Agenda Terjadwal</h2>
          
          {agendas.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {agendas.map((agenda) => {
                const dateStart = new Date(agenda.tanggal_mulai);
                return (
                  <div key={agenda.id} className="bg-white p-5 rounded-3xl border border-neutral-200 shadow-sm flex flex-col sm:flex-row gap-5 items-start sm:items-center hover:border-[#407d99]/30 transition-all">
                    
                    {/* Thumbnail Image */}
                    <div className="w-full sm:w-24 h-32 sm:h-24 bg-neutral-100 rounded-2xl overflow-hidden relative shrink-0">
                      {agenda.gambar_url ? (
                        <Image src={agenda.gambar_url} alt={agenda.judul_kegiatan} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-300">
                          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-grow space-y-1.5 w-full">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="font-bold text-neutral-900 text-lg leading-tight">{agenda.judul_kegiatan}</h3>
                        <div className="flex bg-neutral-50 border border-neutral-100 rounded-lg p-1 shrink-0">
                          <button onClick={() => handleDelete(agenda.id)} className="p-1.5 text-neutral-400 hover:text-red-600 rounded-md transition-colors" title="Hapus">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-neutral-600 font-medium">
                        <span className="flex items-center gap-1.5 bg-[#407d99]/10 text-[#407d99] px-2.5 py-1 rounded-md">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                          {dateStart.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </span>
                        
                        {agenda.lokasi && (
                          <span className="flex items-center gap-1.5 bg-neutral-100 px-2.5 py-1 rounded-md">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            {agenda.lokasi}
                          </span>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-neutral-200 p-12 text-center text-neutral-400 shadow-sm">
              <svg className="w-12 h-12 mx-auto mb-3 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Belum ada jadwal agenda yang dibuat.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}