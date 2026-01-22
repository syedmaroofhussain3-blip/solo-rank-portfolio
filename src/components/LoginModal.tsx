import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Eye, EyeOff, Loader2, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import gsap from 'gsap';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && modalRef.current && backdropRef.current) {
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)' }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast.error('Invalid credentials. Only the owner can login.');
    } else {
      toast.success('Welcome back, Hunter!');
      onClose();
      navigate('/admin');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        ref={backdropRef}
        className="absolute inset-0 bg-background/90 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Modal */}
      <div 
        ref={modalRef}
        className="relative w-full max-w-md rounded-3xl p-1 bg-gradient-to-br from-primary/30 via-accent/20 to-solo-purple/30"
      >
        <div className="bg-card rounded-[22px] p-8">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2.5 rounded-xl bg-muted/50 hover:bg-muted border border-border/50 hover:border-primary/30 transition-all duration-300 group"
          >
            <X className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-5 shadow-lg shadow-primary/25">
              <Shield className="w-8 h-8 text-background" />
            </div>
            <h2 className="text-2xl font-display font-bold tracking-wide mb-2">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Owner Login
              </span>
            </h2>
            <p className="text-muted-foreground text-sm font-body">
              Only the portfolio owner can access the admin panel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2.5 text-foreground/80">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-muted/50 border border-border/50 focus:border-primary/50 focus:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 font-body"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2.5 text-foreground/80">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 pr-12 rounded-xl bg-muted/50 border border-border/50 focus:border-primary/50 focus:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 font-body"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl font-display font-semibold text-sm uppercase tracking-widest bg-gradient-to-r from-primary to-accent text-primary-foreground hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Enter the Dungeon</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
