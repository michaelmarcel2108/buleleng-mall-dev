import Image from "next/image";
import Link from "next/link";

export default function ArticleCard({ post }: { post: any }) {
  const getSafeImage = (url?: string | null) => {
    if (!url || url.trim() === "") return "https://placehold.co/600x400/eeeeee/999999?text=Belum+Ada+Gambar";
    return url;
  };

  const imageSrc = getSafeImage(post.image_url);
  const date = new Date(post.published_date || post.created_at).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Link href={`/plut/berita/${post.slug}`} className="group bg-white rounded-2xl border border-neutral-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <div className="relative h-48 w-full bg-neutral-100 overflow-hidden">
        <Image 
          src={imageSrc} 
          alt={post.title} 
          fill 
          className="object-cover group-hover:scale-110 transition-transform duration-700" 
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <span className="text-[10px] font-extrabold text-[#FF3C00] uppercase mb-2 tracking-widest">{date}</span>
        <h3 className="font-bold text-neutral-900 text-lg line-clamp-2 mb-3 group-hover:text-[#FF3C00] transition-colors leading-snug">
          {post.title}
        </h3>
        <p className="text-sm text-neutral-500 line-clamp-3 mt-auto leading-relaxed">
          {post.excerpt || "Klik untuk membaca detail informasi selengkapnya mengenai agenda ini."}
        </p>
      </div>
    </Link>
  );
}