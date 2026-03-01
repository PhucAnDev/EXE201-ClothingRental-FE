import { useState, useEffect, useRef, useCallback } from "react";
import { Loader2, Play, AlertCircle, RefreshCw } from "lucide-react";
import {
  generateVideo,
  getVideoStatus,
  downloadVideo,
  extractErrorMessage,
} from "../features/video/videoGenerationService";
import { getOutfitImages } from "../features/outfit/outfitService";

// ── Types ────────────────────────────────────────────────────────────

interface VirtualTryOnVideoProps {
  height: string;
  bust: string;
  waist: string;
  hip: string;
  gender?: string;
  selectedOutfit?: number;
  outfitName?: string;
  onVideoGenerated?: (videoUrl: string | null) => void;
}

type GenerationState =
  | "initial"
  | "submitting"
  | "polling"
  | "downloading"
  | "completed"
  | "error";

// ── Constants ────────────────────────────────────────────────────────

/** How often we poll the status endpoint (ms). */
const POLL_INTERVAL = 5_000;
/** How often the fake progress bar ticks while polling (ms). */
const PROGRESS_TICK = 2_500;
/** Max progress value during polling (real 100% set on completion). */
const PROGRESS_CEILING = 85;

// ── Component ────────────────────────────────────────────────────────

export function VirtualTryOnVideo({
  height,
  bust,
  waist,
  hip,
  gender = "nu",
  selectedOutfit = 0,
  outfitName,
  onVideoGenerated,
}: VirtualTryOnVideoProps) {
  const [state, setState] = useState<GenerationState>("initial");
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  // Refs for intervals / abort
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const abortRef = useRef(false);

  /** Stop all running timers. */
  const cleanup = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    if (progressRef.current) {
      clearInterval(progressRef.current);
      progressRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current = true;
      cleanup();
      // revoke any object URL we created
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset when inputs change
  useEffect(() => {
    abortRef.current = true;
    cleanup();
    setState("initial");
    setProgress(0);
    setStatusMessage("");
    setErrorMessage("");
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
      setVideoUrl(null);
    }
    onVideoGenerated?.(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height, bust, waist, hip, gender, selectedOutfit]);

  // ── Generate handler ─────────────────────────────────────────────

  const handleGenerateVideo = async () => {
    if (!selectedOutfit || selectedOutfit <= 0) return;

    abortRef.current = false;
    cleanup();
    setState("submitting");
    setProgress(5);
    setStatusMessage("Đang gửi yêu cầu tạo video...");
    setErrorMessage("");
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
      setVideoUrl(null);
    }
    onVideoGenerated?.(null);

    const token = localStorage.getItem("authToken");

    // Build prompt from body measurements
    const genderText = gender === "nu" ? "female" : "male";
    const prompt = `Based on the garment and style in the provided asset image. A photorealistic 3D render of a ${genderText} human mannequin with smooth matte neutral gray plastic skin, centered in a full-body shot. The mannequin has a neutral face and anatomically accurate proportions corresponding exactly to the following body measurements: height ${height} cm, bust ${bust} cm, waist ${waist} cm, and hips ${hip} cm. The camera remains fixed while the mannequin performs a steady 360-degree clockwise rotation on a vertical axis. Pure solid white background with minimal soft shadows under the feet. Flat, neutral, uniform studio lighting with sharp focus and high-precision detail. Clean minimalist aesthetic with no platforms, props, or equipment.`;

    try {
      // ── Step 0: Fetch outfit image IDs ─────────────────────────
      let imageIds: number[] | undefined;
      try {
        const imgRes = await getOutfitImages(selectedOutfit, token);
        const imgs = Array.isArray(imgRes?.data) ? imgRes.data : [];
        imageIds = imgs
          .filter((img) => img.imageId != null)
          .map((img) => img.imageId!);
      } catch {
        // If we can't fetch images, let BE use all images for this outfit
      }

      // ── Step 1: POST generate ──────────────────────────────────
      console.log("[VideoGen] Sending request:", {
        outfitId: selectedOutfit,
        prompt,
        imageIds,
      });
      const genRes = await generateVideo(
        { outfitId: selectedOutfit, prompt, imageIds },
        token,
      );
      console.log("[VideoGen] Response:", genRes);
      if (abortRef.current) return;

      if (!genRes.success || !genRes.data?.operationName) {
        throw new Error(
          genRes.message || "Không thể tạo video. Vui lòng thử lại.",
        );
      }

      const { operationName } = genRes.data;
      setProgress(15);
      setStatusMessage("AI đang xử lý video...");
      setState("polling");

      // ── Step 2: Slow progress animation while polling ──────────
      let currentProgress = 15;
      progressRef.current = setInterval(() => {
        currentProgress = Math.min(currentProgress + 1, PROGRESS_CEILING);
        setProgress(currentProgress);
      }, PROGRESS_TICK);

      // ── Step 3: Poll status endpoint ───────────────────────────
      const pollOnce = async () => {
        try {
          const statusRes = await getVideoStatus(operationName, token);
          if (abortRef.current) {
            cleanup();
            return;
          }

          const data = statusRes.data;
          if (!data) return; // keep polling

          // Still processing
          if (
            !data.isComplete &&
            (data.status === "processing" || data.status === "RUNNING")
          ) {
            setStatusMessage("AI đang render video 360°...");
            return;
          }

          // Completed
          if (data.isComplete && data.videoUri) {
            cleanup();
            setProgress(90);
            setStatusMessage("Đang tải video...");
            setState("downloading");

            let finalVideoUrl = data.videoUri;
            try {
              const blob = await downloadVideo(data.videoUri, token);
              if (abortRef.current) return;
              const blobUrl = URL.createObjectURL(blob);
              setVideoUrl(blobUrl);
              finalVideoUrl = blobUrl;
            } catch {
              // Fallback: use videoUri directly (may work if publicly accessible)
              setVideoUrl(data.videoUri);
            }

            setProgress(100);
            setState("completed");
            onVideoGenerated?.(finalVideoUrl);
            return;
          }

          // Failed
          if (data.status === "failed" || data.status === "error") {
            cleanup();
            throw new Error(
              data.errorMessage || "Tạo video thất bại. Vui lòng thử lại.",
            );
          }
        } catch (err: any) {
          cleanup();
          console.error("[VideoGen] Poll error:", err?.response?.data || err);
          setState("error");
          setErrorMessage(extractErrorMessage(err));
          onVideoGenerated?.(null);
        }
      };

      // Immediately poll once, then repeat
      pollOnce();
      pollingRef.current = setInterval(pollOnce, POLL_INTERVAL);
    } catch (err: any) {
      cleanup();
      console.error("[VideoGen] Error:", err?.response?.data || err);
      setState("error");
      setErrorMessage(extractErrorMessage(err));
      onVideoGenerated?.(null);
    }
  };

  // ── Retry / reset ────────────────────────────────────────────────

  const handleRetry = () => {
    abortRef.current = true;
    cleanup();
    setState("initial");
    setProgress(0);
    setStatusMessage("");
    setErrorMessage("");
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl);
      setVideoUrl(null);
    }
    onVideoGenerated?.(null);
  };

  const handleDownloadVideo = () => {
    if (!videoUrl) return;
    const link = document.createElement("a");
    link.href = videoUrl;
    link.download = `virtual-tryon-${selectedOutfit || "video"}-${Date.now()}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── Render: initial (play button) ────────────────────────────────

  if (state === "initial") {
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-stone-100 via-stone-50 to-amber-50 p-6">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-[#c1272d] to-[#d4af37] rounded-full flex items-center justify-center shadow-luxury">
            <Play className="w-12 h-12 text-white ml-1" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-800">
              Thử Đồ Ảo AI
            </h3>
            <p className="text-sm text-gray-600 max-w-xs mx-auto">
              Tạo video 360° với trang phục đã chọn
              <br />
              theo số đo cơ thể của bạn
            </p>
          </div>

          {/* Current measurements */}
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 space-y-2 text-xs text-gray-700">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Giới tính:</span>
              <span className="font-medium">
                {gender === "nu" ? "Nữ" : "Nam"}
              </span>
            </div>
            {height && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Chiều cao:</span>
                <span className="font-medium">{height} cm</span>
              </div>
            )}
            {bust && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Ngực:</span>
                <span className="font-medium">{bust} cm</span>
              </div>
            )}
            {waist && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Eo:</span>
                <span className="font-medium">{waist} cm</span>
              </div>
            )}
            {hip && (
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Hông:</span>
                <span className="font-medium">{hip} cm</span>
              </div>
            )}
          </div>

          <button
            onClick={handleGenerateVideo}
            disabled={!selectedOutfit || selectedOutfit <= 0}
            className="px-8 py-3 bg-gradient-to-r from-[#c1272d] to-[#8b1e1f] hover:from-[#8b1e1f] hover:to-[#c1272d] text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 uppercase tracking-wide text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Tạo Video 360°
          </button>

          <p className="text-xs text-gray-500 italic">
            ⚡ Công nghệ AI Gemini Veo – Có thể mất 1–3 phút
          </p>
        </div>
      </div>
    );
  }

  // ── Render: error ────────────────────────────────────────────────

  if (state === "error") {
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-stone-100 via-stone-50 to-amber-50 p-6">
        <div className="text-center space-y-5 max-w-sm">
          <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-[#c1272d]" />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800">
              Không Thể Tạo Video
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {errorMessage}
            </p>
          </div>

          <button
            onClick={handleRetry}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#c1272d] to-[#8b1e1f] text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Thử Lại
          </button>
        </div>
      </div>
    );
  }

  // ── Render: completed (video playback) ───────────────────────────

  if (state === "completed" && videoUrl) {
    return (
      <div className="relative w-full h-full bg-black">
        <video
          key={videoUrl}
          className="w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          controls
        >
          <source src={videoUrl} type="video/mp4" />
          Trình duyệt không hỗ trợ video.
        </video>

        {/* Overlay controls */}
        <div className="absolute top-4 right-4 space-y-2 flex flex-col items-end">
          <button
            onClick={handleDownloadVideo}
            className="px-4 py-2 bg-[#c1272d]/90 backdrop-blur-sm text-white text-xs font-medium rounded-lg shadow-lg hover:bg-[#c1272d] transition-all duration-200"
          >
            Tải Xuống
          </button>
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-medium rounded-lg shadow-lg hover:bg-white transition-all duration-200"
          >
            Tạo Lại
          </button>
        </div>

        {/* Info overlay */}
        <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-sm text-white px-4 py-3 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-300 mb-1">
                Video 360° – Thử đồ ảo AI
              </p>
              <p className="text-sm font-medium">
                {gender === "nu" ? "Nữ" : "Nam"} • {height || "N/A"}cm
                {bust && ` • Ngực ${bust}cm`}
                {waist && ` • Eo ${waist}cm`}
                {outfitName && ` • ${outfitName}`}
              </p>
            </div>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-white/30" />
        <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-white/30" />
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-white/30" />
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-white/30" />
      </div>
    );
  }

  // ── Render: submitting / polling / downloading (progress) ────────

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-stone-100 via-stone-50 to-amber-50 p-6">
      <div className="text-center space-y-6 w-full max-w-sm">
        <div className="relative w-32 h-32 mx-auto">
          <div className="absolute inset-0 bg-gradient-to-br from-[#c1272d] to-[#d4af37] rounded-full animate-pulse" />
          <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
            <Loader2 className="w-16 h-16 text-[#c1272d] animate-spin" />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-gray-800">
            Đang Tạo Video AI...
          </h3>

          {/* Status message */}
          <p className="text-sm text-gray-600">{statusMessage}</p>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#c1272d] to-[#d4af37] transition-all duration-700 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-sm font-medium text-gray-700">{progress}%</p>

          {/* Milestone steps */}
          <div className="text-xs text-gray-600 space-y-1 mt-4">
            <p className={progress >= 10 ? "text-[#c1272d] font-medium" : ""}>
              {progress >= 10 ? "✓" : "○"} Gửi yêu cầu đến AI
            </p>
            <p className={progress >= 25 ? "text-[#c1272d] font-medium" : ""}>
              {progress >= 25 ? "✓" : "○"} Phân tích số đo & trang phục
            </p>
            <p className={progress >= 50 ? "text-[#c1272d] font-medium" : ""}>
              {progress >= 50 ? "✓" : "○"} AI đang render video 360°
            </p>
            <p className={progress >= 85 ? "text-[#c1272d] font-medium" : ""}>
              {progress >= 85 ? "✓" : "○"} Đang tải video về
            </p>
            <p className={progress >= 100 ? "text-[#c1272d] font-medium" : ""}>
              {progress >= 100 ? "✓" : "○"} Hoàn tất!
            </p>
          </div>

          <p className="text-xs text-gray-400 italic mt-2">
            Video AI thường mất 1–3 phút. Vui lòng chờ...
          </p>
        </div>
      </div>
    </div>
  );
}
