import { Article } from "@/types";
import Image from "next/image";
import Link from "next/link";

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className="group flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 h-full"
    >
      {/* Thumbnail Artikel */}
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        {article.image_url ? (
          <Image
            width={500}
            height={500}
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs border-b border-dashed">
            No Image
          </div>
        )}
      </div>

      {/* Detail Konten */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="font-bold text-gray-800 text-sm md:text-base line-clamp-2 group-hover:text-[#274a6a] transition-colors">
          {article.title}
        </h3>

        {/* Preview isi artikel (hanya menampilkan maksimal 2 baris) */}
        <p className="text-xs text-gray-500 line-clamp-2 flex-1">
          {article.content}
        </p>

        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-50 text-[10px] md:text-xs text-gray-400">
          <span className="font-medium text-[#274a6a]">{article.author}</span>
          <span>
            {new Date(article.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </Link>
  );
}
