import userModel from '../model/usermodel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import razorpay from 'razorpay';
import transactionModel from '../model/transactionModel.js';
import nodemailer from 'nodemailer';

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Function to generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to send OTP
const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

        await userModel.findByIdAndUpdate(user._id, {
            otp,
            otpExpiry
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP for ImageT Verification',
            text: `Your OTP for verification is: ${otp}. This OTP will expire in 10 minutes.`
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'OTP sent successfully' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Function to verify OTP
const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        if (user.otp !== otp) {
            return res.json({ success: false, message: 'Invalid OTP' });
        }

        if (user.otpExpiry < new Date()) {
            return res.json({ success: false, message: 'OTP has expired' });
        }

        await userModel.findByIdAndUpdate(user._id, {
            isVerified: true,
            otp: null,
            otpExpiry: null
        });

        res.json({ success: true, message: 'OTP verified successfully' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: 'Email already registered' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name,
            email,
            password: hashedPassword,
            isVerified: false
        };

        const newUser = new userModel(userData);
        const user = await newUser.save();

        // Send OTP after registration
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        await userModel.findByIdAndUpdate(user._id, {
            otp,
            otpExpiry
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP for ImageT Verification',
            text: `Your OTP for verification is: ${otp}. This OTP will expire in 10 minutes.`
        };

        await transporter.sendMail(mailOptions);

        res.json({ 
            success: true, 
            message: 'Registration successful. Please verify your email with the OTP sent.',
            user: { name: user.name, email: user.email }
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            if (!user.isVerified) {
                return res.json({ 
                    success: false, 
                    message: 'Please verify your email first. Check your inbox for the OTP.' 
                });
            }
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
            res.json({ success: true, token, user: { name: user.name } });
        } else {
            return res.json({ success: false, message: 'Invalid Password' });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

const userCredits=async(req,res)=>{
    try{
        const {userId}=req.body;



        const user=await userModel.findById(userId)
        res.json({success:true, credits:user.creditBalance, user:{
            name:user.name
        }})
    }
    catch(error)
    {
        console.log(error)
        res.json({success:false,message:error.message})

    }

}

const razorpayInstance=new razorpay({
    key_id:process.env.RAZORPAY_KEY_ID,
    key_secret:process.env.RAZORPAY_KEY_SECRET,
});

const paymentRazorpay = async (req, res) => {
    try {
        const { userId, planId } = req.body;

        // Validate that both userId and planId are provided
        if (!userId || !planId) {
            return res.status(400).json({ success: false, message: 'Missing Details: userId or planId is required' });
        }

        // Validate the user exists in the database
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Define valid plans
        const plans = {
            Basic: { credits: 100, amount: 10 },
            Advanced: { credits: 500, amount: 50 },
            Business: { credits: 5000, amount: 250 },
        };

        // Validate if the provided planId exists in the valid plans
        if (!plans[planId]) {
            return res.status(400).json({ success: false, message: `Invalid planId: ${planId}` });
        }

        // Retrieve plan details
        const { credits, amount } = plans[planId];
        const transactionData = {
            userId,
            plan: planId,
            amount,
            credits,
            date: Date.now(),
        };

        // Create a transaction record
        const newTransaction = await transactionModel.create(transactionData);

        // Razorpay order options
        const options = {
            amount: amount * 100, // Amount in smallest currency unit (paise)
            currency: process.env.CURRENCY || 'INR',
            receipt: newTransaction._id.toString(),
        };

        // Create Razorpay order
        const order = await razorpayInstance.orders.create(options);
        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}


    const verifyRazorpay=async(req,res)=>{
        try{
            const {razorpay_order_id}=req.body;
            const orderInfo=await razorpayInstance.orders.fetch(razorpay_order_id)
            if(orderInfo.status==="paid"){
                const transactionData=await transactionModel.findById(orderInfo.receipt)
                if(transactionData.payment)
                {
                    return res.json({success:false,message:'Payment Failed'})
                }
            

            const userData=await userModel.findById(transactionData.userId)

            const creditBalance=userData.creditBalance+transactionData.credits
            await userModel.findByIdAndUpdate(userData._id,{creditBalance})

            await transactionModel.findByIdAndUpdate(transactionData._id,{payment:true})

            res.json({success:true,message:'Credits Added'})
            }
        
        else{
            res.json({success:false,message:'Payment failed'})
        }
     } catch(error)
        {
            console.log(error);
            res.json({success:false,message:error.message});
        }
    

};

// Function to handle forgot password request
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'User not found' });
        }

        // Generate reset token
        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const resetExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        await userModel.findByIdAndUpdate(user._id, {
            passwordResetToken: resetToken,
            passwordResetExpiry: resetExpiry
        });

        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request - ImageT',
            html: `
                <h2>Password Reset Request</h2>
                <p>You requested to reset your password. Click the link below to reset it:</p>
                <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
                <p>This link will expire in 15 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
            `
        };

        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Password reset link sent to your email' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Function to reset password
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.json({ success: false, message: 'Missing required fields' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findOne({
            _id: decoded.id,
            passwordResetToken: token,
            passwordResetExpiry: { $gt: new Date() }
        });

        if (!user) {
            return res.json({ success: false, message: 'Invalid or expired reset token' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await userModel.findByIdAndUpdate(user._id, {
            password: hashedPassword,
            passwordResetToken: null,
            passwordResetExpiry: null
        });

        res.json({ success: true, message: 'Password reset successful' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export {registerUser,loginUser,userCredits,paymentRazorpay,verifyRazorpay,sendOTP,verifyOTP,forgotPassword,resetPassword}