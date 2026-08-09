"use client";

import { type ReactNode, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ScrollChapterProps {
  children: ReactNode;
  className?: string;
}

/** Keeps an existing section intact while presenting it as a scroll chapter. */
export default function ScrollChapter({ children, className = "" }: ScrollChapterProps) {
  const chapterRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const chapter = chapterRef.current;
    const panel = panelRef.current;
    if (!chapter || !panel || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: chapter, start: "top bottom", end: "bottom top", scrub: true },
      });

      timeline
        .fromTo(panel, { autoAlpha: 0, y: 46, scale: 0.975, filter: "blur(7px)" }, { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.2 })
        .to({}, { duration: 0.58 })
        .to(panel, { autoAlpha: 0, y: -34, scale: 0.985, filter: "blur(4px)", duration: 0.22 });
    }, chapter);

    return () => context.revert();
  }, []);

  return (
    <div ref={chapterRef} className={`scroll-chapter ${className}`}>
      <div ref={panelRef} className="scroll-chapter__panel">{children}</div>
    </div>
  );
}
