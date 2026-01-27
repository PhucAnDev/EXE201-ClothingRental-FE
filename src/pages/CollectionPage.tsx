import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Footer } from "../components/Footer";
import { Heart, ShoppingBag, Filter, Search } from "lucide-react";
import { Input } from "../components/ui/input";
import type { AppDispatch, RootState } from "../store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  getOutfitImages,
  getOutfits,
  type OutfitImageItem,
  type OutfitItem,
} from "../features/outfit/outfitService";
import {
  addToWishlist,
  clearWishlistStatus,
} from "../features/wishlist/wishlistSlice";

const categories = [
  { id: "all", label: "Tất cả" },
  { id: "ao-dai", label: "Áo dài" },
  { id: "ao-tu-than", label: "Áo tứ thân" },
  { id: "ao-nhat-binh", label: "Áo nhật bình" },
  { id: "ao-ba-ba", label: "Áo bà ba" },
];

const styles = [
  { id: "all", label: "Lọc theo phong cách (Tất cả)" },
  { id: "truyen-thong", label: "Truyền thống" },
  { id: "hien-dai", label: "Hiện đại" },
  { id: "cong-so", label: "Cổ sở" },
  { id: "dao-pho", label: "Dạo phố" },
  { id: "ca-tinh", label: "Cá tính" },
  { id: "cuoi", label: "Cưới" },
  { id: "toi-gian", label: "Tối giản" },
];

const colors = [
  { id: "all", label: "Lọc theo màu sắc (Tất cả)" },
  { id: "do", label: "Đỏ", hex: "#dc2626" },
  { id: "hong", label: "Hồng", hex: "#ec4899" },
  { id: "vang", label: "Vàng", hex: "#eab308" },
  { id: "xanh", label: "Xanh lá", hex: "#22c55e" },
  { id: "xanh-duong", label: "Xanh dương", hex: "#3b82f6" },
  { id: "tim", label: "Tím", hex: "#a855f7" },
  { id: "trang", label: "Trắng", hex: "#ffffff" },
  { id: "den", label: "Đen", hex: "#000000" },
];

const priceRanges = [
  { id: "all", label: "Lọc theo giá (Tất cả)" },
  { id: "duoi-1.5", label: "Dưới 1.500.000đ", min: 0, max: 1500000 },
  { id: "1.5-2", label: "1.500.000đ - 2.000.000đ", min: 1500000, max: 2000000 },
  { id: "tren-2", label: "Trên 2.000.000đ", min: 2000000, max: Infinity },
];

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const normalizeCategory = (value: string) => {
  const normalized = normalizeText(value);
  if (normalized.includes("ao dai")) return "ao-dai";
  if (normalized.includes("ao tu than")) return "ao-tu-than";
  if (normalized.includes("ao nhat binh")) return "ao-nhat-binh";
  if (normalized.includes("ao ba ba")) return "ao-ba-ba";
  return "all";
};

const normalizeStyle = (value: string) => {
  const normalized = normalizeText(value);
  if (normalized.includes("truyen thong")) return "truyen-thong";
  if (normalized.includes("hien dai")) return "hien-dai";
  if (normalized.includes("cong so")) return "cong-so";
  if (normalized.includes("dao pho")) return "dao-pho";
  if (normalized.includes("ca tinh")) return "ca-tinh";
  if (normalized.includes("cuoi")) return "cuoi";
  if (normalized.includes("toi gian")) return "toi-gian";
  return "all";
};

const inferColor = (value: string) => {
  const normalized = normalizeText(value);
  if (normalized.includes("xanh duong")) return "xanh-duong";
  if (normalized.includes("xanh")) return "xanh";
  if (normalized.includes("do")) return "do";
  if (normalized.includes("hong")) return "hong";
  if (normalized.includes("vang")) return "vang";
  if (normalized.includes("tim")) return "tim";
  if (normalized.includes("trang")) return "trang";
  if (normalized.includes("den")) return "den";
  return "all";
};

