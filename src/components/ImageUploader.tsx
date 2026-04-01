"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";

interface Props {
  images: string[];
  onChange: (urls: string[]) => void;
}

export default function ImageUploader({ images, onChange }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      // Try Cloudinary first, fallback to local upload
      let res = await fetch("/api/upload", { method: "POST", body: formData });

      if (res.ok) {
        const { urls } = await res.json();
        onChange([...images, ...urls]);
      } else {
        // Fallback: upload each file locally
        const newUrls: string[] = [];
        for (let i = 0; i < files.length; i++) {
          const localForm = new FormData();
          localForm.append("file", files[i]);
          const localRes = await fetch("/api/upload-local", { method: "POST", body: localForm });
          if (localRes.ok) {
            const { url } = await localRes.json();
            newUrls.push(url);
          }
        }
        if (newUrls.length > 0) onChange([...images, ...newUrls]);
        else throw new Error("Upload failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="text-xs tracking-[0.2em] uppercase text-luxury-text block mb-2">
        Product Images
      </label>

      {/* Preview */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mb-3">
          {images.map((url, i) => (
            <div key={i} className="relative aspect-[3/4] bg-pastel-cream overflow-hidden group">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 text-[8px] bg-accent text-white px-1.5 py-0.5 tracking-wider uppercase">
                  Main
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        className={`border-2 border-dashed border-pastel-rose p-6 text-center cursor-pointer hover:border-accent transition-colors ${
          uploading ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        {uploading ? (
          <div className="flex items-center justify-center gap-2 text-sm text-luxury-text">
            <Loader2 size={16} className="animate-spin" />
            Uploading...
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload size={20} className="text-accent" />
            <p className="text-xs text-luxury-text">
              Click to upload images
            </p>
            <p className="text-[10px] text-luxury-text/40">
              JPG, PNG, WebP — Max 5MB each
            </p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleUpload}
        className="hidden"
      />

      {/* Manual URL input fallback */}
      <details className="mt-2">
        <summary className="text-[10px] text-luxury-text/40 cursor-pointer hover:text-accent">
          Or paste image URLs manually
        </summary>
        <textarea
          value={images.join("\n")}
          onChange={(e) =>
            onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))
          }
          rows={3}
          placeholder="https://example.com/image.jpg"
          className="w-full mt-2 border border-pastel-rose px-4 py-3 text-xs focus:outline-none focus:border-accent bg-luxury-light resize-none font-mono"
        />
      </details>

      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
}
