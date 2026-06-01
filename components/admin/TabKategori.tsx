"use client";

import { createClient } from "@/lib/supabase/client";
import { Category } from "@/types"; // Removed Banner
import { useState, useEffect, useCallback } from "react";

// Local intersection type in case your global Category type is missing 'slug'
type ExtendedCategory = Category & { slug?: string };

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

export default function TabKategori() {
  const [categories, setCategories] = useState<ExtendedCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // FIX 1: Changed Partial<Banner> to Partial<Category>
  const [editingItem, setEditingItem] =
    useState<Partial<ExtendedCategory> | null>(null);

  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const supabase = createClient();

  const fetchCategoriesData = useCallback(async () => {
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("name");
    return data;
  }, [supabase]);

  useEffect(() => {
    let isMounted = true;

    fetchCategoriesData().then((data) => {
      if (data && isMounted) setCategories(data);
    });

    return () => {
      isMounted = false; // Cleanup to prevent memory leaks
    };
  }, [fetchCategoriesData]);

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredCategories = categories.filter((c) =>
    (c.name || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const openAddModal = () => {
    setIsEditMode(false);
    setEditingItem({ name: "" });
    setIsModalOpen(true);
  };

  // FIX 4: Changed parameter from Banner to ExtendedCategory
  const openEditModal = (item: ExtendedCategory) => {
    setIsEditMode(true);
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  // FIX 5: Allowed id to be string | number to match your DB types
  const handleDeleteData = async (id: string | number) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus kategori ini?`))
      return;
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
      fetchCategoriesData();
      showToast(`Kategori berhasil dihapus!`, "success");
    } catch (error: unknown) {
      // FIX 6: Replaced 'any' with 'unknown' and typecast to Error
      const err = error as Error;
      showToast("Gagal menghapus: " + err.message, "error");
    }
  };

  const handleSaveData = async (e: React.SubmitEvent) => {
    e.preventDefault();
    // Safety check to ensure editingItem is not null before proceeding
    if (!editingItem || !editingItem.name) return;

    setIsSaving(true);
    try {
      const payload = {
        name: editingItem.name,
        slug: generateSlug(editingItem.name),
      };

      if (isEditMode) {
        const { error } = await supabase
          .from("categories")
          .update(payload)
          .eq("id", editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("categories").insert([payload]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchCategoriesData();
      showToast(
        `Kategori berhasil ${isEditMode ? "diperbarui" : "ditambahkan"}!`,
        "success",
      );
    } catch (error: unknown) {
      // FIX 6: Replaced 'any' with 'unknown'
      const err = error as Error;
      showToast("Gagal menyimpan: " + err.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50">
        <h2 className="font-bold text-gray-800">Daftar Kategori</h2>
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
              placeholder="Cari kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#274a6a] outline-none text-sm"
            />
          </div>
          <button
            onClick={openAddModal}
            className="bg-[#274a6a] text-white px-4 py-2 text-sm rounded-lg hover:bg-[#1f3b54] font-medium whitespace-nowrap"
          >
            + Tambah Kategori
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="p-4 font-medium">Nama Kategori</th>
              <th className="p-4 font-medium hidden md:table-cell">
                Slug (URL)
              </th>
              <th className="p-4 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100">
            {filteredCategories.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-medium text-gray-800">{c.name}</td>
                <td className="p-4 text-gray-500 hidden md:table-cell">
                  {c.slug || "-"}
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(c)}
                      className="text-[#274a6a] hover:bg-blue-50 font-medium text-xs border border-[#274a6a]/20 px-3 py-1.5 rounded transition-colors"
                    >
                      Edit
                    </button>
                    {/* Fixed 'id' type checking issue */}
                    <button
                      onClick={() => c.id && handleDeleteData(c.id)}
                      className="text-red-600 hover:bg-red-50 font-medium text-xs border border-red-200 px-3 py-1.5 rounded transition-colors"
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredCategories.length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-500">
                  Kategori tidak ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-[#274a6a] text-lg">
                {isEditMode ? "Edit" : "Tambah"} Kategori
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-700 font-bold text-xl"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSaveData} className="p-5 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Kategori
                </label>
                <input
                  type="text"
                  value={editingItem?.name || ""} // FIX 7: Added optional chaining
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
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
                  {isSaving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-white font-medium text-sm bg-gray-800">
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
