"use client";

import { useEffect, useRef, useState } from "react";
import { upload } from "@imagekit/next";
import Image from "next/image";
import type { IKFile, IKFolder } from "@/types/imagekit";

interface AssetSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string, fileId?: string) => void;
}

export default function AssetSelector({ isOpen, onClose, onSelect }: AssetSelectorProps) {
  const [files, setFiles] = useState<IKFile[]>([]);
  const [folders, setFolders] = useState<IKFolder[]>([]);
  const [currentPath, setCurrentPath] = useState("/");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchAssets = async () => {
      setLoading(true);
      setError("");
      try {
        const [filesRes, foldersRes] = await Promise.all([
          fetch(`/api/assets?folder=${encodeURIComponent(currentPath)}`),
          fetch(`/api/folders?path=${encodeURIComponent(currentPath)}`),
        ]);
        if (!filesRes.ok || !foldersRes.ok) throw new Error("Failed to load");
        const [filesData, foldersData] = await Promise.all([
          filesRes.json(),
          foldersRes.json(),
        ]);
        setFiles(Array.isArray(filesData) ? filesData : []);
        setFolders(Array.isArray(foldersData) ? foldersData : []);
      } catch {
        setError("Failed to load assets. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, [isOpen, currentPath]);

  const handleUpload = async (file: File) => {
    setUploadProgress(1);
    abortRef.current = new AbortController();
    try {
      const authRes = await fetch("/api/upload-auth");
      if (authRes.status === 401) {
        window.location.href = "/api/auth/signin";
        return;
      }
      if (!authRes.ok) throw new Error("Upload auth failed");
      const { token, expire, signature, publicKey } = await authRes.json();
      await upload({
        file,
        fileName: file.name,
        folder: currentPath,
        token,
        expire,
        signature,
        publicKey,
        abortSignal: abortRef.current.signal,
        onProgress: (e) =>
          setUploadProgress(Math.round((e.loaded / e.total) * 100)),
      });
      // Refetch files after upload
      const filesRes = await fetch(
        `/api/assets?folder=${encodeURIComponent(currentPath)}`
      );
      if (filesRes.ok) {
        const data = await filesRes.json();
        setFiles(Array.isArray(data) ? data : []);
      }
    } catch {
      // silently fail — user can retry
    } finally {
      setUploadProgress(0);
    }
  };

  const handleBack = () => {
    const parent = currentPath.split("/").slice(0, -1).join("/") || "/";
    setCurrentPath(parent);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-background rounded-lg w-215 max-w-[95vw] h-150 max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-foreground/10 shrink-0">
          <div>
            <p className="font-heading text-[22px] text-foreground m-0">Select Image</p>
            <p className="font-sans text-[14px] text-muted mt-1">{currentPath}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="font-sans text-[24px] text-muted hover:text-foreground leading-none px-2 py-1"
          >
            ×
          </button>
        </div>

        {/* Upload toolbar */}
        <div className="px-6 py-3 border-b border-foreground/10 flex gap-3 items-center shrink-0">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploadProgress > 0}
            className="rounded-full border border-foreground/15 px-4 py-1.5 font-sans text-[14px] font-semibold text-foreground transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
          >
            Upload Image
          </button>
          {uploadProgress > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-[200px] h-1 bg-foreground/10 rounded-sm overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <span className="font-sans text-[13px] text-muted">
                {uploadProgress}%
              </span>
            </div>
          )}
        </div>

        {/* Folders row */}
        {(folders.length > 0 || currentPath !== "/") && (
          <div className="px-6 py-2 border-b border-foreground/10 flex gap-2 flex-wrap items-center shrink-0">
            {currentPath !== "/" && (
              <button
                type="button"
                onClick={handleBack}
                className="font-sans text-[14px] text-muted hover:text-foreground px-2 py-1"
              >
                ← back
              </button>
            )}
            {folders.map((folder) => (
              <button
                key={folder.id}
                type="button"
                onClick={() => setCurrentPath(folder.path)}
                className="font-sans text-[15px] bg-[#f4f4f2] border border-foreground/10 hover:border-accent rounded px-3 py-1.5 transition-colors"
              >
                📁 {folder.name}
              </button>
            ))}
          </div>
        )}

        {/* Files grid */}
        <div className="p-6 grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] auto-rows-[160px] gap-4 overflow-y-auto flex-1 min-h-0 content-start">
          {loading ? (
            <div className="col-span-full text-center p-12 font-sans text-[16px] text-muted">
              Loading…
            </div>
          ) : error ? (
            <div className="col-span-full text-center p-12 font-sans text-[14px] text-accent">
              {error}
            </div>
          ) : files.filter((f) => f.type === "image").length === 0 ? (
            <div className="col-span-full text-center p-12 font-sans text-[16px] text-muted">
              No images here.
            </div>
          ) : (
            files
              .filter((f) => f.type === "image")
              .map((file) => (
                <button
                  key={file.id}
                  type="button"
                  onClick={() => {
                    onSelect(file.url, file.id);
                    onClose();
                  }}
                  className="border-[1.5px] border-foreground/10 hover:border-accent rounded-md overflow-hidden text-left transition-colors flex flex-col h-full"
                >
                  <div className="relative w-full flex-1 bg-[#f4f4f2]">
                    <Image
                      src={file.thumbnailUrl}
                      alt={file.name}
                      fill
                      sizes="180px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="w-full font-sans text-[13px] text-muted px-2 py-1.5 truncate shrink-0 bg-background">
                    {file.name}
                  </div>
                </button>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
