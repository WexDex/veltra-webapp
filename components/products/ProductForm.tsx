"use client";

import { useState, useEffect } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { DbCategory, DbProduct } from "@/lib/types";

interface ProductFormProps {
  product?: Partial<DbProduct>;
  onSubmit: (data: Partial<DbProduct>) => void;
  onCancel: () => void;
}

export default function ProductForm({ product, onSubmit, onCancel }: ProductFormProps) {
  const [categories, setCategories] = useState<DbCategory[]>([]);
  const [form, setForm] = useState({
    name: product?.name ?? "",
    description: product?.description ?? "",
    image_url: product?.image_url ?? "",
    category_id: product?.category_id ?? 0,
  });

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data: DbCategory[]) => {
        setCategories(data);
        if (!product?.category_id && data.length > 0) {
          setForm((prev) => ({ ...prev, category_id: data[0].id }));
        }
      });
  }, [product?.category_id]);

  const set = (field: string, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      <Input
        label="Product Name"
        id="name"
        value={form.name}
        onChange={(e) => set("name", e.target.value)}
        placeholder="e.g. Orion Desk Lamp"
        required
      />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="category" className="text-sm font-medium text-gray-300">
          Category
        </label>
        <select
          id="category"
          value={form.category_id}
          onChange={(e) => set("category_id", parseInt(e.target.value))}
          className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3.5 py-2.5 text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <Input
        label="Image URL"
        id="image_url"
        value={form.image_url ?? ""}
        onChange={(e) => set("image_url", e.target.value)}
        placeholder="https://..."
      />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-sm font-medium text-gray-300">
          Description
        </label>
        <textarea
          id="description"
          value={form.description ?? ""}
          onChange={(e) => set("description", e.target.value)}
          rows={3}
          placeholder="Brief product description..."
          className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3.5 py-2.5 text-gray-100 placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 resize-none"
        />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Product</Button>
      </div>
    </form>
  );
}
