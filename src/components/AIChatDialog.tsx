import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { X, Send, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface AIChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AIChatDialog({ open, onOpenChange }: AIChatDialogProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Xin chào! Tôi có thể giúp gì cho phong cách của bạn hôm nay?",
      sender: "ai",
      timestamp: new Date(),
    },
    {
      id: 2,
      text: "Chào bạn! Rất vui được gặp bạn. Tôi là stylist thời trang chuyên về Áo dài và trang phục truyền thống Việt Nam. Bạn có cần tôi giúp gì không? Hãy chia sẻ nhé! 😊",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputValue("");

    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        text: getAIResponse(inputValue),
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const getAIResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes("áo dài") || input.includes("ao dai")) {
      return "Chúng tôi có hơn 500+ mẫu áo dài từ truyền thống đến hiện đại! Bạn muốn thuê áo dài cho dịp nào? Cưới hỏi, dạo phố hay chụp ảnh? Tôi sẽ gợi ý những mẫu phù hợp nhất! 💃";
    }
    
    if (input.includes("giá") || input.includes("bao nhiêu")) {
      return "Giá thuê áo dài của chúng tôi từ 300.000đ - 1.500.000đ/ngày tùy vào thiết kế. Combo thuê đồ + makeup + chụp ảnh chỉ từ 999.000đ! Bạn muốn xem bảng giá chi tiết không? 💰";
    }
    
    if (input.includes("màu") || input.includes("phối đồ")) {
      return "Với AI Stylist của chúng tôi, tôi có thể gợi ý màu sắc phù hợp với tone da của bạn! Bạn có thể cho tôi biết màu da của bạn (trắng, vàng, ngăm) và dịp mặc để tôi tư vấn chính xác nhất nhé! 🎨";
    }
    
    if (input.includes("chụp") || input.includes("makeup")) {
      return "Chúng tôi cung cấp dịch vụ all-in-one: Makeup chuyên nghiệp + Chụp ảnh với photographer + Địa điểm đẹp. Combo này chỉ 999.000đ kèm theo thuê trang phục! Bạn muốn đặt lịch không? 📸";
    }
    
    if (input.includes("đặt lịch") || input.includes("booking")) {
      return "Tuyệt vời! Để đặt lịch, bạn có thể: 1) Gọi hotline: 0123 456 789, 2) Nhắn Zalo, hoặc 3) Điền form trên website. Bạn muốn đặt lịch cho ngày nào? 📅";
    }
    
    if (input.includes("cảm ơn") || input.includes("thank")) {
      return "Rất vui được hỗ trợ bạn! Nếu có bất kỳ thắc mắc nào khác về trang phục hay dịch vụ, đừng ngại chat với tôi nhé! Chúc bạn một ngày tuyệt vời! 💕";
    }

    return "Tôi hiểu rồi! Bạn có thể hỏi tôi về: mẫu áo dài, giá thuê, phối màu, dịch vụ makeup & chụp ảnh, hoặc đặt lịch. Tôi luôn sẵn sàng tư vấn! 😊";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop - Semi-transparent */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-black/20 z-40"
          />

          {/* Chat Box - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 100, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 100, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-6 top-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b bg-white">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900">AI Stylist</h3>
                <p className="text-sm text-gray-500">Tư vấn thời trang online</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Chat Messages */}
            <div className="h-[450px] px-6 py-4 bg-gray-50 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.sender === "user"
                          ? "bg-red-600 text-white rounded-br-sm"
                          : "bg-white text-gray-700 rounded-bl-sm shadow-sm"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="flex items-center gap-3 px-6 py-4 border-t bg-white">
              <Input
                placeholder="Hỏi về áo dài, xu hướng..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 border-gray-300 focus:ring-red-500 focus:border-red-500"
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="bg-red-600 hover:bg-red-700 text-white px-6 rounded-full"
              >
                Gửi
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
