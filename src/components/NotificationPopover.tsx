import { useState } from "react";
import { Bell, Package, Check } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { ScrollArea } from "./ui/scroll-area";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: "order" | "system" | "promotion";
  isRead: boolean;
}

interface NotificationPopoverProps {
  shouldHaveBackground: boolean;
}

export function NotificationPopover({ shouldHaveBackground }: NotificationPopoverProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Đơn thuê đã hoàn thành",
      description: "Đơn thuê #DH123456 của bạn đã hoàn thành và đã được trả lại thành công.",
      time: "19h ngày 1/11/2025",
      icon: "order",
      isRead: false,
    },
    {
      id: "2",
      title: "Xác nhận đơn thuê mới",
      description: "Đơn thuê #DH123457 của bạn đã được xác nhận và đang chuẩn bị.",
      time: "15h ngày 31/10/2025",
      icon: "order",
      isRead: false,
    },
    {
      id: "3",
      title: "Ưu đãi đặc biệt",
      description: "Giảm 20% cho tất cả áo dài truyền thống từ 2-5/11. Đừng bỏ lỡ!",
      time: "10h ngày 30/10/2025",
      icon: "promotion",
      isRead: false,
    },
  ]);

  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      // Mark all as read when opening
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "order":
        return <Package className="w-5 h-5 text-red-600" />;
      case "promotion":
        return <Bell className="w-5 h-5 text-red-600" />;
      default:
        return <Bell className="w-5 h-5 text-red-600" />;
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          className={`relative p-2 rounded-full transition-all duration-300 group ${
            shouldHaveBackground
              ? "hover:bg-red-50 text-gray-900 hover:text-red-600"
              : "hover:bg-white/10 text-white hover:text-red-400"
          }`}
          title="Thông báo"
        >
          <Bell className="w-5 h-5 transition-all duration-300 group-hover:scale-110" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end" sideOffset={10}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-red-600 text-white">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            <h3 className="font-semibold">Thông Báo</h3>
          </div>
          {notifications.length > 0 && (
            <span className="text-sm text-white/80">
              {notifications.length} thông báo
            </span>
          )}
        </div>

        {/* Notifications List */}
        {notifications.length > 0 ? (
          <ScrollArea className="max-h-[400px]">
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !notification.isRead ? "bg-red-50/30" : ""
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      {getIcon(notification.icon)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-sm text-gray-900 line-clamp-1">
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <div className="flex-shrink-0 w-2 h-2 bg-red-600 rounded-full mt-1"></div>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {notification.description}
                      </p>
                      <p className="text-xs text-gray-400">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Không có thông báo mới</p>
          </div>
        )}

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="border-t p-3">
            <button className="w-full text-sm text-red-600 hover:text-red-700 hover:bg-red-50 py-2 rounded-lg transition-colors">
              Xem tất cả
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
