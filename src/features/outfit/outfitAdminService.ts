import { api } from "../../api/client";

interface ApiListResponse<T> {
  success?: boolean;
  data?: T[] | null;
}

interface ApiObjectResponse<T> {
  success?: boolean;
  message?: string;
  data?: T | null;
}

interface ApiMessageResponse {
  success?: boolean;
  message?: string;
}

const FALLBACK_API_BASE_URL = "https://localhost:7270";

function resolveApiBaseUrl(): string {
  const envApiUrl = String((import.meta as any).env?.VITE_API_URL ?? "").trim();
  if (envApiUrl) return envApiUrl.replace(/\/$/, "");

  const envApiBaseUrl = String((import.meta as any).env?.VITE_API_BASE_URL ?? "").trim();
  if (envApiBaseUrl) return envApiBaseUrl.replace(/\/$/, "");

  return FALLBACK_API_BASE_URL;
}

function buildApiPath(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const configuredBaseUrl = api.defaults.baseURL;

  if (typeof configuredBaseUrl === "string" && configuredBaseUrl.trim().length > 0) {
    return normalizedPath;
  }

  return `${resolveApiBaseUrl()}${normalizedPath}`;
}

function getAuthHeaders() {
  if (typeof window === "undefined") return undefined;
  const token =
    localStorage.getItem("authToken") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("authToken") ||
    sessionStorage.getItem("accessToken") ||
    sessionStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

function toFiniteNumber(value: unknown, fallback = 0): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function extractArray<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (
    typeof payload === "object" &&
    payload !== null &&
    Array.isArray((payload as ApiListResponse<T>).data)
  ) {
    return ((payload as ApiListResponse<T>).data ?? []) as T[];
  }

  return [];
}

export interface Outfit {
  outfitId: number;
  categoryId: number | null;
  name: string;
  type?: string | null;
  gender?: string | null;
  region?: string | null;
  isLimited: boolean;
  status?: string | null;
  baseRentalPrice: number;
  createdAt?: string | null;
  categoryName?: string | null;
  totalImages?: number | null;
  totalSizes?: number | null;
  availableSizes?: number | null;
  primaryImageUrl?: string | null;
  averageRating?: number | null;
  totalReviews?: number | null;
}

export interface OutfitImage {
  imageId: number;
  outfitId: number;
  imageUrl: string;
  imageType?: string | null;
  sortOrder?: number | null;
}

export interface OutfitSize {
  sizeId: number;
  outfitId: number;
  sizeLabel?: string | null;
  stockQuantity: number;
  chestMaxCm?: number | null;
  waistMaxCm?: number | null;
  hipMaxCm?: number | null;
  status?: string | null;
}

export interface CategoryDto {
  categoryId: number;
  categoryName: string;
  description?: string | null;
}

export interface OutfitAdminRow extends Outfit {
  totalStock: number;
  thumbnailUrl: string | null;
  categoryLabel: string;
  inStock: boolean;
}

export interface UpdateOutfitPayload {
  categoryId: number;
  name: string;
  type: string;
  gender: string;
  region: string;
  isLimited: boolean;
  status: string;
  baseRentalPrice: number;
}

export interface CreateCategoryPayload {
  categoryName: string;
  description?: string;
}

export interface CreateOutfitPayload {
  categoryId: number;
  name: string;
  type?: string | null;
  gender?: string | null;
  region?: string | null;
  isLimited?: boolean;
  status?: string | null;
  baseRentalPrice: number;
}

export interface CreateOutfitResult extends ApiMessageResponse {
  outfitId: number | null;
  raw?: unknown;
}

function extractArrayLike(payload: unknown): unknown[] {
  const direct = extractArray<unknown>(payload);
  if (direct.length > 0) return direct;

  if (typeof payload !== "object" || payload === null) return [];
  const topLevel = payload as Record<string, unknown>;

  if (Array.isArray(topLevel.items)) {
    return topLevel.items as unknown[];
  }

  const nestedData = topLevel.data;
  if (typeof nestedData === "object" && nestedData !== null) {
    const nestedItems = (nestedData as Record<string, unknown>).items;
    if (Array.isArray(nestedItems)) {
      return nestedItems as unknown[];
    }
  }

  return [];
}

