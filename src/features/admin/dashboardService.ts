import { apiFetch } from "../../api/client";

export type DashboardCategoryMetric = "rentals" | "outfits";

export interface AdminDashboardQuery {
  months?: number;
  topProducts?: number;
  activities?: number;
  categoryMetric?: DashboardCategoryMetric;
}

export interface AdminDashboardResponse {
  generatedAt: string;
  appliedQuery: {
    months: number;
    topProducts: number;
    activities: number;
    categoryMetric: DashboardCategoryMetric | string;
  };
  summary: {
    totalUsers: number;
    usersChangePercent: number;
    totalProducts: number;
    activeProducts: number;
    productsChangePercent: number;
    ordersInCurrentPeriod: number;
    ordersChangePercent: number;
    revenueInCurrentPeriod: number;
    revenueChangePercent: number;
    currency: string;
  };
  revenueOrdersTrend: Array<{
    periodKey: string;
    label: string;
    orderCount: number;
    revenue: number;
  }>;
  categoryDistribution: Array<{
    categoryId: number;
    categoryName: string;
    value: number;
    percent: number;
    metric: string;
  }>;
  recentActivities: Array<{
    type: string;
    title: string;
    subTitle?: string | null;
    occurredAt: string;
    referenceType?: string | null;
    referenceId?: number | null;
  }>;
  topProducts: Array<{
    rank: number;
    outfitId: number;
    outfitName: string;
    categoryName?: string | null;
    rentalCount: number;
    trendPercent: number;
  }>;
  notes: string[];
}

export type AdminDashboardSummary = AdminDashboardResponse["summary"];
export type AdminDashboardTrendPoint = AdminDashboardResponse["revenueOrdersTrend"][number];
export type AdminDashboardCategoryDistributionItem =
  AdminDashboardResponse["categoryDistribution"][number];
export type AdminDashboardRecentActivity = AdminDashboardResponse["recentActivities"][number];
export type AdminDashboardTopProduct = AdminDashboardResponse["topProducts"][number];

function getAuthHeaders(token?: string | null) {
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

export async function getAdminDashboard(
  query: AdminDashboardQuery = {},
  token?: string | null,
): Promise<AdminDashboardResponse> {
  return apiFetch<AdminDashboardResponse>("/api/AdminDashboard", {
    params: query,
    headers: getAuthHeaders(token),
  });
}

export async function getAdminDashboardSummary(token?: string | null): Promise<AdminDashboardSummary> {
  return apiFetch<AdminDashboardSummary>("/api/AdminDashboard/summary", {
    headers: getAuthHeaders(token),
  });
}

export async function getAdminDashboardTrend(
  months = 6,
  token?: string | null,
): Promise<AdminDashboardTrendPoint[]> {
  return apiFetch<AdminDashboardTrendPoint[]>("/api/AdminDashboard/revenue-orders-trend", {
    params: { months },
    headers: getAuthHeaders(token),
  });
}

export async function getAdminDashboardCategoryDistribution(
  metric: DashboardCategoryMetric = "rentals",
  token?: string | null,
): Promise<AdminDashboardCategoryDistributionItem[]> {
  return apiFetch<AdminDashboardCategoryDistributionItem[]>("/api/AdminDashboard/category-distribution", {
    params: { metric },
    headers: getAuthHeaders(token),
  });
}

export async function getAdminDashboardRecentActivities(
  limit = 10,
  token?: string | null,
): Promise<AdminDashboardRecentActivity[]> {
  return apiFetch<AdminDashboardRecentActivity[]>("/api/AdminDashboard/recent-activities", {
    params: { limit },
    headers: getAuthHeaders(token),
  });
}

export async function getAdminDashboardTopProducts(
  limit = 5,
  token?: string | null,
): Promise<AdminDashboardTopProduct[]> {
  return apiFetch<AdminDashboardTopProduct[]>("/api/AdminDashboard/top-products", {
    params: { limit, period: "currentMonth" },
    headers: getAuthHeaders(token),
  });
}
