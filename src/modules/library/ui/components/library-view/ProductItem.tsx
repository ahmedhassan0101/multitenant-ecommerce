import { formatCurrency, generateTenantURL } from "@/lib/utils";
import { Media, Product, Tenant } from "@/payload-types";
import { PackageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { RichText } from "@payloadcms/richtext-lexical/react";
interface ProductItemProps {
  product: Product;
}

export const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const image = product.image as Media;
  const tenant = product.tenant as Tenant;
  return (
    <Link href={`${generateTenantURL(tenant.slug)}/products/${product.id}`}>
      <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors duration-200">
        {/* Product Image */}
        <div className="relative w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
          {image ? (
            <Image
              src={image?.url ?? ""}
              alt={image.alt || product.name}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <PackageIcon className="w-6 h-6 text-gray-400" />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <h5 className="font-medium text-gray-900 truncate mb-1">
            {product.name}
          </h5>
          {product.description && (
            <p className="text-sm text-gray-500 truncate">
              {/* {product.description} */}
              <RichText data={product.description} />
            </p>
          )}
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm font-medium text-gray-900">
              {formatCurrency(product.price)}
            </span>
            <span className="text-xs text-gray-500">by {tenant.name}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
