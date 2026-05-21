import { Product } from "@/types";
import Image from "next/image";
import Link from "next/link";

// Mendefinisikan tipe data yang akan diterima dari luar
interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    // Tag anchor untuk redirect jika linkShopee tersedia
    <Link
      href={`/product/${product.slug}`}
      target={product.shopee_url ? "_blank" : "_self"}
      rel="noopener noreferrer"
      className="w-full block group cursor-pointer hover:opacity-90 transition-opacity"
    >
      <Image
        src={product.image_url}
        width={320}
        height={320}
        alt="product image"
        className="w-full aspect-square rounded-lg overflow-hidden relative"
      />

      {/* Teks dinamis dari database */}
      <p className="font-display text-xl font-medium mt-2 line-clamp-1">
        {product.name || "Nama Produk"}
      </p>

      {/* Harga statis sementara (akan diganti dari API Shopee nantinya) */}
      <p className="font-semibold">Rp800.000</p>
      <p className="text-foreground/75 text-sm truncate">Toko UMKM</p>
    </Link>
  );
};

export default ProductCard;
