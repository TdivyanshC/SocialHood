import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getAllPosts } from "../../lib/blog";

export const metadata: Metadata = {
  // No brand suffix here — the root layout title template appends one.
  title: "Blog: AI Systems & Automation",
  description: "How AI voice agents, WhatsApp automation, and custom systems help businesses scale — insights from The SocialHood.",
  alternates: {
    canonical: "https://thesocialhood.in/blog/",
  },
  openGraph: {
    // OG cards get no title template, so the brand is spelled out here.
    title: "Blog: AI Systems & Automation | The SocialHood",
    description: "How AI voice agents, WhatsApp automation, and custom systems help businesses scale.",
    url: "https://thesocialhood.in/blog/",
    images: ["/opengraph-image"],
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts({ includeDrafts: false });

  return (
    <main className="bg-black min-h-screen">
      <Navbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs tracking-[0.3em] text-[#00B98E] uppercase mb-6 font-body">
            Blog
          </p>
          <h1 className="font-display text-5xl md:text-6xl font-light leading-tight mb-6 text-white">
            AI, Automation &{" "}
            <span className="text-white">Business Growth</span>
          </h1>
          <p className="text-white/50 text-lg max-w-2xl mx-auto font-body">
            How AI voice agents, WhatsApp automation, and custom systems help businesses replace
            manual work with measurable growth.
          </p>
        </div>
      </section>

      <section className="pb-28 px-6">
        <div className="max-w-3xl mx-auto">
          {posts.length === 0 ? (
            <p className="text-center text-white/40 font-body">No posts published yet — check back soon.</p>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex gap-6 rounded-2xl border border-white/5 bg-white/[0.02] p-6 hover:border-[#00B98E]/30 transition-all duration-300"
                >
                  {post.image && (
                    <div className="hidden sm:block relative w-28 h-28 shrink-0 rounded-xl overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="112px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wide text-white/40 font-body">
                      {post.date}
                    </p>
                    <h2 className="mt-2 font-display text-2xl text-white group-hover:text-[#00B98E] transition-colors">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-white/50 text-sm leading-relaxed font-body">
                      {post.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
