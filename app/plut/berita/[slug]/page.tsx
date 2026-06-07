import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

// Menggunakan tipe data asinkron untuk params di Next.js 15+
export default async function DetailBeritaPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  const supabase = await createClient();

  // Cari artikel berdasarkan slug di URL
  const { data: post } = await supabase
    .from("plut_posts")
    .select("*")
    .eq("slug", slug)
    .single();

  // Kalau slug-nya ngawur / tidak ada di database, lempar ke halaman 404
  if (!post) {
    notFound();
  }

  const date = new Date(post.published_date || post.created_at).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <article className="min-h-screen bg-neutral-50 pb-20 font-sans">
      <div className="max-w-4xl mx-auto px-6 pt-12 pb-8">
        <Link href="/plut/berita" className="text-sm font-bold text-[#FF3C00] hover:underline mb-8 inline-block">
          &larr; Kembali ke Daftar Berita
        </Link>
        
        <span className="block text-xs font-extrabold text-neutral-500 uppercase tracking-widest mb-3">
          {post.post_type} • {date}
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold text-neutral-900 leading-tight mb-8">
          {post.title}
        </h1>
      </div>

      {post.image_url && (
        <div className="w-full max-w-5xl mx-auto px-6 mb-12">
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-lg bg-neutral-900">
            <Image src={post.image_url} alt={post.title} fill className="object-contain" priority />
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6">
        {post.excerpt && (
          <p className="text-lg md:text-xl font-medium text-neutral-600 leading-relaxed mb-8 pb-8 border-b border-neutral-200">
            {post.excerpt}
          </p>
        )}
        
        {/* Render Konten Utama */}
        <div className="prose prose-lg prose-neutral max-w-none">
          {/* Karena text dari textarea biasa, kita ubah enter (newline) jadi <br/> agar rapi */}
          {post.content ? (
            post.content.split('\n').map((paragraph: string, index: number) => (
              <p key={index} className="mb-4 text-neutral-800 leading-loose">
                {paragraph}
              </p>
            ))
          ) : (
            <p className="text-neutral-400 italic">Konten belum tersedia.</p>
          )}
        </div>
      </div>
    </article>
  );
}