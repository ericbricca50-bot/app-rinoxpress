export type UserRole = 'Cliente' | 'Integrante' | 'Administrador';

export type OrderStatus = 'Pendiente' | 'Confirmado' | 'Preparando' | 'Enviado' | 'Finalizado' | 'Cancelado';

export type LeadStatus = 'Nuevo' | 'Contactado' | 'Reunión Agendada' | 'Cerrado';

export interface Product {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  fragrance: string;
  olfactoryFamily?: 'Amaderado' | 'Dulce / Gourmand' | 'Cítrico' | 'Floral' | 'Fresco' | 'Oriental / Especiado';
  size: string;
  availableSizes?: string[];
  price: number;
  originalPrice?: number;
  isPromo: boolean;
  promoDiscountPercent?: number;
  promoEndDate?: string;
  isFeatured: boolean;
  isBestSeller?: boolean;
  inStock: boolean;
  stockCount: number;
  image: string;
  description: string;
  notes?: {
    top?: string;    // Notas de salida
    heart?: string;  // Notas de corazón
    base?: string;   // Notas de fondo
  };
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
  image: string;
  order: number;
  featured?: boolean;
}

export interface Promotion {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  discountBadge?: string;
  image?: string;
  bannerImage?: string;
  originalPrice: number;
  promoPrice: number;
  finalPrice?: number;
  discountPercent: number;
  expiresAt?: string;
  validUntil?: string;
  productId?: string;
  productIds?: string[];
  includedProductNames?: string[];
  isActive: boolean;
  isDemo?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize: string;
  customNotes?: string;
}

export interface OrderCustomer {
  name: string;
  phone: string;
  city: string;
  province: string;
  email?: string;
  address?: string;
  pickupOrDelivery?: 'delivery' | 'pickup';
  notes?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  productName?: string;
  quantity: number;
  price: number;
  unitPrice?: number;
  subtotal?: number;
  originalPrice?: number;
  isPromo?: boolean;
  size: string;
  fragrance: string;
  image: string;
}

export interface Order {
  id: string;
  orderId?: string;
  orderNumber: string; // Ej: "RX-0001" o "RX-TEST-001"
  createdAt: string;
  customer: OrderCustomer;
  customerName?: string;
  customerPhone?: string;
  customerCity?: string;
  customerProvince?: string;
  customerComments?: string;
  items: OrderItem[];
  subtotal: number;
  discount?: number;
  deliveryCost?: number;
  total: number;
  status: OrderStatus;
  userId?: string | null;
  whatsappSent: boolean;
  whatsappMessage?: string;
}

export interface Lead {
  id: string;
  createdAt: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  interestOption: string;
  message: string;
  status: LeadStatus;
}

export interface AppUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  role: UserRole;
  registeredAt: string;
  avatarUrl?: string;
}

export interface FranchiseTier {
  id: string;
  name: 'Bronze' | 'Silver' | 'Gold' | 'Diamond';
  tagline: string;
  color: string;
  investmentNote: string;
  description: string;
  perks: string[];
}

export interface BusinessOpportunity {
  id: string;
  title: string;
  type: 'dropshipping' | 'network' | 'franchise';
  tagline: string;
  description: string;
  requirements: string[];
  benefits: string[];
  franchiseTiers?: FranchiseTier[];
}

export interface AppSettings {
  companyName: string;
  slogan: string;
  city: string;
  whatsappNumber: string; // WHATSAPP_NUMBER: stored in international format without spaces, hyphens, parentheses or + (e.g. 5493512345678)
  whatsappDisplayNumber: string; // E.g., "+54 9 351 234-5678"
  whatsappGeneralMessage: string; // Mensaje general: "Hola Rinoxpress, quiero recibir información sobre sus productos."
  whatsappProductMessage: string; // Mensaje de consulta de producto: "Hola Rinoxpress, quiero consultar por el producto: [NOMBRE DEL PRODUCTO]."
  whatsappOrderMessage: string; // Mensaje de pedido: "Hola Rinoxpress, quiero realizar el siguiente pedido:\n\n[ITEMS]\n\nTotal: $[TOTAL]\n\nQuedo a la espera de confirmación."
  whatsappBusinessMessage: string; // Mensaje para sumarse: "Hola Rinoxpress, quiero recibir información sobre las opciones para formar parte de Rinoxpress."
  calendarUrl: string;
  email: string;
  address: string;
  instagram: string;
  workingHours: string;
  bannerTitle: string;
  bannerSubtitle: string;
  bannerBadge: string;
}
