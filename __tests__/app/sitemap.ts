import sitemap from "@/app/sitemap";
import { createClient } from "@/lib/supabase/server";

// 1. Mock Supabase Server
jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(),
}));

describe("UT-STM-001: Pengujian Dinamis Pembuatan Sitemap", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockSupabase: any;
  let mockSelect: jest.Mock;

  beforeEach(() => {
    mockSelect = jest.fn();
    mockSupabase = {
      from: jest.fn().mockReturnValue({
        select: mockSelect,
      }),
    };
    (createClient as jest.Mock).mockResolvedValue(mockSupabase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("menghasilkan sitemap lengkap: statis, produk, dan brand", async () => {
    // Pengaturan mock pertama untuk tabel 'products'
    mockSelect.mockResolvedValueOnce({
      data: [{ slug: "kopi-robusta", created_at: "2026-01-01T00:00:00Z" }],
    });
    // Pengaturan mock kedua untuk tabel 'businesses'
    mockSelect.mockResolvedValueOnce({
      data: [
        { slug: "toko-kopi-buleleng", created_at: "2026-02-01T00:00:00Z" },
      ],
    });

    const result = await sitemap();

    // Verifikasi pemanggilan Supabase
    expect(mockSupabase.from).toHaveBeenNthCalledWith(1, "products");
    expect(mockSupabase.from).toHaveBeenNthCalledWith(2, "businesses");

    // Verifikasi hasil array
    expect(result.length).toBe(4); // 2 rute statis + 1 produk + 1 brand

    const baseUrl = "https://bulelengmall.com";

    // Validasi URL statis
    expect(result[0].url).toBe(baseUrl);
    expect(result[1].url).toBe(`${baseUrl}/catalog`);

    // Validasi URL dinamis (Produk)
    expect(result[2].url).toBe(`${baseUrl}/product/kopi-robusta`);
    expect(result[2].changeFrequency).toBe("weekly");

    // Validasi URL dinamis (Brand)
    expect(result[3].url).toBe(`${baseUrl}/brand/toko-kopi-buleleng`);
    expect(result[3].changeFrequency).toBe("monthly");
  });

  it("tetap merender rute statis secara default jika data gagal ditarik", async () => {
    // Simulasikan database mengembalikan null atau error (null data handling)
    mockSelect.mockResolvedValue({ data: null });

    const result = await sitemap();

    // Ekspektasi: Fungsi tidak crash dan mereturn 2 rute utama
    expect(result.length).toBe(2);
    expect(result[0].url).toContain("bulelengmall.com");
    expect(result[1].url).toContain("/catalog");
  });
});
