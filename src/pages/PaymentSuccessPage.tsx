import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { CheckCircle2 } from "lucide-react";

export function PaymentSuccessPage() {
  const navigate = useNavigate();

  const orderDataString = localStorage.getItem("lastOrder");
  const orderData = orderDataString ? JSON.parse(orderDataString) : null;

  React.useEffect(() => {
    if (!orderData) return;
    const timer = setTimeout(() => {
      localStorage.removeItem("lastOrder");
    }, 5000);
    return () => clearTimeout(timer);
  }, [orderData]);

  if (!orderData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl text-gray-900 mb-4">
            Không tìm thấy thông tin đơn hàng
          </h1>
          <Button
            onClick={() => navigate("/")}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Về trang chủ
          </Button>
        </div>
      </div>
    );
  }

  const {
    fullName,
    phone,
    email,
    includeRental,
    includePhotoshoot,
    selectedOutfits,
    rentalTotal,
    rentalDeposit,
    rentalDate,
    photoshootTotal,
    photoshootDeposit,
    photoshootDate,
    photoshootTime,
    packageName,
    paymentMethod,
    combinedTotal,
    combinedDeposit,
    address,
    city,
    district,
    ward,
  } = orderData;

  const totalPaid =
    paymentMethod === "coc" ? combinedDeposit : combinedTotal + combinedDeposit;
  const orderNumber = `SV${Date.now().toString().slice(-8)}`;

  return (
    <div className="min-h-screen bg-white">
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1675389017197-9ae63c2b2fe8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYW8lMjBkYWklMjB0cmFkaXRpb25hbCUyMGRyZXNzfGVufDF8fHx8MTc2MTgwNjA4Nnww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Thanh toán thành công"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="inline-block mb-6 relative">
            <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full" />
            <CheckCircle2
              className="w-24 h-24 text-green-500 relative animate-pulse"
              strokeWidth={2}
            />
          </div>
          <h1 className="text-5xl text-white mb-4">Thanh Toán Thành Công</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Cảm ơn bạn đã tin tưởng Sắc Việt. Đơn hàng của bạn đã được ghi nhận.
          </p>
        </div>
      </section>

      <div className="bg-gray-50 py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
              <div>
                <p className="text-sm text-gray-600 mb-1">Mã đơn hàng</p>
                <p className="text-2xl text-gray-900">#{orderNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Trạng thái</p>
                <span className="inline-block px-4 py-2 bg-green-100 text-green-700 rounded-full">
                  Đã thanh toán
                </span>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-red-600 mb-4">Thông Tin Khách Hàng</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Họ và tên</p>
                  <p className="text-gray-900">{fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Số điện thoại</p>
                  <p className="text-gray-900">{phone}</p>
                </div>
                {email && (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="text-gray-900">{email}</p>
                  </div>
                )}
                {includeRental && address && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600 mb-1">Địa chỉ nhận hàng</p>
                    <p className="text-gray-900">
                      {address}, {ward}, {district}, {city}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {includeRental && (
              <div className="mb-6 pb-6 border-t border-gray-200 pt-6">
                <h2 className="text-red-600 mb-4">Chi Tiết Thuê Trang Phục</h2>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Ngày thuê</p>
                  <p className="text-gray-900">{rentalDate}</p>
                </div>

                <div className="space-y-3">
                  {(selectedOutfits || []).map((outfit: any) => (
                    <div
                      key={outfit.id}
                      className="flex gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={outfit.image}
                          alt={outfit.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-gray-900 mb-1">{outfit.name}</h3>
                        <p className="text-sm text-gray-600">{outfit.category}</p>
                        <p className="text-sm text-gray-700 mt-1">
                          <span className="font-medium">Size:</span>{" "}
                          {outfit.selectedSize}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-red-600">
                          {Number(outfit.price || 0).toLocaleString("vi-VN")} ₫
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Chi phí thuê:</span>
                    <span className="text-gray-900">
                      {Number(rentalTotal || 0).toLocaleString("vi-VN")} ₫
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tiền cọc:</span>
                    <span className="text-gray-900">
                      {Number(rentalDeposit || 0).toLocaleString("vi-VN")} ₫
                    </span>
                  </div>
                </div>
              </div>
            )}

            {includePhotoshoot && (
              <div className="mb-6 pb-6 border-t border-gray-200 pt-6">
                <h2 className="text-red-600 mb-4">
                  Chi Tiết Dịch Vụ Makeup + Chụp Ảnh
                </h2>

                {packageName && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-1">Gói dịch vụ</p>
                    <p className="text-gray-900">{packageName}</p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Ngày chụp</p>
                    <p className="text-gray-900">{photoshootDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Giờ chụp</p>
                    <p className="text-gray-900">{photoshootTime}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Chi phí dịch vụ:</span>
                    <span className="text-gray-900">
                      {Number(photoshootTotal || 0).toLocaleString("vi-VN")} ₫
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Cọc 50%:</span>
                    <span className="text-gray-900">
                      {Number(photoshootDeposit || 0).toLocaleString("vi-VN")} ₫
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="border-t-2 border-gray-300 pt-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-900">Tổng chi phí dịch vụ:</span>
                  <span className="text-gray-900 text-xl">
                    {Number(combinedTotal || 0).toLocaleString("vi-VN")} ₫
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-900">Tổng cọc:</span>
                  <span className="text-gray-900 text-xl">
                    {Number(combinedDeposit || 0).toLocaleString("vi-VN")} ₫
                  </span>
                </div>
                <div className="h-px bg-gray-300 my-3" />
                <div className="flex justify-between items-center">
                  <span className="text-gray-900">Đã thanh toán:</span>
                  <span className="text-red-600 text-3xl">
                    {Number(totalPaid || 0).toLocaleString("vi-VN")} ₫
                  </span>
                </div>
                <p className="text-sm text-gray-500 text-right">
                  {paymentMethod === "coc"
                    ? "(Thanh toán cọc)"
                    : "(Thanh toán toàn bộ)"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
            <p className="text-blue-800 mb-3">
              <span className="font-medium">Thông tin quan trọng:</span>
            </p>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>• Nhân viên sẽ liên hệ trong 24h để xác nhận đơn hàng</li>
              {includeRental && (
                <li>
                  • Trang phục sẽ được giao đến địa chỉ của bạn trước ngày thuê 1
                  ngày
                </li>
              )}
              {includePhotoshoot && (
                <li>• Đổi lịch chụp 1 lần miễn phí nếu báo trước 24h</li>
              )}
              <li>• Vui lòng chuẩn bị đúng số tiền khi nhận dịch vụ</li>
              <li>
                • Mã đơn hàng #{orderNumber} đã được gửi đến số điện thoại {phone}
              </li>
            </ul>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              size="lg"
              className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400"
            >
              Về trang chủ
            </Button>
            <Button
              onClick={() => navigate("/bo-suu-tap")}
              size="lg"
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              Xem thêm bộ sưu tập
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
