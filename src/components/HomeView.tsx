import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShoppingBag, 
  TrendingUp, 
  Calendar, 
  ShieldCheck, 
  Truck, 
  Award, 
  Heart, 
  ChevronRight, 
  Flame, 
  CheckCircle2, 
  MessageCircle,
  PhoneCall,
  ExternalLink,
  Store,
  ArrowUpRight
} from 'lucide-react';
import { Product, Category, Promotion, AppSettings } from '../types';
import { RinoMascotBanner } from './RinoMascotBanner';
import { RinoLogo } from './RinoLogo';
import { ProductCard } from './ProductCard';
import { formatCurrency, getWhatsAppGeneralUrl, OFFICIAL_STORE_URL } from '../services/storageService';

interface HomeViewProps {
  products: Product[];
  categories: Category[];
  promotions: Promotion[];
  settings: AppSettings;
  onNavigateTab: (tab: string) => void;
  onSelectCategory: (categoryId: string) => void;
  onAddToCart: (product: Product, size?: string) => void;
  onViewProductDetail: (product: Product) => void;
  onOpenSchedule: () => void;
  onOpenLeadModal: (option?: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  categories,
  promotions,
  settings,
  onNavigateTab,
  onSelectCategory,
  onAddToCart,
  onViewProductDetail,
  onOpenSchedule,
  onOpenLeadModal
}) => {
  const featuredProducts = products.filter(p => p.isFeatured && p.isActive).slice(0, 4);
  const bestSellers = products.filter(p => p.isBestSeller && p.isActive).slice(0, 4);
  const activePromos = promotions.filter(p => p.isActive).slice(0, 3);

  return (
    <div className="space-y-12 pb-12 text-left bg-white">
      {/* 1. Hero Banner with Official Rinoxpress Identity */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <RinoMascotBanner
          onExplorePromos={() => onNavigateTab('promociones')}
          onExploreCatalog={() => onNavigateTab('catalogo')}
          onJoinBusiness={() => onNavigateTab('sumate')}
          companyName={settings.companyName}
          slogan={settings.slogan}
        />
      </div>

      {/* 2. OFFICIAL STORE HERO CARD: TIENDA RINOXPRESS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-red-600 via-red-700 to-gray-950 text-white p-6 sm:p-8 lg:p-10 shadow-2xl border border-red-500/30 relative overflow-hidden">
          {/* Subtle Decorative Backdrop Badge */}
          <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none transform rotate-12">
            <ShoppingBag className="w-80 h-80 text-white" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-extrabold uppercase tracking-wider backdrop-blur-xs">
                <span className="text-base">🛍️</span>
                <span>Tienda Oficial Online</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-2xl bg-white text-red-600 shadow-md">
                  <RinoLogo variant="red" size="sm" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                    TIENDA RINOXPRESS
                  </h2>
                  <p className="text-xs sm:text-sm text-red-100 font-semibold mt-0.5">
                    rinoxpress.com/mioficina/store/index
                  </p>
                </div>
              </div>

              <p className="text-sm sm:text-base text-gray-100 font-medium max-w-xl">
                Encontrá todos nuestros productos y realizá tu compra online.
              </p>

              {/* Direct Quick Action Links */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1 text-xs font-bold">
                <a
                  id="btn-home-ver-tienda-link"
                  href={OFFICIAL_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all inline-flex items-center gap-1.5 backdrop-blur-xs"
                >
                  <span>VER TIENDA</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  id="btn-home-ver-promociones-link"
                  href={OFFICIAL_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all inline-flex items-center gap-1.5 backdrop-blur-xs"
                >
                  <span>VER PROMOCIONES</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  id="btn-home-comprar-link"
                  href={OFFICIAL_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-all inline-flex items-center gap-1.5 backdrop-blur-xs"
                >
                  <span>COMPRAR</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  onClick={() => onNavigateTab('tienda')}
                  className="px-3.5 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 text-red-200 hover:text-white transition-all inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Ver en la App</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Buttons: COMPRAR AHORA / IR A LA TIENDA */}
            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              {/* COMPRAR AHORA */}
              <a
                id="btn-home-comprar-ahora-main"
                href={OFFICIAL_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-2xl bg-white hover:bg-gray-100 text-red-700 font-extrabold text-sm sm:text-base uppercase tracking-wider text-center shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>COMPRAR AHORA</span>
                <ArrowUpRight className="w-5 h-5" />
              </a>

              {/* IR A LA TIENDA with subtitle */}
              <a
                id="btn-home-ir-a-la-tienda"
                href={OFFICIAL_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-5 rounded-2xl bg-black/40 hover:bg-black/60 border border-white/20 text-white font-bold text-center transition-all flex flex-col items-center justify-center cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 text-xs font-extrabold tracking-wider uppercase">
                  <span>IR A LA TIENDA</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <span className="text-[11px] text-gray-300 font-normal mt-0.5">
                  Comprá todos nuestros productos online
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Quick Access Navigation Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
          {/* Direct Tienda Rinoxpress Section */}
          <button
            onClick={() => onNavigateTab('tienda')}
            className="p-4 rounded-2xl bg-red-50/70 border-2 border-red-200 hover:border-red-600 hover:bg-red-100/50 hover:scale-[1.02] shadow-xs transition-all flex flex-col items-center text-center group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-full bg-red-600 text-white flex items-center justify-center mb-2 shadow-sm group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-red-950 uppercase tracking-wider">Tienda Online</span>
            <span className="text-[10px] text-red-700 font-semibold mt-0.5">Oficial Rinoxpress</span>
          </button>

          {/* 🦏 MI OFICINA RINOXPRESS */}
          <button
            onClick={() => onNavigateTab('oficina')}
            className="p-4 rounded-2xl bg-gray-900 border-2 border-red-600/40 hover:border-red-500 hover:bg-black hover:scale-[1.02] shadow-xs transition-all flex flex-col items-center text-center group cursor-pointer text-white"
          >
            <div className="w-11 h-11 rounded-full bg-red-600 text-white flex items-center justify-center mb-2 shadow-md group-hover:scale-110 transition-transform">
              <span className="text-lg">🦏</span>
            </div>
            <span className="text-xs font-bold text-white uppercase tracking-wider">Mi Oficina</span>
            <span className="text-[10px] text-red-300 font-semibold mt-0.5">Gestión de Cuenta</span>
          </button>

          <button
            onClick={() => onNavigateTab('catalogo')}
            className="p-4 rounded-2xl bg-gray-50 border border-gray-200 hover:border-red-400 hover:bg-red-50/40 hover:scale-[1.02] shadow-xs transition-all flex flex-col items-center text-center group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-full bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white flex items-center justify-center mb-2 transition-all">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Catálogo</span>
            <span className="text-[10px] text-gray-500 mt-0.5">Explorar fragancias</span>
          </button>

          <button
            onClick={() => onNavigateTab('promociones')}
            className="p-4 rounded-2xl bg-gray-50 border border-gray-200 hover:border-red-400 hover:bg-red-50/40 hover:scale-[1.02] shadow-xs transition-all flex flex-col items-center text-center group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-full bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white flex items-center justify-center mb-2 transition-all">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Promociones</span>
            <span className="text-[10px] text-gray-500 mt-0.5">Descuentos & Sets</span>
          </button>

          <button
            onClick={() => onNavigateTab('pedido')}
            className="p-4 rounded-2xl bg-gray-50 border border-gray-200 hover:border-red-400 hover:bg-red-50/40 hover:scale-[1.02] shadow-xs transition-all flex flex-col items-center text-center group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-full bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white flex items-center justify-center mb-2 transition-all">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Armar Pedido</span>
            <span className="text-[10px] text-gray-500 mt-0.5">WhatsApp directo</span>
          </button>

          <button
            onClick={() => onNavigateTab('sumate')}
            className="p-4 rounded-2xl bg-gray-50 border border-gray-200 hover:border-red-400 hover:bg-red-50/40 hover:scale-[1.02] shadow-xs transition-all flex flex-col items-center text-center group cursor-pointer"
          >
            <div className="w-11 h-11 rounded-full bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white flex items-center justify-center mb-2 transition-all">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-gray-900 uppercase tracking-wider">Sumate</span>
            <span className="text-[10px] text-gray-500 mt-0.5">Dropshipping & Red</span>
          </button>

          <a
            href={getWhatsAppGeneralUrl(settings)}
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 hover:border-emerald-500 hover:bg-emerald-100/50 hover:scale-[1.02] shadow-xs transition-all flex flex-col items-center text-center group"
          >
            <div className="w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-2 shadow-sm">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">WhatsApp</span>
            <span className="text-[10px] text-emerald-700 mt-0.5">Contacto directo</span>
          </a>
        </div>

        {/* 🦏 MI OFICINA RINOXPRESS HERO CARD */}
        <div className="mt-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-gray-950 via-gray-900 to-black text-white border border-red-600/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex items-center gap-4 text-center sm:text-left relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg shadow-red-600/30 shrink-0">
              🦏
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600/20 border border-red-500/30 text-red-300 text-[10px] font-bold uppercase tracking-wider mb-1">
                Portal de Distribuidores
              </div>
              <h4 className="font-black text-lg sm:text-xl text-white tracking-tight">
                MI OFICINA RINOXPRESS
              </h4>
              <p className="text-xs sm:text-sm text-gray-300 mt-0.5 max-w-lg">
                Accedé a tu oficina y gestioná todo desde un solo lugar.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 relative z-10 shrink-0 w-full sm:w-auto">
            <button
              onClick={() => onNavigateTab('oficina')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-md shadow-red-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>INGRESAR A MI OFICINA</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Highlighted WhatsApp Banner: HABLÁ CON RINOXPRESS */}
        <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center sm:text-left">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-extrabold text-base sm:text-lg tracking-tight">
                ¿Buscás asesoramiento personalizado o consultar stock?
              </h4>
              <p className="text-xs text-emerald-100 mt-0.5">
                Nuestro equipo en Córdoba está disponible para responder todas tus dudas de inmediato.
              </p>
            </div>
          </div>

          <a
            href={getWhatsAppGeneralUrl(settings)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-white hover:bg-gray-100 text-emerald-900 font-extrabold text-xs uppercase tracking-wider shadow-md active:scale-95 transition-all flex items-center gap-2 shrink-0"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600" />
            <span>HABLÁ CON RINOXPRESS</span>
          </a>
        </div>
      </div>

      {/* 3. Categories Horizontal Carousel / Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-red-600">Líneas Olfativas</span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-950">Categorías Principales</h2>
          </div>
          <button
            onClick={() => onNavigateTab('catalogo')}
            className="text-xs sm:text-sm font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Ver todo el catálogo</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group relative rounded-2xl overflow-hidden bg-gray-50 border border-gray-200 hover:border-red-500 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col"
            >
              <div className="h-28 overflow-hidden relative">
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-xs font-bold text-white leading-tight drop-shadow-sm">{cat.name}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Active Promotions Banner Block */}
      {activePromos.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 p-6 sm:p-8 text-white shadow-xl">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
                  <Flame className="w-3.5 h-3.5 text-white" />
                  <span>Ofertas Especiales Rinoxpress</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  ¡Promociones por tiempo limitado!
                </h3>
                <p className="text-sm text-red-100">
                  Aprovechá combos de fragancias finas y aromatización de ambientes con descuentos exclusivos.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => onNavigateTab('promociones')}
                  className="px-6 py-3 rounded-xl bg-white text-red-700 hover:bg-gray-100 font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  Ver Todas las Promos
                </button>
              </div>
            </div>

            {/* Promo mini cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {activePromos.map((promo) => (
                <div 
                  key={promo.id} 
                  className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-1.5">
                      <span className="text-xs font-extrabold uppercase bg-white text-red-700 px-2 py-0.5 rounded-full">
                        {promo.discountPercent}% OFF
                      </span>
                      {promo.validUntil && (
                        <span className="text-[10px] text-white/80">Hasta {promo.validUntil}</span>
                      )}
                    </div>
                    <h4 className="font-bold text-base text-white">{promo.title}</h4>
                    <p className="text-xs text-red-100 mt-1">{promo.description}</p>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-2 border-t border-white/15">
                    <span className="text-sm font-extrabold text-white">
                      {formatCurrency(promo.finalPrice)}
                    </span>
                    <button
                      onClick={() => onNavigateTab('promociones')}
                      className="text-xs font-bold text-white underline hover:text-red-200 cursor-pointer"
                    >
                      Aprovechar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. Featured Fragrances Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-red-600">Recomendaciones</span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-950">Fragancias Destacadas</h2>
          </div>
          <button
            onClick={() => onNavigateTab('catalogo')}
            className="text-xs sm:text-sm font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Ver catálogo</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onViewDetail={onViewProductDetail}
            />
          ))}
        </div>
      </div>

      {/* 6. Best Sellers Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-red-600">Favoritos en Córdoba</span>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-950">Más Vendidos</h2>
          </div>
          <button
            onClick={() => onNavigateTab('catalogo')}
            className="text-xs sm:text-sm font-bold text-red-600 hover:text-red-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Explorar más</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onViewDetail={onViewProductDetail}
            />
          ))}
        </div>
      </div>

      {/* 7. Why Rinoxpress Value Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gray-50 border border-gray-200 p-8 sm:p-10">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs uppercase font-extrabold tracking-widest text-red-600">Garantía de Calidad</span>
            <h3 className="text-2xl font-bold text-gray-950 mt-1">¿Por qué elegir Rinoxpress?</h3>
            <p className="text-sm text-gray-600 mt-2">
              Compromiso absoluto con la formulación fina y la máxima experiencia olfativa en cada producto.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-white border border-gray-200 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-gray-900">Alta Concentración</h4>
              <p className="text-xs text-gray-600 mt-1">
                Formulados con esencias puras para asegurar durabilidad y estela superior.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-200 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-3">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-gray-900">Envíos Rápidos</h4>
              <p className="text-xs text-gray-600 mt-1">
                Entregas en Córdoba y envíos a todo el territorio nacional con embalaje seguro.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-200 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-3">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-gray-900">Oportunidad de Negocio</h4>
              <p className="text-xs text-gray-600 mt-1">
                Programas de Dropshipping, Red de consumo y Franquicias oficiales.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-gray-200 text-center flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-3">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-base text-gray-900">Asesoramiento Directo</h4>
              <p className="text-xs text-gray-600 mt-1">
                Atención personalizada vía WhatsApp para ayudarte a elegir tu fragancia ideal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
