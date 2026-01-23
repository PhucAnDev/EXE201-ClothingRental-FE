import { Card } from "./ui/card";
import { Scan, Sparkles, Camera, Palette, Video, Users } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: Scan,
      title: "3D Mannequin Cá Nhân Hóa",
      description: "Công nghệ 3D tạo ma-nơ-canh theo màu da và số đo cơ thể. Thử đồ ảo như thật.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Sparkles,
      title: "AI Stylist Thông Minh",
      description: "AI gợi ý phối đồ, màu sắc và phụ kiện phù hợp với phong cách của bạn.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Camera,
      title: "Dịch Vụ All-In-One",
      description: "Makeup - Styling - Chụp hình - Quay phim. Trọn gói chuyên nghiệp tại một nơi.",
      gradient: "from-orange-500 to-red-500"
    }
  ];

  return (
    <section id="dich-vu" className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block bg-red-100 text-red-600 rounded-full px-4 py-2 mb-4">
            Dịch Vụ & Công Nghệ
          </div>
          <h2 className="text-gray-900 mb-4">
            Công Nghệ & Dịch Vụ Hiện Đại
          </h2>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto">
            Nền tảng kết hợp AI, 3D và dịch vụ chuyên nghiệp toàn diện
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-8 hover:shadow-xl transition-shadow border-gray-200 bg-white">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
