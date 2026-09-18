"use client";

import { useRef, useState } from "react";
import { Camera, Upload, Loader2, CheckCircle2 } from "lucide-react";
import clsx from "clsx";
import { api } from "@/lib/api";

export function FileUpload({
  label,
  value,
  onChange,
  rounded,
  hint,
}: {
  label: string;
  value?: string | null;
  onChange: (url: string) => void;
  rounded?: boolean;
  hint?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);

  async function handleFile(file: File) {
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const { data } = await api.post("/auth/upload-file", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange(data.url);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="w-full">
      <p className="block text-sm font-medium mb-1.5 text-ink dark:text-white/90">{label}</p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={clsx(
          "relative w-full border-2 border-dashed transition-colors overflow-hidden flex flex-col items-center justify-center gap-2 text-center",
          rounded ? "aspect-square rounded-full max-w-[140px] mx-auto" : "aspect-[16/10] rounded-2xl",
          preview ? "border-transparent" : "border-ink/15 dark:border-white/15 hover:border-primary hover:bg-primary/5"
        )}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt={label} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <>
            {rounded ? <Camera className="w-6 h-6 text-ink/30 dark:text-white/30" /> : <Upload className="w-6 h-6 text-ink/30 dark:text-white/30" />}
            <span className="text-xs text-ink/40 dark:text-white/40 px-4">{hint || "Cliquer pour choisir un fichier"}</span>
          </>
        )}

        {uploading && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
        )}
        {preview && !uploading && (
          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-success flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4 text-white" />
          </div>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </div>
  );
}
