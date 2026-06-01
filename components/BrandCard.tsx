import Image from "next/image";
import Link from "next/link";

interface BrandCardProps {
  business: {
    id: string;
    name: string;
    desc: string;
    slug: string;
    products?: { image_url: string | null }[];
  };
}

const BrandCard = ({ business }: BrandCardProps) => {
  const storeProducts = business.products || [];

  return (
    <Link
      href={`/brand/${business.slug}`}
      className="w-full flex flex-col gap-2 rounded-lg p-2 md:p-4 hover:bg-gray-100 transition-colors cursor-pointer bg-white outline-2 outline-[#407d99] border-none ring-0 shadow-sm"
    >
      <div className="grid grid-cols-2 aspect-square gap-2 rounded-md overflow-hidden bg-gray-100 p-1 outline-none border-none">
        {[0, 1, 2, 3].map((index) => {
          const product = storeProducts[index];
          return (
            <div
              key={index}
              className="w-full aspect-square bg-gray-200 relative rounded-sm overflow-hidden"
            >
              {product?.image_url ? (
                <Image
                  width={500}
                  height={500}
                  src={product.image_url}
                  alt={`Produk dari ${business.name}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full bg-gray-300"></div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-2">
        <p className="font-display text-xl font-medium line-clamp-1">
          {business.name || "Nama Brand"}
        </p>
        <p className="text-sm text-gray-500 line-clamp-1 mb-1">
          {business.desc || "UMKM Buleleng"}
        </p>

        <div className="flex flex-row gap-1 items-center text-yellow-500">
          <span className="flex flex-row tracking-widest text-lg">★★★★★</span>
          <p className="text-foreground/75 text-sm ml-1 font-semibold">(99+)</p>
        </div>
      </div>
    </Link>
  );
};

export default BrandCard;
