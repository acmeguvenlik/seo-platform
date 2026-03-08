import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

async function getBlogPost(slug: string, locale: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/blog/posts?locale=${locale}&slug=${slug}&status=PUBLISHED&limit=1`, {
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) {
      return null;
    }
    
    const data = await res.json();
    return data.posts?.[0] || null;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const post = await getBlogPost(slug, locale);
  
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }
  
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt,
      images: post.ogImage ? [post.ogImage] : post.featuredImage ? [post.featuredImage.url] : [],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug, locale } = await params;
  const post = await getBlogPost(slug, locale);
  
  if (!post) {
    notFound();
  }

  return (
    <article className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-gray-600">
          <Link href={`/${locale}`} className="hover:underline">Home</Link>
          {' / '}
          <Link href={`/${locale}/blog`} className="hover:underline">Blog</Link>
          {post.category && (
            <>
              {' / '}
              <Link href={`/${locale}/blog/category/${post.category.slug}`} className="hover:underline">
                {post.category.name}
              </Link>
            </>
          )}
          {' / '}
          <span>{post.title}</span>
        </nav>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="relative w-full h-96 mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.featuredImage.url}
              alt={post.featuredImage.altText}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Title and Meta */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex items-center gap-4 text-gray-600">
            {post.author && <span>By {post.author.name}</span>}
            <span>•</span>
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString()}
            </time>
            <span>•</span>
            <span>{post.readingTime} min read</span>
            <span>•</span>
            <span>{post.viewCount} views</span>
          </div>

          {/* Category and Tags */}
          <div className="mt-4 flex flex-wrap gap-2">
            {post.category && (
              <Link
                href={`/${locale}/blog/category/${post.category.slug}`}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm hover:bg-blue-200"
              >
                {post.category.name}
              </Link>
            )}
            {post.tags?.map((tag: any) => (
              <Link
                key={tag.id}
                href={`/${locale}/blog/tag/${tag.slug}`}
                className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm hover:bg-gray-200"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </header>

        {/* Content */}
        <div 
          className="prose prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Author Info */}
        {post.author && (
          <div className="border-t pt-8 mb-12">
            <h3 className="text-xl font-semibold mb-2">About the Author</h3>
            <p className="text-gray-600">{post.author.name}</p>
          </div>
        )}
      </div>
    </article>
  );
}
