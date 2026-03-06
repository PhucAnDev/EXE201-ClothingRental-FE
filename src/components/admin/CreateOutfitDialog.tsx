import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  createCategory,
  createOutfit,
  getAllCategories,
  getAllOutfitMaterials,
  mapOutfitStatusLabelToApiValue,
  type CategoryDto,
  type CreateCategoryPayload,
  type CreateOutfitPayload,
} from "../../features/outfit/outfitAdminService";

type CreateOutfitDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  regionSuggestions: string[];
  onCreated: (outfitId: number | null) => Promise<void> | void;
};

type CreateOutfitFormState = {
  categoryId: string;
  name: string;
  gender: "Male" | "Female";
  region: string;
  status: "Còn hàng" | "Hết hàng";
  isLimited: boolean;
  baseRentalPrice: string;
};

const INITIAL_FORM_STATE: CreateOutfitFormState = {
  categoryId: "",
  name: "",
  gender: "Male",
  region: "",
  status: "Còn hàng",
  isLimited: false,
  baseRentalPrice: "",
};

const normalizeWhitespace = (value: string): string => value.replace(/\s+/g, " ").trim();
const normalizeCategoryKey = (value: string): string => normalizeWhitespace(value).toLowerCase();
const normalizeMaterialKey = (value: string): string => normalizeWhitespace(value).toLowerCase();
const normalizeRegionValue = (value: string): string => normalizeWhitespace(value).toUpperCase();

const normalizeMaterialValue = (value: string): string => normalizeWhitespace(value);

const getResponseStatus = (error: unknown): number | null => {
  if (typeof error !== "object" || error === null || !("response" in error)) return null;
  const status = (error as { response?: { status?: number } }).response?.status;
  return typeof status === "number" ? status : null;
};

const getFirstErrorMessage = (error: unknown): string | null => {
  if (typeof error !== "object" || error === null || !("response" in error)) return null;

  const responseData = (error as { response?: { data?: unknown } }).response?.data;
  if (typeof responseData !== "object" || responseData === null) return null;

  const message = (responseData as { message?: unknown }).message;
  if (typeof message === "string" && message.trim()) return message;

  const errors = (responseData as { errors?: unknown }).errors;
  if (!errors || typeof errors !== "object") return null;

  const firstMessage = Object.values(errors as Record<string, unknown>)
    .flatMap((value) => (Array.isArray(value) ? value : [value]))
    .find((value) => typeof value === "string" && value.trim());

  return typeof firstMessage === "string" ? firstMessage : null;
};

