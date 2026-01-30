import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Github, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import soloImage3 from '@/assets/solo-leveling-3.png';
import soloRankLogo from '@/assets/solo-rank-logo.png';
import iulEventHub from '@/assets/iul-event-hub.png';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: string;
  title: string;
  description: string | null;
  tech_stack: string[] | null;
  preview_url: string | null;
  github_url: string | null;
  image_url: string | null;
  is_featured: boolean | null;
}

const ProjectsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as Project[];
    },
  });

  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax background
      gsap.fromTo(
        bgRef.current,
        { yPercent: -20, scale: 1.1 },
        {
          yPercent: 20,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          },
        }
      );

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
        '.project-item',
        { opacity: 0, y: 100, rotateX: 15 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.projects-grid',
            start: 'top 85%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [projects]);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="section-container relative"
    >
      {/* Parallax Background */}
      <div ref={bgRef} className="absolute inset-0 -inset-y-32 z-0">
        <img
          src={soloImage3}
          alt=""
          className="w-full h-full object-cover opacity-45"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/35 to-background/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div ref={titleRef} className="text-center mb-16 opacity-0">
          <h2 className="section-title">Quest Log</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            My completed projects and ongoing adventures. Each project represents 
            a dungeon conquered and experience gained.
          </p>
        </div>

        <div className="projects-grid grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {projects.map((project) => (
            <div
              key={project.id}
              className="project-item project-card opacity-0"
            >
              {/* Project Image */}
              <div className="relative aspect-video overflow-hidden rounded-t-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
                {project.image_url ? (
                  <div className="w-full h-full flex items-center justify-center bg-background/80 p-8">
                    <img
                      src={
                        project.image_url.includes('solo-rank-logo') ? soloRankLogo :
                        project.image_url.includes('iul-event-hub') ? iulEventHub :
                        project.image_url
                      }
                      alt={project.title}
                      className="max-w-full max-h-full object-contain drop-shadow-2xl"
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <span className="text-4xl font-display text-primary/50">
                      {project.title.charAt(0)}
                    </span>
                  </div>
                )}
                {project.is_featured && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 rounded-full bg-solo-gold/90 text-background text-sm font-medium">
                    <Star className="w-4 h-4" />
                    Featured
                  </div>
                )}
              </div>

              {/* Project Content */}
              <div className="p-6">
                <h3 className="text-xl font-display font-bold mb-3 text-glow">
                  {project.title}
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {project.description}
                </p>

                {/* Tech Stack */}
                {project.tech_stack && project.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech_stack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Links */}
                <div className="flex gap-4">
                  {project.preview_url && (
                    <a
                      href={project.preview_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-medium text-primary hover:text-accent transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      Source Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="text-center text-muted-foreground py-12">
            <p>No projects to display yet. Quests are being prepared...</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectsSection;
