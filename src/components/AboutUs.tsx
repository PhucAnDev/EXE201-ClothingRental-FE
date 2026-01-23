import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Target, Heart, Users, Award } from "lucide-react";

export function AboutUs() {
  const values = [
    {
      icon: Target,
      title: "Sứ Mệnh",
      description: "Lan tỏa và bảo tồn vẻ đẹp trang phục truyền thống Việt Nam cho thế hệ trẻ thông qua công nghệ hiện đại"
    },
    {
      icon: Heart,
      title: "Giá Trị Cốt Lõi",
      description: "Chất lượng, uy tín và đam mê với văn hóa Việt. Luôn đặt trải nghiệm khách hàng lên hàng đầu"
    },
    {
      icon: Users,
      title: "Đội Ngũ",
      description: "Hơn 100 chuyên gia từ nhà thiết kế, stylist, makeup artist đến photographer chuyên nghiệp"
    },
    {
      icon: Award,
      title: "Thành Tựu",
      description: "Phục vụ hơn 5,000 khách hàng, hợp tác với 50+ nhà thiết kế hàng đầu Việt Nam"
    }
  ];

  return (
    <section id="ve-chung-toi" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block bg-red-100 text-red-600 rounded-full px-4 py-2 mb-4">
            Về Chúng Tôi
          </div>
          <h2 className="text-gray-900 mb-4">
            Câu Chuyện Sắc Việt
          </h2>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto">
            Nơi truyền thống gặp gỡ hiện đại, văn hóa Việt được lan tỏa qua từng trang phục
          </p>
        </div>

        {/* Story Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="relative">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1687340800062-eb0d1a71737a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMGZhc2hpb24lMjBkZXNpZ24lMjBzdHVkaW98ZW58MXx8fHwxNzYxODA2MDg2fDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Đội ngũ Sắc Việt"
              className="rounded-3xl shadow-2xl w-full aspect-[4/3] object-cover"
            />
          </div>
          
          <div className="space-y-6">
            <h3 className="text-gray-900">Khởi Nguồn Từ Đam Mê</h3>
            <p className="text-gray-600 text-lg leading-relaxed">
              Sắc Việt ra đời từ mong muốn giúp mọi người dễ dàng tiếp cận và trải nghiệm vẻ đẹp của 
              trang phục truyền thống Việt Nam, đặc biệt là áo dài - biểu tượng văn hóa của dân tộc.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              Chúng tôi tin rằng công nghệ không chỉ là công cụ, mà là cầu nối để văn hóa truyền thống 
              được lan tỏa đến thế hệ trẻ một cách hiện đại và hấp dẫn nhất.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              Với mô hình win-win độc đáo, Sắc Việt mang lại giá trị cho tất cả: khách hàng tiết kiệm chi phí, 
              nhà thiết kế có thêm kênh thu nhập, và cộng đồng được thưởng thức vẻ đẹp Việt mỗi ngày.
            </p>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {values.map((value, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <value.icon className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-gray-900 mb-3">{value.title}</h4>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-12">
          <h3 className="text-gray-900 text-center mb-12">Hành Trình Phát Triển</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-block bg-red-600 text-white rounded-full px-4 py-2 mb-4">
                2023
              </div>
              <h4 className="text-gray-900 mb-2">Khởi Đầu</h4>
              <p className="text-gray-600">
                Ra mắt nền tảng với 50 trang phục và 10 nhà thiết kế
              </p>
            </div>
            <div className="text-center">
              <div className="inline-block bg-red-600 text-white rounded-full px-4 py-2 mb-4">
                2024
              </div>
              <h4 className="text-gray-900 mb-2">Mở Rộng</h4>
              <p className="text-gray-600">
                Tích hợp công nghệ 3D Mannequin và AI Stylist
              </p>
            </div>
            <div className="text-center">
              <div className="inline-block bg-red-600 text-white rounded-full px-4 py-2 mb-4">
                2025
              </div>
              <h4 className="text-gray-900 mb-2">Dẫn Đầu</h4>
              <p className="text-gray-600">
                500+ trang phục, 50+ nhà thiết kế, 5,000+ khách hàng
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
