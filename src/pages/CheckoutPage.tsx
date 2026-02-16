import { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Checkbox } from "../components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Plus, X } from "lucide-react";
import {
  getOutfitImages,
  getOutfitSizes,
  getOutfits,
  type OutfitImageItem,
  type OutfitSizeItem,
} from "../features/outfit/outfitService";
import {
  createUserAddress,
  getUserAddresses,
  setUserAddressDefault,
  type UserAddressItem,
} from "../features/address/addressService";
import {
  getServicePackages,
  type ServicePackageItem,
} from "../features/servicePackage/servicePackageService";
import {
  createBooking,
  type BookingResponse,
  type CreateBookingItemPayload,
} from "../features/booking/bookingService";

const ORDER_DEPOSIT_RATE = 0.3;

const normalizeValue = (value) => String(value ?? "").toLowerCase();

const isAvailableStatus = (status) => {
  const normalized = normalizeValue(status);
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

const normalizeOutfitSizes = (sizes: OutfitSizeItem[] = []) => {
  const normalized = sizes
    .map((size) => ({
      sizeId: Number(size?.sizeId ?? 0),
      size: size?.sizeLabel || "",
      stock: Number(size?.stockQuantity ?? 0),
    }))
    .filter((size) => Boolean(size.size));

  if (normalized.length > 0) {
    return normalized;
  }

  return [{ sizeId: 0, size: "M", stock: 1 }];
};

type SavedAddress = {
  id: number;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  district: string;
  ward: string;
  isDefault: boolean;
};

const normalizeIsDefault = (value: UserAddressItem["isDefault"]) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "true" || normalized === "1";
  }
  return false;
};

const toPositiveNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const normalizePrefillOutfit = (outfit) => {
  if (!outfit || typeof outfit !== "object") return null;
  const parsedId = Number(outfit.id);
  if (!Number.isFinite(parsedId)) return null;

  const normalizedSizes = Array.isArray(outfit.sizes)
    ? outfit.sizes
        .map((size) => ({
          sizeId: Number(size?.sizeId ?? 0),
          size: size?.size || size?.sizeLabel || "",
          stock: Number(size?.stock ?? size?.quantity ?? 0),
        }))
        .filter((size) => Boolean(size.size))
    : [];

  return {
    id: parsedId,
    name: outfit.name || "Trang phục",
    category: outfit.category || "Trang phục",
    price: toPositiveNumber(outfit.price, 0),
    image: outfit.image || "",
    sizes: normalizedSizes,
    selectedSize: outfit.selectedSize || normalizedSizes[0]?.size || "M",
  };
};

