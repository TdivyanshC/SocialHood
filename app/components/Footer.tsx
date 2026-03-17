"use client";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { name: "Services", href: "#services" },
    { name: "About", href: "#about" },
    { name: "Pricing", href: "#pricing" },
    { name: "Contact", href: "#contact" },
  ];

  const socialLinks = [
    {
      name: "Instagram",
      href: "https://instagram.com",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="18" cy="6" r="1" fill="currentColor" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <rect x="2" y="2" width="20" height="20" rx="2" />
          <path d="M8 11v5M8 8v.01M12 16v-5c0-1 1-2 2-2s2 1 2 2v5" />
        </svg>
      ),
    },
    {
      name: "X",
      href: "https://twitter.com",
      icon: (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M4 4l11.733 16h4.267l-11.733-16zM4 20l6.4-8M20 4l-6.4 8" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="border-t border-white/5 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
          {/* Logo */}
          <div>
            <h3 className="font-display text-xl text-gold mb-2">
              The SocialHood Company
            </h3>
            <p className="text-xs text-white/30 font-body">
              India's most culturally wired agency
            </p>
          </div>

          {/* Links */}
          <div className="flex justify-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs tracking-widest text-white/40 hover:text-white transition-colors font-body"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Social */}
          <div className="flex justify-end gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-white/10 p-2 rounded-full hover:border-gold transition-colors"
                aria-label={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/5">
          <p className="text-xs text-white/20 text-center font-body">
            © {currentYear} The SocialHood Company. All rights reserved. |{" "}
            thesocialhood.in
          </p>
        </div>
      </div>
    </footer>
  );
}
