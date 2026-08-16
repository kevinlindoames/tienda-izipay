import type { CatalogCategory, Product } from "../types/catalog.types";

export const catalogCategories: CatalogCategory[] = [
  {
    id: "category-video",
    slug: "video",
    name: "Video",
    description: "Camaras y soluciones visuales provisionales.",
  },
  {
    id: "category-audio",
    slug: "audio",
    name: "Audio",
    description: "Microfonos y audio para distintos espacios.",
  },
  {
    id: "category-accessories",
    slug: "accesorios",
    name: "Accesorios",
    description: "Complementos para completar una configuracion.",
  },
];

export const catalogProducts: Product[] = [
  {
    id: "product-camera-pro",
    slug: "camara-pro-4k",
    sku: "VID-001",
    name: "Cámara Pro 4K",
    shortDescription:
      "Camara provisional para videollamadas y creación de contenido.",
    description:
      "Producto provisional preparado para validar la arquitectura del catálogo, la ficha de producto y la futura conexión con la API.",
    price: { minorAmount: 129900, currency: "PEN" },
    compareAtPrice: { minorAmount: 149900, currency: "PEN" },
    availability: "in-stock",
    active: true,
    featured: true,
    categorySlug: "video",
    images: [
      {
        id: "catalog-image-1",
        desktopSrc: "https://picsum.photos/seed/camera-pro-4k/900/900",
        mobileSrc: "https://picsum.photos/seed/camera-pro-4k/700/700",
        alt: "Fotografia referencial provisional de Cámara Pro 4K",
        position: 1,
        isPrimary: true,
      },
    ],
  },
  {
    id: "product-camera-compact",
    slug: "camara-compacta-hd",
    sku: "VID-002",
    name: "Cámara Compacta HD",
    shortDescription:
      "Formato compacto para escritorios y espacios de trabajo personales.",
    description:
      "Ficha provisional de una camara compacta pensada para comprobar listados, filtros y navegacion por slug.",
    price: { minorAmount: 79900, currency: "PEN" },
    availability: "low-stock",
    active: true,
    featured: false,
    categorySlug: "video",
    images: [
      {
        id: "catalog-image-2",
        desktopSrc: "https://picsum.photos/seed/camera-compact-hd/900/900",
        mobileSrc: "https://picsum.photos/seed/camera-compact-hd/700/700",
        alt: "Fotografia referencial provisional de Cámara Compacta HD",
        position: 1,
        isPrimary: true,
      },
    ],
  },
  {
    id: "product-streaming-kit",
    slug: "kit-streaming-studio",
    sku: "VID-003",
    name: "Kit Streaming Studio",
    shortDescription:
      "Conjunto provisional para una configuracion audiovisual completa.",
    description:
      "Producto compuesto provisional utilizado para validar precios, contenido y comportamiento responsive de la ficha.",
    price: { minorAmount: 169900, currency: "PEN" },
    availability: "in-stock",
    active: true,
    featured: true,
    categorySlug: "video",
    images: [
      {
        id: "catalog-image-3",
        desktopSrc: "https://picsum.photos/seed/streaming-studio/900/900",
        mobileSrc: "https://picsum.photos/seed/streaming-studio/700/700",
        alt: "Fotografia referencial provisional de Kit Streaming Studio",
        position: 1,
        isPrimary: true,
      },
    ],
  },
  {
    id: "product-microphone",
    slug: "microfono-usb-studio",
    sku: "AUD-001",
    name: "Micrófono USB Studio",
    shortDescription:
      "Microfono provisional con conexión directa para reuniones y contenido.",
    description:
      "Ficha provisional para representar un producto de audio dentro del catálogo y preparar el futuro contrato del backend.",
    price: { minorAmount: 45900, currency: "PEN" },
    availability: "in-stock",
    active: true,
    featured: true,
    categorySlug: "audio",
    images: [
      {
        id: "catalog-image-4",
        desktopSrc: "https://picsum.photos/seed/microphone-studio/900/900",
        mobileSrc: "https://picsum.photos/seed/microphone-studio/700/700",
        alt: "Fotografia referencial provisional de Micrófono USB Studio",
        position: 1,
        isPrimary: true,
      },
    ],
  },
  {
    id: "product-speaker",
    slug: "speaker-conference",
    sku: "AUD-002",
    name: "Speaker Conference",
    shortDescription:
      "Audio provisional para salas pequenas y reuniones de equipo.",
    description:
      "Producto de audio provisional para validar la categoria, la busqueda y la ficha individual.",
    price: { minorAmount: 64900, currency: "PEN" },
    availability: "out-of-stock",
    active: true,
    featured: false,
    categorySlug: "audio",
    images: [
      {
        id: "catalog-image-5",
        desktopSrc: "https://picsum.photos/seed/speaker-conference/900/900",
        mobileSrc: "https://picsum.photos/seed/speaker-conference/700/700",
        alt: "Fotografia referencial provisional de Speaker Conference",
        position: 1,
        isPrimary: true,
      },
    ],
  },
  {
    id: "product-hub",
    slug: "hub-usb-c-connect",
    sku: "ACC-001",
    name: "Hub USB-C Connect",
    shortDescription:
      "Hub provisional para ampliar conexiónes en una estacion de trabajo.",
    description:
      "Accesorio provisional preparado para validar catálogo, ordenamiento por precio y pagina de detalle.",
    price: { minorAmount: 24900, currency: "PEN" },
    availability: "in-stock",
    active: true,
    featured: false,
    categorySlug: "accesorios",
    images: [
      {
        id: "catalog-image-6",
        desktopSrc: "https://picsum.photos/seed/usb-c-hub/900/900",
        mobileSrc: "https://picsum.photos/seed/usb-c-hub/700/700",
        alt: "Fotografia referencial provisional de Hub USB-C Connect",
        position: 1,
        isPrimary: true,
      },
    ],
  },
  {
    id: "product-stand",
    slug: "soporte-escritorio-flex",
    sku: "ACC-002",
    name: "Soporte Escritorio Flex",
    shortDescription:
      "Soporte provisional para organizar una configuracion de escritorio.",
    description:
      "Accesorio provisional utilizado para probar paginacion y presentacion de contenido.",
    price: { minorAmount: 18900, currency: "PEN" },
    availability: "in-stock",
    active: true,
    featured: false,
    categorySlug: "accesorios",
    images: [
      {
        id: "catalog-image-7",
        desktopSrc: "https://picsum.photos/seed/desk-stand-flex/900/900",
        mobileSrc: "https://picsum.photos/seed/desk-stand-flex/700/700",
        alt: "Fotografia referencial provisional de Soporte Escritorio Flex",
        position: 1,
        isPrimary: true,
      },
    ],
  },
  {
    id: "product-light",
    slug: "luz-led-work",
    sku: "ACC-003",
    name: "Luz LED Work",
    shortDescription:
      "Iluminacion provisional para videollamadas y espacios de trabajo.",
    description:
      "Producto provisional para completar el volumen inicial del catálogo y comprobar la segunda pagina de resultados.",
    price: { minorAmount: 29900, currency: "PEN" },
    availability: "low-stock",
    active: true,
    featured: false,
    categorySlug: "accesorios",
    images: [
      {
        id: "catalog-image-8",
        desktopSrc: "https://picsum.photos/seed/led-work-light/900/900",
        mobileSrc: "https://picsum.photos/seed/led-work-light/700/700",
        alt: "Fotografia referencial provisional de Luz LED Work",
        position: 1,
        isPrimary: true,
      },
    ],
  },
];
