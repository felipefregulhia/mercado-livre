// searchSlice.types.ts
export interface Item {
  id: string;
  title: string;
  price: {
    currency: string;
    amount: number | string;
    decimals: number | string;
    regular_amount: number | string;
  };
  picture: string;
  condition: string;
  free_shipping: boolean;
  installments: {
    quantity: number;
    amount: number;
  };
  seller: {
    id: number;
    nickname: string;
  };
}

export interface FetchProductsArgs {
  query: string;
  offset: number;
}

export interface FetchProductsResult {
  items: Item[];
  total: number;
}

export interface SearchState {
  query: string;
  results: Item[];
  total: number;
  page: number;
  offset: number;
  loading: boolean;
}
