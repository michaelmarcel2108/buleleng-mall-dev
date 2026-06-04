"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Deteksi apakah URL berawalan /plut atau /admin
  const isPlutRoute = pathname?.startsWith("/plut");
  const isAdminRoute = pathname?.startsWith("/admin");

  // Jika true, maka Navbar dan Footer akan disembunyikan
  const hideNavFooter = isPlutRoute || isAdminRoute;

  return (
    <>
      {!hideNavFooter && <Navbar />}
      
      <div className="flex-1 w-full flex flex-col">
        {children}
      </div>

      {!hideNavFooter && <Footer />}
    </>
  );
}