import { MDXProvider } from "@mdx-js/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CMC from "../blog/coinmarketcap.mdx";
import { components } from "../components/MDXComponents";

interface BlogPost {
  title: string;
  slug: string;
  content: string;
  snippet: string;
}

const POSTS = {
  coinmarketcap: (
    <MDXProvider components={components}>
      <CMC />
    </MDXProvider>
  ),
};

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // This will be replaced with actual MDX imports
    const importAll = async () => {
      const mdxFiles = import.meta.glob("/src/blog/*.mdx", {
        eager: true,
        as: "raw",
      });

      const blogPosts = Object.entries(mdxFiles).map(([path, content]) => {
        const fileName = path.split("/").pop()?.replace(".mdx", "") || "";
        const titleMatch = (content as string).match(/# (.*)/);
        const title = titleMatch ? titleMatch[1] : fileName;
        const snippet =
          (content as string)
            .replace(/^#.*$/m, "") // Remove title
            .replace(/[#\[\]*`]/g, "") // Remove markdown syntax
            .trim()
            .slice(0, 150) + "...";

        return {
          title,
          slug: fileName,
          content: content as string,
          snippet,
        };
      });

      setPosts(blogPosts);
    };

    importAll();
  }, []);

  if (slug && POSTS[slug as keyof typeof POSTS]) {
    const MDX_POST = POSTS[slug as keyof typeof POSTS];
    if (!MDX_POST) return <div>Post not found</div>;

    return (
      <div className="max-w-3xl mx-auto p-6">
        <button
          onClick={() => navigate("/blog")}
          className="mb-4 text-blue-500 hover:text-blue-700"
        >
          ← Back to Blog
        </button>
        {MDX_POST}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>
      <div className="grid gap-6">
        {posts.map((post) => (
          <div
            key={post.slug}
            onClick={() => navigate(`/blog/${post.slug}`)}
            className="p-6 border rounded-lg cursor-pointer hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            <p className="text-gray-600">{post.snippet}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
