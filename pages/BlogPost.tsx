
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

const readTime = (content: string) => `${Math.max(3, Math.ceil(content.split(/\s+/).length / 250))} min read`;

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

      // Fetch related posts in the same category
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

      {/* Hero with Cover Image */}
      <section className="relative pt-40 pb-24 px-6 z-10">
        {post.cover_image && (
          <>
            <div className="absolute inset-0 z-0">
              <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover grayscale brightness-[0.3]" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#050614]/80 via-[#050614]/90 to-[#050614] z-0" />
          </>
        )}
        <div className="max-w-4xl mx-auto relative z-10">
          <Link to="/blog" className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors mb-12">
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          <div className="mb-8">
            <span className="text-[10px] font-black px-3 py-1 rounded-full bg-clarity-blue text-white uppercase tracking-widest">
              {post.category}
            </span>
          </div>

          <h1 className="text-4xl lg:text-7xl font-black tracking-tighter text-gradient mb-8 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-slate-400 text-sm font-bold">
            <span className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {formatDate(post.published_at)}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {readTime(post.content)}
            </span>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="bg-white text-slate-900 relative z-20 rounded-t-[5rem] py-20 lg:py-32 shadow-[0_-50px_100px_rgba(0,0,0,0.3)]">
        <div className="max-w-3xl mx-auto px-6">
          <article
            className="prose prose-lg prose-slate max-w-none
              prose-headings:font-black prose-headings:tracking-tight
              prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
              prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4
              prose-p:text-slate-600 prose-p:leading-relaxed prose-p:font-medium
              prose-li:text-slate-600 prose-li:font-medium
              prose-strong:text-slate-900
              prose-a:text-clarity-blue prose-a:no-underline hover:prose-a:underline
              prose-table:border-collapse prose-th:bg-slate-100 prose-th:p-3 prose-th:text-left prose-th:font-black prose-th:text-sm
              prose-td:p-3 prose-td:border-t prose-td:border-slate-200 prose-td:text-sm"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* CTA within article */}
          <div className="mt-16 p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 text-center">
            <h3 className="text-2xl font-black mb-4">Ready to explore Agentic AI for your organization?</h3>
            <p className="text-slate-500 font-medium mb-8">Take our free AI readiness assessment and get a personalized roadmap.</p>
            <Link to="/ai-assessment" className="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-clarity-blue transition-all shadow-xl">
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {related.map(p => (
                <Link
                  key={p.id}
                  to={`/blog/${p.slug}`}
                  className="group glass-panel rounded-[3.5rem] border-white/5 transition-all duration-700 hover:border-white/20 hover:-translate-y-4 shadow-2xl overflow-hidden flex flex-col"
                >
                  <div className="h-48 relative overflow-hidden">
                    <img
                      src={p.cover_image || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800'}
                      alt={p.title}
                      className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.7] group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-[1500ms]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050614] via-[#050614]/60 to-transparent" />
                  </div>
                  <div className="p-8 flex-grow flex flex-col">
                    <span className="text-[10px] font-black text-clarity-blue uppercase tracking-widest mb-3">{p.category}</span>
                    <h3 className="text-xl font-black text-white mb-3 tracking-tight leading-tight group-hover:text-clarity-blue transition-colors">{p.title}</h3>
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
