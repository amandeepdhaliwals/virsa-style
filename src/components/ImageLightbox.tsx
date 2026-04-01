"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface Props {
  images: string[];
  selectedIndex: number;
  productName: string;
}

export default function ImageLightbox({ images, selectedIndex, productName }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(selectedIndex);
  const [zoomed, setZoomed] = useState(false);

  const open = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
    setZoomed(false);
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    setIsOpen(false);
    setZoomed(false);
    document.body.style.overflow = "";
  };

  const next = () => {
    setCurrentIndex((i) => (i + 1) % images.length);
    setZoomed(false);
  };

  const prev = () => {
    setCurrentIndex((i) => (i - 1 + images.length) % images.length);
    setZoomed(false);
  };

  return (
    <>
      {/* Zoom trigger on main image */}
      <button
        onClick={() => open(selectedIndex)}
        className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-white"
        aria-label="Zoom image"
      >
        <ZoomIn size={18} className="text-luxury-dark" />
      </button>

      {/* Lightbox Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={close}
        >
          {/* Close */}
          <button
            onClick={close}
            className="absolute top-4 right-4 text-white/70 hover:text-white z-10"
          >
            <X size={28} />
          </button>

          {/* Counter */}
          <p className="absolute top-4 left-4 text-white/50 text-sm">
            {currentIndex + 1} / {images.length}
          </p>

          {/* Previous */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 text-white"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Image */}
          <div
            className={`max-w-[90vw] max-h-[85vh] transition-transform duration-300 ${
              zoomed ? "cursor-zoom-out scale-150" : "cursor-zoom-in"
            }`}
            onClick={(e) => { e.stopPropagation(); setZoomed(!zoomed); }}
          >
            <img
              src={images[currentIndex]}
              alt={`${productName} - Image ${currentIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain"
              draggable={false}
            />
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-3 text-white"
            >
              <ChevronRight size={24} />
            </button>
          )}

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); setZoomed(false); }}
                  className={`w-14 h-14 overflow-hidden border-2 transition-colors ${
                    i === currentIndex ? "border-white" : "border-white/20 hover:border-white/50"
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
