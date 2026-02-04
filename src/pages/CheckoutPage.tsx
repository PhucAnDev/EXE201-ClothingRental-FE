import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
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
import { Plus, X } from "lucide-react";

// Available outfits for selection
const availableOutfits = [
  {
    id: 1,
    name: "Váy Dạ Hội Đỏ",
    category: "Hiện đại",
    price: 139000,
    deposit: 500000,
    image: "https://images.unsplash.com/photo-1700721154874-78695c314eed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYW8lMjBkYWklMjB0cmFkaXRpb25hbHxlbnwxfHx8fDE3NjE4MDc4NDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    sizes: [
      { size: "S", stock: 3 },
      { size: "M", stock: 5 },
      { size: "L", stock: 2 },
      { size: "XL", stock: 0 },
    ],
  },
  {
    id: 2,
    name: "Áo Dài Trắng Truyền Thống",
    category: "Truyền thống",
    price: 149000,
    deposit: 500000,
    image: "https://images.unsplash.com/photo-1763906803701-96b843a43961?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYW8lMjBkYWklMjB0cmFkaHRpb25hbCUyMGRyZXNzJTIwZWxlZ2FudHxlbnwxfHx8fDE3Njk4NzM3MTd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    sizes: [
      { size: "S", stock: 4 },
      { size: "M", stock: 6 },
      { size: "L", stock: 3 },
      { size: "XL", stock: 1 },
    ],
  },
  {
    id: 3,
    name: "Áo Dài Đỏ Cách Tân",
    category: "Hiện đại",
    price: 159000,
    deposit: 500000,
    image: "https://images.unsplash.com/photo-1760410179893-f5609f3e22f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtJTIwdHJhZGl0aW9uYWwlMjBjbG90aGluZyUyMHJlZCUyMGRyZXNzfGVufDF8fHx8MTc2OTg3MzcxN3ww&ixlib=rb-4.1.0&q=80&w=1080",
    sizes: [
      { size: "S", stock: 2 },
      { size: "M", stock: 4 },
      { size: "L", stock: 5 },
      { size: "XL", stock: 2 },
    ],
  },
  {
    id: 4,
    name: "Áo Dài Hoa Sen",
    category: "Truyền thống",
    price: 169000,
    deposit: 500000,
    image: "https://images.unsplash.com/photo-1765375751816-cdf3fe2ecf21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHRyYWRpdGlvbmFsJTIwZHJlc3MlMjBtb2Rlcm4lMjBzdHlsZXxlbnwxfHx8fDE3Njk4NzM3MTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    sizes: [
      { size: "S", stock: 3 },
      { size: "M", stock: 7 },
      { size: "L", stock: 4 },
      { size: "XL", stock: 0 },
    ],
  },
  {
    id: 5,
    name: "Váy Cưới Áo Dài",
    category: "Cưới hỏi",
    price: 199000,
    deposit: 800000,
    image: "https://images.unsplash.com/photo-1675389017197-9ae63c2b2fe8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYW8lMjBkYWklMjB0cmFkaXRpb25hbCUyMGRyZXNzfGVufDF8fHx8MTc2MTgwNjA4Nnww&ixlib=rb-4.1.0&q=80&w=1080",
    sizes: [
      { size: "S", stock: 1 },
      { size: "M", stock: 3 },
      { size: "L", stock: 2 },
      { size: "XL", stock: 1 },
    ],
  },
  {
    id: 6,
    name: "Áo Tứ Thân Hoàng Gia",
    category: "Truyền thống",
    price: 179000,
    deposit: 600000,
    image: "https://images.unsplash.com/photo-1700721154874-78695c314eed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYW8lMjBkYWklMjB0cmFkaXRpb25hbHxlbnwxfHx8fDE3NjE4MDc4NDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    sizes: [
      { size: "S", stock: 2 },
      { size: "M", stock: 5 },
      { size: "L", stock: 3 },
      { size: "XL", stock: 1 },
    ],
  },
];

