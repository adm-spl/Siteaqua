import pricing from "../../../../config/pricing.json";
import type { Lang } from "./site";

/** MAQUETE: dados simulados. Nada disto é real. */
export const img = (name: string) => `/maquete/${name}.svg`;

export function fromPrice(unitId: string): number | undefined {
  const rates = (pricing.rates as Record<string, Record<string, number | string>>)[unitId] ?? {};
  const nums = Object.values(rates).filter((v): v is number => typeof v === "number" && v > 0);
  return nums.length ? Math.min(...nums) : undefined;
}

export const experiences = {
  pt: [
    { image: "termas", title: "Retiro de Yoga e Águas Termais", text: "Meditação ao nascer do dia e tardes nas nascentes termais." },
    { image: "gastronomia", title: "Workshop de Gastronomia Local", text: "Cozinhe com ingredientes da região e sabores de Lafões." },
    { image: "trilhos", title: "Fim de Semana de Desligar", text: "Caminhadas e descanso, longe do ecrã." },
  ],
  en: [
    { image: "termas", title: "Yoga & Thermal Waters Retreat", text: "Sunrise meditation and afternoons at the thermal springs." },
    { image: "gastronomia", title: "Local Cooking Workshop", text: "Cook with regional ingredients and Lafões flavours." },
    { image: "trilhos", title: "Digital Detox Weekend", text: "Walks and rest, away from the screen." },
  ],
} satisfies Record<Lang, { image: string; title: string; text: string }[]>;

export const testimonials = {
  pt: [
    { name: "Marta, Porto", text: "Silêncio, conforto e as termas à porta. Voltaremos." },
    { name: "João e Ana, Lisboa", text: "O terraço ao fim do dia foi o melhor momento da estadia." },
    { name: "Claire, França", text: "Un séjour paisible, tout était impeccable." },
  ],
  en: [
    { name: "Marta, Porto", text: "Silence, comfort and the springs at our door. We will be back." },
    { name: "João & Ana, Lisbon", text: "The terrace at sunset was the highlight of our stay." },
    { name: "Claire, France", text: "A peaceful stay, everything was spotless." },
  ],
} satisfies Record<Lang, { name: string; text: string }[]>;

export const faq = {
  pt: [
    { q: "A que horas é o check-in e o check-out?", a: "Check-in a partir das 15h e check-out até às 11h (valores simulados)." },
    { q: "Aceitam animais?", a: "Sob consulta (resposta simulada)." },
    { q: "Como funciona o pedido de reserva?", a: "Envia o pedido e confirmamos a disponibilidade por email em 24 horas (simulado)." },
  ],
  en: [
    { q: "What are the check-in and check-out times?", a: "Check-in from 3 pm and check-out by 11 am (simulated values)." },
    { q: "Are pets allowed?", a: "On request (simulated answer)." },
    { q: "How does the booking request work?", a: "Send a request and we confirm availability by email within 24 hours (simulated)." },
  ],
} satisfies Record<Lang, { q: string; a: string }[]>;

export const t = {
  pt: { from: "desde", night: "/ noite", exp: "Experiências", reviews: "O que dizem os hóspedes", faq: "Perguntas frequentes", banner: "MAQUETE · dados e imagens simulados", gallery: "Galeria", regionTitle: "Descubra a região", regionText: "Termas, serra, rio e a gastronomia de Lafões.", regionCta: "Explorar a região" },
  en: { from: "from", night: "/ night", exp: "Experiences", reviews: "What guests say", faq: "Frequently asked questions", banner: "MOCKUP · simulated data and images", gallery: "Gallery", regionTitle: "Discover the region", regionText: "Thermal springs, mountains, river and Lafões cuisine.", regionCta: "Explore the region" },
} as const;
