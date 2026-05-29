"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const generateSlug = (text: string) => {
  return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
};

export default function TabProduk({ prefilledSearch = "", onSearchChange }: { prefilledSearch?: string, onSearchChange?: (val: string) => void }) {
  const [products, setProducts] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]); // State untuk daftar kategori
  const [searchQuery, setSearchQuery] = useState(prefilledSearch);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFileProduct, setSelectedFileProduct] = useState<File | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetchData();
    fetchBusinesses();
    fetchCategories(); 
  }, []);

  useEffect(() => {
    setSearchQuery(prefilledSearch);
  }, [prefilledSearch]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSearch = (val: string) => {
    setSearchQuery(val);
    if (onSearchChange) onSearchChange(val);
  };

  const fetchData = async () => {
    const { data } = await supabase.from("products").select("*, businesses(name), categories(name)").order("name");
    if (data) setProducts(data);
  };

  const fetchBusinesses = async () => {
    const { data } = await supabase.from("businesses").select("id, name");
    if (data) setBusinesses(data);
  };

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("id, name");
    if (data) setCategories(data);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (p.businesses?.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAddModal = () => {
    setIsEditMode(false);
    setSelectedFileProduct(null);
    setEditingItem({ name: "", price: "", image_url: "", shopee_url: "", business_id: businesses[0]?.id || "", category_id: categories[0]?.id || "" });
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setIsEditMode(true);
    setSelectedFileProduct(null);
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleDeleteData = async (id: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus produk ini?`)) return;
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      fetchData();
      showToast(`Data produk berhasil dihapus!`, "success");
    } catch (error: any) {
      showToast("Gagal menghapus: " + error.message, "error");
    }
  };

  const handleSaveData = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let finalImageUrl = editingItem.image_url || "";
      if (selectedFileProduct) {
        const fileExt = selectedFileProduct.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
        await supabase.storage.from("image").upload(fileName, selectedFileProduct);
        finalImageUrl = supabase.storage.from("image").getPublicUrl(fileName).data.publicUrl;
      }

      const payload = {
        name: editingItem.name,
        slug: generateSlug(editingItem.name),
        price: editingItem.price,
        image_url: finalImageUrl,
        shopee_url: editingItem.shopee_url || null,
        business_id: editingItem.business_id,
        category_id: editingItem.category_id, 
      };

      if (isEditMode) {
        const { error } = await supabase.from("products").update(payload).eq("id", editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert([payload]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchData();
      showToast(`Produk berhasil ${isEditMode ? "diperbarui" : "ditambahkan"}!`, "success");
    } catch (error: any) {
      showToast("Gagal menyimpan: " + error.message, "error");
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
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Cari nama / toko..." value={searchQuery} onChange={(e) => handleSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#274a6a] outline-none text-sm" />
          </div>
          <button onClick={openAddModal} className="bg-[#274a6a] text-white px-4 py-2 text-sm rounded-lg hover:bg-[#1f3b54] font-medium whitespace-nowrap">+ Tambah Produk</button>
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
            {filteredProducts.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-medium text-gray-800 flex items-center gap-3">
                  {p.image_url ? <img src={p.image_url} alt={p.name} className="w-10 h-10 object-cover rounded-lg bg-gray-100 border" /> : <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-[10px] text-gray-400 border border-dashed">No Img</div>}
                  <span>{p.name}</span>
                </td>
                <td className="p-4 text-gray-500">
                  {p.categories?.name ? (
                    <span className="px-2.5 py-1 bg-blue-50 text-[#274a6a] rounded-full text-xs font-medium border border-blue-100">{p.categories.name}</span>
                  ) : "-"}
                </td>
                <td className="p-4 text-gray-500">{p.businesses?.name || "-"}</td>
                <td className="p-4 text-gray-500 hidden md:table-cell">Rp {p.price?.toLocaleString("id-ID")}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(p)} className="text-[#274a6a] hover:bg-blue-50 font-medium text-xs border border-[#274a6a]/20 px-3 py-1.5 rounded transition-colors">Edit</button>
                    <button onClick={() => handleDeleteData(p.id)} className="text-red-600 hover:bg-red-50 font-medium text-xs border border-red-200 px-3 py-1.5 rounded transition-colors">Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-gray-500">Produk tidak ditemukan.</td></tr>}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-[#274a6a] text-lg">{isEditMode ? "Edit" : "Tambah"} Produk</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700 font-bold text-xl">&times;</button>
            </div>
            
            <form onSubmit={handleSaveData} className="p-5 flex flex-col gap-5 overflow-y-auto">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Toko Pemilik</label>
                  <select value={editingItem.business_id || ""} onChange={(e) => setEditingItem({ ...editingItem, business_id: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required>
                    <option value="" disabled>Pilih Toko</option>
                    {businesses.map((b) => (<option key={b.id} value={b.id}>{b.name}</option>))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Kategori Produk</label>
                  <select value={editingItem.category_id || ""} onChange={(e) => setEditingItem({ ...editingItem, category_id: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required>
                    <option value="" disabled>Pilih Kategori</option>
                    {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                  </select>
                </div>

                <div><label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk</label><input type="text" value={editingItem.name || ""} onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label><input type="number" value={editingItem.price || ""} onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg" required /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Link Shopee (Opsional)</label><input type="url" value={editingItem.shopee_url || ""} onChange={(e) => setEditingItem({ ...editingItem, shopee_url: e.target.value })} placeholder="https://shopee.co.id/..." className="w-full px-3 py-2 border border-gray-300 rounded-lg" /></div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Foto Gambar Produk</label>
                {isEditMode && editingItem.image_url && !selectedFileProduct && <img src={editingItem.image_url} alt="Preview" className="w-24 h-24 object-cover rounded-lg border border-gray-200 mb-2 shadow-sm" />}
                <input type="file" accept="image/*" onChange={(e) => e.target.files && setSelectedFileProduct(e.target.files[0])} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#274a6a]/10 file:text-[#274a6a]" required={!isEditMode && !editingItem.image_url} />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg">Batal</button>
                <button type="submit" disabled={isSaving} className="px-4 py-2 text-sm font-medium text-white bg-[#274a6a] hover:bg-[#1f3b54] rounded-lg">{isSaving ? "Menyimpan..." : "Simpan"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-white font-medium text-sm bg-gray-800"><span>{toast.message}</span></div>}
    </div>
  );
}