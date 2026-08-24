import React from 'react';
import { Home, ShoppingBag, Sparkles, Briefcase, User, Store } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  onOpenCart: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  onOpenCart
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-1 py-1.5 flex items-center justify-around shadow-lg">
      <button
        id="bottom-nav-inicio"
        onClick={() => setActiveTab('inicio')}
        className={`flex flex-col items-center justify-center p-1 rounded-xl transition-all ${
          activeTab === 'inicio'
            ? 'text-red-600 font-bold scale-105'
            : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Inicio</span>
      </button>

      {/* 🛍️ TIENDA RINOXPRESS */}
      <button
        id="bottom-nav-tienda"
        onClick={() => setActiveTab('tienda')}
        className={`flex flex-col items-center justify-center p-1 rounded-xl transition-all ${
          activeTab === 'tienda'
            ? 'text-red-600 font-extrabold scale-105'
            : 'text-red-600/80 hover:text-red-600 font-bold'
        }`}
      >
        <Store className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Tienda</span>
      </button>

      <button
        id="bottom-nav-catalogo"
        onClick={() => setActiveTab('catalogo')}
        className={`flex flex-col items-center justify-center p-1 rounded-xl transition-all ${
          activeTab === 'catalogo'
            ? 'text-red-600 font-bold scale-105'
            : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        <ShoppingBag className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Catálogo</span>
      </button>

      {/* Center Floating Cart Button */}
      <button
        id="bottom-nav-cart"
        onClick={onOpenCart}
        className="relative -mt-4 flex flex-col items-center justify-center w-12 h-12 rounded-full bg-red-600 text-white shadow-lg shadow-red-500/30 border-2 border-white transition-transform active:scale-95 shrink-0"
      >
        <ShoppingBag className="w-5 h-5" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-[9px] font-extrabold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white">
            {cartCount}
          </span>
        )}
      </button>

      <button
        id="bottom-nav-promociones"
        onClick={() => setActiveTab('promociones')}
        className={`flex flex-col items-center justify-center p-1 rounded-xl transition-all ${
          activeTab === 'promociones'
            ? 'text-red-600 font-bold scale-105'
            : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        <Sparkles className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Promos</span>
      </button>

      <button
        id="bottom-nav-sumate"
        onClick={() => setActiveTab('sumate')}
        className={`flex flex-col items-center justify-center p-1 rounded-xl transition-all ${
          activeTab === 'sumate'
            ? 'text-red-600 font-bold scale-105'
            : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        <Briefcase className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Sumate</span>
      </button>

      <button
        id="bottom-nav-cuenta"
        onClick={() => setActiveTab('cuenta')}
        className={`flex flex-col items-center justify-center p-1 rounded-xl transition-all ${
          activeTab === 'cuenta'
            ? 'text-red-600 font-bold scale-105'
            : 'text-gray-500 hover:text-gray-900'
        }`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">Cuenta</span>
      </button>
    </nav>
  );
};
