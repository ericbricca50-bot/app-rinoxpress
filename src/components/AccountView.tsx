import React, { useState, useEffect } from 'react';
import { 
  User, 
  Package, 
  Settings, 
  LogOut, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Save, 
  ShieldAlert, 
  KeyRound, 
  Flame,
  CheckCircle2,
  ExternalLink,
  Search,
  MessageCircle,
  X,
  ChevronRight,
  Eye,
  UserPlus,
  LogIn,
  ShoppingBag,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { AppUser, Order, OrderStatus, AppSettings } from '../types';
import { formatCurrency, generateWhatsAppUrl, StorageService } from '../services/storageService';
import { FirebaseOrderService } from '../services/firebaseOrderService';
import { RinoLogo } from './RinoLogo';

interface AccountViewProps {
  currentUser: AppUser | null;
  onUpdateUser: (user: AppUser) => void;
  orders: Order[];
  onOpenAdmin: () => void;
  users: AppUser[];
  onSwitchUser: (user: AppUser) => void;
  settings: AppSettings;
  onNavigateToCatalog?: () => void;
}

export const AccountView: React.FC<AccountViewProps> = ({
  currentUser,
  onUpdateUser,
  orders,
  onOpenAdmin,
  users,
  onSwitchUser,
  settings,
  onNavigateToCatalog
}) => {
  const [activeTab, setActiveTab] = useState<'perfil' | 'pedidos' | 'roles'>('pedidos');
  
  // Profile edit form
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [city, setCity] = useState(currentUser?.city || 'Córdoba Capital');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Detail Modal State
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Auth Modal State (Login / Register)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authCity, setAuthCity] = useState('Córdoba Capital');
  const [authError, setAuthError] = useState('');

  // User-specific orders from Firestore & Local
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Sync profile form when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setFullName(currentUser.fullName);
      setPhone(currentUser.phone);
      setEmail(currentUser.email);
      setCity(currentUser.city);
    }
  }, [currentUser]);

  // Load user orders from Firestore
  useEffect(() => {
    let isMounted = true;
    const fetchOrders = async () => {
      if (!currentUser) {
        setUserOrders([]);
        return;
      }
      setIsLoadingOrders(true);
      try {
        const fetched = await FirebaseOrderService.getUserOrders(currentUser.id, currentUser.phone);
        if (isMounted) {
          // If currentUser is Admin or Integrante, they can also see orders or their assigned orders
          // For customers, show orders where userId matches OR customer phone matches
          const filtered = currentUser.role === 'Administrador'
            ? fetched
            : fetched.filter(o => o.userId === currentUser.id || (currentUser.phone && o.customer?.phone?.includes(currentUser.phone)));
          setUserOrders(filtered);
        }
      } catch (err) {
        console.error('Error fetching user orders:', err);
      } finally {
        if (isMounted) setIsLoadingOrders(false);
      }
    };

    fetchOrders();

    return () => {
      isMounted = false;
    };
  }, [currentUser, orders]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const updated: AppUser = {
      ...currentUser,
      fullName,
      phone,
      email,
      city
    };
    onUpdateUser(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (authMode === 'login') {
      if (!authEmail.trim() && !authPhone.trim()) {
        setAuthError('Ingresá tu correo o teléfono para iniciar sesión');
        return;
      }

      // Find existing user or create instant session
      const existing = users.find(
        u => (authEmail && u.email.toLowerCase() === authEmail.toLowerCase().trim()) ||
             (authPhone && u.phone.includes(authPhone.trim()))
      );

      if (existing) {
        onSwitchUser(existing);
        setIsAuthModalOpen(false);
      } else {
        // Log in as new customer
        const newUser: AppUser = {
          id: `usr-${Date.now()}`,
          fullName: authName.trim() || 'Cliente Rinoxpress',
          email: authEmail.trim() || 'cliente@rinoxpress.com.ar',
          phone: authPhone.trim(),
          city: authCity.trim() || 'Córdoba Capital',
          role: 'Cliente',
          registeredAt: new Date().toISOString()
        };
        StorageService.saveUser(newUser);
        onSwitchUser(newUser);
        setIsAuthModalOpen(false);
      }
    } else {
      // Register
      if (!authName.trim() || (!authEmail.trim() && !authPhone.trim())) {
        setAuthError('Por favor completá tu nombre y al menos un método de contacto');
        return;
      }

      const newUser: AppUser = {
        id: `usr-${Date.now()}`,
        fullName: authName.trim(),
        email: authEmail.trim() || `${authName.toLowerCase().replace(/\s+/g, '')}@rinoxpress.com.ar`,
        phone: authPhone.trim(),
        city: authCity.trim() || 'Córdoba Capital',
        role: 'Cliente',
        registeredAt: new Date().toISOString()
      };

      StorageService.saveUser(newUser);
      onSwitchUser(newUser);
      setIsAuthModalOpen(false);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Pendiente':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Confirmado':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'Preparando':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'Enviado':
        return 'bg-indigo-100 text-indigo-900 border-indigo-300';
      case 'Finalizado':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Cancelado':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // WhatsApp Support Inquiry for specific order
  const handleConsultOrderWhatsApp = (order: Order) => {
    const text = `Hola Rinoxpress, quiero consultar por mi pedido #${order.orderNumber}.`;
    const destinationPhone = settings.whatsappNumber || '5493518029702';
    const url = generateWhatsAppUrl(destinationPhone, text);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8 text-left bg-white">
      {/* Account Header Banner with Official Logo */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-2 shadow-md flex items-center justify-center flex-shrink-0">
            <RinoLogo size="sm" variant="red" />
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {currentUser?.fullName || 'Mi Cuenta Rinoxpress'}
              </h1>
              {currentUser && (
                <span className="px-2.5 py-0.5 rounded-full bg-white text-red-700 text-[10px] font-extrabold uppercase tracking-wider">
                  {currentUser.role}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-red-100">
              {currentUser?.email || 'Iniciá sesión para acceder a tu historial y beneficios exclusivos'}
              {currentUser?.city ? ` • ${currentUser.city}` : ''}
            </p>
          </div>
        </div>

        {/* Action Buttons for Header */}
        <div className="flex flex-wrap items-center gap-2">
          {!currentUser ? (
            <button
              onClick={() => {
                setAuthMode('login');
                setIsAuthModalOpen(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-gray-100 text-red-700 font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Iniciar Sesión</span>
            </button>
          ) : (
            <>
              {(currentUser.role === 'Administrador' || currentUser.role === 'Integrante') && (
                <button
                  onClick={onOpenAdmin}
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-gray-100 text-red-700 font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Settings className="w-4 h-4 text-red-600" />
                  <span>Panel de Gestión</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('pedidos')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'pedidos'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Historial de Pedidos</span>
          {currentUser && userOrders.length > 0 && (
            <span className="px-2 py-0.2 rounded-full bg-red-100 text-red-700 text-xs font-bold">
              {userOrders.length}
            </span>
          )}
        </button>

        {currentUser && (
          <button
            onClick={() => setActiveTab('perfil')}
            className={`pb-3 px-4 text-sm font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'perfil'
                ? 'border-red-600 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Mi Perfil</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('roles')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'roles'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Simular Rol / Acceso</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: HISTORIAL DE PEDIDOS */}
      {/* ========================================================================= */}
      {activeTab === 'pedidos' && (
        <div className="space-y-6">
          {/* SECTION: IF CLIENT DOES NOT HAVE AN ACCOUNT */}
          {!currentUser ? (
            <div className="text-center py-12 px-6 rounded-3xl bg-gray-50 border-2 border-dashed border-gray-300 space-y-5 max-w-2xl mx-auto shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 mx-auto flex items-center justify-center shadow-inner">
                <KeyRound className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-gray-950">
                  Historial de Pedidos
                </h3>
                <p className="text-sm font-medium text-gray-600 max-w-md mx-auto">
                  Para consultar tu historial de pedidos, iniciá sesión o creá una cuenta.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  <span>INICIAR SESIÓN</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('register');
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white hover:bg-gray-100 border-2 border-gray-300 text-gray-800 font-bold text-xs uppercase tracking-wider shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4 text-red-600" />
                  <span>CREAR CUENTA</span>
                </button>
              </div>
            </div>
          ) : (
            /* SECTION: REGISTERED USER ORDER HISTORY */
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-gray-950">
                    Tus Pedidos en Rinoxpress ({userOrders.length})
                  </h3>
                  <p className="text-xs text-gray-500">
                    Sincronizados en tiempo real con Firebase Firestore. Ordenados del más reciente al más antiguo.
                  </p>
                </div>

                {onNavigateToCatalog && (
                  <button
                    onClick={onNavigateToCatalog}
                    className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs flex items-center gap-1.5 self-start cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4 text-red-600" />
                    <span>Armar Nuevo Pedido</span>
                  </button>
                )}
              </div>

              {isLoadingOrders ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-gray-500">Consultando Firestore...</p>
                </div>
              ) : userOrders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userOrders.map((order) => {
                    const totalProductsCount = (order.items || []).reduce((sum, it) => sum + (it.quantity || 1), 0);
                    const formattedDate = new Date(order.createdAt).toLocaleDateString('es-AR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    });

                    return (
                      <div 
                        key={order.id || order.orderNumber} 
                        className="p-5 sm:p-6 rounded-3xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 relative overflow-hidden"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-3">
                            <div>
                              <span className="text-sm sm:text-base font-extrabold text-gray-950 block">
                                Pedido #{order.orderNumber}
                              </span>
                              <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                {formattedDate}
                              </span>
                            </div>

                            <span className={`px-3 py-1 rounded-full text-xs font-extrabold border ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>

                          <div className="py-2 space-y-1.5">
                            <p className="text-xs font-semibold text-gray-600">
                              {totalProductsCount} {totalProductsCount === 1 ? 'producto' : 'productos'}
                            </p>

                            <p className="text-lg sm:text-xl font-extrabold text-red-600">
                              Total: {formatCurrency(order.total)}
                            </p>
                          </div>
                        </div>

                        {/* Button VER DETALLE */}
                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="w-full py-2.5 px-4 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-extrabold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Eye className="w-4 h-4 text-red-400" />
                            <span>VER DETALLE</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 px-6 rounded-3xl bg-gray-50 border border-gray-200 space-y-3">
                  <Package className="w-12 h-12 text-gray-300 mx-auto" />
                  <h4 className="font-bold text-gray-900 text-base">No registrás pedidos aún</h4>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    Cuando armes un pedido en la tienda y lo envíes por WhatsApp, quedará guardado automáticamente aquí en tu historial de Firestore.
                  </p>
                  {onNavigateToCatalog && (
                    <button
                      onClick={onNavigateToCatalog}
                      className="mt-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-2 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Explorar Catálogo</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: MI PERFIL */}
      {/* ========================================================================= */}
      {activeTab === 'perfil' && currentUser && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <form onSubmit={handleSaveProfile} className="p-6 sm:p-8 rounded-3xl bg-gray-50 border border-gray-200 space-y-4">
              <h3 className="text-lg font-bold text-gray-950">Datos Personales</h3>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Nombre y Apellido</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Teléfono / WhatsApp</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Ciudad / Localidad</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-900 text-sm focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-red-500/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar Cambios</span>
                </button>
                {savedSuccess && (
                  <span className="text-xs text-emerald-600 font-bold block mt-2">
                    ✓ Datos actualizados correctamente
                  </span>
                )}
              </div>
            </form>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-gray-50 border border-gray-200 space-y-3">
              <h4 className="text-sm font-bold text-gray-950 uppercase tracking-wider">Membresía Rinoxpress</h4>
              <p className="text-xs text-gray-600">
                Tu cuenta está habilitada para realizar pedidos directos vía WhatsApp, recibir promociones y consultar el catálogo con stock actualizado.
              </p>
              <div className="p-3.5 rounded-2xl bg-white border border-gray-200 flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-red-600 flex-shrink-0" />
                <div>
                  <span className="text-xs font-bold text-gray-900 block">Cuenta Activa ({currentUser.role})</span>
                  <span className="text-[11px] text-gray-500">Showroom Córdoba Oficial</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SIMULAR ROL */}
      {/* ========================================================================= */}
      {activeTab === 'roles' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gray-50 border border-gray-200 space-y-4">
          <h3 className="text-lg font-bold text-gray-950">Cambiar Rol / Cuenta de Prueba</h3>
          <p className="text-xs text-gray-600">
            Podés alternar entre diferentes perfiles preconfigurados para probar la experiencia de cliente, vendedor, franquiciado o administrador:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {users.map((u) => (
              <div
                key={u.id}
                onClick={() => onSwitchUser(u)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  currentUser?.id === u.id
                    ? 'bg-red-50 border-red-600 ring-2 ring-red-600 shadow-xs'
                    : 'bg-white border-gray-200 hover:border-red-400'
                }`}
              >
                <span className="text-[10px] uppercase font-extrabold text-red-600 block">{u.role}</span>
                <h4 className="font-bold text-sm text-gray-950 mt-1">{u.fullName}</h4>
                <p className="text-xs text-gray-500 truncate">{u.email}</p>
                <button
                  type="button"
                  className="mt-3 w-full py-1.5 rounded-lg bg-gray-100 text-gray-800 font-bold text-xs hover:bg-red-600 hover:text-white transition-colors"
                >
                  {currentUser?.id === u.id ? 'Rol Activo' : 'Seleccionar'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL: DETALLE DEL PEDIDO */}
      {/* ========================================================================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-gray-200 overflow-hidden text-left">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-red-600 to-red-800 text-white flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-red-200 block">
                  Comprobante Oficial
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                  Pedido #{selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
              {/* Status and Date */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-gray-50 border border-gray-200">
                <div>
                  <span className="text-gray-500 text-xs block">Fecha de Realización</span>
                  <span className="font-bold text-gray-900">
                    {new Date(selectedOrder.createdAt).toLocaleDateString('es-AR')} a las {new Date(selectedOrder.createdAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} hs
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-gray-500 text-xs block">Estado del Pedido</span>
                  <span className={`inline-block mt-0.5 px-3 py-1 rounded-full text-xs font-extrabold border ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                  👤 Datos del Cliente
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-800">
                  <div>
                    <span className="text-gray-500">Nombre: </span>
                    <strong className="text-gray-950">{selectedOrder.customerName || selectedOrder.customer?.name}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500">Teléfono: </span>
                    <strong className="text-gray-950">{selectedOrder.customerPhone || selectedOrder.customer?.phone || 'Sin registrar'}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500">Ciudad: </span>
                    <strong className="text-gray-950">{selectedOrder.customerCity || selectedOrder.customer?.city || 'Córdoba Capital'}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500">Provincia: </span>
                    <strong className="text-gray-950">{selectedOrder.customerProvince || selectedOrder.customer?.province || 'Córdoba'}</strong>
                  </div>
                  {(selectedOrder.customerComments || selectedOrder.customer?.notes) && (
                    <div className="sm:col-span-2 bg-white p-2.5 rounded-xl border border-gray-200 text-gray-700 italic mt-1">
                      Comentarios: "{selectedOrder.customerComments || selectedOrder.customer?.notes}"
                    </div>
                  )}
                </div>
              </div>

              {/* Products List */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                  🛍️ Productos ({selectedOrder.items?.length || 0})
                </span>

                <div className="space-y-2">
                  {selectedOrder.items?.map((item, idx) => {
                    const itemName = item.productName || item.name || 'Producto Rinoxpress';
                    const unitPrice = item.unitPrice ?? item.price ?? 0;
                    const subtotal = item.subtotal ?? (unitPrice * item.quantity);

                    return (
                      <div key={idx} className="p-3 rounded-2xl bg-white border border-gray-200 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={itemName}
                              className="w-12 h-12 rounded-xl object-cover border border-gray-100 flex-shrink-0"
                            />
                          )}
                          <div>
                            <h5 className="font-extrabold text-gray-950 text-xs sm:text-sm">{itemName}</h5>
                            <p className="text-[11px] text-gray-500">
                              {item.size} {item.fragrance ? `• ${item.fragrance}` : ''}
                            </p>
                            <p className="text-[11px] text-gray-600 font-semibold mt-0.5">
                              {item.quantity} un. x {formatCurrency(unitPrice)}
                            </p>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <span className="text-[10px] text-gray-400 block">Subtotal</span>
                          <span className="font-extrabold text-gray-950 text-xs sm:text-sm">
                            {formatCurrency(subtotal)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Financial Totals */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                <div className="flex justify-between text-xs text-gray-600">
                  <span className="font-semibold uppercase tracking-wider">Subtotal</span>
                  <span className="font-bold text-gray-900">{formatCurrency(selectedOrder.subtotal)}</span>
                </div>

                {selectedOrder.discount && selectedOrder.discount > 0 ? (
                  <div className="flex justify-between text-xs text-emerald-700 font-bold">
                    <span className="uppercase tracking-wider">Descuento aplicado</span>
                    <span>-{formatCurrency(selectedOrder.discount)}</span>
                  </div>
                ) : null}

                <div className="border-t border-gray-200 pt-2 flex justify-between items-baseline">
                  <span className="font-extrabold text-gray-950 uppercase tracking-wider text-sm">TOTAL</span>
                  <span className="text-2xl font-extrabold text-red-600">{formatCurrency(selectedOrder.total)}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer with CONSULTAR POR WHATSAPP */}
            <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs transition-colors cursor-pointer"
              >
                Cerrar
              </button>

              <button
                type="button"
                onClick={() => handleConsultOrderWhatsApp(selectedOrder)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
              >
                <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                <span>CONSULTAR POR WHATSAPP</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL: INICIAR SESIÓN / REGISTRO */}
      {/* ========================================================================= */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-200 text-left">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-gray-950">
                  {authMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {authMode === 'login' 
                    ? 'Accedé a tus pedidos guardados en Rinoxpress' 
                    : 'Registrate para guardar tus pedidos y recibir beneficios'}
                </p>
              </div>
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-bold border border-red-200">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Nombre y Apellido</label>
                <input
                  type="text"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  placeholder="Ej: Juan Pérez"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-sm focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Teléfono / WhatsApp</label>
                <input
                  type="tel"
                  value={authPhone}
                  onChange={(e) => setAuthPhone(e.target.value)}
                  placeholder="+54 9 351 123-4567"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-sm focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Correo Electrónico (opcional)</label>
                <input
                  type="email"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="tuemail@ejemplo.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-sm focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Ciudad</label>
                <input
                  type="text"
                  value={authCity}
                  onChange={(e) => setAuthCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-sm focus:outline-none focus:border-red-600"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md transition-colors cursor-pointer mt-2"
              >
                {authMode === 'login' ? 'INGRESAR' : 'REGISTRARME'}
              </button>
            </form>

            <div className="pt-2 text-center border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setAuthMode(authMode === 'login' ? 'register' : 'login');
                  setAuthError('');
                }}
                className="text-xs text-red-600 font-bold hover:underline cursor-pointer"
              >
                {authMode === 'login' 
                  ? '¿No tenés cuenta? Creá una acá' 
                  : '¿Ya tenés cuenta? Iniciá sesión'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
