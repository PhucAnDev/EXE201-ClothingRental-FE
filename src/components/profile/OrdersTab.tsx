import { useState } from "react";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Package, Clock, CheckCircle, XCircle, ShoppingBag } from "lucide-react";

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: {
    name: string;
    image: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: "pending" | "processing" | "completed" | "cancelled";
}

export function OrdersTab() {
  const [orders] = useState<Order[]>([
    // Sample data - replace with actual data from API
    {
      id: "1",
      orderNumber: "ORD-2024-001",
      date: "2024-01-15",
      items: [
        {
          name: "Áo Dài Truyền Thống - Đỏ",
          image: "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400",
          quantity: 1,
          price: 500000
        }
      ],
      total: 500000,
      status: "completed"
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="w-5 h-5 text-yellow-600" />;
      case "processing": return <Package className="w-5 h-5 text-blue-600" />;
      case "completed": return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "cancelled": return <XCircle className="w-5 h-5 text-red-600" />;
      default: return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending": return "Chờ xác nhận";
      case "processing": return "Đang xử lý";
      case "completed": return "Hoàn thành";
      case "cancelled": return "Đã hủy";
      default: return "";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "text-yellow-600 bg-yellow-50";
      case "processing": return "text-blue-600 bg-blue-50";
      case "completed": return "text-green-600 bg-green-50";
      case "cancelled": return "text-red-600 bg-red-50";
      default: return "";
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl text-gray-900 mb-6">Đơn Thuê</h2>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger 
            value="all"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-red-600 data-[state=active]:text-red-600"
          >
            Tất cả
          </TabsTrigger>
          <TabsTrigger 
            value="pending"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-red-600 data-[state=active]:text-red-600"
          >
            Chờ xác nhận
          </TabsTrigger>
          <TabsTrigger 
            value="processing"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-red-600 data-[state=active]:text-red-600"
          >
            Đang xử lý
          </TabsTrigger>
          <TabsTrigger 
            value="completed"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-red-600 data-[state=active]:text-red-600"
          >
            Hoàn thành
          </TabsTrigger>
          <TabsTrigger 
            value="cancelled"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-red-600 data-[state=active]:text-red-600"
          >
            Đã hủy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-2">Chưa có đơn thuê nào</p>
              <p className="text-sm text-gray-400 mb-4">Hãy khám phá bộ sưu tập của chúng tôi!</p>
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                Thuê ngay
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  {/* Order Header */}
                  <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-b">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(order.status)}
                      <span className="text-sm text-gray-600">
                        Mã đơn: <span className="font-medium text-gray-900">{order.orderNumber}</span>
                      </span>
                      <span className="text-sm text-gray-400">|</span>
                      <span className="text-sm text-gray-600">{order.date}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 mb-4 last:mb-0">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="text-gray-900">{item.name}</h4>
                          <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-red-600">{item.price.toLocaleString("vi-VN")}₫</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
                    <div className="text-gray-700">
                      Tổng thanh toán: <span className="text-xl text-red-600 ml-2">{order.total.toLocaleString("vi-VN")}₫</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Xem chi tiết
                      </Button>
                      {order.status === "completed" && (
                        <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                          Thuê lại
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Other tabs with filtered content */}
        {["pending", "processing", "completed", "cancelled"].map((status) => (
          <TabsContent key={status} value={status} className="mt-6">
            <div className="text-center py-16">
              <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Chưa có đơn thuê nào</p>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
