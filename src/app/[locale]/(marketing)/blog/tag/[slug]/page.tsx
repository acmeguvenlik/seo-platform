import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

async function getTagPosts(slug: string, locale: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    
    // Get tag first
    const tagsRes = await fetch(`${baseUrl}/api/blog/tags?locale=${locale}`, {
      next: { revalidate: 3600 }
    });
    
    if (!tagsRes.ok) return null;
    
    const tagsData = await tagsRes.json();
    const tag = tagsData.tags?.find((t: any) => t.slug === slug);
    
    if (!tag) return null;
    
    // Get posts for this tag
    const postsRes = await fetch(
      `${baseUrl}/api/blog/posts?locale=${locale}&tagId=${tag.id}&status=PUBLISHED&limit=12`,
      { next: { revalidate: 3600 } }
    );
    
    if (!postsRes.ok) return null;
    
    const postsData = await postsRes.json();
    
    return {
      tag,
      posts: postsData.posts || [],
      total: postsData.total || 0,
    };
  } catch (error) {
    console.error('Error fetching tag posts:', error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const data = await getTagPosts(slug, locale);
  
  if (!data) {
    return { title: 'Tag Not Found' };
  }
  
  return {
    title: `${data.tag.name} - Blog`,
    description: `Articles tagged with ${data.tag.name}`,
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const data = await getTagPosts(slug, locale);
  
  if (!data) {
    notFound();
  }

  const { tag, posts, total } = data;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <nav className="mb-8 text-sm text-gray-600">
          <Link href={`/${locale}`} className="hover:underline">Home</Link>
          {' / '}
          <Link href={`/${locale}/blog`} className="hover:underline">Blog</Link>
          {' / '}
          <span>Tag: {tag.name}</span>
        </nav>

        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Tag: {tag.name}</h1>
          <p className="text-sm text-gray-500">{total} posts</p>
        </div>
        
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No posts with this tag yet.</p>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
