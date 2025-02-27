// searchSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  SearchState,
  FetchProductsArgs,
  FetchProductsResult,
} from './searchSlice.types';

// Thunk para buscar produtos
export const fetchProducts = createAsyncThunk<
  FetchProductsResult,
  FetchProductsArgs
>(
  'search/fetchProducts',
  async ({ query, offset }) => {
    const response = await fetch(`/api/items?q=${query}&offset=${offset}`);
    const data = await response.json();
    return {
      items: Array.isArray(data.items) ? data.items : [],
      total: data.total ?? 0,
    };
  },
  {
    condition: ({ query, offset }, { getState }) => {
      const state = getState() as { search: SearchState };
      const { search } = state;
      const blockNumber = Math.floor(offset / 50);
      const requiredCount = (blockNumber + 1) * 50;
      if (search.query === query && search.results.length >= requiredCount) {
        return false;
      }
      return true;
    },
  },
);

const initialState: SearchState = {
  query: '',
  results: [],
  total: 0,
  page: 1,
  offset: 0,
  loading: false,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
      state.results = [];
      state.page = 1;
      state.offset = 0;
      state.total = 0;
    },
    nextPage: (state) => {
      state.page += 1;
    },
    prevPage: (state) => {
      if (state.page > 1) {
        state.page -= 1;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<FetchProductsResult>) => {
          state.loading = false;
          state.results = [...state.results, ...action.payload.items];
          state.total = action.payload.total;
        },
      )
      .addCase(fetchProducts.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { setQuery, nextPage, prevPage } = searchSlice.actions;
export default searchSlice.reducer;
