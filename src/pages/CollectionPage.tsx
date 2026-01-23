import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Footer } from "../components/Footer";
import { Heart, ShoppingBag, Filter, Search } from "lucide-react";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import aoDaiDoImage from "figma:asset/b676f286f6b218c0656933ecaec8526b08057179.png";

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

const collections = [
  {
    id: 1,
    name: "Áo Dài Truyền Thống Đỏ",
    category: "ao-dai",
    price: "1,500,000",
    priceNumeric: 1500000,
    style: "truyen-thong",
    color: "do",
    image: "https://images.unsplash.com/photo-1700721154874-78695c314eed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYW8lMjBkYWklMjB0cmFkaXRpb25hbHxlbnwxfHx8fDE3NjE4MDc4NDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Áo dài lụa tơ tằm cao cấp, thêu hoa sen tinh xảo",
    tag: "Bán chạy",
    available: true,
  },
  {
    id: 2,
    name: "Áo Dài Cách Tân Hồng",
    category: "ao-dai",
    price: "1,800,000",
    priceNumeric: 1800000,
    style: "hien-dai",
    color: "hong",
    image: "https://images.unsplash.com/photo-1676697021566-0403052c42a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtJTIwdHJhZGl0aW9uYWwlMjBkcmVzcyUyMHdvbWFufGVufDF8fHx8MTc2MTgwNzg0N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Thiết kế hiện đại kết hợp nét truyền thống",
    tag: "Mới",
    available: true,
  },
  {
    id: 3,
    name: "Áo Tứ Thân Hoàng Kim",
    category: "ao-tu-than",
    price: "2,200,000",
    priceNumeric: 2200000,
    style: "cong-so",
    color: "vang",
    image: aoDaiDoImage,
    description: "Trang phục cung đình, thêu rồng phượng sang trọng",
    tag: "Cao cấp",
    available: true,
  },
  {
    id: 4,
    name: "Áo Dài Lụa Xanh Ngọc",
    category: "ao-dai",
    price: "1,600,000",
    priceNumeric: 1600000,
    style: "dao-pho",
    color: "xanh",
    image: "https://images.unsplash.com/photo-1761635491338-f2767d72f997?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMHZpZXRuYW1lc2UlMjBjbG90aGluZyUyMHNpbGt8ZW58MXx8fHwxNzYxODA3ODQ4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Lụa hà đông mềm mại, in hoa cúc tinh tế",
    tag: "",
    available: true,
  },
  {
    id: 5,
    name: "Áo Nhật Bình Cách Điệu",
    category: "ao-nhat-binh",
    price: "1,400,000",
    priceNumeric: 1400000,
    style: "ca-tinh",
    color: "do",
    image: "https://images.unsplash.com/photo-1737219238630-86eb88e575a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwYXNpYW4lMjBkcmVzcyUyMHJlZHxlbnwxfHx8fDE3NjE4MDc4NDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Phong cách hoàng gia, chi tiết đính đá lấp lánh",
    tag: "Bán chạy",
    available: true,
  },
  {
    id: 6,
    name: "Áo Dài Trắng Tinh Khôi",
    category: "ao-dai",
    price: "1,350,000",
    priceNumeric: 1350000,
    style: "toi-gian",
    color: "trang",
    image: "https://images.unsplash.com/photo-1760341682582-afb4681164d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwY3VsdHVyZSUyMGRyZXNzJTIwYmx1ZXxlbnwxfHx8fDE3NjE4MDc4NDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Dành cho học sinh, nữ sinh với vẻ đẹp thanh lịch",
    tag: "",
    available: true,
  },
  {
    id: 7,
    name: "Áo Dài Tím Hoa Lavender",
    category: "ao-dai",
    price: "1,750,000",
    priceNumeric: 1750000,
    style: "hien-dai",
    color: "tim",
    image: "https://images.unsplash.com/photo-1700721154874-78695c314eed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYW8lMjBkYWklMjB0cmFkaXRpb25hbHxlbnwxfHx8fDE3NjE4MDc4NDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Áo dài tím nhạt in họa tiết hoa lavender nhẹ nhàng",
    tag: "Mới",
    available: true,
  },
  {
    id: 8,
    name: "Áo Bà Ba Cách Tân Đen",
    category: "ao-ba-ba",
    price: "950,000",
    priceNumeric: 950000,
    style: "ca-tinh",
    color: "den",
    image: "https://images.unsplash.com/photo-1676697021566-0403052c42a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtJTIwdHJhZGl0aW9uYWwlMjBkcmVzcyUyMHdvbWFufGVufDF8fHx8MTc2MTgwNzg0N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Phong cách miền Tây Nam Bộ hiện đại, thoải mái",
    tag: "",
    available: true,
  },
  {
    id: 9,
    name: "Áo Dài Vàng Hoa Mai",
    category: "ao-dai",
    price: "1,900,000",
    priceNumeric: 1900000,
    style: "truyen-thong",
    color: "vang",
    image: aoDaiDoImage,
    description: "Áo dài vàng thêu hoa mai đón Tết, rực rỡ tươi vui",
    tag: "Bán chạy",
    available: true,
  },
  {
    id: 10,
    name: "Áo Dài Xanh Dương Biển Cả",
    category: "ao-dai",
    price: "1,550,000",
    priceNumeric: 1550000,
    style: "dao-pho",
    color: "xanh-duong",
    image: "https://images.unsplash.com/photo-1761635491338-f2767d72f997?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMHZpZXRuYW1lc2UlMjBjbG90aGluZyUyMHNpbGt8ZW58MXx8fHwxNzYxODA3ODQ4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Màu xanh biển đậm, phù hợp dạo phố và sự kiện",
    tag: "",
    available: true,
  },
  {
    id: 11,
    name: "Áo Nhật Bình Hồng Phấn",
    category: "ao-nhat-binh",
    price: "2,100,000",
    priceNumeric: 2100000,
    style: "cong-so",
    color: "hong",
    image: "https://images.unsplash.com/photo-1737219238630-86eb88e575a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwYXNpYW4lMjBkcmVzcyUyMHJlZHxlbnwxfHx8fDE3NjE4MDc4NDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Trang phục cổ trang, sang trọng và quý phái",
    tag: "Cao cấp",
    available: true,
  },
  {
    id: 12,
    name: "Áo Dài Đỏ Cưới Hỏi",
    category: "ao-dai",
    price: "2,500,000",
    priceNumeric: 2500000,
    style: "cuoi",
    color: "do",
    image: "https://images.unsplash.com/photo-1700721154874-78695c314eed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYW8lMjBkYWklMjB0cmFkaXRpb25hbHxlbnwxfHx8fDE3NjE4MDc4NDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Áo dài cô dâu màu đỏ thêu rồng phượng vàng kim",
    tag: "Cao cấp",
    available: true,
  },
  {
    id: 13,
    name: "Áo Tứ Thân Xanh Lá",
    category: "ao-tu-than",
    price: "1,850,000",
    priceNumeric: 1850000,
    style: "truyen-thong",
    color: "xanh",
    image: "https://images.unsplash.com/photo-1676697021566-0403052c42a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtJTIwdHJhZGl0aW9uYWwlMjBkcmVzcyUyMHdvbWFufGVufDF8fHx8MTc2MTgwNzg0N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Trang phục truyền thống phụ nữ Việt xưa",
    tag: "",
    available: true,
  },
  {
    id: 14,
    name: "Áo Dài Hồng Phấn Cưới",
    category: "ao-dai",
    price: "2,300,000",
    priceNumeric: 2300000,
    style: "cuoi",
    color: "hong",
    image: aoDaiDoImage,
    description: "Áo dài phù dâu màu hồng pastel nhẹ nhàng",
    tag: "Mới",
    available: true,
  },
  {
    id: 15,
    name: "Áo Dài Trắng Học Sinh",
    category: "ao-dai",
    price: "1,200,000",
    priceNumeric: 1200000,
    style: "toi-gian",
    color: "trang",
    image: "https://images.unsplash.com/photo-1760341682582-afb4681164d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwY3VsdHVyZSUyMGRyZXNzJTIwYmx1ZXxlbnwxfHx8fDE3NjE4MDc4NDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Áo dài trắng truyền thống cho nữ sinh",
    tag: "Bán chạy",
    available: true,
  },
  {
    id: 16,
    name: "Áo Nhật Bình Vàng Kim",
    category: "ao-nhat-binh",
    price: "2,400,000",
    priceNumeric: 2400000,
    style: "cong-so",
    color: "vang",
    image: "https://images.unsplash.com/photo-1737219238630-86eb88e575a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwYXNpYW4lMjBkcmVzcyUyMHJlZHxlbnwxfHx8fDE3NjE4MDc4NDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Áo hoàng hậu thời xưa, xa hoa lộng lẫy",
    tag: "Cao cấp",
    available: true,
  },
  {
    id: 17,
    name: "Áo Dài Đen Cá Tính",
    category: "ao-dai",
    price: "1,650,000",
    priceNumeric: 1650000,
    style: "ca-tinh",
    color: "den",
    image: "https://images.unsplash.com/photo-1761635491338-f2767d72f997?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMHZpZXRuYW1lc2UlMjBjbG90aGluZyUyMHNpbGt8ZW58MXx8fHwxNzYxODA3ODQ4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Áo dài đen hiện đại, phá cách và năng động",
    tag: "",
    available: true,
  },
  {
    id: 18,
    name: "Áo Dài Tím Pastel Dạo Phố",
    category: "ao-dai",
    price: "1,450,000",
    priceNumeric: 1450000,
    style: "dao-pho",
    color: "tim",
    image: "https://images.unsplash.com/photo-1700721154874-78695c314eed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYW8lMjBkYWklMjB0cmFkaXRpb25hbHxlbnwxfHx8fDE3NjE4MDc4NDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    description: "Thiết kế trẻ trung, phù hợp đi dạo phố",
    tag: "Mới",
    available: true,
  },
];

