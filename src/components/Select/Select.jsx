import Spinner from '../Spinner/Spinner';

function Select({
  id = 'main-select',
  label,
  options = [],
  value,
  placeholder = 'Выберите значение',
  isLoading = false,
  loadingText = 'Загрузка...',
  emptyText = 'Нет вариантов',
  hint,
  error,
  disabled = false,
  small = false,
  className = '',
  ...rest
}) {
  const isEmpty = !isLoading && options.length === 0;
  const isDisabled = disabled || isLoading || isEmpty;

  const valueProps = value === undefined ? { defaultValue: '' } : { value };

  const renderOptions = () => {
    if (isLoading) return <option value="">{loadingText}</option>;
    if (isEmpty) return <option value="">{emptyText}</option>;

    return (
      <>
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
      </>
    );
  };

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="form-label fw-medium">
          {label}
        </label>
      )}

      <div className="position-relative">
        <select
          id={id}
          className={`form-select${small ? ' form-select-sm' : ''}${error ? ' is-invalid' : ''}`}
          disabled={isDisabled}
          aria-invalid={Boolean(error)}
          aria-busy={isLoading}
          {...valueProps}
          {...rest}
        >
          {renderOptions()}
        </select>

        {isLoading && (
          <span className="position-absolute top-50 end-0 translate-middle-y d-flex me-5">
            <Spinner />
          </span>
        )}
      </div>

      {error && <div className="invalid-feedback d-block">{error}</div>}
      {!error && hint && <div className="form-text">{hint}</div>}
    </div>
  );
}

export default Select;
