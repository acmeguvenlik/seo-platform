import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Blog - SEO Tools Platform',
  description: 'Latest articles about SEO, digital marketing, and web optimization',
};

async function getBlogPosts(locale: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/blog/posts?locale=${locale}&status=PUBLISHED&limit=12`, {
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) {
      return { posts: [], total: 0, page: 1, totalPages: 0 };
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return { posts: [], total: 0, page: 1, totalPages: 0 };
  }
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { posts, total } = await getBlogPosts(locale);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No blog posts available yet.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post: any) => (
                <article key={post.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  {post.featuredImage && (
                    <Link href={`/${locale}/blog/${post.slug}`}>
                      <div className="relative h-48 w-full">
                        <Image
                          src={post.featuredImage.url}
                          alt={post.featuredImage.altText}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </Link>
                  )}
                  
                  <div className="p-6">
                    {post.category && (
                      <Link 
                        href={`/${locale}/blog/category/${post.category.slug}`}
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {post.category.name}
                      </Link>
                    )}
                    
                    <h2 className="text-xl font-semibold mt-2 mb-3">
                      <Link href={`/${locale}/blog/${post.slug}`} className="hover:text-blue-600">
                        {post.title}
                      </Link>
                    </h2>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{post.readingTime} min read</span>
                      <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-gray-600">Showing {posts.length} of {total} posts</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
