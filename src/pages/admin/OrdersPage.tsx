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
import { Search, Eye, Download, Filter, Calendar, Package } from "lucide-react";
import { useState } from "react";

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock orders data
  const orders = [
    {
      id: "DH001",
      customer: "Nguyễn Văn A",
      email: "nguyenvana@gmail.com",
      product: "Áo dài truyền thống đỏ",
      quantity: 1,
      rentalPeriod: "3 ngày",
      startDate: "15/01/2024",
      endDate: "18/01/2024",
      total: "2,500,000đ",
      status: "completed",
      paymentStatus: "paid",
      createdAt: "14/01/2024 10:30",
    },
    {
      id: "DH002",
      customer: "Trần Thị B",
      email: "tranthib@gmail.com",
      product: "Áo dài cưới vàng kim",
      quantity: 1,
      rentalPeriod: "5 ngày",
      startDate: "20/01/2024",
      endDate: "25/01/2024",
      total: "4,500,000đ",
      status: "active",
      paymentStatus: "paid",
      createdAt: "19/01/2024 14:20",
    },
    {
      id: "DH003",
      customer: "Lê Văn C",
      email: "levanc@gmail.com",
      product: "Áo tứ thân xanh ngọc",
      quantity: 2,
      rentalPeriod: "2 ngày",
      startDate: "22/01/2024",
      endDate: "24/01/2024",
      total: "3,200,000đ",
      status: "pending",
      paymentStatus: "pending",
      createdAt: "21/01/2024 09:15",
    },
    {
      id: "DH004",
      customer: "Phạm Thị D",
      email: "phamthid@gmail.com",
      product: "Áo dài cách tân hoa sen",
      quantity: 1,
      rentalPeriod: "4 ngày",
      startDate: "25/01/2024",
      endDate: "29/01/2024",
      total: "3,800,000đ",
      status: "cancelled",
      paymentStatus: "refunded",
      createdAt: "20/01/2024 16:45",
    },
    {
      id: "DH005",
      customer: "Hoàng Văn E",
      email: "hoangvane@gmail.com",
      product: "Áo dài lụa tơ tằm",
      quantity: 1,
      rentalPeriod: "7 ngày",
      startDate: "28/01/2024",
      endDate: "04/02/2024",
      total: "5,600,000đ",
      status: "active",
      paymentStatus: "paid",
      createdAt: "26/01/2024 11:00",
    },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      pending: { label: "Chờ xác nhận", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      active: { label: "Đang thuê", className: "bg-blue-100 text-blue-800 border-blue-200" },
      completed: { label: "Hoàn thành", className: "bg-green-100 text-green-800 border-green-200" },
      cancelled: { label: "Đã hủy", className: "bg-red-100 text-red-800 border-red-200" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge className={`${config.className} border`}>{config.label}</Badge>;
  };

  const getPaymentBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      paid: { label: "Đã thanh toán", className: "bg-green-100 text-green-800 border-green-200" },
      pending: { label: "Chờ thanh toán", className: "bg-orange-100 text-orange-800 border-orange-200" },
      refunded: { label: "Đã hoàn tiền", className: "bg-purple-100 text-purple-800 border-purple-200" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge className={`${config.className} border`}>{config.label}</Badge>;
  };

  const stats = [
    {
      label: "Tổng đơn thuê",
      value: "156",
      icon: Package,
      color: "bg-blue-500",
    },
    {
      label: "Đang thuê",
      value: "23",
      icon: Calendar,
      color: "bg-green-500",
    },
    {
      label: "Chờ xác nhận",
      value: "8",
      icon: Filter,
      color: "bg-yellow-500",
    },
    {
      label: "Hoàn thành",
      value: "125",
      icon: Package,
      color: "bg-purple-500",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-[#c1272d] to-[#d4af37] bg-clip-text text-transparent mb-2">
            Quản lý đơn thuê
          </h1>
          <p className="text-gray-600">
            Quản lý và theo dõi tất cả các đơn thuê trang phục
          </p>
        </div>

        {/* Stats Cards */}
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

        {/* Filters & Search */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm theo mã đơn, tên khách hàng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
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

              {/* Export Button */}
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Xuất Excel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
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
                  {orders.map((order) => (
                    <TableRow key={order.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium text-[#c1272d]">
                        {order.id}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{order.customer}</p>
                          <p className="text-xs text-gray-500">{order.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-gray-900">{order.product}</p>
                        <p className="text-xs text-gray-500">{order.createdAt}</p>
                      </TableCell>
                      <TableCell className="text-center">{order.quantity}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="text-gray-900">{order.rentalPeriod}</p>
                          <p className="text-xs text-gray-500">
                            {order.startDate} - {order.endDate}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-gray-900">
                        {order.total}
                      </TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{getPaymentBadge(order.paymentStatus)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="gap-2">
                          <Eye className="w-4 h-4" />
                          Chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
