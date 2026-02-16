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
    params: { includeDetails: true },
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return (res.data as BookingListItemResponse[]) || [];
};
