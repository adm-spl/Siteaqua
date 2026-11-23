import type { BookingProvider } from "./types";

/** Stub para a migração futura para o PMS Hostify. */
export const hostifyProvider: BookingProvider = {
  async availability() { throw new Error("Hostify não implementado"); },
  async quote() { throw new Error("Hostify não implementado"); },
  async request() { throw new Error("Hostify não implementado"); },
};
