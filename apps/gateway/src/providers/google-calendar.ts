import type { BookingProvider } from "./types";

/** Adapter ativo na fase 1. TODO: Freebusy + criação de eventos [PEDIDO] via service account. */
export const googleCalendarProvider: BookingProvider = {
  async availability() { throw new Error("TODO: implementar Freebusy"); },
  async quote() { throw new Error("TODO: implementar cotação a partir de config/pricing.json"); },
  async request() { throw new Error("TODO: criar evento [PEDIDO] no calendário da unidade"); },
};
