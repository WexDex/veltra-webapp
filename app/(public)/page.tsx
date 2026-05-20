import Link from "next/link";
import { FEATURED_PRODUCTS } from "@/lib/mock-data";
import ProductCard from "@/components/products/ProductCard";
import VeltraLogo from "@/components/ui/VeltraLogo";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="min-h-[85vh] flex flex-col items-center justify-center text-center px-6 py-32">
        <div className="mb-8 p-4 rounded-2xl bg-blue-700/10 border border-blue-700/20 inline-flex">
          <VeltraLogo size={40} />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-gray-100 mb-6 tracking-tight leading-none">
          Veltra
        </h1>
        <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-xl leading-relaxed">
          Discover what we make.{" "}
          <span className="text-gray-300">
            Built for the people who care.
          </span>
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/catalogue"
            className="px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-medium transition-colors"
          >
            Browse Catalogue
          </Link>
          <Link
            href="/about"
            className="px-6 py-3 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-600 font-medium transition-colors"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-6 pb-32 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-100">
              Featured Products
            </h2>
            <p className="text-gray-400 text-sm mt-1">Our most popular picks</p>
          </div>
          <Link
            href="/catalogue"
            className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {FEATURED_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
