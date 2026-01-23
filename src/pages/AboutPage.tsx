import { motion } from "motion/react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Button } from "../components/ui/button";
import { Footer } from "../components/Footer";
import { LuxuryPageHeader } from "../components/LuxuryPageHeader";
import { Heart, Lightbulb, Award, Users, TrendingUp, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import storyImage from "../assets/36410bb4c7f9be9d338f77ff699328fde2f67245.png";

const coreValues = [
  {
    icon: Heart,
    title: "Tôn Vinh Truyền Thống",
    description:
      "Mỗi trang phục là sự kết hợp hoàn hảo giữa bản sắc văn hóa và nghệ thuật đương đại",
  },
  {
    icon: Lightbulb,
    title: "Sáng Tạo Đổi Mới",
    description:
      "Ứng dụng công nghệ AI và 3D để mang đến trải nghiệm cá nhân hóa độc đáo",
  },
  {
    icon: Award,
    title: "Chất Lượng Đảm Bảo",
    description:
      "Cam kết cung cấp trang phục cao cấp và dịch vụ chuyên nghiệp 5 sao",
  },
];

const stats = [
  {
    icon: Users,
    value: "500+",
    label: "Khách Hàng",
  },
  {
    icon: TrendingUp,
    value: "10K+",
    label: "Lượt Thuê",
  },
  {
    icon: Star,
    value: "98%",
    label: "Hài Lòng",
  },
];

const timeline = [
  {
    year: "2020",
    title: "Khởi Đầu",
    description:
      "Thành lập Sắc Việt với tầm nhìn tôn vinh áo dài và trang phục truyền thống Việt Nam",
  },
  {
    year: "2022",
    title: "Đổi Mới Công Nghệ",
    description:
      "Ra mắt hệ thống AI Stylist và ma-nơ-canh 3D cá nhân hóa đầu tiên tại Việt Nam",
  },
  {
    year: "2024",
    title: "Phát Triển Bền Vững",
    description:
      "Mở rộng bộ sưu tập với 200+ thiết kế độc quyền và phục vụ 500+ khách hàng",
  },
];

export function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdfcfb] via-white to-[#fef9f3]">
      {/* Hero Section */}
      <LuxuryPageHeader
        badge="Our Story"
        title="Về"
        titleAccent="Sắc Việt"
        subtitle="Heritage Meets Innovation"
        description="Nơi giao thoa giữa truyền thống và hiện đại, mang đến những trải nghiệm trang phục độc đáo và đầy bản sắc. Chúng tôi tôn vinh vẻ đẹp văn hóa Việt qua từng thiết kế tinh tế."
        stats={[
          { value: "2020", label: "Thành Lập" },
          { value: "200+", label: "Thiết Kế" },
          { value: "500+", label: "Khách Hàng" },
        ]}
      />

      {/* Our Mission Section */}
      <section className="py-24 px-8 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[#d4af37] uppercase tracking-[0.3em] text-sm">
                Mission
              </span>
              <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mt-2 mb-6" />

              <h2 className="text-5xl lg:text-6xl font-display text-[#1a1a1a] mb-8">
                Sứ Mệnh
                <br />
                <span className="text-gradient-red italic">Của Chúng Tôi</span>
              </h2>

              <div className="space-y-6 text-[#6b6b6b] text-lg leading-relaxed">
                <p>
                  <strong className="text-[#c1272d]">Sắc Việt</strong> ra đời
                  với sứ mệnh tôn vinh vẻ đẹp trang phục truyền thống Việt Nam,
                  đặc biệt là áo dài - biểu tượng văn hóa đầy tinh tế và duyên
                  dáng.
                </p>
                <p>
                  Chúng tôi không chỉ đơn thuần cho thuê trang phục, mà còn kiến
                  tạo những trải nghiệm hoàn chỉnh với công nghệ AI stylist,
                  ma-nơ-canh 3D cá nhân hóa, và dịch vụ chuyên nghiệp từ makeup
                  đến nhiếp ảnh.
                </p>
                <p>
                  Với cam kết về chất lượng và sự sáng tạo, chúng tôi mong muốn
                  mỗi khách hàng đều tìm thấy phiên bản đẹp nhất của chính mình
                  trong trang phục truyền thống đầy tự hào.
                </p>
              </div>

              <Button
                className="mt-8 h-12 px-8 bg-gradient-to-r from-[#c1272d] to-[#8b1e1f] hover:from-[#8b1e1f] hover:to-[#c1272d] text-white shadow-luxury uppercase tracking-wider"
                onClick={() => navigate("/bo-suu-tap")}
              >
                Khám Phá Bộ Sưu Tập
              </Button>
            </motion.div>

            {/* Right: Image */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="overflow-hidden shadow-luxury bg-[#f5f5f0]">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1676697021566-0403052c42a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwd29tYW4lMjB0cmFkaXRpb25hbCUyMGRyZXNzJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzYxOTc4Nzg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Sứ mệnh Sắc Việt"
                  className="w-full h-full object-cover aspect-[4/5]"
                />
              </div>
              {/* Decorative Border */}
              <div className="absolute inset-0 border-2 border-[#d4af37]/20 -translate-x-4 -translate-y-4 -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-24 px-8 lg:px-12 bg-gradient-to-b from-white to-[#fef9f3]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#d4af37] uppercase tracking-[0.3em] text-sm">
              Values
            </span>
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mt-2 mb-6" />
            <h2 className="text-5xl lg:text-6xl font-display text-[#1a1a1a] mb-6">
              Giá Trị Cốt Lõi
            </h2>
            <p className="text-[#6b6b6b] text-lg max-w-2xl mx-auto">
              Những nguyên tắc định hướng hoạt động của Sắc Việt
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coreValues.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={index}
                  className="bg-white p-10 text-center border border-[#d4af37]/10 hover:shadow-luxury transition-all duration-500 group"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.8 }}
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-[#c1272d] to-[#8b1e1f] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Icon className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-display text-[#1a1a1a] mb-4">
                    {value.title}
                  </h3>
                  <p className="text-[#6b6b6b] leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24 px-8 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Image */}
            <motion.div
              className="relative order-2 lg:order-1"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="overflow-hidden shadow-luxury bg-[#f5f5f0]">
                <ImageWithFallback
                  src={storyImage}
                  alt="Câu chuyện Sắc Việt"
                  className="w-full h-full object-cover aspect-[4/5]"
                />
              </div>
              {/* Decorative Border */}
              <div className="absolute inset-0 border-2 border-[#c1272d]/20 translate-x-4 translate-y-4 -z-10" />
            </motion.div>

            {/* Right: Story + Stats */}
            <motion.div
              className="order-1 lg:order-2"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-[#d4af37] uppercase tracking-[0.3em] text-sm">
                Heritage
              </span>
              <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mt-2 mb-6" />

              <h2 className="text-5xl lg:text-6xl font-display text-[#1a1a1a] mb-8">
                Câu Chuyện
                <br />
                <span className="text-gradient-gold italic">Của Chúng Tôi</span>
              </h2>

              <div className="space-y-6 text-[#6b6b6b] text-lg leading-relaxed mb-10">
                <p>
                  Khởi nguồn từ niềm đam mê với áo dài và trang phục truyền
                  thống, <strong className="text-[#c1272d]">Sắc Việt</strong>{" "}
                  được thành lập vào năm 2020 với mục tiêu tạo ra một nền tảng
                  hiện đại để mọi người dễ dàng tiếp cận và trải nghiệm vẻ đẹp
                  văn hóa Việt.
                </p>
                <p>
                  Chúng tôi đã xây dựng một bộ sưu tập độc đáo với hơn 200 mẫu
                  thiết kế, kết hợp cùng công nghệ AI và 3D tiên tiến để mang
                  đến trải nghiệm cá nhân hóa chưa từng có.
                </p>
                <p>
                  Hành trình của chúng tôi là hành trình lan tỏa và gìn giữ bản
                  sắc văn hóa Việt Nam qua từng bộ trang phục, từng khoảnh khắc
                  đáng nhớ.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={index}
                      className="text-center p-4 bg-gradient-to-b from-white to-[#fef9f3] border border-[#d4af37]/10"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                    >
                      <div className="flex justify-center mb-3">
                        <Icon className="w-8 h-8 text-[#d4af37]" />
                      </div>
                      <div className="text-4xl font-display text-[#c1272d] mb-1">
                        {stat.value}
                      </div>
                      <div className="text-xs uppercase tracking-wider text-[#6b6b6b]">
                        {stat.label}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 px-8 lg:px-12 bg-gradient-to-b from-white to-[#fef9f3]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#d4af37] uppercase tracking-[0.3em] text-sm">
              Journey
            </span>
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mt-2 mb-6" />
            <h2 className="text-5xl lg:text-6xl font-display text-[#1a1a1a] mb-6">
              Hành Trình Phát Triển
            </h2>
          </div>

          <div className="space-y-8">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                className="grid grid-cols-[100px_1fr] gap-8 items-start"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
              >
                {/* Year */}
                <div className="text-right">
                  <span className="text-5xl font-display text-gradient-gold">
                    {item.year}
                  </span>
                </div>

                {/* Content */}
                <div className="relative pl-8 border-l-2 border-[#d4af37]/20 pb-8">
                  {/* Dot */}
                  <div className="absolute left-0 top-2 w-4 h-4 bg-gradient-to-br from-[#c1272d] to-[#8b1e1f] -translate-x-[9px]" />

                  <h3 className="text-2xl font-display text-[#1a1a1a] mb-3">
                    {item.title}
                  </h3>
                  <p className="text-[#6b6b6b] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-8 lg:px-12 bg-gradient-to-br from-[#1a1a1a] via-[#2d1a1a] to-black relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute top-20 right-20 w-96 h-96 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(212,175,55,0.3) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-20 left-20 w-[500px] h-[500px] rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(193,39,45,0.3) 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl lg:text-6xl font-display text-white mb-6 leading-tight">
              Khám Phá Vẻ Đẹp
              <br />
              <span className="text-gradient-gold italic">
                Văn Hóa Truyền Thống
              </span>
            </h2>
            <p className="text-white/70 text-lg lg:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              Bắt đầu hành trình tìm kiếm trang phục hoàn hảo với công nghệ AI
              tiên tiến
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                className="h-14 px-12 bg-gradient-to-r from-[#c1272d] to-[#8b1e1f] hover:from-[#8b1e1f] hover:to-[#c1272d] text-white shadow-luxury uppercase tracking-wider"
                onClick={() => navigate("/bo-suu-tap")}
              >
                Khám Phá Ngay
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-12 border-2 border-white text-white hover:bg-white hover:text-[#1a1a1a] uppercase tracking-wider"
                onClick={() => navigate("/ai-stylist")}
              >
                Trải Nghiệm AI
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
