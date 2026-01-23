import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Sparkles, Wand2, Ruler, User } from "lucide-react";
import { Footer } from "../components/Footer";
import { LuxuryPageHeader } from "../components/LuxuryPageHeader";
import { MannequinViewer3D } from "../components/MannequinViewer3D";

const suggestedOutfits = [
  {
    id: 1,
    name: "Áo Dài Đỏ Truyền Thống",
    image: "https://images.unsplash.com/photo-1700721154874-78695c314eed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYW8lMjBkYWklMjB0cmFkaXRpb25hbHxlbnwxfHx8fDE3NjE4MDc4NDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 2,
    name: "Áo Dài Hồng Thanh Lịch",
    image: "https://images.unsplash.com/photo-1759229874810-26aa9a3dda92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZHJlc3MlMjBmYXNoaW9ufGVufDF8fHx8MTc2MTcyMDcwMHww&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 3,
    name: "Áo Tứ Thân Cổ Điển",
    image: "https://images.unsplash.com/photo-1761124884983-7ae144e8ff48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGNvc3R1bWUlMjBhc2lhbnxlbnwxfHx8fDE3NjE4MTAwOTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
  },
  {
    id: 4,
    name: "Áo Dài Xanh Hiện Đại",
    image: "https://images.unsplash.com/photo-1675389017197-9ae63c2b2fe8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYW8lMjBkYWklMjB0cmFkaXRpb25hbCUyMGRyZXNzfGVufDF8fHx8MTc2MTgwNjA4Nnww&ixlib=rb-4.1.0&q=80&w=1080",
  },
];

