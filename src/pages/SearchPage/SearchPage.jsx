import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash/debounce';
import Input from '../../components/Input/Input';
import OffersTable from '../../components/OffersTable/OffersTable';
import Select from '../../components/Select/Select';
import Spinner from '../../components/Spinner/Spinner';
import {
  fetchBrands,
  fetchOffers,
  resetSearch,
  selectOfferRows,
  selectParts,
} from '../../store/slices/partsSlice';

const MIN_NUMBER_LENGTH = 3;

function SearchPage() {
  const dispatch = useDispatch();
  const [numberError, setNumberError] = useState(null);
  const { number, brands, selectedBrand, isLoading, error } = useSelector(selectParts);
  const offerRows = useSelector(selectOfferRows);

  const isBrandsLoading = isLoading && !selectedBrand;
  const isOffersLoading = isLoading && Boolean(selectedBrand);

  const brandOptions = brands.map(({ brand, name }) => ({
    value: brand,
    label: name ? `${brand} · ${name}` : brand,
  }));

  const handleNumberChange = useMemo(
    () =>
      debounce((event) => {
        const value = event.target.value.trim();

        if (!value) {
          setNumberError(null);
          dispatch(resetSearch());
          return;
        }

        if (value.length < MIN_NUMBER_LENGTH) {
          setNumberError(`Введите минимум ${MIN_NUMBER_LENGTH} символа`);
          return;
        }

        setNumberError(null);
        dispatch(fetchBrands(value));
      }, 500),
    [dispatch],
  );

  const handleBrandChange = useMemo(
    () =>
      debounce((event) => {
        const brand = event.target.value;
        if (brand) dispatch(fetchOffers({ number, brand }));
      }, 300),
    [dispatch, number],
  );

  useEffect(() => () => handleNumberChange.cancel(), [handleNumberChange]);
  useEffect(() => () => handleBrandChange.cancel(), [handleBrandChange]);


  const renderOffers = () => {
    if (isOffersLoading) {
      return (
        <div className="d-flex justify-content-center py-5">
          <Spinner size="lg" variant="primary" />
        </div>
      );
    }

    if (error) return <div className="alert alert-danger mb-0">{error}</div>;

    if (!offerRows.length) {
      return <div className="alert alert-secondary mb-0">Предложения не найдены</div>;
    }

    return <OffersTable rows={offerRows} />;
  };

  return (
    <>
      <h1 className="h3 mb-4">Подбор запчастей</h1>

      <div className="row g-3">
        <Input
          className="col-md-6"
          label="Артикул"
          placeholder="Например, 7160500039S"
          error={numberError}
          autoComplete="off"
          isLoading={isBrandsLoading}
          onChange={handleNumberChange}
        />

        <Select
          key={number}
          className="col-md-6"
          label="Производитель"
          placeholder="Выберите производителя"
          emptyText={number ? 'Производители не найдены' : 'Сначала введите артикул'}
          options={brandOptions}
          isLoading={isBrandsLoading}
          onChange={handleBrandChange}
        />
      </div>

      {selectedBrand && <div className="mt-4">{renderOffers()}</div>}
    </>
  );
}

export default SearchPage;
