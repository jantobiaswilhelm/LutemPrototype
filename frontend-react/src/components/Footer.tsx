import { Github, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="fixed bottom-3 right-4 z-30">
      <div
        className="flex items-center gap-4 font-mono text-[0.62rem] tracking-[0.18em] uppercase"
        style={{ color: 'var(--color-text-muted)' }}
      >
        <span
          className="font-serif italic normal-case tracking-normal text-[0.78rem]"
          style={{ color: 'var(--color-text-muted)' }}
        >
          by Jan Wilhelm
        </span>

        <a
          href="https://github.com/jantobiaswilhelm/LutemPrototype"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link font-serif italic normal-case tracking-normal text-[0.78rem] inline-flex items-center gap-1.5 pb-0.5 transition-colors duration-300"
          style={{ color: 'var(--color-text-muted)', borderBottom: '1px solid transparent' }}
          aria-label="GitHub Repository"
        >
          <Github className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">GitHub</span>
        </a>

        <a
          href="https://ko-fi.com/lutem"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link font-serif italic normal-case tracking-normal text-[0.78rem] inline-flex items-center gap-1.5 pb-0.5 transition-colors duration-300"
          style={{ color: 'var(--color-text-muted)', borderBottom: '1px solid transparent' }}
          aria-label="Support this project"
        >
          <Heart className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Ko&#8209;fi</span>
        </a>
      </div>

      <style>{`
        .footer-link:hover {
          color: var(--color-accent) !important;
          border-bottom-color: var(--color-accent) !important;
        }
      `}</style>
    </footer>
  );
}

export default Footer;
