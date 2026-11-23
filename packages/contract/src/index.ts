/** Contrato partilhado entre apps/web e apps/gateway. */

export type Locale = "pt" | "en";
export type UnitId = string;
/** Data ISO YYYY-MM-DD. */
export type IsoDate = string;

export interface AvailabilityRequest { unitId?: UnitId; checkIn: IsoDate; checkOut: IsoDate; guests: number }
export interface AvailabilityResponse { available: { unitId: UnitId; available: boolean }[] }

export interface QuoteRequest { unitId: UnitId; checkIn: IsoDate; checkOut: IsoDate; guests: number }
export interface QuoteResponse {
  unitId: UnitId; nights: number; currency: string;
  lines: { label: string; amount: number }[]; total: number;
}

export interface BookingRequest extends QuoteRequest {
  guest: { name: string; email: string; phone?: string; notes?: string };
  locale: Locale;
}

/** `pending` = pedido manual (fase 1). `redirect` = checkout externo (PMS futuro). */
export type BookingResponse =
  | { kind: "pending"; requestId: string }
  | { kind: "redirect"; url: string };

export interface ApiError { error: string; message: string }
