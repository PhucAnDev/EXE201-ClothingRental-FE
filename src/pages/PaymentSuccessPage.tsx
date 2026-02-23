import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  getMyBookingById,
  type BookingDetailResponse,
  type BookingListItemResponse,
  type ServiceBookingResponse,
} from "../features/booking/bookingService";
import { syncPaymentStatusByOrderCode } from "../features/payment/paymentService";

type QueryPaymentType = "deposit" | "full" | "";

const toPositiveNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const formatCurrency = (amount: number) =>
  `${Number(amount || 0).toLocaleString("vi-VN")} ₫`;

const formatDate = (value?: string | null) => {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("vi-VN");
};

const normalizePaymentStatus = (value?: string | null) =>
  String(value || "")
    .trim()
    .toLowerCase();

const normalizeQueryPaymentType = (value?: string | null): QueryPaymentType => {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();
  return normalized === "full" || normalized === "deposit" ? normalized : "";
};

const normalizeQueryStatus = (value?: string | null) =>
  String(value || "")
    .trim()
    .toLowerCase();

const normalizeQueryCode = (value?: string | null) =>
  String(value || "")
    .trim()
    .toUpperCase();

const hasSuccessfulRedirectHint = (status: string, code: string) =>
  code === "00" || status === "paid" || status === "success";

const isPaymentStatusSyncedForSuccessPage = (
  paymentStatus: string,
  paymentType: QueryPaymentType,
) => {
  if (paymentType === "full") {
    return paymentStatus === "paid";
  }

  if (paymentType === "deposit") {
    return (
      paymentStatus === "depositpaid" ||
      paymentStatus === "partiallypaid" ||
      paymentStatus === "paid"
    );
  }

  return paymentStatus !== "" && paymentStatus !== "unpaid";
};

