import React from 'react';
import { Sparkles, Flame, ArrowRight, Tag, ShieldCheck, Check, ShoppingBag, ExternalLink, Info, PlusCircle, Gift } from 'lucide-react';
import { Promotion, Product } from '../types';
import { formatCurrency, OFFICIAL_STORE_URL } from '../services/storageService';

interface PromotionsViewProps {
  promotions: Promotion[];
  products: Product[];
  onAddToCart: (product: Product, size?: string) => void;
  onNavigateTab: (tab: string) => void;
}

export const PromotionsView: React.FC<PromotionsViewProps> = ({
  promotions = [],
  products = [],
  onAddToCart,
  onNavigateTab
}) => {
  // Filter active promotions safely
  const safePromos = Array.isArray(promotions) ? promotions : [];
  const activePromos = safePromos.filter(p => p && p.isActive !== false);

  const handleAddPromoToCart = (promo: Promotion) => {
    // 1. Try to find matched product
    const targetId = promo.productId || (Array.isArray(promo.productIds) ? promo.productIds[0] : undefined);
    const matchedProduct = targetId ? products.find(p => p.id === targetId) : undefined;

    if (matchedProduct) {
      // Add promo product with frozen promo price
      const promoProduct: Product = {
        ...matchedProduct,
        price: promo.promoPrice || promo.finalPrice || matchedProduct.price,
        originalPrice: promo.originalPrice || matchedProduct.originalPrice,
        isPromo: true,
        promoDiscountPercent: promo.discountPercent || matchedProduct.promoDiscountPercent
      };
      onAddToCart(promoProduct, 'Set Promocional');
    } else {
      // Create a virtual promo product
      const virtualPromoProduct: Product = {
        id: promo.id || 'promo-' + Date.now(),
        name: promo.title,
        slug: (promo.title || 'promo').toLowerCase().replace(/\s+/g, '-'),
        categoryId: 'cat-combos',
        categoryName: 'Combos y Promociones',
        fragrance: 'Set Exclusivo Rinoxpress',
        olfactoryFamily: 'Amaderado',
        size: 'Set Promocional',
        availableSizes: ['Set Promocional'],
        price: promo.promoPrice || promo.finalPrice || 25000,
        originalPrice: promo.originalPrice,
        isPromo: true,
        promoDiscountPercent: promo.discountPercent || 20,
        isFeatured: true,
        isBestSeller: true,
        inStock: true,
        stockCount: 15,
        image: promo.image || promo.bannerImage || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
        description: promo.description,
        isActive: true
      };
      onAddToCart(virtualPromoProduct, 'Set Promocional');
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8 text-left bg-white min-h-[60vh]">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 p-6 sm:p-10 text-white shadow-xl">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
            <Flame className="w-4 h-4 text-white" />
            <span>Beneficios Especiales Rinoxpress</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Promociones & Sets Exclusivos
          </h1>
          <p className="text-sm sm:text-base text-red-100">
            Aprovechá nuestros combos promocionales con esencias puras, difusores y aromatizadores con descuentos directos.
          </p>
        </div>
      </div>

      {/* Official Store Promos Callout */}
      <div className="rounded-2xl bg-red-50 border border-red-200 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-red-950">🛍️ Promociones en la Tienda Oficial</h4>
            <p className="text-xs text-red-700">Comprá directamente con stock online y medios de pago oficiales.</p>
          </div>
        </div>
        <a
          href={OFFICIAL_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 shadow-sm"
        >
          <span>VER EN LA TIENDA</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Promos Grid or Empty State */}
      {activePromos.length === 0 ? (
        <div className="rounded-3xl bg-gray-50 border border-gray-200 p-12 text-center space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <Gift className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">No hay promociones activas en este momento</h3>
          <p className="text-sm text-gray-600">
            Estamos preparando nuevas ofertas especiales de temporada para vos. Podés explorar nuestro catálogo completo de fragancias.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => onNavigateTab('catalogo')}
              className="px-6 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-all cursor-pointer"
            >
              Ver Catálogo Completo
            </button>
            <button
              onClick={() => onNavigateTab('admin')}
              className="px-5 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition-all cursor-pointer"
            >
              Gestionar en Admin
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activePromos.map((promo) => {
            const promoImg = promo.image || promo.bannerImage || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80';
            const originalP = Number(promo.originalPrice || ((promo.promoPrice || promo.finalPrice || 25000) * 1.25));
            const currentP = Number(promo.promoPrice || promo.finalPrice || 25000);
            const badge = promo.discountBadge || `${promo.discountPercent || 15}% OFF`;
            const validDate = promo.expiresAt || promo.validUntil;
            const itemsIncluded = Array.isArray(promo.includedProductNames) && promo.includedProductNames.length > 0
              ? promo.includedProductNames
              : ['1x Fragancia Premium Rinoxpress', '1x Presentación de Lujo', 'Garantía Oficial de Fijación'];

            return (
              <div
                key={promo.id}
                className={`rounded-3xl bg-white border overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between ${
                  promo.isDemo ? 'border-amber-300 ring-2 ring-amber-300/30' : 'border-gray-200'
                }`}
              >
                <div>
                  {/* Promo Image */}
                  <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                    <img
                      src={promoImg}
                      alt={promo.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-extrabold uppercase px-3 py-1 rounded-full shadow-md">
                      {badge}
                    </div>

                    {promo.isDemo && (
                      <div className="absolute top-3 right-3 bg-amber-500 text-black text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 border border-amber-300">
                        <Sparkles className="w-3 h-3" />
                        <span>DEMO</span>
                      </div>
                    )}

                    {validDate && (
                      <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-xs text-white text-[10px] font-semibold px-2.5 py-1 rounded-lg">
                        Válido hasta {validDate}
                      </div>
                    )}
                  </div>

                  {/* Promo Content */}
                  <div className="p-6 space-y-3">
                    {promo.isDemo && (
                      <span className="inline-block text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-md">
                        Promoción DEMO (Eliminable desde Admin)
                      </span>
                    )}

                    <h3 className="text-xl font-bold text-gray-950">{promo.title}</h3>
                    {promo.subtitle && (
                      <p className="text-xs font-semibold text-red-600">
                        {promo.subtitle}
                      </p>
                    )}
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {promo.description}
                    </p>

                    <div className="pt-2">
                      <span className="text-xs uppercase font-bold text-gray-400">Incluye:</span>
                      <ul className="mt-1 space-y-1">
                        {itemsIncluded.map((item, idx) => (
                          <li key={idx} className="text-xs font-semibold text-gray-800 flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-red-600 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="p-6 pt-0">
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between gap-3">
                    <div>
                      {originalP > currentP && (
                        <span className="text-xs text-gray-400 line-through block">
                          {formatCurrency(originalP)}
                        </span>
                      )}
                      <span className="text-xl font-extrabold text-gray-950">
                        {formatCurrency(currentP)}
                      </span>
                    </div>

                    <button
                      id={`btn-add-promo-${promo.id}`}
                      onClick={() => handleAddPromoToCart(promo)}
                      className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-red-500/20 transition-all cursor-pointer shrink-0 active:scale-95"
                    >
                      Agregar Combo
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Explore Full Catalog Link */}
      <div className="rounded-2xl bg-gray-50 border border-gray-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-base text-gray-950">¿Buscás una fragancia individual?</h4>
          <p className="text-xs text-gray-600">Explorá todo nuestro catálogo con filtros por familia olfativa.</p>
        </div>
        <button
          onClick={() => onNavigateTab('catalogo')}
          className="px-5 py-2.5 rounded-xl bg-gray-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-black transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span>Ir al Catálogo</span>
          <ArrowRight className="w-4 h-4 text-red-400" />
        </button>
      </div>
    </div>
  );
};

