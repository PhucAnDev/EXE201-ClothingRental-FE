import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Package,
  Heart,
  Settings,
  Camera,
  Edit2,
  Save,
  X,
  Clock,
  CheckCircle,
  XCircle,
  Star,
  Lock
} from "lucide-react";
import { motion } from "motion/react";

export function ProfilePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "info";
  
  // Check if user is logged in
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (!savedUser) {
      navigate("/");
      return null;
    }
    return JSON.parse(savedUser);
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    address: user?.address || "123 Đường ABC, Quận 1, TP.HCM",
    birthDate: user?.birthDate || "1990-01-01"
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  // Mock data for orders
  const [orders] = useState([
    {
      id: "ORD001",
      productName: "Áo Dài Truyền Thống Đỏ",
      image: "https://images.unsplash.com/photo-1700721154874-78695c314eed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYW8lMjBkYWklMjB0cmFkaXRpb25hbHxlbnwxfHx8fDE3NjE4MDc4NDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
      size: "M",
      rentalDays: 3,
      totalPrice: 4500000,
      status: "completed",
      orderDate: "2024-12-01",
      rentalDate: "2024-12-15",
      returnDate: "2024-12-18"
    },
    {
      id: "ORD002",
      productName: "Áo Tứ Thân Hoàng Kim",
      image: "https://images.unsplash.com/photo-1676697021566-0403052c42a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtJTIwdHJhZGl0aW9uYWwlMjBkcmVzcyUyMHdvbWFufGVufDF8fHx8MTc2MTgwNzg0N3ww&ixlib=rb-4.1.0&q=80&w=1080",
      size: "L",
      rentalDays: 2,
      totalPrice: 4400000,
      status: "active",
      orderDate: "2025-01-05",
      rentalDate: "2025-01-10",
      returnDate: "2025-01-12"
    },
    {
      id: "ORD003",
      productName: "Áo Dài Cách Tân Hồng",
      image: "https://images.unsplash.com/photo-1761635491338-f2767d72f997?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMHZpZXRuYW1lc2UlMjBjbG90aGluZyUyMHNpbGt8ZW58MXx8fHwxNzYxODA3ODQ4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      size: "S",
      rentalDays: 1,
      totalPrice: 1800000,
      status: "pending",
      orderDate: "2025-01-13",
      rentalDate: "2025-01-20",
      returnDate: "2025-01-21"
    }
  ]);
  
  // Mock data for wishlist
  const [wishlist, setWishlist] = useState([
    {
      id: 1,
      name: "Áo Dài Trắng Tinh Khôi",
      price: 1350000,
      image: "https://images.unsplash.com/photo-1760341682582-afb4681164d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwY3VsdHVyZSUyMGRyZXNzJTIwYmx1ZXxlbnwxfHx8fDE3NjE4MDc4NDl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.8,
      available: true
    },
    {
      id: 4,
      name: "Áo Dải Lụa Xanh Ngọc",
      price: 1600000,
      image: "https://images.unsplash.com/photo-1761635491338-f2767d72f997?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMHZpZXRuYW1lc2UlMjBjbG90aGluZyUyMHNpbGt8ZW58MXx8fHwxNzYxODA3ODQ4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.9,
      available: true
    }
  ]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const handleSave = () => {
    const updatedUser = { ...user, ...formData };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false);
    alert("Đã lưu thông tin!");
  };
  
  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || "",
      phone: user?.phone || "",
      address: user?.address || "",
      birthDate: user?.birthDate || ""
    });
    setIsEditing(false);
  };
  
  const handleChangePassword = () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Mật khẩu mới không khớp!");
      return;
    }
    
    if (passwordData.newPassword.length < 5) {
      alert("Mật khẩu phải có ít nhất 5 ký tự!");
      return;
    }
    
    alert("Đã đổi mật khẩu thành công!");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500 text-white"><CheckCircle className="w-3 h-3 mr-1" /> Hoàn thành</Badge>;
      case "active":
        return <Badge className="bg-blue-500 text-white"><Clock className="w-3 h-3 mr-1" /> Đang thuê</Badge>;
      case "pending":
        return <Badge className="bg-yellow-500 text-white"><Clock className="w-3 h-3 mr-1" /> Chờ xử lý</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500 text-white"><XCircle className="w-3 h-3 mr-1" /> Đã hủy</Badge>;
      default:
        return null;
    }
  };
  
  const switchTab = (tab) => {
    setSearchParams({ tab });
    setIsEditing(false);
  };
  
  const handleRemoveFromWishlist = (itemId) => {
    setWishlist(wishlist.filter(item => item.id !== itemId));
  };
  
  if (!user) return null;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-[#fdfcfb] via-white to-[#fef9f3] pt-20">
        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
          {/* Avatar Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="relative inline-block mb-6">
              {/* Avatar Container with Gradient Ring */}
              <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-[#c1272d] via-[#d4af37] to-[#c1272d] p-1.5 shadow-2xl">
                <div className="w-full h-full rounded-full bg-white p-1.5">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[#c1272d] to-[#d4af37] flex items-center justify-center">
                    <span className="text-white text-5xl font-display">
                      {user.fullName.charAt(0)}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Camera Button */}
              <button className="absolute bottom-2 right-2 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center hover:bg-gray-50 transition-all border-2 border-gray-100 group">
                <Camera className="w-5 h-5 text-gray-600 group-hover:text-[#c1272d] transition-colors" />
              </button>
            </div>
            
            {/* User Info */}
            <h2 className="font-display text-3xl text-[#1a1a1a] mb-2">{user.fullName}</h2>
            <p className="text-gray-500 mb-3">{user.email}</p>
            <Badge className="bg-gradient-to-r from-[#d4af37] to-[#c1272d] text-white border-none px-4 py-1 text-sm">
              Thành viên VIP
            </Badge>
          </motion.div>

          {/* Tabs Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex justify-center border-b border-gray-200">
              <div className="flex gap-1 -mb-px">
                <button
                  onClick={() => switchTab("info")}
                  className={`px-8 py-4 font-medium transition-all relative group ${
                    activeTab === "info"
                      ? "text-[#c1272d] border-b-2 border-[#c1272d]"
                      : "text-gray-600 hover:text-[#c1272d]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Thông tin
                  </span>
                </button>
                
                <button
                  onClick={() => switchTab("orders")}
                  className={`px-8 py-4 font-medium transition-all relative group ${
                    activeTab === "orders"
                      ? "text-[#c1272d] border-b-2 border-[#c1272d]"
                      : "text-gray-600 hover:text-[#c1272d]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Đơn thuê
                  </span>
                </button>
                
                <button
                  onClick={() => switchTab("wishlist")}
                  className={`px-8 py-4 font-medium transition-all relative group ${
                    activeTab === "wishlist"
                      ? "text-[#c1272d] border-b-2 border-[#c1272d]"
                      : "text-gray-600 hover:text-[#c1272d]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Yêu thích
                  </span>
                </button>
                
                <button
                  onClick={() => switchTab("settings")}
                  className={`px-8 py-4 font-medium transition-all relative group ${
                    activeTab === "settings"
                      ? "text-[#c1272d] border-b-2 border-[#c1272d]"
                      : "text-gray-600 hover:text-[#c1272d]"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Cài đặt
                  </span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-luxury p-8 min-h-[500px]"
          >
            {/* Thông tin Tab */}
            {activeTab === "info" && (
              <div>
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-display text-[#1a1a1a]">Thông tin cá nhân</h3>
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="bg-gradient-to-r from-[#c1272d] to-[#8b1e1f] text-white hover:shadow-lg"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Chỉnh sửa
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSave}
                        className="bg-gradient-to-r from-[#c1272d] to-[#8b1e1f] text-white hover:shadow-lg"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Lưu
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="border-gray-300"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Hủy
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4 text-[#c1272d]" />
                      Họ và tên
                    </label>
                    <Input
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      disabled={!isEditing}
                      className="h-12 bg-gray-50 border-gray-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#c1272d]" />
                      Email
                    </label>
                    <Input
                      value={user.email}
                      disabled
                      className="h-12 bg-gray-100 border-gray-200 cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#c1272d]" />
                      Số điện thoại
                    </label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                      className="h-12 bg-gray-50 border-gray-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#c1272d]" />
                      Ngày sinh
                    </label>
                    <Input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      disabled={!isEditing}
                      className="h-12 bg-gray-50 border-gray-200"
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#c1272d]" />
                      Địa chỉ
                    </label>
                    <Input
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      disabled={!isEditing}
                      className="h-12 bg-gray-50 border-gray-200"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Đơn thuê Tab */}
            {activeTab === "orders" && (
              <div>
                <h3 className="text-2xl font-display text-[#1a1a1a] mb-8">Đơn thuê của tôi</h3>
                
                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left py-4 px-4 font-medium text-gray-700">Sản phẩm</th>
                        <th className="text-left py-4 px-4 font-medium text-gray-700">Mã đơn</th>
                        <th className="text-center py-4 px-4 font-medium text-gray-700">Size</th>
                        <th className="text-center py-4 px-4 font-medium text-gray-700">Số ngày thuê</th>
                        <th className="text-left py-4 px-4 font-medium text-gray-700">Ngày thuê</th>
                        <th className="text-center py-4 px-4 font-medium text-gray-700">Trạng thái</th>
                        <th className="text-right py-4 px-4 font-medium text-gray-700">Tổng tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr
                          key={order.id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          {/* Product Image & Name */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={order.image}
                                alt={order.productName}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <span className="font-medium text-[#1a1a1a] min-w-[150px]">
                                {order.productName}
                              </span>
                            </div>
                          </td>
                          
                          {/* Order ID */}
                          <td className="py-4 px-4 text-gray-600">
                            {order.id}
                          </td>
                          
                          {/* Size */}
                          <td className="py-4 px-4 text-center font-medium">
                            {order.size}
                          </td>
                          
                          {/* Rental Days */}
                          <td className="py-4 px-4 text-center">
                            {order.rentalDays} ngày
                          </td>
                          
                          {/* Rental Date */}
                          <td className="py-4 px-4 text-gray-600">
                            {order.rentalDate}
                          </td>
                          
                          {/* Status */}
                          <td className="py-4 px-4 text-center">
                            {getStatusBadge(order.status)}
                          </td>
                          
                          {/* Total Price */}
                          <td className="py-4 px-4 text-right">
                            <span className="font-bold text-[#c1272d]">
                              {order.totalPrice.toLocaleString('vi-VN')}đ
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Empty State */}
                {orders.length === 0 && (
                  <div className="text-center py-16">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Bạn chưa có đơn thuê nào</p>
                  </div>
                )}
              </div>
            )}

            {/* Yêu thích Tab */}
            {activeTab === "wishlist" && (
              <div>
                <h3 className="text-2xl font-display text-[#1a1a1a] mb-8">Sản phẩm yêu thích</h3>
                
                {wishlist.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {wishlist.map((item) => (
                      <div
                        key={item.id}
                        className="group bg-white overflow-hidden transition-all duration-500 hover:shadow-luxury cursor-pointer"
                        onClick={() => navigate(`/san-pham/${item.id}`)}
                      >
                        {/* Image */}
                        <div className="relative aspect-[3/4.5] overflow-hidden bg-[#f5f5f0]">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-[1.08] transition-transform duration-700 ease-out"
                          />
                          
                          {/* Remove Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFromWishlist(item.id);
                            }}
                            className="absolute top-4 right-4 w-10 h-10 bg-white/95 backdrop-blur-sm flex items-center justify-center hover:bg-[#c1272d] hover:text-white transition-all duration-300 group/heart shadow-lg"
                          >
                            <X className="w-5 h-5" />
                          </button>
                          
                          {/* Border Accent */}
                          <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#d4af37]/30 transition-colors duration-500 pointer-events-none" />
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          <h3 className="text-lg font-display text-[#1a1a1a] mb-2 group-hover:text-[#c1272d] transition-colors duration-300 line-clamp-1">
                            {item.name}
                          </h3>
                          <div className="flex items-center justify-between">
                            <span className="text-xl font-display text-[#c1272d] tracking-tight">
                              {item.price.toLocaleString('vi-VN')} ₫
                            </span>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-[#d4af37] text-[#d4af37]" />
                              <span className="text-sm font-medium text-gray-600">{item.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Chưa có sản phẩm yêu thích</p>
                  </div>
                )}
              </div>
            )}

            {/* Cài đặt Tab */}
            {activeTab === "settings" && (
              <div>
                <h3 className="text-2xl font-display text-[#1a1a1a] mb-8">C��i đặt tài khoản</h3>
                
                <div className="max-w-2xl">
                  <div className="bg-gradient-to-r from-[#c1272d]/5 to-[#d4af37]/5 border border-[#c1272d]/20 rounded-xl p-6 mb-8">
                    <h4 className="font-display text-xl text-[#1a1a1a] mb-4 flex items-center gap-2">
                      <Lock className="w-5 h-5 text-[#c1272d]" />
                      Đổi mật khẩu
                    </h4>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Mật khẩu hiện tại
                        </label>
                        <Input
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          className="h-12 bg-white border-gray-200"
                          placeholder="Nhập mật khẩu hiện tại"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Mật khẩu mới
                        </label>
                        <Input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          className="h-12 bg-white border-gray-200"
                          placeholder="Nhập mật khẩu mới"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          Xác nhận mật khẩu mới
                        </label>
                        <Input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          className="h-12 bg-white border-gray-200"
                          placeholder="Nhập lại mật khẩu mới"
                        />
                      </div>

                      <Button
                        onClick={handleChangePassword}
                        className="bg-gradient-to-r from-[#c1272d] to-[#8b1e1f] text-white hover:shadow-lg w-full h-12"
                      >
                        Đổi mật kh��u
                      </Button>
                    </div>
                  </div>

                  <div className="border border-red-200 rounded-xl p-6 bg-red-50/50">
                    <h4 className="font-display text-xl text-red-800 mb-2">
                      Xóa tài khoản
                    </h4>
                    <p className="text-sm text-red-600 mb-4">
                      Hành động này không thể hoàn tác. Tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn.
                    </p>
                    <Button
                      variant="outline"
                      className="border-red-300 text-red-600 hover:bg-red-100"
                    >
                      Xóa tài khoản
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </>
  );
}