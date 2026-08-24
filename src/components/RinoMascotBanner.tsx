import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Flame, Award, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { RinoLogo } from './RinoLogo';

interface RinoMascotBannerProps {
  onExplorePromos: () => void;
  onExploreCatalog: () => void;
  onJoinBusiness: () => void;
  companyName?: string;
  slogan?: string;
}

export const RinoMascotBanner: React.FC<RinoMascotBannerProps> = ({
  onExplorePromos,
  onExploreCatalog,
  onJoinBusiness,
  companyName = 'Rinoxpress Córdoba',
  slogan = 'Aromas que dejan huella'
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-red-50/40 to-gray-50 border border-gray-200 shadow-xl p-6 sm:p-10 lg:p-12 my-4">
      {/* Background subtle light ambient aura */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-100/50 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-50/60 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>
      
      {/* Subtle geometric dot pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#E5E7EB_1px,transparent_1px)] [background-size:20px_20px] opacity-60 pointer-events-none"></div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Text & CTAs */}
        <div className="lg:col-span-7 space-y-6 text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-bold tracking-wider uppercase shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-red-600 animate-pulse" />
            <span>Fragancias Finas & Aromatización de Alta Gama</span>
          </div>

          {/* Headline */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-950 tracking-tight leading-[1.08]">
              AROMAS QUE <br />
              <span className="text-red-600">DEJAN HUELLA</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 font-normal max-w-xl leading-relaxed">
              Perfumes finos de máxima fijación, aromatizadores textiles, difusores con varillas de ratán y velas aromáticas de cera de soja elaborados con esencias puras.
            </p>
          </div>

          {/* Key Quick Badges */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-700 pt-1">
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-2xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-red-600" />
              <span>Alta Fijación +12hs</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-2xs font-semibold">
              <Flame className="w-4 h-4 text-red-600" />
              <span>Esencias Puras Importadas</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-2xs font-semibold">
              <Award className="w-4 h-4 text-red-600" />
              <span>Showroom Córdoba & Envíos</span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
            <button
              id="btn-ver-promociones-hero"
              onClick={onExplorePromos}
              className="px-7 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm tracking-wide uppercase shadow-lg shadow-red-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>VER PROMOCIONES</span>
              <Sparkles className="w-4 h-4 text-white" />
            </button>

            <button
              id="btn-ver-catalogo-hero"
              onClick={onExploreCatalog}
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-gray-50 text-gray-900 font-bold text-sm border border-gray-300 shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer hover:border-red-500"
            >
              <span>Explorar Catálogo</span>
              <ArrowRight className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>

        {/* Right Column: Official Rinoxpress Logo Card */}
        <div className="lg:col-span-5 flex justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-sm rounded-3xl bg-white border border-gray-200 p-7 shadow-xl shadow-red-500/5 flex flex-col items-center text-center"
          >
            {/* Top red label */}
            <div className="inline-flex items-center gap-1.5 bg-red-50 border border-red-100 text-red-600 text-[11px] font-extrabold uppercase px-3 py-1 rounded-full mb-5">
              <span>Identidad Oficial</span>
            </div>

            {/* Official Logo Display */}
            <div className="relative mb-4 p-4 rounded-2xl bg-white flex items-center justify-center">
              <RinoLogo size="xl" variant="red" />
            </div>

            <p className="text-sm font-bold text-gray-900 tracking-wide">
              "Aromas que dejan huella"
            </p>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed px-2">
              Distinción, presencia y energía olfativa en cada espacio.
            </p>

            <div className="w-full border-t border-gray-100 my-4 pt-3 flex items-center justify-between text-xs px-2 text-gray-600">
              <span className="flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-red-600" />
                Córdoba, Arg.
              </span>
              <span className="text-green-600 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Atención Activa
              </span>
            </div>

            <button
              onClick={onJoinBusiness}
              className="w-full py-2.5 px-4 rounded-xl bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-200 text-xs font-bold text-gray-800 hover:text-red-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Descubrí Oportunidades de Negocio</span>
              <ArrowRight className="w-3.5 h-3.5 text-red-600" />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
