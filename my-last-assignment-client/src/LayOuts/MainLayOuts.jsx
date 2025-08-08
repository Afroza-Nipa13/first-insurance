import React, { useEffect } from 'react';
import Navbar from '../Shared/Navbar/Navbar';
import Footer from '../Shared/Footer/Footer';
import { Outlet, useNavigate } from 'react-router';
import Container from '../Shared/Container';
import AOS from 'aos';
import "aos/dist/aos.css";
import Banner from '../Pages/Home/Banner/Banner';
import LoadingSpinner from '../Shared/LoadingSpinner';
import Scrollbar from '../Shared/Scrollbar';

const MainLayOuts = () => {
    const navigation= useNavigate()

    
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: false,
            mirror: false,
        })
    }, [])


    if (navigation.state === 'loading') {
        return <LoadingSpinner />;
    }
    return (
        <div className='mx-auto'>
            <Navbar></Navbar>
            <Outlet></Outlet>
             <Scrollbar></Scrollbar>   
            <Footer></Footer>


        </div>
    );
};

export default MainLayOuts;