/* eslint-disable @typescript-eslint/no-explicit-any */
import { generateMetadata } from "@/app/product/[slug]/page"; // Sesuaikan dengan path file Anda
import { createClient } from "@/lib/supabase/server";
import { ResolvingMetadata } from "next";

// 1. Mock dependensi modul Supabase Server
jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(),
}));

describe("Pengujian SEO: generateMetadata di Halaman Detail Produk", () => {
  let mockSupabase: any;

  beforeEach(() => {
    // 2. Setup mock untuk fungsi berantai (chaining) Supabase
    // Mensimulasikan: supabase.from().select().eq().single()
    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
    };

    // Pastikan createClient mengembalikan mockSupabase yang telah kita buat
    (createClient as jest.Mock).mockResolvedValue(mockSupabase);
  });

  afterEach(() => {
    // Bersihkan semua mock setelah setiap pengujian selesai
    jest.clearAllMocks();
  });

  it("UT-SEO-001: Menghasilkan metadata yang valid dan membersihkan tag HTML pada deskripsi", async () => {
    // Arrange: Siapkan data palsu (mock data) seolah-olah berhasil diambil dari Supabase
    mockSupabase.single.mockResolvedValue({
      data: {
        name: "Kain Tenun Buleleng",
        description:
          "<p>Ini adalah <b>Kain Tenun</b> asli Buleleng. <i>Sangat nyaman digunakan!</i></p>",
        image_url: "https://bulelengmall.com/kain.png",
      },
      error: null,
    });

    // Sesuaikan dengan tipe parameter fungsi asli (Promise)
    const mockParams = Promise.resolve({ slug: "kain-tenun-buleleng" });
    const mockParent = Promise.resolve({
      openGraph: { images: ["/previous-og-image.png"] },
    }) as unknown as ResolvingMetadata;

    // Act: Jalankan fungsi generateMetadata
    const metadata = await generateMetadata({ params: mockParams }, mockParent);

    // Assert: Validasi pemanggilan Supabase
    expect(createClient).toHaveBeenCalledTimes(1);
    expect(mockSupabase.from).toHaveBeenCalledWith("products");
    expect(mockSupabase.eq).toHaveBeenCalledWith("slug", "kain-tenun-buleleng");

    // Assert: Validasi hasil SEO (Pembersihan HTML Tag & Pemotongan String)
    expect(metadata.title).toBe("Kain Tenun Buleleng");

    // Pastikan tag HTML hilang
    expect(metadata.description).not.toContain("<p>");
    expect(metadata.description).not.toContain("<b>");

    // Pastikan string yang bersih tersisa dan ditambahkan "..."
    expect(metadata.description).toBe(
      "Ini adalah Kain Tenun asli Buleleng. Sangat nyaman digunakan!...",
    );

    // Assert: Validasi OpenGraph dan Twitter Metadata
    expect(metadata.openGraph?.title).toBe(
      "Kain Tenun Buleleng | Buleleng Mall",
    );
    expect(metadata.openGraph?.images).toEqual([
      "https://bulelengmall.com/kain.png", // Gambar utama
      "/previous-og-image.png", // Gambar parent sebelumnya
    ]);
    expect((metadata.twitter as any)?.card).toBe("summary_large_image");
  });

  it('Mengembalikan metadata "Produk Tidak Ditemukan" jika produk tidak ada di database', async () => {
    // Arrange: Simulasikan produk tidak ditemukan (data null)
    mockSupabase.single.mockResolvedValue({
      data: null,
      error: { message: "Not found" },
    });

    const mockParams = Promise.resolve({ slug: "produk-hilang" });
    const mockParent = Promise.resolve({} as ResolvingMetadata);

    // Act
    const metadata = await generateMetadata({ params: mockParams }, mockParent);

    // Assert
    expect(metadata.title).toBe("Produk Tidak Ditemukan");

    // Deskripsi dan openGraph seharusnya tidak ter-generate jika data gagal dimuat
    expect(metadata.description).toBeUndefined();
    expect(metadata.openGraph).toBeUndefined();
  });
});
