import { ImageWithFallback } from "./figma/ImageWithFallback";
import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";

export function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Nguyễn Minh Anh",
      role: "Cô dâu",
      image: "https://images.unsplash.com/photo-1617213018759-3829f7325bea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwcG9ydHJhaXQlMjBmYXNoaW9ufGVufDF8fHx8MTc2MTc2NTQ5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      content: "Trải nghiệm tuyệt vời! Áo dài cưới tôi chọn từ Sắc Việt thật sự hoàn hảo. Chất liệu cao cấp, thiết kế tinh xảo và dịch vụ chụp ảnh cực kỳ chuyên nghiệp.",
      rating: 5,
      event: "Lễ Cưới"
    },
    {
      id: 2,
      name: "Trần Thu Hà",
      role: "Nhiếp ảnh gia",
      image: "https://images.unsplash.com/photo-1700150642328-a527e0eacdd6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwZWRpdG9yaWFsJTIwbW9kZWx8ZW58MXx8fHwxNzYxNzgxNTkxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      content: "Bộ sưu tập áo dài tại đây rất đa dạng và độc đáo. Tôi thường xuyên hợp tác với Sắc Việt cho các dự án editorial. Chất lượng trang phục luôn vượt kỳ vọng.",
      rating: 5,
      event: "Editorial Shoot"
    },
    {
      id: 3,
      name: "Lê Phương Linh",
      role: "Du khách",
      image: "https://images.unsplash.com/photo-1761014219701-562ffbdd23f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwdHJhZGl0aW9uYWwlMjBkcmVzcyUyMGVsZWdhbnR8ZW58MXx8fHwxNzYxODEzMzUxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      content: "Tôi đến từ Singapore và muốn trải nghiệm áo dài Việt Nam. AI Stylist đã giúp tôi chọn được bộ đồ hoàn hảo phù hợp với tông da. Dịch vụ tận tâm!",
      rating: 5,
      event: "Du Lịch Văn Hóa"
    }
  ];

  return (
    <section className="py-32 bg-gradient-to-b from-white to-gray-50">
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
            <Quote className="w-4 h-4 text-red-600" />
            <span className="text-gray-700 tracking-wide">Khách Hàng Nói Gì</span>
          </div>
          <h2 className="text-gray-900 mb-6 leading-tight">
            Câu Chuyện Từ<br/>
            <span className="italic text-red-600">Khách Hàng</span>
          </h2>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto">
            Những trải nghiệm đáng nhớ và khoảnh khắc tuyệt vời của khách hàng với Sắc Việt
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <ImageWithFallback
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5">
                  <div className="flex items-center gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <div className="text-xs uppercase tracking-wider opacity-80 mb-1">{testimonial.event}</div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <Quote className="w-8 h-8 text-red-200 mb-3" />
                <p className="text-gray-700 mb-6 leading-relaxed">
                  {testimonial.content}
                </p>
                <div className="border-t border-gray-100 pt-4">
                  <div className="text-gray-900 mb-1">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div 
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 p-8 bg-white rounded-3xl shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="text-center">
            <div className="text-4xl text-red-600 mb-2">98%</div>
            <div className="text-gray-600 text-sm">Hài Lòng</div>
          </div>
          <div className="text-center">
            <div className="text-4xl text-red-600 mb-2">4.9/5</div>
            <div className="text-gray-600 text-sm">Đánh Giá</div>
          </div>
          <div className="text-center">
            <div className="text-4xl text-red-600 mb-2">5K+</div>
            <div className="text-gray-600 text-sm">Khách Hàng</div>
          </div>
          <div className="text-center">
            <div className="text-4xl text-red-600 mb-2">100%</div>
            <div className="text-gray-600 text-sm">Chính Hãng</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
