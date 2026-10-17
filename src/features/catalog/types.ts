export type Category = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  icon: string;
  description: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  categoryId: string;
  image: string;
  images: string[];
  price: number | null;
  compareAtPrice: number | null;
  isDemo: boolean;
  isActive: boolean;
  isPersonalizable: boolean;
  isNew: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  stock: number | null;
  tags: string[];
};
