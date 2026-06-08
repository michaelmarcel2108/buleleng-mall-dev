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
      
      {/* HERO SECTION PROFIL (Menggunakan Aksen Biru PLUT) */}
      <section className="bg-neutral-900 text-white py-20 px-6 border-b-4 border-[#407d99]">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-neutral-400 font-bold text-xs tracking-widest uppercase mb-3 block">Mengenal Lebih Dekat</span>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            Profil <span className="text-white">Instansi</span>
          </h1>
          <p className="text-base md:text-lg text-neutral-400 max-w-2xl mx-auto font-medium">
            Informasi lengkap mengenai visi, misi, tugas pokok, susunan pegawai, hingga standar pelayanan informasi publik di PLUT Kabupaten Buleleng.
          </p>
        </div>
      </section>

      {/* CONTAINER UTAMA: Diperlebar menjadi max-w-[85rem] dan Gap Diperkecil */}
      <main className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
        
        {/* STICKY SIDEBAR NAVIGATION: Dibuat lebih ramping (w-60) dan rapat ke kiri */}
        <aside className="w-full md:w-60 shrink-0 md:sticky top-28 bg-white p-5 rounded-2xl shadow-sm border border-neutral-100 hidden md:block">
          <h3 className="font-extrabold text-xs text-neutral-400 uppercase tracking-wider mb-3 border-b border-neutral-100 pb-2">Daftar Isi Profil</h3>
          <nav className="space-y-1 text-sm font-bold">
            <a href="#sambutan" className="block py-2 px-2.5 rounded-lg text-neutral-600 hover:text-[#407d99] hover:bg-neutral-50 transition-all">Sambutan Kepala Dinas</a>
            <a href="#profil-dinas" className="block py-2 px-2.5 rounded-lg text-neutral-600 hover:text-[#407d99] hover:bg-neutral-50 transition-all">Profil Dinas</a>
            <a href="#tupoksi" className="block py-2 px-2.5 rounded-lg text-neutral-600 hover:text-[#407d99] hover:bg-neutral-50 transition-all">Tugas Pokok & Fungsi</a>
            <a href="#data-pegawai" className="block py-2 px-2.5 rounded-lg text-neutral-600 hover:text-[#407d99] hover:bg-neutral-50 transition-all">Data Pegawai & Konsultan</a>
            <a href="#maklumat-motto" className="block py-2 px-2.5 rounded-lg text-neutral-600 hover:text-[#407d99] hover:bg-neutral-50 transition-all">Maklumat & Motto</a>
            
            <div className="pt-3 mt-3 border-t border-neutral-100">
              <span className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest mb-2 block px-2">Layanan PPID</span>
              <a href="#tata-cara" className="block py-2 px-2.5 rounded-lg text-neutral-600 hover:text-[#407d99] hover:bg-neutral-50 transition-all">Tata Cara Pemeriksaan</a>
              <a href="#saluran-informasi" className="block py-2 px-2.5 rounded-lg text-neutral-600 hover:text-[#407d99] hover:bg-neutral-50 transition-all">Saluran & Pengaduan</a>
              <a href="#prosedur" className="block py-2 px-2.5 rounded-lg text-neutral-600 hover:text-[#407d99] hover:bg-neutral-50 transition-all">Prosedur Permintaan</a>
            </div>
          </nav>
        </aside>

        {/* KONTEN UTAMA: Area Ruang Dibuat Lebih Luas (flex-grow) */}
        <div className="flex-grow w-full space-y-20 bg-white p-6 md:p-10 lg:p-12 rounded-3xl shadow-sm border border-neutral-100">
          
          {/* 1. SAMBUTAN KEPALA DINAS */}
          <section id="sambutan" className="scroll-mt-32">
            <h2 className="text-2xl md:text-3xl font-black text-neutral-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#407d99]/10 text-[#407d99] flex items-center justify-center text-sm font-bold">1</span>
              Sambutan Kepala Dinas
            </h2>
            <div className="flex flex-col sm:flex-row gap-8 items-start">
              <div className="shrink-0 w-44 h-70  rounded-2xl overflow-hidden relative  ">
                <Image src="/fotokadis.jpg" alt="Foto Kepala Dinas" fill className="object-cover" />
              </div>
              <div className="prose prose-neutral text-neutral-600 text-sm md:text-base leading-relaxed font-medium">
                <p className="font-bold text-lg text-neutral-900 mb-2">Om Swastiastu,</p>
                <p>
                  Selamat datang di portal resmi Pusat Layanan Usaha Terpadu (PLUT) Kabupaten Buleleng. Kita hadir sebagai wujud nyata komitmen pemerintah daerah dalam mendukung kebangkitan, kemandirian, dan daya saing Koperasi dan UMKM di Bumi Panji Sakti.
                </p>
                <p className="mt-3">
                  Melalui portal digital ini, diharapkan masyarakat dan pelaku usaha dapat mengakses informasi, regulasi, dan layanan pendampingan dengan lebih cepat, transparan, dan terintegrasi.
                </p>
                <p className=" text-neutral-900 mt-6 border-t border-neutral-100 pt-4 inline-block">
                  <b>Drs. DEWA MADE SUDIARTA, M.Si </b> <br/>
                  Kepala Dinas DagperinkopUKM Kab. Buleleng
                </p>
              </div>
            </div>
          </section>

          {/* 2 & 3. PROFIL DINAS & TUPOKSI */}
          <section id="profil-dinas" className="scroll-mt-32">
            <h2 className="text-2xl md:text-3xl font-black text-neutral-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#407d99]/10 text-[#407d99] flex items-center justify-center text-sm font-bold">2</span>
              Profil Dinas & Tupoksi
            </h2>
            <div className="prose prose-neutral max-w-none text-neutral-600 text-sm md:text-base leading-relaxed font-medium space-y-6">
              <div>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">Profil Singkat</h3>
                <p>
                  PLUT KUMKM Kabupaten Buleleng adalah lembaga penyedia jasa non-finansial yang menyeluruh dan terintegrasi bagi koperasi dan usaha mikro, kecil, dan menengah untuk meningkatkan kinerja produksi, kinerja pemasaran, akses ke pembiayaan, pengembangan SDM, serta penataan kelembagaan.
                </p>
              </div>
              
              <span id="tupoksi" className="scroll-mt-32 block"></span>
              
              <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100">
                <h3 className="text-lg font-bold text-neutral-900 mb-3">Tugas Pokok & Fungsi (Tupoksi)</h3>
                <ul className="list-disc pl-5 space-y-2.5 text-neutral-600">
                  <li>Menyelenggarakan layanan konsultasi bisnis dan pendampingan usaha rakyat.</li>
                  <li>Memfasilitasi akses pembiayaan dan kemitraan strategis bagi UMKM.</li>
                  <li>Meningkatkan kualitas sumber daya manusia pelaku usaha melalui pelatihan berkelanjutan.</li>
                  <li>Membantu proses legalitas, perizinan, dan sertifikasi produk (NIB, PIRT, Halal).</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 4. DATA PEGAWAI */}
          <section id="data-pegawai" className="scroll-mt-32">
            <h2 className="text-2xl md:text-3xl font-black text-neutral-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#407d99]/10 text-[#407d99] flex items-center justify-center text-sm font-bold">3</span>
              Data Pegawai & Konsultan
            </h2>
            <div className="overflow-x-auto rounded-xl border border-neutral-200 shadow-sm">
              <table className="w-full text-left text-sm">
                <thead className="bg-neutral-50 text-neutral-700 border-b border-neutral-200">
                  <tr>
                    <th className="px-6 py-4 font-bold text-neutral-900">Nama Pegawai</th>
                    <th className="px-6 py-4 font-bold text-neutral-900">Jabatan / Bidang Pendampingan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-600 font-medium">
                  <tr className="hover:bg-neutral-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-neutral-900">I Putu Contoh Nama, S.E.</td>
                    <td className="px-6 py-4">Konsultan Bidang Pemasaran & Digital</td>
                  </tr>
                  <tr className="hover:bg-neutral-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-neutral-900">Ni Made Data Pegawai, S.H.</td>
                    <td className="px-6 py-4">Konsultan Bidang Kelembagaan & Legalitas</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 5 & 6. MAKLUMAT & MOTTO PELAYANAN */}
          <section id="maklumat-motto" className="scroll-mt-32">
            <h2 className="text-2xl md:text-3xl font-black text-neutral-900 mb-6 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#407d99]/10 text-[#407d99] flex items-center justify-center text-sm font-bold">4</span>
              Maklumat & Motto Pelayanan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#407d99]/5 p-6 rounded-2xl border border-[#407d99]/10">
                <h3 className="font-extrabold text-foreground text-base mb-2">Maklumat Pelayanan</h3>
                <p className="text-black italic text-sm leading-relaxed font-medium">
                  "Sanggup menyelenggarakan pelayanan sesuai standar pelayanan yang telah ditetapkan dan apabila tidak menepati janji ini, kita siap menerima sanksi sesuai peraturan perundang-undangan yang berlaku."
                </p>
              </div>
              <div className="bg-[#407d99]/5 p-6 rounded-2xl border border-[#407d99]/10">
                <h3 className="font-extrabold text-[#407d99] text-base mb-2">Motto Pelayanan</h3>
                <p className="text-neutral-800 font-black text-xl lg:text-2xl leading-tight tracking-tight">
                  "Melayani dengan HATI (Handal, Akuntabel, Transparan, Inovatif)"
                </p>
              </div>
            </div>
          </section>

          {/* 7, 8, 9, 10. PPID & INFORMASI PUBLIK */}
          <section id="tata-cara" className="scroll-mt-32 border-t border-neutral-100 pt-12">
            <div className="mb-8">
              <span className="text-[#407d99] font-extrabold text-xs uppercase tracking-widest block mb-2">Layanan Transparansi PPID</span>
              <h2 className="text-2xl md:text-3xl font-black text-neutral-900">Pusat Informasi Publik</h2>
            </div>
            
            <div className="space-y-10 prose prose-neutral max-w-none text-neutral-600 text-sm md:text-base font-medium">
              
              <div>
                <h3 className="text-base font-bold text-neutral-900 mb-2">Tata Cara Pemeriksaan Informasi</h3>
                <p className="leading-relaxed">Masyarakat berhak meminta dan memeriksa informasi publik yang dikelola oleh PPID Dinas sesuai dengan UU Keterbukaan Informasi Publik. Pemeriksaan dapat dilakukan secara langsung di meja layanan PPID atau melalui permohonan salinan digital.</p>
              </div>

              <span id="saluran-informasi" className="scroll-mt-32 block"></span>
              <div>
                <h3 className="text-base font-bold text-neutral-900 mb-2">Saluran Informasi dan Pengaduan</h3>
                <p className="mb-3">Permohonan informasi dan pengaduan layanan dapat diajukan melalui:</p>
                <ul className="list-disc pl-5 space-y-1.5 text-neutral-600">
                  <li><strong>Tatap Muka:</strong> Meja Layanan Informasi di Gedung PLUT Buleleng.</li>
                  <li><strong>Email:</strong> disdagperinkopukm@bulelengkab.go.id</li>
                  <li><strong>Layanan Digital:</strong> Melalui portal <Link href="/plut/pengaduan" className="text-[#407d99] font-bold hover:underline">Pengaduan LAPOR!</Link></li>
                </ul>
              </div>

              <span id="prosedur" className="scroll-mt-32 block"></span>
              <div className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200/60 shadow-inner">
                <h3 className="text-base font-bold text-neutral-900 mt-0 mb-3">Prosedur Permintaan Informasi Publik</h3>
                <ol className="list-decimal pl-5 space-y-2.5 mb-0 text-neutral-600 text-sm md:text-base">
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