import React, { useState } from 'react';
import { 
  ShoppingBag, 
  ExternalLink, 
  ArrowUpRight, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  Flame, 
  CheckCircle2, 
  Layers,
  RotateCw,
  Maximize2
} from 'lucide-react';
import { RinoLogo } from './RinoLogo';
import { OFFICIAL_STORE_URL, openOfficialStore } from '../services/storageService';
import { Product, Category, AppSettings } from '../types';

interface CatalogViewProps {
  products?: Product[];
  categories?: Category[];
  selectedCategoryId?: string | null;
  onSelectCategory?: (categoryId: string | null) => void;
  onAddToCart?: (product: Product, size?: string) => void;
  onViewProductDetail?: (product: Product) => void;
  settings?: AppSettings;
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = () => {
  const [showEmbeddedStore, setShowEmbeddedStore] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);

  const handleOpenStore = () => {
    openOfficialStore();
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8 text-left bg-white min-h-[calc(100vh-140px)]">
      
      {/* 1. Header Banner Principal Rinoxpress */}
      <div className="rounded-3xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        {/* Subtle Decorative Elements */}
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-96 h-32 bg-black/10 rounded-full blur-xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-xs border border-white/25">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Tienda Oficial • Rinoxpress</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            🛍️ CATÁLOGO RINOXPRESS
          </h1>

          <p className="text-base sm:text-xl text-red-100 font-medium leading-relaxed max-w-2xl">
            Encontrá todos nuestros productos, precios y promociones en nuestra tienda online.
          </p>

          {/* Quick value badges */}
          <div className="pt-2 flex flex-wrap gap-2.5 sm:gap-3 text-xs font-semibold text-white/90">
            <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10">
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>Stock en Tiempo Real</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Compra 100% Segura</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10">
              <Truck className="w-4 h-4 text-blue-200" />
              <span>Envíos a Todo el País</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Tarjeta Visual Central de Acceso al Catálogo Oficial */}
      <div className="rounded-3xl bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-6 sm:p-10 border border-gray-800 shadow-2xl relative overflow-hidden">
        {/* Glow de fondo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Columna Izquierda: Logo Oficial y Mensaje */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-2xl shadow-lg inline-block shrink-0">
                <RinoLogo size="sm" variant="red" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-red-500 block">
                  Plataforma Oficial
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Toda la colección Rinoxpress a un clic
                </h2>
              </div>
            </div>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Nuestra tienda online oficial te permite explorar las familias olfativas, fragancias finas, aromatizadores textiles, difusores con varillas de ratán, autos y combos con promociones vigentes.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <p className="text-xs text-gray-400 font-bold uppercase">Perfumería</p>
                <p className="text-sm font-black text-white">Línea Fina 100ml</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <p className="text-xs text-gray-400 font-bold uppercase">Ambientes</p>
                <p className="text-sm font-black text-white">Difusores & Sprays</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1 col-span-2 sm:col-span-1">
                <p className="text-xs text-gray-400 font-bold uppercase">Promociones</p>
                <p className="text-sm font-black text-red-400">Combos Especiales</p>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Botón Principal y Botones Adicionales */}
          <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/15 text-center space-y-5 shadow-xl">
            
            <div className="w-16 h-16 rounded-2xl bg-red-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-red-600/40">
              <ShoppingBag className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">Acceso a la Tienda Online</h3>
              <p className="text-xs text-gray-300 mt-1">
                Ingresá directamente para ver precios actualizados y disponibilidad inmediata.
              </p>
            </div>

