"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminPlutLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Struktur Menu Utama Admin PLUT
  const adminLinks = [
    { name: "Dashboard", href: "/admin/plut" },
    { name: "Kelola Postingan", href: "/admin/plut/manage" },
    { name: "Kelola Banner", href: "/admin/plut/banners" },
    { name: "Agenda & Regulasi", href: "/admin/plut/agenda" },
    { name: "Bank Data", href: "/admin/plut/bank-data" },
    { name: "Database UMKM", href: "/admin/plut/umkm" },
    { name: "Pengaturan Web", href: "/admin/plut/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-neutral-50 text-sm">
      
      {/* SIDEBAR - Minimalis & Profesional */}
      <aside className="w-64 bg-white border-r border-neutral-200 hidden md:flex flex-col justify-between">
        <div>
          {/* Header Sidebar */}
          <div className="p-6 border-b border-neutral-100">
            <h2 className="text-lg font-black text-[#0c353e] tracking-tight mb-3">ADMIN PLUT</h2>
            
            {/* AKSES CEPAT: Tombol pintasan langsung ke Landing Page Publik PLUT */}
            <Link 
              href="/plut" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0c353e]/5 hover:bg-[#0c353e]/10 text-[#0c353e] text-xs font-bold rounded-md transition-colors w-full justify-center border border-[#0c353e]/10"
            >
              Lihat Website
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
          </div>

          {/* Menu Navigasi Admin */}
          <nav className="p-4 space-y-1">
            {adminLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className={`block px-4 py-2.5 rounded-lg font-medium transition-colors ${
                    isActive 
                      ? "bg-[#0c353e]/10 text-[#0c353e] font-bold" 
                      : "text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bagian Bawah Sidebar (Opsional: Tombol Kembali ke Dashboard Utama Mall) */}
        <div className="p-4 border-t border-neutral-100">
          <Link 
            href="/admin" 
            className="block text-center text-xs font-semibold text-neutral-400 hover:text-neutral-600 transition-colors py-2"
          >
            Kembali ke Admin Utama
          </Link>
        </div>
      </aside>
      
      {/* AREA KONTEN HALAMAN */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
      
    </div>
  );
}