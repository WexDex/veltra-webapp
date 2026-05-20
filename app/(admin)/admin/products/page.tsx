"use client";

import { useState } from "react";
import Image from "next/image";
import { products as initialProducts, categories, Product } from "@/lib/mock-data";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import ProductForm from "@/components/products/ProductForm";

export default function AdminProductsPage() {
  const [productList, setProductList] = useState(initialProducts);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (p: Product) => {
    setEditing(p);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const handleSubmit = (data: Partial<Product>) => {
    if (editing?.id) {
      const cat = categories.find((c) => c.id === data.category_id);
      setProductList((prev) =>
        prev.map((p) =>
          p.id === editing.id
            ? { ...p, ...data, category: cat ?? p.category }
            : p
        )
      );
    } else {
      const cat = categories.find((c) => c.id === data.category_id) ?? categories[0];
      const newProduct: Product = {
        id: String(Date.now()),
        name: data.name ?? "",
        description: data.description ?? "",
        image_url: data.image_url ?? "",
        category_id: cat.id,
        category: cat,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setProductList((prev) => [newProduct, ...prev]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    setProductList((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Products</h1>
          <p className="text-gray-400 text-sm mt-1">
            {productList.length} products total
          </p>
        </div>
        <Button onClick={openAdd}>+ Add Product</Button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="text-left px-5 py-3.5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Added
              </th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody>
            {productList.map((product) => (
              <tr
                key={product.id}
                className="border-b border-gray-800 last:border-0 hover:bg-gray-800/30 transition-colors"
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                      {product.image_url && (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <span className="text-gray-100 font-medium text-sm">
                      {product.name}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <Badge variant="blue">{product.category.name}</Badge>
                </td>
                <td className="px-5 py-3.5 text-gray-500 text-sm">
                  {new Date(product.created_at).toLocaleDateString()}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEdit(product)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editing?.id ? "Edit Product" : "Add Product"}
      >
        <ProductForm
          product={editing ?? undefined}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
}
