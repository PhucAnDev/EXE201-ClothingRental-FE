import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { toast } from "sonner";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
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
  Edit,
  Trash2,
  Shield,
  Users,
  UserCheck,
  Activity,
  Filter,
  Mail,
  Phone,
  Calendar,
  Package,
  User,
  AlertTriangle,
} from "lucide-react";
import {
  deleteUser,
  getUserById,
  getUsers,
  type UserDetailResponse,
} from "../../features/auth/authService";

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<UserDetailResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailUser, setDetailUser] = useState<UserDetailResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<UserDetailResponse | null>(
    null,
  );
  const [deleteLoading, setDeleteLoading] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("authToken");
        const res = await getUsers(token);
        if (isMounted) {
          setUsers(Array.isArray(res) ? res : []);
        }
      } catch (err) {
        if (isMounted) {
          setError("Không thể tải danh sách người dùng.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return users;
    return users.filter((user) => {
      const haystack = [
        user.fullName,
        user.email,
        user.phoneNumber,
        String(user.userId ?? ""),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [searchQuery, users]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredUsers.length);
  const pagedUsers = filteredUsers.slice(startIndex, endIndex);
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
    setCurrentPage(1);
  }, [searchQuery, users.length]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const formatJoinDate = (value?: string) => {
    if (!value) return "--";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("vi-VN");
  };

  const isAdmin = (user: UserDetailResponse) =>
    user.roleId === 1 || (user as { role?: string })?.role === "admin";

  const getRoleLabel = (user: UserDetailResponse) =>
    isAdmin(user) ? "Quản trị viên" : "Khách hàng";

  const getStatusLabel = (user: UserDetailResponse) =>
    user.isActive ? "Hoạt động" : "Không hoạt động";

  const getOrderCountLabel = (user: UserDetailResponse) => {
    const withOrders = user as UserDetailResponse & {
      orderCount?: number;
      totalOrders?: number;
    };
    const count = withOrders.orderCount ?? withOrders.totalOrders;
    if (typeof count === "number") {
      return `${count} đơn`;
    }
    return "--";
  };

  const stats = [
    {
      label: "Tổng người dùng",
      value: users.length,
      icon: Users,
      color: "bg-blue-500",
    },
    {
      label: "Khách hàng",
      value: users.filter((u) => !isAdmin(u)).length,
      icon: UserCheck,
      color: "bg-green-500",
    },
    {
      label: "Quản trị viên",
      value: users.filter((u) => isAdmin(u)).length,
      icon: Shield,
      color: "bg-purple-500",
    },
    {
      label: "Đang hoạt động",
      value: users.filter((u) => u.isActive).length,
      icon: Activity,
      color: "bg-yellow-500",
    },
  ];

  const getRoleBadge = (user: UserDetailResponse) => {
    if (isAdmin(user)) {
      return (
        <Badge className="bg-purple-100 text-purple-800 border-purple-200">
          Quản trị viên
        </Badge>
      );
    }

    return (
      <Badge className="bg-blue-100 text-blue-800 border-blue-200">
        Khách hàng
      </Badge>
    );
  };

  const getStatusBadge = (user: UserDetailResponse) => {
    if (user.isActive) {
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          Hoạt động
        </Badge>
      );
    }

    return (
      <Badge className="bg-gray-100 text-gray-700 border-gray-200">
        Không hoạt động
      </Badge>
    );
  };

  const handleViewUser = async (userId?: number) => {
    setDetailOpen(true);
    setDetailError("");
    setDetailUser(null);

    if (!userId) {
      setDetailError("Không xác định được người dùng.");
      return;
    }

    setDetailLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await getUserById(userId, token);
      setDetailUser(res);
    } catch (err) {
      setDetailError("Không thể tải thông tin người dùng.");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDetailOpenChange = (open: boolean) => {
    setDetailOpen(open);
    if (!open) {
      setDetailUser(null);
      setDetailError("");
      setDetailLoading(false);
    }
  };

  const handleDeleteClick = (user: UserDetailResponse) => {
    setDeleteTarget(user);
    setDeleteOpen(true);
  };

  const handleDeleteOpenChange = (open: boolean) => {
    setDeleteOpen(open);
    if (!open) {
      setDeleteTarget(null);
    }
  };

  const handleConfirmDelete = async (
    event?: MouseEvent<HTMLButtonElement>,
  ) => {
    event?.preventDefault();

    if (!deleteTarget?.userId) {
      toast.error("Không xác định được người dùng.");
      return;
    }

    setDeleteLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      await deleteUser(deleteTarget.userId, token);
      setUsers((prev) =>
        prev.filter((user) => user.userId !== deleteTarget.userId),
      );
      setDeleteOpen(false);
      setDeleteTarget(null);
      toast.success("Xóa người dùng thành công!");
    } catch (err) {
      toast.error("Xóa người dùng thất bại.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-[#c1272d] to-[#d4af37] bg-clip-text text-transparent mb-2">
            Quản lý người dùng
          </h1>
          <p className="text-gray-600">
            Quản lý tất cả người dùng trong hệ thống
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`${stat.color} p-3 rounded-xl`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {error && (
          <div className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Search & Filter */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm người dùng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="gap-2" disabled={loading}>
                <Filter className="w-4 h-4" />
                Lọc
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Danh sách người dùng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Người dùng
                    </TableHead>
                    <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Liên hệ
                    </TableHead>
                    <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Vai trò
                    </TableHead>
                    <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Đơn thuê
                    </TableHead>
                    <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Trạng thái
                    </TableHead>
                    <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Ngày tham gia
                    </TableHead>
                    <TableHead className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Hành động
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="px-6 py-8 text-center text-sm text-gray-500"
                      >
                        Đang tải danh sách người dùng...
                      </TableCell>
                    </TableRow>
                  )}
                  {!loading && filteredUsers.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="px-6 py-8 text-center text-sm text-gray-500"
                      >
                        Không có người dùng phù hợp.
                      </TableCell>
                    </TableRow>
                  )}
                  {!loading &&
                    pagedUsers.map((user) => (
                      <TableRow
                        key={user.userId ?? user.email}
                        className="hover:bg-gray-50"
                      >
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-[#c1272d]/10 text-[#c1272d] font-semibold">
                                {(user.fullName || user.email || "U").charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-semibold text-gray-900">
                                {user.fullName || "Chưa cập nhật"}
                              </p>
                              <p className="text-xs text-gray-500">
                                ID: #{user.userId ?? "--"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <p className="text-sm font-medium text-gray-900">
                            {user.email}
                          </p>
                          <p className="text-xs text-gray-500">
                            {user.phoneNumber || "--"}
                          </p>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          {getRoleBadge(user)}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-gray-700">
                          --
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          {getStatusBadge(user)}
                        </TableCell>
                        <TableCell className="px-6 py-4 text-gray-700">
                          {formatJoinDate(user.createdAt)}
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 rounded-full text-gray-500 hover:text-[#c1272d] hover:bg-[#c1272d]/10"
                              onClick={() => handleViewUser(user.userId)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 rounded-full text-gray-500 hover:text-[#c1272d] hover:bg-[#c1272d]/10"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50"
                              disabled={isAdmin(user)}
                              onClick={() => handleDeleteClick(user)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-sm text-gray-600">
              Hiển thị {filteredUsers.length ? startIndex + 1 : 0}-{endIndex} của{" "}
              {filteredUsers.length} người dùng
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={safePage <= 1 || loading}
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className="h-9 gap-1.5 px-3"
              >
                <span className="text-base leading-none">‹</span>
                Trước
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
                      ? "h-9 min-w-[40px] rounded-md bg-red-600 text-white border-red-600 hover:bg-red-600"
                      : "h-9 min-w-[40px] rounded-md border-gray-200 text-gray-700 hover:bg-gray-50"
                  }
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                disabled={safePage >= totalPages || loading}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                className="h-9 gap-1.5 px-3"
              >
                Sau
                <span className="text-base leading-none">›</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={detailOpen} onOpenChange={handleDetailOpenChange}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết người dùng</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết và lịch sử hoạt động
            </DialogDescription>
          </DialogHeader>

          {detailLoading && (
            <div className="py-6 text-sm text-gray-500">
              Đang tải thông tin người dùng...
            </div>
          )}

          {!detailLoading && detailError && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              {detailError}
            </div>
          )}

          {!detailLoading && !detailError && detailUser && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage
                      src={detailUser.avatarUrl ?? undefined}
                      alt={detailUser.fullName || detailUser.email || "User"}
                    />
                    <AvatarFallback className="bg-red-600 text-white text-xl font-semibold">
                      {(detailUser.fullName || detailUser.email || "U").charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {detailUser.fullName || "Chưa cập nhật"}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                      <span className="inline-flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {getRoleLabel(detailUser)}
                      </span>
                      <Badge
                        className={
                          detailUser.isActive
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-gray-100 text-gray-700 border-gray-200"
                        }
                      >
                        {getStatusLabel(detailUser)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Email
                    </p>
                    <p className="text-sm font-semibold text-gray-900 break-all">
                      {detailUser.email || "--"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Số điện thoại
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {detailUser.phoneNumber || "--"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Ngày tham gia
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatJoinDate(detailUser.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <Package className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Tổng đơn thuê
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {getOrderCountLabel(detailUser)}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Thông tin bổ sung
                </p>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        Mã người dùng
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        #{detailUser.userId ?? "--"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        Quyền hạn
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {getRoleLabel(detailUser)}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        Trạng thái tài khoản
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        {getStatusLabel(detailUser)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        Đơn hàng gần nhất
                      </p>
                      <p className="text-sm font-semibold text-gray-900">
                        Chưa có dữ liệu
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button variant="ghost" onClick={() => setDetailOpen(false)}>
                  Đóng
                </Button>
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  Chỉnh sửa thông tin
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={handleDeleteOpenChange}>
        <AlertDialogContent className="sm:max-w-lg">
          <AlertDialogHeader className="text-left">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <AlertDialogTitle>Xác nhận xóa người dùng</AlertDialogTitle>
                <AlertDialogDescription>
                  Bạn có chắc chắn muốn xóa người dùng sau không?
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>

          {deleteTarget ? (
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-11 w-11">
                  <AvatarImage
                    src={deleteTarget.avatarUrl ?? undefined}
                    alt={deleteTarget.fullName || deleteTarget.email || "User"}
                  />
                  <AvatarFallback className="bg-red-50 text-red-600 font-semibold">
                    {(deleteTarget.fullName || deleteTarget.email || "U").charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {deleteTarget.fullName || "Chưa cập nhật"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {deleteTarget.email || "--"}
                  </p>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                <p>
                  <span className="font-semibold text-gray-700">
                    Số điện thoại:
                  </span>{" "}
                  {deleteTarget.phoneNumber || "--"}
                </p>
                <p>
                  <span className="font-semibold text-gray-700">Đơn thuê:</span>{" "}
                  {getOrderCountLabel(deleteTarget)}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              Không có dữ liệu người dùng.
            </div>
          )}

          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5" />
              <p>
                <span className="font-semibold">Cảnh báo:</span> Hành động này
                không thể hoàn tác. Tất cả dữ liệu liên quan đến người dùng này
                sẽ bị xóa vĩnh viễn.
              </p>
            </div>
          </div>

          <AlertDialogFooter className="gap-3 sm:gap-3">
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleConfirmDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? "Đang xóa..." : "Xác nhận xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
