import { api } from "../../api/client";

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
  count?: number;
};

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

  if (typeof configuredBaseUrl === "string" && configuredBaseUrl.trim()) {
    return normalizedPath;
  }

  return `${resolveApiBaseUrl()}${normalizedPath}`;
}

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("authToken") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token") ||
    sessionStorage.getItem("authToken") ||
    sessionStorage.getItem("accessToken") ||
    sessionStorage.getItem("token") ||
    null
  );
}

export function getAuthHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : undefined;
}

function unwrapData<T>(payload: unknown): T {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "data" in (payload as ApiEnvelope<T>) &&
    (payload as ApiEnvelope<T>).data !== undefined
  ) {
    return (payload as ApiEnvelope<T>).data as T;
  }
  return payload as T;
}

function toFiniteNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toNullableNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeLookupKey(value: string): string {
  return value.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
}

function getCaseInsensitiveValue(
  source: Record<string, unknown>,
  key: string,
): unknown {
  if (Object.prototype.hasOwnProperty.call(source, key)) {
    return source[key];
  }

  const normalizedLookup = normalizeLookupKey(key);
  const matchedKey = Object.keys(source).find(
    (currentKey) => normalizeLookupKey(currentKey) === normalizedLookup,
  );

  return matchedKey ? source[matchedKey] : undefined;
}

function pickFirstDefinedValue(
  source: Record<string, unknown>,
  aliases: string[],
): unknown {
  for (const alias of aliases) {
    const value = getCaseInsensitiveValue(source, alias);
    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }
  return null;
}

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeTrimmedString(value: unknown): string {
  return typeof value === "string" ? normalizeWhitespace(value) : "";
}

export interface OutfitImageDto {
  imageId: number;
  outfitId: number;
  imageUrl: string;
  imageType: string;
  sortOrder: number;
}

export interface OutfitSizeDto {
  sizeId: number;
  outfitId: number;
  sizeLabel: string;
  stockQuantity: number;
  chestMaxCm: number | null;
  waistMaxCm: number | null;
  hipMaxCm: number | null;
  status: string;
}

export interface OutfitAttributesDto {
  detailId: number;
  outfitId: number;
  material: string;
  silhouette: string;
  formalityLevel: string;
  occasion: string;
  colorPrimary: string;
  seasonSuitability: string;
  storyTitle: string;
  storyContent: string;
  culturalOrigin: string;
}

export interface ReviewImageDto {
  imgId: number;
  reviewId: number;
  imageUrl: string;
}

export interface ReviewDto {
  reviewId: number;
  outfitId: number;
  userId: number;
  userFullName: string;
  userEmail: string;
  rating: number;
  comment: string;
  createdAt: string;
  images: ReviewImageDto[];
}

export interface OutfitDetailDto {
  outfitId: number;
  categoryId: number | null;
  name: string;
  type: string;
  gender: string;
  region: string;
  isLimited: boolean;
  status: string;
  baseRentalPrice: number;
  createdAt: string;
  categoryName: string | null;
  images: OutfitImageDto[];
  sizes: OutfitSizeDto[];
  averageRating: number | null;
  totalReviews: number;
  attributes: OutfitAttributesDto | null;
}

export interface OutfitListItemDto {
  outfitId: number;
  categoryId: number | null;
  categoryName?: string | null;
  type: string;
  region: string;
  status: string;
}

export interface CategoryDto {
  categoryId: number;
  categoryName: string;
  description?: string | null;
}

