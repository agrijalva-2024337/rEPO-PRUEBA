const BG_SRC = '/library-bg.png';

export const AppBackground = ({ children, className = '', fillHeight = false }) => (
  <div className={`relative min-h-screen ${className}`}>
    <div
      className="pointer-events-none absolute inset-0 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${BG_SRC})` }}
      aria-hidden
    />
    <div className="pointer-events-none absolute inset-0 bg-[var(--bg)]/82" aria-hidden />
    <div
      className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/50 via-[var(--bg)]/75 to-[var(--bg)]"
      aria-hidden
    />
    <div className={`relative z-10${fillHeight ? ' h-full' : ''}`}>{children}</div>
  </div>
);
