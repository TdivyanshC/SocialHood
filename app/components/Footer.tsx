"use client";

import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { name: "Services", href: "/services" },
    { name: "About", href: "/about" },
    { name: "Work", href: "/work" },
    { name: "Contact", href: "/contact" },
  ];

  const companyLinks = [
    { name: "About Us", href: "/about" },
    { name: "Our Work", href: "/work" },
    { name: "Services", href: "/services" },
    { name: "Contact", href: "/contact" },
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
    <footer className="bg-black border-t border-white/5 py-20 px-6 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-[#00ff41]/5 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-gradient-to-l from-[#00ff41]/3 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="font-display text-2xl text-gold block mb-6">
              The SocialHood Company
            </Link>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              India's most culturally wired social media agency. We combine
              creativity, technology, and strategy to grow your brand.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-[#00ff41] transition-colors"
                  aria-label={link.name}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs tracking-[0.2em] text-[#00ff41] uppercase mb-6 font-body">
              Navigation
            </h4>
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs tracking-[0.2em] text-[#00ff41] uppercase mb-6 font-body">
              Company
            </h4>
            <ul className="space-y-4">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs tracking-[0.2em] text-[#00ff41] uppercase mb-6 font-body">
              Get in Touch
            </h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li>
                <a
                  href="mailto:hello@thesocialhood.com"
                  className="hover:text-white transition-colors"
                >
                  hello@thesocialhood.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+919999999999"
                  className="hover:text-white transition-colors"
                >
                  +91 99999 99999
                </a>
              </li>
              <li className="pt-2">
                <p className="text-white/40">
                  Mumbai, India
                </p>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs">
            © {currentYear} The SocialHood Company. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-white/30 hover:text-white/60 text-xs transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-white/30 hover:text-white/60 text-xs transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
