import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Heart, Star } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  getOutfitImages,
  getOutfits,
  type OutfitImageItem,
  type OutfitItem,
} from "../features/outfit/outfitService";

type HomeOutfitItem = {
  id: number;
  name: string;
  designer: string;
  price: string;
  image: string;
  rating: number;
  tags: string[];
  createdAt?: string;
  isLimited?: boolean;
};

const toValidNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const isAvailableStatus = (status?: string | null) => {
  const normalized = String(status ?? "").trim().toLowerCase();
  return (
    normalized === "" ||
    normalized === "available" ||
    normalized === "instock" ||
    normalized === "in_stock"
  );
};

const selectPrimaryImage = (images: OutfitImageItem[]) => {
  if (!Array.isArray(images) || images.length === 0) return "";
  const sorted = [...images].sort((a, b) => {
    const aOrder =
      typeof a?.sortOrder === "number" ? a.sortOrder : Number.POSITIVE_INFINITY;
    const bOrder =
      typeof b?.sortOrder === "number" ? b.sortOrder : Number.POSITIVE_INFINITY;
    return aOrder - bOrder;
  });
  return sorted[0]?.imageUrl || "";
};

const buildTags = (outfit: OutfitItem) => {
  const tags: string[] = [];
  if (outfit?.type) tags.push(outfit.type);
  if (outfit?.isLimited) tags.push("Limited");
  if (tags.length === 0) tags.push("Truyền thống");
  return tags.slice(0, 2);
};

