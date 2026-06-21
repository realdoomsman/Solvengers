"use client";

import { useState, useCallback } from "react";

const CA = "AkWT7AEAHdX49GMPyWj88npESkV4o4AG5Lg3NK8spump";

export default function Header() {
  const [copied, setCopied] = useState(false);

  const copyCA = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(CA);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
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
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border-accent/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="relative">
              <img
                src="/assets/logo.png"
                alt="Solvengers"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg object-cover"
              />
              <div className="absolute -inset-1 rounded-lg bg-gradient-to-br from-emerald-600/20 to-cyan-600/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span
              className="text-lg sm:text-xl font-black tracking-wider text-foreground stencil-text"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              SOLVENGERS
            </span>
          </a>

          {/* Navigation Links (hidden on mobile, visible on md+) */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#about"
              className="text-sm font-semibold uppercase tracking-widest text-gray-400 hover:text-emerald-400 transition-colors duration-300"
            >
              Mission
            </a>
            <a
              href="#pfp-generator"
              className="text-sm font-semibold uppercase tracking-widest text-gray-400 hover:text-emerald-400 transition-colors duration-300"
            >
              Enlist
            </a>
            <a
              href="#footer"
              className="text-sm font-semibold uppercase tracking-widest text-gray-400 hover:text-emerald-400 transition-colors duration-300"
            >
              Links
            </a>
          </nav>

          {/* Copy CA Button */}
          <button
            id="copy-ca-button"
            onClick={copyCA}
            className="relative group flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg bg-card border border-border-accent/50 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer"
          >
            <span className="text-xs sm:text-sm font-mono text-gray-400 group-hover:text-emerald-400 transition-colors hidden sm:inline">
              {CA.slice(0, 6)}...{CA.slice(-4)}
            </span>
            <span className="text-xs font-mono text-gray-400 group-hover:text-emerald-400 transition-colors sm:hidden">
              Copy CA
            </span>
            <div className="flex items-center">
              {copied ? (
                <svg
                  className="w-4 h-4 text-emerald-400"
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
                  className="w-4 h-4 text-gray-500 group-hover:text-emerald-400 transition-colors"
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
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-emerald-400 font-semibold whitespace-nowrap animate-[fade-in_0.2s_ease-out]">
                Copied!
              </span>
            )}
            <div className="absolute inset-0 rounded-lg bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
      </div>
    </header>
  );
}
