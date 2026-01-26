import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  requestPasswordOtp,
  verifyPasswordOtp,
} from "../features/auth/authService";
import { toast } from "sonner";

export function ForgotPasswordVerifyPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(60);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("passwordResetEmail");
    if (!storedEmail) {
      navigate("/quen-mat-khau", { replace: true });
      return;
    }
    setEmail(storedEmail);
  }, [navigate]);

  useEffect(() => {
    if (resendCountdown <= 0) {
      return;
    }
    const timer = window.setTimeout(() => {
      setResendCountdown((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [resendCountdown]);

  const handleVerify = async () => {
    setError("");
    if (isLoading) {
      return;
    }
    const trimmedCode = code.trim();
    if (!trimmedCode) {
      setError("Vui lòng nhập mã");
      return;
    }
    if (!/^\d{6}$/.test(trimmedCode)) {
      setError("Mã phải gồm 6 chữ số");
      return;
    }
    if (!email) {
      setError("Vui lòng nhập email trước");
      return;
    }

    setIsLoading(true);
    try {
      const res = await verifyPasswordOtp({ email, otp: trimmedCode });
      if (res?.resetToken) {
        sessionStorage.setItem("passwordResetToken", res.resetToken);
      }
      toast.success(res?.message || "Xác thực OTP thành công");
      navigate("/quen-mat-khau/doi-mat-khau");
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 400) {
        setError("Mã không hợp lệ. Vui lòng nhập lại.");
      } else {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Xác thực OTP thất bại. Vui lòng thử lại.";
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    if (resendLoading || !email || resendCountdown > 0) {
      return;
    }
    setResendLoading(true);
    setResendCountdown(60);
    try {
      await requestPasswordOtp({ email });
      toast.success("Đã gửi lại mã OTP. Vui lòng kiểm tra email.");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Không thể gửi lại mã OTP. Vui lòng thử lại.";
      setError(message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff7e6] via-white to-[#f8efe2] px-4 py-16 pt-32 md:pt-36">
      <div className="mx-auto w-full max-w-xl">
        <div className="rounded-2xl border border-[#d4af37]/40 bg-white p-8 shadow-[0_18px_50px_-30px_rgba(193,39,45,0.45)]">
          <div className="space-y-2">
            <h1 className="text-2xl text-[#3b2a1a]">Nhập mã bảo mật</h1>
            <p className="text-sm text-[#6b4d1a]">
              Vui lòng kiểm tra mã trong email của bạn. Mã này gồm 6 số.
            </p>
          </div>

          <div className="mt-6 space-y-2">
            <Input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Nhập mã"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleVerify()}
              className={`h-12 bg-white text-[#3b2a1a] placeholder:text-[#9b8760] border-[#d4af37]/50 shadow-sm focus-visible:ring-[#d4af37]/30 ${
                error ? "border-red-500 focus-visible:ring-red-500" : ""
              }`}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>

          <div className="mt-4 text-sm text-[#6b4d1a]">
            <p>Chúng tôi đã gửi mã cho bạn đến:</p>
            <p className="mt-1 font-medium text-[#3b2a1a]">
              {email || "email@example.com"}
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={handleResend}
                disabled={resendLoading || resendCountdown > 0}
                className="text-blue-600 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
              >
                {resendLoading ? "Đang gửi lại..." : "Chưa nhận được mã?"}
              </button>
              <span className="text-[#9b8760]">
                {resendCountdown > 0 ? `${resendCountdown}s` : "Sẵn sàng"}
              </span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="border-[#d4af37]/50 bg-white/70 text-[#5a3b1f] transition-all duration-200 hover:border-[#d4af37]/80 hover:bg-[#fff7e6] hover:text-[#3b2a1a] hover:shadow-sm"
              >
                Trở lại
              </Button>
              <Button
                onClick={handleVerify}
                className="bg-gradient-to-r from-[#c1272d] to-[#d4af37] bg-[length:200%_200%] bg-left text-white shadow-md transition-[background-position,transform,box-shadow] duration-300 hover:bg-right hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
                disabled={isLoading}
              >
                {isLoading ? "ĐANG KIỂM TRA..." : "Tiếp tục"}
              </Button>
            </div>
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
