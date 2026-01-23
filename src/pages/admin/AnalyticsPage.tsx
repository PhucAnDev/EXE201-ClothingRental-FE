import { AdminLayout } from "../../components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  ShoppingBag,
  DollarSign,
  Eye,
  Calendar,
  Award,
} from "lucide-react";
import { useState } from "react";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("month");

  // Revenue trend data
  const revenueData = [
    { month: "Tháng 1", revenue: 65, orders: 45, customers: 38 },
    { month: "Tháng 2", revenue: 78, orders: 52, customers: 42 },
    { month: "Tháng 3", revenue: 90, orders: 61, customers: 51 },
    { month: "Tháng 4", revenue: 81, orders: 58, customers: 48 },
    { month: "Tháng 5", revenue: 95, orders: 68, customers: 56 },
    { month: "Tháng 6", revenue: 123, orders: 85, customers: 67 },
  ];

  // Product category data
  const categoryData = [
    { name: "Áo dài", value: 45, color: "#c1272d" },
    { name: "Áo tứ thân", value: 25, color: "#d4af37" },
    { name: "Áo bà ba", value: 15, color: "#8b5cf6" },
    { name: "Áo nhật bình", value: 15, color: "#3b82f6" },
  ];

  // Popular products
  const popularProducts = [
    { name: "Áo dài cách tân hoa sen", views: 1234, orders: 45, revenue: "22.5M" },
    { name: "Áo dài truyền thống đỏ", views: 1102, orders: 38, revenue: "19.0M" },
    { name: "Áo dài cưới vàng kim", views: 987, orders: 32, revenue: "28.8M" },
    { name: "Áo dài tứ thân xanh", views: 856, orders: 28, revenue: "16.8M" },
    { name: "Áo dài lụa tơ tằm", views: 742, orders: 24, revenue: "14.4M" },
  ];

  // Customer demographics
  const customerAgeData = [
    { age: "18-25", value: 30 },
    { age: "26-35", value: 45 },
    { age: "36-45", value: 20 },
    { age: "46+", value: 5 },
  ];

  // Peak hours data
  const peakHoursData = [
    { hour: "6h", orders: 5 },
    { hour: "9h", orders: 15 },
    { hour: "12h", orders: 25 },
    { hour: "15h", orders: 20 },
    { hour: "18h", orders: 30 },
    { hour: "21h", orders: 18 },
  ];

  const stats = [
    {
      title: "Tổng doanh thu",
      value: "123M",
      change: "+15.3%",
      trend: "up",
      icon: DollarSign,
      color: "#c1272d",
      bgColor: "bg-red-50",
    },
    {
      title: "Tổng đơn hàng",
      value: "789",
      change: "+23.1%",
      trend: "up",
      icon: ShoppingBag,
      color: "#8b5cf6",
      bgColor: "bg-purple-50",
    },
    {
      title: "Khách hàng mới",
      value: "234",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "#3b82f6",
      bgColor: "bg-blue-50",
    },
    {
      title: "Lượt xem",
      value: "12.4K",
      change: "+8.2%",
      trend: "up",
      icon: Eye,
      color: "#10b981",
      bgColor: "bg-green-50",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-[#c1272d] to-[#d4af37] bg-clip-text text-transparent mb-2">
              Thống kê & Phân tích
            </h1>
            <p className="text-gray-600">
              Phân tích chi tiết về doanh thu, sản phẩm và khách hàng
            </p>
          </div>

          {/* Time Range Filter */}
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">7 ngày qua</SelectItem>
              <SelectItem value="month">30 ngày qua</SelectItem>
              <SelectItem value="quarter">3 tháng qua</SelectItem>
              <SelectItem value="year">12 tháng qua</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;
            return (
              <Card key={stat.title} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${stat.bgColor} p-3 rounded-xl`}>
                      <Icon className="w-6 h-6" style={{ color: stat.color }} />
                    </div>
                    <Badge
                      className={`${
                        stat.trend === "up"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-red-100 text-red-700 border-red-200"
                      } border gap-1`}
                    >
                      <TrendIcon className="w-3 h-3" />
                      {stat.change}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Revenue & Orders Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Doanh thu & Đơn hàng theo thời gian</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c1272d" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#c1272d" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#c1272d"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    name="Doanh thu (M)"
                  />
                  <Area
                    type="monotone"
                    dataKey="orders"
                    stroke="#d4af37"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorOrders)"
                    name="Đơn hàng"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Phân bổ theo danh mục</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}\n${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Popular Products & Customer Demographics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Popular Products */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#d4af37]" />
                Top sản phẩm phổ biến
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularProducts.map((product, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-gray-50 to-transparent hover:from-[#c1272d]/5 transition-all"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c1272d] to-[#d4af37] flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{product.name}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {product.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <ShoppingBag className="w-3 h-3" />
                          {product.orders} đơn
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#c1272d]">{product.revenue}</p>
                      <p className="text-xs text-gray-500">VNĐ</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Peak Hours */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Giờ cao điểm đặt hàng</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={peakHoursData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="hour" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar dataKey="orders" fill="#c1272d" radius={[8, 8, 0, 0]} name="Đơn hàng" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Customer Demographics */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Độ tuổi khách hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {customerAgeData.map((data, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 hover:border-[#c1272d]/30 transition-all"
                >
                  <p className="text-sm text-gray-600 mb-2">Độ tuổi {data.age}</p>
                  <p className="text-3xl font-bold text-[#c1272d] mb-1">{data.value}%</p>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#c1272d] to-[#d4af37]"
                      style={{ width: `${data.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
