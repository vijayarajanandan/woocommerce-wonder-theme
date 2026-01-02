import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize Matomo Tag Manager
const initMatomo = () => {
  const _mtm = (window._mtm = window._mtm || []);
  _mtm.push({ 'mtm.startTime': new Date().getTime(), event: 'mtm.Start' });

  const d = document;
  const g = d.createElement('script');
  const s = d.getElementsByTagName('script')[0];
  g.async = true;
  g.src = 'https://analytics.thescentora.com/js/container_ZtYsCfI1.js';
  s.parentNode?.insertBefore(g, s);
};

// Declare window types
declare global {
  interface Window {
    _mtm: any[];
    _paq: any[];
  }
}

initMatomo();

createRoot(document.getElementById("root")!).render(<App />);