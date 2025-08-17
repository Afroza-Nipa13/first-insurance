import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import img1 from '../../../assets/insurance1.jpg'
import img2 from '../../../assets/insurance2.jpg'
import img3 from '../../../assets/insurance3.jpg'
import img4 from '../../../assets/insurance4.jpg'
import { Link } from 'react-router';



const Banner = () => {
    const images = [img1, img2, img3, img4]
    return (

        <Carousel
            autoPlay={true}
            infiniteLoop={true}
            showThumbs={false}
            showStatus={false}
            interval={3000}
        >
            {images.map((img, index) => (
                <div key={index} className="relative h-[500px]">
                    <img
                        src={img}
                        alt={`Slide ${index + 1}`}
                        className="w-full h-full object-cover"
                    />
                    <div className='absolute inset-0 bg-black/40 flex flex-col justify-center items-start text-white text-start p-4 md:pl-20'>
                        <h2 className="text-2xl md:text-4xl font-bold mb-8 leading-tight">
                            Secure <br />
                            <span className="text-yellow-200 text-3xl md:text-6xl font-bold">Your Tomorrow</span><br />
                            <span className="text-4xl md:text-8xl">Today</span>
                        </h2>
                        <Link to='all-policies'>
                        <button className="bg-primary  text-white px-6 py-4 rounded-xl hover:bg-pink-600 cursor-pointer transition-all ">
                            Get a Free Quote
                        </button>
                        </Link>
                        
                    </div>
                </div>
            ))}
        </Carousel>

    );
};

export default Banner;