import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { ArrowLeft, Package, User, MapPin, Calendar } from "lucide-react";
import { getBookingAdminById, type BookingDto } from "../../features/booking/bookingAdminService";

type UiOrderStatus = "pending" | "active" | "completed" | "cancelled";
type UiPaymentStatus = "paid" | "pending" | "refunded";

function normalizeStatus(s?: string | null): UiOrderStatus {
    const v = (s ?? "").toLowerCase();
    if (v.includes("cancel")) return "cancelled";
    if (v.includes("complete") || v.includes("done")) return "completed";
    if (v.includes("active") || v.includes("rent")) return "active";
    return "pending";
}
function normalizePayment(s?: string | null): UiPaymentStatus {
    const v = (s ?? "").toLowerCase();
    if (v.includes("refund")) return "refunded";
    if (v.includes("paid")) return "paid";
    return "pending";
}
function formatVnd(amount?: number | null) {
    return new Intl.NumberFormat("vi-VN").format(Number(amount ?? 0)) + "đ";
}
function formatDateTimeVN(iso?: string | null) {
    if (!iso) return "-";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleString("vi-VN");
}
function toOrderCode(id: number) {
    return `DH${String(id).padStart(3, "0")}`;
}

export default function OrderDetailPage() {
    const { id } = useParams();
    const bookingId = Number(id);
    const nav = useNavigate();

    const [data, setData] = useState<BookingDto | null>(null);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    useEffect(() => {
        let alive = true;

        (async () => {
            try {
                setLoading(true);
                setErr(null);
                const res = await getBookingAdminById(bookingId, { includeDetails: true, includeServices: true });
                if (!alive) return;
                setData(res);
            } catch (e: any) {
                if (!alive) return;
                setErr(e?.message || "Không thể tải chi tiết đơn thuê. Vui lòng thử lại.");
            } finally {
                if (!alive) return;
                setLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, [bookingId]);

    const statusBadge = useMemo(() => {
        const status = normalizeStatus(data?.status);
        const map: Record<UiOrderStatus, { label: string; className: string }> = {
            pending: { label: "Chờ xác nhận", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
            active: { label: "Đang thuê", className: "bg-blue-100 text-blue-800 border-blue-200" },
            completed: { label: "Hoàn thành", className: "bg-green-100 text-green-800 border-green-200" },
            cancelled: { label: "Đã hủy", className: "bg-red-100 text-red-800 border-red-200" },
        };
        return map[status];
    }, [data?.status]);

    const payBadge = useMemo(() => {
        const st = normalizePayment(data?.paymentStatus);
        const map: Record<UiPaymentStatus, { label: string; className: string }> = {
            paid: { label: "Đã thanh toán", className: "bg-green-100 text-green-800 border-green-200" },
            pending: { label: "Chờ thanh toán", className: "bg-orange-100 text-orange-800 border-orange-200" },
            refunded: { label: "Đã hoàn tiền", className: "bg-purple-100 text-purple-800 border-purple-200" },
        };
        return map[st];
    }, [data?.paymentStatus]);

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-[#c1272d] to-[#d4af37] bg-clip-text text-transparent mb-2">
                            Chi tiết đơn thuê
                        </h1>
                        <p className="text-gray-600">Xem thông tin đơn thuê và các mục liên quan</p>
                    </div>

                    <Button variant="outline" className="gap-2" onClick={() => nav("/admin/orders")}>
                        <ArrowLeft className="w-4 h-4" /> Quay lại
                    </Button>
                </div>

                {loading && (
                    <Card className="border-0 shadow-md">
                        <CardContent className="p-6 text-gray-600">Đang tải chi tiết đơn thuê...</CardContent>
                    </Card>
                )}

                {err && (
                    <Card className="border-0 shadow-md">
                        <CardContent className="p-6 text-red-600">{err}</CardContent>
                    </Card>
                )}

                {data && (
                    <>
                        {/* Summary */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <Card className="border-0 shadow-md lg:col-span-2">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Package className="w-5 h-5 text-[#c1272d]" />
                                        Đơn {toOrderCode(data.bookingId)}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Badge className={`${statusBadge.className} border`}>{statusBadge.label}</Badge>
                                        <Badge className={`${payBadge.className} border`}>{payBadge.label}</Badge>
                                    </div>

                                    <div className="text-sm text-gray-600 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Ngày tạo: <span className="text-gray-900 font-medium">{formatDateTimeVN(data.bookingDate)}</span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                        <div>Tiền thuê: <b className="text-gray-900">{formatVnd((data as any).totalRentalAmount)}</b></div>
                                        <div>Tiền cọc: <b className="text-gray-900">{formatVnd((data as any).totalDepositAmount)}</b></div>
                                        <div>Phụ thu: <b className="text-gray-900">{formatVnd((data as any).totalSurcharge)}</b></div>
                                        <div>Dịch vụ: <b className="text-gray-900">{formatVnd((data as any).totalServiceAmount)}</b></div>
                                        <div className="md:col-span-2 text-base">
                                            Tổng đơn: <b className="text-[#c1272d]">{formatVnd(data.totalOrderAmount)}</b>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-md">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="w-5 h-5 text-[#c1272d]" />
                                        Khách hàng
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c1272d] to-[#d4af37] flex items-center justify-center text-white font-semibold">
                                        {(data.userFullName || "U").charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{data.userFullName || `User #${data.userId}`}</p>
                                        <p className="text-sm text-gray-600">{data.userEmail || ""}</p>
                                    </div>

                                    <div className="pt-2 flex items-start gap-2 text-sm text-gray-600">
                                        <MapPin className="w-4 h-4 mt-0.5" />
                                        <span>{data.addressText || "Chưa có địa chỉ"}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Details list */}
                        <Card className="border-0 shadow-md">
                            <CardHeader>
                                <CardTitle>Danh sách sản phẩm</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {(data.details || []).length === 0 ? (
                                    <p className="text-gray-500">Đơn này chưa có chi tiết sản phẩm.</p>
                                ) : (
                                    (data.details || []).map((d: any) => (
                                        <div key={d.detailId} className="flex items-start justify-between gap-4 p-4 rounded-xl bg-gray-50">
                                            <div className="flex gap-3">
                                                <div className="w-14 h-14 rounded-lg bg-white border flex items-center justify-center overflow-hidden">
                                                    {d.outfitImageUrl ? (
                                                        <img src={d.outfitImageUrl} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Package className="w-6 h-6 text-gray-400" />
                                                    )}
                                                </div>

                                                <div>
                                                    <p className="font-semibold text-gray-900">
                                                        {d.outfitName || "(Chưa có tên)"}{" "}
                                                        <span className="text-sm font-normal text-gray-600">
                                                            {d.outfitSizeLabel ? `• Size ${d.outfitSizeLabel}` : ""}
                                                        </span>
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {d.rentalPackageName || "-"} • {formatDateTimeVN(d.startTime)} → {formatDateTimeVN(d.endTime)}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {d.rentalDays ? `${d.rentalDays} ngày` : ""} {d.outfitType ? `• ${d.outfitType}` : ""}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="text-right text-sm">
                                                <p className="font-semibold text-gray-900">{formatVnd(d.unitPrice)}</p>
                                                <p className="text-xs text-gray-600">Cọc: {formatVnd(d.depositAmount)}</p>
                                                {(d.lateFee ?? 0) > 0 && <p className="text-xs text-gray-600">Phạt trễ: {formatVnd(d.lateFee)}</p>}
                                                {(d.damageFee ?? 0) > 0 && <p className="text-xs text-gray-600">Hư hỏng: {formatVnd(d.damageFee)}</p>}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>

                        {/* Services */}
                        <Card className="border-0 shadow-md">
                            <CardHeader>
                                <CardTitle>Dịch vụ</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {(data.services || []).length === 0 ? (
                                    <p className="text-gray-500">Đơn này không có dịch vụ.</p>
                                ) : (
                                    (data.services || []).map((s: any) => (
                                        <div key={s.svcBookingId} className="p-4 rounded-xl bg-gray-50">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="font-semibold text-gray-900">{s.servicePackageName || "Dịch vụ"}</p>
                                                    <p className="text-sm text-gray-600">{s.studioName || ""}</p>
                                                    <p className="text-xs text-gray-500">Thời gian: {formatDateTimeVN(s.serviceTime)}</p>
                                                </div>
                                                <div className="text-right text-sm">
                                                    <p className="font-semibold text-gray-900">{formatVnd(s.totalPrice)}</p>
                                                    <p className="text-xs text-gray-600">Trạng thái: {s.status}</p>
                                                </div>
                                            </div>

                                            {(s.addons || []).length > 0 && (
                                                <div className="mt-3">
                                                    <p className="text-sm font-medium text-gray-900 mb-2">Add-ons</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {(s.addons || []).map((a: any, idx: number) => (
                                                            <Badge key={idx} className="bg-white border text-gray-700">
                                                                Addon #{a.addonId} • {formatVnd(a.priceAtBooking)}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </AdminLayout>
    );
}