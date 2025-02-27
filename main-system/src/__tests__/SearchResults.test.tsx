import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SearchResults from '../components/SearchResults';
import { useSearchResults } from '../hooks/useSearchResults';

// Mock do hook personalizado
jest.mock('../hooks/useSearchResults', () => ({
  useSearchResults: jest.fn(),
}));

const mockHandlePageChange = jest.fn();
const mockHandleSaveScroll = jest.fn();

describe('SearchResults Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = async () => {
    let renderResult;
    await act(async () => {
      renderResult = render(
        <BrowserRouter>
          <SearchResults />
        </BrowserRouter>,
      );
    });
    return renderResult;
  };

  it('deve exibir "Nenhum produto encontrado" quando não há itens', async () => {
    useSearchResults.mockReturnValue({
      paramQuery: 'teste',
      page: 1,
      currentItems: [],
      totalPages: 1,
      loading: false,
      handlePageChange: mockHandlePageChange,
      handleSaveScroll: mockHandleSaveScroll,
    });

    await renderComponent();
    expect(screen.getByText('Nenhum produto encontrado.')).toBeInTheDocument();
  });

  it('deve exibir um loader quando está carregando', async () => {
    useSearchResults.mockReturnValue({
      paramQuery: 'teste',
      page: 1,
      currentItems: [],
      totalPages: 1,
      loading: true,
      handlePageChange: mockHandlePageChange,
      handleSaveScroll: mockHandleSaveScroll,
    });

    const { container } = await renderComponent();

    expect(
      container.querySelector('.search-results__loader'),
    ).toBeInTheDocument();
  });

  it('deve exibir os resultados corretamente', async () => {
    useSearchResults.mockReturnValue({
      paramQuery: 'teste',
      page: 1,
      currentItems: [
        {
          id: '123',
          picture: 'image.jpg',
          title: 'Produto Teste',
          seller: { nickname: 'Vendedor1' },
          price: { currency: 'R$', amount: '100,00', regular_amount: null },
          installments: { quantity: 3, amount: '33,33' },
          free_shipping: true,
          condition: 'new',
        },
      ],
      totalPages: 1,
      loading: false,
      handlePageChange: mockHandlePageChange,
      handleSaveScroll: mockHandleSaveScroll,
    });

    await renderComponent();

    expect(screen.getByText('Produto Teste')).toBeInTheDocument();
    expect(screen.getByText('Por Vendedor1')).toBeInTheDocument();
    expect(screen.getByText('R$ 100,00')).toBeInTheDocument();
    expect(screen.getByText('Envio grátis')).toBeInTheDocument();
  });

  it('deve chamar a função de mudança de página ao clicar na paginação', async () => {
    useSearchResults.mockReturnValue({
      paramQuery: 'teste',
      page: 2,
      currentItems: [
        {
          id: '123',
          picture: 'image.jpg',
          title: 'Produto Teste',
          price: { currency: 'R$', amount: '100,00' },
        },
      ],
      totalPages: 3,
      loading: false,
      handlePageChange: mockHandlePageChange,
      handleSaveScroll: mockHandleSaveScroll,
    });

    await renderComponent();

    fireEvent.click(screen.getByText('< Anterior'));
    expect(mockHandlePageChange).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByText('3'));
    expect(mockHandlePageChange).toHaveBeenCalledWith(3);
  });
});
