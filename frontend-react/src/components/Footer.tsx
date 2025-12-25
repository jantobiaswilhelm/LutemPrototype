import { Github, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="fixed bottom-3 right-3 z-30">
      <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
        <span>by Jan Wilhelm</span>
        
        <a
          href="https://github.com/jantobiaswilhelm/LutemPrototype"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-[var(--color-text-secondary)] transition-colors"
          aria-label="GitHub Repository"
        >
          <Github className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">GitHub</span>
        </a>
        
        <a
          href="https://ko-fi.com/lutem"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-[var(--color-accent)] transition-colors"
          aria-label="Support this project"
        >
          <Heart className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Donate</span>
        </a>
      </div>
    </footer>
  );
}

export default Footer;
