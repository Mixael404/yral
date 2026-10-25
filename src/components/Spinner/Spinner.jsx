function Spinner({ size = 'sm', variant = 'secondary', className = '' }) {
  const sizeClass = size === 'sm' ? ' spinner-border-sm' : '';

  return (
    <span className={`spinner-border${sizeClass} text-${variant} ${className}`.trim()} role="status">
      <span className="visually-hidden">Загрузка...</span>
    </span>
  );
}

export default Spinner;
