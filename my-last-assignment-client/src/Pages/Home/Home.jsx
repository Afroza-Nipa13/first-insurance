import React from 'react';
import Container from '../../Shared/Container';
import Banner from './Banner/Banner';
import OurServices from './OurService/OurServices';

import TestimonialsMarquee from './TestimonialMarquee/TestimonialsMarquee';
import LatestBlogs from './LatestBlogs/LatestBlogs';
import NewsLetter from './NewsLetter/NewsLetter';
import MeetOurAgents from './OurAgents/MeetOurAgents';
import { Helmet } from 'react-helmet-async';
import ClientsMarquee from './ClientsMarquee/ClientsMarquee';

const Home = () => {

    return (

        <div className='pt-19 min-h-screen'>
            <Helmet>
                <title>FIRST Life Insurance | Home</title>
                <meta name="description" content="Welcome to FIRST Life Insurance - Your trusted partner in securing your future." />
            </Helmet>
            <Banner></Banner>
            <Container>
                <OurServices></OurServices>
                <TestimonialsMarquee></TestimonialsMarquee>
                <LatestBlogs></LatestBlogs>
                <NewsLetter></NewsLetter>
                <MeetOurAgents></MeetOurAgents>
                <ClientsMarquee></ClientsMarquee>
                

            </Container>
            
        </div>

    );
};

export default Home;