export function OutfitGallery() {
  const navigate = useNavigate();
  const [outfits, setOutfits] = useState<HomeOutfitItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchFeaturedOutfits = async () => {
      setLoading(true);
      setError("");

      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("authToken")
            : null;

        const response = await getOutfits(token);
        const list = Array.isArray(response?.data) ? response.data : [];

        const outfitsWithImages = await Promise.all(
          list.map(async (outfit) => {
            const outfitId = Number(outfit?.outfitId ?? 0);
            if (!Number.isFinite(outfitId) || outfitId <= 0) {
              return {
                ...outfit,
                primaryImageUrl: outfit?.primaryImageUrl ?? "",
              };
            }

            try {
              const imageRes = await getOutfitImages(outfitId, token);
              const images = Array.isArray(imageRes?.data) ? imageRes.data : [];
              return {
                ...outfit,
                primaryImageUrl:
                  selectPrimaryImage(images) || outfit?.primaryImageUrl || "",
              };
            } catch {
              return {
                ...outfit,
                primaryImageUrl: outfit?.primaryImageUrl ?? "",
              };
            }
          }),
        );

        const mapped = outfitsWithImages
          .filter((outfit) => isAvailableStatus(outfit?.status))
          .map((outfit, index) => {
            const parsedId = Number(outfit?.outfitId ?? 0);
            const numericPrice = toValidNumber(outfit?.baseRentalPrice, 0);
            const ratingSource = toValidNumber(outfit?.averageRating, 4.8);
            const rating = Math.max(0, Math.min(5, ratingSource));

            return {
              id: parsedId > 0 ? parsedId : index + 1,
              name: outfit?.name || "Trang phục truyền thống",
              designer: outfit?.categoryName || "Sắc Việt Studio",
              price: `${numericPrice.toLocaleString("vi-VN")}₫`,
              image: outfit?.primaryImageUrl || "",
              rating,
              tags: buildTags(outfit),
              createdAt: outfit?.createdAt,
              isLimited: Boolean(outfit?.isLimited),
            };
          })
          .sort((a, b) => {
            if (a.isLimited !== b.isLimited) return a.isLimited ? -1 : 1;
            const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return timeB - timeA;
          })
          .slice(0, 4);

        if (isMounted) {
          setOutfits(mapped);
        }
      } catch {
        if (!isMounted) return;
        setOutfits([]);
        setError("Không thể tải bộ sưu tập nổi bật.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void fetchFeaturedOutfits();

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleOutfits = useMemo(() => outfits, [outfits]);

  return (
    <section
      id="bo-suu-tap"
      className="py-40 bg-gradient-to-b from-[#fdfcfb] via-white to-[#fef9f3] relative overflow-hidden"
    >
      <div
        className="absolute top-20 left-10 w-[500px] h-[500px] rounded-full blur-3xl opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(193,39,45,0.15) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-20 right-10 w-[600px] h-[600px] rounded-full blur-3xl opacity-20"
        style={{
          background:
            "radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)",
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }}
      />

      <div className="max-w-7xl mx-auto px-8 lg:px-12 relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-block mb-6">
            <span className="text-[#d4af37] uppercase tracking-[0.3em] text-sm font-medium">
              Collection
            </span>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mt-2" />
          </div>
          <h2 className="text-6xl lg:text-7xl font-display text-[#1a1a1a] mb-6 tracking-tight">
            Bộ Sưu Tập
            <br />
            <span className="text-gradient-gold italic">Đặc Sắc</span>
          </h2>
          <p className="text-[#6b6b6b] text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
            Hơn 500 thiết kế áo dài và trang phục truyền thống từ các nhà thiết
            kế hàng đầu Việt Nam
          </p>
        </motion.div>

        {loading && (
          <p className="text-center text-sm text-[#6b6b6b] mb-8">
            Đang tải bộ sưu tập nổi bật...
          </p>
        )}
        {error && (
          <p className="text-center text-sm text-red-600 mb-8">{error}</p>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {visibleOutfits.map((outfit, index) => (
            <motion.div
              key={outfit.id}
              onClick={() => navigate(`/san-pham/${outfit.id}`)}
              className="group cursor-pointer bg-white overflow-hidden transition-all duration-500 hover:shadow-luxury"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                delay: index * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="relative overflow-hidden mb-6 aspect-[3/4.5] bg-[#f5f5f0]">
                <ImageWithFallback
                  src={outfit.image}
                  alt={outfit.name}
                  className="w-full h-full object-cover group-hover:scale-[1.08] transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <button
                  type="button"
                  onClick={(event) => event.stopPropagation()}
                  className="absolute top-6 right-6 w-11 h-11 bg-white/95 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-[#c1272d] hover:text-white"
                >
                  <Heart className="w-5 h-5" />
                </button>

                <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                  <Button
                    onClick={(event) => {
                      event.stopPropagation();
                      navigate(`/san-pham/${outfit.id}`);
                    }}
                    className="w-full bg-white text-[#1a1a1a] hover:bg-[#d4af37] hover:text-white transition-all duration-300 shadow-gold uppercase tracking-wider text-sm"
                  >
                    Xem Chi Tiết
                  </Button>
                </div>

                <div className="absolute top-6 left-6 glass-effect px-4 py-2 flex items-center gap-2">
                  <Star className="w-4 h-4 fill-[#d4af37] text-[#d4af37]" />
                  <span className="text-sm font-medium text-[#1a1a1a]">
                    {outfit.rating.toFixed(1)}
                  </span>
                </div>

                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#d4af37]/30 transition-colors duration-500 pointer-events-none" />
              </div>

              <div className="px-2">
                <div className="flex gap-2 mb-4">
                  {outfit.tags.map((tag) => (
                    <Badge
                      key={`${outfit.id}-${tag}`}
                      className="text-xs bg-[#fef5e7] text-[#c1272d] border border-[#d4af37]/20 uppercase tracking-wider font-normal"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <h3 className="text-[#1a1a1a] text-xl mb-2 font-display group-hover:text-[#c1272d] transition-colors duration-300">
                  {outfit.name}
                </h3>
                <p className="text-[#6b6b6b] text-sm mb-4 italic">
                  by {outfit.designer}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-display text-[#c1272d] tracking-tight">
                    {outfit.price}
                  </span>
                  <span className="text-[#6b6b6b] text-sm">/ngày</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {!loading && !error && visibleOutfits.length === 0 && (
          <p className="text-center text-sm text-[#6b6b6b] mb-20">
            Chưa có trang phục để hiển thị.
          </p>
        )}

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <Button
            size="lg"
            className="relative overflow-hidden border-2 border-[#c1272d] bg-transparent text-[#c1272d] hover:text-white px-12 h-16 text-base uppercase tracking-wider group shadow-luxury"
            onClick={() => navigate("/bo-suu-tap")}
          >
            <span className="absolute inset-0 bg-gradient-to-r from-[#c1272d] to-[#8b1e1f] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative flex items-center gap-3">
              Xem Tất Cả 500+ Trang Phục
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </span>
          </Button>
          <p className="mt-6 text-[#6b6b6b] text-sm italic">
            Mỗi bộ trang phục đều là một tác phẩm nghệ thuật độc đáo
          </p>
        </motion.div>
      </div>
    </section>
  );
}
