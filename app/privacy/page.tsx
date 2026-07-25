import type { Metadata } from "next";

// Generic, template-level policy scoped to this marketing site (thesocialhood.in) only —
// not the client CRM portal, which has its own data-handling agreements per client.
// Have this reviewed by counsel before treating it as a compliance document.

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How The SocialHood collects, uses, and protects information submitted through this website.",
  alternates: {
    canonical: "https://thesocialhood.in/privacy",
  },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <main className="bg-black min-h-screen py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-4xl md:text-5xl font-light text-white mb-4">
          Privacy Policy
        </h1>
        <p className="text-white/40 text-sm mb-16">Last updated: July 2026</p>

        <div className="space-y-10 text-white/60 font-body leading-relaxed">
          <section>
            <h2 className="font-display text-2xl text-white mb-3">Information We Collect</h2>
            <p>
              When you use the contact form, book a call, or otherwise reach out through this
              website, we collect the information you provide — typically your name, email,
              phone number, company, and the details of your message. We also use standard
              analytics tools (such as Google Analytics) that collect anonymized usage data like
              pages visited and general location.
            </p>
          </section>
          <section>
            <h2 className="font-display text-2xl text-white mb-3">How We Use It</h2>
            <p>
              We use the information you submit to respond to your inquiry, schedule
              consultations, and follow up about our services. We do not sell your information
              to third parties.
            </p>
          </section>
          <section>
            <h2 className="font-display text-2xl text-white mb-3">Third-Party Services</h2>
            <p>
              This site uses third-party tools including Google Analytics (usage analytics) and
              Calendly (scheduling), each governed by their own privacy policies.
            </p>
          </section>
          <section>
            <h2 className="font-display text-2xl text-white mb-3">Data Retention & Your Rights</h2>
            <p>
              We retain inquiry information only as long as needed to respond to you or as
              required for legitimate business purposes. You can request access to, correction
              of, or deletion of your information at any time by emailing us.
            </p>
          </section>
          <section>
            <h2 className="font-display text-2xl text-white mb-3">Contact</h2>
            <p>
              Questions about this policy: {" "}
              <a href="mailto:team@thesocialhood.in" className="text-[#00B98E] hover:underline">
                team@thesocialhood.in
              </a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
