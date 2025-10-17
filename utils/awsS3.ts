// Add this function near other helper functions:
const API_URL = process.env.NEXT_PUBLIC_API_URL 
const getPresignedPictureUrl = async (key: string): Promise<string> => {
  if (!key) return "";
  
  try {
    const response = await fetch(`${API_URL}/presigned-url/${encodeURIComponent(key)}`);
    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error("Error getting presigned URL:", error);
    return "";
  }
};