"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import Link from "next/link";
import Image from "next/image";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function EditPlutNewsPage() {
  const router = useRouter();
  const params = useParams();
  const slugParam = params.slug as string;
  const supabase = createClient();

  const [articleId, setArticleId] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Ambil data artikel berdasarkan SLUG
  useEffect(() => {
    const fetchArticle = async () => {
      const { data, error } = await supabase
        .from("plut_articles")
        .select("*")
        .eq("slug", slugParam)
        .single();

      if (data) {
        setArticleId(data.id);
        setTitle(data.title);
        setSlug(data.slug);
        setExcerpt(data.excerpt);
        setContent(data.content);
        setCurrentImageUrl(data.image_url);
      } else if (error) {
        alert("Artikel tidak ditemukan!");
        router.push("/admin/plut");
      }
      setFetching(false);
    };

    if (slugParam) fetchArticle();
  }, [slugParam, supabase, router]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalImageUrl = currentImageUrl;

      if (newImage) {
        const fileExt = newImage.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `berita/${fileName}`;

        const { error: uploadError } = await supabase.storage.from("plut-public").upload(filePath, newImage);
        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage.from("plut-public").getPublicUrl(filePath);
        finalImageUrl = publicUrlData.publicUrl;
      }

      // Update data di database menggunakan ID
      const { error: updateError } = await supabase
        .from("plut_articles")
        .update({ title, slug, excerpt, content, image_url: finalImageUrl })
        .eq("id", articleId);

      if (updateError) throw updateError;

      alert("Berita berhasil diperbarui!");
      router.push("/admin/plut");

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

  if (fetching) return <div className="min-h-screen flex items-center justify-center">Memuat data artikel...</div>;

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* NAVBAR KHUSUS ADMIN */}
      <nav className="bg-white border-b border-neutral-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-neutral-900 rounded-lg flex items-center justify-center text-white font-bold">E</div>
            <span className="font-bold text-lg text-neutral-900">Mode Edit Berita</span>
          </div>
          <Link href="/admin/plut" className="text-sm font-medium text-neutral-600 hover:text-[#FF3C00] transition-colors">
            &larr; Batal & Kembali ke Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 mt-8">
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-200">
          <form onSubmit={handleUpdate} className="space-y-6">
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
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Gambar Baru (Opsional)</label>
                <div className="relative border-2 border-dashed border-neutral-300 rounded-xl h-[116px] flex flex-col items-center justify-center text-center hover:bg-neutral-50 cursor-pointer overflow-hidden">
                  <input type="file" accept="image/*" onChange={(e) => setNewImage(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  {currentImageUrl && !newImage && (
                    <Image src={currentImageUrl} alt="Current" fill className="object-cover opacity-30" />
                  )}
                  <span className="text-sm font-semibold text-blue-600 z-10 relative">Ganti Gambar</span>
                  {newImage && <div className="mt-1 text-xs font-bold text-green-600 truncate px-2 w-full z-10 relative">{newImage.name}</div>}
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
              <button type="submit" disabled={loading} className={`px-10 py-3 rounded-xl text-white font-bold transition-all shadow-md ${loading ? "bg-neutral-400" : "bg-blue-600 hover:bg-blue-700"}`}>
                {loading ? "Menyimpan..." : "Update Berita"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}