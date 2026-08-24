import { Product, Category, Promotion, BusinessOpportunity, AppSettings, AppUser, Order, Lead } from '../types';

export const INITIAL_SETTINGS: AppSettings = {
  companyName: 'Rinoxpress Córdoba',
  slogan: 'Aromas que dejan huella',
  city: 'Córdoba Capital, Argentina',
  whatsappNumber: '5493518029702', // Configurable desde el Admin - Formato internacional: 5493518029702
  whatsappDisplayNumber: '+54 9 351 802-9702',
  whatsappGeneralMessage: 'Hola Rinoxpress, quiero recibir información sobre sus productos.',
  whatsappProductMessage: 'Hola Rinoxpress, quiero consultar por el producto: [NOMBRE DEL PRODUCTO].',
  whatsappOrderMessage: 'Hola Rinoxpress, quiero realizar el siguiente pedido:\n\n[ITEMS]\n\nTotal: $[TOTAL]\n\nQuedo a la espera de confirmación.',
  whatsappBusinessMessage: 'Hola Rinoxpress, quiero recibir información sobre las opciones para formar parte de Rinoxpress.',
  calendarUrl: 'https://calendar.app.google/gd9RzpqawCLgEEwXA',
  email: 'contacto@rinoxpress.com.ar',
  address: 'Córdoba Capital & envíos a todo el país',
  instagram: '@rinoxpress.cordoba',
  workingHours: 'Lunes a Sábados 09:00 a 20:00 hs',
  bannerTitle: 'AROMAS QUE DEJAN HUELLA',
  bannerSubtitle: 'Perfumes, aromatizadores y mucho más para vos.',
  bannerBadge: 'Línea Exclusiva 2026'
};

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-perfumes',
    name: 'Perfumes',
    slug: 'perfumes',
    iconName: 'Sparkles',
    description: 'Fragancias finas de alta fijación con esencias importadas.',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
    order: 1,
    featured: true
  },
  {
    id: 'cat-textil',
    name: 'Aromatizadores Textiles',
    slug: 'aromatizadores-textiles',
    iconName: 'SprayCan',
    description: 'Spray textil para ropa, sábanas, cortinas y tapizados.',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    order: 2,
    featured: true
  },
  {
    id: 'cat-difusores',
    name: 'Difusores de Ambiente',
    slug: 'difusores-ambiente',
    iconName: 'Wind',
    description: 'Difusores con varillas de ratán para aromatización continua.',
    image: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=800&q=80',
    order: 3,
    featured: true
  },
  {
    id: 'cat-velas',
    name: 'Velas Aromáticas',
    slug: 'velas-aromaticas',
    iconName: 'Flame',
    description: 'Cera de soja 100% natural, pabilo de algodón y perfumes puros.',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
    order: 4,
    featured: true
  },
  {
    id: 'cat-jabones',
    name: 'Jabones Líquidos',
    slug: 'jabones-liquidos',
    iconName: 'Droplets',
    description: 'Higiene suave con glicerina vegetal y ricas fragancias.',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    order: 5,
    featured: false
  },
  {
    id: 'cat-cremas',
    name: 'Cremas Corporales',
    slug: 'cremas',
    iconName: 'HeartHandshake',
    description: 'Nutrición dérmica profunda con manteca de karité y aromas envolventes.',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    order: 6,
    featured: false
  },
  {
    id: 'cat-autos',
    name: 'Aromatización para Autos',
    slug: 'aromatizacion-autos',
    iconName: 'Car',
    description: 'Difusores colgantes y sprays concentrados para el vehículo.',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    order: 7,
    featured: true
  },
  {
    id: 'cat-combos',
    name: 'Combos y Promociones',
    slug: 'combos-promociones',
    iconName: 'Gift',
    description: 'Sets de regalo y kits de bienestar con precios especiales.',
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
    order: 8,
    featured: true
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  // PERFUMES
  {
    id: 'prod-rino-signature',
    name: 'Perfume Rino Signature EDP',
    slug: 'perfume-rino-signature',
    categoryId: 'cat-perfumes',
    categoryName: 'Perfumes',
    fragrance: 'Amaderado Especiado & Ámbar',
    olfactoryFamily: 'Amaderado',
    size: '100 ml',
    availableSizes: ['50 ml', '100 ml'],
    price: 34500,
    originalPrice: 38500,
    isPromo: true,
    promoDiscountPercent: 10,
    promoEndDate: '2026-09-30',
    isFeatured: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 45,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    description: 'El emblema indiscutido de Rinoxpress. Una fragancia audaz, magnética y elegante inspirada en la fuerza de Rino. Excelente perdurabilidad de más de 12 horas en piel.',
    notes: {
      top: 'Pimienta negra, Bergamota de Calabria, Cardamomo',
      heart: 'Cedro del Atlas, Lavanda francesa, Cuero suave',
      base: 'Ámbar gris, Vetiver de Haití, Haba tonka'
    },
    isActive: true
  },
  {
    id: 'prod-elvio-antonio',
    name: 'Perfume Elvio Antonio EDP',
    slug: 'perfume-elvio-antonio',
    categoryId: 'cat-perfumes',
    categoryName: 'Perfumes',
    fragrance: 'Oriental Ambarado Noble',
    olfactoryFamily: 'Oriental / Especiado',
    size: '100 ml',
    availableSizes: ['100 ml'],
    price: 37900,
    originalPrice: 42000,
    isPromo: false,
    isFeatured: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 30,
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80',
    description: 'Una creación majestuosa y distinguida. Notas cálidas y seductoras que reflejan sofisticación clásica y presencia inolvidable.',
    notes: {
      top: 'Azafrán, Naranja amarga, Canela de Ceilán',
      heart: 'Jazmín sambac, Oud ligero, Madera de cachemira',
      base: 'Vainilla Bourbon, Ámbar dorado, Almizcle blanco'
    },
    isActive: true
  },
  {
    id: 'prod-rino-aura',
    name: 'Perfume Rino Aura Floral EDP',
    slug: 'perfume-rino-aura',
    categoryId: 'cat-perfumes',
    categoryName: 'Perfumes',
    fragrance: 'Floral Blanco & Frutos Rojos',
    olfactoryFamily: 'Floral',
    size: '80 ml',
    availableSizes: ['50 ml', '80 ml'],
    price: 32900,
    originalPrice: 36500,
    isPromo: true,
    promoDiscountPercent: 10,
    isFeatured: true,
    isBestSeller: false,
    inStock: true,
    stockCount: 22,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
    description: 'Un aura luminosa y envolvente. Combina la frescura de flores blancas primaverales con un toque goloso de frambuesas silvestres.',
    notes: {
      top: 'Frambuesa, Neroli, Pera Williams',
      heart: 'Tuberosa, Flor de Azahar, Peonía rosa',
      base: 'Pachulí blanco, Vainilla suave, Almizcle'
    },
    isActive: true
  },
  // AROMATIZADORES TEXTILES
  {
    id: 'prod-textil-lavanda',
    name: 'Aromatizador Textil Lavanda & Manzanilla',
    slug: 'aromatizador-textil-lavanda',
    categoryId: 'cat-textil',
    categoryName: 'Aromatizadores Textiles',
    fragrance: 'Lavanda Silvestre & Flores Calmas',
    olfactoryFamily: 'Fresco',
    size: '500 ml',
    availableSizes: ['250 ml', '500 ml'],
    price: 12500,
    originalPrice: 14500,
    isPromo: false,
    isFeatured: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 60,
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    description: 'Fórmula que no mancha telas. Ideal para aromatizar sábanas antes de dormir, cortinas, sillones y ropa de placard con efecto relajante.',
    notes: {
      top: 'Eucalipto, Menta fresca',
      heart: 'Lavanda francesa, Flores de manzanilla',
      base: 'Cedro blanco, Almizcle suave'
    },
    isActive: true
  },
  {
    id: 'prod-textil-vainilla-coco',
    name: 'Aromatizador Textil Vainilla & Coco Sublime',
    slug: 'aromatizador-textil-vainilla-coco',
    categoryId: 'cat-textil',
    categoryName: 'Aromatizadores Textiles',
    fragrance: 'Vainilla Dulce & Leche de Coco',
    olfactoryFamily: 'Dulce / Gourmand',
    size: '500 ml',
    availableSizes: ['500 ml'],
    price: 12500,
    originalPrice: 14000,
    isPromo: false,
    isFeatured: false,
    isBestSeller: true,
    inStock: true,
    stockCount: 40,
    image: 'https://images.unsplash.com/photo-1583209814683-c023dd293cc6?auto=format&fit=crop&w=800&q=80',
    description: 'Fragancia cálida y reconfortante que impregna los ambientes de una sensación dulce y acogedora.',
    notes: {
      top: 'Coco rallado, Toque de caramelo',
      heart: 'Vainilla de Madagascar, Flor de tiaré',
      base: 'Azúcar morena, Sándalo cremoso'
    },
    isActive: true
  },
  // DIFUSORES DE AMBIENTE
  {
    id: 'prod-difusor-citrico-verbena',
    name: 'Difusor de Varillas Verbena & Limón',
    slug: 'difusor-verbena-limon',
    categoryId: 'cat-difusores',
    categoryName: 'Difusores de Ambiente',
    fragrance: 'Cítrico Energizante & Verbena',
    olfactoryFamily: 'Cítrico',
    size: '250 ml',
    availableSizes: ['250 ml'],
    price: 16800,
    originalPrice: 19500,
    isPromo: true,
    promoDiscountPercent: 14,
    isFeatured: true,
    isBestSeller: false,
    inStock: true,
    stockCount: 35,
    image: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=800&q=80',
    description: 'Incluye frasco de vidrio premium con grabado dorado y 8 varillas de ratán de alta absorción. Aromatización continua durante 60 a 75 días.',
    notes: {
      top: 'Limón siciliano, Lemongrass, Pomelo rosado',
      heart: 'Verbena exótica, Té verde, Jazmín',
      base: 'Almizcle limpio, Maderas rubias'
    },
    isActive: true
  },
  {
    id: 'prod-difusor-bosque-santal',
    name: 'Difusor de Varillas Sándalo & Cedro Real',
    slug: 'difusor-sandalo-cedro',
    categoryId: 'cat-difusores',
    categoryName: 'Difusores de Ambiente',
    fragrance: 'Amaderado Calmo & Resinas',
    olfactoryFamily: 'Amaderado',
    size: '250 ml',
    availableSizes: ['250 ml'],
    price: 17500,
    originalPrice: 20000,
    isPromo: false,
    isFeatured: false,
    isBestSeller: true,
    inStock: true,
    stockCount: 28,
    image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=800&q=80',
    description: 'Una atmósfera elegante y meditativa para livings, oficinas y salas de espera.',
    notes: {
      top: 'Pino silvestre, Nuez moscada',
      heart: 'Sándalo de Mysore, Cedro virgen',
      base: 'Resina de benjuí, Cuero sutil'
    },
    isActive: true
  },
  // VELAS AROMÁTICAS
  {
    id: 'prod-vela-soja-higo',
    name: 'Vela de Soja Higo Negro & Flores Silvestres',
    slug: 'vela-soja-higo-negro',
    categoryId: 'cat-velas',
    categoryName: 'Velas Aromáticas',
    fragrance: 'Higo Maduro, Hojas Verdes & Cedro',
    olfactoryFamily: 'Fresco',
    size: '220 gr',
    availableSizes: ['220 gr'],
    price: 15400,
    originalPrice: 17500,
    isPromo: false,
    isFeatured: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 25,
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
    description: 'Cera 100% de soja vegetal ecológica. Vertida a mano en vaso de vidrio negro mate con detalles dorados y tapa de madera maciza.',
    notes: {
      top: 'Hojas de higuera, Savia verde',
      heart: 'Higo negro maduro, Ciclamen',
      base: 'Madera de higuera, Ámbar suave'
    },
    isActive: true
  },
  // JABONES Y CREMAS
  {
    id: 'prod-jabon-rosas-almendras',
    name: 'Jabón Líquido Exfoliante Rosas & Almendras',
    slug: 'jabon-liquido-rosas-almendras',
    categoryId: 'cat-jabones',
    categoryName: 'Jabones Líquidos',
    fragrance: 'Rosas de Grasse & Aceite de Almendras',
    olfactoryFamily: 'Floral',
    size: '350 ml',
    availableSizes: ['350 ml'],
    price: 8900,
    originalPrice: 10500,
    isPromo: false,
    isFeatured: false,
    isBestSeller: false,
    inStock: true,
    stockCount: 50,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
    description: 'Limpia suavemente sin resecar. Con micro-partículas exfoliantes biodegradables que dejan las manos y el cuerpo sedosos.',
    isActive: true
  },
  {
    id: 'prod-crema-karite-vainilla',
    name: 'Crema Hidratante Corporal Karité & Vainilla',
    slug: 'crema-corporal-karite-vainilla',
    categoryId: 'cat-cremas',
    categoryName: 'Cremas Corporales',
    fragrance: 'Vainilla Pura & Manteca Nutritiva',
    olfactoryFamily: 'Dulce / Gourmand',
    size: '250 gr',
    availableSizes: ['250 gr'],
    price: 11200,
    originalPrice: 13000,
    isPromo: false,
    isFeatured: false,
    isBestSeller: false,
    inStock: true,
    stockCount: 30,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80',
    description: 'Textura sedosa de rápida absorción con ácido hialurónico y vitaminas E. Perfume persistente todo el día.',
    isActive: true
  },
  // AUTOS
  {
    id: 'prod-auto-luxury-leather',
    name: 'Aromatizador para Autos Rino Auto Prestige',
    slug: 'aromatizador-auto-prestige',
    categoryId: 'cat-autos',
    categoryName: 'Aromatización para Autos',
    fragrance: 'Cuero Italiano, Maderas Nobles & Citrus',
    olfactoryFamily: 'Amaderado',
    size: 'Kit 10 ml + Recarga 30 ml',
    availableSizes: ['Kit Completo'],
    price: 9900,
    originalPrice: 11900,
    isPromo: true,
    promoDiscountPercent: 17,
    isFeatured: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 40,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    description: 'Clip de ventilación metálico de lujo en color titanio y frasco colgante artesanal. Renueva el aire del habitáculo con estilo ejecutivo.',
    isActive: true
  },
  // COMBOS
  {
    id: 'prod-combo-spa-cordoba',
    name: 'Combo Spa & Bienestar Rinoxpress Córdoba',
    slug: 'combo-spa-bienestar',
    categoryId: 'cat-combos',
    categoryName: 'Combos y Promociones',
    fragrance: 'Vainilla, Lavanda & Verbena Mix',
    olfactoryFamily: 'Dulce / Gourmand',
    size: 'Kit 4 Piezas',
    availableSizes: ['Caja de Regalo'],
    price: 43500,
    originalPrice: 52000,
    isPromo: true,
    promoDiscountPercent: 16,
    promoEndDate: '2026-09-15',
    isFeatured: true,
    isBestSeller: true,
    inStock: true,
    stockCount: 15,
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
    description: 'Incluye: 1 Vela de Soja + 1 Difusor de Varillas + 1 Aromatizador Textil + 1 Jabón Líquido en hermosa caja premium con cinta bordó y lazo dorado.',
    isActive: true
  }
];

