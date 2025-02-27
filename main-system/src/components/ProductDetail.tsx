import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useProductDetail } from '../hooks/useProductDetail';
import SearchBox from './SearchBox';
import '../styles/ProductDetail.scss';

const ProductDetail: React.FC = () => {
  const {
    product,
    selectedImage,
    loading,
    currentIndex,
    thumbnails,
    setCurrentIndex,
    handleTouchStart,
    handleTouchEnd,
    handleBack,
  } = useProductDetail();

  if (loading && !product) {
    return (
      <div className="product-detail__loader-container">
        <div className="product-detail__loader"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail__loader-container">
        <p>Produto não encontrado.</p>
      </div>
    );
  }

  const mainColorAttr = product.attributes?.find(
    (attr) => attr.id === 'MAIN_COLOR',
  );

  const pageTitle = `${product.title} - Mercado Libre`;
  const pageDescription = `Compra ${product.title} al mejor precio. ${
    product.condition === 'new' ? 'Nuevo' : 'Usado'
  } con envío rápido y seguro.`;
  const productUrl = `https://produto.mercadolivre.com.br/${
    product.id
  }-${product.title.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={productUrl} />
        <meta property="og:image" content={selectedImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={selectedImage} />

        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.title,
            image: selectedImage,
            description: product.description || 'Descripción no disponible.',
            brand: {
              '@type': 'Brand',
              name: product.seller?.nickname || 'Marca desconocida',
            },
            offers: {
              '@type': 'Offer',
              url: productUrl,
              priceCurrency: product.price.currency,
              price: product.price.amount,
              availability: 'https://schema.org/InStock',
              seller: {
                '@type': 'Organization',
                name: product.seller?.nickname || 'Vendedor desconocido',
              },
            },
          })}
        </script>
      </Helmet>

      <SearchBox />

      <nav className="product-detail__breadcrumbs">
        <a onClick={handleBack}>← Volver al listado </a>{' '}
        {product.category_path_from_root && (
          <>| {product.category_path_from_root}</>
        )}
      </nav>

      <div className="product-detail">
        <div className="product-detail__container">
          {/* Galeria de miniaturas (desktop/tablet) */}
          <div className="product-detail__gallery">
            {thumbnails.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Thumbnail ${index}`}
                className={`product-detail__thumbnail ${
                  selectedImage === img
                    ? 'product-detail__thumbnail--active'
                    : ''
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>

          {/* Slider mobile */}
          <div
            className="product-detail__mobile-slider"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={selectedImage}
              alt={`Slide ${currentIndex}`}
              className="product-detail__mobile-slide"
            />
            <div className="product-detail__dots">
              {thumbnails.map((_, i) => (
                <span
                  key={i}
                  className={`product-detail__dot ${
                    i === currentIndex ? 'product-detail__dot--active' : ''
                  }`}
                  onClick={() => setCurrentIndex(i)}
                />
              ))}
            </div>
          </div>

          {/* Imagem principal (desktop/tablet) */}
          <div className="product-detail__image">
            <img src={selectedImage} alt={product.title} />
          </div>

          {/* Informações do Produto */}
          <div className="product-detail__info">
            <p className="product-detail__condition">
              {product.condition === 'new' ? 'Novo' : 'Usado'} | +100 vendidos
            </p>
            <h1 className="product-detail__title">{product.title}</h1>
            {product.seller?.nickname && (
              <p className="product-detail__seller">
                Por {product.seller.nickname}
              </p>
            )}
            <div className="product-detail__price">
              {product.price?.regular_amount && (
                <p
                  className="product-detail__price-regular"
                  style={{ textDecoration: 'line-through', marginRight: '8px' }}
                >
                  {product.price.currency} {product.price.regular_amount}
                </p>
              )}
              <p className="product-detail__price-current">
                {product.price?.currency} {product.price?.amount}
                {product.price?.decimals ? `.${product.price.decimals}` : ''}
              </p>
            </div>
            {product.installments?.quantity && product.installments?.amount && (
              <p className="product-detail__installments">
                Mesmo preço em {product.installments.quantity}x de $
                {product.installments.amount}
              </p>
            )}
            {product.free_shipping && (
              <p className="product-detail__free-shipping">Envio grátis</p>
            )}
            {mainColorAttr && (
              <p className="product-detail__color">
                {mainColorAttr.name}:{' '}
                <span className="product-detail__color-name">
                  {mainColorAttr.value_name}
                </span>
              </p>
            )}
          </div>
        </div>

        {product.description && (
          <div className="product-detail__description">
            <h2>Descripción</h2>
            <p>{product.description || 'Descripción no disponible.'}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetail;
