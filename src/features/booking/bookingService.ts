import { api } from "../../api/client";

export interface CreateBookingItemPayload {
  outfitSizeId: number;
  rentalPackageId?: number;
  startTime: string;
  endTime?: string;
  unitPrice?: number;
  depositAmount?: number;
  surcharge?: number;
}

export interface CreateBookingServiceAddonPayload {
  addonId: number;
  priceAtBooking?: number;
}

export interface CreateBookingServicePayload {
  servicePkgId?: number;
  serviceTime?: string;
  totalPrice?: number;
  addons?: CreateBookingServiceAddonPayload[];
}

export interface CreateBookingPayload {
  addressId: number;
  rentalDays?: number;
  items?: CreateBookingItemPayload[];
  service?: CreateBookingServicePayload;
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

export interface BookingDetailResponse {
  detailId?: number;
  outfitSizeId?: number;
  rentalPackageId?: number;
  rentalPackageName?: string;
  outfitId?: number;
  outfitName?: string;
  outfitType?: string;
  outfitSizeLabel?: string;
  outfitImageUrl?: string;
  startTime?: string;
  endTime?: string;
  rentalDays?: number;
  unitPrice?: number;
  depositAmount?: number;
  lateFee?: number;
  damageFee?: number;
  status?: string;
}

export interface ServiceBookingResponse {
  svcBookingId?: number;
  userId?: number;
  userFullName?: string;
  userEmail?: string;
  bookingId?: number;
  servicePkgId?: number;
  servicePackageName?: string;
  studioName?: string;
  serviceTime?: string;
  totalPrice?: number;
  status?: string;
  totalAddons?: number;
}

export interface BookingListItemResponse extends BookingResponse {
  details?: BookingDetailResponse[];
  serviceBookings?: ServiceBookingResponse[];
}

type BookingApiResponse = BookingListItemResponse & {
  services?: ServiceBookingResponse[];
  Services?: ServiceBookingResponse[];
};

const normalizeBooking = (value: unknown): BookingListItemResponse => {
  const booking =
    value && typeof value === "object"
      ? ({ ...(value as BookingApiResponse) } as BookingApiResponse)
      : ({} as BookingApiResponse);

  const normalizedServiceBookings = Array.isArray(booking.serviceBookings)
    ? booking.serviceBookings
    : Array.isArray(booking.services)
      ? booking.services
      : Array.isArray(booking.Services)
        ? booking.Services
        : undefined;

  if (normalizedServiceBookings) {
    booking.serviceBookings = normalizedServiceBookings;
  }

  return booking;
};

export const createBooking = async (
  payload: CreateBookingPayload,
  token?: string | null,
): Promise<BookingResponse> => {
  const res = await api.post("/api/Booking/create", payload, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return res.data as BookingResponse;
};

export const getMyBookings = async (
  token?: string | null,
): Promise<BookingListItemResponse[]> => {
  const res = await api.get("/api/Booking/get-all", {
    params: { includeDetails: true, includeServices: true },
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return Array.isArray(res.data)
    ? res.data.map(normalizeBooking)
    : [];
};

export const getMyBookingById = async (
  bookingId: number,
  token?: string | null,
): Promise<BookingListItemResponse> => {
  const res = await api.get(`/api/Booking/get-by-id/${bookingId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return normalizeBooking(res.data);
};

export const cancelMyBooking = async (
  bookingId: number,
  token?: string | null,
): Promise<{ message?: string }> => {
  const res = await api.patch(
    `/api/Booking/cancel/${bookingId}`,
    {},
    {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    },
  );

  return (res.data as { message?: string }) || {};
};
