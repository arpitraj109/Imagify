# ImageT - AI Image Generation Platform

ImageT is a full-stack web application that allows users to generate images using AI technology. The platform includes user authentication, credit-based image generation, and admin functionality.

## Features

- 🔐 User Authentication
  - Email verification with OTP
  - Password reset functionality
  - Secure login system

- 🎨 Image Generation
  - AI-powered image generation using ClipDrop API
  - Credit-based system for image generation
  - Unlimited generation for admin users

- 💳 Payment Integration
  - Razorpay payment gateway integration
  - Multiple credit packages:
    - Basic: 100 credits for $10
    - Advanced: 500 credits for $50
    - Business: 5000 credits for $250

- 👤 User Management
  - Credit balance tracking
  - Admin user functionality
  - User profile management

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Axios for API calls

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Nodemailer for email services

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- ClipDrop API key
- Razorpay account
- Gmail account for email services

## Environment Variables

### Backend (.env)
```
PORT=4000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLIPDROP_API=your_clipdrop_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
FRONTEND_URL=your_frontend_url
```

### Frontend (.env)
```
VITE_API_URL=your_backend_url
```

## Installation

1. Clone the repository
```bash
git clone [repository-url]
```

2. Install backend dependencies
```bash
cd server
npm install
```

3. Install frontend dependencies
```bash
cd client
npm install
```

4. Set up environment variables
- Create `.env` files in both server and client directories
- Add the required environment variables as shown above

5. Start the development servers

Backend:
```bash
cd server
npm run dev
```

Frontend:
```bash
cd client
npm run dev
```

## API Endpoints

### Authentication
- POST `/api/user/register` - Register new user
- POST `/api/user/login` - User login
- POST `/api/user/send-otp` - Send verification OTP
- POST `/api/user/verify-otp` - Verify OTP
- POST `/api/user/forgot-password` - Request password reset
- POST `/api/user/reset-password` - Reset password

### Image Generation
- POST `/api/image/generate` - Generate new image

### Payment
- POST `/api/user/pay-razor` - Create Razorpay order
- POST `/api/user/verify-razor` - Verify payment

### Admin
- POST `/api/user/create-admin` - Create admin user

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Your Name - arpitraj109@gmail.com

Project Link: https://github.com/arpitraj109/Imagify
