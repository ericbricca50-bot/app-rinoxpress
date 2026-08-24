import React, { useState } from 'react';
import { 
  Briefcase, 
  ExternalLink, 
  ArrowUpRight, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  UserCheck, 
  TrendingUp, 
  KeyRound, 
  RotateCw, 
  MessageCircle, 
  HelpCircle,
  BarChart3,
  Users,
  PackageCheck
} from 'lucide-react';
import { RinoLogo } from './RinoLogo';
import { 
  OFFICIAL_OFFICE_URL, 
  openOfficialOffice, 
  getWhatsAppBusinessUrl 
} from '../services/storageService';
import { AppSettings } from '../types';

interface OfficeViewProps {
  onBackToHome?: () => void;
  onNavigateTab?: (tab: string) => void;
  settings?: AppSettings;
}

export const OfficeView: React.FC<OfficeViewProps> = ({
  onBackToHome,
  onNavigateTab,
  settings
}) => {
  const [showEmbeddedView, setShowEmbeddedView] = useState(false);
  const [iframeLoading, setIframeLoading] = useState(true);

  const handleOpenOffice = () => {
    openOfficialOffice();
  };

  const handleWantInfo = () => {
    if (onNavigateTab) {
      onNavigateTab('sumate');
    } else {
      const url = getWhatsAppBusinessUrl(settings);
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8 text-left bg-white min-h-[calc(100vh-140px)]">
      
      {/* Top Breadcrumb / Back button */}
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-red-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Inicio</span>
        </button>

        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
          Plataforma de Gestión Rinoxpress
        </span>
      </div>

      {/* 1. Header Banner Principal Rinoxpress */}
      <div className="rounded-3xl bg-gradient-to-r from-red-600 via-red-700 to-gray-950 p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative glow & icon */}
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-72 h-72 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute right-4 bottom-2 opacity-10 pointer-events-none transform rotate-12">
          <Briefcase className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-xs border border-white/25">
            <span className="text-sm">🦏</span>
            <span>Plataforma Oficial para Socios & Distribuidores</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            🦏 MI OFICINA RINOXPRESS
          </h1>

          <p className="text-base sm:text-xl text-red-100 font-medium leading-relaxed max-w-2xl">
            Accedé a tu oficina y gestioná todo desde un solo lugar.
          </p>

          {/* Quick value badges */}
          <div className="pt-2 flex flex-wrap gap-2.5 sm:gap-3 text-xs font-semibold text-white/90">
            <div className="flex items-center gap-1.5 bg-black/25 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/15">
              <UserCheck className="w-4 h-4 text-emerald-300" />
              <span>Gestión de Cuenta</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/25 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/15">
              <BarChart3 className="w-4 h-4 text-yellow-300" />
              <span>Ventas & Comisiones</span>
            </div>
            <div className="flex items-center gap-1.5 bg-black/25 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/15">
              <ShieldCheck className="w-4 h-4 text-blue-200" />
              <span>Acceso Seguro</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Tarjeta Visual Central de Acceso a Mi Oficina */}
      <div className="rounded-3xl bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-6 sm:p-10 border border-gray-800 shadow-2xl relative overflow-hidden">
        {/* Glow de fondo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Columna Izquierda: Logo Oficial y Características de la Oficina */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-2xl shadow-lg inline-block shrink-0">
                <RinoLogo size="sm" variant="red" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-red-500 block">
                  Panel de Control Oficial
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Tu negocio Rinoxpress en tiempo real
                </h2>
              </div>
            </div>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Ingresá con tu usuario y contraseña a la plataforma web oficial para controlar tus pedidos, consultar comisiones, gestionar tu red de ventas, descargar materiales de difusión y acceder a las herramientas exclusivas de Rinoxpress.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-red-600/30 text-red-400 flex items-center justify-center font-bold">
                  <PackageCheck className="w-4 h-4" />
                </div>
                <p className="text-xs text-gray-400 font-bold uppercase">Tus Pedidos</p>
                <p className="text-sm font-black text-white">Estado de Envíos</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600/30 text-emerald-400 flex items-center justify-center font-bold">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <p className="text-xs text-gray-400 font-bold uppercase">Rendimiento</p>
                <p className="text-sm font-black text-white">Comisiones & Puntos</p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center font-bold">
                  <Users className="w-4 h-4" />
                </div>
                <p className="text-xs text-gray-400 font-bold uppercase">Equipo & Red</p>
                <p className="text-sm font-black text-white">Afiliados Activos</p>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Botón Principal y Call to Action */}
          <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/15 text-center space-y-6 shadow-xl">
            
            <div className="w-16 h-16 rounded-2xl bg-red-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-red-600/40">
              <KeyRound className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white">Acceso a Mi Oficina</h3>
              <p className="text-xs text-gray-300 mt-1">
                Ingresá con tus credenciales de distribuidor oficial.
              </p>
            </div>

            {/* BOTÓN PRINCIPAL: INGRESAR A MI OFICINA */}
            <a
              id="btn-ingresar-mi-oficina-main"
              href={OFFICIAL_OFFICE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black text-base sm:text-lg uppercase tracking-wider shadow-lg shadow-red-600/40 active:scale-98 transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer group"
            >
              <div className="flex items-center gap-2 text-white">
                <span>INGRESAR A MI OFICINA</span>
                <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </div>
              <span className="text-[11px] font-normal lowercase tracking-normal text-red-100">
                https://rinoxpress.com/mioficina/
              </span>
            </a>

            {/* SECCIÓN ADICIONAL: ¿Todavía no tenés acceso? */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <p className="text-xs font-semibold text-gray-300">
                ¿Todavía no tenés acceso?
              </p>

              <button
                id="btn-quiero-informacion-oficina"
                type="button"
                onClick={handleWantInfo}
                className="w-full py-3 px-4 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 border border-white/15 uppercase tracking-wider cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>QUIERO INFORMACIÓN</span>
              </button>

              <p className="text-[11px] text-gray-400">
                Descubrí cómo formar parte de Rinoxpress como revendedor o franquiciado.
              </p>
            </div>

            {/* Toggle para previsualizar integrada */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowEmbeddedView(!showEmbeddedView)}
                className="text-[11px] text-gray-400 hover:text-white underline transition-colors cursor-pointer"
              >
                {showEmbeddedView ? 'Ocultar vista previa integrada' : 'Ver pantalla integrada en la app'}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* 3. Vista Integrada Opcional (Web View) */}
      {showEmbeddedView && (
        <div className="rounded-3xl bg-white border-2 border-gray-200 overflow-hidden shadow-xl space-y-3 p-4 sm:p-6 transition-all">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
              <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Plataforma Web Rinoxpress Mi Oficina
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIframeLoading(true);
                  const iframe = document.getElementById('office-iframe') as HTMLIFrameElement;
                  if (iframe) iframe.src = OFFICIAL_OFFICE_URL;
                }}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold flex items-center gap-1 cursor-pointer transition-all"
                title="Recargar"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Recargar</span>
              </button>

              <a
                href={OFFICIAL_OFFICE_URL}
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
                <p className="text-xs font-bold text-gray-600">Cargando plataforma oficial Mi Oficina...</p>
              </div>
            )}

            <iframe
              id="office-iframe"
              src={OFFICIAL_OFFICE_URL}
              title="Mi Oficina Rinoxpress Oficial"
              className="w-full h-full border-0"
              onLoad={() => setIframeLoading(false)}
              allow="payment; geolocation"
            />
          </div>

          <p className="text-[11px] text-gray-500 text-center">
            * Para el inicio de sesión seguro y guardado de credenciales, recomendamos abrir directamente en el navegador del dispositivo.
          </p>
        </div>
      )}

      {/* 4. Canales de Ayuda y Soporte */}
      <div className="rounded-2xl bg-gray-50 border border-gray-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm sm:text-base">
              ¿Tenés problemas para ingresar a tu cuenta?
            </h4>
            <p className="text-xs text-gray-600 mt-0.5">
              Contactá a nuestro equipo de soporte para restablecer tu clave o verificar el estado de tu membresía.
            </p>
          </div>
        </div>

        <a
          href={getWhatsAppBusinessUrl(settings)}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all shrink-0 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Soporte por WhatsApp</span>
        </a>
      </div>

    </div>
  );
};
