import userModel from '../model/usermodel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import razorpay from 'razorpay';
import transactionModel from '../model/transactionModel.js';

const registerUser=async(req,res)=>{
    try{
        const {name,email,password}=req.body

        if(!name || !email || !password)
        {
            return res.json({success:false, message:'Missing Details'})
        }
        const salt=await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)

        const userData={
            name,
            email,
            password:hashedPassword
        }

        const newUser=new userModel(userData)

        const user=await newUser.save()

        const token=jwt.sign({id:user._id}, process.env.JWT_SECRET)

        res.json({success: true,token,user:{name:user.name}})
    }
    catch(error)
    {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const loginUser=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await userModel.findOne({email})

        if(!user)
        {
            return res.json({success:false,message:'User does not exist'})

        }
        const isMatch=await bcrypt.compare(password,user.password)

        if(isMatch)
        {
            const token=jwt.sign({id:user._id},process.env.JWT_SECRET)
            res.json({success:true,token,user:{name:user.name}})

        }
        else{
            return res.json({success:false,message:'Invalid Password'})
        }
    }
    catch(error)
    {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

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

export {registerUser,loginUser,userCredits,paymentRazorpay,verifyRazorpay}