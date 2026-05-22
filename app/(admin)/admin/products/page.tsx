"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import ProductForm from "@/components/products/ProductForm";
import { DbProduct, DbCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function AdminProductsPage() {
  const [productList, setProductList] = useState<DbProduct[]>([]);
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<DbProduct> | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const fetchProducts = () => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => { setProductList(data); setLoading(false); });
  };

  useEffect(() => {
    fetchProducts();
    fetch("/api/categories").then((r) => r.json()).then(setCategories);
  }, []);

  const openAdd = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (p: DbProduct) => { setEditing(p); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditing(null); };

  const handleSubmit = async (data: Partial<DbProduct>) => {
    if (editing?.id) {
      await fetch(`/api/products/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    closeModal();
    fetchProducts();
  };

  const handleDelete = async (id: number) => {
    setDeleteConfirm(null);
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    fetchProducts();
  };

  const filtered = productList.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === null || p.category_id === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Products</h1>
          <p className="text-gray-400 text-sm mt-1">{filtered.length} of {productList.length} products</p>
        </div>
        <Button onClick={openAdd}>+ Add Product</Button>
      </div>

      {/* Search */}
      <div className="mb-5 max-w-sm">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <button
          onClick={() => setActiveCategory(null)}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer",
            activeCategory === null
              ? "bg-blue-700 text-white"
              : "bg-gray-800 text-gray-400 hover:text-gray-100"
          )}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer",
              activeCategory === cat.id
                ? "bg-blue-700 text-white"
                : "bg-gray-800 text-gray-400 hover:text-gray-100"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-gray-500 py-16 text-sm">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-sm">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((product) => (
            <div key={product.id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col">
              <div className="relative aspect-video bg-gray-800">
                {product.image_url ? (
                  <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-4 flex flex-col flex-1 gap-2">
                <div>
                  <Badge variant="blue" className="mb-2">{product.category.name}</Badge>
                  <h3 className="text-sm font-semibold text-gray-100 leading-snug">{product.name}</h3>
                  {product.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-auto pt-2">
                  Added {new Date(product.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2 px-4 pb-4">
                <Button variant="ghost" size="sm" onClick={() => openEdit(product)} className="flex-1">Edit</Button>
                {deleteConfirm === product.id ? (
                  <div className="flex gap-1 flex-1">
                    <Button variant="danger" size="sm" onClick={() => handleDelete(product.id)} className="flex-1">Confirm</Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(null)}>✕</Button>
                  </div>
                ) : (
                  <Button variant="danger" size="sm" onClick={() => setDeleteConfirm(product.id)} className="flex-1">Delete</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={closeModal} title={editing?.id ? "Edit Product" : "Add Product"}>
        <ProductForm product={editing ?? undefined} onSubmit={handleSubmit} onCancel={closeModal} />
      </Modal>
    </div>
  );
}
