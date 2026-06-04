"use client";

import { createClient } from "@/lib/supabase/client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Business } from "@/types";

// Menambahkan properti baru ke tipe Business agar Vercel (TypeScript) tidak error
type ExtendedBusiness = Business & {
  desc?: string | null;
  logo_url?: string | null;
  image_url?: string | null;
  shopee_url?: string | null;
  instagram_url?: string | null;
  tiktok_url?: string | null;
  rating?: number; // <-- TAMBAHAN: Menyimpan nilai rating
};

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

interface TabTokoProps {
  onViewProducts?: (businessName: string) => void;
}

export default function TabToko({ onViewProducts }: TabTokoProps) {
  const supabase = createClient();
  const [businesses, setBusinesses] = useState<ExtendedBusiness[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Partial<ExtendedBusiness> | null>(
    null,
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);
  const [selectedBannerFile, setSelectedBannerFile] = useState<File | null>(null);

  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    id: "",
    name: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const fetchBusinessesData = useCallback(async () => {
    const { data } = await supabase
      .from("businesses")
      .select("*")
      .order("name");
    return data;
  }, [supabase]);

  useEffect(() => {
    let isMounted = true;

    fetchBusinessesData().then((data) => {
      if (isMounted && data) {
        setBusinesses(data as ExtendedBusiness[]);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [fetchBusinessesData]);

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filteredBusinesses = businesses.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const openAddModal = () => {
    setIsEditMode(false);
    setSelectedLogoFile(null);
    setSelectedBannerFile(null);
    setEditingItem({ 
      name: "", 
      desc: "", 
      logo_url: "", 
      image_url: "",
      shopee_url: "",
      instagram_url: "",
      tiktok_url: "",
      rating: 5.0, // <-- TAMBAHAN: Nilai default rating 5.0
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: ExtendedBusiness) => {
    setIsEditMode(true);
    setSelectedLogoFile(null);
    setSelectedBannerFile(null);
    // Memastikan rating lama termuat, jika kosong diatur ke 5.0
    setEditingItem({ ...item, rating: item.rating || 5.0 });
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("businesses")
        .delete()
        .eq("id", deleteConfirm.id);
      if (error) throw error;

      fetchBusinessesData().then((data) => {
        if (data) setBusinesses(data as ExtendedBusiness[]);
      });

      showToast(`Data toko berhasil dihapus!`, "success");
    } catch (error: unknown) {
      const err = error as Error;
      showToast("Gagal menghapus: " + err.message, "error");
    } finally {
      setIsDeleting(false);
      setDeleteConfirm({ isOpen: false, id: "", name: "" });
    }
  };

  const handleSaveData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.name) return;

    setIsSaving(true);
    try {
      let finalLogoUrl = editingItem.logo_url || "";
      let finalBannerUrl = editingItem.image_url || "";

      // Upload Logo
      if (selectedLogoFile) {
        const fileExt = selectedLogoFile.name.split(".").pop();
        const fileName = `logo-${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("image")
          .upload(fileName, selectedLogoFile);
        if (uploadError) throw uploadError;

        finalLogoUrl = supabase.storage.from("image").getPublicUrl(fileName)
          .data.publicUrl;
      }

      if (selectedBannerFile) {
        const fileExt = selectedBannerFile.name.split(".").pop();
        const fileName = `banner-${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("image")
          .upload(fileName, selectedBannerFile);
        if (uploadError) throw uploadError;

        finalBannerUrl = supabase.storage.from("image").getPublicUrl(fileName)
          .data.publicUrl;
      }

      const payload = {
        name: editingItem.name,
        slug: generateSlug(editingItem.name),
        desc: editingItem.desc || null, 
        logo_url: finalLogoUrl,
        image_url: finalBannerUrl,
        shopee_url: editingItem.shopee_url || null,
        instagram_url: editingItem.instagram_url || null,
        tiktok_url: editingItem.tiktok_url || null,
        rating: editingItem.rating || 5.0, // <-- TAMBAHAN: Menyimpan rating ke database
      };

      if (isEditMode && editingItem.id) {
        const { error } = await supabase
          .from("businesses")
          .update(payload)
          .eq("id", editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("businesses").insert([payload]);
        if (error) throw error;
      }

      setIsModalOpen(false);

      fetchBusinessesData().then((data) => {
        if (data) setBusinesses(data as ExtendedBusiness[]);
      });

      showToast(
        `Toko berhasil ${isEditMode ? "diperbarui" : "ditambahkan"}!`,
        "success",
      );
    } catch (error: unknown) {
      const err = error as Error;
      showToast("Gagal menyimpan: " + err.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50">
        <h2 className="font-bold text-gray-800">Manajemen Toko / Brand</h2>
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
              placeholder="Cari nama toko..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#274a6a] outline-none text-sm"
            />
          </div>
          <button
            onClick={openAddModal}
            className="bg-[#274a6a] text-white px-4 py-2 text-sm rounded-lg hover:bg-[#1f3b54] font-medium whitespace-nowrap"
          >
            + Tambah Toko
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="p-4 font-medium">Nama Toko / Brand</th>
              <th className="p-4 font-medium hidden md:table-cell">Deskripsi</th>
              <th className="p-4 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100">
            {filteredBusinesses.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-medium text-gray-800 flex items-center gap-3">
                  {b.logo_url ? (
                    <Image
                      src={b.logo_url}
                      alt={b.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 object-cover rounded-full bg-gray-100 border shadow-sm"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[10px] text-gray-400 border border-dashed">
                      No Logo
                    </div>
                  )}
                  <span>{b.name}</span>
                </td>
                <td className="p-4 text-gray-500 hidden md:table-cell">
                  <span className="line-clamp-1">{b.desc || "-"}</span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    {onViewProducts && (
                      <button
                        onClick={() => onViewProducts(b.name)}
                        className="text-emerald-600 hover:bg-emerald-50 font-medium text-xs border border-emerald-200 px-3 py-1.5 rounded transition-colors"
                      >
                        Lihat Produk
                      </button>
                    )}
                    <button
                      onClick={() => openEditModal(b)}
                      className="text-[#274a6a] hover:bg-blue-50 font-medium text-xs border border-[#274a6a]/20 px-3 py-1.5 rounded transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        setDeleteConfirm({
                          isOpen: true,
                          id: b.id,
                          name: b.name,
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
            {filteredBusinesses.length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-500">
                  Toko tidak ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* POP-UP MODAL FORM TAMBAH/EDIT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-[#274a6a] text-lg">
                {isEditMode ? "Edit" : "Tambah"} Toko
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
              className="p-5 flex flex-col gap-4 overflow-y-auto"
            >
              {/* --- BARIS: NAMA TOKO & RATING --- */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Toko / Brand
                  </label>
                  <input
                    type="text"
                    value={editingItem?.name || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#274a6a]"
                    required
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating (1-5)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={editingItem?.rating || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, rating: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#amber-400]"
                    required
                  />
                </div>
              </div>

              {/* GRID UNTUK UPLOAD GAMBAR */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* UPLOAD LOGO */}
                <div className="p-3 border border-gray-200 rounded-lg bg-gray-50/50">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Logo Toko (logo_url)
                  </label>
                  {isEditMode && editingItem?.logo_url && !selectedLogoFile && (
                    <Image
                      src={editingItem.logo_url}
                      alt="Preview Logo"
                      width={60}
                      height={60}
                      className="w-16 h-16 object-cover rounded-full border border-gray-200 mb-2 shadow-sm"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files && setSelectedLogoFile(e.target.files[0])
                    }
                    className="w-full text-xs text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-[#274a6a]/10 file:text-[#274a6a]"
                    required={!isEditMode && !editingItem?.logo_url}
                  />
                </div>

                {/* UPLOAD BANNER */}
                <div className="p-3 border border-gray-200 rounded-lg bg-gray-50/50">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Banner Toko (image_url)
                  </label>
                  {isEditMode && editingItem?.image_url && !selectedBannerFile && (
                    <Image
                      src={editingItem.image_url}
                      alt="Preview Banner"
                      width={100}
                      height={60}
                      className="w-full h-16 object-cover rounded border border-gray-200 mb-2 shadow-sm"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files && setSelectedBannerFile(e.target.files[0])
                    }
                    className="w-full text-xs text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:bg-[#274a6a]/10 file:text-[#274a6a]"
                  />
                </div>
              </div>

              {/* DESKRIPSI */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi Singkat (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={editingItem?.desc || ""}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      desc: e.target.value,
                    })
                  }
                  placeholder="Jelaskan sedikit tentang toko ini..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#274a6a] resize-none text-sm"
                />
              </div>

              {/* TAUTAN / URL SECTION */}
              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50/30">
                <h4 className="text-xs font-bold text-gray-700 mb-3 border-b border-gray-200 pb-1">Tautan / Sosial Media</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Shopee URL</label>
                    <input
                      type="url"
                      value={editingItem?.shopee_url || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, shopee_url: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm outline-none focus:border-[#EE4D2D]"
                      placeholder="https://shopee.co.id/..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Instagram URL</label>
                    <input
                      type="url"
                      value={editingItem?.instagram_url || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, instagram_url: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm outline-none focus:border-pink-500"
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">TikTok URL</label>
                    <input
                      type="url"
                      value={editingItem?.tiktok_url || ""}
                      onChange={(e) => setEditingItem({ ...editingItem, tiktok_url: e.target.value })}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm outline-none focus:border-black"
                      placeholder="https://tiktok.com/@..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
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
                  {isSaving ? "Menyimpan..." : "Simpan Toko"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POP-UP KONFIRMASI HAPUS MODERN */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
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
              Hapus Toko?
            </h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Apakah Anda yakin ingin menghapus toko{" "}
              <span className="font-semibold text-gray-700">
                &quot;{deleteConfirm.name}&quot;
              </span>
              ? Tindakan ini tidak dapat dibatalkan dan mungkin memengaruhi
              produk di dalamnya.
            </p>
            <div className="flex gap-3 justify-center w-full">
              <button
                onClick={() =>
                  setDeleteConfirm({ isOpen: false, id: "", name: "" })
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

      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-[70] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-white font-medium text-sm transition-all duration-300 ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}
        >
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}