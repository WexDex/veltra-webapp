import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Badge from "@/components/ui/Badge";
import { DbProduct } from "@/lib/types";
import { prisma } from "@/lib/db";

async function getProduct(id: string): Promise<DbProduct | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
      include: { category: true },
    });
    return product as unknown as DbProduct | null;
  } catch {
    return null;
  }
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <Link
        href="/catalogue"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-100 text-sm font-medium transition-colors mb-10"
      >
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
            clipRule="evenodd"
          />
        </svg>
        Back to Catalogue
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-gray-900">
          {product.image_url && (
            <Image src={product.image_url} alt={product.name} fill className="object-cover" />
          )}
        </div>

        <div className="flex flex-col justify-center gap-6">
          <div>
            <Badge variant="blue" className="mb-3">
              {product.category.name}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-100 leading-tight mb-4">
              {product.name}
            </h1>
            <p className="text-gray-400 leading-relaxed text-base">{product.description}</p>
          </div>

          <div className="h-px bg-gray-800" />

          <p className="text-sm text-gray-500">
            Added{" "}
            {new Date(product.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-medium transition-colors w-full sm:w-auto"
          >
            Enquire About This Product
          </Link>
        </div>
      </div>
    </div>
  );
}
