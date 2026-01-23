import { Card } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Users, PenTool, Briefcase, Heart, Calendar, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "./ui/button";

export function Benefits() {
  const benefits = [
    {
      icon: Users,
      title: "Khách Hàng",
      items: [
        "Tiết kiệm chi phí so với mua mới",
        "Trải nghiệm nhiều phong cách khác nhau",
        "Dịch vụ all-in-one tiện lợi",
        "Công nghệ 3D & AI hỗ trợ lựa chọn"
      ],
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      icon: PenTool,
      title: "Nhà Thiết Kế",
      items: [
        "Kênh quảng bá sản phẩm rộng rãi",
        "Tăng doanh thu từ cho thuê",
        "Kết nối với khách hàng tiềm năng",
        "Xây dựng thương hiệu cá nhân"
      ],
      color: "text-purple-600",
      bg: "bg-purple-50"
    },
    {
      icon: Briefcase,
      title: "Đối Tác Dịch Vụ",
      items: [
        "Mở rộng cơ hội hợp tác",
        "Tăng lượng khách hàng ổn định",
        "Nền tảng quản lý chuyên nghiệp",
        "Hỗ trợ marketing & branding"
      ],
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      icon: Heart,
      title: "Cộng Đồng",
      items: [
        "Lan tỏa văn hóa Việt hiện đại",
        "Bảo tồn trang phục truyền thống",
        "Kết nối yêu thích nghệ thuật",
        "Tạo xu hướng mặc áo dài"
      ],
      color: "text-red-600",
      bg: "bg-red-50"
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
          <div className="inline-block bg-red-100 text-red-600 rounded-full px-5 py-2.5 mb-6 shadow-sm">
            <span className="tracking-wide">Win-Win Model</span>
          </div>
          <h2 className="text-gray-900 mb-4 leading-tight">
            Lợi Ích Cho Mọi Bên
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Hệ sinh thái bền vững mang lại giá trị cho tất cả
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="p-6 border-gray-200 bg-white hover:shadow-xl transition-all duration-300 h-full">
              <div className={`w-12 h-12 rounded-xl ${benefit.bg} flex items-center justify-center mb-4`}>
                <benefit.icon className={`w-6 h-6 ${benefit.color}`} />
              </div>
              <h3 className="text-gray-900 mb-4">{benefit.title}</h3>
              <ul className="space-y-2">
                {benefit.items.map((item, idx) => (
                  <li key={idx} className="text-gray-600 flex items-start gap-2 text-sm">
                    <span className={`${benefit.color} mt-1`}>✓</span>
                    <span className="flex-1">{item}</span>
                  </li>
                ))}
              </ul>
            </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
