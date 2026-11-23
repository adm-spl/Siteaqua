import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// `key` liga a mesma página entre idiomas (hreflang + seletor PT/EN).
const common = z.object({ key: z.string(), title: z.string(), description: z.string() });

const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: common.extend({
    kind: z.enum(["home", "units", "page"]),
    urlPath: z.string().default(""), // (não usar "slug": o Astro usa-o como id) caminho sem barras; "" = raiz do idioma
  }),
});

const units = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/units" }),
  schema: common.extend({
    unitId: z.string(), // tem de existir em config/units.json
    order: z.number(),
    highlights: z.array(z.string()).default([]),
  }),
});

export const collections = { pages, units };
