import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function ManageBankDataPage() {
  const supabase = await createClient();
  const { data: bankDataList } = await supabase.from("plut_bank_data").select("*").order("created_at", { ascending: false });

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans">
      <header className="flex justify-between items-center mb-8 border-b pb-4">
        <div>
          <h1 className="text-2xl font-extrabold">Kelola Bank Data</h1>
          <p className="text-neutral-500 text-sm">Manajemen tautan dokumen Google Drive untuk publik.</p>
        </div>
        <Link href="/admin/plut/bank-data/edit/new" className="px-5 py-2.5 bg-[#FF3C00] text-white font-bold rounded-lg shadow-sm">
          + Tambah Dokumen
        </Link>
      </header>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase">
            <tr>
              <th className="px-6 py-4">Nama Dokumen</th>
              <th className="px-6 py-4">Kategori</th>
              <th className="px-6 py-4">Tautan URL</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {bankDataList?.map((item) => (
              <tr key={item.id} className="hover:bg-neutral-50">
                <td className="px-6 py-4 font-bold text-neutral-900">{item.nama_dokumen}</td>
                <td className="px-6 py-4"><span className="bg-neutral-100 px-2 py-1 rounded text-xs">{item.kategori}</span></td>
                <td className="px-6 py-4 text-sm text-blue-600 truncate max-w-[200px]"><a href={item.link_url} target="_blank">{item.link_url}</a></td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/admin/plut/bank-data/edit/${item.id}`} className="text-emerald-600 hover:underline mr-4 text-sm font-semibold">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}