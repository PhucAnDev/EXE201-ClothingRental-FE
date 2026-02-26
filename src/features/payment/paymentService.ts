import { api } from "../../api/client";

export type PaymentType = "deposit" | "full";

export interface CreatePaymentPayload {
  bookingId: number;
  paymentType: PaymentType;
}

export interface CreatePaymentResponse {
  CheckoutUrl?: string;
  checkoutUrl?: string;
  Url?: string;
  url?: string;
  BookingId?: number;
  bookingId?: number;
  PaymentType?: string;
  paymentType?: string;
  Amount?: number;
  amount?: number;
  OrderCode?: number;
  orderCode?: number;
  TransactionRef?: string;
}

export interface SyncPaymentStatusResponse {
  success?: boolean;
  message?: string;
  orderCode?: number;
  bookingId?: number;
  payOsStatus?: string;
  localPaymentStatus?: string;
  bookingPaymentStatus?: string;
}

export const createPaymentUrl = async (
  payload: CreatePaymentPayload,
  token?: string | null,
): Promise<CreatePaymentResponse> => {
  const res = await api.post("/api/PayOs/create-payment", payload, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  const data = (res.data || {}) as CreatePaymentResponse;
  const normalizedUrl =
    data.checkoutUrl || data.CheckoutUrl || data.url || data.Url;

  if (normalizedUrl) {
    data.url = normalizedUrl;
  }

  return data;
};

export const syncPaymentStatusByOrderCode = async (
  orderCode: number,
  token?: string | null,
): Promise<SyncPaymentStatusResponse> => {
  const res = await api.post(`/api/PayOs/sync/${orderCode}`, undefined, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return (res.data || {}) as SyncPaymentStatusResponse;
};
