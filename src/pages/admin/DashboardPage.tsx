import { AdminLayout } from "../../components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Users, Package, ShoppingCart, TrendingUp, ArrowUpRight, ArrowDownRight, Eye, Clock } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function DashboardPage() {
  const stats = [
    {
      title: "Tổng người dùng",
      value: "1,234",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "#3b82f6",
      bgColor: "bg-blue-50",
      description: "So với tháng trước"
    },
    {
      title: "Tổng sản phẩm",
      value: "456",
      change: "+8%",
      trend: "up",
      icon: Package,
      color: "#10b981",
      bgColor: "bg-green-50",
      description: "Đang hoạt động"
    },
    {
      title: "Đơn thuê",
      value: "789",
      change: "+23%",
      trend: "up",
      icon: ShoppingCart,
      color: "#8b5cf6",
      bgColor: "bg-purple-50",
      description: "Tháng này"
    },
    {
      title: "Doanh thu",
      value: "123M",
      change: "+15%",
      trend: "up",
      icon: TrendingUp,
      color: "#c1272d",
      bgColor: "bg-red-50",
      description: "VNĐ trong tháng"
    },
  ];

  // Revenue chart data
  const revenueData = [
    { month: "T1", revenue: 65, orders: 45 },
    { month: "T2", revenue: 78, orders: 52 },
    { month: "T3", revenue: 90, orders: 61 },
    { month: "T4", revenue: 81, orders: 58 },
    { month: "T5", revenue: 95, orders: 68 },
    { month: "T6", revenue: 123, orders: 85 },
  ];

  // Category distribution data
  const categoryData = [
    { name: "Áo dài", value: 45, color: "#c1272d" },
    { name: "Áo tứ thân", value: 25, color: "#d4af37" },
    { name: "Áo bà ba", value: 15, color: "#8b5cf6" },
    { name: "Áo nhật bình", value: 15, color: "#3b82f6" },
  ];

  // Recent activity
  const recentActivities = [
    { id: 1, type: "order", user: "Nguyễn Văn A", action: "đặt đơn thuê", item: "Áo dài truyền thống", time: "5 phút trước", icon: ShoppingCart, color: "text-green-600" },
    { id: 2, type: "user", user: "Trần Thị B", action: "đăng ký tài khoản", item: "", time: "12 phút trước", icon: Users, color: "text-blue-600" },
    { id: 3, type: "view", user: "Lê Văn C", action: "xem sản phẩm", item: "Áo dài cưới vàng kim", time: "20 phút trước", icon: Eye, color: "text-purple-600" },
    { id: 4, type: "order", user: "Phạm Thị D", action: "hoàn thành đơn", item: "Áo tứ thân xanh", time: "35 phút trước", icon: Clock, color: "text-orange-600" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-[#c1272d] to-[#d4af37] bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">
            Tổng quan về hoạt động của hệ thống Sắc Việt
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                <CardContent className="p-6 relative">
                  {/* Background Gradient */}
                  <div 
                    className="absolute top-0 right-0 w-32 h-32 opacity-5 rounded-full blur-2xl"
                    style={{ backgroundColor: stat.color }}
                  ></div>
                  
                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                      <div className="flex items-center gap-2">
                        {stat.trend === "up" ? (
                          <ArrowUpRight className="w-4 h-4 text-green-600" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-red-600" />
                        )}
                        <span className={`text-sm font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                          {stat.change}
                        </span>
                        <span className="text-xs text-gray-500">{stat.description}</span>
                      </div>
                    </div>
                    <div 
                      className={`${stat.bgColor} p-4 rounded-xl group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-7 h-7" style={{ color: stat.color }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue Chart */}
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Doanh thu & Đơn hàng</span>
                <span className="text-sm font-normal text-gray-500">6 tháng gần đây</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#c1272d" 
                    strokeWidth={3}
                    name="Doanh thu (M)" 
                    dot={{ fill: '#c1272d', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#d4af37" 
                    strokeWidth={3}
                    name="Đơn hàng" 
                    dot={{ fill: '#d4af37', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Phân bổ danh mục</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
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

        {/* Recent Activity & Popular Products */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Hoạt động gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                      <div className={`p-2 rounded-lg bg-gray-50`}>
                        <Icon className={`w-5 h-5 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          <span className="font-semibold">{activity.user}</span> {activity.action}
                          {activity.item && <span className="font-medium"> {activity.item}</span>}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Popular Products */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Sản phẩm phổ biến</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Áo dài cách tân hoa sen", count: 45, trend: "+12%" },
                  { name: "Áo dài truyền thống đỏ", count: 38, trend: "+8%" },
                  { name: "Áo dài cưới vàng kim", count: 32, trend: "+15%" },
                  { name: "Áo dài tứ thân xanh", count: 28, trend: "+5%" },
                  { name: "Áo dài lụa tơ tằm", count: 24, trend: "+3%" },
                ].map((product, i) => (
                  <div key={i} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#c1272d] to-[#d4af37] flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{i + 1}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                        <p className="text-xs text-gray-500 mt-1">Đã cho thuê</p>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm font-bold text-[#c1272d]">{product.count} lần</p>
                      <p className="text-xs text-green-600 font-medium">{product.trend}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}