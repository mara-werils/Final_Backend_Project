# Task Manager API

## Overview
This is a **Task Manager API** built using **Node.js, Express.js, and MongoDB**.  
It supports user authentication, role-based access control (RBAC), and full CRUD operations for managing tasks.

## Features
- User authentication (JWT-based)
- Role-based access (Admin & User)
- Task management (Create, Read, Update, Delete)
- MongoDB Atlas integration
- Session management with Express sessions
- API protected using authentication middleware

---

## **Setup Instructions**
### **1. Clone the repository**
```sh
git clone https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY.git
cd YOUR_REPOSITORY/backend
```

### **2. Install dependencies**
```sh
npm install
```

### **3. Set up environment variables**
Create a `.env` file in the root directory and add:

```plaintext
MONGO_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@your-cluster.mongodb.net/mydatabase?retryWrites=true&w=majority
JWT_SECRET=your_secret_key
SESSION_SECRET=your_session_secret_key
PORT=5000
```

### **4. Start the server**
```sh
npm start
```
The server will run at `http://localhost:5000/`.

---

## **API Documentation**
### **Authentication**
#### **1. Register a new user**
```http
POST /register
```
**Request Body:**
```json
{
    "username": "user1",
    "email": "user1@example.com",
    "password": "password123"
}
```
**Response:**
```json
{
    "message": "Registration successful"
}
```

#### **2. Login**
```http
POST /login
```
**Request Body:**
```json
{
    "email": "user1@example.com",
    "password": "password123"
}
```
**Response:**
```json
{
    "token": "your_jwt_token",
    "user": {
        "id": "user_id",
        "username": "user1",
        "email": "user1@example.com"
    }
}
```

---

### **User Management**
#### **3. Get User Profile (Authenticated)**
```http
GET /users/profile
Authorization: Bearer <your_token>
```
**Response:**
```json
{
    "_id": "user_id",
    "username": "user1",
    "email": "user1@example.com"
}
```

#### **4. Update User Profile**
```http
PUT /users/profile
Authorization: Bearer <your_token>
```
**Request Body:**
```json
{
    "username": "new_name",
    "email": "new_email@example.com"
}
```
**Response:**
```json
{
    "message": "Profile updated successfully"
}
```

---

### **Task Management**
#### **5. Create a New Task**
```http
POST /resource
Authorization: Bearer <your_token>
```
**Request Body:**
```json
{
    "title": "Complete project",
    "dueDate": "2025-04-10"
}
```
**Response:**
```json
{
    "_id": "task_id",
    "title": "Complete project",
    "status": "pending",
    "dueDate": "2025-04-10",
    "user": "user_id"
}
```

#### **6. Get All Tasks (User-Specific or All for Admin)**
```http
GET /resource
Authorization: Bearer <your_token>
```
**Response:**
```json
[
    {
        "_id": "task1",
        "title": "Buy groceries",
        "status": "in-progress",
        "user": {
            "_id": "user1",
            "username": "user1"
        }
    },
    {
        "_id": "task2",
        "title": "Submit assignment",
        "status": "pending",
        "user": {
            "_id": "user2",
            "username": "admin"
        }
    }
]
```

#### **7. Get a Specific Task**
```http
GET /resource/:id
Authorization: Bearer <your_token>
```

#### **8. Update a Task**
```http
PUT /resource/:id
Authorization: Bearer <your_token>
```
**Request Body:**
```json
{
    "title": "Updated Task Title",
    "status": "completed"
}
```
**Response:**
```json
{
    "message": "Task updated successfully"
}
```

#### **9. Delete a Task**
```http
DELETE /resource/:id
Authorization: Bearer <your_token>
```
**Response:**
```json
{
    "message": "Task deleted successfully"
}
```

---

## **Deployment**
The API can be deployed on **Railway / Render / Fly.io**.

1. **Push your code to GitHub**
```sh
git add .
git commit -m "Deploy"
git push origin main
```
2. **Deploy on Railway**
   - Go to [https://railway.app/](https://railway.app/)
   - Connect your GitHub repository
   - Add environment variables (`MONGO_URI`, `JWT_SECRET`, `SESSION_SECRET`)
   - Deploy the project

3. **Test your API**
   ```sh
   curl -X GET https://your-api-url.onrender.com/resource
   ```

---

## **License**
This project is open-source and available under the **MIT License**.

```

---
