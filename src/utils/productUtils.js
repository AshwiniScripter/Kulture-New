import { getImageUrl } from './imageUtils';

const formatPrice = (value) => {
  const num = Number(value) || 0;
  return `₹${num.toLocaleString('en-IN')}.00`;
};

const CATEGORY_ALIASES = {
  upperwear: [
    'upperwear',
    'upper',
    'top',
    'topwear',
    'tshirt',
    't-shirt',
    't-shirts',
    'tee',
    'tees',
    'sweater',
    'hoodie',
    'jacket',
    'shirt',
  ],
  lowerwear: [
    'lowerwear',
    'lower',
    'bottom',
    'bottomwear',
    'denim',
    'jeans',
    'pant',
    'pants',
    'short',
    'shorts',
    'jogger',
    'trouser',
    'cargo',
  ],
  tshirts: ['tshirt', 't-shirt', 't-shirts', 'tshirts', 'upper', 'upperwear', 'tee', 'tees'],
  shoes: ['shoe', 'shoes', 'footwear', 'sneaker', 'boots'],
  pants: ['pant', 'pants', 'trouser', 'trousers', 'bottom', 'bottomwear', 'lower', 'denim', 'jeans'],
  accessories: ['accessory', 'accessories'],
  belts: ['belt', 'belts'],
  bandana: ['bandana', 'bandanas', 'mask', 'wrap', 'bandana & mask'],
  watches: ['watch', 'watches'],
  shades: ['shade', 'shades', 'sunglass', 'sunglasses', 'glasses', 'eyewear'],
};

const SUB_CATEGORY_KEYWORDS = {
  jeans: ['jean', 'denim'],
  sweatpants: ['sweatpant', 'jogger', 'trackpant'],
  jorts: ['jort', 'short'],
  'liner-pants': ['liner', 'cargo', 'trouser'],
  jackets: ['jacket'],
  sweatshirts: ['sweatshirt', 'sweater'],
  hoodies: ['hoodie'],
  tanks: ['tank'],
  shirts: { include: ['shirt'], exclude: ['t-shirt', 'tshirt', 't shirt', 'tee'] },
  tshirts: ['t-shirt', 'tshirt', 't shirts', 't shirt', 'tshirts'],
};

const matchSubcategory = (product, subcategory) => {
  const spec = SUB_CATEGORY_KEYWORDS[subcategory];
  if (!spec) return true;
  const haystack = [
    product.subcategory,
    product.item_group,
    product.category,
    product.name,
    product.product_name,
    product.title,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  const include = Array.isArray(spec) ? spec : spec.include;
  const exclude = Array.isArray(spec) ? [] : spec.exclude || [];
  const hasIncluded = include.some((kw) => haystack.includes(kw.toLowerCase()));
  const hasExcluded = exclude.some((kw) => haystack.includes(kw.toLowerCase()));
  return hasIncluded && !hasExcluded;
};

const matchCategory = (productCategory, key) => {
  const aliases = CATEGORY_ALIASES[key] || [key];
  const c = String(productCategory || '').toLowerCase();
  return aliases.some((alias) => c.includes(alias.toLowerCase()));
};

const normalizeSizes = (rawSizes) => {
  if (!Array.isArray(rawSizes)) return [];
  return rawSizes
    .map((s) => (typeof s === 'string' ? { size: s, quantity: null } : s))
    .filter((s) => s && s.size);
};

const normalizeProduct = (p) => {
  if (!p) return null;
  const id = p.product_id || p.id || p.name;
  const finalPrice = Number(p.final_price ?? p.finalPrice ?? p.price ?? 0) || 0;
  const originalPrice = Number(p.price ?? finalPrice) || finalPrice;
  const sizes = normalizeSizes(p.sizes);
  const colors = (p.colors || []).map((c) =>
    typeof c === 'string' ? c : c.name || c.color || 'Default'
  );
  const allImages = (p.images || []).filter(Boolean);
  const primaryImage = getImageUrl(p.image || (p.images && p.images[0]));

  return {
    id,
    product_id: id,
    title: p.product_name || p.title || id,
    category: p.category || p.product_category || '',
    description: p.description || '',
    store: p.store || '',
    price: formatPrice(originalPrice),
    priceNum: originalPrice,
    finalPrice,
    originalPrice,
    discount: Number(p.discount) || 0,
    image: primaryImage,
    images: allImages.length ? allImages.map(getImageUrl) : [primaryImage].filter(Boolean),
    sizes,
    sizeNames: sizes.map((s) => s.size),
    colors,
    totalStock: sizes.reduce((sum, s) => sum + (Number(s.quantity) || 0), 0),
    gridClass: p.gridClass || 'col-span-2 md:col-span-3 h-52 sm:h-72 md:h-[400px]',
  };
};

export { formatPrice, CATEGORY_ALIASES, matchCategory, matchSubcategory, normalizeProduct, normalizeSizes };
