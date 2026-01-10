import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Calendar, ArrowRight, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

gsap.registerPlugin(ScrollTrigger);

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  published_at: string | null;
}

const BlogSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  const { data: posts = [] } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, excerpt, cover_image, published_at')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
        .limit(3);
      if (error) throw error;
      return data as BlogPost[];
    },
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );

      gsap.fromTo(
        '.blog-item',
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          scrollTrigger: {
            trigger: '.blog-grid',
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [posts]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <section
      id="blog"
      ref={sectionRef}
      className="section-container"
    >
      <div className="container mx-auto px-4">
        <div ref={titleRef} className="text-center mb-16 opacity-0">
          <h2 className="section-title">Hunter's Journal</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            My thoughts, learnings, and experiences documented for fellow hunters.
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="blog-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {posts.map((post) => (
              <article
                key={post.id}
                className="blog-item project-card opacity-0 group"
              >
                {/* Cover Image */}
                <div className="relative aspect-video overflow-hidden">
                  {post.cover_image ? (
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <span className="text-5xl font-display text-primary/30">
                        {post.title.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-60" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(post.published_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      5 min read
                    </span>
                  </div>

                  <h3 className="text-lg font-display font-bold mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>

                  {post.excerpt && (
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                      {post.excerpt}
                    </p>
                  )}

                  <a
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:gap-3 transition-all"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="card-glow p-12 rounded-2xl max-w-2xl mx-auto">
              <div className="text-6xl mb-6">📝</div>
              <h3 className="text-xl font-display font-bold mb-3">
                Journal Coming Soon
              </h3>
              <p className="text-muted-foreground">
                I'm currently documenting my adventures. Check back soon for stories, 
                tutorials, and insights from my journey!
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
