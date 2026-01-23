import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";
import { Sparkles } from "lucide-react";

export function FashionShowcase() {
  return (
    <section className="py-32 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-5 py-2.5 mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-red-600" />
            <span className="text-gray-700 tracking-wide">Editorial Collection</span>
          </div>
          <h2 className="text-gray-900 mb-4 max-w-3xl mx-auto leading-tight">
            Khám Phá Vẻ Đẹp<br/>
            <span className="italic text-red-600">Văn Hóa Việt</span> Hiện Đại
          </h2>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            Nơi truyền thống gặp gỡ đương đại trong từng đường may tinh xảo
          </p>
        </motion.div>

        {/* Magazine Style Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Large Feature Image */}
          <motion.div 
            className="col-span-12 lg:col-span-7 row-span-2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative h-[600px] rounded-3xl overflow-hidden group">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1761014219701-562ffbdd23f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwdHJhZGl0aW9uYWwlMjBkcmVzcyUyMGVsZWdhbnR8ZW58MXx8fHwxNzYxODEzMzUxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Vietnamese Traditional Dress"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <div className="text-sm uppercase tracking-widest mb-2 text-white/80">Featured Collection</div>
                <h3 className="text-3xl mb-2">Áo Dài Hoàng Gia</h3>
                <p className="text-white/90">Thiết kế lấy cảm hứng từ hoàng triều Nguyễn</p>
              </div>
            </div>
          </motion.div>

          {/* Top Right Image */}
          <motion.div 
            className="col-span-12 lg:col-span-5"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative h-[290px] rounded-3xl overflow-hidden group">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1617213018759-3829f7325bea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwcG9ydHJhaXQlMjBmYXNoaW9ufGVufDF8fHx8MTc2MTc2NTQ5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Modern Vietnamese Fashion"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <div className="text-sm uppercase tracking-widest mb-1 text-white/80">Modern Touch</div>
                <h3 className="text-xl">Áo Dài Cách Tân</h3>
              </div>
            </div>
          </motion.div>

          {/* Bottom Right Image */}
          <motion.div 
            className="col-span-12 lg:col-span-5"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative h-[290px] rounded-3xl overflow-hidden group">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1759563874672-e7dfb1ca3f73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwc3R1ZGlvfGVufDF8fHx8MTc2MTcyODQyOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Luxury Fashion Studio"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white">
                <div className="text-sm uppercase tracking-widest mb-1 text-white/80">Premium Studio</div>
                <h3 className="text-xl">Trải Nghiệm Sang Trọng</h3>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quote Section */}
        <motion.div 
          className="mt-20 text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="text-4xl text-gray-300 mb-4">"</div>
          <p className="text-2xl text-gray-700 italic mb-6 leading-relaxed">
            Mỗi trang phục là một câu chuyện, mỗi chi tiết là một di sản văn hóa được lưu giữ
          </p>
          <div className="text-gray-500">— Sắc Việt Collection</div>
        </motion.div>
      </div>
    </section>
  );
}