export function CheckoutPage() {
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const [searchParams] = useSearchParams();
  const packageId = searchParams.get("package");
  const checkoutPrefill = routeLocation.state?.checkoutPrefill;

  // Service Type - can select both
  const [includeRental, setIncludeRental] = useState(!packageId);
  const [includePhotoshoot, setIncludePhotoshoot] = useState(false);
  const [servicePackages, setServicePackages] = useState<ServicePackageItem[]>(
    [],
  );
  const [servicePackagesLoading, setServicePackagesLoading] = useState(false);
  const [servicePackagesError, setServicePackagesError] = useState("");
  const [selectedServicePackageIds, setSelectedServicePackageIds] = useState<
    number[]
  >([]);

  // Rental states - now includes size
  const [rentalDays, setRentalDays] = useState(1);
  const [selectedOutfits, setSelectedOutfits] = useState([]); // Array of outfits with selected size
  const [availableOutfits, setAvailableOutfits] = useState([]);
  const [outfitsLoading, setOutfitsLoading] = useState(false);
  const [outfitsError, setOutfitsError] = useState("");

  // Common states
  const [paymentMethod, setPaymentMethod] = useState("coc");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");

  // Payment dialog state
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  // Outfit selection dialog state
  const [showOutfitDialog, setShowOutfitDialog] = useState(false);

  // Outfit detail dialog state
  const [showOutfitDetailDialog, setShowOutfitDetailDialog] = useState(false);
  const [selectedOutfitDetail, setSelectedOutfitDetail] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null); // For size selection in detail dialog
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [settingDefaultAddressId, setSettingDefaultAddressId] = useState<
    number | null
  >(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<BookingResponse | null>(
    null,
  );

  const selectedServicePackages = servicePackages.filter((pkg) =>
    selectedServicePackageIds.includes(Number(pkg.servicePkgId ?? 0)),
  );

  const hasSelectedServicePackages =
    includePhotoshoot && selectedServicePackages.length > 0;

  const calculatePhotoshootTotal = () =>
    selectedServicePackages.reduce(
      (total, pkg) => total + toPositiveNumber(pkg.basePrice, 0),
      0,
    );

  const handleToggleServicePackage = (
    servicePkgId: number,
    checked: boolean | "indeterminate",
  ) => {
    const isChecked = checked === true;
    setSelectedServicePackageIds((prev) => {
      if (isChecked) {
        if (prev.includes(servicePkgId)) return prev;
        return [...prev, servicePkgId];
      }
      return prev.filter((id) => id !== servicePkgId);
    });
  };

  const getDefaultSize = (sizes = []) => {
    const inStockSize = sizes.find((size) => Number(size?.stock ?? 0) > 0);
    return inStockSize?.size || sizes[0]?.size || "M";
  };

  // Add outfit to selected list WITH SIZE
  const handleAddOutfitWithSize = (outfit, size) => {
    setSelectedOutfits((prev) => {
      if (prev.find((o) => o.id === outfit.id)) {
        return prev;
      }

      return [
        ...prev,
        { ...outfit, selectedSize: size || getDefaultSize(outfit.sizes) },
      ];
    });
    setShowOutfitDetailDialog(false);
    setShowOutfitDialog(false);
    setSelectedSize(null); // Reset size selection
  };

  // Remove outfit from selected list
  const handleRemoveOutfit = (outfitId) => {
    if (selectedOutfits.length > 1) {
      setSelectedOutfits(selectedOutfits.filter((o) => o.id !== outfitId));
    }
  };

  // Calculate total rental price for all outfits
  const calculateTotalRentalPrice = () => {
    return selectedOutfits.reduce(
      (total, outfit) => total + toPositiveNumber(outfit.price, 0) * rentalDays,
      0,
    );
  };

  const rentalTotal = includeRental ? calculateTotalRentalPrice() : 0;

  const photoshootTotal = hasSelectedServicePackages
    ? calculatePhotoshootTotal()
    : 0;

  const combinedTotal = rentalTotal + photoshootTotal;
  const combinedDeposit = Math.round(combinedTotal * ORDER_DEPOSIT_RATE);
  const bookingRentalTotal = toPositiveNumber(
    createdBooking?.totalRentalAmount,
    rentalTotal,
  );
  const bookingServiceTotal = toPositiveNumber(
    createdBooking?.totalServiceAmount,
    photoshootTotal,
  );
  const bookingDepositTotal = toPositiveNumber(
    createdBooking?.totalDepositAmount,
    combinedDeposit,
  );
  const bookingOrderTotal = toPositiveNumber(
    createdBooking?.totalOrderAmount,
    combinedTotal,
  );

  const resolveOutfitSizeId = (outfit) => {
    const selectedLabel = normalizeValue(outfit?.selectedSize);
    const ownSizes = Array.isArray(outfit?.sizes) ? outfit.sizes : [];
    const matchedOwnSize = ownSizes.find(
      (size) => normalizeValue(size?.size) === selectedLabel,
    );

    const ownSizeId = Number(matchedOwnSize?.sizeId ?? 0);
    if (Number.isFinite(ownSizeId) && ownSizeId > 0) {
      return ownSizeId;
    }

    const sourceOutfit = availableOutfits.find(
      (item) => Number(item?.id) === Number(outfit?.id),
    );
    const sourceSizes = Array.isArray(sourceOutfit?.sizes)
      ? sourceOutfit.sizes
      : [];
    const matchedSourceSize = sourceSizes.find(
      (size) => normalizeValue(size?.size) === selectedLabel,
    );
    const sourceSizeId = Number(matchedSourceSize?.sizeId ?? 0);

    if (Number.isFinite(sourceSizeId) && sourceSizeId > 0) {
      return sourceSizeId;
    }

    return 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!includeRental && !hasSelectedServicePackages) {
      alert("Vui lòng chọn ít nhất một dịch vụ");
      return;
    }

    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (!token) {
      alert("Vui lòng đăng nhập để tạo đơn hàng.");
      return;
    }

    if (!selectedAddressId) {
      alert("Vui lòng chọn địa chỉ trước khi xác nhận đặt hàng.");
      return;
    }

    const bookingItems: CreateBookingItemPayload[] = includeRental
      ? selectedOutfits.map((outfit) => ({
          outfitSizeId: resolveOutfitSizeId(outfit),
        }))
      : [];

    if (includeRental && bookingItems.length === 0) {
      alert("Vui lòng chọn ít nhất một trang phục.");
      return;
    }

    if (bookingItems.some((item) => item.outfitSizeId <= 0)) {
      alert("Không xác định được size trang phục. Vui lòng chọn lại size.");
      return;
    }

    const payload = {
      addressId: selectedAddressId,
      rentalDays: Math.max(1, Number(rentalDays) || 1),
      items: bookingItems,
      servicePackageIds: hasSelectedServicePackages
        ? selectedServicePackageIds
        : [],
    };

    setIsCreatingOrder(true);

    try {
      const created = await createBooking(payload, token);
      setCreatedBooking(created);
      setShowPaymentDialog(true);
    } catch (error) {
      console.error("Failed to create booking:", error);
      const message =
        error?.response?.data?.message ||
        "Không thể tạo đơn hàng. Vui lòng thử lại.";
      alert(message);
    } finally {
      setIsCreatingOrder(false);
    }
  };

  const handleConfirmPayment = () => {
    const orderData = {
      fullName,
      phone,
      email: "",
      includeRental,
      includePhotoshoot: hasSelectedServicePackages,
      selectedOutfits,
      rentalTotal: bookingRentalTotal,
      rentalDeposit: bookingDepositTotal,
      rentalDate: new Date().toLocaleDateString("sv-SE"),
      photoshootTotal: bookingServiceTotal,
      photoshootDeposit: 0,
      photoshootDate: "",
      photoshootTime: "",
      packageName: selectedServicePackages
        .map((pkg) => pkg?.name)
        .filter(Boolean)
        .join(", "),
      paymentMethod,
      combinedTotal: bookingOrderTotal,
      combinedDeposit: bookingDepositTotal,
      address,
      city,
      district,
      ward,
    };

    localStorage.setItem("lastOrder", JSON.stringify(orderData));
    setShowPaymentDialog(false);
    navigate("/payment-success");
  };

  useEffect(() => {
    let isMounted = true;

    const fetchAvailableOutfits = async () => {
      setOutfitsLoading(true);
      setOutfitsError("");

      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("authToken")
            : null;
        const outfitRes = await getOutfits(token);
        const outfitList = Array.isArray(outfitRes?.data) ? outfitRes.data : [];

        const mappedOutfits = await Promise.all(
          outfitList.map(async (outfit) => {
            const parsedOutfitId = Number(outfit?.outfitId);
            if (!Number.isFinite(parsedOutfitId)) return null;
            if (!isAvailableStatus(outfit?.status)) return null;

            const [imageRes, sizeRes] = await Promise.all([
              getOutfitImages(parsedOutfitId, token).catch(() => ({
                data: [],
              })),
              getOutfitSizes(parsedOutfitId, token).catch(() => ({ data: [] })),
            ]);

            const images = Array.isArray(imageRes?.data) ? imageRes.data : [];
            const sizes = Array.isArray(sizeRes?.data) ? sizeRes.data : [];

            return {
              id: parsedOutfitId,
              name: outfit?.name || "Trang phuc",
              category: outfit?.type || outfit?.categoryName || "Trang phuc",
              price: toPositiveNumber(outfit?.baseRentalPrice, 0),
              image:
                selectPrimaryImage(images) || outfit?.primaryImageUrl || "",
              sizes: normalizeOutfitSizes(sizes),
              description: outfit?.description || "",
            };
          }),
        );

        if (!isMounted) return;
        const validOutfits = mappedOutfits.filter(Boolean);
        setAvailableOutfits(validOutfits);
      } catch (error) {
        if (!isMounted) return;
        setAvailableOutfits([]);
        setOutfitsError("Không thể tải danh sách trang phục.");
      } finally {
        if (isMounted) {
          setOutfitsLoading(false);
        }
      }
    };

    fetchAvailableOutfits();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchServicePackageList = async () => {
      setServicePackagesLoading(true);
      setServicePackagesError("");

      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("authToken")
            : null;
        const response = await getServicePackages(token);
        const packages = Array.isArray(response?.data) ? response.data : [];
        const normalizedPackages = packages
          .map((pkg, index) => ({
            ...pkg,
            servicePkgId: Number(pkg?.servicePkgId ?? index + 1),
            basePrice: toPositiveNumber(pkg?.basePrice, 0),
          }))
          .filter(
            (pkg) => Number.isFinite(pkg.servicePkgId) && pkg.servicePkgId > 0,
          );

        if (!isMounted) return;
        setServicePackages(normalizedPackages);
      } catch (error) {
        if (!isMounted) return;
        setServicePackages([]);
        setServicePackagesError("Không thể tải danh sách gói dịch vụ.");
      } finally {
        if (isMounted) {
          setServicePackagesLoading(false);
        }
      }
    };

    fetchServicePackageList();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!packageId) return;
    const parsedPackageId = Number(packageId);
    if (!Number.isFinite(parsedPackageId)) return;
    const exists = servicePackages.some(
      (pkg) => Number(pkg.servicePkgId) === parsedPackageId,
    );
    if (!exists) return;

    setIncludePhotoshoot(true);
    setSelectedServicePackageIds((prev) =>
      prev.includes(parsedPackageId) ? prev : [...prev, parsedPackageId],
    );
  }, [packageId, servicePackages]);

  const mapApiAddressesToSavedAddresses = (
    apiAddresses: UserAddressItem[] = [],
  ) =>
    apiAddresses.map((item, index) => ({
      id: Number(item?.addressId ?? index + 1),
      fullName: item?.recipientName ?? "",
      phone: item?.phoneNumber ?? "",
      addressLine: item?.addressLine ?? "",
      city: item?.city ?? "",
      district: item?.district ?? "",
      ward: item?.ward ?? "",
      isDefault: normalizeIsDefault(item?.isDefault),
    }));

  const applyAddressToCustomerInfo = (selectedAddress: SavedAddress) => {
    setFullName(selectedAddress.fullName);
    setPhone(selectedAddress.phone);
    setAddress(selectedAddress.addressLine);
    setCity(selectedAddress.city);
    setDistrict(selectedAddress.district);
    setWard(selectedAddress.ward);
    setSelectedAddressId(selectedAddress.id);
  };

  const refreshSavedAddresses = async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    if (!token) {
      setSavedAddresses([]);
      return;
    }

    try {
      const response = await getUserAddresses(token);
      const apiAddresses = Array.isArray(response?.data) ? response.data : [];
      const mappedAddresses = mapApiAddressesToSavedAddresses(apiAddresses);

      setSavedAddresses(mappedAddresses);

      const defaultAddress = mappedAddresses.find((item) => item.isDefault);
      if (defaultAddress) {
        applyAddressToCustomerInfo(defaultAddress);
      } else if (mappedAddresses.length > 0 && !selectedAddressId) {
        applyAddressToCustomerInfo(mappedAddresses[0]);
      } else if (mappedAddresses.length === 0) {
        setSelectedAddressId(null);
      }
    } catch (error) {
      setSavedAddresses([]);
      setSelectedAddressId(null);
      console.error("Failed to fetch user addresses:", error);
    }
  };

  useEffect(() => {
    void refreshSavedAddresses();
  }, []);

  useEffect(() => {
    if (!checkoutPrefill) return;
    const normalizedOutfit = normalizePrefillOutfit(checkoutPrefill.outfit);
    if (!normalizedOutfit) return;

    setIncludeRental(true);
    if (!packageId) {
      setIncludePhotoshoot(false);
    }
    setSelectedOutfits([normalizedOutfit]);
    setRentalDays(toPositiveNumber(checkoutPrefill.rentalDays, 1));
  }, [checkoutPrefill, packageId]);

  useEffect(() => {
    if (checkoutPrefill) return;
    if (selectedOutfits.length > 0) return;
    if (availableOutfits.length === 0) return;

    const firstOutfit = availableOutfits[0];
    setSelectedOutfits([
      {
        ...firstOutfit,
        selectedSize: getDefaultSize(firstOutfit.sizes),
      },
    ]);
  }, [availableOutfits, checkoutPrefill, selectedOutfits.length]);

  // Reset size when opening detail dialog
  useEffect(() => {
    if (showOutfitDetailDialog) {
      setSelectedSize(null);
    }
  }, [showOutfitDetailDialog]);

  const handleSelectAddress = async (selectedAddress: SavedAddress) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    if (!token) {
      alert("Vui lòng đăng nhập để chọn địa chỉ mặc định.");
      return;
    }

    setSettingDefaultAddressId(selectedAddress.id);

    try {
      await setUserAddressDefault(selectedAddress.id, token);
      await refreshSavedAddresses();
      setShowAddressDialog(false);
    } catch (error) {
      console.error("Failed to set default address:", error);
      alert("Không thể đặt địa chỉ mặc định. Vui lòng thử lại.");
    } finally {
      setSettingDefaultAddressId(null);
    }
  };

  const handleSaveNewAddress = async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

    if (!token) {
      alert("Vui lòng đăng nhập để lưu địa chỉ.");
      return;
    }

    const recipientName = fullName.trim();
    const phoneNumber = phone.trim();
    const addressLine = address.trim();
    const cityValue = city.trim();
    const districtValue = district.trim();
    const wardValue = ward.trim();

    if (
      !recipientName ||
      !phoneNumber ||
      !addressLine ||
      !cityValue ||
      !districtValue ||
      !wardValue
    ) {
      alert("Vui lòng nhập đầy đủ thông tin địa chỉ mới.");
      return;
    }

    setIsSavingAddress(true);

    try {
      await createUserAddress(
        {
          label: "Địa chỉ mặc định",
          recipientName,
          phoneNumber,
          addressLine,
          ward: wardValue,
          district: districtValue,
          city: cityValue,
          isDefault: true,
        },
        token,
      );

      await refreshSavedAddresses();
      setShowAddressDialog(false);
    } catch (error) {
      console.error("Failed to create address:", error);
      alert("Không thể lưu địa chỉ. Vui lòng thử lại.");
    } finally {
      setIsSavingAddress(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1675389017197-9ae63c2b2fe8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWV0bmFtZXNlJTIwYW8lMjBkYWklMjB0cmFkaXRpb25hbCUyMGRyZXNzfGVufDF8fHx8MTc2MTgwNjA4Nnww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Thanh toán trang phục truyền thống"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h1 className="text-5xl text-white mb-4">Thanh Toán</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Hoàn tất đơn hàng của bạn để trải nghiệm vẻ đẹp truyền thống Việt
            Nam
          </p>
        </div>
      </section>

      <div className="bg-gray-50 py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column - Order Summary */}
              <div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sticky top-24">
                  <h2 className="text-red-600 mb-6">Tóm Tắt Đơn Hàng</h2>

                  {/* Rental Section */}
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <Checkbox
                        id="includeRental"
                        checked={includeRental}
                        onCheckedChange={(checked) => setIncludeRental(checked)}
                      />
                      <Label
                        htmlFor="includeRental"
                        className="text-gray-900 cursor-pointer"
                      >
                        Thuê Trang Phục
                      </Label>
                    </div>

                    {includeRental && (
                      <div className="ml-7 space-y-4">
                        {/* Selected Outfits List WITH SIZE */}
                        <div className="space-y-3">
                          {selectedOutfits.length === 0 && (
                            <p className="text-sm text-gray-500">
                              Chưa có trang phục nào trong đơn thuê.
                            </p>
                          )}
                          {selectedOutfits.map((outfit) => (
                            <div
                              key={outfit.id}
                              className="flex gap-4 pb-3 border-b border-gray-100"
                            >
                              <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                <ImageWithFallback
                                  src={outfit.image}
                                  alt={outfit.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-gray-900 mb-1">
                                  {outfit.name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {outfit.category}
                                </p>
                                <p className="text-sm text-red-600 mt-1">
                                  {outfit.price.toLocaleString("vi-VN")} ₫
                                </p>
                                {/* SHOW SIZE HERE */}
                                <p className="text-sm text-gray-700 mt-1">
                                  <span className="font-medium">Size:</span>{" "}
                                  {outfit.selectedSize}
                                </p>
                              </div>
                              {selectedOutfits.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveOutfit(outfit.id)}
                                  className="text-gray-400 hover:text-red-600 transition-colors"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          ))}

                          {/* Add Outfit Button */}
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full border-dashed border-2 border-gray-300 text-gray-600 hover:border-red-400 hover:text-red-600 hover:bg-red-50"
                            onClick={() => setShowOutfitDialog(true)}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Thêm Trang Phục
                          </Button>
                        </div>

                        {/* Rental Days Selection */}
                        <div>
                          <Label className="text-gray-700 mb-2 block text-sm">
                            Chọn Số Ngày Thuê
                          </Label>
                          <Input
                            type="number"
                            min={1}
                            step={1}
                            value={rentalDays}
                            onChange={(e) =>
                              setRentalDays(
                                Math.max(1, Number(e.target.value) || 1),
                              )
                            }
                            className="border-gray-300"
                          />
                        </div>

                        {/* Rental Price */}
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Chi phí thuê:</span>
                            <span className="text-gray-900">
                              {rentalTotal.toLocaleString("vi-VN")} ₫
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Service Package Section */}
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <Checkbox
                        id="includePhotoshoot"
                        checked={includePhotoshoot}
                        onCheckedChange={(checked) =>
                          setIncludePhotoshoot(checked === true)
                        }
                      />
                      <Label
                        htmlFor="includePhotoshoot"
                        className="text-gray-900 cursor-pointer"
                      >
                        Dịch Vụ Kèm Theo
                      </Label>
                    </div>

                    {includePhotoshoot && (
                      <div className="ml-7 space-y-4">
                        <p className="text-sm text-gray-600">
                          Chọn gói dịch vụ bạn muốn sử dụng.
                        </p>

                        {servicePackagesLoading && (
                          <p className="text-sm text-gray-500">
                            Đang tải danh sách gói dịch vụ...
                          </p>
                        )}

                        {servicePackagesError && (
                          <p className="text-sm text-red-600">
                            {servicePackagesError}
                          </p>
                        )}

                        {!servicePackagesLoading && !servicePackagesError && (
                          <div className="space-y-3">
                            {servicePackages.length === 0 && (
                              <p className="text-sm text-gray-500">
                                Hiện chưa có gói dịch vụ nào.
                              </p>
                            )}

                            {servicePackages.map((pkg) => {
                              const packageId = Number(pkg.servicePkgId ?? 0);
                              const isSelected =
                                selectedServicePackageIds.includes(packageId);
                              return (
                                <label
                                  key={packageId}
                                  className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                                    isSelected
                                      ? "border-red-400 bg-red-50"
                                      : "border-gray-200 hover:border-red-300"
                                  }`}
                                >
                                  <Checkbox
                                    checked={isSelected}
                                    onCheckedChange={(checked) =>
                                      handleToggleServicePackage(
                                        packageId,
                                        checked,
                                      )
                                    }
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between gap-4">
                                      <p className="text-gray-900">
                                        {pkg.name || "Gói dịch vụ"}
                                      </p>
                                      <p className="text-red-600">
                                        {toPositiveNumber(
                                          pkg.basePrice,
                                          0,
                                        ).toLocaleString("vi-VN")}{" "}
                                        ₫
                                      </p>
                                    </div>
                                    {pkg.description && (
                                      <p className="text-sm text-gray-600 mt-1">
                                        {pkg.description}
                                      </p>
                                    )}
                                    {pkg.studioName && (
                                      <p className="text-xs text-gray-500 mt-1">
                                        Studio: {pkg.studioName}
                                      </p>
                                    )}
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        )}

                        {/* Photoshoot Price */}
                        <div className="space-y-2 text-sm pt-3 border-t border-gray-100">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">
                              Chi phí dịch vụ:
                            </span>
                            <span className="text-gray-900">
                              {photoshootTotal.toLocaleString("vi-VN")} ₫
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Total to Pay */}
                  <div className="space-y-3">
                    {(includeRental || hasSelectedServicePackages) && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-900">Tổng Chi Phí:</span>
                          <span className="text-gray-900">
                            {combinedTotal.toLocaleString("vi-VN")} ₫
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-900">Tổng Cọc (30%):</span>
                          <span className="text-red-600">
                            {combinedDeposit.toLocaleString("vi-VN")} ₫
                          </span>
                        </div>
                        <div className="h-px bg-gray-200 my-3"></div>
                      </>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-gray-900">Tổng Thanh Toán:</span>
                      <span className="text-red-600 text-2xl">
                        {paymentMethod === "coc"
                          ? combinedDeposit.toLocaleString("vi-VN")
                          : combinedTotal.toLocaleString("vi-VN")}{" "}
                        ₫
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 text-right">
                      {paymentMethod === "coc"
                        ? "(Thanh toán cọc)"
                        : "(Thanh toán toàn bộ)"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column - Customer Information (unchanged, keeping original) */}
              <div className="space-y-6">
                {/* Combined Customer Info & Rental Info */}
                {includeRental && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-red-600">Thông Tin Khách Hàng</h2>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                        onClick={() => setShowAddressDialog(true)}
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Thông tin của bạn
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label
                          htmlFor="fullName"
                          className="text-gray-700 mb-2 block"
                        >
                          Họ và Tên
                        </Label>
                        <Input
                          id="fullName"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          className="border-gray-300"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="phone"
                          className="text-gray-700 mb-2 block"
                        >
                          Số Điện Thoại
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                          className="border-gray-300"
                        />
                      </div>

                      <div className="pt-4 border-t border-gray-200">
                        <h3 className="text-red-600 mb-4">Thông Tin Thuê Đồ</h3>

                        <div className="space-y-4">
                          <div>
                            <Label
                              htmlFor="address"
                              className="text-gray-700 mb-2 block"
                            >
                              Địa chỉ cụ thể
                            </Label>
                            <Textarea
                              id="address"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              placeholder="Số nhà, tên đường..."
                              required
                              rows={3}
                              className="border-gray-300"
                            />
                          </div>

                          <div>
                            <Label
                              htmlFor="city"
                              className="text-gray-700 mb-2 block"
                            >
                              Tỉnh/Thành phố
                            </Label>
                            <Input
                              id="city"
                              type="text"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                              placeholder="TP. Hồ Chí Minh"
                              required
                              className="border-gray-300"
                            />
                          </div>

                          <div>
                            <Label
                              htmlFor="district"
                              className="text-gray-700 mb-2 block"
                            >
                              Quận/Huyện
                            </Label>
                            <Input
                              id="district"
                              type="text"
                              value={district}
                              onChange={(e) => setDistrict(e.target.value)}
                              placeholder="Quận 1"
                              required
                              className="border-gray-300"
                            />
                          </div>

                          <div>
                            <Label
                              htmlFor="ward"
                              className="text-gray-700 mb-2 block"
                            >
                              Phường/Xã
                            </Label>
                            <Input
                              id="ward"
                              type="text"
                              value={ward}
                              onChange={(e) => setWard(e.target.value)}
                              placeholder="Phường Bến Nghé"
                              required
                              className="border-gray-300"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Customer Info Only (when no rental) */}
                {!includeRental && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-red-600">Thông Tin Khách Hàng</h2>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                        onClick={() => setShowAddressDialog(true)}
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Thông tin của bạn
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label
                          htmlFor="fullName"
                          className="text-gray-700 mb-2 block"
                        >
                          Họ và Tên
                        </Label>
                        <Input
                          id="fullName"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          className="border-gray-300"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="phone"
                          className="text-gray-700 mb-2 block"
                        >
                          Số Điện Thoại
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                          className="border-gray-300"
                        />
                      </div>
                    </div>
                  </div>
                )}
                {/* Payment Method */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                  <h2 className="text-red-600 mb-6">Phương Thức Thanh Toán</h2>

                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                  >
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <RadioGroupItem value="coc" id="coc" className="mt-1" />
                        <div className="flex-1">
                          <Label
                            htmlFor="coc"
                            className="text-gray-900 cursor-pointer block mb-1"
                          >
                            Thanh toán cọc
                          </Label>
                          <p className="text-sm text-gray-600">
                            Đặt cọc {combinedDeposit.toLocaleString("vi-VN")} ₫,
                            thanh toán phần còn lại sau
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <RadioGroupItem
                          value="full"
                          id="full"
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor="full"
                            className="text-gray-900 cursor-pointer block mb-1"
                          >
                            Thanh toán toàn bộ
                          </Label>
                          <p className="text-sm text-gray-600">
                            Thanh toán ngay{" "}
                            {combinedTotal.toLocaleString("vi-VN")}{" "}
                            ₫
                          </p>
                        </div>
                      </div>
                    </div>
                  </RadioGroup>

                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      💳 Thanh toán khi nhận dịch vụ
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      {hasSelectedServicePackages &&
                        "Đổi lịch chụp 1 lần miễn phí nếu báo trước 24h. "}
                      Vui lòng chuẩn bị đúng số tiền
                    </p>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-red-600 hover:bg-red-700 text-white h-14"
                  disabled={isCreatingOrder}
                >
                  {isCreatingOrder ? "Đang tạo đơn..." : "Xác Nhận Đặt Hàng"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-red-600">
              Thanh Toán Đơn Hàng
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Họ và tên:</span>
                <span className="text-gray-900">{fullName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Số điện thoại:</span>
                <span className="text-gray-900">{phone}</span>
              </div>
              {includeRental && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Thuê trang phục:</span>
                  <span className="text-gray-900">
                    {bookingRentalTotal.toLocaleString("vi-VN")} ₫
                  </span>
                </div>
              )}
              {hasSelectedServicePackages && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Dịch vụ kèm theo:</span>
                  <span className="text-gray-900">
                    {bookingServiceTotal.toLocaleString("vi-VN")} ₫
                  </span>
                </div>
              )}

              <div className="pt-2 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-gray-900">Tổng thanh toán:</span>
                  <span className="text-red-600 text-xl">
                    {paymentMethod === "coc"
                      ? bookingDepositTotal.toLocaleString("vi-VN")
                      : bookingOrderTotal.toLocaleString("vi-VN")}{" "}
                    ₫
                  </span>
                </div>
                <p className="text-xs text-gray-500 text-right mt-1">
                  {paymentMethod === "coc"
                    ? "(Thanh toán cọc)"
                    : "(Thanh toán toàn bộ)"}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center space-y-3">
              <p className="text-sm text-gray-600 text-center">
                Đơn hàng đã được tạo thành công! Nhân viên sẽ liên hệ xác nhận
                trong 24h.
              </p>
            </div>

            <Button
              type="button"
              onClick={handleConfirmPayment}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              Thanh Toán
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Outfit Selection Dialog */}
      <Dialog open={showOutfitDialog} onOpenChange={setShowOutfitDialog}>
        <DialogContent className="!max-w-[95vw] w-full !max-h-[90vh] overflow-y-auto font-body text-gray-700 font-smooth">
          <DialogHeader>
            <DialogTitle className="text-center text-red-600 text-4xl lg:text-5xl mb-2 font-display tracking-wide leading-tight text-balance">
              Chọn Trang Phục
            </DialogTitle>
            <p className="text-center text-gray-600 text-base lg:text-lg mt-2 leading-relaxed max-w-2xl mx-auto">
              Click vào trang phục để xem chi tiết hoặc thêm ngay vào đơn hàng
            </p>
          </DialogHeader>

          {outfitsLoading && (
            <p className="text-center text-sm text-gray-500 py-8">
              Đang tải danh sách trang phục...
            </p>
          )}

          {!outfitsLoading && outfitsError && (
            <p className="text-center text-sm text-red-600 py-8">
              {outfitsError}
            </p>
          )}

          {!outfitsLoading &&
            !outfitsError &&
            availableOutfits.length === 0 && (
              <p className="text-center text-sm text-gray-500 py-8">
                Chưa có trang phục khả dụng.
              </p>
            )}

          {!outfitsLoading && !outfitsError && availableOutfits.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 py-8 px-4">
              {availableOutfits.map((outfit) => {
                const isSelected = selectedOutfits.find(
                  (o) => o.id === outfit.id,
                );

                return (
                  <div
                    key={outfit.id}
                    className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                      isSelected
                        ? "border-red-600 bg-red-50 shadow-xl"
                        : "border-gray-200 hover:border-red-400 hover:shadow-lg"
                    }`}
                  >
                    {/* Image */}
                    <div
                      className="aspect-[3/4] overflow-hidden cursor-pointer"
                      onClick={() => {
                        setSelectedOutfitDetail(outfit);
                        setShowOutfitDetailDialog(true);
                      }}
                    >
                      <ImageWithFallback
                        src={outfit.image}
                        alt={outfit.name}
                        className={`w-full h-full object-cover transition-transform duration-500 ${
                          isSelected ? "scale-105" : "group-hover:scale-110"
                        }`}
                      />

                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="text-white text-center">
                          <svg
                            className="w-16 h-16 mx-auto mb-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                          <p className="text-sm font-semibold tracking-wide uppercase">
                            Xem chi tiết
                          </p>
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="absolute top-4 right-4 z-10 bg-red-600 text-white rounded-full p-3 shadow-lg">
                        <svg
                          className="w-7 h-7"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}

                    <div className="p-6 bg-white">
                      <h3 className="text-lg lg:text-xl font-display text-gray-900 tracking-tight mb-1 line-clamp-1">
                        {outfit.name}
                      </h3>
                      <p className="text-sm text-gray-500 tracking-wide uppercase mb-4">
                        {outfit.category}
                      </p>

                      <div className="flex items-center justify-between mb-5">
                        <div>
                          <div className="text-red-600 font-display text-xl tracking-wide">
                            {outfit.price.toLocaleString("vi-VN")} ₫
                          </div>
                        </div>
                        {isSelected && (
                          <span className="text-xs text-red-600 font-semibold tracking-wide uppercase bg-red-100 px-4 py-2 rounded-full">
                            Đã chọn
                          </span>
                        )}
                      </div>

                      <div className="flex gap-3">
                        <Button
                          type="button"
                          onClick={() => {
                            setSelectedOutfitDetail(outfit);
                            setShowOutfitDetailDialog(true);
                          }}
                          variant="outline"
                          className="flex-1 border-gray-300 hover:border-red-400 hover:text-red-600 text-sm tracking-wide uppercase py-5"
                          size="lg"
                        >
                          Chi tiết
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="border-t border-gray-200 pt-6 mt-6 px-4">
            <Button
              type="button"
              onClick={() => setShowOutfitDialog(false)}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white text-lg py-6"
              size="lg"
            >
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Outfit Detail Dialog WITH SIZE SELECTION */}
      <Dialog
        open={showOutfitDetailDialog}
        onOpenChange={setShowOutfitDetailDialog}
      >
        <DialogContent className="!max-w-[90vw] w-full !max-h-[95vh] overflow-y-auto font-body text-gray-700 font-smooth">
          {selectedOutfitDetail && (
            <>
              <DialogHeader>
                <DialogTitle className="text-center text-red-600 text-4xl lg:text-5xl mb-2 font-display tracking-wide leading-tight text-balance">
                  {selectedOutfitDetail.name}
                </DialogTitle>
              </DialogHeader>

              <div className="grid md:grid-cols-2 gap-12 py-8 px-4">
                {/* Left: Image */}
                <div className="rounded-2xl overflow-hidden shadow-2xl">
                  <ImageWithFallback
                    src={selectedOutfitDetail.image}
                    alt={selectedOutfitDetail.name}
                    className="w-full h-full object-cover min-h-[600px]"
                  />
                </div>

                {/* Right: Details */}
                <div className="space-y-8">
                  {/* Category Badge */}
                  <div>
                    <span className="inline-block bg-red-100 text-red-800 px-6 py-2 rounded-full text-xs font-semibold tracking-wide uppercase">
                      {selectedOutfitDetail.category}
                    </span>
                  </div>

                  {/* Name */}
                  <div>
                    <h2 className="text-3xl lg:text-4xl font-display text-gray-900 tracking-tight mb-2">
                      {selectedOutfitDetail.name}
                    </h2>
                    <p className="text-gray-600 text-base leading-relaxed">
                      Trang phục truyền thống Việt Nam cao cấp
                    </p>
                  </div>

                  {/* Price Info */}
                  <div className="bg-gray-50 rounded-xl p-8 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium text-sm tracking-wide uppercase">
                        Giá thuê
                      </span>
                      <span className="text-red-600 font-display text-3xl tracking-wide">
                        {selectedOutfitDetail.price.toLocaleString("vi-VN")} ₫
                      </span>
                    </div>
                  </div>

                  {/* SIZE SELECTION */}
                  <div className="space-y-4">
                    <h3 className="text-gray-900 font-display tracking-wide text-2xl">
                      Chọn Size
                    </h3>
                    <div className="grid grid-cols-4 gap-3">
                      {selectedOutfitDetail.sizes.map((sizeInfo) => {
                        const isOutOfStock = sizeInfo.stock === 0;
                        const isSelected = selectedSize === sizeInfo.size;

                        return (
                          <button
                            key={sizeInfo.size}
                            type="button"
                            onClick={() =>
                              !isOutOfStock && setSelectedSize(sizeInfo.size)
                            }
                            disabled={isOutOfStock}
                            className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                              isSelected
                                ? "border-red-600 bg-red-50"
                                : isOutOfStock
                                  ? "border-gray-200 bg-gray-100 cursor-not-allowed opacity-50"
                                  : "border-gray-300 hover:border-red-400 hover:bg-red-50"
                            }`}
                          >
                            <div className="text-center">
                              <div
                                className={`text-2xl font-bold mb-1 ${
                                  isSelected
                                    ? "text-red-600"
                                    : isOutOfStock
                                      ? "text-gray-400"
                                      : "text-gray-900"
                                }`}
                              >
                                {sizeInfo.size}
                              </div>
                              <div
                                className={`text-xs ${
                                  isSelected
                                    ? "text-red-600"
                                    : isOutOfStock
                                      ? "text-gray-400"
                                      : "text-gray-600"
                                }`}
                              >
                                {isOutOfStock
                                  ? "Hết hàng"
                                  : `Còn ${sizeInfo.stock}`}
                              </div>
                            </div>

                            {isSelected && (
                              <div className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1">
                                <svg
                                  className="w-3 h-3"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {!selectedSize && (
                      <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
                        ⚠️ Vui lòng chọn size trước khi thêm vào đơn hàng
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-4">
                    <h3 className="text-gray-900 font-semibold text-2xl">
                      Mô tả chi tiết
                    </h3>
                    <div className="text-gray-700 space-y-3 text-base leading-relaxed">
                      <p>
                        ✨ Trang phục được thiết kế tinh xảo với chất liệu cao
                        cấp, mang đậm nét truyền thống Việt Nam.
                      </p>
                      <p>
                        🎨 Phù hợp cho các dịp lễ hội, chụp ảnh kỷ niệm, sự kiện
                        văn hóa.
                      </p>
                      <p>
                        📏 Size có thể điều chỉnh để phù hợp với vóc dáng của
                        bạn.
                      </p>
                      <p>🧵 Chất liệu: Vải cao cấp, thêu tay thủ công.</p>
                      <p>
                        🌟 Phụ kiện đi kèm: Khăn, trang sức phù hợp (tùy mẫu).
                      </p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-4">
                    <h3 className="text-gray-900 font-semibold text-2xl">
                      Dịch vụ bao gồm
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-3 text-base text-gray-700">
                        <svg
                          className="w-6 h-6 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Giặt ủi miễn phí</span>
                      </div>
                      <div className="flex items-center gap-3 text-base text-gray-700">
                        <svg
                          className="w-6 h-6 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Tư vấn phối đồ</span>
                      </div>
                      <div className="flex items-center gap-3 text-base text-gray-700">
                        <svg
                          className="w-6 h-6 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Phụ kiện đi kèm</span>
                      </div>
                      <div className="flex items-center gap-3 text-base text-gray-700">
                        <svg
                          className="w-6 h-6 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Hỗ trợ thay đổi size</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-6">
                    <Button
                      type="button"
                      onClick={() => setShowOutfitDetailDialog(false)}
                      variant="outline"
                      className="flex-1 border-gray-300 text-lg py-6"
                      size="lg"
                    >
                      Đóng
                    </Button>
                    <Button
                      type="button"
                      onClick={() => {
                        if (selectedSize) {
                          handleAddOutfitWithSize(
                            selectedOutfitDetail,
                            selectedSize,
                          );
                        }
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white text-lg py-6"
                      size="lg"
                      disabled={
                        !selectedSize ||
                        selectedOutfits.find(
                          (o) => o.id === selectedOutfitDetail.id,
                        )
                      }
                    >
                      {selectedOutfits.find(
                        (o) => o.id === selectedOutfitDetail.id,
                      )
                        ? "Đã thêm vào đơn hàng"
                        : !selectedSize
                          ? "Vui lòng chọn size"
                          : "Thêm vào đơn hàng"}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Address Selection Dialog */}
      <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
        <DialogContent className="!max-w-[90vw] w-full !max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-center text-red-600 text-5xl mb-2">
              Chọn Địa Chỉ
            </DialogTitle>
          </DialogHeader>

          <div className="grid md:grid-cols-2 gap-12 py-8 px-4">
            {/* Left: Saved Addresses */}
            <div className="space-y-4">
              <h3 className="font-display text-gray-900 font-semibold text-2xl">
                Địa Chỉ Đã Lưu
              </h3>
              {savedAddresses.length === 0 && (
                <p className="text-sm text-gray-500">Chưa có địa chỉ đã lưu.</p>
              )}
              {savedAddresses.map((savedAddress) => (
                <div
                  key={savedAddress.id}
                  className={`p-5 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                    savedAddress.isDefault
                      ? "border-red-600 bg-red-50 shadow-xl"
                      : "border-gray-200 hover:border-red-400 hover:shadow-lg"
                  }`}
                  onClick={() => {
                    void handleSelectAddress(savedAddress);
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      <div>
                        <p className="text-gray-900 font-semibold text-lg">
                          {savedAddress.fullName}
                        </p>
                        <p className="text-gray-600 text-sm mt-1">
                          {savedAddress.phone}
                        </p>
                      </div>
                      <div className="h-px bg-gray-200" />
                      <div>
                        <p className="text-gray-900 font-medium">
                          {savedAddress.addressLine}
                        </p>
                        <p className="text-gray-600 text-sm mt-1">
                          {savedAddress.ward}, {savedAddress.district},{" "}
                          {savedAddress.city}
                        </p>
                      </div>
                      {savedAddress.isDefault && (
                        <span className="inline-block text-xs text-red-600 bg-red-100 px-3 py-1 rounded-full">
                          Mặc định
                        </span>
                      )}
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white"
                      disabled={settingDefaultAddressId === savedAddress.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        void handleSelectAddress(savedAddress);
                      }}
                    >
                      {settingDefaultAddressId === savedAddress.id
                        ? "Đang chọn..."
                        : "Chọn"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: New Address Form */}
            <div className="space-y-4">
              <h3 className="font-display text-gray-900 font-semibold text-2xl">
                Địa Chỉ Mới
              </h3>

              <div className="space-y-2">
                <Label
                  htmlFor="newFullName"
                  className="text-gray-700 mb-2 block"
                >
                  Họ và Tên
                </Label>
                <Input
                  id="newFullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  required
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPhone" className="text-gray-700 mb-2 block">
                  Số Điện Thoại
                </Label>
                <Input
                  id="newPhone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0901234567"
                  required
                  className="border-gray-300"
                />
              </div>

              <div className="h-px bg-gray-200 my-4" />

              <div className="space-y-2">
                <Label
                  htmlFor="newAddressLine"
                  className="text-gray-700 mb-2 block"
                >
                  Địa chỉ cụ thể
                </Label>
                <Textarea
                  id="newAddressLine"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Số nhà, tên đường..."
                  required
                  rows={3}
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newCity" className="text-gray-700 mb-2 block">
                  Tỉnh/Thành phố
                </Label>
                <Input
                  id="newCity"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="TP. Hồ Chí Minh"
                  required
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="newDistrict"
                  className="text-gray-700 mb-2 block"
                >
                  Quận/Huyện
                </Label>
                <Input
                  id="newDistrict"
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Quận 1"
                  required
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newWard" className="text-gray-700 mb-2 block">
                  Phường/Xã
                </Label>
                <Input
                  id="newWard"
                  type="text"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  placeholder="Phường Bến Nghé"
                  required
                  className="border-gray-300"
                />
              </div>

              <Button
                type="button"
                onClick={handleSaveNewAddress}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white text-lg py-6"
                size="lg"
                disabled={isSavingAddress}
              >
                {isSavingAddress ? "Đang lưu..." : "Lưu"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