export const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: 'promo-demo-cordoba',
    title: 'PROMO DEMO Rinoxpress Córdoba',
    subtitle: 'Set especial de verificación de sistema (Editable/Eliminable desde Admin)',
    description: 'Promoción DEMO activa para comprobar el correcto funcionamiento de la pantalla de promociones, carrito y pedidos. Podés modificarla o eliminarla cuando desees desde el Panel Administrativo.',
    discountBadge: '30% OFF DEMO',
    discountPercent: 30,
    originalPrice: 48000,
    promoPrice: 33600,
    finalPrice: 33600,
    image: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=800&q=80',
    productId: 'prod-rino-signature',
    productIds: ['prod-rino-signature', 'prod-difusor-madera-negra'],
    includedProductNames: [
      '1x Perfume Rinoxpress Signature 100ml',
      '1x Difusor de Varillas de Bambú 250ml',
      '1x Tester de Bolsillo de Regalo'
    ],
    expiresAt: '2026-10-31',
    validUntil: '31/10/2026',
    isActive: true,
    isDemo: true
  },
  {
    id: 'promo-1',
    title: 'Festival de Perfumería Fina',
    subtitle: 'Llevate tu Perfume Rino Signature con 10% OFF y cuotas',
    description: 'Aromas intensos con máxima fijación garantizada. Promoción por tiempo limitado hasta agotar stock.',
    discountBadge: '10% OFF',
    discountPercent: 10,
    originalPrice: 38500,
    promoPrice: 34500,
    finalPrice: 34500,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    productId: 'prod-rino-signature',
    productIds: ['prod-rino-signature'],
    includedProductNames: [
      'Perfume Signature Eau de Parfum 100ml',
      'Estuche rígido de colección',
      'Muestra de cortesía de regalo'
    ],
    expiresAt: '2026-09-30',
    validUntil: '30/09/2026',
    isActive: true
  },
  {
    id: 'promo-2',
    title: 'Kit Auto Prestige + Recarga',
    subtitle: 'El aroma de lujo para tu vehículo con precio especial',
    description: 'Clip de diseño en titanio con esencia concentrada de cuero y maderas nobles.',
    discountBadge: '17% OFF',
    discountPercent: 17,
    originalPrice: 11900,
    promoPrice: 9900,
    finalPrice: 9900,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    productId: 'prod-auto-luxury-leather',
    productIds: ['prod-auto-luxury-leather'],
    includedProductNames: [
      'Clip Difusor Metálico de Titanio para rejilla',
      'Frasco con esencia pura de Cuero & Maderas 10ml',
      'Repuesto de recarga rápida'
    ],
    expiresAt: '2026-09-20',
    validUntil: '20/09/2026',
    isActive: true
  },
  {
    id: 'promo-3',
    title: 'Combo Spa & Bienestar Rinoxpress',
    subtitle: 'Set completo de 4 piezas en caja de regalo bordó y dorado',
    description: 'Incluye vela de soja, difusor de varillas, spray textil y jabón de rosas.',
    discountBadge: '16% OFF',
    discountPercent: 16,
    originalPrice: 52000,
    promoPrice: 43500,
    finalPrice: 43500,
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
    bannerImage: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
    productId: 'prod-combo-spa-cordoba',
    productIds: ['prod-combo-spa-cordoba'],
    includedProductNames: [
      '1x Vela aromática de soja 200g',
      '1x Difusor de varillas de ratán 250ml',
      '1x Aromatizador textil en spray 500ml',
      '1x Jabón líquido botánico de lujo'
    ],
    expiresAt: '2026-09-15',
    validUntil: '15/09/2026',
    isActive: true
  }
];