const getPaymentStatusBadge = (paymentStatus?: string) => {
  const normalized = normalizePaymentStatus(paymentStatus);

  if (normalized === "paid") {
    return {
      label: "Đã thanh toán",
      style: {
        backgroundColor: "#ecfdf3",
        color: "#15803d",
        borderColor: "#bbf7d0",
      },
    };
  }

  if (normalized === "depositpaid") {
    return {
      label: "Đã đặt cọc",
      style: {
        backgroundColor: "#fffbeb",
        color: "#b45309",
        borderColor: "#fde68a",
      },
    };
  }

  if (normalized === "partiallypaid") {
    return {
      label: "Đã thanh toán một phần",
      style: {
        backgroundColor: "#eff6ff",
        color: "#1d4ed8",
        borderColor: "#bfdbfe",
      },
    };
  }

  return {
    label: "Chờ thanh toán",
    style: {
      backgroundColor: "#f3f4f6",
      color: "#374151",
      borderColor: "#d1d5db",
    },
  };
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

const resolvePaidAmount = (
  paymentStatus: string,
  totalOrder: number,
  totalDeposit: number,
) => {
  if (paymentStatus === "paid") {
    return { label: "Đã thanh toán", value: totalOrder, unknown: false };
  }

  if (paymentStatus === "depositpaid") {
    return { label: "Đã thanh toán", value: totalDeposit, unknown: false };
  }

  if (paymentStatus === "partiallypaid") {
    return { label: "Đã thanh toán", value: 0, unknown: true };
  }

  return { label: "Đã thanh toán", value: 0, unknown: false };
};

export function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [bookingData, setBookingData] =
    React.useState<BookingListItemResponse | null>(null);
  const [isLoadingBooking, setIsLoadingBooking] = React.useState(true);
  const [bookingError, setBookingError] = React.useState("");

  const bookingId = Number(searchParams.get("bookingId") ?? 0);
  const queryPaymentType = normalizeQueryPaymentType(
    searchParams.get("paymentType"),
  );
  const queryStatus = normalizeQueryStatus(searchParams.get("status"));
  const queryCode = normalizeQueryCode(searchParams.get("code"));
  const queryOrderCode = Number(searchParams.get("orderCode") ?? 0);
  const shouldPollPaymentSync = hasSuccessfulRedirectHint(queryStatus, queryCode);

  React.useEffect(() => {
    let isMounted = true;
    let pollingTimer: number | null = null;
    let pollAttempts = 0;
    const maxPollAttempts = 10;
    const pollIntervalMs = 2000;

    const clearPollingTimer = () => {
      if (pollingTimer !== null) {
        window.clearTimeout(pollingTimer);
        pollingTimer = null;
      }
    };

    const fetchBooking = async (showLoading = false) => {
      if (!Number.isFinite(bookingId) || bookingId <= 0) {
        setBookingError("Không tìm thấy mã đơn hàng trong kết quả thanh toán.");
        setIsLoadingBooking(false);
        return;
      }

      const token = localStorage.getItem("authToken");
      if (!token) {
        setBookingError(
          "Phiên đăng nhập đã hết. Vui lòng đăng nhập lại để xem đơn hàng.",
        );
        setIsLoadingBooking(false);
        return;
      }

      if (showLoading) {
        setIsLoadingBooking(true);
        setBookingError("");
      }

      try {
        if (
          shouldPollPaymentSync &&
          Number.isFinite(queryOrderCode) &&
          queryOrderCode > 0
        ) {
          try {
            await syncPaymentStatusByOrderCode(queryOrderCode, token);
          } catch {
            // Ignore sync errors and continue polling booking API.
          }
        }

        const response = await getMyBookingById(bookingId, token);
        if (!isMounted) return;
        setBookingData(response);
        setBookingError("");

        const fetchedPaymentStatus = normalizePaymentStatus(response?.paymentStatus);
        const shouldContinuePolling =
          shouldPollPaymentSync &&
          !isPaymentStatusSyncedForSuccessPage(
            fetchedPaymentStatus,
            queryPaymentType,
          ) &&
          pollAttempts < maxPollAttempts;

        if (shouldContinuePolling) {
          clearPollingTimer();
          pollAttempts += 1;
          pollingTimer = window.setTimeout(() => {
            void fetchBooking(false);
          }, pollIntervalMs);
        }
      } catch (error: any) {
        if (!isMounted) return;
        const message =
          error?.response?.data?.message ||
          "Không thể tải chi tiết đơn hàng từ hệ thống.";
        setBookingError(message);
      } finally {
        if (showLoading && isMounted) setIsLoadingBooking(false);
      }
    };

    void fetchBooking(true);

    return () => {
      isMounted = false;
      clearPollingTimer();
    };
  }, [
    bookingId,
    queryCode,
    queryOrderCode,
    queryPaymentType,
    queryStatus,
    shouldPollPaymentSync,
  ]);

  if (isLoadingBooking) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center max-w-lg">
          <h1 className="text-3xl text-gray-900 mb-4">
            Không tìm thấy thông tin đơn hàng
          </h1>
          <p className="text-gray-600 mb-6">
            {bookingError || "Vui lòng kiểm tra lại kết quả thanh toán."}
          </p>
          <Button
            onClick={() => navigate("/")}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Về trang chủ
          </Button>
        </div>
      </div>
    );
  }

  const bookingDetails = Array.isArray(bookingData.details)
    ? bookingData.details
    : [];
  const serviceBookings = Array.isArray(bookingData.serviceBookings)
    ? bookingData.serviceBookings
    : [];

  const includeRental = bookingDetails.length > 0;
  const includePhotoshoot = serviceBookings.length > 0;

  const totalServiceFromList = serviceBookings.reduce(
    (sum: number, item: ServiceBookingResponse) =>
      sum + toPositiveNumber(item.totalPrice, 0),
    0,
  );

  const totalRental = toPositiveNumber(bookingData.totalRentalAmount, 0);
  const totalService = toPositiveNumber(
    bookingData.totalServiceAmount,
    totalServiceFromList,
  );
  const totalOrder = toPositiveNumber(
    bookingData.totalOrderAmount,
    totalRental + totalService,
  );
  const totalDeposit = toPositiveNumber(
    bookingData.totalDepositAmount,
    Math.round(totalOrder * 0.3),
  );

  const normalizedPaymentStatus = normalizePaymentStatus(
    bookingData.paymentStatus,
  );
  const shouldApplyRedirectSuccessFallback =
    shouldPollPaymentSync &&
    !isPaymentStatusSyncedForSuccessPage(
      normalizedPaymentStatus,
      queryPaymentType,
    );
  const effectivePaymentStatus = shouldApplyRedirectSuccessFallback
    ? queryPaymentType === "full"
      ? "paid"
      : queryPaymentType === "deposit"
        ? "depositpaid"
        : normalizedPaymentStatus
    : normalizedPaymentStatus;
  const paymentStatusBadge = getPaymentStatusBadge(effectivePaymentStatus);
  const paidInfo = resolvePaidAmount(
    effectivePaymentStatus,
    totalOrder,
    totalDeposit,
  );

  const snapshot = parseAddressSnapshot(bookingData.addressText);
  const rentalDate =
    formatDate(bookingDetails[0]?.startTime) ||
    formatDate(bookingData.bookingDate) ||
    "--";
  const packageName = serviceBookings
    .map((item) => item.servicePackageName)
    .filter(Boolean)
    .join(", ");

  const displayBookingId = String(bookingData.bookingId || bookingId || "");
  const transactionNote =
    queryPaymentType === "full"
      ? "(Thanh toán toàn bộ)"
      : queryPaymentType === "deposit"
        ? "(Thanh toán cọc)"
        : effectivePaymentStatus === "paid"
          ? "(Đơn hàng đã thanh toán đủ)"
          : "(Đơn hàng đã ghi nhận thanh toán)";

  return (
    <div className="min-h-screen bg-white">
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1675389017197-9ae63c2b2fe8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYW8lMjBkYWklMjB0cmFkaXRpb25hbCUyMGRyZXNzfGVufDF8fHx8MTc2MTgwNjA4Nnww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Thanh toán thành công"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="mb-6 relative inline-flex h-24 w-24 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-[#00d26a]/20 blur-2xl" />
            <CheckCircle2
              className="absolute h-24 w-24 animate-ping"
              strokeWidth={2}
              style={{ color: "rgba(0, 210, 106, 0.45)" }}
            />
            <CheckCircle2
              className="relative h-24 w-24"
              strokeWidth={2.5}
              style={{
                color: "#00d26a",
                filter: "drop-shadow(0 0 10px rgba(0, 210, 106, 0.45))",
              }}
            />
          </div>
          <h1 className="text-5xl text-white mb-4">Thanh Toán Thành Công</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Cảm ơn bạn đã tin tưởng Sắc Việt. Đơn hàng của bạn đã được ghi nhận.
          </p>
        </div>
      </section>

      <div className="bg-gray-50 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
              <div>
                <p className="text-sm text-gray-600 mb-1">Mã đơn hàng</p>
                <p className="text-2xl text-gray-900">{displayBookingId || "--"}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">
                  Trạng thái thanh toán
                </p>
                <span
                  className="inline-flex items-center rounded-full border px-4 py-2 text-sm font-semibold"
                  style={paymentStatusBadge.style}
                >
                  {paymentStatusBadge.label}
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-red-600 mb-4">Thông Tin Khách Hàng</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Họ và tên</p>
                  <p className="text-gray-900">{snapshot.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Số điện thoại</p>
                  <p className="text-gray-900">{snapshot.phone}</p>
                </div>
                {snapshot.address && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600 mb-1">
                      Địa chỉ nhận hàng
                    </p>
                    <p className="text-gray-900">{snapshot.address}</p>
                  </div>
                )}
              </div>
            </div>

            {includeRental && (
              <div className="mb-6 pb-6 border-t border-gray-200 pt-6">
                <h2 className="text-red-600 mb-4">Chi Tiết Thuê Trang Phục</h2>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Ngày thuê</p>
                  <p className="text-gray-900">{rentalDate}</p>
                </div>

                <div className="space-y-3">
                  {bookingDetails.map(
                    (detail: BookingDetailResponse, index: number) => (
                      <div
                        key={detail.detailId ?? index}
                        className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <ImageWithFallback
                            src={detail.outfitImageUrl || ""}
                            alt={detail.outfitName || "Trang phục"}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-gray-900 mb-1">
                            {detail.outfitName || "Trang phục"}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {detail.outfitType || "Trang phục"}
                          </p>
                          <p className="text-sm text-gray-700 mt-1">
                            <span className="font-medium">Size:</span>{" "}
                            {detail.outfitSizeLabel || "--"}
                          </p>
                          {detail.rentalDays ? (
                            <p className="text-xs text-gray-500 mt-1">
                              {detail.rentalDays} ngày
                            </p>
                          ) : null}
                        </div>
                        <div className="text-right">
                          <p className="text-red-600">
                            {formatCurrency(
                              toPositiveNumber(detail.unitPrice, 0),
                            )}
                          </p>
                        </div>
                      </div>
                    ),
                  )}
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Chi phí thuê:</span>
                    <span className="text-gray-900">
                      {formatCurrency(totalRental)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tiền cọc:</span>
                    <span className="text-gray-900">
                      {formatCurrency(totalDeposit)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {includePhotoshoot && (
              <div className="mb-6 pb-6 border-t border-gray-200 pt-6">
                <h2 className="text-red-600 mb-4">Chi Tiết Dịch Vụ Kèm Theo</h2>

                {packageName && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">Gói dịch vụ</p>
                    <p className="text-gray-900">{packageName}</p>
                  </div>
                )}

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Chi phí dịch vụ:</span>
                    <span className="text-gray-900">
                      {formatCurrency(totalService)}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Tiền cọc được tính chung 30% trên tổng chi phí đơn hàng.
                </p>
              </div>
            )}

            <div className="border-t-2 border-gray-300 pt-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-900">Tổng chi phí dịch vụ:</span>
                  <span className="text-gray-900 text-xl">
                    {formatCurrency(totalOrder)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-900">Tổng cọc:</span>
                  <span className="text-gray-900 text-xl">
                    {formatCurrency(totalDeposit)}
                  </span>
                </div>
                <div className="h-px bg-gray-300 my-3" />
                <div className="flex justify-between items-center">
                  <span className="text-gray-900">{paidInfo.label}:</span>
                  <span className="text-red-600 text-3xl">
                    {paidInfo.unknown
                      ? "Đang cập nhật"
                      : formatCurrency(paidInfo.value)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 text-right">
                  {transactionNote}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
            <p className="text-blue-800 mb-3">
              <span className="font-medium">Thông tin quan trọng:</span>
            </p>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>• Nhân viên sẽ liên hệ trong 24h để xác nhận đơn hàng</li>
              {includeRental && (
                <li>
                  • Trang phục sẽ được giao đến địa chỉ của bạn trước ngày thuê
                  1 ngày
                </li>
              )}
              {includePhotoshoot && (
                <li>• Đổi lịch chụp 1 lần miễn phí nếu báo trước 24h</li>
              )}
              <li>• Mã đơn hàng {displayBookingId || "--"} đã được ghi nhận</li>
            </ul>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              size="lg"
              className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
            >
              Về trang chủ
            </Button>
            <Button
              onClick={() => navigate("/bo-suu-tap")}
              size="lg"
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              Xem thêm bộ sưu tập
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
