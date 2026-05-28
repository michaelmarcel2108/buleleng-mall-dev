"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const generateSlug = (text: string) => {
  return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
};

export default function TabToko({ onViewProducts }: { onViewProducts?: (name: string) => void }) {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedFileLogo, setSelectedFileLogo] = useState<File | null>(null);
  const [selectedFileBizPhoto, setSelectedFileBizPhoto] = useState<File | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => { fetchData(); }, []);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    const { data } = await supabase.from("businesses").select("*").order("name");
    if (data) setBusinesses(data);
  };

  const filteredBusinesses = businesses.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAddModal = () => {
    setIsEditMode(false);
    setSelectedFileLogo(null);
    setSelectedFileBizPhoto(null);
    setEditingItem({ name: "", desc: "", image_url: "", logo_url: "", shopee_url: "", instagram_url: "", tiktok_url: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setIsEditMode(true);
    setSelectedFileLogo(null);
    setSelectedFileBizPhoto(null);
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleDeleteData = async (id: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus toko ini?`)) return;
    try {
      const { error } = await supabase.from("businesses").delete().eq("id", id);
      if (error) throw error;
      fetchData();
      showToast(`Data toko berhasil dihapus!`, "success");
    } catch (error: any) {
      showToast("Gagal menghapus: " + error.message, "error");
    }
  };

  const handleSaveData = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let finalLogoUrl = editingItem.logo_url || "";
      let finalImageUrl = editingItem.image_url || "";

      if (selectedFileLogo) {
        const fileExt = selectedFileLogo.name.split(".").pop();
        const fileName = `logo-${Date.now()}.${fileExt}`;
        await supabase.storage.from("image").upload(fileName, selectedFileLogo);
        finalLogoUrl = supabase.storage.from("image").getPublicUrl(fileName).data.publicUrl;
      }
      if (selectedFileBizPhoto) {
        const fileExt = selectedFileBizPhoto.name.split(".").pop();
        const fileName = `bizphoto-${Date.now()}.${fileExt}`;
        await supabase.storage.from("image").upload(fileName, selectedFileBizPhoto);
        finalImageUrl = supabase.storage.from("image").getPublicUrl(fileName).data.publicUrl;
      }

      const payload = {
        name: editingItem.name,
        slug: generateSlug(editingItem.name),
        desc: editingItem.desc,
        logo_url: finalLogoUrl,
        image_url: finalImageUrl,
        shopee_url: editingItem.shopee_url || null,
        instagram_url: editingItem.instagram_url || null,
        tiktok_url: editingItem.tiktok_url || null,
      };

      if (isEditMode) {
        const { error } = await supabase.from("businesses").update(payload).eq("id", editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("businesses").insert([payload]);
        if (error) throw error;
      }

      setIsModalOpen(false);
      fetchData();
      showToast(`Toko berhasil ${isEditMode ? "diperbarui" : "ditambahkan"}!`, "success");
    } catch (error: any) {
      showToast("Gagal menyimpan: " + error.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50">
        <h2 className="font-bold text-gray-800">Daftar UMKM</h2>
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
          <div className="relative w-full sm:w-64">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input type="text" placeholder="Cari toko..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#274a6a] outline-none text-sm" />
          </div>
          <button onClick={openAddModal} className="bg-[#274a6a] text-white px-4 py-2 text-sm rounded-lg hover:bg-[#1f3b54] font-medium whitespace-nowrap">+ Tambah Toko</button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
              <th className="p-4 font-medium">Logo & Nama Toko</th>
              <th className="p-4 font-medium hidden sm:table-cell">Foto Banner</th>
              <th className="p-4 font-medium">Katalog</th> 
              <th className="p-4 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100">
            {filteredBusinesses.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="p-4 font-medium text-gray-800 flex items-center gap-3">
                  {b.logo_url ? <img src={b.logo_url} alt={b.name} className="w-10 h-10 object-cover rounded-full bg-gray-100 border p-0.5" /> : <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[10px] text-gray-400 border border-dashed font-normal">Logo</div>}
                  <span>{b.name}</span>
                </td>
                <td className="p-4 hidden sm:table-cell">
                  {b.image_url ? <img src={b.image_url} alt={b.name} className="w-20 h-11 object-cover rounded-lg bg-gray-100 border" /> : <div className="w-20 h-11 bg-gray-100 rounded-lg flex items-center justify-center text-[10px] text-gray-400 border border-dashed font-normal">No Photo</div>}
                </td>
                <td className="p-4">
                  <button onClick={() => onViewProducts && onViewProducts(b.name)} className="flex items-center gap-1.5 text-[#274a6a] hover:bg-blue-50 font-medium text-xs border border-[#274a6a]/30 px-3 py-1.5 rounded-full transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    Lihat Produk
                  </button>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(b)} className="text-[#274a6a] hover:bg-blue-50 font-medium text-xs border border-[#274a6a]/20 px-3 py-1.5 rounded transition-colors">Edit</button>
                    <button onClick={() => handleDeleteData(b.id)} className="text-red-600 hover:bg-red-50 font-medium text-xs border border-red-200 px-3 py-1.5 rounded transition-colors">Hapus</button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredBusinesses.length === 0 && <tr><td colSpan={4} className="p-8 text-center text-gray-500">Toko tidak ditemukan.</td></tr>}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[95vh] flex flex-col">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-[#274a6a] text-lg">{isEditMode ? "Edit" : "Tambah"} Toko</h3>
              <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700 font-bold text-xl">&times;</button>
            </div>
            <form onSubmit={handleSaveData} className="p-5 flex flex-col gap-4 overflow-y-auto">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Nama Toko</label><input type="text" value={editingItem.name || ""} onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#274a6a] outline-none" required /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Singkat (Opsional)</label><textarea rows={3} value={editingItem.desc || ""} onChange={(e) => setEditingItem({ ...editingItem, desc: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#274a6a] outline-none text-sm"></textarea></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Logo Toko (Square)</label><input type="file" accept="image/*" onChange={(e) => e.target.files && setSelectedFileLogo(e.target.files[0])} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#274a6a]/10 file:text-[#274a6a]" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Foto Banner (Landscape)</label><input type="file" accept="image/*" onChange={(e) => e.target.files && setSelectedFileBizPhoto(e.target.files[0])} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#274a6a]/10 file:text-[#274a6a]" /></div>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <h4 className="text-sm font-semibold text-gray-600 mb-3">Tautan E-Commerce & Sosial Media</h4>
                <div className="space-y-3">
                  <div><label className="block text-xs font-medium text-gray-700 mb-1">Link Shopee</label><input type="url" placeholder="https://shopee.co.id/..." value={editingItem.shopee_url || ""} onChange={(e) => setEditingItem({ ...editingItem, shopee_url: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm" /></div>
                  <div><label className="block text-xs font-medium text-gray-700 mb-1">Link Instagram</label><input type="url" placeholder="https://instagram.com/..." value={editingItem.instagram_url || ""} onChange={(e) => setEditingItem({ ...editingItem, instagram_url: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm" /></div>
                  <div><label className="block text-xs font-medium text-gray-700 mb-1">Link TikTok</label><input type="url" placeholder="https://tiktok.com/@..." value={editingItem.tiktok_url || ""} onChange={(e) => setEditingItem({ ...editingItem, tiktok_url: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm" /></div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100 sticky bottom-0 bg-white">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg">Batal</button>
                <button type="submit" disabled={isSaving} className="px-4 py-2 text-sm font-medium text-white bg-[#274a6a] hover:bg-[#1f3b54] rounded-lg disabled:opacity-50">{isSaving ? "Menyimpan..." : "Simpan"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-white font-medium text-sm bg-gray-800"><span>{toast.message}</span></div>}
    </div>
  );
}