import { login, saveAuthData } from "../api/auth-api.js";

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("Vui lòng nhập email và mật khẩu");
        return;
    }

    try {
        const data = await login({
            email,
            password
        });

        saveAuthData(data);

        alert("Đăng nhập thành công");
        window.location.href = "/pages/index.html";
    } catch (error) {
        alert(error.message);
    }
});

window.togglePassword = function () {
    const passwordInput = document.getElementById("password");
    const passwordIcon = document.getElementById("passwordIcon");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        passwordIcon.textContent = "visibility_off";
    } else {
        passwordInput.type = "password";
        passwordIcon.textContent = "visibility";
    }
};