import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Checkbox } from "../components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { QRCodeSVG } from "qrcode.react";

export function CheckoutPage() {
  // Service Type - can select both
  const [includeRental, setIncludeRental] = useState(true);
  const [includePhotoshoot, setIncludePhotoshoot] = useState(false);

  // Rental states
  const [rentalPackage, setRentalPackage] = useState("1-ngay");

  // Photoshoot states
  const [photoshootDate, setPhotoshootDate] = useState("");
  const [photoshootTime, setPhotoshootTime] = useState("");
  const [location, setLocation] = useState("trong-q9");
  const [extraLook, setExtraLook] = useState(false);
  const [fancyHair, setFancyHair] = useState(false);
  const [extraPhotos, setExtraPhotos] = useState(false);
  const [rushDelivery, setRushDelivery] = useState(false);

  // Common states
  const [paymentMethod, setPaymentMethod] = useState("coc");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [rentalDate, setRentalDate] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  
  // Payment dialog state
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  // Mock data for the order
  const orderItem = {
    name: "Váy Dạ Hội Đỏ",
    status: "Hiện đại",
    image: "https://images.unsplash.com/photo-1700721154874-78695c314eed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYW8lMjBkYWklMjB0cmFkaXRpb25hbHxlbnwxfHx8fDE3NjE4MDc4NDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  };

  const rentalPrices = {
    "1-ngay": { daily: 139000, deposit: 500000 },
    "3-ngay": { daily: 339000, deposit: 500000 },
  };

  // Calculate photoshoot total
  const calculatePhotoshootTotal = () => {
    let total = 999000; // Base price
    
    // Note: Location fee for "ngoai-q9" will be calculated by staff after contact

    // Add-ons
    if (extraLook) total += 199000;
    if (fancyHair) total += 99000;
    if (extraPhotos) total += 149000;
    if (rushDelivery) total += 149000;

    return total;
  };

  const selectedRentalPrice = includeRental ? rentalPrices[rentalPackage as keyof typeof rentalPrices] : null;
  const rentalTotal = selectedRentalPrice?.daily || 0;
  const rentalDeposit = selectedRentalPrice?.deposit || 0;

  const photoshootTotal = includePhotoshoot ? calculatePhotoshootTotal() : 0;
  const photoshootDeposit = includePhotoshoot ? Math.round(photoshootTotal * 0.5) : 0;

  const combinedTotal = rentalTotal + photoshootTotal;
  const combinedDeposit = rentalDeposit + photoshootDeposit;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!includeRental && !includePhotoshoot) {
      alert("Vui lòng chọn ít nhất một dịch vụ");
      return;
    }
    
    // Show payment dialog
    setShowPaymentDialog(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1675389017197-9ae63c2b2fe8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYW8lMjBkYWklMjB0cmFkaXRpb25hbCUyMGRyZXNzfGVufDF8fHx8MTc2MTgwNjA4Nnww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Thanh toán trang phục truyền thống"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h1 className="text-5xl text-white mb-4">
            Thanh Toán
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Hoàn tất đơn hàng của bạn để trải nghiệm vẻ đẹp truyền thống Việt Nam
          </p>
        </div>
      </section>

      <div className="bg-gray-50 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Order Summary */}
            <div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sticky top-24">
                <h2 className="text-red-600 mb-6">Tóm Tắt Đơn Hàng</h2>

                {/* Rental Section */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <Checkbox
                      id="includeRental"
                      checked={includeRental}
                      onCheckedChange={(checked) => setIncludeRental(checked as boolean)}
                    />
                    <Label htmlFor="includeRental" className="text-gray-900 cursor-pointer">
                      Thuê Trang Phục
                    </Label>
                  </div>

                  {includeRental && (
                    <div className="ml-7 space-y-4">
                      {/* Product Item */}
                      <div className="flex gap-4 pb-4 border-b border-gray-100">
                        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                          <ImageWithFallback
                            src={orderItem.image}
                            alt={orderItem.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-gray-900 mb-1">{orderItem.name}</h3>
                          <p className="text-sm text-gray-600">{orderItem.status}</p>
                        </div>
                      </div>

                      {/* Rental Package Selection */}
                      <div>
                        <Label className="text-gray-700 mb-2 block text-sm">Chọn Gói Thuê</Label>
                        <Select value={rentalPackage} onValueChange={setRentalPackage}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-ngay">Gói 1 Ngày - 139.000 ₫</SelectItem>
                            <SelectItem value="3-ngay">Gói 3 Ngày - 339.000 ₫</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Rental Price */}
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Chi phí thuê:</span>
                          <span className="text-gray-900">{rentalTotal.toLocaleString("vi-VN")} ₫</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Tiền cọc:</span>
                          <span className="text-gray-900">{rentalDeposit.toLocaleString("vi-VN")} ₫</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Photoshoot Section */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <Checkbox
                      id="includePhotoshoot"
                      checked={includePhotoshoot}
                      onCheckedChange={(checked) => setIncludePhotoshoot(checked as boolean)}
                    />
                    <Label htmlFor="includePhotoshoot" className="text-gray-900 cursor-pointer">
                      Makeup + Chụp Ảnh
                    </Label>
                  </div>

                  {includePhotoshoot && (
                    <div className="ml-7 space-y-4">
                      <p className="text-sm text-gray-600">Không bao gồm thuê đồ</p>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-600">Makeup + tóc cơ bản 1 look</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-600">Chụp 1 địa điểm (trong Q9)</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-600">Full ảnh gốc + 10 ảnh chỉnh màu</span>
                        </div>
                      </div>

                      {/* Location Selection */}
                      <div>
                        <Label className="text-gray-700 mb-2 block text-sm">Địa Điểm Chụp</Label>
                        <Select value={location} onValueChange={setLocation}>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="trong-q9">Trong Q9 (Miễn phí)</SelectItem>
                            <SelectItem value="ngoai-q9">Ngoài Q9 (+10k/km)</SelectItem>
                          </SelectContent>
                        </Select>

                        {location === "ngoai-q9" && (
                          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <p className="text-sm text-amber-800">
                              📍 Phụ phí di chuyển: 10.000đ/km (tính 1 chiều từ Q9)
                            </p>
                            <p className="text-xs text-amber-600 mt-1">
                              Nhân viên sẽ liên hệ để xác nhận khoảng cách và phụ phí chính xác
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Add-ons */}
                      <div className="space-y-2">
                        <Label className="text-gray-700 block text-sm">Tùy Chọn Nâng Cấp</Label>
                        
                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="extraLook"
                            checked={extraLook}
                            onCheckedChange={(checked) => setExtraLook(checked as boolean)}
                          />
                          <div className="flex-1">
                            <label htmlFor="extraLook" className="text-sm cursor-pointer text-gray-700">
                              Thêm 1 look (+199k)
                            </label>
                          </div>
                        </div>

                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="fancyHair"
                            checked={fancyHair}
                            onCheckedChange={(checked) => setFancyHair(checked as boolean)}
                          />
                          <div className="flex-1">
                            <label htmlFor="fancyHair" className="text-sm cursor-pointer text-gray-700">
                              Tóc cầu kỳ/đính phụ kiện (+99k)
                            </label>
                          </div>
                        </div>

                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="extraPhotos"
                            checked={extraPhotos}
                            onCheckedChange={(checked) => setExtraPhotos(checked as boolean)}
                          />
                          <div className="flex-1">
                            <label htmlFor="extraPhotos" className="text-sm cursor-pointer text-gray-700">
                              Thêm 5 ảnh chỉnh (+149k)
                            </label>
                          </div>
                        </div>

                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="rushDelivery"
                            checked={rushDelivery}
                            onCheckedChange={(checked) => setRushDelivery(checked as boolean)}
                          />
                          <div className="flex-1">
                            <label htmlFor="rushDelivery" className="text-sm cursor-pointer text-gray-700">
                              Giao file gấp 24h (+149k)
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Photoshoot Price */}
                      <div className="space-y-2 text-sm pt-3 border-t border-gray-100">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Chi phí dịch vụ:</span>
                          <span className="text-gray-900">{photoshootTotal.toLocaleString("vi-VN")} ₫</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Cọc 50%:</span>
                          <span className="text-gray-900">{photoshootDeposit.toLocaleString("vi-VN")} ₫</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Total to Pay */}
                <div className="space-y-3">
                  {(includeRental || includePhotoshoot) && (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-900">Tổng Chi Phí:</span>
                        <span className="text-gray-900">
                          {combinedTotal.toLocaleString("vi-VN")} ₫
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-900">Tổng Cọc:</span>
                        <span className="text-red-600">
                          {combinedDeposit.toLocaleString("vi-VN")} ₫
                        </span>
                      </div>
                      <div className="h-px bg-gray-200 my-3"></div>
                    </>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-900">Tổng Thanh Toán:</span>
                    <span className="text-red-600 text-2xl">
                      {paymentMethod === "coc"
                        ? combinedDeposit.toLocaleString("vi-VN")
                        : (combinedTotal + combinedDeposit).toLocaleString("vi-VN")}{" "}
                      ₫
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

            {/* Right Column - Customer Information */}
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-red-600 mb-6">Thông Tin Khách Hàng</h2>

                <div className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <Label htmlFor="fullName" className="text-gray-700 mb-2 block">
                      Họ và Tên
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="border-gray-300"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <Label htmlFor="phone" className="text-gray-700 mb-2 block">
                      Số Điện Thoại
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="border-gray-300"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email" className="text-gray-700 mb-2 block">
                      Email (Không bắt buộc)
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-gray-300"
                    />
                  </div>
                </div>
              </div>

              {/* Rental Date & Address - Only if rental is selected */}
              {includeRental && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                  <h2 className="text-red-600 mb-6">Thông Tin Thuê Đồ</h2>

                  <div className="space-y-4">
                    {/* Rental Date */}
                    <div>
                      <Label htmlFor="rentalDate" className="text-gray-700 mb-2 block">
                        Ngày Nhận Đồ
                      </Label>
                      <Input
                        id="rentalDate"
                        type="date"
                        value={rentalDate}
                        onChange={(e) => setRentalDate(e.target.value)}
                        required
                        className="border-gray-300"
                      />
                    </div>

                    {/* Street Address */}
                    <div>
                      <Label htmlFor="address" className="text-gray-700 mb-2 block">
                        Địa chỉ cụ thể
                      </Label>
                      <Textarea
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Số nhà, tên đường..."
                        required
                        rows={3}
                        className="border-gray-300"
                      />
                    </div>

                    {/* City */}
                    <div>
                      <Label htmlFor="city" className="text-gray-700 mb-2 block">
                        Tỉnh/Thành phố
                      </Label>
                      <Input
                        id="city"
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="TP. Hồ Chí Minh"
                        required
                        className="border-gray-300"
                      />
                    </div>

                    {/* District */}
                    <div>
                      <Label htmlFor="district" className="text-gray-700 mb-2 block">
                        Quận/Huyện
                      </Label>
                      <Input
                        id="district"
                        type="text"
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        placeholder="Quận 1"
                        required
                        className="border-gray-300"
                      />
                    </div>

                    {/* Ward */}
                    <div>
                      <Label htmlFor="ward" className="text-gray-700 mb-2 block">
                        Phường/Xã
                      </Label>
                      <Input
                        id="ward"
                        type="text"
                        value={ward}
                        onChange={(e) => setWard(e.target.value)}
                        placeholder="Phường Bến Nghé"
                        required
                        className="border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Photoshoot Date & Time - Only if photoshoot is selected */}
              {includePhotoshoot && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                  <h2 className="text-red-600 mb-6">Thông Tin Buổi Chụp</h2>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="photoshootDate" className="text-gray-700 mb-2 block">
                        Ngày Chụp
                      </Label>
                      <Input
                        id="photoshootDate"
                        type="date"
                        value={photoshootDate}
                        onChange={(e) => setPhotoshootDate(e.target.value)}
                        required
                        className="border-gray-300"
                      />
                    </div>
                    <div>
                      <Label htmlFor="photoshootTime" className="text-gray-700 mb-2 block">
                        Giờ Chụp
                      </Label>
                      <Input
                        id="photoshootTime"
                        type="time"
                        value={photoshootTime}
                        onChange={(e) => setPhotoshootTime(e.target.value)}
                        required
                        className="border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Method */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-red-600 mb-6">Phương Thức Thanh Toán</h2>

                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="space-y-4">
                    {/* Deposit Payment */}
                    <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <RadioGroupItem value="coc" id="coc" className="mt-1" />
                      <div className="flex-1">
                        <Label
                          htmlFor="coc"
                          className="text-gray-900 cursor-pointer block mb-1"
                        >
                          Thanh toán cọc
                        </Label>
                        <p className="text-sm text-gray-600">
                          Đặt cọc {combinedDeposit.toLocaleString("vi-VN")} ₫, thanh toán phần còn lại sau
                        </p>
                      </div>
                    </div>

                    {/* Full Payment */}
                    <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <RadioGroupItem value="full" id="full" className="mt-1" />
                      <div className="flex-1">
                        <Label
                          htmlFor="full"
                          className="text-gray-900 cursor-pointer block mb-1"
                        >
                          Thanh toán toàn bộ
                        </Label>
                        <p className="text-sm text-gray-600">
                          Thanh toán ngay {(combinedTotal + combinedDeposit).toLocaleString("vi-VN")} ₫
                        </p>
                      </div>
                    </div>
                  </div>
                </RadioGroup>

                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💳 Thanh toán khi nhận dịch vụ
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    {includePhotoshoot && "Đổi lịch chụp 1 lần miễn phí nếu báo trước 24h. "}
                    Vui lòng chuẩn bị đúng số tiền
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full bg-red-600 hover:bg-red-700 text-white h-14"
              >
                Xác Nhận Đặt Hàng
              </Button>
            </div>
          </div>
        </form>
        </div>
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-red-600">Thanh Toán Đơn Hàng</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Họ và tên:</span>
                <span className="text-gray-900">{fullName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Số điện thoại:</span>
                <span className="text-gray-900">{phone}</span>
              </div>
              {includeRental && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Thuê trang phục:</span>
                  <span className="text-gray-900">{rentalTotal.toLocaleString("vi-VN")} ₫</span>
                </div>
              )}
              {includePhotoshoot && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Makeup + Chụp ảnh:</span>
                  <span className="text-gray-900">{photoshootTotal.toLocaleString("vi-VN")} ₫</span>
                </div>
              )}
              
              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-900">Tổng thanh toán:</span>
                  <span className="text-red-600 text-xl">
                    {paymentMethod === "coc"
                      ? combinedDeposit.toLocaleString("vi-VN")
                      : (combinedTotal + combinedDeposit).toLocaleString("vi-VN")}{" "}
                    ₫
                  </span>
                </div>
                <p className="text-xs text-gray-500 text-right mt-1">
                  {paymentMethod === "coc" ? "(Thanh toán cọc)" : "(Thanh toán toàn bộ)"}
                </p>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center space-y-3">
              <div className="bg-white p-4 rounded-xl border-2 border-gray-200 shadow-sm">
                <QRCodeSVG
                  value={`SACVIET-ORDER-${Date.now()}-${fullName}-${paymentMethod === "coc" ? combinedDeposit : (combinedTotal + combinedDeposit)}`}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
              <p className="text-sm text-gray-600 text-center">
                Quét mã QR để thanh toán qua ví điện tử
              </p>
            </div>

            {/* Payment Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 mb-2">
                💳 Hướng dẫn thanh toán:
              </p>
              <ul className="text-xs text-blue-600 space-y-1">
                <li>• Mở ứng dụng ngân hàng/ví điện tử</li>
                <li>• Quét mã QR phía trên</li>
                <li>• Xác nhận số tiền và hoàn tất thanh toán</li>
                <li>• Nhân viên sẽ liên hệ xác nhận trong 24h</li>
              </ul>
            </div>

            {/* Close Button */}
            <Button
              onClick={() => setShowPaymentDialog(false)}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
