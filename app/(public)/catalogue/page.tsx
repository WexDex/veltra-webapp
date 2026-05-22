"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/components/products/ProductCard";
import Input from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { DbProduct, DbCategory } from "@/lib/types";

export default function CataloguePage() {
  const [products, setProducts] = useState<DbProduct[]>([]);
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/products").then((r) => r.json()).then(setProducts);
    fetch("/api/categories").then((r) => r.json()).then(setCategories);
  }, []);

  const filtered = products.filter((p) => {
    const matchCat = !activeCategory || p.category_id === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">Product Catalogue</h1>
        <p className="text-gray-400">Browse our full range of products.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="w-full sm:max-w-xs">
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer",
              !activeCategory ? "bg-blue-700 text-white" : "bg-gray-800 text-gray-400 hover:text-gray-100"
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer",
                activeCategory === cat.id ? "bg-blue-700 text-white" : "bg-gray-800 text-gray-400 hover:text-gray-100"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-gray-500 text-lg">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
