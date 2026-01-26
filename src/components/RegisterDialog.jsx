import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { registerUser } from "../features/auth/authSlice";

export function RegisterDialog({ children, open, onOpenChange, onRegisterSuccess, onSwitchToLogin }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");

  const validateForm = () => {
    const nextErrors = {};
    const fullName = formData.fullName.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();

    if (!fullName) {
      nextErrors.fullName = "Vui lòng nhập họ và tên";
    }

    if (!email) {
      nextErrors.email = "Vui lòng nhập email";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        nextErrors.email = "Email không hợp lệ";
      }
    }

    if (phone) {
      const cleanedPhone = phone.replace(/\s/g, "");
      if (!/^\d{10}$/.test(cleanedPhone)) {
        nextErrors.phone = "Số điện thoại không hợp lệ (10 chữ số)";
      }
    }

    if (!formData.password) {
      nextErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      nextErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleRegister = async () => {
    setFormError("");
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        email: formData.email.trim(),
        password: formData.password,
        fullName: formData.fullName.trim(),
        phoneNumber: formData.phone?.trim() || "",
      };

      await dispatch(registerUser(payload)).unwrap();

      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
      });
      setErrors({});
      setFormError("");

      onOpenChange(false);
      navigate("/");
      toast.success(
        "Đăng ký tài khoản thành công, hãy đăng nhập tài khoản của bạn.",
        { duration: 5000 },
      );
    } catch (err) {
      const message =
        (typeof err === "string" ? err : err?.message || err?.error) ||
        "Đăng ký thất bại!";
      setFormError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: "" } : prev));
    if (formError) {
      setFormError("");
    }
  };

  const handleSwitchToLogin = () => {
    onOpenChange(false);
    if (onSwitchToLogin) {
      onSwitchToLogin();
    }
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent 
        className="w-[450px] p-8" 
        align="end"
        sideOffset={8}
      >
        <div className="text-center space-y-2 mb-6">
          <h3 className="text-xl text-gray-900">
            TẠO TÀI KHOẢN MỚI
          </h3>
          <p className="text-gray-500 text-sm">
            Điền thông tin để tạo tài khoản:
          </p>
        </div>
        
        <div className="space-y-4">
          {formError && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {formError}
            </div>
          )}
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Họ và tên"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              className={`h-12 bg-gray-50 border-gray-200 ${errors.fullName ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            />
            {errors.fullName && (
              <p className="text-sm text-red-600">{errors.fullName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={`h-12 bg-gray-50 border-gray-200 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Input
              type="tel"
              placeholder="Số điện thoại (không bắt buộc)"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className={`h-12 bg-gray-50 border-gray-200 ${errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            />
            {errors.phone && (
              <p className="text-sm text-red-600">{errors.phone}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className={`h-12 bg-gray-50 border-gray-200 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Xác nhận mật khẩu"
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleRegister()}
              className={`h-12 bg-gray-50 border-gray-200 ${errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          <p className="text-xs text-gray-400 text-center">
            This site is protected by reCAPTCHA and the Google{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Terms of Service
            </a>{" "}
            apply.
          </p>

          <Button 
            onClick={handleRegister}
            disabled={isLoading}
            className="w-full h-12 bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? "ĐANG TẠO TÀI KHOẢN..." : "TẠO TÀI KHOẢN"}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{" "}
              <button 
                onClick={handleSwitchToLogin}
                className="text-blue-500 hover:underline"
              >
                Đăng nhập
              </button>
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
