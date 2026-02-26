import { AdminLayout } from "../../components/admin/AdminLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
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
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  getAdminDashboard,
  type AdminDashboardResponse,
  type DashboardCategoryMetric,
} from "../../features/admin/dashboardService";

// Color palette for charts
const CATEGORY_COLORS = [
  "#c1272d",
  "#d4af37",
  "#8b5cf6",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
];

// Format currency
const formatCurrency = (value: number): string => {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toString();
};

// Format change percent
const formatChangePercent = (value: number): string => {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<
    "week" | "month" | "quarter" | "year"
  >("month");
  const [categoryMetric, setCategoryMetric] =
    useState<DashboardCategoryMetric>("rentals");
  const [dashboardData, setDashboardData] =
    useState<AdminDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = useSelector((state: RootState) => state.auth.token);

  // Map time range to months
  const getMonthsFromTimeRange = (range: string): number => {
    switch (range) {
      case "week":
        return 1;
      case "month":
        return 1;
      case "quarter":
        return 3;
      case "year":
        return 12;
      default:
        return 6;
    }
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const months = getMonthsFromTimeRange(timeRange);
        const data = await getAdminDashboard(
          {
            months,
            topProducts: 5,
            activities: 10,
            categoryMetric,
          },
          token,
        );
        setDashboardData(data);
      } catch (err: any) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message || "Không thể tải dữ liệu thống kê");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [timeRange, categoryMetric, token]);

  // Prepare stats cards data
  const stats = dashboardData
    ? [
        {
          title: "Tổng doanh thu",
          value: formatCurrency(dashboardData.summary.revenueInCurrentPeriod),
          change: formatChangePercent(
            dashboardData.summary.revenueChangePercent,
          ),
          trend:
            dashboardData.summary.revenueChangePercent >= 0 ? "up" : "down",
          icon: DollarSign,
          color: "#c1272d",
          bgColor: "bg-red-50",
        },
        {
          title: "Tổng đơn hàng",
          value: dashboardData.summary.ordersInCurrentPeriod.toString(),
          change: formatChangePercent(
            dashboardData.summary.ordersChangePercent,
          ),
          trend: dashboardData.summary.ordersChangePercent >= 0 ? "up" : "down",
          icon: ShoppingBag,
          color: "#8b5cf6",
          bgColor: "bg-purple-50",
        },
        {
          title: "Tổng người dùng",
          value: dashboardData.summary.totalUsers.toString(),
          change: formatChangePercent(dashboardData.summary.usersChangePercent),
          trend: dashboardData.summary.usersChangePercent >= 0 ? "up" : "down",
          icon: Users,
          color: "#3b82f6",
          bgColor: "bg-blue-50",
        },
        {
          title: "Sản phẩm hoạt động",
          value: `${dashboardData.summary.activeProducts}/${dashboardData.summary.totalProducts}`,
          change: formatChangePercent(
            dashboardData.summary.productsChangePercent,
          ),
          trend:
            dashboardData.summary.productsChangePercent >= 0 ? "up" : "down",
          icon: Eye,
          color: "#10b981",
          bgColor: "bg-green-50",
        },
      ]
    : [];

  // Prepare revenue trend data for chart
  const revenueData =
    dashboardData?.revenueOrdersTrend.map((point) => ({
      month: point.label,
      revenue: point.revenue / 1_000_000, // Convert to millions for display
      orders: point.orderCount,
    })) || [];

  // Prepare category data for pie chart
  const categoryData =
    dashboardData?.categoryDistribution.map((cat, index) => ({
      name: cat.categoryName,
      value: cat.value,
      percent: cat.percent,
      color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
    })) || [];

  // Prepare top products data
  const popularProducts =
    dashboardData?.topProducts.map((product) => ({
      rank: product.rank,
      name: product.outfitName,
      category: product.categoryName || "N/A",
      rentals: product.rentalCount,
      trend: product.trendPercent,
    })) || [];

  // Prepare recent activities data
  const recentActivities = dashboardData?.recentActivities || [];

  // Format activity time
  const formatActivityTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  // Get activity icon and color
  const getActivityStyle = (type: string): { icon: string; color: string } => {
    switch (type) {
      case "order_created":
        return { icon: "🛍️", color: "#3b82f6" };
      case "payment_paid":
        return { icon: "💰", color: "#10b981" };
      case "user_registered":
        return { icon: "👤", color: "#8b5cf6" };
      case "booking_completed":
        return { icon: "✅", color: "#10b981" };
      default:
        return { icon: "📋", color: "#6b7280" };
    }
  };

  // Loading state
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-[#c1272d] mx-auto mb-4" />
            <p className="text-gray-600">Đang tải dữ liệu thống kê...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-900 font-semibold mb-2">Lỗi tải dữ liệu</p>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

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
              <Card
                key={stat.title}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow"
              >
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
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
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
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#c1272d" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#c1272d" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorOrders"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
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
                    label={({ name, percent }) =>
                      `${name}\n${(percent * 100).toFixed(0)}%`
                    }
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
                      <p className="font-medium text-gray-900 truncate">
                        {product.name}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <ShoppingBag className="w-3 h-3" />
                          {product.rentals} lượt thuê
                        </span>
                        {product.category && (
                          <span className="text-gray-400">
                            • {product.category}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        className={`${
                          product.trend >= 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.trend >= 0 ? "+" : ""}
                        {product.trend.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Hoạt động gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[350px] overflow-y-auto">
                {recentActivities.map((activity, index) => {
                  const style = getActivityStyle(activity.type);
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-lg"
                        style={{ backgroundColor: `${style.color}20` }}
                      >
                        {style.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm">
                          {activity.title}
                        </p>
                        {activity.subTitle && (
                          <p className="text-xs text-gray-500 mt-0.5">
                            {activity.subTitle}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {formatActivityTime(activity.occurredAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {recentActivities.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    Chưa có hoạt động nào
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        {dashboardData?.notes && dashboardData.notes.length > 0 && (
          <Card className="border-0 shadow-lg bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-blue-900 mb-2">Ghi chú</p>
                  <ul className="space-y-1 text-sm text-blue-800">
                    {dashboardData.notes.map((note, index) => (
                      <li key={index}>• {note}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
