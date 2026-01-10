import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ChevronDown, Github, Instagram, Mail, Phone } from 'lucide-react';
import { getRandomQuote } from '@/lib/quotes';
import heroImage from '@/assets/solo-leveling-hero.png';

const HeroSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [quote] = useState(getRandomQuote());

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        titleRef.current,
        { opacity: 0, y: 80 },
        { opacity: 1, y: 0, duration: 1 }
      )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.5'
      )
      .fromTo(
        quoteRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.8 },
        '-=0.4'
      )
      .fromTo(
        ctaRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.3'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const scrollToAbout = () => {
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Solo Leveling Background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center pt-20">
        <h1
          ref={titleRef}
          className="text-5xl md:text-7xl lg:text-8xl font-display font-black mb-6 opacity-0"
        >
          <span className="block text-foreground">SYED MAROOF</span>
          <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent text-glow">
            HUSSAIN
          </span>
        </h1>

        <p
          ref={subtitleRef}
          className="text-xl md:text-2xl font-heading text-muted-foreground mb-8 opacity-0"
        >
          BTech Student • Cloud Computing & AI • Web Developer
        </p>

        {/* Quote */}
        <div ref={quoteRef} className="max-w-2xl mx-auto mb-12 opacity-0">
          <div className="quote-container">
            <p className="text-lg md:text-xl italic text-foreground/90 mb-2">
              "{quote.quote}"
            </p>
            <p className="text-sm text-primary font-display">— {quote.character}</p>
          </div>
        </div>

        {/* CTA & Social */}
        <div ref={ctaRef} className="space-y-8 opacity-0">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="#projects" className="btn-primary" onClick={(e) => {
              e.preventDefault();
              document.querySelector('#projects')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              View My Quest Log
            </a>
            <a href="#contact" className="btn-outline" onClick={(e) => {
              e.preventDefault();
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Contact Me
            </a>
          </div>

          {/* Social Links */}
          <div className="flex items-center justify-center gap-6">
            <a
              href="https://github.com/prof-syedmaroofhussain3-blip"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-muted/50 hover:bg-primary/20 border border-border hover:border-primary transition-all duration-300 hover:scale-110"
            >
              <Github className="w-6 h-6" />
            </a>
            <a
              href="https://instagram.com/syed_maroof19"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-full bg-muted/50 hover:bg-primary/20 border border-border hover:border-primary transition-all duration-300 hover:scale-110"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a
              href="mailto:syedmaroofhussain3@gmail.com"
              className="p-3 rounded-full bg-muted/50 hover:bg-primary/20 border border-border hover:border-primary transition-all duration-300 hover:scale-110"
            >
              <Mail className="w-6 h-6" />
            </a>
            <a
              href="tel:+917275570844"
              className="p-3 rounded-full bg-muted/50 hover:bg-primary/20 border border-border hover:border-primary transition-all duration-300 hover:scale-110"
            >
              <Phone className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
      >
        <ChevronDown className="w-8 h-8 text-primary" />
      </button>
    </section>
  );
};

export default HeroSection;
