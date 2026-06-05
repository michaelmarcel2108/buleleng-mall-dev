"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client"; // Pastikan Anda punya supabase client

export default function EditPostPage({ params }: { params: Promise<{ slug: string }> | { slug: string } }) {
  const router = useRouter();
  const supabase = createClient();
  
  // Menggunakan React.use() untuk unwrap params (best practice Next.js 15+)
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const isNewPost = resolvedParams.slug === "new";

  // State Form
  const [isLoading, setIsLoading] = useState(!isNewPost);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    post_type: "berita",
    image_url: "",
    excerpt: "",
    content: "",
    author: "Admin PLUT",
  });

  // Fetch data jika ini adalah mode Edit
  useEffect(() => {
    if (!isNewPost) {
      const fetchPost = async () => {
        const { data, error } = await supabase
          .from("plut_posts")
          .select("*")
          .eq("slug", resolvedParams.slug)
          .single();

        if (error) {
          setErrorMsg("Gagal memuat data postingan.");
          setIsLoading(false);
          return;
        }

        if (data) {
          setFormData({
            title: data.title || "",
            slug: data.slug || "",
            post_type: data.post_type || "berita",
            image_url: data.image_url || "",
            excerpt: data.excerpt || "",
            content: data.content || "",
            author: data.author || "Admin PLUT",
          });
        }
        setIsLoading(false);
      };
      
      fetchPost();
    }
  }, [isNewPost, resolvedParams.slug, supabase]);

  // Handle Perubahan Input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      
      // Auto-generate Slug jika Title berubah (Hanya saat membuat post baru)
      if (isNewPost && name === "title") {
        updated.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-") // Ganti spasi/simbol dengan strip
          .replace(/(^-|-$)+/g, "");   // Hapus strip di awal/akhir
      }
      return updated;
    });
  };

  // Handle Submit (Create / Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      if (isNewPost) {
        // Mode INSERT (Baru)
        const { error } = await supabase.from("plut_posts").insert([
          {
            title: formData.title,
            slug: formData.slug,
            post_type: formData.post_type,
            image_url: formData.image_url,
            excerpt: formData.excerpt,
            content: formData.content,
            author: formData.author,
          }
        ]);
        if (error) throw error;
      } else {
        // Mode UPDATE (Edit)
        const { error } = await supabase
          .from("plut_posts")
          .update({
            title: formData.title,
            slug: formData.slug, // Hati-hati jika slug diubah, URL akan berubah
            post_type: formData.post_type,
            image_url: formData.image_url,
            excerpt: formData.excerpt,
            content: formData.content,
            author: formData.author,
            updated_at: new Date().toISOString(),
          })
          .eq("slug", resolvedParams.slug);
        
        if (error) throw error;
      }

      // Berhasil, kembali ke halaman manage
      router.push("/admin/plut/manage");
      router.refresh();
      
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan saat menyimpan data.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <p className="text-neutral-500 font-bold">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col md:flex-row font-sans">
      
      {/* SIDEBAR ADMIN (Bisa diekstrak jadi komponen agar tidak mengulang) */}
      <aside className="w-full md:w-64 bg-neutral-900 text-white flex flex-col shrink-0 hidden md:flex">
        <div className="p-6 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#FF3C00] rounded-lg flex items-center justify-center text-white font-bold shadow-md">P</div>
            <span className="font-bold text-lg tracking-wide">Admin PLUT</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin/plut" className="block px-4 py-3 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-xl font-medium transition-colors">Dashboard</Link>
          <Link href="/admin/plut/manage" className="block px-4 py-3 bg-[#FF3C00] text-white rounded-xl font-medium shadow-md">Kelola Postingan</Link>
        </nav>
      </aside>

      {/* MAIN KONTEN */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white border-b border-neutral-200 px-8 py-5 flex items-center gap-4 sticky top-0 z-10">
          <Link href="/admin/plut/manage" className="text-neutral-400 hover:text-[#FF3C00] transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-neutral-900">
              {isNewPost ? "Tambah Postingan Baru" : "Edit Postingan"}
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
              {/* JUDUL */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-neutral-700 mb-2">Judul Postingan *</label>
                <input 
                  type="text" 
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Masukkan judul..."
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-[#FF3C00] focus:border-transparent transition-all outline-none"
                />
              </div>

              {/* SLUG */}
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">URL Slug *</label>
                <input 
                  type="text" 
                  name="slug"
                  required
                  value={formData.slug}
                  onChange={handleChange}
                  placeholder="judul-postingan"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-[#FF3C00] focus:border-transparent transition-all outline-none font-mono text-sm"
                />
              </div>

              {/* KATEGORI / POST TYPE */}
              <div>
                <label className="block text-sm font-bold text-neutral-700 mb-2">Kategori (Tipe) *</label>
                <select 
                  name="post_type"
                  value={formData.post_type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-[#FF3C00] focus:border-transparent transition-all outline-none"
                >
                  <option value="berita">Berita</option>
                  <option value="artikel">Artikel Edukasi</option>
                  <option value="pengumuman">Pengumuman</option>
                  <option value="infografis">Infografis</option>
                  <option value="foto">Galeri Foto</option>
                  <option value="video">Galeri Video</option>
                </select>
              </div>

              {/* URL GAMBAR */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-neutral-700 mb-2">URL Gambar / Thumbnail</label>
                <input 
                  type="text" 
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  placeholder="https://contoh.com/gambar.jpg"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-[#FF3C00] focus:border-transparent transition-all outline-none"
                />
              </div>

              {/* KUTIPAN SINGKAT */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-neutral-700 mb-2">Kutipan Singkat (Excerpt)</label>
                <textarea 
                  name="excerpt"
                  rows={2}
                  value={formData.excerpt}
                  onChange={handleChange}
                  placeholder="Ringkasan singkat tentang postingan ini..."
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-[#FF3C00] focus:border-transparent transition-all outline-none resize-none"
                />
              </div>

              {/* KONTEN UTAMA */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-neutral-700 mb-2">Konten Lengkap (HTML Didukung) *</label>
                {/* TIPS: Anda bisa mengganti textarea ini dengan React-Quill nanti */}
                <textarea 
                  name="content"
                  required
                  rows={10}
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="<p>Tulis isi konten di sini...</p>"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-[#FF3C00] focus:border-transparent transition-all outline-none font-mono text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-neutral-100">
              <button 
                type="button"
                onClick={() => router.push('/admin/plut/manage')}
                className="px-6 py-3 mr-4 text-neutral-600 font-bold hover:bg-neutral-100 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-[#FF3C00] hover:bg-[#e03500] text-white font-bold rounded-xl transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>Menyimpan...</>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                    Simpan Postingan
                  </>
                )}
              </button>
            </div>
            
          </form>
        </div>
      </main>
    </div>
  );
}