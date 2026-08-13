# 🚀 Express.js Authentication Boilerplate

This project is a **complete and production-ready authentication
module** built with **Node.js**, **Express.js**, and **MongoDB**. It is
designed so that developers at **Logiqon** can quickly clone the
repository and start building new applications without having to rewrite
the authentication system from scratch.

The boilerplate includes:

-   User Registration
-   Email OTP Verification
-   OTP Resend for Registration
-   Login
-   Forgot Password Flow (Send OTP → Verify OTP → Reset Password)
-   Clean & Scalable Folder Structure
-   Best coding practices for enterprise-level backend projects

<br>

## 📁 Folder Structure (Best Practices)

    project-root/
    ├── src/
    │   ├── config/
    │   │   └── index.js
    │   ├── controllers/
    │   │   └── User.controller.js
    │   ├── database/
    │   │   └── connectDb.js
    │   ├── middlewares/
    │   │   ├── errors/
    │   │   │   ├── HttpError.js
    │   │   │   ├── errorHandler.js
    │   │   │   └── customErrorHandler.js
    │   │   ├── auth.js
    │   │   └── multer.js
    │   ├── models/
    │   │   ├── TempUser.model.js
    │   │   └── User.model.js
    │   ├── routes/
    │   │   └── v1/
    │   │       ├── user.routes.js
    │   │       └── index.js
    │   ├── utils/
    │   │   ├── email.js
    │   │   ├── generateJwtTokens.js
    │   │   ├── getDirName.js
    │   │   ├── helpers.js
    │   │   └── joiValidation.js
    │   └── server.js
    │
    ├── .env
    ├── .env.dev
    ├── .gitignore
    ├── package-lock.json
    ├── package.json
    └── README.md



## 🧩 Authentication APIs

### **1. Signup**

**POST** `/signup` Creates a new user and sends an OTP to verify email.

### **2. Verify Signup OTP**

**POST** `/verify-otp` Verifies OTP received during registration.

### **3. Resend Signup OTP**

**POST** `/resend-register-otp` Resends OTP if the user did not receive
it.

### **4. Login**

**POST** `/login` Authenticates user using email + password.


<br>

## 🔐 Forgot Password Flow

### **5. Send Forgot Password OTP**

**POST** `/forget-password-otp` Sends OTP to user's email for password
reset.

### **6. Verify Forgot Password OTP**

**POST** `/verify-forget-password-otp` Verifies OTP for forgot password.

### **7. Resend Forgot Password OTP**

**POST** `resend-password-otp` Resend OTP for forgot password if the user did not receive.

### **8. Reset Password**

**POST** `/reset-forget-password` Resets password after OTP
verification.

<br>

## 🛠️ Technologies Used

-   **Node.js**
-   **Express.js**
-   **MongoDB / Mongoose**
-   **Nodemailer** (Email OTP)
-   **JWT Authentication**
-   **Bcrypt.js** (Password hashing)

<br>

## 🚀 Getting Started

### 1. Clone the Repository

``` bash
git clone https://github.com/Logiqon-Solutions/auth-module-backend.git
cd project-folder
```

### 2. Install Dependencies

``` bash
npm install
```

### 3. Setup Environment Variables

Create a **.env** file:

    PORT=5000
    DATABASE_URL=your_mongodb_connection_string
    EMAIL=
    PASS=
    ACCESS_TOKEN_SECRET=your_jwt_access_token_secret_key
    FORGET_RESET_TOKEN_SECRET=bcd9CN0/ZGwFACcGRzn+dc==
    SERVER_URL=http://localhost:2100
    FRONTEND_URL=http://localhost:5173
    APP_NAME=your_project_name

### 4. Start Server

``` bash
npm start
```
<br>

## 🎯 Purpose of This Boilerplate

This repository is built for **Logiqon developers** to:

-   Start new backend projects faster
-   Avoid rewriting the authentication module
-   Follow a unified folder structure and coding standard
-   Easily extend or customize authentication flows

Developers can clone this project and build new modules on top of the
existing architecture.

<br>

## 🤝 Contributing

Feel free to improve the code, fix bugs, or enhance the structure.
Submit a PR for collaboration.

<br>

## 📧 Support

For any issues or improvements, Please contact.

**Team Lead:** Imtiaz Hussain  
**Email:** imtiaz.hussain@logiqon.co / imtiazhussainsolangi111@gmail.com



