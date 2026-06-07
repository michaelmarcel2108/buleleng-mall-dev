"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

// Fungsi format tanggal
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function ManagePostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Fungsi untuk mengambil data dari tabel
  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("plut_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Gagal mengambil data:", error.message);
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [supabase]);

  // Fungsi untuk menghapus data
  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Yakin ingin menghapus postingan "${title}"? Data tidak bisa dikembalikan.`)) return;

    try {
      const { error } = await supabase.from("plut_posts").delete().eq("id", id);
      if (error) throw error;
      
      alert("Postingan berhasil dihapus!");
      fetchPosts(); // Segarkan tabel setelah menghapus
    } catch (error: any) {
      alert("Gagal menghapus: " + error.message);
    }
  };

  // Desain warna label (badge) sesuai jenis postingan
  const getBadgeColor = (type: string) => {
    switch (type) {
      case "berita": return "bg-blue-100 text-blue-700 border-blue-200";
      case "pengumuman": return "bg-green-100 text-green-700 border-green-200";
      case "infografis": return "bg-purple-100 text-purple-700 border-purple-200";
      default: return "bg-neutral-100 text-neutral-700 border-neutral-200";
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 font-sans">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900">Kelola Postingan Publik</h1>
          <p className="text-neutral-500 text-sm mt-1">Atur semua berita, pengumuman, dan infografis portal PLUT kita di sini.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/plut" className="px-5 py-2.5 text-sm font-bold text-neutral-600 bg-white border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors">
            Kembali
          </Link>
          <Link href="/admin/plut/edit/new" className="px-5 py-2.5 text-sm font-bold text-white bg-[#FF3C00] rounded-lg hover:bg-[#d63200] transition-colors shadow-sm">
            + Tulis Postingan Baru
          </Link>
        </div>
      </div>

      {/* TABEL DATA */}
      <div className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase text-[11px] font-extrabold tracking-wider">
              <tr>
                <th className="px-6 py-4">Judul Postingan</th>
                <th className="px-6 py-4 w-32 text-center">Jenis</th>
                <th className="px-6 py-4 w-40 text-center">Tanggal Dibuat</th>
                <th className="px-6 py-4 w-32 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-neutral-400 font-medium">Memuat data...</td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-neutral-400 font-medium">Belum ada postingan. Silakan buat baru.</td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-neutral-900 line-clamp-1">{post.title}</div>
                      <div className="text-[11px] text-neutral-400 font-mono mt-1">/{post.slug}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getBadgeColor(post.post_type)}`}>
                        {post.post_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-neutral-500">
                      {formatDate(post.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link 
                          href={`/admin/plut/edit/${post.slug}`}
                          className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                        >
                          Edit
                        </Link>
                        <button 
                          onClick={() => handleDelete(post.id, post.title)}
                          className="px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                        >
                          Hapus
                        </button>
                      </div>
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