import { useEffect, useMemo, useState } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Package,
  CheckCircle,
  XCircle,
  Filter,
} from "lucide-react";

const products = [
  {
    id: 1,
    name: "Áo dài cách tân hoa sen",
    category: "Áo dài cách tân",
    price: "2,500,000đ",
    stock: 5,
    image:
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&h=400&fit=crop",
  },
  {
    id: 2,
    name: "Áo dài truyền thống đỏ",
    category: "Áo dài truyền thống",
    price: "3,000,000đ",
    stock: 3,
    image:
      "https://images.unsplash.com/photo-1544441892-794166f1e3be?w=400&h=400&fit=crop",
  },
  {
    id: 3,
    name: "Áo dài cưới vàng kim",
    category: "Áo dài cưới",
    price: "5,000,000đ",
    stock: 0,
    image:
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop",
  },
  {
    id: 4,
    name: "Áo dài tứ thân xanh",
    category: "Áo dài tứ thân",
    price: "4,500,000đ",
    stock: 2,
    image:
      "https://images.unsplash.com/photo-1610652490934-2c814a7b6f4f?w=400&h=400&fit=crop",
  },
];

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return products;
    return products.filter((product) => {
      const haystack = [
        product.name,
        product.category,
        String(product.id),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredProducts.length);
  const pagedProducts = filteredProducts.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const inStockCount = products.filter((product) => product.stock > 0).length;
  const outOfStockCount = products.filter((product) => product.stock === 0).length;
  const categoryCount = new Set(products.map((product) => product.category)).size;

  const stats = [
    {
      label: "Tổng sản phẩm",
      value: products.length,
      icon: Package,
      color: "bg-blue-500",
    },
    {
      label: "Còn hàng",
      value: inStockCount,
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      label: "Hết hàng",
      value: outOfStockCount,
      icon: XCircle,
      color: "bg-red-500",
    },
    {
      label: "Danh mục",
      value: categoryCount,
      icon: Filter,
      color: "bg-yellow-500",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-display font-bold bg-gradient-to-r from-[#c1272d] to-[#d4af37] bg-clip-text text-transparent mb-2">
              Quản lý sản phẩm
            </h1>
            <p className="text-gray-600">
              Quản lý toàn bộ sản phẩm trong hệ thống
            </p>
          </div>
          <Button className="bg-gradient-to-r from-[#c1272d] to-[#d4af37] text-white hover:from-[#b11f25] hover:to-[#c39d2f]">
            <Plus className="w-4 h-4 mr-2" />
            Thêm sản phẩm
          </Button>
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

        {/* Search and Filter */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Lọc
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Danh sách sản phẩm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Sản phẩm
                    </TableHead>
                    <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Danh mục
                    </TableHead>
                    <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Giá thuê
                    </TableHead>
                    <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Số lượng
                    </TableHead>
                    <TableHead className="px-6 py-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Trạng thái
                    </TableHead>
                    <TableHead className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Hành động
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pagedProducts.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="px-6 py-8 text-center text-sm text-gray-500"
                      >
                        Không có sản phẩm phù hợp.
                      </TableCell>
                    </TableRow>
                  )}
                  {pagedProducts.map((product) => {
                    const inStock = product.stock > 0;
                    return (
                      <TableRow key={product.id} className="hover:bg-gray-50">
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {product.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                ID: #{product.id}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <p className="text-sm text-gray-900">
                            {product.category}
                          </p>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <p className="text-sm font-semibold text-gray-900">
                            {product.price}
                          </p>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <p className="text-sm text-gray-900">
                            {product.stock}
                          </p>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <Badge
                            className={
                              inStock
                                ? "bg-green-100 text-green-800 border-green-200"
                                : "bg-red-100 text-red-800 border-red-200"
                            }
                          >
                            {inStock ? "Còn hàng" : "Hết hàng"}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 rounded-full text-gray-500 hover:text-[#c1272d] hover:bg-[#c1272d]/10"
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
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <p className="text-sm text-gray-600">
            Hiển thị {filteredProducts.length ? startIndex + 1 : 0}-{endIndex}{" "}
            của {filteredProducts.length} sản phẩm
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              Trang {safePage}/{totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={safePage <= 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            >
              Trước
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={safePage >= totalPages}
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
            >
              Sau
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
