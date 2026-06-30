export const Card = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`
        bg-[var(--bg-card)]
        border border-[var(--border)]
        rounded-2xl
        p-5
        shadow-[var(--shadow-sm)]
        ${className}
      `}
    >
      {children}
    </div>
  );
};
