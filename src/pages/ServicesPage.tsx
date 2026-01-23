import { motion } from "motion/react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Footer } from "../components/Footer";
import { LuxuryPageHeader } from "../components/LuxuryPageHeader";
import { Camera, Paintbrush, Sparkles, Share2, Clock, MapPin, Users, Check, Star } from "lucide-react";
import heroImage from "figma:asset/532164a31566dd71f9e63212f496b6054769ebb7.png";
import packageImage from "figma:asset/532164a31566dd71f9e63212f496b6054769ebb7.png";
import socialMediaImage from "figma:asset/26ab879a51df57edf2534c9ac7c600c41a8a5b23.png";

const fullServicePackages = [
  {
    icon: Paintbrush,
    title: "Trang Điểm Chuyên Nghiệp",
    description: "Makeup truyền thống & hiện đại",
  },
  {
    icon: Sparkles,
    title: "Styling Trang Phục",
    description: "Phối đồ & phụ kiện hoàn hảo",
  },
  {
    icon: Camera,
    title: "Chụp Hình & Quay Phim",
    description: "Photography & videography chuyên nghiệp",
  },
  {
    icon: Share2,
    title: "Social Media",
    description: "Tạo content & chỉnh sửa ảnh",
  },
];

const singleServices = [
  {
    id: 1,
    title: "Trang Điểm Chuyên Nghiệp",
    description: "Dịch vụ makeup cao cấp phù hợp với nhiều loại trang phục truyền thống khác nhau.",
    price: "800.000",
    image: "https://images.unsplash.com/photo-1566895733200-2dea2602a0e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYWtldXAlMjBhc2lhbnxlbnwxfHx8fDE3NjE5NzgyNjh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: 2,
    title: "Styling Tóc & Phụ Kiện",
    description: "Tạo kiểu tóc và lựa chọn phụ kiện phù hợp với phong cách của bạn.",
    price: "600.000",
    image: "https://images.unsplash.com/photo-1626954079979-ec4f7b05e032?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMHN0eWxpbmclMjBoYWlyfGVufDF8fHx8MTc2MTk3ODI2OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: 3,
    title: "Chụp Hình & Quay Phim",
    description: "Ghi lại khoảnh khắc đẹp nhất với đội ngũ nhiếp ảnh gia chuyên nghiệp.",
    price: "1.500.000",
    image: "https://images.unsplash.com/photo-1612052355380-d7c1d631f00f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG90b2dyYXBoeSUyMHN0dWRpbyUyMHBvcnRyYWl0fGVufDF8fHx8MTc2MTk3ODI2OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  },
  {
    id: 4,
    title: "Social Media Content",
    description: "Tạo nội dung và quản lý mạng xã hội để lan toa hình ảnh đẹp.",
    price: "1.200.000",
    image: socialMediaImage,
  },
];

const servicePackages = [
  {
    id: 1,
    badge: "Cơ Bản",
    badgeColor: "bg-gradient-to-r from-[#d4af37] to-[#b8941f]",
    name: "Gói Truyền Thống",
    price: "2.500.000",
    description: "Trải nghiệm hoàn chỉnh với trang phục truyền thống Việt Nam, phù hợp cho các dịp đặc biệt.",
    features: [
      "Thuê 1 bộ trang phục truyền thống (4 giờ)",
      "Trang điểm cơ bản phù hợp trang phục",
      "Chụp ảnh cơ bản (30 phút, 20 ảnh đã chỉnh sửa)",
      "Phụ kiện đi kèm (mũ, túi, giày, khăn)",
    ],
    image: packageImage,
    borderColor: "border-[#d4af37]",
  },
  {
    id: 2,
    badge: "Cao Cấp",
    badgeColor: "bg-gradient-to-r from-[#c1272d] to-[#8b1e1f]",
    name: "Gói Sáng Tạo",
    price: "4.800.000",
    description: "Dành cho những ai muốn bộ ảnh độc đáo với concept sáng tạo và chất lượng chuyên nghiệp.",
    features: [
      "Thuê 2 bộ trang phục (6 giờ)",
      "Trang điểm chuyên nghiệp + tạo kiểu tóc",
      "Chụp ảnh chuyên nghiệp (2 tiếng, 80 ảnh)",
      "Video TikTok/Instagram ngắn (1 video)",
      "Concept sáng tạo độc quyền",
    ],
    image: packageImage,
    borderColor: "border-[#c1272d]",
    featured: true,
  },
  {
    id: 3,
    badge: "VIP",
    badgeColor: "bg-gradient-to-r from-[#d4af37] via-[#f0d774] to-[#d4af37]",
    name: "Gói Hoàng Gia",
    price: "8.500.000",
    description: "Trải nghiệm đẳng cấp 5 sao với dịch vụ cao cấp nhất, phù hợp cho các dịp quan trọng nhất.",
    features: [
      "Thuê không giới hạn trang phục (cả ngày)",
      "Makeup artist & Hair stylist chuyên nghiệp",
      "Chụp ảnh + Quay phim (4 giờ, 180 ảnh + video)",
      "Studio riêng + nhiều địa điểm ngoại cảnh",
      "Album ảnh cao cấp + khung ảnh canvas",
      "Dịch vụ tại nhà (trong thành phố)",
    ],
    image: packageImage,
    borderColor: "border-[#d4af37]",
  },
];

const additionalServices = [
  {
    icon: Clock,
    title: "Thuê Thêm Giờ",
    description: "Gia hạn thời gian sử dụng",
    price: "300.000",
  },
  {
    icon: MapPin,
    title: "Chụp Ngoại Cảnh",
    description: "Di chuyển đến địa điểm mong muốn",
    price: "500.000",
  },
  {
    icon: Users,
    title: "Chụp Nhóm",
    description: "Thêm người tham gia",
    price: "200.000",
  },
];

export function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdfcfb] via-white to-[#fef9f3]">
      {/* Hero Section */}
      <LuxuryPageHeader
        badge="Premium Services"
        title="Dịch Vụ"
        titleAccent="Trọn Gói"
        subtitle="All-in-One"
        description="Từ trang điểm đến nhiếp ảnh chuyên nghiệp, chúng tôi mang đến trải nghiệm hoàn hảo cho mọi khoảnh khắc đáng nhớ. Dịch vụ một chỗ, chất lượng đẳng cấp."
        stats={[
          { value: "20+", label: "Dịch Vụ" },
          { value: "500+", label: "Khách Hàng" },
          { value: "5★", label: "Đánh Giá" },
        ]}
      />

      {/* Full-Service Packages Overview */}
      <section className="py-20 px-8 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#d4af37] uppercase tracking-[0.3em] text-sm">All-in-One</span>
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mt-2 mb-6" />
            <h2 className="text-5xl lg:text-6xl font-display text-[#1a1a1a] mb-6">
              Gói Dịch Vụ Trọn Gói
            </h2>
            <p className="text-[#6b6b6b] text-lg max-w-2xl mx-auto">
              Giải pháp toàn diện từ makeup đến tạo nội dung mạng xã hội
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {fullServicePackages.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-white p-8 border border-[#d4af37]/10 hover:shadow-luxury transition-all duration-500 group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-[#c1272d] to-[#8b1e1f] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-display text-[#1a1a1a] mb-3 text-center">
                    {service.title}
                  </h3>
                  <p className="text-[#6b6b6b] text-center leading-relaxed">
                    {service.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Single Services */}
      <section className="py-24 px-8 lg:px-12 bg-gradient-to-b from-white to-[#fef9f3]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#d4af37] uppercase tracking-[0.3em] text-sm">À La Carte</span>
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mt-2 mb-6" />
            <h2 className="text-5xl lg:text-6xl font-display text-[#1a1a1a] mb-6">
              Dịch Vụ Đơn Lẻ
            </h2>
            <p className="text-[#6b6b6b] text-lg max-w-2xl mx-auto">
              Tạo trải nghiệm hoàn hảo với dịch vụ chuyên nghiệp phù hợp với bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {singleServices.map((service, index) => (
              <motion.div
                key={service.id}
                className="group bg-white overflow-hidden hover:shadow-luxury transition-all duration-500"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
              >
                <div className="aspect-square overflow-hidden bg-[#f5f5f0]">
                  <ImageWithFallback
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-display text-[#1a1a1a] mb-3 group-hover:text-[#c1272d] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-[#6b6b6b] text-sm mb-4 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-[#6b6b6b] block">Từ</span>
                      <span className="text-2xl font-display text-[#c1272d]">
                        {service.price}₫
                      </span>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-[#c1272d] text-[#c1272d] hover:bg-[#c1272d] hover:text-white"
                    >
                      Chi Tiết
                    </Button>
                  </div>
                </div>
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#d4af37]/30 transition-colors duration-500 pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Service Packages */}
      <section className="py-24 px-8 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#d4af37] uppercase tracking-[0.3em] text-sm">Pricing</span>
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mt-2 mb-6" />
            <h2 className="text-5xl lg:text-6xl font-display text-[#1a1a1a] mb-6">
              Gói Dịch Vụ Chi Tiết
            </h2>
            <p className="text-[#6b6b6b] text-lg max-w-2xl mx-auto">
              Chọn gói dịch vụ phù hợp với nhu cầu của bạn
            </p>
          </div>

          <div className="space-y-8">
            {servicePackages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                className={`overflow-hidden bg-white border-2 ${pkg.borderColor} ${
                  pkg.featured ? 'shadow-luxury' : 'shadow-gold'
                } transition-all duration-500 hover:shadow-luxury`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.8 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr]">
                  {/* Left: Details */}
                  <div className="p-8 lg:p-10">
                    <div className="flex items-center gap-3 mb-4">
                      <Badge className={`${pkg.badgeColor} text-white border-none shadow-gold uppercase tracking-wider px-3 py-1 text-xs`}>
                        {pkg.badge}
                      </Badge>
                      {pkg.featured && (
                        <div className="flex items-center gap-1 text-[#d4af37]">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="text-xs uppercase tracking-wider">Best Value</span>
                        </div>
                      )}
                    </div>

                    <h3 className="text-3xl lg:text-4xl font-display text-[#1a1a1a] mb-3">
                      {pkg.name}
                    </h3>

                    <div className="mb-4">
                      <span className="text-4xl lg:text-5xl font-display text-[#c1272d] tracking-tight">
                        {pkg.price}₫
                      </span>
                    </div>

                    <p className="text-[#6b6b6b] mb-6 leading-relaxed">
                      {pkg.description}
                    </p>

                    <div className="space-y-3 mb-8">
                      {pkg.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2.5">
                          <div className="w-5 h-5 bg-gradient-to-br from-[#c1272d] to-[#8b1e1f] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                          </div>
                          <span className="text-[#1a1a1a] text-sm leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button
                      className={`w-full h-12 ${
                        pkg.featured
                          ? 'bg-gradient-to-r from-[#c1272d] to-[#8b1e1f] hover:from-[#8b1e1f] hover:to-[#c1272d] shadow-luxury'
                          : 'bg-gradient-to-r from-[#1a1a1a] to-[#2d1a1a] hover:from-[#2d1a1a] hover:to-[#1a1a1a] shadow-gold'
                      } text-white uppercase tracking-wider text-sm`}
                    >
                      Chọn Gói Này
                    </Button>
                  </div>

                  {/* Right: Image */}
                  <div className="relative h-full min-h-[300px] lg:min-h-[450px] overflow-hidden bg-[#f5f5f0]">
                    <ImageWithFallback
                      src={pkg.image}
                      alt={pkg.name}
                      className="w-full h-full object-cover"
                    />
                    {pkg.featured && (
                      <div className="absolute inset-0 bg-gradient-to-t from-[#c1272d]/60 via-transparent to-transparent" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-24 px-8 lg:px-12 bg-gradient-to-b from-white to-[#fef9f3]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#d4af37] uppercase tracking-[0.3em] text-sm">Add-Ons</span>
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mt-2 mb-6" />
            <h2 className="text-5xl lg:text-6xl font-display text-[#1a1a1a] mb-6">
              Dịch Vụ Bổ Sung
            </h2>
            <p className="text-[#6b6b6b] text-lg max-w-2xl mx-auto">
              Tùy chỉnh trải nghiệm theo nhu cầu riêng của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {additionalServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-white p-10 text-center border border-[#d4af37]/10 hover:shadow-luxury transition-all duration-500 group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.8 }}
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-[#d4af37] to-[#b8941f] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-display text-[#1a1a1a] mb-3">
                    {service.title}
                  </h3>
                  <p className="text-[#6b6b6b] mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <span className="text-3xl font-display text-[#d4af37]">
                    {service.price}₫
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-8 lg:px-12 bg-gradient-to-br from-[#1a1a1a] via-[#2d1a1a] to-black relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-96 h-96 rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%)' }} />
          <div className="absolute bottom-20 left-20 w-[500px] h-[500px] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(193,39,45,0.3) 0%, transparent 70%)' }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl lg:text-6xl font-display text-white mb-6 leading-tight">
              Sẵn Sàng Tạo Những
              <br />
              <span className="text-gradient-gold italic">Khoảnh Khắc Đáng Nhớ?</span>
            </h2>
            <p className="text-white/70 text-lg lg:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              Liên hệ với chúng tôi ngay để được tư vấn miễn phí và đặt lịch hẹn
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                className="h-14 px-12 bg-gradient-to-r from-[#c1272d] to-[#8b1e1f] hover:from-[#8b1e1f] hover:to-[#c1272d] text-white shadow-luxury uppercase tracking-wider"
              >
                Đặt Lịch Ngay
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-12 border-2 border-white text-white hover:bg-white hover:text-[#1a1a1a] uppercase tracking-wider"
              >
                Liên Hệ Tư Vấn
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
