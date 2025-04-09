import React from 'react'
import Header from '../Components/Header'
import Steps from '../Components/Steps'
import Despcription from '../Components/Despcription'
import Testimonials from '../Components/Testimonials'
import GenerateButton from '../Components/GenerateButton'

const Home = () => {
  return (
    <div>
        <Header/>
        <Steps/>
        <Despcription/>
        <Testimonials/>
        <GenerateButton/>
    </div>
  )
}

export default Home