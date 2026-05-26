import { register, saveAuthData } from "../api/auth-api.js";

const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const agree = document.getElementById("agree").checked;

    if (!fullName || !email || !password || !confirmPassword) {
        alert("Vui lòng nhập đầy đủ thông tin");
        return;
    }

    if (password !== confirmPassword) {
        alert("Mật khẩu xác nhận không khớp");
        return;
    }

    if (!agree) {
        alert("Bạn cần đồng ý với điều khoản sử dụng");
        return;
    }

    try {
        const data = await register({
            fullName,
            email,
            password
        });

        saveAuthData(data);

        alert("Đăng ký thành công");
        window.location.href = "/pages/index.html";
    } catch (error) {
        alert(error.message);
    }
});