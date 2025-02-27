import React from 'react';
import logoPng from './logo_large_25years@2x.png';

interface LogoProps {
  alt?: string;
}

const Logo: React.FC<LogoProps> = ({ alt = 'Logo Mercado Libre' }) => {
  return <img src={logoPng} alt={alt} className="header__logo" />;
};

export default Logo;
