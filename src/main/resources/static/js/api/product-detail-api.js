export async function getProductDetail(productId) {
    const response = await fetch(`/api/products/${productId}`);

    if (!response.ok) {
        throw new Error("Không thể tải chi tiết sản phẩm");
    }

    return await response.json();
}