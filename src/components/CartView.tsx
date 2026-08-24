import React, { useState } from 'react';
import { 
  Trash2, 
  Minus, 
  Plus, 
  ShoppingBag, 
  ArrowRight, 
  ArrowLeft,
  Send, 
  MapPin, 
  CheckCircle2, 
  Sparkles,
  Phone,
  User as UserIcon,
  FileText,
  AlertCircle,
  Edit3,
  ExternalLink,
  Tag
} from 'lucide-react';
import { CartItem, AppSettings, AppUser, Order, OrderItem } from '../types';
import { 
  formatCurrency, 
  generateNextOrderNumber, 
  buildWhatsAppOrderMessage, 
  generateWhatsAppUrl, 
  StorageService 
} from '../services/storageService';
import { FirebaseOrderService } from '../services/firebaseOrderService';

interface CartViewProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number, size: string) => void;
  onRemoveItem: (productId: string, size: string) => void;
  onClearCart: () => void;
  onContinueShopping: () => void;
  settings: AppSettings;
  currentUser: AppUser;
  onOrderCompleted?: (order: Order) => void;
}

type CheckoutStep = 'cart' | 'customer' | 'review' | 'prepared';

const ARGENTINA_PROVINCES = [
  'Córdoba',
  'Buenos Aires',
  'Ciudad Autónoma de Buenos Aires (CABA)',
  'Santa Fe',
  'Mendoza',
  'Entre Ríos',
  'Salta',
  'Tucumán',
  'San Juan',
  'Corrientes',
  'Misiones',
  'Chaco',
  'San Luis',
  'Santiago del Estero',
  'Catamarca',
  'La Rioja',
  'Jujuy',
  'La Pampa',
  'Río Negro',
  'Neuquén',
  'Chubut',
  'Santa Cruz',
  'Tierra del Fuego'
];

