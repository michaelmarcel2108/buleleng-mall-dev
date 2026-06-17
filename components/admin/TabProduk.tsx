"use client";

import { createClient } from "@/lib/supabase/client";
import { Business, Category, Product } from "@/types";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

type ProductFormState = Partial<Product> & {
  category_ids?: string[]; // Diubah menjadi array untuk multi-kategori
  business_id?: string;
  tokopedia_url?: string;
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

export default function TabProduk({
  prefilledSearch = "",
  onSearchChange,
}: {
  prefilledSearch?: string;
  onSearchChange?: (val: string) => void;
}) {
  const supabase = createClient();

  const [products, setProducts] = useState<Product[]>([]);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState(prefilledSearch);

  // State Modal Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProductFormState | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFileProduct, setSelectedFileProduct] = useState<File | null>(
    null,
  );
  const [prevPrefilledSearch, setPrevPrefilledSearch] =
    useState(prefilledSearch);

  if (prefilledSearch !== prevPrefilledSearch) {
    setPrevPrefilledSearch(prefilledSearch);
    setSearchQuery(prefilledSearch);
  }

  // State Modal Hapus
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

  const fetchProductsData = useCallback(async () => {
    // Karena menggunakan junction table, supabase otomatis mengambil lewat relasinya
    const { data } = await supabase
      .from("products")
      .select("*, businesses(*), categories(*)")
      .order("name");
    return data;
  }, [supabase]);

  const fetchBusinessesData = useCallback(async () => {
    const { data } = await supabase.from("businesses").select("id, name, slug");
    return data;
  }, [supabase]);

  const fetchCategoriesData = useCallback(async () => {
    const { data } = await supabase
      .from("categories")
      .select("id, name, color");
    return data;
  }, [supabase]);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      fetchProductsData(),
      fetchBusinessesData(),
      fetchCategoriesData(),
    ]).then(([productsData, businessesData, categoriesData]) => {
      if (isMounted) {
        if (productsData) setProducts(productsData as unknown as Product[]);
        if (businessesData) setBusinesses(businessesData as Business[]);
        if (categoriesData) setCategories(categoriesData as Category[]);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [fetchProductsData, fetchBusinessesData, fetchCategoriesData]);

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSearch = (val: string) => {
    setSearchQuery(val);
    if (onSearchChange) onSearchChange(val);
  };

  const filteredProducts = products.filter((p) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bizData = p.businesses as any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const catData = p.categories as any[];

    const businessName = Array.isArray(bizData)
      ? bizData[0]?.name
      : bizData?.name;
      
    // Gabungkan semua nama kategori agar bisa dicari
    const categoryNames = Array.isArray(catData) 
      ? catData.map(c => c.name).join(" ") 
      : "";

    const finalBusinessName = businessName || "";
    const query = searchQuery.toLowerCase();

    return (
      p.name.toLowerCase().includes(query) ||
      finalBusinessName.toLowerCase().includes(query) ||
      categoryNames.toLowerCase().includes(query) 
    );
  });

  const openAddModal = () => {
    setIsEditMode(false);
    setSelectedFileProduct(null);
    setEditingItem({
      name: "",
      description: "", 
      price: 0,
      image_url: "",
      shopee_url: "",
      tokopedia_url: "",
      business_id: businesses[0]?.id || "",
      category_ids: [], // Kosongkan array untuk produk baru
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: Product) => {
    setIsEditMode(true);
    setSelectedFileProduct(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const itemData = item as any;

    // Ambil semua ID kategori yang dimiliki produk saat ini
    const existingCategoryIds = Array.isArray(itemData.categories)
      ? itemData.categories.map((c: any) => String(c.id))
      : [];

    setEditingItem({ 
      ...item, 
      tokopedia_url: itemData.tokopedia_url || "",
      category_ids: existingCategoryIds 
    });
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", deleteConfirm.id);
      if (error) throw error;

      fetchProductsData().then((data) => {
        if (data) setProducts(data as unknown as Product[]);
      });

      showToast(`Data produk berhasil dihapus!`, "success");
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
    if (!editingItem) return;

    setIsSaving(true);
    try {
      let finalImageUrl = editingItem.image_url || "";
      if (selectedFileProduct) {
        const fileExt = selectedFileProduct.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
        await supabase.storage
          .from("image")
          .upload(fileName, selectedFileProduct);
        finalImageUrl = supabase.storage.from("image").getPublicUrl(fileName)
          .data.publicUrl;
      }

      // Payload untuk tabel products (tanpa category_id)
      const payload = {
        name: editingItem.name,
        slug: generateSlug(editingItem.name || ""),
        description: editingItem.description || null,
        price: editingItem.price,
        image_url: finalImageUrl,
        shopee_url: editingItem.shopee_url || null,
        tokopedia_url: editingItem.tokopedia_url || null,
        business_id: editingItem.business_id,
      };

      let savedProductId = editingItem.id;

      if (isEditMode && editingItem.id) {
        // Update tabel products
        const { error } = await supabase
          .from("products")
          .update(payload)
          .eq("id", editingItem.id);
        if (error) throw error;

        // Hapus relasi kategori lama
        await supabase.from("product_categories").delete().eq("product_id", editingItem.id);
      } else {
        // Insert tabel products, dapatkan ID yang baru dibuat
        const { data, error } = await supabase.from("products").insert([payload]).select().single();
        if (error) throw error;
        savedProductId = data.id;
      }

      // Insert ke tabel relasi product_categories jika ada kategori yang dipilih
      if (editingItem.category_ids && editingItem.category_ids.length > 0) {
        const categoryRelations = editingItem.category_ids.map((catId) => ({
          product_id: savedProductId,
          category_id: catId,
        }));
        
        const { error: relError } = await supabase.from("product_categories").insert(categoryRelations);
        if (relError) throw relError;
      }

      setIsModalOpen(false);

      fetchProductsData().then((data) => {
        if (data) setProducts(data as unknown as Product[]);
      });

      showToast(
        `Produk berhasil ${isEditMode ? "diperbarui" : "ditambahkan"}!`,
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
        <h2 className="font-bold text-gray-800">Daftar Produk</h2>
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
              placeholder="Cari nama / toko / kategori..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#274a6a] outline-none text-sm"
            />
          </div>
          <button
            onClick={openAddModal}
            className="bg-[#274a6a] text-white px-4 py-2 text-sm rounded-lg hover:bg-[#1f3b54] font-medium whitespace-nowrap"
          >
            + Tambah Produk
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="p-4 font-medium">Nama Produk</th>
              <th className="p-4 font-medium">Kategori</th>
              <th className="p-4 font-medium">Toko Owner</th>
              <th className="p-4 font-medium hidden md:table-cell">Harga</th>
              <th className="p-4 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100">
            {filteredProducts.map((p) => {
              const catData = p.categories as Category[];
              const bizData = p.businesses as Business[];
              const businessName = bizData[0]?.name || bizData?.[0]?.name || "";

              return (
                <tr
                  key={p.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="p-4 font-medium text-gray-800 flex items-center gap-3">
                    {p.image_url ? (
                      <Image
                        src={p.image_url}
                        alt={p.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 object-cover rounded-lg bg-gray-100 border"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-[10px] text-gray-400 border border-dashed">
                        No Img
                      </div>
                    )}
                    <span>{p.name}</span>
                  </td>
                  <td className="p-4 text-gray-500">
                    <div className="flex flex-wrap gap-1">
                      {catData && catData.length > 0 ? (
                        catData.map((c) => (
                          <span key={c.id} className="px-2.5 py-1 bg-blue-50 text-[#274a6a] rounded-full text-[10px] font-medium border border-blue-100">
                            {c.name}
                          </span>
                        ))
                      ) : (
                        <span>-</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-gray-500">{businessName || "-"}</td>
                  <td className="p-4 text-gray-500 hidden md:table-cell">
                    Rp {p.price?.toLocaleString("id-ID")}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="text-[#274a6a] hover:bg-blue-50 font-medium text-xs border border-[#274a6a]/20 px-3 py-1.5 rounded transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          setDeleteConfirm({
                            isOpen: true,
                            id: p.id,
                            name: p.name,
                          })
                        }
                        className="text-red-600 hover:bg-red-50 font-medium text-xs border border-red-200 px-3 py-1.5 rounded transition-colors"
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  Produk tidak ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-[#274a6a] text-lg">
                {isEditMode ? "Edit" : "Tambah"} Produk
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pilih Toko Pemilik
                  </label>
                  <select
                    value={editingItem?.business_id || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        business_id: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="" disabled>
                      Pilih Toko
                    </option>
                    {businesses.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2 mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pilih Kategori Produk (Bisa lebih dari satu)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 border border-gray-300 p-4 rounded-lg max-h-48 overflow-y-auto bg-gray-50/50">
                    {categories.map((c) => (
                      <label key={c.id} className="flex items-center gap-2 cursor-pointer text-sm hover:bg-gray-100 p-1.5 rounded transition-colors">
                        <input
                          type="checkbox"
                          checked={editingItem?.category_ids?.includes(String(c.id)) || false}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            const currentIds = editingItem?.category_ids || [];
                            setEditingItem({
                              ...editingItem,
                              category_ids: checked
                                ? [...currentIds, String(c.id)]
                                : currentIds.filter(id => id !== String(c.id))
                            });
                          }}
                          className="w-4 h-4 rounded text-[#274a6a] focus:ring-[#274a6a] border-gray-300 cursor-pointer"
                        />
                        <span className="text-gray-700 font-medium">{c.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Produk
                  </label>
                  <input
                    type="text"
                    value={editingItem?.name || ""}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Harga (Rp)
                  </label>
                  <input
                    type="number"
                    value={editingItem?.price || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Deskripsi Produk (Opsional)
                  </label>
                  <textarea
                    value={editingItem?.description || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        description: e.target.value,
                      })
                    }
                    rows={4}
                    placeholder="Tuliskan deskripsi lengkap mengenai produk ini..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#274a6a] outline-none resize-y"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link Shopee (Opsional)
                  </label>
                  <input
                    type="url"
                    value={editingItem?.shopee_url || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        shopee_url: e.target.value,
                      })
                    }
                    placeholder="https://shopee.co.id/..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EE4D2D] outline-none"
                  />
                </div>

                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link Tokopedia (Opsional)
                  </label>
                  <input
                    type="url"
                    value={editingItem?.tokopedia_url || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        tokopedia_url: e.target.value,
                      })
                    }
                    placeholder="https://tokopedia.com/..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00AA5B] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Foto Gambar Produk
                </label>
                {isEditMode &&
                  editingItem?.image_url &&
                  !selectedFileProduct && (
                    <Image
                      src={editingItem.image_url}
                      alt="Preview"
                      width={96}
                      height={96}
                      className="w-24 h-24 object-cover rounded-lg border border-gray-200 mb-2 shadow-sm"
                    />
                  )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files && setSelectedFileProduct(e.target.files[0])
                  }
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#274a6a]/10 file:text-[#274a6a]"
                  required={!isEditMode && !editingItem?.image_url}
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
                  {isSaving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
              Hapus Produk?
            </h3>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Apakah Anda yakin ingin menghapus produk{" "}
              <span className="font-semibold text-gray-700">
                &quot;{deleteConfirm.name}&quot;
              </span>
              ? Tindakan ini tidak dapat dibatalkan.
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
          className={`fixed bottom-5 right-5 z-70 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-white font-medium text-sm transition-all duration-300 ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}
        >
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}