// Photography package data (matching ServicesPage)
const photographyPackages = {
  "photo-basic": {
    name: "Gói Cơ Bản",
    price: 999000,
    features: [
      "Makeup + tóc cơ bản 1 look",
      "Chụp 1 địa điểm (trong Q9)",
      "Full ảnh gốc + 10 ảnh chỉnh màu",
    ],
  },
  "photo-standard": {
    name: "Gói Tiêu Chuẩn",
    price: 1499000,
    features: [
      "Makeup + tóc chuyên nghiệp 1 look",
      "Chụp 1-2 địa điểm (trong Q9)",
      "Full ảnh gốc + 20 ảnh chỉnh màu",
      "Tư vấn concept & tạo dáng",
    ],
  },
  "photo-premium": {
    name: "Gói Cao Cấp",
    price: 2499000,
    features: [
      "Makeup + tóc chuyên nghiệp 2 look",
      "Chụp 2-3 địa điểm (trong & ngoài Q9)",
      "Full ảnh gốc + 40 ảnh chỉnh màu cao cấp",
      "Concept độc quyền + phụ kiện trang trí",
      "Album online + slideshow video",
    ],
  },
  "photo-vip": {
    name: "Gói VIP",
    price: 4999000,
    features: [
      "Makeup artist nổi tiếng + 3 look độc quyền",
      "Chụp không giới hạn địa điểm (cả ngày)",
      "Full ảnh RAW + 80 ảnh chỉnh màu cao cấp",
      "Video behind the scenes chuyên nghiệp",
      "Album ảnh in cao cấp + khung ảnh canvas",
      "Stylist tư vấn concept & outfit riêng",
    ],
  },
};

