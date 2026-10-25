import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { api } from '../../api';

const API_KEY = import.meta.env.VITE_API_KEY;
const PRICE_URL = '/hs/hsprice/';

const isFilled = (item) => Boolean(item && item.brand && item.number);

const toPart = (item, isAnalog) => ({
  id: item.goodsID,
  brand: item.brand,
  number: item.number,
  name: item.name,
  count: Number(item.count) || 0,
  isAnalog,
  warehouses: (item.warehouses ?? []).map((w) => ({
    id: w.id,
    code: w.code,
    price: Number(w.price) || 0,
    stock: Number(w.stock) || 0,
    shipmentDate: w.shipmentDate,
  })),
});

const requestGoods = async (params) => {
  const { data } = await api.get(PRICE_URL, { params: { key: API_KEY, ...params } });
  return (data?.goods ?? []).filter(isFilled);
};

const initialState = {
  number: '',
  brands: [],
  selectedBrand: null,
  offers: [],
  isLoading: false,
  error: null,
};

export const fetchBrands = createAsyncThunk(
  'parts/fetchBrands',
  async (number) => {
    const goods = await requestGoods({ number });

    const unique = new Map();
    goods.forEach((item) => {
      if (!unique.has(item.brand)) {
        unique.set(item.brand, { brand: item.brand, number: item.number, name: item.name });
      }
    });
    return [...unique.values()];
  },
);

export const fetchOffers = createAsyncThunk(
  'parts/fetchOffers',
  async ({ number, brand }) => {
    const goods = await requestGoods({ number, brand, analogues: 'on' });

    return goods.flatMap((item) => [
      toPart(item, false),
      ...(item.analogues ?? []).filter(isFilled).map((analog) => toPart(analog, true)),
    ]);
  },
);

const partsSlice = createSlice({
  name: 'parts',
  initialState,
  reducers: {
    resetSearch: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBrands.pending, (state, { meta: { arg: number } }) => {
      state.number = number;
      state.brands = [];
      state.selectedBrand = null;
      state.offers = [];
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchBrands.fulfilled, (state, { payload }) => {
      state.brands = payload;
      state.isLoading = false;
    });
    builder.addCase(fetchBrands.rejected, (state, { error: { message } }) => {
      state.isLoading = false;
      state.error = message;
    });

    builder.addCase(fetchOffers.pending, (state, { meta: { arg: { brand } } }) => {
      state.selectedBrand = brand;
      state.offers = [];
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchOffers.fulfilled, (state, { payload }) => {
      state.offers = payload;
      state.isLoading = false;
    });
    builder.addCase(fetchOffers.rejected, (state, { error: { message } }) => {
      state.isLoading = false;
      state.error = message;
    });
  },
});

export const { resetSearch } = partsSlice.actions;

export const selectParts = (state) => state.parts;
export const selectOffers = (state) => state.parts.offers;

export const selectOfferRows = createSelector([selectOffers], (offers) =>
  offers.flatMap((part, partIndex) => {
    const base = {
      brand: part.brand,
      number: part.number,
      name: part.name,
      isAnalog: part.isAnalog,
    };

    if (!part.warehouses.length) {
      return [{ ...base, key: `${partIndex}`, warehouse: null, price: null, stock: part.count }];
    }

    return part.warehouses.map((warehouse, warehouseIndex) => ({
      ...base,
      key: `${partIndex}-${warehouseIndex}`,
      warehouse: warehouse.code || warehouse.id,
      price: warehouse.price,
      stock: warehouse.stock,
      shipmentDate: warehouse.shipmentDate,
    }));
  }),
);

export default partsSlice.reducer;
