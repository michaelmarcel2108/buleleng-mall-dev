import Link from "next/link";
import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Bank Data & Dokumen - PLUT Buleleng",
  description: "Kumpulan template, formulir, dan dokumen digital PLUT Buleleng yang dapat diakses publik.",
};

export default async function BankDataPage() {
  const supabase = await createClient();

  // Mengambil data dari Supabase
  const { data: bankDataList, error } = await supabase
    .from("plut_bank_data")
    .select("*")
    .order("created_at", { ascending: false });

  // Mengelompokkan data berdasarkan 'kategori'
  const groupedData = bankDataList?.reduce((acc: Record<string, any[]>, item) => {
    if (!acc[item.kategori]) {
      acc[item.kategori] = [];
    }
    acc[item.kategori].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      {/* HERO SECTION */}
      <section className="bg-neutral-900 text-white py-16 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="text-[#FF3C00] font-bold text-sm tracking-widest uppercase mb-3 block">Layanan Informasi</span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Bank <span className="text-[#FF3C00]">Data</span>
          </h1>
          <p className="text-lg text-neutral-400">
            Pusat repositori dokumen digital, formulir, dan template bisnis yang terhubung langsung dengan penyimpanan awan resmi instansi.
          </p>
        </div>
      </section>

      {/* KONTEN UTAMA */}
      <main className="py-16 px-6 max-w-5xl mx-auto">
        <div className="space-y-12">
          {groupedData && Object.keys(groupedData).length > 0 ? (
            Object.entries(groupedData).map(([kategori, items], idx) => (
              <div key={idx} className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden">
                <div className="bg-neutral-100/50 px-8 py-5 border-b border-neutral-100">
                  <h2 className="text-2xl font-extrabold text-neutral-900">{kategori}</h2>
                </div>
                <div className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.map((item: any) => (
                      <a 
                        key={item.id}
                        href={item.link_url} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 rounded-2xl border border-neutral-100 hover:border-[#FF3C00]/30 hover:bg-[#FF3C00]/5 hover:shadow-sm transition-all group"
                      >
                        <div className="w-12 h-12 bg-neutral-100 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-white group-hover:shadow-sm transition-colors">
                          <svg className="w-6 h-6 text-[#FF3C00]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                          </svg>
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-bold text-neutral-900 group-hover:text-[#FF3C00] transition-colors line-clamp-2">
                            {item.nama_dokumen}
                          </h3>
                          <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                            Buka Tautan
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-neutral-100">
               <p className="text-neutral-500">Belum ada dokumen yang dibagikan saat ini.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}