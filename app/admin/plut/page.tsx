"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css"; 
import Link from "next/link";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

type Article = {
  id: string;
  title: string;
  slug: string;
  published_date: string;
};

export default function AdminPlutPage() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  
  const router = useRouter();
  const supabase = createClient();

  // Fungsi mengambil daftar berita
  const fetchArticles = async () => {
    setLoadingArticles(true);
    const { data, error } = await supabase
      .from("plut_articles")
      .select("id, title, slug, published_date, created_at")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setArticles(data);
    }
    setLoadingArticles(false);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";

      if (image) {
        const fileExt = image.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from("plut-public").upload(`berita/${fileName}`, image);
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from("plut-public").getPublicUrl(`berita/${fileName}`);
        imageUrl = data.publicUrl;
      }

      const { error: insertError } = await supabase.from("plut_articles").insert([
        {
          title, slug, excerpt, content, image_url: imageUrl,
          published_date: new Date().toISOString().split('T')[0],
        }
      ]);

      if (insertError) throw insertError;

      alert("Berita berhasil dipublikasikan!");
      setTitle(""); setSlug(""); setExcerpt(""); setContent(""); setImage(null);
      fetchArticles(); // Refresh daftar tabel

    } catch (error: any) {
      alert("Terjadi kesalahan: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "clean"],
    ],
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* NAVBAR KHUSUS ADMIN */}
      <nav className="bg-white border-b border-neutral-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center text-white font-bold">A</div>
            <span className="font-bold text-lg text-neutral-900">Admin PLUT</span>
          </div>
          <div className="flex gap-4">
            <Link href="/admin/plut/settings" className="text-sm font-medium text-neutral-600 hover:text-blue-600 transition-colors">
              Pengaturan Gambar
            </Link>
            <Link href="/plut" target="_blank" className="text-sm font-medium text-neutral-600 hover:text-[#FF3C00] transition-colors">
              Buka Portal Web &rarr;
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 mt-8 space-y-12">
        {/* SECTION 1: FORM TAMBAH BERITA */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200">
          <div className="mb-6 border-b border-neutral-100 pb-4">
            <h2 className="text-2xl font-bold text-neutral-900">Buat Berita Baru</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Judul Artikel</label>
                <input type="text" required value={title} onChange={handleTitleChange} className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#FF3C00] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Slug URL</label>
                <input type="text" required value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-4 py-3 border border-neutral-300 rounded-xl bg-neutral-50 focus:ring-2 focus:ring-[#FF3C00] outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Cuplikan (Singkat)</label>
                <textarea required value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={4} className="w-full px-4 py-3 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-[#FF3C00] outline-none resize-none" />
              </div>
              <div className="md:col-span-1">
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Gambar Utama</label>
                <div className="relative border-2 border-dashed border-neutral-300 rounded-xl h-[116px] flex flex-col items-center justify-center text-center hover:bg-neutral-50 cursor-pointer">
                  <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <span className="text-sm font-semibold text-[#FF3C00]">Klik untuk Upload</span>
                  {image && <div className="mt-1 text-xs font-bold text-green-600 truncate px-2 w-full">{image.name}</div>}
                </div>
              </div>
            </div>

            <div className="pb-12">
              <label className="block text-sm font-semibold text-neutral-700 mb-2">Isi Artikel</label>
              <div className="h-[300px]">
                <ReactQuill theme="snow" value={content} onChange={setContent} modules={modules} className="h-full rounded-xl" />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button type="submit" disabled={loading} className={`px-10 py-3 rounded-xl text-white font-bold transition-all shadow-md ${loading ? "bg-neutral-400" : "bg-[#FF3C00] hover:bg-[#d63200]"}`}>
                {loading ? "Menyimpan..." : "Publikasikan Berita"}
              </button>
            </div>
          </form>
        </section>

        {/* SECTION 2: DAFTAR BERITA */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200">
          <div className="mb-6 flex justify-between items-end border-b border-neutral-100 pb-4">
            <h2 className="text-2xl font-bold text-neutral-900">Daftar Berita Publikasi</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 text-sm text-neutral-600 border-y border-neutral-200">
                  <th className="p-4 font-semibold">Judul Berita</th>
                  <th className="p-4 font-semibold">Slug URL</th>
                  <th className="p-4 font-semibold w-40">Tanggal</th>
                  <th className="p-4 font-semibold w-24 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {loadingArticles ? (
                  <tr><td colSpan={4} className="p-6 text-center text-neutral-500">Memuat data...</td></tr>
                ) : articles.length === 0 ? (
                  <tr><td colSpan={4} className="p-6 text-center text-neutral-500">Belum ada berita.</td></tr>
                ) : (
                  articles.map((article) => (
                    <tr key={article.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="p-4 font-semibold text-neutral-900">{article.title}</td>
                      <td className="p-4 text-sm text-neutral-500">{article.slug}</td>
                      <td className="p-4 text-sm text-neutral-500">{article.published_date || 'N/A'}</td>
                      <td className="p-4 text-center">
                        {/* INI LINK MENGARAH KE HALAMAN EDIT BERDASARKAN SLUG */}
                        <Link href={`/admin/plut/edit/${article.slug}`} className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-200 transition-colors">
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
}