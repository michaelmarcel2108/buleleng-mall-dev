import Image from "next/image";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Profil Instansi - PLUT Buleleng",
  description: "Profil, Tupoksi, Maklumat Pelayanan, dan Prosedur Informasi Publik Dinas PPID PLUT Buleleng.",
};

export default function ProfilPage() {
  return (
    <div className="min-h-screen bg-neutral-50 font-sans">
      
      {/* HERO SECTION PROFIL */}
      <section className="bg-neutral-900 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-[#FF3C00] font-bold text-sm tracking-widest uppercase mb-3 block">Mengenal Lebih Dekat</span>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Profil <span className="text-[#FF3C00]">Instansi</span>
          </h1>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Informasi lengkap mengenai visi, misi, tugas pokok, susunan pegawai, hingga standar pelayanan informasi publik di PLUT Kabupaten Buleleng.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row gap-12 items-start">
        
        {/* STICKY SIDEBAR NAVIGATION */}
        <aside className="w-full md:w-72 shrink-0 md:sticky top-28 bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 hidden md:block">
          <h3 className="font-extrabold text-neutral-900 mb-4 border-b border-neutral-100 pb-2">Daftar Isi Profil</h3>
          <nav className="space-y-1.5 text-sm font-semibold">
            <a href="#sambutan" className="block py-2 text-neutral-600 hover:text-[#FF3C00] transition-colors">Sambutan Kepala Dinas</a>
            <a href="#profil-dinas" className="block py-2 text-neutral-600 hover:text-[#FF3C00] transition-colors">Profil Dinas</a>
            <a href="#tupoksi" className="block py-2 text-neutral-600 hover:text-[#FF3C00] transition-colors">Tugas Pokok & Fungsi (Tupoksi)</a>
            <a href="#data-pegawai" className="block py-2 text-neutral-600 hover:text-[#FF3C00] transition-colors">Data Pegawai</a>
            <a href="#maklumat-motto" className="block py-2 text-neutral-600 hover:text-[#FF3C00] transition-colors">Maklumat & Motto Pelayanan</a>
            <div className="pt-2 mt-2 border-t border-neutral-100">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 block">Layanan PPID</span>
              <a href="#tata-cara" className="block py-2 text-neutral-600 hover:text-[#FF3C00] transition-colors">Tata Cara Pemeriksaan</a>
              <a href="#saluran-informasi" className="block py-2 text-neutral-600 hover:text-[#FF3C00] transition-colors">Saluran & Pengaduan</a>
              <a href="#prosedur" className="block py-2 text-neutral-600 hover:text-[#FF3C00] transition-colors">Prosedur Permintaan Publik</a>
            </div>
          </nav>
        </aside>

        {/* KONTEN UTAMA */}
        <div className="flex-grow space-y-20 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-neutral-100">
          
          {/* 1. SAMBUTAN KEPALA DINAS */}
          <section id="sambutan" className="scroll-mt-32">
            <h2 className="text-3xl font-extrabold text-neutral-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#FF3C00]/10 text-[#FF3C00] flex items-center justify-center text-sm">1</span>
              Sambutan Kepala Dinas
            </h2>
            <div className="flex flex-col sm:flex-row gap-8 items-start">
              <div className="shrink-0 w-48 h-64 bg-neutral-200 rounded-2xl overflow-hidden relative border border-neutral-100">
                <Image src="/hero-image.jpeg" alt="Foto Kepala Dinas" fill className="object-cover" />
              </div>
              <div className="prose prose-neutral text-neutral-600">
                <p className="font-bold text-lg text-neutral-900 mb-2">Om Swastiastu,</p>
                <p>
                  Selamat datang di portal resmi Pusat Layanan Usaha Terpadu (PLUT) Kabupaten Buleleng. Kami hadir sebagai wujud nyata komitmen pemerintah daerah dalam mendukung kebangkitan, kemandirian, dan daya saing Koperasi dan UMKM di Bumi Panji Sakti.
                </p>
                <p>
                  Melalui portal digital ini, diharapkan masyarakat dan pelaku usaha dapat mengakses informasi, regulasi, dan layanan pendampingan dengan lebih cepat, transparan, dan terintegrasi.
                </p>
                <p className="font-bold text-neutral-900 mt-4">Kepala Dinas DagperinkopUKM Kab. Buleleng</p>
              </div>
            </div>
          </section>

          {/* 2 & 3. PROFIL DINAS & TUPOKSI */}
          <section id="profil-dinas" className="scroll-mt-32">
            <h2 className="text-3xl font-extrabold text-neutral-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#FF3C00]/10 text-[#FF3C00] flex items-center justify-center text-sm">2</span>
              Profil Dinas & Tupoksi
            </h2>
            <div className="prose prose-neutral max-w-none text-neutral-600">
              <h3 className="text-xl font-bold text-neutral-900">Profil Singkat</h3>
              <p>
                PLUT KUMKM Kabupaten Buleleng adalah lembaga penyedia jasa non-finansial yang menyeluruh dan terintegrasi bagi koperasi dan usaha mikro, kecil, dan menengah untuk meningkatkan kinerja produksi, kinerja pemasaran, akses ke pembiayaan, pengembangan SDM, serta penataan kelembagaan.
              </p>
              <span id="tupoksi" className="scroll-mt-32 block"></span>
              <h3 className="text-xl font-bold text-neutral-900 mt-8">Tugas Pokok & Fungsi (Tupoksi)</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Menyelenggarakan layanan konsultasi bisnis dan pendampingan usaha.</li>
                <li>Memfasilitasi akses pembiayaan dan kemitraan bagi UMKM.</li>
                <li>Meningkatkan kualitas sumber daya manusia pelaku usaha melalui pelatihan.</li>
                <li>Membantu proses legalitas, perizinan, dan sertifikasi produk (NIB, PIRT, Halal).</li>
              </ul>
            </div>
          </section>

          {/* 4. DATA PEGAWAI */}
          <section id="data-pegawai" className="scroll-mt-32">
            <h2 className="text-3xl font-extrabold text-neutral-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#FF3C00]/10 text-[#FF3C00] flex items-center justify-center text-sm">3</span>
              Data Pegawai & Konsultan
            </h2>
            <div className="overflow-x-auto rounded-xl border border-neutral-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-neutral-50 text-neutral-700">
                  <tr>
                    <th className="px-6 py-4 font-bold">Nama Pegawai</th>
                    <th className="px-6 py-4 font-bold">Jabatan / Bidang Pendampingan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-600">
                  <tr className="hover:bg-neutral-50">
                    <td className="px-6 py-4 font-semibold text-neutral-900">I Putu Contoh Nama, S.E.</td>
                    <td className="px-6 py-4">Konsultan Bidang Pemasaran & Digital</td>
                  </tr>
                  <tr className="hover:bg-neutral-50">
                    <td className="px-6 py-4 font-semibold text-neutral-900">Ni Made Data Pegawai, S.H.</td>
                    <td className="px-6 py-4">Konsultan Bidang Kelembagaan & Legalitas</td>
                  </tr>
                  {/* Tambahkan data pegawai lainnya di sini */}
                </tbody>
              </table>
            </div>
          </section>

          {/* 5 & 6. MAKLUMAT & MOTTO PELAYANAN */}
          <section id="maklumat-motto" className="scroll-mt-32">
            <h2 className="text-3xl font-extrabold text-neutral-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#FF3C00]/10 text-[#FF3C00] flex items-center justify-center text-sm">4</span>
              Maklumat & Motto Pelayanan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                <h3 className="font-extrabold text-amber-900 text-lg mb-3">Maklumat Pelayanan</h3>
                <p className="text-amber-800 italic text-sm leading-relaxed">
                  "Sanggup menyelenggarakan pelayanan sesuai standar pelayanan yang telah ditetapkan dan apabila tidak menepati janji ini, kami siap menerima sanksi sesuai peraturan perundang-undangan yang berlaku."
                </p>
              </div>
              <div className="bg-[#FF3C00]/5 p-6 rounded-2xl border border-[#FF3C00]/10">
                <h3 className="font-extrabold text-[#FF3C00] text-lg mb-3">Motto Pelayanan</h3>
                <p className="text-neutral-800 font-bold text-2xl leading-tight">
                  "Melayani dengan HATI (Handal, Akuntabel, Transparan, Inovatif)"
                </p>
              </div>
            </div>
          </section>

          {/* 7, 8, 9, 10. PPID & INFORMASI PUBLIK */}
          <section id="tata-cara" className="scroll-mt-32 border-t border-neutral-200 pt-12">
            <div className="mb-8">
              <span className="text-[#FF3C00] font-bold text-xs uppercase tracking-widest block mb-2">Layanan Transparansi PPID</span>
              <h2 className="text-3xl font-extrabold text-neutral-900">Pusat Informasi Publik</h2>
            </div>
            
            <div className="space-y-10 prose prose-neutral max-w-none text-neutral-600">
              
              <div>
                <h3 className="text-lg font-bold text-neutral-900">Tata Cara Pemeriksaan Informasi</h3>
                <p>Masyarakat berhak meminta dan memeriksa informasi publik yang dikelola oleh PPID Dinas sesuai dengan UU Keterbukaan Informasi Publik. Pemeriksaan dapat dilakukan secara langsung di meja layanan PPID atau melalui permohonan salinan digital.</p>
              </div>

              <span id="saluran-informasi" className="scroll-mt-32 block"></span>
              <div>
                <h3 className="text-lg font-bold text-neutral-900">Saluran Informasi dan Pengaduan</h3>
                <p>Permohonan informasi dan pengaduan layanan dapat diajukan melalui:</p>
                <ul className="list-disc pl-5">
                  <li><strong>Tatap Muka:</strong> Meja Layanan Informasi di Gedung PLUT Buleleng.</li>
                  <li><strong>Email:</strong> disdagperinkopukm@bulelengkab.go.id</li>
                  <li><strong>Layanan Digital:</strong> Melalui portal <Link href="/plut/pengaduan" className="text-[#FF3C00] font-bold hover:underline">Pengaduan LAPOR!</Link></li>
                </ul>
              </div>

              <span id="prosedur" className="scroll-mt-32 block"></span>
              <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200">
                <h3 className="text-lg font-bold text-neutral-900 mt-0">Prosedur Permintaan Informasi Publik</h3>
                <ol className="list-decimal pl-5 space-y-2 mb-0">
                  <li>Pemohon mengisi formulir permohonan informasi publik dengan melampirkan fotokopi KTP.</li>
                  <li>Petugas PPID mencatat permohonan dalam buku register dan memberikan tanda bukti penerimaan.</li>
                  <li>PPID akan merespons permohonan paling lambat 10 (sepuluh) hari kerja, dan dapat diperpanjang 7 (tujuh) hari kerja dengan pemberitahuan tertulis.</li>
                  <li>Jika informasi yang diminta termasuk dalam kategori yang dikecualikan, PPID berhak menolak permohonan tersebut disertai alasan tertulis.</li>
                </ol>
              </div>

            </div>
          </section>

        </div>
      </main>
    </div>
  );
}