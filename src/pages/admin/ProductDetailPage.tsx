import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  ChevronsUpDown,
  ImagePlus,
  Loader2,
  Pencil,
  Plus,
  Star,
  Trash2,
} from "lucide-react";
import { AdminLayout } from "../../components/admin/AdminLayout";
import { ConfirmDeleteDialog } from "../../components/admin/ConfirmDeleteDialog";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { Skeleton } from "../../components/ui/skeleton";
import { Switch } from "../../components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import {
  addOutfitImage,
  addOutfitSize,
  createCategory,
  createOutfitAttributes,
  deleteOutfitImage,
  getAllCategories,
  getAllOutfitMaterials,
  getAllOutfits,
  getOutfitAttributesByOutfitId,
  getOutfitById,
  getOutfitDetail,
  getOutfitImages,
  getOutfitSizes,
  getReviewImagesByReviewId,
  getReviewsByOutfitId,
  type AddOutfitImagePayload,
  type AddOutfitSizePayload,
  type CreateCategoryPayload,
  type CreateOutfitAttributesPayload,
  type CategoryDto,
  type OutfitListItemDto,
  type OutfitAttributesDto,
  type OutfitDetailDto,
  type OutfitImageDto,
  type OutfitSizeDto,
  type ReviewDto,
  type UpdateOutfitAttributesPayload,
  type UpdateOutfitImagePayload,
  type UpdateOutfitPayload,
  type UpdateOutfitSizePayload,
  updateOutfit,
  updateOutfitAttributes,
  updateOutfitImage,
  updateOutfitSize,
} from "../../features/outfit/outfitDetailAdminService";

type TabValue = "overview" | "images" | "sizes" | "attributes" | "reviews";
type OutfitGender = "Male" | "Female" | "";
type OutfitStatus = "Còn hàng" | "Hết hàng";
type SizeStatus = "Đang hoạt động" | "Ngừng hoạt động";

type OutfitFormState = {
  categoryId: string;
  name: string;
  type: string;
  gender: OutfitGender;
  region: string;
  isLimited: boolean;
  status: OutfitStatus;
  baseRentalPrice: string;
};

type ImageFormState = { imageType: string };

type SizeFormState = {
  sizeLabel: string;
  stockQuantity: string;
  chestMaxCm: string;
  waistMaxCm: string;
  hipMaxCm: string;
  status: SizeStatus;
};

type AttrFormState = {
  material: string;
  silhouette: string;
  formalityLevel: string;
  occasion: string;
  colorPrimary: string;
  seasonSuitability: string;
  storyTitle: string;
  storyContent: string;
  culturalOrigin: string;
};

const IMAGE_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='320' viewBox='0 0 500 320'%3E%3Crect width='500' height='320' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='20'%3EChua co anh%3C/text%3E%3C/svg%3E";
const MAX_UPLOAD_IMAGE_SIZE_BYTES = 3 * 1024 * 1024;
const ALLOWED_UPLOAD_IMAGE_MIME_TYPES = new Set(["image/png", "image/jpeg", "image/jpg", "image/webp"]);
// Mặc định giữ DataURL để có thể render trực tiếp bằng <img src="...">.
const STRIP_BASE64_PREFIX_FOR_UPLOAD =
  String((import.meta as any).env?.VITE_STRIP_IMAGE_BASE64_PREFIX ?? "")
    .trim()
    .toLowerCase() === "true";

const priceFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0,
});
const dateOnlyFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

const STATUS_LABEL_MAP: Record<string, string> = {
  available: "Đang hoạt động",
  active: "Đang hoạt động",
  inactive: "Ngừng hoạt động",
  unavailable: "Ngừng hoạt động",
};

const STATUS_MODAL_LABEL_MAP: Record<string, string> = {
  active: "Còn hàng",
  inactive: "Hết hàng",
};

const SIZE_STATUS_LABEL_MAP: Record<string, string> = {
  available: "Đang hoạt động",
  inactive: "Ngừng hoạt động",
};

const GENDER_LABEL_MAP: Record<string, string> = {
  male: "Nam",
  female: "Nữ",
  unisex: "Unisex",
};

const IMAGE_TYPE_LABEL_MAP: Record<string, string> = {
  main: "Ảnh chính",
  gallery: "Ảnh phụ",
};

const isOutfitGender = (value: string): value is Exclude<OutfitGender, ""> =>
  value === "Male" || value === "Female";

const toOutfitGender = (value: string): OutfitGender => (isOutfitGender(value) ? value : "");

const isOutfitStatus = (value: string): value is OutfitStatus =>
  value === "Còn hàng" || value === "Hết hàng";

const toOutfitStatus = (value: string): OutfitStatus => (isOutfitStatus(value) ? value : "Còn hàng");

const isSizeStatus = (value: string): value is SizeStatus =>
  value === "Đang hoạt động" || value === "Ngừng hoạt động";

const toSizeStatus = (value: string): SizeStatus =>
  isSizeStatus(value) ? value : "Đang hoạt động";

const toNum = (value: unknown, fallback = 0): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const mapStatusLabel = (value: string): string => {
  const key = (value || "").trim().toLowerCase();
  return STATUS_LABEL_MAP[key] ?? value ?? "Không rõ";
};

const toSizeStatusLabel = (value: string): string => {
  const key = (value || "").replace(/\s+/g, " ").trim().toLowerCase();
  if (!key) return "Không rõ";
  return SIZE_STATUS_LABEL_MAP[key] ?? "Không rõ";
};

const toSizeStatusValue = (value: string): string => {
  const key = (value || "").replace(/\s+/g, " ").trim().toLowerCase();
  if (key === "đang hoạt động" || key === "available") return "Available";
  if (key === "ngừng hoạt động" || key === "inactive") return "Inactive";
  return "Available";
};

const mapGenderLabel = (value: string): string => {
  const key = (value || "").trim().toLowerCase();
  return GENDER_LABEL_MAP[key] ?? value ?? "Không rõ";
};

const mapImageTypeLabel = (value: string): string => {
  const key = (value || "").trim().toLowerCase();
  return IMAGE_TYPE_LABEL_MAP[key] ?? value ?? "Không rõ";
};

const normalizeWhitespace = (value: string): string => value.replace(/\s+/g, " ").trim();
const normalizeStatusKey = (value: string): string => normalizeWhitespace(value).toLowerCase();
const normalizeCategoryKey = (value: string): string => normalizeWhitespace(value).toLowerCase();
const normalizeTypeKey = (value: string): string => normalizeWhitespace(value).toLowerCase();
const normalizeRegionValue = (value: string): string => normalizeWhitespace(value).toUpperCase();

const toTitleCase = (value: string): string =>
  value
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const normalizeTypeValue = (value: string): string => {
  const normalized = normalizeWhitespace(value);
  if (!normalized) return "";
  return toTitleCase(normalized);
};

const stripDataUrlPrefix = (value: string): string => value.replace(/^data:[^;]+;base64,/i, "");

const toBase64 = (file: File, options: { stripPrefix: boolean }): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (!result) {
        reject(new Error("Không thể đọc tệp ảnh."));
        return;
      }
      resolve(options.stripPrefix ? stripDataUrlPrefix(result) : result);
    };
    reader.onerror = () => reject(new Error("Không thể đọc tệp ảnh."));
    reader.readAsDataURL(file);
  });

const formatFileSize = (sizeInBytes: number): string => {
  if (!Number.isFinite(sizeInBytes) || sizeInBytes < 0) return "--";
  if (sizeInBytes < 1024) return `${sizeInBytes} B`;
  if (sizeInBytes < 1024 * 1024) return `${(sizeInBytes / 1024).toFixed(1)} KB`;
  return `${(sizeInBytes / (1024 * 1024)).toFixed(2)} MB`;
};

const mapStatusToModalLabel = (value: string): string => {
  const normalized = normalizeWhitespace(value || "");
  if (!normalized) return "";
  return STATUS_MODAL_LABEL_MAP[normalizeStatusKey(normalized)] ?? normalized;
};

const mapStatusToApiValue = (value: string): string => {
  const normalized = normalizeWhitespace(value || "");
  if (!normalized) return "Active";

  const key = normalizeStatusKey(normalized);
  if (key === "còn hàng") return "Active";
  if (key === "hết hàng") return "Inactive";

  return normalized;
};

const normalizeGenderForSubmit = (value: string): "Male" | "Female" => {
  const key = (value || "").trim().toLowerCase();
  if (key === "female" || key === "nữ" || key === "nu") return "Female";
  return "Male";
};

const isAuthError = (error: unknown): boolean => {
  if (typeof error !== "object" || error === null || !("response" in error)) return false;
  const status = (error as { response?: { status?: number } }).response?.status;
  return status === 401 || status === 403;
};

const getResponseStatus = (error: unknown): number | null => {
  if (typeof error !== "object" || error === null || !("response" in error)) return null;
  const status = (error as { response?: { status?: number } }).response?.status;
  return typeof status === "number" ? status : null;
};

const isImageUrlUriValidationError = (error: unknown): boolean => {
  if (typeof error !== "object" || error === null || !("response" in error)) return false;

  const data = (error as { response?: { data?: unknown } }).response?.data;
  if (typeof data !== "object" || data === null) return false;

  const payload = data as {
    title?: unknown;
    detail?: unknown;
    message?: unknown;
    errors?: Record<string, string[] | string>;
  };

  const title = typeof payload.title === "string" ? payload.title : "";
  const detail = typeof payload.detail === "string" ? payload.detail : "";
  const message = typeof payload.message === "string" ? payload.message : "";
  const summary = `${title} ${detail} ${message}`.toLowerCase();

  const errors = payload.errors;
  const imageUrlValidationMessage =
    errors && typeof errors === "object"
      ? Object.entries(errors).find(([key, value]) => {
        const normalizedKey = normalizeStatusKey(key).replace(/\s+/g, "");
        if (!normalizedKey.includes("imageurl")) return false;

        const values = Array.isArray(value) ? value : [value];
        return values.some((entry) => {
          if (typeof entry !== "string") return false;
          const normalizedEntry = entry.toLowerCase();
          return (
            normalizedEntry.includes("url") ||
            normalizedEntry.includes("uri") ||
            normalizedEntry.includes("http") ||
            normalizedEntry.includes("https") ||
            normalizedEntry.includes("ftp")
          );
        });
      })
      : null;

  if (imageUrlValidationMessage) return true;

  return summary.includes("imageurl") && (summary.includes("url") || summary.includes("uri"));
};

const toErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === "object" && error !== null && "response" in error) {
    const err = error as {
      response?: {
        status?: number;
        data?: {
          message?: string;
          title?: string;
          detail?: string;
          errors?: Record<string, string[] | string>;
        };
      };
      message?: string;
    };

    if (err.response?.status === 401 || err.response?.status === 403) {
      return "Bạn không có quyền / Phiên đăng nhập hết hạn.";
    }

    if (typeof err.response?.data?.message === "string" && err.response.data.message.trim()) {
      return err.response.data.message;
    }

    if (typeof err.response?.data?.detail === "string" && err.response.data.detail.trim()) {
      return err.response.data.detail;
    }

    if (typeof err.response?.data?.title === "string" && err.response.data.title.trim()) {
      return err.response.data.title;
    }

    const validationErrors = err.response?.data?.errors;
    if (validationErrors && typeof validationErrors === "object") {
      const firstMessage = Object.values(validationErrors)
        .flatMap((value) => (Array.isArray(value) ? value : [value]))
        .find((value) => typeof value === "string" && value.trim());
      if (typeof firstMessage === "string" && firstMessage.trim()) {
        return firstMessage;
      }
    }

    if (typeof err.message === "string" && err.message.trim()) return err.message;
  }

  if (error instanceof Error && error.message.trim()) return error.message;
  return fallback;
};

const formatVnd = (value: number): string =>
  priceFormatter.format(Number.isFinite(value) ? value : 0);

const formatDateTime = (value: string): string => {
  if (!value) return "--";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleString("vi-VN");
};

const formatDateOnly = (value: string): string => {
  if (!value) return "--";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : dateOnlyFormatter.format(parsed);
};

const formatMeasurement = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return "—";
  return Number.isFinite(value) ? String(value) : "—";
};


const createEmptyAttrs = (): AttrFormState => ({
  material: "",
  silhouette: "",
  formalityLevel: "",
  occasion: "",
  colorPrimary: "",
  seasonSuitability: "",
  storyTitle: "",
  storyContent: "",
  culturalOrigin: "",
});

const mapAttrsToForm = (attrs: OutfitAttributesDto | null): AttrFormState =>
  attrs
    ? {
      material: attrs.material || "",
      silhouette: attrs.silhouette || "",
      formalityLevel: attrs.formalityLevel || "",
      occasion: attrs.occasion || "",
      colorPrimary: attrs.colorPrimary || "",
      seasonSuitability: attrs.seasonSuitability || "",
      storyTitle: attrs.storyTitle || "",
      storyContent: attrs.storyContent || "",
      culturalOrigin: attrs.culturalOrigin || "",
    }
    : createEmptyAttrs();

const sortImages = (list: OutfitImageDto[]): OutfitImageDto[] =>
  [...list].sort((a, b) => {
    const aMain = (a.imageType || "").toLowerCase() === "main" ? 0 : 1;
    const bMain = (b.imageType || "").toLowerCase() === "main" ? 0 : 1;
    if (aMain !== bMain) return aMain - bMain;
    return toNum(a.sortOrder, Number.MAX_SAFE_INTEGER) - toNum(b.sortOrder, Number.MAX_SAFE_INTEGER);
  });

const sortImagesBySortOrder = (list: OutfitImageDto[]): OutfitImageDto[] =>
  [...list].sort((a, b) => {
    const diff = toNum(a.sortOrder, Number.MAX_SAFE_INTEGER) - toNum(b.sortOrder, Number.MAX_SAFE_INTEGER);
    if (diff !== 0) return diff;
    return toNum(a.imageId, 0) - toNum(b.imageId, 0);
  });

const normalizeImageSortOrder = (list: OutfitImageDto[]): OutfitImageDto[] =>
  list.map((item, index) => ({
    ...item,
    sortOrder: index + 1,
  }));

const moveItem = <T,>(list: T[], fromIndex: number, toIndex: number): T[] => {
  if (fromIndex === toIndex) return list;
  if (fromIndex < 0 || toIndex < 0 || fromIndex >= list.length || toIndex >= list.length) return list;
  const next = [...list];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
};

const stockBadge = (stock: number) => {
  if (stock <= 0) return <Badge className="bg-red-100 text-red-800 border-red-200">Hết hàng</Badge>;
  return <Badge className="bg-green-100 text-green-800 border-green-200">Còn hàng</Badge>;
};