export const CartView: React.FC<CartViewProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onContinueShopping,
  settings,
  currentUser,
  onOrderCompleted
}) => {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('cart');
  
  // Customer Form Fields
  const [customerName, setCustomerName] = useState(currentUser.fullName || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser.phone || '');
  const [customerCity, setCustomerCity] = useState(currentUser.city || 'Córdoba Capital');
  const [customerProvince, setCustomerProvince] = useState('Córdoba');
  const [customerNotes, setCustomerNotes] = useState('');
  
  // Validation Errors
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    phone?: string;
    city?: string;
    general?: string;
  }>({});

  // Prepared Order State
  const [preparedOrder, setPreparedOrder] = useState<Order | null>(null);
  const [preparedMessage, setPreparedMessage] = useState<string>('');
  const [preparedWhatsAppUrl, setPreparedWhatsAppUrl] = useState<string>('');

  // Calculations taking active promotions into account
  // If product is promo or has originalPrice > price, we calculate normal subtotal vs savings
  const normalSubtotal = cart.reduce((sum, item) => {
    const basePrice = (item.product.originalPrice && item.product.originalPrice > item.product.price)
      ? item.product.originalPrice
      : item.product.price;
    return sum + (basePrice * item.quantity);
  }, 0);

  const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const discount = Math.max(0, normalSubtotal - total);
  const subtotal = discount > 0 ? normalSubtotal : total;

  // Validation function
  const validateCustomerData = (): boolean => {
    const errors: { name?: string; phone?: string; city?: string; general?: string } = {};

    if (!customerName || customerName.trim().length < 3) {
      errors.name = 'Por favor ingresá tu nombre y apellido completo.';
    }

    // Phone validation: must contain numbers and at least 6 digits
    const cleanPhone = customerPhone.replace(/[^0-9]/g, '');
    if (!customerPhone || cleanPhone.length < 6) {
      errors.phone = 'Por favor ingresá un número de teléfono válido (ej: 351 802 9702).';
    }

    if (!customerCity || customerCity.trim().length < 2) {
      errors.city = 'Por favor ingresá tu localidad / ciudad.';
    }

    if (cart.length === 0) {
      errors.general = 'El pedido debe tener al menos un producto.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGoToCustomerData = () => {
    if (cart.length === 0) return;
    setCurrentStep('customer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToReview = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (validateCustomerData()) {
      setFormErrors({});
      setCurrentStep('review');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGenerateAndPrepareOrder = async () => {
    if (!validateCustomerData()) {
      setCurrentStep('customer');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Generate unique sequential order number
      const orderNumber = await FirebaseOrderService.getNextOrderNumber();

      const orderItems: OrderItem[] = cart.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        unitPrice: item.product.price,
        subtotal: item.product.price * item.quantity,
        originalPrice: item.product.originalPrice,
        isPromo: item.product.isPromo,
        size: item.selectedSize,
        fragrance: item.product.fragrance,
        image: item.product.image
      }));

      const customerData = {
        name: customerName.trim(),
        phone: customerPhone.trim(),
        city: customerCity.trim(),
        province: customerProvince.trim(),
        notes: customerNotes.trim()
      };

      // 2. Format WhatsApp message
      const itemsForMsg = cart.map(item => ({
        name: item.product.name,
        size: item.selectedSize,
        fragrance: item.product.fragrance,
        quantity: item.quantity,
        price: item.product.price,
        subtotal: item.product.price * item.quantity
      }));

      const generatedMsg = buildWhatsAppOrderMessage({
        orderNumber,
        items: itemsForMsg,
        total,
        customer: customerData,
        settings
      });

      const destinationPhone = settings.whatsappNumber || '5493518029702';
      const waUrl = generateWhatsAppUrl(destinationPhone, generatedMsg);

      // 3. Save order to Firebase Firestore BEFORE opening WhatsApp
      const createdOrder = await FirebaseOrderService.createOrder({
        orderNumber,
        customerName: customerData.name,
        customerPhone: customerData.phone,
        customerCity: customerData.city,
        customerProvince: customerData.province,
        customerComments: customerData.notes,
        items: orderItems,
        subtotal,
        discount,
        total,
        status: 'Pendiente',
        userId: currentUser?.id || null,
        whatsappSent: true,
        whatsappMessage: generatedMsg
      });

      if (onOrderCompleted) {
        onOrderCompleted(createdOrder);
      }

      setPreparedOrder(createdOrder);
      setPreparedMessage(generatedMsg);
      setPreparedWhatsAppUrl(waUrl);
      setCurrentStep('prepared');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Error generating order:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenWhatsAppAndSend = () => {
    if (preparedWhatsAppUrl) {
      window.open(preparedWhatsAppUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // STEP 4: PANTALLA "PEDIDO PREPARADO" (CONFIRMACIÓN)
  if (currentStep === 'prepared' && preparedOrder) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 text-left space-y-8 bg-white animate-in fade-in duration-300">
        <div className="text-center space-y-3">
          <div className="w-20 h-20 rounded-full bg-red-50 text-red-600 border-2 border-red-200 mx-auto flex items-center justify-center shadow-lg shadow-red-500/10">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-red-600 block">
              Pedido #{preparedOrder.orderNumber}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 mt-1">
              PEDIDO PREPARADO
            </h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto mt-2">
              Tu pedido está listo para enviarse a Rinoxpress por WhatsApp.
            </p>
          </div>
        </div>

        {/* Order Card Preview */}
        <div className="rounded-3xl bg-gray-50 border border-gray-200 p-6 space-y-5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 pb-4">
            <div>
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Identificación de Pedido</span>
              <span className="text-xl font-extrabold text-gray-950 font-mono">#{preparedOrder.orderNumber}</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Total Liquidado</span>
              <span className="text-2xl font-extrabold text-red-600">{formatCurrency(preparedOrder.total)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-white p-3.5 rounded-2xl border border-gray-200 space-y-1">
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block">Cliente</span>
              <p className="font-bold text-gray-900">{preparedOrder.customer.name}</p>
              <p className="text-gray-600">📱 {preparedOrder.customer.phone}</p>
              <p className="text-gray-600">📍 {preparedOrder.customer.city}, {preparedOrder.customer.province}</p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-gray-200 space-y-1">
              <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider block">Destino WhatsApp</span>
              <p className="font-bold text-gray-900">{settings.companyName}</p>
              <p className="text-gray-600">📞 {settings.whatsappDisplayNumber || '+54 9 351 802-9702'}</p>
              <p className="text-emerald-700 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Atención Rinoxpress en línea
              </p>
            </div>
          </div>

          {/* Preformatted WhatsApp Message Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-red-600" />
                <span>Mensaje listo para WhatsApp:</span>
              </label>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Formato automático Rinoxpress
              </span>
            </div>
            <pre className="p-4 rounded-2xl bg-white border border-gray-300 text-gray-800 text-xs font-sans whitespace-pre-wrap leading-relaxed shadow-inner overflow-x-auto">
              {preparedMessage}
            </pre>
          </div>

          {/* Primary Action Button */}
          <div className="pt-2 space-y-3">
            <button
              onClick={handleOpenWhatsAppAndSend}
              className="w-full py-4 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-base tracking-wide shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-3 cursor-pointer active:scale-98"
            >
              <Send className="w-5 h-5 fill-white stroke-none" />
              <span>ABRIR WHATSAPP Y ENVIAR</span>
              <ExternalLink className="w-4 h-4 opacity-80" />
            </button>

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Importante:</strong> Al hacer clic, se abrirá WhatsApp con el mensaje ya redactado para que puedas revisarlo y presionar enviar en la conversación.
              </span>
            </div>
          </div>
        </div>

        {/* Secondary Navigation */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            onClick={() => {
              onClearCart();
              setCurrentStep('cart');
              setPreparedOrder(null);
              onContinueShopping();
            }}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer text-center"
          >
            Hacer Otro Pedido / Volver al Catálogo
          </button>
        </div>
      </div>
    );
  }

  // EMPTY CART STATE
  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-6 bg-white">
        <div className="w-20 h-20 rounded-full bg-red-50 text-red-600 mx-auto flex items-center justify-center shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-950">Tu pedido está vacío</h2>
          <p className="text-sm text-gray-600 max-w-md mx-auto">
            Explorá nuestro catálogo de fragancias finas, aromatizadores y difusores para armar tu pedido.
          </p>
        </div>
        <button
          onClick={onContinueShopping}
          className="px-8 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-red-500/20 transition-all cursor-pointer active:scale-98"
        >
          Explorar Catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8 text-left bg-white">
      {/* Step Indicator Header */}
      <div className="border-b border-gray-200 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-red-600">
              Sistema de Pedidos Rinoxpress
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-950 mt-0.5">
              {currentStep === 'cart' && 'Mi Pedido'}
              {currentStep === 'customer' && 'Datos del Cliente'}
              {currentStep === 'review' && 'Revisá tu Pedido'}
            </h1>
          </div>

          {/* Stepper Wizard Bar */}
          <div className="flex items-center gap-2 text-xs font-bold">
            <button
              onClick={() => setCurrentStep('cart')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                currentStep === 'cart' 
                  ? 'bg-red-600 text-white shadow-xs' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>1. Mi Pedido</span>
            </button>
            <span className="text-gray-300">→</span>
            <button
              onClick={() => {
                if (currentStep === 'review') setCurrentStep('customer');
                else if (currentStep === 'cart') handleGoToCustomerData();
              }}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                currentStep === 'customer' 
                  ? 'bg-red-600 text-white shadow-xs' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>2. Datos</span>
            </button>
            <span className="text-gray-300">→</span>
            <button
              onClick={() => {
                if (validateCustomerData()) setCurrentStep('review');
              }}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                currentStep === 'review' 
                  ? 'bg-red-600 text-white shadow-xs' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <span>3. Revisar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Global Validation Error Banner */}
      {formErrors.general && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span>{formErrors.general}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 1: MI PEDIDO (ITEMS LIST & QUANTITY CONTROLS) */}
      {/* ========================================================================= */}
      {currentStep === 'cart' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-200">
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Productos Seleccionados ({cart.reduce((s, i) => s + i.quantity, 0)})
              </span>
              <button
                onClick={onClearCart}
                className="text-xs font-semibold text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Vaciar pedido</span>
              </button>
            </div>

            <div className="rounded-3xl bg-white border border-gray-200 divide-y divide-gray-100 shadow-xs overflow-hidden">
              {cart.map((item) => {
                const isPromoItem = item.product.isPromo || (item.product.originalPrice && item.product.originalPrice > item.product.price);
                const originalPrice = item.product.originalPrice;
                const unitPrice = item.product.price;
                const itemSubtotal = unitPrice * item.quantity;

                return (
                  <div key={`${item.product.id}-${item.selectedSize}`} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-gray-50/50 transition-colors">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-gray-100 flex-shrink-0 border border-gray-100"
                    />

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-extrabold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                          {item.product.categoryName}
                        </span>
                        {isPromoItem && (
                          <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Tag className="w-2.5 h-2.5" />
                            Promo Activa
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-bold text-gray-950 truncate">
                        {item.product.name}
                      </h4>

                      <div className="text-xs text-gray-500 flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span>Aroma: <strong className="text-gray-800">{item.product.fragrance}</strong></span>
                        <span>•</span>
                        <span>Presentación: <strong className="text-gray-800">{item.selectedSize}</strong></span>
                      </div>

                      <div className="text-xs pt-1 flex items-baseline gap-2">
                        <span className="font-extrabold text-gray-950 text-sm">
                          {formatCurrency(unitPrice)} <span className="text-[10px] text-gray-500 font-normal">c/u</span>
                        </span>
                        {isPromoItem && originalPrice && (
                          <span className="text-xs line-through text-gray-400 font-medium">
                            {formatCurrency(originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls and Subtotal */}
                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                      <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-1">
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1, item.selectedSize)}
                          className="w-7 h-7 rounded-lg bg-white hover:bg-gray-200 text-gray-800 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                          title="Disminuir"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-9 text-center text-xs font-extrabold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1, item.selectedSize)}
                          className="w-7 h-7 rounded-lg bg-white hover:bg-gray-200 text-gray-800 flex items-center justify-center transition-colors cursor-pointer shadow-2xs"
                          title="Aumentar"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-gray-400 block sm:hidden">Subtotal:</span>
                        <span className="text-base font-extrabold text-red-600">
                          {formatCurrency(itemSubtotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={onContinueShopping}
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1.5 pt-2 cursor-pointer transition-colors"
            >
              <span>+ Agregar más productos del catálogo</span>
            </button>
          </div>

          {/* Right Column: Order Summary & Next Step */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-3xl bg-gray-50 border border-gray-200 p-6 shadow-xs space-y-5">
              <h3 className="text-lg font-bold text-gray-950">Resumen de Compra</h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cart.reduce((s, i) => s + i.quantity, 0)} unidades):</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50 p-2 rounded-xl border border-emerald-100">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      Descuento promocional:
                    </span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline">
                  <span className="text-base font-bold text-gray-950">Total:</span>
                  <span className="text-2xl font-extrabold text-red-600">{formatCurrency(total)}</span>
                </div>
              </div>

              <button
                onClick={handleGoToCustomerData}
                className="w-full py-4 px-6 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-red-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Continuar: Datos del Cliente</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-[11px] text-gray-500 text-center leading-relaxed">
                Paso 1 de 3 • Revisá las cantidades antes de ingresar tus datos de contacto y entrega.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 2: DATOS DEL CLIENTE */}
      {/* ========================================================================= */}
      {currentStep === 'customer' && (
        <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-200">
          <div className="rounded-3xl bg-gray-50 border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-xl font-bold text-gray-950">Datos del Cliente</h2>
              <p className="text-xs text-gray-600 mt-1">
                Ingresá tus datos para que Rinoxpress pueda preparar tu pedido y coordinar el envío o retiro.
              </p>
            </div>

            <form onSubmit={handleGoToReview} className="space-y-4">
              {/* Full Name (Mandatory) */}
              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1">
                  Nombre y Apellido *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                    }}
                    placeholder="Ej: Laura Gómez"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border text-gray-900 text-sm focus:outline-none focus:ring-2 ${
                      formErrors.name ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-red-500'
                    }`}
                  />
                </div>
                {formErrors.name && (
                  <p className="text-[11px] text-red-600 font-bold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {formErrors.name}
                  </p>
                )}
              </div>

              {/* Phone (Mandatory) */}
              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1">
                  Número de Teléfono (WhatsApp) *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => {
                      setCustomerPhone(e.target.value);
                      if (formErrors.phone) setFormErrors({ ...formErrors, phone: undefined });
                    }}
                    placeholder="Ej: 351 802 9702"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border text-gray-900 text-sm focus:outline-none focus:ring-2 ${
                      formErrors.phone ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-red-500'
                    }`}
                  />
                </div>
                {formErrors.phone && (
                  <p className="text-[11px] text-red-600 font-bold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {formErrors.phone}
                  </p>
                )}
                <span className="text-[11px] text-gray-500 mt-1 block">
                  Utilizaremos este número para identificarte y responderte al recibir el mensaje.
                </span>
              </div>

              {/* City / Localidad (Mandatory) & Province */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-800 block mb-1">
                    Localidad / Ciudad *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={customerCity}
                      onChange={(e) => {
                        setCustomerCity(e.target.value);
                        if (formErrors.city) setFormErrors({ ...formErrors, city: undefined });
                      }}
                      placeholder="Ej: Córdoba Capital, Villa Carlos Paz..."
                      className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border text-gray-900 text-sm focus:outline-none focus:ring-2 ${
                        formErrors.city ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-red-500'
                      }`}
                    />
                  </div>
                  {formErrors.city && (
                    <p className="text-[11px] text-red-600 font-bold mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-800 block mb-1">
                    Provincia *
                  </label>
                  <select
                    value={customerProvince}
                    onChange={(e) => setCustomerProvince(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                  >
                    {ARGENTINA_PROVINCES.map((prov) => (
                      <option key={prov} value={prov}>
                        {prov}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Additional Comments (Optional) */}
              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1">
                  Comentarios adicionales <span className="font-normal text-gray-500">(Opcional)</span>
                </label>
                <textarea
                  rows={3}
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="Aclaraciones sobre fragancias alternativas, horarios de entrega o preferencias..."
                  className="w-full p-3.5 rounded-xl bg-white border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setCurrentStep('cart')}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Volver a Mi Pedido</span>
                </button>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md shadow-red-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <span>Revisar Pedido</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: REVISÁ TU PEDIDO (SUMMARY & FINAL CONFIRMATION) */}
      {/* ========================================================================= */}
      {currentStep === 'review' && (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
          <div className="rounded-3xl bg-gray-50 border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
            {/* Header */}
            <div className="border-b border-gray-200 pb-4">
              <span className="text-xs uppercase font-extrabold tracking-widest text-red-600 block">
                Paso Final
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950 mt-1">
                REVISÁ TU PEDIDO
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                Verificá que los productos, cantidades y tus datos de contacto sean correctos antes de generar el pedido.
              </p>
            </div>

            {/* Products Breakdown Table / List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Detalle de Productos
                </span>
                <button
                  onClick={() => setCurrentStep('cart')}
                  className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Modificar items</span>
                </button>
              </div>

              <div className="rounded-2xl bg-white border border-gray-200 divide-y divide-gray-100 overflow-hidden">
                {cart.map((item) => {
                  const isPromo = item.product.isPromo || (item.product.originalPrice && item.product.originalPrice > item.product.price);
                  const unitPrice = item.product.price;
                  const itemSub = unitPrice * item.quantity;

                  return (
                    <div key={`rev-${item.product.id}-${item.selectedSize}`} className="p-3.5 sm:p-4 flex items-center gap-3 sm:gap-4">
                      {/* Small Image */}
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover bg-gray-100 flex-shrink-0 border border-gray-100"
                      />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-950 truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          {item.selectedSize} • Aroma: <span className="font-semibold text-gray-800">{item.product.fragrance}</span>
                        </p>
                        <div className="text-xs text-gray-700 mt-0.5">
                          <span>Cant: <strong className="text-gray-950">{item.quantity}</strong></span>
                          <span className="mx-1.5">•</span>
                          <span>Unit: <strong>{formatCurrency(unitPrice)}</strong></span>
                          {isPromo && item.product.originalPrice && (
                            <span className="text-[11px] line-through text-gray-400 ml-1">
                              {formatCurrency(item.product.originalPrice)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right">
                        <span className="text-[10px] text-gray-400 block">Subtotal</span>
                        <span className="text-sm sm:text-base font-extrabold text-gray-950">
                          {formatCurrency(itemSub)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Customer Details Box */}
            <div className="p-4 rounded-2xl bg-white border border-gray-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  👤 Datos del Cliente
                </span>
                <button
                  onClick={() => setCurrentStep('customer')}
                  className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editar datos</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700 pt-1">
                <div>
                  <span className="text-gray-500">Nombre: </span>
                  <strong className="text-gray-900">{customerName}</strong>
                </div>
                <div>
                  <span className="text-gray-500">Teléfono: </span>
                  <strong className="text-gray-900">{customerPhone}</strong>
                </div>
                <div>
                  <span className="text-gray-500">Localidad: </span>
                  <strong className="text-gray-900">{customerCity}</strong>
                </div>
                <div>
                  <span className="text-gray-500">Provincia: </span>
                  <strong className="text-gray-900">{customerProvince}</strong>
                </div>
                {customerNotes && (
                  <div className="sm:col-span-2 bg-gray-50 p-2.5 rounded-xl text-gray-600 italic">
                    Comentarios: "{customerNotes}"
                  </div>
                )}
              </div>
            </div>

            {/* Financial Totals */}
            <div className="p-5 rounded-2xl bg-white border border-gray-200 space-y-2.5">
              <div className="flex justify-between text-xs text-gray-600">
                <span className="font-semibold uppercase tracking-wider">SUBTOTAL</span>
                <span className="font-bold text-gray-900">{formatCurrency(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-xs text-emerald-700 font-bold">
                  <span className="uppercase tracking-wider">DESCUENTO (PROMOS)</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}

              <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline">
                <span className="text-lg font-extrabold text-gray-950 uppercase tracking-wider">TOTAL</span>
                <span className="text-3xl font-extrabold text-red-600">{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Action Buttons: EDITAR PEDIDO & ENVIAR PEDIDO POR WHATSAPP */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep('cart')}
                className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-gray-100 border-2 border-gray-300 text-gray-800 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Edit3 className="w-4 h-4 text-gray-600" />
                <span>EDITAR PEDIDO</span>
              </button>

              <button
                type="button"
                onClick={handleGenerateAndPrepareOrder}
                disabled={isSubmitting}
                className="w-full py-4 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-75"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>GUARDANDO EN FIRESTORE...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 fill-white stroke-none" />
                    <span>ENVIAR PEDIDO POR WHATSAPP</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-gray-500 text-center">
              Al presionar enviar se generará tu número de pedido único y se preparará el mensaje oficial para Rinoxpress Córdoba.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
