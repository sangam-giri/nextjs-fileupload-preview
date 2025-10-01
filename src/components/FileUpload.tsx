"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Upload } from "lucide-react";
import { useFileStore } from "@/store/fileStore";

export default function FileUpload() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { files, fileUrls, previewIndex, setFiles, setPreviewIndex } =
    useFileStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handlePrev = () => {
    if (previewIndex !== null && previewIndex > 0) {
      setPreviewIndex(previewIndex - 1);
    }
  };

  const handleNext = () => {
    if (previewIndex !== null && previewIndex < files.length - 1) {
      setPreviewIndex(previewIndex + 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (previewIndex === null) return;
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") setPreviewIndex(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previewIndex]);

  // Cleanup URLs when component unmounts
  useEffect(() => {
    return () => {
      fileUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [fileUrls]);

  return (
    <div className="p-6 w-full">
      {/* Hidden Input */}
      <input
        type="file"
        multiple
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Button */}
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 px-6 py-3 mb-6 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        <Upload size={18} />
        Select Images
      </button>

      {/* Thumbnails */}
      <div className="grid grid-cols-3 gap-4">
        {fileUrls.map((url, idx) => (
          <div
            key={idx}
            className="cursor-pointer border border-gray-300 rounded-lg overflow-hidden hover:scale-105 transition"
            onClick={() => setPreviewIndex(idx)}
          >
            <Image
              src={url}
              alt={`preview-${idx}`}
              width={200}
              height={200}
              className="object-cover h-40 w-full"
            />
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 p-4">
          {/* Close Button */}
          <button
            onClick={() => setPreviewIndex(null)}
            className="absolute top-6 right-6 text-white text-3xl"
          >
            <X />
          </button>

          <div className="relative flex items-center justify-center w-full flex-1">
            {/* Left Arrow */}
            {previewIndex > 0 && (
              <button
                onClick={handlePrev}
                className="absolute left-2 md:left-6 text-white text-4xl"
              >
                <ChevronLeft />
              </button>
            )}

            {/* Main Image */}
            <Image
              src={fileUrls[previewIndex]}
              alt="preview"
              width={800}
              height={600}
              className="rounded-lg object-contain max-h-[80vh] max-w-[90vw]"
            />

            {/* Right Arrow */}
            {previewIndex < fileUrls.length - 1 && (
              <button
                onClick={handleNext}
                className="absolute right-2 md:right-6 text-white text-4xl"
              >
                <ChevronRight />
              </button>
            )}
          </div>

          {/* Bottom Thumbnails */}
          <div className="flex gap-2 mt-4 overflow-x-auto py-2">
            {fileUrls.map((url, idx) => (
              <div
                key={idx}
                className={`cursor-pointer border-2 rounded-lg overflow-hidden ${
                  idx === previewIndex
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
                onClick={() => setPreviewIndex(idx)}
              >
                <Image
                  src={url}
                  alt={`thumb-${idx}`}
                  width={60}
                  height={60}
                  className="object-cover h-16 w-16"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
