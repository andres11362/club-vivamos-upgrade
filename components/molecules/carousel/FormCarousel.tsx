"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface FormCarouselProps {
  readonly imageArray: readonly string[];
  readonly imageArrayMobile: readonly string[];
}

export default function FormCarousel({ imageArray, imageArrayMobile }: FormCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen width is mobile (threshold 576px as in the old project)
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 576);
    };
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const images = isMobile ? imageArrayMobile : imageArray;

  // Autoplay functionality (4000ms delay)
  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  // Reset index if image source list changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [isMobile]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  if (images.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden rounded-lg shadow-lg aspect-[360/500] sm:aspect-[895/762]">
      {/* Slides Track */}
      <div
        className="flex w-full h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((imageSrc, index) => (
          <div key={imageSrc} className="min-w-full h-full relative">
            <img
              src={imageSrc}
              alt={`Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Pagination Dots (styled like the old project) */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2.5 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-colors ${
                currentIndex === index
                  ? "bg-[#F21C45]"
                  : "bg-white border border-[#F21C45]"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Navigation Buttons (styled like the old project) */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-5 top-1/2 -translate-y-1/2 w-[35px] h-[35px] bg-black text-white hover:bg-gray-700 active:bg-gray-800 rounded-full flex items-center justify-center cursor-pointer transition z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-5 top-1/2 -translate-y-1/2 w-[35px] h-[35px] bg-black text-white hover:bg-gray-700 active:bg-gray-800 rounded-full flex items-center justify-center cursor-pointer transition z-10"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  );
}
