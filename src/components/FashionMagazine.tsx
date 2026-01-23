import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowRight, Quote } from "lucide-react";
import { Button } from "./ui/button";

export function FashionMagazine() {
  return (
    <section className="py-32 bg-white relative overflow-hidden">
      {/* Subtle Pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h2V0h2v20h2V0h2v20h2V0h2v20h2V0h2v20h2v2H20v-1.5zM0 20h2v20H0V20zm4 0h2v20H4V20zm4 0h2v20H8V20zm4 0h2v20h-2V20zm4 0h2v20h-2V20zm4 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2zm0 4h20v2H20v-2z' fill='%23c1272d' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` 
      }} />

      <div className="max-w-7xl mx-auto px-8 lg:px-12 relative z-10">
        {/* Editorial Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-32">
          {/* Left - Large Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1700721154874-78695c314eed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYW8lMjBkYWklMjB0cmFkaXRpb25hbHxlbnwxfHx8fDE3NjE4MDc4NDd8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Vietnamese Ao Dai Fashion"
                className="w-full h-full object-cover"
              />
              {/* Gold Border Accent */}
              <div className="absolute -bottom-6 -right-6 w-1/2 h-1/2 border-2 border-[#d4af37]/30" />
              <div className="absolute -top-6 -left-6 w-1/3 h-1/3 border-2 border-[#c1272d]/30" />
            </div>
          </motion.div>

          {/* Right - Editorial Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <div className="inline-block mb-4">
                <span className="text-[#d4af37] uppercase tracking-[0.3em] text-xs font-medium">Editorial</span>
              </div>
              <h2 className="text-5xl lg:text-6xl font-display text-[#1a1a1a] mb-6 leading-[1.1] tracking-tight">
                Nghệ Thuật
                <br />
                <span className="text-gradient-gold italic">Trong Từng</span>
                <br />
                Đường May
              </h2>
            </div>

            <div className="relative pl-8 border-l-2 border-[#d4af37]/30">
              <Quote className="absolute -left-2 top-0 w-8 h-8 text-[#d4af37]/20" />
              <p className="text-[#4a4a4a] text-lg leading-relaxed font-display italic mb-6">
                "Mỗi bộ áo dài không chỉ là trang phục, mà là câu chuyện về văn hóa, 
                là tình yêu với truyền thống, là niềm tự hào dân tộc được dệt nên qua từng 
                đường kim mũi chỉ tài hoa."
              </p>
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-[#d4af37]/50 to-transparent" />
                <span className="text-[#6b6b6b] text-sm">Sắc Việt Heritage</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="group">
                <div className="text-4xl font-display text-gradient-gold mb-2">100%</div>
                <p className="text-[#6b6b6b] text-sm uppercase tracking-wider">Thiết Kế Độc Quyền</p>
              </div>
              <div className="group">
                <div className="text-4xl font-display text-gradient-gold mb-2">20+</div>
                <p className="text-[#6b6b6b] text-sm uppercase tracking-wider">Năm Kinh Nghiệm</p>
              </div>
            </div>

            <Button 
              className="bg-[#c1272d] hover:bg-[#8b1e1f] text-white px-10 h-14 text-base shadow-luxury group mt-4"
            >
              Khám Phá Câu Chuyện
              <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
            </Button>
          </motion.div>
        </div>

        {/* Triple Feature */}
        <div className="grid md:grid-cols-3 gap-12">
          {[
            {
              title: "Cá Nhân Hóa",
              desc: "Mannequin 3D theo số đo thực tế của bạn",
              image: "https://images.unsplash.com/photo-1759229874810-26aa9a3dda92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZHJlc3MlMjBmYXNoaW9ufGVufDF8fHx8MTc2MTcyMDcwMHww&ixlib=rb-4.1.0&q=80&w=1080"
            },
            {
              title: "AI Stylist",
              desc: "Gợi ý phối đồ thông minh cho từng dịp",
              image: "https://images.unsplash.com/photo-1761124884983-7ae144e8ff48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGNvc3R1bWUlMjBhc2lhbnxlbnwxfHx8fDE3NjE4MTAwOTV8MA&ixlib=rb-4.1.0&q=80&w=1080"
            },
            {
              title: "All-in-One",
              desc: "Makeup, styling, photo & video tại một nơi",
              image: "https://images.unsplash.com/photo-1676696970495-f16aac1ad17f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwd29tYW4lMjB0cmFkaXRpb25hbCUyMGNvc3R1bWV8ZW58MXx8fHwxNzYxODA2MDg2fDA&ixlib=rb-4.1.0&q=80&w=1080"
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="group"
            >
              <div className="relative aspect-square overflow-hidden mb-6">
                <ImageWithFallback
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/80 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="h-px w-12 bg-[#d4af37] mb-4" />
                  <h3 className="text-white text-2xl font-display mb-2">{feature.title}</h3>
                </div>
              </div>
              <p className="text-[#6b6b6b] leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
