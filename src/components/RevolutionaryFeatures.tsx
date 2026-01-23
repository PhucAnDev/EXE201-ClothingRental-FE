import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Scan, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export function RevolutionaryFeatures() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-gray-900 mb-4">
            Công Nghệ Tiên Phong
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Trải nghiệm tương lai của trang phục truyền thống với công nghệ hiện đại
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* 3D Mannequin Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-8 bg-gradient-to-br from-purple-700 to-purple-900 border-none text-white h-full hover:shadow-2xl transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center mb-6">
                <Scan className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-white mb-3">
                Ma-nơ-canh 3D Cá Nhân
              </h3>
              <p className="text-purple-100 mb-6 leading-relaxed">
                Xem áo dài trên ma-nơ-canh 3D được tùy chỉnh theo màu da, số đo và chiều cao của bạn. Không cần thử trực tiếp, vẫn chọn được outfit hoàn hảo.
              </p>
              <Button 
                className="bg-white text-purple-700 hover:bg-purple-50"
              >
                Khám Phá Ngay
              </Button>
            </Card>
          </motion.div>

          {/* AI Stylist Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-8 bg-gradient-to-br from-red-600 to-red-800 border-none text-white h-full hover:shadow-2xl transition-all duration-300">
              <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center mb-6">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-white mb-3">
                AI Stylist Thông Minh
              </h3>
              <p className="text-red-100 mb-6 leading-relaxed">
                Nhận gợi ý phối đồ, phối màu và phụ kiện được cá nhân hóa dựa trên sở thích và dáng người của bạn từ trợ lý AI chuyên nghiệp.
              </p>
              <Button 
                className="bg-white text-red-700 hover:bg-red-50"
              >
                Tư Vấn Miễn Phí
              </Button>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
