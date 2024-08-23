# 🌟 Backend: Node.js with Express and MongoDB

This is the backend for the full-stack project, built with Node.js, Express.js, and MongoDB. It provides the server-side logic and API endpoints for user authentication, profile management, and more.

## 🚀 Features

- **User Authentication**: Signup, Login, Forgot Password, and Reset Password with OTP verification.
- **Profile Management**: Get and update user profiles.
- **Validation**: Implemented using Yup.
- **Email Sending**: For OTP and password reset functionality.

## 🏗️ Project Structure

- **Backend**: Node.js, Express.js
- **Database**: MongoDB

## 📂 Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo/backend
```

### 2. Install Dependencies
```bash
npm install
```
### 3. Environment Variables
 - Create a .env file in the frontend directory with the following variable
```bash
MONGO_URI=your_mongo_uri
JWT_SECRET=your_jwt_secret
SMTP_EMAIL=your_email_service
SMTP_PASSWORD=your_email_password
```
### 4. . Run the Backend Server Locally

```bash
npm run dev
```
- The backend will run on http://localhost:5000.

## 🚀 Deployment
 ###  Deploy on Render
- Sign Up/Login: Create an account or log in to Render at Render.
- Create a New Web Service: Connect your GitHub repository and deploy the backend service.
- Set Environment Variables: Add the necessary environment variables (MONGO_URI, JWT_SECRET, SMTP_EMAIL, SMTP_PASSWORD) in the Render dashboard.
- Deploy: Render will handle the build and deployment process.
#### Deployed backend will be available at https://evitalrx-backend-d62z.onrender.com


## 🧪 API Endpoints

- Signup: POST /api/auth/signup
- Login: POST /api/auth/login
- Forgot Password: POST /api/auth/forgot-password
- Reset Password: POST /api/auth/reset-password
- Get Profile: GET /api/auth/getprofile
- Update Profile: PUT /auth/updateprofile

  
## 🛠️ API Testing with Postman
- To test the API endpoints:

- **Import the Collection** : Download the Postman collection JSON file from the repository or create one using your Postman setup.
- **Open Postman** : Import the collection file into Postman.
- **Set Environment Variables:** Configure environment variables in Postman for your API base URL and any authentication tokens.
- **Run Tests** : Execute the API requests as defined in the collection to test all endpoints.
  
## 📦 Additional Dependencies
- **Express.js**: Web framework for Node.js
- **Mongoose**: ODM for MongoDB
- **jsonwebtoken**: For JWT authentication
- **nodemailer**: For sending emails
  
## 🤝 Contributing
 Contributions are welcome! Please submit a Pull Request to improve the backend.

  happy coding!🤝

