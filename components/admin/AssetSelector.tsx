"use client";

import { useEffect, useRef, useState } from "react";
import { upload } from "@imagekit/next";
import Image from "next/image";
import { FilmSlate, FileText, File, Check, FolderPlus, ArrowsOut, FolderOpen } from "@phosphor-icons/react";
import type { IKFile, IKFolder } from "@/types/imagekit";

const VIDEO_EXTENSIONS = ["mp4", "webm", "mov", "m4v", "ogg", "ogv"];
const PDF_EXTENSIONS = ["pdf"];

export type MediaKind = "image" | "video" | "pdf" | "other";

// ImageKit only distinguishes "image" vs "non-image" — refine "non-image"
// down to video/pdf/other by extension so every file the Media model
// supports (image/video/pdf/other) is selectable, not just image/video.
function getMediaKind(file: IKFile): MediaKind {
  if (file.type === "image") return "image";
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext && VIDEO_EXTENSIONS.includes(ext)) return "video";
  if (ext && PDF_EXTENSIONS.includes(ext)) return "pdf";
  return "other";
}

type MediaAccept = "image" | "video" | "all";

interface AssetSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  /** Which kinds of files are selectable. Defaults to images only. */
  accept?: MediaAccept;
  /** Allow selecting several files at once via onSelectMultiple. */
  multiple?: boolean;
  onSelect?: (url: string, fileId?: string) => void;
  onSelectMultiple?: (
    items: { url: string; fileId: string; type: MediaKind }[]
  ) => void;
}

