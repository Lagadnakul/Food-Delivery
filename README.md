<div align="center">
  <img src="https://raw.githubusercontent.com/Lagadnakul/Food-Delivery/main/frontend/public/logo.png" alt="Hunger Hive Logo" width="100" height="100" />
  <h1>🍔 Hunger Hive</h1>
  <p><strong>Modern Food Delivery Platform</strong></p>
  <p>
    <a href="#-features">Features</a> •
    <a href="#-live-demo">Live Demo</a> •
    <a href="#-screenshots">Screenshots</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-installation">Installation</a> •
    <a href="#-architecture">Architecture</a> •
    <a href="#-contributing">Contributing</a>
  </p>
  
  [![GitHub stars](https://img.shields.io/github/stars/Lagadnakul/Food-Delivery?style=for-the-badge)](https://github.com/Lagadnakul/Food-Delivery/stargazers)
  [![GitHub forks](https://img.shields.io/github/forks/Lagadnakul/Food-Delivery?style=for-the-badge)](https://github.com/Lagadnakul/Food-Delivery/network/members)
  [![GitHub issues](https://img.shields.io/github/issues/Lagadnakul/Food-Delivery?style=for-the-badge)](https://github.com/Lagadnakul/Food-Delivery/issues)
  [![GitHub license](https://img.shields.io/github/license/Lagadnakul/Food-Delivery?style=for-the-badge)](https://github.com/Lagadnakul/Food-Delivery/blob/main/LICENSE)
</div>

## 📋 Overview
**Hunger Hive** is a comprehensive food delivery platform that connects customers with their favorite restaurants. Built with modern web technologies, it offers an intuitive user experience for ordering food online with real-time tracking, secure payments, and instant notifications.

<p align="center">
  <img src="https://github.com/Lagadnakul/Food-Delivery/raw/main/frontend/public/banner.png" alt="Hunger Hive Banner" width="100%" />
</p>

## ✨ Features
<div align="center">
  <table>
    <tr>
      <td align="center" width="33%">
        <h3>🛒 Customer Experience</h3>
        <ul align="left">
          <li>Intuitive search & filtering</li>
          <li>Real-time order tracking</li>
          <li>Secure payment options</li>
          <li>Personalized recommendations</li>
          <li>Order history & reordering</li>
        </ul>
      </td>
      <td align="center" width="33%">
        <h3>🍽️ Restaurant Features</h3>
        <ul align="left">
          <li>Menu management system</li>
          <li>Real-time order notifications</li>
          <li>Analytics dashboard</li>
          <li>Promotional tools</li>
          <li>Customer feedback & ratings</li>
        </ul>
      </td>
      <td align="center" width="33%">
        <h3>🛠️ Technical Features</h3>
        <ul align="left">
          <li>Responsive UI for all devices</li>
          <li>Authentication & authorization</li>
          <li>RESTful API architecture</li>
          <li>Performance optimization</li>
          <li>Comprehensive error handling</li>
        </ul>
      </td>
    </tr>
  </table>
</div>

## 🚀 Live Demo
Experience Hunger Hive without installing anything:
- 🌐 [Customer Portal](https://hunger-hive.vercel.app)
- 🖥️ [Admin Dashboard](https://hunger-hive-admin.vercel.app)
- 🧪 [API Documentation](https://hunger-hive-api.vercel.app)

## 📸 Screenshots
<div align="center">
  <details open>
    <summary><b>Customer Application</b></summary>
    <br>
    <div>
      <img src="https://example.com/screenshots/homepage.png" alt="Homepage" width="400"/>
      <img src="https://example.com/screenshots/menu.png" alt="Menu Page" width="400"/>
    </div>
    <div>
      <img src="https://example.com/screenshots/checkout.png" alt="Checkout" width="400"/>
      <img src="https://example.com/screenshots/tracking.png" alt="Order Tracking" width="400"/>
    </div>
  </details>
  <details>
    <summary><b>Admin Dashboard</b></summary>
    <br>
    <div>
      <img src="https://example.com/screenshots/admin-orders.png" alt="Admin Orders" width="400"/>
      <img src="https://example.com/screenshots/admin-menu.png" alt="Admin Menu Management" width="400"/>
    </div>
  </details>
</div>

## 🛠️ Tech Stack
<div align="center">
  <table>
    <tr>
      <th>Frontend</th>
      <th>Backend</th>
      <th>DevOps</th>
    </tr>
    <tr>
      <td>
        <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/><br>
        <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS"/><br>
        <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite"/>
      </td>
      <td>
        <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/><br>
        <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js"/><br>
        <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
      </td>
      <td>
        <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white" alt="GitHub Actions"/><br>
        <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel"/><br>
        <img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/>
      </td>
    </tr>
  </table>
</div>

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB

### Setup Instructions
1. **Clone the repository**
   ```bash
   git clone https://github.com/Lagadnakul/Food-Delivery.git
   cd Food-Delivery
   ```

2. **Install dependencies for all services**
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install admin panel dependencies
   cd ../admin
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # In the backend directory
   cp .env.example .env

   # In the frontend directory
   cd ../frontend
   cp .env.example .env

   # In the admin directory
   cd ../admin
   cp .env.example .env
   ```
   Edit the `.env` files with your configuration values.

4. **Start the development servers**
   ```bash
   # Start backend server (from backend directory)
   npm run dev

   # Start frontend app (from frontend directory)
   npm run dev

   # Start admin panel (from admin directory)
   npm run dev
   ```

## 🏗️ Architecture
<div align="center">
  <img src="https://example.com/architecture-diagram.png" alt="Architecture Diagram" width="800"/>
</div>

### Project Structure
```
Food-Delivery/
├── frontend/               # Customer-facing application
│   ├── src/
│   │   ├── assets/         # Images, icons, and other static files
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React context providers
│   │   ├── Pages/          # Page components
│   │   └── utils/          # Helper functions and utilities
│   └── public/             # Public static files
│
├── admin/                  # Admin dashboard application
│   ├── src/
│   │   ├── components/     # Admin UI components
│   │   ├── pages/          # Admin pages
│   │   └── services/       # API service integrations
│   └── public/             # Public static files
│
└── backend/                # API server
    ├── config/             # Configuration files
    ├── controllers/        # Request handlers
    ├── middleware/         # Custom middleware
    ├── models/             # Database models
    └── routes/             # API route definitions
```

## 👥 Contributing
We welcome contributions to Hunger Hive! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a pull request**

Please make sure to update tests as appropriate and follow our code of conduct.

## 📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 💖 Acknowledgments
* All the awesome contributors who have helped shape Hunger Hive
* The open-source community for providing excellent tools and libraries
* Icons made by Freepik from Flaticon

## 📬 Contact
Nakul Lagad - nakullagad084@gmail.com

Project Link: https://github.com/Lagadnakul/Food-Delivery

<div align="center">
  <p>If you find this project helpful, please consider giving it a ⭐!</p>
  <a href="https://github.com/Lagadnakul/Food-Delivery">
    <img src="https://img.shields.io/github/stars/Lagadnakul/Food-Delivery?style=social" alt="GitHub stars">
  </a>
</div>