import React from 'react'
import { assets } from '../assets/assets'
import { Navigate, useNavigate } from 'react-router-dom'

const Footer = () => {
    const navigate=useNavigate()
  return (
    <div className='md:mx-10'>

        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

            <div>
                <img className='mb-5 w-40' src={assets.logo} alt="" />
                <p className='w-full md:w-2/3 text-gray-600 leading-6'>bhebb hjwbib cbwibiwbvwj wbibwi b bwivbiwbwb woihwbuibwln wkj iwbiuwbiw jvwibiw cj hwbiwbvj hwbviwbj kbih hwiubinkjkbwk ck kbwinbkw chj iwbcij nwkj jbonwkc kjbo nwkj c ciunkwj kjbibw h inw jkw i</p>
            </div>



            <div>
                <p className='text-xl font-medium mb-5'>COMPANY</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li onClick={() => {navigate('/'); window.scrollTo(0, 0);}} className="cursor-pointer">Home</li>
                    <li onClick={() => {navigate('/about'); window.scrollTo(0, 0);}} className="cursor-pointer">About us</li>
                    <li onClick={() => {navigate('/contact'); window.scrollTo(0, 0);}} className="cursor-pointer">Contact us</li>
                    <li>Privacy policy</li>
                </ul>
            </div>



            <div>
                <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>+1 123-456-7890</li>
                    <li>healthsolutions@gmail.com</li>
                </ul>
            </div>
        </div>


        <div>
            <hr />
            <p className='py-5 text-sm text-center'>Copyright 2025@ DAPS - All Right Reserved</p>
        </div>

    </div>
  )
}

export default Footer
