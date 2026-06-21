"use client";

export default function Footer() {
  const socialLinks = [
    {
      name: "X / Twitter",
      href: "https://x.com/i/communities/2016055275208298666",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "DexScreener",
      href: "https://dexscreener.com/solana/3nwntre2gv7huqtb5goi7nnofnoxdbetkqy1djujxedr",
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      ),
    },
  ];

  return (
    <footer
      id="footer"
      className="relative border-t border-border-accent/30 bg-card/50"
    >
      {/* Top decorative line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col items-center gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src="/assets/logo.png"
              alt="Solvengers"
              className="w-8 h-8 rounded-lg object-cover"
            />
            <span
              className="text-xl font-black tracking-wider text-foreground stencil-text"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              SOLVENGERS
            </span>
          </div>

          {/* Tagline */}
          <p className="text-sm text-gray-500 text-center max-w-md">
            The avengers on SOL. Solana needed its trench army back.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                id={`social-${link.name.toLowerCase().replace(/[\s\/]/g, "-")}`}
                className="group flex items-center gap-2 px-5 py-3 rounded-xl border border-border-accent/50 bg-card hover:border-emerald-500/50 hover:bg-card-hover transition-all duration-300"
              >
                <span className="text-gray-500 group-hover:text-emerald-400 transition-colors">
                  {link.icon}
                </span>
                <span className="text-sm font-semibold text-gray-400 group-hover:text-emerald-400 transition-colors hidden sm:inline">
                  {link.name}
                </span>
              </a>
            ))}
          </div>

          {/* Divider */}
          <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-border-accent to-transparent" />

          {/* Bottom */}
          <div className="flex flex-col sm:flex-row items-center gap-2 text-xs text-gray-600">
            <span>© 2025 The Solvengers</span>
            <span className="hidden sm:inline">·</span>
            <span>Built in the trenches, for the trenches</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
