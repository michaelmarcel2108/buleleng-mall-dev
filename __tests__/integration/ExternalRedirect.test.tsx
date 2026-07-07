import { render, screen, fireEvent } from "@testing-library/react";
import ProductDescription from "@/components/ProductDescription";

describe("Integration: Rendering Deskripsi", () => {
  it("merender teks deskripsi pendek dengan benar", () => {
    render(<ProductDescription text="Ini adalah kopi robusta terbaik." />);

    expect(screen.getByText(/kopi robusta terbaik/i)).toBeInTheDocument();
    // Memastikan tombol "Lihat Selengkapnya" tidak muncul jika teks pendek
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  // 🎯 BRANCH 1: Menguji jika teks kosong (if (!text))
  it("menampilkan pesan fallback jika teks deskripsi kosong", () => {
    render(<ProductDescription text="" />);

    expect(
      screen.getByText("Tidak ada deskripsi untuk produk ini."),
    ).toBeInTheDocument();
  });

  // 🎯 BRANCH 2 & 3: Menguji teks panjang (> 150 karakter) & interaksi tombol toggle (Baris 31)
  it("memotong teks yang sangat panjang dan dapat di-expand/collapse oleh user", () => {
    const teksPanjang =
      "Kopi Robusta Pupuan Bali asli yang dipetik langsung oleh petani lokal dari lereng gunung. Memiliki aroma cokelat yang kuat, body yang tebal, keasaman rendah, serta rasa manis alami yang tertinggal di lidah setelah diminum. Sangat cocok untuk menemani pagi hari Anda yang produktif.";

    render(<ProductDescription text={teksPanjang} />);

    // 1. Pastikan teks panjang terender dan tombol ekspansi muncul
    expect(screen.getByText(teksPanjang)).toBeInTheDocument();
    const toggleBtn = screen.getByRole("button", {
      name: /Lihat Selengkapnya/i,
    });
    expect(toggleBtn).toBeInTheDocument();

    // 2. Simulasikan klik untuk membuka seluruh deskripsi (isExpanded = true)
    fireEvent.click(toggleBtn);
    expect(
      screen.getByRole("button", { name: /Tutup Deskripsi/i }),
    ).toBeInTheDocument();

    // 3. Simulasikan klik lagi untuk menutup kembali deskripsi (isExpanded = false)
    fireEvent.click(screen.getByRole("button", { name: /Tutup Deskripsi/i }));
    expect(
      screen.getByRole("button", { name: /Lihat Selengkapnya/i }),
    ).toBeInTheDocument();
  });
});
