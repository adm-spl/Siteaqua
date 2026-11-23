import { getCollection, type CollectionEntry } from "astro:content";

export const locales = ["pt", "en"] as const;
export type Lang = (typeof locales)[number];

export const ui = {
  pt: {
    brand: "AquaVillae", tagline: "Alojamento Local · São Pedro do Sul",
    unitsPath: "alojamentos", bookPath: "reservar",
    nav: { units: "Alojamentos", region: "Região", activities: "Atividades", events: "Eventos", contact: "Contactos", book: "Reservar" },
    skip: "Saltar para o conteúdo", seeUnit: "Ver alojamento", guestsFeatures: "Destaques",
    footer: { privacy: "Privacidade", complaints: "Livro de Reclamações", rights: "Todos os direitos reservados." },
  },
  en: {
    brand: "AquaVillae", tagline: "Holiday Rentals · São Pedro do Sul",
    unitsPath: "accommodation", bookPath: "book",
    nav: { units: "Accommodation", region: "The Region", activities: "Activities", events: "Events", contact: "Contact", book: "Book" },
    skip: "Skip to content", seeUnit: "View accommodation", guestsFeatures: "Highlights",
    footer: { privacy: "Privacy", complaints: "Complaints Book", rights: "All rights reserved." },
  },
} as const;

export interface Route {
  lang: Lang; key: string; path: string; href: string;
  kind: "home" | "units" | "page" | "unit";
  entry: CollectionEntry<"pages"> | CollectionEntry<"units">;
}

const hrefOf = (lang: Lang, path: string) => `/${lang}/${path ? path + "/" : ""}`;
const langOf = (id: string) => id.split("/")[0] as Lang;

export async function buildRoutes(): Promise<Route[]> {
  const [pages, units] = await Promise.all([getCollection("pages"), getCollection("units")]);
  const routes: Route[] = [];
  for (const e of pages) {
    const lang = langOf(e.id);
    routes.push({ lang, key: e.data.key, path: e.data.urlPath, href: hrefOf(lang, e.data.urlPath), kind: e.data.kind, entry: e });
  }
  for (const e of units) {
    const lang = langOf(e.id);
    const path = `${ui[lang].unitsPath}/${e.data.key}`;
    routes.push({ lang, key: e.data.key, path, href: hrefOf(lang, path), kind: "unit", entry: e });
  }
  return routes;
}

export async function unitsFor(lang: Lang) {
  const all = await getCollection("units");
  return all.filter((u) => langOf(u.id) === lang).sort((a, b) => a.data.order - b.data.order)
    .map((u) => ({ entry: u, href: hrefOf(lang, `${ui[lang].unitsPath}/${u.data.key}`) }));
}

export const hrefFor = (routes: Route[], lang: Lang, key: string) =>
  routes.find((r) => r.lang === lang && r.key === key)?.href ?? `/${lang}/`;

/** Contactos públicos (fonte: site anterior; confirmar). Email e mapa em falta. */
export const contact = {
  address: "Rua Principal do Cadaval 470, 3660-684 São Pedro do Sul",
  whatsappUrl: "https://wa.me/351967333926",
  phone: "+351 967 333 926",
  instagram: "https://www.instagram.com/aquavillae",
  complaintsBook: "https://www.livroreclamacoes.pt/",
};

export interface Chrome {
  nav: { href: string; label: string }[];
  book: { href: string; label: string };
  footer: { href: string; label: string }[];
}

/** Cabeçalho/rodapé de um idioma; as chaves vêm de src/content/pages. */
export function chromeFor(routes: Route[], lang: Lang): Chrome {
  const t = ui[lang];
  return {
    nav: [
      { href: hrefFor(routes, lang, "units"), label: t.nav.units },
      { href: hrefFor(routes, lang, "region"), label: t.nav.region },
      { href: hrefFor(routes, lang, "activities"), label: t.nav.activities },
      { href: hrefFor(routes, lang, "events"), label: t.nav.events },
      { href: hrefFor(routes, lang, "contact"), label: t.nav.contact },
    ],
    book: { href: hrefFor(routes, lang, "book"), label: t.nav.book },
    footer: [
      { href: hrefFor(routes, lang, "privacy"), label: t.footer.privacy },
      { href: contact.complaintsBook, label: t.footer.complaints },
      { href: contact.whatsappUrl, label: "WhatsApp" },
      { href: contact.instagram, label: "Instagram" },
    ],
  };
}

export const alternatesFor = (routes: Route[], key: string) =>
  Object.fromEntries(locales.map((l) => [l, routes.find((r) => r.lang === l && r.key === key)?.href]).filter(([, h]) => h)) as Partial<Record<Lang, string>>;
