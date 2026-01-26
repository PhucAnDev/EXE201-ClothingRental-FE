import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoImage from "figma:asset/36410bb4c7f9be9d338f77ff699328fde2f67245.png";
import { LoginDialog } from "./LoginDialog";
import { RegisterDialog } from "./RegisterDialog";
import { Heart, User, Package, LogOut } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "./ui/dropdown-menu";
import { NotificationPopover } from "./NotificationPopover";

const menuItems = [
  { id: "trang-chu", label: "Trang chủ", href: "/", type: "route" },
  { id: "bo-suu-tap", label: "Bộ sưu tập", href: "/bo-suu-tap", type: "route" },
  { id: "ai-stylist", label: "AI Stylist", href: "/ai-stylist", type: "route" },
  { id: "dich-vu", label: "Dịch vụ", href: "/dich-vu", type: "route" },
  { id: "ve-chung-toi", label: "Về chúng tôi", href: "/ve-chung-toi", type: "route" },
];

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("trang-chu");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Load user from localStorage on mount
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [avatarError, setAvatarError] = useState(false);
  
  const handleLogin = (userData) => {
    setUser(userData);
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  const avatarUrl = user?.avatarUrl || user?.avatar || "";

  useEffect(() => {
    setAvatarError(false);
  }, [avatarUrl]);

  useEffect(() => {
    const handleProfileUpdated = () => {
      const savedUser = localStorage.getItem("currentUser");
      setUser(savedUser ? JSON.parse(savedUser) : null);
    };

    window.addEventListener("user-profile-updated", handleProfileUpdated);
    return () => {
      window.removeEventListener("user-profile-updated", handleProfileUpdated);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Detect active section only on homepage
      if (location.pathname === "/") {
        const sections = menuItems.filter(item => item.type === "scroll").map(item => item.id);
        const scrollPosition = window.scrollY + 100;

        for (const sectionId of sections) {
          const element = document.getElementById(sectionId);
          if (element) {
            const offsetTop = element.offsetTop;
            const offsetHeight = element.offsetHeight;
            
            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
              setActiveSection(sectionId);
              break;
            }
          }
        }
      }
    };

    handleScroll(); // Initial check
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);
  
  // Set active section based on current route
  useEffect(() => {
    if (location.pathname === "/") {
      setActiveSection("trang-chu");
    } else if (location.pathname === "/bo-suu-tap") {
      setActiveSection("bo-suu-tap");
    } else if (location.pathname === "/ai-stylist") {
      setActiveSection("ai-stylist");
    } else if (location.pathname === "/dich-vu") {
      setActiveSection("dich-vu");
    } else if (location.pathname === "/ve-chung-toi") {
      setActiveSection("ve-chung-toi");
    }
  }, [location.pathname]);

  // Check if we're on homepage to determine navigation style
  const isHomePage = location.pathname === "/";
  const shouldHaveBackground = isScrolled || !isHomePage;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 px-8 lg:px-12 py-5 transition-all duration-500 ${
        shouldHaveBackground
          ? "bg-white/98 backdrop-blur-xl shadow-luxury border-b border-[#d4af37]/10"
          : "bg-gradient-to-b from-black/60 to-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-4 group">
          <img
            src={logoImage}
            alt="Sắc Việt Logo"
            className="w-14 h-14 object-contain transition-transform duration-300 group-hover:scale-110"
          />
          <span
            className={`text-2xl font-display tracking-wide transition-colors ${
              shouldHaveBackground ? "text-[#1a1a1a]" : "text-white"
            }`}
          >
            Sắc Việt
          </span>
        </Link>
        
        <div className="hidden md:flex gap-10 items-center">
          {menuItems.map((item) => {
            const isActive = activeSection === item.id;
            
            if (item.type === "route") {
              return (
                <Link
                  key={item.id}
                  to={item.href}
                  className={`relative pb-2 transition-all duration-300 uppercase text-sm tracking-[0.1em] font-medium group ${
                    isActive
                      ? "text-[#c1272d]"
                      : shouldHaveBackground
                      ? "text-[#4a4a4a] hover:text-[#c1272d]"
                      : "text-white/90 hover:text-white"
                  }`}
                >
                  {item.label}
                  <span className={`absolute bottom-0 left-0 h-px bg-gradient-to-r from-[#c1272d] to-[#d4af37] transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                  }`} />
                </Link>
              );
            }
            
            return (
              <a
                key={item.id}
                href={item.href}
                className={`relative pb-1 transition-colors ${
                  isActive
                    ? "text-red-600"
                    : shouldHaveBackground
                    ? "text-gray-900 hover:text-red-600"
                    : "text-white hover:text-red-400"
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600" />
                )}
              </a>
            );
          })}
        </div>
        
        {/* Show login button if not logged in, else show user icons */}
        {!user ? (
          <div className="flex items-center gap-2">
            <LoginDialog 
              open={isLoginOpen} 
              onOpenChange={setIsLoginOpen} 
              onLogin={handleLogin}
              onSwitchToRegister={() => {
                setIsLoginOpen(false);
                setTimeout(() => setIsRegisterOpen(true), 100);
              }}
            >
              <Button
                variant="outline"
                className={`transition-all ${
                  shouldHaveBackground
                    ? "bg-red-600 text-white border-red-600 hover:bg-red-700"
                    : "bg-white/10 text-white border-white/30 hover:bg-white hover:text-black"
                }`}
              >
                Đăng nhập
              </Button>
            </LoginDialog>
            <RegisterDialog 
              open={isRegisterOpen} 
              onOpenChange={setIsRegisterOpen}
              onRegisterSuccess={handleLogin}
              onSwitchToLogin={() => {
                setIsRegisterOpen(false);
                setTimeout(() => setIsLoginOpen(true), 100);
              }}
            >
              <Button
                variant="outline"
                className="opacity-0 pointer-events-none absolute"
              >
                Hidden
              </Button>
            </RegisterDialog>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            {/* Wishlist and Notifications - Only show for customers */}
            {user.role !== "admin" && (
              <>
                {/* Wishlist/Favorites Icon */}
                <button 
                  onClick={() => navigate("/profile?tab=wishlist")}
                  className={`relative p-2 rounded-full transition-all duration-300 group ${
                    shouldHaveBackground 
                      ? "hover:bg-red-50 text-gray-900 hover:text-red-600" 
                      : "hover:bg-white/10 text-white hover:text-red-400"
                  }`}
                >
                  <Heart className="w-5 h-5" />
                </button>

                {/* Notifications */}
                <NotificationPopover shouldHaveBackground={shouldHaveBackground} />
              </>
            )}
            
            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  className={`flex items-center gap-2 p-1 rounded-full transition-all duration-300 ${
                    shouldHaveBackground 
                      ? "hover:bg-gray-100 text-gray-900" 
                      : "hover:bg-white/10 text-white"
                  }`}
                >
                  {/* Avatar with gradient ring */}
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#c1272d] via-[#d4af37] to-[#c1272d] p-0.5">
                      <div className="w-full h-full rounded-full bg-white p-0.5">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-[#c1272d] to-[#d4af37] flex items-center justify-center overflow-hidden">
                          {avatarUrl && !avatarError ? (
                            <img
                              src={avatarUrl}
                              alt={user?.fullName || "User"}
                              className="w-full h-full object-cover"
                              onError={() => setAvatarError(true)}
                            />
                          ) : (
                            <span className="text-white text-sm font-semibold">
                              {user?.fullName?.charAt(0) || "U"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72 p-0 overflow-hidden">
                {/* Header Section with Gradient */}
                <div className="bg-gradient-to-br from-[#c1272d] to-[#8b1e1f] p-4 pb-6">
                  <div className="flex items-center gap-3">
                    {/* Large Avatar */}
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm p-0.5">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                        {avatarUrl && !avatarError ? (
                          <img
                            src={avatarUrl}
                            alt={user?.fullName || "User"}
                            className="w-full h-full object-cover"
                            onError={() => setAvatarError(true)}
                          />
                        ) : (
                          <span className="text-[#c1272d] text-xl font-display font-semibold">
                            {user?.fullName?.charAt(0) || "U"}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold text-base truncate">
                        {user?.fullName || "User"}
                      </p>
                      <p className="text-white/80 text-sm truncate">
                        {user?.email || "user@example.com"}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Menu Items */}
                <div className="p-2">
                  {user.role === "admin" ? (
                    <>
                      <DropdownMenuItem 
                        onClick={() => navigate("/admin/dashboard")}
                        className="px-4 py-3 cursor-pointer rounded-lg hover:bg-gradient-to-r hover:from-[#c1272d]/10 hover:to-[#d4af37]/10 transition-all"
                      >
                        <User className="mr-3 h-5 w-5 text-[#c1272d]" />
                        <span className="font-medium">Admin Dashboard</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => navigate("/")}
                        className="px-4 py-3 cursor-pointer rounded-lg hover:bg-gradient-to-r hover:from-[#c1272d]/10 hover:to-[#d4af37]/10 transition-all"
                      >
                        <span className="font-medium">Về trang chủ</span>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem 
                        onClick={() => navigate("/profile")}
                        className="px-4 py-3 cursor-pointer rounded-lg hover:bg-gradient-to-r hover:from-[#c1272d]/10 hover:to-[#d4af37]/10 transition-all group"
                      >
                        <User className="mr-3 h-5 w-5 text-gray-600 group-hover:text-[#c1272d] transition-colors" />
                        <span className="font-medium text-gray-700 group-hover:text-[#c1272d] transition-colors">Hồ sơ</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => navigate("/profile?tab=orders")}
                        className="px-4 py-3 cursor-pointer rounded-lg hover:bg-gradient-to-r hover:from-[#c1272d]/10 hover:to-[#d4af37]/10 transition-all group"
                      >
                        <Package className="mr-3 h-5 w-5 text-gray-600 group-hover:text-[#c1272d] transition-colors" />
                        <span className="font-medium text-gray-700 group-hover:text-[#c1272d] transition-colors">Đơn thuê</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => navigate("/profile?tab=wishlist")}
                        className="px-4 py-3 cursor-pointer rounded-lg hover:bg-gradient-to-r hover:from-[#c1272d]/10 hover:to-[#d4af37]/10 transition-all group"
                      >
                        <Heart className="mr-3 h-5 w-5 text-gray-600 group-hover:text-[#c1272d] transition-colors" />
                        <span className="font-medium text-gray-700 group-hover:text-[#c1272d] transition-colors">Yêu thích</span>
                      </DropdownMenuItem>
                    </>
                  )}
                </div>
                
                {/* Separator */}
                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-2" />
                
                {/* Logout Button */}
                <div className="p-2 pb-3">
                  <DropdownMenuItem 
                    onClick={logout}
                    className="px-4 py-3 cursor-pointer rounded-lg hover:bg-red-50 transition-all group"
                  >
                    <LogOut className="mr-3 h-5 w-5 text-red-500 group-hover:text-red-600 transition-colors" />
                    <span className="font-medium text-red-600 group-hover:text-red-700 transition-colors">Đăng xuất</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </nav>
  );
}
