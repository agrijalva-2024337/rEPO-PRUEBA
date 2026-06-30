export const Button = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => {
  const variants = {
    primary: `
      bg-[var(--accent)]
      hover:bg-[var(--accent-dark)]
      text-[#2a1c0f]
      font-semibold
      shadow-[0_10px_25px_rgba(232,132,43,0.28)]
    `,
    secondary: `
      bg-[var(--bg-card)]
      border border-[var(--border)]
      text-[var(--text-h)]
      hover:bg-[var(--bg-hover)]
    `,
    success: `
      bg-[var(--success)]
      hover:brightness-110
      text-white
      font-semibold
    `,
    danger: `
      bg-[var(--danger)]
      hover:brightness-110
      text-white
      font-semibold
    `,
  };

  return (
    <button
      className={`
        px-5 py-3
        rounded-2xl
        transition-all duration-200
        hover:scale-[1.01]
        disabled:opacity-60
        disabled:cursor-not-allowed
        ${variants[variant] || variants.primary}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
