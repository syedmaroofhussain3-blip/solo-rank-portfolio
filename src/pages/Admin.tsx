import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Briefcase, GraduationCap, Award, FileText, LogOut, Home, Shield, Sword, Crown } from 'lucide-react';
import ProfileEditor from '@/components/admin/ProfileEditor';
import ProjectsEditor from '@/components/admin/ProjectsEditor';
import SkillsEditor from '@/components/admin/SkillsEditor';
import EducationEditor from '@/components/admin/EducationEditor';
import ExperienceEditor from '@/components/admin/ExperienceEditor';
import CertificationsEditor from '@/components/admin/CertificationsEditor';
import soloHero from '@/assets/solo-leveling-hero.png';

const Admin = () => {
  const { user, loading, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/');
    }
  }, [loading, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
        {/* Animated background particles */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-500" />
        </div>
        
        <div className="text-center relative z-10">
          <div className="relative mx-auto mb-6">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-accent/30 border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          </div>
          <p className="text-muted-foreground font-display uppercase tracking-widest">Entering the System...</p>
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

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Hero image overlay */}
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-10">
          <img 
            src={soloHero} 
            alt="" 
            className="w-full h-full object-cover object-left"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-background/80 to-background" />
        </div>
        
        {/* Animated glow orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 right-20 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-pulse delay-700" />
        <div className="absolute bottom-20 left-1/4 w-64 h-64 bg-solo-purple/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), 
                              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg animate-pulse-glow">
                <Crown className="w-6 h-6 text-background" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-solo-gold border-2 border-background" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-glow flex items-center gap-2">
                <span>Shadow Monarch</span>
                <span className="text-sm px-2 py-0.5 rounded-full bg-primary/20 text-primary font-normal">Admin</span>
              </h1>
              <p className="text-sm text-muted-foreground">Command your portfolio realm</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted/50 hover:bg-muted border border-border/50 hover:border-primary/30 transition-all duration-300 group"
            >
              <Home className="w-4 h-4 group-hover:text-primary transition-colors" />
              <span className="hidden sm:inline">View Site</span>
            </a>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20 hover:border-destructive/40 transition-all duration-300"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="border-b border-border/30 bg-muted/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">Rank:</span>
              <span className="font-display font-bold text-primary">S-RANK</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2">
              <Sword className="w-4 h-4 text-accent" />
              <span className="text-muted-foreground">Status:</span>
              <span className="font-display font-bold text-solo-gold">ACTIVE</span>
            </div>
            <div className="w-px h-4 bg-border hidden md:block" />
            <div className="hidden md:flex items-center gap-2">
              <span className="text-muted-foreground">Hunter:</span>
              <span className="font-medium text-foreground">{user?.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-8 relative z-10">
        <Tabs defaultValue="profile" className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="inline-flex gap-1 p-1.5 rounded-2xl bg-muted/30 backdrop-blur-sm border border-border/50">
              <TabsTrigger 
                value="profile" 
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-display uppercase tracking-wide text-xs transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger 
                value="projects" 
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-display uppercase tracking-wide text-xs transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25"
              >
                <Briefcase className="w-4 h-4" />
                <span className="hidden sm:inline">Quests</span>
              </TabsTrigger>
              <TabsTrigger 
                value="skills" 
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-display uppercase tracking-wide text-xs transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25"
              >
                <Award className="w-4 h-4" />
                <span className="hidden sm:inline">Skills</span>
              </TabsTrigger>
              <TabsTrigger 
                value="education" 
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-display uppercase tracking-wide text-xs transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25"
              >
                <GraduationCap className="w-4 h-4" />
                <span className="hidden sm:inline">Training</span>
              </TabsTrigger>
              <TabsTrigger 
                value="experience" 
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-display uppercase tracking-wide text-xs transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Battle Log</span>
              </TabsTrigger>
              <TabsTrigger 
                value="certifications" 
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-display uppercase tracking-wide text-xs transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:shadow-primary/25"
              >
                <Award className="w-4 h-4" />
                <span className="hidden sm:inline">Titles</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="max-w-4xl mx-auto">
            <TabsContent value="profile" className="animate-fade-up">
              <ProfileEditor />
            </TabsContent>
            <TabsContent value="projects" className="animate-fade-up">
              <ProjectsEditor />
            </TabsContent>
            <TabsContent value="skills" className="animate-fade-up">
              <SkillsEditor />
            </TabsContent>
            <TabsContent value="education" className="animate-fade-up">
              <EducationEditor />
            </TabsContent>
            <TabsContent value="experience" className="animate-fade-up">
              <ExperienceEditor />
            </TabsContent>
            <TabsContent value="certifications" className="animate-fade-up">
              <CertificationsEditor />
            </TabsContent>
          </div>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 py-6 mt-12 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground font-display">
            <span className="text-primary">「</span>
            Arise from the shadows and conquer your realm
            <span className="text-primary">」</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Admin;