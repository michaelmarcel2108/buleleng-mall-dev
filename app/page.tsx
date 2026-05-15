import BrandCard from "@/components/BrandCard";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <section className="flex flex-col gap-4 bg-primary px-4 py-8">
        <div className="flex flex-row gap-4 overflow-x-scroll scrollbar-none">
          <div className="h-48 aspect-video bg-gray-500 rounded-lg"></div>
          <div className="h-48 aspect-video bg-gray-500 rounded-lg"></div>
          <div className="h-48 aspect-video bg-gray-500 rounded-lg"></div>
        </div>
        <h1 className="font-display text-4xl">
          Produk lokal Buleleng <br /> dengan kualitas <br /> terbaik.
        </h1>
        <p>Produk-produk dari usaha kecil-menengah Buleleng</p>

        <Link
          href="/shop"
          className="bg-blue-900 px-8 py-2 text-background text-center rounded-full hover:bg-background hover:text-foreground hover:outline-1 outline-foreground transition-all"
        >
          Belanja Sekarang
        </Link>
      </section>

      <section className="flex flex-col items-center gap-4 px-4 py-8">
        <h2 className="bg-primary text-2xl px-2 p-1 font-bold rounded-lg outline-2 outline-foreground">
          PRODUK TERLARIS
        </h2>

        <div className="w-full grid grid-cols-2 gap-4">
          <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard />
        </div>
      </section>

      <section className="flex flex-col items-center gap-4 px-4 py-8">
        <h2 className="bg-primary text-2xl px-2 p-1 font-bold rounded-lg outline-2 outline-foreground">
          JELAJAHI BRAND LOKAL
        </h2>

        <div className="w-full grid grid-cols-2 gap-4">
          <BrandCard />
          <BrandCard />
          <BrandCard />
          <BrandCard />
        </div>
      </section>
    </main>
  );
}
