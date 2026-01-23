import { AdminLayout } from "../../components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import {
  Server,
  Database,
  Mail,
  Bell,
  Shield,
  Zap,
  RefreshCw,
  Download,
} from "lucide-react";

export default function SystemPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">Quản lí hệ thống</h1>
          <p className="text-gray-600">
            Cấu hình và quản lý các thiết lập hệ thống
          </p>
        </div>

        {/* System Status */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Server className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Server</p>
                  <p className="text-sm text-green-600 mt-1">Online</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Database className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Database</p>
                  <p className="text-sm text-green-600 mt-1">Connected</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Performance</p>
                  <p className="text-sm text-blue-600 mt-1">98%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Security</p>
                  <p className="text-sm text-purple-600 mt-1">Enabled</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Configuration Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Email Settings */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-gray-600" />
                <CardTitle>Cấu hình Email</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="smtp-host">SMTP Host</Label>
                <Input id="smtp-host" placeholder="smtp.gmail.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-port">SMTP Port</Label>
                <Input id="smtp-port" placeholder="587" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-from">Email From</Label>
                <Input id="email-from" placeholder="noreply@sacviet.com" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="email-enabled">Kích hoạt Email</Label>
                <Switch id="email-enabled" defaultChecked />
              </div>
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                Lưu cấu hình
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-gray-600" />
                <CardTitle>Cấu hình Thông báo</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Thông báo đơn hàng mới</Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Gửi email khi có đơn hàng mới
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Thông báo thanh toán</Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Gửi email khi thanh toán thành công
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Thông báo hệ thống</Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Cảnh báo lỗi và sự cố hệ thống
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Thông báo marketing</Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Gửi email khuyến mãi và tin tức
                  </p>
                </div>
                <Switch />
              </div>
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                Lưu cấu hình
              </Button>
            </CardContent>
          </Card>

          {/* Payment Settings */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Cấu hình Thanh toán</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Thanh toán COD</Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Cho phép thanh toán khi nhận hàng
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Chuyển khoản ngân hàng</Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Thanh toán qua chuyển khoản
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Thẻ tín dụng/ghi nợ</Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Thanh toán qua cổng payment
                  </p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Ví điện tử</Label>
                  <p className="text-xs text-gray-500 mt-1">
                    MoMo, ZaloPay, VNPay
                  </p>
                </div>
                <Switch />
              </div>
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                Lưu cấu hình
              </Button>
            </CardContent>
          </Card>

          {/* Maintenance */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Bảo trì hệ thống</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Chế độ bảo trì</Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Tạm thời tắt website để bảo trì
                  </p>
                </div>
                <Switch />
              </div>
              <div className="space-y-2">
                <Label>Thông báo bảo trì</Label>
                <Input
                  placeholder="Website đang được bảo trì, vui lòng quay lại sau..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Làm mới Cache
                </Button>
                <Button variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Backup DB
                </Button>
              </div>
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                Khởi động lại hệ thống
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* System Info */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Thông tin hệ thống</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-gray-600 mb-1">Phiên bản</p>
                <p className="text-sm text-gray-900">v1.0.0</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Database</p>
                <p className="text-sm text-gray-900">Supabase PostgreSQL</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Server</p>
                <p className="text-sm text-gray-900">Supabase Edge Functions</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Lần cập nhật cuối</p>
                <p className="text-sm text-gray-900">01/11/2025</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Uptime</p>
                <p className="text-sm text-gray-900">99.9%</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Storage</p>
                <p className="text-sm text-gray-900">2.5 GB / 10 GB</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
