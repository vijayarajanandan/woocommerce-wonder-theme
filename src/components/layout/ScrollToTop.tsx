import { useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToTop = () => {
  const { pathname, search } = useLocation();
  const isFirstMount = useRef(true);

  useLayoutEffect(() => {
    // Skip scroll on first mount (initial page load keeps scroll position from browser)
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    
    // Force scroll to top immediately
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    window.scrollTo(0, 0);
  }, [pathname, search]);

  return null;
};
