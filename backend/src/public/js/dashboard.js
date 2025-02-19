document.addEventListener("DOMContentLoaded", async () => {
    const taskList = document.querySelector("#taskList");
    const taskForm = document.querySelector("#taskForm");
    const logoutButton = document.querySelector("#logoutButton");
    const welcomeMessage = document.querySelector("#welcomeMessage");
    const taskTitleInput = document.querySelector("#taskTitle");
    const taskDueDateInput = document.querySelector("#taskDueDate");
    const adminPanel = document.querySelector("#adminPanel");
    const token = localStorage.getItem("token");

    let currentUser = null;

    if (!token) {
        alert("Вы не авторизованы. Перенаправление на страницу входа.");
        window.location.href = "/login";
        return;
    }

    async function checkAuth() {
        try {
            const response = await fetch("/users/profile", {
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Ошибка авторизации");

            const user = await response.json();
            currentUser = user;
            console.log("✅ Авторизованный пользователь:", user);

            welcomeMessage.innerText = `Добро пожаловать, ${user.username} (${user.role})!`;

            if (user.role === "admin") {
                adminPanel.style.display = "block";
            }
        } catch (error) {
            console.error("❌ Ошибка авторизации:", error);
            alert(error.message);
            logout();
        }
    }

    async function fetchTasks() {
        try {
            const response = await fetch("/resource", {
                headers: { "Authorization": `Bearer ${token}` }
            });
    
            if (!response.ok) throw new Error("Ошибка при загрузке задач");
    
            const tasks = await response.json();
            console.log("✅ Загружены задачи:", tasks);
    
            taskList.innerHTML = "";
    
            // 📌 Группируем задачи по пользователю
            const groupedTasks = {};
            tasks.forEach(task => {
                const ownerName = task.user && task.user.username ? task.user.username : "Неизвестный пользователь";
                if (!groupedTasks[ownerName]) {
                    groupedTasks[ownerName] = [];
                }
                groupedTasks[ownerName].push(task);
            });
    
            // 📌 Отображаем задачи по пользователям
            Object.keys(groupedTasks).forEach(ownerName => {
                const userSection = document.createElement("div");
                userSection.classList.add("user-task-section");
    
                userSection.innerHTML = `
                    <h3 class="task-owner-title">👤 ${ownerName}</h3>
                    <ul class="user-task-list"></ul>
                `;
    
                const userTaskList = userSection.querySelector(".user-task-list");
    
                groupedTasks[ownerName].forEach(task => {
                    const dueDateStr = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Без срока";
    
                    const li = document.createElement("li");
                    li.classList.add("task-item");
    
                    li.innerHTML = `
                        <div class="task-info">
                            <span class="task-title">${task.title}</span>
                            <span class="task-date">🗓 ${dueDateStr}</span>
                        </div>
                        <div class="task-actions">
                            <select class="task-status" data-id="${task._id}">
                                <option value="pending" ${task.status === "pending" ? "selected" : ""}>В ожидании</option>
                                <option value="in-progress" ${task.status === "in-progress" ? "selected" : ""}>В процессе</option>
                                <option value="completed" ${task.status === "completed" ? "selected" : ""}>Завершено</option>
                            </select>
                            ${currentUser.role === "admin" || task.user._id === currentUser.id ? `<button class="delete-btn" data-id="${task._id}">🗑 Удалить</button>` : ""}
                        </div>
                    `;
    
                    userTaskList.appendChild(li);
                });
    
                taskList.appendChild(userSection);
            });
    
            document.querySelectorAll(".delete-btn").forEach(button => {
                button.addEventListener("click", async (e) => {
                    const taskId = e.target.dataset.id;
                    await deleteTask(taskId);
                });
            });
    
            document.querySelectorAll(".task-status").forEach(select => {
                select.addEventListener("change", async (e) => {
                    const taskId = e.target.dataset.id;
                    const newStatus = e.target.value;
                    await updateTaskStatus(taskId, newStatus);
                });
            });
    
        } catch (error) {
            console.error("❌ Ошибка загрузки задач:", error);
            alert(error.message);
        }
    }
    

    async function addTask(title, dueDate) {
        try {
            if (!title.trim()) {
                alert("Введите название задачи");
                return;
            }

            const response = await fetch("/resource", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ title, dueDate })
            });

            if (!response.ok) {
                throw new Error("Ошибка добавления задачи");
            }

            fetchTasks();
            taskTitleInput.value = "";
            if (taskDueDateInput) taskDueDateInput.value = "";
        } catch (error) {
            console.error("Ошибка добавления задачи:", error);
            alert(error.message);
            logout();
        }
    }

    async function updateTaskStatus(taskId, status) {
        try {
            const response = await fetch(`/resource/${taskId}`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ status })
            });

            if (!response.ok) {
                throw new Error("Ошибка обновления статуса задачи");
            }

            console.log(`✅ Статус задачи ${taskId} обновлен: ${status}`);
        } catch (error) {
            console.error("Ошибка обновления статуса задачи:", error);
            alert(error.message);
        }
    }

    async function deleteTask(taskId) {
        try {
            const response = await fetch(`/resource/${taskId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!response.ok) {
                throw new Error("Ошибка удаления задачи");
            }

            fetchTasks();
        } catch (error) {
            console.error("Ошибка удаления задачи:", error);
            alert(error.message);
        }
    }

    function logout() {
        localStorage.removeItem("token");
        alert("Вы вышли из системы");
        window.location.href = "/login";
    }

    if (taskForm) {
        taskForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const title = taskTitleInput.value;
            const dueDate = taskDueDateInput ? taskDueDateInput.value : null;
            await addTask(title, dueDate);
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener("click", logout);
    }

    await checkAuth();
    fetchTasks();
});
