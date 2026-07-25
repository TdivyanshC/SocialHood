import type { Metadata } from "next";

// Generic, template-level terms scoped to use of this marketing website. Actual service
// engagements are governed by separate signed contracts/SOWs, not this page.
// Have this reviewed by counsel before treating it as a compliance document.

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing use of thesocialhood.in.",
  alternates: {
    canonical: "https://thesocialhood.in/terms",
  },
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <main className="bg-black min-h-screen py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-4xl md:text-5xl font-light text-white mb-4">
          Terms of Service
        </h1>
        <p className="text-white/40 text-sm mb-16">Last updated: July 2026</p>

        <div className="space-y-10 text-white/60 font-body leading-relaxed">
          <section>
            <h2 className="font-display text-2xl text-white mb-3">Use of This Site</h2>
            <p>
              This website provides information about The SocialHood's services. Content on this
              site — including copy, graphics, and portfolio material — is the property of The
              SocialHood and may not be reproduced without permission.
            </p>
          </section>
          <section>
            <h2 className="font-display text-2xl text-white mb-3">Service Engagements</h2>
            <p>
              Descriptions of services, pricing, timelines, and results on this site are general
              and illustrative. Any actual engagement — scope, deliverables, pricing, and
              guarantees — is governed exclusively by a separate signed agreement between The
              SocialHood and the client.
            </p>
          </section>
          <section>
            <h2 className="font-display text-2xl text-white mb-3">No Warranty</h2>
            <p>
              This site and its content are provided "as is" without warranties of any kind. We
              make reasonable efforts to keep information accurate and up to date but do not
              guarantee it.
            </p>
          </section>
          <section>
            <h2 className="font-display text-2xl text-white mb-3">Governing Law</h2>
            <p>These terms are governed by the laws of India, with courts in Delhi having jurisdiction.</p>
          </section>
          <section>
            <h2 className="font-display text-2xl text-white mb-3">Contact</h2>
            <p>
              Questions about these terms: {" "}
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
