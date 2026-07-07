// __tests__/integration/HomeTabs.test.tsx
import { render, screen, fireEvent, act } from "@testing-library/react";
import HomeTabs from "@/components/HomeTabs";
import { Business, Product } from "@/types";

// Mock child components jika diperlukan, namun untuk integration test
// lebih baik biarkan ter-render agar menguji fungsionalitas nyata.
jest.mock("@/components/ProductCard", () => {
  return function MockProductCard({ product }: { product: Product }) {
    return <div data-testid="product-card">{product.name}</div>;
  };
});

jest.mock("@/components/BrandCard", () => {
  return function MockBrandCard({ business }: { business: Business }) {
    return <div data-testid="brand-card">{business.name}</div>;
  };
});

const mockProducts = [
  { id: "1", name: "Kopi Robusta", category: "Produk Terlaris" },
  { id: "2", name: "Tas Anyaman", category: "Brand Lokal" },
] as unknown as Product[];

const mockBusinesses = [
  { id: "1", name: "Toko Kopi Buleleng", desc: "Kopi khas bali" },
] as unknown as Business[];

describe("Integration: HomeTabs dan Katalog Produk", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  it("menangani render Client Side dan dapat berinteraksi dengan tab kategori", async () => {
    await act(async () => {
      render(<HomeTabs products={mockProducts} businesses={mockBusinesses} />);
    });

    const brandLokalBtn = screen.getByRole("button", { name: /Brand Lokal/i });
    expect(brandLokalBtn).toBeInTheDocument();

    // Menguji Baris 67 (Tab Brand)
    await act(async () => {
      fireEvent.click(brandLokalBtn);
    });

    expect(screen.getByTestId("brand-card")).toBeInTheDocument();
    expect(screen.getByText("Toko Kopi Buleleng")).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: /Lihat Semua Produk/i }),
    ).toBeInTheDocument();
  });

  // 🎯 UNTUK COVER BARIS 27-41 & 105-111 (Kondisi Kosong pada Tab Incaran)
  it("menampilkan pesan kosong pada tab 'Incaran Anda' jika localStorage tidak memiliki data", async () => {
    await act(async () => {
      render(<HomeTabs products={mockProducts} businesses={mockBusinesses} />);
    });

    const incaranBtn = screen.getByRole("button", { name: /Incaran Anda/i });

    await act(async () => {
      fireEvent.click(incaranBtn);
    });

    // Memastikan baris 105-111 tereksekusi (State kosong)
    expect(
      screen.getByText("Belum ada produk yang kamu lihat terakhir ini."),
    ).toBeInTheDocument();
  });

  // 🎯 UNTUK COVER BARIS 27-41 (Kondisi Mengambil Data Terakhir dari localStorage)
  it("memuat dan menampilkan produk dari localStorage pada tab 'Incaran Anda'", async () => {
    const localProducts = [
      { id: "10", name: "Kain Tenun Khas Buleleng", category: "Kain" },
    ];
    window.localStorage.setItem(
      "recent_products",
      JSON.stringify(localProducts),
    );

    await act(async () => {
      render(<HomeTabs products={mockProducts} businesses={mockBusinesses} />);
    });

    const incaranBtn = screen.getByRole("button", { name: /Incaran Anda/i });

    await act(async () => {
      fireEvent.click(incaranBtn);
    });

    // Memastikan baris 27-41 membaca data dan merendernya ke layar
    expect(screen.getByTestId("product-card")).toBeInTheDocument();
    expect(screen.getByText("Kain Tenun Khas Buleleng")).toBeInTheDocument();
  });
});
