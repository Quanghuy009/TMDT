export async function login(payload) {
    const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Đăng nhập thất bại");
    }

    return data;
}

export async function register(payload) {
    const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Đăng ký thất bại");
    }

    return data;
}

export function saveAuthData(data) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));
}