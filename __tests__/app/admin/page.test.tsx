// __tests__/admin/page.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AdminDashboard from "@/app/admin/page";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/lib/supabase/client", () => ({
  createClient: jest.fn(),
}));

jest.mock("@/components/admin/TabToko", () => {
  return function MockTabToko({
    onViewProducts,
  }: {
    onViewProducts: (name: string) => void;
  }) {
    return (
      <div data-testid="tab-toko">
        <button onClick={() => onViewProducts("Toko Buleleng")}>
          View Products
        </button>
      </div>
    );
  };
});

jest.mock(
  "@/components/admin/TabProduk",
  () =>
    function MockTabProduk() {
      return <div data-testid="tab-produk" />;
    },
);
jest.mock(
  "@/components/admin/TabKategori",
  () =>
    function MockTabKategori() {
      return <div data-testid="tab-kategori" />;
    },
);
jest.mock(
  "@/components/admin/TabBanner",
  () =>
    function MockTabBanner() {
      return <div data-testid="tab-banner" />;
    },
);
jest.mock(
  "@/components/admin/TabProfileKoperasi",
  () =>
    function MockTabProfileKoperasi() {
      return <div data-testid="tab-profil" />;
    },
);
jest.mock(
  "@/components/admin/TabArtikel",
  () =>
    function MockTabArtikel() {
      return <div data-testid="tab-artikel" />;
    },
);

describe("UT-ADM-001: Pengujian Dashboard Admin", () => {
  let mockPush: jest.Mock;
  let mockGetSession: jest.Mock;
  let mockSignOut: jest.Mock;

  beforeEach(() => {
    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });

    mockGetSession = jest.fn();
    mockSignOut = jest.fn();
    (createClient as jest.Mock).mockReturnValue({
      auth: {
        getSession: mockGetSession,
        signOut: mockSignOut,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("mengarahkan pengguna ke halaman login jika sesi tidak ditemukan", async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/admin/login");
    });
  });

  it("merender dashboard jika sesi pengguna tersedia", async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: "1" } } },
    });

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.queryByText("Memuat Dashboard...")).not.toBeInTheDocument();
      expect(screen.getByText("Dashboard Admin")).toBeInTheDocument();
      expect(screen.getByTestId("tab-toko")).toBeInTheDocument();
    });
  });

  // 🎯 PENINGKATAN BESAR: Menguji semua sisa tombol tab demi jaminan 100% Coverage
  it("dapat berpindah ke semua tab navigasi admin dan merender komponen yang sesuai", async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: "1" } } },
    });

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Dashboard Admin")).toBeInTheDocument();
    });

    // 1. Klik Tab Produk (Baris penanganan reset pencarian)
    fireEvent.click(screen.getByRole("button", { name: /Kelola Produk/i }));
    expect(screen.getByTestId("tab-produk")).toBeInTheDocument();

    // 2. Klik Tab Kategori
    fireEvent.click(screen.getByRole("button", { name: /Kelola Kategori/i }));
    expect(screen.getByTestId("tab-kategori")).toBeInTheDocument();

    // 3. Klik Tab Banner
    fireEvent.click(screen.getByRole("button", { name: /Kelola Banner/i }));
    expect(screen.getByTestId("tab-banner")).toBeInTheDocument();

    // 4. Klik Tab Profil Koperasi
    fireEvent.click(screen.getByRole("button", { name: /Profil Koperasi/i }));
    expect(screen.getByTestId("tab-profil")).toBeInTheDocument();

    // 5. Klik Tab Artikel
    fireEvent.click(screen.getByRole("button", { name: /Kelola Artikel/i }));
    expect(screen.getByTestId("tab-artikel")).toBeInTheDocument();

    // 6. Kembalikan ke Tab Toko awal
    fireEvent.click(screen.getByRole("button", { name: /Kelola Toko/i }));
    expect(screen.getByTestId("tab-toko")).toBeInTheDocument();
  });

  it("menangani fungsi onViewProducts dari TabToko ke TabProduk dengan benar", async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: "1" } } },
    });

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByTestId("tab-toko")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("View Products"));

    expect(screen.getByTestId("tab-produk")).toBeInTheDocument();
  });

  it("menjalankan fungsi logout dan mengarahkan ke halaman login", async () => {
    mockGetSession.mockResolvedValue({
      data: { session: { user: { id: "1" } } },
    });
    mockSignOut.mockResolvedValue({ error: null });

    render(<AdminDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Dashboard Admin")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Keluar/i }));

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledTimes(1);
      expect(mockPush).toHaveBeenCalledWith("/admin/login");
    });
  });
});
