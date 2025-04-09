import React, { useContext } from 'react'
import { Route,Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import Home from './pages/Home'
import BuyCredit from './pages/BuyCredit'
import Result from './pages/Result'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import Login from './Components/Login'
import { AppContext } from './context/Appcontext'
import ScrollToTop from './Components/ScrollToTop';


const App = () => {
  const{showLogin}=useContext(AppContext)
  return (
    <div className='px-4 sm:px-10 md:px-14 lg:px-28 min-h-screen bg-gradient-to-b from-teal-50 to-orange-50'>
      <ScrollToTop/>
      <ToastContainer position='bottom-right'/>
      <Navbar/>
      {showLogin && <Login/>} 
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/result' element={<Result/>}/>
        <Route path='/buy' element={<BuyCredit/>}/>
      </Routes>
      <Footer/>
    </div>
  )
}

export default App