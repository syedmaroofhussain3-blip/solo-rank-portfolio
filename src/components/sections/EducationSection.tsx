import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { GraduationCap, MapPin, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

gsap.registerPlugin(ScrollTrigger);

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  is_current: boolean | null;
  description: string | null;
}

const EducationSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const { data: education = [] } = useQuery({
    queryKey: ['education'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('education')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as Education[];
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
        '.education-item',
        { opacity: 0, x: -80 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.3,
          scrollTrigger: {
            trigger: timelineRef.current,
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [education]);

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <section
      id="education"
      ref={sectionRef}
      className="section-container"
    >
      <div className="container mx-auto px-4">
        <div ref={titleRef} className="text-center mb-16 opacity-0">
          <h2 className="section-title">Education Journey</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            My academic path and the knowledge dungeons I've explored.
          </p>
        </div>

        <div ref={timelineRef} className="max-w-3xl mx-auto">
          {/* Timeline line */}
          <div className="relative">
            <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-accent to-primary/20" />

            {education.map((edu, index) => (
              <div
                key={edu.id}
                className="education-item relative pl-12 md:pl-20 pb-12 opacity-0"
              >
                {/* Timeline dot */}
                <div className="absolute left-0 md:left-4 top-0 w-8 h-8 rounded-full bg-card border-2 border-primary flex items-center justify-center animate-pulse-glow">
                  <GraduationCap className="w-4 h-4 text-primary" />
                </div>

                {/* Content card */}
                <div className="card-glow p-6 rounded-2xl">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-display font-bold text-glow">
                        {edu.institution}
                      </h3>
                      <p className="text-primary font-heading text-lg">
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </p>
                    </div>
                    {edu.is_current && (
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-accent/20 text-accent border border-accent/30">
                        Currently Enrolled
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                    {edu.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {edu.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(edu.start_date)} - {edu.is_current ? 'Present' : formatDate(edu.end_date)}
                    </span>
                  </div>

                  {edu.description && (
                    <p className="text-muted-foreground">
                      {edu.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {education.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
              <p>Education history is being loaded...</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
