import { useEffect, useState } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import {
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Clock,
  type LucideIcon,
} from "lucide-react";
import {
  LineChart,
  Line,
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
  getAdminDashboard,
  getAdminDashboardCategoryDistribution,
  getAdminDashboardRecentActivities,
  getAdminDashboardSummary,
  getAdminDashboardTopProducts,
  getAdminDashboardTrend,
  type AdminDashboardCategoryDistributionItem,
  type AdminDashboardRecentActivity,
  type AdminDashboardSummary,
  type AdminDashboardTopProduct,
  type AdminDashboardTrendPoint,
  type DashboardCategoryMetric,
} from "../../features/admin/dashboardService";

type TrendDirection = "up" | "down";

type StatCardUi = {
  title: string;
  value: string;
  change: string;
  trend: TrendDirection;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  description: string;
};

type ChartPointUi = {
  month: string;
  revenue: number; // in millions for chart readability
  orders: number;
};

type CategoryPointUi = {
  name: string;
  value: number;
  color: string;
};

type ActivityUi = {
  id: string;
  title: string;
  subTitle?: string | null;
  time: string;
  icon: LucideIcon;
  color: string;
};

type TopProductUi = {
  rank: number;
  name: string;
  count: number;
  trend: string;
  trendClassName: string;
};

type LoadingBlocks = {
  summary: boolean;
  trend: boolean;
  category: boolean;
  recent: boolean;
  topProducts: boolean;
};

const CATEGORY_COLORS = ["#c1272d", "#d4af37", "#8b5cf6", "#3b82f6", "#10b981", "#f97316"];
const DASHBOARD_QUERY = {
  months: 6,
  topProducts: 5,
  activities: 10,
  categoryMetric: "rentals" as DashboardCategoryMetric,
};

function formatInteger(value: number): string {
  return Number.isFinite(value) ? value.toLocaleString("vi-VN") : "0";
}

function formatCompactMoney(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) {
    const n = value / 1_000_000_000;
    return `${Number.isInteger(n) ? n.toFixed(0) : n.toFixed(1)}B`;
  }
  if (abs >= 1_000_000) {
    const n = value / 1_000_000;
    return `${Number.isInteger(n) ? n.toFixed(0) : n.toFixed(1)}M`;
  }
  if (abs >= 1_000) {
    const n = value / 1_000;
    return `${Number.isInteger(n) ? n.toFixed(0) : n.toFixed(1)}K`;
  }
  return formatInteger(value);
}

function formatSignedPercent(value: number): string {
  const safe = Number.isFinite(value) ? value : 0;
  const rounded = Math.round(safe * 100) / 100;
  return `${rounded >= 0 ? "+" : ""}${rounded}%`;
}

function trendFromPercent(value: number): TrendDirection {
  return value >= 0 ? "up" : "down";
}

function relativeTimeVi(isoDate: string): string {
  const time = new Date(isoDate).getTime();
  if (Number.isNaN(time)) return "Vừa xong";

  const diffMs = Date.now() - time;
  const future = diffMs < 0;
  const absSeconds = Math.round(Math.abs(diffMs) / 1000);

  if (absSeconds < 60) return future ? "Ngay sau đó" : "Vừa xong";

  const minutes = Math.floor(absSeconds / 60);
  if (minutes < 60) return `${minutes} phút ${future ? "nữa" : "trước"}`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ ${future ? "nữa" : "trước"}`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ngày ${future ? "nữa" : "trước"}`;

  return new Date(isoDate).toLocaleString("vi-VN");
}

function activityVisual(type: string): { icon: LucideIcon; color: string } {
  switch (type) {
    case "order_created":
      return { icon: ShoppingCart, color: "text-green-600" };
    case "user_registered":
      return { icon: Users, color: "text-blue-600" };
    case "payment_paid":
      return { icon: TrendingUp, color: "text-emerald-600" };
    case "booking_completed":
      return { icon: Clock, color: "text-orange-600" };
    default:
      return { icon: Eye, color: "text-purple-600" };
  }
}

