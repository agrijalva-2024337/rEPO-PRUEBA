const LOGO_SRC = '/la33-logo.png';

export const Logo = ({ size = 'md', showText = false, title = 'La 33', subtitle, badge }) => {
  const sizes = {
    sm: 'h-9 w-9',
    md: 'h-11 w-11',
    lg: 'h-16 w-16',
    xl: 'h-20 w-20',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-3 ${showText ? '' : 'shrink-0'}`}>
      <img
        src={LOGO_SRC}
        alt="La 33 — Biblioteca Estudiantil Online"
        className={`${sizes[size] || sizes.md} object-contain`}
        draggable={false}
      />
      {showText && (
        <div className="leading-tight">
          {badge && (
            <p className="text-[10px] uppercase tracking-[0.35em] text-[var(--text-muted)]">{badge}</p>
          )}
          <p className={`font-bold text-[var(--text-h)] ${textSizes[size] || textSizes.md}`}>{title}</p>
          {subtitle && (
            <p className="text-xs text-[var(--text-muted)]">{subtitle}</p>
          )}
        </div>
      )}
    </div>
  );
};

export const LogoBrand = ({ className = '', horizontal = false }) => {
  if (horizontal) {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <Logo size="lg" />
        <div className="text-left">
          <p className="text-2xl font-bold text-[var(--text-h)]">La 33</p>
          <p className="text-sm text-[var(--text-muted)]">Biblioteca Estudiantil Online</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center text-center ${className}`}>
      <Logo size="lg" />
      <p className="mt-4 text-2xl font-bold text-[var(--text-h)]">La 33</p>
      <p className="mt-1 text-sm text-[var(--text-muted)]">Biblioteca Estudiantil Online</p>
    </div>
  );
};
