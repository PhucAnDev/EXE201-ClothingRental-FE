import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from "lucide-react";
import logoImage from "figma:asset/36410bb4c7f9be9d338f77ff699328fde2f67245.png";

export function Footer() {
  return (
    <footer id="lien-he" className="relative bg-gradient-to-b from-[#1a1a1a] via-[#0f0f0f] to-black text-white pt-24 pb-12 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-50" />
      <div className="absolute top-20 right-20 w-96 h-96 rounded-full blur-3xl opacity-10" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%)' }} />
      
      <div className="max-w-7xl mx-auto px-8 lg:px-12 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-16 mb-16">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-4 mb-6">
              <img
                src={logoImage}
                alt="Sắc Việt Logo"
                className="w-14 h-14 object-contain"
              />
              <span className="text-3xl font-display tracking-wide">Sắc Việt</span>
            </div>
            <p className="text-white/60 mb-8 leading-relaxed text-sm">
              Nền tảng cao cấp kết nối bạn với vẻ đẹp truyền thống Việt Nam qua công nghệ tiên tiến.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-11 h-11 bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#d4af37] hover:border-[#d4af37] transition-all duration-300 group">
                <Facebook className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
              </a>
              <a href="#" className="w-11 h-11 bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#d4af37] hover:border-[#d4af37] transition-all duration-300 group">
                <Instagram className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
              </a>
              <a href="#" className="w-11 h-11 bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#d4af37] hover:border-[#d4af37] transition-all duration-300 group">
                <Youtube className="w-5 h-5 text-white/60 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white mb-6 uppercase tracking-[0.15em] text-sm font-display">Dịch Vụ</h3>
            <div className="h-px w-12 bg-[#d4af37] mb-6" />
            <ul className="space-y-4">
              <li><a href="#" className="text-white/50 hover:text-[#d4af37] transition-colors duration-300 text-sm">Thuê Trang Phục</a></li>
              <li><a href="#" className="text-white/50 hover:text-[#d4af37] transition-colors duration-300 text-sm">3D Mannequin</a></li>
              <li><a href="#" className="text-white/50 hover:text-[#d4af37] transition-colors duration-300 text-sm">AI Stylist</a></li>
              <li><a href="#" className="text-white/50 hover:text-[#d4af37] transition-colors duration-300 text-sm">Makeup & Styling</a></li>
              <li><a href="#" className="text-white/50 hover:text-[#d4af37] transition-colors duration-300 text-sm">Chụp Hình & Quay Phim</a></li>
            </ul>
          </div>

          {/* Partners */}
          <div>
            <h3 className="text-white mb-6 uppercase tracking-[0.15em] text-sm font-display">Đối Tác</h3>
            <div className="h-px w-12 bg-[#d4af37] mb-6" />
            <ul className="space-y-4">
              <li><a href="#" className="text-white/50 hover:text-[#d4af37] transition-colors duration-300 text-sm">Trở Thành Nhà Thiết Kế</a></li>
              <li><a href="#" className="text-white/50 hover:text-[#d4af37] transition-colors duration-300 text-sm">Hợp Tác Dịch Vụ</a></li>
              <li><a href="#" className="text-white/50 hover:text-[#d4af37] transition-colors duration-300 text-sm">Chương Trình Affiliate</a></li>
              <li><a href="#" className="text-white/50 hover:text-[#d4af37] transition-colors duration-300 text-sm">Về Chúng Tôi</a></li>
              <li><a href="#" className="text-white/50 hover:text-[#d4af37] transition-colors duration-300 text-sm">Tin Tức & Blog</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white mb-6 uppercase tracking-[0.15em] text-sm font-display">Liên Hệ</h3>
            <div className="h-px w-12 bg-[#d4af37] mb-6" />
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <MapPin className="w-5 h-5 text-[#d4af37] mt-0.5 flex-shrink-0" />
                <span className="text-white/50 text-sm leading-relaxed">123 Lê Lợi, Quận 1<br/>TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="w-5 h-5 text-[#d4af37] flex-shrink-0" />
                <a href="tel:0901234567" className="text-white/50 hover:text-[#d4af37] transition-colors text-sm">0901 234 567</a>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="w-5 h-5 text-[#d4af37] flex-shrink-0" />
                <a href="mailto:hello@sacviet.vn" className="text-white/50 hover:text-[#d4af37] transition-colors text-sm">hello@sacviet.vn</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative mt-20 pt-10">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-white/40 text-sm">
              © 2025 Sắc Việt. Bảo tồn & lan tỏa văn hóa Việt
            </p>
            <div className="flex gap-8 text-sm">
              <a href="#" className="text-white/40 hover:text-[#d4af37] transition-colors duration-300">Điều Khoản</a>
              <a href="#" className="text-white/40 hover:text-[#d4af37] transition-colors duration-300">Bảo Mật</a>
              <a href="#" className="text-white/40 hover:text-[#d4af37] transition-colors duration-300">Hỗ Trợ</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
