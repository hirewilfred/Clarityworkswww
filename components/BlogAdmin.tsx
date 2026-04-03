
import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, Plus, Save, Trash2, Eye, EyeOff, Pencil, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    cover_image: string | null;
    category: string;
    author: string;
    published: boolean;
    published_at: string | null;
    created_at: string;
}

const CATEGORIES = ['Agentic AI', 'Strategy', 'Automation', 'Case Study', 'Industry Insights'];

const slugify = (text: string) =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const BlogAdmin: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<BlogPost | null>(null);
    const [creating, setCreating] = useState(false);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        title: '', slug: '', excerpt: '', content: '', cover_image: '', category: 'Agentic AI', author: 'ClarityWorks Studio', published: false,
    });

    const fetchPosts = useCallback(async () => {
        if (!supabase) return;
        setLoading(true);
        const { data } = await supabase
            .from('blog_posts')
            .select('*')
            .order('created_at', { ascending: false });
        if (data) setPosts(data);
        setLoading(false);
    }, []);

    useEffect(() => { fetchPosts(); }, [fetchPosts]);

    const resetForm = () => {
        setForm({ title: '', slug: '', excerpt: '', content: '', cover_image: '', category: 'Agentic AI', author: 'ClarityWorks Studio', published: false });
        setEditing(null);
        setCreating(false);
    };

    const openCreate = () => {
        resetForm();
        setCreating(true);
    };

    const openEdit = (post: BlogPost) => {
        setForm({
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            cover_image: post.cover_image || '',
            category: post.category,
            author: post.author,
            published: post.published,
        });
        setEditing(post);
        setCreating(true);
    };

    const handleSave = async () => {
        if (!supabase || !form.title || !form.excerpt || !form.content) return;
        setSaving(true);

        const slug = form.slug || slugify(form.title);
        const payload = {
            title: form.title,
            slug,
            excerpt: form.excerpt,
            content: form.content,
            cover_image: form.cover_image || null,
            category: form.category,
            author: form.author,
            published: form.published,
            published_at: form.published ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
        };

        if (editing) {
            await supabase.from('blog_posts').update(payload).eq('id', editing.id);
        } else {
            await supabase.from('blog_posts').insert(payload);
        }

        resetForm();
        setSaving(false);
        fetchPosts();
    };

    const handleDelete = async (id: string) => {
        if (!supabase || !confirm('Delete this post permanently?')) return;
        await supabase.from('blog_posts').delete().eq('id', id);
        fetchPosts();
    };

    const togglePublish = async (post: BlogPost) => {
        if (!supabase) return;
        const published = !post.published;
        await supabase.from('blog_posts').update({
            published,
            published_at: published ? new Date().toISOString() : null,
            updated_at: new Date().toISOString(),
        }).eq('id', post.id);
        fetchPosts();
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-black text-white">Blog Posts ({posts.length})</h2>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-500 transition-all"
                >
                    <Plus className="h-4 w-4" /> New Post
                </button>
            </div>

            {/* Create / Edit Form */}
            {creating && (
                <div className="backdrop-blur-xl bg-slate-900/60 rounded-2xl border border-white/10 p-6 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">{editing ? 'Edit Post' : 'New Post'}</h3>
                        <button onClick={resetForm} className="text-slate-500 hover:text-white"><X className="h-4 w-4" /></button>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Title</label>
                            <input
                                value={form.title}
                                onChange={e => { setForm(f => ({ ...f, title: e.target.value, slug: editing ? f.slug : slugify(e.target.value) })); }}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-medium focus:border-blue-500 focus:outline-none"
                                placeholder="Article title..."
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Slug</label>
                            <input
                                value={form.slug}
                                onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-medium font-mono focus:border-blue-500 focus:outline-none"
                                placeholder="url-friendly-slug"
                            />
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-4">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Category</label>
                            <select
                                value={form.category}
                                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-medium focus:border-blue-500 focus:outline-none"
                            >
                                {CATEGORIES.map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Author</label>
                            <input
                                value={form.author}
                                onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-medium focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Cover Image URL</label>
                            <input
                                value={form.cover_image}
                                onChange={e => setForm(f => ({ ...f, cover_image: e.target.value }))}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-medium focus:border-blue-500 focus:outline-none"
                                placeholder="https://images.unsplash.com/..."
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Excerpt</label>
                        <textarea
                            value={form.excerpt}
                            onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                            rows={2}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-medium focus:border-blue-500 focus:outline-none resize-none"
                            placeholder="Short description for listing cards..."
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Content (HTML)</label>
                        <textarea
                            value={form.content}
                            onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                            rows={12}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white font-mono focus:border-blue-500 focus:outline-none resize-y"
                            placeholder="<h2>Section Title</h2><p>Content here...</p>"
                        />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.published}
                                onChange={e => setForm(f => ({ ...f, published: e.target.checked }))}
                                className="w-4 h-4 rounded border-white/20 bg-white/5 text-blue-600 focus:ring-blue-500/50"
                            />
                            <span className="text-sm font-bold text-slate-300">Publish immediately</span>
                        </label>
                        <button
                            onClick={handleSave}
                            disabled={saving || !form.title || !form.content}
                            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-500 transition-all disabled:opacity-40"
                        >
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            {editing ? 'Update' : 'Save'}
                        </button>
                    </div>
                </div>
            )}

            {/* Posts List */}
            {loading ? (
                <div className="flex items-center justify-center h-40"><Loader2 className="h-6 w-6 text-blue-500 animate-spin" /></div>
            ) : posts.length === 0 ? (
                <div className="text-center py-16 text-slate-500 text-sm font-medium">No blog posts yet. Click "New Post" to create your first article.</div>
            ) : (
                <div className="backdrop-blur-xl bg-slate-900/40 rounded-2xl border border-white/5 overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/5">
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Title</th>
                                <th className="px-4 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Category</th>
                                <th className="px-4 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-4 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date</th>
                                <th className="px-4 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {posts.map(post => (
                                <tr key={post.id} className="hover:bg-white/2 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-white text-sm">{post.title}</div>
                                        <div className="text-slate-500 text-xs font-mono mt-0.5">/blog/{post.slug}</div>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className="text-xs font-bold text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg">{post.category}</span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={`text-xs font-black uppercase tracking-widest ${post.published ? 'text-emerald-400' : 'text-amber-400'}`}>
                                            {post.published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-xs text-slate-500 font-medium">
                                        {new Date(post.published_at || post.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => togglePublish(post)} className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors" title={post.published ? 'Unpublish' : 'Publish'}>
                                                {post.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                            <button onClick={() => openEdit(post)} className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors" title="Edit">
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => handleDelete(post.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors" title="Delete">
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </motion.div>
    );
};

export default BlogAdmin;
