import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, Phone, Instagram, Github, MapPin, Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import soloImage4 from '@/assets/solo-leveling-4.png';

gsap.registerPlugin(ScrollTrigger);

const ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);

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
        '.contact-card',
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.contact-grid',
            start: 'top 80%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Message sent successfully! I\'ll get back to you soon.');
    formRef.current?.reset();
    setLoading(false);
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'syedmaroofhussain3@gmail.com',
      href: 'mailto:syedmaroofhussain3@gmail.com',
    },
    {
      icon: Phone,
      label: 'Phone',
      value: '+91 7275570844',
      href: 'tel:+917275570844',
    },
    {
      icon: Instagram,
      label: 'Instagram',
      value: '@syed_maroof19',
      href: 'https://instagram.com/syed_maroof19',
    },
    {
      icon: Github,
      label: 'GitHub',
      value: 'prof-syedmaroofhussain3-blip',
      href: 'https://github.com/prof-syedmaroofhussain3-blip',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Lucknow, UP, India',
      href: null,
    },
  ];

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="section-container relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 opacity-10">
        <img
          src={soloImage4}
          alt=""
          className="w-full h-full object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div ref={titleRef} className="text-center mb-16 opacity-0">
          <h2 className="section-title">Let's Connect</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ready to collaborate or just want to say hi? Reach out through any channel below.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="contact-grid space-y-4">
            {contactInfo.map((item, index) => (
              <div
                key={item.label}
                className="contact-card card-glow p-4 rounded-xl opacity-0"
              >
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-4 group"
                  >
                    <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="font-medium group-hover:text-primary transition-colors">
                        {item.value}
                      </p>
                    </div>
                  </a>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="font-medium">{item.value}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="contact-card card-glow p-8 rounded-2xl opacity-0">
            <h3 className="text-xl font-display font-bold mb-6 text-glow">
              Send a Message
            </h3>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  required
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-muted border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors resize-none"
                  placeholder="Your message..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
