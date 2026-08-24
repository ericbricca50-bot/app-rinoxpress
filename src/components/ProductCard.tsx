import React, { useState } from 'react';
import { Plus, Check, Sparkles, MessageCircle, Eye, Tag } from 'lucide-react';
import { Product } from '../types';
import { formatCurrency, getWhatsAppProductUrl, StorageService } from '../services/storageService';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product, size?: string) => void;
  onViewDetail: (product: Product) => void;
  whatsappNumber?: string;
  companyName?: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onViewDetail,
  whatsappNumber,
  companyName
}) => {
  const [addedAnimation, setAddedAnimation] = useState(false);
  const settings = StorageService.getSettings();

  const [selectedSize] = useState<string>(
    product.availableSizes && product.availableSizes.length > 0
      ? product.availableSizes[0]
      : product.size
  );

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedSize);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleQuickWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = getWhatsAppProductUrl(product.name, settings);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      onClick={() => onViewDetail(product)}
      className="group relative flex flex-col rounded-3xl bg-white border border-gray-200 hover:border-red-500 shadow-xs hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
    >
      {/* Product Image Box */}
      <div className="relative aspect-[4/3] sm:aspect-square w-full overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <div className="flex flex-wrap gap-1.5">
            {product.isPromo && (
              <span className="px-2.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                {product.promoDiscountPercent ? `${product.promoDiscountPercent}% OFF` : 'PROMO'}
              </span>
            )}
            {product.isBestSeller && (
              <span className="px-2.5 py-0.5 rounded-full bg-gray-900 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                Top Ventas
              </span>
            )}
          </div>

          {/* Stock badge */}
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              product.inStock
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}
          >
            {product.inStock ? 'Disponible' : 'Agotado'}
          </span>
        </div>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[1px] gap-2">
          <span className="px-3.5 py-1.5 rounded-xl bg-white text-gray-900 text-xs font-bold shadow-md flex items-center gap-1.5 border border-gray-200">
            <Eye className="w-3.5 h-3.5 text-red-600" />
            Ver Detalles
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category & Olfactory Family */}
          <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
            <span className="uppercase tracking-wider font-bold text-red-600">
              {product.categoryName}
            </span>
            <span className="bg-gray-100 px-2 py-0.5 rounded-md font-medium text-gray-700">
              {product.size}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="text-base font-bold text-gray-950 group-hover:text-red-600 transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Scent / Fragrance */}
          <p className="text-xs text-gray-600 line-clamp-1 mt-1 font-medium italic">
            Aroma: <span className="text-gray-900 not-italic font-semibold">{product.fragrance}</span>
          </p>

          {/* Olfactory family tag */}
          {product.olfactoryFamily && (
            <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-[10px] text-gray-700 border border-gray-200">
              <Tag className="w-2.5 h-2.5 text-red-600" />
              <span>Familia: {product.olfactoryFamily}</span>
            </div>
          )}
        </div>

        {/* Price & Actions Bottom Container */}
        <div className="pt-2 border-t border-gray-100">
          {/* Price line */}
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg sm:text-xl font-extrabold text-gray-950">
              {formatCurrency(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through font-medium">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              {/* WhatsApp Consult Button */}
              <button
                onClick={handleQuickWhatsApp}
                className="py-2.5 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-extrabold text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                title="Consultar por WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600/20" />
                <span className="truncate">CONSULTAR WHATSAPP</span>
              </button>

              {/* Add to Cart Button */}
              <button
                onClick={handleAdd}
                disabled={!product.inStock}
                className={`py-2.5 px-2 rounded-xl font-extrabold text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer ${
                  !product.inStock
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : addedAnimation
                    ? 'bg-emerald-600 text-white scale-95'
                    : 'bg-red-600 hover:bg-red-700 active:scale-95 text-white shadow-red-500/20'
                }`}
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>¡AGREGADO!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>AGREGAR</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
