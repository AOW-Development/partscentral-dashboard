const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface ProductVariant {
  id: number;
  sku: string;
  productId: number;
  miles: string;
  actualprice: number;
  discountedPrice?: number;
  inStock: boolean;
  product: {
    id: number;
    sku: string;
    images: any[];
    description: string | null;
  };
}

export interface GroupedVariant {
  subPart: {
    id: number;
    name: string;
    partTypeId: number;
  };
  variants: ProductVariant[];
}

export interface ProductResponse {
  make: string;
  model: string;
  year: string;
  part: string;
  subParts: Array<{
    id: number;
    name: string;
    partTypeId: number;
  }>;
  groupedVariants: GroupedVariant[];
}

export const getProductVariants = async (params: {
  make: string;
  model: string;
  year: string;
  part: string;
}): Promise<ProductResponse> => {
  const queryParams = new URLSearchParams({
    make: params.make,
    model: params.model,
    year: params.year,
    part: params.part,
  });

  const response = await fetch(`${API_URL}/products/v2/grouped-with-subparts?${queryParams}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to fetch product variants');
  }

  return response.json();
};
