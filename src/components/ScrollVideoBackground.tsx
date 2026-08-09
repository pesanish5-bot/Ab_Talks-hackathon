"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const VIDEO_SOURCE = "/brain-2.mp4";

export default function ScrollVideoBackground() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentTarget = useRef(0);
  const seekPending = useRef(false);
  const [isReady, setIsReady] = useState(false);
  const [bufferProgress, setBufferProgress] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    const wrapper = wrapperRef.current;
    if (!video || !wrapper) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const supportsFinePointer = window.matchMedia("(pointer: fine)").matches;
    let trigger: ScrollTrigger | undefined;

    const updateBufferedProgress = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0 || !video.buffered.length) {
        return;
      }

      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      setBufferProgress(Math.min(100, Math.max(0, Math.round((bufferedEnd / video.duration) * 100))));
    };

    const performSeek = () => {
      if (video.seeking || !Number.isFinite(video.duration)) {
        seekPending.current = true;
        return;
      }

      const nextTime = Math.min(Math.max(currentTarget.current, 0), Math.max(video.duration - 0.01, 0));
      if (Math.abs(video.currentTime - nextTime) < 0.025) return;
      video.currentTime = nextTime;
    };

    const handleSeeked = () => {
      if (!seekPending.current) return;
      seekPending.current = false;
      performSeek();
    };

    const createScrollTrigger = () => {
      if (reducedMotion || !Number.isFinite(video.duration) || video.duration <= 0) return;

      gsap.registerPlugin(ScrollTrigger);
      trigger = ScrollTrigger.create({
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          currentTarget.current = self.progress * video.duration;
          if (video.seeking) {
            seekPending.current = true;
            return;
          }
          performSeek();
        },
      });
    };

    const handleCanPlay = () => {
      updateBufferedProgress();
      setIsReady(true);
    };

    const handlePointerMove = (event: MouseEvent) => {
      if (reducedMotion || !supportsFinePointer) return;
      const moveX = (event.clientX / window.innerWidth - 0.5) * 2;
      const moveY = (event.clientY / window.innerHeight - 0.5) * 2;
      gsap.to(wrapper, {
        x: moveX * -30,
        y: moveY * -30,
        duration: 1.5,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    video.addEventListener("loadedmetadata", createScrollTrigger, { once: true });
    video.addEventListener("progress", updateBufferedProgress);
    video.addEventListener("canplay", handleCanPlay, { once: true });
    video.addEventListener("seeked", handleSeeked);
    window.addEventListener("mousemove", handlePointerMove, { passive: true });

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) createScrollTrigger();
    if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) handleCanPlay();

    return () => {
      trigger?.kill();
      gsap.killTweensOf(wrapper);
      video.removeEventListener("progress", updateBufferedProgress);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("seeked", handleSeeked);
      window.removeEventListener("mousemove", handlePointerMove);
    };
  }, []);

  return (
    <>
      <div ref={wrapperRef} className="fixed top-0 left-0 z-0 h-full w-full origin-center scale-[1.05] will-change-transform">
        <video
          ref={videoRef}
          className="h-full w-full object-cover scale-[1.15] md:scale-[1.28]"
          muted
          playsInline
          crossOrigin="anonymous"
          preload="auto"
          aria-hidden="true"
        >
          <source src={VIDEO_SOURCE} type="video/mp4" />
        </video>
      </div>

      <div
        aria-live="polite"
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-700 ${
          isReady ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <div className="text-center">
          <div className="text-2xl font-sans text-white">Loading... {bufferProgress}%</div>
          <div className="mx-auto mt-4 h-px w-40 overflow-hidden bg-white/20">
            <div className="h-full bg-cyan-accent transition-[width] duration-300" style={{ width: `${bufferProgress}%` }} />
          </div>
        </div>
      </div>
    </>
  );
}
