import { create } from "zustand";

interface FileStore {
    files: File[];
    fileUrls: string[];
    previewIndex: number | null;
    setFiles: (files: File[]) => void;
    setPreviewIndex: (index: number | null) => void;
}

export const useFileStore = create<FileStore>((set) => ({
    files: [],
    fileUrls: [],
    previewIndex: null,
    setFiles: (files: File[]) => {
        const urls = files.map((file) => URL.createObjectURL(file));
        set({ files, fileUrls: urls });
    },
    setPreviewIndex: (index) => set({ previewIndex: index }),
}));
