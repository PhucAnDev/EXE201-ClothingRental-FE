import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Footer } from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Badge } from "../components/ui/badge";
import {
  User,
  Mail,
  Phone,
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
  Lock,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  changePassword,
  getUserById,
  updateUserProfile,
} from "../features/auth/authService";
import { getMyBookings } from "../features/booking/bookingService";
import {
  fetchWishlist,
  removeFromWishlist,
} from "../features/wishlist/wishlistSlice";

export function ProfilePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    items: wishlistItems,
    listStatus,
    listError,
    removeStatus,
    removingId,
  } = useSelector((state) => state.wishlist);
  const [searchParams, setSearchParams] = useSearchParams();
  const fallbackTab =
    location.pathname === "/orders"
      ? "orders"
      : location.pathname === "/wishlist"
        ? "wishlist"
        : "info";
  const activeTab = searchParams.get("tab") || fallbackTab;

  // Check if user is logged in
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (!savedUser) {
      navigate("/");
      return null;
    }
    return JSON.parse(savedUser);
  });
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

  const rawUserId = user?.userId || user?.id || getUserIdFromToken();
  const userId =
    rawUserId === null || rawUserId === undefined || rawUserId === ""
      ? null
      : Number.isNaN(Number(rawUserId))
        ? rawUserId
        : Number(rawUserId);

  useEffect(() => {
    if (!user || user?.userId || user?.id) return;
    if (!rawUserId) return;
    const nextUser = { ...user, userId: rawUserId };
    setUser(nextUser);
    localStorage.setItem("currentUser", JSON.stringify(nextUser));
  }, [rawUserId, user]);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isConfirmChangeOpen, setIsConfirmChangeOpen] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const skipCloseResetRef = useRef(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    phone: user?.phoneNumber || user?.phone || "",
    address: user?.address || "",
    birthDate: user?.birthDate || "1990-01-01",
    avatarUrl: user?.avatarUrl || user?.avatar || "",
  });
  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatarUrl || user?.avatar || "",
  );
  const [avatarUrlInput, setAvatarUrlInput] = useState(
    user?.avatarUrl || user?.avatar || "",
  );

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState(null);

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  // Wishlist data is loaded from API via Redux

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (activeTab !== "wishlist") return;
    dispatch(fetchWishlist());
  }, [activeTab, dispatch]);

  useEffect(() => {
    if (activeTab !== "orders") return;
    if (!userId) return;

    let isMounted = true;

    const fetchOrders = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        if (!isMounted) return;
        setOrders([]);
        setOrdersError("Bạn cần đăng nhập để xem đơn thuê.");
        return;
      }

      setOrdersLoading(true);
      setOrdersError("");

      try {
        const data = await getMyBookings(token);
        if (!isMounted) return;

        const validOrders = Array.isArray(data) ? data : [];
        const sortedOrders = [...validOrders].sort((a, b) => {
          const dateA = new Date(a?.bookingDate || 0).getTime();
          const dateB = new Date(b?.bookingDate || 0).getTime();
          return dateB - dateA;
        });

        setOrders(sortedOrders);
      } catch (err) {
        if (!isMounted) return;
        setOrders([]);
        setOrdersError(
          err?.response?.data?.message || "Không thể tải danh sách đơn thuê.",
        );
      } finally {
        if (isMounted) setOrdersLoading(false);
      }
    };

    fetchOrders();

    return () => {
      isMounted = false;
    };
  }, [activeTab, userId]);

  useEffect(() => {
    if (!isEditOpen) {
      skipCloseResetRef.current = false;
    }
  }, [isEditOpen]);

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      if (!userId) return;

      setProfileLoading(true);
      setProfileError("");

      try {
        const token = localStorage.getItem("authToken");
        const res = await getUserById(userId, token);
        if (!isMounted) return;

        const avatarUrl = res.avatarUrl ?? "";
        const phoneNumber = res.phoneNumber ?? "";

        const nextUser = {
          ...user,
          ...res,
          phone: phoneNumber || user?.phone || user?.phoneNumber || "",
          phoneNumber: phoneNumber || user?.phoneNumber || "",
          avatarUrl,
        };

        setUser(nextUser);
        setFormData((prev) => ({
          ...prev,
          fullName: res.fullName ?? prev.fullName,
          phone: phoneNumber || prev.phone,
          avatarUrl: avatarUrl || prev.avatarUrl,
        }));
        setAvatarPreview(avatarUrl);
        setAvatarUrlInput(avatarUrl);
        localStorage.setItem("currentUser", JSON.stringify(nextUser));
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("user-profile-updated"));
        }
      } catch (err) {
        if (!isMounted) return;
        setProfileError("Không thể tải thông tin cá nhân.");
      } finally {
        if (isMounted) setProfileLoading(false);
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  const getAvatarUrl = (value) => value?.avatarUrl || value?.avatar || "";

  const openEditModal = () => {
    const avatarUrl = getAvatarUrl(user);
    setFormData({
      fullName: user?.fullName || "",
      phone: user?.phoneNumber || user?.phone || "",
      address: user?.address || "",
      birthDate: user?.birthDate || "1990-01-01",
      avatarUrl,
    });
    setAvatarPreview(avatarUrl);
    setAvatarUrlInput(avatarUrl);
    setIsEditOpen(true);
  };

  const handleAvatarFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setAvatarPreview(result);
      setFormData((prev) => ({ ...prev, avatarUrl: result }));
      setAvatarUrlInput("");
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarUrlChange = (event) => {
    const value = event.target.value;
    setAvatarUrlInput(value);
    setAvatarPreview(value);
    setFormData((prev) => ({ ...prev, avatarUrl: value }));
  };

  const handleSave = async () => {
    if (!userId) {
      toast.error("Không tìm thấy tài khoản.");
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem("authToken");
      const payload = {
        fullName: formData.fullName?.trim() || "",
        phoneNumber: formData.phone?.trim() || "",
        avatarUrl: formData.avatarUrl || null,
      };

      const res = await updateUserProfile(userId, payload, token);

      const updatedUser = {
        ...user,
        ...formData,
        ...res,
        fullName: res.fullName ?? payload.fullName ?? formData.fullName,
        phoneNumber: res.phoneNumber ?? payload.phoneNumber ?? formData.phone,
        phone: res.phoneNumber ?? payload.phoneNumber ?? formData.phone,
        avatarUrl: res.avatarUrl ?? payload.avatarUrl ?? formData.avatarUrl ?? "",
        birthDate: formData.birthDate || user?.birthDate || "",
      };

      skipCloseResetRef.current = true;
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("user-profile-updated"));
      }
      setUser(updatedUser);
      setFormData((prev) => ({
        ...prev,
        fullName: updatedUser.fullName || prev.fullName,
        phone: updatedUser.phoneNumber || updatedUser.phone || prev.phone,
        avatarUrl: updatedUser.avatarUrl || prev.avatarUrl,
      }));
      setAvatarPreview(updatedUser.avatarUrl || "");
      setAvatarUrlInput(updatedUser.avatarUrl || "");
      setIsEditOpen(false);
      toast.success("Cập nhật thành công!");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Cập nhật thất bại. Vui lòng thử lại.";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    const avatarUrl = getAvatarUrl(user);
    setFormData({
      fullName: user?.fullName || "",
      phone: user?.phoneNumber || user?.phone || "",
      address: user?.address || "",
      birthDate: user?.birthDate || "",
      avatarUrl,
    });
    setAvatarPreview(avatarUrl);
    setAvatarUrlInput(avatarUrl);
    setIsEditOpen(false);
  };

  const handleChangePassword = () => {
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Mật khẩu mới không khớp!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    setIsConfirmChangeOpen(true);
  };

  const handleConfirmChangePassword = async () => {
    setIsChangingPassword(true);
    try {
      const token = localStorage.getItem("authToken");
      const payload = {
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      };
      const res = await changePassword(payload, token);
      setIsConfirmChangeOpen(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast.success(res?.message || "Đổi mật khẩu thành công!");
    } catch (err) {
      toast.error("Mật khẩu hiện không chính xác");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const normalizeOrderStatus = (status) => {
    const value = String(status || "")
      .trim()
      .toLowerCase();

    if (value === "paid") {
      return "paid";
    }
    if (value === "depositpaid") {
      return "depositpaid";
    }
    if (value === "partiallypaid") {
      return "partiallypaid";
    }

    if (["completed", "complete", "success"].includes(value)) {
      return "completed";
    }
    if (["active", "renting", "inprogress", "processing"].includes(value)) {
      return "active";
    }
    if (["cancelled", "canceled", "failed"].includes(value)) {
      return "cancelled";
    }
    return "pending";
  };

  const normalizeStatusValue = (status) =>
    String(status || "")
      .trim()
      .toLowerCase();

  const resolveDisplayStatus = (bookingStatus, paymentStatus, detailStatus) => {
    const lifecycleStatus = normalizeStatusValue(bookingStatus || detailStatus);
    if (["cancelled", "canceled"].includes(lifecycleStatus)) {
      return "cancelled";
    }
    if (["completed", "complete", "success"].includes(lifecycleStatus)) {
      return "completed";
    }

    const normalizedPaymentStatus = normalizeStatusValue(paymentStatus);
    if (normalizedPaymentStatus) {
      return normalizedPaymentStatus;
    }

    if (["active", "renting", "inprogress", "processing"].includes(lifecycleStatus)) {
      return "active";
    }

    return lifecycleStatus || "pending";
  };

  const getStatusBadge = (status) => {
    const normalizedStatus = normalizeOrderStatus(status);
    switch (normalizedStatus) {
      case "paid":
        return (
          <Badge className="bg-green-600 text-white">
            <CheckCircle className="w-3 h-3 mr-1" /> Đã thanh toán
          </Badge>
        );
      case "depositpaid":
        return (
          <Badge className="bg-amber-500 text-white">
            <Clock className="w-3 h-3 mr-1" /> Đã đặt cọc
          </Badge>
        );
      case "partiallypaid":
        return (
          <Badge className="bg-blue-500 text-white">
            <Clock className="w-3 h-3 mr-1" /> Đã thanh toán một phần
          </Badge>
        );
      case "completed":
        return (
          <Badge className="bg-green-500 text-white">
            <CheckCircle className="w-3 h-3 mr-1" /> Hoàn thành
          </Badge>
        );
      case "active":
        return (
          <Badge className="bg-blue-500 text-white">
            <Clock className="w-3 h-3 mr-1" /> Đang thuê
          </Badge>
        );
      case "cancelled":
        return (
          <Badge className="bg-red-500 text-white">
            <XCircle className="w-3 h-3 mr-1" /> Đã hủy
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-500 text-white">
            <Clock className="w-3 h-3 mr-1" /> Chờ xử lý
          </Badge>
        );
    }
  };

  const formatPrice = (value) => {
    const amount = Number(value);
    if (!Number.isFinite(amount)) return "0đ";
    return `${amount.toLocaleString("vi-VN")}đ`;
  };

  const formatDate = (value) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("sv-SE");
  };

  const formatBookingCode = (bookingId) => {
    const value = Number(bookingId);
    if (!Number.isFinite(value) || value <= 0) return "ORD";
    return `ORD${String(value).padStart(3, "0")}`;
  };

  const getRentalDays = (detail) => {
    const days = Number(detail?.rentalDays);
    if (Number.isFinite(days) && days > 0) return days;

    const start = detail?.startTime ? new Date(detail.startTime) : null;
    const end = detail?.endTime ? new Date(detail.endTime) : null;
    if (!start || !end) return null;
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;

    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diffDays <= 0 ? 1 : diffDays;
  };

  const switchTab = (tab) => {
    setSearchParams({ tab });
    if (isEditOpen) handleCancel();
  };

  const handleRemoveFromWishlist = (item) => {
    setRemoveTarget(item);
    setIsRemoveOpen(true);
  };

  const handleConfirmRemove = async () => {
    if (!removeTarget?.id) return;
    try {
      const payload = await dispatch(
        removeFromWishlist(Number(removeTarget.id)),
      ).unwrap();
      toast.success(
        payload?.message || "Đã xóa outfit khỏi danh sách yêu thích.",
      );
      setIsRemoveOpen(false);
      setRemoveTarget(null);
    } catch (err) {
      toast.error(
        err?.message || "Không thể xóa outfit khỏi danh sách yêu thích.",
      );
    }
  };

  if (!user) return null;
  const avatarUrl = getAvatarUrl(user);
  const avatarLetter = (user.fullName || "U").charAt(0).toUpperCase();
  const editAvatarLetter = (formData.fullName || user.fullName || "U")
    .charAt(0)
    .toUpperCase();
  const orderRows = orders.flatMap((booking) => {
    const details = Array.isArray(booking?.details) ? booking.details : [];
    if (details.length === 0) {
      return [
        {
          rowId: `${booking?.bookingId || "booking"}-0`,
          image: "",
          productName: "Trang phục",
          bookingCode: formatBookingCode(booking?.bookingId),
          size: "-",
          rentalDays: null,
          rentalDate: booking?.bookingDate,
          status: resolveDisplayStatus(
            booking?.status,
            booking?.paymentStatus,
            null,
          ),
          totalPrice: booking?.totalOrderAmount || 0,
        },
      ];
    }

    return details.map((detail, index) => ({
      rowId: `${booking?.bookingId || "booking"}-${detail?.detailId || index}`,
      image: detail?.outfitImageUrl || "",
      productName: detail?.outfitName || "Trang phục",
      bookingCode: formatBookingCode(booking?.bookingId),
      size: detail?.outfitSizeLabel || "-",
      rentalDays: getRentalDays(detail),
      rentalDate: detail?.startTime || booking?.bookingDate,
      status: resolveDisplayStatus(
        booking?.status,
        booking?.paymentStatus,
        detail?.status,
      ),
      totalPrice: booking?.totalOrderAmount || 0,
    }));
  });

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-[#fdfcfb] via-white to-[#fef9f3] pt-52 md:pt-60">
        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16">
          {/* Avatar Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center gap-4 mb-10"
          >
            <div className="flex items-center gap-4">
              {/* Avatar Container with Gradient Ring */}
              <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-[#c1272d] via-[#d4af37] to-[#c1272d] p-1.5 shadow-2xl">
                <div className="w-full h-full rounded-full bg-white p-1.5">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[#c1272d] to-[#d4af37] flex items-center justify-center">
                    <span className="text-white text-5xl font-display"></span>
                  </div>
                </div>
              </div>

              {/* Camera Button */}
              <button
                className="w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center hover:bg-gray-50 transition-all border-2 border-gray-100 group"
                aria-label="Cập nhật ảnh đại diện"
              >
                <Camera className="w-5 h-5 text-gray-600 group-hover:text-[#c1272d] transition-colors" />
              </button>
            </div>
          </motion.div>

          {/* Tabs Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={() => switchTab("info")}
                className={`px-6 py-4 font-medium transition-all border rounded-xl ${
                  activeTab === "info"
                    ? "border-[#c1272d]/40 text-[#c1272d] bg-white shadow-sm"
                    : "border-gray-200 text-gray-600 bg-[#fdfcfb] hover:border-[#c1272d]/30 hover:text-[#c1272d]"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <User className="w-5 h-5" />
                  Thông tin
                </span>
              </button>

              <button
                onClick={() => switchTab("orders")}
                className={`px-6 py-4 font-medium transition-all border rounded-xl ${
                  activeTab === "orders"
                    ? "border-[#c1272d]/40 text-[#c1272d] bg-white shadow-sm"
                    : "border-gray-200 text-gray-600 bg-[#fdfcfb] hover:border-[#c1272d]/30 hover:text-[#c1272d]"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <Package className="w-5 h-5" />
                  Đơn thuê
                </span>
              </button>

              <button
                onClick={() => switchTab("wishlist")}
                className={`px-6 py-4 font-medium transition-all border rounded-xl ${
                  activeTab === "wishlist"
                    ? "border-[#c1272d]/40 text-[#c1272d] bg-white shadow-sm"
                    : "border-gray-200 text-gray-600 bg-[#fdfcfb] hover:border-[#c1272d]/30 hover:text-[#c1272d]"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5" />
                  Yêu thích
                </span>
              </button>

              <button
                onClick={() => switchTab("settings")}
                className={`px-6 py-4 font-medium transition-all border rounded-xl ${
                  activeTab === "settings"
                    ? "border-[#c1272d]/40 text-[#c1272d] bg-white shadow-sm"
                    : "border-gray-200 text-gray-600 bg-[#fdfcfb] hover:border-[#c1272d]/30 hover:text-[#c1272d]"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <Settings className="w-5 h-5" />
                  Cài đặt
                </span>
              </button>
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 min-h-[520px]"
          >
            {/* Thông tin Tab */}
            {activeTab === "info" && (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-dashed border-[#f0e2d7] pb-6 mb-8">
                  <h3 className="text-2xl font-display text-[#1a1a1a] tracking-tight">
                    Thông tin cá nhân
                  </h3>
                  <Button
                    onClick={openEditModal}
                    className="bg-gradient-to-r from-[#c1272d] to-[#8b1e1f] text-white hover:shadow-lg rounded-full px-6"
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Chỉnh sửa
                  </Button>
                </div>
                {(profileLoading || profileError) && (
                  <div className="mb-6 text-sm">
                    {profileLoading && (
                      <span className="text-gray-500">Đang tải thông tin...</span>
                    )}
                    {profileError && (
                      <span className="text-red-600">{profileError}</span>
                    )}
                  </div>
                )}

                <div className="mb-10 rounded-2xl border border-[#f0e2d7] bg-white p-7 shadow-[0_18px_40px_-30px_rgba(15,23,42,0.35)]">
                  <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#c1272d] via-[#d4af37] to-[#c1272d] p-1 shadow-lg">
                      <div className="w-full h-full rounded-full bg-white p-1">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-[#c1272d] to-[#d4af37] flex items-center justify-center overflow-hidden">
                          {avatarUrl ? (
                            <img
                              src={avatarUrl}
                              alt={user.fullName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-white text-3xl font-display">
                              {avatarLetter}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-semibold text-[#1a1a1a] tracking-tight">
                        {user.fullName}
                      </div>
                      <div className="text-sm text-gray-500">ID: {user.email}</div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="group space-y-2 rounded-2xl border border-[#f0e2d7] bg-white/90 p-4 shadow-sm transition-shadow hover:shadow-md">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 group-focus-within:text-[#c1272d]">
                      <User className="w-4 h-4 text-[#c1272d]" />
                      Họ và tên
                    </label>
                    <Input
                      value={formData.fullName}
                      disabled
                      className="h-12 bg-white border-[#ead8ca] focus-visible:border-[#c1272d]/40 focus-visible:ring-[#c1272d]/20"
                    />
                  </div>

                  <div className="group space-y-2 rounded-2xl border border-[#f0e2d7] bg-white/90 p-4 shadow-sm transition-shadow hover:shadow-md">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 group-focus-within:text-[#c1272d]">
                      <Mail className="w-4 h-4 text-[#c1272d]" />
                      Email
                    </label>
                    <Input
                      value={user.email}
                      disabled
                      className="h-12 bg-[#f7f4f0] border-[#ead8ca] text-gray-600 cursor-not-allowed"
                    />
                  </div>

                  <div className="group space-y-2 rounded-2xl border border-[#f0e2d7] bg-white/90 p-4 shadow-sm transition-shadow hover:shadow-md">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 group-focus-within:text-[#c1272d]">
                      <Phone className="w-4 h-4 text-[#c1272d]" />
                      Số điện thoại
                    </label>
                    <Input
                      value={formData.phone}
                      disabled
                      className="h-12 bg-white border-[#ead8ca] focus-visible:border-[#c1272d]/40 focus-visible:ring-[#c1272d]/20"
                    />
                  </div>

                  <div className="group space-y-2 rounded-2xl border border-[#f0e2d7] bg-white/90 p-4 shadow-sm transition-shadow hover:shadow-md">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 group-focus-within:text-[#c1272d]">
                      <Calendar className="w-4 h-4 text-[#c1272d]" />
                      Ngày sinh
                    </label>
                    <Input
                      type="date"
                      value={formData.birthDate}
                      disabled
                      className="h-12 bg-white border-[#ead8ca] focus-visible:border-[#c1272d]/40 focus-visible:ring-[#c1272d]/20"
                    />
                  </div>

                </div>

                <Dialog
                  open={isEditOpen}
                  onOpenChange={(open) => {
                    if (!open) {
                      if (skipCloseResetRef.current) {
                        skipCloseResetRef.current = false;
                        setIsEditOpen(false);
                        return;
                      }
                      handleCancel();
                      return;
                    }
                    setIsEditOpen(true);
                  }}
                >
                  <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Chỉnh sửa thông tin cá nhân</DialogTitle>
                      <DialogDescription>
                        Cập nhật hồ sơ và ảnh đại diện của bạn.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6">
                      <div className="rounded-2xl border border-[#f0e2d7] bg-[#fffaf6] p-4">
                        <div className="flex flex-col items-center gap-4 sm:flex-row">
                          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#c1272d] via-[#d4af37] to-[#c1272d] p-1 shadow-lg">
                            <div className="w-full h-full rounded-full bg-white p-1">
                              <div className="w-full h-full rounded-full bg-gradient-to-br from-[#c1272d] to-[#d4af37] flex items-center justify-center overflow-hidden">
                                {avatarPreview ? (
                                  <img
                                    src={avatarPreview}
                                    alt="Ảnh đại diện"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-white text-3xl font-display">
                                    {editAvatarLetter}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="grid w-full gap-3">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">
                                Tải ảnh từ máy
                              </label>
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarFileChange}
                                className="cursor-pointer bg-white border-[#ead8ca]"
                              />
                            </div>

                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">
                                Hoặc dán link ảnh
                              </label>
                              <Input
                                type="url"
                                placeholder="https://..."
                                value={avatarUrlInput}
                                onChange={handleAvatarUrlChange}
                                className="bg-white border-[#ead8ca]"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Họ và tên
                          </label>
                          <Input
                            value={formData.fullName}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                fullName: e.target.value,
                              })
                            }
                            className="h-12 bg-white border-[#ead8ca]"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Email
                          </label>
                          <Input
                            value={user.email}
                            disabled
                            className="h-12 bg-[#f7f4f0] border-[#ead8ca] text-gray-600 cursor-not-allowed"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Số điện thoại
                          </label>
                          <Input
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phone: e.target.value,
                              })
                            }
                            className="h-12 bg-white border-[#ead8ca]"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Ngày sinh
                          </label>
                          <Input
                            type="date"
                            value={formData.birthDate}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                birthDate: e.target.value,
                              })
                            }
                            className="h-12 bg-white border-[#ead8ca]"
                          />
                        </div>
                      </div>
                    </div>

                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        className="border-[#ead8ca] text-[#6b4b4b] hover:bg-[#fff4ee]"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Hủy
                      </Button>
                      <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-gradient-to-r from-[#c1272d] to-[#8b1e1f] text-white hover:shadow-lg"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? "Đang lưu..." : "Lưu"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}

            {/* Đơn thuê Tab */}
            {activeTab === "orders" && (
              <div>
                <h3 className="text-2xl font-display text-[#1a1a1a] mb-8">
                  Đơn thuê của tôi
                </h3>

                {ordersLoading && (
                  <p className="text-sm text-gray-500 mb-6">
                    Đang tải danh sách đơn thuê...
                  </p>
                )}
                {ordersError && (
                  <p className="text-sm text-red-600 mb-6">{ordersError}</p>
                )}

                {!ordersLoading && !ordersError && orderRows.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-left py-4 px-4 font-medium text-gray-700">
                            Sản phẩm
                          </th>
                          <th className="text-left py-4 px-4 font-medium text-gray-700">
                            Mã đơn
                          </th>
                          <th className="text-center py-4 px-4 font-medium text-gray-700">
                            Size
                          </th>
                          <th className="text-center py-4 px-4 font-medium text-gray-700">
                            Số ngày thuê
                          </th>
                          <th className="text-left py-4 px-4 font-medium text-gray-700">
                            Ngày thuê
                          </th>
                          <th className="text-center py-4 px-4 font-medium text-gray-700">
                            Trạng thái
                          </th>
                          <th className="text-right py-4 px-4 font-medium text-gray-700">
                            Tổng tiền
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderRows.map((order) => (
                          <tr
                            key={order.rowId}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <ImageWithFallback
                                  src={order.image}
                                  alt={order.productName}
                                  className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                                />
                                <span className="font-medium text-[#1a1a1a] min-w-[150px]">
                                  {order.productName}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-gray-600">
                              {order.bookingCode}
                            </td>
                            <td className="py-4 px-4 text-center font-medium">
                              {order.size}
                            </td>
                            <td className="py-4 px-4 text-center">
                              {order.rentalDays ? `${order.rentalDays} ngày` : "-"}
                            </td>
                            <td className="py-4 px-4 text-gray-600">
                              {formatDate(order.rentalDate)}
                            </td>
                            <td className="py-4 px-4 text-center">
                              {getStatusBadge(order.status)}
                            </td>
                            <td className="py-4 px-4 text-right">
                              <span className="font-bold text-[#c1272d]">
                                {formatPrice(order.totalPrice)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {!ordersLoading && !ordersError && orderRows.length === 0 && (
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
                <h3 className="text-2xl font-display text-[#1a1a1a] mb-8">
                  Sản phẩm yêu thích
                </h3>

                {listStatus === "loading" && (
                  <p className="text-sm text-gray-500 mb-6">
                    Đang tải danh sách yêu thích...
                  </p>
                )}
                {listError && (
                  <p className="text-sm text-red-600 mb-6">{listError}</p>
                )}

                {wishlistItems.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {wishlistItems.map((item) => (
                      <div
                        key={item.id}
                        className="group bg-white overflow-hidden transition-all duration-500 hover:shadow-luxury cursor-pointer"
                        onClick={() => navigate(`/san-pham/${item.id}`)}
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

                          {/* Remove Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFromWishlist(item);
                            }}
                            className="absolute top-6 right-6 z-20 w-12 h-12 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-700 shadow-lg transition-all duration-300 group/heart hover:bg-[#c1272d] hover:shadow-xl"
                          >
                            <X className="w-5 h-5 transition-colors group-hover/heart:text-white" />
                          </button>

                          {/* Border Accent */}
                          <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#d4af37]/30 transition-colors duration-500 pointer-events-none" />
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h3 className="text-xl font-display text-[#1a1a1a] mb-2 group-hover:text-[#c1272d] transition-colors duration-300 line-clamp-1">
                            {item.name}
                          </h3>
                          <p className="text-[#6b6b6b] text-sm mb-4 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-display text-[#c1272d] tracking-tight">
                              {item.price.toLocaleString("vi-VN")} ₫
                            </span>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-[#d4af37] text-[#d4af37]" />
                              <span className="text-sm font-medium text-gray-600">
                                {item.rating}
                              </span>
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

                <Dialog
                  open={isRemoveOpen}
                  onOpenChange={(open) => {
                    if (!open) {
                      setIsRemoveOpen(false);
                      setRemoveTarget(null);
                    } else {
                      setIsRemoveOpen(true);
                    }
                  }}
                >
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Xóa khỏi danh sách yêu thích?</DialogTitle>
                      <DialogDescription>
                        Bạn chắc chắn muốn xóa{" "}
                        <span className="font-medium text-gray-900">
                          {removeTarget?.name || "outfit này"}
                        </span>{" "}
                        khỏi danh sách yêu thích?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsRemoveOpen(false);
                          setRemoveTarget(null);
                        }}
                        className="border-gray-200"
                      >
                        Hủy
                      </Button>
                      <Button
                        onClick={handleConfirmRemove}
                        disabled={
                          removeStatus === "loading" &&
                          removingId === Number(removeTarget?.id)
                        }
                        className="bg-gradient-to-r from-[#c1272d] to-[#8b1e1f] text-white"
                      >
                        {removeStatus === "loading" &&
                        removingId === Number(removeTarget?.id)
                          ? "Đang xóa..."
                          : "Xóa"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}

            {activeTab === "settings" && (
              <div>
                <h3 className="text-2xl font-display text-[#1a1a1a] mb-8">
                  Cài đặt tài khoản
                </h3>

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
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              currentPassword: e.target.value,
                            })
                          }
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
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              newPassword: e.target.value,
                            })
                          }
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
                          onChange={(e) =>
                            setPasswordData({
                              ...passwordData,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="h-12 bg-white border-gray-200"
                          placeholder="Nhập lại mật khẩu mới"
                        />
                      </div>

                      <Button
                        onClick={handleChangePassword}
                        className="bg-gradient-to-r from-[#c1272d] to-[#8b1e1f] text-white hover:shadow-lg w-full h-12"
                      >
                        Đổi mật khẩu
                      </Button>

                      <Dialog
                        open={isConfirmChangeOpen}
                        onOpenChange={setIsConfirmChangeOpen}
                      >
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Xác nhận đổi mật khẩu</DialogTitle>
                            <DialogDescription>
                              Bạn chắc chắn muốn đổi mật khẩu cho tài khoản này?
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setIsConfirmChangeOpen(false)}
                              className="border-gray-200"
                            >
                              Hủy
                            </Button>
                            <Button
                              onClick={handleConfirmChangePassword}
                              disabled={isChangingPassword}
                              className="bg-gradient-to-r from-[#c1272d] to-[#8b1e1f] text-white"
                            >
                              {isChangingPassword ? "Đang xử lý..." : "Đồng ý"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>

                  <div className="border border-red-200 rounded-xl p-6 bg-red-50/50">
                    <h4 className="font-display text-xl text-red-800 mb-2">
                      Xóa tài khoản
                    </h4>
                    <p className="text-sm text-red-600 mb-4">
                      Hành động này không thể hoàn tác. Tất cả dữ liệu của bạn
                      sẽ bị xóa vĩnh viễn.
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





