import { useEffect, useState, useRef } from 'react';

/**
 * Хук для управления видимостью header при скролле вниз по странице
 * Header скрывается при скролле вниз и показывается при скролле вверх
 * Реализовано с использованием useRef для избежания мерцания
 */
export const useHeaderScroll = () => {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollDirection = useRef<'up' | 'down' | null>(null);
  const scrollThreshold = 150; // Порог для смены направления

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          // Всегда показываем header в начале страницы
          if (currentScrollY < 50) {
            setIsHeaderVisible(true);
            lastScrollY.current = currentScrollY;
            scrollDirection.current = null;
            ticking = false;
            return;
          }

          // Определяем направление скролла
          const scrollDiff = currentScrollY - lastScrollY.current;
          
          // Если прошло достаточно расстояния для смены направления
          if (Math.abs(scrollDiff) > 10) {
            if (scrollDiff > 0) {
              // Скроллим вниз
              if (scrollDirection.current !== 'down') {
                scrollDirection.current = 'down';
                // Скрываем header только если прошли порог
                if (currentScrollY > scrollThreshold) {
                  setIsHeaderVisible(false);
                }
              }
            } else {
              // Скроллим вверх - всегда показываем
              scrollDirection.current = 'up';
              setIsHeaderVisible(true);
            }
            lastScrollY.current = currentScrollY;
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return isHeaderVisible;
};
