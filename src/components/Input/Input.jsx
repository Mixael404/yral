import Spinner from '../Spinner/Spinner';

function Input({
  id = 'main-input',
  label,
  type = 'text',
  isLoading = false,
  hint,
  error,
  className = '',
  ...rest
}) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="form-label fw-medium">
          {label}
        </label>
      )}

      <div className="position-relative">
        <input
          id={id}
          type={type}
          className={`form-control${isLoading ? ' pe-5' : ''}${error ? ' is-invalid' : ''}`}
          aria-invalid={Boolean(error)}
          aria-busy={isLoading}
          {...rest}
        />

        {isLoading && (
          <span className="position-absolute top-50 end-0 translate-middle-y d-flex me-3">
            <Spinner />
          </span>
        )}
      </div>

      {error && <div className="invalid-feedback d-block">{error}</div>}
      {!error && hint && <div className="form-text">{hint}</div>}
    </div>
  );
}

export default Input;
