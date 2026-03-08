'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewBlogPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    locale: 'en',
    status: 'DRAFT',
    seoTitle: '',
    seoDescription: '',
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/blog/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Post created successfully!');
        router.push('/en/blog');
      } else {
        alert(data.error || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create New Blog Post</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                  className="w-full border rounded px-3 py-2"
                  placeholder="Enter post title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Slug *</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                  className="w-full border rounded px-3 py-2"
                  placeholder="post-slug"
                />
                <p className="text-sm text-gray-500 mt-1">
                  URL-friendly version of the title
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Excerpt</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={3}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Brief summary of the post..."
                  maxLength={500}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.excerpt.length}/500 characters
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Locale *</label>
                  <select
                    value={formData.locale}
                    onChange={(e) => setFormData({ ...formData, locale: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="en">English</option>
                    <option value="tr">Turkish</option>
                    <option value="de">German</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="DRAFT">Draft</option>
                    <option value="PUBLISHED">Published</option>
                    <option value="SCHEDULED">Scheduled</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Content</h2>
            <div>
              <label className="block text-sm font-medium mb-2">Content (Markdown) *</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
                rows={20}
                className="w-full border rounded px-3 py-2 font-mono text-sm"
                placeholder="Write your content in Markdown format..."
              />
              <p className="text-sm text-gray-500 mt-1">
                Supports Markdown formatting: **bold**, *italic*, ## headings, [links](url), etc.
              </p>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">SEO Settings</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">SEO Title</label>
                <input
                  type="text"
                  value={formData.seoTitle}
                  onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Leave empty to use post title"
                  maxLength={60}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.seoTitle.length}/60 characters (optimal: 50-60)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">SEO Description</label>
                <textarea
                  value={formData.seoDescription}
                  onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                  rows={3}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Leave empty to use excerpt"
                  maxLength={160}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {formData.seoDescription.length}/160 characters (optimal: 120-160)
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
