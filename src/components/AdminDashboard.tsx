import React, { useState } from 'react';
import { 
  Package, 
  Layers, 
  Sparkles, 
  ShoppingBag, 
  Users, 
  UserCheck, 
  Settings as SettingsIcon, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Send, 
  Eye, 
  Save, 
  RotateCcw, 
  ShieldAlert, 
  MessageCircle,
  Filter,
  DollarSign,
  TrendingUp,
  Tag
} from 'lucide-react';
import { 
  Product, 
  Category, 
  Promotion, 
  Order, 
  Lead, 
  AppUser, 
  AppSettings,
  OrderStatus 
} from '../types';
import { 
  formatCurrency, 
  generateWhatsAppUrl, 
  cleanWhatsAppNumber,
  getWhatsAppGeneralUrl, 
  getWhatsAppProductUrl, 
  getWhatsAppOrderUrl, 
  getWhatsAppBusinessUrl, 
  StorageService 
} from '../services/storageService';
import { FirebaseOrderService } from '../services/firebaseOrderService';
import { FirebasePromotionService } from '../services/firebasePromotionService';
import { Search, Calendar, Phone, MapPin, User as UserIcon } from 'lucide-react';

interface AdminDashboardProps {
  products: Product[];
  categories: Category[];
  promotions: Promotion[];
  orders: Order[];
  leads: Lead[];
  users: AppUser[];
  settings: AppSettings;
  onUpdateProducts: (products: Product[]) => void;
  onUpdateCategories: (categories: Category[]) => void;
  onUpdatePromotions: (promotions: Promotion[]) => void;
  onUpdateOrders: (orders: Order[]) => void;
  onUpdateLeads: (leads: Lead[]) => void;
  onUpdateUsers: (users: AppUser[]) => void;
  onUpdateSettings: (settings: AppSettings) => void;
  onResetFactoryData: () => void;
  onCloseAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  products,
  categories,
  promotions,
  orders,
  leads,
  users,
  settings,
  onUpdateProducts,
  onUpdateCategories,
  onUpdatePromotions,
  onUpdateOrders,
  onUpdateLeads,
  onUpdateUsers,
  onUpdateSettings,
  onResetFactoryData,
  onCloseAdmin
}) => {
  const [adminTab, setAdminTab] = useState<
    'resumen' | 'productos' | 'categorias' | 'promociones' | 'pedidos' | 'leads' | 'usuarios' | 'configuracion' | 'whatsapp'
  >('resumen');

  const [configSubTab, setConfigSubTab] = useState<'whatsapp' | 'general'>('whatsapp');

  // PRODUCT EDIT / CREATE STATE
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [prodForm, setProdForm] = useState<Partial<Product>>({});

  // CATEGORY EDIT / CREATE STATE
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [catForm, setCatForm] = useState<Partial<Category>>({});

  // PROMO EDIT / CREATE STATE
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
  const [isCreatingPromo, setIsCreatingPromo] = useState(false);
  const [promoForm, setPromoForm] = useState<Partial<Promotion>>({});

  // SETTINGS FORM STATE
  const [settingsForm, setSettingsForm] = useState<AppSettings>({ ...settings });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // SEARCH & FILTER
  const [adminSearch, setAdminSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('todos');
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [orderDateFilter, setOrderDateFilter] = useState('');
  const [selectedAdminOrderDetail, setSelectedAdminOrderDetail] = useState<Order | null>(null);

  // METRICS
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'Cancelado' ? o.total : 0), 0);
  const pendingOrdersCount = orders.filter(o => o.status === 'Pendiente').length;
  const newLeadsCount = leads.filter(l => l.status === 'Nuevo').length;

  // --- PRODUCT HANDLERS ---
  const handleOpenNewProduct = () => {
    setProdForm({
      id: 'prod-' + Date.now(),
      name: '',
      slug: '',
      categoryId: categories[0]?.id || 'cat-perfumes',
      categoryName: categories[0]?.name || 'Perfumes',
      fragrance: '',
      olfactoryFamily: 'Amaderado',
      size: '100 ml',
      availableSizes: ['100 ml'],
      price: 25000,
      originalPrice: 28000,
      isPromo: false,
      isFeatured: true,
      inStock: true,
      stockCount: 20,
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
      description: 'Fragancia fina elaborada con esencias puras para Rinoxpress Córdoba.',
      isActive: true
    });
    setIsCreatingProduct(true);
    setEditingProduct(null);
  };

  const handleEditProduct = (prod: Product) => {
    setProdForm({ ...prod });
    setEditingProduct(prod);
    setIsCreatingProduct(false);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodForm.name || !prodForm.price) {
      alert('Nombre y Precio son requeridos.');
      return;
    }

    const targetCategory = categories.find(c => c.id === prodForm.categoryId);

    const savedProd: Product = {
      id: prodForm.id || 'prod-' + Date.now(),
      name: prodForm.name || '',
      slug: (prodForm.name || '').toLowerCase().replace(/\s+/g, '-'),
      categoryId: prodForm.categoryId || categories[0]?.id || '',
      categoryName: targetCategory?.name || 'General',
      fragrance: prodForm.fragrance || 'Esencia Signature',
      olfactoryFamily: prodForm.olfactoryFamily || 'Amaderado',
      size: prodForm.size || '100 ml',
      availableSizes: prodForm.availableSizes || [prodForm.size || '100 ml'],
      price: Number(prodForm.price) || 0,
      originalPrice: prodForm.originalPrice ? Number(prodForm.originalPrice) : undefined,
      isPromo: !!prodForm.isPromo,
      promoDiscountPercent: prodForm.promoDiscountPercent ? Number(prodForm.promoDiscountPercent) : undefined,
      isFeatured: !!prodForm.isFeatured,
      isBestSeller: !!prodForm.isBestSeller,
      inStock: prodForm.inStock !== false,
      stockCount: Number(prodForm.stockCount) || 10,
      image: prodForm.image || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
      description: prodForm.description || '',
      isActive: prodForm.isActive !== false
    };

    const updated = StorageService.saveProduct(savedProd);
    onUpdateProducts(updated);
    setIsCreatingProduct(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (prodId: string) => {
    if (confirm('¿Eliminar este producto permanentemente?')) {
      const updated = StorageService.deleteProduct(prodId);
      onUpdateProducts(updated);
    }
  };

  const handleToggleProductActive = (prod: Product) => {
    const updated = StorageService.saveProduct({ ...prod, isActive: !prod.isActive });
    onUpdateProducts(updated);
  };

  // --- CATEGORY HANDLERS ---
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catForm.name) return;

    const savedCat: Category = {
      id: catForm.id || 'cat-' + Date.now(),
      name: catForm.name || '',
      slug: (catForm.name || '').toLowerCase().replace(/\s+/g, '-'),
      iconName: catForm.iconName || 'Sparkles',
      description: catForm.description || '',
      image: catForm.image || 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
      order: catForm.order || categories.length + 1,
      featured: true
    };

    const updated = StorageService.saveCategory(savedCat);
    onUpdateCategories(updated);
    setIsCreatingCategory(false);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (catId: string) => {
    if (confirm('¿Eliminar esta categoría?')) {
      const updated = StorageService.deleteCategory(catId);
      onUpdateCategories(updated);
    }
  };

  // --- PROMOTIONS HANDLERS ---
  const handleSavePromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoForm.title || !promoForm.promoPrice) return;

    const promoPrice = Number(promoForm.promoPrice) || 0;
    const originalPrice = Number(promoForm.originalPrice) || Math.round(promoPrice * 1.25);
    const discPercent = Number(promoForm.discountPercent) || Math.round(((originalPrice - promoPrice) / originalPrice) * 100) || 15;

    const savedPromo: Promotion = {
      id: promoForm.id || 'promo-' + Date.now(),
      title: promoForm.title || '',
      subtitle: promoForm.subtitle || '',
      description: promoForm.description || '',
      discountBadge: promoForm.discountBadge || `${discPercent}% OFF`,
      discountPercent: discPercent,
      originalPrice: originalPrice,
      promoPrice: promoPrice,
      finalPrice: promoPrice,
      image: promoForm.image || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
      bannerImage: promoForm.image || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
      productId: promoForm.productId || products[0]?.id,
      productIds: promoForm.productId ? [promoForm.productId] : (products[0] ? [products[0].id] : []),
      includedProductNames: promoForm.includedProductNames && promoForm.includedProductNames.length > 0
        ? promoForm.includedProductNames
        : ['1x Fragancia Premium Rinoxpress', '1x Presentación de Lujo', 'Garantía Oficial'],
      expiresAt: promoForm.expiresAt,
      validUntil: promoForm.validUntil || promoForm.expiresAt,
      isActive: promoForm.isActive !== false,
      isDemo: promoForm.isDemo || false
    };

    // Save to Firestore and StorageService
    await FirebasePromotionService.savePromotion(savedPromo);
    const updated = StorageService.savePromotion(savedPromo);
    onUpdatePromotions(updated);
    setIsCreatingPromo(false);
    setEditingPromo(null);
  };

  const handleDeletePromotion = async (promoId: string) => {
    if (confirm('¿Eliminar esta promoción definitivamente?')) {
      await FirebasePromotionService.deletePromotion(promoId);
      const updated = StorageService.deletePromotion(promoId);
      onUpdatePromotions(updated);
    }
  };

  // --- ORDER STATUS & WHATSAPP NOTIFICATION ---
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    // 1. Update Firestore in background
    try {
      await FirebaseOrderService.updateOrderStatus(orderId, newStatus);
    } catch (err) {
      console.warn('Firebase status update note:', err);
    }
    // 2. Update local state
    const updated = StorageService.updateOrderStatus(orderId, newStatus);
    onUpdateOrders(updated);
    if (selectedAdminOrderDetail && selectedAdminOrderDetail.id === orderId) {
      setSelectedAdminOrderDetail({ ...selectedAdminOrderDetail, status: newStatus });
    }
  };

  const handleSendOrderStatusWhatsApp = (order: Order) => {
    const custName = order.customer?.name || 'Cliente';
    const custPhone = order.customer?.phone || settings.whatsappNumber;
    const text = `Hola ${custName}! Te escribimos desde ${settings.companyName} para informarte sobre tu pedido *#${order.orderNumber}*:\n\nEstado actual: *${order.status.toUpperCase()}*\nTotal: ${formatCurrency(order.total)}\n\n¿Tenés alguna consulta adicional? ¡Estamos a tu disposición!`;
    const url = generateWhatsAppUrl(custPhone, text);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // --- LEAD STATUS ---
  const handleUpdateLeadStatus = (leadId: string, newStatus: Lead['status']) => {
    const updated = StorageService.updateLeadStatus(leadId, newStatus);
    onUpdateLeads(updated);
  };

  const handleContactLeadWhatsApp = (lead: Lead) => {
    const text = `Hola ${lead.fullName}! Te contactamos desde ${settings.companyName} en respuesta a tu consulta sobre *${lead.interestOption}*.\n\nNos encantaría contarte más detalles y enviarte nuestra propuesta comercial. ¿Cuándo te resultaría cómodo que coordinemos?`;
    const url = generateWhatsAppUrl(lead.phone, text);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // --- SETTINGS SAVE ---
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedSettings: AppSettings = {
      ...settingsForm,
      whatsappNumber: cleanWhatsAppNumber(settingsForm.whatsappNumber)
    };
    StorageService.saveSettings(sanitizedSettings);
    setSettingsForm(sanitizedSettings);
    onUpdateSettings(sanitizedSettings);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-6 text-left bg-white">
      {/* Top Header Bar */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-white" />
            <span>Panel de Control Administrativo</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Rinoxpress Córdoba • Gestión Central
          </h1>
        </div>

        <div className="flex items-center gap-3 self-stretch sm:self-auto justify-end">
          <button
            onClick={onCloseAdmin}
            className="px-5 py-2.5 rounded-xl bg-white text-red-700 hover:bg-gray-100 text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer"
          >
            Volver a la Tienda
          </button>
        </div>
      </div>

      {/* Nav Tabs for Admin */}
      <div className="flex overflow-x-auto gap-2 border-b border-gray-200 pb-3">
        {[
          { id: 'resumen', label: '📊 Resumen & Métricas' },
          { id: 'productos', label: `🛍️ Productos (${products.length})` },
          { id: 'categorias', label: `📁 Categorías (${categories.length})` },
          { id: 'promociones', label: `✨ Promociones (${promotions.length})` },
          { id: 'pedidos', label: `📦 Pedidos (${orders.length})` },
          { id: 'leads', label: `💼 Contactos / Leads (${leads.length})` },
          { id: 'usuarios', label: `👥 Usuarios (${users.length})` },
          { id: 'whatsapp', label: '💬 WhatsApp' },
          { id: 'configuracion', label: '⚙️ Configuración General' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setAdminTab(tab.id as any);
              if (tab.id === 'whatsapp') setConfigSubTab('whatsapp');
              if (tab.id === 'configuracion') setConfigSubTab('general');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
              adminTab === tab.id
                ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: RESUMEN / METRICS */}
      {adminTab === 'resumen' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#1C0409] border border-[#D4AF37]/30 shadow-lg space-y-2">
              <span className="text-xs text-[#D4AF37] font-bold uppercase tracking-wider block">
                Total Facturado (Órdenes)
              </span>
              <div className="text-2xl font-extrabold text-white">
                {formatCurrency(totalRevenue)}
              </div>
              <span className="text-[11px] text-[#4ADE80]">
                {orders.length} pedidos registrados
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#1C0409] border border-[#D4AF37]/30 shadow-lg space-y-2">
              <span className="text-xs text-[#D4AF37] font-bold uppercase tracking-wider block">
                Pedidos Pendientes
              </span>
              <div className="text-2xl font-extrabold text-[#FDE68A]">
                {pendingOrdersCount}
              </div>
              <span className="text-[11px] text-[#DDD2C6]">
                Requieren preparación o despacho
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#1C0409] border border-[#D4AF37]/30 shadow-lg space-y-2">
              <span className="text-xs text-[#D4AF37] font-bold uppercase tracking-wider block">
                Interesados en Negocio (Leads)
              </span>
              <div className="text-2xl font-extrabold text-white">
                {leads.length}
              </div>
              <span className="text-[11px] text-[#FDE68A]">
                {newLeadsCount} nuevos sin contactar
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-[#1C0409] border border-[#D4AF37]/30 shadow-lg space-y-2">
              <span className="text-xs text-[#D4AF37] font-bold uppercase tracking-wider block">
                Catálogo Activo
              </span>
              <div className="text-2xl font-extrabold text-white">
                {products.filter(p => p.isActive).length} / {products.length}
              </div>
              <span className="text-[11px] text-[#DDD2C6]">
                En {categories.length} categorías
              </span>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-[#1A0307] border border-[#D4AF37]/20 space-y-3">
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
                Acciones Rápidas
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    setAdminTab('productos');
                    handleOpenNewProduct();
                  }}
                  className="p-3 rounded-xl bg-black/40 hover:bg-[#500816] text-xs font-semibold text-white border border-[#D4AF37]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#D4AF37]" />
                  <span>Crear Producto</span>
                </button>
                <button
                  onClick={() => setAdminTab('pedidos')}
                  className="p-3 rounded-xl bg-black/40 hover:bg-[#500816] text-xs font-semibold text-white border border-[#D4AF37]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Package className="w-4 h-4 text-[#D4AF37]" />
                  <span>Ver Pedidos</span>
                </button>
                <button
                  onClick={() => setAdminTab('leads')}
                  className="p-3 rounded-xl bg-black/40 hover:bg-[#500816] text-xs font-semibold text-white border border-[#D4AF37]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Users className="w-4 h-4 text-[#D4AF37]" />
                  <span>Ver Leads ({leads.length})</span>
                </button>
                <button
                  onClick={() => setAdminTab('configuracion')}
                  className="p-3 rounded-xl bg-black/40 hover:bg-[#500816] text-xs font-semibold text-white border border-[#D4AF37]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <SettingsIcon className="w-4 h-4 text-[#D4AF37]" />
                  <span>Configuración</span>
                </button>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-[#1A0307] border border-[#D4AF37]/20 space-y-3">
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                WhatsApp Configurado
              </h3>
              <p className="text-xs text-[#DDD2C6]">
                Número comercial para recibir pedidos de clientes:
              </p>
              <div className="p-3 rounded-xl bg-black/60 border border-[#25D366]/40 text-[#25D366] font-bold text-sm">
                {settings.whatsappDisplayNumber} (ID: {settings.whatsappNumber})
              </div>
              <p className="text-[11px] text-[#A8988B]">
                Podés modificar este número en la pestaña de Configuración sin tocar el código.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTOS */}
      {adminTab === 'productos' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white font-display">
                Gestión de Productos ({products.length})
              </h2>
              <p className="text-xs text-[#C4B29E]">
                Crear, modificar precios, aromas, stock, imágenes y estado.
              </p>
            </div>

            <button
              onClick={handleOpenNewProduct}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#120205] font-extrabold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>NUEVO PRODUCTO</span>
            </button>
          </div>

          {/* Form Modal for Create / Edit Product */}
          {(isCreatingProduct || editingProduct) && (
            <div className="p-6 rounded-3xl bg-[#20040A] border-2 border-[#D4AF37] shadow-2xl space-y-5 animate-in slide-in-from-top-4 duration-200">
              <div className="flex justify-between items-center border-b border-[#D4AF37]/30 pb-3">
                <h3 className="text-lg font-bold text-white">
                  {isCreatingProduct ? 'Crear Nuevo Producto' : `Editar: ${editingProduct?.name}`}
                </h3>
                <button
                  onClick={() => {
                    setIsCreatingProduct(false);
                    setEditingProduct(null);
                  }}
                  className="p-1 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-[#E5D7B7] block mb-1">Nombre del Producto *</label>
                  <input
                    type="text"
                    required
                    value={prodForm.name || ''}
                    onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-[#D4AF37]/30 text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#E5D7B7] block mb-1">Categoría *</label>
                  <select
                    value={prodForm.categoryId || ''}
                    onChange={(e) => {
                      const cat = categories.find(c => c.id === e.target.value);
                      setProdForm({ ...prodForm, categoryId: e.target.value, categoryName: cat?.name || '' });
                    }}
                    className="w-full p-2.5 rounded-xl bg-[#1A0307] border border-[#D4AF37]/30 text-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#E5D7B7] block mb-1">Aroma / Fragancia Principal *</label>
                  <input
                    type="text"
                    required
                    value={prodForm.fragrance || ''}
                    onChange={(e) => setProdForm({ ...prodForm, fragrance: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-[#D4AF37]/30 text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#E5D7B7] block mb-1">Familia Olfativa</label>
                  <select
                    value={prodForm.olfactoryFamily || 'Amaderado'}
                    onChange={(e) => setProdForm({ ...prodForm, olfactoryFamily: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl bg-[#1A0307] border border-[#D4AF37]/30 text-white"
                  >
                    <option value="Amaderado">Amaderado</option>
                    <option value="Dulce / Gourmand">Dulce / Gourmand</option>
                    <option value="Cítrico">Cítrico</option>
                    <option value="Floral">Floral</option>
                    <option value="Fresco">Fresco</option>
                    <option value="Oriental / Especiado">Oriental / Especiado</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#E5D7B7] block mb-1">Precio Actual ($ ARS) *</label>
                  <input
                    type="number"
                    required
                    value={prodForm.price || ''}
                    onChange={(e) => setProdForm({ ...prodForm, price: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-[#D4AF37]/30 text-white font-bold"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#E5D7B7] block mb-1">Precio Anterior / Tachado ($ ARS)</label>
                  <input
                    type="number"
                    value={prodForm.originalPrice || ''}
                    onChange={(e) => setProdForm({ ...prodForm, originalPrice: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-[#D4AF37]/30 text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#E5D7B7] block mb-1">Tamaño / Presentación</label>
                  <input
                    type="text"
                    value={prodForm.size || ''}
                    onChange={(e) => setProdForm({ ...prodForm, size: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-[#D4AF37]/30 text-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#E5D7B7] block mb-1">Cantidad en Stock</label>
                  <input
                    type="number"
                    value={prodForm.stockCount || 10}
                    onChange={(e) => setProdForm({ ...prodForm, stockCount: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-[#D4AF37]/30 text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="font-bold text-[#E5D7B7] block mb-1">URL de la Imagen</label>
                  <input
                    type="url"
                    value={prodForm.image || ''}
                    onChange={(e) => setProdForm({ ...prodForm, image: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-[#D4AF37]/30 text-white font-mono text-[11px]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="font-bold text-[#E5D7B7] block mb-1">Descripción</label>
                  <textarea
                    rows={3}
                    value={prodForm.description || ''}
                    onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-[#D4AF37]/30 text-white resize-none"
                  />
                </div>

                <div className="md:col-span-2 flex flex-wrap gap-4 pt-2">
                  <label className="flex items-center gap-2 text-white font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!prodForm.isPromo}
                      onChange={(e) => setProdForm({ ...prodForm, isPromo: e.target.checked })}
                      className="rounded"
                    />
                    <span>Marcar como Promoción</span>
                  </label>

                  <label className="flex items-center gap-2 text-white font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!prodForm.isBestSeller}
                      onChange={(e) => setProdForm({ ...prodForm, isBestSeller: e.target.checked })}
                      className="rounded"
                    />
                    <span>Destacar como Más Vendido</span>
                  </label>

                  <label className="flex items-center gap-2 text-white font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prodForm.isActive !== false}
                      onChange={(e) => setProdForm({ ...prodForm, isActive: e.target.checked })}
                      className="rounded"
                    />
                    <span>Producto Activo en Tienda</span>
                  </label>
                </div>

                <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-[#D4AF37]/20">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreatingProduct(false);
                      setEditingProduct(null);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-black/40 text-gray-300 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#120205] font-extrabold"
                  >
                    Guardar Producto
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Products Table */}
          <div className="rounded-3xl bg-[#1A0307] border border-[#D4AF37]/20 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-[#E2D9D2]">
                <thead className="bg-[#2D060F] text-[#D4AF37] uppercase font-bold text-[10px] tracking-wider border-b border-[#D4AF37]/20">
                  <tr>
                    <th className="p-3.5">Producto</th>
                    <th className="p-3.5">Categoría</th>
                    <th className="p-3.5">Aroma / Familia</th>
                    <th className="p-3.5">Precio</th>
                    <th className="p-3.5">Stock</th>
                    <th className="p-3.5">Estado</th>
                    <th className="p-3.5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-lg object-cover border border-[#D4AF37]/20" />
                          <div>
                            <span className="font-bold text-white block">{prod.name}</span>
                            <span className="text-[10px] text-[#A8988B]">{prod.size}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 font-semibold text-[#D4AF37]">{prod.categoryName}</td>
                      <td className="p-3.5">{prod.fragrance}</td>
                      <td className="p-3.5 font-extrabold text-white">{formatCurrency(prod.price)}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${prod.inStock ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'}`}>
                          {prod.stockCount} u.
                        </span>
                      </td>
                      <td className="p-3.5">
                        <button
                          onClick={() => handleToggleProductActive(prod)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all ${
                            prod.isActive
                              ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-500/40'
                              : 'bg-gray-800 text-gray-400'
                          }`}
                        >
                          {prod.isActive ? 'Activo' : 'Inactivo'}
                        </button>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditProduct(prod)}
                            className="p-1.5 rounded-lg bg-black/40 hover:bg-[#500816] text-[#D4AF37] border border-[#D4AF37]/20 cursor-pointer"
                            title="Editar"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-1.5 rounded-lg bg-black/40 hover:bg-rose-950 text-rose-400 border border-rose-800/20 cursor-pointer"
                            title="Eliminar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CATEGORÍAS */}
      {adminTab === 'categorias' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white font-display">Categorías de Catálogo</h2>
            <button
              onClick={() => {
                setCatForm({
                  id: 'cat-' + Date.now(),
                  name: '',
                  slug: '',
                  iconName: 'Sparkles',
                  description: '',
                  image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
                  order: categories.length + 1
                });
                setIsCreatingCategory(true);
                setEditingCategory(null);
              }}
              className="px-4 py-2 rounded-xl bg-[#D4AF37] text-[#120205] font-bold text-xs uppercase cursor-pointer"
            >
              + Nueva Categoría
            </button>
          </div>

          {(isCreatingCategory || editingCategory) && (
            <form onSubmit={handleSaveCategory} className="p-6 rounded-3xl bg-[#20040A] border-2 border-[#D4AF37] space-y-4 text-xs">
              <h3 className="text-base font-bold text-white">{isCreatingCategory ? 'Crear Categoría' : 'Editar Categoría'}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#E5D7B7] block mb-1">Nombre</label>
                  <input
                    type="text"
                    required
                    value={catForm.name || ''}
                    onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-[#D4AF37]/30 text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#E5D7B7] block mb-1">URL Imagen</label>
                  <input
                    type="url"
                    value={catForm.image || ''}
                    onChange={(e) => setCatForm({ ...catForm, image: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-[#D4AF37]/30 text-white font-mono text-[11px]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-[#E5D7B7] block mb-1">Descripción</label>
                  <input
                    type="text"
                    value={catForm.description || ''}
                    onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-[#D4AF37]/30 text-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => { setIsCreatingCategory(false); setEditingCategory(null); }} className="px-4 py-2 text-gray-300">Cancelar</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#D4AF37] text-[#120205] font-bold">Guardar</button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="p-4 rounded-2xl bg-[#1A0307] border border-[#D4AF37]/20 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={cat.image} alt={cat.name} className="w-12 h-12 rounded-xl object-cover border border-[#D4AF37]/20" />
                  <div>
                    <h4 className="font-bold text-white text-sm">{cat.name}</h4>
                    <p className="text-[11px] text-[#A8988B] line-clamp-1">{cat.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => { setCatForm({ ...cat }); setEditingCategory(cat); setIsCreatingCategory(false); }}
                    className="p-1.5 text-[#D4AF37] hover:bg-white/10 rounded-lg cursor-pointer"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="p-1.5 text-rose-400 hover:bg-rose-950 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: PROMOCIONES */}
      {adminTab === 'promociones' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white font-display">Promociones Activas</h2>
            <button
              onClick={() => {
                setPromoForm({
                  id: 'promo-' + Date.now(),
                  title: '',
                  subtitle: '',
                  description: '',
                  discountBadge: '15% OFF',
                  discountPercent: 15,
                  originalPrice: 30000,
                  promoPrice: 25500,
                  image: products[0]?.image || '',
                  productId: products[0]?.id,
                  isActive: true
                });
                setIsCreatingPromo(true);
                setEditingPromo(null);
              }}
              className="px-4 py-2 rounded-xl bg-[#D4AF37] text-[#120205] font-bold text-xs uppercase cursor-pointer"
            >
              + Nueva Promoción
            </button>
          </div>

          {(isCreatingPromo || editingPromo) && (
            <form onSubmit={handleSavePromotion} className="p-6 rounded-3xl bg-[#20040A] border-2 border-[#D4AF37] space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">
                  {isCreatingPromo ? 'Crear Nueva Promoción' : `Editar Promoción: ${editingPromo?.title}`}
                </h3>
                {editingPromo?.isDemo && (
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-900/50 border border-amber-500/40 px-2 py-0.5 rounded">
                    Promoción DEMO de verificación
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#E5D7B7] block mb-1">Título de la Promoción *</label>
                  <input
                    type="text"
                    required
                    value={promoForm.title || ''}
                    onChange={(e) => setPromoForm({ ...promoForm, title: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-[#D4AF37]/30 text-white"
                    placeholder="Ej: Festival de Perfumería Fina"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#E5D7B7] block mb-1">Subtítulo / Bajada</label>
                  <input
                    type="text"
                    value={promoForm.subtitle || ''}
                    onChange={(e) => setPromoForm({ ...promoForm, subtitle: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-[#D4AF37]/30 text-white"
                    placeholder="Ej: Llevate tu Perfume con 20% OFF"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#E5D7B7] block mb-1">Precio Promocional ($ ARS) *</label>
                  <input
                    type="number"
                    required
                    value={promoForm.promoPrice || ''}
                    onChange={(e) => setPromoForm({ ...promoForm, promoPrice: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-[#D4AF37]/30 text-white font-bold"
                    placeholder="25000"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#E5D7B7] block mb-1">Precio Original / Tachado ($ ARS)</label>
                  <input
                    type="number"
                    value={promoForm.originalPrice || ''}
                    onChange={(e) => setPromoForm({ ...promoForm, originalPrice: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-[#D4AF37]/30 text-white"
                    placeholder="35000"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#E5D7B7] block mb-1">Etiqueta de Descuento (Badge)</label>
                  <input
                    type="text"
                    value={promoForm.discountBadge || ''}
                    onChange={(e) => setPromoForm({ ...promoForm, discountBadge: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-[#D4AF37]/30 text-white"
                    placeholder="Ej: 20% OFF"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#E5D7B7] block mb-1">URL de Imagen del Combo</label>
                  <input
                    type="url"
                    value={promoForm.image || ''}
                    onChange={(e) => setPromoForm({ ...promoForm, image: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-[#D4AF37]/30 text-white font-mono text-[11px]"
                    placeholder="https://..."
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-[#E5D7B7] block mb-1">Descripción de la Oferta</label>
                  <textarea
                    rows={2}
                    value={promoForm.description || ''}
                    onChange={(e) => setPromoForm({ ...promoForm, description: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-[#D4AF37]/30 text-white"
                    placeholder="Detalles de la promoción, aromas y beneficios..."
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-[#E5D7B7] block mb-1">Productos Incluidos (separados por coma)</label>
                  <input
                    type="text"
                    value={(promoForm.includedProductNames || []).join(', ')}
                    onChange={(e) => setPromoForm({
                      ...promoForm,
                      includedProductNames: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    })}
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-[#D4AF37]/30 text-white"
                    placeholder="1x Perfume Signature 100ml, 1x Difusor de Varillas, 1x Tester de Regalo"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => { setIsCreatingPromo(false); setEditingPromo(null); }} className="px-4 py-2 text-gray-300 hover:text-white">Cancelar</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#D4AF37] text-[#120205] font-bold uppercase tracking-wider">Guardar Promoción</button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {promotions.map((promo) => (
              <div key={promo.id} className={`p-5 rounded-2xl bg-[#1A0307] border flex flex-col justify-between space-y-3 ${
                promo.isDemo ? 'border-amber-400/60 ring-1 ring-amber-400/30' : 'border-[#D4AF37]/20'
              }`}>
                <div className="flex items-start gap-3">
                  <img src={promo.image || promo.bannerImage} alt={promo.title} className="w-16 h-16 rounded-xl object-cover border border-[#D4AF37]/20 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[#D4AF37] bg-[#500816] px-2 py-0.5 rounded">{promo.discountBadge || `${promo.discountPercent || 15}% OFF`}</span>
                      {promo.isDemo && (
                        <span className="text-[9px] font-extrabold text-amber-300 bg-amber-950/80 border border-amber-600/40 px-1.5 py-0.5 rounded">DEMO TEMPORAL</span>
                      )}
                    </div>
                    <h4 className="font-bold text-white text-base mt-1 truncate">{promo.title}</h4>
                    <p className="text-xs text-[#DDD2C6] line-clamp-1">{promo.subtitle}</p>
                    <p className="text-sm font-extrabold text-white mt-1">
                      {formatCurrency(promo.promoPrice || promo.finalPrice || 0)} <span className="text-xs line-through text-gray-500">{formatCurrency(promo.originalPrice || 0)}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-white/5 pt-2 text-xs">
                  <span className={promo.isActive !== false ? 'text-emerald-400 font-bold' : 'text-gray-500'}>
                    {promo.isActive !== false ? '● Activa' : '○ Pausada'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setPromoForm({ ...promo }); setEditingPromo(promo); setIsCreatingPromo(false); }}
                      className="px-3 py-1 bg-black/40 text-[#D4AF37] hover:bg-black/60 rounded-lg border border-[#D4AF37]/20 cursor-pointer"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeletePromotion(promo.id)}
                      className="px-3 py-1 bg-rose-950 text-rose-300 hover:bg-rose-900 rounded-lg cursor-pointer"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: PEDIDOS */}
      {adminTab === 'pedidos' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white font-display">Control de Pedidos ({orders.length})</h2>
              <p className="text-xs text-[#C4B29E]">Sincronización en tiempo real con Firebase Firestore. Gestión integral y seguimiento por WhatsApp.</p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Pendientes: {orders.filter(o => o.status === 'Pendiente').length}
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Finalizados: {orders.filter(o => o.status === 'Finalizado').length}
              </span>
            </div>
          </div>

          {/* Filters Bar: Search by number, name, phone + Status + Date */}
          <div className="p-4 rounded-2xl bg-[#1A0307] border border-[#D4AF37]/30 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Search by order number, name, phone */}
              <div className="lg:col-span-2 relative">
                <Search className="w-4 h-4 text-[#D4AF37] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar por Nº pedido (RX-...), nombre o teléfono..."
                  value={orderSearchTerm}
                  onChange={(e) => setOrderSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-black/60 border border-[#D4AF37]/30 text-white text-xs placeholder-[#A8988B] focus:outline-none focus:border-[#D4AF37]"
                />
                {orderSearchTerm && (
                  <button
                    onClick={() => setOrderSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <div className="relative">
                <Filter className="w-3.5 h-3.5 text-[#D4AF37] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 rounded-xl bg-black/60 border border-[#D4AF37]/30 text-white text-xs focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                >
                  <option value="todos">Todos los Estados</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Confirmado">Confirmado</option>
                  <option value="Preparando">Preparando</option>
                  <option value="Enviado">Enviado</option>
                  <option value="Finalizado">Finalizado</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </div>

              {/* Date Filter */}
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 text-[#D4AF37] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="date"
                  value={orderDateFilter}
                  onChange={(e) => setOrderDateFilter(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 rounded-xl bg-black/60 border border-[#D4AF37]/30 text-white text-xs focus:outline-none focus:border-[#D4AF37] cursor-pointer"
                  title="Filtrar por fecha exacta"
                />
                {orderDateFilter && (
                  <button
                    onClick={() => setOrderDateFilter('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    title="Limpiar fecha"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick status tabs */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-white/5">
              <span className="text-[11px] text-[#A8988B] mr-1">Filtro rápido:</span>
              {['todos', 'Pendiente', 'Confirmado', 'Preparando', 'Enviado', 'Finalizado', 'Cancelado'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    orderStatusFilter === st
                      ? 'bg-[#D4AF37] text-gray-950 shadow-xs'
                      : 'bg-black/40 text-[#DDD2C6] hover:bg-white/10'
                  }`}
                >
                  {st === 'todos' ? 'Todos' : st}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {orders
              .filter(o => {
                // Status filter
                if (orderStatusFilter !== 'todos' && o.status !== orderStatusFilter) {
                  return false;
                }
                // Date filter (YYYY-MM-DD)
                if (orderDateFilter) {
                  const orderDateStr = new Date(o.createdAt).toISOString().split('T')[0];
                  if (orderDateStr !== orderDateFilter) return false;
                }
                // Search term (orderNumber, customer name, customer phone)
                if (orderSearchTerm.trim()) {
                  const term = orderSearchTerm.toLowerCase().trim();
                  const numMatch = (o.orderNumber || '').toLowerCase().includes(term);
                  const nameMatch = (o.customerName || o.customer?.name || '').toLowerCase().includes(term);
                  const phoneMatch = (o.customerPhone || o.customer?.phone || '').toLowerCase().includes(term);
                  const cityMatch = (o.customerCity || o.customer?.city || '').toLowerCase().includes(term);
                  if (!numMatch && !nameMatch && !phoneMatch && !cityMatch) return false;
                }
                return true;
              })
              .map((ord) => (
                <div
                  key={ord.id}
                  className="p-5 sm:p-6 rounded-3xl bg-[#1A0307] border border-[#D4AF37]/30 shadow-xl space-y-4 hover:border-[#D4AF37]/60 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D4AF37]/20 pb-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-lg font-bold text-white font-brand">Pedido #{ord.orderNumber}</span>
                        <select
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as OrderStatus)}
                          className="px-3 py-1 rounded-xl text-xs font-extrabold bg-[#3D0611] text-[#FDE68A] border border-[#D4AF37]/50 cursor-pointer hover:bg-[#500816] transition-colors"
                        >
                          <option value="Pendiente">Pendiente</option>
                          <option value="Confirmado">Confirmado</option>
                          <option value="Preparando">Preparando</option>
                          <option value="Enviado">Enviado</option>
                          <option value="Finalizado">Finalizado</option>
                          <option value="Cancelado">Cancelado</option>
                        </select>
                      </div>
                      <p className="text-xs text-[#A8988B] mt-1 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                        {new Date(ord.createdAt).toLocaleDateString('es-AR')} a las {new Date(ord.createdAt).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })} hs
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="text-left sm:text-right">
                        <span className="text-xs text-[#D4AF37] block font-semibold">Total a Cobrar</span>
                        <span className="text-xl font-extrabold text-[#FDE68A]">{formatCurrency(ord.total)}</span>
                      </div>
                      
                      <button
                        onClick={() => setSelectedAdminOrderDetail(ord)}
                        className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Ver detalle completo"
                      >
                        <Eye className="w-4 h-4 text-[#D4AF37]" />
                        <span>Detalle</span>
                      </button>

                      <button
                        onClick={() => handleSendOrderStatusWhatsApp(ord)}
                        className="px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer active:scale-98 transition-transform"
                        title="Notificar por WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                        <span>Avisar Cliente</span>
                      </button>
                    </div>
                  </div>

                  {/* Customer and products quick preview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                      <span className="text-[#D4AF37] font-bold block uppercase tracking-wider text-[10px]">Datos del Cliente:</span>
                      <p className="text-white font-bold text-sm">{ord.customerName || ord.customer?.name || 'Cliente'}</p>
                      <p className="text-[#DDD2C6]">📱 {ord.customerPhone || ord.customer?.phone || 'Sin teléfono'}</p>
                      <p className="text-[#DDD2C6]">📍 {ord.customerCity || ord.customer?.city || 'Córdoba'}{ord.customerProvince || ord.customer?.province ? `, ${ord.customerProvince || ord.customer?.province}` : ''}</p>
                      {(ord.customerComments || ord.customer?.notes) && (
                        <p className="text-[#A8988B] italic bg-black/30 p-2 rounded-lg mt-1">
                          Nota: "{ord.customerComments || ord.customer?.notes}"
                        </p>
                      )}
                    </div>

                    <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
                      <span className="text-[#D4AF37] font-bold block uppercase tracking-wider text-[10px]">
                        Productos ({((ord.items || []).reduce((sum, it) => sum + (it.quantity || 1), 0))} unidades):
                      </span>
                      <div className="max-h-28 overflow-y-auto space-y-1 pr-1">
                        {(ord.items || []).map((it, idx) => {
                          const itemName = it.productName || it.name || 'Producto';
                          const unitPrice = it.unitPrice ?? it.price ?? 0;
                          return (
                            <div key={idx} className="flex justify-between items-center text-white py-0.5 border-b border-white/5 last:border-0">
                              <div>
                                <span className="font-semibold">{it.quantity}x {itemName}</span>
                                <span className="text-[10px] text-[#A8988B] block">
                                  {it.size || ''}{it.fragrance ? ` • ${it.fragrance}` : ''} ({formatCurrency(unitPrice)} c/u)
                                </span>
                              </div>
                              <span className="font-semibold text-right text-[#FDE68A]">
                                {formatCurrency(unitPrice * it.quantity)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            {orders.length === 0 && (
              <div className="p-12 text-center rounded-3xl bg-[#1A0307] border border-[#D4AF37]/30 space-y-3">
                <Package className="w-12 h-12 text-[#D4AF37]/50 mx-auto" />
                <h4 className="text-white font-bold text-base">No hay pedidos registrados</h4>
                <p className="text-xs text-[#A8988B]">Los pedidos que los clientes armen en la app aparecerán automáticamente aquí.</p>
              </div>
            )}
          </div>

          {/* Admin Order Detail Modal */}
          {selectedAdminOrderDetail && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
              <div className="bg-[#1A0307] rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#D4AF37]/40 overflow-hidden text-left text-white">
                <div className="p-5 sm:p-6 bg-gradient-to-r from-[#500816] to-[#1A0307] border-b border-[#D4AF37]/30 flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase font-extrabold tracking-widest text-[#D4AF37] block">
                      Detalle de Pedido (Firestore)
                    </span>
                    <h3 className="text-2xl font-bold text-white font-brand">
                      Pedido #{selectedAdminOrderDetail.orderNumber}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedAdminOrderDetail(null)}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
                  {/* Status update row */}
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[#A8988B] block text-[11px]">Estado actual:</span>
                      <span className="text-sm font-extrabold text-[#FDE68A]">{selectedAdminOrderDetail.status}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[#A8988B] text-[11px]">Modificar estado:</span>
                      <select
                        value={selectedAdminOrderDetail.status}
                        onChange={(e) => handleUpdateOrderStatus(selectedAdminOrderDetail.id, e.target.value as OrderStatus)}
                        className="px-3 py-1.5 rounded-xl text-xs font-extrabold bg-[#500816] text-[#FDE68A] border border-[#D4AF37]/50 cursor-pointer"
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="Confirmado">Confirmado</option>
                        <option value="Preparando">Preparando</option>
                        <option value="Enviado">Enviado</option>
                        <option value="Finalizado">Finalizado</option>
                        <option value="Cancelado">Cancelado</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer details */}
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                    <span className="text-[#D4AF37] font-bold uppercase tracking-wider text-[10px] block">
                      Datos del Comprador:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-white">
                      <div>
                        <span className="text-[#A8988B]">Nombre: </span>
                        <strong>{selectedAdminOrderDetail.customerName || selectedAdminOrderDetail.customer?.name || 'Cliente'}</strong>
                      </div>
                      <div>
                        <span className="text-[#A8988B]">Teléfono: </span>
                        <strong>{selectedAdminOrderDetail.customerPhone || selectedAdminOrderDetail.customer?.phone || 'Sin teléfono'}</strong>
                      </div>
                      <div>
                        <span className="text-[#A8988B]">Localidad: </span>
                        <strong>{selectedAdminOrderDetail.customerCity || selectedAdminOrderDetail.customer?.city || 'Córdoba'}</strong>
                      </div>
                      <div>
                        <span className="text-[#A8988B]">Provincia: </span>
                        <strong>{selectedAdminOrderDetail.customerProvince || selectedAdminOrderDetail.customer?.province || 'Córdoba'}</strong>
                      </div>
                      {(selectedAdminOrderDetail.customerComments || selectedAdminOrderDetail.customer?.notes) && (
                        <div className="sm:col-span-2 bg-black/30 p-2.5 rounded-xl border border-white/5 italic text-[#DDD2C6] mt-1">
                          Comentarios: "{selectedAdminOrderDetail.customerComments || selectedAdminOrderDetail.customer?.notes}"
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Items breakdown with unitPrice snapshot */}
                  <div className="space-y-2">
                    <span className="text-[#D4AF37] font-bold uppercase tracking-wider text-[10px] block">
                      Ítems Comprados (Precios Históricos Congelados):
                    </span>
                    <div className="space-y-2">
                      {selectedAdminOrderDetail.items?.map((it, idx) => {
                        const itemName = it.productName || it.name || 'Producto';
                        const unitPrice = it.unitPrice ?? it.price ?? 0;
                        const subtotal = it.subtotal ?? (unitPrice * it.quantity);
                        return (
                          <div key={idx} className="p-3 rounded-2xl bg-black/40 border border-white/5 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              {it.image && (
                                <img src={it.image} alt={itemName} className="w-10 h-10 rounded-xl object-cover border border-white/10" />
                              )}
                              <div>
                                <h5 className="font-bold text-white text-xs sm:text-sm">{itemName}</h5>
                                <p className="text-[11px] text-[#A8988B]">
                                  {it.size} {it.fragrance ? `• ${it.fragrance}` : ''}
                                </p>
                                <p className="text-[11px] text-[#DDD2C6]">
                                  {it.quantity} un. x {formatCurrency(unitPrice)}
                                </p>
                              </div>
                            </div>
                            <span className="font-extrabold text-[#FDE68A] text-sm">
                              {formatCurrency(subtotal)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-1.5">
                    <div className="flex justify-between text-[#A8988B]">
                      <span>Subtotal:</span>
                      <span className="text-white font-bold">{formatCurrency(selectedAdminOrderDetail.subtotal)}</span>
                    </div>
                    {selectedAdminOrderDetail.discount ? (
                      <div className="flex justify-between text-emerald-400">
                        <span>Descuento:</span>
                        <span>-{formatCurrency(selectedAdminOrderDetail.discount)}</span>
                      </div>
                    ) : null}
                    <div className="border-t border-white/10 pt-2 flex justify-between items-baseline">
                      <span className="font-bold text-[#D4AF37] text-sm uppercase">Total:</span>
                      <span className="text-2xl font-extrabold text-[#FDE68A]">{formatCurrency(selectedAdminOrderDetail.total)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#120205] border-t border-[#D4AF37]/20 flex items-center justify-between gap-3">
                  <button
                    onClick={() => setSelectedAdminOrderDetail(null)}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs cursor-pointer"
                  >
                    Cerrar
                  </button>

                  <button
                    onClick={() => handleSendOrderStatusWhatsApp(selectedAdminOrderDetail)}
                    className="px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                    <span>Contactar por WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 6: LEADS / CONTACTOS */}
      {adminTab === 'leads' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-xl font-bold text-white font-display">Interesados en Negocio Rinoxpress ({leads.length})</h2>
            <p className="text-xs text-[#C4B29E]">Personas que completaron el formulario "Quiero Información" para Dropshipping, Red o Franquicias.</p>
          </div>

          <div className="space-y-3">
            {leads.map((lead) => (
              <div key={lead.id} className="p-5 rounded-2xl bg-[#1A0307] border border-[#D4AF37]/30 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-white">{lead.fullName}</h4>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#500816] text-[#FDE68A] text-[10px] font-extrabold uppercase">
                      {lead.interestOption}
                    </span>
                  </div>
                  <p className="text-xs text-[#DDD2C6]">
                    📱 {lead.phone} • ✉️ {lead.email || 'Sin email'} • 📍 {lead.city}
                  </p>
                  {lead.message && (
                    <p className="text-xs text-[#A8988B] bg-black/40 p-2.5 rounded-xl border border-white/5 mt-1 italic">
                      "{lead.message}"
                    </p>
                  )}
                  <p className="text-[10px] text-gray-500">
                    Recibido: {new Date(lead.createdAt).toLocaleString('es-AR')}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 self-stretch sm:self-auto justify-end">
                  <select
                    value={lead.status}
                    onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value as any)}
                    className="px-3 py-1.5 rounded-xl bg-black/60 border border-[#D4AF37]/30 text-white text-xs"
                  >
                    <option value="Nuevo">Nuevo</option>
                    <option value="Contactado">Contactado</option>
                    <option value="Reunión Agendada">Reunión Agendada</option>
                    <option value="Cerrado">Cerrado</option>
                  </select>

                  <button
                    onClick={() => handleContactLeadWhatsApp(lead)}
                    className="px-4 py-2 rounded-xl bg-[#25D366] text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: USUARIOS */}
      {adminTab === 'usuarios' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="text-xl font-bold text-white font-display">Usuarios Registrados ({users.length})</h2>
            <p className="text-xs text-[#C4B29E]">Roles del sistema: Cliente, Integrante (Revendedor) y Administrador.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {users.map((u) => (
              <div key={u.id} className="p-5 rounded-2xl bg-[#1A0307] border border-[#D4AF37]/30 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#500816] text-[#FDE68A]">
                    {u.role}
                  </span>
                  <span className="text-[10px] text-gray-500">{u.registeredAt}</span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">{u.fullName}</h4>
                  <p className="text-xs text-[#DDD2C6]">{u.email}</p>
                  <p className="text-xs text-[#A8988B]">{u.phone}</p>
                  <p className="text-[11px] text-[#D4AF37]">{u.city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: WHATSAPP CONFIGURATION */}
      {(adminTab === 'whatsapp' || (adminTab === 'configuracion' && configSubTab === 'whatsapp')) && (
        <div className="max-w-4xl rounded-3xl bg-white border border-gray-200 p-6 sm:p-8 space-y-6 animate-in fade-in duration-200 text-left shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-extrabold uppercase tracking-wider mb-1.5">
                <MessageCircle className="w-3.5 h-3.5 fill-emerald-600 stroke-none" />
                <span>Configuración de WhatsApp Rinoxpress</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-950">
                Integración de WhatsApp (wa.me)
              </h2>
              <p className="text-xs text-gray-600 max-w-2xl mt-1">
                Configurá el número central y los mensajes predeterminados para cada punto de contacto. Todos los cambios se sincronizan en tiempo real con los botones de la tienda.
              </p>
            </div>

            {/* Quick Switch Subtab */}
            <div className="inline-flex p-1 bg-gray-100 rounded-xl border border-gray-200 self-stretch sm:self-auto">
              <button
                type="button"
                onClick={() => { setAdminTab('whatsapp'); setConfigSubTab('whatsapp'); }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 text-white shadow-xs"
              >
                💬 WhatsApp
              </button>
              <button
                type="button"
                onClick={() => { setAdminTab('configuracion'); setConfigSubTab('general'); }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-gray-700 hover:text-gray-950"
              >
                ⚙️ Empresa / General
              </button>
            </div>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
            {/* 1. WHATSAPP NUMBER */}
            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="font-extrabold text-emerald-950 text-sm flex items-center gap-1.5">
                    <span>Número de WhatsApp</span>
                    <span className="text-xs font-mono bg-emerald-200/80 text-emerald-900 px-2 py-0.5 rounded-md font-bold">
                      WHATSAPP_NUMBER
                    </span>
                  </label>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    Almacenado en formato internacional, sin espacios, guiones, paréntesis ni signo + (ej: <strong>5493518029702</strong> para Rinoxpress Córdoba).
                  </p>
                </div>

                {/* Live Direct wa.me test */}
                <a
                  href={`https://wa.me/${(settingsForm.whatsappNumber || '5493518029702').replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all whitespace-nowrap"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Probar Chat Directo</span>
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="font-bold text-gray-800 block mb-1">
                    Número Internacional (Para enlaces wa.me) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="5493518029702"
                    value={settingsForm.whatsappNumber || ''}
                    onChange={(e) => {
                      // Automatically clean input
                      const cleaned = e.target.value.replace(/[^0-9]/g, '');
                      setSettingsForm({ ...settingsForm, whatsappNumber: cleaned });
                    }}
                    className="w-full p-2.5 rounded-xl bg-white border border-emerald-300 text-gray-900 font-mono text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-[10px] text-emerald-700 mt-1 block">
                    Solo números. Enlace generado: <code className="bg-emerald-100 px-1 py-0.5 rounded text-emerald-950 font-mono">https://wa.me/{settingsForm.whatsappNumber || '5493518029702'}</code>
                  </span>
                </div>

                <div>
                  <label className="font-bold text-gray-800 block mb-1">
                    Número de Visualización (Para texto legible)
                  </label>
                  <input
                    type="text"
                    placeholder="+54 9 351 802-9702"
                    value={settingsForm.whatsappDisplayNumber || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappDisplayNumber: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-white border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-[10px] text-gray-500 mt-1 block">
                    Se muestra en el pie de página y datos de contacto de la tienda.
                  </span>
                </div>
              </div>
            </div>

            {/* 2. MENSAJES PREDETERMINADOS */}
            <div className="space-y-5">
              <h3 className="text-base font-extrabold text-gray-950 flex items-center gap-2 border-b border-gray-100 pb-2">
                <span>Plantillas de Mensajes Predeterminados</span>
              </h3>

              {/* General Message */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div>
                    <label className="font-bold text-gray-900 block text-xs">
                      1. Mensaje General (Botón Principal: "HABLÁ CON RINOXPRESS")
                    </label>
                    <p className="text-[11px] text-gray-500">
                      Mensaje enviado al tocar el botón principal de la tienda, cabecera o botón flotante.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const url = generateWhatsAppUrl(settingsForm.whatsappNumber, settingsForm.whatsappGeneralMessage || 'Hola Rinoxpress, quiero recibir información sobre sus productos.');
                      window.open(url, '_blank', 'noopener,noreferrer');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 text-[11px] font-bold flex items-center gap-1 self-start sm:self-auto cursor-pointer"
                  >
                    <Eye className="w-3 h-3 text-emerald-600" />
                    <span>Probar</span>
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={settingsForm.whatsappGeneralMessage || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsappGeneralMessage: e.target.value })}
                  placeholder="Hola Rinoxpress, quiero recibir información sobre sus productos."
                  className="w-full p-2.5 rounded-xl bg-white border border-gray-300 text-gray-900 text-xs focus:outline-none focus:border-emerald-500 resize-none font-medium"
                />
              </div>

              {/* Product Inquiry Message */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div>
                    <label className="font-bold text-gray-900 block text-xs">
                      2. Mensaje de Consulta de Producto (Botón: "CONSULTAR POR WHATSAPP")
                    </label>
                    <p className="text-[11px] text-gray-500">
                      Usá el marcador <code className="bg-red-50 text-red-700 font-bold px-1 py-0.5 rounded">[NOMBRE DEL PRODUCTO]</code> para reemplazarlo dinámicamente.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const sampleMsg = (settingsForm.whatsappProductMessage || 'Hola Rinoxpress, quiero consultar por el producto: [NOMBRE DEL PRODUCTO].')
                        .replace(/\[NOMBRE DEL PRODUCTO\]/g, 'Rino Aura 100ml');
                      const url = generateWhatsAppUrl(settingsForm.whatsappNumber, sampleMsg);
                      window.open(url, '_blank', 'noopener,noreferrer');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 text-[11px] font-bold flex items-center gap-1 self-start sm:self-auto cursor-pointer"
                  >
                    <Eye className="w-3 h-3 text-emerald-600" />
                    <span>Probar con Ejemplo</span>
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={settingsForm.whatsappProductMessage || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsappProductMessage: e.target.value })}
                  placeholder="Hola Rinoxpress, quiero consultar por el producto: [NOMBRE DEL PRODUCTO]."
                  className="w-full p-2.5 rounded-xl bg-white border border-gray-300 text-gray-900 text-xs focus:outline-none focus:border-emerald-500 resize-none font-medium"
                />
              </div>

              {/* Order Message */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div>
                    <label className="font-bold text-gray-900 block text-xs">
                      3. Mensaje de Pedido (Botón: "ENVIAR PEDIDO POR WHATSAPP")
                    </label>
                    <p className="text-[11px] text-gray-500">
                      Marcadores disponibles: <code className="bg-red-50 text-red-700 font-bold px-1 py-0.5 rounded">[ITEMS]</code> (lista de productos) y <code className="bg-red-50 text-red-700 font-bold px-1 py-0.5 rounded">[TOTAL]</code> (monto total).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const sampleMsg = (settingsForm.whatsappOrderMessage || 'Hola Rinoxpress, quiero realizar el siguiente pedido:\n\n[ITEMS]\n\nTotal: $[TOTAL]\n\nQuedo a la espera de confirmación.')
                        .replace(/\[ITEMS\]/g, '• Rino Aura 100ml x 1\n• Difusor Vainilla Bourbon x 2')
                        .replace(/\[TOTAL\]/g, '53.000');
                      const url = generateWhatsAppUrl(settingsForm.whatsappNumber, sampleMsg);
                      window.open(url, '_blank', 'noopener,noreferrer');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 text-[11px] font-bold flex items-center gap-1 self-start sm:self-auto cursor-pointer"
                  >
                    <Eye className="w-3 h-3 text-emerald-600" />
                    <span>Probar con Ejemplo</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={settingsForm.whatsappOrderMessage || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsappOrderMessage: e.target.value })}
                  placeholder={'Hola Rinoxpress, quiero realizar el siguiente pedido:\n\n[ITEMS]\n\nTotal: $[TOTAL]\n\nQuedo a la espera de confirmación.'}
                  className="w-full p-2.5 rounded-xl bg-white border border-gray-300 text-gray-900 text-xs focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              {/* Business / Sumate Message */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div>
                    <label className="font-bold text-gray-900 block text-xs">
                      4. Mensaje para Sumate a Rinoxpress (Botón: "QUIERO MÁS INFORMACIÓN")
                    </label>
                    <p className="text-[11px] text-gray-500">
                      Mensaje enviado al consultar por Dropshipping, Red de consumo o Franquicias.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const url = generateWhatsAppUrl(settingsForm.whatsappNumber, settingsForm.whatsappBusinessMessage || 'Hola Rinoxpress, quiero recibir información sobre las opciones para formar parte de Rinoxpress.');
                      window.open(url, '_blank', 'noopener,noreferrer');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800 text-[11px] font-bold flex items-center gap-1 self-start sm:self-auto cursor-pointer"
                  >
                    <Eye className="w-3 h-3 text-emerald-600" />
                    <span>Probar</span>
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={settingsForm.whatsappBusinessMessage || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsappBusinessMessage: e.target.value })}
                  placeholder="Hola Rinoxpress, quiero recibir información sobre las opciones para formar parte de Rinoxpress."
                  className="w-full p-2.5 rounded-xl bg-white border border-gray-300 text-gray-900 text-xs focus:outline-none focus:border-emerald-500 resize-none font-medium"
                />
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold uppercase tracking-wider shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>GUARDAR CONFIGURACIÓN DE WHATSAPP</span>
                </button>

                {settingsSaved && (
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    ¡Guardado con éxito!
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  if (confirm('¿Restablecer las plantillas de WhatsApp a los mensajes originales?')) {
                    setSettingsForm({
                      ...settingsForm,
                      whatsappGeneralMessage: 'Hola Rinoxpress, quiero recibir información sobre sus productos.',
                      whatsappProductMessage: 'Hola Rinoxpress, quiero consultar por el producto: [NOMBRE DEL PRODUCTO].',
                      whatsappOrderMessage: 'Hola Rinoxpress, quiero realizar el siguiente pedido:\n\n[ITEMS]\n\nTotal: $[TOTAL]\n\nQuedo a la espera de confirmación.',
                      whatsappBusinessMessage: 'Hola Rinoxpress, quiero recibir información sobre las opciones para formar parte de Rinoxpress.'
                    });
                  }
                }}
                className="text-xs text-gray-500 hover:text-red-600 underline cursor-pointer"
              >
                Restablecer plantillas predeterminadas
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 9: CONFIGURACIÓN GENERAL / EMPRESA */}
      {adminTab === 'configuracion' && configSubTab === 'general' && (
        <div className="max-w-4xl rounded-3xl bg-white border border-gray-200 p-6 sm:p-8 space-y-6 animate-in fade-in duration-200 text-left shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-950">
                Configuración General de Rinoxpress
              </h2>
              <p className="text-xs text-gray-600 mt-1">
                Datos de la empresa, showroom, redes sociales y Google Calendar.
              </p>
            </div>

            {/* Subtab Switch */}
            <div className="inline-flex p-1 bg-gray-100 rounded-xl border border-gray-200 self-stretch sm:self-auto">
              <button
                type="button"
                onClick={() => { setAdminTab('whatsapp'); setConfigSubTab('whatsapp'); }}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-gray-700 hover:text-gray-950"
              >
                💬 WhatsApp
              </button>
              <button
                type="button"
                onClick={() => setConfigSubTab('general')}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-red-600 text-white shadow-xs"
              >
                ⚙️ Empresa / General
              </button>
            </div>
          </div>

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-gray-800 block mb-1">Nombre Comercial</label>
                <input
                  type="text"
                  value={settingsForm.companyName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, companyName: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="font-bold text-gray-800 block mb-1">Slogan Oficial</label>
                <input
                  type="text"
                  value={settingsForm.slogan}
                  onChange={(e) => setSettingsForm({ ...settingsForm, slogan: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-gray-800 block mb-1">Enlace de Google Calendar para Reuniones</label>
                <input
                  type="url"
                  value={settingsForm.calendarUrl}
                  onChange={(e) => setSettingsForm({ ...settingsForm, calendarUrl: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 font-mono text-[11px] focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="font-bold text-gray-800 block mb-1">Horario de Atención</label>
                <input
                  type="text"
                  value={settingsForm.workingHours}
                  onChange={(e) => setSettingsForm({ ...settingsForm, workingHours: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="font-bold text-gray-800 block mb-1">Ubicación / Ciudad</label>
                <input
                  type="text"
                  value={settingsForm.city}
                  onChange={(e) => setSettingsForm({ ...settingsForm, city: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-red-600"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-gray-200">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold uppercase tracking-wider shadow-md shadow-red-500/20 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>GUARDAR CONFIGURACIÓN GENERAL</span>
              </button>

              {settingsSaved && (
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                  <Check className="w-4 h-4" />
                  ¡Configuración actualizada!
                </span>
              )}
            </div>
          </form>

          {/* Reset Demo Data Button */}
          <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-gray-900 text-xs">Restablecer Datos de Demostración</h4>
              <p className="text-[11px] text-gray-500">Vuelve a cargar todos los productos, categorías, mensajes y pedidos iniciales de fábrica.</p>
            </div>
            <button
              onClick={() => {
                if (confirm('¿Restablecer todos los datos iniciales de demostración?')) {
                  onResetFactoryData();
                }
              }}
              className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer Datos</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
