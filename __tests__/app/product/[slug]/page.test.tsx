/* eslint-disable @typescript-eslint/no-explicit-any */
// __tests__/product/page.test.tsx
import { render, screen } from "@testing-library/react";
import ProductDetailPage, { generateMetadata } from "@/app/product/[slug]/page";
import { createClient } from "@/lib/supabase/server";
import { Product } from "@/types";

// 1. Mock Supabase Server
jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(),
}));

// 2. Mock Komponen Anak untuk isolasi testing
jest.mock("@/components/ProductCard", () => ({
  __esModule: true,
  default: ({ product }: { product: Product }) => (
    <div data-testid="product-card">{product.name}</div>
  ),
}));

jest.mock("@/components/ProductDescription", () => ({
  __esModule: true,
  default: ({ text }: { text: string }) => (
    <div data-testid="product-desc">{text}</div>
  ),
}));

describe("UT-PROD-001: Detail Produk Page & Metadata", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockSupabase: any;

  beforeEach(() => {
    mockSupabase = {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      neq: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      single: jest.fn(),
    };
    (createClient as jest.Mock).mockResolvedValue(mockSupabase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- KELOMPOK PENGUJIAN RENDERING KOMPONEN ---

  it("merender halaman detail produk dengan data lengkap (Array Categories & Businesses)", async () => {
    mockSupabase.limit.mockResolvedValueOnce({
      data: [
        {
          id: "1",
          slug: "kopi-buleleng",
          name: "Kopi Buleleng",
          price: 50000,
          description: "Kopi enak",
          image_url: "https://example.com/kopi.png",
          shopee_url: "https://shopee.co.id/kopi",
          tokopedia_url: "https://tokopedia.com/kopi",
          categories: [{ id: "1", name: "Minuman", color: "#6b46c1" }],
          businesses: [{ id: "1", name: "Toko A", slug: "toko-a" }],
        },
      ],
      error: null,
    });

    mockSupabase.limit.mockResolvedValueOnce({
      data: [{ id: "2", name: "Produk Katalog Lain" }],
    });

    const page = await ProductDetailPage({
      params: Promise.resolve({ slug: "kopi-buleleng" }),
    });
    render(page);

    expect(screen.getByText("Kopi Buleleng")).toBeInTheDocument();
    expect(screen.getByText(/Rp\s?50\.000/)).toBeInTheDocument();
    expect(screen.getByText("Beli di Shopee")).toBeInTheDocument();
    expect(screen.getByText("Beli di Tokopedia")).toBeInTheDocument();
    expect(screen.getByText("Minuman")).toBeInTheDocument();
    expect(screen.getByText("Toko: Toko A")).toBeInTheDocument();
  });

  it("menangani data ketika price, image, shopee, tokopedia, dan categories bernilai null/kosong", async () => {
    mockSupabase.limit.mockResolvedValueOnce({
      data: [
        {
          id: "2",
          slug: "barang-langka",
          name: "Barang Tanpa Atribut",
          price: null,
          description: "",
          image_url: null,
          shopee_url: null,
          tokopedia_url: null,
          categories: null, // Skenario categoriesList fallback []
          businesses: null,
        },
      ],
      error: null,
    });

    // Katalog produk kosong untuk menguji fallback paragraf "Produk Tidak Tersedia"
    mockSupabase.limit.mockResolvedValueOnce({ data: [] });

    const page = await ProductDetailPage({
      params: Promise.resolve({ slug: "barang-langka" }),
    });
    render(page);

    expect(screen.getByText("Barang Tanpa Atribut")).toBeInTheDocument();
    expect(screen.getByText(/Rp\s?0/)).toBeInTheDocument();
    expect(screen.getByText("No Image")).toBeInTheDocument();
    expect(screen.queryByText("Beli di Shopee")).not.toBeInTheDocument();
    expect(screen.queryByText("Beli di Tokopedia")).not.toBeInTheDocument();
    expect(screen.getByText("Produk Tidak Tersedia")).toBeInTheDocument();
  });

  it("menangani object categories tunggal (Bukan Array) untuk cakupan baris maps", async () => {
    mockSupabase.limit.mockResolvedValueOnce({
      data: [
        {
          id: "3",
          slug: "kopi-tunggal",
          name: "Kopi Tunggal",
          categories: { id: "1", name: "Sembako", color: "" }, // Single Object
          businesses: { id: "1", name: "Toko B", slug: "toko-b" }, // Single Object
        },
      ],
      error: null,
    });
    mockSupabase.limit.mockResolvedValueOnce({ data: [] });

    const page = await ProductDetailPage({
      params: Promise.resolve({ slug: "kopi-tunggal" }),
    });
    render(page);
    expect(screen.getByText("Sembako")).toBeInTheDocument();
  });

  it("menampilkan UI error jika produk tidak ditemukan atau database error", async () => {
    mockSupabase.limit.mockResolvedValueOnce({ data: [], error: null });
    mockSupabase.limit.mockResolvedValueOnce({
      data: [{ id: "9", name: "Rekomendasi Terpopuler" }],
    });

    const page = await ProductDetailPage({
      params: Promise.resolve({ slug: "tidak-ada" }),
    });
    render(page);

    expect(screen.getByText("Produk Tidak Ditemukan")).toBeInTheDocument();
    expect(screen.getByText("Rekomendasi Terpopuler")).toBeInTheDocument();
  });

  // --- KELOMPOK PENGUJIAN METADATA DINAMIS ---

  it("generateMetadata: mengembalikan judul fallback jika produk SEO tidak ditemukan", async () => {
    mockSupabase.single.mockResolvedValueOnce({ data: null });

    const metadata = await generateMetadata(
      { params: Promise.resolve({ slug: "produk-ghaib" }) },
      Promise.resolve({}) as any,
    );

    expect(metadata.title).toBe("Produk Tidak Ditemukan");
  });

  it("generateMetadata: membersihkan tag HTML dan memotong teks deskripsi panjang", async () => {
    const teksHtmlPanjang =
      "<p>Kopi robusta premium asli hasil bumi Buleleng Bali yang ditanam langsung di perkebunan dataran tinggi Munduk. Memiliki cita rasa khas dengan sentuhan rasa cokelat alami yang pekat dan aroma yang memikat hati setiap penikmat kopi di Indonesia.</p>";

    mockSupabase.single.mockResolvedValueOnce({
      data: {
        name: "Kopi Munduk",
        description: teksHtmlPanjang,
        image_url: "https://example.com/munduk.png",
      },
    });

    const metadata = await generateMetadata(
      { params: Promise.resolve({ slug: "kopi-munduk" }) },
      Promise.resolve({ openGraph: { images: [] } }) as any,
    );

    expect(metadata.title).toBe("Kopi Munduk");
    // Memastikan tag <p> hilang dan string dipotong maksimal 155 karakter
    expect(metadata.description).not.toContain("<p>");
    expect(metadata.description?.length).toBeLessThanOrEqual(160); // 155 + "..."
  });

  it("generateMetadata: menggunakan deskripsi default jika deskripsi produk bernilai null", async () => {
    mockSupabase.single.mockResolvedValueOnce({
      data: {
        name: "Kripik Singkong",
        description: null,
        image_url: null,
      },
    });

    const metadata = await generateMetadata(
      { params: Promise.resolve({ slug: "kripik-singkong" }) },
      Promise.resolve({}) as any,
    );

    expect(metadata.description).toBe("Beli Kripik Singkong di Buleleng Mall.");
  });
});
