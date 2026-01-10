import { useState, useEffect } from 'react';
import { Menu, X, LogIn, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import LoginModal from './LoginModal';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Education', href: '#education' },
  { name: 'Blog', href: '#blog' },
  { name: 'Contact', href: '#contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const { isAdmin, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-background/90 backdrop-blur-lg border-b border-border'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a 
              href="#home" 
              className="font-display text-xl md:text-2xl font-bold text-glow"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#home');
              }}
            >
              SMH
            </a>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Auth & Mobile Toggle */}
            <div className="flex items-center gap-4">
              {isAdmin ? (
                <div className="flex items-center gap-2">
                  <a 
                    href="/admin" 
                    className="login-btn"
                    title="Admin Dashboard"
                  >
                    <Settings className="w-5 h-5 text-primary" />
                  </a>
                  <button
                    onClick={signOut}
                    className="login-btn"
                    title="Sign Out"
                  >
                    <LogOut className="w-5 h-5 text-primary" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="login-btn"
                  title="Owner Login"
                >
                  <LogIn className="w-5 h-5 text-primary" />
                </button>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2"
              >
                {isOpen ? (
                  <X className="w-6 h-6 text-foreground" />
                ) : (
                  <Menu className="w-6 h-6 text-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-lg border-b border-border">
            <div className="container mx-auto px-4 py-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="block py-3 nav-link"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
};

export default Navbar;
