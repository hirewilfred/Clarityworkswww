
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { supabase } from '../lib/supabase';
import { Loader2, ArrowRight, Calendar, Clock, User } from 'lucide-react';

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

const readTime = (excerpt: string) => `${Math.max(4, Math.ceil(excerpt.length / 150))} min read`;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const FeaturedCard: React.FC<{ post: BlogPost }> = ({ post }) => (
  <Link
    to={`/blog/${post.slug}`}
    className="group relative flex flex-col lg:flex-row h-auto lg:h-[480px] glass-panel rounded-[3.5rem] border-white/5 transition-all duration-700 hover:border-white/20 shadow-2xl hover:shadow-[0_40px_100px_rgba(92,124,255,0.15)] overflow-hidden"
  >
    {/* Image */}
    <div className="relative lg:w-3/5 h-72 lg:h-full overflow-hidden">
      <img
        src={(!post.cover_image || post.cover_image.includes('unsplash')) ? '/images/blog_featured_fallback.png' : post.cover_image}
        alt={post.title}
        className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.6] group-hover:grayscale-0 group-hover:brightness-90 group-hover:scale-105 transition-all duration-[2000ms] ease-out"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#050614]/90 hidden lg:block" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050614] via-[#050614]/40 to-transparent lg:hidden" />
      <div className="absolute top-8 left-8">
        <span className="text-[10px] font-black px-4 py-1.5 rounded-full bg-clarity-blue text-white uppercase tracking-widest shadow-lg shadow-blue-600/30">
          Featured
        </span>
      </div>
    </div>

    {/* Content */}
    <div className="lg:w-2/5 p-10 lg:p-14 flex flex-col justify-center">
      <span className="text-[10px] font-black text-clarity-blue uppercase tracking-[0.3em] mb-4">{post.category}</span>
      <h2 className="text-3xl lg:text-4xl font-black text-white mb-6 tracking-tight leading-[1.1] group-hover:text-clarity-blue transition-colors duration-500">
        {post.title}
      </h2>
      <p className="text-slate-400 text-base font-medium leading-relaxed mb-8 line-clamp-4">
        {post.excerpt}
      </p>
      <div className="flex items-center gap-5 text-slate-500 text-xs font-bold mb-8">
        <span className="flex items-center gap-1.5">
          <User className="w-3.5 h-3.5" />
          {post.author}
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          {formatDate(post.published_at)}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          {readTime(post.excerpt)}
        </span>
      </div>
      <span className="text-clarity-blue text-sm font-black uppercase tracking-widest flex items-center gap-3 group-hover:gap-4 transition-all">
        Read Article <ArrowRight className="w-4 h-4" />
      </span>
    </div>
  </Link>
);

const BlogCard: React.FC<{ post: BlogPost }> = ({ post }) => (
  <Link
    to={`/blog/${post.slug}`}
    className="group flex flex-col h-full glass-panel rounded-[2.5rem] border-white/5 transition-all duration-700 hover:border-white/20 hover:-translate-y-3 shadow-xl hover:shadow-[0_30px_80px_rgba(92,124,255,0.12)] overflow-hidden"
  >
    <div className="relative h-56 overflow-hidden">
      <img
        src={(!post.cover_image || post.cover_image.includes('unsplash')) ? '/images/blog_standard_fallback.png' : post.cover_image}
        alt={post.title}
        className="absolute inset-0 w-full h-full object-cover grayscale brightness-[0.6] group-hover:grayscale-0 group-hover:brightness-90 group-hover:scale-110 transition-all duration-[2000ms] ease-out"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050614] via-[#050614]/50 to-transparent" />
      <div className="absolute top-5 left-5">
        <span className="text-[9px] font-black px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white uppercase tracking-widest border border-white/10">
          {post.category}
        </span>
      </div>
    </div>

    <div className="p-8 lg:p-9 flex flex-col flex-grow">
      <h3 className="text-xl font-black text-white mb-3 tracking-tight leading-tight group-hover:text-clarity-blue transition-colors duration-500">
        {post.title}
      </h3>
      <p className="text-slate-500 text-sm font-medium leading-relaxed mb-6 line-clamp-3 flex-grow">
        {post.excerpt}
      </p>
      <div className="pt-5 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3 text-slate-600 text-[11px] font-bold">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />
            {formatDate(post.published_at)}
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-700" />
          <span className="flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            {readTime(post.excerpt)}
          </span>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-clarity-blue group-hover:translate-x-1 transition-all" />
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

  const featured = posts[0];
  const gridPosts = posts.slice(1, 4);
  const marqueePosts = posts.slice(4);

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
          "publisher": { "@type": "Organization", "name": "ClarityWorks Studio", "url": "https://clarityworksstudio.com" }
        }}
      />

      {/* Hero */}
      <section className="relative pt-48 pb-24 px-6 z-10">
        <div className="fixed top-[-10%] right-[-10%] w-[1000px] h-[1000px] rounded-full pointer-events-none z-0 glow-sphere blur-[150px] bg-blue-600/5" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full mb-10">
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded bg-clarity-blue text-white tracking-widest uppercase shadow-[0_0_20px_rgba(92,124,255,0.4)]">Knowledge Hub</span>
            <span className="text-xs font-bold text-slate-400 tracking-tight uppercase tracking-widest">Insights & Analysis</span>
          </div>
          <h1 className="text-6xl lg:text-9xl font-black tracking-tighter text-gradient mb-8 leading-[0.9]">
            Insights & <br /><span className="italic text-clarity-blue">Intelligence.</span>
          </h1>
          <p className="text-lg lg:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            Practical perspectives on Agentic AI, automation strategy, and the future of human + AI collaboration.
          </p>
        </div>
      </section>

      {/* Posts */}
      <section className="relative z-10 pb-32 px-6">
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
                <div className="mb-20">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-[2px] bg-clarity-blue" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-clarity-blue">Latest Article</span>
                  </div>
                  <FeaturedCard post={featured} />
                </div>
              )}

              {/* Grid Articles */}
              {gridPosts.length > 0 && (
                <div className="mb-20">
                  <div className="flex items-center gap-3 mb-10">
                    <div className="w-8 h-[2px] bg-white/20" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">More Articles</span>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {gridPosts.map(post => (
                      <BlogCard key={post.id} post={post} />
                    ))}
                  </div>
                </div>
              )}

              {/* Scrolling Articles */}
              {marqueePosts.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-10">
                    <div className="w-8 h-[2px] bg-white/20" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">Explore Past Articles</span>
                  </div>
                  <div className="w-full overflow-hidden mt-6 pb-8">
                    <div className="flex animate-marquee gap-8 w-max">
                      {marqueePosts.map(post => (
                        <div key={`orig-${post.id}`} className="w-[300px] md:w-[380px] flex-shrink-0 h-[450px]">
                          <BlogCard post={post} />
                        </div>
                      ))}
                      {marqueePosts.map(post => (
                        <div key={`copy-${post.id}`} className="w-[300px] md:w-[380px] flex-shrink-0 h-[450px]">
                          <BlogCard post={post} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
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
