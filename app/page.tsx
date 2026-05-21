import BrandCard from "@/components/BrandCard";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Business } from "./../types";

export default async function Home() {
  // Ambil data UMKM dan Barang
  const { data: businesses } = await supabase
    .from("businesses")
    .select("*")
    .limit(4);
  const { data: products } = await supabase
    .from("products")
    .select("*")
    .limit(4);

  return (
    <main>
      <section className="flex flex-col gap-4 bg-primary py-8 md:py-16">
        <div className="flex flex-row gap-4 overflow-x-scroll scrollbar-none pl-4 md:pl-16">
          <div className="h-48 aspect-video bg-gray-500 rounded-lg md:h-64"></div>
          <div className="h-48 aspect-video bg-gray-500 rounded-lg md:h-64"></div>
          <div className="h-48 aspect-video bg-gray-500 rounded-lg md:h-64"></div>
        </div>

        <div className="flex flex-col gap-4 px-4 md:px-16">
          <h1 className="font-display text-4xl md:text-5xl">
            Produk lokal Buleleng <br /> dengan kualitas{" "}
            <br className="md:hidden" /> terbaik.
          </h1>
          <p>Produk-produk dari usaha kecil-menengah Buleleng</p>

          <Link
            href="/shop"
            className="bg-blue-900 px-8 py-2 text-background text-center rounded-full hover:bg-background hover:text-foreground hover:outline-1 outline-foreground transition-all md:self-start"
          >
            Belanja Sekarang
          </Link>
        </div>
      </section>

      <section className="flex flex-col items-center gap-4 px-4 py-8 md:p-16">
        <h2 className="bg-primary text-2xl px-2 p-1 font-bold rounded-lg outline-2 outline-foreground uppercase">
          Produk Terlaris
        </h2>

        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Memanggil ProductCard dan mengirim (passing) data dari Supabase */}
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="flex flex-col items-center gap-4 px-4 py-8 md:p-16">
        <h2 className="bg-primary text-2xl px-2 p-1 font-bold rounded-lg outline-2 outline-foreground uppercase">
          Jelajahi Brand Lokal
        </h2>

        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Memanggil BrandCard dan mengirim (passing) data dari Supabase */}
          {businesses?.map((business) => (
            <BrandCard key={business.id} business={business} />
          ))}
        </div>
      </section>
    </main>
  );
}
