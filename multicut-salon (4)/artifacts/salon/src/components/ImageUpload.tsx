import { useRef, useState } from "react";
import { uploadImage } from "@/lib/hooks";
import { Button } from "@/components/ui/button";
import { Upload, X, Image } from "lucide-react";

interface ImageUploadProps {
  bucket: string;
  folder?: string;
  currentUrl?: string;
  onUploaded: (url: string) => void;
  className?: string;
  aspect?: "square" | "video" | "free";
}

export default function ImageUpload({ bucket, folder, currentUrl, onUploaded, className = "", aspect = "video" }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(currentUrl || "");
  const [error, setError] = useState("");

  const aspectClass = aspect === "square" ? "aspect-square" : aspect === "video" ? "aspect-video" : "min-h-[120px]";

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) { setError("Please select an image file"); return; }
    if (file.size > 10 * 1024 * 1024) { setError("File must be under 10MB"); return; }
    setError("");
    setLoading(true);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    try {
      const url = await uploadImage(bucket, file, folder);
      setPreview(url);
      onUploaded(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Check Supabase Storage buckets.");
      setPreview(currentUrl || "");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className={className}>
      <div
        className={`relative ${aspectClass} rounded-xl border-2 border-dashed border-border bg-secondary/30 overflow-hidden cursor-pointer hover:border-primary/50 transition-colors group`}
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
      >
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="text-white text-center text-sm font-medium">
                <Upload className="w-6 h-6 mx-auto mb-1" />
                Change Image
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground p-4">
            {loading ? (
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Image className="w-8 h-8 opacity-40" />
                <div className="text-center">
                  <p className="text-sm font-medium">Click or drag to upload</p>
                  <p className="text-xs opacity-60 mt-1">PNG, JPG, WEBP up to 10MB</p>
                </div>
              </>
            )}
          </div>
        )}
        {loading && (
          <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      {error && <p className="text-xs text-destructive mt-1.5">{error}</p>}
      {preview && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-2 text-xs text-muted-foreground hover:text-destructive px-0"
          onClick={e => {
            e.stopPropagation();
            setPreview("");
            onUploaded("");
          }}
        >
          <X className="w-3 h-3 mr-1" /> Remove image
        </Button>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
    </div>
  );
}
