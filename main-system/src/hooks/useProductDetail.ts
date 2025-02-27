import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Tipos para imagem e produto – ajuste conforme necessário
export interface PictureType {
  secure_url?: string;
  url?: string;
}

export interface Product {
  id: string;
  title: string;
  price: {
    currency: string;
    regular_amount?: number | string;
    amount?: number | string;
    decimals?: number | string;
  };
  picture: PictureType | PictureType[];
  condition: string;
  free_shipping: boolean;
  installments?: {
    quantity?: number;
    amount?: number | string;
  };
  seller?: {
    nickname?: string;
  };
  description?: string;
  attributes?: {
    id: string;
    name: string;
    value_name: string;
  }[];
  category_path_from_root?: string;
}

// Tipo do retorno do hook
export interface UseProductDetailReturn {
  product: Product | null;
  selectedImage: string;
  loading: boolean;
  currentIndex: number;
  thumbnails: string[];
  setCurrentIndex: (index: number) => void;
  handleTouchStart: (e: React.TouchEvent<HTMLDivElement>) => void;
  handleTouchEnd: (e: React.TouchEvent<HTMLDivElement>) => void;
  handleBack: () => void;
}

export function useProductDetail(): UseProductDetailReturn {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Tenta obter um produto pré-carregado do Redux
  const preloadedProduct: Product | undefined = useSelector((state: any) =>
    state.search.results.find((item: Product) => item.id === id),
  );

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(!preloadedProduct);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        if (!preloadedProduct) setLoading(true);
        const res = await fetch(`/api/items/${id}`);
        const data: Product = await res.json();

        setProduct(data);
        if (data.picture) {
          if (Array.isArray(data.picture)) {
            setSelectedImage(
              data.picture[0]?.secure_url || data.picture[0]?.url || '',
            );
          } else {
            setSelectedImage(data.picture.secure_url || data.picture.url || '');
          }
        }
      } catch (error) {
        console.error('Erro ao carregar produto:', error);
      } finally {
        setLoading(false);
      }
    };

    if (preloadedProduct) {
      setProduct(preloadedProduct);
      if (preloadedProduct.picture) {
        if (Array.isArray(preloadedProduct.picture)) {
          setSelectedImage(
            preloadedProduct.picture[0]?.secure_url ||
              preloadedProduct.picture[0]?.url ||
              '',
          );
        } else {
          setSelectedImage(
            preloadedProduct.picture.secure_url ||
              preloadedProduct.picture.url ||
              '',
          );
        }
      }
      // Atualiza os dados em paralelo
      fetchProduct();
    } else {
      fetchProduct();
    }
  }, [id, preloadedProduct]);

  // Calcula as miniaturas a partir de product.picture
  const thumbnails: string[] = product?.picture
    ? Array.isArray(product.picture)
      ? product.picture.map((pic) => pic.secure_url || pic.url || '')
      : [product.picture.secure_url || product.picture.url || '']
    : [];

  // Atualiza a imagem selecionada conforme o currentIndex
  useEffect(() => {
    if (product) {
      const newImage = thumbnails[currentIndex] || '';
      setSelectedImage(newImage);
    }
  }, [currentIndex, product, thumbnails]);

  const handleBack = () => {
    navigate((location.state as { from?: string })?.from || '/items');
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartX;
    if (deltaX > 50) {
      setCurrentIndex((prev) =>
        prev === 0 ? thumbnails.length - 1 : prev - 1,
      );
    } else if (deltaX < -50) {
      setCurrentIndex((prev) =>
        prev === thumbnails.length - 1 ? 0 : prev + 1,
      );
    }
    setTouchStartX(null);
  };

  return {
    product,
    selectedImage,
    loading,
    currentIndex,
    thumbnails,
    setCurrentIndex,
    handleTouchStart,
    handleTouchEnd,
    handleBack,
  };
}
