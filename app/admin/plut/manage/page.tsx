"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";

type Article = {
  id: string;
  title: string;
  slug: string;
  image_url: string;
  published_date: string;
  created_at: string;
};

export default function ManagePlutNewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  
  const supabase = createClient();

  const fetchArticles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("plut_articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching articles:", error);
    } else {
      setArticles(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (id: string, imageUrl: string) => {
    const isConfirmed = window.confirm("Apakah Anda yakin ingin menghapus berita ini secara permanen?");
    if (!isConfirmed) return;

    try {
      if (imageUrl) {
        const urlParts = imageUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const filePath = `berita/${fileName}`;

        const { error: storageError } = await supabase.storage
          .from("plut-public")
          .remove([filePath]);

        if (storageError) {
          console.error("Gagal menghapus gambar:", storageError);
        }
      }

      const { error: dbError } = await supabase
        .from("plut_articles")
        .delete()
        .eq("id", id);

      if (dbError) throw dbError;

      alert("Berita berhasil dihapus!");
      fetchArticles();

    } catch (error: any) {
      console.error("Error deleting:", error.message);
      alert("Terjadi kesalahan saat menghapus: " + error.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Kelola Berita PLUT</h1>
          <p className="text-neutral-500 text-sm">Daftar semua berita dan artikel yang telah dipublikasikan.</p>
        </div>
        <Link 
          href="/admin/plut" 
          className="bg-[#FF3C00] hover:bg-[#d63200] text-white px-4 py-2 rounded-lg font-semibold transition-colors"
        >
          + Tambah Berita Baru
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200 text-sm text-neutral-600">
                <th className="p-4 font-semibold w-24">Gambar</th>
                <th className="p-4 font-semibold">Judul Berita</th>
                <th className="p-4 font-semibold w-40">Tanggal</th>
                <th className="p-4 font-semibold w-40 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-neutral-500">
                    Memuat data...
                  </td>
                </tr>
              ) : articles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-neutral-500">
                    Belum ada berita yang tersedia.
                  </td>
                </tr>
              ) : (
                articles.map((article) => (
                  <tr key={article.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="p-4">
                      <div className="relative w-16 h-12 rounded-md overflow-hidden bg-neutral-200">
                        {article.image_url ? (
                          <Image 
                            src={article.image_url} 
                            alt={article.title} 
                            fill 
                            className="object-cover"
                          />
                        ) : (
                          <span className="flex items-center justify-center h-full text-xs text-neutral-400">No Img</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-neutral-900 line-clamp-1">{article.title}</p>
                      <p className="text-xs text-neutral-500 mt-1">/plut/berita/{article.slug}</p>
                    </td>
                    <td className="p-4 text-sm text-neutral-600">
                      {article.published_date || article.created_at.split('T')[0]}
                    </td>
                    <td className="p-4 flex gap-2 justify-center">
                      <Link 
                        href={`/plut/berita/${article.slug}`}
                        target="_blank"
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Lihat Berita"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      </Link>
                      
                      {/* Tombol Edit Baru */}
                      <Link 
                        href={`/admin/plut/edit/${article.id}`}
                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Edit Berita"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </Link>

                      <button 
                        onClick={() => handleDelete(article.id, article.image_url)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus Berita"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}