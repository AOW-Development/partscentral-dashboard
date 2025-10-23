const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

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

export interface Product {
  id: number;
  sku: string;
  make: string;
  model: string;
  year: string;
  part: string;
  specification: string;
  status: string;
  amount: number;
  images: any[];
  subParts: any[];
  variants: any[];
}

export interface AllProductsResponse {
  products: Product[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
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

  const response = await fetch(
    `${API_URL}/products/v2/grouped-with-subparts?${queryParams}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch product variants");
  }

  return response.json();
};

export const getAllProducts = async (
  page: number = 1,
  limit: number = 50,
  filters?: {
    make?: string;
    model?: string;
    year?: string;
    part?: string;
    search?: string;
  }
): Promise<AllProductsResponse> => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  // Add filter parameters if they exist and are not default values
  if (filters?.make && filters.make !== "Select Make") {
    queryParams.append("make", filters.make);
  }
  if (filters?.model && filters.model !== "Select Model") {
    queryParams.append("model", filters.model);
  }
  if (filters?.year && filters.year !== "Select Year") {
    queryParams.append("year", filters.year);
  }
  if (filters?.part && filters.part !== "Select Part") {
    queryParams.append("part", filters.part);
  }
  if (filters?.search && filters.search.trim() !== "") {
    queryParams.append("search", filters.search);
  }

  const response = await fetch(`${API_URL}/products/all?${queryParams}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch products");
  }

  return response.json();
};
