import { Card } from "./ui/card";
import { Palette, Sparkles, Camera, Gift } from "lucide-react";
import { motion } from "motion/react";

export function FullServicePackages() {
  const services = [
    {
      icon: Palette,
      title: "Makeup Chuyên Nghiệp",
      description: "Trang điểm theo phong cách truyền thống và hiện đại"
    },
    {
      icon: Sparkles,
      title: "Styling Truyền Thống",
      description: "Tư vấn phối đồ và phụ kiện phù hợp sự kiện"
    },
    {
      icon: Camera,
      title: "Chụp Ảnh & Quay Phim",
      description: "Ghi lại khoảnh khắc đẹp với ekip chuyên nghiệp"
    },
    {
      icon: Gift,
      title: "Phụ Kiện Đi Kèm",
      description: "Khăn đóng, nón lá, giày dép, túi xách hoàn chỉnh set"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-gray-900 mb-4">
            Gói Dịch Vụ Toàn Diện
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Giải pháp trọn gói từ makeup đến chụp hình, tạo nội dung cho mọi sự kiện
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="p-6 text-center border-gray-200 bg-white hover:shadow-xl hover:border-red-200 transition-all duration-300 h-full group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-50 to-yellow-50 flex items-center justify-center mb-5 mx-auto group-hover:from-red-100 group-hover:to-yellow-100 transition-colors">
                  <service.icon className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {service.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
