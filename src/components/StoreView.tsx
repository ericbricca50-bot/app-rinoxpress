import React, { useState } from 'react';
import { 
  ExternalLink, 
  ShoppingBag, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  RotateCw, 
  Maximize2, 
  CheckCircle2, 
  ArrowUpRight,
  HelpCircle,
  MessageCircle
} from 'lucide-react';
import { RinoLogo } from './RinoLogo';
import { OFFICIAL_STORE_URL, openOfficialStore, getWhatsAppGeneralUrl } from '../services/storageService';
import { AppSettings } from '../types';

interface StoreViewProps {
  onBackToHome: () => void;
  settings: AppSettings;
}

export const StoreView: React.FC<StoreViewProps> = ({ onBackToHome, settings }) => {
  const [iframeError, setIframeError] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);

  const handleOpenStore = () => {
    openOfficialStore();
  };

  const handleReloadIframe = () => {
    setIframeLoading(true);
    setIframeError(false);
    const iframe = document.getElementById('rinoxpress-store-iframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = OFFICIAL_STORE_URL;
    }
  };

  return (
    <div className="w-full bg-gray-50 min-h-[calc(100vh-140px)] text-left pb-16">
      {/* Top Breadcrumb & Return Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <button
            id="btn-store-back-app"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs sm:text-sm font-bold transition-all cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform text-red-600" />
            <span>Volver a la aplicación</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Tienda Oficial Rinoxpress
            </span>

            <button
              id="btn-store-direct-external-top"
              onClick={handleOpenStore}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <span>Abrir en el Navegador</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Main Gateway Card */}
        <div className="rounded-3xl bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-6 sm:p-10 border border-gray-800 shadow-2xl relative overflow-hidden">
          {/* Subtle Background Red Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Information & Brand */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/30 border border-red-500/40 text-red-300 text-xs font-bold tracking-wide uppercase">
                <ShoppingBag className="w-3.5 h-3.5 text-red-400" />
                <span>Tienda Online Oficial</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                🛍️ TIENDA RINOXPRESS
              </h1>

              <p className="text-sm sm:text-base text-gray-300 max-w-xl font-medium leading-relaxed">
                Encontrá todos nuestros productos y realizá tu compra online con stock en tiempo real, promociones exclusivas y envíos a todo el país.
              </p>

              {/* Badges / Guarantees */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                <div className="flex items-center gap-2 text-xs text-gray-300 bg-white/5 border border-white/10 rounded-xl p-2.5">
                  <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                  <span>Catálogo Oficial</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-300 bg-white/5 border border-white/10 rounded-xl p-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Compra 100% Segura</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-300 bg-white/5 border border-white/10 rounded-xl p-2.5 col-span-2 sm:col-span-1">
                  <Truck className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>Envíos Nacionales</span>
                </div>
              </div>
            </div>

            {/* Right Column: Prominent Call-to-Action */}
            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 text-center space-y-4 shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-red-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-red-600/30">
                <ShoppingBag className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">Acceso Directo a la Tienda</h3>
                <p className="text-xs text-gray-300 mt-1">
                  Ingresá a la plataforma oficial para navegar productos y finalizar tu compra.
                </p>
              </div>

              {/* Main Button: IR A LA TIENDA */}
              <a
                id="btn-store-ir-a-la-tienda-main"
                href={OFFICIAL_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-base uppercase tracking-wider shadow-lg shadow-red-600/40 active:scale-98 transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer group"
              >
                <div className="flex items-center gap-2 text-white">
                  <span>IR A LA TIENDA</span>
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
                <span className="text-[11px] font-normal lowercase tracking-normal text-red-100">
                  Comprá todos nuestros productos online
                </span>
              </a>

              {/* Direct Quick Action Buttons */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <a
                  id="btn-store-comprar-ahora"
                  href={OFFICIAL_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold transition-all text-center"
                >
                  COMPRAR
                </a>
                <a
                  id="btn-store-ver-promociones"
                  href={OFFICIAL_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold transition-all text-center"
                >
                  VER PROMOS
                </a>
                <a
                  id="btn-store-ver-tienda"
                  href={OFFICIAL_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold transition-all text-center"
                >
                  VER TIENDA
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Embedded Store Viewer / Mobile Browser Gateway Container */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Frame Header */}
          <div className="bg-gray-100/90 border-b border-gray-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span>
              </span>
              <div className="bg-white px-3 py-1 rounded-lg border border-gray-200 text-xs text-gray-600 font-mono flex items-center gap-1.5 select-all max-w-[240px] sm:max-w-md truncate">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">https://rinoxpress.com/mioficina/store/index</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReloadIframe}
                className="p-1.5 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                title="Recargar tienda"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Recargar</span>
              </button>

              <a
                href={OFFICIAL_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Abrir Tienda Externa</span>
              </a>
            </div>
          </div>

          {/* Iframe View / Fallback Gateway for high compatibility */}
          <div className="relative w-full h-[650px] sm:h-[750px] bg-gray-50 flex flex-col">
            {iframeLoading && (
              <div className="absolute inset-0 z-10 bg-white/90 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Cargando Tienda Rinoxpress Oficial...</p>
                  <p className="text-xs text-gray-500 mt-1">Conectando con https://rinoxpress.com/mioficina/store/index</p>
                </div>
                <button
                  onClick={handleOpenStore}
                  className="mt-2 px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 shadow-sm"
                >
                  Abrir directo en el navegador
                </button>
              </div>
            )}

            <iframe
              id="rinoxpress-store-iframe"
              src={OFFICIAL_STORE_URL}
              title="Tienda Online Oficial Rinoxpress"
              className="w-full flex-1 border-0"
              onLoad={() => setIframeLoading(false)}
              onError={() => {
                setIframeLoading(false);
                setIframeError(true);
              }}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
            />

            {/* Persistent Mobile Bottom Assistance Bar */}
            <div className="p-4 bg-gray-900 text-white border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-center sm:text-left">
                <div className="w-8 h-8 rounded-full bg-red-600/30 text-red-400 flex items-center justify-center shrink-0">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">¿Deseás completar tu compra en pantalla completa?</p>
                  <p className="text-[11px] text-gray-400">Podés abrir la tienda en tu navegador móvil predeterminado para mayor comodidad.</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={onBackToHome}
                  className="px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold transition-all cursor-pointer"
                >
                  Volver a la App
                </button>
                <a
                  href={OFFICIAL_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <span>Ir a la Tienda</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* WhatsApp & Support Card */}
        <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-950">¿Tenés dudas sobre productos o tu compra?</h4>
              <p className="text-xs text-emerald-800">
                Nuestro equipo de atención al cliente de Rinoxpress Córdoba te asiste de inmediato por WhatsApp.
              </p>
            </div>
          </div>

          <a
            href={getWhatsAppGeneralUrl(settings)}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shrink-0 shadow-sm"
          >
            <MessageCircle className="w-4 h-4 fill-white stroke-none" />
            <span>Consultar por WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
