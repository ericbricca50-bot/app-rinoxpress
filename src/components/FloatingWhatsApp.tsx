import React, { useState } from 'react';
import { MessageCircle, X, Send, Calendar, Briefcase, ShoppingBag, HelpCircle } from 'lucide-react';
import { generateWhatsAppUrl, getWhatsAppGeneralUrl, getWhatsAppBusinessUrl } from '../services/storageService';
import { AppSettings } from '../types';

interface FloatingWhatsAppProps {
  settings: AppSettings;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ settings }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenWhatsAppUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleOpenCustomText = (text: string) => {
    const url = generateWhatsAppUrl(settings.whatsappNumber, text);
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-40">
      {/* Popover Menu */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 rounded-3xl bg-white border border-gray-200 p-4 shadow-2xl animate-in slide-in-from-bottom-5 duration-200 text-left">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-md">
                <MessageCircle className="w-5 h-5 fill-white stroke-none" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-950 flex items-center gap-1.5">
                  WhatsApp Oficial
                  <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse"></span>
                </h4>
                <p className="text-[11px] text-red-600 font-semibold">{settings.companyName}</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-gray-600 mb-3">
            Elegí cómo querés contactarnos y te responderemos a la brevedad:
          </p>

          {/* Quick Message Options */}
          <div className="space-y-2">
            <button
              onClick={() => handleOpenWhatsAppUrl(getWhatsAppGeneralUrl(settings))}
              className="w-full text-left p-2.5 rounded-xl bg-gray-50 hover:bg-red-50/50 border border-gray-200 hover:border-red-300 text-xs font-medium text-gray-800 transition-all flex items-center justify-between group cursor-pointer"
            >
              <span className="truncate pr-2">💬 Hablá con Rinoxpress (Información)</span>
              <Send className="w-3.5 h-3.5 text-[#25D366] group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
            </button>

            <button
              onClick={() => handleOpenCustomText(`Hola ${settings.companyName}, quiero consultar sobre envíos en Córdoba o el estado de una compra.`)}
              className="w-full text-left p-2.5 rounded-xl bg-gray-50 hover:bg-red-50/50 border border-gray-200 hover:border-red-300 text-xs font-medium text-gray-800 transition-all flex items-center justify-between group cursor-pointer"
            >
              <span className="truncate pr-2">🛍️ Estado de mi pedido o compra</span>
              <Send className="w-3.5 h-3.5 text-[#25D366] group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
            </button>

            <button
              onClick={() => handleOpenWhatsAppUrl(getWhatsAppBusinessUrl(settings))}
              className="w-full text-left p-2.5 rounded-xl bg-gray-50 hover:bg-red-50/50 border border-gray-200 hover:border-red-300 text-xs font-medium text-gray-800 transition-all flex items-center justify-between group cursor-pointer"
            >
              <span className="truncate pr-2">💼 Sumate como Revendedor / Franquicia</span>
              <Send className="w-3.5 h-3.5 text-[#25D366] group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
            </button>

            <button
              onClick={() => handleOpenCustomText(`Hola ${settings.companyName}, quisiera coordinar detalles sobre una reunión comercial agendada.`)}
              className="w-full text-left p-2.5 rounded-xl bg-gray-50 hover:bg-red-50/50 border border-gray-200 hover:border-red-300 text-xs font-medium text-gray-800 transition-all flex items-center justify-between group cursor-pointer"
            >
              <span className="truncate pr-2">📅 Confirmar o consultar reunión agendada</span>
              <Send className="w-3.5 h-3.5 text-[#25D366] group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
            </button>
          </div>

          <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500 gap-2">
            <span className="truncate" title={settings.workingHours || settings.openingHours}>
              🕒 {settings.workingHours || settings.openingHours || 'Lun a Vie 09:30-17:30 | Sáb 09:30-13:30'}
            </span>
            <span className="text-[#25D366] font-bold whitespace-nowrap">Showroom Online</span>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        id="btn-floating-whatsapp"
        onClick={() => setIsOpen(!isOpen)}
        className="group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-xl shadow-red-600/20 ring-4 ring-red-600/85 hover:ring-red-600 ring-offset-2 ring-offset-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
        title="Abrir WhatsApp oficial Rinoxpress"
        aria-label="Atención al cliente por WhatsApp Rinoxpress"
      >
        {/* Subtle Ambient Red Glow Ring Effect */}
        <span className="absolute -inset-1 rounded-full bg-red-500/25 blur-xs animate-pulse -z-10"></span>

        {/* Animated Icon */}
        <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 fill-white stroke-none transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12 group-hover:-translate-y-0.5" />

        {/* Official Rinoxpress Red Alert Badge with Pulse */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600 border-2 border-white shadow-xs"></span>
        </span>
      </button>
    </div>
  );
};
