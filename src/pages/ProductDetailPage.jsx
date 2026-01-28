import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
  Upload,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { Footer } from "../components/Footer";
import { toast } from "sonner";
import { fetchOutfitDetail } from "../features/outfit/outfitSlice";
import {
  addReview,
  clearAddReviewStatus,
  fetchReviewsByOutfitId,
} from "../features/review/reviewSlice";

const normalizeValue = (value) => String(value ?? "").toLowerCase();

const isAvailableStatus = (status) => {
  const normalized = normalizeValue(status);
  return (
    normalized === "available" ||
    normalized === "instock" ||
    normalized === "in_stock"
  );
};

const formatAvailability = (status) => {
  if (!status) return "";
  return isAvailableStatus(status) ? "Còn hàng" : "Hết hàng";
};

const isRoyalFormality = (value) => {
  const normalized = normalizeValue(value);
  return (
    normalized.includes("royal") ||
    normalized.includes("trang trọng") ||
    normalized.includes("trang trong") ||
    normalized.includes("cung đình") ||
    normalized.includes("cung dinh")
  );
};

const getColorClass = (value) => {
  const normalized = normalizeValue(value);
  if (
    normalized.includes("red") ||
    normalized.includes("đỏ") ||
    normalized.includes("do")
  ) {
    return "bg-red-600";
  }
  if (
    normalized.includes("green") ||
    normalized.includes("xanh lá") ||
    normalized.includes("xanh la")
  ) {
    return "bg-green-600";
  }
  if (
    normalized.includes("blue") ||
    normalized.includes("xanh dương") ||
    normalized.includes("xanh duong") ||
    normalized === "xanh" ||
    normalized.includes("xanh")
  ) {
    return "bg-blue-600";
  }
  if (
    normalized.includes("yellow") ||
    normalized.includes("vàng") ||
    normalized.includes("vang")
  ) {
    return "bg-yellow-600";
  }
  if (
    normalized.includes("đen") ||
    normalized.includes("den") ||
    normalized.includes("black")
  ) {
    return "bg-gray-900";
  }
  if (
    normalized.includes("trắng") ||
    normalized.includes("trang") ||
    normalized.includes("white")
  ) {
    return "bg-gray-100";
  }
  return "bg-gray-600";
};

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { outfit, images, sizes, attributes, loading, error } = useSelector(
    (state) => state.outfit,
  );
  const {
    items: reviewItems = [],
    status: reviewStatus = "idle",
    error: reviewError = null,
    count: reviewCount = 0,
    addStatus: reviewAddStatus = "idle",
    addError: reviewAddError = null,
  } = useSelector((state) => state.review || {});
  const authUser = useSelector((state) => state.auth?.currentUser);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [rentalDays, setRentalDays] = useState(1);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);

  // Review form state
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewImages, setReviewImages] = useState([]);
  const [hoverRating, setHoverRating] = useState(0);

  const parseJwt = (token) => {
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length < 2) return null;
    try {
      const normalized = parts[1].replace(/-/g, "+").replace(/_/g, "/");
      const padded = normalized.padEnd(
        normalized.length + ((4 - (normalized.length % 4)) % 4),
        "=",
      );
      return JSON.parse(atob(padded));
    } catch (err) {
      return null;
    }
  };

  const getUserIdFromToken = () => {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("authToken");
    if (!token) return null;
    const payload = parseJwt(token);
    if (!payload) return null;
    return (
      payload.userId ||
      payload.id ||
      payload.nameid ||
      payload.sub ||
      payload[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ]
    );
  };

  const resolveUserId = () => {
    let savedUser = authUser || null;
    if (!savedUser && typeof window !== "undefined") {
      try {
        savedUser = JSON.parse(localStorage.getItem("currentUser") || "null");
      } catch (err) {
        savedUser = null;
      }
    }
    return savedUser?.userId || savedUser?.id || getUserIdFromToken();
  };

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setHasRequested(true);
    dispatch(fetchOutfitDetail(id));
    dispatch(fetchReviewsByOutfitId(id));
  }, [dispatch, id]);

  useEffect(() => {
    setSelectedImage(0);
    setSelectedSize("");
    setRentalDays(1);
    setShowSizeChart(false);
    setReviewRating(0);
    setReviewComment("");
    setReviewImages([]);
    setHoverRating(0);
  }, [id]);

  useEffect(() => {
    if (reviewAddStatus === "succeeded") {
      toast.success("Gửi đánh giá thành công!");
      setReviewRating(0);
      setReviewComment("");
      setReviewImages([]);
      setHoverRating(0);
      dispatch(clearAddReviewStatus());
    }
    if (reviewAddStatus === "failed") {
      toast.error(reviewAddError || "Không thể gửi đánh giá.");
      dispatch(clearAddReviewStatus());
    }
  }, [dispatch, reviewAddError, reviewAddStatus]);

  const product = useMemo(() => {
    const imageList = Array.isArray(images) ? [...images] : [];
    imageList.sort((a, b) => {
      const aOrder =
        typeof a?.sortOrder === "number"
          ? a.sortOrder
          : Number.POSITIVE_INFINITY;
      const bOrder =
        typeof b?.sortOrder === "number"
          ? b.sortOrder
          : Number.POSITIVE_INFINITY;
      return aOrder - bOrder;
    });
    const imageUrls = imageList.map((image) => image?.imageUrl).filter(Boolean);

    if (!imageUrls.length && outfit?.primaryImageUrl) {
      imageUrls.push(outfit.primaryImageUrl);
    }

    const sizeList = Array.isArray(sizes) ? sizes : [];
    const sizeLabels = Array.from(
      new Set(sizeList.map((size) => size?.sizeLabel).filter(Boolean)),
    );

    const sizeChart =
      sizeList.length > 0
        ? sizeList.reduce((acc, size) => {
            const label = size?.sizeLabel;
            if (!label) return acc;
            acc[label] = {
              bust: size?.chestMaxCm ? `<= ${size.chestMaxCm}` : "-",
              waist: size?.waistMaxCm ? `<= ${size.waistMaxCm}` : "-",
              hip: size?.hipMaxCm ? `<= ${size.hipMaxCm}` : "-",
              height: "-",
            };
            return acc;
          }, {})
        : null;

    const tags = [
      outfit?.type,
      attributes?.occasion,
      attributes?.seasonSuitability,
    ]
      .filter(Boolean)
      .slice(0, 3);

    const outfitDetails = attributes
      ? {
          material: attributes.material ?? null,
          silhouette: attributes.silhouette ?? null,
          formalityLevel: attributes.formalityLevel ?? null,
          occasion: attributes.occasion ?? null,
          colorPrimary: attributes.colorPrimary ?? null,
        }
      : null;

    const outfitStories =
      attributes && (attributes.storyTitle || attributes.storyContent)
        ? [
            {
              id: attributes.detailId ?? 1,
              title: attributes.storyTitle || "Câu chuyện",
              content: attributes.storyContent || "",
              culturalOrigin: attributes.culturalOrigin || "",
            },
          ]
        : [];

    const pricePerDay =
      typeof outfit?.baseRentalPrice === "number"
        ? outfit.baseRentalPrice
        : Number(outfit?.baseRentalPrice) || 0;

    const rating =
      typeof outfit?.averageRating === "number" ? outfit.averageRating : 0;
    const reviewCount =
      typeof outfit?.totalReviews === "number" ? outfit.totalReviews : 0;

    return {
      id: outfit?.outfitId ?? id,
      name: outfit?.name || "",
      type: outfit?.type || "",
      gender: outfit?.gender || "",
      region: outfit?.region || "",
      isLimited: Boolean(outfit?.isLimited),
      availability: formatAvailability(outfit?.status),
      pricePerDay,
      rating,
      reviewCount,
      tags,
      images: imageUrls,
      designer: outfit?.designer || "",
      description: outfit?.description || "",
      material: attributes?.material || "",
      color: attributes?.colorPrimary || "",
      sizes: sizeLabels,
      sizeChart,
      rentalPolicy: null,
      features: [],
      details: null,
      outfitDetails,
      outfitSizes: sizeList,
      outfitStories,
      reviews: [],
    };
  }, [attributes, id, images, outfit, sizes]);

  const apiReviews = useMemo(() => {
    const list = Array.isArray(reviewItems) ? reviewItems : [];
    return list.map((review) => {
      const createdAt = review?.createdAt;
      const createdDate = createdAt ? new Date(createdAt) : null;
      const dateLabel =
        createdDate && !Number.isNaN(createdDate.getTime())
          ? createdDate.toLocaleDateString("vi-VN")
          : createdAt || "";

      return {
        id:
          review?.reviewId ??
          `${review?.userId ?? "user"}-${createdAt ?? "unknown"}`,
        user: review?.userFullName || review?.userEmail || "Khách hàng",
        date: dateLabel,
        rating: typeof review?.rating === "number" ? review.rating : 0,
        comment: review?.comment || "",
        images: Array.isArray(review?.images)
          ? review.images.map((image) => image?.imageUrl).filter(Boolean)
          : [],
      };
    });
  }, [reviewItems]);

  const apiReviewCount =
    typeof reviewCount === "number" && reviewCount > 0
      ? reviewCount
      : apiReviews.length;
  const totalReviewCount = apiReviewCount;
  const allReviews = apiReviews;

  if (loading && !outfit) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-display mb-4">Đang tải sản phẩm...</h2>
        </div>
      </div>
    );
  }

  if (error && !outfit) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-display mb-4">Không thể tải sản phẩm</h2>
          <p className="text-gray-600 mb-6">{String(error)}</p>
          <Button onClick={() => navigate("/bo-suu-tap")}>
            Quay lại Bộ sưu tập
          </Button>
        </div>
      </div>
    );
  }

  if (hasRequested && !loading && !error && (!product || !product.name)) {
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
  const activeImage = product.images[selectedImage] || product.images[0] || "";
  const rentalPolicy = product.rentalPolicy;
  const minRentalDays = rentalPolicy?.minDays ?? 1;
  const maxRentalDays = rentalPolicy?.maxDays ?? null;

  const handleNextImage = () => {
    if (!product.images.length) return;
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  const handlePrevImage = () => {
    if (!product.images.length) return;
    setSelectedImage(
      (prev) => (prev - 1 + product.images.length) % product.images.length,
    );
  };

  const handleRentNow = () => {
    if (product.sizes.length > 0 && !selectedSize) {
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

    if (reviewRating === 0) {
      toast.error("Vui lòng chọn số sao đánh giá!");
      return;
    }

    if (!reviewComment.trim()) {
      toast.error("Vui lòng nhập nội dung đánh giá!");
      return;
    }

    const resolvedUserId = resolveUserId();
    const parsedUserId = Number(resolvedUserId);
    if (!resolvedUserId || Number.isNaN(parsedUserId)) {
      toast.error("Vui lòng đăng nhập để gửi đánh giá.");
      return;
    }

    const parsedOutfitId = Number(id);
    if (!id || Number.isNaN(parsedOutfitId)) {
      toast.error("Không xác định được sản phẩm.");
      return;
    }

    const imageUrls = reviewImages.filter(
      (image) =>
        typeof image === "string" &&
        (/^https?:\/\//i.test(image) ||
          /^data:image\/[a-zA-Z0-9+.-]+;base64,/.test(image)),
    );

    dispatch(
      addReview({
        outfitId: parsedOutfitId,
        userId: parsedUserId,
        rating: reviewRating,
        comment: reviewComment.trim(),
        imageUrls,
      }),
    );
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    // Limit to 4 images
    if (reviewImages.length + files.length > 4) {
      toast.error("Bạn chỉ có thể tải lên tối đa 4 hình ảnh!");
      return;
    }

    // Convert files to data URLs
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReviewImages((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove image
  const handleRemoveImage = (index) => {
    setReviewImages((prev) => prev.filter((_, i) => i !== index));
  };

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
                  src={activeImage}
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
                  <button className="w-10 h-10 bg-white backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-[#c1272d] hover:shadow-xl transition-all group border border-gray-200">
                    <Heart className="w-5 h-5 text-gray-900 group-hover:fill-white group-hover:text-white transition-colors" />
                  </button>
                  <button className="w-10 h-10 bg-white backdrop-blur rounded-full flex items-center justify-center shadow-lg hover:bg-[#d4af37] hover:shadow-xl transition-all group border border-gray-200">
                    <Share2 className="w-5 h-5 text-gray-900 group-hover:text-white transition-colors" />
                  </button>
                </div>

                {/* Tags */}
                {product.tags.length > 0 && (
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
                )}

                {/* Image Counter */}
                {product.images.length > 0 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur px-3 py-1 rounded-full text-white text-sm">
                    {Math.min(selectedImage + 1, product.images.length)} /{" "}
                    {product.images.length}
                  </div>
                )}
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
                    {totalReviewCount} đánh giá
                  </span>
                  {product.availability && (
                    <>
                      <span className="text-gray-400">·</span>
                      <span className="text-green-600 font-medium">
                        {product.availability}
                      </span>
                    </>
                  )}

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

                {product.designer && (
                  <p className="text-lg text-gray-600 mb-4">
                    Thiết kế bởi{" "}
                    <span className="font-medium text-[#c1272d]">
                      {product.designer}
                    </span>
                  </p>
                )}

                {/* Product Classification Info */}
                {product.outfitDetails && (
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
                    {product.outfitDetails.formalityLevel && (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 rounded-full text-sm">
                        {isRoyalFormality(
                          product.outfitDetails.formalityLevel,
                        ) ? (
                          <Crown className="w-3.5 h-3.5" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5" />
                        )}
                        <span>
                          {isRoyalFormality(
                            product.outfitDetails.formalityLevel,
                          )
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
                {rentalPolicy && (
                  <p className="text-sm text-gray-600">
                    Đặt cọc: {rentalPolicy.deposit?.toLocaleString?.() ?? 0}đ •
                    Phí trễ: {rentalPolicy.lateFee?.toLocaleString?.() ?? 0}
                    đ/ngày
                  </p>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <h3 className="text-lg font-semibold text-[#1a1a1a] mb-3">
                    Mô tả
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Material & Color */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Chất liệu</p>
                  <p className="font-medium text-[#1a1a1a]">
                    {product.material || "Đang cập nhật"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Màu sắc</p>
                  <p className="font-medium text-[#1a1a1a]">
                    {product.color || "Đang cập nhật"}
                  </p>
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[#1a1a1a]">
                    Chọn size
                  </h3>
                  {product.sizeChart && (
                    <button
                      onClick={() => setShowSizeChart(!showSizeChart)}
                      className="text-[#c1272d] text-sm font-medium hover:underline flex items-center gap-1"
                    >
                      <Ruler className="w-4 h-4" />
                      Bảng size
                    </button>
                  )}
                </div>

                {product.sizes.length > 0 ? (
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
                ) : (
                  <p className="text-sm text-gray-500">Chưa có size phù hợp.</p>
                )}

                {showSizeChart && product.sizeChart && (
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
                    onClick={() =>
                      setRentalDays(Math.max(minRentalDays, rentalDays - 1))
                    }
                    disabled={rentalDays <= minRentalDays}
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
                        maxRentalDays
                          ? Math.min(maxRentalDays, rentalDays + 1)
                          : rentalDays + 1,
                      )
                    }
                    disabled={
                      maxRentalDays ? rentalDays >= maxRentalDays : false
                    }
                    className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-[#c1272d] disabled:opacity-50 disabled:hover:border-gray-300 transition-colors"
                  >
                    +
                  </button>
                </div>
                {rentalPolicy && (
                  <p className="text-sm text-gray-500 text-center mt-3">
                    Tối thiểu {rentalPolicy.minDays} ngày, tối đa{" "}
                    {rentalPolicy.maxDays} ngày
                  </p>
                )}
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
              {product.features.length > 0 && (
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
              )}

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
            {product.outfitDetails && (
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
                      {product.outfitDetails.silhouette || "Đang cập nhật"}
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
                      {isRoyalFormality(product.outfitDetails.formalityLevel)
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
                      {product.outfitDetails.occasion || "Đang cập nhật"}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                      <p className="text-sm text-gray-600">Màu Chủ Đạo</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full border-2 border-gray-300 ${getColorClass(
                          product.outfitDetails.colorPrimary,
                        )}`}
                      ></div>
                      <p className="text-lg text-gray-900 font-semibold">
                        {product.color || "Đang cập nhật"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Size Inventory Section */}
            {product.outfitSizes && product.outfitSizes.length > 0 && (
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
                        {product.outfitSizes.map((sizeData, index) => (
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
                                  isAvailableStatus(sizeData.status)
                                    ? "bg-green-100 text-green-700 hover:bg-green-100"
                                    : "bg-red-100 text-red-700 hover:bg-red-100"
                                } border-none`}
                              >
                                {isAvailableStatus(sizeData.status)
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
                {product.details && Object.keys(product.details).length > 0 ? (
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
                ) : (
                  <p className="text-sm text-gray-500">
                    Thông tin chi tiết đang được cập nhật.
                  </p>
                )}
              </div>

              {/* Reviews */}
              <div className="lg:col-span-2">
                <h3 className="text-2xl font-display text-[#1a1a1a] mb-6">
                  Đánh Giá ({totalReviewCount})
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

                      {/* Image Upload Icons - Similar to messenger style */}
                      <div className="mt-2 flex items-center gap-3">
                        <label
                          htmlFor="review-images"
                          className="cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors group"
                          title="Thêm hình ảnh"
                        >
                          <ImageIcon className="w-5 h-5 text-[#c1272d] group-hover:text-[#8b1e1f]" />
                        </label>

                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                          id="review-images"
                        />

                        <span className="text-xs text-gray-500">
                          {reviewImages.length > 0
                            ? `${reviewImages.length}/4 ảnh`
                            : "Thêm hình ảnh (tối đa 4 ảnh)"}
                        </span>
                      </div>

                      {/* Image Preview */}
                      {reviewImages.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {reviewImages.map((image, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={image}
                                alt={`Review ${index + 1}`}
                                className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-md opacity-0 group-hover:opacity-100"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={reviewAddStatus === "loading"}
                      className="w-full bg-gradient-to-r from-[#c1272d] to-[#8b1e1f] hover:from-[#8b1e1f] hover:to-[#c1272d] text-white h-12 font-semibold"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {reviewAddStatus === "loading"
                        ? "Đang gửi..."
                        : "Gửi Đánh Giá"}
                    </Button>
                  </div>
                </form>

                {/* Reviews List */}
                {reviewStatus === "loading" && (
                  <p className="text-sm text-gray-500 mb-4">
                    Đang tải đánh giá...
                  </p>
                )}
                {reviewStatus === "failed" && reviewError && (
                  <p className="text-sm text-red-600 mb-4">
                    {String(reviewError)}
                  </p>
                )}
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
                        {review.images.length > 0 && (
                          <div className="mt-4 grid grid-cols-2 gap-4">
                            {review.images.map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt={`Review ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : reviewStatus === "loading" ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-gray-500">Đang tải đánh giá...</p>
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
