import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Briefcase, GraduationCap, Award, FileText, LogOut, Home, Shield, Sword, Crown, Sparkles, Zap } from 'lucide-react';
import ProfileEditor from '@/components/admin/ProfileEditor';
import ProjectsEditor from '@/components/admin/ProjectsEditor';
import SkillsEditor from '@/components/admin/SkillsEditor';
import EducationEditor from '@/components/admin/EducationEditor';
import ExperienceEditor from '@/components/admin/ExperienceEditor';
import CertificationsEditor from '@/components/admin/CertificationsEditor';
import soloHero from '@/assets/solo-leveling-hero.png';
import gsap from 'gsap';

const Admin = () => {
  const { user, loading, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/');
    }
  }, [loading, isAdmin, navigate]);

  // Entrance animations
  useEffect(() => {
    if (!loading && isAdmin && containerRef.current) {
      const ctx = gsap.context(() => {
        // Header animation
        gsap.fromTo(
          headerRef.current,
          { y: -80, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
        );

        // Stats bar animation
        gsap.fromTo(
          statsRef.current,
          { y: -40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.2 }
        );

        // Tabs animation
        gsap.fromTo(
          tabsRef.current,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.4 }
        );

        // Floating orbs animation
        gsap.to('.floating-orb', {
          y: -20,
          duration: 3,
          ease: 'power1.inOut',
          yoyo: true,
          repeat: -1,
          stagger: 0.5
        });

        // Pulse glow animation
        gsap.to('.pulse-glow', {
          boxShadow: '0 0 60px hsl(var(--primary) / 0.5)',
          duration: 2,
          ease: 'power1.inOut',
          yoyo: true,
          repeat: -1
        });
      }, containerRef);

      return () => ctx.revert();
    }
  }, [loading, isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-500" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-solo-purple/30 rounded-full blur-3xl animate-pulse delay-300" />
        </div>
        
        <div className="text-center relative z-10">
          <div className="relative mx-auto mb-8">
            <div className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <div className="absolute inset-0 w-20 h-20 border-4 border-accent/30 border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-primary animate-pulse" />
          </div>
          <p className="text-lg text-foreground font-display uppercase tracking-[0.3em] mb-2">System Loading</p>
          <p className="text-muted-foreground font-body text-sm">Initializing admin interface...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const tabItems = [
    { value: 'profile', icon: User, label: 'Profile' },
    { value: 'projects', icon: Briefcase, label: 'Quests' },
    { value: 'skills', icon: Zap, label: 'Skills' },
    { value: 'education', icon: GraduationCap, label: 'Training' },
    { value: 'experience', icon: FileText, label: 'Battle Log' },
    { value: 'certifications', icon: Award, label: 'Titles' },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-background relative overflow-hidden font-body">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Hero image overlay */}
        <div className="absolute right-0 top-0 w-2/3 h-full opacity-[0.08]">
          <img 
            src={soloHero} 
            alt="" 
            className="w-full h-full object-cover object-left"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-background/90 to-background" />
        </div>
        
        {/* Animated glow orbs */}
        <div className="floating-orb absolute top-20 left-10 w-40 h-40 bg-primary/15 rounded-full blur-[100px]" />
        <div className="floating-orb absolute top-1/3 right-20 w-56 h-56 bg-accent/15 rounded-full blur-[120px]" style={{ animationDelay: '1s' }} />
        <div className="floating-orb absolute bottom-20 left-1/4 w-72 h-72 bg-solo-purple/15 rounded-full blur-[150px]" style={{ animationDelay: '2s' }} />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), 
                              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />

        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-background/50" />
      </div>

      {/* Header */}
      <header ref={headerRef} className="sticky top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-2xl">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="relative group">
              <div className="pulse-glow w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-accent to-solo-purple flex items-center justify-center shadow-2xl transition-transform duration-300 group-hover:scale-105">
                <Crown className="w-7 h-7 text-background" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-solo-gold border-2 border-background flex items-center justify-center">
                <span className="text-[8px] font-bold text-background">S</span>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold tracking-wide flex items-center gap-3">
                <span className="bg-gradient-to-r from-primary via-accent to-solo-purple bg-clip-text text-transparent">
                  Shadow Monarch
                </span>
                <span className="text-xs px-3 py-1 rounded-full bg-primary/15 text-primary border border-primary/30 font-display font-medium tracking-widest">
                  ADMIN
                </span>
              </h1>
              <p className="text-sm text-muted-foreground font-body mt-0.5">
                Command your portfolio realm
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-muted/40 hover:bg-muted/60 border border-border/40 hover:border-primary/40 transition-all duration-300 group"
            >
              <Home className="w-4 h-4 group-hover:text-primary transition-colors" />
              <span className="hidden sm:inline font-medium text-sm">View Site</span>
            </a>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2.5 px-5 py-3 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20 hover:border-destructive/40 transition-all duration-300"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline font-medium text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div ref={statsRef} className="border-b border-border/20 bg-gradient-to-r from-muted/10 via-muted/20 to-muted/10 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-center gap-10 text-sm">
            <div className="flex items-center gap-3 group">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <div>
                <span className="text-muted-foreground text-xs uppercase tracking-wider">Rank</span>
                <p className="font-display font-bold text-primary text-lg leading-none mt-0.5">S-RANK</p>
              </div>
            </div>
            <div className="w-px h-10 bg-border/40" />
            <div className="flex items-center gap-3 group">
              <div className="p-2 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition-colors">
                <Sword className="w-4 h-4 text-accent" />
              </div>
              <div>
                <span className="text-muted-foreground text-xs uppercase tracking-wider">Status</span>
                <p className="font-display font-bold text-solo-gold text-lg leading-none mt-0.5">ACTIVE</p>
              </div>
            </div>
            <div className="w-px h-10 bg-border/40 hidden md:block" />
            <div className="hidden md:flex items-center gap-3 group">
              <div className="p-2 rounded-lg bg-muted/30 group-hover:bg-muted/50 transition-colors">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <span className="text-muted-foreground text-xs uppercase tracking-wider">Hunter</span>
                <p className="font-mono text-sm text-foreground leading-none mt-0.5 truncate max-w-[200px]">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-6 py-10 relative z-10">
        <Tabs defaultValue="profile" className="space-y-10" onValueChange={setActiveTab}>
          <div ref={tabsRef} className="flex justify-center">
            <TabsList className="inline-flex gap-2 p-2 rounded-2xl bg-muted/20 backdrop-blur-md border border-border/30 shadow-2xl">
              {tabItems.map((item) => (
                <TabsTrigger 
                  key={item.value}
                  value={item.value} 
                  className="relative flex items-center gap-2.5 px-5 py-3 rounded-xl font-body font-medium text-sm transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/30 hover:bg-muted/30 data-[state=inactive]:text-muted-foreground"
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Tab Content Wrapper with Animation */}
            <div className="relative">
              <TabsContent value="profile" className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                <div className="card-glow rounded-2xl p-8">
                  <ProfileEditor />
                </div>
              </TabsContent>
              <TabsContent value="projects" className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                <div className="card-glow rounded-2xl p-8">
                  <ProjectsEditor />
                </div>
              </TabsContent>
              <TabsContent value="skills" className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                <div className="card-glow rounded-2xl p-8">
                  <SkillsEditor />
                </div>
              </TabsContent>
              <TabsContent value="education" className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                <div className="card-glow rounded-2xl p-8">
                  <EducationEditor />
                </div>
              </TabsContent>
              <TabsContent value="experience" className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                <div className="card-glow rounded-2xl p-8">
                  <ExperienceEditor />
                </div>
              </TabsContent>
              <TabsContent value="certifications" className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                <div className="card-glow rounded-2xl p-8">
                  <CertificationsEditor />
                </div>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/20 py-8 mt-16 relative z-10 bg-gradient-to-t from-muted/5 to-transparent">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-primary/50" />
            <Sparkles className="w-4 h-4 text-primary/60" />
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-primary/50" />
          </div>
          <p className="text-sm text-muted-foreground font-body">
            <span className="text-primary font-display">「</span>
            <span className="mx-2">Arise from the shadows and conquer your realm</span>
            <span className="text-primary font-display">」</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Admin;
