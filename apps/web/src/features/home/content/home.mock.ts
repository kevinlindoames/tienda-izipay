import { siteMock } from "@/content/site.mock";
import { createMockMedia } from "@/lib/media/mock-media";
import type { HomePageContent } from "../types/home.types";

export const homeMock = {
  header: siteMock.header,
  productNavigation: {
    productName: "Producto destacado",
    productCode: "C\u00f3digo provisional",
    items: [
      { label: "Overview", href: "#overview" },
      { label: "Caracter\u00edsticas", href: "#features" },
      { label: "Usos", href: "#use-cases" },
      { label: "Compatibilidad", href: "#compatibility" },
    ],
    primaryAction: {
      label: "Comprar",
      href: "#purchase",
    },
    secondaryAction: {
      label: "Solicitar informaci\u00f3n",
      href: "#contact",
    },
  },
  hero: {
    eyebrow: "Producto destacado",
    title: "Una experiencia amplia, clara y profesional",
    subtitle:
      "Contenido provisional preparado para ser administrado posteriormente.",
    media: createMockMedia({
      id: "home-media-1",
      seed: "home-section-1",
      alt: "Imagen principal pendiente de entrega",
    }),
  },
  introduction: {
    title:
      "Tecnolog\u00eda dise\u00f1ada para adaptarse a distintos escenarios",
    paragraphs: [
      "Texto provisional de introducci\u00f3n al producto.",
      "La versi\u00f3n final ser\u00e1 proporcionada o aprobada por el cliente.",
    ],
  },
  featuresHeading: {
    eyebrow: "Caracter\u00edsticas",
    title: "Caracter\u00edsticas principales",
    description:
      "Especificaciones provisionales preparadas para reemplazarse con la informaci\u00f3n aprobada por el cliente.",
  },
  features: [
    {
      id: "feature-view",
      title: "Campo de visi\u00f3n",
      description:
        "Detalle provisional del campo de visi\u00f3n, pendiente de confirmaci\u00f3n.",
      iconKey: "view",
    },
    {
      id: "feature-sensor",
      title: "Sensor",
      description:
        "Detalle provisional del sensor, pendiente de confirmaci\u00f3n.",
      iconKey: "sensor",
    },
    {
      id: "feature-noise",
      title: "Reducci\u00f3n de ruido",
      description:
        "Detalle provisional de reducci\u00f3n de ruido, pendiente de confirmaci\u00f3n.",
      iconKey: "noise",
    },
    {
      id: "feature-resolution",
      title: "Resoluci\u00f3n",
      description:
        "Detalle provisional de resoluci\u00f3n, pendiente de confirmaci\u00f3n.",
      iconKey: "resolution",
    },
    {
      id: "feature-microphone",
      title: "Micr\u00f3fono",
      description:
        "Detalle provisional del micr\u00f3fono, pendiente de confirmaci\u00f3n.",
      iconKey: "microphone",
    },
    {
      id: "feature-lighting",
      title: "Iluminaci\u00f3n",
      description:
        "Detalle provisional de iluminaci\u00f3n, pendiente de confirmaci\u00f3n.",
      iconKey: "lighting",
    },
    {
      id: "feature-portability",
      title: "Portabilidad",
      description:
        "Detalle provisional de portabilidad, pendiente de confirmaci\u00f3n.",
      iconKey: "portability",
    },
    {
      id: "feature-plug",
      title: "Plug and play",
      description:
        "Detalle provisional de conexi\u00f3n, pendiente de confirmaci\u00f3n.",
      iconKey: "plug",
    },
  ],
  editorialGrid: {
    eyebrow: "Usos y beneficios",
    title: "Dise\u00f1ado para distintos espacios de trabajo",
    description:
      "Dos escenarios editoriales provisionales que ser\u00e1n reemplazados por fotograf\u00edas y mensajes aprobados por el cliente.",
    items: [
      {
        id: "editorial-collaboration",
        title: "Colaboraci\u00f3n m\u00e1s natural",
        body: "Bloque provisional para explicar un escenario de colaboraci\u00f3n, reuni\u00f3n o trabajo compartido.",
        media: createMockMedia({
          id: "home-media-2",
          seed: "home-section-2",
          alt: "Imagen editorial de colaboraci\u00f3n pendiente",
        }),
        mediaPosition: "left",
        tone: "light",
      },
      {
        id: "editorial-flexibility",
        title: "Configuraci\u00f3n flexible",
        body: "Bloque provisional para explicar c\u00f3mo el producto puede adaptarse a diferentes espacios y necesidades.",
        media: createMockMedia({
          id: "home-media-3",
          seed: "home-section-3",
          alt: "Imagen editorial de configuraci\u00f3n flexible pendiente",
        }),
        mediaPosition: "right",
        tone: "soft",
      },
    ],
  },
  editorialBlocks: [
    {
      id: "workflow",
      title: "Un flujo de trabajo m\u00e1s simple",
      body: "Contenido provisional para explicar una experiencia de uso clara, directa y preparada para distintos contextos.",
      media: createMockMedia({
        id: "home-media-4",
        seed: "home-section-4",
        alt: "Imagen de flujo de trabajo pendiente",
      }),
      mediaPosition: "left",
      tone: "light",
    },
    {
      id: "adaptability",
      title: "Se adapta a tu forma de trabajar",
      body: "Contenido provisional para una secci\u00f3n alternada con foco en flexibilidad y facilidad de configuraci\u00f3n.",
      media: createMockMedia({
        id: "home-media-5",
        seed: "home-section-5",
        alt: "Imagen de adaptabilidad pendiente",
      }),
      mediaPosition: "right",
      tone: "soft",
    },
    {
      id: "design",
      title: "Dise\u00f1ado para integrarse sin complicaciones",
      body: "Contenido provisional para presentar una tercera escena editorial antes de la secci\u00f3n de compatibilidad.",
      media: createMockMedia({
        id: "home-media-6",
        seed: "home-section-6",
        alt: "Imagen de integraci\u00f3n pendiente",
      }),
      mediaPosition: "left",
      tone: "light",
    },
  ],
  highlight: {
    eyebrow: "Tecnolog\u00eda destacada",
    title: "Funcionalidad destacada",
    body: "Descripci\u00f3n provisional para una secci\u00f3n de alto contraste que presentar\u00e1 una capacidad clave del producto.",
    media: createMockMedia({
      id: "home-media-7",
      seed: "home-section-7",
      alt: "Gr\u00e1fico informativo destacado pendiente",
    }),
  },
  compatibility: {
    eyebrow: "Compatibilidad",
    title: "Compatible con tus herramientas",
    paragraphs: [
      "Texto provisional de compatibilidad preparado para describir plataformas, conexiones y herramientas relacionadas.",
      "Los logos definitivos solo se incorporar\u00e1n cuando exista autorizaci\u00f3n y material aprobado.",
    ],
    items: [
      {
        id: "compat-computers",
        title: "Computadoras",
        description:
          "Compatibilidad provisional con equipos de escritorio y port\u00e1tiles.",
        iconKey: "resolution",
      },
      {
        id: "compat-browsers",
        title: "Navegadores modernos",
        description:
          "Escenario provisional para herramientas basadas en navegador.",
        iconKey: "view",
      },
      {
        id: "compat-meetings",
        title: "Videollamadas",
        description:
          "Escenario provisional para aplicaciones de comunicaci\u00f3n.",
        iconKey: "microphone",
      },
      {
        id: "compat-usb",
        title: "Conexi\u00f3n directa",
        description:
          "Escenario provisional de conexi\u00f3n y configuraci\u00f3n sencilla.",
        iconKey: "plug",
      },
    ],
  },
  footer: siteMock.footer,
} satisfies HomePageContent;
