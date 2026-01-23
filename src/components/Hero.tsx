import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Calendar, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

export function Hero() {
  const navigate = useNavigate();
  return (
    <div id="trang-chu" className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black">
      {/* Background Image with Parallax Effect */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1675389017197-9ae63c2b2fe8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYW8lMjBkYWklMjB0cmFkaXRpb25hbCUyMGRyZXNzfGVufDF8fHx8MTc2MTgwNjA4Nnww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Áo dài truyền thống Việt Nam"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-[#1a1a1a]/80 to-black/70" />
      </motion.div>

      {/* Decorative Gold Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute top-20 right-20 w-96 h-96 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)' }}
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-20 left-20 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(193,39,45,0.2) 0%, transparent 70%)' }}
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        {/* Vietnamese Pattern Overlay */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <pattern id="viet-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="2" fill="#d4af37"/>
              <path d="M10,5 L12,8 L10,15 L8,8 Z" fill="#d4af37"/>
            </pattern>
            <rect width="100" height="100" fill="url(#viet-pattern)"/>
          </svg>
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 py-32 w-full">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#d4af37]/20 to-[#c1272d]/20 backdrop-blur-md border border-[#d4af37]/30 rounded-full px-6 py-3 mb-12"
          >
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            <span className="text-[#f0d774] tracking-[0.15em] uppercase text-sm">Bảo Tồn Văn Hóa Việt</span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-7xl lg:text-8xl text-white mb-8 leading-[0.95] tracking-tight font-display">
              Trải Nghiệm
              <br/>
              <span className="inline-block mt-2 bg-gradient-to-r from-[#c1272d] via-[#e63946] to-[#d4af37] bg-clip-text text-transparent font-display italic">
                Áo Dài
              </span>
              <br/>
              <span className="text-6xl lg:text-7xl text-white/90">
                Truyền Thống Việt Nam
              </span>
            </h1>
          </motion.div>
          
          <motion.div 
            className="relative"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-[#d4af37] to-transparent" />
            <p className="text-white/80 text-xl lg:text-2xl mb-12 leading-relaxed max-w-2xl pl-8">
              Nền tảng cao cấp kết hợp công nghệ <span className="text-[#d4af37] font-medium">3D Mannequin</span> cá nhân hóa 
              và <span className="text-[#d4af37] font-medium">AI Stylist</span> thông minh. 
              <span className="block mt-3 text-lg text-white/60">
                Makeup · Styling · Photography · Videography
              </span>
            </p>
          </motion.div>

          <motion.div 
            className="flex flex-wrap gap-5 mb-24"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-[#c1272d] to-[#8b1e1f] hover:from-[#8b1e1f] hover:to-[#c1272d] text-white px-10 h-16 text-lg shadow-gold group relative overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#d4af37]/0 via-[#d4af37]/20 to-[#d4af37]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <Calendar className="w-5 h-5 mr-3" />
              Đặt Lịch Ngay
              <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              className="glass-effect text-white border-white/20 hover:border-[#d4af37]/50 hover:bg-white/20 px-10 h-16 text-lg group"
              onClick={() => navigate("/bo-suu-tap")}
            >
              Khám Phá Bộ Sưu Tập
              <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
            </Button>
          </motion.div>

          {/* Stats - Luxury Edition */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-12 border-t border-[#d4af37]/20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="group">
              <div className="text-6xl font-display text-gradient-gold mb-3 tracking-tight group-hover:scale-110 transition-transform duration-500">
                500<span className="text-3xl">+</span>
              </div>
              <div className="text-white/60 text-sm uppercase tracking-[0.2em]">Trang Phục Độc Đáo</div>
              <div className="h-px w-16 bg-gradient-to-r from-[#d4af37] to-transparent mt-3" />
            </div>
            <div className="group">
              <div className="text-6xl font-display text-gradient-gold mb-3 tracking-tight group-hover:scale-110 transition-transform duration-500">
                50<span className="text-3xl">+</span>
              </div>
              <div className="text-white/60 text-sm uppercase tracking-[0.2em]">Nhà Thiết Kế</div>
              <div className="h-px w-16 bg-gradient-to-r from-[#d4af37] to-transparent mt-3" />
            </div>
            <div className="group">
              <div className="text-6xl font-display text-gradient-gold mb-3 tracking-tight group-hover:scale-110 transition-transform duration-500">
                5K<span className="text-3xl">+</span>
              </div>
              <div className="text-white/60 text-sm uppercase tracking-[0.2em]">Khách Hài Lòng</div>
              <div className="h-px w-16 bg-gradient-to-r from-[#d4af37] to-transparent mt-3" />
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <motion.div 
          className="flex flex-col items-center gap-2 cursor-pointer group"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="text-white/40 text-xs uppercase tracking-[0.2em]">Khám Phá</div>
          <div className="w-px h-16 bg-gradient-to-b from-[#d4af37] to-transparent" />
        </motion.div>
      </motion.div>
    </div>
  );
}
