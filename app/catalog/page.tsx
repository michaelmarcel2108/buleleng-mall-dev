import ProductCard from "@/components/ProductCard";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

interface CatalogPageProps {
  searchParams: Promise<{
    q?: string;
    search?: string;
    category?: string;
    page?: string;
  }>;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const supabase = await createClient();
  const resolvedSearchParams = await searchParams;

  const queryText = resolvedSearchParams.search || resolvedSearchParams.q || "";
  const categoryParam = resolvedSearchParams.category || "";

  const ITEMS_PER_PAGE = 10;
  const currentPage = parseInt(resolvedSearchParams.page || "1", 10);
  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  let productQuery = supabase
    .from("products")
    .select("*, businesses(name)", { count: "exact" });

  if (queryText) {
    const { data: matchedCategories } = await supabase
      .from("categories")
      .select("id")
      .ilike("name", `%${queryText}%`);

    const categoryIds = matchedCategories?.map((cat) => cat.id) || [];

    if (categoryIds.length > 0) {
      productQuery = productQuery.or(
        `name.ilike.%${queryText}%,category_id.in.(${categoryIds.join(",")})`,
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

  productQuery = productQuery.range(from, to);

  const { data: products, count } = await productQuery;
  const { data: allCategories } = await supabase.from("categories").select("*");

  const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 0;

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams();
    if (queryText) params.set("q", queryText);
    if (categoryParam) params.set("category", categoryParam);
    params.set("page", pageNumber.toString());
    return `/catalog?${params.toString()}`;
  };

  return (
    <main className="w-full min-h-screen p-8 md:p-16 flex flex-col gap-8 bg-gray-50/50">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
          {queryText ? `Hasil Pencarian: "${queryText}"` : "Katalog Produk"}
        </h1>
        <p className="text-gray-500 text-sm md:text-base">
          Produk-produk pilihan dari UMKM lokal Buleleng
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
        <div className="flex flex-col gap-8">
          <div className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              {currentPage > 1 ? (
                <Link
                  href={createPageUrl(currentPage - 1)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-md shadow-sm text-sm font-medium text-[#274a6a] hover:bg-gray-50 transition-colors"
                >
                  Sebelumnya
                </Link>
              ) : (
                <button
                  disabled
                  className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium text-gray-400 cursor-not-allowed"
                >
                  Sebelumnya
                </button>
              )}

              <span className="text-sm text-gray-600">
                Halaman{" "}
                <span className="font-semibold text-foreground">
                  {currentPage}
                </span>{" "}
                dari{" "}
                <span className="font-semibold text-foreground">
                  {totalPages}
                </span>
              </span>

              {currentPage < totalPages ? (
                <Link
                  href={createPageUrl(currentPage + 1)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-md shadow-sm text-sm font-medium text-[#274a6a] hover:bg-gray-50 transition-colors"
                >
                  Selanjutnya
                </Link>
              ) : (
                <button
                  disabled
                  className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm font-medium text-gray-400 cursor-not-allowed"
                >
                  Selanjutnya
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="w-full text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-2">
          <p className="text-gray-500 font-medium">
            Produk yang kamu cari tidak ditemukan.
          </p>
          <Link
            href="/catalog"
            className="text-sm text-[#274a6a] font-bold hover:underline"
          >
            Reset Filter
          </Link>
        </div>
      )}
    </main>
  );
}
