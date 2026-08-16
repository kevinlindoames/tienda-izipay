import type { FooterContent, SiteHeaderContent } from "./site.types";

export const siteMock = {
  header: {
    brandName: "Marca provisional",
    brandHref: "/",
    navigation: [
      { label: "Productos", href: "/productos" },
      { label: "Soluciones", href: "/#use-cases" },
      { label: "Soporte", href: "/#contact" },
    ],
  },
  footer: {
    brandName: "Marca provisional",
    summary:
      "Información provisional de marca para completar la estructura visual del footer hasta recibir el contenido definitivo.",
    columns: [
      {
        title: "Productos",
        links: [
          { label: "Catálogo", href: "/productos" },
          { label: "Soluciones", href: "/soluciones" },
        ],
      },
      {
        title: "Empresa",
        links: [
          { label: "Nosotros", href: "/empresa" },
          { label: "Contacto", href: "/contacto" },
        ],
      },
      {
        title: "Ayuda",
        links: [
          { label: "Soporte", href: "/soporte" },
          { label: "Preguntas frecuentes", href: "/preguntas-frecuentes" },
        ],
      },
    ],
    contactEmail: "contacto@ejemplo.com",
    newsletter: {
      title: "Novedades",
      description:
        "Espacio visual provisional para una futura suscripción. Todavía no envía datos.",
      statusLabel: "Suscripción pendiente de activación",
    },
    socialLabels: [
      "Instagram pendiente",
      "LinkedIn pendiente",
      "YouTube pendiente",
    ],
    copyright: "© 2026 Marca provisional.",
  },
} satisfies {
  header: SiteHeaderContent;
  footer: FooterContent;
};
