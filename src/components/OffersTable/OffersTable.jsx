import { useRef, useState } from 'react';
import Pagination from '../Pagination/Pagination';
import Select from '../Select/Select';

const PAGE_SIZES = [20, 50, 100];
const PAGE_SIZE_OPTIONS = PAGE_SIZES.map((size) => ({ value: size, label: size }));

const priceFormatter = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' });

function OffersTable({ rows }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const tableRef = useRef(null);

  const totalPages = Math.ceil(rows.length / pageSize);
  const firstIndex = (page - 1) * pageSize;
  const visibleRows = rows.slice(firstIndex, firstIndex + pageSize);

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    tableRef.current?.scrollIntoView({ block: 'start' });
  };

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setPage(1);
  };

  return (
    <div ref={tableRef}>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div className="text-secondary small">Найдено предложений: {rows.length}</div>

        <div className="d-flex align-items-center gap-2">
          <span className="text-secondary small">На странице</span>
          <Select
            id="page-size-select"
            small
            placeholder={null}
            options={PAGE_SIZE_OPTIONS}
            value={pageSize}
            aria-label="Количество строк на странице"
            onChange={handlePageSizeChange}
          />
        </div>
      </div>

      <table className="table table-sm table-hover align-middle text-center border mb-3">
        <thead className="table-light">
          <tr>
            <th scope="col">Производитель</th>
            <th scope="col">Название</th>
            <th scope="col" className="d-none d-md-table-cell">
              Склад
            </th>
            <th scope="col">Цена</th>
            <th scope="col">Остаток</th>
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((row) => (
            <tr key={row.key}>
              <td className="text-break">
                <div className="fw-semibold">{row.brand}</div>
                <div className="small text-secondary">{row.number}</div>
                <span className={`badge ${row.isAnalog ? 'text-bg-light border' : 'text-bg-primary'}`}>
                  {row.isAnalog ? 'Аналог' : 'Искомая'}
                </span>
              </td>
              <td className="text-break">{row.name || '—'}</td>
              <td className="d-none d-md-table-cell text-break">{row.warehouse || '—'}</td>
              <td className="text-nowrap">
                {row.price === null ? '—' : priceFormatter.format(row.price)}
              </td>
              <td className={row.stock > 0 ? undefined : 'text-secondary'}>{row.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex flex-column align-items-center gap-2">
        <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
        <div className="small text-secondary">
          Показано {firstIndex + 1}–{firstIndex + visibleRows.length} из {rows.length}
        </div>
      </div>
    </div>
  );
}

export default OffersTable;
