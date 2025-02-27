import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import '../styles/SearchResults.scss';
import SearchBox from './SearchBox';
import { useSearchResults } from '../hooks/useSearchResults';

const SearchResults: React.FC = () => {
  const {
    paramQuery,
    page,
    currentItems,
    totalPages,
    loading,
    handlePageChange,
    handleSaveScroll,
  } = useSearchResults();

  const maxPagesToShow = 5;
  let startPage = page - Math.floor(maxPagesToShow / 2);
  if (startPage < 1) startPage = 1;
  let endPage = startPage + maxPagesToShow - 1;
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - (maxPagesToShow - 1));
  }

  const pageTitle = paramQuery
    ? `Resultados para "${paramQuery}" - Mercado Libre`
    : 'Búsqueda de productos - Mercado Libre';

  const pageDescription = paramQuery
    ? `Descubre los mejores resultados para "${paramQuery}". ¡Compra ahora con la mejor oferta!`
    : 'Explora nuestra tienda online y encuentra los mejores productos para ti.';

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta
          property="og:image"
          content={currentItems[0]?.picture || 'URL_DA_IMAGEM_PADRÃO'}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta
          name="twitter:image"
          content={currentItems[0]?.picture || 'URL_DA_IMAGEM_PADRÃO'}
        />

        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            itemListElement: currentItems.map((item, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              url: `https://seusite.com/produto/${item.id}-${item.title
                .replace(/\s+/g, '-')
                .toLowerCase()}`,
              name: item.title,
              image: item.picture,
              offers: {
                '@type': 'Offer',
                priceCurrency: item.price.currency,
                price: item.price.amount,
                availability: 'https://schema.org/InStock',
              },
            })),
          })}
        </script>
      </Helmet>

      <SearchBox />

      <div className="search-results">
        <div className="search-results__box">
          {loading && currentItems.length === 0 ? (
            <div className="search-results__loader-container">
              <div
                className="search-results__loader"
                data-testid="loader"
              ></div>
            </div>
          ) : currentItems.length === 0 ? (
            <div className="search-results__loader-container">
              <p>Nenhum produto encontrado.</p>
            </div>
          ) : (
            currentItems.map((item) => (
              <div className="search-results__item" key={item.id}>
                <img
                  src={item.picture}
                  alt={item.title}
                  className="search-results__item-image"
                />
                <div className="search-results__item-info">
                  <Link
                    to={`/items/${item.id}`}
                    state={{ from: `/items?search=${paramQuery}&page=${page}` }}
                    className="search-results__item-title"
                    onClick={handleSaveScroll}
                  >
                    {item.title}
                  </Link>
                  {item.seller && item.seller.nickname && (
                    <p className="search-results__seller">
                      Por {item.seller.nickname}
                    </p>
                  )}
                  <div className="search-results__price">
                    {item.price.regular_amount && (
                      <p className="search-results__item-regular-price">
                        {item.price.currency} {item.price.regular_amount}
                      </p>
                    )}
                    {item.price.amount && (
                      <p className="search-results__item-price">
                        {item.price.currency} {item.price.amount}
                      </p>
                    )}
                  </div>
                  {item.installments?.quantity && item.installments?.amount && (
                    <p className="search-results__installments">
                      Mismo precio en {item.installments.quantity} cuotas de{' '}
                      {item.price.currency} {item.installments.amount}
                    </p>
                  )}
                  {item.free_shipping && (
                    <p className="search-results__item-free-shipping">
                      Envio grátis
                    </p>
                  )}
                  {item.condition && (
                    <p className="search-results__item-condition">
                      {item.condition === 'new' ? 'Nuevo' : item.condition}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {currentItems.length > 0 && totalPages > 1 && (
        <div className="search-results__pagination-container">
          <div className="search-results__pagination">
            {page > 1 && (
              <span
                className="search-results__pagination__prev"
                onClick={() => handlePageChange(page - 1)}
              >
                &lt; Anterior
              </span>
            )}
            {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
              const pageNumber = startPage + i;
              return (
                <span
                  key={pageNumber}
                  className={`search-results__pagination__item ${
                    pageNumber === page
                      ? 'search-results__pagination__item--active'
                      : ''
                  }`}
                  onClick={() => handlePageChange(pageNumber)}
                >
                  {pageNumber}
                </span>
              );
            })}
            {page < totalPages && (
              <span
                className="search-results__pagination__next"
                onClick={() => handlePageChange(page + 1)}
              >
                Siguiente &gt;
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SearchResults;
