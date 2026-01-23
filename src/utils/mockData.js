// Mock data cho products - Thay bằng API call thực tế

export const PRODUCTS = {
  1: {
    id: 1,
    name: "Áo Dài Truyền Thống Hồng",
    designer: "NTK Minh Hạnh",
    price: 500000,
    pricePerDay: 500000,
    rating: 4.9,
    reviewCount: 128,
    tags: ["Sự Kiện", "Cưới Hỏi"],
    images: [
      "https://images.unsplash.com/photo-1675389017197-9ae63c2b2fe8?w=800&q=80",
      "https://images.unsplash.com/photo-1676696970495-f16aac1ad17f?w=800&q=80",
      "https://images.unsplash.com/photo-1687340800062-eb0d1a71737a?w=800&q=80",
      "https://images.unsplash.com/photo-1759671826519-072758927711?w=800&q=80"
    ],
    description: "Áo dài truyền thống với họa tiết hoa sen tinh tế, được thiết kế đặc biệt cho các dịp quan trọng như đám cưới, lễ ăn hỏi. Chất liệu vải cao cấp, form dáng ôm duyên dáng, tôn lên vẻ đẹp truyền thống Việt Nam.",
    material: "Lụa tơ tằm cao cấp",
    color: "Hồng pastel",
    sizes: ["S", "M", "L", "XL"],
    features: [
      "Chất liệu lụa tơ tằm 100%",
      "Họa tiết thêu tay thủ công",
      "Đi kèm quần lụa matching",
      "Miễn phí làm sạch sau thuê",
      "Hỗ trợ chỉnh sửa size"
    ],
    details: {
      fabric: "Lụa tơ tằm Bảo Lộc",
      pattern: "Hoa sen và phượng hoàng",
      collar: "Cổ truyền thống",
      sleeves: "Tay dài",
      length: "Dài đến mắt cá",
      care: "Giặt khô chuyên nghiệp"
    },
    sizeChart: {
      S: { bust: "80-84", waist: "60-64", hip: "86-90", height: "150-160" },
      M: { bust: "84-88", waist: "64-68", hip: "90-94", height: "155-165" },
      L: { bust: "88-92", waist: "68-72", hip: "94-98", height: "160-170" },
      XL: { bust: "92-96", waist: "72-76", hip: "98-102", height: "165-175" }
    },
    availability: "Còn hàng",
    rentalPolicy: {
      minDays: 1,
      maxDays: 7,
      deposit: 1000000,
      lateFee: 100000
    },
    reviews: [
      {
        id: 1,
        user: "Nguyễn Thu Hà",
        rating: 5,
        date: "2024-01-10",
        comment: "Áo dài rất đẹp, chất lượng vải tuyệt vời. Mình thuê cho đám cưới và nhận được nhiều lời khen. Service cũng rất chuyên nghiệp!",
        images: []
      },
      {
        id: 2,
        user: "Trần Minh Anh",
        rating: 5,
        date: "2024-01-05",
        comment: "Áo dài vừa vặn, màu sắc đẹp y hình. Đội ngũ tư vấn nhiệt tình, giao hàng đúng hẹn. Sẽ thuê lại lần sau!",
        images: []
      },
      {
        id: 3,
        user: "Phạm Lan Anh",
        rating: 4,
        date: "2023-12-28",
        comment: "Áo dài đẹp nhưng hơi dài một chút với mình. May mắn được shop hỗ trợ chỉnh sửa miễn phí. Nói chung là hài lòng!",
        images: []
      }
    ]
  },
  2: {
    id: 2,
    name: "Áo Dài Hiện Đại Xanh",
    designer: "NTK Công Trí",
    price: 750000,
    pricePerDay: 750000,
    rating: 5.0,
    reviewCount: 89,
    tags: ["Dạo Phố", "Chụp Hình"],
    images: [
      "https://images.unsplash.com/photo-1676696970495-f16aac1ad17f?w=800&q=80",
      "https://images.unsplash.com/photo-1675389017197-9ae63c2b2fe8?w=800&q=80",
      "https://images.unsplash.com/photo-1687340800062-eb0d1a71737a?w=800&q=80"
    ],
    description: "Áo dài hiện đại với thiết kế cách tân, kết hợp giữa truyền thống và xu hướng thời trang hiện đại. Thích hợp cho việc dạo phố, chụp ảnh hoặc các sự kiện casual.",
    material: "Lụa Hàn cao cấp",
    color: "Xanh biển",
    sizes: ["S", "M", "L"],
    features: [
      "Thiết kế cách tân độc đáo",
      "Chất liệu lụa Hàn cao cấp",
      "Form dáng trẻ trung, năng động",
      "Đi kèm quần suông matching",
      "Miễn phí accessories"
    ],
    details: {
      fabric: "Lụa Hàn Quốc",
      pattern: "Hoa văn đơn giản, tinh tế",
      collar: "Cổ truyền thống cách tân",
      sleeves: "Tay lỡ",
      length: "Dài qua gối",
      care: "Giặt tay hoặc giặt khô"
    },
    sizeChart: {
      S: { bust: "80-84", waist: "60-64", hip: "86-90", height: "150-160" },
      M: { bust: "84-88", waist: "64-68", hip: "90-94", height: "155-165" },
      L: { bust: "88-92", waist: "68-72", hip: "94-98", height: "160-170" }
    },
    availability: "Còn hàng",
    rentalPolicy: {
      minDays: 1,
      maxDays: 7,
      deposit: 1500000,
      lateFee: 150000
    },
    reviews: [
      {
        id: 1,
        user: "Lê Thảo Vy",
        rating: 5,
        date: "2024-01-15",
        comment: "Áo dài cách tân đẹp lắm! Mình chụp ảnh ở phố cổ Hội An, nhận được nhiều lời khen. Chất vải mềm mại, thoải mái.",
        images: []
      }
    ]
  },
  3: {
    id: 3,
    name: "Bộ Sưu Tập Hoàng Gia",
    designer: "Sắc Việt Studio",
    price: 1200000,
    pricePerDay: 1200000,
    rating: 4.8,
    reviewCount: 45,
    tags: ["Premium", "Limited"],
    images: [
      "https://images.unsplash.com/photo-1687340800062-eb0d1a71737a?w=800&q=80",
      "https://images.unsplash.com/photo-1675389017197-9ae63c2b2fe8?w=800&q=80"
    ],
    description: "Bộ sưu tập cao cấp lấy cảm hứng từ trang phục hoàng gia triều Nguyễn. Thiết kế sang trọng, lộng lẫy với họa tiết thêu tay tinh xảo.",
    material: "Lụa tơ tằm + Gấm",
    color: "Vàng hoàng gia",
    sizes: ["M", "L"],
    features: [
      "Thiết kế độc quyền Premium",
      "Họa tiết thêu tay nghệ nhân",
      "Phụ kiện hoàng gia đi kèm",
      "Chất liệu cao cấp nhất",
      "Phiên bản giới hạn"
    ],
    details: {
      fabric: "Lụa tơ tằm + Gấm thêu",
      pattern: "Long phụng",
      collar: "Cổ truyền thống cao cấp",
      sleeves: "Tay dài có đính kết",
      length: "Dài đến mắt cá",
      care: "Bảo quản đặc biệt"
    },
    sizeChart: {
      M: { bust: "84-88", waist: "64-68", hip: "90-94", height: "155-165" },
      L: { bust: "88-92", waist: "68-72", hip: "94-98", height: "160-170" }
    },
    availability: "Còn hàng",
    rentalPolicy: {
      minDays: 2,
      maxDays: 5,
      deposit: 3000000,
      lateFee: 300000
    },
    reviews: []
  },
  4: {
    id: 4,
    name: "Áo Dài Đỏ Sang Trọng",
    designer: "NTK Thủy Nguyễn",
    price: 650000,
    pricePerDay: 650000,
    rating: 4.9,
    reviewCount: 92,
    tags: ["Tết", "Lễ Hội"],
    images: [
      "https://images.unsplash.com/photo-1759671826519-072758927711?w=800&q=80",
      "https://images.unsplash.com/photo-1675389017197-9ae63c2b2fe8?w=800&q=80"
    ],
    description: "Áo dài màu đỏ truyền thống, hoàn hảo cho dịp Tết Nguyên Đán và các lễ hội văn hóa. Thiết kế sang trọng, tôn dáng.",
    material: "Lụa tơ tằm",
    color: "Đỏ truyền thống",
    sizes: ["S", "M", "L", "XL"],
    features: [
      "Màu đỏ may mắn truyền thống",
      "Thiết kế tôn dáng",
      "Chất liệu cao cấp",
      "Phù hợp mọi dáng người",
      "Miễn phí phụ kiện Tết"
    ],
    details: {
      fabric: "Lụa tơ tằm",
      pattern: "Hoa mai, hoa đào",
      collar: "Cổ truyền thống",
      sleeves: "Tay dài",
      length: "Dài đến mắt cá",
      care: "Giặt khô"
    },
    sizeChart: {
      S: { bust: "80-84", waist: "60-64", hip: "86-90", height: "150-160" },
      M: { bust: "84-88", waist: "64-68", hip: "90-94", height: "155-165" },
      L: { bust: "88-92", waist: "68-72", hip: "94-98", height: "160-170" },
      XL: { bust: "92-96", waist: "72-76", hip: "98-102", height: "165-175" }
    },
    availability: "Còn hàng",
    rentalPolicy: {
      minDays: 1,
      maxDays: 7,
      deposit: 1300000,
      lateFee: 130000
    },
    reviews: [
      {
        id: 1,
        user: "Hoàng Mai Linh",
        rating: 5,
        date: "2024-01-20",
        comment: "Áo dài Tết đẹp quá! Màu đỏ rất tươi, mặc rất hợp. Nhận được nhiều lời khen trong dịp Tết vừa rồi.",
        images: []
      }
    ]
  }
};

// Export function to get product by ID
export function getProductById(id) {
  return PRODUCTS[id] || null;
}

// Export function to get all products
export function getAllProducts() {
  return Object.values(PRODUCTS);
}
