import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  query, 
  orderBy, 
  where, 
  onSnapshot, 
  Unsubscribe 
} from 'firebase/firestore';
import { db } from '../firebase';
import { Order, OrderItem, OrderStatus } from '../types';
import { StorageService } from './storageService';

const ORDERS_COLLECTION = 'orders';

/**
 * Normalizes an item for Firestore storage to guarantee frozen price snapshots
 */
export function formatOrderItemForFirestore(item: any): OrderItem {
  const unitPrice = Number(item.unitPrice ?? item.price ?? 0);
  const qty = Number(item.quantity ?? 1);
  const subtotal = Number(item.subtotal ?? (unitPrice * qty));

  const formatted: OrderItem = {
    productId: item.productId || 'prod-custom',
    name: item.productName || item.name || 'Fragancia Rinoxpress',
    productName: item.productName || item.name || 'Fragancia Rinoxpress',
    size: item.size || '100 ml',
    fragrance: item.fragrance || 'Exclusiva Rinoxpress',
    quantity: qty,
    unitPrice: unitPrice,
    price: unitPrice,
    subtotal: subtotal,
    image: item.image || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=600&q=80',
    isPromo: Boolean(item.isPromo)
  };

  if (item.originalPrice !== undefined && item.originalPrice !== null) {
    formatted.originalPrice = Number(item.originalPrice);
  }

  return formatted;
}

/**
 * Strips undefined properties recursively so Firestore setDoc / updateDoc never fails
 */
function sanitizeForFirestore(obj: any): any {
  if (obj === undefined) return null;
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map(sanitizeForFirestore);
  }
  const clean: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      clean[key] = sanitizeForFirestore(value);
    }
  }
  return clean;
}

/**
 * Converts a Firestore document snapshot into a clean frontend Order
 */
export function parseFirestoreOrder(id: string, data: any): Order {
  const rawItems = Array.isArray(data.items) ? data.items : [];
  const items = rawItems.map(formatOrderItemForFirestore);

  const customerName = data.customerName || data.customer?.name || 'Cliente';
  const customerPhone = data.customerPhone || data.customer?.phone || '';
  const customerCity = data.customerCity || data.customer?.city || 'Córdoba Capital';
  const customerProvince = data.customerProvince || data.customer?.province || 'Córdoba';
  const customerComments = data.customerComments || data.customer?.notes || '';

  const subtotal = Number(data.subtotal ?? items.reduce((acc, i) => acc + (i.unitPrice! * i.quantity), 0));
  const discount = Number(data.discount ?? 0);
  const total = Number(data.total ?? (subtotal - discount));

  return {
    id: id || data.orderId || data.id,
    orderId: id || data.orderId,
    orderNumber: data.orderNumber || `RX-${id.slice(0, 4).toUpperCase()}`,
    createdAt: data.createdAt || new Date().toISOString(),
    customerName,
    customerPhone,
    customerCity,
    customerProvince,
    customerComments,
    customer: {
      name: customerName,
      phone: customerPhone,
      city: customerCity,
      province: customerProvince,
      notes: customerComments,
      pickupOrDelivery: data.customer?.pickupOrDelivery || 'delivery'
    },
    items,
    subtotal,
    discount,
    deliveryCost: Number(data.deliveryCost ?? 0),
    total,
    status: (data.status as OrderStatus) || 'Pendiente',
    userId: data.userId || null,
    whatsappSent: Boolean(data.whatsappSent),
    whatsappMessage: data.whatsappMessage || ''
  };
}

