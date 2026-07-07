import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types";

// 1. Mock next/image karena Next.js Image tidak berjalan natural di lingkungan Jest
jest.mock("next/image", () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ fill, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

describe("UT-COMP-001: ProductCard Component Coverage Expansion", () => {
  beforeEach(() => {
    // Bersihkan localStorage sebelum setiap test agar tidak saling mengintervensi
    window.localStorage.clear();
  });

  // --- MENGUJI LOGIKA FALLBACK (TEST AWAL KAMU) ---
  it("merender div 'No Image' saat image_url bernilai null", () => {
    const mockProduct = {
      id: "1",
      name: "Kain Tenun Buleleng",
      price: 150000,
      image_url: null,
      slug: "kain-tenun-buleleng",
    } as unknown as Product;

    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText(/No Image/i)).toBeInTheDocument();
    expect(screen.getByText("Kain Tenun Buleleng")).toBeInTheDocument();
  });

  // --- TAMBAHAN 1: MENGUJI RENDER DENGAN GAMBAR & DETAIL BISNIS (Menaikkan Branch Coverage) ---
  it("merender gambar produk dan nama bisnis jika datanya tersedia", () => {
    const mockProductComplete = {
      id: "2",
      name: "Kopi Buleleng Premium",
      price: 50000,
      image_url: "/images/kopi.jpg",
      slug: "kopi-buleleng-premium",
      businesses: [{ id: "biz-1", name: "Toko Kopi Asli", slug: "toko-kopi" }],
    } as unknown as Product;

    render(<ProductCard product={mockProductComplete} />);

    // Memastikan gambar ter-render
    const imgElement = screen.getByAltText("Kopi Buleleng Premium");
    expect(imgElement).toBeInTheDocument();
    expect(imgElement).toHaveAttribute("src", "/images/kopi.jpg");

    // Memastikan nama bisnis ter-render
    expect(screen.getByText("Toko Kopi Asli")).toBeInTheDocument();
    expect(screen.getByText("Rp50.000")).toBeInTheDocument();
  });

  // --- TAMBAHAN 2: SIMULASI KLIK UNTUK MENCAKUP LINES 13-18 (Menaikkan Line & Function Coverage) ---
  it("menjalankan handleSaveToRecent dan menyimpan data ke localStorage saat kartu diklik", () => {
    const mockProduct = {
      id: "3",
      name: "Siobak Singaraja",
      price: 35000,
      image_url: "/images/siobak.jpg",
      slug: "siobak-singaraja",
    } as unknown as Product;

    render(<ProductCard product={mockProduct} />);

    // Ambil elemen tautan (Link) yang membungkus kartu produk
    const cardLink = screen.getByRole("link");

    // Lakukan simulasi klik pada kartu
    fireEvent.click(cardLink);

    // Verifikasi apakah data masuk ke localStorage (Mencakup baris handleSaveToRecent)
    const recentProductsRaw = window.localStorage.getItem("recent_products");
    expect(recentProductsRaw).toBeTruthy();

    const recentProducts = JSON.parse(recentProductsRaw!);
    expect(recentProducts).toHaveLength(1);
    expect(recentProducts[0].id).toBe("3");
    expect(recentProducts[0].name).toBe("Siobak Singaraja");
  });

  // --- TAMBAHAN 3: MENGUJI KONDISIONAL DI DALAM HANDLE (Mengejar 100% Branch handleSaveToRecent) ---
  it("mengelola limit dan membersihkan duplikat di localStorage dengan benar", () => {
    // Siapkan data awal di localStorage seolah-olah user sudah melihat produk lain
    const existingProducts = Array.from({ length: 8 }, (_, i) => ({
      id: `dummy-${i}`,
      name: `Produk Dummy ${i}`,
    }));
    window.localStorage.setItem(
      "recent_products",
      JSON.stringify(existingProducts),
    );

    const mockProduct = {
      id: "dummy-0", // Id yang sama dengan salah satu produk dummy (menguji filter duplikat)
      name: "Produk Dummy 0",
      slug: "produk-dummy-0",
    } as unknown as Product;

    render(<ProductCard product={mockProduct} />);

    const cardLink = screen.getByRole("link");
    fireEvent.click(cardLink);

    const recentProducts = JSON.parse(
      window.localStorage.getItem("recent_products")!,
    );

    // Total item tidak boleh lebih dari 8 karena ada batasan pop() dan filtering duplikat
    expect(recentProducts).toHaveLength(8);
    // Item pertama haruslah produk yang baru diklik
    expect(recentProducts[0].id).toBe("dummy-0");
  });
});
