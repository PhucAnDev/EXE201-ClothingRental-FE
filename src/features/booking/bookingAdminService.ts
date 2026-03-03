import { api } from "../../api/client";

export interface BookingDetailDto {
    detailId: number;
    rentalPackageName?: string | null;
    outfitName?: string | null;
    outfitSizeLabel?: string | null;
    outfitType?: string | null;
    outfitImageUrl?: string | null;

    startTime?: string | null;
    endTime?: string | null;

    rentalDays?: number | null;
    unitPrice?: number | null;
    depositAmount?: number | null;
    lateFee?: number | null;
    damageFee?: number | null;

    status?: string | null;
}

export interface BookingDto {
    bookingId: number;
    userId: number;

    userFullName?: string | null;
    userEmail?: string | null;

    addressText?: string | null;

    totalOrderAmount?: number | null;
    totalRentalAmount?: number | null;
    totalDepositAmount?: number | null;
    totalSurcharge?: number | null;
    totalServiceAmount?: number | null;

    status?: string | null;
    paymentStatus?: string | null;
    bookingDate?: string | null;

    details: BookingDetailDto[];
    services?: any[];
}

function toVnError(err: any): string {
    const status = err?.response?.status;
    const apiMsg = err?.response?.data?.message;
    if (typeof apiMsg === "string" && apiMsg.trim()) return apiMsg;

    switch (status) {
        case 401:
            return "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
        case 403:
            return "Bạn không có quyền truy cập chức năng này.";
        case 404:
            return "Không tìm thấy dữ liệu đơn thuê.";
        case 500:
            return "Hệ thống đang gặp lỗi. Vui lòng thử lại sau.";
        default:
            return "Không thể tải danh sách đơn thuê. Vui lòng thử lại.";
    }
}

// ✅ helper ép number an toàn
function toNumberOrNull(v: any): number | null {
    if (v === null || v === undefined || v === "") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
}

// ✅ normalize + alias field để UI khỏi bị 0đ
function normalizeBooking(x: any): BookingDto {
    const totalRentalAmount = toNumberOrNull(
        x?.totalRentalAmount ?? x?.totalRental ?? x?.rentalTotalAmount
    );

    const totalOrderAmount = toNumberOrNull(
        x?.totalOrderAmount ?? x?.totalAmount ?? totalRentalAmount ?? 0
    );

    return {
        bookingId: Number(x?.bookingId ?? x?.id ?? 0),
        userId: Number(x?.userId ?? 0),

        userFullName: x?.userFullName ?? null,
        userEmail: x?.userEmail ?? null,
        addressText: x?.addressText ?? null,

        // ✅ cái cốt cần show
        totalRentalAmount,
        // ✅ alias để nếu UI đang dùng totalOrderAmount thì vẫn đúng
        totalOrderAmount,

        totalDepositAmount: toNumberOrNull(x?.totalDepositAmount),
        totalSurcharge: toNumberOrNull(x?.totalSurcharge),
        totalServiceAmount: toNumberOrNull(x?.totalServiceAmount),

        status: x?.status ?? null,
        paymentStatus: x?.paymentStatus ?? null,
        bookingDate: x?.bookingDate ?? null,

        details: Array.isArray(x?.details) ? x.details : [],
        services: Array.isArray(x?.services) ? x.services : [],
    };
}

export async function getAllBookingsAdmin(params?: {
    includeDetails?: boolean;
    includeServices?: boolean;
}): Promise<BookingDto[]> {
    const includeDetails = params?.includeDetails ?? true;
    const includeServices = params?.includeServices ?? false;

    const token = localStorage.getItem("authToken") || "";

    try {
        const res = await api.get(
            `/api/Booking/get-all-v2?includeDetails=${includeDetails}&includeServices=${includeServices}`,
            {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined,
            }
        );

        const arr = Array.isArray(res.data) ? res.data : [];
        return arr.map(normalizeBooking);
    } catch (err: any) {
        throw new Error(toVnError(err));
    }
}

export async function getBookingAdminById(
    bookingId: number,
    params?: { includeDetails?: boolean; includeServices?: boolean }
): Promise<BookingDto> {
    const includeDetails = params?.includeDetails ?? true;
    const includeServices = params?.includeServices ?? true;

    const token = localStorage.getItem("authToken") || "";

    try {
        const res = await api.get(
            `/api/Booking/get-by-id-v2/${bookingId}?includeDetails=${includeDetails}&includeServices=${includeServices}`,
            { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
        );

        return normalizeBooking(res.data);
    } catch (err: any) {
        throw new Error(toVnError(err));
    }
}