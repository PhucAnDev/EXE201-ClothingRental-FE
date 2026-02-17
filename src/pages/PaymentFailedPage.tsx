import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { XCircle } from "lucide-react";
import { Button } from "../components/ui/button";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  getMyBookingById,
  type BookingListItemResponse,
} from "../features/booking/bookingService";
import {
  createPaymentUrl,
  type PaymentType,
} from "../features/payment/paymentService";

const toPositiveNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const formatCurrency = (amount: number) =>
  `${Number(amount || 0).toLocaleString("vi-VN")} ₫`;

const normalizePaymentStatus = (value?: string | null) =>
  String(value || "").trim().toLowerCase();

const normalizeQueryPaymentType = (value?: string | null): PaymentType | "" => {
  const normalized = String(value || "").trim().toLowerCase();
  return normalized === "deposit" || normalized === "full" ? normalized : "";
};

const parseAddressSnapshot = (addressText?: string | null) => {
  const raw = String(addressText || "").trim();
  if (!raw) {
    return {
      fullName: "--",
      phone: "--",
      address: "",
    };
  }

  const parts = raw
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  const head = parts[0] || "";
  const tail = parts.slice(1).join(", ");
  const dashIndex = head.indexOf(" - ");

  if (dashIndex > -1) {
    const fullName = head.slice(0, dashIndex).trim() || "--";
    const phone = head.slice(dashIndex + 3).trim() || "--";
    return { fullName, phone, address: tail };
  }

  return {
    fullName: head || "--",
    phone: "--",
    address: tail,
  };
};

const getRetryPaymentType = (
  queryType: PaymentType | "",
  paymentStatus: string,
): PaymentType | "" => {
  if (queryType) return queryType;
  if (paymentStatus === "paid") return "";
  if (paymentStatus === "depositpaid") return "full";
  return "deposit";
};

