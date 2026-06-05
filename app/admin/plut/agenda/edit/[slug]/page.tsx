"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function EditAgendaPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const router = useRouter();
  const supabase = createClient();
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const isNew = resolvedParams.slug === "new";

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    judul_kegiatan: "",
    slug: "",
    deskripsi: "",
    tanggal_mulai: "",
    lokasi: "",
    link_pendaftaran: "",
  });

  useEffect(() => {
    if (!isNew) {
      supabase.from("plut_agendas").select("*").eq("slug", resolvedParams.slug).single()
        .then(({ data }) => { 
          if (data) setFormData({
            ...data,
            tanggal_mulai: data.tanggal_mulai ? data.tanggal_mulai.split('T')[0] : "" 
          }); 
          setIsLoading(false);
        });
    }
  }, [isNew, resolvedParams.slug, supabase]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      
      // Auto-generate Slug khusus saat buat baru
      if (isNew && name === "judul_kegiatan") {
        updated.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-") 
          .replace(/(^-|-$)+/g, "");   
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (isNew) {
      await supabase.from("plut_agendas").insert([formData]);
    } else {
      await supabase.from("plut_agendas").update(formData).eq("slug", resolvedParams.slug);
    }
    
    router.push("/admin/plut/agenda-regulasi");
    router.refresh();
  };

  if (isLoading) return <div className="p-8 text-neutral-500 font-bold">Memuat form...</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto font-sans">
      <h1 className="text-2xl font-extrabold mb-6">{isNew ? "Tambah Agenda Kegiatan" : "Edit Agenda"}</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-neutral-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-2">Judul Kegiatan *</label>
            <input type="text" name="judul_kegiatan" required value={formData.judul_kegiatan} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border bg-neutral-50 focus:ring-2 focus:ring-[#FF3C00] outline-none" />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-2">URL Slug *</label>
            <input type="text" name="slug" required value={formData.slug} onChange={handleChange} placeholder="judul-kegiatan" className="w-full px-4 py-3 rounded-lg border bg-neutral-50 focus:ring-2 focus:ring-[#FF3C00] outline-none font-mono text-sm" />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Tanggal Pelaksanaan *</label>
            <input type="date" name="tanggal_mulai" required value={formData.tanggal_mulai} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border bg-neutral-50 focus:ring-2 focus:ring-[#FF3C00] outline-none" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Lokasi</label>
            <input type="text" name="lokasi" value={formData.lokasi} onChange={handleChange} placeholder="Contoh: Gedung PLUT Lantai 2" className="w-full px-4 py-3 rounded-lg border bg-neutral-50 focus:ring-2 focus:ring-[#FF3C00] outline-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">Deskripsi Singkat</label>
          <textarea rows={3} name="deskripsi" value={formData.deskripsi} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border bg-neutral-50 focus:ring-2 focus:ring-[#FF3C00] outline-none resize-none" />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">Link Pendaftaran (Opsional)</label>
          <input type="url" name="link_pendaftaran" value={formData.link_pendaftaran} onChange={handleChange} placeholder="https://forms.gle/..." className="w-full px-4 py-3 rounded-lg border bg-neutral-50 focus:ring-2 focus:ring-[#FF3C00] outline-none" />
        </div>

        <div className="pt-4 flex gap-4">
          <Link href="/admin/plut/agenda-regulasi" className="px-6 py-3 font-bold text-neutral-500 hover:bg-neutral-100 rounded-lg transition-colors">Batal</Link>
          <button type="submit" disabled={isSubmitting} className="px-6 py-3 font-bold text-white bg-[#FF3C00] hover:bg-[#e03500] rounded-lg transition-colors">{isSubmitting ? "Menyimpan..." : "Simpan Agenda"}</button>
        </div>
      </form>
    </div>
  );
}