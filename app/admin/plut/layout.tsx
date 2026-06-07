"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminPlutLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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
      <aside className="w-64 bg-white border-r border-neutral-200 hidden md:flex flex-col">
        <div className="p-6 border-b border-neutral-100">
          <h2 className="text-lg font-black text-[#0c353e]">ADMIN PLUT</h2>
        </div>
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
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}