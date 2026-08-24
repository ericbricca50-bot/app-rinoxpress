import React, { useState } from 'react';
import { 
  ShoppingBag, 
  User, 
  Bell, 
  Menu, 
  X, 
  Search, 
  Calendar, 
  Briefcase, 
  Sparkles, 
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { RinoLogo } from './RinoLogo';
import { AppUser } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  currentUser?: AppUser | null;
  onOpenAccount?: () => void;
  onOpenAdmin?: () => void;
  onOpenSchedule: () => void;
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  onOpenCart,
  currentUser,
  onOpenAccount,
  onOpenAdmin,
  onOpenSchedule,
  searchTerm = '',
  setSearchTerm
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const safeUser = currentUser || {
    id: 'guest',
    fullName: 'Mi Cuenta',
    email: 'contacto@rinoxpress.com.ar',
    phone: '',
    city: 'Córdoba Capital',
    role: 'Cliente' as const,
    registeredAt: '2026-01-01'
  };

  const notifications = [
    { id: '1', title: '¡Nuevas Fragancias 2026!', time: 'Hace 2 horas', desc: 'Descubrí la nueva línea Elvio Antonio y Rino Aura en 100ml.' },
    { id: '2', title: '15% OFF en Perfumería Fina', time: 'Hoy', desc: 'Promoción activa por tiempo limitado en toda la línea Rinoxpress.' },
    { id: '3', title: 'Reuniones de Franquicias', time: 'Disponible', desc: 'Cupos abiertos para apertura de islas y corners comerciales.' }
  ];

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo Oficial */}
          <div 
            onClick={() => handleNavClick('inicio')}
            className="cursor-pointer flex-shrink-0 flex items-center gap-3 py-1 group"
            id="brand-logo-trigger"
          >
            <RinoLogo size="sm" variant="red" />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest leading-none">
                Córdoba
              </span>
              <span className="text-[11px] font-medium text-red-600 mt-0.5">
                Aromas que dejan huella
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
            <button
              id="nav-link-inicio"
              onClick={() => handleNavClick('inicio')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'inicio'
                  ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                  : 'text-gray-700 hover:text-red-600 hover:bg-red-50/50'
              }`}
            >
              Inicio
            </button>

            {/* 🛍️ TIENDA RINOXPRESS (OFICIAL) */}
            <button
              id="nav-link-tienda"
              onClick={() => handleNavClick('tienda')}
              className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'tienda'
                  ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                  : 'text-red-600 hover:bg-red-50 font-bold border border-red-200'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Tienda Rinoxpress</span>
            </button>

            <button
              id="nav-link-catalogo"
              onClick={() => handleNavClick('catalogo')}
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'catalogo'
                  ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                  : 'text-gray-700 hover:text-red-600 hover:bg-red-50/50'
              }`}
            >
              Catálogo
            </button>

            <button
              id="nav-link-promociones"
              onClick={() => handleNavClick('promociones')}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'promociones'
                  ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                  : 'text-gray-700 hover:text-red-600 hover:bg-red-50/50'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Promociones</span>
            </button>

            <button
              id="nav-link-oficina"
              onClick={() => handleNavClick('oficina')}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'oficina'
                  ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                  : 'text-gray-700 hover:text-red-600 hover:bg-red-50/50'
              }`}
            >
              <span>🦏</span>
              <span>Mi Oficina</span>
            </button>

            <button
              id="nav-link-sumate"
              onClick={() => handleNavClick('sumate')}
              className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'sumate'
                  ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                  : 'text-gray-700 hover:text-red-600 hover:bg-red-50/50'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Sumate</span>
            </button>

            <button
              id="nav-link-agendar"
              onClick={onOpenSchedule}
              className="px-3 py-2 rounded-xl text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50/50 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-red-600" />
              <span>Agendar</span>
            </button>

            {safeUser.role === 'Administrador' && (
              <button
                id="nav-link-admin"
                onClick={onOpenAdmin}
                className={`px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 bg-gray-900 hover:bg-black text-white shadow-sm ${
                  activeTab === 'admin' ? 'ring-2 ring-red-600' : ''
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                <span>Admin</span>
              </button>
            )}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Search Trigger */}
            <div className="relative">
              <button
                id="btn-search-toggle"
                onClick={() => setShowSearch(!showSearch)}
                className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-red-600 transition-all cursor-pointer"
                title="Buscar producto"
              >
                <Search className="w-4 h-4" />
              </button>

              {showSearch && (
                <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-gray-200 rounded-2xl p-3.5 shadow-2xl z-50 animate-in fade-in-50">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar fragancias, aromas, tipos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
                      autoFocus
                      className="w-full pl-9 pr-8 py-2 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:border-red-600 focus:bg-white"
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm && setSearchTerm('')}
                        className="absolute right-2.5 top-2.5 text-xs text-gray-400 hover:text-gray-700"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <div className="mt-2.5 flex justify-between items-center text-[11px] text-gray-500 px-1">
                    <span>Filtro en tiempo real</span>
                    <button
                      onClick={() => {
                        setActiveTab('catalogo');
                        setShowSearch(false);
                      }}
                      className="text-red-600 hover:underline font-semibold"
                    >
                      Ir al catálogo
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                id="btn-notifications-toggle"
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-red-600 transition-all cursor-pointer relative"
                title="Notificaciones"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-600 ring-2 ring-white"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-2xl p-4 shadow-2xl z-50">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 mb-3">
                    <span className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-red-600" />
                      Novedades Rinoxpress
                    </span>
                    <span className="text-[10px] uppercase tracking-wider bg-red-50 text-red-700 px-2 py-0.5 rounded-full font-bold">
                      Córdoba
                    </span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 hover:border-red-200 transition-all">
                        <div className="flex justify-between items-center text-xs font-semibold text-gray-900">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-red-600">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-gray-600 mt-1 leading-snug">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => {
                      setActiveTab('promociones');
                      setShowNotifications(false);
                    }}
                    className="w-full mt-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-xs font-bold text-red-700 text-center transition-all cursor-pointer"
                  >
                    Ver todas las promociones
                  </button>
                </div>
              )}
            </div>

            {/* Account Quick Button */}
            <button
              id="btn-account-nav"
              onClick={onOpenAccount}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'cuenta' ? 'ring-2 ring-red-600 bg-red-50' : ''
              }`}
              title="Mi Cuenta"
            >
              <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {safeUser.fullName ? safeUser.fullName.charAt(0) : 'U'}
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-bold text-gray-900 leading-none truncate max-w-[110px]">
                  {safeUser.fullName ? safeUser.fullName.split(' ')[0] : 'Cuenta'}
                </span>
                <span className="text-[9px] text-red-600 font-semibold tracking-wider uppercase mt-0.5">
                  {safeUser.role}
                </span>
              </div>
            </button>

            {/* Cart Trigger Button */}
            <button
              id="btn-open-cart-nav"
              onClick={onOpenCart}
              className="relative p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-md shadow-red-500/20 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 text-white" />
              <span className="hidden sm:inline text-xs font-bold uppercase tracking-wider">Mi Pedido</span>
              {cartCount > 0 ? (
                <span className="bg-white text-red-600 text-xs font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                  {cartCount}
                </span>
              ) : (
                <span className="hidden sm:inline text-xs opacity-80">(0)</span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-gray-100 text-gray-800 hover:bg-gray-200"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="p-3 mb-3 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                {safeUser.fullName ? safeUser.fullName.charAt(0) : 'U'}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">{safeUser.fullName}</p>
                <p className="text-[10px] text-red-600 uppercase font-semibold">{safeUser.role}</p>
              </div>
            </div>
            <button
              onClick={() => {
                if (onOpenAccount) onOpenAccount();
                setMobileMenuOpen(false);
              }}
              className="text-xs text-red-600 font-semibold hover:underline cursor-pointer"
            >
              Mi cuenta
            </button>
          </div>

          <button
            onClick={() => handleNavClick('inicio')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between cursor-pointer ${
              activeTab === 'inicio' ? 'bg-red-600 text-white' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>🏠 Inicio</span>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>

          {/* 🛍️ TIENDA RINOXPRESS (OFICIAL) */}
          <button
            onClick={() => handleNavClick('tienda')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center justify-between cursor-pointer border ${
              activeTab === 'tienda' ? 'bg-red-600 text-white border-red-600' : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100/60'
            }`}
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-red-600 group-hover:text-white" />
              <span>🛍️ Tienda Rinoxpress (Oficial)</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-75" />
          </button>

          <button
            onClick={() => handleNavClick('catalogo')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between cursor-pointer ${
              activeTab === 'catalogo' ? 'bg-red-600 text-white' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>✨ Catálogo Rinoxpress</span>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>

          <button
            onClick={() => handleNavClick('promociones')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between cursor-pointer ${
              activeTab === 'promociones' ? 'bg-red-600 text-white' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>✨ Promociones Exclusivas</span>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>

          {/* 🦏 MI OFICINA RINOXPRESS */}
          <button
            onClick={() => handleNavClick('oficina')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between cursor-pointer ${
              activeTab === 'oficina' ? 'bg-red-600 text-white' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-2">
              <span>🦏</span>
              <span>Mi Oficina Rinoxpress</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>

          <button
            onClick={() => handleNavClick('sumate')}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold flex items-center justify-between cursor-pointer ${
              activeTab === 'sumate' ? 'bg-red-600 text-white' : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>💼 Sumate a Rinoxpress (Negocio)</span>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>

          <button
            onClick={() => {
              onOpenSchedule();
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-red-600" />
              <span>Agendar Reunión (Google Calendar)</span>
            </div>
            <ChevronRight className="w-4 h-4 opacity-50" />
          </button>

          {safeUser.role === 'Administrador' && (
            <button
              onClick={() => {
                if (onOpenAdmin) onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold bg-gray-900 text-white flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>Panel Administrativo</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
