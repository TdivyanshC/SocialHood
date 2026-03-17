"use client";

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <h3 className="font-display text-2xl text-gold mb-4">
              The SocialHood Company
            </h3>
            <p className="text-white/50 text-sm font-body leading-relaxed max-w-sm mb-6">
              We help businesses grow through premium web development, automation, 
              and result-driven digital marketing strategies.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-white/10 p-3 rounded-full hover:border-[#00ff41] hover:bg-[#00ff41]/10 transition-all duration-300"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-sm text-white mb-6 tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-white/40 hover:text-[#00ff41] transition-colors font-body"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display text-sm text-white mb-6 tracking-wider">
              Get in Touch
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:hello@thesocialhood.in"
                  className="text-sm text-white/40 hover:text-[#00ff41] transition-colors font-body"
                >
                  hello@thesocialhood.in
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/919999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/40 hover:text-[#00ff41] transition-colors font-body"
                >
                  WhatsApp Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/30 font-body">
              © {currentYear} The SocialHood Company. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-xs text-white/30 font-body">
                Technology × Growth × Results
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
