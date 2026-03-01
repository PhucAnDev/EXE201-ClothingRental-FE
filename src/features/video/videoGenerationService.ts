import { api } from "../../api/client";

// ── Interfaces matching BE DTOs ──────────────────────────────────────

export interface VideoGenerationRequest {
  outfitId: number;
  prompt: string;
  imageIds?: number[];
}

export interface VideoGenerationData {
  operationName: string;
  status: string;
  message: string;
}

export interface VideoGenerationResponse {
  success: boolean;
  data?: VideoGenerationData;
  message?: string;
}

export interface VideoStatusData {
  isComplete: boolean;
  status: string;
  videoUri?: string;
  errorMessage?: string;
}

export interface VideoStatusResponse {
  success: boolean;
  data?: VideoStatusData;
  message?: string;
}

// ── Helpers ──────────────────────────────────────────────────────────

const buildHeaders = (token?: string | null): Record<string, string> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

/**
 * Extract a useful error message from an axios error response.
 * Handles the BE's various error response shapes.
 */
export const extractErrorMessage = (err: any): string => {
  const data = err?.response?.data;
  if (data) {
    // BE returns { success, message, errors }
    if (typeof data.message === "string" && data.message) return data.message;
    // ASP.NET ProblemDetails
    if (typeof data.title === "string" && data.title) return data.title;
    // Validation errors object
    if (data.errors) {
      const msgs = Object.values(data.errors).flat();
      if (msgs.length) return msgs.join("; ");
    }
    if (typeof data === "string") return data;
  }
  if (err?.message) return err.message;
  return "Đã xảy ra lỗi không xác định.";
};

// ── API calls ────────────────────────────────────────────────────────

/**
 * POST /api/VideoGeneration/generate
 * Starts a long-running video generation job on the server (Gemini Veo 3.1).
 */
export const generateVideo = async (
  request: VideoGenerationRequest,
  token?: string | null,
): Promise<VideoGenerationResponse> => {
  const res = await api.post("/api/VideoGeneration/generate", request, {
    headers: buildHeaders(token),
  });
  return res.data as VideoGenerationResponse;
};

/**
 * GET /api/VideoGeneration/status/{operationName}
 * Polls for the status of a previously started generation job.
 */
export const getVideoStatus = async (
  operationName: string,
  token?: string | null,
): Promise<VideoStatusResponse> => {
  const res = await api.get(
    `/api/VideoGeneration/status/${encodeURIComponent(operationName)}`,
    { headers: buildHeaders(token) },
  );
  return res.data as VideoStatusResponse;
};

/**
 * GET /api/VideoGeneration/download?videoUri=...
 * Downloads the generated video through the backend proxy (handles
 * Google Cloud Storage auth) and returns a Blob.
 */
export const downloadVideo = async (
  videoUri: string,
  token?: string | null,
): Promise<Blob> => {
  const res = await api.get("/api/VideoGeneration/download", {
    params: { videoUri },
    headers: buildHeaders(token),
    responseType: "blob",
  });
  return res.data as Blob;
};
