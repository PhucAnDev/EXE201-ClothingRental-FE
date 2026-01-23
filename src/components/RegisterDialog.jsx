import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../features/auth/authSlice";

export function RegisterDialog({ children, open, onOpenChange, onRegisterSuccess, onSwitchToLogin }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    // Validation
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (formData.password.length < 6) {
      alert("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Email không hợp lệ!");
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

      const result = await dispatch(registerUser(payload)).unwrap();
      const message = result?.message || "🎉 Đăng ký thành công!";
      alert(message);

      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
      });

      if (onSwitchToLogin) {
        onSwitchToLogin();
      } else {
        onOpenChange(false);
      }
    } catch (err) {
      const message =
        err?.message || (typeof err === "string" ? err : "Đăng ký thất bại!");
      alert(message);
    } finally {
      setIsLoading(false);
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
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Họ và tên"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="h-12 bg-gray-50 border-gray-200"
            />
          </div>

          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="h-12 bg-gray-50 border-gray-200"
            />
          </div>

          <div className="space-y-2">
            <Input
              type="tel"
              placeholder="Số điện thoại (không bắt buộc)"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="h-12 bg-gray-50 border-gray-200"
            />
          </div>
          
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="h-12 bg-gray-50 border-gray-200"
            />
          </div>

          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Xác nhận mật khẩu"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              onKeyPress={(e) => e.key === "Enter" && handleRegister()}
              className="h-12 bg-gray-50 border-gray-200"
            />
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
