"use client";

import { useState, useCallback } from "react";

const CA = "AkWT7AEAHdX49GMPyWj88npESkV4o4AG5Lg3NK8spump";

export default function HeroSection() {
  const [copied, setCopied] = useState(false);

  const copyCA = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(CA);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = CA;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-900/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-sol-purple/5 rounded-full blur-[120px]" />

      {/* Animated vertical lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 w-px bg-gradient-to-b from-transparent via-emerald-500/20 to-transparent"
            style={{
              left: `${20 + i * 15}%`,
              height: "100%",
              animationDelay: `${i * 0.7}s`,
              animation: `scan ${4 + i}s linear infinite`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Rank badge */}
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-emerald-700/40 bg-emerald-950/30 animate-[fade-in_0.6s_ease-out]">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-[pulse-glow_2s_ease-in-out_infinite]" />
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Solana&apos;s Trench Army
          </span>
        </div>

        {/* Main Title */}
        <h1
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight mb-6 stencil-text animate-[slide-up_0.8s_ease-out]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          <span className="text-foreground">THE </span>
          <span className="text-gradient-sol">SOLVENGERS</span>
        </h1>

        {/* Narrative Text */}
        <div className="max-w-3xl mx-auto mb-10 animate-[slide-up_0.8s_ease-out_0.2s_both]">
          <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed font-light">
            <span className="text-emerald-400 font-semibold">
              Ansem said he&apos;s assembling a team.
            </span>{" "}
            Now the trenches have a name:{" "}
            <span className="text-white font-bold">Solvengers.</span> We&apos;re
            a cult forming around the exact thing Solana has always been built
            on. Solvengers is that team.{" "}
            <span className="text-gradient-sol font-semibold">
              We&apos;re here to save SOL.
            </span>{" "}
            The avengers on SOL. Solana needed its trench army back.
          </p>
        </div>

        {/* CA Display */}
        <div className="animate-[slide-up_0.8s_ease-out_0.4s_both]">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-3 font-semibold">
            Contract Address
          </p>
          <button
            id="hero-copy-ca"
            onClick={copyCA}
            className="group relative inline-flex items-center gap-3 px-5 py-3.5 sm:px-6 sm:py-4 rounded-xl bg-card border border-border-accent/50 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer max-w-full"
          >
            <code className="text-xs sm:text-sm font-mono text-gray-300 group-hover:text-emerald-300 transition-colors break-all">
              {CA}
            </code>
            <div className="flex-shrink-0">
              {copied ? (
                <svg
                  className="w-5 h-5 text-emerald-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-gray-500 group-hover:text-emerald-400 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              )}
            </div>
            {copied && (
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm text-emerald-400 font-bold tracking-wide">
                Copied to clipboard!
              </span>
            )}
            <div className="absolute inset-0 rounded-xl bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 animate-[slide-up_0.8s_ease-out_0.6s_both]">
          <a
            href="#pfp-generator"
            id="enlist-cta"
            className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-bold uppercase tracking-widest text-sm hover:from-emerald-500 hover:to-cyan-500 transition-all duration-300 hover:shadow-[0_0_30px_rgba(20,241,149,0.3)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            Enlist Now
            <div className="absolute inset-0 rounded-xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </a>
          <a
            href="https://dexscreener.com/solana/3nwntre2gv7huqtb5goi7nnofnoxdbetkqy1djujxedr"
            target="_blank"
            rel="noopener noreferrer"
            id="buy-cta"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-emerald-700/50 text-emerald-400 font-bold uppercase tracking-widest text-sm hover:bg-emerald-950/50 hover:border-emerald-500/50 transition-all duration-300"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            Buy $Solvengers
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-[float_3s_ease-in-out_infinite]">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs uppercase tracking-[0.3em] text-gray-600">
              Scroll
            </span>
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