export const INITIAL_BUSINESS_OPPORTUNITIES: BusinessOpportunity[] = [
  {
    id: 'opp-dropshipping',
    title: 'Dropshipping Rinoxpress',
    type: 'dropshipping',
    tagline: 'Vendé productos premium sin stock físico ni costos de logística',
    description: 'Comercializá toda la línea de perfumes y aromatizadores Rinoxpress desde tus redes sociales o tienda online. Nosotros despachamos directamente a tus clientes desde Córdoba.',
    requirements: [
      'Dispositivo móvil o computadora con conexión a internet',
      'Manejo básico de redes sociales (Instagram, WhatsApp, TikTok)',
      'Ganas de emprender y generar ingresos diarios'
    ],
    benefits: [
      'Margen de ganancia directo de hasta el 40% por venta',
      'Sin inversión previa en stock ni depósito físico',
      'Despacho inmediato a todo el país desde Córdoba con empaque premium',
      'Material publicitario, fotos en alta resolución y catálogo digital listo para compartir',
      'Capacitaciones comerciales semanales con el equipo Rinoxpress'
    ]
  },
  {
    id: 'opp-network',
    title: 'Red de Consumo & Ventas',
    type: 'network',
    tagline: 'Construí tu propio equipo y multiplicá tus ingresos residuales',
    description: 'Un modelo escalable donde ganas por tus ventas directas y por el volumen generado por tu red de revendedores en toda la provincia y el país.',
    requirements: [
      'Perfil comercial y proactivo con capacidad de liderazgo',
      'Cumplir con un volumen de activación mensual accesible',
      'Participación en el programa de formación oficial de líderes Rinoxpress'
    ],
    benefits: [
      'Descuentos mayoristas escalonados de hasta el 50%',
      'Comisiones mensuales por el volumen de tu equipo',
      'Premios por metas: bonificaciones, viajes e incentivos en efectivo',
      'Panel digital exclusivo para monitorear pedidos y comisiones',
      'Acompañamiento personalizado y asesoría estratégica directa'
    ]
  },
  {
    id: 'opp-franchise',
    title: 'Franquicias Rinoxpress',
    type: 'franchise',
    tagline: 'Abrí tu punto de venta oficial o isla comercial con una marca consolidada',
    description: 'Invertí en un modelo de negocio rentable con alta rotación de producto, diseño de local llave en mano y exclusividad territorial.',
    requirements: [
      'Capacidad de inversión según el formato elegido (Bronze a Diamond)',
      'Local comercial o stand en shopping/galería con buena afluencia',
      'Compromiso con los estándares de calidad y atención Rinoxpress'
    ],
    benefits: [
      'Exclusividad de zona o localidad en la provincia',
      'Diseño arquitectónico, mobiliario bordó y dorado e iluminación premium',
      'Stock inicial completo de apertura con precios preferenciales de fábrica',
      'Campaña de marketing digital geolocalizada para el lanzamiento',
      'Software de gestión y capacitación técnica integral'
    ],
    franchiseTiers: [
      {
        id: 'tier-bronze',
        name: 'Bronze',
        tagline: 'Punto de Venta / Corner Comercial',
        color: '#CD7F32',
        investmentNote: 'Módulo compacto para locales multimarca, peluquerías o spas',
        description: 'Mueble expositor de pie Rinoxpress con iluminación LED, tester de aromas y stock inicial concentrado en los 20 productos más vendidos.',
        perks: [
          'Expositor de lujo personalizado',
          'Kit de 20 testers con fragancias',
          'Stock inicial de rápida rotación',
          'Folletería y bolsas boutique',
          'Acceso al canal mayorista oficial'
        ]
      },
      {
        id: 'tier-silver',
        name: 'Silver',
        tagline: 'Isla Comercial / Stand de Shopping',
        color: '#C0C0C0',
        investmentNote: 'Estructura 360° para galerías comerciales de alto tránsito',
        description: 'Stand completo con exhibición de toda la gama de productos, sector de experiencia sensorial olfativa y punto de cobro.',
        perks: [
          'Stand modular con terminaciones en bordó y dorado',
          'Línea completa de probadores y difusores en funcionamiento',
          'Stock inicial ampliado con catálogo completo',
          'Uniforme oficial de asesores con el logo de Rino',
          'Publicidad geolocalizada en redes'
        ]
      },
      {
        id: 'tier-gold',
        name: 'Gold',
        tagline: 'Local Exclusivo Boutique',
        color: '#D4AF37',
        investmentNote: 'Tienda monomarca oficial en arteria comercial destacada',
        description: 'Experiencia inmersiva para el cliente con salón de ventas, barra de aromas, probadores de autor y depósito propio.',
        perks: [
          'Exclusividad territorial amplia en tu zona',
          'Manual de marca y arquitectura integral llave en mano',
          'Descuento máximo de franquicia directo de fábrica',
          'Sistema POS integrado con control de stock',
          'Capacitación presencial del equipo de ventas'
        ]
      },
      {
        id: 'tier-diamond',
        name: 'Diamond',
        tagline: 'Master Franquicia Regional',
        color: '#B9F2FF',
        investmentNote: 'Centro de distribución y tiendas oficiales con derechos regionales',
        description: 'El nivel más alto de asociación comercial. Operación del centro logístico regional, abastecimiento a revendedores y apertura de locales.',
        perks: [
          'Derechos de desarrollo para toda una ciudad o región',
          'Participación en el margen de distribución mayorista',
          'Soporte corporativo directo de la dirección de Rinoxpress',
          'Prioridad absoluta en lanzamientos y ediciones limitadas',
          'Auditoría y consultoría comercial mensual'
        ]
      }
    ]
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    createdAt: '2026-08-20T14:30:00Z',
    fullName: 'Mariana Gomez',
    phone: '+54 9 351 555-1234',
    email: 'mariana.g@gmail.com',
    city: 'Córdoba Capital (Nueva Córdoba)',
    interestOption: 'Dropshipping',
    message: 'Hola! Tengo una tienda de indumentaria femenina y quiero incorporar la línea de aromatizadores y perfumes.',
    status: 'Contactado'
  },
  {
    id: 'lead-2',
    createdAt: '2026-08-21T09:15:00Z',
    fullName: 'Esteban Rossini',
    phone: '+54 9 353 444-8899',
    email: 'e.rossini@hotmail.com',
    city: 'Villa María, Córdoba',
    interestOption: 'Franquicia Gold',
    message: 'Buenas tardes, dispongo de un local céntrico en Villa María y me gustaría evaluar una franquicia oficial.',
    status: 'Reunión Agendada'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'RX-1001',
    createdAt: '2026-08-21T10:15:00Z',
    customer: {
      name: 'Lucía Benítez',
      phone: '+54 9 351 678-9012',
      email: 'lucia.benitez@example.com',
      address: 'Av. Chacabuco 640, Depto 4B',
      city: 'Córdoba Capital',
      province: 'Córdoba',
      pickupOrDelivery: 'delivery',
      notes: 'Por favor avisar antes de llegar, timbre 4B.'
    },
    items: [
      {
        productId: 'prod-rino-signature',
        name: 'Perfume Rino Signature EDP',
        quantity: 1,
        price: 34500,
        size: '100 ml',
        fragrance: 'Amaderado Especiado & Ámbar',
        image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80'
      },
      {
        productId: 'prod-textil-lavanda',
        name: 'Aromatizador Textil Lavanda & Manzanilla',
        quantity: 2,
        price: 12500,
        size: '500 ml',
        fragrance: 'Lavanda Silvestre & Flores Calmas',
        image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80'
      }
    ],
    subtotal: 59500,
    deliveryCost: 2500,
    total: 62000,
    status: 'Preparando',
    whatsappSent: true
  },
  {
    id: 'ord-1002',
    orderNumber: 'RX-1002',
    createdAt: '2026-08-20T17:40:00Z',
    customer: {
      name: 'Joaquín Varela',
      phone: '+54 9 351 321-4567',
      email: 'j.varela@empresa.com',
      city: 'Córdoba Capital',
      province: 'Córdoba',
      pickupOrDelivery: 'pickup',
      notes: 'Retira por showroom central'
    },
    items: [
      {
        productId: 'prod-combo-spa-cordoba',
        name: 'Combo Spa & Bienestar Rinoxpress Córdoba',
        quantity: 1,
        price: 43500,
        size: 'Caja de Regalo',
        fragrance: 'Vainilla, Lavanda & Verbena Mix',
        image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80'
      }
    ],
    subtotal: 43500,
    deliveryCost: 0,
    total: 43500,
    status: 'Confirmado',
    whatsappSent: true
  }
];

export const DEMO_USERS: AppUser[] = [
  {
    id: 'usr-admin-1',
    fullName: 'Administrador Rinoxpress',
    email: 'admin@rinoxpress.com.ar',
    phone: '+54 9 351 234-5678',
    city: 'Córdoba Capital',
    role: 'Administrador',
    registeredAt: '2026-01-10'
  },
  {
    id: 'usr-member-1',
    fullName: 'Camila Navarro (Revendedora)',
    email: 'camila.navarro@rinoxpress.com.ar',
    phone: '+54 9 351 777-9911',
    city: 'Villa Carlos Paz, Córdoba',
    role: 'Integrante',
    registeredAt: '2026-03-15'
  },
  {
    id: 'usr-client-1',
    fullName: 'Lucía Benítez',
    email: 'lucia.benitez@example.com',
    phone: '+54 9 351 678-9012',
    city: 'Córdoba Capital',
    role: 'Cliente',
    registeredAt: '2026-05-02'
  }
];
