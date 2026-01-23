import { Phone, MessageCircle, Facebook, Instagram, ChevronUp, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AIChatDialog } from "./AIChatDialog";

export function ContactFloat() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const contacts = [
    {
      icon: Sparkles,
      label: "AI Stylist",
      onClick: () => setChatOpen(true),
      color: "hover:bg-red-600",
      isButton: true,
    },
    {
      icon: MessageCircle,
      label: "Chat Zalo",
      href: "https://zalo.me/YOUR_ZALO_NUMBER",
      color: "hover:bg-blue-500",
      isButton: false,
    },
    {
      icon: Phone,
      label: "Gọi Ngay",
      href: "tel:+84123456789",
      color: "hover:bg-green-500",
      isButton: false,
    },
    {
      icon: Facebook,
      label: "Facebook",
      href: "https://facebook.com/sacviet",
      color: "hover:bg-blue-600",
      isButton: false,
    },
    {
      icon: Instagram,
      label: "Instagram",
      href: "https://instagram.com/sacviet",
      color: "hover:bg-pink-500",
      isButton: false,
    },
  ];

  return (
    <>
      <div className="fixed right-6 bottom-6 z-50 flex flex-col gap-3">
        {/* Contact Buttons */}
        {contacts.map((contact, index) => {
          const Component = contact.isButton ? motion.button : motion.a;
          const props = contact.isButton
            ? { onClick: contact.onClick }
            : { href: contact.href, target: "_blank", rel: "noopener noreferrer" };

          return (
            <Component
              key={contact.label}
              {...props}
              className={`group relative w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${contact.color} hover:text-white`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <contact.icon className="w-6 h-6 text-gray-700 group-hover:text-white transition-colors" />
              
              {/* Tooltip */}
              <div className="absolute right-full mr-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {contact.label}
                <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45" />
              </div>
            </Component>
          );
        })}

        {/* Scroll to Top Button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              onClick={scrollToTop}
              className="w-14 h-14 bg-red-600 rounded-full shadow-lg flex items-center justify-center hover:bg-red-700 transition-colors text-white"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronUp className="w-6 h-6" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* AI Chat Dialog */}
      <AIChatDialog open={chatOpen} onOpenChange={setChatOpen} />
    </>
  );
}