export function AIStylistPage() {
  const navigate = useNavigate();
  const [gender, setGender] = useState("nu");
  const [height, setHeight] = useState("");
  const [bust, setBust] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [selectedOutfit, setSelectedOutfit] = useState(1);

  const handleRentNow = () => {
    // TODO: Check if user is logged in via your API
    navigate("/thanh-toan");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fdfcfb] via-white to-[#fef9f3]">
      {/* Hero Section */}
      <LuxuryPageHeader
        badge="AI & 3D Technology"
        title="Phòng Thử Đồ"
        titleAccent="Ảo Thông Minh"
        subtitle="AI Stylist"
        description="Cá nhân hóa ma-nơ-canh 3D theo số đo cơ thể của bạn và nhận gợi ý trang phục phù hợp nhất từ AI Stylist thông minh. Trải nghiệm thử đồ ảo như thật, tiết kiệm thời gian."
        stats={[
          { value: "AI", label: "Powered" },
          { value: "3D", label: "Mannequin" },
          { value: "100%", label: "Cá Nhân Hóa" },
        ]}
      />

      {/* How It Works */}
      <section className="py-20 px-8 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[#d4af37] uppercase tracking-[0.3em] text-sm">Process</span>
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mt-2 mb-6" />
            <h2 className="text-5xl lg:text-6xl font-display text-[#1a1a1a] mb-6">
              Cách Hoạt Động
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: User,
                title: "Nhập Số Đo",
                desc: "Cung cấp chiều cao và số đo cơ thể chính xác",
              },
              {
                icon: Wand2,
                title: "AI Phân Tích",
                desc: "Trí tuệ nhân tạo gợi ý trang phục phù hợp",
              },
              {
                icon: Sparkles,
                title: "Thử Đồ 3D",
                desc: "Xem trang phục trên ma-nơ-canh 3D của bạn",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                className="text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#c1272d] to-[#8b1e1f] flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-display text-[#1a1a1a] mb-3">{step.title}</h3>
                <p className="text-[#6b6b6b] leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Left Side - Input & Suggestions */}
            <div className="space-y-8">
              {/* Body Measurements */}
              <motion.div 
                className="bg-white p-10 shadow-luxury border border-[#d4af37]/10"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center gap-3 mb-8">
                  <Ruler className="w-6 h-6 text-[#c1272d]" />
                  <h3 className="text-2xl font-display text-[#c1272d]">
                    Số Đo Cơ Thể
                  </h3>
                </div>

                {/* Gender Selection */}
                <div className="mb-6">
                  <Label className="text-[#1a1a1a] mb-3 block text-sm uppercase tracking-wider">
                    Giới Tính
                  </Label>
                  <Tabs value={gender} onValueChange={setGender} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 h-12 bg-[#f5f5f0]">
                      <TabsTrigger 
                        value="nu" 
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#c1272d] data-[state=active]:to-[#8b1e1f] data-[state=active]:text-white"
                      >
                        Nữ
                      </TabsTrigger>
                      <TabsTrigger 
                        value="nam"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#c1272d] data-[state=active]:to-[#8b1e1f] data-[state=active]:text-white"
                      >
                        Nam
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Measurements Grid */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Height */}
                  <div className="col-span-2">
                    <Label htmlFor="height" className="text-[#1a1a1a] mb-2 block text-sm uppercase tracking-wider">
                      Chiều Cao (cm)
                    </Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="165"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="border-[#d4af37]/30 focus:border-[#c1272d] h-12 bg-[#fdfcfb]"
                    />
                  </div>

                  {/* Bust */}
                  <div>
                    <Label htmlFor="bust" className="text-[#1a1a1a] mb-2 block text-sm uppercase tracking-wider">
                      Vòng Ngực
                    </Label>
                    <Input
                      id="bust"
                      type="number"
                      placeholder="82"
                      value={bust}
                      onChange={(e) => setBust(e.target.value)}
                      className="border-[#d4af37]/30 focus:border-[#c1272d] h-12 bg-[#fdfcfb]"
                    />
                  </div>

                  {/* Waist */}
                  <div>
                    <Label htmlFor="waist" className="text-[#1a1a1a] mb-2 block text-sm uppercase tracking-wider">
                      Vòng Eo
                    </Label>
                    <Input
                      id="waist"
                      type="number"
                      placeholder="65"
                      value={waist}
                      onChange={(e) => setWaist(e.target.value)}
                      className="border-[#d4af37]/30 focus:border-[#c1272d] h-12 bg-[#fdfcfb]"
                    />
                  </div>

                  {/* Hip */}
                  <div className="col-span-2">
                    <Label htmlFor="hip" className="text-[#1a1a1a] mb-2 block text-sm uppercase tracking-wider">
                      Vòng Mông
                    </Label>
                    <Input
                      id="hip"
                      type="number"
                      placeholder="93"
                      value={hip}
                      onChange={(e) => setHip(e.target.value)}
                      className="border-[#d4af37]/30 focus:border-[#c1272d] h-12 bg-[#fdfcfb]"
                    />
                  </div>
                </div>

                <div className="mt-8 p-4 bg-[#fef9f3] border-l-2 border-[#d4af37]">
                  <p className="text-[#6b6b6b] text-sm italic">
                    💡 Nhập đầy đủ số đo để nhận gợi ý chính xác nhất từ AI Stylist
                  </p>
                </div>
              </motion.div>

              {/* Outfit Suggestions */}
              <motion.div 
                className="bg-white p-10 shadow-luxury border border-[#d4af37]/10"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                <div className="flex items-center gap-3 mb-8">
                  <Sparkles className="w-6 h-6 text-[#d4af37]" />
                  <h3 className="text-2xl font-display text-[#c1272d]">
                    AI Gợi Ý Cho Bạn
                  </h3>
                </div>
                
                <div className="grid grid-cols-2 gap-6 mb-8">
                  {suggestedOutfits.map((outfit) => (
                    <button
                      key={outfit.id}
                      onClick={() => setSelectedOutfit(outfit.id)}
                      className={`relative overflow-hidden aspect-[3/4.5] transition-all duration-500 group ${
                        selectedOutfit === outfit.id
                          ? "ring-4 ring-[#c1272d] scale-[0.97]"
                          : "hover:scale-[0.97] opacity-70 hover:opacity-100"
                      }`}
                    >
                      <ImageWithFallback
                        src={outfit.image}
                        alt={outfit.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      {selectedOutfit === outfit.id && (
                        <div className="absolute inset-0 bg-gradient-to-t from-[#c1272d]/80 via-transparent to-transparent flex items-end justify-center pb-4">
                          <div className="w-12 h-12 bg-white flex items-center justify-center">
                            <svg className="w-7 h-7 text-[#c1272d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#d4af37]/40 transition-colors duration-500" />
                    </button>
                  ))}
                </div>

                <Button 
                  variant="outline" 
                  className="w-full h-12 border-2 border-[#c1272d] text-[#c1272d] hover:bg-[#c1272d] hover:text-white transition-all duration-300"
                >
                  Xem Thêm Trang Phục
                </Button>
              </motion.div>
            </div>

            {/* Right Side - 3D Mannequin */}
            <div className="lg:sticky lg:top-32 h-fit">
              <motion.div 
                className="bg-white p-8 shadow-luxury border border-[#d4af37]/10"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h3 className="text-2xl font-display text-[#c1272d] mb-1 text-center">
                  Ma-Nơ-Canh 3D Của Bạn
                </h3>
                <p className="text-[#6b6b6b] text-center mb-6 text-sm">
                  Cá nhân hóa theo số đo thực tế
                </p>
                
                {/* 3D Mannequin Viewer */}
                <div className="relative aspect-[4/5] overflow-hidden mb-6 bg-gradient-to-br from-[#f5f5f0] via-white to-[#fef9f3] border-2 border-[#d4af37]/20">
                  <MannequinViewer3D 
                    height={height}
                    bust={bust}
                    waist={waist}
                    hip={hip}
                    gender={gender}
                  />
                  
                  {/* Decorative corner accents */}
                  <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-[#d4af37]/40" />
                  <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-[#d4af37]/40" />
                  <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-[#d4af37]/40" />
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-[#d4af37]/40" />
                </div>

                {/* Action Button */}
                <Button 
                  size="lg" 
                  className="w-full h-14 bg-gradient-to-r from-[#c1272d] to-[#8b1e1f] hover:from-[#8b1e1f] hover:to-[#c1272d] text-white shadow-luxury text-base uppercase tracking-wider"
                  onClick={handleRentNow}
                >
                  Thuê Ngay Trang Phục
                </Button>

                <div className="mt-6 text-center">
                  <p className="text-[#6b6b6b] text-sm">
                    Hoặc{" "}
                    <button className="text-[#c1272d] hover:text-[#8b1e1f] underline">
                      lưu để sau
                    </button>
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-8 lg:px-12 bg-gradient-to-b from-white to-[#fef9f3]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Chuẩn Xác 100%",
                desc: "Số đo 3D được tính toán chính xác theo thuật toán AI",
              },
              {
                title: "Tiết Kiệm Thời Gian",
                desc: "Thử đồ online, không cần đến cửa hàng",
              },
              {
                title: "Gợi Ý Thông Minh",
                desc: "AI phân tích và đề xuất trang phục phù hợp nhất",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-8 border border-[#d4af37]/10 hover:shadow-luxury transition-shadow duration-500"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.8 }}
              >
                <h4 className="text-xl font-display text-[#1a1a1a] mb-3">{feature.title}</h4>
                <p className="text-[#6b6b6b] leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}