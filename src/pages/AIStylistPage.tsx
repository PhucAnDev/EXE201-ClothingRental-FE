import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Sparkles,
  Ruler,
  Check,
  Video,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Footer } from "../components/Footer";
import { LuxuryPageHeader } from "../components/LuxuryPageHeader";
import { VirtualTryOnVideo } from "../components/VirtualTryOnVideo";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  getOutfits,
  getOutfitImages,
  type OutfitItem,
  type OutfitImageItem,
} from "../features/outfit/outfitService";

/** Pick the best image URL from the images list (lowest sortOrder first). */
const selectPrimaryImage = (images: OutfitImageItem[]) => {
  if (!images.length) return "";
  const sorted = [...images].sort((a, b) => {
    const aOrder =
      typeof a.sortOrder === "number" ? a.sortOrder : Number.POSITIVE_INFINITY;
    const bOrder =
      typeof b.sortOrder === "number" ? b.sortOrder : Number.POSITIVE_INFINITY;
    return aOrder - bOrder;
  });
  return sorted[0]?.imageUrl || "";
};

interface DisplayOutfit {
  id: number;
  name: string;
  image: string;
  price: number;
  gender?: string;
}

export function AIStylistPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [gender, setGender] = useState("nu");
  const [height, setHeight] = useState("");
  const [bust, setBust] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [selectedOutfit, setSelectedOutfit] = useState<number | null>(null);

  // --- Outfit API state ---
  const [outfits, setOutfits] = useState<DisplayOutfit[]>([]);
  const [outfitsLoading, setOutfitsLoading] = useState(false);
  const [outfitsError, setOutfitsError] = useState("");
  const [outfitsFetched, setOutfitsFetched] = useState(false);
  const [displayCount, setDisplayCount] = useState(4);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(
    null,
  );

  /** Download video file to user's machine */
  const handleDownloadVideo = () => {
    if (!generatedVideoUrl) return;

    const link = document.createElement("a");
    link.href = generatedVideoUrl;
    link.download = `virtual-tryon-${selectedOutfit || "video"}-${Date.now()}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /** Fetch outfits from API, enrich with images */
  const fetchOutfitsFromApi = useCallback(async () => {
    if (outfitsFetched) return; // don't re-fetch
    setOutfitsLoading(true);
    setOutfitsError("");
    try {
      const token = localStorage.getItem("authToken");
      const res = await getOutfits(token);
      const list = Array.isArray(res?.data) ? res.data : [];

      // Filter by selected gender if available
      const filtered = list.filter((o) => {
        if (!o.outfitId) return false;
        // Only show available outfits
        const status = (o.status ?? "").toLowerCase();
        if (status && status !== "available") return false;
        return true;
      });

      // Enrich with images in parallel
      const enriched: DisplayOutfit[] = await Promise.all(
        filtered.map(async (outfit) => {
          let imageUrl = outfit.primaryImageUrl || "";
          try {
            const imgRes = await getOutfitImages(outfit.outfitId!, token);
            const imgs = Array.isArray(imgRes?.data) ? imgRes.data : [];
            imageUrl = selectPrimaryImage(imgs) || imageUrl;
          } catch {
            // keep fallback
          }
          return {
            id: outfit.outfitId!,
            name: outfit.name || "Trang phục",
            image: imageUrl,
            price:
              typeof outfit.baseRentalPrice === "number"
                ? outfit.baseRentalPrice
                : Number(outfit.baseRentalPrice) || 0,
            gender: outfit.gender?.toLowerCase() ?? undefined,
          };
        }),
      );

      setOutfits(enriched);
      setOutfitsFetched(true);
      // Auto-select first outfit if available
      if (enriched.length > 0 && selectedOutfit === null) {
        setSelectedOutfit(enriched[0].id);
      }
    } catch {
      setOutfitsError("Không thể tải danh sách trang phục. Vui lòng thử lại.");
    } finally {
      setOutfitsLoading(false);
    }
  }, [outfitsFetched, selectedOutfit]);

  // Fetch outfits when entering step 2
  useEffect(() => {
    if (currentStep === 2) {
      fetchOutfitsFromApi();
    }
  }, [currentStep, fetchOutfitsFromApi]);

  // Filter outfits by gender for display
  const filteredOutfits = outfits.filter((o) => {
    if (!o.gender) return true;
    if (gender === "nu")
      return o.gender === "female" || o.gender === "nữ" || o.gender === "nu";
    if (gender === "nam") return o.gender === "male" || o.gender === "nam";
    return true;
  });

  const visibleOutfits = filteredOutfits.slice(0, displayCount);
  const hasMore = filteredOutfits.length > displayCount;

  const handleRentNow = () => {
    navigate("/thanh-toan");
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // --- Measurement validation ---
  const h = Number(height);
  const b = Number(bust);
  const w = Number(waist);
  const hp = Number(hip);

  const measurementErrors: string[] = [];

  if (height && (h < 100 || h > 220)) {
    measurementErrors.push("Chiều cao phải từ 100cm đến 220cm");
  }
  if (bust && (b < 60 || b > 150)) {
    measurementErrors.push("Vòng ngực phải từ 60cm đến 150cm");
  }
  if (waist && (w < 45 || w > 130)) {
    measurementErrors.push("Vòng eo phải từ 45cm đến 130cm");
  }
  if (hip && (hp < 60 || hp > 150)) {
    measurementErrors.push("Vòng mông phải từ 60cm đến 150cm");
  }
  // Cross-field: waist should be smaller than bust and hip
  if (bust && waist && hip && b > 0 && w > 0 && hp > 0) {
    if (w >= b && w >= hp) {
      measurementErrors.push("Vòng eo phải nhỏ hơn vòng ngực hoặc vòng mông");
    }
  }

  const allFieldsFilled = !!(height && bust && waist && hip);
  const isStep1Complete = allFieldsFilled && measurementErrors.length === 0;
  const isStep2Complete = selectedOutfit !== null && selectedOutfit > 0;

  const steps = [
    { number: 1, title: "Nhập Số Đo", icon: Ruler },
    { number: 2, title: "Chọn Trang Phục", icon: Sparkles },
    { number: 3, title: "Tạo Video 360°", icon: Video },
  ];

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

      {/* Main Content */}
      <section className="py-24 px-8 lg:px-12 bg-gradient-to-b from-[#fef3ef] to-[#fef9f3]">
        <div className="max-w-7xl mx-auto">
          {/* Progress Bar - Minimal Style */}
          <div className="mb-16">
            <div className="flex items-center justify-center gap-16 relative">
              {/* Steps */}
              {steps.map((step) => {
                const StepIcon = step.icon;
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;

                return (
                  <div
                    key={step.number}
                    className="flex flex-col items-center relative"
                  >
                    {/* Step Number and Title */}
                    <div className="text-center mb-4">
                      <p
                        className={`text-xs uppercase tracking-widest mb-1 transition-colors duration-300 ${
                          isActive
                            ? "text-[#c1272d] font-semibold"
                            : "text-[#6b6b6b]"
                        }`}
                      >
                        Bước {step.number}
                      </p>
                      <p
                        className={`text-sm transition-colors duration-300 ${
                          isActive
                            ? "text-[#c1272d] font-medium"
                            : "text-[#6b6b6b]"
                        }`}
                      >
                        {step.title}
                      </p>
                    </div>

                    {/* Active Indicator Line */}
                    <div
                      className={`h-1 w-24 transition-all duration-500 ${
                        isActive
                          ? "bg-gradient-to-r from-[#c1272d] via-[#d4af37] to-[#c1272d] scale-x-100"
                          : isCompleted
                            ? "bg-[#d4af37] scale-x-100"
                            : "bg-[#e5e5e5] scale-x-75"
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step Content */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Side - Step Forms */}
            <div className="space-y-8">
              {/* Step 1: Body Measurements */}
              {currentStep === 1 && (
                <div className="bg-white rounded-sm shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-l-4 border-[#d4af37] overflow-hidden">
                  <div className="p-10">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c1272d] to-[#8b1e1f] flex items-center justify-center">
                        <Ruler className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-2xl font-display text-[#c1272d]">
                        Thử Đồ Ảo AI
                      </h3>
                    </div>

                    {/* Gender Selection */}
                    <div className="mb-6">
                      <Label className="text-[#1a1a1a] mb-3 block text-sm font-medium">
                        Giới tính
                      </Label>
                      <Tabs
                        value={gender}
                        onValueChange={setGender}
                        className="w-full"
                      >
                        <TabsList className="grid w-full grid-cols-2 h-11 bg-[#fef9f3]">
                          <TabsTrigger
                            value="nu"
                            className="data-[state=active]:bg-[#c1272d] data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
                          >
                            Nữ
                          </TabsTrigger>
                          <TabsTrigger
                            value="nam"
                            className="data-[state=active]:bg-[#c1272d] data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300"
                          >
                            Nam
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>

                    {/* Measurements Grid */}
                    <div className="space-y-4">
                      {/* Height */}
                      <div>
                        <Label
                          htmlFor="height"
                          className="text-[#1a1a1a] mb-2 block text-sm font-medium"
                        >
                          Chiều cao
                        </Label>
                        <Input
                          id="height"
                          type="number"
                          min={100}
                          max={220}
                          placeholder="165 cm"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          className={`h-11 bg-white transition-all duration-300 ${
                            height && (h < 100 || h > 220)
                              ? "border-red-400 focus:border-red-500 focus:ring-red-200/30"
                              : "border-[#e5e5e5] focus:border-[#c1272d] focus:ring-[#c1272d]/10"
                          } focus:ring-2`}
                        />
                        {height && (h < 100 || h > 220) && (
                          <p className="text-red-500 text-xs mt-1">
                            100 – 220 cm
                          </p>
                        )}
                      </div>

                      {/* Measurements Row */}
                      <div className="grid grid-cols-3 gap-4">
                        {/* Bust */}
                        <div>
                          <Label
                            htmlFor="bust"
                            className="text-[#1a1a1a] mb-2 block text-sm font-medium"
                          >
                            Ngực
                          </Label>
                          <Input
                            id="bust"
                            type="number"
                            min={60}
                            max={150}
                            placeholder="91 cm"
                            value={bust}
                            onChange={(e) => setBust(e.target.value)}
                            className={`h-11 bg-white transition-all duration-300 ${
                              bust && (b < 60 || b > 150)
                                ? "border-red-400 focus:border-red-500 focus:ring-red-200/30"
                                : "border-[#e5e5e5] focus:border-[#c1272d] focus:ring-[#c1272d]/10"
                            } focus:ring-2`}
                          />
                          {bust && (b < 60 || b > 150) && (
                            <p className="text-red-500 text-xs mt-1">
                              60 – 150 cm
                            </p>
                          )}
                        </div>

                        {/* Waist */}
                        <div>
                          <Label
                            htmlFor="waist"
                            className="text-[#1a1a1a] mb-2 block text-sm font-medium"
                          >
                            Eo
                          </Label>
                          <Input
                            id="waist"
                            type="number"
                            min={45}
                            max={130}
                            placeholder="64 cm"
                            value={waist}
                            onChange={(e) => setWaist(e.target.value)}
                            className={`h-11 bg-white transition-all duration-300 ${
                              waist && (w < 45 || w > 130)
                                ? "border-red-400 focus:border-red-500 focus:ring-red-200/30"
                                : "border-[#e5e5e5] focus:border-[#c1272d] focus:ring-[#c1272d]/10"
                            } focus:ring-2`}
                          />
                          {waist && (w < 45 || w > 130) && (
                            <p className="text-red-500 text-xs mt-1">
                              45 – 130 cm
                            </p>
                          )}
                        </div>

                        {/* Hip */}
                        <div>
                          <Label
                            htmlFor="hip"
                            className="text-[#1a1a1a] mb-2 block text-sm font-medium"
                          >
                            Mông
                          </Label>
                          <Input
                            id="hip"
                            type="number"
                            min={60}
                            max={150}
                            placeholder="93 cm"
                            value={hip}
                            onChange={(e) => setHip(e.target.value)}
                            className={`h-11 bg-white transition-all duration-300 ${
                              hip && (hp < 60 || hp > 150)
                                ? "border-red-400 focus:border-red-500 focus:ring-red-200/30"
                                : "border-[#e5e5e5] focus:border-[#c1272d] focus:ring-[#c1272d]/10"
                            } focus:ring-2`}
                          />
                          {hip && (hp < 60 || hp > 150) && (
                            <p className="text-red-500 text-xs mt-1">
                              60 – 150 cm
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Validation errors */}
                    {allFieldsFilled && measurementErrors.length > 0 && (
                      <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-sm">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                          <div className="space-y-1">
                            {measurementErrors.map((err, i) => (
                              <p key={i} className="text-red-600 text-sm">
                                {err}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-8 p-5 bg-[#fffbf5] border-l-4 border-[#d4af37] rounded-sm">
                      <p className="text-[#6b6b6b] text-sm leading-relaxed flex items-start gap-2">
                        <span className="text-lg">✨</span>
                        <span>
                          <span className="text-[#c1272d] font-medium">
                            Công nghệ AI - Kết quả trong ~5 giây
                          </span>
                          <br />
                          Tạo video 360° với trang phục đã chọn theo số đo cơ
                          thể của bạn. Video sẽ hiển thị ở khung bên phải.
                        </span>
                      </p>
                    </div>

                    {/* Navigation */}
                    <div className="mt-8 flex justify-end gap-4">
                      <Button
                        onClick={handleNextStep}
                        disabled={!isStep1Complete}
                        className="h-12 px-10 bg-[#c1272d] hover:bg-[#8b1e1f] text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                      >
                        Tiếp Theo →
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Outfit Selection */}
              {currentStep === 2 && (
                <div className="bg-white rounded-sm shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-l-4 border-[#d4af37] overflow-hidden">
                  <div className="p-10">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8941f] flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-2xl font-display text-[#c1272d]">
                        AI Gợi Ý Cho Bạn
                      </h3>
                    </div>

                    {/* Outfit Grid */}
                    {outfitsLoading ? (
                      <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <Loader2 className="w-8 h-8 text-[#c1272d] animate-spin" />
                        <p className="text-[#6b6b6b] text-sm">
                          Đang tải trang phục...
                        </p>
                      </div>
                    ) : outfitsError ? (
                      <div className="flex flex-col items-center justify-center py-16 gap-3">
                        <p className="text-red-500 text-sm text-center">
                          {outfitsError}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setOutfitsFetched(false);
                            fetchOutfitsFromApi();
                          }}
                          className="border-[#c1272d] text-[#c1272d] hover:bg-[#fef9f3]"
                        >
                          Thử lại
                        </Button>
                      </div>
                    ) : filteredOutfits.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-16">
                        <p className="text-[#6b6b6b] text-sm">
                          Chưa có trang phục nào.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-2 gap-5 mb-8">
                          {visibleOutfits.map((outfit) => (
                            <button
                              key={outfit.id}
                              onClick={() => setSelectedOutfit(outfit.id)}
                              className={`relative overflow-hidden aspect-[3/4] rounded-sm transition-all duration-400 group ${
                                selectedOutfit === outfit.id
                                  ? "ring-[3px] ring-[#c1272d] shadow-xl"
                                  : "hover:shadow-lg opacity-80 hover:opacity-100"
                              }`}
                            >
                              <ImageWithFallback
                                src={outfit.image}
                                alt={outfit.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              {/* Outfit name overlay */}
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 pointer-events-none">
                                <p className="text-white text-xs font-medium truncate">
                                  {outfit.name}
                                </p>
                                {outfit.price > 0 && (
                                  <p className="text-white/80 text-[11px]">
                                    {outfit.price.toLocaleString("vi-VN")}đ/ngày
                                  </p>
                                )}
                              </div>
                              {selectedOutfit === outfit.id && (
                                <div className="absolute inset-0 bg-gradient-to-t from-[#c1272d]/70 via-transparent to-transparent flex items-end justify-center pb-5">
                                  <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg">
                                    <Check
                                      className="w-6 h-6 text-[#c1272d]"
                                      strokeWidth={3}
                                    />
                                  </div>
                                </div>
                              )}
                            </button>
                          ))}
                        </div>

                        {hasMore && (
                          <Button
                            variant="outline"
                            onClick={() => setDisplayCount((prev) => prev + 4)}
                            className="w-full h-11 border-2 border-[#e5e5e5] text-[#6b6b6b] hover:border-[#c1272d] hover:text-[#c1272d] hover:bg-[#fef9f3] transition-all duration-300"
                          >
                            Xem Thêm Trang Phục (
                            {filteredOutfits.length - displayCount} còn lại)
                          </Button>
                        )}
                      </>
                    )}

                    {/* Navigation */}
                    <div className="mt-8 flex justify-between gap-4">
                      <Button
                        onClick={handlePreviousStep}
                        variant="outline"
                        className="h-12 px-8 border-2 border-[#e5e5e5] text-[#6b6b6b] hover:border-[#c1272d] hover:text-[#c1272d] hover:bg-[#fef9f3] transition-all duration-300"
                      >
                        ← Quay Lại
                      </Button>
                      <Button
                        onClick={handleNextStep}
                        disabled={!isStep2Complete}
                        className="h-12 px-10 bg-[#c1272d] hover:bg-[#8b1e1f] text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Tiếp Theo →
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Generate Video */}
              {currentStep === 3 && (
                <div className="bg-white rounded-sm shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-l-4 border-[#d4af37] overflow-hidden">
                  <div className="p-10">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c1272d] to-[#8b1e1f] flex items-center justify-center">
                        <Video className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-2xl font-display text-[#c1272d]">
                        Thử Đồ Ảo AI
                      </h3>
                    </div>

                    <div className="space-y-6">
                      <div className="p-6 bg-[#fef9f3] border border-[#f0e9dc] rounded-sm">
                        <h4 className="text-base font-semibold text-[#1a1a1a] mb-4">
                          Tóm Tắt Thông Tin
                        </h4>
                        <div className="space-y-2.5 text-sm">
                          <div className="flex justify-between">
                            <span className="text-[#6b6b6b]">Giới tính:</span>
                            <span className="font-medium text-[#1a1a1a]">
                              {gender === "nu" ? "Nữ" : "Nam"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#6b6b6b]">Chiều cao:</span>
                            <span className="font-medium text-[#1a1a1a]">
                              {height} cm
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#6b6b6b]">Ngực:</span>
                            <span className="font-medium text-[#1a1a1a]">
                              {bust} cm
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#6b6b6b]">Eo:</span>
                            <span className="font-medium text-[#1a1a1a]">
                              {waist} cm
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#6b6b6b]">Mông:</span>
                            <span className="font-medium text-[#1a1a1a]">
                              {hip} cm
                            </span>
                          </div>
                          <div className="flex justify-between pt-2 border-t border-[#f0e9dc]">
                            <span className="text-[#6b6b6b]">Trang phục:</span>
                            <span className="font-medium text-[#c1272d]">
                              {outfits.find((o) => o.id === selectedOutfit)
                                ?.name || "Đã chọn"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 bg-[#fffbf5] border-l-4 border-[#d4af37] rounded-sm">
                        <p className="text-[#6b6b6b] text-sm leading-relaxed flex items-start gap-2">
                          <span className="text-lg">✨</span>
                          <span>
                            <span className="text-[#c1272d] font-medium">
                              Công nghệ AI - Kết quả trong ~5 giây
                            </span>
                            <br />
                            Tạo video 360° với trang phục đã chọn theo số đo cơ
                            thể của bạn. Video sẽ hiển thị ở khung bên phải.
                          </span>
                        </p>
                      </div>

                      <div className="w-full h-16 bg-gradient-to-r from-[#c1272d] to-[#8b1e1f] text-white shadow-xl rounded-lg text-base font-medium flex items-center gap-3 justify-center">
                        <Video className="w-5 h-5" />
                        TẠO VIDEO 360°
                      </div>
                      <p className="text-xs text-center text-[#6b6b6b] mt-2 italic">
                        Nhấn nút Play ở khung bên phải để tạo video
                      </p>
                    </div>

                    {/* Navigation */}
                    <div className="mt-8 flex justify-start gap-4">
                      <Button
                        onClick={handlePreviousStep}
                        variant="outline"
                        className="h-12 px-8 border-2 border-[#e5e5e5] text-[#6b6b6b] hover:border-[#c1272d] hover:text-[#c1272d] hover:bg-[#fef9f3] transition-all duration-300"
                      >
                        ← Quay Lại
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side - Virtual Try-On Video Preview */}
            <div className="lg:sticky lg:top-32 h-fit">
              <div className="bg-white rounded-sm shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden border border-[#f0e9dc]">
                <div className="p-8">
                  <h3 className="text-2xl font-display text-[#c1272d] mb-1 text-center">
                    Ma-Nơ-Canh 3D Của Bạn
                  </h3>
                  <p className="text-[#6b6b6b] text-center mb-6 text-sm">
                    Cá nhân hóa theo số đo thực tế
                  </p>

                  {/* Virtual Try-On Video */}
                  <div className="relative aspect-[4/5] overflow-hidden mb-6 bg-gradient-to-br from-[#fef9f3] to-[#fef3ef] rounded-sm border-2 border-[#f0e9dc]">
                    <VirtualTryOnVideo
                      height={height}
                      bust={bust}
                      waist={waist}
                      hip={hip}
                      gender={gender}
                      selectedOutfit={selectedOutfit ?? undefined}
                      outfitName={
                        outfits.find((o) => o.id === selectedOutfit)?.name
                      }
                      onVideoGenerated={setGeneratedVideoUrl}
                    />

                    {/* Decorative corner accents */}
                    <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-[#d4af37]/60 pointer-events-none" />
                    <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-[#d4af37]/60 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-[#d4af37]/60 pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-[#d4af37]/60 pointer-events-none" />
                  </div>

                  {currentStep === 3 && (
                    <>
                      {/* Action Button */}
                      <Button
                        size="lg"
                        className="w-full h-14 bg-[#c1272d] hover:bg-[#8b1e1f] text-white shadow-lg hover:shadow-xl transition-all duration-300 text-base font-medium"
                        onClick={handleRentNow}
                      >
                        Thuê Ngay Trang Phục
                      </Button>

                      <div className="mt-6 text-center">
                        <p className="text-[#6b6b6b] text-sm">
                          Hoặc{" "}
                          <button
                            onClick={handleDownloadVideo}
                            disabled={!generatedVideoUrl}
                            className="text-[#c1272d] hover:text-[#8b1e1f] font-medium underline underline-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            tải video về
                          </button>
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
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
              <div
                key={index}
                className="bg-white p-8 border border-[#d4af37]/10 hover:shadow-luxury transition-shadow duration-500"
              >
                <h4 className="text-xl font-display text-[#1a1a1a] mb-3">
                  {feature.title}
                </h4>
                <p className="text-[#6b6b6b] leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
