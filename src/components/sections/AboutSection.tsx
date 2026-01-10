import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Calendar, GraduationCap, Code } from 'lucide-react';
import soloImage from '@/assets/solo-leveling-2.png';

gsap.registerPlugin(ScrollTrigger);

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, x: -100 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'top 30%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      gsap.fromTo(
        contentRef.current,
        { opacity: 0, x: 100 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'top 30%',
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
      className="section-container"
    >
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div ref={imageRef} className="relative opacity-0">
            <div className="relative aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl blur-3xl" />
              <img
                src={soloImage}
                alt="About Me"
                className="relative w-full h-full object-cover rounded-3xl border border-border"
              />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center font-display text-3xl font-bold">
                1
                <span className="text-sm ml-1">yr</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div ref={contentRef} className="opacity-0">
            <h2 className="section-title">About Me</h2>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Hey there! I'm <span className="text-primary font-semibold">Syed Maroof Hussain</span>, 
              a first-year BTech student at Integral University, Lucknow, specializing in 
              <span className="text-accent font-semibold"> Computer Science with Cloud Computing and AI</span>. 
              I completed my schooling at Christ Church College, Hazratganj with PCM and Computer Science.
            </p>

            <p className="text-muted-foreground mb-8 leading-relaxed">
              Like Sung Jin-Woo, I believe in constant self-improvement and leveling up every day. 
              Currently pursuing a Web Development course on Udemy and building projects that combine 
              my passion for technology with creative problem-solving.
            </p>

            {/* Info Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {infoItems.map((item, index) => (
                <div
                  key={item.label}
                  className="card-glow p-4 rounded-xl flex items-center gap-4"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-3 rounded-lg bg-primary/10">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="font-medium">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
