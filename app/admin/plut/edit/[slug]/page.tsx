"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

export default function EditPostinganPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const router = useRouter();
  const supabase = createClient();
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const isNew = resolvedParams.slug === "new";

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    post_type: "berita", // Default pilihan
    excerpt: "",
    content: "",
    image_url: "",
  });

  useEffect(() => {
    if (!isNew) {
      supabase.from("plut_posts").select("*").eq("slug", resolvedParams.slug).single()
        .then(({ data }) => { 
          if (data) setFormData({ ...data }); 
          setIsLoading(false);
        });
    }
  }, [isNew, resolvedParams.slug, supabase]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // Auto-generate Slug saat mengetik judul (hanya untuk postingan baru)
      if (isNew && name === "title") {
        updated.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");   
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let finalImageUrl = formData.image_url;

      // 1. Upload Gambar jika ada file yang dipilih
      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const fileName = `post-${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("plut-public")
          .upload(`posts/${fileName}`, imageFile);
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage.from("plut-public").getPublicUrl(`posts/${fileName}`);
        finalImageUrl = data.publicUrl;
      }

      // 2. Simpan Data ke Tabel
      const postData = { ...formData, image_url: finalImageUrl };

      if (isNew) {
        const { error } = await supabase.from("plut_posts").insert([postData]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("plut_posts").update(postData).eq("slug", resolvedParams.slug);
        if (error) throw error;
      }
      
      alert("Postingan berhasil disimpan!");
      router.push("/admin/plut"); // Kembali ke dashboard
      router.refresh();

    } catch (error: any) {
      console.error(error);
      alert("Gagal menyimpan: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-8 text-neutral-500 font-bold">Memuat form...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-extrabold text-neutral-900">{isNew ? "Tulis Postingan Baru" : "Edit Postingan"}</h1>
        <Link href="/admin/plut" className="text-sm font-bold text-neutral-500 hover:text-[#FF3C00]">
          &larr; Kembali
        </Link>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-neutral-100">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold mb-2">Judul Postingan *</label>
            <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border bg-neutral-50 focus:ring-2 focus:ring-[#FF3C00] outline-none" />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Jenis Postingan *</label>
            <select name="post_type" required value={formData.post_type} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border bg-neutral-50 focus:ring-2 focus:ring-[#FF3C00] outline-none">
              <option value="berita">Berita & Kegiatan</option>
              <option value="pengumuman">Pengumuman</option>
              <option value="infografis">Banner Infografis</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">URL Slug *</label>
          <input type="text" name="slug" required value={formData.slug} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border bg-neutral-50 focus:ring-2 focus:ring-[#FF3C00] outline-none font-mono text-sm" />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">Upload Gambar Utama (Thumbnail)</label>
          <div className="flex items-center gap-6">
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="flex-1 px-4 py-3 rounded-lg border bg-neutral-50 focus:outline-none" />
            {formData.image_url && !imageFile && (
              <div className="w-16 h-16 relative rounded-lg overflow-hidden border">
                <Image src={formData.image_url} alt="Thumbnail" fill className="object-cover" />
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">Kutipan Singkat (Excerpt)</label>
          <textarea rows={2} name="excerpt" value={formData.excerpt} onChange={handleChange} placeholder="Ringkasan yang akan tampil di halaman depan..." className="w-full px-4 py-3 rounded-lg border bg-neutral-50 focus:ring-2 focus:ring-[#FF3C00] outline-none resize-none" />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">Isi Konten Lengkap</label>
          <textarea rows={8} name="content" value={formData.content} onChange={handleChange} placeholder="Tulis detail berita di sini..." className="w-full px-4 py-3 rounded-lg border bg-neutral-50 focus:ring-2 focus:ring-[#FF3C00] outline-none resize-none" />
        </div>

        <div className="pt-4 border-t border-neutral-100 flex justify-end gap-4">
          <Link href="/admin/plut" className="px-6 py-3 font-bold text-neutral-500 hover:bg-neutral-100 rounded-lg transition-colors">Batal</Link>
          <button type="submit" disabled={isSubmitting} className="px-8 py-3 font-bold text-white bg-[#FF3C00] hover:bg-[#e03500] rounded-lg transition-colors">
            {isSubmitting ? "Menyimpan..." : "Publish Postingan"}
          </button>
        </div>
      </form>
    </div>
  );
}