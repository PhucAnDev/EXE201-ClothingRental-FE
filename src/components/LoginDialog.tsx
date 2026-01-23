import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";
import { loginUser } from "../features/auth/authSlice";

interface LoginDialogProps {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin?: (user: any) => void;
  onSwitchToRegister?: () => void;
}

export function LoginDialog({
  children,
  open,
  onOpenChange,
  onLogin,
  onSwitchToRegister,
}: LoginDialogProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();

      const user = result?.user;
      // Persist handled by slice; call parent and close
      if (onLogin) onLogin(user);
      setEmail("");
      setPassword("");
      onOpenChange(false);

      // Navigate based on roleName from backend
      const roleName = (user &&
        (user.roleName || user.role || user.roleId)) as any;
      if (user && user.roleName === "Admin") {
        navigate("/admin/dashboard");
      } else {
        // default customer landing -> go to main user home page
        navigate("/");
      }
    } catch (err: any) {
      const message =
        err?.message || (typeof err === "string" ? err : "Đăng nhập thất bại");
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    onOpenChange(false);
    navigate("/dang-ky");
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-[400px] p-8" align="end" sideOffset={8}>
        <div className="text-center space-y-2 mb-6">
          <h3 className="text-xl text-gray-900">ĐĂNG NHẬP TÀI KHOẢN</h3>
          <p className="text-gray-500 text-sm">
            Nhập email và mật khẩu của bạn:
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-gray-50 border-gray-200"
            />
          </div>

          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleLogin()}
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
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full h-12 bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? "ĐANG ĐĂNG NHẬP..." : "ĐĂNG NHẬP"}
          </Button>

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Khách hàng mới?{" "}
              <button
                onClick={
                  onSwitchToRegister ? onSwitchToRegister : handleRegister
                }
                className="text-blue-500 hover:underline"
              >
                Tạo tài khoản
              </button>
            </p>
            <p className="text-sm text-gray-600">
              Quên mật khẩu?{" "}
              <button className="text-blue-500 hover:underline">
                Khôi phục mật khẩu
              </button>
            </p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
