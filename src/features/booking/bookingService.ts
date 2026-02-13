import { api } from "../../api/client";

export interface CreateBookingItemPayload {
  outfitSizeId: number;
  rentalPackageId?: number;
  startTime?: string;
}

export interface CreateBookingPayload {
  addressId: number;
  rentalDays?: number;
  items?: CreateBookingItemPayload[];
  servicePackageIds?: number[];
}

export interface BookingResponse {
  bookingId?: number;
  userId?: number;
  addressId?: number;
  addressText?: string;
  totalRentalAmount?: number;
  totalDepositAmount?: number;
  totalSurcharge?: number;
  totalServiceAmount?: number;
  totalOrderAmount?: number;
  status?: string;
  paymentStatus?: string;
  bookingDate?: string;
}

export const createBooking = async (
  payload: CreateBookingPayload,
  token?: string | null,
): Promise<BookingResponse> => {
  const res = await api.post("/api/Booking/create", payload, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return res.data as BookingResponse;
};
