import { api } from "../../api/client";

export type PaymentType = "deposit" | "full";

export interface CreatePaymentPayload {
  bookingId: number;
  paymentType: PaymentType;
}

export interface CreatePaymentResponse {
  Url?: string;
  url?: string;
  BookingId?: number;
  PaymentType?: string;
  Amount?: number;
  TransactionRef?: string;
}

export const createPaymentUrl = async (
  payload: CreatePaymentPayload,
  token?: string | null,
): Promise<CreatePaymentResponse> => {
  const res = await api.post("/api/Payment/create-payment", payload, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  return res.data as CreatePaymentResponse;
};
