import React from 'react';

import Logo from '../Shared/Logo/Logo';
import { Outlet } from 'react-router';
import Lottie from "lottie-react";
import loginLottie from '../assets/lottie/login.json'

const AuthLayOuts = () => {
   
    
    return (
        <div className="p-12 bg-base-200 max-w-screen mx-auto">
            <div>
                <Logo></Logo>
            </div>
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className='flex-1'>
                    <Outlet></Outlet>
                </div>
                <div className='flex-1'>
                    <Lottie style={{width:'450px'}} animationData={loginLottie}
                        loop={true}></Lottie>
                </div>
            </div>
        </div >
    );
};

export default AuthLayOuts;