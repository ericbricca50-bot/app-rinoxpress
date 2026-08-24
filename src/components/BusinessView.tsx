import React, { useState } from 'react';
import { 
  Briefcase, 
  TrendingUp, 
  Store, 
  Award, 
  CheckCircle2, 
  Calendar, 
  ArrowRight, 
  ShieldCheck, 
  Users, 
  Sparkles, 
  ChevronRight,
  DollarSign,
  MessageCircle
} from 'lucide-react';
import { BusinessOpportunity, FranchiseTier, AppSettings } from '../types';
import { RinoLogo } from './RinoLogo';
import { getWhatsAppBusinessUrl } from '../services/storageService';

interface BusinessViewProps {
  opportunities: BusinessOpportunity[];
  onOpenLeadModal: (selectedOption?: string) => void;
  onOpenSchedule: () => void;
  settings: AppSettings;
}

export const BusinessView: React.FC<BusinessViewProps> = ({
  opportunities,
  onOpenLeadModal,
  onOpenSchedule,
  settings
}) => {
  const [activeTab, setActiveTab] = useState<'dropshipping' | 'network' | 'franchise'>('dropshipping');
  const [selectedFranchiseTier, setSelectedFranchiseTier] = useState<string>('Bronze');

  const dropshipping = opportunities.find(o => o.type === 'dropshipping') || opportunities[0];
  const network = opportunities.find(o => o.type === 'network') || opportunities[1];
  const franchise = opportunities.find(o => o.type === 'franchise') || opportunities[2];

  const handleWhatsAppBusiness = () => {
    const url = getWhatsAppBusinessUrl(settings);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-10 bg-white text-left">
      {/* Hero Commercial Header */}
      <div className="relative rounded-3xl bg-gradient-to-br from-red-600 via-red-700 to-red-800 p-8 sm:p-12 lg:p-14 shadow-xl text-center overflow-hidden text-white">
        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-white text-xs font-extrabold uppercase tracking-widest backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Oportunidad de Negocio & Expansión</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            CRECÉ CON <span className="underline decoration-white/40">RINOXPRESS</span>
          </h1>

          <p className="text-base sm:text-lg text-red-100 font-normal leading-relaxed">
            Conocé las diferentes modalidades para formar parte de nuestra red comercial y desarrollá tu propio negocio en el mercado de la perfumería fina y el bienestar en Córdoba y el país.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl mx-auto pt-4 text-left">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20">
              <span className="text-xs text-red-200 block font-semibold">Margen Comercial</span>
              <span className="text-lg font-extrabold text-white">Hasta 45-50%</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20">
              <span className="text-xs text-red-200 block font-semibold">Logística Central</span>
              <span className="text-lg font-extrabold text-white">Desde Córdoba</span>
            </div>
            <div className="col-span-2 sm:col-span-1 p-3.5 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20">
              <span className="text-xs text-red-200 block font-semibold">Formato Llave en Mano</span>
              <span className="text-lg font-extrabold text-white">Acompañamiento</span>
            </div>
          </div>

          {/* Top CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={handleWhatsAppBusiness}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-emerald-900 hover:bg-gray-100 font-extrabold text-sm uppercase tracking-wider shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 text-emerald-600 fill-emerald-600" />
              <span>QUIERO MÁS INFORMACIÓN</span>
            </button>

            <button
              onClick={() => onOpenLeadModal('Interés General en Negocio Rinoxpress')}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-red-900/80 hover:bg-red-950 text-white font-bold text-sm border border-white/30 shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Completar Formulario</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenSchedule}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-red-900/60 hover:bg-red-900 text-white font-bold text-sm border border-white/30 shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Agendar Reunión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Model Selection Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex p-1.5 rounded-2xl bg-gray-100 border border-gray-200 max-w-full overflow-x-auto">
          <button
            onClick={() => setActiveTab('dropshipping')}
            className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'dropshipping'
                ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Dropshipping Rinoxpress</span>
          </button>

          <button
            onClick={() => setActiveTab('network')}
            className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'network'
                ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Red de Consumo</span>
          </button>

          <button
            onClick={() => setActiveTab('franchise')}
            className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'franchise'
                ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>Franquicias Oficiales</span>
          </button>
        </div>
      </div>

      {/* TAB 1: DROPSHIPPING */}
      {activeTab === 'dropshipping' && dropshipping && (
        <div className="rounded-3xl bg-white border border-gray-200 p-6 sm:p-10 shadow-xs space-y-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-gray-100 pb-8">
            <div className="space-y-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-red-600">Venta Directa Sin Stock</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950">{dropshipping.title}</h2>
              <p className="text-sm text-gray-600 max-w-2xl">{dropshipping.description}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleWhatsAppBusiness}
                className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>QUIERO MÁS INFORMACIÓN</span>
              </button>

              <button
                onClick={() => onOpenLeadModal('Dropshipping Rinoxpress')}
                className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-red-500/20 cursor-pointer"
              >
                Postularme al Dropshipping
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {dropshipping.benefits.map((benefit, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="text-xs font-semibold text-gray-800 leading-snug">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-2xl bg-red-50/60 border border-red-200">
            <h4 className="text-sm font-bold text-red-900 uppercase tracking-wider mb-2">Requisitos para comenzar:</h4>
            <p className="text-xs text-red-800 leading-relaxed">
              Disponer de celular o computadora con conexión, redes sociales o contactos activos, y compromiso con la atención al cliente. Rinoxpress se encarga del embalaje, despacho y soporte de producto.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: RED DE CONSUMO */}
      {activeTab === 'network' && network && (
        <div className="rounded-3xl bg-white border border-gray-200 p-6 sm:p-10 shadow-xs space-y-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-gray-100 pb-8">
            <div className="space-y-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-red-600">Comunidad & Beneficios</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950">{network.title}</h2>
              <p className="text-sm text-gray-600 max-w-2xl">{network.description}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleWhatsAppBusiness}
                className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>QUIERO MÁS INFORMACIÓN</span>
              </button>

              <button
                onClick={() => onOpenLeadModal('Red de Consumo Inteligente')}
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-red-500/20 cursor-pointer"
              >
                Unirme a la Red
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {network.benefits.map((benefit, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="text-xs font-semibold text-gray-800 leading-snug">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: FRANQUICIAS OFICIALES */}
      {activeTab === 'franchise' && franchise && (
        <div className="rounded-3xl bg-white border border-gray-200 p-6 sm:p-10 shadow-xs space-y-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-gray-100 pb-8">
            <div className="space-y-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-red-600">Puntos de Venta & Corners</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950">{franchise.title}</h2>
              <p className="text-sm text-gray-600 max-w-2xl">{franchise.description}</p>
            </div>

            <button
              onClick={() => onOpenLeadModal(`Franquicia Rinoxpress - Nivel ${selectedFranchiseTier}`)}
              className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-red-500/20 cursor-pointer"
            >
              Solicitar Dossier de Franquicia
            </button>
          </div>

          {/* Franchise Tiers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {franchise.tiers?.map((tier) => {
              const isSelected = selectedFranchiseTier === tier.name;
              return (
                <div
                  key={tier.name}
                  onClick={() => setSelectedFranchiseTier(tier.name)}
                  className={`rounded-2xl p-6 border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-red-50/40 border-red-600 shadow-md ring-2 ring-red-600'
                      : 'bg-gray-50 border-gray-200 hover:border-red-300'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-extrabold uppercase text-red-600">{tier.name}</span>
                      <span className="text-xs font-bold bg-white px-2.5 py-0.5 rounded-full border border-gray-200">
                        {tier.estimatedPayback}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-gray-950">{tier.investmentRange}</h4>
                    <p className="text-xs text-gray-600">{tier.format}</p>

                    <div className="pt-2 border-t border-gray-200/60">
                      <span className="text-[11px] font-bold text-gray-500 uppercase block mb-1">Incluye:</span>
                      <ul className="space-y-1.5">
                        {tier.features.map((feat, i) => (
                          <li key={i} className="text-xs text-gray-700 flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-red-600 flex-shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenLeadModal(`Franquicia Rinoxpress - Nivel ${tier.name}`);
                    }}
                    className={`w-full mt-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-red-600 text-white'
                        : 'bg-white text-gray-800 border border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    Consultar Nivel {tier.name}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
