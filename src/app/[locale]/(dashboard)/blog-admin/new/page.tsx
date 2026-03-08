'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { theme, cn } from '@/lib/theme-classes';

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
        router.push('/en/blog-admin');
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
    <div className={theme.page.base}>
      <div className={cn(theme.page.container, "py-8")}>
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className={cn("mb-8", "fade-up")} style={{ "--index": 0 } as React.CSSProperties}>
            <button
              onClick={() => router.back()}
              className={cn(theme.button.ghost, theme.button.withIcon, "mb-4")}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog Management
            </button>
            <h1 className={theme.text.title}>Create New Blog Post</h1>
            <p className={cn(theme.text.secondary, "mt-2")}>
              Write and publish a new blog post
            </p>
          </div>

          <form onSubmit={handleSubmit} className={theme.spacing.section}>
            {/* Basic Info */}
            <div className={cn(theme.card.base, theme.card.padding.md, "fade-up")} style={{ "--index": 1 } as React.CSSProperties}>
              <h2 className={cn(theme.text.heading, "mb-6")}>Basic Information</h2>

              <div className={theme.spacing.stack}>
                <div>
                  <label className={theme.input.label}>Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    required
                    className={theme.input.base}
                    placeholder="Enter post title..."
                  />
                </div>

                <div>
                  <label className={theme.input.label}>Slug *</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    className={theme.input.base}
                    placeholder="post-slug"
                  />
                  <p className={theme.input.helper}>
                    URL-friendly version of the title
                  </p>
                </div>

                <div>
                  <label className={theme.input.label}>Excerpt</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    rows={3}
                    className={theme.input.textarea}
                    placeholder="Brief summary of the post..."
                    maxLength={500}
                  />
                  <p className={theme.input.helper}>
                    {formData.excerpt.length}/500 characters
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={theme.input.label}>Locale *</label>
                    <select
                      value={formData.locale}
                      onChange={(e) => setFormData({ ...formData, locale: e.target.value })}
                      className={theme.input.select}
                    >
                      <option value="en">English</option>
                      <option value="tr">Turkish</option>
                      <option value="de">German</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>

                  <div>
                    <label className={theme.input.label}>Status *</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className={theme.input.select}
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
            <div className={cn(theme.card.base, theme.card.padding.md, "fade-up")} style={{ "--index": 2 } as React.CSSProperties}>
              <h2 className={cn(theme.text.heading, "mb-6")}>Content</h2>
              <div>
                <label className={theme.input.label}>Content (Markdown) *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  rows={20}
                  className={cn(theme.input.textarea, "font-mono text-sm")}
                  placeholder="Write your content in Markdown format..."
                />
                <p className={theme.input.helper}>
                  Supports Markdown formatting: **bold**, *italic*, ## headings, [links](url), etc.
                </p>
              </div>
            </div>

            {/* SEO */}
            <div className={cn(theme.card.base, theme.card.padding.md, "fade-up")} style={{ "--index": 3 } as React.CSSProperties}>
              <h2 className={cn(theme.text.heading, "mb-6")}>SEO Settings</h2>

              <div className={theme.spacing.stack}>
                <div>
                  <label className={theme.input.label}>SEO Title</label>
                  <input
                    type="text"
                    value={formData.seoTitle}
                    onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                    className={theme.input.base}
                    placeholder="Leave empty to use post title"
                    maxLength={60}
                  />
                  <p className={cn(
                    theme.input.helper,
                    formData.seoTitle.length > 60 ? theme.text.error : ""
                  )}>
                    {formData.seoTitle.length}/60 characters (optimal: 50-60)
                  </p>
                </div>

                <div>
                  <label className={theme.input.label}>SEO Description</label>
                  <textarea
                    value={formData.seoDescription}
                    onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                    rows={3}
                    className={theme.input.textarea}
                    placeholder="Leave empty to use excerpt"
                    maxLength={160}
                  />
                  <p className={cn(
                    theme.input.helper,
                    formData.seoDescription.length > 160 ? theme.text.error : ""
                  )}>
                    {formData.seoDescription.length}/160 characters (optimal: 120-160)
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className={cn("flex justify-end gap-4", "fade-up")} style={{ "--index": 4 } as React.CSSProperties}>
              <button
                type="button"
                onClick={() => router.back()}
                className={theme.button.secondary}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={cn(theme.button.primary, theme.button.withIcon)}
              >
                <Save className="w-4 h-4" />
                {loading ? 'Creating...' : 'Create Post'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
