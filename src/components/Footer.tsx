import React from 'react';
import { 
  Sparkles, 
  MapPin, 
  Phone, 
  Clock, 
  Calendar, 
  MessageCircle, 
  ShieldCheck, 
  ArrowUpRight 
} from 'lucide-react';
import { RinoLogo } from './RinoLogo';
import { AppSettings } from '../types';
import { getWhatsAppGeneralUrl } from '../services/storageService';

interface FooterProps {
  settings: AppSettings;
  onNavigateTab: (tab: string) => void;
  onOpenSchedule: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onNavigateTab,
  onOpenSchedule,
  onOpenAdmin
}) => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-left text-xs text-gray-400 pt-12 pb-24 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="p-2 rounded-xl bg-white inline-block">
              <RinoLogo variant="red" size="md" />
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Comercializadora líder en perfumería fina, aromatizadores textiles, difusores con varillas de ratán, velas de cera de soja y productos de bienestar en Córdoba, Argentina.
            </p>
            <p className="text-[11px] text-red-400 font-bold">
              "Aromas que dejan huella"
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Navegación
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigateTab('inicio')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Inicio & Novedades
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('tienda')}
                  className="text-red-400 font-bold hover:text-red-300 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>🛍️ Tienda Online Oficial</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('catalogo')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Catálogo de Perfumes & Aromas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('promociones')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Promociones & Sets
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('pedido')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Armar Pedido (WhatsApp)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('oficina')}
                  className="text-white font-semibold hover:text-red-400 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>🦏 Mi Oficina Rinoxpress</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('sumate')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Sumate a Rinoxpress (Negocios)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('cuenta')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Mi Cuenta & Pedidos
                </button>
              </li>
            </ul>
          </div>

          {/* Business & Meeting */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Negocios & Reuniones
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigateTab('sumate')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Dropshipping (Venta Directa)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('sumate')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Red de Consumo Inteligente
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('sumate')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Franquicias Oficiales
                </button>
              </li>
              <li className="pt-2">
                <button
                  onClick={onOpenSchedule}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition-colors cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Agendar en Google Calendar</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Showroom */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Showroom & Contacto
            </h4>
            <div className="space-y-2 text-xs text-gray-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <a
                href={getWhatsAppGeneralUrl(settings)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>WhatsApp: +{settings.whatsappNumber}</span>
              </a>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span>{settings.openingHours}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenAdmin}
                className="text-[11px] text-gray-400 hover:text-white underline cursor-pointer"
              >
                Acceso a Gestión Interna
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} {settings.companyName}. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            <span>Identidad Oficial Rinoxpress</span>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            <span>Córdoba, Argentina</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
