export async function getCategoryProducts(type) {
    const response = await fetch(`/api/products/category?type=${encodeURIComponent(type)}`);

    if (!response.ok) {
        throw new Error("Không thể tải danh sách sản phẩm theo danh mục");
    }

    return await response.json();
}