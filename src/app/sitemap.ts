import { MetadataRoute } from 'next';
import categoriesData from "../data/categories.json";
import productsData from "../data/products.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://kooper.it';

  // Static routes
  const routes = [
    '',
    '/categorie',
    '/kooperx',
    '/azienda',
    '/assistenza',
    '/manuali',
    '/garanzia',
    '/privacy',
    '/termini',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Categories
  const categories = categoriesData.map((category) => ({
    url: `${baseUrl}/categoria/${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Products
  const products = productsData.map((product) => ({
    url: `${baseUrl}/prodotto/${product.sku}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.6,
  }));

  return [...routes, ...categories, ...products];
}
