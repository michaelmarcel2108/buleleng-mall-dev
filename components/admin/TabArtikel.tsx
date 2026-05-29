"use client";

import { useState, useEffect, useCallback } from "react";
import { Article } from "@/types";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

const generateSlug = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

export default function TabArtikel() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const supabase = createClient();

  // State Modal Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<Article> | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // State Modal Hapus Custom
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    id: "",
    title: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const fetchArticlesData = useCallback(async () => {
    const { data } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });
    return data;
  }, [supabase]);

  useEffect(() => {
    let isMounted = true;

    fetchArticlesData().then((data) => {
      if (data && isMounted) setArticles(data);
    });

    return () => {
      isMounted = false;
    };
  }, [fetchArticlesData]);

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredArticles = articles.filter((a) =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const openAddModal = () => {
    setIsEditMode(false);
    setSelectedFile(null);
    setEditingItem({ title: "", content: "", author: "Admin", image_url: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (item: Partial<Article>) => {
    setIsEditMode(true);
    setSelectedFile(null);
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  // FUNGSI EKSEKUSI HAPUS CUSTOM
  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("articles")
        .delete()
        .eq("id", deleteConfirm.id);
      if (error) throw error;

      // 3. Refresh table data after delete
      fetchArticlesData().then((data) => {
        if (data) setArticles(data);
      });

      showToast(`Artikel berhasil dihapus!`, "success");
    } catch (error: unknown) {
      // Changed 'any' to 'unknown'
      const err = error as Error;
      showToast("Gagal menghapus: " + err.message, "error");
    } finally {
      setIsDeleting(false);
      setDeleteConfirm({ isOpen: false, id: "", title: "" }); // Tutup modal hapus
    }
  };

  const handleSaveData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.title) return; // Safety check for TS

    setIsSaving(true);
    try {
      let finalImageUrl = editingItem.image_url || "";

      if (selectedFile) {
        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `article-${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("image")
          .upload(fileName, selectedFile);
        if (uploadError) throw uploadError;

        finalImageUrl = supabase.storage.from("image").getPublicUrl(fileName)
          .data.publicUrl;
      }

      const payload = {
        title: editingItem.title,
        slug: generateSlug(editingItem.title),
        content: editingItem.content,
        author: editingItem.author || "Admin",
        image_url: finalImageUrl,
      };

      if (isEditMode && editingItem.id) {
        const { error } = await supabase
          .from("articles")
          .update(payload)
          .eq("id", editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("articles").insert([payload]);
        if (error) throw error;
      }

      setIsModalOpen(false);

      // 4. Refresh table data after save
      fetchArticlesData().then((data) => {
        if (data) setArticles(data);
      });

      showToast(
        `Artikel berhasil ${isEditMode ? "diperbarui" : "ditambahkan"}!`,
        "success",
      );
    } catch (error: unknown) {
      // Changed 'any' to 'unknown'
      const err = error as Error;
      showToast("Gagal menyimpan: " + err.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50">
        <h2 className="font-bold text-gray-800">Manajemen Artikel</h2>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
          <div className="relative w-full sm:w-64">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Cari judul artikel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#274a6a] outline-none text-sm"
            />
          </div>
          <button
            onClick={openAddModal}
            className="bg-[#274a6a] text-white px-4 py-2 text-sm rounded-lg hover:bg-[#1f3b54] font-medium whitespace-nowrap"
          >
            + Tambah Artikel
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="p-4 font-medium">Artikel</th>
              <th className="p-4 font-medium hidden md:table-cell">Penulis</th>
              <th className="p-4 font-medium hidden md:table-cell">Tanggal</th>
              <th className="p-4 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100">
            {filteredArticles.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-medium text-gray-800 flex items-center gap-3">
                  {a.image_url ? (
                    <Image
                      width={500}
                      height={500}
                      src={a.image_url}
                      alt={a.title}
                      className="w-12 h-10 object-cover rounded-lg bg-gray-100 border"
                    />
                  ) : (
                    <div className="w-12 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-[10px] text-gray-400 border border-dashed">
                      No Img
                    </div>
                  )}
                  <span className="line-clamp-2">{a.title}</span>
                </td>
                <td className="p-4 text-gray-500 hidden md:table-cell">
                  {a.author}
                </td>
                <td className="p-4 text-gray-500 hidden md:table-cell">
                  {new Date(a.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(a)}
                      className="text-[#274a6a] hover:bg-blue-50 font-medium text-xs border border-[#274a6a]/20 px-3 py-1.5 rounded transition-colors"
                    >
                      Edit
                    </button>
                    {/* TOMBOL HAPUS MEMBUKA MODAL CUSTOM */}
                    <button
                      onClick={() =>
                        setDeleteConfirm({
                          isOpen: true,
                          id: a.id,
                          title: a.title,
                        })
                      }
                      className="text-red-600 hover:bg-red-50 font-medium text-xs border border-red-200 px-3 py-1.5 rounded transition-colors"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredArticles.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  Belum ada artikel.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* POP-UP MODAL FORM TAMBAH/EDIT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-[#274a6a] text-lg">
                {isEditMode ? "Edit" : "Tambah"} Artikel
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 font-bold text-xl"
              >
                &times;
              </button>
            </div>

            <form
              onSubmit={handleSaveData}
              className="p-5 flex flex-col gap-5 overflow-y-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Judul Artikel
                  </label>
                  <input
                    type="text"
                    value={editingItem?.title || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#274a6a]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Penulis
                  </label>
                  <input
                    type="text"
                    value={editingItem?.author || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, author: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#274a6a]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thumbnail Artikel (Landscape)
                  </label>
                  {isEditMode && editingItem?.image_url && !selectedFile && (
                    <Image
                      width={500}
                      height={500}
                      src={editingItem.image_url}
                      alt="Preview"
                      className="w-full h-24 object-cover rounded-lg border border-gray-200 mb-2 shadow-sm"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files && setSelectedFile(e.target.files[0])
                    }
                    className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#274a6a]/10 file:text-[#274a6a]"
                    required={!isEditMode && !editingItem?.image_url}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Isi Artikel
                </label>
                <textarea
                  rows={10}
                  value={editingItem?.content || ""}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, content: e.target.value })
                  }
                  placeholder="Tulis konten artikel di sini..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#274a6a] resize-y"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#274a6a] hover:bg-[#1f3b54] rounded-lg"
                >
                  {isSaving ? "Menyimpan..." : "Simpan Artikel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POP-UP KONFIRMASI HAPUS MODERN */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center transform transition-all">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border-[6px] border-red-50/50">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">
              Hapus Artikel?
            </h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Apakah Anda yakin ingin menghapus{" "}
              <span className="font-semibold text-gray-700">
                &quot;{deleteConfirm.title}&quot;
              </span>
              ? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3 justify-center w-full">
              <button
                onClick={() =>
                  setDeleteConfirm({ isOpen: false, id: "", title: "" })
                }
                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Menghapus...
                  </>
                ) : (
                  "Ya, Hapus"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFIKASI */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-70 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-white font-medium text-sm transition-all duration-300 ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}
        >
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
