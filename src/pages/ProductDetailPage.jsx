import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  Heart,
  Share2,
  Star,
  Calendar,
  Ruler,
  Shield,
  Package,
  ChevronLeft,
  ChevronRight,
  Check,
  Info,
  Send,
  User,
  MapPin,
  Users,
  Sparkles,
  Crown,
  BookOpen,
  Shirt,
  TrendingUp,
  Award,
} from "lucide-react";
import { motion } from "motion/react";
import { Footer } from "../components/Footer";
import { getProductById } from "../utils/mockData";

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [rentalDays, setRentalDays] = useState(1);
  const [showSizeChart, setShowSizeChart] = useState(false);

  // Review form state
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewName, setReviewName] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [userReviews, setUserReviews] = useState([]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Get product data
  const product = getProductById(id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-display mb-4">
            Không tìm thấy sản phẩm
          </h2>
          <Button onClick={() => navigate("/bo-suu-tap")}>
            Quay lại Bộ sưu tập
          </Button>
        </div>
      </div>
    );
  }

  const totalPrice = product.pricePerDay * rentalDays;
  const getMaxMeasurement = (value) => {
    if (!value) return "--";
    const text = String(value);
    if (!text.includes("-")) return text;
    const maxValue = text.split("-").pop()?.trim();
    return maxValue || text;
  };
  const getPrimaryColor = (value) => {
    const normalized = (value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    if (normalized.includes("do") || normalized.includes("hong")) return "Red";
    if (normalized.includes("vang")) return "Yellow";
    if (normalized.includes("xanh")) return "Blue";
    return "Gray";
  };
  const fallbackStock = [3, 5, 2, 0, 0];
  const outfitDetails = {
    silhouette: product.outfitDetails?.silhouette ?? "Dáng suông",
    formalityLevel:
      product.outfitDetails?.formalityLevel ??
      ((product.tags || []).some((tag) => /premium|limited/i.test(tag))
        ? "Royal"
        : "Daily"),
    occasion:
      product.outfitDetails?.occasion ??
      ((product.tags || []).length
        ? product.tags.join(", ")
        : "Sự kiện truyền thống"),
    colorPrimary:
      product.outfitDetails?.colorPrimary ?? getPrimaryColor(product.color),
  };
  const outfitSizes =
    product.outfitSizes && product.outfitSizes.length
      ? product.outfitSizes
      : Object.entries(product.sizeChart || {}).map(
          ([sizeLabel, measurements], index) => {
            const stockQuantity =
              fallbackStock[index] ?? Math.max(0, 3 - index);
            return {
              sizeLabel,
              chestMaxCm: getMaxMeasurement(measurements?.bust),
              waistMaxCm: getMaxMeasurement(measurements?.waist),
              hipMaxCm: getMaxMeasurement(measurements?.hip),
              stockQuantity,
              status: stockQuantity > 0 ? "InStock" : "OutOfStock",
            };
          },
        );
  const hasOutfitDetails = Boolean(outfitDetails);
  const hasOutfitSizes = outfitSizes.length > 0;

  const handleNextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const handlePrevImage = () => {
    setSelectedImage(
      (prev) => (prev - 1 + product.images.length) % product.images.length,
    );
  };

  const handleRentNow = () => {
    if (!selectedSize) {
      alert("Vui lòng chọn size!");
      return;
    }

    // TODO: Add to cart or navigate to checkout
    alert(
      `Đã thêm vào giỏ hàng:\n${product.name}\nSize: ${selectedSize}\nSố ngày: ${rentalDays}\nTổng: ${totalPrice.toLocaleString()}đ`,
    );
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();

    if (!reviewName.trim()) {
      alert("Vui lòng nhập tên của bạn!");
      return;
    }

    if (reviewRating === 0) {
      alert("Vui lòng chọn số sao đánh giá!");
      return;
    }

    if (!reviewComment.trim()) {
      alert("Vui lòng nhập nội dung đánh giá!");
      return;
    }

    // Create new review
    const newReview = {
      id: Date.now(),
      user: reviewName,
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toLocaleDateString("vi-VN"),
    };

    // Add to user reviews
    setUserReviews([newReview, ...userReviews]);

    // Reset form
    setReviewName("");
    setReviewRating(0);
    setReviewComment("");

    // Success message
    alert("Cảm ơn bạn đã đánh giá sản phẩm!");
  };

  // Combine product reviews and user reviews
  const allReviews = [...userReviews, ...(product.reviews || [])];

  return (
    <>
      <div className="min-h-screen bg-white pt-20">
        {/* Breadcrumb */}
        <div className="border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => navigate("/")}
                className="text-gray-500 hover:text-[#c1272d] transition-colors"
              >
                Trang chủ
              </button>
              <span className="text-gray-300">/</span>
              <button
                onClick={() => navigate("/bo-suu-tap")}
                className="text-gray-500 hover:text-[#c1272d] transition-colors"
              >
                Bộ sưu tập
              </button>
              <span className="text-gray-300">/</span>
              <span className="text-[#c1272d]">{product.name}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left: Images */}
            <div className="space-y-6">
              {/* Main Image */}
              <motion.div
                className="relative aspect-[3/4] bg-gray-50 overflow-hidden rounded-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <ImageWithFallback
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                {/* Navigation Arrows */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all"
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-900" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-900" />
                    </button>
                  </>
                )}

                {/* Wishlist & Share */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all group">
                    <Heart className="w-5 h-5 text-gray-900 group-hover:fill-[#c1272d] group-hover:text-[#c1272d] transition-colors" />
                  </button>
                  <button className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all">
                    <Share2 className="w-5 h-5 text-gray-900" />
                  </button>
                </div>

                {/* Tags */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      className="bg-[#d4af37] text-white border-none font-semibold"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-white text-sm">
                  {selectedImage + 1} / {product.images.length}
                </div>
              </motion.div>
            </div>

            {/* Right: Product Info */}
            <div className="space-y-8">
              {/* Header */}
              <div>
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-[#d4af37] text-[#d4af37]" />
                    <span className="font-semibold text-lg">
                      {product.rating}
                    </span>
                  </div>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-600">
                    {product.reviewCount} đánh giá
                  </span>
                  <span className="text-gray-400">·</span>
                  <span className="text-green-600 font-medium">
                    {product.availability}
                  </span>

                  {/* Limited Badge */}
                  {product.isLimited && (
                    <>
                      <span className="text-gray-400">·</span>
                      <Badge className="bg-gradient-to-r from-[#d4af37] to-[#b8941f] text-white border-none flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        Giới Hạn
                      </Badge>
                    </>
                  )}
                </div>

                <h1 className="text-4xl font-display text-[#1a1a1a] mb-3">
                  {product.name}
                </h1>

                <p className="text-lg text-gray-600 mb-4">
                  Thiết kế bởi{" "}
                  <span className="font-medium text-[#c1272d]">
                    {product.designer}
                  </span>
                </p>

                {/* Product Classification Info */}
                {hasOutfitDetails && (
                  <div className="flex flex-wrap gap-2">
                    {product.region && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{product.region}</span>
                      </div>
                    )}
                    {product.gender && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 text-pink-700 rounded-full text-sm">
                        <Users className="w-3.5 h-3.5" />
                        <span>
                          {product.gender === "Female"
                            ? "Nữ"
                            : product.gender === "Male"
                              ? "Nam"
                              : "Unisex"}
                        </span>
                      </div>
                    )}
                    {outfitDetails.formalityLevel && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm">
                        {outfitDetails.formalityLevel === "Royal" ? (
                          <Crown className="w-3.5 h-3.5" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5" />
                        )}
                        <span>
                          {outfitDetails.formalityLevel === "Royal"
                            ? "Cung Đình"
                            : "Thường Ngày"}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="bg-gradient-to-br from-[#fef9f3] to-white p-6 rounded-xl border border-[#d4af37]/20">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-display text-[#c1272d] font-bold">
                    {product.pricePerDay.toLocaleString()}đ
                  </span>
                  <span className="text-gray-500">/ngày</span>
                </div>
                <p className="text-sm text-gray-600">
                  Đặt cọc: {product.rentalPolicy.deposit.toLocaleString()}đ •
                  Phí trễ: {product.rentalPolicy.lateFee.toLocaleString()}đ/ngày
                </p>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-[#1a1a1a] mb-3">
                  Mô tả
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Material & Color */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Chất liệu</p>
                  <p className="font-medium text-[#1a1a1a]">
                    {product.material}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Màu sắc</p>
                  <p className="font-medium text-[#1a1a1a]">{product.color}</p>
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[#1a1a1a]">
                    Chọn size
                  </h3>
                  <button
                    onClick={() => setShowSizeChart(!showSizeChart)}
                    className="text-[#c1272d] text-sm font-medium hover:underline flex items-center gap-1"
                  >
                    <Ruler className="w-4 h-4" />
                    Bảng size
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-3 rounded-lg border-2 font-semibold transition-all ${
                        selectedSize === size
                          ? "border-[#c1272d] bg-[#c1272d] text-white"
                          : "border-gray-200 hover:border-[#c1272d]/50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                {showSizeChart && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 bg-gray-50 p-4 rounded-lg overflow-hidden"
                  >
                    <h4 className="font-semibold mb-3">Bảng Số Đo (cm)</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-2 pr-4">Size</th>
                            <th className="text-left py-2 px-4">Ngực</th>
                            <th className="text-left py-2 px-4">Eo</th>
                            <th className="text-left py-2 px-4">Hông</th>
                            <th className="text-left py-2 pl-4">Chiều cao</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(product.sizeChart).map(
                            ([size, measurements]) => (
                              <tr
                                key={size}
                                className="border-b border-gray-100 last:border-0"
                              >
                                <td className="py-2 pr-4 font-medium">
                                  {size}
                                </td>
                                <td className="py-2 px-4">
                                  {measurements.bust}
                                </td>
                                <td className="py-2 px-4">
                                  {measurements.waist}
                                </td>
                                <td className="py-2 px-4">
                                  {measurements.hip}
                                </td>
                                <td className="py-2 pl-4">
                                  {measurements.height}
                                </td>
                              </tr>
                            ),
                          )}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Rental Days */}
              <div>
                <h3 className="text-lg font-semibold text-[#1a1a1a] mb-4">
                  Số ngày thuê
                </h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setRentalDays(Math.max(1, rentalDays - 1))}
                    disabled={rentalDays <= product.rentalPolicy.minDays}
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-[#c1272d] disabled:opacity-50 disabled:hover:border-gray-300 transition-colors"
                  >
                    -
                  </button>
                  <div className="flex-1 text-center">
                    <div className="text-3xl font-display font-bold text-[#c1272d]">
                      {rentalDays}
                    </div>
                    <div className="text-sm text-gray-500">ngày</div>
                  </div>
                  <button
                    onClick={() =>
                      setRentalDays(
                        Math.min(product.rentalPolicy.maxDays, rentalDays + 1),
                      )
                    }
                    disabled={rentalDays >= product.rentalPolicy.maxDays}
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-[#c1272d] disabled:opacity-50 disabled:hover:border-gray-300 transition-colors"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm text-gray-500 text-center mt-3">
                  Tối thiểu {product.rentalPolicy.minDays} ngày, tối đa{" "}
                  {product.rentalPolicy.maxDays} ngày
                </p>
              </div>

              {/* Total Price */}
              <div className="bg-gradient-to-r from-[#c1272d] to-[#8b1e1f] text-white p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90 mb-1">Tổng tiền</p>
                    <p className="text-3xl font-display font-bold">
                      {totalPrice.toLocaleString()}đ
                    </p>
                  </div>
                  <Calendar className="w-12 h-12 opacity-20" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={handleRentNow}
                  className="flex-1 bg-[#c1272d] hover:bg-[#8b1e1f] text-white h-14 text-lg font-semibold"
                >
                  Thuê Ngay
                </Button>
                <Button
                  variant="outline"
                  className="w-14 h-14 border-2 border-[#c1272d] text-[#c1272d] hover:bg-[#c1272d] hover:text-white"
                >
                  <Heart className="w-5 h-5" />
                </Button>
              </div>

              {/* Features */}
              <div className="space-y-3">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <p className="text-gray-700">{feature}</p>
                  </div>
                ))}
              </div>

              {/* Policies */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm text-blue-900">
                      Bảo vệ khách hàng
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      Hoàn tiền 100% nếu có vấn đề
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                  <Package className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm text-green-900">
                      Miễn phí vận chuyển
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      Giao hàng trong 24h
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-20 border-t border-gray-100 pt-12">
            {/* Outfit Details Section */}
            {hasOutfitDetails && (
              <div className="mb-16">
                <h3 className="text-3xl font-display text-[#1a1a1a] mb-8 flex items-center gap-2">
                  <Shirt className="w-7 h-7 text-[#d4af37]" />
                  Thông Tin Thiết Kế
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-xl border border-orange-100">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-orange-600" />
                      <p className="text-sm text-gray-600">Phom Dáng</p>
                    </div>
                    <p className="text-lg text-gray-900 font-semibold">
                      {outfitDetails.silhouette}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border border-purple-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="w-5 h-5 text-purple-600" />
                      <p className="text-sm text-gray-600">
                        Mức Độ Trang Trọng
                      </p>
                    </div>
                    <p className="text-lg text-gray-900 font-semibold">
                      {outfitDetails.formalityLevel === "Royal"
                        ? "Cung Đình/Cao Cấp"
                        : "Thường Ngày"}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border border-green-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-5 h-5 text-green-600" />
                      <p className="text-sm text-gray-600">Dịp Phù Hợp</p>
                    </div>
                    <p className="text-sm text-gray-900 font-semibold leading-relaxed">
                      {outfitDetails.occasion}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                      <p className="text-sm text-gray-600">Màu Chủ Đạo</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full border-2 border-gray-300 ${
                          outfitDetails.colorPrimary === "Red"
                            ? "bg-red-600"
                            : outfitDetails.colorPrimary === "Blue"
                              ? "bg-blue-600"
                              : outfitDetails.colorPrimary === "Yellow"
                                ? "bg-yellow-600"
                                : "bg-gray-600"
                        }`}
                      ></div>
                      <p className="text-lg text-gray-900 font-semibold">
                        {product.color}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Size Inventory Section */}
            {hasOutfitSizes && (
              <div className="mb-16">
                <h3 className="text-3xl font-display text-[#1a1a1a] mb-8 flex items-center gap-2">
                  <Package className="w-7 h-7 text-[#d4af37]" />
                  Tình Trạng Kho & Số Đo Chi Tiết
                </h3>
                <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border border-gray-200">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                            Size
                          </th>
                          <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                            Ngực (cm)
                          </th>
                          <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                            Eo (cm)
                          </th>
                          <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                            Hông (cm)
                          </th>
                          <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                            Tồn Kho
                          </th>
                          <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                            Trạng Thái
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {outfitSizes.map((sizeData, index) => (
                          <tr
                            key={index}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-4 px-4">
                              <span className="font-semibold text-gray-900 text-lg">
                                {sizeData.sizeLabel}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-center text-gray-700">
                              ≤ {sizeData.chestMaxCm}
                            </td>
                            <td className="py-4 px-4 text-center text-gray-700">
                              ≤ {sizeData.waistMaxCm}
                            </td>
                            <td className="py-4 px-4 text-center text-gray-700">
                              ≤ {sizeData.hipMaxCm}
                            </td>
                            <td className="py-4 px-4 text-center">
                              <span
                                className={`font-semibold ${
                                  sizeData.stockQuantity === 0
                                    ? "text-red-600"
                                    : sizeData.stockQuantity <= 2
                                      ? "text-orange-600"
                                      : "text-green-600"
                                }`}
                              >
                                {sizeData.stockQuantity} chiếc
                              </span>
                            </td>
                            <td className="py-4 px-4 text-center">
                              <Badge
                                className={`${
                                  sizeData.status === "InStock"
                                    ? "bg-green-100 text-green-700 hover:bg-green-100"
                                    : "bg-red-100 text-red-700 hover:bg-red-100"
                                } border-none`}
                              >
                                {sizeData.status === "InStock"
                                  ? "Còn hàng"
                                  : "Hết hàng"}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>💡 Lưu ý:</strong> Số đo hiển thị là số đo tối đa
                      của trang phục. AI Fitting sẽ so sánh số đo của bạn với số
                      đo này để đề xuất size phù hợp nhất.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid lg:grid-cols-3 gap-12">
              {/* Chi tiết sản phẩm */}
              <div>
                <h3 className="text-2xl font-display text-[#1a1a1a] mb-6 flex items-center gap-2">
                  <Info className="w-6 h-6 text-[#d4af37]" />
                  Chi Tiết Sản Phẩm
                </h3>
                <div className="space-y-3">
                  {Object.entries(product.details).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between py-3 border-b border-gray-100"
                    >
                      <span className="text-gray-600 capitalize">
                        {key === "fabric" && "Chất liệu"}
                        {key === "pattern" && "Họa tiết"}
                        {key === "collar" && "Cổ áo"}
                        {key === "sleeves" && "Tay áo"}
                        {key === "length" && "Độ dài"}
                        {key === "care" && "Bảo quản"}
                      </span>
                      <span className="font-medium text-[#1a1a1a] text-right">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div className="lg:col-span-2">
                <h3 className="text-2xl font-display text-[#1a1a1a] mb-6">
                  Đánh Giá ({product.reviewCount + userReviews.length})
                </h3>

                {/* Review Form */}
                <form
                  onSubmit={handleSubmitReview}
                  className="bg-gradient-to-br from-[#fef9f3] to-white p-6 rounded-xl border border-[#d4af37]/20 mb-8"
                >
                  <h4 className="text-lg font-semibold text-[#1a1a1a] mb-4 flex items-center gap-2">
                    <Send className="w-5 h-5 text-[#d4af37]" />
                    Viết Đánh Giá
                  </h4>

                  <div className="space-y-4">
                    {/* Name Input */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tên của bạn
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={reviewName}
                          onChange={(e) => setReviewName(e.target.value)}
                          placeholder="Nhập tên của bạn..."
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c1272d]/20 focus:border-[#c1272d] transition-all"
                        />
                      </div>
                    </div>

                    {/* Star Rating */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Đánh giá của bạn
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="transition-transform hover:scale-110"
                          >
                            <Star
                              className={`w-8 h-8 transition-colors ${
                                star <= (hoverRating || reviewRating)
                                  ? "fill-[#d4af37] text-[#d4af37]"
                                  : "fill-gray-200 text-gray-200"
                              }`}
                            />
                          </button>
                        ))}
                        {reviewRating > 0 && (
                          <span className="text-sm text-gray-600 ml-2">
                            ({reviewRating}/5 sao)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Comment Textarea */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nội dung đánh giá
                      </label>
                      <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c1272d]/20 focus:border-[#c1272d] transition-all resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-[#c1272d] to-[#8b1e1f] hover:from-[#8b1e1f] hover:to-[#c1272d] text-white h-12 font-semibold"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Gửi Đánh Giá
                    </Button>
                  </div>
                </form>

                {/* Reviews List */}
                {allReviews.length > 0 ? (
                  <div className="space-y-6">
                    {allReviews.map((review) => (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gray-50 p-6 rounded-lg"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold text-[#1a1a1a]">
                              {review.user}
                            </p>
                            <p className="text-sm text-gray-500">
                              {review.date}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "fill-[#d4af37] text-[#d4af37]"
                                    : "fill-gray-200 text-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          {review.comment}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Chưa có đánh giá nào</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Hãy là người đầu tiên đánh giá sản phẩm này!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Outfit Stories Section - "Mặc đúng - Hiểu đúng" */}
            {product.outfitStories && product.outfitStories.length > 0 && (
              <div className="mt-20 border-t border-gray-100 pt-12">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-display text-[#1a1a1a] mb-4 flex items-center justify-center gap-3">
                    <BookOpen className="w-8 h-8 text-[#d4af37]" />
                    Mặc Đúng - Hiểu Đúng
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Khám phá câu chuyện văn hóa, lịch sử và ý nghĩa sâu sắc đằng
                    sau mỗi chi tiết thiết kế
                  </p>
                </div>

                <div className="space-y-8">
                  {product.outfitStories.map((story, index) => (
                    <motion.div
                      key={story.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-gradient-to-br from-amber-50 via-white to-red-50 p-8 rounded-2xl border border-[#d4af37]/20 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="p-3 bg-gradient-to-br from-[#d4af37] to-[#b8941f] rounded-lg">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-display text-[#c1272d] mb-2">
                            {story.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span className="italic">
                              {story.culturalOrigin}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="pl-16">
                        <p className="text-gray-700 leading-relaxed text-lg">
                          {story.content}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-12 p-6 bg-gradient-to-r from-red-50 to-yellow-50 rounded-xl border-2 border-[#d4af37]/30">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-[#d4af37] rounded-lg">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-[#c1272d] mb-2">
                        Sứ Mệnh "Sắc Việt"
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        Chúng tôi tin rằng mỗi trang phục truyền thống không chỉ
                        là vẻ đẹp bên ngoài, mà còn mang trong mình những giá
                        trị văn hóa, lịch sử và tâm hồn dân tộc. Khi bạn khoác
                        lên mình chiếc áo dài, bạn không chỉ đẹp - bạn còn tiếp
                        nối và lan tỏa những câu chuyện quý giá của tổ tiên.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
