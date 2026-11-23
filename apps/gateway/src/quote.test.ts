import { test } from "node:test";
import assert from "node:assert/strict";
import type { PricingConfig, UnitsConfig } from "@aquavillae/contract";
import { calculateQuote, QuoteError } from "./quote.ts";

const units: UnitsConfig = { units: [{ id: "u1", name: { pt: "U1", en: "U1" }, maxGuests: 4, bedrooms: 2, calendarId: "x" }] };
const pricing: PricingConfig = {
  currency: "EUR", touristTaxPerPersonPerNight: 2, cleaningFee: 40, minNights: 2,
  seasons: [{ id: "alta", from: "07-01", to: "08-31" }, { id: "baixa", from: "09-01", to: "06-30" }],
  rates: { u1: { alta: 100, baixa: 60 } },
};
const q = (checkIn: string, checkOut: string, guests = 2, unitId = "u1") => calculateQuote({ unitId, checkIn, checkOut, guests }, pricing, units);

test("época única + limpeza + taxa", () => {
  const r = q("2026-10-01", "2026-10-04"); // 3 noites × 60 + 40 + 2×2×3
  assert.equal(r.nights, 3);
  assert.equal(r.total, 180 + 40 + 12);
});

test("atravessa épocas", () => {
  const r = q("2026-08-30", "2026-09-02"); // 2 alta + 1 baixa
  assert.equal(r.lines[0].amount + r.lines[1].amount, 260);
});

test("época que atravessa o ano", () => {
  const p = { ...pricing, seasons: [{ id: "inv", from: "12-01", to: "02-28" }, { id: "res", from: "03-01", to: "11-30" }], rates: { u1: { inv: 50, res: 70 } } };
  const r = calculateQuote({ unitId: "u1", checkIn: "2026-12-30", checkOut: "2027-01-02", guests: 1 }, p, units);
  assert.equal(r.lines[0].amount, 150);
});

test("erros", () => {
  const code = (fn: () => unknown) => { try { fn(); } catch (e) { return (e as QuoteError).code; } };
  assert.equal(code(() => q("2026-10-01", "2026-10-02")), "min_nights");
  assert.equal(code(() => q("2026-10-04", "2026-10-01")), "invalid_dates");
  assert.equal(code(() => q("2026-02-30", "2026-03-04")), "invalid_dates");
  assert.equal(code(() => q("2026-10-01", "2026-10-04", 5)), "too_many_guests");
  assert.equal(code(() => q("2026-10-01", "2026-10-04", 2, "zz")), "unknown_unit");
});

test("placeholders a 0 não geram linhas extra", () => {
  const p = { ...pricing, cleaningFee: 0, touristTaxPerPersonPerNight: 0 };
  assert.equal(calculateQuote({ unitId: "u1", checkIn: "2026-10-01", checkOut: "2026-10-03", guests: 2 }, p, units).lines.length, 1);
});