export function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const packageId = searchParams.get("package");

  // Service Type - can select both
  const [includeRental, setIncludeRental] = useState(!packageId);
  const [includePhotoshoot, setIncludePhotoshoot] = useState(!!packageId);
  const [selectedPackage, setSelectedPackage] = useState(packageId || null);

  // Rental states - now includes size
  const [rentalPackage, setRentalPackage] = useState("1-ngay");
  const [selectedOutfits, setSelectedOutfits] = useState([
    { ...availableOutfits[0], selectedSize: "M" }
  ]); // Array of outfits with selected size

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
  
  // Outfit selection dialog state
  const [showOutfitDialog, setShowOutfitDialog] = useState(false);
  
  // Outfit detail dialog state
  const [showOutfitDetailDialog, setShowOutfitDetailDialog] = useState(false);
  const [selectedOutfitDetail, setSelectedOutfitDetail] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null); // For size selection in detail dialog

  const rentalPrices = {
    "1-ngay": { daily: 139000, deposit: 500000 },
    "3-ngay": { daily: 339000, deposit: 500000 },
  };

  // Calculate photoshoot total
  const calculatePhotoshootTotal = () => {
    if (selectedPackage && photographyPackages[selectedPackage]) {
      return photographyPackages[selectedPackage].price;
    }
    
    let total = 999000;
    if (extraLook) total += 199000;
    if (fancyHair) total += 99000;
    if (extraPhotos) total += 149000;
    if (rushDelivery) total += 149000;
    return total;
  };

  const selectedPackageInfo = selectedPackage && photographyPackages[selectedPackage] 
    ? photographyPackages[selectedPackage] 
    : null;

  // Add outfit to selected list WITH SIZE
  const handleAddOutfitWithSize = (outfit, size) => {
    if (!selectedOutfits.find(o => o.id === outfit.id)) {
      setSelectedOutfits([...selectedOutfits, { ...outfit, selectedSize: size }]);
    }
    setShowOutfitDetailDialog(false);
    setShowOutfitDialog(false);
    setSelectedSize(null); // Reset size selection
  };

  // Remove outfit from selected list
  const handleRemoveOutfit = (outfitId) => {
    if (selectedOutfits.length > 1) {
      setSelectedOutfits(selectedOutfits.filter(o => o.id !== outfitId));
    }
  };

  // Calculate total rental price for all outfits
  const calculateTotalRentalPrice = () => {
    return selectedOutfits.reduce((total, outfit) => total + outfit.price, 0);
  };

  // Calculate total deposit for all outfits
  const calculateTotalDeposit = () => {
    return Math.max(...selectedOutfits.map(o => o.deposit));
  };

  const rentalTotal = includeRental ? calculateTotalRentalPrice() : 0;
  const rentalDeposit = includeRental ? calculateTotalDeposit() : 0;

  const photoshootTotal = includePhotoshoot ? calculatePhotoshootTotal() : 0;
  const photoshootDeposit = includePhotoshoot ? Math.round(photoshootTotal * 0.5) : 0;

  const combinedTotal = rentalTotal + photoshootTotal;
  const combinedDeposit = rentalDeposit + photoshootDeposit;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!includeRental && !includePhotoshoot) {
      alert("Vui lòng chọn ít nhất một dịch vụ");
      return;
    }
    setShowPaymentDialog(true);
  };

  // Reset size when opening detail dialog
  useEffect(() => {
    if (showOutfitDetailDialog) {
      setSelectedSize(null);
    }
  }, [showOutfitDetailDialog]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
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
                      onCheckedChange={(checked) => setIncludeRental(checked)}
                    />
                    <Label htmlFor="includeRental" className="text-gray-900 cursor-pointer">
                      Thuê Trang Phục
                    </Label>
                  </div>

                  {includeRental && (
                    <div className="ml-7 space-y-4">
                      {/* Selected Outfits List WITH SIZE */}
                      <div className="space-y-3">
                        {selectedOutfits.map((outfit) => (
                          <div key={outfit.id} className="flex gap-4 pb-3 border-b border-gray-100">
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
                              <p className="text-sm text-red-600 mt-1">{outfit.price.toLocaleString("vi-VN")} ₫</p>
                              {/* SHOW SIZE HERE */}
                              <p className="text-sm text-gray-700 mt-1">
                                <span className="font-medium">Size:</span> {outfit.selectedSize}
                              </p>
                            </div>
                            {selectedOutfits.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveOutfit(outfit.id)}
                                className="text-gray-400 hover:text-red-600 transition-colors"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            )}
                          </div>
                        ))}
                        
                        {/* Add Outfit Button */}
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full border-dashed border-2 border-gray-300 text-gray-600 hover:border-red-400 hover:text-red-600 hover:bg-red-50"
                          onClick={() => setShowOutfitDialog(true)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Thêm Trang Phục
                        </Button>
                      </div>

                      {/* Rental Days Selection */}
                      <div>
                        <Label className="text-gray-700 mb-2 block text-sm">Chọn Số Ngày Thuê</Label>
                        <Select value={rentalPackage} onValueChange={setRentalPackage} modal={false}>
                          <SelectTrigger className="w-full border-gray-300">
                            <SelectValue placeholder="Chọn số ngày" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-ngay">1 ngày</SelectItem>
                            <SelectItem value="3-ngay">3 ngày</SelectItem>
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

                {/* Photoshoot Section - unchanged */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <Checkbox
                      id="includePhotoshoot"
                      checked={includePhotoshoot}
                      onCheckedChange={(checked) => setIncludePhotoshoot(checked)}
                    />
                    <Label htmlFor="includePhotoshoot" className="text-gray-900 cursor-pointer">
                      Makeup + Chụp Ảnh
                    </Label>
                  </div>

                  {includePhotoshoot && (
                    <div className="ml-7 space-y-4">
                      {selectedPackageInfo && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-gray-900">{selectedPackageInfo.name}</h4>
                            <span className="text-red-600">{(selectedPackageInfo.price / 1000).toFixed(0)}k ₫</span>
                          </div>
                          <p className="text-xs text-gray-600 mb-3">Bạn đã chọn gói này từ trang Dịch Vụ</p>
                        </div>
                      )}
                      
                      <p className="text-sm text-gray-600">Không bao gồm thuê đồ</p>
                      
                      {selectedPackageInfo ? (
                        <div className="space-y-2 text-sm">
                          {selectedPackageInfo.features.map((feature, idx) => (
                            <div key={idx} className="flex items-start gap-2">
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-600">{feature}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
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
                      )}

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

            {/* Right Column - Customer Information (unchanged, keeping original) */}
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                <h2 className="text-red-600 mb-6">Thông Tin Khách Hàng</h2>

                <div className="space-y-4">
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

              {/* Rental Date & Address */}
              {includeRental && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                  <h2 className="text-red-600 mb-6">Thông Tin Thuê Đồ</h2>

                  <div className="space-y-4">
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

              {/* Photoshoot Date & Time */}
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

      {/* Payment Dialog - unchanged */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-red-600">Thanh Toán Đơn Hàng</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
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

            <Button
              onClick={() => setShowPaymentDialog(false)}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Outfit Selection Dialog */}
      <Dialog open={showOutfitDialog} onOpenChange={setShowOutfitDialog}>
        <DialogContent className="!max-w-[95vw] w-full !max-h-[90vh] overflow-y-auto font-body text-gray-700 font-smooth">
          <DialogHeader>
            <DialogTitle className="text-center text-red-600 text-4xl lg:text-5xl mb-2 font-display tracking-wide leading-tight text-balance">Chọn Trang Phục</DialogTitle>
            <p className="text-center text-gray-600 text-base lg:text-lg mt-2 leading-relaxed max-w-2xl mx-auto">
              Click vào trang phục để xem chi tiết hoặc thêm ngay vào đơn hàng
            </p>
          </DialogHeader>
          
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 py-8 px-4">
            {availableOutfits.map((outfit) => {
              const isSelected = selectedOutfits.find(o => o.id === outfit.id);
              
              return (
                <div
                  key={outfit.id}
                  className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                    isSelected 
                      ? 'border-red-600 bg-red-50 shadow-xl' 
                      : 'border-gray-200 hover:border-red-400 hover:shadow-lg'
                  }`}
                >
                  {/* Image */}
                  <div 
                    className="aspect-[3/4] overflow-hidden cursor-pointer"
                    onClick={() => {
                      setSelectedOutfitDetail(outfit);
                      setShowOutfitDetailDialog(true);
                    }}
                  >
                    <ImageWithFallback
                      src={outfit.image}
                      alt={outfit.name}
                      className={`w-full h-full object-cover transition-transform duration-500 ${
                        isSelected ? 'scale-105' : 'group-hover:scale-110'
                      }`}
                    />
                    
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="text-white text-center">
                        <svg className="w-16 h-16 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <p className="text-sm font-semibold tracking-wide uppercase">Xem chi tiết</p>
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="absolute top-4 right-4 z-10 bg-red-600 text-white rounded-full p-3 shadow-lg">
                      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}

                  <div className="p-6 bg-white">
                    <h3 className="text-lg lg:text-xl font-display text-gray-900 tracking-tight mb-1 line-clamp-1">
                      {outfit.name}
                    </h3>
                    <p className="text-sm text-gray-500 tracking-wide uppercase mb-4">{outfit.category}</p>
                    
                    <div className="flex items-center justify-between mb-5">
                      <div>
                        <div className="text-red-600 font-display text-xl tracking-wide">
                          {outfit.price.toLocaleString("vi-VN")} ₫
                        </div>
                        <div className="text-xs text-gray-500 mt-1 tracking-wide uppercase">
                          Cọc: {outfit.deposit.toLocaleString("vi-VN")} ₫
                        </div>
                      </div>
                      {isSelected && (
                        <span className="text-xs text-red-600 font-semibold tracking-wide uppercase bg-red-100 px-4 py-2 rounded-full">
                          Đã chọn
                        </span>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        onClick={() => {
                          setSelectedOutfitDetail(outfit);
                          setShowOutfitDetailDialog(true);
                        }}
                        variant="outline"
                        className="flex-1 border-gray-300 hover:border-red-400 hover:text-red-600 text-sm tracking-wide uppercase py-5"
                        size="lg"
                      >
                        Chi tiết
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="border-t border-gray-200 pt-6 mt-6 px-4">
            <Button
              type="button"
              onClick={() => setShowOutfitDialog(false)}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white text-lg py-6"
              size="lg"
            >
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Outfit Detail Dialog WITH SIZE SELECTION */}
      <Dialog open={showOutfitDetailDialog} onOpenChange={setShowOutfitDetailDialog}>
        <DialogContent className="!max-w-[90vw] w-full !max-h-[95vh] overflow-y-auto font-body text-gray-700 font-smooth">
          {selectedOutfitDetail && (
            <>
              <DialogHeader>
                <DialogTitle className="text-center text-red-600 text-4xl lg:text-5xl mb-2 font-display tracking-wide leading-tight text-balance">
                  {selectedOutfitDetail.name}
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid md:grid-cols-2 gap-12 py-8 px-4">
                {/* Left: Image */}
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <ImageWithFallback
                    src={selectedOutfitDetail.image}
                    alt={selectedOutfitDetail.name}
                    className="w-full h-full object-cover min-h-[600px]"
                  />
                </div>

                {/* Right: Details */}
                <div className="space-y-8">
                  {/* Category Badge */}
                  <div>
                    <span className="inline-block bg-red-100 text-red-800 px-6 py-2 rounded-full text-xs font-semibold tracking-wide uppercase">
                      {selectedOutfitDetail.category}
                    </span>
                  </div>

                  {/* Name */}
                  <div>
                    <h2 className="text-3xl lg:text-4xl font-display text-gray-900 tracking-tight mb-2">
                      {selectedOutfitDetail.name}
                    </h2>
                    <p className="text-gray-600 text-base leading-relaxed">
                      Trang phục truyền thống Việt Nam cao cấp
                    </p>
                  </div>

                  {/* Price Info */}
                  <div className="bg-gray-50 rounded-xl p-8 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium text-sm tracking-wide uppercase">Giá thuê</span>
                      <span className="text-red-600 font-display text-3xl tracking-wide">
                        {selectedOutfitDetail.price.toLocaleString("vi-VN")} ₫
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium text-sm tracking-wide uppercase">Tiền cọc</span>
                      <span className="text-gray-900 font-display text-2xl tracking-wide">
                        {selectedOutfitDetail.deposit.toLocaleString("vi-VN")} ₫
                      </span>
                    </div>
                    <div className="pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600 leading-relaxed">
                        💰 Tiền cọc sẽ được hoàn trả sau khi trả đồ
                      </p>
                    </div>
                  </div>

                  {/* SIZE SELECTION */}
                  <div className="space-y-4">
                    <h3 className="text-gray-900 font-display tracking-wide text-2xl">Chọn Size</h3>
                    <div className="grid grid-cols-4 gap-3">
                      {selectedOutfitDetail.sizes.map((sizeInfo) => {
                        const isOutOfStock = sizeInfo.stock === 0;
                        const isSelected = selectedSize === sizeInfo.size;
                        
                        return (
                          <button
                            key={sizeInfo.size}
                            type="button"
                            onClick={() => !isOutOfStock && setSelectedSize(sizeInfo.size)}
                            disabled={isOutOfStock}
                            className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                              isSelected
                                ? 'border-red-600 bg-red-50'
                                : isOutOfStock
                                ? 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-50'
                                : 'border-gray-300 hover:border-red-400 hover:bg-red-50'
                            }`}
                          >
                            <div className="text-center">
                              <div className={`text-2xl font-bold mb-1 ${
                                isSelected ? 'text-red-600' : isOutOfStock ? 'text-gray-400' : 'text-gray-900'
                              }`}>
                                {sizeInfo.size}
                              </div>
                              <div className={`text-xs ${
                                isSelected ? 'text-red-600' : isOutOfStock ? 'text-gray-400' : 'text-gray-600'
                              }`}>
                                {isOutOfStock ? 'Hết hàng' : `Còn ${sizeInfo.stock}`}
                              </div>
                            </div>
                            
                            {isSelected && (
                              <div className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {!selectedSize && (
                      <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
                        ⚠️ Vui lòng chọn size trước khi thêm vào đơn hàng
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-4">
                    <h3 className="text-gray-900 font-semibold text-2xl">Mô tả chi tiết</h3>
                    <div className="text-gray-700 space-y-3 text-base leading-relaxed">
                      <p>✨ Trang phục được thiết kế tinh xảo với chất liệu cao cấp, mang đậm nét truyền thống Việt Nam.</p>
                      <p>🎨 Phù hợp cho các dịp lễ hội, chụp ảnh kỷ niệm, sự kiện văn hóa.</p>
                      <p>📏 Size có thể điều chỉnh để phù hợp với vóc dáng của bạn.</p>
                      <p>🧵 Chất liệu: Vải cao cấp, thêu tay thủ công.</p>
                      <p>🌟 Phụ kiện đi kèm: Khăn, trang sức phù hợp (tùy mẫu).</p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4">
                    <h3 className="text-gray-900 font-semibold text-2xl">Dịch vụ bao gồm</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 text-base text-gray-700">
                        <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Giặt ủi miễn phí</span>
                      </div>
                      <div className="flex items-center gap-3 text-base text-gray-700">
                        <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Tư vấn phối đồ</span>
                      </div>
                      <div className="flex items-center gap-3 text-base text-gray-700">
                        <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Phụ kiện đi kèm</span>
                      </div>
                      <div className="flex items-center gap-3 text-base text-gray-700">
                        <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Hỗ trợ thay đổi size</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-6">
                    <Button
                      type="button"
                      onClick={() => setShowOutfitDetailDialog(false)}
                      variant="outline"
                      className="flex-1 border-gray-300 text-lg py-6"
                      size="lg"
                    >
                      Đóng
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        if (selectedSize) {
                          handleAddOutfitWithSize(selectedOutfitDetail, selectedSize);
                        }
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white text-lg py-6"
                      size="lg"
                      disabled={!selectedSize || selectedOutfits.find(o => o.id === selectedOutfitDetail.id)}
                    >
                      {selectedOutfits.find(o => o.id === selectedOutfitDetail.id) 
                        ? 'Đã thêm vào đơn hàng' 
                        : !selectedSize 
                        ? 'Vui lòng chọn size'
                        : 'Thêm vào đơn hàng'}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
