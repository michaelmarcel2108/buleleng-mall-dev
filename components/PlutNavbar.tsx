"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function PlutNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Pemetaan URL yang disesuaikan dengan folder fisik halaman PLUT Anda
  const menuItems = [
    { name: "Beranda", href: "/plut" },
    {
      name: "Profil",
      dropdown: [
        { name: "Sambutan Kepala Dinas", href: "/plut/profil#sambutan" },
        { name: "Tupoksi & Profil Dinas", href: "/plut/profil#tupoksi" },
        { name: "Data Pegawai", href: "/plut/profil#pegawai" },
        { name: "Maklumat & Motto Pelayanan", href: "/plut/profil#maklumat" },
        { name: "Prosedur Informasi Publik", href: "/plut/profil#prosedur" },
        { name: "Alamat & Kontak Fisik", href: "/plut/kontak" }, // Mengarah langsung ke halaman /plut/kontak
      ],
    },
    {
      name: "Klinik UMKM",
      dropdown: [
        { name: "Klinik KUMKM", href: "/plut/layanan#klinik" },
        { name: "Layanan Perisai", href: "/plut/layanan#perisai" },
        { name: "Unit Terkait", href: "/plut/layanan#unit-terkait" },
      ],
    },
    {
      name: "Layanan Informasi",
      dropdown: [
        { name: "Berita & Artikel", href: "/plut/berita" },
        { name: "Pengumuman Resmi", href: "/plut/pengumuman" },
        { name: "Infografis", href: "/plut/infografis" },
        { name: "Bank Data", href: "/plut/bank-data" },
        { name: "Galeri Media", href: "/plut/galeri" },
      ],
    },
    {
      name: "Agenda & Regulasi",
      dropdown: [
        { name: "Agenda Kegiatan", href: "/plut/agenda-regulasi#agenda" },
        { name: "JDIH (Regulasi Daerah)", href: "/plut/agenda-regulasi#jdih" },
        { name: "PPID (Transparansi Data)", href: "/plut/agenda-regulasi#ppid" },
        { name: "Regulasi (Landasan Hukum)", href: "/plut/agenda-regulasi#regulasi" },
      ],
    },
    { name: "Pengaduan", href: "/plut/pengaduan" },
  ];

  return (
    <header className="bg-white border-b border-neutral-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        
        {/* IDENTITAS VISUAL BRANDING */}
        <Link href="/plut" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="relative w-10 h-10">
            <Image 
              src="/logo-plut.png" 
              alt="Logo PLUT" 
              width={40}
              height={40}
              className="object-contain"
              priority 
            />
          </div>
          <div>
            <span className="font-extrabold text-xl text-neutral-900 block leading-none mb-1">PLUT</span>
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block leading-none">Kab. Buleleng</span>
          </div>
        </Link>

        {/* PANEL NAVIGASI DESKTOP */}
        <nav className="hidden md:flex gap-7 items-center">
          {menuItems.map((menu) => (
            <div key={menu.name} className="relative group py-2">
              {menu.dropdown ? (
                <>
                  <button className="text-sm font-bold text-neutral-600 hover:text-[#0c353e] transition-colors flex items-center gap-1">
                    {menu.name}
                    <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* KOTAK DROPDOWN - Stabil Menggunakan Kombinasi group-hover */}
                  <div className="absolute left-0 mt-2 w-60 bg-white border border-neutral-100 rounded-xl shadow-xl py-2 flex flex-col opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    {menu.dropdown.map((sub) => (
                      <Link 
                        key={sub.name} 
                        href={sub.href} 
                        className="px-4 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:text-[#0c353e] transition-colors"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link href={menu.href!} className="text-sm font-bold text-neutral-600 hover:text-[#0c353e] transition-colors">
                  {menu.name}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* TOMBOL MENU RESPONSIVITAS MOBILE */}
        <button 
          className="md:hidden p-2 text-neutral-600" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>

      {/* PANEL NAVIGASI MOBILE DROPDOWN */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-neutral-100 p-4 space-y-2 max-h-[calc(100vh-80px)] overflow-y-auto">
          {menuItems.map((menu) => (
            <div key={menu.name} className="space-y-1">
              {menu.dropdown ? (
                <>
                  <div className="text-sm font-bold text-neutral-400 uppercase tracking-wider px-2 pt-2">{menu.name}</div>
                  {menu.dropdown.map((sub) => (
                    <Link 
                      key={sub.name} 
                      href={sub.href} 
                      className="block px-4 py-2 text-sm font-semibold text-neutral-600 rounded-lg hover:bg-neutral-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </>
              ) : (
                <Link 
                  href={menu.href!} 
                  className="block px-2 py-2 text-sm font-bold text-neutral-600 rounded-lg hover:bg-neutral-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {menu.name}
                </Link>
              )}
            </div>
          ))}
        </div>
      )}
    </header>
  );
}