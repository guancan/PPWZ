"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type HeroVideoProps = {
  src: string;
  className?: string;
};

export function HeroVideo({ src, className }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const durationRef = useRef<number | null>(null);
  const fadeWindowSeconds = 0.6;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      durationRef.current = Number.isFinite(video.duration)
        ? video.duration
        : null;
    };

    const handleTimeUpdate = () => {
      const duration = durationRef.current;
      if (!duration || video.paused) return;
      const time = video.currentTime;
      const nextFading = duration - time < fadeWindowSeconds;
      setIsFading((prev) => (prev === nextFading ? prev : nextFading));
    };

    const handleCanPlay = () => {
      setIsReady(true);
      void video.play().catch(() => undefined);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("loadeddata", handleCanPlay);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("loadeddata", handleCanPlay);
    };
  }, []);

  const visible = isReady && !isFading;

  return (
    <div
      className={cn(
        "hero-video-align pointer-events-none absolute top-1/2 z-[5] -translate-y-1/2 origin-right scale-[0.75] translate-x-[20px] -mt-[20px]",
        "transition-opacity duration-700",
        visible ? "opacity-100" : "opacity-0",
        className
      )}
    >
      <div
        className={cn(
          "hero-video-mask relative h-[720px] w-[720px] max-h-[88vw] max-w-[88vw] overflow-hidden",
          "rounded-[40px] bg-black/20"
        )}
      >
        <video
          ref={videoRef}
          src={src}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
    </div>
  );
}
