document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.querySelector("#registerForm");
    const loginForm = document.querySelector("#loginForm");
    const logoutButton = document.querySelector("#logoutButton");

    async function checkAuth() {
        const token = localStorage.getItem("token");
        if (!token) {
            return false;
        }
        try {
            const response = await fetch("/users/profile", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (!response.ok) {
                throw new Error("Ошибка авторизации");
            }
            return true;
        } catch (error) {
            console.error("Ошибка авторизации:", error);
            localStorage.removeItem("token");
            return false;
        }
    }

    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const username = document.querySelector("#username").value.trim();
            const email = document.querySelector("#email").value.trim();
            const password = document.querySelector("#password").value.trim();

            if (!username || !email || !password) {
                alert("Заполните все поля");
                return;
            }

            try {
                const response = await fetch("/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, email, password })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    alert(errorData.error || "Ошибка регистрации");
                    return;
                }

                alert("Регистрация успешна!");
                window.location.href = "/login";
            } catch (error) {
                console.error("Ошибка:", error);
                alert("Ошибка сервера. Попробуйте позже.");
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.querySelector("#email").value.trim();
            const password = document.querySelector("#password").value.trim();

            if (!email || !password) {
                alert("Заполните все поля");
                return;
            }

            try {
                const response = await fetch("/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    alert(errorData.error || "Ошибка входа");
                    return;
                }

                const data = await response.json();
                localStorage.setItem("token", data.token);
                alert("Вход выполнен успешно!");
                window.location.href = "/dashboard";
            } catch (error) {
                console.error("Ошибка:", error);
                alert("Ошибка сервера. Попробуйте позже.");
            }
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            localStorage.removeItem("token");
            alert("Вы вышли из системы");
            window.location.href = "/login";
        });
    }

    (async () => {
        const isAuthenticated = await checkAuth();
        if (window.location.pathname === "/dashboard" && !isAuthenticated) {
            alert("Сессия истекла, пожалуйста, войдите заново.");
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
    })();
});
