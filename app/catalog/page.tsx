import ProductCard from "@/components/ProductCard";

const CatalogPage = () => {
  return (
    <main>
      <section className="bg-primary px-4 md:px-16 py-16 flex flex-col gap-4 items-start">
        <h2 className="bg-gray-300 text-2xl px-2 p-1 font-bold">CATALOG</h2>
        <p className="max-w-[35ch]">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <div className="flex flex-row gap-4">
          <p className="font-display bg-gray-300 text-lg px-2 p-1 font-bold ">
            Kategori
          </p>
          <p className="font-display bg-gray-300 text-lg px-2 p-1 font-bold ">
            Kategori
          </p>
          <p className="font-display bg-gray-300 text-lg px-2 p-1 font-bold ">
            Kategori
          </p>
        </div>
      </section>
      <section className="flex flex-col items-center gap-4 px-4 py-8 md:p-16">
        <h2 className="bg-primary text-2xl px-2 p-1 font-bold rounded-lg outline-2 outline-foreground">
          PRODUK TERLARIS
        </h2>

        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* <ProductCard />
          <ProductCard />
          <ProductCard />
          <ProductCard /> */}
        </div>
      </section>
    </main>
  );
};

export default CatalogPage;
