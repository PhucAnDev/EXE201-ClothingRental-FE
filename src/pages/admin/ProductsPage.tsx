import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Filter,
  Layers,
  Package,
  Plus,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { ConfirmDeleteDialog } from "../../components/admin/ConfirmDeleteDialog";
import { CreateOutfitDialog } from "../../components/admin/CreateOutfitDialog";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Skeleton } from "../../components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import {
  getOutfitsForAdminTable,
  normalizeVietnameseText,
  softDeleteOutfit,
  type OutfitAdminRow,
} from "../../features/outfit/outfitAdminService";

type StockFilter = "all" | "in-stock" | "out-of-stock";
type LimitedFilter = "all" | "limited" | "non-limited";
type PageSizeOption = 10 | 20 | 50;
type StatTone = "info" | "success" | "danger" | "warning";

const PAGE_SIZE_OPTIONS: PageSizeOption[] = [10, 20, 50];
const PAGE_BUTTON_WINDOW = 5;

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Crect width='120' height='120' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='12'%3ENo image%3C/text%3E%3C/svg%3E";

const statToneClassMap: Record<
  StatTone,
  {
    cardBorder: string;
    iconWrap: string;
    iconColor: string;
  }
> = {
  info: {
    cardBorder: "border-sky-100/80",
    iconWrap: "bg-sky-50",
    iconColor: "text-sky-600",
  },
  success: {
    cardBorder: "border-emerald-100/80",
    iconWrap: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  danger: {
    cardBorder: "border-rose-100/80",
    iconWrap: "bg-rose-50",
    iconColor: "text-rose-600",
  },
  warning: {
    cardBorder: "border-amber-100/80",
    iconWrap: "bg-amber-50",
    iconColor: "text-amber-600",
  },
};

const priceFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});

function formatVnd(value: number): string {
  return priceFormatter.format(Number.isFinite(value) ? value : 0);
}

function isDeletedStatus(status: string | null | undefined): boolean {
  return (status ?? "").trim().toLowerCase() === "deleted";
}

function toErrorMessage(error: unknown, fallback: string): string {
  const normalizedFallback = normalizeVietnameseText(fallback);

  if (typeof error === "object" && error !== null && "response" in error) {
    const err = error as {
      response?: {
        data?: { message?: string };
        status?: number;
      };
      message?: string;
    };

    const apiMessage = err.response?.data?.message;
    if (typeof apiMessage === "string" && apiMessage.trim()) {
      return normalizeVietnameseText(apiMessage.trim());
    }

    if (err.response?.status === 401 || err.response?.status === 403) {
      return "Bạn không có quyền / Phiên đăng nhập đã hết hạn";
    }

    if (typeof err.message === "string" && err.message.trim()) {
      return normalizeVietnameseText(err.message.trim());
    }

    return normalizedFallback;
  }

  if (error instanceof Error && error.message.trim()) {
    return normalizeVietnameseText(error.message.trim());
  }

  return normalizedFallback;
}

function getCategoryFilterValue(row: OutfitAdminRow): string {
  if (row.categoryId !== null && row.categoryId !== undefined) {
    return String(row.categoryId);
  }

  return normalizeVietnameseText(row.categoryLabel);
}

