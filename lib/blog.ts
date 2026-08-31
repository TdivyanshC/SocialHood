import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export interface PostSummary {
  slug: string;
  title: string;
  description: string;
  date: string;
  /** Optional `updated:` frontmatter — feeds Article.dateModified and the
   *  sitemap. Falls back to `date` when a post has never been revised. */
  updated: string;
  keyword?: string;
  image: string | null;
  draft: boolean;
}

export interface Post extends PostSummary {
  contentHtml: string;
}

function readPostFile(filename: string) {
  const slug = filename.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf8");
  const { data, content } = matter(raw);

  if (data.slug && data.slug !== slug) {
    console.warn(
      `[blog] frontmatter slug "${data.slug}" in ${filename} does not match filename-derived slug "${slug}" — filename wins for routing.`
    );
  }

  return { slug, data, content };
}

export function getAllPosts({ includeDrafts = false } = {}): PostSummary[] {
  if (!fs.existsSync(BLOG_DIR)) return [];

  const filenames = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".md"));

  return filenames
    .map((filename) => {
      const { slug, data } = readPostFile(filename);
      return {
        slug,
        title: data.title,
        description: data.description,
        date: data.date,
        updated: data.updated || data.date,
        keyword: data.keyword,
        image: data.image || null,
        draft: Boolean(data.draft),
      };
    })
    .filter((post) => includeDrafts || !post.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const { data, content } = readPostFile(`${slug}.md`);
  const contentHtml = remark().use(remarkGfm).use(remarkHtml).processSync(content).toString();

  return {
    slug,
    title: data.title,
    description: data.description,
    date: data.date,
    updated: data.updated || data.date,
    keyword: data.keyword,
    image: data.image || null,
    draft: Boolean(data.draft),
    contentHtml,
  };
}
