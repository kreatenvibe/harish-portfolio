"use client";

import { useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import {
  X,
  CaretLeft,
  CaretRight,
  ArrowsOutSimple,
} from "@phosphor-icons/react";
import { getImageKitUrl } from "@/lib/imagekit";
import { TrackingPoint } from "@/components/frame/TrackingPoints";
import type { IMedia } from "@/database";

interface ProjectLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  items: IMedia[];
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  projectTitle?: string;
}

export default function ProjectLightbox({
  isOpen,
  onClose,
  items = [],
  currentIndex,
  onSelectIndex,
  projectTitle = "PROJECT GALLERY",
}: ProjectLightboxProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const total = items.length;
  const currentItem = items[currentIndex];

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    onSelectIndex((currentIndex - 1 + total) % total);
  }, [currentIndex, total, onSelectIndex]);

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    onSelectIndex((currentIndex + 1) % total);
  }, [currentIndex, total, onSelectIndex]);

  // Keyboard navigation & ESC close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handlePrev, handleNext]);

  // Body scroll lock & Focus trap
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus the modal container
    dialogRef.current?.focus();

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen || !currentItem) return null;

  const currentNumStr = String(currentIndex + 1).padStart(2, "0");
  const totalNumStr = String(total).padStart(2, "0");

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${projectTitle} — Artwork Viewer`}
      tabIndex={-1}
      className="fixed inset-0 z-[99999] flex flex-col justify-between bg-black/95 backdrop-blur-xl text-foreground outline-none select-none transition-opacity duration-300 animate-in fade-in"
    >
      {/* Precision Frame HUD Corners */}
      <span className="frame-corner-tl !border-white/50" aria-hidden="true" />
      <span className="frame-corner-tr !border-white/50" aria-hidden="true" />
      <span className="frame-corner-bl !border-white/50" aria-hidden="true" />
      <span className="frame-corner-br !border-white/50" aria-hidden="true" />

      {/* 1. TOP LIGHTBOX HUD BAR */}
      <header className="relative z-20 flex shrink-0 items-center justify-between border-b border-white/10 bg-black/60 px-4 py-3 sm:px-8 sm:py-4 backdrop-blur-md">
        <div className="flex items-center gap-3 sm:gap-5 min-w-0">
          <div className="flex items-center gap-2 font-mono text-[10px] sm:text-xs font-bold tracking-widest text-muted uppercase shrink-0">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-foreground">INSPECT_MODE</span>
            <span className="text-white/20">|</span>
            <span className="text-white/80">{projectTitle}</span>
          </div>

          <div className="hidden md:flex items-center gap-2 font-mono text-[10px] text-muted tracking-wider uppercase truncate">
            <span>//</span>
            <span className="text-foreground/80 truncate">
              {currentItem.title || currentItem.caption || "DELIVERABLE MASTER PLATE"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-5 shrink-0">
          {/* Frame Index Counter */}
          <div className="flex items-center gap-1.5 rounded border border-white/15 bg-white/5 px-3 py-1 font-mono text-xs font-semibold tracking-widest text-foreground">
            <span className="text-white">{currentNumStr}</span>
            <span className="text-white/30">/</span>
            <span className="text-white/60">{totalNumStr}</span>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close fullscreen gallery viewer (ESC)"
            className="group flex items-center gap-2 rounded border border-white/20 bg-white/5 px-3.5 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-foreground transition-all duration-200 hover:border-white hover:bg-white hover:text-black cursor-pointer"
          >
            <span className="hidden sm:inline text-[10px] text-muted group-hover:text-black/70">ESC</span>
            <X size={15} weight="bold" />
          </button>
        </div>
      </header>

      {/* 2. MAIN ARTWORK STAGE (Backdrop click closes) */}
      <main
        className="relative flex-1 flex items-center justify-center p-3 sm:p-6 lg:p-10 min-h-0 overflow-hidden cursor-zoom-out"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        {/* Navigation Button: PREVIOUS */}
        {total > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            aria-label="Previous artwork (Left arrow)"
            className="group absolute left-3 sm:left-6 lg:left-10 z-30 flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-white/20 bg-black/70 text-foreground backdrop-blur-md transition-all duration-200 hover:scale-110 hover:border-white hover:bg-white hover:text-black cursor-pointer shadow-2xl"
          >
            <CaretLeft size={22} weight="bold" className="transition-transform group-hover:-translate-x-0.5" />
          </button>
        )}

        {/* Artwork Image Container */}
        <div
          className="relative max-h-[82vh] max-w-[92vw] lg:max-w-[86vw] flex items-center justify-center cursor-default animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {currentItem.type === "video" ? (
            <video
              src={currentItem.url}
              controls
              autoPlay
              playsInline
              className="max-h-[80vh] max-w-[90vw] rounded-lg border border-white/20 shadow-[0_0_60px_rgba(0,0,0,0.9)]"
            />
          ) : (
            <div className="relative rounded-lg border border-white/15 bg-[#121214] shadow-[0_0_80px_rgba(0,0,0,0.95)] overflow-hidden">
              <TrackingPoint className="top-3 left-3" variant="bracket" />
              <TrackingPoint className="bottom-3 right-3" variant="cross" />

              {/* High Resolution Optimized ImageKit Image */}
              <img
                key={currentItem.url + currentIndex}
                src={getImageKitUrl(currentItem.url, { width: 2560 })}
                alt={currentItem.altText || currentItem.title || projectTitle}
                className="max-h-[80vh] max-w-[90vw] w-auto h-auto object-contain block transition-transform duration-300"
                loading="eager"
              />
            </div>
          )}
        </div>

        {/* Navigation Button: NEXT */}
        {total > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label="Next artwork (Right arrow)"
            className="group absolute right-3 sm:right-6 lg:right-10 z-30 flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-full border border-white/20 bg-black/70 text-foreground backdrop-blur-md transition-all duration-200 hover:scale-110 hover:border-white hover:bg-white hover:text-black cursor-pointer shadow-2xl"
          >
            <CaretRight size={22} weight="bold" className="transition-transform group-hover:translate-x-0.5" />
          </button>
        )}
      </main>

      {/* 3. BOTTOM LIGHTBOX FOOTER / METADATA RIBBON */}
      <footer className="relative z-20 shrink-0 border-t border-white/10 bg-black/70 px-4 py-3 sm:px-8 sm:py-3.5 backdrop-blur-md">
        <div className="mx-auto flex flex-wrap items-center justify-between gap-3 max-w-7xl">
          <div className="flex items-center gap-3">
            <span className="font-heading text-lg sm:text-xl font-bold uppercase tracking-tight text-white">
              {currentItem.title || projectTitle}
            </span>
            {currentItem.caption && (
              <span className="hidden sm:inline font-mono text-xs text-muted">
                — {currentItem.caption}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 font-mono text-[10px] sm:text-[11px] text-muted uppercase">
            <span className="hidden md:inline">← PREV / NEXT → KEYBOARD NAVIGATION</span>
            <span className="text-white/20 hidden md:inline">|</span>
            <span>HIGH RES MASTER // 2560PX</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
