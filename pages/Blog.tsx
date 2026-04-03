
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { supabase } from '../lib/supabase';
import { Loader2, ArrowRight, Calendar, Clock } from 'lucide-react';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string | null;
  category: string;
  author: string;
  published_at: string;
}

const readTime = (excerpt: string) => `${Math.max(3, Math.ceil(excerpt.length / 200))} min read`;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const BlogCard: React.FC<{ post: BlogPost; featured?: boolean }> = ({ post, featured }) => (
  <Link
    to={`/blog/${post.slug}`}
    className={`group flex flex-col h-full glass-panel rounded-[3.5rem] border-white/5 transition-all duration-700 hover:border-white/20 hover:-translate-y-4 shadow-2xl hover:shadow-[0_40px_100px_rgba(92,124,255,0.15)] overflow-hidden ${featured ? 'lg:flex-row' : ''}`}
  >
    <div className={`relative overflow-hidden ${featured ? 'lg:w-1/2 h-72 lg:h-auto' : 'h-64'}`}>
      <img
        src={post.cover_image || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200'}
        alt={post.title}
        className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.7] group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-[1500ms] ease-out"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050614] via-[#050614]/60 to-transparent" />
      <div className="absolute top-6 left-6">
        <span className="text-[10px] font-black px-3 py-1 rounded-full bg-clarity-blue text-white uppercase tracking-widest">
          {post.category}
        </span>
      </div>
    </div>

    <div className={`p-10 lg:p-12 flex flex-col flex-grow ${featured ? 'lg:w-1/2 justify-center' : ''}`}>
      <h3 className={`font-black text-white mb-4 tracking-tight leading-tight group-hover:text-clarity-blue transition-colors duration-500 ${featured ? 'text-3xl lg:text-4xl' : 'text-2xl'}`}>
        {post.title}
      </h3>
      <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6 line-clamp-3">
        {post.excerpt}
      </p>
      <div className="mt-auto flex items-center justify-between">
        <div className="flex items-center gap-4 text-slate-500 text-xs font-bold">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            {formatDate(post.published_at)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            {readTime(post.excerpt)}
          </span>
        </div>
        <span className="text-clarity-blue text-xs font-black uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
          Read <ArrowRight className="w-3 h-3" />
        </span>
      </div>
    </div>
  </Link>
);

const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!supabase) { setLoading(false); return; }
      const { data } = await supabase
        .from('blog_posts')
        .select('id, slug, title, excerpt, cover_image, category, author, published_at')
        .eq('published', true)
        .order('published_at', { ascending: false });
      if (data) setPosts(data);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const [featured, ...rest] = posts;

  return (
    <div className="min-h-screen indigo-gradient selection:bg-blue-500/30 overflow-x-hidden">
      <SEO
        title="Blog | AI Insights & Intelligence"
        description="Expert insights on Agentic AI, automation strategy, and digital transformation from the ClarityWorks Studio team."
        schema={{
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "ClarityWorks Studio Blog",
          "description": "Expert insights on Agentic AI, automation strategy, and digital transformation.",
          "publisher": {
            "@type": "Organization",
            "name": "ClarityWorks Studio",
            "url": "https://clarityworksstudio.com"
          }
        }}
      />

      {/* Hero */}
      <section className="relative pt-48 pb-32 px-6 z-10">
        <div className="fixed top-[-10%] right-[-10%] w-[1000px] h-[1000px] rounded-full pointer-events-none z-0 glow-sphere blur-[150px] bg-blue-600/5" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full mb-12">
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded bg-clarity-blue text-white tracking-widest uppercase shadow-[0_0_20px_rgba(92,124,255,0.4)]">Knowledge Hub</span>
            <span className="text-xs font-bold text-slate-400 tracking-tight uppercase tracking-widest">Insights & Analysis</span>
          </div>
          <h1 className="text-6xl lg:text-9xl font-black tracking-tighter text-gradient mb-12 leading-[0.9]">
            Insights & <br /><span className="italic text-clarity-blue">Intelligence.</span>
          </h1>
          <p className="text-xl lg:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed font-medium">
            Practical perspectives on Agentic AI, automation strategy, and the future of human + AI collaboration.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="relative z-10 pb-40 px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center py-32">
              <Loader2 className="w-8 h-8 text-clarity-blue animate-spin" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-32">
              <p className="text-slate-500 text-lg font-medium">No articles published yet. Check back soon.</p>
            </div>
          ) : (
            <>
              {/* Featured Post */}
              {featured && (
                <div className="mb-16">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-clarity-blue mb-6 block">Latest Article</span>
                  <BlogCard post={featured} featured />
                </div>
              )}

              {/* Grid */}
              {rest.length > 0 && (
                <>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-clarity-blue mb-6 block">More Articles</span>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {rest.map(post => (
                      <BlogCard key={post.id} post={post} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white text-slate-900 relative z-20 rounded-t-[5rem] py-32 shadow-[0_-50px_100px_rgba(0,0,0,0.3)]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-clarity-blue mb-6 block">Get Started</span>
          <h2 className="text-5xl lg:text-7xl font-black tracking-tighter mb-8">Ready for <span className="italic text-clarity-blue">Clarity?</span></h2>
          <p className="text-slate-500 text-xl font-medium mb-12 leading-relaxed">
            Discover how Agentic AI can transform your operations with a free readiness assessment.
          </p>
          <Link to="/ai-assessment" className="inline-flex items-center gap-4 bg-slate-900 text-white px-12 py-6 rounded-2xl font-black text-lg hover:bg-clarity-blue transition-all shadow-2xl">
            Free AI Assessment
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Blog;
