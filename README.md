<div align="center">

<img src="https://raw.githubusercontent.com/Lagadnakul/Food-Delivery/main/frontend/public/logo.png" width="90" />

# Hunger Hive

Full-Stack Food Delivery Platform (MERN)

[Live Customer App](https://hunger-hive.vercel.app)  
[Live Admin Panel](https://hunger-hive-admin.vercel.app)  
[Backend API](https://food-delivery-1-ye61.onrender.com)


</div>

---

## 🧠 About The Project

Hunger Hive is a production-ready full-stack food delivery platform built with the MERN stack, supporting real-time order management, secure authentication, and responsive cross-device experience.

It includes:
- Customer application
- Admin dashboard
- Backend REST API
- JWT authentication
- MongoDB database

---

## ✨ Features

### Customer
- Register and Login
- Browse food items
- Add to cart
- Place orders
- View order history

### Admin
- Add / Edit / Delete food items
- Manage orders

---

## 🛠 Tech Stack

Frontend:
- React
- Tailwind CSS
- Axios

Backend:
- Node.js
- Express.js
- MongoDB
- JWT

Deployment:
- Vercel (Frontend)
- Render (Backend)

---
## 🏗 Architecture Overview

Frontend (React) communicates with Backend (Express API)  
Backend handles authentication, order processing, and database operations  
MongoDB stores users, products, and orders  
JWT secures protected routes  
Admin panel interacts with the same backend API

---
## 📸 Application Screenshots

### 🏠 Home Page
![Home](./Screenshots/Home.png)

### 🍽 Menu Page
![Menu](./Screenshots/Menu.png)

### 💳 Payment / Checkout
![Payment](./Screenshots/Payment.png)

### 📱 Mobile App 
![Mobile](./Screenshots/MobileApp.png)

### 🛠 Admin Dashboard
![Admin](./Screenshots/admin.png)

---
## 🔗 Sample API Endpoints

POST   /api/user/login  
POST   /api/user/register  
GET    /api/food/list  
POST   /api/order/place  
GET    /api/order/userorders  

---

## 📂 Project Structure
Food-Delivery/
├── frontend/
├── admin/
└── backend/


Each folder has its own package.json.

---

## 🔐 Authentication Flow

1. User logs in
2. Backend validates user
3. JWT token is created
4. Token stored in localStorage
5. Protected routes verify token

---

## ⚙ Environment Variables

Backend (.env)


PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key


Frontend (.env)


VITE_BASE_URL=https://food-delivery-1-ye61.onrender.com


---

## 💻 Run Locally


git clone https://github.com/Lagadnakul/Food-Delivery.git

cd Food-Delivery


Backend:


cd backend
npm install
npm run dev


Frontend:


cd frontend
npm install
npm run dev


Admin:


cd admin
npm install
npm run dev


---

## 👨‍💻 Author

Nakul Lagad  
GitHub: https://github.com/Lagadnakul/Food-Delivery

---

⭐ If you like this project, give it a star.
