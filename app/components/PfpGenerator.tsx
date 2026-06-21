'use client';

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  type DragEvent,
  type ChangeEvent,
} from 'react';

const CANVAS_SIZE = 800;

const DEFAULTS: {
  scale: number;
  offsetX: number;
  offsetY: number;
  rotation: number;
} = {
  scale: 0.7,
  offsetX: 0,
  offsetY: -50,
  rotation: 0,
};

export default function PfpGenerator() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const userImageRef = useRef<HTMLImageElement | null>(null);
  const helmetImageRef = useRef<HTMLImageElement | null>(null);
  const processedHelmetRef = useRef<HTMLCanvasElement | null>(null);

  const [userImage, setUserImage] = useState<string | null>(null);
  const [helmetLoaded, setHelmetLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [scale, setScale] = useState(DEFAULTS.scale);
  const [offsetX, setOffsetX] = useState(DEFAULTS.offsetX);
  const [offsetY, setOffsetY] = useState(DEFAULTS.offsetY);
  const [rotation, setRotation] = useState(DEFAULTS.rotation);

  // Load helmet image on mount and chroma-key out the magenta background
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      helmetImageRef.current = img;

      // Process: remove magenta background via chroma keying
      const offscreen = document.createElement('canvas');
      offscreen.width = img.naturalWidth;
      offscreen.height = img.naturalHeight;
      const offCtx = offscreen.getContext('2d');
      if (offCtx) {
        offCtx.drawImage(img, 0, 0);
        const imageData = offCtx.getImageData(0, 0, offscreen.width, offscreen.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Pure magenta and near-magenta: nuke entirely
          if (r > 150 && g < 160 && b > 150 && (r + b) > (g * 2.5 + 80)) {
            data[i + 3] = 0;
          }
          // Pinkish/purple fringe at edges: fade proportionally
          else if (r > 120 && b > 120 && g < 180 && (r + b) > (g * 2 + 40)) {
            const fringeStrength = Math.min(
              1,
              ((r + b) - g * 2 - 40) / 200
            );
            data[i + 3] = Math.round(data[i + 3] * (1 - fringeStrength));
          }
        }
        offCtx.putImageData(imageData, 0, 0);
        processedHelmetRef.current = offscreen;
      }

      setHelmetLoaded(true);
    };
    img.src = '/assets/helmet.png';
  }, []);

  // Draw function
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw user image (cover fit)
    const uImg = userImageRef.current;
    if (uImg) {
      const imgRatio = uImg.naturalWidth / uImg.naturalHeight;
      const canvasRatio = 1;
      let sx = 0,
        sy = 0,
        sw = uImg.naturalWidth,
        sh = uImg.naturalHeight;

      if (imgRatio > canvasRatio) {
        sw = uImg.naturalHeight;
        sx = (uImg.naturalWidth - sw) / 2;
      } else {
        sh = uImg.naturalWidth;
        sy = (uImg.naturalHeight - sh) / 2;
      }

      ctx.drawImage(uImg, sx, sy, sw, sh, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
    } else {
      // Placeholder background
      ctx.fillStyle = '#161b22';
      ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

      // Grid pattern
      ctx.strokeStyle = '#1a2a1a';
      ctx.lineWidth = 1;
      for (let i = 0; i < CANVAS_SIZE; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, CANVAS_SIZE);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(CANVAS_SIZE, i);
        ctx.stroke();
      }

      // Center crosshair
      ctx.strokeStyle = '#2a3a2a';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(CANVAS_SIZE / 2, 0);
      ctx.lineTo(CANVAS_SIZE / 2, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, CANVAS_SIZE / 2);
      ctx.lineTo(CANVAS_SIZE, CANVAS_SIZE / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Text
      ctx.fillStyle = '#4a6741';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('UPLOAD YOUR PHOTO', CANVAS_SIZE / 2, CANVAS_SIZE / 2 - 15);
      ctx.fillStyle = '#2a3a2a';
      ctx.font = '16px sans-serif';
      ctx.fillText('Drop or click below', CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 20);
    }

    // Draw helmet with transformations (use processed transparent version)
    const hSrc = processedHelmetRef.current || helmetImageRef.current;
    const hImgRaw = helmetImageRef.current;
    if (hSrc && hImgRaw && helmetLoaded) {
      const helmetW = CANVAS_SIZE * scale;
      const helmetH =
        (hImgRaw.naturalHeight / hImgRaw.naturalWidth) * CANVAS_SIZE * scale;

      const cx = CANVAS_SIZE / 2 + offsetX;
      const cy = CANVAS_SIZE / 2 + offsetY;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(hSrc, -helmetW / 2, -helmetH / 2, helmetW, helmetH);
      ctx.restore();
    }
  }, [scale, offsetX, offsetY, rotation, helmetLoaded]);

  // Redraw when controls change or image updates
  useEffect(() => {
    draw();
  }, [draw, userImage]);

  // Handle file selection
  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        userImageRef.current = img;
        setUserImage(dataUrl);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  // Drag & drop handlers
  const handleDragEnter = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  // Download
  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'solvengers-pfp.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, []);

  // Reset
  const handleReset = useCallback(() => {
    setScale(DEFAULTS.scale);
    setOffsetX(DEFAULTS.offsetX);
    setOffsetY(DEFAULTS.offsetY);
    setRotation(DEFAULTS.rotation);
  }, []);

  const controls = [
    {
      label: 'Scale',
      value: scale,
      displayValue: scale.toFixed(2),
      min: 0.3,
      max: 2.0,
      step: 0.01,
      onChange: (v: number) => setScale(v),
    },
    {
      label: 'Position X',
      value: offsetX,
      displayValue: `${offsetX}px`,
      min: -CANVAS_SIZE / 2,
      max: CANVAS_SIZE / 2,
      step: 1,
      onChange: (v: number) => setOffsetX(v),
    },
    {
      label: 'Position Y',
      value: offsetY,
      displayValue: `${offsetY}px`,
      min: -CANVAS_SIZE / 2,
      max: CANVAS_SIZE / 2,
      step: 1,
      onChange: (v: number) => setOffsetY(v),
    },
    {
      label: 'Rotation',
      value: rotation,
      displayValue: `${rotation}°`,
      min: -45,
      max: 45,
      step: 1,
      onChange: (v: number) => setRotation(v),
    },
  ];

  return (
    <section
      id="pfp-generator"
      className="relative py-20 sm:py-28"
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/3 right-0 w-80 h-80 bg-emerald-900/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/3 left-0 w-80 h-80 bg-sol-purple/5 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full border border-emerald-700/40 bg-emerald-950/30">
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
              Enlistment Station
            </span>
          </div>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 stencil-text"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            <span className="text-foreground">JOIN THE TRENCHES — </span>
            <span className="text-gradient-sol">ENLIST NOW</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            Upload your PFP and gear up with the official Solvengers helmet.
            Position it, scale it, and download your battle-ready profile picture.
          </p>
        </div>

        {/* Generator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Column: Canvas & Upload */}
          <div className="flex flex-col gap-5">
            {/* Canvas */}
            <div className="glass-card rounded-2xl p-3 sm:p-4 glow-green">
              <div className="relative">
                <canvas
                  ref={canvasRef}
                  width={CANVAS_SIZE}
                  height={CANVAS_SIZE}
                  className="w-full max-w-[400px] mx-auto aspect-square rounded-xl"
                />
                {/* Corner decorations */}
                <div className="absolute top-1 left-1 w-4 h-4 border-t-2 border-l-2 border-emerald-500/30 rounded-tl-lg pointer-events-none" />
                <div className="absolute top-1 right-1 w-4 h-4 border-t-2 border-r-2 border-emerald-500/30 rounded-tr-lg pointer-events-none" />
                <div className="absolute bottom-1 left-1 w-4 h-4 border-b-2 border-l-2 border-emerald-500/30 rounded-bl-lg pointer-events-none" />
                <div className="absolute bottom-1 right-1 w-4 h-4 border-b-2 border-r-2 border-emerald-500/30 rounded-br-lg pointer-events-none" />
              </div>
            </div>

            {/* Upload Zone */}
            <div
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              id="pfp-upload-zone"
              className={`
                relative cursor-pointer rounded-2xl border-2 border-dashed p-6 sm:p-8
                transition-all duration-300 text-center
                ${
                  isDragging
                    ? 'border-emerald-400 bg-emerald-900/20 scale-[1.02] shadow-[0_0_30px_rgba(20,241,149,0.15)]'
                    : 'border-emerald-700/40 bg-card hover:border-emerald-500/60 hover:bg-card-hover'
                }
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleInputChange}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-3">
                <div className={`p-3 rounded-xl ${isDragging ? 'bg-emerald-500/20' : 'bg-emerald-950/50'} transition-colors`}>
                  <svg
                    className="w-8 h-8 text-emerald-500/70"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-emerald-400 font-bold text-sm uppercase tracking-widest">
                    {userImage ? 'Replace Photo' : 'Drop Your Photo Here'}
                  </p>
                  <p className="text-gray-600 text-xs mt-1">
                    or click to browse • PNG, JPG, WEBP
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Controls */}
          <div className="flex flex-col gap-5">
            {/* Controls Panel */}
            <div className="glass-card rounded-2xl p-5 sm:p-6 flex flex-col gap-5">
              <div className="flex items-center gap-2 border-b border-border-accent/50 pb-4">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-[pulse-glow_2s_ease-in-out_infinite]" />
                <h3 className="text-emerald-400 uppercase tracking-[0.2em] text-xs font-bold">
                  Helmet Controls
                </h3>
              </div>

              {controls.map((ctrl) => (
                <div key={ctrl.label}>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-emerald-400/80 uppercase tracking-widest text-xs font-bold">
                      {ctrl.label}
                    </label>
                    <span className="text-emerald-600 text-xs font-mono bg-emerald-950/50 px-2 py-0.5 rounded">
                      {ctrl.displayValue}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={ctrl.min}
                    max={ctrl.max}
                    step={ctrl.step}
                    value={ctrl.value}
                    onChange={(e) => ctrl.onChange(parseFloat(e.target.value))}
                    className="w-full h-1.5 rounded-full bg-border-accent appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>
              ))}

              {/* Reset */}
              <button
                id="reset-controls"
                onClick={handleReset}
                className="w-full py-2.5 rounded-xl border border-border-accent/50 text-emerald-500/70 text-xs uppercase tracking-[0.2em] font-bold
                           hover:bg-emerald-900/20 hover:border-emerald-700/50 hover:text-emerald-400 transition-all duration-300 cursor-pointer"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset All
                </span>
              </button>
            </div>

            {/* Download Button */}
            <button
              id="download-pfp"
              onClick={handleDownload}
              disabled={!userImage}
              className={`
                group relative w-full py-4 sm:py-5 rounded-2xl text-sm sm:text-base font-black uppercase tracking-[0.25em] transition-all duration-300 cursor-pointer overflow-hidden
                ${
                  userImage
                    ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white hover:shadow-[0_0_40px_rgba(20,241,149,0.3)] hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-card text-gray-700 border border-border-accent/50 cursor-not-allowed'
                }
              `}
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PFP
              </span>
              {userImage && (
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
              )}
            </button>

            {/* Status indicator */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
              <div className={`w-1.5 h-1.5 rounded-full ${userImage ? 'bg-emerald-400' : 'bg-gray-700'}`} />
              <span>{userImage ? 'Photo loaded — ready to deploy' : 'Awaiting photo upload'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