export function PaymentFailedPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [bookingData, setBookingData] = React.useState<BookingListItemResponse | null>(null);
  const [isLoadingBooking, setIsLoadingBooking] = React.useState(true);
  const [bookingError, setBookingError] = React.useState("");
  const [isRetrying, setIsRetrying] = React.useState(false);

  const status = searchParams.get("status");
  const bookingId = Number(searchParams.get("bookingId") ?? 0);
  const queryPaymentType = normalizeQueryPaymentType(searchParams.get("paymentType"));

  React.useEffect(() => {
    let isMounted = true;

    const fetchBooking = async () => {
      if (!Number.isFinite(bookingId) || bookingId <= 0) {
        setBookingError("Không tìm thấy mã đơn hàng để thực hiện lại thanh toán.");
        setIsLoadingBooking(false);
        return;
      }

      const token = localStorage.getItem("authToken");
      if (!token) {
        setBookingError("Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.");
        setIsLoadingBooking(false);
        return;
      }

      setIsLoadingBooking(true);
      setBookingError("");

      try {
        const response = await getMyBookingById(bookingId, token);
        if (!isMounted) return;
        setBookingData(response);
      } catch (error: any) {
        if (!isMounted) return;
        const message =
          error?.response?.data?.message ||
          "Không thể tải chi tiết đơn hàng để thanh toán lại.";
        setBookingError(message);
      } finally {
        if (isMounted) setIsLoadingBooking(false);
      }
    };

    void fetchBooking();

    return () => {
      isMounted = false;
    };
  }, [bookingId]);

  const normalizedPaymentStatus = normalizePaymentStatus(bookingData?.paymentStatus);
  const retryPaymentType = getRetryPaymentType(queryPaymentType, normalizedPaymentStatus);

  const totalOrder = toPositiveNumber(
    bookingData?.totalOrderAmount,
    (bookingData?.details || []).reduce(
      (sum: number, detail: any) => sum + toPositiveNumber(detail?.unitPrice, 0),
      0,
    ) +
      (bookingData?.serviceBookings || []).reduce(
        (sum: number, service: any) => sum + toPositiveNumber(service?.totalPrice, 0),
        0,
      ),
  );
  const totalDeposit = toPositiveNumber(
    bookingData?.totalDepositAmount,
    Math.round(totalOrder * 0.3),
  );
  const estimatedPaidAmount =
    normalizedPaymentStatus === "paid"
      ? totalOrder
      : normalizedPaymentStatus === "depositpaid"
        ? totalDeposit
        : 0;
  const remainingAmount = Math.max(0, totalOrder - estimatedPaidAmount);
  const retryAmount =
    retryPaymentType === "full"
      ? remainingAmount > 0 ? remainingAmount : totalOrder
      : retryPaymentType === "deposit"
        ? Math.max(0, totalDeposit - estimatedPaidAmount)
        : 0;

  const failMessage =
    status === "fail"
      ? "Giao dịch chưa hoàn tất. Vui lòng thử thanh toán lại."
      : "Không thể xác nhận trạng thái thanh toán.";

  const handleRetryPayment = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      alert("Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.");
      return;
    }

    if (!bookingData?.bookingId || !retryPaymentType || retryAmount <= 0) {
      alert("Không xác định được loại thanh toán để thử lại.");
      return;
    }

    setIsRetrying(true);
    try {
      const res = await createPaymentUrl(
        {
          bookingId: Number(bookingData.bookingId),
          paymentType: retryPaymentType,
        },
        token,
      );

      const paymentUrl = res?.url || res?.Url;
      if (!paymentUrl) {
        throw new Error("Không nhận được link thanh toán.");
      }

      window.location.href = paymentUrl;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Không thể tạo link thanh toán lại. Vui lòng thử lại.";
      alert(message);
    } finally {
      setIsRetrying(false);
    }
  };

  const snapshot = parseAddressSnapshot(bookingData?.addressText);
  const canRetry =
    Boolean(bookingData?.bookingId) &&
    Boolean(retryPaymentType) &&
    retryAmount > 0;

  return (
    <div className="min-h-screen bg-white">
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1470219556762-1771e7f9427d?auto=format&fit=crop&w=1200&q=80"
            alt="Thanh toán thất bại"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/60 to-black/40" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-block mb-6 relative">
            <div className="absolute inset-0 bg-red-500/25 blur-3xl rounded-full" />
            <XCircle className="w-24 h-24 text-red-500 relative animate-pulse" strokeWidth={2} />
          </div>
          <h1 className="text-5xl text-white mb-4">Thanh Toán Thất Bại</h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">{failMessage}</p>
        </div>
      </section>

      <div className="bg-gray-50 py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-red-600 text-2xl mb-5">Chi tiết thanh toán</h2>

            {isLoadingBooking && <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>}

            {!isLoadingBooking && bookingError && (
              <p className="text-red-600">{bookingError}</p>
            )}

            {!isLoadingBooking && !bookingError && bookingData && (
              <div className="space-y-3 text-gray-700">
                <div className="flex justify-between gap-3">
                  <span>Họ và tên:</span>
                  <span className="text-gray-900">{snapshot.fullName}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span>Số điện thoại:</span>
                  <span className="text-gray-900">{snapshot.phone}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span>Booking ID:</span>
                  <span className="text-gray-900">{bookingData.bookingId}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span>Tổng chi phí:</span>
                  <span className="text-gray-900">{formatCurrency(totalOrder)}</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span>Trạng thái thanh toán:</span>
                  <span className="text-gray-900">
                    {bookingData.paymentStatus || "Unpaid"}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span>Tiền cần thanh toán lại:</span>
                  <span className="text-red-600">
                    {retryPaymentType
                      ? formatCurrency(retryAmount)
                      : "Không cần thanh toán thêm"}
                  </span>
                </div>
                {!snapshot.address ? null : (
                  <div className="pt-2 border-t border-gray-200 text-sm text-gray-600">
                    Địa chỉ: {snapshot.address}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Button
              onClick={handleRetryPayment}
              size="lg"
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              disabled={!canRetry || isRetrying}
            >
              {isRetrying
                ? "Đang chuyển đến VNPay..."
                : retryPaymentType === "full"
                  ? "Thanh Toán Lại Toàn Bộ"
                  : retryPaymentType === "deposit"
                    ? "Thanh Toán Lại Tiền Cọc"
                    : "Đơn hàng đã thanh toán đủ"}
            </Button>
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              size="lg"
              className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
            >
              Về Trang Chủ
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
