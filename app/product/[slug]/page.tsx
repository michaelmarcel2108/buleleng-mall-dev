import { createClient } from "@/lib/supabase/server";
import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";

interface ProductDetailProps {
  params: Promise<{ slug: string }>;
}

const ProductDetailPage = async ({ params }: ProductDetailProps) => {
  const unwrappedParams = await params;
  const slug = unwrappedParams.slug;
  const supabase = await createClient();

  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  const product: Product = data;

  if (!product) return <p>Memuat...</p>;

  return (
    <main>
      <section className=" md:grid grid-cols-2">
        <Image
          className="w-full h-auto outline outline-foreground"
          src={product.image_url}
          alt={`Gambar ${product.name}`}
          width={1080}
          height={1920}
        />
        <div className="flex flex-col gap-4 items-start bg-primary p-8 md:justify-end outline outline-foreground">
          <span className="flex flex-col items-start gap-2">
            <h2 className="bg-gray-300 text-xl px-2 p-1 font-bold">CATEGORY</h2>
            <h1 className="font-display text-2xl md:text-3xl">
              {product.name}
            </h1>
            <p className="md:text-xl">Rp800.000</p>
          </span>
          <Link
            href={product.shopee_url || "#"}
            className="w-full bg-blue-900 px-8 py-2 text-background text-center rounded-full hover:bg-background hover:text-foreground hover:outline-1 outline-foreground transition-all md:self-start md:text-lg"
          >
            Lihat di Shopee
          </Link>
          <Link
            href={product.shopee_url || "#"}
            className="w-full bg-background outline px-8 py-2 text-foreground text-center rounded-full hover:bg-primary hover:text-foreground hover:outline-1 outline-foreground transition-all md:self-start md:text-lg"
          >
            Hubungi Penjual
          </Link>
        </div>
      </section>
    </main>
  );
};

export default ProductDetailPage;
