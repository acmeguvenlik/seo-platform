'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Search as SearchIcon, Eye, Edit, Trash2 } from 'lucide-react';
import { theme, cn } from '@/lib/theme-classes';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  locale: string;
  status: string;
  viewCount: number;
  publishedAt: string | null;
  createdAt: string;
}

export default function BlogManagementPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    locale: 'en',
    status: '',
    search: '',
  });

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        locale: filter.locale,
        ...(filter.status && { status: filter.status }),
        limit: '50',
      });

      const res = await fetch(`/api/blog/posts?${params}`);
      const data = await res.json();
      
      if (data.success) {
        setPosts(data.posts || []);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const res = await fetch(`/api/blog/posts/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchPosts();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/blog/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        fetchPosts();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const filteredPosts = posts.filter(post => {
    if (filter.search) {
      return post.title.toLowerCase().includes(filter.search.toLowerCase());
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      PUBLISHED: theme.badge.success,
      DRAFT: theme.badge.info,
      SCHEDULED: theme.badge.warning,
      ARCHIVED: theme.badge.error,
    };
    return badges[status] || theme.badge.base;
  };

  return (
    <div className={theme.page.base}>
      <div className={cn(theme.page.container, "py-8")}>
        {/* Header */}
        <div className={cn("flex justify-between items-center mb-8", "fade-up")} style={{ "--index": 0 } as React.CSSProperties}>
          <div>
            <h1 className={theme.text.title}>Blog Management</h1>
            <p className={cn(theme.text.secondary, "mt-2")}>
              Create and manage your blog posts
            </p>
          </div>
          <Link
            href="/en/blog-admin/new"
            className={cn(theme.button.primary, theme.button.withIcon)}
          >
            <Plus className="w-5 h-5" />
            Create New Post
          </Link>
        </div>

        {/* Filters */}
        <div className={cn(theme.card.base, theme.card.padding.md, "mb-6", "fade-up")} style={{ "--index": 1 } as React.CSSProperties}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className={theme.input.label}>Locale</label>
              <select
                value={filter.locale}
                onChange={(e) => setFilter({ ...filter, locale: e.target.value })}
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
              <label className={theme.input.label}>Status</label>
              <select
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                className={theme.input.select}
              >
                <option value="">All</option>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="SCHEDULED">Scheduled</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            <div>
              <label className={theme.input.label}>Search</label>
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={filter.search}
                  onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                  placeholder="Search by title..."
                  className={cn(theme.input.base, "pl-10")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className={cn("grid grid-cols-1 md:grid-cols-4 gap-4 mb-6", "fade-up")} style={{ "--index": 2 } as React.CSSProperties}>
          <div className={theme.stat.card}>
            <div className={theme.stat.label}>Total Posts</div>
            <div className={theme.stat.value}>{posts.length}</div>
          </div>
          <div className={theme.stat.card}>
            <div className={theme.stat.label}>Published</div>
            <div className={cn(theme.stat.value, theme.text.success)}>
              {posts.filter(p => p.status === 'PUBLISHED').length}
            </div>
          </div>
          <div className={theme.stat.card}>
            <div className={theme.stat.label}>Drafts</div>
            <div className={cn(theme.stat.value, theme.text.info)}>
              {posts.filter(p => p.status === 'DRAFT').length}
            </div>
          </div>
          <div className={theme.stat.card}>
            <div className={theme.stat.label}>Total Views</div>
            <div className={theme.stat.value}>
              {posts.reduce((sum, p) => sum + p.viewCount, 0).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Posts Table */}
        <div className={cn(theme.table.container, "fade-up")} style={{ "--index": 3 } as React.CSSProperties}>
          {loading ? (
            <div className="p-8 text-center">
              <div className={cn(theme.loading.spinner, "h-12 w-12 mx-auto")}></div>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className={theme.empty.container}>
              <div className={theme.empty.icon}>
                <SearchIcon className="w-8 h-8" />
              </div>
              <p className={theme.empty.title}>No posts found</p>
              <p className={theme.empty.description}>
                {filter.search || filter.status
                  ? 'Try adjusting your filters'
                  : 'Create your first blog post to get started'}
              </p>
              {!filter.search && !filter.status && (
                <Link
                  href="/en/blog-admin/new"
                  className={cn(theme.button.primary, theme.button.withIcon, "mt-4")}
                >
                  <Plus className="w-4 h-4" />
                  Create New Post
                </Link>
              )}
            </div>
          ) : (
            <table className="w-full">
              <thead className={theme.table.header}>
                <tr>
                  <th className={theme.table.headerCell}>Title</th>
                  <th className={theme.table.headerCell}>Status</th>
                  <th className={theme.table.headerCell}>Locale</th>
                  <th className={theme.table.headerCell}>Views</th>
                  <th className={theme.table.headerCell}>Published</th>
                  <th className={theme.table.headerCell}>Actions</th>
                </tr>
              </thead>
              <tbody className={theme.table.divider}>
                {filteredPosts.map((post) => (
                  <tr key={post.id} className={theme.table.row}>
                    <td className={theme.table.cell}>
                      <div className={cn(theme.text.body, "font-medium")}>{post.title}</div>
                      <div className={cn(theme.text.small, theme.text.muted)}>{post.slug}</div>
                    </td>
                    <td className={theme.table.cell}>
                      <span className={getStatusBadge(post.status)}>
                        {post.status}
                      </span>
                    </td>
                    <td className={theme.table.cell}>
                      <span className={theme.text.mono}>{post.locale.toUpperCase()}</span>
                    </td>
                    <td className={theme.table.cell}>
                      <span className={theme.text.mono}>{post.viewCount.toLocaleString()}</span>
                    </td>
                    <td className={theme.table.cell}>
                      <span className={theme.text.small}>
                        {post.publishedAt
                          ? new Date(post.publishedAt).toLocaleDateString()
                          : '-'}
                      </span>
                    </td>
                    <td className={theme.table.cell}>
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/en/blog-admin/${post.id}/edit`}
                          className={cn(theme.text.accent, "hover:underline inline-flex items-center gap-1")}
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/${post.locale}/blog/${post.slug}`}
                          target="_blank"
                          className={cn(theme.text.success, "hover:underline inline-flex items-center gap-1")}
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className={cn(theme.text.error, "hover:underline inline-flex items-center gap-1")}
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
