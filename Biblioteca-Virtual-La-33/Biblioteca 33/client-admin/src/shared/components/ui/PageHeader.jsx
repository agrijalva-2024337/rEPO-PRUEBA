export const PageHeader = ({
  title,
  subtitle,
  action,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      <div>
        <h1 className="text-3xl font-bold text-[var(--text-h)]">
          {title}
        </h1>

        {subtitle && (
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {action}
    </div>
  );
};
