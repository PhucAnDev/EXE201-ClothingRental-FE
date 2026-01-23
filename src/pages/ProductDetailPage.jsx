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
  User
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
          <h2 className="text-2xl font-display mb-4">Không tìm thấy sản phẩm</h2>
          <Button onClick={() => navigate("/bo-suu-tap")}>
            Quay lại Bộ sưu tập
          </Button>
        </div>
      </div>
    );
  }
  
  const totalPrice = product.pricePerDay * rentalDays;
  
  const handleNextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };
  
  const handlePrevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
  };
  
  const handleRentNow = () => {
    if (!selectedSize) {
      alert("Vui lòng chọn size!");
      return;
    }
    
    // TODO: Add to cart or navigate to checkout
    alert(`Đã thêm vào giỏ hàng:\n${product.name}\nSize: ${selectedSize}\nSố ngày: ${rentalDays}\nTổng: ${totalPrice.toLocaleString()}đ`);
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
      date: new Date().toLocaleDateString('vi-VN')
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
              
              {/* Thumbnail Gallery */}
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index 
                          ? "border-[#c1272d] ring-2 ring-[#c1272d]/20" 
                          : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      <ImageWithFallback
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Info */}
            <div className="space-y-8">
              {/* Header */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-[#d4af37] text-[#d4af37]" />
                    <span className="font-semibold text-lg">{product.rating}</span>
                  </div>
                  <span className="text-gray-400">·</span>
                  <span className="text-gray-600">{product.reviewCount} đánh giá</span>
                  <span className="text-gray-400">·</span>
                  <span className="text-green-600 font-medium">{product.availability}</span>
                </div>
                
                <h1 className="text-4xl font-display text-[#1a1a1a] mb-3">
                  {product.name}
                </h1>
                
                <p className="text-lg text-gray-600">
                  Thiết kế bởi <span className="font-medium text-[#c1272d]">{product.designer}</span>
                </p>
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
                  Đặt cọc: {product.rentalPolicy.deposit.toLocaleString()}đ • Phí trễ: {product.rentalPolicy.lateFee.toLocaleString()}đ/ngày
                </p>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-[#1a1a1a] mb-3">Mô tả</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Material & Color */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Chất liệu</p>
                  <p className="font-medium text-[#1a1a1a]">{product.material}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Màu sắc</p>
                  <p className="font-medium text-[#1a1a1a]">{product.color}</p>
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[#1a1a1a]">Chọn size</h3>
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
                          {Object.entries(product.sizeChart).map(([size, measurements]) => (
                            <tr key={size} className="border-b border-gray-100 last:border-0">
                              <td className="py-2 pr-4 font-medium">{size}</td>
                              <td className="py-2 px-4">{measurements.bust}</td>
                              <td className="py-2 px-4">{measurements.waist}</td>
                              <td className="py-2 px-4">{measurements.hip}</td>
                              <td className="py-2 pl-4">{measurements.height}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Rental Days */}
              <div>
                <h3 className="text-lg font-semibold text-[#1a1a1a] mb-4">Số ngày thuê</h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setRentalDays(Math.max(1, rentalDays - 1))}
                    disabled={rentalDays <= product.rentalPolicy.minDays}
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-[#c1272d] disabled:opacity-50 disabled:hover:border-gray-300 transition-colors"
                  >
                    -
                  </button>
                  <div className="flex-1 text-center">
                    <div className="text-3xl font-display font-bold text-[#c1272d]">{rentalDays}</div>
                    <div className="text-sm text-gray-500">ngày</div>
                  </div>
                  <button
                    onClick={() => setRentalDays(Math.min(product.rentalPolicy.maxDays, rentalDays + 1))}
                    disabled={rentalDays >= product.rentalPolicy.maxDays}
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-[#c1272d] disabled:opacity-50 disabled:hover:border-gray-300 transition-colors"
                  >
                    +
                  </button>
                </div>
                <p className="text-sm text-gray-500 text-center mt-3">
                  Tối thiểu {product.rentalPolicy.minDays} ngày, tối đa {product.rentalPolicy.maxDays} ngày
                </p>
              </div>

              {/* Total Price */}
              <div className="bg-gradient-to-r from-[#c1272d] to-[#8b1e1f] text-white p-6 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90 mb-1">Tổng tiền</p>
                    <p className="text-3xl font-display font-bold">{totalPrice.toLocaleString()}đ</p>
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
                    <p className="font-medium text-sm text-blue-900">Bảo vệ khách hàng</p>
                    <p className="text-xs text-blue-700 mt-1">Hoàn tiền 100% nếu có vấn đề</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                  <Package className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm text-green-900">Miễn phí vận chuyển</p>
                    <p className="text-xs text-green-700 mt-1">Giao hàng trong 24h</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-20 border-t border-gray-100 pt-12">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Chi tiết sản phẩm */}
              <div>
                <h3 className="text-2xl font-display text-[#1a1a1a] mb-6 flex items-center gap-2">
                  <Info className="w-6 h-6 text-[#d4af37]" />
                  Chi Tiết Sản Phẩm
                </h3>
                <div className="space-y-3">
                  {Object.entries(product.details).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-600 capitalize">
                        {key === 'fabric' && 'Chất liệu'}
                        {key === 'pattern' && 'Họa tiết'}
                        {key === 'collar' && 'Cổ áo'}
                        {key === 'sleeves' && 'Tay áo'}
                        {key === 'length' && 'Độ dài'}
                        {key === 'care' && 'Bảo quản'}
                      </span>
                      <span className="font-medium text-[#1a1a1a] text-right">{value}</span>
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
                <form onSubmit={handleSubmitReview} className="bg-gradient-to-br from-[#fef9f3] to-white p-6 rounded-xl border border-[#d4af37]/20 mb-8">
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
                            <p className="font-semibold text-[#1a1a1a]">{review.user}</p>
                            <p className="text-sm text-gray-500">{review.date}</p>
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
                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Chưa có đánh giá nào</p>
                    <p className="text-sm text-gray-400 mt-2">Hãy là người đầu tiên đánh giá sản phẩm này!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}