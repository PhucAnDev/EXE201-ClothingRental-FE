import { Card } from "./ui/card";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Sparkles, Wand2, Palette, Zap } from "lucide-react";
import { Button } from "./ui/button";

export function AIStylist() {
  const features = [
    {
      icon: Sparkles,
      title: "Gợi Ý Thông Minh",
      description: "AI phân tích phong cách cá nhân và đề xuất trang phục phù hợp nhất"
    },
    {
      icon: Palette,
      title: "Phối Màu Hoàn Hảo",
      description: "Tự động phối màu dựa trên tông da và sự kiện của bạn"
    },
    {
      icon: Wand2,
      title: "Phụ Kiện Đồng Bộ",
      description: "Gợi ý phụ kiện và trang sức phù hợp với từng bộ trang phục"
    },
    {
      icon: Zap,
      title: "Nhanh & Chính Xác",
      description: "Kết quả tức thì với độ chính xác cao từ công nghệ AI"
    }
  ];

  return (
    <section id="ai-stylist" className="py-24 bg-gradient-to-b from-white via-purple-50/30 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block bg-purple-100 text-purple-600 rounded-full px-4 py-2 mb-4">
            Công Nghệ AI
          </div>
          <h2 className="text-gray-900 mb-4">
            AI Stylist - Trợ Lý Thời Trang Thông Minh
          </h2>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto">
            Công nghệ AI tiên tiến giúp bạn tìm ra phong cách hoàn hảo chỉ trong vài giây
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Image Side */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1657885428508-5544a57bc3a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzRCUyMGZhc2hpb24lMjB0ZWNobm9sb2d5fGVufDF8fHx8MTc2MTgwNjA4N3ww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="AI Stylist Technology"
                className="w-full aspect-[4/3] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 to-transparent" />
            </div>
            
            {/* Floating Cards */}
            <div className="absolute -right-4 top-8 bg-white rounded-2xl shadow-xl p-4 max-w-[200px] animate-pulse">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span className="text-sm">AI Đang Phân Tích...</span>
              </div>
              <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>
            
            <div className="absolute -left-4 bottom-8 bg-white rounded-2xl shadow-xl p-4 max-w-[180px]">
              <div className="text-xs text-gray-500 mb-1">Độ Phù Hợp</div>
              <div className="text-2xl text-purple-600 mb-1">98%</div>
              <div className="text-xs text-gray-600">Hoàn hảo cho bạn!</div>
            </div>
          </div>

          {/* Features Side */}
          <div className="space-y-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 border-gray-200 hover:shadow-lg transition-shadow bg-white">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white">
          <h3 className="text-white mb-6">Cách Hoạt Động</h3>
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">1</span>
              </div>
              <h4 className="text-white mb-2">Nhập Thông Tin</h4>
              <p className="text-white/80 text-sm">Chiều cao, số đo, màu da và sở thích</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">2</span>
              </div>
              <h4 className="text-white mb-2">AI Phân Tích</h4>
              <p className="text-white/80 text-sm">Hệ thống AI xử lý và tìm kiếm</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">3</span>
              </div>
              <h4 className="text-white mb-2">Nhận Gợi Ý</h4>
              <p className="text-white/80 text-sm">Danh sách trang phục phù hợp nhất</p>
            </div>
          </div>
          <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
            Thử Ngay Miễn Phí
          </Button>
        </div>
      </div>
    </section>
  );
}