function getPageNumberList(currentPage: number, totalPages: number): number[] {
  if (totalPages <= PAGE_BUTTON_WINDOW) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  let start = Math.max(1, currentPage - 2);
  let end = Math.min(totalPages, currentPage + 2);

  if (start === 1) {
    end = PAGE_BUTTON_WINDOW;
  } else if (end === totalPages) {
    start = totalPages - (PAGE_BUTTON_WINDOW - 1);
  }

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export default function ProductsPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<OutfitAdminRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<StockFilter>("all");
  const [filterLimited, setFilterLimited] = useState<LimitedFilter>("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSizeOption>(PAGE_SIZE_OPTIONS[0]);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<OutfitAdminRow | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchRows = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOutfitsForAdminTable();
      setRows(data.filter((row) => !isDeletedStatus(row.status)));
    } catch (err) {
      const message = toErrorMessage(err, "Không thể tải danh sách sản phẩm.");
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchRows();
  }, [fetchRows]);

  useEffect(() => {
    const debounceId = window.setTimeout(() => {
      setSearchQuery(searchInput);
    }, 300);

    return () => {
      window.clearTimeout(debounceId);
    };
  }, [searchInput]);

  const visibleRows = useMemo(
    () => rows.filter((row) => !isDeletedStatus(row.status)),
    [rows],
  );

  const categoryOptions = useMemo(() => {
    const uniqueMap = new Map<string, string>();
    visibleRows.forEach((row) => {
      const value = getCategoryFilterValue(row);
      if (!uniqueMap.has(value)) {
        uniqueMap.set(value, normalizeVietnameseText(row.categoryLabel));
      }
    });

    return Array.from(uniqueMap.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label, "vi", { sensitivity: "base" }));
  }, [visibleRows]);

  const regionSuggestions = useMemo(
    () =>
      visibleRows
        .map((row) => normalizeVietnameseText(String(row.region ?? "")).trim())
        .filter((value) => value.length > 0),
    [visibleRows],
  );

  useEffect(() => {
    if (filterCategory === "all") return;
    const isValid = categoryOptions.some((option) => option.value === filterCategory);
    if (!isValid) {
      setFilterCategory("all");
    }
  }, [categoryOptions, filterCategory]);

  const filteredRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return visibleRows
      .filter((row) => {
        const categoryValue = getCategoryFilterValue(row);
        const normalizedName = normalizeVietnameseText(row.name).toLowerCase();
        const normalizedCategory = normalizeVietnameseText(row.categoryLabel).toLowerCase();
        const matchesSearch =
          query.length === 0 ||
          normalizedName.includes(query) ||
          normalizedCategory.includes(query) ||
          String(row.outfitId).includes(query);

        const matchesStatus =
          filterStatus === "all" ||
          (filterStatus === "in-stock" && row.inStock) ||
          (filterStatus === "out-of-stock" && !row.inStock);

        const matchesLimited =
          filterLimited === "all" ||
          (filterLimited === "limited" && row.isLimited) ||
          (filterLimited === "non-limited" && !row.isLimited);

        const matchesCategory = filterCategory === "all" || categoryValue === filterCategory;

        return matchesSearch && matchesStatus && matchesLimited && matchesCategory;
      })
      .sort((a, b) => b.outfitId - a.outfitId);
  }, [visibleRows, searchQuery, filterStatus, filterLimited, filterCategory]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus, filterLimited, filterCategory]);

  const totalItems = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const pagedRows = filteredRows.slice(startIndex, endIndex);

  const pageNumbers = useMemo(
    () => getPageNumberList(safePage, totalPages),
    [safePage, totalPages],
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (loading || error) return;
    if (filteredRows.length > 0 && pagedRows.length === 0 && currentPage > 1) {
      setCurrentPage((prev) => Math.max(1, prev - 1));
    }
  }, [currentPage, error, filteredRows.length, loading, pagedRows.length]);

  const inStockCount = visibleRows.filter((row) => row.inStock).length;
  const outOfStockCount = visibleRows.length - inStockCount;
  const categoryCount = new Set(
    visibleRows.map((row) =>
      row.categoryId !== null && row.categoryId !== undefined
        ? row.categoryId
        : row.categoryLabel,
    ),
  ).size;

  const stats: {
    label: string;
    value: number;
    icon: typeof Package;
    tone: StatTone;
  }[] = [
    {
      label: "Tổng sản phẩm",
      value: visibleRows.length,
      icon: Package,
      tone: "info",
    },
    {
      label: "Còn hàng",
      value: inStockCount,
      icon: CheckCircle,
      tone: "success",
    },
    {
      label: "Hết hàng",
      value: outOfStockCount,
      icon: XCircle,
      tone: "danger",
    },
    {
      label: "Danh mục",
      value: categoryCount,
      icon: Layers,
      tone: "warning",
    },
  ];

  const handleView = (outfitId: number) => {
    navigate(`/admin/products/${outfitId}`);
  };

  const handleCreatedOutfit = async (createdOutfitId: number | null) => {
    await fetchRows();
    if (createdOutfitId && createdOutfitId > 0) {
      navigate(`/admin/products/${createdOutfitId}`);
    }
  };

  const handleRequestDelete = (row: OutfitAdminRow) => {
    setDeleteTarget(row);
    setDeleteOpen(true);
  };

  const handleDeleteOpenChange = (open: boolean) => {
    if (deleteLoading) return;
    setDeleteOpen(open);
    if (!open) {
      setDeleteTarget(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setDeleteLoading(true);
    try {
      await softDeleteOutfit(deleteTarget);
      setRows((prev) => prev.filter((row) => row.outfitId !== deleteTarget.outfitId));
      toast.success("Đã xóa sản phẩm.");
      setDeleteOpen(false);
      setDeleteTarget(null);
    } catch (err) {
      toast.error(toErrorMessage(err, "Xóa sản phẩm thất bại."));
    } finally {
      setDeleteLoading(false);
    }
  };

  const handlePageSizeChange = (value: string) => {
    const parsed = Number(value) as PageSizeOption;
    if (!PAGE_SIZE_OPTIONS.includes(parsed)) return;
    setPageSize(parsed);
    setCurrentPage(1);
  };

  const handleResetFilter = () => {
    setSearchInput("");
    setSearchQuery("");
    setFilterStatus("all");
    setFilterLimited("all");
    setFilterCategory("all");
    setCurrentPage(1);
  };

  return (
    <AdminLayout>
      <TooltipProvider>
        <div className="space-y-6 pb-2">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-2">
              <h1 className="bg-gradient-to-r from-[#c1272d] via-[#d94b51] to-[#d4af37] bg-clip-text text-4xl font-bold text-transparent">
                Quản lý sản phẩm
              </h1>
              <p className="max-w-2xl text-sm text-slate-600 md:text-base">
                Theo dõi danh mục trang phục, tồn kho và trạng thái hiển thị ngay trên một màn hình.
              </p>
              <div className="h-1 w-36 rounded-full bg-gradient-to-r from-[#c1272d] via-[#d4af37] to-transparent" />
            </div>

            <Button
              className="h-11 rounded-lg bg-gradient-to-r from-[#c1272d] to-[#d4af37] px-5 text-white shadow-sm transition hover:from-[#a91f25] hover:to-[#be9727] focus-visible:ring-2 focus-visible:ring-[#c1272d]/40 focus-visible:ring-offset-2"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Thêm sản phẩm
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              const toneClass = statToneClassMap[stat.tone];
              return (
                <Card
                  key={stat.label}
                  className={`border bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${toneClass.cardBorder}`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <div className={`rounded-xl p-3 ${toneClass.iconWrap}`}>
                        <Icon className={`h-5 w-5 ${toneClass.iconColor}`} />
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          {stat.label}
                        </p>
                        <p className="text-2xl font-semibold text-slate-900">
                          {loading ? "--" : stat.value.toLocaleString("vi-VN")}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="border border-slate-200/80 bg-white shadow-sm">
            <CardContent className="space-y-4 p-6">
              <div className="grid grid-cols-1 gap-3 xl:grid-cols-[minmax(0,1.8fr)_repeat(3,minmax(0,1fr))_auto]">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#c1272d]" />
                  <Input
                    placeholder="Tìm theo tên, danh mục hoặc ID sản phẩm..."
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    className="h-10 border-slate-200 pl-10 text-sm focus-visible:border-[#c1272d]/40 focus-visible:ring-[#c1272d]/25"
                  />
                </div>

                <Select
                  value={filterStatus}
                  onValueChange={(value) => setFilterStatus(value as StockFilter)}
                >
                  <SelectTrigger className="h-10 border-slate-200 text-sm focus:ring-[#c1272d]/25">
                    <SelectValue placeholder="Trạng thái kho" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="in-stock">Còn hàng</SelectItem>
                    <SelectItem value="out-of-stock">Hết hàng</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filterLimited}
                  onValueChange={(value) => setFilterLimited(value as LimitedFilter)}
                >
                  <SelectTrigger className="h-10 border-slate-200 text-sm focus:ring-[#c1272d]/25">
                    <SelectValue placeholder="Phiên bản" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả phiên bản</SelectItem>
                    <SelectItem value="limited">Limited</SelectItem>
                    <SelectItem value="non-limited">Không limited</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="h-10 border-slate-200 text-sm focus:ring-[#c1272d]/25">
                    <SelectValue placeholder="Danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả danh mục</SelectItem>
                    {categoryOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  type="button"
                  variant="outline"
                  className="h-10 gap-2 border-[#c1272d]/30 text-[#8b1e1f] hover:bg-[#fff4df] hover:text-[#8b1e1f]"
                  onClick={handleResetFilter}
                  disabled={loading}
                >
                  <Filter className="h-4 w-4" />
                  Xóa lọc
                </Button>
              </div>

              {error ? (
                <div className="flex items-center gap-2 rounded-lg border border-rose-100 bg-rose-50/70 px-3 py-2 text-sm text-rose-700">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  {loading
                    ? "Đang tải danh sách sản phẩm..."
                    : `Đang hiển thị ${filteredRows.length.toLocaleString("vi-VN")} sản phẩm phù hợp.`}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="border border-slate-200/80 bg-white shadow-sm">
            <CardHeader className="border-b border-slate-100 bg-[#fffaf2] pb-4">
              <CardTitle className="text-lg font-semibold text-slate-900">
                Danh sách sản phẩm
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/80">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Sản phẩm
                      </TableHead>
                      <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Danh mục
                      </TableHead>
                      <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Giá thuê
                      </TableHead>
                      <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Số lượng
                      </TableHead>
                      <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Trạng thái
                      </TableHead>
                      <TableHead className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Hành động
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading &&
                      Array.from({ length: Math.min(pageSize, 5) }).map((_, index) => (
                        <TableRow key={`products-loading-${index}`} className="hover:bg-transparent">
                          <TableCell className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Skeleton className="h-12 w-12 rounded-xl bg-[#f6ebd8]" />
                              <div className="space-y-2">
                                <Skeleton className="h-4 w-40 bg-[#f0ddbc]" />
                                <Skeleton className="h-3 w-24 bg-slate-100" />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <Skeleton className="h-4 w-28 bg-slate-100" />
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <Skeleton className="h-4 w-24 bg-slate-100" />
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <Skeleton className="h-4 w-16 bg-slate-100" />
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <Skeleton className="h-6 w-24 rounded-full bg-slate-100" />
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <div className="ml-auto flex w-fit items-center gap-2">
                              <Skeleton className="h-9 w-9 rounded-full bg-slate-100" />
                              <Skeleton className="h-9 w-9 rounded-full bg-slate-100" />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}

                    {!loading && error && (
                      <TableRow>
                        <TableCell colSpan={6} className="px-6 py-12 text-center text-sm text-rose-600">
                          {error}
                        </TableCell>
                      </TableRow>
                    )}

                    {!loading && !error && pagedRows.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="px-6 py-12 text-center">
                          <div className="mx-auto flex max-w-sm flex-col items-center gap-2">
                            <div className="rounded-full bg-[#fdf1db] p-3 text-[#c1272d]">
                              <Package className="h-6 w-6" />
                            </div>
                            <p className="text-sm font-medium text-slate-700">
                              Không có sản phẩm phù hợp.
                            </p>
                            <p className="text-xs text-slate-500">
                              Thử thay đổi bộ lọc hoặc từ khóa để tìm lại dữ liệu.
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}

                    {!loading &&
                      !error &&
                      pagedRows.map((row) => (
                        <TableRow
                          key={row.outfitId}
                          className="border-b border-slate-100 transition-colors hover:bg-[#fff8ea]"
                        >
                          <TableCell className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={row.thumbnailUrl || PLACEHOLDER_IMAGE}
                                alt={row.name}
                                className="h-12 w-12 rounded-xl border border-slate-200 bg-slate-50 object-cover"
                                onError={(event) => {
                                  event.currentTarget.src = PLACEHOLDER_IMAGE;
                                }}
                              />
                              <div>
                                <p className="text-sm font-semibold text-slate-900">
                                  {normalizeVietnameseText(row.name)}
                                </p>
                                <p className="text-xs text-slate-500">ID: #{row.outfitId}</p>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="px-6 py-4 text-sm text-slate-700">
                            {normalizeVietnameseText(row.categoryLabel)}
                          </TableCell>

                          <TableCell className="px-6 py-4 text-sm font-semibold text-slate-900">
                            {formatVnd(row.baseRentalPrice)}
                          </TableCell>

                          <TableCell className="px-6 py-4 text-sm text-slate-700">
                            {row.totalStock.toLocaleString("vi-VN")}
                          </TableCell>

                          <TableCell className="px-6 py-4">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge
                                className={
                                  row.inStock
                                    ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                                    : "border border-rose-200 bg-rose-50 text-rose-700"
                                }
                              >
                                {row.inStock ? "Còn hàng" : "Hết hàng"}
                              </Badge>
                              {row.isLimited && (
                                <Badge className="border border-amber-200 bg-amber-50 text-amber-700">
                                  Limited
                                </Badge>
                              )}
                            </div>
                          </TableCell>

                          <TableCell className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 rounded-full text-slate-500 hover:bg-[#c1272d]/10 hover:text-[#c1272d]"
                                    onClick={() => handleView(row.outfitId)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">Xem chi tiết</TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 rounded-full text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                                    onClick={() => handleRequestDelete(row)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">Xóa sản phẩm</TooltipContent>
                              </Tooltip>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200/80 bg-white shadow-sm">
            <CardContent className="flex flex-col gap-4 p-4 xl:flex-row xl:items-center xl:justify-between">
              <p className="text-sm text-slate-600">
                Đang xem {totalItems ? startIndex + 1 : 0}-{endIndex} / Tổng{" "}
                {totalItems.toLocaleString("vi-VN")} sản phẩm
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-slate-500">Mỗi trang</span>
                <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
                  <SelectTrigger className="h-9 w-[84px] border-slate-200 text-sm focus:ring-[#c1272d]/25">
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
                  className="h-9 gap-1 border-slate-200 text-slate-700 hover:bg-[#fff4df]"
                  disabled={safePage <= 1 || loading}
                  onClick={() => setCurrentPage(1)}
                >
                  <ChevronsLeft className="h-4 w-4" />
                  <span className="hidden md:inline">Đầu</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 gap-1 border-slate-200 text-slate-700 hover:bg-[#fff4df]"
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
                        : "h-9 min-w-[40px] rounded-md border-slate-200 text-slate-700 hover:bg-[#fff4df]"
                    }
                  >
                    {page}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 gap-1 border-slate-200 text-slate-700 hover:bg-[#fff4df]"
                  disabled={safePage >= totalPages || loading}
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                >
                  <span className="hidden md:inline">Sau</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 gap-1 border-slate-200 text-slate-700 hover:bg-[#fff4df]"
                  disabled={safePage >= totalPages || loading}
                  onClick={() => setCurrentPage(totalPages)}
                >
                  <span className="hidden md:inline">Cuối</span>
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <ConfirmDeleteDialog
            open={deleteOpen}
            onOpenChange={handleDeleteOpenChange}
            onConfirm={handleConfirmDelete}
            title="Xóa sản phẩm"
            description="Bạn có chắc chắn muốn xóa sản phẩm này không?"
            loading={deleteLoading}
          />
          <CreateOutfitDialog
            open={createOpen}
            onOpenChange={setCreateOpen}
            regionSuggestions={regionSuggestions}
            onCreated={handleCreatedOutfit}
          />
        </div>
      </TooltipProvider>
    </AdminLayout>
  );
}
