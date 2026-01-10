import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

gsap.registerPlugin(ScrollTrigger);

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
}

const SkillsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);

  const { data: skills = [] } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('skills')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data as Skill[];
    },
  });

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

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
        '.skill-item',
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: {
            trigger: skillsRef.current,
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [skills]);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Programming Languages': 'from-primary to-cyan-400',
      'Web Development': 'from-accent to-pink-500',
      'Frameworks': 'from-green-400 to-emerald-500',
      'Specialization': 'from-solo-gold to-orange-500',
    };
    return colors[category] || 'from-primary to-accent';
  };

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="section-container"
    >
      <div className="container mx-auto px-4">
        <div ref={titleRef} className="text-center mb-16 opacity-0">
          <h2 className="section-title">Skills & Abilities</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            My current skill set and proficiency levels. Like a hunter's stats, 
            I'm constantly training to improve and unlock new abilities.
          </p>
        </div>

        <div ref={skillsRef} className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category} className="skill-item card-glow p-6 rounded-2xl opacity-0">
              <h3 className="font-display text-lg font-semibold text-primary mb-6">
                {category}
              </h3>
              <div className="space-y-5">
                {categorySkills.map((skill) => (
                  <div key={skill.id}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-sm text-muted-foreground">
                        LV. {Math.round(skill.proficiency / 10)}
                      </span>
                    </div>
                    <div className="skill-bar">
                      <div
                        className={`skill-bar-fill bg-gradient-to-r ${getCategoryColor(category)}`}
                        style={{ width: `${skill.proficiency}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
