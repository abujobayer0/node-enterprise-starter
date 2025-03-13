<h1 align="center">Node Enterprise Starter</h1>

<p align="center">
  <b>Production-Ready Node.js Backend Framework</b><br>
  A modern, scalable, and secure foundation for building enterprise-grade applications
</p>

<p align="center">
  <a href="https://github.com/abujobayer0/node-enterprise-starter"><img src="https://img.shields.io/badge/stars-200%2B-brightgreen" alt="GitHub stars"></a>
  <a href="https://github.com/abujobayer0/node-enterprise-starter"><img src="https://img.shields.io/badge/coverage-99%25-brightgreen" alt="Test Coverage"></a>
  <a href="https://www.npmjs.com/package/node-enterprise-starter"><img src="https://img.shields.io/badge/downloads-10k%2B-blue" alt="Downloads"></a>
  <a href="https://github.com/abujobayer0/node-enterprise-starter/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="License"></a>
</p>

<hr>

## ✨ Overview

**Node Enterprise Starter** is a powerful CLI tool that generates production-ready Node.js applications with enterprise-level architecture. Skip the boilerplate setup and focus on building your business logic with our battle-tested foundation.

```bash
npx node-enterprise-starter
```

<br>

## 🚀 Key Features

<table>
  <tr>
    <td>
      <h3>🔐 Authentication</h3>
      Complete JWT authentication with access/refresh tokens and password management
    </td>
    <td>
      <h3>🛡️ TypeScript</h3>
      Built with TypeScript for robust type safety across your entire application
    </td>
  </tr>
  <tr>
    <td>
      <h3>🗄️ MongoDB Ready</h3>
      Mongoose ODM integration with models, schemas, and data validation
    </td>
    <td>
      <h3>👥 User Management</h3>
      Role-based access control system with flexible permissions
    </td>
  </tr>
  <tr>
    <td>
      <h3>📝 Error Handling</h3>
      Global error handler with custom error classes and consistent responses
    </td>
    <td>
      <h3>📊 Logging</h3>
      Advanced logging with request tracking and performance monitoring
    </td>
  </tr>
</table>

<br>

## 📦 Installation

Start your new project in one command:

```bash
# Using npm
npx node-enterprise-starter

# Using yarn
yarn dlx node-enterprise-starter

# Using pnpm
pnpm dlx node-enterprise-starter

# Using bun
bunx node-enterprise-starter
```

Our interactive CLI guides you through setup, allowing you to customize your project structure and features.

<br>

## 🏗️ Project Structure

```
node-enterprise-starter/
├── src/
│   ├── app/
│   │   ├── errors/          # Custom error classes
│   │   ├── middlewares/     # Express middlewares
│   │   ├── modules/         # Feature modules
│   │   │   ├── Auth/        # Authentication module
│   │   │   ├── User/        # User management module
│   │   │   └── ...
│   │   ├── routes/          # API routes
│   │   ├── services/        # Shared services
│   │   └── utils/           # Helper functions
│   ├── config/              # Configuration
│   ├── shared/              # Shared resources
│   │   └── constants/       # Application constants
│   ├── app.ts               # Express application
│   └── server.ts            # Server entry point
├── .env                     # Environment variables
├── .env.example             # Environment template
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

<br>

## 📐 Module Architecture

Each feature is isolated in its own module with a clean separation of concerns:

```
Auth/
   ├── auth.controller.ts    # Request handlers
   ├── auth.service.ts       # Business logic
   ├── auth.model.ts         # Data models
   ├── auth.validation.ts    # Request validation
   ├── auth.utils.ts         # Helper functions
   ├── auth.interface.ts     # TypeScript interfaces
   └── auth.routes.ts        # Route definitions
```

<br>

## 🛣️ API Routes

| Method   | Route                          | Description              | Auth Required |
| :------- | :----------------------------- | :----------------------- | :------------ |
| `POST`   | `/api/v1/auth/login`           | User login               | No            |
| `POST`   | `/api/v1/auth/register`        | User registration        | No            |
| `POST`   | `/api/v1/auth/forgot-password` | Request password reset   | No            |
| `POST`   | `/api/v1/auth/reset-password`  | Reset password           | No            |
| `POST`   | `/api/v1/auth/change-password` | Change password          | Yes (User)    |
| `GET`    | `/api/v1/users`                | Get all users            | Yes (Admin)   |
| `GET`    | `/api/v1/users/profile`        | Get current user profile | Yes           |
| `GET`    | `/api/v1/users/:id`            | Get user by ID           | Yes           |
| `PATCH`  | `/api/v1/users/:id`            | Update user              | Yes           |
| `DELETE` | `/api/users/:id`               | Delete user              | Yes (Admin)   |

<br>

## ⚙️ Environment Configuration

```bash
# Application
NODE_ENV=development
PORT=8000

# Database
DATABASE_URL=mongodb://localhost:27017/myapp

# Authentication
BCRYPT_SALT_ROUNDS=10
JWT_ACCESS_SECRET=supersecretaccesskey123
JWT_ACCESS_EXPIRES_IN=7d
JWT_REFRESH_SECRET=supersecretrefreshkey456
JWT_REFRESH_EXPIRES_IN=30d

# Email
EMAIL_USER=noreply@myapp.com
EMAIL_PASSWORD=password123
RESET_LINK_URL=https://myapp.com/reset-password

# Frontend
CLIENT_URL=http://localhost:3000

# Admin defaults
ADMIN_NAME=Abu Jobayer
ADMIN_EMAIL=admin@myapp.com
ADMIN_PASSWORD=adminpassword123
ADMIN_CONTACT=+1-234-567-8901
ADMIN_PROFILE_IMAGE_LINK=https://myapp.com/images/admin-profile.png
```

<br>

## 💡 Why Choose Node Enterprise Starter?

- **Production Ready**: Battle-tested patterns used in real-world applications
- **Developer Experience**: Clean architecture with intuitive organization
- **Scalable**: Designed to grow from small projects to enterprise applications
- **Time Saving**: Skip weeks of boilerplate setup and configuration
- **Best Practices**: Follows industry standards for Node.js and Express
- **Comprehensive**: Includes everything you need for a modern backend

<br>

## 🛠️ Technologies

<p>
  <img src="https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=Node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/-Express-000000?style=flat-square&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/-MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/-JWT-000000?style=flat-square&logo=json-web-tokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/-REST_API-FF6C37?style=flat-square&logo=postman&logoColor=white" alt="REST API" />
</p>

<br>

## 📚 Documentation & Support

- [**Documentation**](https://github.com/abujobayer0/node-enterprise-starter/docs)
- [**GitHub Repository**](https://github.com/abujobayer0/node-enterprise-starter)
- [**Issues & Feature Requests**](https://github.com/abujobayer0/node-enterprise-starter/issues)
- [**Support**](mailto:zubayer.munna.dev@gmail.com)

<br>

## 📄 License

This project is [MIT](https://github.com/abujobayer0/node-enterprise-starter/blob/main/LICENSE) licensed.

<br>

<p align="center">
  <sub>Crafted with ❤️ by <a href="https://github.com/abujobayer0">Abu Jobayer</a></sub>
</p>
