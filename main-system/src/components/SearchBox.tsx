// SearchBox.tsx
import React, { Suspense } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import searchIcon from '../assets/ic_Search@2x.png.png';
// import Logo from '../assets/logo_large_25years@2x.png';
import '../styles/SearchBox.scss';
import { useSearchBox } from '../hooks/useSearchBox';
const MFELogo = React.lazy(() => import('mfe/MFELogo'));

const SearchBox: React.FC = () => {
  const { query, setQuery, showWelcome, handleCloseWelcome, handleSearch } =
    useSearchBox();

  const DefaultHelmet: React.FC = () => {
    return (
      <Helmet>
        <title>Mercado Libre</title>
        <meta
          name="description"
          content="Explora nuestra tienda online y encuentra los mejores productos."
        />
        <meta name="robots" content="index, follow" />
      </Helmet>
    );
  };

  const location = useLocation();
  const isSearchOrProductPage =
    location.pathname.includes('/items') ||
    location.pathname.includes('/produto');

  return (
    <>
      {!isSearchOrProductPage && <DefaultHelmet />}
      <header className="header">
        <div className="header__container">
          {/* Link para home com logo */}
          <Link to="/">
            {/* <img src={Logo} alt="Mercado Libre" className="header__logo" /> */}
            <React.Suspense fallback={<div>Carregando MFE...</div>}>
              <MFELogo alt="Mercado Libre" />
            </React.Suspense>
          </Link>

          <div className="header__search-bar">
            <input
              type="text"
              className="header__input"
              placeholder="Buscar productos, marcas y más..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <div className="header__divider"></div>
            <button className="header__button" onClick={handleSearch}>
              <img src={searchIcon} alt="Buscar" className="header__icon" />
            </button>
          </div>
        </div>

        {showWelcome && (
          <div className="welcome-box">
            <button className="welcome-box__close" onClick={handleCloseWelcome}>
              ✖
            </button>
            <div className="welcome-box__content">
              <div className="welcome-box__title">Hola</div>
              <div className="welcome-box__text">
                Para realizar buscas, basta inserir o nome do que você precisa.
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default SearchBox;
