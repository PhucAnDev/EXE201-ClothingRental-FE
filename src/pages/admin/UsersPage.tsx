import { useState } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Search, Edit, Trash2, Shield } from "lucide-react";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const users = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "nguyenvana@gmail.com",
      phone: "0901234567",
      role: "customer",
      status: "active",
      orders: 5,
      joinDate: "15/01/2024",
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "tranthib@gmail.com",
      phone: "0912345678",
      role: "customer",
      status: "active",
      orders: 3,
      joinDate: "20/01/2024",
    },
    {
      id: 3,
      name: "Administrator",
      email: "Admin@gmail.com",
      phone: "0000000000",
      role: "admin",
      status: "active",
      orders: 0,
      joinDate: "01/01/2024",
    },
    {
      id: 4,
      name: "Lê Văn C",
      email: "levanc@gmail.com",
      phone: "0923456789",
      role: "customer",
      status: "inactive",
      orders: 0,
      joinDate: "25/01/2024",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-gray-900 mb-2">Quản lí người dùng</h1>
            <p className="text-gray-600">
              Quản lý tất cả người dùng trong hệ thống
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Tổng người dùng</p>
              <p className="text-2xl text-gray-900 mt-1">{users.length}</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Khách hàng</p>
              <p className="text-2xl text-gray-900 mt-1">
                {users.filter((u) => u.role === "customer").length}
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Quản trị viên</p>
              <p className="text-2xl text-gray-900 mt-1">
                {users.filter((u) => u.role === "admin").length}
              </p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Đang hoạt động</p>
              <p className="text-2xl text-gray-900 mt-1">
                {users.filter((u) => u.status === "active").length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm người dùng..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">Lọc</Button>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs text-gray-600">
                      Người dùng
                    </th>
                    <th className="px-6 py-4 text-left text-xs text-gray-600">
                      Liên hệ
                    </th>
                    <th className="px-6 py-4 text-left text-xs text-gray-600">
                      Vai trò
                    </th>
                    <th className="px-6 py-4 text-left text-xs text-gray-600">
                      Đơn thuê
                    </th>
                    <th className="px-6 py-4 text-left text-xs text-gray-600">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-left text-xs text-gray-600">
                      Ngày tham gia
                    </th>
                    <th className="px-6 py-4 text-right text-xs text-gray-600">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-red-100 text-red-600">
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500">ID: #{user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{user.email}</p>
                        <p className="text-xs text-gray-500">{user.phone}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={user.role === "admin" ? "default" : "secondary"}
                          className={
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-700 hover:bg-purple-100"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                          }
                        >
                          {user.role === "admin" ? (
                            <Shield className="w-3 h-3 mr-1" />
                          ) : null}
                          {user.role === "admin" ? "Quản trị viên" : "Khách hàng"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{user.orders}</p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={user.status === "active" ? "default" : "secondary"}
                          className={
                            user.status === "active"
                              ? "bg-green-100 text-green-700 hover:bg-green-100"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                          }
                        >
                          {user.status === "active" ? "Hoạt động" : "Không hoạt động"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-900">{user.joinDate}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            disabled={user.role === "admin"}
                          >
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
            Hiển thị 1-{users.length} của {users.length} người dùng
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
