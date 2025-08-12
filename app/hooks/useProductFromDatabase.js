
export async function getProductByIdAndStore(productId, storeHash) {
  if (!productId || !storeHash) {
    throw new Error('Both productId and storeHash are required');
  }
  const response = await fetch(
    `https://customise.shikharjobs.com/api/developer/product?productId=${productId}&storeHash=${storeHash}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
  );
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  return await response.json();
}