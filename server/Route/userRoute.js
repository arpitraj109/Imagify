import express from 'express'

import { 
    registerUser, 
    loginUser, 
    userCredits, 
    paymentRazorpay, 
    verifyRazorpay,
    sendOTP,
    verifyOTP,
    forgotPassword,
    resetPassword,
    createAdminUser
} from '../controller/userController.js'
import userAuth from '../Middleware/auth.js'

const userRouter=express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
userRouter.get('/credits', userAuth, userCredits)
userRouter.post('/pay-razor', userAuth, paymentRazorpay)
userRouter.post('/verify-razor', verifyRazorpay)
userRouter.post('/send-otp', sendOTP)
userRouter.post('/verify-otp', verifyOTP)
userRouter.post('/forgot-password', forgotPassword)
userRouter.post('/reset-password', resetPassword)
userRouter.post('/create-admin', createAdminUser)

export default userRouter;


//http://localhost:4000/api/user/register
//http://localhost:4000/api/user/login
//http://localhost:4000/api/user/credits