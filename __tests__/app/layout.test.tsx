import { render, screen } from "@testing-library/react";
import RootLayout from "@/app/layout";

// 1. Mock komponen pihak ketiga & font agar kompatibel dengan JSDOM
jest.mock("next/font/google", () => ({
  Geist: () => ({ variable: "--font-geist-sans" }),
  Geist_Mono: () => ({ variable: "--font-geist-mono" }),
}));

jest.mock("nextjs-toploader", () => {
  return function MockNextTopLoader() {
    return <div data-testid="top-loader" />;
  };
});

jest.mock("@/components/LayoutWrapper", () => {
  return function MockLayoutWrapper({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return <div data-testid="layout-wrapper">{children}</div>;
  };
});

describe("UT-LAY-001: Pengujian Root Layout", () => {
  // Simpan referensi console.error asli
  const originalConsoleError = console.error;

  beforeAll(() => {
    // Sembunyikan console.error KHUSUS untuk peringatan <html> di dalam <div>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    console.error = (...args: any[]) => {
      // Gabungkan semua argumen menjadi satu teks agar tidak ada pesan yang terlewat
      const errorMessage = args.map(String).join(" ");

      if (
        errorMessage.includes("cannot be a child of") ||
        errorMessage.includes("hydration error") ||
        errorMessage.includes("validateDOMNesting")
      ) {
        return; // Abaikan peringatan ini
      }
      originalConsoleError(...args); // Tetap tampilkan error lainnya
    };
  });

  afterAll(() => {
    // Kembalikan console.error ke fungsi aslinya setelah pengujian selesai
    console.error = originalConsoleError;
  });

  it("merender elemen anak beserta TopLoader dan LayoutWrapper", () => {
    // ... (kode test Anda tetap sama seperti sebelumnya)
    render(
      <RootLayout>
        <div data-testid="halaman-anak">Halaman Utama</div>
      </RootLayout>,
    );

    expect(screen.getByTestId("top-loader")).toBeInTheDocument();
    expect(screen.getByTestId("layout-wrapper")).toBeInTheDocument();

    const anak = screen.getByTestId("halaman-anak");
    expect(anak).toBeInTheDocument();
    expect(anak).toHaveTextContent("Halaman Utama");
  });
});
