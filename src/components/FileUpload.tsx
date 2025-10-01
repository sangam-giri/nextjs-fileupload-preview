"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Upload } from "lucide-react";
import { useFileStore } from "@/store/fileStore";

export default function FileUpload() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dropRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const { files, fileUrls, previewIndex, setFiles, setPreviewIndex } =
    useFileStore();

  const handleFiles = (selectedFiles: File[]) => {
    // Append new files
    const allFiles = [...files, ...selectedFiles];
    setFiles(allFiles);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleRemove = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);

    if (previewIndex !== null) {
      if (index === previewIndex) setPreviewIndex(null);
      else if (index < previewIndex) setPreviewIndex(previewIndex - 1);
    }
  };

  const handlePrev = () => {
    if (previewIndex !== null && previewIndex > 0) setPreviewIndex(previewIndex - 1);
  };

  const handleNext = () => {
    if (previewIndex !== null && previewIndex < fileUrls.length - 1)
      setPreviewIndex(previewIndex + 1);
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
  }, [previewIndex, fileUrls]);

  // Drag & Drop
  useEffect(() => {
    const dropArea = dropRef.current;
    if (!dropArea) return;

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer?.files) {
        handleFiles(Array.from(e.dataTransfer.files));
      }
    };

    dropArea.addEventListener("dragover", handleDragOver);
    dropArea.addEventListener("dragleave", handleDragLeave);
    dropArea.addEventListener("drop", handleDrop);

    return () => {
      dropArea.removeEventListener("dragover", handleDragOver);
      dropArea.removeEventListener("dragleave", handleDragLeave);
      dropArea.removeEventListener("drop", handleDrop);
    };
  }, [files]);

  // Cleanup URLs
  useEffect(() => {
    return () => {
      fileUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [fileUrls]);

  return (
    <div className="p-6 w-full">
      {/* Drop Area */}
      <div
        ref={dropRef}
        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-10 mb-6 transition ${
          isDragging ? "border-blue-400 bg-blue-50" : "border-gray-300"
        }`}
      >
        <p className="text-gray-500 mb-4">Drag & drop images here</p>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          <Upload size={18} />
          Select Images
        </button>
      </div>

      {/* Hidden Input */}
      <input
        type="file"
        multiple
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Thumbnails */}
      <div className="grid grid-cols-3 gap-4">
        {fileUrls.map((url, idx) => (
          <div key={idx} className="relative cursor-pointer">
            <div
              className="absolute top-1 left-1 bg-white rounded-full p-1 shadow z-10"
              onClick={() => handleRemove(idx)}
            >
              <X className="text-red-600 w-4 h-4" />
            </div>
            <Image
              src={url}
              alt={`preview-${idx}`}
              width={200}
              height={200}
              className="object-cover h-40 w-full rounded-lg hover:scale-105 transition"
              onClick={() => setPreviewIndex(idx)}
            />
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 p-4">
          {/* Close */}
          <button
            onClick={() => setPreviewIndex(null)}
            className="absolute top-6 right-6 z-50 text-white text-3xl bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition"
          >
            <X />
          </button>

          {/* Image and Arrows */}
          <div className="relative flex items-center justify-center w-full flex-1">
            {previewIndex > 0 && (
              <button
                onClick={handlePrev}
                className="absolute left-2 md:left-6 text-white text-4xl"
              >
                <ChevronLeft />
              </button>
            )}

            <Image
              src={fileUrls[previewIndex]}
              alt="preview"
              width={800}
              height={600}
              className="rounded-lg object-contain max-h-[80vh] max-w-[90vw]"
            />

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
