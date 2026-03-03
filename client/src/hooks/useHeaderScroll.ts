import { useEffect, useState, useRef, useCallback } from 'react';

/**
 * Хук для управления видимостью header при скролле
 * Header скрывается при скролле вниз и показывается только по кнопке
 */
export const useHeaderScroll = () => {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isForcedVisible, setIsForcedVisible] = useState(false);
  const lastScrollY = useRef(0);
  const scrollDirection = useRef<'up' | 'down' | null>(null);
  const scrollThreshold = 100; // Порог для скрытия

  // Функция для принудительного показа header (по кнопке)
  const showHeader = useCallback(() => {
    setIsForcedVisible(true);
    setIsHeaderVisible(true);
  }, []);

  // Функция для скрытия header
  const hideHeader = useCallback(() => {
    setIsForcedVisible(false);
    setIsHeaderVisible(false);
  }, []);

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

          // Если header принудительно показан (по кнопке), не скрываем автоматически
          if (isForcedVisible) {
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
              // Скроллим вверх - НЕ показываем автоматически, только по кнопке
              scrollDirection.current = 'up';
              // Убрали автоматическое появление при скролле вверх
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
  }, [isForcedVisible]);

  return { isHeaderVisible, showHeader, hideHeader, setIsForcedVisible };
};