function toChartRevenueMillions(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round((value / 1_000_000) * 10) / 10;
}

function createInitialLoadingBlocks(): LoadingBlocks {
  return {
    summary: true,
    trend: true,
    category: true,
    recent: true,
    topProducts: true,
  };
}

function isHttp404(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false;
  if (!("response" in error)) return false;
  const status = (error as { response?: { status?: number } }).response?.status;
  return status === 404;
}

function toErrorMessage(error: any): string {
  const status = error?.response?.status;
  if (status === 401) {
    return "Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại bằng tài khoản quản trị viên.";
  }
  if (status === 403) {
    return "Bạn không có quyền truy cập dashboard quản trị.";
  }
  return error?.response?.data?.message || error?.message || "Không thể tải dữ liệu dashboard.";
}

export default function DashboardPage() {
  const [summaryData, setSummaryData] = useState<AdminDashboardSummary | null>(null);
  const [trendPoints, setTrendPoints] = useState<AdminDashboardTrendPoint[]>([]);
  const [categoryDistributionApi, setCategoryDistributionApi] = useState<
    AdminDashboardCategoryDistributionItem[]
  >([]);
  const [recentActivitiesApi, setRecentActivitiesApi] = useState<AdminDashboardRecentActivity[]>([]);
  const [topProductsApi, setTopProductsApi] = useState<AdminDashboardTopProduct[]>([]);
  const [loadingBlocks, setLoadingBlocks] = useState<LoadingBlocks>(createInitialLoadingBlocks);
  const [error, setError] = useState<string | null>(null);
  const [usedFallbackAggregate, setUsedFallbackAggregate] = useState(false);

  useEffect(() => {
    let mounted = true;

    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    const setBlockLoading = (key: keyof LoadingBlocks, value: boolean) => {
      if (!mounted) return;
      setLoadingBlocks((prev) => ({ ...prev, [key]: value }));
    };

    const setAllBlocksLoading = (value: boolean) => {
      if (!mounted) return;
      setLoadingBlocks({
        summary: value,
        trend: value,
        category: value,
        recent: value,
        topProducts: value,
      });
    };

    const fillFromAggregate = async () => {
      try {
        if (!mounted) return;
        setUsedFallbackAggregate(true);
        const data = await getAdminDashboard(DASHBOARD_QUERY, token);
        if (!mounted) return;
        setSummaryData(data.summary ?? null);
        setTrendPoints(data.revenueOrdersTrend ?? []);
        setCategoryDistributionApi(data.categoryDistribution ?? []);
        setRecentActivitiesApi(data.recentActivities ?? []);
        setTopProductsApi(data.topProducts ?? []);
      } catch (err: any) {
        if (!mounted) return;
        setError(toErrorMessage(err));
      } finally {
        if (mounted) setAllBlocksLoading(false);
      }
    };

    const loadDashboard = async () => {
      try {
        if (!mounted) return;
        setError(null);
        setUsedFallbackAggregate(false);
        setAllBlocksLoading(true);

        const summaryResult = await getAdminDashboardSummary(token);
        if (!mounted) return;
        setSummaryData(summaryResult);
        setBlockLoading("summary", false);

        const [trendRes, categoryRes] = await Promise.allSettled([
          getAdminDashboardTrend(DASHBOARD_QUERY.months, token),
          getAdminDashboardCategoryDistribution(DASHBOARD_QUERY.categoryMetric, token),
        ]);
        if (!mounted) return;

        if (
          (trendRes.status === "rejected" && isHttp404(trendRes.reason)) ||
          (categoryRes.status === "rejected" && isHttp404(categoryRes.reason))
        ) {
          await fillFromAggregate();
          return;
        }

        if (trendRes.status === "fulfilled") {
          setTrendPoints(trendRes.value);
        } else {
          setError((prev) => prev ?? toErrorMessage(trendRes.reason));
        }

        if (categoryRes.status === "fulfilled") {
          setCategoryDistributionApi(categoryRes.value);
        } else {
          setError((prev) => prev ?? toErrorMessage(categoryRes.reason));
        }
        setBlockLoading("trend", false);
        setBlockLoading("category", false);

        const [recentRes, topProductsRes] = await Promise.allSettled([
          getAdminDashboardRecentActivities(DASHBOARD_QUERY.activities, token),
          getAdminDashboardTopProducts(DASHBOARD_QUERY.topProducts, token),
        ]);
        if (!mounted) return;

        if (
          (recentRes.status === "rejected" && isHttp404(recentRes.reason)) ||
          (topProductsRes.status === "rejected" && isHttp404(topProductsRes.reason))
        ) {
          await fillFromAggregate();
          return;
        }

        if (recentRes.status === "fulfilled") {
          setRecentActivitiesApi(recentRes.value);
        } else {
          setError((prev) => prev ?? toErrorMessage(recentRes.reason));
        }

        if (topProductsRes.status === "fulfilled") {
          setTopProductsApi(topProductsRes.value);
        } else {
          setError((prev) => prev ?? toErrorMessage(topProductsRes.reason));
        }
        setBlockLoading("recent", false);
        setBlockLoading("topProducts", false);
      } catch (err: any) {
        if (!mounted) return;

        if (isHttp404(err)) {
          await fillFromAggregate();
          return;
        }

        setError(toErrorMessage(err));
        setAllBlocksLoading(false);
      }
    };

    if (!token) {
      setError("Bạn chưa đăng nhập. Vui lòng đăng nhập bằng tài khoản quản trị viên để xem dashboard.");
      setLoadingBlocks({
        summary: false,
        trend: false,
        category: false,
        recent: false,
        topProducts: false,
      });
      return () => {
        mounted = false;
      };
    }

    loadDashboard();
    return () => {
      mounted = false;
    };
  }, []);

  const loading = Object.values(loadingBlocks).some(Boolean);
  const summary = summaryData;

  const stats: StatCardUi[] = [
    {
      title: "Tổng người dùng",
      value: formatInteger(summary?.totalUsers ?? 0),
      change: formatSignedPercent(summary?.usersChangePercent ?? 0),
      trend: trendFromPercent(summary?.usersChangePercent ?? 0),
      icon: Users,
      color: "#3b82f6",
      bgColor: "bg-blue-50",
      description: "So với tháng trước",
    },
    {
      title: "Tổng sản phẩm",
      value: formatInteger(summary?.totalProducts ?? 0),
      change: formatSignedPercent(summary?.productsChangePercent ?? 0),
      trend: trendFromPercent(summary?.productsChangePercent ?? 0),
      icon: Package,
      color: "#10b981",
      bgColor: "bg-green-50",
      description: `${formatInteger(summary?.activeProducts ?? 0)} đang hoạt động`,
    },
    {
      title: "Đơn thuê",
      value: formatInteger(summary?.ordersInCurrentPeriod ?? 0),
      change: formatSignedPercent(summary?.ordersChangePercent ?? 0),
      trend: trendFromPercent(summary?.ordersChangePercent ?? 0),
      icon: ShoppingCart,
      color: "#8b5cf6",
      bgColor: "bg-purple-50",
      description: "Tháng này",
    },
    {
      title: "Doanh thu",
      value: formatCompactMoney(summary?.revenueInCurrentPeriod ?? 0),
      change: formatSignedPercent(summary?.revenueChangePercent ?? 0),
      trend: trendFromPercent(summary?.revenueChangePercent ?? 0),
      icon: TrendingUp,
      color: "#c1272d",
      bgColor: "bg-red-50",
      description: `${summary?.currency ?? "VND"} trong tháng`,
    },
  ];

  const revenueData: ChartPointUi[] =
    trendPoints.map((p) => ({
      month: p.label || p.periodKey,
      revenue: toChartRevenueMillions(Number(p.revenue ?? 0)),
      orders: Number(p.orderCount ?? 0),
    })) ?? [];

  const categoryData: CategoryPointUi[] =
    categoryDistributionApi.map((item, index) => ({
      name: item.categoryName,
      value: Number(item.value ?? 0),
      color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
    })) ?? [];

  const recentActivities: ActivityUi[] =
    recentActivitiesApi.map((activity, index) => {
      const visual = activityVisual(activity.type);
      return {
        id: `${activity.type}-${activity.referenceId ?? index}-${activity.occurredAt}`,
        title: activity.title,
        subTitle: activity.subTitle,
        time: relativeTimeVi(activity.occurredAt),
        icon: visual.icon,
        color: visual.color,
      };
    }) ?? [];

  const popularProducts: TopProductUi[] =
    topProductsApi.map((product, index) => ({
      rank: product.rank || index + 1,
      name: product.outfitName,
      count: Number(product.rentalCount ?? 0),
      trend: formatSignedPercent(Number(product.trendPercent ?? 0)),
      trendClassName:
        Number(product.trendPercent ?? 0) >= 0 ? "text-green-600" : "text-red-600",
    })) ?? [];

  const chartMonthsLabel = `${DASHBOARD_QUERY.months} tháng gần đây`;

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-[#c1272d] to-[#d4af37] bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">Tổng quan về hoạt động của hệ thống Sắc Việt</p>
          {loading && (
            <p className="text-sm text-gray-500 mt-2 animate-pulse">Đang tải dữ liệu dashboard...</p>
          )}
          {error && (
            <p className="text-sm text-red-600 mt-2">
              {error} {usedFallbackAggregate ? "(Đang hiển thị dữ liệu từ API tổng hợp)" : ""}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.title}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group"
              >
                <CardContent className="p-6 relative">
                  <div
                    className="absolute top-0 right-0 w-32 h-32 opacity-5 rounded-full blur-2xl"
                    style={{ backgroundColor: stat.color }}
                  />

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
                        <span
                          className={`text-sm font-medium ${
                            stat.trend === "up" ? "text-green-600" : "text-red-600"
                          }`}
                        >
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Doanh thu & Đơn hàng</span>
                <span className="text-sm font-normal text-gray-500">{chartMonthsLabel}</span>
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
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    formatter={(value: number | string, name: string) => {
                      if (name === "Doanh thu (M)") return [`${value}M`, name];
                      return [value, name];
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#c1272d"
                    strokeWidth={3}
                    name="Doanh thu (M)"
                    dot={{ fill: "#c1272d", r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#d4af37"
                    strokeWidth={3}
                    name="Đơn hàng"
                    dot={{ fill: "#d4af37", r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

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
                    label={({ name, percent }) =>
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number | string) => [value, "Giá trị"]} />
                </PieChart>
              </ResponsiveContainer>
              {categoryData.length === 0 && (
                <p className="text-sm text-gray-500 text-center -mt-6">Chưa có dữ liệu danh mục</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Hoạt động gần đây</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.length === 0 && (
                  <p className="text-sm text-gray-500">Chưa có hoạt động gần đây.</p>
                )}
                {recentActivities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0"
                    >
                      <div className="p-2 rounded-lg bg-gray-50">
                        <Icon className={`w-5 h-5 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">
                          <span className="font-semibold">{activity.title}</span>
                          {activity.subTitle ? (
                            <span className="font-medium"> {activity.subTitle}</span>
                          ) : null}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Sản phẩm phổ biến</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {popularProducts.length === 0 && (
                  <p className="text-sm text-gray-500">Chưa có dữ liệu sản phẩm phổ biến.</p>
                )}
                {popularProducts.map((product) => (
                  <div
                    key={`${product.rank}-${product.name}`}
                    className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#c1272d] to-[#d4af37] flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{product.rank}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                        <p className="text-xs text-gray-500 mt-1">Đã cho thuê</p>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm font-bold text-[#c1272d]">{product.count} lần</p>
                      <p className={`text-xs font-medium ${product.trendClassName}`}>{product.trend}</p>
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