export default function ProductDetailPage() {
  const { outfitId: outfitIdParam } = useParams<{ outfitId: string }>();
  const outfitId = Number.parseInt(outfitIdParam ?? "", 10);

  const [tab, setTab] = useState<TabValue>("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [detail, setDetail] = useState<OutfitDetailDto | null>(null);
  const [images, setImages] = useState<OutfitImageDto[]>([]);
  const [originalImages, setOriginalImages] = useState<OutfitImageDto[]>([]);
  const [imagesOrderDirty, setImagesOrderDirty] = useState(false);
  const [imagesOrderSaving, setImagesOrderSaving] = useState(false);
  const [sizes, setSizes] = useState<OutfitSizeDto[]>([]);
  const [attributes, setAttributes] = useState<OutfitAttributesDto | null>(null);
  const [reviews, setReviews] = useState<ReviewDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [outfitReferenceList, setOutfitReferenceList] = useState<OutfitListItemDto[]>([]);
  const [materials, setMaterials] = useState<string[]>([]);
  const [referenceLoading, setReferenceLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const [editOutfitOpen, setEditOutfitOpen] = useState(false);
  const [outfitSaving, setOutfitSaving] = useState(false);
  const [materialsError, setMaterialsError] = useState<string | null>(null);
  const [outfitForm, setOutfitForm] = useState<OutfitFormState>({
    categoryId: "",
    name: "",
    type: "",
    gender: "",
    region: "",
    isLimited: false,
    status: "Còn hàng",
    baseRentalPrice: "0",
  });
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [materialOpen, setMaterialOpen] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);
  const [categoryInput, setCategoryInput] = useState("");
  const [regionInput, setRegionInput] = useState("");
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [createCategoryName, setCreateCategoryName] = useState("");
  const [createCategoryDesc, setCreateCategoryDesc] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);

  const [imageOpen, setImageOpen] = useState(false);
  const [imageSaving, setImageSaving] = useState(false);
  const [imageEncoding, setImageEncoding] = useState(false);
  const [isImageDragOver, setIsImageDragOver] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageBase64Value, setImageBase64Value] = useState<string | null>(null);
  const imageFileInputRef = useRef<HTMLInputElement | null>(null);
  const [editingImage, setEditingImage] = useState<OutfitImageDto | null>(null);
  const [deleteImageOpen, setDeleteImageOpen] = useState(false);
  const [deletingImage, setDeletingImage] = useState(false);
  const [deleteImageTarget, setDeleteImageTarget] = useState<OutfitImageDto | null>(null);
  const [imageForm, setImageForm] = useState<ImageFormState>({
    imageType: "Main",
  });

  const [sizeOpen, setSizeOpen] = useState(false);
  const [sizeSaving, setSizeSaving] = useState(false);
  const [editingSize, setEditingSize] = useState<OutfitSizeDto | null>(null);
  const [sizeForm, setSizeForm] = useState<SizeFormState>({
    sizeLabel: "",
    stockQuantity: "0",
    chestMaxCm: "0",
    waistMaxCm: "0",
    hipMaxCm: "0",
    status: "Đang hoạt động",
  });

  const [attrsForm, setAttrsForm] = useState<AttrFormState>(createEmptyAttrs);
  const [attrsSaving, setAttrsSaving] = useState(false);
  const sortedImages = useMemo(() => sortImages(images), [images]);
  const imagesByOrder = useMemo(() => sortImagesBySortOrder(images), [images]);
  const primaryImage = sortedImages[selectedImage] ?? null;

  const totalStock = useMemo(
    () => sizes.reduce((sum, item) => sum + Math.max(0, toNum(item.stockQuantity, 0)), 0),
    [sizes],
  );

  const reviewsAvg = useMemo(() => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, item) => sum + toNum(item.rating, 0), 0) / reviews.length;
  }, [reviews]);

  const avgRating =
    detail?.averageRating !== null && detail?.averageRating !== undefined
      ? detail.averageRating
      : reviewsAvg;

  const reviewCount = detail?.totalReviews ?? reviews.length;
  const categoryMap = useMemo(
    () =>
      new Map<number, string>(
        categories.map((item) => [item.categoryId, item.categoryName.trim()]),
      ),
    [categories],
  );
  const categoryOptions = useMemo(
    () =>
      [...categories]
        .map((item) => ({
          ...item,
          categoryName: normalizeWhitespace(item.categoryName),
        }))
        .filter((item) => item.categoryId > 0 && item.categoryName.length > 0)
        .sort((a, b) => a.categoryName.localeCompare(b.categoryName, "vi")),
    [categories],
  );
  const materialOptions = useMemo(() => {
    const map = new Map<string, string>();
    const pushMaterial = (rawValue: string) => {
      const value = normalizeTypeValue(rawValue || "");
      if (!value) return;
      const key = normalizeTypeKey(value);
      if (key === "string") return;
      if (!map.has(key)) {
        map.set(key, value);
      }
    };
    materials.forEach((value) => pushMaterial(value));
    pushMaterial(detail?.type || "");
    pushMaterial(outfitForm.type);
    return Array.from(map.values()).sort((a, b) => a.localeCompare(b, "vi"));
  }, [detail?.type, materials, outfitForm.type]);
  const regionOptions = useMemo(() => {
    const map = new Map<string, string>();
    outfitReferenceList.forEach((item) => {
      const value = normalizeRegionValue(item.region || "");
      if (!value) return;
      map.set(value, value);
    });
    const detailValue = normalizeRegionValue(detail?.region || "");
    if (detailValue) map.set(detailValue, detailValue);
    return Array.from(map.values()).sort((a, b) => a.localeCompare(b, "vi"));
  }, [detail?.region, outfitReferenceList]);
  const statusOptions = useMemo(() => {
    const dedup = new Set<OutfitStatus>();
    const options: OutfitStatus[] = [];

    const pushUnique = (rawValue: string) => {
      const uiValue = toOutfitStatus(mapStatusToModalLabel(rawValue));
      if (dedup.has(uiValue)) return;
      dedup.add(uiValue);
      options.push(uiValue);
    };

    pushUnique("Còn hàng");
    pushUnique("Hết hàng");
    pushUnique(detail?.status || "");

    return options;
  }, [detail?.status]);
  const imageTypeOptions = useMemo(() => {
    const map = new Map<string, string>();
    const push = (rawValue: string | null | undefined) => {
      const normalized = normalizeWhitespace(rawValue || "");
      if (!normalized) return;
      const key = normalized.toLowerCase();
      if (!map.has(key)) map.set(key, normalized);
    };

    push("Main");
    images.forEach((item) => push(item.imageType));
    if (detail?.images?.length) detail.images.forEach((item) => push(item.imageType));
    push(editingImage?.imageType);

    return Array.from(map.values());
  }, [detail?.images, editingImage?.imageType, images]);
  const filteredCategoryOptions = useMemo(() => {
    const keyword = normalizeCategoryKey(categoryInput);
    if (!keyword) return categoryOptions;
    return categoryOptions.filter((item) => normalizeCategoryKey(item.categoryName).includes(keyword));
  }, [categoryInput, categoryOptions]);
  const normalizedCategoryInput = normalizeWhitespace(categoryInput);
  const canCreateCategoryFromInput = useMemo(() => {
    if (!normalizedCategoryInput) return false;
    return !categoryOptions.some(
      (item) => normalizeCategoryKey(item.categoryName) === normalizeCategoryKey(normalizedCategoryInput),
    );
  }, [categoryOptions, normalizedCategoryInput]);
  const filteredMaterialOptions = useMemo(() => {
    const keyword = normalizeTypeKey(outfitForm.type);
    if (!keyword) return materialOptions;
    return materialOptions.filter((item) => normalizeTypeKey(item).includes(keyword));
  }, [materialOptions, outfitForm.type]);
  const normalizedMaterialInput = normalizeTypeValue(outfitForm.type);
  const canUseCustomMaterialFromInput = useMemo(() => {
    if (!normalizedMaterialInput) return false;
    return !materialOptions.some((item) => normalizeTypeKey(item) === normalizeTypeKey(normalizedMaterialInput));
  }, [materialOptions, normalizedMaterialInput]);
  const filteredRegionOptions = useMemo(() => {
    const keyword = normalizeRegionValue(regionInput);
    if (!keyword) return regionOptions;
    return regionOptions.filter((item) => item.includes(keyword));
  }, [regionInput, regionOptions]);
  const normalizedRegionInput = normalizeRegionValue(regionInput);
  const canCreateRegionFromInput = useMemo(() => {
    if (!normalizedRegionInput) return false;
    return !regionOptions.some((item) => item === normalizedRegionInput);
  }, [normalizedRegionInput, regionOptions]);
  const selectedCategoryName = useMemo(() => {
    const selectedId = toNum(outfitForm.categoryId, 0);
    if (selectedId <= 0) return "";
    const mapped = categoryMap.get(selectedId);
    if (mapped) return mapped;
    if (detail?.categoryId === selectedId && detail.categoryName) {
      return normalizeWhitespace(detail.categoryName);
    }
    return "";
  }, [categoryMap, detail?.categoryId, detail?.categoryName, outfitForm.categoryId]);
  const wasUnisexGender = (detail?.gender || "").trim().toLowerCase() === "unisex";

  const categoryLabel = useMemo(() => {
    if (!detail) return "Không rõ";
    if (detail.categoryId !== null) {
      const mappedName = (categoryMap.get(detail.categoryId) ?? "").trim();
      if (mappedName) return mappedName;
    }
    if (detail.categoryName && detail.categoryName.trim()) return detail.categoryName;
    return "Không rõ";
  }, [categoryMap, detail]);

  const stockSummary =
    sizes.length > 0
      ? sizes
        .map((item) => `${item.sizeLabel || "Không rõ"}:${Math.max(0, toNum(item.stockQuantity, 0))}`)
        .join(", ")
      : "Chưa có dữ liệu kích cỡ";

  const currentImagePreview = imagePreviewUrl || editingImage?.imageUrl || null;

  const loadData = useCallback(
    async (showLoading = true) => {
      if (!Number.isFinite(outfitId) || outfitId <= 0) {
        setLoading(false);
        setError("ID sản phẩm không hợp lệ.");
        return;
      }

      if (showLoading) setLoading(true);
      setError(null);

      try {
        let outfit: OutfitDetailDto;

        try {
          outfit = await getOutfitDetail(outfitId);
        } catch (detailError) {
          if (isAuthError(detailError)) throw detailError;
          outfit = await getOutfitById(outfitId);
        }

        const detailImages = Array.isArray(outfit.images) ? outfit.images : [];
        const detailSizes = Array.isArray(outfit.sizes) ? outfit.sizes : [];
        const detailAttributes = outfit.attributes ?? null;

        const [imagesResult, sizesResult, attrsResult, reviewsResult] = await Promise.allSettled([
          detailImages.length > 0 ? Promise.resolve(detailImages) : getOutfitImages(outfitId),
          getOutfitSizes(outfitId),
          detailAttributes ? Promise.resolve(detailAttributes) : getOutfitAttributesByOutfitId(outfitId),
          getReviewsByOutfitId(outfitId),
        ]);

        const partialErrors = [imagesResult, sizesResult, attrsResult, reviewsResult]
          .filter((result): result is PromiseRejectedResult => result.status === "rejected")
          .map((result) => result.reason);

        if (partialErrors.some((err) => isAuthError(err))) {
          toast.error("Bạn không có quyền / Phiên đăng nhập hết hạn.");
        }

        const nextImages = imagesResult.status === "fulfilled" ? imagesResult.value : detailImages;
        const nextSizes = sizesResult.status === "fulfilled" ? sizesResult.value : detailSizes;
        const nextAttrs = attrsResult.status === "fulfilled" ? attrsResult.value : detailAttributes;
        const nextReviews = reviewsResult.status === "fulfilled" ? reviewsResult.value : [];

        const reviewsWithImages = await Promise.all(
          nextReviews.map(async (review) => {
            if (Array.isArray(review.images) && review.images.length > 0) return review;
            if (!review.reviewId) return { ...review, images: [] };
            try {
              const fallback = await getReviewImagesByReviewId(review.reviewId);
              return { ...review, images: fallback };
            } catch {
              return { ...review, images: [] };
            }
          }),
        );

        const normalizedImages = normalizeImageSortOrder(sortImagesBySortOrder(nextImages));
        setDetail({ ...outfit, images: normalizedImages, sizes: nextSizes, attributes: nextAttrs });
        setImages(normalizedImages);
        setOriginalImages(normalizedImages);
        setImagesOrderDirty(false);
        setSizes(nextSizes);
        setAttributes(nextAttrs);
        setReviews(reviewsWithImages);
      } catch (loadError) {
        const message = toErrorMessage(loadError, "Không thể tải chi tiết sản phẩm.");
        setError(message);
        toast.error(message);
      } finally {
        if (showLoading) setLoading(false);
      }
    },
    [outfitId],
  );

  useEffect(() => {
    loadData(true);
  }, [loadData]);

  const loadReferenceData = useCallback(async () => {
    setReferenceLoading(true);
    const [categoriesResult, outfitsResult, materialsResult] = await Promise.allSettled([
      getAllCategories(),
      getAllOutfits(),
      getAllOutfitMaterials(),
    ]);

    if (categoriesResult.status === "fulfilled") {
      setCategories(categoriesResult.value);
    } else {
      toast.error(toErrorMessage(categoriesResult.reason, "Không thể tải danh mục."));
    }

    if (outfitsResult.status === "fulfilled") {
      setOutfitReferenceList(outfitsResult.value);
    } else {
      toast.error(toErrorMessage(outfitsResult.reason, "Không thể tải danh sách khu vực."));
    }

    if (materialsResult.status === "fulfilled") {
      setMaterials(materialsResult.value);
      setMaterialsError(
        materialsResult.value.length === 0 ? "Không tải được danh sách, bạn có thể nhập thủ công" : null,
      );
    } else {
      setMaterials([]);
      setMaterialsError("Không tải được danh sách, bạn có thể nhập thủ công");
    }

    setReferenceLoading(false);
  }, []);

  useEffect(() => {
    loadReferenceData();
  }, [loadReferenceData]);

  useEffect(() => {
    if (!editOutfitOpen) return;
    setCategoryInput("");
    setRegionInput("");
    setCategoryOpen(false);
    setMaterialOpen(false);
    setRegionOpen(false);
    setShowCreateCategory(false);
    setCreateCategoryName("");
    setCreateCategoryDesc("");

    if (categories.length === 0 || outfitReferenceList.length === 0 || materials.length === 0) {
      loadReferenceData();
    }
  }, [categories.length, editOutfitOpen, loadReferenceData, materials.length, outfitReferenceList.length]);

  useEffect(() => {
    if (selectedImage >= sortedImages.length) setSelectedImage(0);
  }, [selectedImage, sortedImages.length]);

  useEffect(() => {
    if (!detail) return;
    const normalizedGender = toOutfitGender(normalizeGenderForSubmit(detail.gender || "Male"));
    setOutfitForm({
      categoryId: detail.categoryId === null ? "" : String(detail.categoryId),
      name: detail.name || "",
      type: normalizeTypeValue(detail.type || ""),
      gender: normalizedGender,
      region: normalizeRegionValue(detail.region || ""),
      isLimited: Boolean(detail.isLimited),
      status: toOutfitStatus(mapStatusToModalLabel(detail.status || "Active")),
      baseRentalPrice: String(toNum(detail.baseRentalPrice, 0)),
    });
  }, [detail]);

  useEffect(() => {
    setAttrsForm(mapAttrsToForm(attributes));
  }, [attributes]);

  const resetImageUploadState = useCallback(() => {
    setImageEncoding(false);
    setIsImageDragOver(false);
    setImageUploadError(null);
    setSelectedImageFile(null);
    setImagePreviewUrl(null);
    setImageBase64Value(null);
  }, []);

  const validateSelectedImageFile = useCallback((file: File): string | null => {
    const fileType = (file.type || "").trim().toLowerCase();
    const fileName = (file.name || "").trim().toLowerCase();
    const hasValidMime = ALLOWED_UPLOAD_IMAGE_MIME_TYPES.has(fileType);
    const hasValidExtension = /\.(png|jpe?g|webp)$/i.test(fileName);

    if (!hasValidMime && !hasValidExtension) {
      return "Chỉ hỗ trợ ảnh PNG, JPG, JPEG hoặc WEBP.";
    }

    if (file.size > MAX_UPLOAD_IMAGE_SIZE_BYTES) {
      return "Dung lượng ảnh tối đa là 3MB.";
    }

    return null;
  }, []);

  const handleSelectImageFile = useCallback(
    async (file: File | null) => {
      if (!file) return;

      const validationError = validateSelectedImageFile(file);
      if (validationError) {
        setImageUploadError(validationError);
        setSelectedImageFile(null);
        setImagePreviewUrl(null);
        setImageBase64Value(null);
        return;
      }

      setImageEncoding(true);
      setImageUploadError(null);
      try {
        const uploadValue = await toBase64(file, {
          stripPrefix: STRIP_BASE64_PREFIX_FOR_UPLOAD,
        });
        const previewValue = STRIP_BASE64_PREFIX_FOR_UPLOAD
          ? await toBase64(file, { stripPrefix: false })
          : uploadValue;

        setSelectedImageFile(file);
        setImagePreviewUrl(previewValue);
        setImageBase64Value(uploadValue);
      } catch {
        setSelectedImageFile(null);
        setImagePreviewUrl(null);
        setImageBase64Value(null);
        setImageUploadError("Không thể xử lý tệp ảnh. Vui lòng thử lại.");
      } finally {
        setImageEncoding(false);
      }
    },
    [validateSelectedImageFile],
  );

  const triggerImageFilePicker = useCallback(() => {
    imageFileInputRef.current?.click();
  }, []);

  const clearSelectedImageFile = useCallback(() => {
    setImageUploadError(null);
    setSelectedImageFile(null);
    setImagePreviewUrl(null);
    setImageBase64Value(null);
  }, []);

  const handleImageInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] ?? null;
      void handleSelectImageFile(file);
      event.currentTarget.value = "";
    },
    [handleSelectImageFile],
  );

  const handleImageDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsImageDragOver(true);
  }, []);

  const handleImageDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsImageDragOver(false);
  }, []);

  const handleImageDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsImageDragOver(false);
      const file = event.dataTransfer.files?.[0] ?? null;
      void handleSelectImageFile(file);
    },
    [handleSelectImageFile],
  );

  const handleImageDialogOpenChange = useCallback(
    (open: boolean) => {
      if (!open && (imageSaving || imageEncoding)) return;
      setImageOpen(open);
      if (!open) {
        setEditingImage(null);
        resetImageUploadState();
      }
    },
    [imageEncoding, imageSaving, resetImageUploadState],
  );

  const openAddImage = () => {
    setEditingImage(null);
    resetImageUploadState();
    const defaultType =
      imageTypeOptions.find((item) => normalizeStatusKey(item) === "main") || imageTypeOptions[0] || "Main";
    setImageForm({ imageType: defaultType });
    setImageOpen(true);
  };

  const openEditImage = (image: OutfitImageDto) => {
    setEditingImage(image);
    resetImageUploadState();
    setImageForm({
      imageType: image.imageType || "Gallery",
    });
    setImageOpen(true);
  };

  const handleRequestDeleteImage = (image: OutfitImageDto) => {
    setDeleteImageTarget(image);
    setDeleteImageOpen(true);
  };

  const handleDeleteImageOpenChange = (open: boolean) => {
    if (deletingImage) return;
    setDeleteImageOpen(open);
    if (!open) setDeleteImageTarget(null);
  };

  const handleConfirmDeleteImage = async () => {
    if (!deleteImageTarget || deleteImageTarget.imageId <= 0) return;

    setDeletingImage(true);
    try {
      await deleteOutfitImage(deleteImageTarget.imageId);
      toast.success("Đã xóa ảnh thành công");
      setDeleteImageOpen(false);
      setDeleteImageTarget(null);
      await loadData(false);
    } catch (error) {
      const status = getResponseStatus(error);
      if (status === 401 || status === 403) {
        toast.error("Bạn không có quyền thực hiện");
      } else {
        toast.error("Xóa ảnh thất bại, thử lại sau");
      }
    } finally {
      setDeletingImage(false);
    }
  };

  const openAddSize = () => {
    setEditingSize(null);
    setSizeForm({
      sizeLabel: "",
      stockQuantity: "0",
      chestMaxCm: "0",
      waistMaxCm: "0",
      hipMaxCm: "0",
      status: "Đang hoạt động",
    });
    setSizeOpen(true);
  };

  const openEditSize = (size: OutfitSizeDto) => {
    setEditingSize(size);
    const mappedStatus = toSizeStatusLabel(size.status || "Available");
    setSizeForm({
      sizeLabel: size.sizeLabel || "",
      stockQuantity: String(toNum(size.stockQuantity, 0)),
      chestMaxCm: String(toNum(size.chestMaxCm, 0)),
      waistMaxCm: String(toNum(size.waistMaxCm, 0)),
      hipMaxCm: String(toNum(size.hipMaxCm, 0)),
      status: toSizeStatus(mappedStatus),
    });
    setSizeOpen(true);
  };

  const reorderImageAtIndex = (fromIndex: number, toIndex: number) => {
    setImages((prev) => {
      const ordered = sortImagesBySortOrder(prev);
      const moved = moveItem(ordered, fromIndex, toIndex);
      return normalizeImageSortOrder(moved);
    });
    setImagesOrderDirty(true);
  };

  const cancelImageOrderChanges = () => {
    setImages(sortImagesBySortOrder(originalImages));
    setImagesOrderDirty(false);
  };

  const saveImageOrder = async () => {
    if (imagesOrderSaving || !imagesOrderDirty) return;

    const normalized = normalizeImageSortOrder(sortImagesBySortOrder(images));
    const payloads = normalized.filter((image) => image.imageId > 0);
    if (payloads.length === 0) {
      setImagesOrderDirty(false);
      return;
    }

    setImagesOrderSaving(true);
    try {
      await Promise.all(
        payloads.map((image) =>
          updateOutfitImage(image.imageId, {
            imageUrl: image.imageUrl,
            imageType: image.imageType || "Gallery",
            sortOrder: image.sortOrder,
          }),
        ),
      );
      setImages(normalized);
      setOriginalImages(normalized);
      setImagesOrderDirty(false);
      toast.success("Lưu thứ tự ảnh thành công.");
    } catch (error) {
      toast.error(toErrorMessage(error, "Không thể lưu thứ tự ảnh."));
    } finally {
      setImagesOrderSaving(false);
    }
  };

  const handleCreateCategory = async () => {
    const normalizedName = normalizeWhitespace(createCategoryName);
    if (!normalizedName) {
      toast.error("Tên danh mục không được để trống.");
      return;
    }

    setCreatingCategory(true);
    try {
      const payload: CreateCategoryPayload = {
        categoryName: normalizedName,
        description: normalizeWhitespace(createCategoryDesc) || undefined,
      };

      const created = await createCategory(payload);
      const latestCategories = await getAllCategories();
      setCategories(latestCategories);

      let nextCategoryId = toNum(created.categoryId, 0);
      if (nextCategoryId <= 0) {
        const matched = latestCategories.find(
          (item) => normalizeCategoryKey(item.categoryName) === normalizeCategoryKey(normalizedName),
        );
        nextCategoryId = toNum(matched?.categoryId, 0);
      }

      if (nextCategoryId <= 0) {
        toast.error("Tạo danh mục thành công nhưng chưa lấy được mã danh mục.");
        return;
      }

      setOutfitForm((prev) => ({ ...prev, categoryId: String(nextCategoryId) }));
      setCategoryInput("");
      setCreateCategoryName("");
      setCreateCategoryDesc("");
      setShowCreateCategory(false);
      setCategoryOpen(false);
      toast.success("Tạo danh mục thành công.");
    } catch (error) {
      toast.error(toErrorMessage(error, "Không thể tạo danh mục mới."));
    } finally {
      setCreatingCategory(false);
    }
  };

  const saveOutfit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!Number.isFinite(outfitId) || outfitId <= 0) return;
    if (creatingCategory || showCreateCategory) {
      toast.error("Vui lòng hoàn tất tạo danh mục mới trước khi lưu.");
      return;
    }

    const normalizedMaterial = normalizeTypeValue(outfitForm.type);
    const normalizedRegion = normalizeRegionValue(outfitForm.region);
    const selectedCategoryId =
      outfitForm.categoryId.trim().length > 0
        ? toNum(outfitForm.categoryId, 0)
        : toNum(detail?.categoryId, 0);

    if (selectedCategoryId <= 0) {
      toast.error("Vui lòng chọn danh mục.");
      return;
    }

    const payload: UpdateOutfitPayload = {
      categoryId: selectedCategoryId,
      name: outfitForm.name.trim(),
      type: normalizedMaterial,
      gender: normalizeGenderForSubmit(outfitForm.gender),
      region: normalizedRegion,
      isLimited: outfitForm.isLimited,
      status: mapStatusToApiValue(outfitForm.status),
      baseRentalPrice: toNum(outfitForm.baseRentalPrice, 0),
    };

    if (!payload.name) {
      toast.error("Tên sản phẩm không được để trống.");
      return;
    }
    if (!payload.type) {
      toast.error("Vui lòng chọn hoặc nhập Chất liệu.");
      return;
    }
    if (!payload.region) {
      toast.error("Vui lòng chọn hoặc tạo Khu vực.");
      return;
    }

    setOutfitSaving(true);
    try {
      await updateOutfit(outfitId, payload);
      toast.success("Cập nhật thông tin sản phẩm thành công.");
      setEditOutfitOpen(false);
      await loadData(false);
    } catch (saveError) {
      toast.error(toErrorMessage(saveError, "Không thể cập nhật sản phẩm."));
    } finally {
      setOutfitSaving(false);
    }
  };

  const saveImage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsedOutfitId = Number.parseInt(outfitIdParam ?? "", 10);
    if (!Number.isInteger(parsedOutfitId) || parsedOutfitId <= 0) {
      toast.error("ID sản phẩm không hợp lệ.");
      return;
    }

    if (!editingImage && !imageBase64Value) {
      toast.error("Vui lòng chọn ảnh.");
      return;
    }

    const normalizedImageType = normalizeWhitespace(imageForm.imageType || "") || "Gallery";
    if (normalizedImageType.length > 50) {
      toast.error("Loại ảnh không được vượt quá 50 ký tự.");
      return;
    }

    setImageSaving(true);
    try {
      const baseImageValue = (imageBase64Value || editingImage?.imageUrl || "").trim();
      const previewImageValue = (imagePreviewUrl || "").trim();
      const strippedBaseImageValue = stripDataUrlPrefix(baseImageValue);
      const imageUrlCandidates = Array.from(
        new Set(
          [baseImageValue, strippedBaseImageValue, previewImageValue].filter(
            (value): value is string => typeof value === "string" && value.trim().length > 0,
          ),
        ),
      );

      if (imageUrlCandidates.length === 0) {
        toast.error("Vui lòng chọn ảnh.");
        return;
      }

      const resolveNextSortOrder = async (): Promise<number> => {
        const currentMaxSort = images.reduce((max, item) => Math.max(max, toNum(item.sortOrder, 0)), 0);
        if (images.length > 0) return currentMaxSort + 1;

        try {
          const latestImages = await getOutfitImages(parsedOutfitId);
          const latestMaxSort = latestImages.reduce(
            (max, item) => Math.max(max, toNum(item.sortOrder, 0)),
            0,
          );
          return latestMaxSort + 1;
        } catch {
          return 1;
        }
      };

      const resolvedSortOrder = editingImage
        ? Math.max(1, toNum(editingImage.sortOrder, 1))
        : await resolveNextSortOrder();
      if (resolvedSortOrder > 999) {
        toast.error("Số lượng ảnh đã đạt giới hạn cho phép.");
        return;
      }

      const payload: UpdateOutfitImagePayload = {
        imageUrl: imageUrlCandidates[0],
        imageType: normalizedImageType,
        sortOrder: resolvedSortOrder,
      };

      if (editingImage && editingImage.imageId > 0) {
        let updated = false;
        let lastBadRequestError: unknown = null;
        for (const candidateImageUrl of imageUrlCandidates) {
          try {
            await updateOutfitImage(editingImage.imageId, {
              ...payload,
              imageUrl: candidateImageUrl,
            });
            updated = true;
            break;
          } catch (updateError) {
            if (getResponseStatus(updateError) === 400) {
              if (isImageUrlUriValidationError(updateError)) throw updateError;
              lastBadRequestError = updateError;
              continue;
            }
            throw updateError;
          }
        }
        if (!updated) throw lastBadRequestError ?? new Error("Không thể lưu ảnh sản phẩm.");
        toast.success("Cập nhật ảnh thành công.");
      } else {
        const imageTypeCandidates =
          normalizeStatusKey(payload.imageType) === "main"
            ? [payload.imageType]
            : [payload.imageType, "Main"];

        let created = false;
        let lastBadRequestError: unknown = null;

        for (const candidateImageUrl of imageUrlCandidates) {
          for (const candidateImageType of imageTypeCandidates) {
            try {
              await addOutfitImage({
                outfitId: parsedOutfitId,
                imageUrl: candidateImageUrl,
                imageType: candidateImageType,
                sortOrder: payload.sortOrder,
              });
              created = true;
              break;
            } catch (createError) {
              if (getResponseStatus(createError) === 400) {
                if (isImageUrlUriValidationError(createError)) throw createError;
                lastBadRequestError = createError;
                continue;
              }
              throw createError;
            }
          }
          if (created) break;
        }

        if (!created) throw lastBadRequestError ?? new Error("Không thể lưu ảnh sản phẩm.");
        toast.success("Đã thêm ảnh thành công");
      }

      setImageOpen(false);
      setEditingImage(null);
      resetImageUploadState();
      await loadData(false);
    } catch (saveError) {
      if (getResponseStatus(saveError) === 400 && isImageUrlUriValidationError(saveError)) {
        toast.error(
          "Không thể lưu ảnh: API hiện yêu cầu imageUrl là URL http/https, chưa nhận base64. Cần cập nhật backend.",
        );
        return;
      }
      toast.error(toErrorMessage(saveError, "Không thể lưu ảnh sản phẩm."));
    } finally {
      setImageSaving(false);
    }
  };

  const saveSize = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!Number.isFinite(outfitId) || outfitId <= 0) return;

    const sizeLabel = sizeForm.sizeLabel.trim();
    const stockQuantity = toNum(sizeForm.stockQuantity, 0);
    const chestMaxCm = toNum(sizeForm.chestMaxCm, 0);
    const waistMaxCm = toNum(sizeForm.waistMaxCm, 0);
    const hipMaxCm = toNum(sizeForm.hipMaxCm, 0);
    const status = toSizeStatusValue(sizeForm.status);

    if (!sizeLabel) {
      toast.error("Vui lòng nhập kích cỡ.");
      return;
    }
    if (stockQuantity < 0 || chestMaxCm < 0 || waistMaxCm < 0 || hipMaxCm < 0) {
      toast.error("Số lượng tồn kho và số đo không được nhỏ hơn 0.");
      return;
    }

    setSizeSaving(true);
    try {
      const payload: UpdateOutfitSizePayload = {
        sizeLabel,
        stockQuantity,
        chestMaxCm,
        waistMaxCm,
        hipMaxCm,
        status,
      };

      if (editingSize && editingSize.sizeId > 0) {
        await updateOutfitSize(editingSize.sizeId, payload);
        toast.success("Cập nhật kích cỡ thành công.");
      } else {
        const createPayload: AddOutfitSizePayload = {
          outfitId,
          sizeLabel: payload.sizeLabel,
          stockQuantity: payload.stockQuantity,
          chestMaxCm: payload.chestMaxCm,
          waistMaxCm: payload.waistMaxCm,
          hipMaxCm: payload.hipMaxCm,
          status: payload.status,
        };
        await addOutfitSize(createPayload);
        toast.success("Thêm kích cỡ thành công.");
      }

      setSizeOpen(false);
      await loadData(false);
    } catch (saveError) {
      toast.error(toErrorMessage(saveError, "Không thể lưu kích cỡ."));
    } finally {
      setSizeSaving(false);
    }
  };

  const saveAttributes = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!Number.isFinite(outfitId) || outfitId <= 0) return;

    const payload: UpdateOutfitAttributesPayload = {
      material: attrsForm.material.trim(),
      silhouette: attrsForm.silhouette.trim(),
      formalityLevel: attrsForm.formalityLevel.trim(),
      occasion: attrsForm.occasion.trim(),
      colorPrimary: attrsForm.colorPrimary.trim(),
      seasonSuitability: attrsForm.seasonSuitability.trim(),
      storyTitle: attrsForm.storyTitle.trim(),
      storyContent: attrsForm.storyContent.trim(),
      culturalOrigin: attrsForm.culturalOrigin.trim(),
    };

    setAttrsSaving(true);
    try {
      let saved: OutfitAttributesDto;
      if (attributes && attributes.detailId > 0) {
        saved = await updateOutfitAttributes(attributes.detailId, payload);
        toast.success("Cập nhật thuộc tính thành công.");
      } else {
        const createPayload: CreateOutfitAttributesPayload = { outfitId, ...payload };
        saved = await createOutfitAttributes(createPayload);
        toast.success("Tạo thuộc tính thành công.");
      }
      setAttributes(saved);
      setDetail((prev) => (prev ? { ...prev, attributes: saved } : prev));
    } catch (saveError) {
      toast.error(toErrorMessage(saveError, "Không thể lưu thuộc tính."));
    } finally {
      setAttrsSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-10 w-80" />
            <Skeleton className="h-6 w-60" />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Skeleton className="h-[420px] w-full" />
        </div>
      </AdminLayout>
    );
  }

  if (error || !detail) {
    return (
      <AdminLayout>
        <Card className="border border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-700">Không thể tải chi tiết sản phẩm</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-red-700">{error ?? "Đã xảy ra lỗi không xác định."}</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => loadData(true)}>
                Tải lại
              </Button>
              <Button asChild>
                <Link to="/admin/products">Quay lại danh sách</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <Link to="/admin/products" className="text-[#c1272d] hover:text-[#a01f24] font-medium transition-colors">
            Quản lý sản phẩm
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">{detail.name || "Sản phẩm"}</span>
        </div>

        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1a1a1a] via-[#2a1a1a] to-[#1a1a1a] p-6 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-[#c1272d]/20 via-transparent to-[#d4af37]/10 pointer-events-none" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#d4af37]/15 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <h1 className="text-3xl font-bold tracking-tight text-white">{detail.name || "Chi tiết sản phẩm"}</h1>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                  (detail.status || "").toLowerCase().includes("active") || (detail.status || "").toLowerCase().includes("available")
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-red-500/20 text-red-300 border border-red-500/30"
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {mapStatusLabel(detail.status || "")}
                </span>
                <span className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80 border border-white/20">
                  {categoryLabel}
                </span>
                {detail.isLimited && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#d4af37]/20 px-3 py-1 text-xs font-semibold text-[#d4af37] border border-[#d4af37]/30">
                    ✦ Bản giới hạn
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => setEditOutfitOpen(true)}
                className="border-white/20 bg-white/10 text-white hover:bg-white/20 hover:border-white/30 backdrop-blur-sm"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </Button>
              <Button asChild className="bg-[#c1272d] hover:bg-[#a01f24] text-white shadow-lg shadow-[#c1272d]/30">
                <Link to="/admin/products">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Quay lại danh sách
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#c1272d] to-[#8b0000] p-5 shadow-lg shadow-[#c1272d]/20">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8 blur-xl" />
            <p className="text-sm font-medium text-red-100/80 mb-1">Giá thuê</p>
            <p className="text-2xl font-bold text-white">{formatVnd(toNum(detail.baseRentalPrice, 0))}</p>
            <div className="mt-3 flex items-center gap-1 text-red-100/60 text-xs">
              <span>Giá thuê cơ bản / ngày</span>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#1a6b3a] to-[#0d4a27] p-5 shadow-lg shadow-emerald-900/30">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8 blur-xl" />
            <p className="text-sm font-medium text-emerald-100/80 mb-1">Tổng tồn kho</p>
            <p className="text-2xl font-bold text-white">{totalStock.toLocaleString("vi-VN")}</p>
            <div className="mt-3 flex items-center gap-1 text-emerald-100/60 text-xs">
              <span>Sản phẩm có sẵn</span>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#b8791a] to-[#7a4e0d] p-5 shadow-lg shadow-amber-900/30">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-8 translate-x-8 blur-xl" />
            <p className="text-sm font-medium text-amber-100/80 mb-1">Đánh giá</p>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-[#d4af37] fill-[#d4af37]" />
              <p className="text-2xl font-bold text-white">{avgRating > 0 ? avgRating.toFixed(1) : "0.0"}</p>
              <p className="text-sm text-amber-100/60">/ 5</p>
            </div>
            <div className="mt-2 text-amber-100/60 text-xs">{reviewCount} lượt đánh giá</div>
          </div>
        </div>

        {/* Image Gallery + Quick Info */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
          <Card className="overflow-hidden border-0 shadow-md">
            <CardHeader className="border-b bg-gray-50/50 pb-3 pt-4 px-5">
              <CardTitle className="text-base font-semibold text-gray-700 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-[#c1272d] inline-block" />
                Thư viện ảnh
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-5">
              <div className="overflow-hidden rounded-xl border-2 border-gray-100 bg-gray-50 shadow-inner">
                <img
                  src={primaryImage?.imageUrl || IMAGE_PLACEHOLDER}
                  alt={detail.name || "Ảnh sản phẩm"}
                  className="h-[340px] w-full object-cover"
                />
              </div>
              {sortedImages.length > 0 ? (
                <div className="grid grid-cols-4 gap-2">
                  {sortedImages.map((image, index) => (
                    <button
                      key={image.imageId || `${image.imageUrl}-${index}`}
                      type="button"
                      onClick={() => setSelectedImage(index)}
                      className={`overflow-hidden rounded-lg border-2 transition-all ${
                        selectedImage === index
                          ? "border-[#c1272d] ring-2 ring-[#c1272d]/30 scale-95"
                          : "border-gray-200 hover:border-[#c1272d]/50"
                      }`}
                    >
                      <img
                        src={image.imageUrl || IMAGE_PLACEHOLDER}
                        alt={`Ảnh ${index + 1}`}
                        className="h-20 w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">Chưa có ảnh sản phẩm.</p>
              )}
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-0 shadow-md">
            <CardHeader className="border-b bg-gray-50/50 pb-3 pt-4 px-5">
              <CardTitle className="text-base font-semibold text-gray-700 flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-[#d4af37] inline-block" />
                Thông tin nhanh
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {[
                { label: "Danh mục", value: categoryLabel },
                { label: "Chất liệu", value: detail.type || "Không rõ" },
                { label: "Giới tính", value: mapGenderLabel(detail.gender || "") },
                { label: "Khu vực", value: detail.region || "Không rõ" },
                { label: "Trạng thái", value: mapStatusLabel(detail.status || "") },
                { label: "Giới hạn", value: detail.isLimited ? "Có" : "Không" },
                { label: "Ngày tạo", value: formatDateOnly(detail.createdAt) },
              ].map((item, i) => (
                <div key={item.label} className={`flex items-center justify-between px-5 py-3 text-sm ${i % 2 === 0 ? "bg-white" : "bg-gray-50/60"}`}>
                  <span className="text-gray-500">{item.label}</span>
                  <span className="font-semibold text-gray-800 text-right">{item.value}</span>
                </div>
              ))}
              <div className="bg-gradient-to-r from-[#c1272d]/5 to-[#d4af37]/5 px-5 py-3 border-t">
                <p className="text-xs text-gray-500 mb-1.5 font-medium uppercase tracking-wide">Tồn kho theo kích cỡ</p>
                <p className="font-semibold text-gray-800 text-sm">{stockSummary || "—"}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={(value: string) => setTab(value as TabValue)} className="space-y-4">
          <TabsList className="flex h-12 w-full flex-wrap gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200">
            {(["overview", "images", "sizes", "attributes", "reviews"] as const).map((t) => {
              const labels: Record<string, string> = {
                overview: "Tổng quan",
                images: "Ảnh sản phẩm",
                sizes: "Kho & Kích cỡ",
                attributes: "Thuộc tính",
                reviews: "Đánh giá",
              };
              return (
                <TabsTrigger
                  key={t}
                  value={t}
                  className="rounded-lg px-4 py-1.5 text-sm font-medium data-[state=active]:bg-[#c1272d] data-[state=active]:text-white data-[state=active]:shadow-sm transition-all"
                >
                  {labels[t]}
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card className="border-0 shadow-md overflow-hidden">
              <CardHeader className="border-b bg-gray-50/50 pb-3 pt-4 px-5">
                <CardTitle className="text-base font-semibold text-gray-700 flex items-center gap-2">
                  <span className="w-1 h-5 rounded-full bg-[#c1272d] inline-block" />
                  Tổng quan sản phẩm
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-0 md:grid-cols-2 p-0">
                {[
                  { label: "Tên sản phẩm", value: detail.name || "--" },
                  { label: "Giá thuê", value: formatVnd(toNum(detail.baseRentalPrice, 0)) },
                  { label: "Trạng thái", value: mapStatusLabel(detail.status || "") },
                  { label: "Tồn kho theo kích cỡ", value: stockSummary },
                ].map((item, i) => (
                  <div key={item.label} className={`px-5 py-4 border-b border-gray-100 ${i % 2 === 1 ? "md:border-l" : ""}`}>
                    <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide font-medium">{item.label}</p>
                    <p className="font-semibold text-gray-800">{item.value}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md overflow-hidden">
              <CardHeader className="border-b bg-gray-50/50 pb-3 pt-4 px-5 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-semibold text-gray-700 flex items-center gap-2">
                  <span className="w-1 h-5 rounded-full bg-[#d4af37] inline-block" />
                  Thuộc tính sản phẩm
                </CardTitle>
                {!attributes && (
                  <Button size="sm" onClick={() => setTab("attributes")} className="bg-[#c1272d] hover:bg-[#a01f24] text-white text-xs">
                    Tạo thuộc tính
                  </Button>
                )}
              </CardHeader>
              <CardContent className="p-5">
                {attributes ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {[
                      { label: "Chất liệu", value: attributes.material },
                      { label: "Phom dáng", value: attributes.silhouette },
                      { label: "Mức độ trang trọng", value: attributes.formalityLevel },
                      { label: "Dịp sử dụng", value: attributes.occasion },
                      { label: "Màu chủ đạo", value: attributes.colorPrimary },
                      { label: "Mùa phù hợp", value: attributes.seasonSuitability },
                      { label: "Tiêu đề câu chuyện", value: attributes.storyTitle },
                      { label: "Nguồn gốc văn hóa", value: attributes.culturalOrigin },
                    ].map((item) => (
                      <div key={item.label} className="rounded-lg bg-gray-50 px-4 py-3">
                        <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide font-medium">{item.label}</p>
                        <p className="font-semibold text-gray-800 text-sm">{item.value || "--"}</p>
                      </div>
                    ))}
                    <div className="md:col-span-2 rounded-lg bg-gray-50 px-4 py-3">
                      <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide font-medium">Nội dung câu chuyện</p>
                      <p className="font-medium text-gray-800 text-sm whitespace-pre-wrap">{attributes.storyContent || "--"}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                      <Plus className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">Chưa có thuộc tính cho sản phẩm này.</p>
                    <p className="text-xs text-gray-400 mt-1">Vui lòng tạo ở tab Thuộc tính.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images" className="space-y-4">
            <Card className="border-0 shadow-md overflow-hidden">
              <CardHeader className="border-b bg-gray-50/50 pb-3 pt-4 px-5 space-y-3">
                <div className="flex flex-row items-center justify-between">
                  <CardTitle className="text-base font-semibold text-gray-700 flex items-center gap-2">
                    <span className="w-1 h-5 rounded-full bg-[#c1272d] inline-block" />
                    Ảnh sản phẩm
                  </CardTitle>
                  <Button onClick={openAddImage} className="bg-[#c1272d] hover:bg-[#a01f24] text-white text-sm">
                    <ImagePlus className="mr-2 h-4 w-4" />
                    Thêm ảnh
                  </Button>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={cancelImageOrderChanges}
                    disabled={!imagesOrderDirty || imagesOrderSaving}
                    className="text-sm border-gray-300 hover:border-[#c1272d] hover:text-[#c1272d]"
                  >
                    Hủy thay đổi
                  </Button>
                  <Button
                    type="button"
                    onClick={saveImageOrder}
                    disabled={!imagesOrderDirty || imagesOrderSaving}
                    className="bg-[#d4af37] hover:bg-[#b8941f] text-white text-sm"
                  >
                    {imagesOrderSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      "Lưu thứ tự"
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-5">
                {imagesByOrder.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                      <ImagePlus className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">Chưa có ảnh sản phẩm.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 hover:bg-gray-50">
                        <TableHead className="w-[120px] text-xs font-semibold uppercase tracking-wide text-gray-500">Sắp xếp</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide text-gray-500">Ảnh</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide text-gray-500">Loại ảnh</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide text-gray-500">Thứ tự</TableHead>
                        <TableHead className="text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Hành động</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {imagesByOrder.map((image, index) => (
                        <TableRow key={image.imageId}>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 border-gray-200 hover:border-[#c1272d] hover:text-[#c1272d]"
                                onClick={() => reorderImageAtIndex(index, index - 1)}
                                disabled={index === 0 || imagesOrderSaving}
                              >
                                <ArrowUp className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-7 w-7 border-gray-200 hover:border-[#c1272d] hover:text-[#c1272d]"
                                onClick={() => reorderImageAtIndex(index, index + 1)}
                                disabled={index === imagesByOrder.length - 1 || imagesOrderSaving}
                              >
                                <ArrowDown className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="h-14 w-20 overflow-hidden rounded-lg border-2 border-gray-100 shadow-sm">
                              <img
                                src={image.imageUrl || IMAGE_PLACEHOLDER}
                                alt="Ảnh sản phẩm"
                                className="h-full w-full object-cover"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                              {mapImageTypeLabel(image.imageType || "")}
                            </span>
                          </TableCell>
                          <TableCell className="font-medium text-gray-700">{index + 1}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => openEditImage(image)} className="text-xs border-gray-200 hover:border-[#c1272d] hover:text-[#c1272d]">
                                <Pencil className="mr-1.5 h-3.5 w-3.5" />
                                Chỉnh sửa
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-xs border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                                onClick={() => handleRequestDeleteImage(image)}
                                disabled={deletingImage}
                              >
                                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                                Xóa
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sizes" className="space-y-4">
            <Card className="border-0 shadow-md overflow-hidden">
              <CardHeader className="border-b bg-gray-50/50 pb-3 pt-4 px-5 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-semibold text-gray-700 flex items-center gap-2">
                  <span className="w-1 h-5 rounded-full bg-[#c1272d] inline-block" />
                  Kho &amp; Kích cỡ
                </CardTitle>
                <Button onClick={openAddSize} className="bg-[#c1272d] hover:bg-[#a01f24] text-white text-sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm kích cỡ
                </Button>
              </CardHeader>
              <CardContent className="p-5">
                {sizes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                      <Plus className="w-5 h-5 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-500">Chưa có dữ liệu kích cỡ.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 hover:bg-gray-50">
                        <TableHead className="text-xs font-semibold uppercase tracking-wide text-gray-500">Kích cỡ</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide text-gray-500">Tồn kho</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide text-gray-500">Ngực (cm)</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide text-gray-500">Eo (cm)</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide text-gray-500">Mông (cm)</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wide text-gray-500">Trạng thái</TableHead>
                        <TableHead className="text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Hành động</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sizes.map((size) => {
                        const stock = Math.max(0, toNum(size.stockQuantity, 0));
                        return (
                          <TableRow key={size.sizeId} className="hover:bg-gray-50/80">
                            <TableCell className="font-semibold text-gray-800">{size.sizeLabel || "--"}</TableCell>
                            <TableCell>
                              <span className={`font-semibold ${stock > 0 ? "text-emerald-700" : "text-red-600"}`}>{stock}</span>
                            </TableCell>
                            <TableCell className="text-gray-600">{formatMeasurement(size.chestMaxCm)}</TableCell>
                            <TableCell className="text-gray-600">{formatMeasurement(size.waistMaxCm)}</TableCell>
                            <TableCell className="text-gray-600">{formatMeasurement(size.hipMaxCm)}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                                  stock > 0 ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-red-50 text-red-700 border-red-100"
                                }`}>
                                  {stock > 0 ? "Còn hàng" : "Hết hàng"}
                                </span>
                                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-50 text-gray-600 border border-gray-100">
                                  {toSizeStatusLabel(size.status || "")}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm" onClick={() => openEditSize(size)} className="text-xs border-gray-200 hover:border-[#c1272d] hover:text-[#c1272d]">
                                <Pencil className="mr-1.5 h-3.5 w-3.5" />
                                Chỉnh sửa
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attributes" className="space-y-4">
            <Card className="border-0 shadow-md overflow-hidden">
              <CardHeader className="border-b bg-gray-50/50 pb-3 pt-4 px-5">
                <CardTitle className="text-base font-semibold text-gray-700 flex items-center gap-2">
                  <span className="w-1 h-5 rounded-full bg-[#d4af37] inline-block" />
                  Thuộc tính sản phẩm
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5">
                <form className="space-y-5" onSubmit={saveAttributes}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="attr-material" className="text-xs font-semibold uppercase tracking-wide text-gray-500">Chất liệu</Label>
                      <Input
                        id="attr-material"
                        value={attrsForm.material}
                        onChange={(event) =>
                          setAttrsForm((prev) => ({ ...prev, material: event.target.value }))
                        }
                        className="border-gray-200 focus:border-[#c1272d] focus:ring-[#c1272d]/20"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="attr-silhouette" className="text-xs font-semibold uppercase tracking-wide text-gray-500">Phom dáng</Label>
                      <Input
                        id="attr-silhouette"
                        value={attrsForm.silhouette}
                        onChange={(event) =>
                          setAttrsForm((prev) => ({ ...prev, silhouette: event.target.value }))
                        }
                        className="border-gray-200 focus:border-[#c1272d] focus:ring-[#c1272d]/20"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="attr-formality" className="text-xs font-semibold uppercase tracking-wide text-gray-500">Mức độ trang trọng</Label>
                      <Input
                        id="attr-formality"
                        value={attrsForm.formalityLevel}
                        onChange={(event) =>
                          setAttrsForm((prev) => ({ ...prev, formalityLevel: event.target.value }))
                        }
                        className="border-gray-200 focus:border-[#c1272d] focus:ring-[#c1272d]/20"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="attr-occasion" className="text-xs font-semibold uppercase tracking-wide text-gray-500">Dịp sử dụng</Label>
                      <Input
                        id="attr-occasion"
                        value={attrsForm.occasion}
                        onChange={(event) =>
                          setAttrsForm((prev) => ({ ...prev, occasion: event.target.value }))
                        }
                        className="border-gray-200 focus:border-[#c1272d] focus:ring-[#c1272d]/20"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="attr-color" className="text-xs font-semibold uppercase tracking-wide text-gray-500">Màu chủ đạo</Label>
                      <Input
                        id="attr-color"
                        value={attrsForm.colorPrimary}
                        onChange={(event) =>
                          setAttrsForm((prev) => ({ ...prev, colorPrimary: event.target.value }))
                        }
                        className="border-gray-200 focus:border-[#c1272d] focus:ring-[#c1272d]/20"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="attr-season" className="text-xs font-semibold uppercase tracking-wide text-gray-500">Mùa phù hợp</Label>
                      <Input
                        id="attr-season"
                        value={attrsForm.seasonSuitability}
                        onChange={(event) =>
                          setAttrsForm((prev) => ({ ...prev, seasonSuitability: event.target.value }))
                        }
                        className="border-gray-200 focus:border-[#c1272d] focus:ring-[#c1272d]/20"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="attr-story-title" className="text-xs font-semibold uppercase tracking-wide text-gray-500">Tiêu đề câu chuyện</Label>
                      <Input
                        id="attr-story-title"
                        value={attrsForm.storyTitle}
                        onChange={(event) =>
                          setAttrsForm((prev) => ({ ...prev, storyTitle: event.target.value }))
                        }
                        className="border-gray-200 focus:border-[#c1272d] focus:ring-[#c1272d]/20"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="attr-origin" className="text-xs font-semibold uppercase tracking-wide text-gray-500">Nguồn gốc văn hóa</Label>
                      <Input
                        id="attr-origin"
                        value={attrsForm.culturalOrigin}
                        onChange={(event) =>
                          setAttrsForm((prev) => ({ ...prev, culturalOrigin: event.target.value }))
                        }
                        className="border-gray-200 focus:border-[#c1272d] focus:ring-[#c1272d]/20"
                      />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <Label htmlFor="attr-story-content" className="text-xs font-semibold uppercase tracking-wide text-gray-500">Nội dung câu chuyện</Label>
                      <Textarea
                        id="attr-story-content"
                        rows={4}
                        value={attrsForm.storyContent}
                        onChange={(event) =>
                          setAttrsForm((prev) => ({ ...prev, storyContent: event.target.value }))
                        }
                        className="border-gray-200 focus:border-[#c1272d] focus:ring-[#c1272d]/20"
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={attrsSaving} className="bg-[#c1272d] hover:bg-[#a01f24] text-white">
                    {attrsSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang lưu...
                      </>
                    ) : attributes ? (
                      "Cập nhật thuộc tính"
                    ) : (
                      "Tạo thuộc tính"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <Card className="border-0 shadow-md overflow-hidden">
              <CardHeader className="border-b bg-gray-50/50 pb-3 pt-4 px-5">
                <CardTitle className="text-base font-semibold text-gray-700 flex items-center gap-2">
                  <span className="w-1 h-5 rounded-full bg-[#d4af37] inline-block" />
                  Tổng quan đánh giá
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center gap-8 p-5">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="h-6 w-6 text-[#d4af37] fill-[#d4af37]" />
                    <span className="text-3xl font-bold text-gray-800">
                      {reviewsAvg > 0 ? reviewsAvg.toFixed(1) : "0.0"}
                    </span>
                    <span className="text-gray-400 text-sm">/ 5</span>
                  </div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Điểm trung bình</p>
                </div>
                <div className="w-px h-12 bg-gray-200 hidden sm:block" />
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-gray-800">{reviews.length}</span>
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-medium mt-1">Tổng đánh giá</p>
                </div>
              </CardContent>
            </Card>

            {reviews.length === 0 ? (
              <Card className="border-0 shadow-md">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                    <Star className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500">Chưa có đánh giá nào cho sản phẩm này.</p>
                </CardContent>
              </Card>
            ) : (
              reviews.map((review) => (
                <Card key={review.reviewId} className="border-0 shadow-md overflow-hidden">
                  <CardHeader className="border-b bg-gray-50/50 pb-3 pt-4 px-5 space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-semibold text-gray-800">{review.userFullName || "Ẩn danh"}</p>
                        <p className="text-xs text-gray-400">{review.userEmail || "--"}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-[#c1272d]">{Math.max(0, toNum(review.rating, 0)).toFixed(1)} <span className="text-gray-400 font-normal text-xs">/ 5</span></p>
                        <p className="text-xs text-gray-400">{formatDateTime(review.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={`${review.reviewId}-${index}`}
                          className={`h-4 w-4 ${index < Math.round(Math.max(0, toNum(review.rating, 0)))
                            ? "fill-[#d4af37] text-[#d4af37]"
                            : "text-gray-200 fill-gray-200"
                            }`}
                        />
                      ))}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 p-5">
                    <p className="whitespace-pre-wrap text-sm text-gray-700">{review.comment || "Không có nhận xét."}</p>
                    {Array.isArray(review.images) && review.images.length > 0 && (
                      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                        {review.images.map((image) => (
                          <div key={image.imgId} className="overflow-hidden rounded-lg border-2 border-gray-100 shadow-sm">
                            <img
                              src={image.imageUrl || IMAGE_PLACEHOLDER}
                              alt={`Ảnh đánh giá ${review.reviewId}`}
                              className="h-24 w-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={editOutfitOpen} onOpenChange={setEditOutfitOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin sản phẩm</DialogTitle>
            <DialogDescription>Cập nhật thông tin cơ bản của sản phẩm.</DialogDescription>
          </DialogHeader>

          <form id="edit-outfit-form" className="space-y-4" onSubmit={saveOutfit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="outfit-category">Danh mục</Label>
                <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      aria-expanded={categoryOpen}
                      className="w-full justify-between"
                      disabled={referenceLoading && categoryOptions.length === 0 && !showCreateCategory}
                    >
                      <span className="truncate text-left">
                        {selectedCategoryName ||
                          (referenceLoading ? "Đang tải danh mục..." : "Chọn danh mục")}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder="Tìm danh mục..."
                        value={categoryInput}
                        onValueChange={setCategoryInput}
                      />
                      <CommandList>
                        <CommandEmpty>Không tìm thấy danh mục.</CommandEmpty>
                        <CommandGroup>
                          {filteredCategoryOptions.map((category) => (
                            <CommandItem
                              key={category.categoryId}
                              value={category.categoryName}
                              onSelect={() => {
                                setOutfitForm((prev) => ({
                                  ...prev,
                                  categoryId: String(category.categoryId),
                                }));
                                setCategoryInput("");
                                setShowCreateCategory(false);
                                setCategoryOpen(false);
                              }}
                            >
                              {category.categoryName}
                              <Check
                                className={`ml-auto h-4 w-4 ${outfitForm.categoryId === String(category.categoryId) ? "opacity-100" : "opacity-0"
                                  }`}
                              />
                            </CommandItem>
                          ))}
                          {canCreateCategoryFromInput && (
                            <CommandItem
                              value={`create-${normalizedCategoryInput}`}
                              onSelect={() => {
                                setShowCreateCategory(true);
                                setCreateCategoryName(normalizedCategoryInput);
                                setCreateCategoryDesc("");
                                setCategoryOpen(false);
                              }}
                            >
                              ➕ Tạo mới: {normalizedCategoryInput}
                            </CommandItem>
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {showCreateCategory && (
                  <div className="mt-2 space-y-2 rounded-md border bg-muted/20 p-3">
                    <div className="space-y-1">
                      <Label htmlFor="create-category-name">Tên danh mục mới</Label>
                      <Input
                        id="create-category-name"
                        value={createCategoryName}
                        onChange={(event) => setCreateCategoryName(event.target.value)}
                        placeholder="Nhập tên danh mục"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="create-category-desc">Mô tả (tùy chọn)</Label>
                      <Textarea
                        id="create-category-desc"
                        rows={2}
                        value={createCategoryDesc}
                        onChange={(event) => setCreateCategoryDesc(event.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" size="sm" onClick={handleCreateCategory} disabled={creatingCategory}>
                        {creatingCategory ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang tạo...
                          </>
                        ) : (
                          "Tạo"
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setShowCreateCategory(false);
                          setCreateCategoryName("");
                          setCreateCategoryDesc("");
                        }}
                        disabled={creatingCategory}
                      >
                        Hủy
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="outfit-name">Tên sản phẩm</Label>
                <Input
                  id="outfit-name"
                  value={outfitForm.name}
                  onChange={(event) => setOutfitForm((prev) => ({ ...prev, name: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="outfit-material">Chất liệu</Label>
                <Popover open={materialOpen} onOpenChange={setMaterialOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      id="outfit-material"
                      type="button"
                      variant="outline"
                      role="combobox"
                      aria-expanded={materialOpen}
                      className="w-full justify-between"
                    >
                      <span className="truncate text-left">
                        {outfitForm.type ||
                          (referenceLoading && materialOptions.length === 0
                            ? "Đang tải chất liệu..."
                            : "Chọn chất liệu")}
                      </span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder="Tìm chất liệu..."
                        value={outfitForm.type}
                        onValueChange={(value: string) =>
                          setOutfitForm((prev) => ({
                            ...prev,
                            type: value,
                          }))
                        }
                        onBlur={() => {
                          const normalized = normalizeTypeValue(outfitForm.type);
                          if (!normalized) return;
                          const matched = materialOptions.find(
                            (item) => normalizeTypeKey(item) === normalizeTypeKey(normalized),
                          );
                          setOutfitForm((prev) => ({
                            ...prev,
                            type: matched ?? normalized,
                          }));
                        }}
                        onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
                          if (event.key !== "Enter") return;
                          event.preventDefault();
                          if (!normalizedMaterialInput) return;
                          const matched = materialOptions.find(
                            (item) => normalizeTypeKey(item) === normalizeTypeKey(normalizedMaterialInput),
                          );
                          setOutfitForm((prev) => ({
                            ...prev,
                            type: matched ?? normalizedMaterialInput,
                          }));
                          setMaterialOpen(false);
                        }}
                      />
                      <CommandList>
                        <CommandEmpty>Không tìm thấy chất liệu.</CommandEmpty>
                        <CommandGroup>
                          {filteredMaterialOptions.map((material) => (
                            <CommandItem
                              key={material}
                              value={material}
                              onSelect={() => {
                                setOutfitForm((prev) => ({ ...prev, type: material }));
                                setMaterialOpen(false);
                              }}
                            >
                              {material}
                              <Check
                                className={`ml-auto h-4 w-4 ${normalizeTypeKey(outfitForm.type) === normalizeTypeKey(material) ? "opacity-100" : "opacity-0"
                                  }`}
                              />
                            </CommandItem>
                          ))}
                          {canUseCustomMaterialFromInput && (
                            <CommandItem
                              value={`custom-material-${normalizedMaterialInput}`}
                              onSelect={() => {
                                setOutfitForm((prev) => ({
                                  ...prev,
                                  type: normalizedMaterialInput,
                                }));
                                setMaterialOpen(false);
                              }}
                            >
                              Dùng: {normalizedMaterialInput}
                            </CommandItem>
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {materialsError && (
                  <p className="text-xs text-amber-600">Không tải được danh sách, bạn có thể nhập thủ công</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="outfit-gender">Giới tính</Label>
                <Select
                  value={outfitForm.gender}
                  onValueChange={(value: string) =>
                    setOutfitForm((prev) => ({ ...prev, gender: toOutfitGender(value) }))
                  }
                >
                  <SelectTrigger id="outfit-gender">
                    <SelectValue placeholder="Chọn giới tính" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Nam</SelectItem>
                    <SelectItem value="Female">Nữ</SelectItem>
                  </SelectContent>
                </Select>
                {wasUnisexGender && (
                  <p className="text-xs text-muted-foreground">(Trước đó: Unisex)</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="outfit-region">Khu vực</Label>
                <Popover open={regionOpen} onOpenChange={setRegionOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      aria-expanded={regionOpen}
                      className="w-full justify-between"
                    >
                      <span className="truncate text-left">{outfitForm.region || "Chọn hoặc tạo Khu vực"}</span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                    <Command>
                      <CommandInput
                        placeholder="Tìm khu vực..."
                        value={regionInput}
                        onValueChange={setRegionInput}
                      />
                      <CommandList>
                        <CommandEmpty>Không tìm thấy khu vực.</CommandEmpty>
                        <CommandGroup>
                          {filteredRegionOptions.map((region) => (
                            <CommandItem
                              key={region}
                              value={region}
                              onSelect={() => {
                                setOutfitForm((prev) => ({ ...prev, region }));
                                setRegionInput("");
                                setRegionOpen(false);
                              }}
                            >
                              {region}
                              <Check
                                className={`ml-auto h-4 w-4 ${normalizeRegionValue(outfitForm.region) === region ? "opacity-100" : "opacity-0"
                                  }`}
                              />
                            </CommandItem>
                          ))}
                          {canCreateRegionFromInput && (
                            <CommandItem
                              value={`create-region-${normalizedRegionInput}`}
                              onSelect={() => {
                                setOutfitForm((prev) => ({ ...prev, region: normalizedRegionInput }));
                                setRegionInput("");
                                setRegionOpen(false);
                              }}
                            >
                              ➕ Tạo mới: {normalizedRegionInput}
                            </CommandItem>
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="outfit-status">Trạng thái</Label>
                <Select
                  value={outfitForm.status}
                  onValueChange={(value: string) =>
                    setOutfitForm((prev) => ({ ...prev, status: toOutfitStatus(value) }))
                  }
                  disabled={referenceLoading || statusOptions.length === 0}
                >
                  <SelectTrigger id="outfit-status">
                    <SelectValue
                      placeholder={
                        referenceLoading ? "Đang tải trạng thái..." : "Chọn trạng thái"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.length > 0 ? (
                      statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem disabled value="__empty-status">
                        Không có dữ liệu trạng thái
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="outfit-price">Giá thuê (VND)</Label>
                <Input
                  id="outfit-price"
                  type="number"
                  min={0}
                  value={outfitForm.baseRentalPrice}
                  onChange={(event) =>
                    setOutfitForm((prev) => ({ ...prev, baseRentalPrice: event.target.value }))
                  }
                />
              </div>
              <div className="flex items-center justify-between rounded-md border px-3 py-2 md:mt-7">
                <Label htmlFor="outfit-limited" className="cursor-pointer">
                  Bản giới hạn
                </Label>
                <Switch
                  id="outfit-limited"
                  checked={outfitForm.isLimited}
                  onCheckedChange={(checked: boolean) =>
                    setOutfitForm((prev) => ({ ...prev, isLimited: checked }))
                  }
                />
              </div>
            </div>
          </form>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOutfitOpen(false)} className="border-gray-200 hover:border-gray-300">
              Hủy
            </Button>
            <Button form="edit-outfit-form" type="submit" disabled={outfitSaving} className="bg-[#c1272d] hover:bg-[#a01f24] text-white">
              {outfitSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                "Lưu thay đổi"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={imageOpen} onOpenChange={handleImageDialogOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingImage ? "Chỉnh sửa ảnh sản phẩm" : "Thêm ảnh sản phẩm"}</DialogTitle>
            <DialogDescription>
              {editingImage
                ? "Tải ảnh mới nếu bạn muốn thay ảnh hiện tại và cập nhật loại ảnh."
                : "Tải ảnh mới cho sản phẩm."}
            </DialogDescription>
          </DialogHeader>

          <form id="edit-image-form" className="space-y-4" onSubmit={saveImage}>
            <div className="space-y-2">
              <Label htmlFor="image-upload">Tải ảnh lên</Label>
              <input
                ref={imageFileInputRef}
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageInputChange}
              />
              <div
                role="button"
                tabIndex={0}
                onClick={triggerImageFilePicker}
                onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    triggerImageFilePicker();
                  }
                }}
                onDragOver={handleImageDragOver}
                onDragLeave={handleImageDragLeave}
                onDrop={handleImageDrop}
                className={`cursor-pointer rounded-lg border-2 border-dashed p-3 transition ${isImageDragOver ? "border-primary bg-primary/5" : "border-muted-foreground/30"}`}
              >
                {currentImagePreview ? (
                  <img
                    src={currentImagePreview}
                    alt="Xem trước ảnh"
                    className="h-44 w-full rounded-md object-cover"
                  />
                ) : (
                  <div className="flex h-40 flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
                    <ImagePlus className="h-6 w-6" />
                    <p>Kéo và thả ảnh vào đây hoặc bấm để chọn ảnh.</p>
                    <p>Hỗ trợ PNG, JPG, JPEG, WEBP (tối đa 3MB).</p>
                  </div>
                )}
              </div>

              {selectedImageFile ? (
                <div className="rounded-md border bg-muted/20 p-3 text-sm">
                  <p className="font-medium break-all">{selectedImageFile.name}</p>
                  <p className="text-muted-foreground">Dung lượng: {formatFileSize(selectedImageFile.size)}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={triggerImageFilePicker}>
                      Đổi ảnh
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={clearSelectedImageFile}>
                      Xóa ảnh đã chọn
                    </Button>
                  </div>
                </div>
              ) : editingImage ? (
                <p className="text-xs text-muted-foreground">Bạn có thể giữ ảnh hiện tại hoặc tải ảnh mới để thay thế.</p>
              ) : null}

              {imageUploadError && <p className="text-xs text-red-600">{imageUploadError}</p>}
              {imageEncoding && <p className="text-xs text-muted-foreground">Đang xử lý ảnh...</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="image-type">Loại ảnh</Label>
              <Select
                value={imageForm.imageType || "Gallery"}
                onValueChange={(value: string) => setImageForm((prev) => ({ ...prev, imageType: value }))}
              >
                <SelectTrigger id="image-type">
                  <SelectValue placeholder="Chọn loại ảnh" />
                </SelectTrigger>
                <SelectContent>
                  {imageTypeOptions.map((value) => (
                    <SelectItem key={value} value={value}>
                      {mapImageTypeLabel(value)}
                    </SelectItem>
                  ))}
                  {imageForm.imageType &&
                    !imageTypeOptions.some((option) => option === imageForm.imageType) ? (
                    <SelectItem value={imageForm.imageType}>{mapImageTypeLabel(imageForm.imageType)}</SelectItem>
                  ) : null}
                </SelectContent>
              </Select>
            </div>
          </form>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => handleImageDialogOpenChange(false)}
              disabled={imageSaving || imageEncoding}
              className="border-gray-200 hover:border-gray-300"
            >
              Hủy
            </Button>
            <Button form="edit-image-form" type="submit" disabled={imageSaving || imageEncoding} className="bg-[#c1272d] hover:bg-[#a01f24] text-white">
              {imageSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang tải ảnh...
                </>
              ) : imageEncoding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Lưu thay đổi"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={sizeOpen} onOpenChange={setSizeOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingSize ? "Chỉnh sửa kích cỡ" : "Thêm kích cỡ"}</DialogTitle>
            <DialogDescription>
              {editingSize
                ? "Cập nhật số lượng tồn kho và thông số kích cỡ."
                : "Nhập thông tin kích cỡ mới cho sản phẩm."}
            </DialogDescription>
          </DialogHeader>

          <form id="edit-size-form" className="space-y-4" onSubmit={saveSize}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="size-label">Kích cỡ</Label>
                <Input
                  id="size-label"
                  value={sizeForm.sizeLabel}
                  onChange={(event) => setSizeForm((prev) => ({ ...prev, sizeLabel: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="size-stock">Số lượng tồn kho</Label>
                <Input
                  id="size-stock"
                  type="number"
                  min={0}
                  value={sizeForm.stockQuantity}
                  onChange={(event) =>
                    setSizeForm((prev) => ({ ...prev, stockQuantity: event.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="size-chest">Ngực tối đa (cm)</Label>
                <Input
                  id="size-chest"
                  type="number"
                  min={0}
                  value={sizeForm.chestMaxCm}
                  onChange={(event) => setSizeForm((prev) => ({ ...prev, chestMaxCm: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="size-waist">Eo tối đa (cm)</Label>
                <Input
                  id="size-waist"
                  type="number"
                  min={0}
                  value={sizeForm.waistMaxCm}
                  onChange={(event) => setSizeForm((prev) => ({ ...prev, waistMaxCm: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="size-hip">Mông tối đa (cm)</Label>
                <Input
                  id="size-hip"
                  type="number"
                  min={0}
                  value={sizeForm.hipMaxCm}
                  onChange={(event) => setSizeForm((prev) => ({ ...prev, hipMaxCm: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="size-status">Trạng thái</Label>
                <Select
                  value={sizeForm.status}
                  onValueChange={(value: string) =>
                    setSizeForm((prev) => ({ ...prev, status: toSizeStatus(value) }))
                  }
                >
                  <SelectTrigger id="size-status">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Đang hoạt động">Đang hoạt động</SelectItem>
                    <SelectItem value="Ngừng hoạt động">Ngừng hoạt động</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSizeOpen(false)} className="border-gray-200 hover:border-gray-300">
              Hủy
            </Button>
            <Button form="edit-size-form" type="submit" disabled={sizeSaving} className="bg-[#c1272d] hover:bg-[#a01f24] text-white">
              {sizeSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                "Lưu thay đổi"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDeleteDialog
        open={deleteImageOpen}
        onOpenChange={handleDeleteImageOpenChange}
        onConfirm={handleConfirmDeleteImage}
        title="Xóa ảnh này?"
        description="Hành động này không thể hoàn tác."
        loading={deletingImage}
      />
    </AdminLayout>
  );
}











