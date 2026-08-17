"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, FilmSlate, CaretLeft, CaretRight } from "@phosphor-icons/react";
import AssetSelector from "@/components/admin/AssetSelector";
import { createProject, updateProject } from "@/lib/actions/project.action";
import type { IProject } from "@/database";

type MediaItem = { url: string; fileId: string; type: "image" | "video" };

const FIELD_CLASS =
  "mt-2 w-full rounded-xl bg-[#f4f4f2] px-4 py-3 font-sans text-base text-foreground outline-none focus:bg-[#eeeeec]";

export default function ProjectForm({ project }: { project?: IProject }) {
  const router = useRouter();
  const isEdit = !!project;

  const [title, setTitle] = useState(project?.title ?? "");
  const [label, setLabel] = useState(project?.label ?? "");
  const [challenge, setChallenge] = useState(project?.challenge ?? "");
  const [whatWeBuilt, setWhatWeBuilt] = useState(project?.whatWeBuilt ?? "");
  const [howItWorks, setHowItWorks] = useState(project?.howItWorks ?? "");
  const [outcome, setOutcome] = useState(project?.outcome ?? "");
  const [liveUrl, setLiveUrl] = useState(project?.liveUrl ?? "");
  const [featured, setFeatured] = useState(project?.featured ?? false);
  const [order, setOrder] = useState(project?.order ?? 0);
  const [media, setMedia] = useState<MediaItem[]>(project?.media ?? []);

  const [assetSelectorOpen, setAssetSelectorOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    const params = {
      title,
      label,
      challenge,
      whatWeBuilt,
      howItWorks,
      outcome,
      liveUrl: liveUrl || undefined,
      featured,
      order,
      media,
    };

    const result = isEdit
      ? await updateProject({ id: String(project._id), ...params })
      : await createProject(params);

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error?.message ?? "Something went wrong.");
      return;
    }

    router.push("/admin/work");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label className="font-sans text-sm font-semibold text-foreground">
            Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={FIELD_CLASS}
            placeholder="Project title"
          />
        </div>
        <div>
          <label className="font-sans text-sm font-semibold text-foreground">
            Label
          </label>
          <input
            type="text"
            required
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className={FIELD_CLASS}
            placeholder="e.g. Product Experiment"
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="font-sans text-sm font-semibold text-foreground">
          The challenge
        </label>
        <textarea
          required
          rows={3}
          value={challenge}
          onChange={(e) => setChallenge(e.target.value)}
          className={`${FIELD_CLASS} resize-none`}
        />
      </div>

      <div className="mt-6">
        <label className="font-sans text-sm font-semibold text-foreground">
          What we built
        </label>
        <textarea
          required
          rows={3}
          value={whatWeBuilt}
          onChange={(e) => setWhatWeBuilt(e.target.value)}
          className={`${FIELD_CLASS} resize-none`}
        />
      </div>

      <div className="mt-6">
        <label className="font-sans text-sm font-semibold text-foreground">
          How it works
        </label>
        <textarea
          required
          rows={3}
          value={howItWorks}
          onChange={(e) => setHowItWorks(e.target.value)}
          className={`${FIELD_CLASS} resize-none`}
        />
      </div>

      <div className="mt-6">
        <label className="font-sans text-sm font-semibold text-foreground">
          The outcome
        </label>
        <textarea
          required
          rows={3}
          value={outcome}
          onChange={(e) => setOutcome(e.target.value)}
          className={`${FIELD_CLASS} resize-none`}
        />
      </div>

      <div className="mt-6">
        <label className="font-sans text-sm font-semibold text-foreground">
          Media
        </label>
        <p className="mt-1 font-sans text-sm text-muted">
          Add one or more images and videos. The first item is used as the
          cover; drag order with the arrows below.
        </p>

        {media.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-4 sm:grid-cols-4">
            {media.map((item, i) => (
              <div
                key={item.fileId}
                className="relative aspect-square overflow-hidden rounded-lg bg-[#f4f4f2]"
              >
                {item.type === "video" ? (
                  <div className="flex h-full w-full items-center justify-center">
                    <FilmSlate size={28} className="text-muted" />
                  </div>
                ) : (
                  <Image
                    src={item.url}
                    alt=""
                    fill
                    sizes="180px"
                    className="object-cover"
                    unoptimized
                  />
                )}

                <button
                  type="button"
                  onClick={() =>
                    setMedia((prev) => prev.filter((_, j) => j !== i))
                  }
                  className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
                >
                  <X size={12} />
                </button>

                <div className="absolute inset-x-1 bottom-1 flex items-center justify-between">
                  <button
                    type="button"
                    disabled={i === 0}
                    onClick={() =>
                      setMedia((prev) => {
                        const next = [...prev];
                        [next[i - 1], next[i]] = [next[i], next[i - 1]];
                        return next;
                      })
                    }
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white disabled:opacity-30"
                  >
                    <CaretLeft size={12} />
                  </button>
                  <button
                    type="button"
                    disabled={i === media.length - 1}
                    onClick={() =>
                      setMedia((prev) => {
                        const next = [...prev];
                        [next[i + 1], next[i]] = [next[i], next[i + 1]];
                        return next;
                      })
                    }
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white disabled:opacity-30"
                  >
                    <CaretRight size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => setAssetSelectorOpen(true)}
          className="mt-4 rounded-full border border-foreground/15 px-4 py-2 font-sans text-sm font-semibold text-foreground transition-colors hover:border-accent hover:text-accent"
        >
          {media.length > 0 ? "Add more media" : "Choose media"}
        </button>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <label className="font-sans text-sm font-semibold text-foreground">
            Live URL
          </label>
          <input
            type="url"
            value={liveUrl}
            onChange={(e) => setLiveUrl(e.target.value)}
            className={FIELD_CLASS}
            placeholder="https://…"
          />
        </div>
        <div>
          <label className="font-sans text-sm font-semibold text-foreground">
            Sort order
          </label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            className={FIELD_CLASS}
          />
        </div>
      </div>

      <label className="mt-6 flex w-fit items-center gap-2.5">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="h-4 w-4 accent-accent"
        />
        <span className="font-sans text-sm font-semibold text-foreground">
          Featured
        </span>
      </label>

      {error && <p className="mt-6 font-sans text-sm text-accent">{error}</p>}

      <div className="mt-10 flex items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex rounded-full bg-primary px-7 py-3.5 font-sans text-sm font-semibold text-white disabled:opacity-50"
        >
          {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Create project"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/work")}
          className="font-sans text-sm font-semibold text-muted hover:text-foreground"
        >
          Cancel
        </button>
      </div>

      <AssetSelector
        isOpen={assetSelectorOpen}
        onClose={() => setAssetSelectorOpen(false)}
        accept="all"
        multiple
        onSelectMultiple={(items) =>
          setMedia((prev) => {
            const existingIds = new Set(prev.map((item) => item.fileId));
            return [
              ...prev,
              ...items.filter((item) => !existingIds.has(item.fileId)),
            ];
          })
        }
      />
    </form>
  );
}
