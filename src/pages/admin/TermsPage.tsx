import { useState } from "react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Save, Plus, Edit, Trash2 } from "lucide-react";

export default function TermsPage() {
  const [isEditing, setIsEditing] = useState(false);

  const termsSections = [
    {
      id: 1,
      title: "1. Điều khoản sử dụng dịch vụ",
      content: "Khách hàng khi sử dụng dịch vụ thuê trang phục tại Sắc Việt cần tuân thủ các quy định về thời gian thuê, bảo quản và trả trang phục đúng hạn.",
      updatedAt: "01/11/2025",
    },
    {
      id: 2,
      title: "2. Chính sách thanh toán",
      content: "Khách hàng cần thanh toán đầy đủ phí thuê trước khi nhận trang phục. Chúng tôi chấp nhận thanh toán qua chuyển khoản, thẻ tín dụng hoặc tiền mặt.",
      updatedAt: "01/11/2025",
    },
    {
      id: 3,
      title: "3. Chính sách hoàn trả và bồi thường",
      content: "Trong trường hợp trang phục bị hư hỏng hoặc mất mát, khách hàng sẽ phải bồi thường theo giá trị thực tế của sản phẩm. Chúng tôi có quyền giữ lại tiền đặt cọc nếu có thiệt hại.",
      updatedAt: "01/11/2025",
    },
    {
      id: 4,
      title: "4. Chính sách hủy đơn",
      content: "Khách hàng có thể hủy đơn trước 48 giờ để được hoàn lại 100% tiền cọc. Hủy đơn trong vòng 24-48 giờ sẽ được hoàn 50%. Không hoàn tiền nếu hủy trong vòng 24 giờ.",
      updatedAt: "01/11/2025",
    },
    {
      id: 5,
      title: "5. Quyền riêng tư và bảo mật",
      content: "Sắc Việt cam kết bảo vệ thông tin cá nhân của khách hàng. Mọi thông tin thu thập chỉ được sử dụng cho mục đích cải thiện dịch vụ và không chia sẻ với bên thứ ba.",
      updatedAt: "01/11/2025",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl text-gray-900 mb-2">Điều khoản dịch vụ</h1>
            <p className="text-gray-600">
              Quản lý các điều khoản và chính sách của hệ thống
            </p>
          </div>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Lưu thay đổi
              </>
            ) : (
              <>
                <Edit className="w-4 h-4 mr-2" />
                Chỉnh sửa
              </>
            )}
          </Button>
        </div>

        {/* Terms Sections */}
        <div className="space-y-4">
          {termsSections.map((section) => (
            <Card key={section.id} className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {isEditing ? (
                      <Input
                        defaultValue={section.title}
                        className="text-lg mb-2"
                      />
                    ) : (
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Cập nhật lần cuối: {section.updatedAt}
                    </p>
                  </div>
                  {isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    defaultValue={section.content}
                    rows={4}
                    className="resize-none"
                  />
                ) : (
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {section.content}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add New Section */}
        {isEditing && (
          <Card className="border-2 border-dashed border-gray-300 bg-gray-50">
            <CardContent className="p-8">
              <button className="w-full flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-red-600 transition-colors">
                <Plus className="w-8 h-8" />
                <span className="text-sm">Thêm điều khoản mới</span>
              </button>
            </CardContent>
          </Card>
        )}

        {/* Additional Policies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Chính sách vận chuyển</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-600 mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">Miễn phí vận chuyển</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Cho đơn hàng trên 2,000,000đ trong nội thành
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-600 mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">Giao hàng nhanh</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Trong vòng 2-4 giờ cho khu vực nội thành
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-600 mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">Thu hồi miễn phí</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Đến tận nơi sau khi kết thúc sự kiện
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Chính sách bảo quản</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-600 mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">Vệ sinh chuyên nghiệp</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Tất cả trang phục được giặt ủi cẩn thận trước khi giao
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-600 mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">Kiểm tra chất lượng</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Đảm bảo trang phục không có khuyết điểm khi giao
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-red-600 mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">Bảo quản đúng cách</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Hướng dẫn chi tiết cách bảo quản trong thời gian thuê
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