            {/* BOTÓN PRINCIPAL: VER CATÁLOGO COMPLETO */}
            <a
              id="btn-catalogo-completo-main"
              href={OFFICIAL_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-base sm:text-lg uppercase tracking-wider shadow-lg shadow-red-600/40 active:scale-98 transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer group"
            >
              <div className="flex items-center gap-2 text-white">
                <span>VER CATÁLOGO COMPLETO</span>
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
              <span className="text-[11px] font-normal lowercase tracking-normal text-red-100">
                https://rinoxpress.com/mioficina/store/index
              </span>
            </a>

            {/* BOTONES ADICIONALES: VER PROMOCIONES & COMPRAR AHORA */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <a
                id="btn-catalogo-ver-promociones"
                href={OFFICIAL_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-3 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 border border-white/10 uppercase tracking-wider"
              >
                <Sparkles className="w-3.5 h-3.5 text-yellow-300 shrink-0" />
                <span>VER PROMOCIONES</span>
              </a>

              <a
                id="btn-catalogo-comprar-ahora"
                href={OFFICIAL_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-3 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 border border-red-500/30 uppercase tracking-wider"
              >
                <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                <span>COMPRAR AHORA</span>
              </a>
            </div>

            {/* Toggle para previsualizar integrada */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowEmbeddedStore(!showEmbeddedStore)}
                className="text-xs text-gray-400 hover:text-white underline transition-colors cursor-pointer"
              >
                {showEmbeddedStore ? 'Ocultar vista previa integrada' : 'Ver tienda integrada en esta pantalla'}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* 3. Vista Integrada Opcional de la Tienda (Web View) */}
      {showEmbeddedStore && (
        <div className="rounded-3xl bg-white border-2 border-gray-200 overflow-hidden shadow-xl space-y-3 p-4 sm:p-6 transition-all">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Navegador de Tienda Rinoxpress
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIframeLoading(true);
                  const iframe = document.getElementById('catalog-store-iframe') as HTMLIFrameElement;
                  if (iframe) iframe.src = OFFICIAL_STORE_URL;
                }}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                title="Recargar"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Recargar</span>
              </button>

              <a
                href={OFFICIAL_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <span>Abrir en Pantalla Completa</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="relative w-full h-[650px] sm:h-[800px] bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
            {iframeLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-10 space-y-3">
                <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs font-bold text-gray-600">Cargando tienda online oficial de Rinoxpress...</p>
              </div>
            )}

            <iframe
              id="catalog-store-iframe"
              src={OFFICIAL_STORE_URL}
              title="Tienda Online Rinoxpress Oficial"
              className="w-full h-full border-0"
              onLoad={() => setIframeLoading(false)}
              allow="payment; geolocation"
            />
          </div>

          <p className="text-[11px] text-gray-500 text-center">
            * Para una mejor experiencia de compra, inicio de sesión y pago con tarjeta, recomendamos abrir la tienda directamente en el navegador de tu dispositivo.
          </p>
        </div>
      )}

      {/* 4. Categorías Principales Destacadas de la Tienda */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Categorías Disponibles en la Tienda</h3>
            <p className="text-xs text-gray-500">Explorá cada línea de productos en la plataforma oficial.</p>
          </div>
          <a
            href={OFFICIAL_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
          >
            <span>Ver todo</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Perfumería Fina */}
          <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                ✨
              </div>
              <h4 className="font-bold text-gray-900 text-base">Perfumería Fina</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Eau de Parfum de alta concentración con esencias importadas de máxima fijación.
              </p>
            </div>
            <a
              href={OFFICIAL_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-red-600 hover:text-white text-gray-800 text-xs font-bold transition-all text-center flex items-center justify-center gap-1"
            >
              <span>Ver en Tienda</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 2: Aromatizadores */}
          <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                🌿
              </div>
              <h4 className="font-bold text-gray-900 text-base">Aromatización Textil & Autos</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Fragancias ambientales para ropa, cortinas, sillones y difusores vehiculares.
              </p>
            </div>
            <a
              href={OFFICIAL_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-red-600 hover:text-white text-gray-800 text-xs font-bold transition-all text-center flex items-center justify-center gap-1"
            >
              <span>Ver en Tienda</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 3: Difusores & Varillas */}
          <div className="rounded-2xl bg-white border border-gray-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                🎋
              </div>
              <h4 className="font-bold text-gray-900 text-base">Difusores de Varillas</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Difusión continua y prolongada con varillas de ratán y recipientes de diseño.
              </p>
            </div>
            <a
              href={OFFICIAL_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-gray-100 hover:bg-red-600 hover:text-white text-gray-800 text-xs font-bold transition-all text-center flex items-center justify-center gap-1"
            >
              <span>Ver en Tienda</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Card 4: Promociones & Sets */}
          <div className="rounded-2xl bg-white border border-red-200 bg-red-50/30 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold shadow-sm">
                🔥
              </div>
              <h4 className="font-bold text-red-950 text-base">Promociones & Sets</h4>
              <p className="text-xs text-red-800/80 leading-relaxed">
                Combos con descuentos por cantidad y regalos especiales de temporada.
              </p>
            </div>
            <a
              href={OFFICIAL_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all text-center flex items-center justify-center gap-1 shadow-sm"
            >
              <span>Ver Promociones</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      </div>

    </div>
  );
};
