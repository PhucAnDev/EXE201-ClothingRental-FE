import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { api } from "../api/client";

const STORAGE_KEY = "chatHistory";
const WELCOME_MESSAGE = "Xin chào! Tôi là AI Stylist của Clothing Rental. Tôi có thể giúp bạn tìm trang phục phù hợp, tư vấn phong cách, hoặc xem sản phẩm bán chạy. Bạn cần gì hôm nay? 😊";

interface OutfitSuggestion {
  outfitId: number;
  name: string;
  description?: string;
  rentalPrice?: number;
  type?: string;
  gender?: string;
  region?: string;
  imageUrl?: string;
}

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
  suggestions?: OutfitSuggestion[];
}

interface HistoryItem {
  role: "user" | "model";
  content: string;
}

interface AIChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AIChatDialog({ open, onOpenChange }: AIChatDialogProps) {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY + "_messages");
      if (saved) return JSON.parse(saved);
    } catch {}
    return [{ id: 1, text: WELCOME_MESSAGE, sender: "ai" }];
  });

  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const saveToStorage = (newMessages: Message[], newHistory: HistoryItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY + "_messages", JSON.stringify(newMessages));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    } catch {}
  };

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;

    const userMsg: Message = { id: Date.now(), text, sender: "user" };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      const { data: res } = await api.post("/api/Chatbot/chat", {
        message: text,
        history,
      });

      const aiText: string = res?.data?.response ?? "Xin lỗi, tôi không hiểu. Bạn thử hỏi lại nhé!";
      const suggestions: OutfitSuggestion[] = res?.data?.outfitSuggestions ?? [];

      const aiMsg: Message = {
        id: Date.now() + 1,
        text: aiText,
        sender: "ai",
        suggestions: suggestions.length > 0 ? suggestions : undefined,
      };

      const newMessages = [...updatedMessages, aiMsg];
      const newHistory: HistoryItem[] = [
        ...history,
        { role: "user", content: text },
        { role: "model", content: aiText },
      ];

      setMessages(newMessages);
      setHistory(newHistory);
      saveToStorage(newMessages, newHistory);
    } catch {
      const errMsg: Message = {
        id: Date.now() + 1,
        text: "Xin lỗi, không thể kết nối tới AI. Vui lòng thử lại sau!",
        sender: "ai",
      };
      setMessages([...updatedMessages, errMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    const initial = [{ id: 1, text: WELCOME_MESSAGE, sender: "ai" as const }];
    setMessages(initial);
    setHistory([]);
    saveToStorage(initial, []);
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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-black/20 z-40"
          />

          {/* Chat Box */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-6 top-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b bg-white flex-shrink-0">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 font-medium">AI Stylist</h3>
                <p className="text-sm text-gray-500">Tư vấn thời trang online</p>
              </div>
              <button
                onClick={handleClearHistory}
                className="text-xs text-gray-400 hover:text-gray-600 mr-2"
                title="Xóa lịch sử chat"
              >
                Xóa lịch sử chat
              </button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Messages */}
            <div className="h-[450px] px-6 py-4 bg-gray-50 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className="max-w-[85%] space-y-2">
                      <div
                        className={`rounded-2xl px-4 py-3 ${
                          message.sender === "user"
                            ? "bg-red-600 text-white rounded-br-sm"
                            : "bg-white text-gray-700 rounded-bl-sm shadow-sm"
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                      </div>

                      {/* Outfit Suggestions */}
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="space-y-2">
                          {message.suggestions.map((outfit) => (
                            <div
                              key={outfit.outfitId}
                              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex gap-3 p-3"
                            >
                              {outfit.imageUrl ? (
                                <img
                                  src={outfit.imageUrl}
                                  alt={outfit.name}
                                  className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                                />
                              ) : (
                                <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                                  <Sparkles className="w-6 h-6 text-gray-300" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{outfit.name}</p>
                                {outfit.type && (
                                  <p className="text-xs text-gray-500">{outfit.type}{outfit.gender ? ` · ${outfit.gender}` : ""}</p>
                                )}
                                {outfit.rentalPrice && (
                                  <p className="text-sm font-semibold text-red-600 mt-1">
                                    {outfit.rentalPrice.toLocaleString("vi-VN")}đ
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white rounded-2xl rounded-bl-sm shadow-sm px-4 py-3">
                      <div className="flex gap-1 items-center h-4">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="flex items-center gap-3 px-6 py-4 border-t bg-white flex-shrink-0">
              <Input
                placeholder="Hỏi về áo dài, xu hướng..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="flex-1 border-gray-300 focus:ring-red-500 focus:border-red-500"
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
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
