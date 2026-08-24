import React, { useState, useEffect } from 'react';
import { 
  Product, 
  Category, 
  Promotion, 
  Order, 
  Lead, 
  AppUser, 
  AppSettings, 
  CartItem, 
  BusinessOpportunity 
} from './types';
import { StorageService } from './services/storageService';
import { FirebaseOrderService } from './services/firebaseOrderService';
import { FirebasePromotionService } from './services/firebasePromotionService';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { HomeView } from './components/HomeView';
import { CatalogView } from './components/CatalogView';
import { PromotionsView } from './components/PromotionsView';
import { CartView } from './components/CartView';
import { BusinessView } from './components/BusinessView';
import { AccountView } from './components/AccountView';
import { AdminDashboard } from './components/AdminDashboard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ContactLeadModal } from './components/ContactLeadModal';
import { MeetingsModal } from './components/MeetingsModal';
import { StoreView } from './components/StoreView';
import { OfficeView } from './components/OfficeView';
import { Footer } from './components/Footer';

export function App() {
  // --- APPLICATION STATE ---
  const [activeTab, setActiveTab] = useState<string>('inicio');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [settings, setSettings] = useState<AppSettings>(StorageService.getSettings());
  const [opportunities, setOpportunities] = useState<BusinessOpportunity[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Navigation & Filter helper states
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [catalogSearchTerm, setCatalogSearchTerm] = useState<string>('');

  // Modals state
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
  const [leadInitialOption, setLeadInitialOption] = useState<string>('Dropshipping Rinoxpress');
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false);

  // Cart toast notification
  const [cartToast, setCartToast] = useState<{ message: string; visible: boolean }>({
    message: '',
    visible: false
  });

  // --- INITIAL DATA LOAD ---
  useEffect(() => {
    setProducts(StorageService.getProducts());
    setCategories(StorageService.getCategories());
    setPromotions(StorageService.getPromotions());
    setOrders(StorageService.getOrders());
    setLeads(StorageService.getLeads());
    setUsers(StorageService.getUsers());
    const curr = StorageService.getCurrentUser();
    setCurrentUser(curr);
    setSettings(StorageService.getSettings());
    setOpportunities(StorageService.getOpportunities());
    setCart(StorageService.getCart());

    // Seed test order RX-TEST-001 if needed and subscribe to Firestore orders
    FirebaseOrderService.seedTestOrderIfNotExists(curr?.id);
    const unsubscribeOrders = FirebaseOrderService.subscribeToAllOrders((liveOrders) => {
      setOrders(liveOrders);
    });

    // Seed and subscribe to live promotions from Firestore
    FirebasePromotionService.seedPromotionsIfEmpty().catch(console.warn);
    const unsubscribePromos = FirebasePromotionService.subscribeToPromotions((livePromos) => {
      setPromotions(livePromos);
    });

    return () => {
      unsubscribeOrders();
      unsubscribePromos();
    };
  }, []);

  // --- CART MANAGEMENT ---
  const handleAddToCart = (product: Product, size?: string) => {
    const chosenSize = size || product.size || '100 ml';
    const updated = StorageService.addToCart(product, 1, chosenSize);
    setCart(updated);

    // Trigger toast
    setCartToast({
      message: `¡${product.name} (${chosenSize}) agregado al pedido!`,
      visible: true
    });
    setTimeout(() => {
      setCartToast(prev => ({ ...prev, visible: false }));
    }, 2500);
  };

  const handleUpdateQuantity = (productId: string, quantity: number, size: string) => {
    const updated = StorageService.updateCartQuantity(productId, size, quantity);
    setCart(updated);
  };

  const handleRemoveFromCart = (productId: string, size: string) => {
    const updated = StorageService.removeFromCart(productId, size);
    setCart(updated);
  };

  const handleClearCart = () => {
    const updated = StorageService.clearCart();
    setCart(updated);
  };

  const handleOrderCreated = (order: Order) => {
    setOrders(prev => [order, ...prev]);
    setCart([]);
  };

  // --- LEAD MODAL HELPER ---
  const handleOpenLeadModal = (option?: string) => {
    if (option) {
      setLeadInitialOption(option);
    }
    setIsLeadModalOpen(true);
  };

  // --- NAVIGATION HELPER ---
  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCategoryFromHome = (categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setActiveTab('catalogo');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- FACTORY RESET ---
  const handleResetFactoryData = () => {
    StorageService.resetToFactoryData();
    setProducts(StorageService.getProducts());
    setCategories(StorageService.getCategories());
    setPromotions(StorageService.getPromotions());
    setOrders(StorageService.getOrders());
    setLeads(StorageService.getLeads());
    setUsers(StorageService.getUsers());
    setCurrentUser(StorageService.getCurrentUser());
    setSettings(StorageService.getSettings());
    setOpportunities(StorageService.getOpportunities());
    setCart([]);
    alert('Datos de fábrica restaurados con éxito.');
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-white text-gray-900 flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-bold text-gray-700">Cargando Rinoxpress Córdoba...</p>
        </div>
      </div>
    );
  }

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col selection:bg-red-600 selection:text-white">
      {/* 1. Global Navbar with Official Rinoxpress Logo */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        cartCount={cartTotalCount}
        onOpenCart={() => handleNavigate('pedido')}
        currentUser={currentUser}
        onOpenAccount={() => handleNavigate('cuenta')}
        onOpenAdmin={() => handleNavigate('admin')}
        onOpenSchedule={() => setIsMeetingModalOpen(true)}
        searchTerm={catalogSearchTerm}
        setSearchTerm={setCatalogSearchTerm}
      />

      {/* Cart Toast Notification */}
      {cartToast.visible && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top-4 duration-300">
          <div className="px-4 py-3 rounded-2xl bg-gray-900 text-white text-xs font-bold shadow-2xl flex items-center gap-2 border border-gray-700">
            <span className="text-red-500 font-extrabold">✓</span>
            <span>{cartToast.message}</span>
            <button
              onClick={() => handleNavigate('pedido')}
              className="ml-2 px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[10px] font-extrabold uppercase transition-colors"
            >
              Ver Pedido
            </button>
          </div>
        </div>
      )}

      {/* 2. Main Content Views */}
      <main className="flex-1 w-full pb-20 sm:pb-8">
        {/* VIEW: INICIO */}
        {activeTab === 'inicio' && (
          <HomeView
            products={products}
            categories={categories}
            promotions={promotions}
            settings={settings}
            onNavigateTab={handleNavigate}
            onSelectCategory={handleSelectCategoryFromHome}
            onAddToCart={handleAddToCart}
            onViewProductDetail={(p) => setDetailProduct(p)}
            onOpenSchedule={() => setIsMeetingModalOpen(true)}
            onOpenLeadModal={handleOpenLeadModal}
          />
        )}

        {/* VIEW: TIENDA RINOXPRESS (OFICIAL GATEWAY & EXPERIENCIA CENTRALIZADA) */}
        {activeTab === 'tienda' && (
          <StoreView
            onBackToHome={() => handleNavigate('inicio')}
            settings={settings}
          />
        )}

        {/* VIEW: MI OFICINA RINOXPRESS (OFICIAL GATEWAY) */}
        {(activeTab === 'oficina' || activeTab === 'mi-oficina') && (
          <OfficeView
            onBackToHome={() => handleNavigate('inicio')}
            onNavigateTab={handleNavigate}
            settings={settings}
          />
        )}

        {/* VIEW: CATÁLOGO */}
        {activeTab === 'catalogo' && (
          <CatalogView
            products={products}
            categories={categories}
            selectedCategoryId={selectedCategoryId}
            onSelectCategory={(catId) => setSelectedCategoryId(catId)}
            onAddToCart={handleAddToCart}
            onViewProductDetail={(p) => setDetailProduct(p)}
            settings={settings}
            searchTerm={catalogSearchTerm}
            setSearchTerm={setCatalogSearchTerm}
          />
        )}

        {/* VIEW: PROMOCIONES */}
        {activeTab === 'promociones' && (
          <PromotionsView
            promotions={promotions}
            products={products}
            onAddToCart={handleAddToCart}
            onNavigateTab={handleNavigate}
          />
        )}

        {/* VIEW: ARMAR PEDIDO / CARRITO */}
        {activeTab === 'pedido' && (
          <CartView
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveFromCart}
            onClearCart={handleClearCart}
            onContinueShopping={() => handleNavigate('catalogo')}
            currentUser={currentUser}
            settings={settings}
            onOrderCompleted={handleOrderCreated}
          />
        )}

        {/* VIEW: SUMATE A RINOXPRESS (DROPSHIPPING, RED, FRANQUICIAS) */}
        {activeTab === 'sumate' && (
          <BusinessView
            opportunities={opportunities}
            onOpenLeadModal={handleOpenLeadModal}
            onOpenSchedule={() => setIsMeetingModalOpen(true)}
            settings={settings}
          />
        )}

        {/* VIEW: MI CUENTA / ROLES */}
        {activeTab === 'cuenta' && (
          <AccountView
            currentUser={currentUser}
            onUpdateUser={(u) => {
              StorageService.saveCurrentUser(u);
              setCurrentUser(u);
            }}
            orders={orders}
            onOpenAdmin={() => handleNavigate('admin')}
            users={users}
            onSwitchUser={(u) => {
              StorageService.saveCurrentUser(u);
              setCurrentUser(u);
            }}
            settings={settings}
            onNavigateToCatalog={() => handleNavigate('catalogo')}
          />
        )}

        {/* VIEW: PANEL ADMINISTRATIVO */}
        {activeTab === 'admin' && (
          <AdminDashboard
            products={products}
            categories={categories}
            promotions={promotions}
            orders={orders}
            leads={leads}
            users={users}
            settings={settings}
            onUpdateProducts={(prods) => setProducts(prods)}
            onUpdateCategories={(cats) => setCategories(cats)}
            onUpdatePromotions={(promos) => setPromotions(promos)}
            onUpdateOrders={(ords) => setOrders(ords)}
            onUpdateLeads={(lds) => setLeads(lds)}
            onUpdateUsers={(usrs) => setUsers(usrs)}
            onUpdateSettings={(sets) => setSettings(sets)}
            onResetFactoryData={handleResetFactoryData}
            onCloseAdmin={() => handleNavigate('inicio')}
          />
        )}
      </main>

      {/* 3. Global Footer */}
      {activeTab !== 'admin' && (
        <Footer
          settings={settings}
          onNavigateTab={handleNavigate}
          onOpenSchedule={() => setIsMeetingModalOpen(true)}
          onOpenAdmin={() => handleNavigate('admin')}
        />
      )}

      {/* 4. Bottom Mobile Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        cartCount={cartTotalCount}
        onOpenCart={() => handleNavigate('pedido')}
      />

      {/* 5. Floating WhatsApp Button */}
      <FloatingWhatsApp settings={settings} />

      {/* 6. Product Detail Modal */}
      <ProductDetailModal
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
        onAddToCart={(p, qty, sz) => {
          for (let i = 0; i < qty; i++) {
            handleAddToCart(p, sz);
          }
        }}
        whatsappNumber={settings.whatsappNumber}
        companyName={settings.companyName}
      />

      {/* 7. Lead Contact Form Modal ("Quiero Información") */}
      <ContactLeadModal
        isOpen={isLeadModalOpen}
        onClose={() => setIsLeadModalOpen(false)}
        initialOption={leadInitialOption}
        settings={settings}
        onLeadSubmitted={(newLead) => setLeads(prev => [newLead, ...prev])}
      />

      {/* 8. Google Calendar Meeting Schedule Modal */}
      <MeetingsModal
        isOpen={isMeetingModalOpen}
        onClose={() => setIsMeetingModalOpen(false)}
        settings={settings}
      />
    </div>
  );
}

export default App;
