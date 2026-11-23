import type { AvailabilityRequest, AvailabilityResponse, BookingRequest, BookingResponse, QuoteRequest, QuoteResponse } from "@aquavillae/contract";

/** Motor de reservas. Trocar de adapter não pode afetar o frontend. */
export interface BookingProvider {
  availability(req: AvailabilityRequest): Promise<AvailabilityResponse>;
  quote(req: QuoteRequest): Promise<QuoteResponse>;
  request(req: BookingRequest): Promise<BookingResponse>;
}
