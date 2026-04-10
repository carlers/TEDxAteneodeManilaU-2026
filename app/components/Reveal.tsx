"use client";

import { useInView } from "@/app/hooks/useInView";
import type { CSSProperties, ReactNode, RefObject } from "react";

type RevealVariant = "fade-up" | "fade-in" | "fade-right" | "fade-left" | "zoom-in";

type RevealProps = {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;        // seconds
  duration?: number;     // seconds
  threshold?: number;    // 0–1, fraction visible before triggering
  className?: string;
  style?: CSSProperties;
};

export default function Reveal({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 0.8,
  threshold = 0.15,
  className = "",
  style,
}: RevealProps) {
  const { ref, inView } = useInView(threshold);

  const inlineStyle: CSSProperties = {
    ...style,
    ["--reveal-delay" as string]: `${delay}s`,
    ["--reveal-duration" as string]: `${duration}s`,
  };

  return (
    <div
      ref={ref as RefObject<HTMLDivElement>}
      data-reveal={variant}
      data-reveal-in={inView ? "true" : "false"}
      className={className}
      style={inlineStyle}
    >
      {children}
    </div>
  );
}
