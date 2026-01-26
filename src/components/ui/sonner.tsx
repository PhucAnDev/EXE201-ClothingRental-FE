"use client";

import { useTheme } from "next-themes@0.4.6";
import { Toaster as Sonner, ToasterProps } from "sonner@2.0.3";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-center"
      richColors
      className="toaster group"
      style={
        {
          "--normal-bg":
            "linear-gradient(135deg, #fff6e5 0%, #fffdf5 45%, #ffe7b3 100%)",
          "--normal-text": "#3b2a1a",
          "--normal-border": "rgba(212, 175, 55, 0.55)",
          "--success-bg":
            "linear-gradient(135deg, #fff2d8 0%, #fff9ef 55%, #ffe0a3 100%)",
          "--success-text": "#5a3b1f",
          "--success-border": "rgba(212, 175, 55, 0.65)",
        } as React.CSSProperties
      }
      toastOptions={{
        className: "text-base px-5 py-4 w-[420px] max-w-[90vw] font-medium",
        style: {
          boxShadow: "0 14px 40px -18px rgba(212, 175, 55, 0.75)",
        },
        classNames: {
          icon: "text-[#b8941f]",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
