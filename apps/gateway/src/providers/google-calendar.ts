import type { PricingConfig, UnitsConfig } from "@aquavillae/contract";
import pricing from "../../../../config/pricing.json";
import units from "../../../../config/units.json";
import { calculateQuote } from "../quote";
import type { BookingProvider } from "./types";

/** Adapter ativo na fase 1. TODO: Freebusy + criação de eventos [PEDIDO] via service account. */
export const googleCalendarProvider: BookingProvider = {
  async availability() { throw new Error("TODO: implementar Freebusy"); },
  async quote(req) { return calculateQuote(req, pricing as unknown as PricingConfig, units as unknown as UnitsConfig); },
  async request() { throw new Error("TODO: criar evento [PEDIDO] no calendário da unidade"); },
};
