import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  MessageCircle, 
  Check, 
  Minus, 
  Plus, 
  ShieldCheck, 
  Sparkles, 
  Droplet, 
  Wind, 
  Layers,
  Flame
} from 'lucide-react';
import { Product } from '../types';
import { formatCurrency, getWhatsAppProductUrl, StorageService } from '../services/storageService';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, size: string) => void;
  whatsappNumber?: string;
  companyName?: string;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  whatsappNumber,
  companyName
}) => {
  if (!product) return null;

  const settings = StorageService.getSettings();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>(
    product.availableSizes && product.availableSizes.length > 0
      ? product.availableSizes[0]
      : product.size
  );
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedSize);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 900);
  };

  const handleWhatsAppInquiry = () => {
    const url = getWhatsAppProductUrl(product.name, settings);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-white border border-gray-200 shadow-2xl p-6 sm:p-8 text-left">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Big Product Image */}
          <div className="md:col-span-6 space-y-4">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {product.isPromo && (
                  <span className="px-3 py-1 rounded-full bg-red-600 text-white text-xs font-bold uppercase tracking-wider shadow-md">
                    {product.promoDiscountPercent ? `${product.promoDiscountPercent}% OFF` : 'PROMOCIÓN'}
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="px-3 py-1 rounded-full bg-gray-900 text-white text-xs font-extrabold uppercase tracking-wider shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    Más Elegido en Córdoba
                  </span>
                )}
              </div>

              <div className="absolute bottom-3 right-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  product.inStock 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}>
                  {product.inStock ? `Stock Disponible (${product.stockCount} u.)` : 'Sin Stock'}
                </span>
              </div>
            </div>

            {/* Quality badge footer */}
            <div className="grid grid-cols-3 gap-2 text-center text-[11px] text-gray-600">
              <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                <ShieldCheck className="w-4 h-4 text-red-600 mx-auto mb-1" />
                <span>Esencia Pura</span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                <Droplet className="w-4 h-4 text-red-600 mx-auto mb-1" />
                <span>+12hs Fijación</span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                <Wind className="w-4 h-4 text-red-600 mx-auto mb-1" />
                <span>Gran Difusión</span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Info & Purchase Options */}
          <div className="md:col-span-6 space-y-5">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-red-600 block mb-1">
                {product.categoryName} • Rinoxpress Córdoba
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950">
                {product.name}
              </h2>
              <p className="text-sm font-semibold text-gray-700 mt-1">
                Fragancia: <span className="text-red-600 font-bold">{product.fragrance}</span>
              </p>
              {product.olfactoryFamily && (
                <span className="inline-block mt-2 px-2.5 py-0.5 rounded-md bg-gray-100 text-xs font-semibold text-gray-700 border border-gray-200">
                  Familia Olfativa: {product.olfactoryFamily}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Descripción del Producto</span>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Olfactory Notes if Available */}
            {product.notes && (
              <div className="space-y-1.5 text-xs">
                <span className="font-bold text-gray-700 uppercase tracking-wide block">Pirámide Olfativa:</span>
                <div className="grid grid-cols-3 gap-2">
                  {product.notes.top && (
                    <div className="p-2 rounded-xl bg-gray-50 border border-gray-200">
                      <span className="text-[10px] text-gray-500 block uppercase">Salida</span>
                      <span className="font-medium text-gray-800">{product.notes.top}</span>
                    </div>
                  )}
                  {product.notes.heart && (
                    <div className="p-2 rounded-xl bg-gray-50 border border-gray-200">
                      <span className="text-[10px] text-gray-500 block uppercase">Cuerpo</span>
                      <span className="font-medium text-gray-800">{product.notes.heart}</span>
                    </div>
                  )}
                  {product.notes.base && (
                    <div className="p-2 rounded-xl bg-gray-50 border border-gray-200">
                      <span className="text-[10px] text-gray-500 block uppercase">Fondo</span>
                      <span className="font-medium text-gray-800">{product.notes.base}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Size selector if options */}
            {product.availableSizes && product.availableSizes.length > 1 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block">
                  Seleccionar Presentación / Tamaño:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.availableSizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        selectedSize === sz
                          ? 'bg-red-600 text-white border-red-600 shadow-sm'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-red-300'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price section */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-3xl font-extrabold text-gray-950">
                {formatCurrency(product.price * quantity)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-400 line-through font-medium">
                  {formatCurrency(product.originalPrice * quantity)}
                </span>
              )}
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-700 uppercase">Cantidad:</span>
                <div className="flex items-center border border-gray-300 rounded-xl bg-white p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-10 text-center text-xs font-bold text-gray-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                    !product.inStock
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : addedAnimation
                      ? 'bg-emerald-600 text-white scale-95'
                      : 'bg-red-600 hover:bg-red-700 active:scale-95 text-white shadow-red-500/25'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>¡Agregado al Pedido!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Agregar al Pedido</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleWhatsAppInquiry}
                  className="py-3.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600/20" />
                  <span>CONSULTAR POR WHATSAPP</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
