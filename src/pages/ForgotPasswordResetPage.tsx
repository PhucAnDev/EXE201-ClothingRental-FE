import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { resetPassword } from "../features/auth/authService";
import { toast } from "sonner";

export function ForgotPasswordResetPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("passwordResetEmail");
    const storedToken = sessionStorage.getItem("passwordResetToken");
    if (!storedEmail || !storedToken) {
      navigate("/quen-mat-khau", { replace: true });
      return;
    }
    setEmail(storedEmail);
    setResetToken(storedToken);
  }, [navigate]);

  const handleReset = async () => {
    setFormError("");
    if (isLoading) {
      return;
    }

    const nextErrors: {
      newPassword?: string;
      confirmPassword?: string;
    } = {};

    if (!newPassword) {
      nextErrors.newPassword = "Vui lòng nhập mật khẩu mới";
    } else if (newPassword.length < 6) {
      nextErrors.newPassword = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (confirmPassword !== newPassword) {
      nextErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setFieldErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    if (!email || !resetToken) {
      setFormError("Vui lòng xác thực OTP trước khi đổi mật khẩu.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await resetPassword({
        email,
        resetToken,
        newPassword,
        confirmPassword,
      });
      toast.success(res?.message || "Đổi mật khẩu thành công. Vui lòng đăng nhập.");
      sessionStorage.removeItem("passwordResetToken");
      sessionStorage.removeItem("passwordResetEmail");
      navigate("/");
    } catch (err: any) {
      const status = err?.response?.status;
      const message =
        status === 400
          ? "Đổi mật khẩu thất bại. Vui lòng thử lại."
          : err?.response?.data?.message ||
            err?.message ||
            "Đổi mật khẩu thất bại. Vui lòng thử lại.";
      setFormError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    field: "newPassword" | "confirmPassword",
    value: string,
  ) => {
    if (field === "newPassword") {
      setNewPassword(value);
      if (fieldErrors.newPassword) {
        setFieldErrors((prev) => ({ ...prev, newPassword: "" }));
      }
      return;
    }
    setConfirmPassword(value);
    if (fieldErrors.confirmPassword) {
      setFieldErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff7e6] via-white to-[#f8efe2] px-4 py-16 pt-32 md:pt-36">
      <div className="mx-auto w-full max-w-xl">
        <div className="rounded-2xl border border-[#d4af37]/40 bg-white p-8 shadow-[0_18px_50px_-30px_rgba(193,39,45,0.45)]">
          <div className="space-y-2">
            <h1 className="text-2xl text-[#3b2a1a]">Tạo mật khẩu mới</h1>
            <p className="text-sm text-[#6b4d1a]">
              Vui lòng nhập mật khẩu mới và xác nhận để tiếp tục.
            </p>
          </div>

          {formError && (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {formError}
            </div>
          )}

          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Mật khẩu mới"
                value={newPassword}
                onChange={(e) => handleChange("newPassword", e.target.value)}
                className={`h-12 bg-white text-[#3b2a1a] placeholder:text-[#9b8760] border-[#d4af37]/50 shadow-sm focus-visible:ring-[#d4af37]/30 ${
                  fieldErrors.newPassword
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }`}
              />
              {fieldErrors.newPassword && (
                <p className="text-sm text-red-600">
                  {fieldErrors.newPassword}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Xác nhận mật khẩu"
                value={confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleReset()}
                className={`h-12 bg-white text-[#3b2a1a] placeholder:text-[#9b8760] border-[#d4af37]/50 shadow-sm focus-visible:ring-[#d4af37]/30 ${
                  fieldErrors.confirmPassword
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }`}
              />
              {fieldErrors.confirmPassword && (
                <p className="text-sm text-red-600">
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="border-[#d4af37]/50 bg-white/70 text-[#5a3b1f] transition-all duration-200 hover:border-[#d4af37]/80 hover:bg-[#fff7e6] hover:text-[#3b2a1a] hover:shadow-sm"
            >
              Trở lại
            </Button>
            <Button
              onClick={handleReset}
              className="bg-gradient-to-r from-[#c1272d] to-[#d4af37] bg-[length:200%_200%] bg-left text-white shadow-md transition-[background-position,transform,box-shadow] duration-300 hover:bg-right hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
              disabled={isLoading}
            >
              {isLoading ? "ĐANG ĐỔI..." : "Đổi mật khẩu"}
            </Button>
          </div>

          <div className="mt-6 text-center text-sm text-[#6b4d1a]">
            <Link to="/" className="text-blue-600 hover:underline">
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
