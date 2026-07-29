import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getAllPosts, getPostBySlug } from "../../../lib/blog";

export function generateStaticParams() {
  return getAllPosts({ includeDrafts: false }).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const metadata: Metadata = {
    // Just post.title, no manual "| The SocialHood" suffix — the root
    // layout's title template already appends it once; the old manual
    // suffix here doubled it (caught by a live SEO audit, 2026-07-29,
    // which flagged every single post's rendered title as too long for
    // Google's ~70-char SERP display guideline).
    title: post.title,
    description: post.description,
    ...(post.keyword ? { keywords: [post.keyword] } : {}),
    alternates: { canonical: `https://thesocialhood.in/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      url: `https://thesocialhood.in/blog/${post.slug}`,
      ...(post.image ? { images: [{ url: post.image }] } : {}),
    },
  };

  if (post.draft) {
    metadata.robots = { index: false, follow: false };
  }

  return metadata;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: "The SocialHood" },
    ...(post.image ? { image: post.image } : {}),
  };

  return (
    <main className="bg-black min-h-screen">
      <Navbar />
      <article className="pt-32 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          {post.draft && (
            <p className="mb-6 rounded-xl border border-[#00B98E]/30 bg-[#00B98E]/10 px-4 py-2 text-sm text-[#00B98E] font-body">
              Draft — not published, not indexed, not linked from the blog index.
            </p>
          )}
          <p className="text-xs uppercase tracking-wide text-white/40 font-body">{post.date}</p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-light leading-tight text-white">
            {post.title}
          </h1>
          {post.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.image} alt="" className="mt-8 w-full rounded-2xl object-cover" />
          )}
          <div
            className="blog-content mt-8 text-white/70 font-body leading-relaxed [&_h2]:font-display [&_h2]:text-white [&_h2]:text-2xl [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:font-display [&_h3]:text-white [&_h3]:text-xl [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:text-[#00B98E] [&_a]:hover:underline [&_table]:w-full [&_table]:my-6 [&_th]:border [&_th]:border-white/10 [&_th]:p-3 [&_th]:text-white [&_td]:border [&_td]:border-white/10 [&_td]:p-3 [&_strong]:text-white"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
        </div>
      </article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Footer />
    </main>
  );
}
