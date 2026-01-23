import { useState } from "react";
import { Button } from "../ui/button";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";

interface WishlistItem {
  id: string;
  name: string;
  description?: string;
  image: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  badge?: "Bán chạy" | "Mới" | "Cao cấp";
}

export function WishlistTab() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    // Sample data - replace with actual data from API
    {
      id: "1",
      name: "Áo Dài Truyền Thống Đỏ",
      description: "Áo dài lụa tơ tằm cao cấp, thêu hoa sen tinh xảo",
      image: "https://images.unsplash.com/photo-1700721154874-78695c314eed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYW8lMjBkYWklMjB0cmFkaXRpb25hbHxlbnwxfHx8fDE3NjE4MDc4NDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      price: 1500000,
      inStock: true,
      badge: "Bán chạy"
    },
    {
      id: "2",
      name: "Áo Dài Cách Tân Hồng",
      description: "Thiết kế hiện đại kết hợp nét truyền thống",
      image: "https://images.unsplash.com/photo-1676697021566-0403052c42a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtJTIwdHJhZGl0aW9uYWwlMjBkcmVzcyUyMHdvbWFufGVufDF8fHx8MTc2MTgwNzg0N3ww&ixlib=rb-4.1.0&q=80&w=1080",
      price: 1800000,
      inStock: true,
      badge: "Mới"
    },
    {
      id: "4",
      name: "Áo Dài Lụa Xanh Ngọc",
      description: "Lụa hà đông mềm mại, in hoa cúc tinh tế",
      image: "https://images.unsplash.com/photo-1761635491338-f2767d72f997?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMHZpZXRuYW1lc2UlMjBjbG90aGluZyUyMHNpbGt8ZW58MXx8fHwxNzYxODA3ODQ4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      price: 1600000,
      inStock: true,
      badge: "Cao cấp"
    }
  ]);

  const handleRemove = (id: string) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== id));
  };

  const handleAddToCart = (item: WishlistItem) => {
    if (item.inStock) {
      alert(`Đã thêm "${item.name}" vào giỏ hàng!`);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Heart className="w-6 h-6 text-red-600 fill-red-600" />
          <h2 className="text-2xl text-gray-900">Danh Sách Yêu Thích</h2>
          <span className="text-gray-500">({wishlistItems.length} sản phẩm)</span>
        </div>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 mb-2">Danh sách yêu thích trống</p>
          <p className="text-sm text-gray-400 mb-4">Hãy lưu những sản phẩm yêu thích của bạn!</p>
          <Button className="bg-red-600 hover:bg-red-700 text-white">
            Khám phá ngay
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div 
              key={item.id}
              className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow group relative"
            >
              {/* Remove button */}
              <button
                onClick={() => handleRemove(item.id)}
                className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>

              {/* Product Image */}
              <div className="relative aspect-[3/4] overflow-hidden">
                {/* Badge */}
                {item.badge && (
                  <div className="absolute top-2 left-2 z-10">
                    <span className={`px-3 py-1 rounded text-xs text-white ${
                      item.badge === "Bán chạy" ? "bg-red-600" :
                      item.badge === "Mới" ? "bg-red-600" :
                      "bg-gradient-to-r from-blue-400 to-blue-600"
                    }`}>
                      {item.badge}
                    </span>
                  </div>
                )}
                
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {!item.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm">
                      Hết hàng
                    </span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="text-gray-900 mb-1">
                  {item.name}
                </h3>
                
                {item.description && (
                  <p className="text-sm text-gray-500 mb-3 line-clamp-1">
                    {item.description}
                  </p>
                )}
                
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-xl text-red-600">
                    {item.price.toLocaleString("vi-VN")}₫
                  </span>
                  <span className="text-sm text-gray-500">/ ngày</span>
                </div>

                <Button
                  onClick={() => handleAddToCart(item)}
                  disabled={!item.inStock}
                  className={`w-full ${
                    item.inStock
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {item.inStock ? "Thuê ngay" : "Hết hàng"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
