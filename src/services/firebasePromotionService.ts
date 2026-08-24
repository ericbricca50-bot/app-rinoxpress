import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  onSnapshot, 
  Unsubscribe 
} from 'firebase/firestore';
import { db } from '../firebase';
import { Promotion } from '../types';
import { INITIAL_PROMOTIONS } from '../data/initialData';
import { StorageService } from './storageService';

const PROMOTIONS_COLLECTION = 'promotions';

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

export function parseFirestorePromotion(id: string, data: any): Promotion {
  return {
    id: id || data.id || 'promo-' + Date.now(),
    title: data.title || 'Promoción Rinoxpress',
    subtitle: data.subtitle || '',
    description: data.description || '',
    discountBadge: data.discountBadge || `${data.discountPercent || 15}% OFF`,
    discountPercent: Number(data.discountPercent || 15),
    originalPrice: Number(data.originalPrice || (data.promoPrice ? data.promoPrice * 1.2 : 30000)),
    promoPrice: Number(data.promoPrice || data.finalPrice || 25000),
    finalPrice: Number(data.finalPrice || data.promoPrice || 25000),
    image: data.image || data.bannerImage || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    bannerImage: data.bannerImage || data.image || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    productId: data.productId || (Array.isArray(data.productIds) ? data.productIds[0] : 'prod-rino-signature'),
    productIds: Array.isArray(data.productIds) ? data.productIds : (data.productId ? [data.productId] : []),
    includedProductNames: Array.isArray(data.includedProductNames) && data.includedProductNames.length > 0 
      ? data.includedProductNames 
      : ['Fragancia Signature Rinoxpress', 'Presentación de Lujo', 'Garantía Oficial'],
    expiresAt: data.expiresAt || data.validUntil,
    validUntil: data.validUntil || data.expiresAt,
    isActive: data.isActive !== false,
    isDemo: Boolean(data.isDemo)
  };
}

export const FirebasePromotionService = {
  /**
   * Seeds initial promotions to Firestore if the collection is empty
   */
  async seedPromotionsIfEmpty(): Promise<void> {
    try {
      const colRef = collection(db, PROMOTIONS_COLLECTION);
      const snapshot = await getDocs(colRef);
      if (snapshot.empty) {
        console.log('[FirebasePromotionService] Promotions collection is empty. Seeding initial promotions...');
        for (const promo of INITIAL_PROMOTIONS) {
          const promoRef = doc(db, PROMOTIONS_COLLECTION, promo.id);
          await setDoc(promoRef, sanitizeForFirestore(promo));
        }
        console.log('[FirebasePromotionService] Initial promotions seeded successfully to Firestore.');
      }
    } catch (err) {
      console.warn('[FirebasePromotionService] Could not check/seed promotions in Firestore:', err);
    }
  },

  /**
   * Subscribes to live promotions from Firestore
   */
  subscribeToPromotions(onUpdate: (promos: Promotion[]) => void): Unsubscribe {
    // 1. Initial trigger with LocalStorage fallback immediately so UI is instant
    const local = StorageService.getPromotions();
    if (local && local.length > 0) {
      onUpdate(local);
    } else {
      onUpdate(INITIAL_PROMOTIONS);
      StorageService.savePromotions(INITIAL_PROMOTIONS);
    }

    try {
      const colRef = collection(db, PROMOTIONS_COLLECTION);
      return onSnapshot(colRef, (snapshot) => {
        if (!snapshot.empty) {
          const livePromos: Promotion[] = [];
          snapshot.forEach((docSnap) => {
            livePromos.push(parseFirestorePromotion(docSnap.id, docSnap.data()));
          });
          StorageService.savePromotions(livePromos);
          onUpdate(livePromos);
        } else {
          // If Firestore is empty, seed it and keep local
          this.seedPromotionsIfEmpty().catch(console.warn);
          const current = StorageService.getPromotions();
          onUpdate(current.length > 0 ? current : INITIAL_PROMOTIONS);
        }
      }, (error) => {
        console.warn('[FirebasePromotionService] Snapshot listener warning:', error);
        onUpdate(StorageService.getPromotions());
      });
    } catch (err) {
      console.warn('[FirebasePromotionService] Error initializing snapshot listener:', err);
      return () => {};
    }
  },

  /**
   * Saves or updates a promotion in Firestore and local storage
   */
  async savePromotion(promo: Promotion): Promise<void> {
    try {
      const promoRef = doc(db, PROMOTIONS_COLLECTION, promo.id);
      await setDoc(promoRef, sanitizeForFirestore(promo));
    } catch (err) {
      console.warn('[FirebasePromotionService] Could not save promotion to Firestore:', err);
    }
    StorageService.savePromotion(promo);
  },

  /**
   * Deletes a promotion from Firestore and local storage
   */
  async deletePromotion(promoId: string): Promise<void> {
    try {
      const promoRef = doc(db, PROMOTIONS_COLLECTION, promoId);
      await deleteDoc(promoRef);
    } catch (err) {
      console.warn('[FirebasePromotionService] Could not delete promotion from Firestore:', err);
    }
    StorageService.deletePromotion(promoId);
  }
};
