// Mendefinisikan tipe data yang akan diterima dari luar
interface ProductCardProps {
  id?: string;
  namaBarang?: string;
  linkShopee?: string;
}

const ProductCard = ({ namaBarang, linkShopee }: ProductCardProps) => {
  return (
    // Tag anchor untuk redirect jika linkShopee tersedia
    <a 
      href={linkShopee || "#"} 
      target={linkShopee ? "_blank" : "_self"} 
      rel="noopener noreferrer"
      className="w-full block group cursor-pointer hover:opacity-90 transition-opacity"
    >
      <div className="w-full aspect-square bg-gray-500 rounded-lg overflow-hidden relative">
        {/* Tambahan efek hover sederhana pada gambar kosong */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition"></div>
      </div>
      
      {/* Teks dinamis dari database */}
      <p className="font-display text-xl font-medium mt-2 line-clamp-1">
        {namaBarang || "Nama Produk"}
      </p>
      
      {/* Harga statis sementara (akan diganti dari API Shopee nantinya) */}
      <p className="font-semibold text-orange-600">Rp --</p>
      <p className="text-foreground/75 text-sm truncate">Toko UMKM</p>
    </a>
  );
};

export default ProductCard;