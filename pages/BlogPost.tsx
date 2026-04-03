
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { supabase } from '../lib/supabase';
import { Loader2, ArrowLeft, Calendar, Clock, User, ArrowRight } from 'lucide-react';

interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  category: string;
  author: string;
  published_at: string;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const readTime = (content: string) => `${Math.max(4, Math.ceil(content.split(/\s+/).length / 230))} min read`;

const articleStyles = `
  .blog-article h2 {
    font-size: 1.875rem;
    font-weight: 900;
    letter-spacing: -0.025em;
    color: #0f172a;
    margin-top: 3rem;
    margin-bottom: 1.25rem;
    line-height: 1.2;
    border-bottom: 2px solid #f1f5f9;
    padding-bottom: 0.75rem;
  }
  .blog-article h3 {
    font-size: 1.375rem;
    font-weight: 800;
    color: #1e293b;
    margin-top: 2.25rem;
    margin-bottom: 1rem;
    line-height: 1.3;
  }
  .blog-article p {
    font-size: 1.0625rem;
    line-height: 1.85;
    color: #475569;
    font-weight: 500;
    margin-bottom: 1.5rem;
  }
  .blog-article ul, .blog-article ol {
    margin: 1.25rem 0 1.75rem 0;
    padding-left: 0;
    list-style: none;
  }
  .blog-article li {
    font-size: 1.0625rem;
    line-height: 1.75;
    color: #475569;
    font-weight: 500;
    margin-bottom: 0.75rem;
    padding-left: 1.75rem;
    position: relative;
  }
  .blog-article li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.65rem;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #5c7cff;
  }
  .blog-article strong {
    color: #0f172a;
    font-weight: 800;
  }
  .blog-article a {
    color: #5c7cff;
    text-decoration: none;
    font-weight: 700;
    border-bottom: 1px solid transparent;
    transition: border-color 0.2s;
  }
  .blog-article a:hover {
    border-bottom-color: #5c7cff;
  }
  .blog-article table {
    width: 100%;
    border-collapse: collapse;
    margin: 2rem 0;
    border-radius: 1rem;
    overflow: hidden;
    border: 1px solid #e2e8f0;
  }
  .blog-article thead { background: #f8fafc; }
  .blog-article th {
    padding: 0.875rem 1rem;
    text-align: left;
    font-weight: 900;
    font-size: 0.8125rem;
    color: #334155;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 2px solid #e2e8f0;
  }
  .blog-article td {
    padding: 0.875rem 1rem;
    font-size: 0.9375rem;
    color: #475569;
    border-top: 1px solid #f1f5f9;
    font-weight: 500;
  }
  .blog-article tbody tr:hover { background: #f8fafc; }
  .blog-article blockquote {
    border-left: 4px solid #5c7cff;
    padding: 1rem 1.5rem;
    margin: 2rem 0;
    background: #f8fafc;
    border-radius: 0 1rem 1rem 0;
    font-style: italic;
    color: #334155;
  }
`;

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [related, setRelated] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!supabase || !slug) { setLoading(false); return; }

      const { data } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (!data) { setLoading(false); navigate('/blog'); return; }
      setPost(data);

      const { data: relatedData } = await supabase
        .from('blog_posts')
        .select('id, slug, title, excerpt, cover_image, category, author, published_at')
        .eq('published', true)
        .eq('category', data.category)
        .neq('slug', slug)
        .order('published_at', { ascending: false })
        .limit(3);

      if (relatedData) setRelated(relatedData);
      setLoading(false);
    };
    fetchPost();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen indigo-gradient flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-clarity-blue animate-spin" />
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen indigo-gradient selection:bg-blue-500/30 overflow-x-hidden">
      <style>{articleStyles}</style>
      <SEO
        title={post.title}
        description={post.excerpt}
        schema={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.title,
          "description": post.excerpt,
          "image": post.cover_image || undefined,
          "author": { "@type": "Organization", "name": post.author },
          "publisher": { "@type": "Organization", "name": "ClarityWorks Studio", "logo": { "@type": "ImageObject", "url": "https://clarityworksstudio.com/logo.png" } },
          "datePublished": post.published_at,
          "mainEntityOfPage": `https://clarityworksstudio.com/blog/${post.slug}`
        }}
      />

      {/* Hero */}
      <section className="relative pt-40 pb-20 px-6 z-10 min-h-[60vh] flex items-end">
        {post.cover_image && (
          <>
            <div className="absolute inset-0 z-0">
              <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover grayscale brightness-[0.25]" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#050614] via-[#050614]/85 to-[#050614]/60 z-0" />
          </>
        )}
        <div className="max-w-3xl mx-auto w-full relative z-10">
          <Link to="/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-white text-xs font-black uppercase tracking-widest transition-colors mb-10">
            <ArrowLeft className="w-3.5 h-3.5" />
            All Articles
          </Link>

          <div className="mb-6">
            <span className="text-[10px] font-black px-4 py-1.5 rounded-full bg-clarity-blue/20 text-clarity-blue uppercase tracking-widest border border-clarity-blue/30">
              {post.category}
            </span>
          </div>

          <h1 className="text-4xl lg:text-6xl font-black tracking-tighter text-white mb-8 leading-[1.05]">
            {post.title}
          </h1>

          <p className="text-slate-400 text-lg font-medium leading-relaxed mb-8 max-w-2xl">
            {post.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-5 text-slate-500 text-sm font-bold pt-6 border-t border-white/10">
            <span className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-clarity-blue/20 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-clarity-blue" />
              </div>
              {post.author}
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-700" />
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(post.published_at)}
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-700" />
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {readTime(post.content)}
            </span>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="bg-white text-slate-900 relative z-20 rounded-t-[4rem] py-16 lg:py-24 shadow-[0_-50px_100px_rgba(0,0,0,0.3)]">
        <div className="max-w-3xl mx-auto px-6 lg:px-8">
          <article
            className="blog-article"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* CTA */}
          <div className="mt-20 p-10 lg:p-14 bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-[2.5rem] border border-slate-100 text-center">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-clarity-blue mb-3 block">Next Step</span>
            <h3 className="text-2xl lg:text-3xl font-black mb-4 tracking-tight">Ready to explore Agentic AI?</h3>
            <p className="text-slate-500 font-medium mb-8 max-w-md mx-auto">Take our free AI readiness assessment and get a personalized roadmap for your organization.</p>
            <Link to="/ai-assessment" className="inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-2xl font-black hover:bg-clarity-blue transition-all shadow-xl">
              Free AI Assessment
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {related.length > 0 && (
        <section className="relative z-10 py-32 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-clarity-blue mb-4 block">Keep Reading</span>
              <h2 className="text-5xl font-black tracking-tighter text-white">Related <span className="italic text-clarity-blue">Articles.</span></h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map(p => (
                <Link
                  key={p.id}
                  to={`/blog/${p.slug}`}
                  className="group glass-panel rounded-[2.5rem] border-white/5 transition-all duration-700 hover:border-white/20 hover:-translate-y-3 shadow-xl overflow-hidden flex flex-col"
                >
                  <div className="h-44 relative overflow-hidden">
                    <img
                      src={p.cover_image || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800'}
                      alt={p.title}
                      className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.6] group-hover:grayscale-0 group-hover:brightness-90 group-hover:scale-105 transition-all duration-[1500ms]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050614] via-[#050614]/50 to-transparent" />
                  </div>
                  <div className="p-7 flex-grow flex flex-col">
                    <span className="text-[9px] font-black text-clarity-blue uppercase tracking-widest mb-2">{p.category}</span>
                    <h3 className="text-lg font-black text-white mb-2 tracking-tight leading-tight group-hover:text-clarity-blue transition-colors">{p.title}</h3>
                    <p className="text-slate-500 text-sm font-medium line-clamp-2">{p.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogPost;
