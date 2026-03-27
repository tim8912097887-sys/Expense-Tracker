# 💰 Expense Tracker (MERN)
## Description

A full-stack application designed to help users track their financial health by managing income, expenses, and budget categories in real-time.

## 🚀 Features

- User Authentication: Secure signup/login with JWT and protected routes.
- Account Verification: Send TOTP email to let user verify their account.
- Forgot Password: Send TOTP email to let user reset their password.
- Login Lock: Lock the account if exceed the limit of login time.
- Logout And Logout All: Use token blacklist to logout one token,use token versioning to logout all token related to one user.

## 🛠️ Tech Stack

- Frontend: React, Tailwind CSS, Axios.
- Backend: Node.js, Express.js.
- Database: MongoDB with Mongoose ORM.
- State Management: Context API or Redux Toolkit.

## 🏁 Getting Started

1. Prerequisites

Ensure you have the following installed:

- Node.js (v20+ recommended)
- MongoDB (Local instance or Atlas URI or Docker Image)
- pnpm (Preferred) or npm

2. Installation

Clone the repository and install dependencies for both the client and server:

Server:

```bash
# Navigate to Server
cd server

# Install dependencies
pnpm install

3. Environment Variables

 1. Create a .env file in the server directory.
 2. Include all environment variables in the .env.example file.

4. Running the Application

Open two terminals to run both parts of the stack simultaneously:

Server:

```bash
# Navigate to Server
cd server

# Run the command
pnpm run dev

## 📑 API Endpoints

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :---: | :--- |
| **POST** | `/api/v1/auth/register` | ❌ | User signup |
| **POST** | `/api/auth/login` | ❌ | User authentication |
| **POST** | `/api/auth/logout` | ✅ | User logout by token blacklist |
| **POST** | `/api/auth/logoutall` | ✅ | User logout by token versioning |
| **POST** | `/api/auth/account/verify` | ✅ | User verify their account |
| **POST** | `/api/auth/forgot-password` | ✅ | User get TOTP for reset password |
| **POST** | `/api/auth/reset-password` | ✅ | User reset password |

## 📄 License

Distributed under the MIT License. See LICENSE for more information.


