import Image from "next/image";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { DbProduct } from "@/lib/types";

export default function ProductCard({ product }: { product: DbProduct }) {
  return (
    <Link href={`/catalogue/${product.id}`} className="group block">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden transition-all duration-200 hover:border-gray-700 hover:shadow-lg hover:shadow-black/30">
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-800">
          {product.image_url && (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          )}
        </div>
        <div className="p-4 flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-gray-100 text-sm leading-snug">
              {product.name}
            </h3>
            <Badge variant="blue" className="flex-shrink-0">
              {product.category.name}
            </Badge>
          </div>
          <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
