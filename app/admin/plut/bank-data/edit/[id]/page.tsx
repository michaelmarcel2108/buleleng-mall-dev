"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function EditBankDataPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  const router = useRouter();
  const supabase = createClient();
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const isNew = resolvedParams.id === "new";

  const [formData, setFormData] = useState({ nama_dokumen: "", kategori: "Legalitas & Perizinan", link_url: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isNew) {
      supabase.from("plut_bank_data").select("*").eq("id", resolvedParams.id).single()
        .then(({ data }) => { if (data) setFormData({ ...data }); });
    }
  }, [isNew, resolvedParams.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (isNew) {
      await supabase.from("plut_bank_data").insert([formData]);
    } else {
      await supabase.from("plut_bank_data").update(formData).eq("id", resolvedParams.id);
    }
    router.push("/admin/plut/bank-data");
    router.refresh();
  };

  return (
    <div className="p-8 max-w-2xl mx-auto font-sans">
      <h1 className="text-2xl font-extrabold mb-6">{isNew ? "Tambah Dokumen" : "Edit Dokumen"}</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-neutral-100">
        <div>
          <label className="block text-sm font-bold mb-2">Nama Dokumen</label>
          <input type="text" required value={formData.nama_dokumen} onChange={(e) => setFormData({...formData, nama_dokumen: e.target.value})} className="w-full px-4 py-3 rounded-lg border bg-neutral-50 focus:ring-2 focus:ring-[#FF3C00] outline-none" />
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">Kategori Group</label>
          <select value={formData.kategori} onChange={(e) => setFormData({...formData, kategori: e.target.value})} className="w-full px-4 py-3 rounded-lg border bg-neutral-50 focus:ring-2 focus:ring-[#FF3C00] outline-none">
            <option value="Legalitas & Perizinan">Legalitas & Perizinan</option>
            <option value="Pembiayaan & Keuangan">Pembiayaan & Keuangan</option>
            <option value="Branding & Pemasaran">Branding & Pemasaran</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">Tautan URL (Link Google Drive dll)</label>
          <input type="url" required value={formData.link_url} onChange={(e) => setFormData({...formData, link_url: e.target.value})} placeholder="https://..." className="w-full px-4 py-3 rounded-lg border bg-neutral-50 focus:ring-2 focus:ring-[#FF3C00] outline-none" />
        </div>
        <div className="pt-4 flex gap-4">
          <button type="button" onClick={() => router.back()} className="px-6 py-3 font-bold text-neutral-500 hover:bg-neutral-100 rounded-lg">Batal</button>
          <button type="submit" disabled={isSubmitting} className="px-6 py-3 font-bold text-white bg-[#FF3C00] rounded-lg">{isSubmitting ? "Menyimpan..." : "Simpan Data"}</button>
        </div>
      </form>
    </div>
  );
}