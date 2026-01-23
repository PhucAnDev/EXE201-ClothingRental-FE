import { useState } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const products = [
    {
      id: 1,
      name: "Áo dài cách tân hoa sen",
      category: "Áo dài cách tân",
      price: "2,500,000đ",
      stock: 5,
      status: "Còn hàng",
      image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&h=400&fit=crop",
    },
    {
      id: 2,
      name: "Áo dài truyền thống đỏ",
      category: "Áo dài truyền thống",
      price: "3,000,000đ",
      stock: 3,
      status: "Còn hàng",
      image: "https://images.unsplash.com/photo-1544441892-794166f1e3be?w=400&h=400&fit=crop",
    },
    {
      id: 3,
      name: "Áo dài cưới vàng kim",
      category: "Áo dài cưới",
      price: "5,000,000đ",
      stock: 0,
      status: "Hết hàng",
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop",
    },
    {
      id: 4,
      name: "Áo dài tứ thân xanh",
      category: "Áo dài tứ thân",
      price: "4,500,000đ",
      stock: 2,
      status: "Còn hàng",
      image: "https://images.unsplash.com/photo-1610652490934-2c814a7b6f4f?w=400&h=400&fit=crop",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-gray-900 mb-2">Quản lí sản phẩm</h1>
            <p className="text-gray-600">
              Quản lý toàn bộ sản phẩm trong hệ thống
            </p>
          </div>
          <Button className="bg-red-600 hover:bg-red-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Thêm sản phẩm
          </Button>
        </div>

        {/* Search and Filter */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">Lọc</Button>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs text-gray-600">
                      Sản phẩm
                    </th>
                    <th className="px-6 py-4 text-left text-xs text-gray-600">
                      Danh mục
                    </th>
                    <th className="px-6 py-4 text-left text-xs text-gray-600">
                      Giá thuê
                    </th>
                    <th className="px-6 py-4 text-left text-xs text-gray-600">
                      Số lượng
                    </th>
                    <th className="px-6 py-4 text-left text-xs text-gray-600">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-right text-xs text-gray-600">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <p className="text-sm text-gray-900">{product.name}</p>
                            <p className="text-xs text-gray-500">ID: #{product.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{product.category}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{product.price}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{product.stock}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={product.stock > 0 ? "default" : "destructive"}
                          className={
                            product.stock > 0
                              ? "bg-green-100 text-green-700 hover:bg-green-100"
                              : ""
                          }
                        >
                          {product.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Hiển thị 1-4 của 4 sản phẩm
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Trước
            </Button>
            <Button variant="outline" size="sm" disabled>
              Sau
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