export function CreateOutfitDialog({
  open,
  onOpenChange,
  regionSuggestions,
  onCreated,
}: CreateOutfitDialogProps) {
  const [form, setForm] = useState<CreateOutfitFormState>(INITIAL_FORM_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [materials, setMaterials] = useState<string[]>([]);
  const [materialValue, setMaterialValue] = useState("");
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [errorMaterials, setErrorMaterials] = useState<string | null>(null);

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [materialOpen, setMaterialOpen] = useState(false);
  const [regionOpen, setRegionOpen] = useState(false);
  const [categoryInput, setCategoryInput] = useState("");
  const [regionInput, setRegionInput] = useState("");

  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [createCategoryName, setCreateCategoryName] = useState("");
  const [createCategoryDesc, setCreateCategoryDesc] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);

  const loadCategories = useCallback(async () => {
    setCategoriesLoading(true);
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      const status = getResponseStatus(error);
      if (status === 401 || status === 403) {
        toast.error("Bạn không có quyền thực hiện");
      } else {
        toast.error("Không thể tải danh mục");
      }
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  const fetchMaterials = useCallback(async () => {
    setLoadingMaterials(true);
    setErrorMaterials(null);
    try {
      const data = await getAllOutfitMaterials();
      setMaterials(data);
      if (data.length === 0) {
        setErrorMaterials("Không tải được danh sách, bạn có thể nhập thủ công");
      }
    } catch {
      setMaterials([]);
      setErrorMaterials("Không tải được danh sách, bạn có thể nhập thủ công");
    } finally {
      setLoadingMaterials(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    setForm(INITIAL_FORM_STATE);
    setCategoryOpen(false);
    setMaterialOpen(false);
    setRegionOpen(false);
    setCategoryInput("");
    setRegionInput("");
    setMaterialValue("");
    setShowCreateCategory(false);
    setCreateCategoryName("");
    setCreateCategoryDesc("");
    setErrorMaterials(null);
    void loadCategories();
    void fetchMaterials();
  }, [open, loadCategories, fetchMaterials]);

  const categoryMap = useMemo(
    () => new Map<number, string>(categories.map((item) => [item.categoryId, item.categoryName])),
    [categories],
  );

  const categoryOptions = useMemo(
    () =>
      [...categories]
        .map((item) => ({
          ...item,
          categoryName: normalizeWhitespace(item.categoryName || ""),
        }))
        .filter((item) => item.categoryId > 0 && item.categoryName.length > 0)
        .sort((a, b) => a.categoryName.localeCompare(b.categoryName, "vi")),
    [categories],
  );

  const selectedCategoryName = useMemo(() => {
    const selectedId = Number(form.categoryId);
    if (!Number.isFinite(selectedId) || selectedId <= 0) return "";
    return categoryMap.get(selectedId) ?? "";
  }, [categoryMap, form.categoryId]);

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

  const materialOptions = useMemo(() => {
    const dedup = new Map<string, string>();
    const push = (rawValue: string) => {
      const value = normalizeMaterialValue(rawValue || "");
      if (!value) return;
      const key = normalizeMaterialKey(value);
      if (key === "string") return;
      if (!dedup.has(key)) {
        dedup.set(key, value);
      }
    };
    materials.forEach((item) => push(item));
    push(materialValue);
    return Array.from(dedup.values()).sort((a, b) => a.localeCompare(b, "vi"));
  }, [materialValue, materials]);

  const filteredMaterialOptions = useMemo(() => {
    const keyword = normalizeMaterialKey(materialValue);
    if (!keyword) return materialOptions;
    return materialOptions.filter((item) => normalizeMaterialKey(item).includes(keyword));
  }, [materialOptions, materialValue]);

  const normalizedMaterialInput = normalizeMaterialValue(materialValue);
  const canUseCustomMaterialFromInput = useMemo(() => {
    if (!normalizedMaterialInput) return false;
    return !materialOptions.some(
      (item) => normalizeMaterialKey(item) === normalizeMaterialKey(normalizedMaterialInput),
    );
  }, [materialOptions, normalizedMaterialInput]);

  const regionOptions = useMemo(() => {
    const dedup = new Set<string>();
    const push = (rawValue: string) => {
      const value = normalizeRegionValue(rawValue || "");
      if (!value) return;
      dedup.add(value);
    };
    regionSuggestions.forEach((item) => push(item));
    push(form.region);
    return Array.from(dedup).sort((a, b) => a.localeCompare(b, "vi"));
  }, [form.region, regionSuggestions]);

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

      let nextCategoryId = Number(created.categoryId);
      if (!Number.isFinite(nextCategoryId) || nextCategoryId <= 0) {
        const matched = latestCategories.find(
          (item) => normalizeCategoryKey(item.categoryName) === normalizeCategoryKey(normalizedName),
        );
        nextCategoryId = Number(matched?.categoryId);
      }

      if (!Number.isFinite(nextCategoryId) || nextCategoryId <= 0) {
        toast.error("Tạo danh mục thành công nhưng chưa lấy được mã danh mục.");
        return;
      }

      setForm((prev) => ({ ...prev, categoryId: String(nextCategoryId) }));
      setCategoryInput("");
      setCreateCategoryName("");
      setCreateCategoryDesc("");
      setShowCreateCategory(false);
      setCategoryOpen(false);
      toast.success("Tạo danh mục thành công.");
    } catch (error) {
      const status = getResponseStatus(error);
      if (status === 401 || status === 403) {
        toast.error("Bạn không có quyền thực hiện");
      } else if (status === 400) {
        toast.error(getFirstErrorMessage(error) ?? "Dữ liệu không hợp lệ");
      } else {
        toast.error("Lỗi hệ thống, thử lại sau");
      }
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    if (creatingCategory || showCreateCategory) {
      toast.error("Vui lòng hoàn tất tạo danh mục mới trước khi tạo sản phẩm.");
      return;
    }

    const categoryId = Number(form.categoryId);
    const name = normalizeWhitespace(form.name);
    const baseRentalPrice = Number(form.baseRentalPrice);
    const normalizedMaterial = normalizeMaterialValue(materialValue);
    const normalizedRegion = normalizeRegionValue(form.region);

    if (!Number.isFinite(categoryId) || categoryId <= 0) {
      toast.error("Vui lòng chọn danh mục.");
      return;
    }
    if (!name) {
      toast.error("Tên sản phẩm không được để trống.");
      return;
    }
    if (!Number.isFinite(baseRentalPrice) || baseRentalPrice <= 0) {
      toast.error("Giá thuê phải lớn hơn 0.");
      return;
    }

    const payload: CreateOutfitPayload = {
      categoryId,
      name,
      type: normalizedMaterial || null,
      gender: form.gender,
      region: normalizedRegion || null,
      isLimited: form.isLimited,
      status: mapOutfitStatusLabelToApiValue(form.status),
      baseRentalPrice,
    };

    setSubmitting(true);
    try {
      const created = await createOutfit(payload);
      toast.success("Tạo sản phẩm thành công");
      onOpenChange(false);
      await onCreated(created.outfitId);
    } catch (error) {
      const status = getResponseStatus(error);
      if (status === 401 || status === 403) {
        toast.error("Bạn không có quyền thực hiện");
      } else if (status === 400) {
        toast.error(getFirstErrorMessage(error) ?? "Dữ liệu không hợp lệ");
      } else {
        toast.error("Lỗi hệ thống, thử lại sau");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (submitting || creatingCategory) return;
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Tạo sản phẩm</DialogTitle>
          <DialogDescription>Tạo sản phẩm mới để thêm ảnh và kích cỡ sau đó.</DialogDescription>
        </DialogHeader>

        <form id="create-outfit-form" className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="create-outfit-category">Danh mục</Label>
              <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="create-outfit-category"
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={categoryOpen}
                    className="w-full justify-between"
                    disabled={categoriesLoading && categoryOptions.length === 0 && !showCreateCategory}
                  >
                    <span className="truncate text-left">
                      {selectedCategoryName ||
                        (categoriesLoading ? "Đang tải danh mục..." : "Chọn danh mục")}
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
                              setForm((prev) => ({
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
                              className={`ml-auto h-4 w-4 ${form.categoryId === String(category.categoryId) ? "opacity-100" : "opacity-0"
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
                    <Label htmlFor="new-category-name">Tên danh mục mới</Label>
                    <Input
                      id="new-category-name"
                      value={createCategoryName}
                      onChange={(event) => setCreateCategoryName(event.target.value)}
                      placeholder="Nhập tên danh mục"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="new-category-description">Mô tả (tùy chọn)</Label>
                    <Textarea
                      id="new-category-description"
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
              <Label htmlFor="create-outfit-name">Tên sản phẩm</Label>
              <Input
                id="create-outfit-name"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Nhập tên sản phẩm"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-outfit-material">Chất liệu</Label>
              <Popover open={materialOpen} onOpenChange={setMaterialOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="create-outfit-material"
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={materialOpen}
                    className="w-full justify-between"
                  >
                    <span className="truncate text-left">
                      {materialValue || (loadingMaterials ? "Đang tải chất liệu..." : "Chọn chất liệu")}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Tìm chất liệu..."
                      value={materialValue}
                      onValueChange={setMaterialValue}
                      onBlur={() => {
                        const normalized = normalizeMaterialValue(materialValue);
                        if (!normalized) return;
                        const matched = materialOptions.find(
                          (item) => normalizeMaterialKey(item) === normalizeMaterialKey(normalized),
                        );
                        setMaterialValue(matched ?? normalized);
                      }}
                      onKeyDown={(event) => {
                        if (event.key !== "Enter") return;
                        event.preventDefault();
                        if (!normalizedMaterialInput) return;
                        const matched = materialOptions.find(
                          (item) =>
                            normalizeMaterialKey(item) === normalizeMaterialKey(normalizedMaterialInput),
                        );
                        setMaterialValue(matched ?? normalizedMaterialInput);
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
                              setMaterialValue(material);
                              setMaterialOpen(false);
                            }}
                          >
                            {material}
                            <Check
                              className={`ml-auto h-4 w-4 ${normalizeMaterialKey(materialValue) === normalizeMaterialKey(material) ? "opacity-100" : "opacity-0"
                                }`}
                            />
                          </CommandItem>
                        ))}
                        {canUseCustomMaterialFromInput && (
                          <CommandItem
                            value={`custom-material-${normalizedMaterialInput}`}
                            onSelect={() => {
                              setMaterialValue(normalizedMaterialInput);
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
              {errorMaterials && (
                <p className="text-xs text-amber-600">Không tải được danh sách, bạn có thể nhập thủ công</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-outfit-gender">Giới tính</Label>
              <Select
                value={form.gender}
                onValueChange={(value) => setForm((prev) => ({ ...prev, gender: value as "Male" | "Female" }))}
              >
                <SelectTrigger id="create-outfit-gender">
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Nam</SelectItem>
                  <SelectItem value="Female">Nữ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-outfit-region">Khu vực</Label>
              <Popover open={regionOpen} onOpenChange={setRegionOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="create-outfit-region"
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={regionOpen}
                    className="w-full justify-between"
                  >
                    <span className="truncate text-left">{form.region || "Chọn hoặc tạo khu vực"}</span>
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
                              setForm((prev) => ({ ...prev, region }));
                              setRegionInput("");
                              setRegionOpen(false);
                            }}
                          >
                            {region}
                            <Check
                              className={`ml-auto h-4 w-4 ${normalizeRegionValue(form.region) === region ? "opacity-100" : "opacity-0"
                                }`}
                            />
                          </CommandItem>
                        ))}
                        {canCreateRegionFromInput && (
                          <CommandItem
                            value={`create-region-${normalizedRegionInput}`}
                            onSelect={() => {
                              setForm((prev) => ({ ...prev, region: normalizedRegionInput }));
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
              <Label htmlFor="create-outfit-status">Trạng thái</Label>
              <Select
                value={form.status}
                onValueChange={(value) => setForm((prev) => ({ ...prev, status: value as "Còn hàng" | "Hết hàng" }))}
              >
                <SelectTrigger id="create-outfit-status">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Còn hàng">Còn hàng</SelectItem>
                  <SelectItem value="Hết hàng">Hết hàng</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-outfit-price">Giá thuê (VND)</Label>
              <Input
                id="create-outfit-price"
                type="number"
                min={1}
                value={form.baseRentalPrice}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, baseRentalPrice: event.target.value }))
                }
                placeholder="Ví dụ: 199000"
                required
              />
            </div>

            <div className="flex items-center justify-between rounded-md border px-3 py-2 md:mt-7">
              <Label htmlFor="create-outfit-limited" className="cursor-pointer">
                Bản giới hạn
              </Label>
              <Switch
                id="create-outfit-limited"
                checked={form.isLimited}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, isLimited: checked }))}
              />
            </div>
          </div>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting || creatingCategory}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            form="create-outfit-form"
            disabled={submitting || creatingCategory}
            className="bg-gradient-to-r from-[#c1272d] to-[#d4af37] text-white hover:from-[#b11f25] hover:to-[#c39d2f]"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang tạo...
              </>
            ) : (
              "Tạo sản phẩm"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
