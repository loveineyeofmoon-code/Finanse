import { useEffect, useState } from 'react';

/**
 * Хук для управления видимостью header при скролле вниз по странице
 * Header скрывается при скролле вниз и показывается при скролле вверх
 */
export const useHeaderScroll = () => {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Скрываем header только если скролим вниз более чем на 100px
      if (currentScrollY > 100) {
        // Если скроллим вниз
        if (currentScrollY > lastScrollY) {
          setIsHeaderVisible(false);
        }
        // Если скроллим вверх
        else {
          setIsHeaderVisible(true);
        }
      } else {
        // Всегда показываем header в начале страницы
        setIsHeaderVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    // Добавляем listener с throttling для лучшей производительности
    let ticking = false;
    const scrollHandler = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });

    return () => {
      window.removeEventListener('scroll', scrollHandler);
    };
  }, [lastScrollY]);

  return isHeaderVisible;
};