export function CollectionPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedStyle, setSelectedStyle] = useState("all");
  const [selectedColor, setSelectedColor] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [displayCount, setDisplayCount] = useState(8); // Initially show 8 products

  const handleRentNow = () => {
    // TODO: Check if user is logged in via your API
    // For now, just navigate to checkout
    navigate("/thanh-toan");
  };

  const filteredCollections = collections.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStyle = selectedStyle === "all" || item.style === selectedStyle;
    const matchColor = selectedColor === "all" || item.color === selectedColor;
    
    let matchPrice = true;
    if (selectedPriceRange !== "all") {
      const range = priceRanges.find(r => r.id === selectedPriceRange);
      if (range && range.min !== undefined && range.max !== undefined) {
        matchPrice = item.priceNumeric >= range.min && item.priceNumeric < range.max;
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
          <div className="absolute top-20 right-20 w-96 h-96 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%)' }} />
          <div className="absolute bottom-20 left-20 w-[500px] h-[500px] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(193,39,45,0.3) 0%, transparent 70%)' }} />
        </div>

        {/* Vietnamese Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
        }} />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text Content */}
            <div>
              <div className="inline-block mb-6">
                <span className="text-[#d4af37] uppercase tracking-[0.3em] text-sm">Collection</span>
                <div className="h-px w-full bg-gradient-to-r from-[#d4af37] to-transparent mt-2" />
              </div>
              <h1 className="text-6xl lg:text-7xl font-display text-white mb-8 leading-[1.1] tracking-tight">
                Bộ Sưu Tập
                <br />
                <span className="text-gradient-gold italic">Trang Phục</span>
                <br />
                <span className="text-5xl lg:text-6xl text-white/90">Truyền Thống</span>
              </h1>
              <p className="text-white/70 text-lg lg:text-xl leading-relaxed max-w-xl">
                Khám phá vẻ đẹp bản sắc Việt qua từng chi tiết tinh xảo của trang phục truyền thống. 
                Mỗi bộ trang phục là một câu chuyện văn hóa đậm chất nghệ thuật.
              </p>
              <div className="mt-10 flex items-center gap-12">
                <div>
                  <div className="text-4xl font-display text-gradient-gold mb-2">500+</div>
                  <p className="text-white/50 text-sm uppercase tracking-wider">Thiết Kế</p>
                </div>
                <div>
                  <div className="text-4xl font-display text-gradient-gold mb-2">18</div>
                  <p className="text-white/50 text-sm uppercase tracking-wider">Danh Mục</p>
                </div>
              </div>
            </div>

            {/* Right: Image Grid */}
            <div className="grid grid-cols-2 gap-4">
              {collections.slice(0, 4).map((item, index) => (
                <div 
                  key={item.id} 
                  className="relative aspect-square overflow-hidden bg-[#f5f5f0] group cursor-pointer"
                  style={{
                    animationDelay: `${index * 0.1}s`
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
            <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
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
                  <button className="absolute top-6 right-6 w-11 h-11 bg-white/95 backdrop-blur-sm flex items-center justify-center hover:bg-[#c1272d] hover:text-white transition-all duration-300 group/heart">
                    <Heart className="w-5 h-5 group-hover/heart:fill-current" />
                  </button>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute bottom-6 left-6 right-6 flex gap-3">
                      <Button 
                        className="flex-1 bg-white text-[#1a1a1a] hover:bg-[#d4af37] hover:text-white transition-all duration-300 shadow-gold"
                        onClick={handleRentNow}
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Thuê Ngay
                      </Button>
                      <Button 
                        className="flex-1 bg-gradient-to-r from-[#c1272d] to-[#8b1e1f] hover:from-[#8b1e1f] hover:to-[#c1272d] text-white shadow-gold"
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
                onClick={() => setDisplayCount(prev => prev + 8)}
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
          {filteredCollections.length === 0 && (
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