export default function AssetSelector({
  isOpen,
  onClose,
  accept = "image",
  multiple = false,
  onSelect,
  onSelectMultiple,
}: AssetSelectorProps) {
  const [files, setFiles] = useState<IKFile[]>([]);
  const [folders, setFolders] = useState<IKFolder[]>([]);
  const [currentPath, setCurrentPath] = useState("/");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selected, setSelected] = useState<Map<string, IKFile>>(new Map());
  const fileRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Reset selection whenever the modal transitions closed -> open (adjusting
  // state during render avoids the extra commit a useEffect would cause).
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) setSelected(new Map());
  }

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

  const handleCreateFolder = async () => {
    const name = window.prompt("Enter new folder name:");
    if (!name) return;
    setLoading(true);
    try {
      const res = await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folderName: name, parentFolderPath: currentPath })
      });
      if (!res.ok) throw new Error("Failed to create folder");
      const foldersRes = await fetch(`/api/folders?path=${encodeURIComponent(currentPath)}`);
      const foldersData = await foldersRes.json();
      setFolders(Array.isArray(foldersData) ? foldersData : []);
    } catch {
      alert("Failed to create folder");
    } finally {
      setLoading(false);
    }
  };

  const handleMoveFile = async (file: IKFile) => {
    const dest = window.prompt(`Move ${file.name} to destination path:\n(e.g., /new-folder or /)`, currentPath);
    if (!dest || dest === currentPath) return;
    setLoading(true);
    try {
      const res = await fetch("/api/assets/move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sourceFilePath: file.path, destinationPath: dest })
      });
      if (!res.ok) throw new Error("Failed to move file");
      const filesRes = await fetch(`/api/assets?folder=${encodeURIComponent(currentPath)}`);
      const data = await filesRes.json();
      setFiles(Array.isArray(data) ? data : []);
    } catch {
      alert("Failed to move file");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    const parent = currentPath.split("/").slice(0, -1).join("/") || "/";
    setCurrentPath(parent);
  };

  const visibleFiles = files
    .map((file) => ({ file, kind: getMediaKind(file) }))
    .filter((entry) => accept === "all" || entry.kind === accept);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-background rounded-lg border border-line w-215 max-w-[95vw] h-150 max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-line shrink-0">
          <div>
            <p className="font-heading text-2xl font-bold uppercase tracking-tight text-foreground m-0">
              {multiple
                ? "Select Media"
                : accept === "video"
                  ? "Select Video"
                  : "Select Image"}
            </p>
            <p className="font-mono text-xs text-muted mt-0.5">{currentPath}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="font-sans text-2xl text-muted hover:text-foreground leading-none px-2 py-1 cursor-pointer transition-colors"
          >
            ×
          </button>
        </div>

        {/* Upload toolbar */}
        <div className="px-6 py-3 border-b border-line flex gap-3 items-center shrink-0">
          <input
            ref={fileRef}
            type="file"
            accept={
              accept === "video"
                ? "video/*"
                : accept === "all"
                  ? "image/*,video/*"
                  : "image/*"
            }
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
            className="rounded-md border border-line bg-surface px-4 py-1.5 font-sans text-xs font-semibold text-foreground transition-colors hover:border-white/40 hover:bg-surface-hover disabled:opacity-50 cursor-pointer"
          >
            {accept === "video" ? "Upload Video" : accept === "all" ? "Upload File" : "Upload Image"}
          </button>
          <button
            type="button"
            onClick={handleCreateFolder}
            className="flex items-center gap-1.5 rounded-md border border-line bg-surface px-4 py-1.5 font-sans text-xs font-semibold text-foreground transition-colors hover:border-white/40 hover:bg-surface-hover cursor-pointer"
          >
            <FolderPlus size={15} />
            New Folder
          </button>
          {uploadProgress > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-48 h-1.5 bg-surface border border-line rounded-sm overflow-hidden">
                <div
                  className="h-full bg-foreground transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <span className="font-mono text-xs text-muted">
                {uploadProgress}%
              </span>
            </div>
          )}
        </div>

        {/* Folders row */}
        {(folders.length > 0 || currentPath !== "/") && (
          <div className="px-6 py-2.5 border-b border-line flex gap-2 flex-wrap items-center shrink-0 bg-surface/30">
            {currentPath !== "/" && (
              <button
                type="button"
                onClick={handleBack}
                className="font-mono text-xs text-muted hover:text-foreground px-2 py-1 cursor-pointer transition-colors"
              >
                ← back
              </button>
            )}
            {folders.map((folder) => (
              <button
                key={folder.id}
                type="button"
                onClick={() => setCurrentPath(folder.path)}
                className="flex items-center gap-2 font-sans text-xs bg-surface border border-line hover:border-white/40 text-foreground rounded-md px-3 py-1.5 transition-colors cursor-pointer"
              >
                <FolderOpen size={16} className="text-muted" />
                {folder.name}
              </button>
            ))}
          </div>
        )}

        {/* Files grid */}
        <div className="p-6 grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] auto-rows-40 gap-4 overflow-y-auto flex-1 min-h-0 content-start">
          {loading ? (
            <div className="col-span-full text-center p-12 font-sans text-sm text-muted">
              Loading…
            </div>
          ) : error ? (
            <div className="col-span-full text-center p-12 font-mono text-xs text-red-400">
              {error}
            </div>
          ) : visibleFiles.length === 0 ? (
            <div className="col-span-full text-center p-12 font-sans text-sm text-muted">
              {accept === "video" ? "No videos here." : accept === "all" ? "No media here." : "No images here."}
            </div>
          ) : (
            visibleFiles.map(({ file, kind }) => {
              const isSelected = selected.has(file.id);
              const handleSelect = () => {
                if (multiple) {
                  setSelected((prev) => {
                    const next = new Map(prev);
                    if (next.has(file.id)) next.delete(file.id);
                    else next.set(file.id, file);
                    return next;
                  });
                  return;
                }
                onSelect?.(file.url, file.id);
                onClose();
              };

              return (
                <div
                  key={file.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={multiple ? isSelected : undefined}
                  aria-label={`Select ${file.name}`}
                  onClick={handleSelect}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSelect();
                    }
                  }}
                  className={`group relative border rounded-md overflow-hidden text-left transition-colors flex flex-col h-full cursor-pointer ${
                    isSelected
                      ? "border-white ring-1 ring-white bg-surface"
                      : "border-line bg-surface hover:border-white/40"
                  }`}
                >
                  {multiple && (
                    <span
                      className={`absolute right-2 top-2 z-10 flex h-5 w-5 items-center justify-center rounded-full border ${
                        isSelected
                          ? "border-foreground bg-foreground text-background"
                          : "border-line bg-surface text-transparent"
                      }`}
                    >
                      <Check size={12} weight="bold" />
                    </span>
                  )}
                  <div className="relative w-full flex-1 bg-background flex items-center justify-center">
                    {kind === "video" ? (
                      <FilmSlate size={32} className="text-muted" />
                    ) : kind === "pdf" ? (
                      <FileText size={32} className="text-muted" />
                    ) : kind === "other" ? (
                      <File size={32} className="text-muted" />
                    ) : (
                      <Image
                        src={file.thumbnailUrl}
                        alt={file.name}
                        fill
                        sizes="180px"
                        className="object-cover"
                        unoptimized
                      />
                    )}
                  </div>

                  {/* Action Bar overlay */}
                  <div className="absolute top-2 right-2 z-20 flex gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMoveFile(file);
                      }}
                      title="Move File"
                      className="flex h-7 w-7 items-center justify-center rounded-md bg-surface text-muted hover:bg-surface-hover hover:text-foreground border border-line shadow-sm transition-colors cursor-pointer"
                    >
                      <ArrowsOut size={14} />
                    </button>
                  </div>

                  <div className="w-full font-mono text-xs text-muted px-2.5 py-1.5 truncate shrink-0 bg-surface border-t border-line">
                    {file.name}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Multi-select footer */}
        {multiple && (
          <div className="px-6 py-3.5 border-t border-line flex items-center justify-between shrink-0 bg-surface/30">
            <span className="font-mono text-xs text-muted">
              {selected.size} selected
            </span>
            <button
              type="button"
              disabled={selected.size === 0}
              onClick={() => {
                const items = Array.from(selected.values()).map((file) => ({
                  url: file.url,
                  fileId: file.id,
                  type: getMediaKind(file),
                }));
                onSelectMultiple?.(items);
                onClose();
              }}
              className="rounded-md bg-foreground px-5 py-2 font-sans text-xs font-semibold text-background hover:bg-white disabled:opacity-40 cursor-pointer transition-colors"
            >
              Add {selected.size > 0 ? selected.size : ""} Media
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
