const PAYMENT_API_URL = "/api/payments";

export async function createPayosPayment(orderId) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${PAYMENT_API_URL}/create`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ orderId })
    });

    if (response.status === 401 || response.status === 403) {
        throw new Error("UNAUTHORIZED");
    }

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Không thể tạo link thanh toán payOS");
    }

    return await response.json();
}