const selectPrimaryImage = (images: OutfitImageItem[]) => {
  if (!images.length) return "";
  const sorted = [...images].sort((a, b) => {
    const aOrder =
      typeof a.sortOrder === "number" ? a.sortOrder : Number.POSITIVE_INFINITY;
    const bOrder =
      typeof b.sortOrder === "number" ? b.sortOrder : Number.POSITIVE_INFINITY;
    return aOrder - bOrder;
  });
  return sorted[0]?.imageUrl || "";
};

export function CollectionPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { status: wishlistStatus, message: wishlistMessage, addingId } =
    useSelector((state: RootState) => state.wishlist);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedStyle, setSelectedStyle] = useState("all");
  const [selectedColor, setSelectedColor] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [displayCount, setDisplayCount] = useState(8); // Initially show 8 products
  const [outfits, setOutfits] = useState<OutfitItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchOutfits = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("authToken");
        const res = await getOutfits(token);
        const list = Array.isArray(res?.data) ? res.data : [];

        const withImages = await Promise.all(
          list.map(async (outfit) => {
            const outfitId = outfit.outfitId;
            if (!outfitId) {
              return {
                ...outfit,
                primaryImageUrl: outfit.primaryImageUrl ?? "",
              };
            }

            try {
              const imageRes = await getOutfitImages(outfitId, token);
              const images = Array.isArray(imageRes?.data) ? imageRes.data : [];
              const primaryImageUrl =
                selectPrimaryImage(images) || outfit.primaryImageUrl || "";
              return { ...outfit, primaryImageUrl };
            } catch (err) {
              return {
                ...outfit,
                primaryImageUrl: outfit.primaryImageUrl ?? "",
              };
            }
          }),
        );

        if (isMounted) {
          setOutfits(withImages);
        }
      } catch (err) {
        if (isMounted) {
          setError("Không thể tải danh sách trang phục.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchOutfits();

    return () => {
      isMounted = false;
    };
  }, []);
  useEffect(() => {
    if (wishlistStatus === "succeeded") {
      alert(wishlistMessage || "Đã thêm outfit vào danh sách yêu thích của bạn.");
      dispatch(clearWishlistStatus());
    }
    if (wishlistStatus === "failed") {
      alert("Outfit đã được thêm vào danh sách yêu thích.");
      dispatch(clearWishlistStatus());
    }
  }, [dispatch, wishlistMessage, wishlistStatus]);

  const collectionItems = useMemo(() => {
    return outfits.map((outfit, index) => {
      const rawPrice = outfit.baseRentalPrice;
      const basePrice =
        typeof rawPrice === "number" ? rawPrice : Number(rawPrice) || 0;
      const displayName = outfit.name || "Chưa có tên";
      const categoryText = outfit.categoryName || displayName;
      const styleText = outfit.type || outfit.categoryName || "";

      return {
        id: outfit.outfitId ?? index,
        name: displayName,
        category: normalizeCategory(categoryText),
        price: basePrice.toLocaleString("vi-VN"),
        priceNumeric: basePrice,
        style: normalizeStyle(styleText),
        color: inferColor(displayName),
        image: outfit.primaryImageUrl || "",
        description: outfit.description || "",
        tag: outfit.isLimited ? "Cao cấp" : "",
        available: outfit.status
          ? outfit.status.toLowerCase() === "available"
          : true,
        createdAt: outfit.createdAt,
      };
    });
  }, [outfits]);

  const handleRentNow = () => {
    // TODO: Check if user is logged in via your API
    // For now, just navigate to checkout
    navigate("/thanh-toan");
  };

  const filteredCollections = collectionItems.filter((item) => {
    const matchSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchStyle = selectedStyle === "all" || item.style === selectedStyle;
    const matchColor = selectedColor === "all" || item.color === selectedColor;

    let matchPrice = true;
    if (selectedPriceRange !== "all") {
      const range = priceRanges.find((r) => r.id === selectedPriceRange);
      if (range && range.min !== undefined && range.max !== undefined) {
        matchPrice =
          item.priceNumeric >= range.min && item.priceNumeric < range.max;
      }
    }

    return matchSearch && matchStyle && matchColor && matchPrice;
  });

  // Get displayed collections based on displayCount
  const displayedCollections = filteredCollections.slice(0, displayCount);
  const hasMore = filteredCollections.length > displayCount;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdfcfb] via-white to-[#fef9f3]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-8 lg:px-12 bg-gradient-to-br from-[#1a1a1a] via-[#2d1a1a] to-black overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute top-20 right-20 w-96 h-96 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-20 left-20 w-[500px] h-[500px] rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(193,39,45,0.3) 0%, transparent 70%)",
            }}
          />
        </div>

        {/* Vietnamese Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text Content */}
            <div>
              <div className="inline-block mb-6">
                <span className="text-[#d4af37] uppercase tracking-[0.3em] text-sm">
                  Collection
                </span>
                <div className="h-px w-full bg-gradient-to-r from-[#d4af37] to-transparent mt-2" />
              </div>
              <h1 className="text-6xl lg:text-7xl font-display text-white mb-8 leading-[1.1] tracking-tight">
                Bộ Sưu Tập
                <br />
                <span className="text-gradient-gold italic">Trang Phục</span>
                <br />
                <span className="text-5xl lg:text-6xl text-white/90">
                  Truyền Thống
                </span>
              </h1>
              <p className="text-white/70 text-lg lg:text-xl leading-relaxed max-w-xl">
                Khám phá vẻ đẹp bản sắc Việt qua từng chi tiết tinh xảo của
                trang phục truyền thống. Mỗi bộ trang phục là một câu chuyện văn
                hóa đậm chất nghệ thuật.
              </p>
              <div className="mt-10 flex items-center gap-12">
                <div>
                  <div className="text-4xl font-display text-gradient-gold mb-2">
                    500+
                  </div>
                  <p className="text-white/50 text-sm uppercase tracking-wider">
                    Thiết Kế
                  </p>
                </div>
                <div>
                  <div className="text-4xl font-display text-gradient-gold mb-2">
                    18
                  </div>
                  <p className="text-white/50 text-sm uppercase tracking-wider">
                    Danh Mục
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Image Grid */}
            <div className="grid grid-cols-2 gap-4">
              {collectionItems.slice(0, 4).map((item, index) => (
                <div
                  key={item.id}
                  className="relative aspect-square overflow-hidden bg-[#f5f5f0] group cursor-pointer"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#d4af37]/40 transition-colors duration-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filter & Search Section */}
      <section className="sticky top-20 z-40 glass-effect shadow-luxury border-b border-[#d4af37]/10">
        <div className="max-w-7xl mx-auto px-8 lg:px-12 py-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Tìm kiếm trang phục..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Style Filter */}
            <Select value={selectedStyle} onValueChange={setSelectedStyle}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Lọc theo phong cách (Tất cả)" />
              </SelectTrigger>
              <SelectContent>
                {styles.map((style) => (
                  <SelectItem key={style.id} value={style.id}>
                    {style.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Color Filter */}
            <Select value={selectedColor} onValueChange={setSelectedColor}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Lọc theo màu sắc (Tất cả)" />
              </SelectTrigger>
              <SelectContent>
                {colors.map((color) => (
                  <SelectItem key={color.id} value={color.id}>
                    <div className="flex items-center gap-2">
                      {color.hex && (
                        <div
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: color.hex }}
                        />
                      )}
                      <span>{color.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Price Range Filter */}
            <Select
              value={selectedPriceRange}
              onValueChange={setSelectedPriceRange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Lọc theo giá (Tất cả)" />
              </SelectTrigger>
              <SelectContent>
                {priceRanges.map((range) => (
                  <SelectItem key={range.id} value={range.id}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
                <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
                <SelectItem value="popular">Phổ biến nhất</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Collection Grid */}
      <section className="py-24 px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {loading && (
            <p className="text-sm text-gray-500 mb-6">
              Đang tải danh sách trang phục...
            </p>
          )}
          {error && <p className="text-sm text-red-600 mb-6">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayedCollections.map((item) => (
              <div
                key={item.id}
                className="group bg-white overflow-hidden transition-all duration-500 hover:shadow-luxury"
              >
                {/* Image */}
                <div className="relative aspect-[3/4.5] overflow-hidden bg-[#f5f5f0]">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-[1.08] transition-transform duration-700 ease-out"
                  />

                  {/* Badge */}
                  {item.tag && (
                    <Badge className="absolute top-6 left-6 bg-gradient-to-r from-[#c1272d] to-[#8b1e1f] text-white border-none shadow-gold uppercase tracking-wider text-xs">
                      {item.tag}
                    </Badge>
                  )}

                  {/* Favorite Button */}
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      const parsedId = Number(item.id);
                      if (!Number.isFinite(parsedId)) return;
                      dispatch(addToWishlist(parsedId));
                    }}
                    disabled={addingId === Number(item.id)}
                    className="absolute top-6 right-6 z-30 w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-700 shadow-lg transition-all duration-300 group/heart hover:bg-[#c1272d] hover:shadow-xl disabled:opacity-70"
                    aria-label="Thêm vào danh sách yêu thích"
                    title="Thêm vào danh sách yêu thích"
                  >
                    <Heart className="w-5 h-5 text-gray-700 fill-transparent transition-colors group-hover/heart:text-white group-hover/heart:fill-white" />
                  </button>

                  {/* Overlay */}
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute bottom-6 left-6 right-6 flex gap-3">
                      <Button
                        className="pointer-events-auto flex-1 bg-white text-[#1a1a1a] hover:bg-[#d4af37] hover:text-white transition-all duration-300 shadow-gold"
                        onClick={handleRentNow}
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Thuê Ngay
                      </Button>
                      <Button
                        className="pointer-events-auto flex-1 bg-gradient-to-r from-[#c1272d] to-[#8b1e1f] hover:from-[#8b1e1f] hover:to-[#c1272d] text-white shadow-gold"
                        onClick={() => navigate(`/san-pham/${item.id}`)}
                      >
                        Chi Tiết
                      </Button>
                    </div>
                  </div>

                  {/* Border Accent */}
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#d4af37]/30 transition-colors duration-500 pointer-events-none" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-display text-[#1a1a1a] mb-2 group-hover:text-[#c1272d] transition-colors duration-300">
                    {item.name}
                  </h3>
                  <p className="text-[#6b6b6b] text-sm mb-4 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-display text-[#c1272d] tracking-tight">
                      {item.price} ₫
                    </span>
                    <span className="text-sm text-[#6b6b6b]">/ ngày</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {hasMore && (
            <div className="flex flex-col items-center mt-20 gap-4">
              <Button
                onClick={() => setDisplayCount((prev) => prev + 8)}
                size="lg"
                className="relative overflow-hidden border-2 border-[#c1272d] bg-transparent text-[#c1272d] hover:text-white px-16 h-14 text-base uppercase tracking-wider group shadow-luxury"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#c1272d] to-[#8b1e1f] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative">Xem Thêm Trang Phục</span>
              </Button>
              <p className="text-[#6b6b6b] text-sm italic">
                Còn {filteredCollections.length - displayCount} sản phẩm khác
              </p>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredCollections.length === 0 && (
            <div className="text-center py-32">
              <Filter className="w-20 h-20 text-[#d4af37]/30 mx-auto mb-6" />
              <h3 className="text-3xl font-display text-[#1a1a1a] mb-3">
                Không Tìm Thấy Trang Phục
              </h3>
              <p className="text-[#6b6b6b] text-lg max-w-md mx-auto">
                Hãy thử tìm kiếm với từ khóa khác hoặc chọn danh mục khác
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
