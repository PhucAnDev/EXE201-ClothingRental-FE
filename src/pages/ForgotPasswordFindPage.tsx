import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { requestPasswordOtp } from "../features/auth/authService";
import { toast } from "sonner";

export function ForgotPasswordFindPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(
    () => sessionStorage.getItem("passwordResetEmail") || "",
  );
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    sessionStorage.removeItem("passwordResetToken");
  }, []);

  const handleSubmit = async () => {
    setError("");
    if (isLoading) {
      return;
    }
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Vui lòng nhập email");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("Email không hợp lệ");
      return;
    }

    setIsLoading(true);
    try {
      await requestPasswordOtp({ email: trimmedEmail });
      sessionStorage.setItem("passwordResetEmail", trimmedEmail);
      toast.success("Đã gửi mã OTP. Vui lòng kiểm tra email.");
      navigate("/quen-mat-khau/xac-minh");
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 400) {
        setError("Không tìm thấy tài khoản. Vui lòng nhập email khác.");
      } else {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Không thể gửi mã OTP. Vui lòng thử lại.";
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff7e6] via-white to-[#f8efe2] px-4 py-16 pt-32 md:pt-36">
      <div className="mx-auto w-full max-w-xl">
        <div className="rounded-2xl border border-[#d4af37]/40 bg-white p-8 shadow-[0_18px_50px_-30px_rgba(193,39,45,0.45)]">
          <div className="space-y-2">
            <h1 className="text-2xl text-[#3b2a1a]">Tìm tài khoản</h1>
            <p className="text-sm text-[#6b4d1a]">
              Vui lòng nhập email để tìm kiếm tài khoản của bạn.
            </p>
          </div>

          <div className="mt-6 space-y-2">
            <Input
              type="email"
              placeholder="Email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
              className={`h-12 bg-white text-[#3b2a1a] placeholder:text-[#9b8760] border-[#d4af37]/50 shadow-sm focus-visible:ring-[#d4af37]/30 ${
                error ? "border-red-500 focus-visible:ring-red-500" : ""
              }`}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
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
              onClick={handleSubmit}
              className="bg-gradient-to-r from-[#c1272d] to-[#d4af37] bg-[length:200%_200%] bg-left text-white shadow-md transition-[background-position,transform,box-shadow] duration-300 hover:bg-right hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
              disabled={isLoading}
            >
              {isLoading ? "ĐANG GỬI..." : "Tiếp tục"}
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
