import { AdminLayout } from "../../components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Search,
  Eye,
  Download,
  Filter,
  Calendar,
  Package,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ thêm
import { getAllBookingsAdmin, type BookingDto } from "../../features/booking/bookingAdminService";

type UiOrderStatus = "pending" | "active" | "completed" | "cancelled";
type UiPaymentStatus = "paid" | "pending" | "refunded";
type PageSizeOption = 10 | 20 | 50;

const PAGE_SIZE_OPTIONS: PageSizeOption[] = [10, 20, 50];

function toOrderCode(id: number) {
  return `DH${String(id).padStart(3, "0")}`;
}

function formatVnd(amount?: number | null) {
  const n = Number(amount ?? 0);
  return new Intl.NumberFormat("vi-VN").format(n) + "đ";
}

function formatDate(iso?: string | null) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("vi-VN");
}

function formatDateTime(iso?: string | null) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("vi-VN");
}

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

export default function OrdersPage() {
  const nav = useNavigate(); // ✅ thêm

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSizeOption>(10);

  const [bookings, setBookings] = useState<BookingDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getStatusBadge = (status: UiOrderStatus) => {
    const statusConfig: Record<UiOrderStatus, { label: string; className: string }> = {
      pending: { label: "Chờ xác nhận", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      active: { label: "Đang thuê", className: "bg-blue-100 text-blue-800 border-blue-200" },
      completed: { label: "Hoàn thành", className: "bg-green-100 text-green-800 border-green-200" },
      cancelled: { label: "Đã hủy", className: "bg-red-100 text-red-800 border-red-200" },
    };
    const config = statusConfig[status];
    return <Badge className={`${config.className} border`}>{config.label}</Badge>;
  };

  const getPaymentBadge = (status: UiPaymentStatus) => {
    const statusConfig: Record<UiPaymentStatus, { label: string; className: string }> = {
      paid: { label: "Đã thanh toán", className: "bg-green-100 text-green-800 border-green-200" },
      pending: { label: "Chờ thanh toán", className: "bg-orange-100 text-orange-800 border-orange-200" },
      refunded: { label: "Đã hoàn tiền", className: "bg-purple-100 text-purple-800 border-purple-200" },
    };
    const config = statusConfig[status];
    return <Badge className={`${config.className} border`}>{config.label}</Badge>;
  };

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getAllBookingsAdmin({
          includeDetails: true,
          includeServices: false,
        });

        if (!alive) return;
        setBookings(data);
      } catch (err: any) {
        if (!alive) return;
        setError(err?.message || "Không thể tải danh sách đơn thuê. Vui lòng thử lại.");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const debounceId = window.setTimeout(() => {
      setSearchQuery(searchInput);
    }, 300);

    return () => {
      window.clearTimeout(debounceId);
    };
  }, [searchInput]);

  const filteredBookings = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return bookings.filter((b) => {
      const st = normalizeStatus(b.status);
      if (statusFilter !== "all" && st !== statusFilter) return false;

      if (!q) return true;

      const idStr = toOrderCode(b.bookingId).toLowerCase();
      const fullName = (b.userFullName ?? "").toLowerCase();
      const email = (b.userEmail ?? "").toLowerCase();
      const addr = (b.addressText ?? "").toLowerCase();
      const outfitNames = (b.details ?? []).map((d) => (d.outfitName ?? "").toLowerCase()).join(" ");

      return (
        idStr.includes(q) ||
        fullName.includes(q) ||
        email.includes(q) ||
        addr.includes(q) ||
        outfitNames.includes(q)
      );
    });
  }, [bookings, searchQuery, statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  const totalItems = filteredBookings.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const pagedBookings = filteredBookings.slice(startIndex, endIndex);

  const pageNumbers = useMemo(() => {
    const maxPages = 5;
    if (totalPages <= maxPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    let start = Math.max(1, safePage - 2);
    let end = Math.min(totalPages, safePage + 2);

    if (start === 1) {
      end = maxPages;
    } else if (end === totalPages) {
      start = totalPages - (maxPages - 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [safePage, totalPages]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (loading || error) return;
    if (filteredBookings.length > 0 && pagedBookings.length === 0 && currentPage > 1) {
      setCurrentPage((prev) => Math.max(1, prev - 1));
    }
  }, [currentPage, error, filteredBookings.length, loading, pagedBookings.length]);

  const stats = useMemo(() => {
    const total = bookings.length;
    const active = bookings.filter((b) => normalizeStatus(b.status) === "active").length;
    const pending = bookings.filter((b) => normalizeStatus(b.status) === "pending").length;
    const completed = bookings.filter((b) => normalizeStatus(b.status) === "completed").length;

    return [
      { label: "Tổng đơn thuê", value: String(total), icon: Package, color: "bg-blue-500" },
      { label: "Đang thuê", value: String(active), icon: Calendar, color: "bg-green-500" },
      { label: "Chờ xác nhận", value: String(pending), icon: Filter, color: "bg-yellow-500" },
      { label: "Hoàn thành", value: String(completed), icon: Package, color: "bg-purple-500" },
    ];
  }, [bookings]);

  const handlePageSizeChange = (value: string) => {
    const parsed = Number(value) as PageSizeOption;
    if (!PAGE_SIZE_OPTIONS.includes(parsed)) return;
    setPageSize(parsed);
    setCurrentPage(1);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-[#c1272d] to-[#d4af37] bg-clip-text text-transparent mb-2">
            Quản lý đơn thuê
          </h1>
          <p className="text-gray-600">Quản lý và theo dõi tất cả các đơn thuê trang phục</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`${stat.color} p-3 rounded-xl`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Tìm theo mã đơn, khách hàng, email, địa chỉ, tên sản phẩm..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="pending">Chờ xác nhận</SelectItem>
                  <SelectItem value="active">Đang thuê</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="gap-2" disabled>
                <Download className="w-4 h-4" />
                Xuất Excel
              </Button>
            </div>

            <div className="mt-4">
              {loading && <p className="text-sm text-gray-600">Đang tải danh sách đơn thuê...</p>}
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Danh sách đơn thuê</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-24">Mã đơn</TableHead>
                    <TableHead>Khách hàng</TableHead>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead className="text-center">SL</TableHead>
                    <TableHead>Thời gian thuê</TableHead>
                    <TableHead>Tổng tiền</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thanh toán</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-gray-600">
                        Đang tải danh sách đơn thuê...
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-red-600">
                        {error}
                      </TableCell>
                    </TableRow>
                  ) : filteredBookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                        Không có đơn thuê nào phù hợp.
                      </TableCell>
                    </TableRow>
                  ) : (
                    pagedBookings.map((b) => {
                      const details = b.details ?? [];
                      const first = details[0];

                      const product = first?.outfitName ?? "(Chưa có thông tin sản phẩm)";
                      const qty = details.length;

                      const rentalPkg = first?.rentalPackageName ?? "-";
                      const start = first?.startTime ? formatDate(first.startTime) : "-";
                      const end = first?.endTime ? formatDate(first.endTime) : "-";

                      return (
                        <TableRow key={b.bookingId} className="hover:bg-gray-50">
                          <TableCell className="font-medium text-[#c1272d]">
                            {toOrderCode(b.bookingId)}
                          </TableCell>

                          <TableCell>
                            <div>
                              <p className="font-medium text-gray-900">
                                {b.userFullName || `User #${b.userId}`}
                              </p>
                              <p className="text-xs text-gray-500">{b.userEmail || ""}</p>
                            </div>
                          </TableCell>

                          <TableCell>
                            <p className="font-medium text-gray-900">{product}</p>
                            <p className="text-xs text-gray-500">{formatDateTime(b.bookingDate)}</p>
                          </TableCell>

                          <TableCell className="text-center">{qty}</TableCell>

                          <TableCell>
                            <div className="text-sm">
                              <p className="text-gray-900">{rentalPkg}</p>
                              <p className="text-xs text-gray-500">
                                {start} - {end}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell className="font-semibold text-gray-900">
                            {formatVnd(b.totalOrderAmount)}
                          </TableCell>

                          <TableCell>{getStatusBadge(normalizeStatus(b.status))}</TableCell>
                          <TableCell>{getPaymentBadge(normalizePayment(b.paymentStatus))}</TableCell>

                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-2"
                              onClick={() => nav(`/admin/orders/${b.bookingId}`)} // ✅ nối ở đây
                            >
                              <Eye className="w-4 h-4" />
                              Chi tiết
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="flex flex-col gap-4 p-4 xl:flex-row xl:items-center xl:justify-between">
            <p className="text-sm text-gray-600">
              Đang xem {totalItems ? startIndex + 1 : 0}-{endIndex} / Tổng {totalItems} đơn thuê
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-gray-500">Mỗi trang</span>
              <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
                <SelectTrigger className="h-9 w-[84px] border-gray-200 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-1 border-gray-200 text-gray-700 hover:bg-[#fff4df]"
                disabled={safePage <= 1 || loading}
                onClick={() => setCurrentPage(1)}
              >
                <ChevronsLeft className="h-4 w-4" />
                <span className="hidden md:inline">Đầu</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-1 border-gray-200 text-gray-700 hover:bg-[#fff4df]"
                disabled={safePage <= 1 || loading}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden md:inline">Trước</span>
              </Button>

              {pageNumbers.map((page) => (
                <Button
                  key={page}
                  variant="outline"
                  size="sm"
                  disabled={loading}
                  onClick={() => setCurrentPage(page)}
                  className={
                    page === safePage
                      ? "h-9 min-w-[40px] rounded-md border-[#c1272d] bg-[#c1272d] text-white hover:bg-[#c1272d]"
                      : "h-9 min-w-[40px] rounded-md border-gray-200 text-gray-700 hover:bg-[#fff4df]"
                  }
                >
                  {page}
                </Button>
              ))}

              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-1 border-gray-200 text-gray-700 hover:bg-[#fff4df]"
                disabled={safePage >= totalPages || loading}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              >
                <span className="hidden md:inline">Sau</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-1 border-gray-200 text-gray-700 hover:bg-[#fff4df]"
                disabled={safePage >= totalPages || loading}
                onClick={() => setCurrentPage(totalPages)}
              >
                <span className="hidden md:inline">Cuối</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
