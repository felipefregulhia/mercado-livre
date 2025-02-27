// hooks/useSearchBox.ts
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Define a interface de retorno do hook
export interface UseSearchBoxReturn {
  query: string;
  setQuery: (value: string) => void;
  showWelcome: boolean;
  handleCloseWelcome: () => void;
  handleSearch: () => void;
}

export function useSearchBox(): UseSearchBoxReturn {
  const navigate = useNavigate();
  const location = useLocation();

  const [query, setQuery] = useState<string>('');
  const [showWelcome, setShowWelcome] = useState<boolean>(false);

  // Atualiza a query com base na query string da URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paramSearch = params.get('search') || '';
    setQuery(paramSearch);
  }, [location]);

  // Exibe a caixa de boas-vindas se o usuário ainda não a viu
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setShowWelcome(true);
    }
  }, []);

  const handleCloseWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('hasSeenWelcome', 'true');
  };

  const handleSearch = () => {
    if (query.trim()) {
      navigate(`/items?search=${query}`);
    }
  };

  return { query, setQuery, showWelcome, handleCloseWelcome, handleSearch };
}
