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

    // ✅ V2 fields
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

        return (Array.isArray(res.data) ? res.data : []) as BookingDto[];
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

    const res = await api.get(
        `/api/Booking/get-by-id-v2/${bookingId}?includeDetails=${includeDetails}&includeServices=${includeServices}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : undefined }
    );

    return res.data as BookingDto;
}