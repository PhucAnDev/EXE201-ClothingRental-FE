import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  LayoutDashboard,
  Package,
  Users,
  FileText,
  Settings,
  LogOut,
  Home,
  ShoppingBag,
  BarChart3,
} from "lucide-react";
import logoImage from "figma:asset/36410bb4c7f9be9d338f77ff699328fde2f67245.png";
import { logout as logoutAction } from "../../features/auth/authSlice";

export function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("currentUser") || '{"fullName":"Admin User","email":"admin@gmail.com"}');

  const logout = () => {
    dispatch(logoutAction());
    navigate("/");
  };

  const menuItems = [
    {
      title: "Dashboard",
      path: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Quản lý sản phẩm",
      path: "/admin/products",
      icon: Package,
    },
    {
      title: "Quản lý người dùng",
      path: "/admin/users",
      icon: Users,
    },
    {
      title: "Đơn thuê",
      path: "/admin/orders",
      icon: ShoppingBag,
    },
    {
      title: "Thống kê",
      path: "/admin/analytics",
      icon: BarChart3,
    },
    {
      title: "Điều khoản dịch vụ",
      path: "/admin/terms",
      icon: FileText,
    },
    {
      title: "Cài đặt hệ thống",
      path: "/admin/system",
      icon: Settings,
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed left-0 top-0 z-20 w-72 h-[100dvh] min-h-screen bg-gradient-to-b from-[#1a1a1a] via-[#2a1a1a] to-[#1a1a1a] flex flex-col shadow-2xl overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#c1272d]/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#d4af37]/10 to-transparent rounded-full blur-3xl"></div>
      
      {/* Logo & Brand */}
      <div className="relative p-6 border-b border-white/10">
        <Link to="/admin/dashboard" className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#c1272d] to-[#d4af37] p-0.5 group-hover:scale-110 transition-transform">
            <div className="w-full h-full rounded-xl bg-[#1a1a1a] flex items-center justify-center overflow-hidden">
              <img
                src={logoImage}
                alt="Sắc Việt"
                className="w-8 h-8 object-contain"
              />
            </div>
          </div>
          <div>
            <span className="text-xl font-display font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Sắc Việt
            </span>
            <p className="text-xs text-[#d4af37] font-medium">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* User Info */}
      <div className="relative p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#c1272d] to-[#d4af37] flex items-center justify-center">
            <span className="text-white text-base font-semibold">
              {user?.fullName?.charAt(0) || "A"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.fullName}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <div className="mt-3 px-2 py-1 bg-gradient-to-r from-[#c1272d]/20 to-[#d4af37]/20 border border-[#d4af37]/30 rounded-md inline-block">
          <span className="text-xs font-medium text-[#d4af37]">Quản trị viên</span>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="relative flex-1 min-h-0 px-4 pt-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    group relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${
                      active
                        ? "bg-gradient-to-r from-[#c1272d] to-[#d4af37] text-white shadow-lg shadow-[#c1272d]/50"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }
                  `}
                >
                  {active && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"></div>
                  )}
                  <Icon
                    className={`w-5 h-5 ${
                      active ? "text-white" : "text-gray-400 group-hover:text-white"
                    } transition-colors`}
                  />
                  <span className="text-sm font-medium">{item.title}</span>
                  {active && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="relative p-4 border-t border-white/10 space-y-2">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-all duration-200 group"
        >
          <Home className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
          <span className="text-sm font-medium">Về trang chủ</span>
        </Link>

        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}
