import { 
  Product, 
  Category, 
  Promotion, 
  Order, 
  Lead, 
  AppUser, 
  AppSettings, 
  BusinessOpportunity,
  CartItem
} from '../types';
import { 
  INITIAL_SETTINGS, 
  INITIAL_CATEGORIES, 
  INITIAL_PRODUCTS, 
  INITIAL_PROMOTIONS, 
  INITIAL_BUSINESS_OPPORTUNITIES, 
  INITIAL_ORDERS, 
  INITIAL_LEADS, 
  DEMO_USERS 
} from '../data/initialData';

const STORAGE_KEYS = {
  SETTINGS: 'rinoxpress_settings_v1',
  CATEGORIES: 'rinoxpress_categories_v1',
  PRODUCTS: 'rinoxpress_products_v1',
  PROMOTIONS: 'rinoxpress_promotions_v1',
  BUSINESS_OPPS: 'rinoxpress_opportunities_v1',
  ORDERS: 'rinoxpress_orders_v1',
  LEADS: 'rinoxpress_leads_v1',
  USERS: 'rinoxpress_users_v1',
  CURRENT_USER: 'rinoxpress_current_user_v1',
  CART: 'rinoxpress_cart_v1'
};

// Safe JSON parser
function safeGet<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item || item === 'undefined' || item === 'null') {
      return fallback;
    }
    const parsed = JSON.parse(item);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch (e) {
    console.warn(`Error reading ${key} from storage:`, e);
    return fallback;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Error writing ${key} to storage:`, e);
  }
}

export const StorageService = {
  // SETTINGS
  getSettings(): AppSettings {
    const loaded = safeGet<AppSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    let shouldSave = false;
    // If it has the old dummy placeholder number or missing, migrate to official Rinoxpress number
    if (!loaded.whatsappNumber || loaded.whatsappNumber === '5493512345678') {
      loaded.whatsappNumber = WHATSAPP_NUMBER;
      loaded.whatsappDisplayNumber = '+54 9 351 802-9702';
      shouldSave = true;
    }
    // Update working hours if outdated or missing
    if (!loaded.workingHours || loaded.workingHours === 'Lunes a Sábados 09:00 a 20:00 hs') {
      loaded.workingHours = 'Lunes a Viernes 09:30 a 17:30 hs | Sábados 09:30 a 13:30 hs';
      shouldSave = true;
    }
    loaded.openingHours = loaded.workingHours;
    if (shouldSave) {
      this.saveSettings(loaded);
    }
    return loaded;
  },
  saveSettings(settings: AppSettings): void {
    safeSet(STORAGE_KEYS.SETTINGS, settings);
  },

  // CATEGORIES
  getCategories(): Category[] {
    return safeGet<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },
  saveCategories(categories: Category[]): void {
    safeSet(STORAGE_KEYS.CATEGORIES, categories);
  },
  saveCategory(cat: Category): Category[] {
    const categories = this.getCategories();
    const index = categories.findIndex(c => c.id === cat.id);
    if (index >= 0) {
      categories[index] = cat;
    } else {
      categories.push(cat);
    }
    this.saveCategories(categories);
    return categories;
  },
  deleteCategory(catId: string): Category[] {
    const categories = this.getCategories().filter(c => c.id !== catId);
    this.saveCategories(categories);
    return categories;
  },

  // PRODUCTS
  getProducts(): Product[] {
    return safeGet<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },
  saveProducts(products: Product[]): void {
    safeSet(STORAGE_KEYS.PRODUCTS, products);
  },
  saveProduct(prod: Product): Product[] {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === prod.id);
    if (index >= 0) {
      products[index] = prod;
    } else {
      products.unshift(prod);
    }
    this.saveProducts(products);
    return products;
  },
  deleteProduct(prodId: string): Product[] {
    const products = this.getProducts().filter(p => p.id !== prodId);
    this.saveProducts(products);
    return products;
  },

  // PROMOTIONS
  getPromotions(): Promotion[] {
    return safeGet<Promotion[]>(STORAGE_KEYS.PROMOTIONS, INITIAL_PROMOTIONS);
  },
  savePromotions(promos: Promotion[]): void {
    safeSet(STORAGE_KEYS.PROMOTIONS, promos);
  },
  savePromotion(promo: Promotion): Promotion[] {
    const promos = this.getPromotions();
    const index = promos.findIndex(p => p.id === promo.id);
    if (index >= 0) {
      promos[index] = promo;
    } else {
      promos.unshift(promo);
    }
    this.savePromotions(promos);
    return promos;
  },
  deletePromotion(promoId: string): Promotion[] {
    const promos = this.getPromotions().filter(p => p.id !== promoId);
    this.savePromotions(promos);
    return promos;
  },

  // BUSINESS OPPORTUNITIES
  getOpportunities(): BusinessOpportunity[] {
    return safeGet<BusinessOpportunity[]>(STORAGE_KEYS.BUSINESS_OPPS, INITIAL_BUSINESS_OPPORTUNITIES);
  },
  getBusinessOpportunities(): BusinessOpportunity[] {
    return this.getOpportunities();
  },
  saveBusinessOpportunities(opps: BusinessOpportunity[]): void {
    safeSet(STORAGE_KEYS.BUSINESS_OPPS, opps);
  },

  // CART PERSISTENCE
  getCart(): CartItem[] {
    const raw = safeGet<CartItem[]>(STORAGE_KEYS.CART, []);
    if (!Array.isArray(raw)) return [];
    return raw.filter(
      item => item && item.product && typeof item.product === 'object' && item.product.id && item.product.name
    );
  },
  saveCart(cart: CartItem[]): void {
    safeSet(STORAGE_KEYS.CART, cart);
  },
  addToCart(product: Product, quantity = 1, size = '100 ml'): CartItem[] {
    const cart = this.getCart();
    const existingIndex = cart.findIndex(
      item => item.product?.id === product.id && item.selectedSize === size
    );

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        product,
        quantity,
        selectedSize: size
      });
    }
    this.saveCart(cart);
    return cart;
  },
  updateCartQuantity(productId: string, size: string, quantity: number): CartItem[] {
    let cart = this.getCart();
    if (quantity <= 0) {
      cart = cart.filter(item => !(item.product?.id === productId && item.selectedSize === size));
    } else {
      const item = cart.find(i => i.product?.id === productId && i.selectedSize === size);
      if (item) {
        item.quantity = quantity;
      }
    }
    this.saveCart(cart);
    return cart;
  },
  removeFromCart(productId: string, size: string): CartItem[] {
    const cart = this.getCart().filter(
      item => !(item.product?.id === productId && item.selectedSize === size)
    );
    this.saveCart(cart);
    return cart;
  },
  clearCart(): CartItem[] {
    this.saveCart([]);
    return [];
  },

  // ORDERS
  getOrders(): Order[] {
    const raw = safeGet<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    if (!Array.isArray(raw)) return INITIAL_ORDERS;
    return raw.map(o => {
      // Normalize legacy order items if necessary
      const customer = o.customer || {
        name: 'Cliente Rinoxpress',
        phone: '',
        city: 'Córdoba Capital',
        province: 'Córdoba',
        pickupOrDelivery: 'delivery'
      };
      const items = Array.isArray(o.items)
        ? o.items.map((it: any) => ({
            productId: it.productId || it.product?.id || 'prod-1',
            name: it.name || it.product?.name || 'Producto Rinoxpress',
            quantity: it.quantity || 1,
            price: it.price ?? it.product?.price ?? 0,
            originalPrice: it.originalPrice ?? it.product?.originalPrice,
            isPromo: it.isPromo ?? it.product?.isPromo,
            size: it.size || it.selectedSize || '100 ml',
            fragrance: it.fragrance || it.product?.fragrance || '',
            image: it.image || it.product?.image || ''
          }))
        : [];
      return {
        ...o,
        customer,
        items
      };
    });
  },
  saveOrders(orders: Order[]): void {
    safeSet(STORAGE_KEYS.ORDERS, orders);
  },
  addOrder(order: Order): Order[] {
    const orders = this.getOrders();
    orders.unshift(order);
    this.saveOrders(orders);
    return orders;
  },
  updateOrderStatus(orderId: string, status: Order['status']): Order[] {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      this.saveOrders(orders);
    }
    return orders;
  },

  // LEADS
  getLeads(): Lead[] {
    return safeGet<Lead[]>(STORAGE_KEYS.LEADS, INITIAL_LEADS);
  },
  saveLeads(leads: Lead[]): void {
    safeSet(STORAGE_KEYS.LEADS, leads);
  },
  addLead(lead: Lead): Lead[] {
    const leads = this.getLeads();
    leads.unshift(lead);
    this.saveLeads(leads);
    return leads;
  },
  updateLeadStatus(leadId: string, status: Lead['status']): Lead[] {
    const leads = this.getLeads();
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      lead.status = status;
      this.saveLeads(leads);
    }
    return leads;
  },

  // USERS
  getUsers(): AppUser[] {
    return safeGet<AppUser[]>(STORAGE_KEYS.USERS, DEMO_USERS);
  },
  saveUsers(users: AppUser[]): void {
    safeSet(STORAGE_KEYS.USERS, users);
  },
  saveUser(user: AppUser): AppUser[] {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    this.saveUsers(users);
    this.saveCurrentUser(user);
    return users;
  },
  getCurrentUser(): AppUser {
    const user = safeGet<AppUser | null>(STORAGE_KEYS.CURRENT_USER, null);
    if (user && typeof user === 'object' && user.role && user.fullName) {
      return user;
    }
    const defaultUser = DEMO_USERS[2]; // Default client Lucía
    this.setCurrentUser(defaultUser);
    return defaultUser;
  },
  setCurrentUser(user: AppUser): void {
    safeSet(STORAGE_KEYS.CURRENT_USER, user);
  },
  saveCurrentUser(user: AppUser): void {
    this.setCurrentUser(user);
  },

  // RESET TO FACTORY DEMO DATA
  resetToDefault(): void {
    safeSet(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
    safeSet(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    safeSet(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    safeSet(STORAGE_KEYS.PROMOTIONS, INITIAL_PROMOTIONS);
    safeSet(STORAGE_KEYS.BUSINESS_OPPS, INITIAL_BUSINESS_OPPORTUNITIES);
    safeSet(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    safeSet(STORAGE_KEYS.LEADS, INITIAL_LEADS);
    safeSet(STORAGE_KEYS.USERS, DEMO_USERS);
    safeSet(STORAGE_KEYS.CURRENT_USER, DEMO_USERS[2]);
    safeSet(STORAGE_KEYS.CART, []);
  },
  resetToFactoryData(): void {
    this.resetToDefault();
  }
};

// HELPERS
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(amount);
}

export const WHATSAPP_NUMBER = '5493518029702';

export function cleanWhatsAppNumber(phone?: string): string {
  if (!phone) return WHATSAPP_NUMBER;
  const cleaned = phone.replace(/[^0-9]/g, '');
  return cleaned || WHATSAPP_NUMBER;
}

export function generateWhatsAppUrl(phone: string, text: string): string {
  const cleanPhone = cleanWhatsAppNumber(phone);
  const encodedText = encodeURIComponent(text.trim());
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

export function getWhatsAppGeneralUrl(settings?: AppSettings): string {
  const currentSettings = settings || StorageService.getSettings();
  const phone = currentSettings.whatsappNumber || WHATSAPP_NUMBER;
  const message = currentSettings.whatsappGeneralMessage || 'Hola Rinoxpress, quiero recibir información sobre sus productos.';
  return generateWhatsAppUrl(phone, message);
}

export function getWhatsAppProductUrl(productName: string, settings?: AppSettings): string {
  const currentSettings = settings || StorageService.getSettings();
  const phone = currentSettings.whatsappNumber || WHATSAPP_NUMBER;
  let template = currentSettings.whatsappProductMessage || 'Hola Rinoxpress, quiero consultar por el producto: [NOMBRE DEL PRODUCTO].';
  
  // Replace tokens if present
  if (template.includes('[NOMBRE DEL PRODUCTO]')) {
    template = template.replace(/\[NOMBRE DEL PRODUCTO\]/g, productName);
  } else if (template.includes('[PRODUCTO]')) {
    template = template.replace(/\[PRODUCTO\]/g, productName);
  } else {
    template = `${template} (${productName})`;
  }
  
  return generateWhatsAppUrl(phone, template);
}

export interface FormattedWhatsAppOrderParams {
  orderNumber: string; // e.g. "RX-0001"
  items: Array<{
    name: string;
    size?: string;
    fragrance?: string;
    quantity: number;
    price: number;
    subtotal?: number;
  }>;
  total: number;
  customer: {
    name: string;
    phone: string;
    city: string;
    province: string;
    notes?: string;
  };
  settings?: AppSettings;
}

export function generateNextOrderNumber(existingOrders?: Order[]): string {
  const orders = existingOrders || StorageService.getOrders();
  let maxNum = 0;
  orders.forEach(o => {
    if (o.orderNumber) {
      const match = o.orderNumber.replace(/[^0-9]/g, '');
      if (match) {
        const num = parseInt(match, 10);
        if (!isNaN(num) && num > maxNum) {
          maxNum = num;
        }
      }
    }
  });

  // If previous numbers exist, increment; otherwise start at 1
  const nextNum = maxNum >= 1000 ? maxNum + 1 : (maxNum === 0 ? 1 : maxNum + 1);
  const padded = String(nextNum).padStart(4, '0');
  return `RX-${padded}`;
}

export function buildWhatsAppOrderMessage(params: FormattedWhatsAppOrderParams): string {
  const { orderNumber, items, total, customer } = params;
  const cleanOrderNumber = orderNumber.startsWith('RX-') ? orderNumber : `RX-${orderNumber}`;

  // Formato exacto requerido:
  // [PRODUCTO]
  // Cantidad: [CANTIDAD]
  // Precio unitario: $[PRECIO]
  // Subtotal: $[SUBTOTAL]
  const itemsText = items
    .map(item => {
      const sub = item.subtotal ?? (item.price * item.quantity);
      const details: string[] = [];
      if (item.size) details.push(item.size);
      if (item.fragrance) details.push(`Aroma: ${item.fragrance}`);
      
      const productTitle = details.length > 0
        ? `*${item.name}* (${details.join(' • ')})`
        : `*${item.name}*`;

      return `${productTitle}\nCantidad: ${item.quantity}\nPrecio unitario: $${item.price.toLocaleString('es-AR')}\nSubtotal: $${sub.toLocaleString('es-AR')}`;
    })
    .join('\n\n');

  const formattedTotal = total.toLocaleString('es-AR');
  const comentarios = customer.notes && customer.notes.trim() ? customer.notes.trim() : 'Ninguno';

  return `🦏 *PEDIDO RINOXPRESS #${cleanOrderNumber}*

Hola Rinoxpress, quiero realizar el siguiente pedido:

━━━━━━━━━━━━━━

${itemsText}

━━━━━━━━━━━━━━

*TOTAL: $${formattedTotal}*

👤 *DATOS DEL CLIENTE*

Nombre: ${customer.name}
Teléfono: ${customer.phone}
Localidad: ${customer.city}
Provincia: ${customer.province}

📝 Comentarios:
${comentarios}

¡Gracias!`;
}

export interface OrderItemSummary {
  name: string;
  quantity: number;
  size?: string;
  fragrance?: string;
  price?: number;
}

export interface OrderCustomerSummary {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  province?: string;
  deliveryType?: string;
  notes?: string;
}

export function getWhatsAppOrderUrl(
  items: OrderItemSummary[],
  total: number,
  customer?: OrderCustomerSummary,
  settings?: AppSettings,
  orderNumber?: string
): string {
  const currentSettings = settings || StorageService.getSettings();
  const phone = currentSettings.whatsappNumber || WHATSAPP_NUMBER;
  const num = orderNumber || generateNextOrderNumber();

  const formattedCustomer = {
    name: customer?.name || 'Cliente',
    phone: customer?.phone || 'No especificado',
    city: customer?.city || 'Córdoba Capital',
    province: customer?.province || 'Córdoba',
    notes: customer?.notes || ''
  };

  const formattedItems = items.map(i => ({
    name: i.name,
    size: i.size,
    fragrance: i.fragrance,
    quantity: i.quantity,
    price: i.price || 0,
    subtotal: (i.price || 0) * i.quantity
  }));

  const message = buildWhatsAppOrderMessage({
    orderNumber: num,
    items: formattedItems,
    total,
    customer: formattedCustomer,
    settings: currentSettings
  });

  return generateWhatsAppUrl(phone, message);
}

export function getWhatsAppBusinessUrl(settings?: AppSettings): string {
  const currentSettings = settings || StorageService.getSettings();
  const phone = currentSettings.whatsappNumber || WHATSAPP_NUMBER;
  const message = currentSettings.whatsappBusinessMessage || 'Hola Rinoxpress, quiero recibir información sobre las opciones para formar parte de Rinoxpress.';
  return generateWhatsAppUrl(phone, message);
}

// OFFICIAL RINOXPRESS ONLINE STORE
export const OFFICIAL_STORE_URL = 'https://rinoxpress.com/mioficina/store/index';

export function openOfficialStore(): void {
  window.open(OFFICIAL_STORE_URL, '_blank', 'noopener,noreferrer');
}

// OFFICIAL RINOXPRESS MI OFICINA PLATFORM
export const OFFICIAL_OFFICE_URL = 'https://rinoxpress.com/mioficina/';

export function openOfficialOffice(): void {
  window.open(OFFICIAL_OFFICE_URL, '_blank', 'noopener,noreferrer');
}

