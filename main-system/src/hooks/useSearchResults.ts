// hooks/useSearchResults.ts
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, setQuery } from '../redux/searchSlice';
import { RootState } from '../store'; // supondo que você já tem definido RootState no store.ts

// hooks/useSearchResults.types.ts

// Se você já possui uma interface para Item, pode importá-la; caso contrário, use any
export interface Item {
  id: string;
  title: string;
  picture: string;
  price: {
    currency: string;
    regular_amount?: number | string;
    amount?: number | string;
  };
  seller?: {
    nickname?: string;
  };
  installments?: {
    quantity?: number;
    amount?: number;
  };
  free_shipping?: boolean;
  condition?: string;
}

export interface UseSearchResultsReturn {
  paramQuery: string;
  page: number;
  currentItems: Item[];
  totalPages: number;
  loading: boolean;
  handlePageChange: (newPage: number) => void;
  handleSaveScroll: () => void;
}

export function useSearchResults(): UseSearchResultsReturn {
  const [searchParams, setSearchParams] = useSearchParams();
  const paramQuery = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const dispatch = useDispatch();
  const { query, results, total, loading } = useSelector(
    (state: RootState) => state.search,
  );

  // Se a query da URL for diferente da armazenada, reseta o estado
  useEffect(() => {
    if (paramQuery && paramQuery !== query) {
      dispatch(setQuery(paramQuery));
    }
  }, [paramQuery, query, dispatch]);

  // Dispara fetch se precisarmos de mais itens para exibir a página atual
  useEffect(() => {
    if (paramQuery) {
      const neededItems = page * 10;
      // Prefetch: carrega um bloco a uma página antes
      const threshold = 10;
      const fetchNeededItems = neededItems + threshold;

      if (results.length < fetchNeededItems) {
        const blockIndex = Math.floor((fetchNeededItems - 1) / 50);
        const offset = blockIndex * 50;
        dispatch(fetchProducts({ query: paramQuery, offset }));
      }
    }
  }, [paramQuery, page, results.length, dispatch]);

  // Restaura a posição do scroll ao voltar
  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem('scrollPosition');
    if (savedScrollPosition) {
      window.scrollTo(0, parseInt(savedScrollPosition, 10));
      sessionStorage.removeItem('scrollPosition');
    }
  }, []);

  const handlePageChange = (newPage: number) => {
    setSearchParams({ search: paramQuery, page: newPage.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveScroll = () => {
    sessionStorage.setItem('scrollPosition', window.scrollY.toString());
  };

  const totalPages = Math.ceil(total / 10);

  // Calcula os itens a exibir para a página atual
  const startIndex = (page - 1) * 10;
  const endIndex = startIndex + 10;
  const currentItems = results.slice(startIndex, endIndex);

  return {
    paramQuery,
    page,
    currentItems,
    totalPages,
    loading,
    handlePageChange,
    handleSaveScroll,
  };
}
