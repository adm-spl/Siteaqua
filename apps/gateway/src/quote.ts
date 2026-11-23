import type { PricingConfig, QuoteRequest, QuoteResponse, UnitsConfig } from "@aquavillae/contract";

export type QuoteErrorCode = "invalid_dates" | "unknown_unit" | "too_many_guests" | "min_nights" | "no_rate";

export class QuoteError extends Error {
  code: QuoteErrorCode;
  constructor(code: QuoteErrorCode, message: string) { super(message); this.code = code; }
}

const DAY_MS = 86_400_000;
const round2 = (n: number) => Math.round(n * 100) / 100;

function parseDate(s: string): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) throw new QuoteError("invalid_dates", `Data inválida: ${s}`);
  const d = new Date(`${s}T00:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== s) throw new QuoteError("invalid_dates", `Data inválida: ${s}`);
  return d;
}

function seasonFor(md: string, seasons: PricingConfig["seasons"]) {
  return seasons.find(({ from, to }) => (from <= to ? md >= from && md <= to : md >= from || md <= to));
}

/** Cotação pura: sem I/O, determinística. */
export function calculateQuote(req: QuoteRequest, pricing: PricingConfig, units: UnitsConfig): QuoteResponse {
  const unit = units.units.find((u) => u.id === req.unitId);
  if (!unit) throw new QuoteError("unknown_unit", `Unidade desconhecida: ${req.unitId}`);

  const start = parseDate(req.checkIn).getTime();
  const nights = Math.round((parseDate(req.checkOut).getTime() - start) / DAY_MS);
  if (nights < 1) throw new QuoteError("invalid_dates", "A saída tem de ser posterior à entrada");
  if (nights < pricing.minNights) throw new QuoteError("min_nights", `Estadia mínima: ${pricing.minNights} noites`);

  if (!Number.isInteger(req.guests) || req.guests < 1) throw new QuoteError("too_many_guests", "Número de hóspedes inválido");
  if (unit.maxGuests > 0 && req.guests > unit.maxGuests) throw new QuoteError("too_many_guests", `Máximo ${unit.maxGuests} hóspedes`);

  // Noites agrupadas por época: a noite conta na data de entrada desse dia.
  const bySeason = new Map<string, number>();
  for (let i = 0; i < nights; i++) {
    const md = new Date(start + i * DAY_MS).toISOString().slice(5, 10);
    const season = seasonFor(md, pricing.seasons);
    if (!season) throw new QuoteError("no_rate", `Sem época definida para ${md}`);
    bySeason.set(season.id, (bySeason.get(season.id) ?? 0) + 1);
  }

  const lines: QuoteResponse["lines"] = [];
  for (const [seasonId, count] of bySeason) {
    const rate = pricing.rates[unit.id]?.[seasonId];
    if (typeof rate !== "number") throw new QuoteError("no_rate", `Sem tarifa para ${unit.id} / ${seasonId}`);
    lines.push({ label: `${count} × ${seasonId} (${rate.toFixed(2)})`, amount: round2(count * rate) });
  }
  if (pricing.cleaningFee > 0) lines.push({ label: "cleaning", amount: round2(pricing.cleaningFee) });
  if (pricing.touristTaxPerPersonPerNight > 0)
    lines.push({ label: "tourist_tax", amount: round2(pricing.touristTaxPerPersonPerNight * req.guests * nights) });

  return {
    unitId: unit.id, nights, currency: pricing.currency, lines,
    total: round2(lines.reduce((sum, l) => sum + l.amount, 0)),
  };
}
