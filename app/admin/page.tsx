"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

// Fungsi pembantu untuk membuat slug otomatis
const generateSlug = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Ganti spasi dengan strip (-)
    .replace(/[^\w\-]+/g, '')       // Hapus karakter non-alphanumeric
    .replace(/\-\-+/g, '-')         // Ganti strip ganda dengan strip tunggal
    .replace(/^-+/, '')             // Hapus strip di awal
    .replace(/-+$/, '');            // Hapus strip di akhir
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"toko" | "produk" | "kategori">("toko");
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false); 

  const [selectedFileProduct, setSelectedFileProduct] = useState<File | null>(null);
  const [selectedFileLogo, setSelectedFileLogo] = useState<File | null>(null);      
  const [selectedFileBizPhoto, setSelectedFileBizPhoto] = useState<File | null>(null);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, [router]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    setIsLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/admin/login");
      return;
    }

    const { data: bData } = await supabase.from("businesses").select("*").order("name");
    if (bData) setBusinesses(bData);

    const { data: pData } = await supabase.from("products").select("*, businesses(name)").order("name");
    if (pData) setProducts(pData);

    const { data: cData } = await supabase.from("categories").select("*").order("name");
    if (cData) setCategories(cData);

    setIsLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  const openAddModal = (type: "toko" | "produk" | "kategori") => {
    setIsEditMode(false);
    setSelectedFileProduct(null);
    setSelectedFileLogo(null);
    setSelectedFileBizPhoto(null);

    if (type === "toko") {
      setEditingItem({ _type: "toko", name: "", image_url: "", logo_url: "" });
    } else if (type === "produk") {
      // SETTING URL SHOPEE SAAT TAMBAH PRODUK BARU
      setEditingItem({ _type: "produk", name: "", price: "", image_url: "", shopee_url: "", business_id: businesses[0]?.id || "" });
    } else if (type === "kategori") {
      setEditingItem({ _type: "kategori", name: "" });
    }
    setIsModalOpen(true);
  };

  const openEditModal = (item: any, type: "toko" | "produk" | "kategori") => {
    setIsEditMode(true);
    setSelectedFileProduct(null);
    setSelectedFileLogo(null);
    setSelectedFileBizPhoto(null);
    setEditingItem({ ...item, _type: type }); 
    setIsModalOpen(true);
  };

  const handleProductFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) { setSelectedFileProduct(e.target.files[0]); }
  };
  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) { setSelectedFileLogo(e.target.files[0]); }
  };
  const handleBizPhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) { setSelectedFileBizPhoto(e.target.files[0]); }
  };

  const handleDeleteData = async (id: string, type: "toko" | "produk" | "kategori") => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus ${type} ini?`)) return;

    try {
      let table = "";
      if (type === "toko") table = "businesses";
      else if (type === "produk") table = "products";
      else if (type === "kategori") table = "categories";

      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;

      fetchData();
      showToast(`Data ${type} berhasil dihapus!`, "success");
    } catch (error: any) {
      showToast("Gagal menghapus: " + error.message, "error");
    }
  };

  const handleSaveData = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Generate slug otomatis dari nama yang diinput
      const generatedSlug = generateSlug(editingItem.name);

      if (editingItem._type === "toko") {
        let finalLogoUrl = editingItem.logo_url || "";
        let finalImageUrl = editingItem.image_url || "";

        if (selectedFileLogo) {
          const fileExt = selectedFileLogo.name.split(".").pop();
          const fileName = `logo-${Date.now()}.${fileExt}`;
          const { error: uploadError } = await supabase.storage.from("image").upload(fileName, selectedFileLogo);
          if (uploadError) throw uploadError;
          const { data: urlData } = supabase.storage.from("image").getPublicUrl(fileName);
          finalLogoUrl = urlData.publicUrl;
        }

        if (selectedFileBizPhoto) {
          const fileExt = selectedFileBizPhoto.name.split(".").pop();
          const fileName = `bizphoto-${Date.now()}.${fileExt}`;
          const { error: uploadError } = await supabase.storage.from("image").upload(fileName, selectedFileBizPhoto);
          if (uploadError) throw uploadError;
          const { data: urlData } = supabase.storage.from("image").getPublicUrl(fileName);
          finalImageUrl = urlData.publicUrl;
        }

        const payload = { 
          name: editingItem.name, 
          logo_url: finalLogoUrl, 
          image_url: finalImageUrl,
          slug: generatedSlug 
        };

        if (isEditMode) {
          const { error } = await supabase.from("businesses").update(payload).eq("id", editingItem.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from("businesses").insert([payload]);
          if (error) throw error;
        }
      } 
      
      else if (editingItem._type === "produk") {
        let finalImageUrl = editingItem.image_url || "";

        if (selectedFileProduct) {
          const fileExt = selectedFileProduct.name.split(".").pop();
          const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
          const { error: uploadError } = await supabase.storage.from("image").upload(fileName, selectedFileProduct);
          if (uploadError) throw uploadError;
          const { data: urlData } = supabase.storage.from("image").getPublicUrl(fileName);
          finalImageUrl = urlData.publicUrl;
        }

        // MENYIMPAN URL SHOPEE KE DALAM PAYLOAD SUPABASE
        const payload = { 
          name: editingItem.name, 
          price: editingItem.price, 
          image_url: finalImageUrl, 
          shopee_url: editingItem.shopee_url || null,
          slug: generatedSlug, 
          business_id: editingItem.business_id 
        };

        if (isEditMode) {
          const { error } = await supabase.from("products").update(payload).eq("id", editingItem.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from("products").insert([payload]);
          if (error) throw error;
        }
      }
      
      else if (editingItem._type === "kategori") {
        const payload = { 
          name: editingItem.name, 
          slug: generatedSlug 
        };

        if (isEditMode) {
          const { error } = await supabase.from("categories").update(payload).eq("id", editingItem.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from("categories").insert([payload]);
          if (error) throw error;
        }
      }

      setIsModalOpen(false);
      setEditingItem(null);
      setSelectedFileProduct(null);
      setSelectedFileLogo(null);
      setSelectedFileBizPhoto(null);
      fetchData(); 
      showToast(`Data ${editingItem._type} berhasil ${isEditMode ? "diperbarui" : "ditambahkan"}!`, "success");
      
    } catch (error: any) {
      showToast("Gagal menyimpan: " + error.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading && businesses.length === 0) {
    return <div className="min-h-screen flex items-center justify-center text-[#274a6a] font-medium">Memuat Dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      <header className="bg-[#274a6a] text-white px-6 md:px-12 py-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold font-display">Dashboard Admin</h1>
        <button onClick={handleLogout} className="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">
          Keluar
        </button>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-12 py-8">
        <div className="flex gap-4 mb-8 border-b border-gray-200 overflow-x-auto whitespace-nowrap">
          <button onClick={() => setActiveTab("toko")} className={`pb-3 px-2 font-medium text-sm md:text-base transition-colors ${activeTab === "toko" ? "border-b-2 border-[#274a6a] text-[#274a6a]" : "text-gray-500 hover:text-gray-700"}`}>Kelola Toko (UMKM)</button>
          <button onClick={() => setActiveTab("produk")} className={`pb-3 px-2 font-medium text-sm md:text-base transition-colors ${activeTab === "produk" ? "border-b-2 border-[#274a6a] text-[#274a6a]" : "text-gray-500 hover:text-gray-700"}`}>Kelola Produk</button>
          <button onClick={() => setActiveTab("kategori")} className={`pb-3 px-2 font-medium text-sm md:text-base transition-colors ${activeTab === "kategori" ? "border-b-2 border-[#274a6a] text-[#274a6a]" : "text-gray-500 hover:text-gray-700"}`}>Kelola Kategori</button>
        </div>

        {activeTab === "toko" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="font-bold text-gray-800">Daftar UMKM</h2>
              <button onClick={() => openAddModal("toko")} className="bg-[#274a6a] text-white px-4 py-2 text-sm rounded-lg hover:bg-[#1f3b54] transition-all font-medium">+ Tambah Toko</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="p-4 font-medium">Logo & Nama Toko</th>
                    <th className="p-4 font-medium hidden sm:table-cell">Foto Toko</th>
                    <th className="p-4 font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100">
                  {businesses.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 font-medium text-gray-800 flex items-center gap-3">
                        {b.logo_url ? <img src={b.logo_url} alt={b.name} className="w-10 h-10 object-cover rounded-full bg-gray-100 border p-0.5" /> : <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[10px] text-gray-400 border border-dashed font-normal">Logo</div>}
                        <span>{b.name}</span>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        {b.image_url ? <img src={b.image_url} alt={b.name} className="w-20 h-11 object-cover rounded-lg bg-gray-100 border" /> : <div className="w-20 h-11 bg-gray-100 rounded-lg flex items-center justify-center text-[10px] text-gray-400 border border-dashed font-normal">No Photo</div>}
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button onClick={() => openEditModal(b, "toko")} className="text-[#274a6a] hover:bg-blue-50 font-medium text-xs border border-[#274a6a]/20 px-3 py-1.5 rounded transition-colors">Edit Info</button>
                          <button onClick={() => handleDeleteData(b.id, "toko")} className="text-red-600 hover:bg-red-50 font-medium text-xs border border-red-200 px-3 py-1.5 rounded transition-colors">Hapus</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "produk" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="font-bold text-gray-800">Daftar Produk</h2>
              <button onClick={() => openAddModal("produk")} className="bg-[#274a6a] text-white px-4 py-2 text-sm rounded-lg hover:bg-[#1f3b54] transition-all font-medium">+ Tambah Produk</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="p-4 font-medium">Nama Produk</th>
                    <th className="p-4 font-medium">Toko Owner</th>
                    <th className="p-4 font-medium hidden md:table-cell">Harga</th>
                    <th className="p-4 font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 font-medium text-gray-800 flex items-center gap-3">
                        {p.image_url ? <img src={p.image_url} alt={p.name} className="w-10 h-10 object-cover rounded-lg bg-gray-100 border" /> : <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-[10px] text-gray-400 border border-dashed">No Img</div>}
                        <span>{p.name}</span>
                      </td>
                      <td className="p-4 text-gray-500">{p.businesses?.name || "-"}</td>
                      <td className="p-4 text-gray-500 hidden md:table-cell">Rp {p.price?.toLocaleString("id-ID")}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button onClick={() => openEditModal(p, "produk")} className="text-[#274a6a] hover:bg-blue-50 font-medium text-xs border border-[#274a6a]/20 px-3 py-1.5 rounded transition-colors">Edit Barang</button>
                          <button onClick={() => handleDeleteData(p.id, "produk")} className="text-red-600 hover:bg-red-50 font-medium text-xs border border-red-200 px-3 py-1.5 rounded transition-colors">Hapus</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "kategori" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="font-bold text-gray-800">Daftar Kategori</h2>
              <button onClick={() => openAddModal("kategori")} className="bg-[#274a6a] text-white px-4 py-2 text-sm rounded-lg hover:bg-[#1f3b54] transition-all font-medium">+ Tambah Kategori</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="p-4 font-medium">Nama Kategori</th>
                    <th className="p-4 font-medium hidden md:table-cell">Slug (URL)</th>
                    <th className="p-4 font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100">
                  {categories.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 font-medium text-gray-800">{c.name}</td>
                      <td className="p-4 text-gray-500 hidden md:table-cell">{c.slug || "-"}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button onClick={() => openEditModal(c, "kategori")} className="text-[#274a6a] hover:bg-blue-50 font-medium text-xs border border-[#274a6a]/20 px-3 py-1.5 rounded transition-colors">Edit Kategori</button>
                          <button onClick={() => handleDeleteData(c.id, "kategori")} className="text-red-600 hover:bg-red-50 font-medium text-xs border border-red-200 px-3 py-1.5 rounded transition-colors">Hapus</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden max-h-[95vh] flex flex-col">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-[#274a6a] text-lg capitalize">{isEditMode ? "Edit" : "Tambah"} {editingItem._type}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700 font-bold text-xl">&times;</button>
            </div>
            <form onSubmit={handleSaveData} className="p-5 flex flex-col gap-4 overflow-y-auto max-h-[75vh]">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">Nama {editingItem._type}</label>
                <input type="text" value={editingItem.name || ""} onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#274a6a] focus:border-[#274a6a] outline-none" required />
              </div>

              {editingItem._type === "toko" && (
                <>
                  <div className="pt-2 border-t border-gray-100">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Logo Toko (Bentuk Lingkaran/Square)</label>
                    {isEditMode && editingItem.logo_url && !selectedFileLogo && (
                      <img src={editingItem.logo_url} alt="Current Logo" className="w-16 h-16 object-cover rounded-full border border-gray-200 p-1 mb-2 bg-gray-50" />
                    )}
                    <input type="file" accept="image/*" onChange={handleLogoFileChange} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#274a6a]/10 file:text-[#274a6a] hover:file:bg-[#274a6a]/20" />
                  </div>
                  <div className="pt-2 border-t border-gray-100">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Foto Toko/Tempat Usaha (Landscape)</label>
                    {isEditMode && editingItem.image_url && !selectedFileBizPhoto && (
                      <img src={editingItem.image_url} alt="Current Biz Photo" className="w-full h-24 object-cover rounded-lg border border-gray-200 mb-2 bg-gray-50" />
                    )}
                    <input type="file" accept="image/*" onChange={handleBizPhotoFileChange} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#274a6a]/10 file:text-[#274a6a] hover:file:bg-[#274a6a]/20" />
                  </div>
                </>
              )}

              {editingItem._type === "produk" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Toko Pemilik</label>
                    <select value={editingItem.business_id || ""} onChange={(e) => setEditingItem({ ...editingItem, business_id: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#274a6a] outline-none text-sm bg-white" required>
                      {businesses.map((b) => ( <option key={b.id} value={b.id}>{b.name}</option> ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp)</label>
                    <input type="number" value={editingItem.price || ""} onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#274a6a] outline-none" required />
                  </div>
                  
                  {/* FORM INPUT LINK SHOPEE ADA DI SINI */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Link Shopee (Opsional)</label>
                    <input 
                      type="text" 
                      value={editingItem.shopee_url || ""} 
                      onChange={(e) => setEditingItem({ ...editingItem, shopee_url: e.target.value })} 
                      placeholder="https://shopee.co.id/..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#274a6a] outline-none" 
                    />
                  </div>
                  {/* AKHIR FORM INPUT LINK SHOPEE */}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Foto Gambar Produk</label>
                    <input type="file" accept="image/*" onChange={handleProductFileChange} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#274a6a]/10 file:text-[#274a6a] hover:file:bg-[#274a6a]/20" required={!isEditMode && !editingItem.image_url} />
                    {isEditMode && editingItem.image_url && (
                      <div className="mt-2 flex items-center gap-2">
                        <img src={editingItem.image_url} alt="Current" className="w-12 h-12 object-cover rounded border" />
                      </div>
                    )}
                  </div>
                </>
              )}

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100 bg-white sticky bottom-0">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Batal</button>
                <button type="submit" disabled={isSaving} className="px-4 py-2 text-sm font-medium text-white bg-[#274a6a] hover:bg-[#1f3b54] rounded-lg transition-colors disabled:opacity-50">
                  {isSaving ? "Menyimpan..." : isEditMode ? "Simpan Perubahan" : "Tambah Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-5 right-5 z-50">
          <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl border text-white font-medium text-sm transition-all duration-300 ${toast.type === "success" ? "bg-[#274a6a] border-white/20" : "bg-red-600 border-red-500"}`}>
            {toast.type === "success" ? (
              <svg className="w-5 h-5 text-green-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg className="w-5 h-5 text-white shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}