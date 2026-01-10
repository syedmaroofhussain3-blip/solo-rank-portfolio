import Navbar from '@/components/Navbar';
import ParticleBackground from '@/components/ParticleBackground';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import SkillsSection from '@/components/sections/SkillsSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import EducationSection from '@/components/sections/EducationSection';
import BlogSection from '@/components/sections/BlogSection';
import ContactSection from '@/components/sections/ContactSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <EducationSection />
        <BlogSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
