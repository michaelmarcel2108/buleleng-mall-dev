import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

interface CatalogPageProps {
  searchParams: Promise<{ q?: string; search?: string; category?: string }>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const resolvedSearchParams = await searchParams;
  // PERBAIKAN 2: Ambil dari .search atau .q sebagai fallback
  const queryText = resolvedSearchParams.search || resolvedSearchParams.q || "";
  const categoryParam = resolvedSearchParams.category || "";

  let productQuery = supabase
    .from("products")
    .select("*, businesses(name)");

  if (queryText) {
    const { data: matchedCategories } = await supabase
      .from("categories")
      .select("id")
      .ilike("name", `%${queryText}%`);

    const categoryIds = matchedCategories?.map((cat) => cat.id) || [];

    if (categoryIds.length > 0) {
      productQuery = productQuery.or(
        `name.ilike.%${queryText}%,category_id.in.(${categoryIds.join(",")})`
      );
    } else {
      productQuery = productQuery.ilike("name", `%${queryText}%`);
    }
  }

  if (categoryParam) {
    const { data: categoryData } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categoryParam)
      .maybeSingle();

    if (categoryData) {
      productQuery = productQuery.eq("category_id", categoryData.id);
    }
  }

  const { data: products } = await productQuery;
  const { data: allCategories } = await supabase.from("categories").select("*");

  return (
    <main className="w-full min-h-screen p-8 md:p-16 flex flex-col gap-8 bg-gray-50/50">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
          {queryText ? `Hasil Pencarian: "${queryText}"` : "Katalog Produk"}
        </h1>
        <p className="text-gray-500 text-sm md:text-base">
          Menampilkan produk-produk pilihan dari UMKM lokal Buleleng
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-row flex-wrap gap-2">
          <Link
            href="/catalog"
            className={`px-4 py-2 rounded-full text-xs font-medium border transition-all duration-300 ${
              !categoryParam
                ? "bg-[#274a6a] text-white border-[#274a6a] shadow-md"
                : "bg-[#274a6a]/10 text-[#274a6a] border-transparent hover:bg-[#274a6a] hover:text-white cursor-pointer" 
            }`}
          >
            Semua Produk
          </Link>
          
          {allCategories?.map((cat) => {
            const isSelected = categoryParam === cat.slug;
            return (
              <Link
                key={cat.id}
                href={`/catalog?category=${cat.slug}`}
                className={`px-4 py-2 rounded-full text-xs font-medium border transition-all duration-300 ${
                  isSelected
                    ? "bg-[#274a6a] text-white border-[#274a6a] shadow-md"
                    : "bg-[#274a6a]/10 text-[#274a6a] border-transparent hover:bg-[#274a6a] hover:text-white cursor-pointer"
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </div>
      </div>

      {products && products.length > 0 ? (
        <div className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="w-full text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-2">
          <p className="text-gray-500 font-medium">
            Produk yang kamu cari tidak ditemukan.
          </p>
          <Link href="/catalog" className="text-sm text-[#274a6a] font-bold hover:underline">
            Reset Filter
          </Link>
        </div>
      )}
    </main>
  );
}