function extractMaterialValue(item: unknown): string {
  if (typeof item !== "object" || item === null) return "";

  const record = item as Record<string, unknown>;
  if (typeof record.material === "string") {
    return normalizeDisplayText(record.material);
  }

  const matchedKey = Object.keys(record).find((key) => key.toLowerCase() === "material");
  if (!matchedKey) return "";

  const value = record[matchedKey];
  return typeof value === "string" ? normalizeDisplayText(value) : "";
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

const VI_MOJIBAKE_PATTERN =
  /(?:\u00C3.|\u00C2.|\u00C4.|\u00E1\u00BA|\u00E1\u00BB|\u00E2\u20AC|\uFFFD)/;

function tryDecodeLatin1ToUtf8(value: string): string {
  try {
    const bytes = Array.from(value).map((char) => {
      const code = char.charCodeAt(0);
      if (code > 0xff) {
        throw new Error("Input contains non Latin-1 characters.");
      }
      return `%${code.toString(16).padStart(2, "0")}`;
    });
    return decodeURIComponent(bytes.join(""));
  } catch {
    return value;
  }
}

export function normalizeVietnameseText(value: string): string {
  const normalized = normalizeWhitespace(value || "");
  if (!normalized) return "";
  if (!VI_MOJIBAKE_PATTERN.test(normalized)) return normalized;

  const decoded = tryDecodeLatin1ToUtf8(normalized);
  if (!decoded || decoded.includes("\uFFFD")) {
    return normalized;
  }

  return normalizeWhitespace(decoded);
}

function normalizeDisplayText(value: unknown): string {
  if (typeof value !== "string") return "";
  return normalizeVietnameseText(value);
}

function normalizeStatusKey(value: string): string {
  return normalizeWhitespace(value).toLowerCase();
}

export function mapOutfitStatusLabelToApiValue(value: string): string {
  const normalized = normalizeVietnameseText(value || "");
  if (!normalized) return "Active";

  const key = normalizeStatusKey(normalized);
  if (key === "còn hàng") return "Active";
  if (key === "hết hàng") return "Inactive";

  return normalized;
}

export function mapOutfitStatusValueToLabel(value: string): string {
  const normalized = normalizeVietnameseText(value || "");
  if (!normalized) return "Còn hàng";

  const key = normalizeStatusKey(normalized);
  if (key === "active" || key === "available") return "Còn hàng";
  if (key === "inactive" || key === "unavailable") return "Hết hàng";

  return normalized;
}

function normalizeOutfit(raw: Partial<Outfit>): Outfit {
  const outfitId = toFiniteNumber(raw.outfitId, 0);
  const normalizedName = normalizeDisplayText(raw.name);
  const normalizedType = normalizeDisplayText(raw.type);
  const normalizedGender = normalizeDisplayText(raw.gender);
  const normalizedRegion = normalizeDisplayText(raw.region);
  const normalizedStatus = normalizeDisplayText(raw.status);
  const normalizedCreatedAt = normalizeDisplayText(raw.createdAt);
  const normalizedCategoryName = normalizeDisplayText(raw.categoryName);
  const normalizedPrimaryImage = normalizeDisplayText(raw.primaryImageUrl);

  return {
    outfitId,
    categoryId:
      raw.categoryId === null || raw.categoryId === undefined
        ? null
        : toFiniteNumber(raw.categoryId, 0),
    name: normalizedName || `Sản phẩm #${outfitId || "N/A"}`,
    type: normalizedType || null,
    gender: normalizedGender || null,
    region: normalizedRegion || null,
    isLimited: Boolean(raw.isLimited),
    status: normalizedStatus || null,
    baseRentalPrice: toFiniteNumber(raw.baseRentalPrice, 0),
    createdAt: normalizedCreatedAt || null,
    categoryName: normalizedCategoryName || null,
    totalImages:
      raw.totalImages === null || raw.totalImages === undefined
        ? null
        : toFiniteNumber(raw.totalImages, 0),
    totalSizes:
      raw.totalSizes === null || raw.totalSizes === undefined
        ? null
        : toFiniteNumber(raw.totalSizes, 0),
    availableSizes:
      raw.availableSizes === null || raw.availableSizes === undefined
        ? null
        : toFiniteNumber(raw.availableSizes, 0),
    primaryImageUrl: normalizedPrimaryImage || null,
    averageRating:
      raw.averageRating === null || raw.averageRating === undefined
        ? null
        : toFiniteNumber(raw.averageRating, 0),
    totalReviews:
      raw.totalReviews === null || raw.totalReviews === undefined
        ? null
        : toFiniteNumber(raw.totalReviews, 0),
  };
}

function normalizeOutfitSize(raw: Partial<OutfitSize>): OutfitSize {
  return {
    sizeId: toFiniteNumber(raw.sizeId, 0),
    outfitId: toFiniteNumber(raw.outfitId, 0),
    sizeLabel: normalizeDisplayText(raw.sizeLabel) || null,
    stockQuantity: toFiniteNumber(raw.stockQuantity, 0),
    chestMaxCm:
      raw.chestMaxCm === null || raw.chestMaxCm === undefined
        ? null
        : toFiniteNumber(raw.chestMaxCm, 0),
    waistMaxCm:
      raw.waistMaxCm === null || raw.waistMaxCm === undefined
        ? null
        : toFiniteNumber(raw.waistMaxCm, 0),
    hipMaxCm:
      raw.hipMaxCm === null || raw.hipMaxCm === undefined
        ? null
        : toFiniteNumber(raw.hipMaxCm, 0),
    status: normalizeDisplayText(raw.status) || null,
  };
}

function normalizeOutfitImage(raw: Partial<OutfitImage>): OutfitImage {
  return {
    imageId: toFiniteNumber(raw.imageId, 0),
    outfitId: toFiniteNumber(raw.outfitId, 0),
    imageUrl: normalizeDisplayText(raw.imageUrl),
    imageType: normalizeDisplayText(raw.imageType) || null,
    sortOrder:
      raw.sortOrder === null || raw.sortOrder === undefined
        ? null
        : toFiniteNumber(raw.sortOrder, 0),
  };
}

function normalizeCategory(raw: Partial<CategoryDto>): CategoryDto {
  const categoryId = toFiniteNumber(raw.categoryId, 0);
  const normalizedCategoryName = normalizeDisplayText(raw.categoryName);
  const normalizedDescription = normalizeDisplayText(raw.description);
  return {
    categoryId,
    categoryName: normalizedCategoryName || "Không rõ",
    description: normalizedDescription || null,
  };
}

function extractObject<T>(payload: unknown): T | null {
  if (typeof payload !== "object" || payload === null) return null;

  if ("data" in (payload as ApiObjectResponse<T>)) {
    const data = (payload as ApiObjectResponse<T>).data;
    if (typeof data === "object" && data !== null) {
      return data as T;
    }
  }

  return payload as T;
}

function extractOutfitId(payload: unknown): number | null {
  const toPositiveId = (value: unknown): number | null => {
    const id = Number(value);
    if (!Number.isFinite(id) || id <= 0) return null;
    return id;
  };

  const readObjectId = (value: unknown): number | null => {
    if (typeof value !== "object" || value === null) return null;
    const record = value as Record<string, unknown>;
    return (
      toPositiveId(record.outfitId) ??
      toPositiveId(record.id) ??
      toPositiveId(record.OutfitId) ??
      toPositiveId(record.Id) ??
      null
    );
  };

  const direct = toPositiveId(payload);
  if (direct) return direct;

  const topLevel = readObjectId(payload);
  if (topLevel) return topLevel;

  if (typeof payload === "object" && payload !== null && "data" in payload) {
    const data = (payload as { data?: unknown }).data;
    return toPositiveId(data) ?? readObjectId(data);
  }

  return null;
}

function getCategoryLabel(outfit: Outfit, categoryMap: Map<number, string>): string {
  if (outfit.categoryId !== null) {
    const mappedName = normalizeDisplayText(categoryMap.get(outfit.categoryId) ?? "");
    if (mappedName) return mappedName;
  }

  const embeddedName = normalizeDisplayText(outfit.categoryName ?? "");
  if (embeddedName) return embeddedName;

  return "Không rõ";
}

function getTotalStock(sizes: OutfitSize[]): number {
  return sizes.reduce((sum, size) => sum + Math.max(0, toFiniteNumber(size.stockQuantity, 0)), 0);
}

function isDeletedStatus(status: string | null | undefined): boolean {
  return (status ?? "").trim().toLowerCase() === "deleted";
}

function selectThumbnailUrl(outfit: Outfit, images: OutfitImage[]): string | null {
  const primary = (outfit.primaryImageUrl ?? "").trim();
  if (primary) return primary;

  const candidates = images.filter((image) => image.imageUrl.trim().length > 0);
  if (candidates.length === 0) return null;

  const bySortOrder = [...candidates].sort((a, b) => {
    const sortA = a.sortOrder ?? Number.MAX_SAFE_INTEGER;
    const sortB = b.sortOrder ?? Number.MAX_SAFE_INTEGER;
    return sortA - sortB;
  });

  const mainImage = bySortOrder.find((image) => (image.imageType ?? "").toLowerCase() === "main");
  return mainImage?.imageUrl ?? bySortOrder[0]?.imageUrl ?? null;
}

const sizeCache = new Map<number, Promise<OutfitSize[]>>();
const imageCache = new Map<number, Promise<OutfitImage[]>>();

export async function getAllOutfits(): Promise<Outfit[]> {
  const response = await api.get(buildApiPath("/api/Outfit"), {
    headers: getAuthHeaders(),
  });
  return extractArray<Partial<Outfit>>(response.data).map(normalizeOutfit);
}

export async function softDeleteOutfit(outfit: Outfit): Promise<ApiMessageResponse> {
  const outfitId = toFiniteNumber(outfit.outfitId, 0);
  const categoryId = toFiniteNumber(outfit.categoryId, 0);

  if (!Number.isFinite(outfitId) || outfitId <= 0) {
    throw new Error("Sản phẩm không hợp lệ.");
  }

  if (!Number.isFinite(categoryId) || categoryId <= 0) {
    throw new Error("Danh mục sản phẩm không hợp lệ.");
  }

  const payload: UpdateOutfitPayload = {
    categoryId,
    name: normalizeDisplayText(outfit.name),
    type: normalizeDisplayText(outfit.type),
    gender: normalizeDisplayText(outfit.gender),
    region: normalizeDisplayText(outfit.region),
    isLimited: Boolean(outfit.isLimited),
    status: "Deleted",
    baseRentalPrice: toFiniteNumber(outfit.baseRentalPrice, 0),
  };

  const response = await api.put(buildApiPath(`/api/Outfit/${outfitId}`), payload, {
    headers: getAuthHeaders(),
  });

  if (typeof response.data === "object" && response.data !== null) {
    return response.data as ApiMessageResponse;
  }

  return { success: true };
}

export async function getOutfitSizes(outfitId: number): Promise<OutfitSize[]> {
  if (!Number.isFinite(outfitId) || outfitId <= 0) return [];

  const cachedRequest = sizeCache.get(outfitId);
  if (cachedRequest) return cachedRequest;

  const request = api
    .get(buildApiPath(`/api/OutfitSize/outfit/${outfitId}`), {
      headers: getAuthHeaders(),
    })
    .then((response) => extractArray<Partial<OutfitSize>>(response.data).map(normalizeOutfitSize))
    .catch((error) => {
      sizeCache.delete(outfitId);
      throw error;
    });

  sizeCache.set(outfitId, request);
  return request;
}

export async function getOutfitImages(outfitId: number): Promise<OutfitImage[]> {
  if (!Number.isFinite(outfitId) || outfitId <= 0) return [];

  const cachedRequest = imageCache.get(outfitId);
  if (cachedRequest) return cachedRequest;

  const request = api
    .get(buildApiPath(`/api/OutfitImage/outfit/${outfitId}`), {
      headers: getAuthHeaders(),
    })
    .then((response) => extractArray<Partial<OutfitImage>>(response.data).map(normalizeOutfitImage))
    .catch((error) => {
      imageCache.delete(outfitId);
      throw error;
    });

  imageCache.set(outfitId, request);
  return request;
}

export async function getAllCategories(): Promise<CategoryDto[]> {
  const response = await api.get(buildApiPath("/api/Category/all"), {
    headers: getAuthHeaders(),
  });
  return extractArray<Partial<CategoryDto>>(response.data).map(normalizeCategory);
}

export async function getAllOutfitMaterials(): Promise<string[]> {
  const response = await api.get(buildApiPath("/api/OutfitAttributes/getAll"), {
    headers: getAuthHeaders(),
  });

  const dedup = new Map<string, string>();
  extractArrayLike(response.data).forEach((item) => {
    const material = extractMaterialValue(item);
    if (!material) return;
    const key = material.toLocaleLowerCase("vi");
    if (key === "string") return;
    if (!dedup.has(key)) {
      dedup.set(key, material);
    }
  });

  return Array.from(dedup.values()).sort((a, b) => a.localeCompare(b, "vi", { sensitivity: "base" }));
}

export async function createCategory(payload: CreateCategoryPayload): Promise<CategoryDto> {
  const response = await api.post(buildApiPath("/api/Category"), payload, {
    headers: getAuthHeaders(),
  });

  const rawCategory = extractObject<Partial<CategoryDto>>(response.data);
  if (rawCategory) {
    return normalizeCategory(rawCategory);
  }

  return normalizeCategory({
    categoryId: 0,
    categoryName: payload.categoryName,
    description: payload.description ?? null,
  });
}

export async function createOutfit(payload: CreateOutfitPayload): Promise<CreateOutfitResult> {
  const response = await api.post(buildApiPath("/api/Outfit"), payload, {
    headers: getAuthHeaders(),
  });

  const apiResponse =
    typeof response.data === "object" && response.data !== null
      ? (response.data as ApiMessageResponse)
      : {};

  return {
    success: apiResponse.success,
    message: apiResponse.message,
    outfitId: extractOutfitId(response.data),
    raw: response.data,
  };
}

export async function getOutfitsForAdminTable(): Promise<OutfitAdminRow[]> {
  const [outfits, categories] = await Promise.all([
    getAllOutfits(),
    getAllCategories().catch(() => []),
  ]);
  const visibleOutfits = outfits.filter((outfit) => !isDeletedStatus(outfit.status));
  const categoryMap = new Map<number, string>(
    categories.map((category) => [category.categoryId, category.categoryName]),
  );

  const rows = await Promise.all(
    visibleOutfits.map(async (outfit) => {
      if (outfit.outfitId <= 0) {
        return {
          ...outfit,
          totalStock: 0,
          thumbnailUrl: selectThumbnailUrl(outfit, []),
          categoryLabel: getCategoryLabel(outfit, categoryMap),
          inStock: false,
        };
      }

      const sizePromise = getOutfitSizes(outfit.outfitId);
      const imagePromise = outfit.primaryImageUrl
        ? Promise.resolve<OutfitImage[]>([])
        : getOutfitImages(outfit.outfitId);

      const [sizeResult, imageResult] = await Promise.allSettled([sizePromise, imagePromise]);
      const sizes = sizeResult.status === "fulfilled" ? sizeResult.value : [];
      const images = imageResult.status === "fulfilled" ? imageResult.value : [];
      const totalStock = getTotalStock(sizes);

      return {
        ...outfit,
        totalStock,
        thumbnailUrl: selectThumbnailUrl(outfit, images),
        categoryLabel: getCategoryLabel(outfit, categoryMap),
        inStock: totalStock > 0,
      };
    }),
  );

  return rows;
}
