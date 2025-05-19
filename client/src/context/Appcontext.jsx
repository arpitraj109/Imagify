import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from 'axios'
import { useNavigate } from "react-router-dom";


export const AppContext = createContext();


const AppContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [showLogin,setShowLogin]=useState(false);
    const [token,setToken]=useState(localStorage.getItem('token'))

    const [credit,setCredit]=useState(false)
    
    // Use local backend URL
    const backendUrl = 'http://localhost:4000'

    const navigate=useNavigate()

    const loadCreditData=async()=>{
        try{
            const {data}=await axios.get(`${backendUrl}/api/user/credits`,{headers:{token}})

            if(data.success)
            {
                setCredit(data.credits)
                setUser(data.user)
            }
        }
        catch(error)
        {
            console.log(error)
            toast.error(error.message)
        }
    }
    const generateImage = async (prompt) => {
        try {
            if (!prompt) {
                toast.error("Prompt cannot be empty");
                return;
            }
    
            const { data } = await axios.post(
                `${backendUrl}/api/image/generate-image`,
                { prompt },
                { headers: { token } }
            );
    
            if (data.success) {
                loadCreditData(); // Refresh user credits
                return data.resultImage;
            } else {
                toast.error(data.message || "Image generation failed");
                loadCreditData();
    
                if (data.creditBalance === 0) {
                    navigate('/buy');
                }
            }
        } catch (error) {
            console.error("Error generating image:", error);
            toast.error(error.response?.data?.message || "An error occurred. Please try again.");
        }
    };
    
    const logout=()=>{
        localStorage.removeItem('token');
        setToken('')
        setUser(null)
    }
    useEffect(()=>{
        if(token)
        {
            loadCreditData()
        }
    },[token])

    const value = {
        user,
        setUser,
        showLogin,
        setShowLogin,
        backendUrl,
        token,
        setToken,
        credit,
        setCredit,
        loadCreditData,
        logout,
        generateImage
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;