export const FirebaseOrderService = {
  /**
   * Generates next sequential order number (e.g. RX-0001, RX-0002)
   */
  async getNextOrderNumber(): Promise<string> {
    try {
      const q = query(collection(db, ORDERS_COLLECTION));
      const snapshot = await getDocs(q);
      
      let maxNumber = 0;
      snapshot.forEach(docSnap => {
        const orderNum = docSnap.data().orderNumber;
        if (orderNum && typeof orderNum === 'string') {
          // Check for RX-XXXX pattern (excluding RX-TEST)
          if (orderNum.startsWith('RX-') && !orderNum.includes('TEST')) {
            const numericPart = parseInt(orderNum.replace(/[^0-9]/g, ''), 10);
            if (!isNaN(numericPart) && numericPart > maxNumber) {
              maxNumber = numericPart;
            }
          }
        }
      });

      // Also check local storage orders
      const localOrders = StorageService.getOrders();
      localOrders.forEach(o => {
        if (o.orderNumber && o.orderNumber.startsWith('RX-') && !o.orderNumber.includes('TEST')) {
          const num = parseInt(o.orderNumber.replace(/[^0-9]/g, ''), 10);
          if (!isNaN(num) && num > maxNumber) {
            maxNumber = num;
          }
        }
      });

      const nextNum = maxNumber + 1;
      return `RX-${String(nextNum).padStart(4, '0')}`;
    } catch (err) {
      console.warn('Could not query Firestore for next order number, fallback to local logic', err);
      return StorageService.getOrders().length > 0 
        ? `RX-${String(StorageService.getOrders().length + 1).padStart(4, '0')}`
        : 'RX-0001';
    }
  },

  /**
   * Saves a new order to Firebase Firestore and local storage
   */
  async createOrder(orderInput: {
    orderNumber: string;
    createdAt?: string;
    customerName: string;
    customerPhone: string;
    customerCity: string;
    customerProvince: string;
    customerComments?: string;
    items: OrderItem[];
    subtotal: number;
    discount?: number;
    total: number;
    status?: OrderStatus;
    userId?: string | null;
    whatsappSent?: boolean;
    whatsappMessage?: string;
  }): Promise<Order> {
    const orderId = `ord-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const createdAt = orderInput.createdAt || new Date().toISOString();
    const formattedItems = orderInput.items.map(formatOrderItemForFirestore);

    const firestoreData = {
      orderId,
      orderNumber: orderInput.orderNumber,
      createdAt,
      customerName: orderInput.customerName.trim(),
      customerPhone: orderInput.customerPhone.trim(),
      customerCity: orderInput.customerCity.trim(),
      customerProvince: orderInput.customerProvince.trim(),
      customerComments: (orderInput.customerComments || '').trim(),
      items: formattedItems,
      subtotal: Number(orderInput.subtotal),
      discount: Number(orderInput.discount || 0),
      total: Number(orderInput.total),
      status: orderInput.status || 'Pendiente',
      userId: orderInput.userId || null,
      whatsappSent: Boolean(orderInput.whatsappSent ?? true),
      whatsappMessage: orderInput.whatsappMessage || ''
    };

    // 1. Write to Firestore
    try {
      const orderRef = doc(db, ORDERS_COLLECTION, orderId);
      const safeData = sanitizeForFirestore(firestoreData);
      await setDoc(orderRef, safeData);
      console.log(`[FirebaseOrderService] Order ${orderInput.orderNumber} successfully saved to Firestore.`);
    } catch (firebaseErr) {
      console.error('[FirebaseOrderService] Error writing order to Firestore:', firebaseErr);
    }

    // 2. Parse & update local storage cache for instant reactive UI
    const fullOrder = parseFirestoreOrder(orderId, firestoreData);
    StorageService.addOrder(fullOrder);

    return fullOrder;
  },

  /**
   * Retrieves all orders for a specific user (or guest) from Firestore & local storage
   */
  async getUserOrders(userId?: string | null, userPhone?: string): Promise<Order[]> {
    try {
      const ordersRef = collection(db, ORDERS_COLLECTION);
      let firestoreOrders: Order[] = [];

      if (userId) {
        // Query by userId
        const qUser = query(ordersRef, where('userId', '==', userId));
        const snap = await getDocs(qUser);
        snap.forEach(d => {
          firestoreOrders.push(parseFirestoreOrder(d.id, d.data()));
        });
      }

      // If user has a phone, query by phone as well for guest orders placed previously
      if (userPhone && userPhone.trim().length > 5) {
        const cleanPhone = userPhone.replace(/[^0-9]/g, '');
        const allSnap = await getDocs(ordersRef);
        allSnap.forEach(d => {
          const data = d.data();
          const docPhone = (data.customerPhone || '').replace(/[^0-9]/g, '');
          if (docPhone && docPhone.includes(cleanPhone) && !firestoreOrders.some(o => o.id === d.id)) {
            firestoreOrders.push(parseFirestoreOrder(d.id, data));
          }
        });
      }

      // Combine with local orders in case of offline additions
      const localOrders = StorageService.getOrders();
      localOrders.forEach(lo => {
        if (
          (userId && lo.userId === userId) ||
          (userPhone && lo.customer?.phone?.includes(userPhone))
        ) {
          if (!firestoreOrders.some(fo => fo.orderNumber === lo.orderNumber || fo.id === lo.id)) {
            firestoreOrders.push(lo);
          }
        }
      });

      // Sort newest first
      return firestoreOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (err) {
      console.error('[FirebaseOrderService] Error fetching user orders:', err);
      // Fallback to local storage
      const local = StorageService.getOrders();
      return local
        .filter(o => (userId && o.userId === userId) || !userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  },

  /**
   * Retrieves all orders (for Administrator panel)
   */
  async getAllOrders(): Promise<Order[]> {
    try {
      const ordersRef = collection(db, ORDERS_COLLECTION);
      const snapshot = await getDocs(ordersRef);
      const orders: Order[] = [];

      snapshot.forEach(docSnap => {
        orders.push(parseFirestoreOrder(docSnap.id, docSnap.data()));
      });

      // Merge with local orders that might not be synced yet
      const localOrders = StorageService.getOrders();
      localOrders.forEach(lo => {
        if (!orders.some(o => o.orderNumber === lo.orderNumber || o.id === lo.id)) {
          orders.push(lo);
        }
      });

      return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (err) {
      console.error('[FirebaseOrderService] Error fetching all orders:', err);
      return StorageService.getOrders().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  },

  /**
   * Realtime listener for Firestore orders
   */
  subscribeToAllOrders(callback: (orders: Order[]) => void): Unsubscribe {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    return onSnapshot(ordersRef, (snapshot) => {
      const liveOrders: Order[] = [];
      snapshot.forEach(d => {
        liveOrders.push(parseFirestoreOrder(d.id, d.data()));
      });

      // Fallback merge
      const localOrders = StorageService.getOrders();
      localOrders.forEach(lo => {
        if (!liveOrders.some(o => o.orderNumber === lo.orderNumber || o.id === lo.id)) {
          liveOrders.push(lo);
        }
      });

      liveOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(liveOrders);
    }, (error) => {
      console.warn('[FirebaseOrderService] Realtime subscription error:', error);
      callback(StorageService.getOrders());
    });
  },

  /**
   * Updates an order status in Firestore and locally
   */
  async updateOrderStatus(orderId: string, newStatus: OrderStatus): Promise<void> {
    try {
      const orderRef = doc(db, ORDERS_COLLECTION, orderId);
      await updateDoc(orderRef, { status: newStatus });
      console.log(`[FirebaseOrderService] Order ${orderId} status updated to ${newStatus}`);
    } catch (err) {
      console.warn(`[FirebaseOrderService] Could not update in Firestore, updating locally:`, err);
    }
    StorageService.updateOrderStatus(orderId, newStatus);
  },

  /**
   * Creates the required verification test order RX-TEST-001 in Firestore
   */
  async seedTestOrderIfNotExists(currentUserId?: string): Promise<Order> {
    const testOrderNumber = 'RX-TEST-001';
    
    // Check if RX-TEST-001 already exists in Firestore
    try {
      const ordersRef = collection(db, ORDERS_COLLECTION);
      const snapshot = await getDocs(ordersRef);
      let found: Order | null = null;

      snapshot.forEach(d => {
        const data = d.data();
        if (data.orderNumber === testOrderNumber) {
          found = parseFirestoreOrder(d.id, data);
        }
      });

      if (found) {
        return found;
      }
    } catch (err) {
      console.warn('[FirebaseOrderService] Checking test order in Firestore failed, will create:', err);
    }

    // Create the test order
    const testItems: OrderItem[] = [
      {
        productId: 'prod-1',
        name: 'Rino Black Parfum',
        productName: 'Rino Black Parfum',
        size: '100 ml',
        fragrance: 'Amaderado Intenso & Cuero',
        quantity: 1,
        unitPrice: 18500,
        price: 18500,
        subtotal: 18500,
        image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=600&q=80',
        isPromo: false
      },
      {
        productId: 'prod-4',
        name: 'Difusor de Varillas - Vainilla Bourbon',
        productName: 'Difusor de Varillas - Vainilla Bourbon',
        size: '250 ml',
        fragrance: 'Vainilla Bourbon & Caramelo',
        quantity: 2,
        unitPrice: 9900,
        price: 9900,
        subtotal: 19800,
        image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80',
        isPromo: true
      }
    ];

    const testOrder = await this.createOrder({
      orderNumber: testOrderNumber,
      createdAt: new Date().toISOString(),
      customerName: 'Lucía Benítez',
      customerPhone: '+54 9 351 456-7890',
      customerCity: 'Córdoba Capital',
      customerProvince: 'Córdoba',
      customerComments: 'Pedido de prueba inicial de sistema Rinoxpress.',
      items: testItems,
      subtotal: 38300,
      discount: 2000,
      total: 36300,
      status: 'Pendiente',
      userId: currentUserId || 'usr-1',
      whatsappSent: true,
      whatsappMessage: 'Pedido de prueba verificado para Rinoxpress'
    });

    console.log('[FirebaseOrderService] RX-TEST-001 created successfully in Firestore.');
    return testOrder;
  }
};
