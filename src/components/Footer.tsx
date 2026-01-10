import { Github, Instagram, Mail, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-12 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Copyright */}
          <div className="text-center md:text-left">
            <a href="#home" className="font-display text-2xl font-bold text-glow">
              SMH
            </a>
            <p className="text-sm text-muted-foreground mt-2">
              © {currentYear} Syed Maroof Hussain. All rights reserved.
            </p>
          </div>

          {/* Made with love */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Crafted with</span>
            <Heart className="w-4 h-4 text-destructive fill-current animate-pulse" />
            <span>and inspired by Solo Leveling</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/prof-syedmaroofhussain3-blip"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://instagram.com/syed_maroof19"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="mailto:syedmaroofhussain3@gmail.com"
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
