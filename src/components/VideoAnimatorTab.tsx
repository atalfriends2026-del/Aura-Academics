import React, { useState } from "react";
import { Film, Upload, Sparkles, Download, RefreshCw, AlertCircle, Play, CheckCircle2 } from "lucide-react";

export const VideoAnimatorTab: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16">("16:9");
  const [generating, setGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        setErrorMessage("Image file size should be less than 15MB.");
        return;
      }
      setSelectedFile(file);
      setErrorMessage(null);

      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateVideo = async () => {
    if (!imagePreview) {
      setErrorMessage("Please upload an image or study diagram to animate.");
      return;
    }

    setGenerating(true);
    setVideoUrl(null);
    setErrorMessage(null);
    setStatusMessage("Submitting animation task to Veo 3.1 Fast AI...");

    try {
      const base64Data = imagePreview.split(",")[1];
      const mimeType = imagePreview.split(";")[0].replace("data:", "");

      // 1. Submit video generation job
      const res = await fetch("/api/ai/generate-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt || "Animate this academic study illustration smoothly with subtle motion and cinematic lighting.",
          imageBase64: base64Data,
          imageMimeType: mimeType,
          aspectRatio,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.operationName) {
        throw new Error(data.error || "Failed to start video generation.");
      }

      const operationName = data.operationName;
      setStatusMessage("Veo AI is rendering video frames (this may take a short moment)...");

      // 2. Poll for video completion
      let isDone = false;
      let attempts = 0;
      const maxAttempts = 60; // 5 minutes max

      while (!isDone && attempts < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
        attempts++;

        setStatusMessage(`Rendering video... (${attempts * 5}s elapsed)`);

        const statusRes = await fetch("/api/ai/video-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ operationName }),
        });

        const statusData = await statusRes.json();
        if (statusData.done) {
          isDone = true;
          if (statusData.error) {
            throw new Error(statusData.error.message || "Video generation failed during processing.");
          }
        }
      }

      if (!isDone) {
        throw new Error("Video rendering timed out. Please try again.");
      }

      // 3. Download generated video stream
      setStatusMessage("Downloading generated HD video...");
      const downloadRes = await fetch("/api/ai/video-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationName }),
      });

      if (!downloadRes.ok) {
        throw new Error("Failed to retrieve generated video file.");
      }

      const blob = await downloadRes.blob();
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      setStatusMessage("Video animation ready!");
    } catch (err: any) {
      console.error("Video Generation Error:", err);
      setErrorMessage(err.message || "An unexpected error occurred during video generation.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Title Header */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-indigo-900 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Film className="w-48 h-48" />
        </div>
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 text-indigo-100 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Veo 3.1 Fast Video AI</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black">
            Animate Study Materials into Video
          </h1>
          <p className="text-xs md:text-sm text-indigo-100 leading-relaxed">
            Upload any photo, diagram, lecture slide, or historical figure and transform it into a fluid 720p HD video using model <span className="font-semibold underline">veo-3.1-fast-generate-preview</span>.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Upload & Controls */}
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-6 rounded-3xl border border-white/50 dark:border-slate-800/50 shadow-sm space-y-5">
          <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
            <Upload className="w-4 h-4 text-indigo-500" />
            <span>1. Upload Photo & Configure</span>
          </h2>

          {/* Image Upload Box */}
          <label className="block w-full border-2 border-dashed border-indigo-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50 dark:bg-slate-800/50">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {imagePreview ? (
              <div className="space-y-3">
                <img
                  src={imagePreview}
                  alt="Upload preview"
                  className="max-h-48 mx-auto rounded-xl object-contain border border-slate-200 dark:border-slate-700 shadow-md"
                />
                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  {selectedFile?.name} (Click to change)
                </p>
              </div>
            ) : (
              <div className="space-y-2 py-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-300 flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Drop image here or click to browse
                </p>
                <p className="text-[10px] text-slate-400">
                  Supports PNG, JPG, WebP up to 15MB
                </p>
              </div>
            )}
          </label>

          {/* Motion Prompt */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Animation Prompt (Optional)
              </label>
              <span className="text-[10px] text-slate-400">Veo 3.1 Fast</span>
            </div>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Smooth slow-motion camera pan across the study scene with warm natural light..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {/* Prompt Template Chips */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 block">
                Standard Safe Prompt Templates:
              </span>
              <div className="flex flex-col gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setPrompt("Cinematic wide shot of a calm forest path during golden hour, sunbeams filtering through dense green leaves, subtle wind moving the foliage, smooth slow-motion camera pan.")}
                  className="p-2 text-left rounded-lg bg-indigo-50/70 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-900 dark:text-indigo-200 border border-indigo-200/50 dark:border-indigo-800/50 transition-colors"
                >
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">Option 1 (Cinematic Motion):</span> Cinematic wide shot of a calm path during golden hour, smooth slow-motion camera pan.
                </button>

                <button
                  type="button"
                  onClick={() => setPrompt("A stylized red sports car driving along an open coastal highway at sunset, dynamic camera tracking alongside the vehicle, realistic lighting, highly detailed.")}
                  className="p-2 text-left rounded-lg bg-indigo-50/70 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-900 dark:text-indigo-200 border border-indigo-200/50 dark:border-indigo-800/50 transition-colors"
                >
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">Option 2 (Subject & Action):</span> Stylized sports car driving along coastal highway at sunset, dynamic camera tracking.
                </button>

                <button
                  type="button"
                  onClick={() => setPrompt("Abstract fluid art, blue and metallic gold ink swirling together smoothly in slow motion, macro close-up, high definition.")}
                  className="p-2 text-left rounded-lg bg-indigo-50/70 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-900 dark:text-indigo-200 border border-indigo-200/50 dark:border-indigo-800/50 transition-colors"
                >
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">Option 3 (Abstract Visual):</span> Abstract fluid art, blue & gold ink swirling smoothly in macro close-up slow motion.
                </button>
              </div>
            </div>
          </div>

          {/* Aspect Ratio Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Aspect Ratio
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAspectRatio("16:9")}
                className={`py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                  aspectRatio === "16:9"
                    ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                }`}
              >
                <div className="w-4 h-2.5 border-2 border-current rounded-xs" />
                <span>16:9 (Landscape)</span>
              </button>

              <button
                type="button"
                onClick={() => setAspectRatio("9:16")}
                className={`py-2.5 px-4 rounded-xl border text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                  aspectRatio === "9:16"
                    ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300"
                    : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                }`}
              >
                <div className="w-2.5 h-4 border-2 border-current rounded-xs" />
                <span>9:16 (Portrait)</span>
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className={`p-3.5 rounded-xl text-xs font-semibold flex flex-col space-y-2 border ${
              errorMessage.includes("Quota") || errorMessage.includes("Rate Limit")
                ? "bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200"
                : "bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-300"
            }`}>
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="flex-1">{errorMessage}</span>
              </div>
              {(errorMessage.includes("Quota") || errorMessage.includes("Rate Limit")) && (
                <div className="pt-1 flex items-center justify-between text-[11px] text-amber-700 dark:text-amber-300">
                  <span>💡 Tip: Video generation models share per-minute API quotas.</span>
                  <button
                    type="button"
                    onClick={handleGenerateVideo}
                    disabled={generating}
                    className="px-2.5 py-1 rounded-lg bg-amber-600 text-white font-bold hover:bg-amber-500 transition-colors"
                  >
                    Retry Now
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Generate Button */}
          <button
            onClick={handleGenerateVideo}
            disabled={generating || !imagePreview}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white flex items-center justify-center space-x-2 shadow-lg shadow-indigo-500/20 disabled:opacity-50 transition-all"
          >
            {generating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{statusMessage || "Generating Video..."}</span>
              </>
            ) : (
              <>
                <Film className="w-4 h-4" />
                <span>Generate Video with Veo AI</span>
              </>
            )}
          </button>
        </div>

        {/* Output Video Section */}
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl p-6 rounded-3xl border border-white/50 dark:border-slate-800/50 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center space-x-2 mb-4">
              <Play className="w-4 h-4 text-purple-500" />
              <span>2. Rendered Video Preview</span>
            </h2>

            {videoUrl ? (
              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl flex items-center justify-center">
                  <video
                    src={videoUrl}
                    controls
                    autoPlay
                    loop
                    className="w-full max-h-80 object-contain"
                  />
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between">
                  <span className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Rendered successfully with Veo 3.1</span>
                  </span>
                  <a
                    href={videoUrl}
                    download="aura-study-animation.mp4"
                    className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-500 transition-colors flex items-center space-x-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download MP4</span>
                  </a>
                </div>
              </div>
            ) : generating ? (
              <div className="min-h-[260px] rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center animate-bounce shadow-lg">
                  <Film className="w-6 h-6 animate-pulse" />
                </div>
                <p className="text-xs font-extrabold text-indigo-600 dark:text-indigo-300">
                  {statusMessage}
                </p>
                <p className="text-[11px] text-slate-400 max-w-xs">
                  Veo Video Generation utilizes neural frame interpolation to bring static photos to life.
                </p>
              </div>
            ) : (
              <div className="min-h-[260px] rounded-2xl bg-slate-50 dark:bg-slate-800/30 border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center p-6 text-center space-y-2">
                <Film className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  No video generated yet
                </p>
                <p className="text-[11px] text-slate-400 max-w-xs">
                  Upload an image on the left and click "Generate Video with Veo AI" to preview here.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Troubleshooting & Best Practices Guide */}
      <div className="p-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl border border-white/50 dark:border-slate-800/50 shadow-sm space-y-3">
        <h3 className="text-xs font-black uppercase text-slate-900 dark:text-white flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-amber-500" />
          <span>Troubleshooting & Prompt Best Practices</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-slate-600 dark:text-slate-400">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">
              1. Remove Flagged Wording
            </span>
            <p>Ensure your prompt does not contain public figures, copyrighted characters/brands, or sensitive themes that trigger AI safety filters.</p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">
              2. Strip Audio Commands
            </span>
            <p>Veo video generation focuses on visual animation. If asking for complex dialogue or sound effects, strip audio instructions and generate silently first.</p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">
              3. Simplify Prompt Length
            </span>
            <p>Avoid long paragraphs or conflicting commands. Stick to a clean format: <span className="font-semibold text-indigo-500">Subject + Action + Environment + Camera Motion</span>.</p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <span className="font-bold text-slate-800 dark:text-slate-200 block">
              4. Quota & Rate Limits (429)
            </span>
            <p>If you encounter quota limits or rate limit errors, wait a minute before submitting a new video job to allow API quotas to reset.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
