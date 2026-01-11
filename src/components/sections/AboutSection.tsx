import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Calendar, GraduationCap, Code } from 'lucide-react';
import soloImage from '@/assets/solo-leveling-2.png';

gsap.registerPlugin(ScrollTrigger);

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax background effect
      gsap.fromTo(
        bgRef.current,
        { yPercent: -20 },
        {
          yPercent: 20,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );

      // Content animation with stagger
      gsap.fromTo(
        '.about-item',
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 80%',
            end: 'top 30%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Info cards animation
      gsap.fromTo(
        '.info-card',
        { opacity: 0, x: -40, rotateY: -15 },
        {
          opacity: 1,
          x: 0,
          rotateY: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.info-grid',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const infoItems = [
    { icon: MapPin, label: 'Location', value: 'Lucknow, Uttar Pradesh, India' },
    { icon: Calendar, label: 'Born', value: 'March 19, 2006' },
    { icon: GraduationCap, label: 'Studying', value: 'BTech in CS (Cloud & AI)' },
    { icon: Code, label: 'Focus', value: 'Web Development' },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="section-container relative overflow-hidden"
    >
      {/* Parallax Background */}
      <div ref={bgRef} className="absolute inset-0 -inset-y-20 z-0">
        <img
          src={soloImage}
          alt=""
          className="w-full h-full object-cover opacity-15"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div ref={contentRef} className="max-w-4xl mx-auto text-center">
          <h2 className="about-item section-title opacity-0">About Me</h2>
          
          <p className="about-item text-lg md:text-xl text-muted-foreground mb-12 leading-relaxed opacity-0">
            Hey there! I'm <span className="text-primary font-semibold">Syed Maroof Hussain</span>, 
            a first-year BTech student at Integral University, Lucknow, specializing in 
            <span className="text-accent font-semibold"> Computer Science with Cloud Computing and AI</span>. 
            I completed my schooling at Christ Church College, Hazratganj with PCM and Computer Science.
            Currently pursuing a Web Development course on Udemy and building projects that combine 
            my passion for technology with creative problem-solving.
          </p>

          {/* Info Grid */}
          <div className="info-grid grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {infoItems.map((item) => (
              <div
                key={item.label}
                className="info-card card-glow p-5 rounded-xl flex flex-col items-center gap-3 text-center opacity-0"
              >
                <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                  <p className="font-display font-medium text-sm">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
