'use client';

import { useEffect, useState } from 'react';

const IMAGES = [
  { src: '/images/hero-banner-2.jpg', alt: 'Pet360 - Sistema Completo de Gestao Pet' },
  { src: '/images/hero-banner-1.jpg', alt: 'Pet360 - Todas as funcionalidades' },
];

export function HeroImageCarousel({ basePath = '' }: { basePath?: string }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="rounded-2xl overflow-hidden shadow-2xl aspect-[3/2] relative bg-white">
      {IMAGES.map((image, i) => (
        <img
          key={image.src}
          src={`${basePath}${image.src}`}
          alt={image.alt}
          className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-[1500ms] ease-in-out ${
            i === active ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {IMAGES.map((image, i) => (
          <button
            key={image.src}
            type="button"
            aria-label={`Mostrar imagem ${i + 1}`}
            onClick={() => setActive(i)}
            className={`h-2 rounded-full transition-all ${
              i === active ? 'w-6 bg-white' : 'w-2 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
