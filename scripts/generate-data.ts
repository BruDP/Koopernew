import fs from 'fs-extra';
import path from 'path';
import { XMLParser } from 'fast-xml-parser';
import { parse } from 'csv-parse/sync';

const XML_PATH = path.join(process.cwd(), '../google_shop.xml');
const CSV_PATH = path.join(process.cwd(), '../products.csv');
const OUTPUT_PRODUCTS = path.join(process.cwd(), 'src/data/products.json');
const OUTPUT_CATEGORIES = path.join(process.cwd(), 'src/data/categories.json');

// Interface for our clean Product
export interface Product {
  sku: string;
  title: string;
  description: string;
  price: number;
  specialPrice?: number;
  images: string[];
  category: string;
  subCategory: string;
  brand: "Kooper" | "KooperX";
  link: string;
  color?: string;
  material?: string;
  features?: string;
}

async function main() {
  console.log('Reading CSV...');
  const csvContent = await fs.readFile(CSV_PATH, 'utf-8');
  const csvRecords = parse(csvContent, {
    delimiter: ';',
    columns: true,
    skip_empty_lines: true,
    relax_quotes: true,
  }) as any[];

  // Build CSV lookup map
  const csvMap = new Map<string, any>();
  for (const record of csvRecords) {
    csvMap.set(record.SKU, record);
  }

  console.log('Reading XML...');
  const xmlContent = await fs.readFile(XML_PATH, 'utf-8');
  const parser = new XMLParser({
    ignoreAttributes: false,
    cdataPropName: "__cdata" // fast-xml-parser doesn't use cdata array by default if not configured, but we can just use the text. Wait, default configuration strips CDATA tags and keeps the content.
  });
  const xmlData = parser.parse(xmlContent);
  const items = xmlData.rss?.channel?.item || [];
  
  console.log(`Found ${items.length} items in XML. Filtering for Kooper...`);

  const products: Product[] = [];
  const categoriesMap = new Map<string, Set<string>>();

  const getStr = (val: any) => {
    if (typeof val === 'string') return val;
    if (val && typeof val === 'object' && val['__cdata']) return String(val['__cdata']);
    return String(val || '');
  };

  for (const item of items) {
    const brand = getStr(item['g:brand']);
    
    if (!brand.toLowerCase().includes('kooper')) continue;

    const sku = getStr(item['g:sku']) || getStr(item.id);
    const csvData = csvMap.get(sku) || {};

    // Determine sub-brand
    const isKooperX = (csvData.SottoMarchio || '').toLowerCase().includes('kooperx');
    
    // Images
    const images = [];
    if (csvData.url2base) images.push(csvData.url2base);
    if (csvData.url4img1) images.push(csvData.url4img1);
    if (csvData.url5img2) images.push(csvData.url5img2);
    if (csvData.url6img3) images.push(csvData.url6img3);
    if (csvData.url7img4) images.push(csvData.url7img4);
    if (csvData.url8img5) images.push(csvData.url8img5);
    
    // Fallback to XML image
    if (images.length === 0 && item['g:image_link']) {
      images.push(getStr(item['g:image_link']));
    }

    // Category mapping
    let rawType = getStr(item['g:product_type']);
    rawType = rawType.replace(/&gt;/g, '>');
    
    const parts = rawType.split('>').map((p: string) => p.trim());
    let category = parts[0] || 'Altro';
    let subCategory = parts.length > 1 ? parts[1] : 'Generale';

    // Rename Climatizzazione -> Clima e Ventilazione
    if (category.toLowerCase().includes('climatizzazione') || category.toLowerCase().includes('clima e ventilazione')) {
      category = 'Clima e Ventilazione';
    }

    // Fix uppercase/lowercase
    category = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
    if (category === 'Piccoli elettrodomestici') category = 'Piccoli Elettrodomestici';

    // Track categories
    if (!categoriesMap.has(category)) categoriesMap.set(category, new Set());
    categoriesMap.get(category)?.add(subCategory);

    // Price
    const priceStr = getStr(item['g:price']);
    const price = parseFloat(priceStr.replace(' EUR', '')) || parseFloat(csvData.Prezzo?.replace(',', '.')) || 0;
    
    let specialPrice = undefined;
    if (csvData["Prezzo Speciale"]) {
      specialPrice = parseFloat(csvData["Prezzo Speciale"].replace(',', '.'));
      if (isNaN(specialPrice)) specialPrice = undefined;
    }

    products.push({
      sku,
      title: getStr(item.title),
      description: csvData["Descrizione Estesa"] || getStr(item.description) || '',
      price,
      specialPrice,
      images,
      category,
      subCategory,
      brand: isKooperX ? 'KooperX' : 'Kooper',
      link: getStr(item.link) || csvData.Url || `https://www.satur.it/${sku}.html`,
      color: getStr(item['g:color']) || csvData.Colore,
      material: getStr(item['g:material']) || csvData.Materiale,
      features: csvData["Nota Tecnica"]
    });
  }

  // Format categories
  const categoriesList = Array.from(categoriesMap.entries()).map(([name, subs]) => ({
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    subcategories: Array.from(subs).map(sub => ({
      name: sub,
      slug: sub.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }))
  }));

  console.log(`Generated ${products.length} products and ${categoriesList.length} categories.`);

  await fs.ensureDir(path.dirname(OUTPUT_PRODUCTS));
  await fs.writeFile(OUTPUT_PRODUCTS, JSON.stringify(products, null, 2));
  await fs.writeFile(OUTPUT_CATEGORIES, JSON.stringify(categoriesList, null, 2));
  
  console.log('Done!');
}

main().catch(console.error);
