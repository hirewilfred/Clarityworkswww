
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const BASE_URL = 'https://clarityworksstudio.com';

interface SEOProps {
  title: string;
  description: string;
  schema?: Record<string, unknown>;
}

const SEO: React.FC<SEOProps> = ({ title, description, schema }) => {
  const location = useLocation();
  const canonicalUrl = `${BASE_URL}${location.pathname === '/' ? '' : location.pathname}`;

  useEffect(() => {
    document.title = `${title} | ClarityWorks Studio`;

    const setMeta = (selector: string, attr: string, value: string) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute(attr, value);
    };

    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', title);
    setMeta('meta[property="og:description"]', 'content', description);
    setMeta('meta[property="og:url"]', 'content', canonicalUrl);
    setMeta('meta[name="twitter:url"]', 'content', canonicalUrl);
    setMeta('meta[name="twitter:title"]', 'content', title);
    setMeta('meta[name="twitter:description"]', 'content', description);

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonical) {
      canonical.href = canonicalUrl;
    } else {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      canonical.href = canonicalUrl;
      document.head.appendChild(canonical);
    }

    // Inject page-specific JSON-LD schema
    const existingSchema = document.getElementById('page-schema');
    if (existingSchema) existingSchema.remove();

    if (schema) {
      const script = document.createElement('script');
      script.id = 'page-schema';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    return () => {
      const el = document.getElementById('page-schema');
      if (el) el.remove();
    };
  }, [title, description, location, canonicalUrl, schema]);

  return null;
};

export default SEO;
