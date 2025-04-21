# SAAS Api - Backend

SAAS APi is an online platform that connects users with service professionals like electricians, plumbers, and more. This is the backend service for the platform, built using **Node.js**, **Express**, and **MongoDB**.

## Features

- User authentication with JWT and Bcrypt
- Technician registration and management
- Service and booking management
- Admin panel for managing users and technicians
- Image upload integration with Firebase/Cloudinary
- Real-time notifications and booking management

## Technologies Used

- **Node.js** - JavaScript runtime
- **Express** - Web framework for Node.js
- **MongoDB** - NoSQL database for storing user and technician data
- **JWT (JSON Web Token)** - Authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Image and file storage
- **Mongoose** - MongoDB ORM for managing schema and data

## Rate Limiting

To protect against **brute-force login attacks**, the backend implements **rate limiting** on the login API using the `express-rate-limit` middleware. This ensures that after a certain number of failed login attempts, further login attempts from the same IP address are temporarily blocked, making it harder for attackers to guess passwords.

For example:
- A user is allowed up to **5 failed login attempts** within **15 minutes**.
- After this limit is reached, further login attempts will be blocked for **15 minutes**.

This rate limiting helps ensure the security and stability of the platform.

## Installation

### Prerequisites

- Node.js
- MongoDB (local or cloud, e.g., MongoDB Atlas)
- Firebase (or Cloudinary) credentials for image upload

### Steps to Run the Backend

1. Clone the repo:

   ```bash
   git clone https://github.com/Prasanna6060/Backend-Apis.git
