const getPages = (page, totalPages) => {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);

  const pages = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  if (start > 2) pages.push('start-gap');
  for (let current = start; current <= end; current += 1) pages.push(current);
  if (end < totalPages - 1) pages.push('end-gap');

  pages.push(totalPages);
  return pages;
};

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = getPages(page, totalPages);

  return (
    <nav aria-label="Страницы таблицы">
      <ul className="pagination pagination-sm flex-wrap justify-content-center mb-0">
        <li className={`page-item${page === 1 ? ' disabled' : ''}`}>
          <button type="button" className="page-link" aria-label="Предыдущая" onClick={() => onChange(page - 1)}>
            &laquo;
          </button>
        </li>

        {pages.map((item) =>
          typeof item === 'number' ? (
            <li key={item} className={`page-item${item === page ? ' active' : ''}`}>
              <button
                type="button"
                className="page-link"
                aria-current={item === page ? 'page' : undefined}
                onClick={() => onChange(item)}
              >
                {item}
              </button>
            </li>
          ) : (
            <li key={item} className="page-item disabled">
              <span className="page-link">&hellip;</span>
            </li>
          ),
        )}

        <li className={`page-item${page === totalPages ? ' disabled' : ''}`}>
          <button type="button" className="page-link" aria-label="Следующая" onClick={() => onChange(page + 1)}>
            &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
