const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export const fetchYears = async (make: string, model: string): Promise<string[]> => {
  if (!make || !model) {
    return [];
  }

  try {
    const response = await fetch(`${API_BASE}/products/years?make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch years');
    }
    const data = await response.json();
    return data.sort((a: number, b: number) => Number(b) - Number(a));
  } catch (error) {
    console.error('Error fetching years:', error);
    return [];
  }
};