export interface CreateCategoryPayload {
  categoryName: string;
  description?: string;
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

export interface AddOutfitImagePayload {
  outfitId: number;
  imageUrl: string;
  imageType: string;
  sortOrder: number;
}

export interface UpdateOutfitImagePayload {
  imageUrl: string;
  imageType: string;
  sortOrder: number;
}

export interface AddOutfitSizePayload {
  outfitId: number;
  sizeLabel: string;
  stockQuantity: number;
  chestMaxCm: number;
  waistMaxCm: number;
  hipMaxCm: number;
  status: string;
}

export interface UpdateOutfitSizePayload {
  sizeLabel: string;
  stockQuantity: number;
  chestMaxCm: number;
  waistMaxCm: number;
  hipMaxCm: number;
  status: string;
}

export interface CreateOutfitAttributesPayload {
  outfitId: number;
  material: string;
  silhouette: string;
  formalityLevel: string;
  occasion: string;
  colorPrimary: string;
  seasonSuitability: string;
  storyTitle: string;
  storyContent: string;
  culturalOrigin: string;
}

export interface UpdateOutfitAttributesPayload {
  material: string;
  silhouette: string;
  formalityLevel: string;
  occasion: string;
  colorPrimary: string;
  seasonSuitability: string;
  storyTitle: string;
  storyContent: string;
  culturalOrigin: string;
}

export interface ApiMessageResponse {
  success?: boolean;
  message?: string;
}

function normalizeImage(item: Partial<OutfitImageDto>): OutfitImageDto {
  return {
    imageId: toFiniteNumber(item.imageId, 0),
    outfitId: toFiniteNumber(item.outfitId, 0),
    imageUrl: normalizeString(item.imageUrl),
    imageType: normalizeString(item.imageType) || "Gallery",
    sortOrder: toFiniteNumber(item.sortOrder, 0),
  };
}

function normalizeSize(item: Partial<OutfitSizeDto>): OutfitSizeDto {
  const raw = item as Record<string, unknown>;
  const nestedMeasurement =
    (getCaseInsensitiveValue(raw, "measurement") as Record<string, unknown> | undefined) ??
    (getCaseInsensitiveValue(raw, "measurements") as Record<string, unknown> | undefined) ??
    (getCaseInsensitiveValue(raw, "bodyMeasurement") as Record<string, unknown> | undefined) ??
    (getCaseInsensitiveValue(raw, "bodyMeasurements") as Record<string, unknown> | undefined);

  const sources: Record<string, unknown>[] =
    nestedMeasurement && typeof nestedMeasurement === "object" ? [raw, nestedMeasurement] : [raw];

  const pickMeasurement = (aliases: string[]): unknown => {
    for (const source of sources) {
      const value = pickFirstDefinedValue(source, aliases);
      if (value !== null) return value;
    }
    return null;
  };

  const chestRaw = pickMeasurement([
    "chestMaxCm",
    "chestMax",
    "maxChest",
    "maxChestCm",
    "bustMaxCm",
    "bustMax",
    "maxBustCm",
    "maxBust",
    "chestCm",
    "chest",
    "bust",
  ]);
  const waistRaw = pickMeasurement([
    "waistMaxCm",
    "waistMax",
    "maxWaist",
    "maxWaistCm",
    "waistCm",
    "waist",
  ]);
  const hipRaw = pickMeasurement([
    "hipMaxCm",
    "hipMax",
    "maxHip",
    "maxHipCm",
    "hipCm",
    "hip",
  ]);

  return {
    sizeId: toFiniteNumber(item.sizeId, 0),
    outfitId: toFiniteNumber(item.outfitId, 0),
    sizeLabel: normalizeString(item.sizeLabel),
    stockQuantity: toFiniteNumber(item.stockQuantity, 0),
    chestMaxCm: toNullableNumber(chestRaw),
    waistMaxCm: toNullableNumber(waistRaw),
    hipMaxCm: toNullableNumber(hipRaw),
    status: normalizeString(item.status) || "Available",
  };
}

function normalizeAttributes(item: Partial<OutfitAttributesDto>): OutfitAttributesDto {
  return {
    detailId: toFiniteNumber(item.detailId, 0),
    outfitId: toFiniteNumber(item.outfitId, 0),
    material: normalizeString(item.material),
    silhouette: normalizeString(item.silhouette),
    formalityLevel: normalizeString(item.formalityLevel),
    occasion: normalizeString(item.occasion),
    colorPrimary: normalizeString(item.colorPrimary),
    seasonSuitability: normalizeString(item.seasonSuitability),
    storyTitle: normalizeString(item.storyTitle),
    storyContent: normalizeString(item.storyContent),
    culturalOrigin: normalizeString(item.culturalOrigin),
  };
}

function normalizeReviewImage(item: Partial<ReviewImageDto>): ReviewImageDto {
  return {
    imgId: toFiniteNumber(item.imgId, 0),
    reviewId: toFiniteNumber(item.reviewId, 0),
    imageUrl: normalizeString(item.imageUrl),
  };
}

function normalizeReview(item: Partial<ReviewDto>): ReviewDto {
  const rawImages = Array.isArray(item.images) ? item.images : [];
  return {
    reviewId: toFiniteNumber(item.reviewId, 0),
    outfitId: toFiniteNumber(item.outfitId, 0),
    userId: toFiniteNumber(item.userId, 0),
    userFullName: normalizeString(item.userFullName) || "\u1EA8n danh",
    userEmail: normalizeString(item.userEmail),
    rating: toFiniteNumber(item.rating, 0),
    comment: normalizeString(item.comment),
    createdAt: normalizeString(item.createdAt),
    images: rawImages.map((img) => normalizeReviewImage(img)),
  };
}

function normalizeOutfitDetail(item: Partial<OutfitDetailDto>): OutfitDetailDto {
  const rawImages = Array.isArray(item.images) ? item.images : [];
  const rawSizes = Array.isArray(item.sizes) ? item.sizes : [];
  const normalizedAttributes =
    item.attributes && typeof item.attributes === "object"
      ? normalizeAttributes(item.attributes as Partial<OutfitAttributesDto>)
      : null;

  return {
    outfitId: toFiniteNumber(item.outfitId, 0),
    categoryId:
      item.categoryId === null || item.categoryId === undefined
        ? null
        : toFiniteNumber(item.categoryId, 0),
    name: normalizeString(item.name),
    type: normalizeString(item.type),
    gender: normalizeString(item.gender),
    region: normalizeString(item.region),
    isLimited: Boolean(item.isLimited),
    status: normalizeString(item.status) || "Available",
    baseRentalPrice: toFiniteNumber(item.baseRentalPrice, 0),
    createdAt: normalizeString(item.createdAt),
    categoryName: item.categoryName ?? null,
    images: rawImages.map((img) => normalizeImage(img)),
    sizes: rawSizes.map((size) => normalizeSize(size)),
    averageRating:
      item.averageRating === null || item.averageRating === undefined
        ? null
        : toFiniteNumber(item.averageRating, 0),
    totalReviews: toFiniteNumber(item.totalReviews, 0),
    attributes: normalizedAttributes,
  };
}

function normalizeOutfitListItem(item: Partial<OutfitListItemDto>): OutfitListItemDto {
  return {
    outfitId: toFiniteNumber(item.outfitId, 0),
    categoryId:
      item.categoryId === null || item.categoryId === undefined
        ? null
        : toFiniteNumber(item.categoryId, 0),
    categoryName: item.categoryName ?? null,
    type: normalizeString(item.type),
    region: normalizeString(item.region),
    status: normalizeString(item.status),
  };
}

function normalizeCategory(item: Partial<CategoryDto>): CategoryDto {
  return {
    categoryId: toFiniteNumber(item.categoryId, 0),
    categoryName: normalizeString(item.categoryName),
    description: item.description ?? null,
  };
}

function normalizeMessageResponse(payload: unknown): ApiMessageResponse {
  if (typeof payload === "object" && payload !== null) {
    const response = payload as ApiMessageResponse;
    return {
      success: response.success,
      message: response.message,
    };
  }
  return {};
}

export async function getOutfitDetail(outfitId: number): Promise<OutfitDetailDto> {
  const response = await api.get(buildApiPath(`/api/Outfit/${outfitId}/detail`), {
    headers: getAuthHeaders(),
  });
  const raw = unwrapData<Partial<OutfitDetailDto>>(response.data);
  return normalizeOutfitDetail(raw);
}

export async function getOutfitById(outfitId: number): Promise<OutfitDetailDto> {
  const response = await api.get(buildApiPath(`/api/Outfit/${outfitId}`), {
    headers: getAuthHeaders(),
  });
  const raw = unwrapData<Partial<OutfitDetailDto>>(response.data);
  return normalizeOutfitDetail(raw);
}

export async function getAllOutfits(): Promise<OutfitListItemDto[]> {
  const response = await api.get(buildApiPath("/api/Outfit"), {
    headers: getAuthHeaders(),
  });
  const raw = unwrapData<Partial<OutfitListItemDto>[]>(response.data);
  return (Array.isArray(raw) ? raw : []).map((item) => normalizeOutfitListItem(item));
}

export async function getAllCategories(): Promise<CategoryDto[]> {
  const response = await api.get(buildApiPath("/api/Category/all"), {
    headers: getAuthHeaders(),
  });
  const raw = unwrapData<Partial<CategoryDto>[]>(response.data);
  return (Array.isArray(raw) ? raw : []).map((item) => normalizeCategory(item));
}

export async function getAllOutfitMaterials(): Promise<string[]> {
  const response = await api.get(buildApiPath("/api/OutfitAttributes/getAll"), {
    headers: getAuthHeaders(),
  });

  const raw = unwrapData<unknown>(response.data);
  const source =
    Array.isArray(raw)
      ? raw
      : raw && typeof raw === "object" && Array.isArray((raw as { items?: unknown[] }).items)
        ? (raw as { items: unknown[] }).items
        : [];

  const dedup = new Map<string, string>();
  source.forEach((item) => {
    if (typeof item !== "object" || item === null) return;

    const record = item as Record<string, unknown>;
    const material = normalizeTrimmedString(pickFirstDefinedValue(record, ["material"]));
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
  const raw = unwrapData<Partial<CategoryDto>>(response.data);
  return normalizeCategory(raw);
}

export async function updateOutfit(
  outfitId: number,
  payload: UpdateOutfitPayload,
): Promise<ApiMessageResponse> {
  const response = await api.put(buildApiPath(`/api/Outfit/${outfitId}`), payload, {
    headers: getAuthHeaders(),
  });
  return normalizeMessageResponse(response.data);
}

export async function getOutfitImages(outfitId: number): Promise<OutfitImageDto[]> {
  const response = await api.get(buildApiPath(`/api/OutfitImage/outfit/${outfitId}`), {
    headers: getAuthHeaders(),
  });
  const raw = unwrapData<Partial<OutfitImageDto>[]>(response.data);
  return (Array.isArray(raw) ? raw : []).map((item) => normalizeImage(item));
}

export async function addOutfitImage(payload: AddOutfitImagePayload): Promise<OutfitImageDto> {
  const response = await api.post(buildApiPath("/api/OutfitImage"), payload, {
    headers: getAuthHeaders(),
  });
  const raw = unwrapData<Partial<OutfitImageDto>>(response.data);
  return normalizeImage(raw);
}

export async function updateOutfitImage(
  imageId: number,
  payload: UpdateOutfitImagePayload,
): Promise<OutfitImageDto> {
  const response = await api.put(buildApiPath(`/api/OutfitImage/${imageId}`), payload, {
    headers: getAuthHeaders(),
  });
  const raw = unwrapData<Partial<OutfitImageDto>>(response.data);
  return normalizeImage(raw);
}

export async function deleteOutfitImage(imageId: number): Promise<ApiMessageResponse> {
  const response = await api.delete(buildApiPath(`/api/OutfitImage/${imageId}`), {
    headers: getAuthHeaders(),
  });
  return normalizeMessageResponse(response.data);
}

export async function getOutfitSizes(outfitId: number): Promise<OutfitSizeDto[]> {
  const response = await api.get(buildApiPath(`/api/OutfitSize/outfit/${outfitId}`), {
    headers: getAuthHeaders(),
  });
  const raw = unwrapData<Partial<OutfitSizeDto>[]>(response.data);
  return (Array.isArray(raw) ? raw : []).map((item) => normalizeSize(item));
}

export async function addOutfitSize(payload: AddOutfitSizePayload): Promise<OutfitSizeDto> {
  const response = await api.post(buildApiPath("/api/OutfitSize"), payload, {
    headers: getAuthHeaders(),
  });
  const raw = unwrapData<Partial<OutfitSizeDto>>(response.data);
  return normalizeSize(raw);
}

export async function updateOutfitSize(
  sizeId: number,
  payload: UpdateOutfitSizePayload,
): Promise<OutfitSizeDto> {
  const response = await api.put(buildApiPath(`/api/OutfitSize/${sizeId}`), payload, {
    headers: getAuthHeaders(),
  });
  const raw = unwrapData<Partial<OutfitSizeDto>>(response.data);
  return normalizeSize(raw);
}

export async function getOutfitAttributesByOutfitId(
  outfitId: number,
): Promise<OutfitAttributesDto | null> {
  const response = await api.get(buildApiPath(`/api/OutfitAttributes/getByOutfitId/${outfitId}`), {
    headers: getAuthHeaders(),
  });
  const raw = unwrapData<unknown>(response.data);

  if (Array.isArray(raw)) {
    const matched = raw.find(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        toFiniteNumber((item as { outfitId?: number }).outfitId, 0) === outfitId,
    );
    const first = matched ?? raw[0];
    if (!first || typeof first !== "object") return null;
    return normalizeAttributes(first as Partial<OutfitAttributesDto>);
  }

  if (raw && typeof raw === "object") {
    return normalizeAttributes(raw as Partial<OutfitAttributesDto>);
  }

  return null;
}

export async function createOutfitAttributes(
  payload: CreateOutfitAttributesPayload,
): Promise<OutfitAttributesDto> {
  const response = await api.post(buildApiPath("/api/OutfitAttributes/create"), payload, {
    headers: getAuthHeaders(),
  });
  const raw = unwrapData<Partial<OutfitAttributesDto>>(response.data);
  return normalizeAttributes(raw);
}

export async function updateOutfitAttributes(
  detailId: number,
  payload: UpdateOutfitAttributesPayload,
): Promise<OutfitAttributesDto> {
  const response = await api.put(
    buildApiPath(`/api/OutfitAttributes/update/${detailId}`),
    payload,
    {
      headers: getAuthHeaders(),
    },
  );
  const raw = unwrapData<Partial<OutfitAttributesDto>>(response.data);
  return normalizeAttributes(raw);
}

export async function getReviewsByOutfitId(outfitId: number): Promise<ReviewDto[]> {
  const response = await api.get(buildApiPath(`/api/Review/outfit/${outfitId}`), {
    headers: getAuthHeaders(),
  });
  const raw = unwrapData<Partial<ReviewDto>[]>(response.data);
  return (Array.isArray(raw) ? raw : []).map((item) => normalizeReview(item));
}

export async function getReviewImagesByReviewId(reviewId: number): Promise<ReviewImageDto[]> {
  const response = await api.get(buildApiPath(`/api/ReviewImage/review/${reviewId}`), {
    headers: getAuthHeaders(),
  });
  const raw = unwrapData<Partial<ReviewImageDto>[]>(response.data);
  return (Array.isArray(raw) ? raw : []).map((item) => normalizeReviewImage(item));
}

