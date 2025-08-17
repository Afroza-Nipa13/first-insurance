import React from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import "./SalesPromotion.css"; // Custom styles

const SalesPromotion = () => {
    const [sliderRef] = useKeenSlider({
        loop: true,
        mode: "free",
    slides: {
      perView: 3,
      spacing: 15,
    },
        breakpoints: {
            "(max-width: 868px)": {
                slides: { perView: 1, spacing: 10 },
            },
        },
    });

    return (
        <section className="py-12">
            <h2 className="text-center text-5xl font-bold text-gray-600 mb-8">
                Special <span className="text-primary">Sales </span> Promotions
            </h2>
            <p className="text-center text-lg text-gray-500 mb-12">
                Swipe to explore our special promotional offers
            </p>

            <div ref={sliderRef} className="keen-slider my-slider cursor-pointer">
                <div className="keen-slider__slide keen-slider__slide--1 border-12 border-gray-700 opacity-80 hover:opacity-100 hover:border-none rounded-4xl">
                    <div className="overlay-text">
                        <h2>Family Protection Plan</h2>
                        <p>Ensure your loved ones’ future with our family insurance package.</p>
                    </div>
                </div>
                <div className="keen-slider__slide keen-slider__slide--2 border-12 border-gray-700 opacity-80 hover:opacity-100 hover:border-none rounded-4xl">

                    <div className="overlay-text">
                        <h2>Senior Life Plan</h2>
                        <p>Retire peacefully with our senior-friendly insurance policies.</p>
                    </div>
                </div>
                <div className="keen-slider__slide keen-slider__slide--3 border-12 border-gray-700 opacity-80 hover:opacity-100 hover:border-none rounded-4xl">
                    <div className="overlay-text">
                        <h2>Car Insurance</h2>
                        <p>Drive worry-free with complete accident and damage protection.</p>
                    </div>
                </div>
                <div className="keen-slider__slide keen-slider__slide--4 border-12 border-gray-700 opacity-80 hover:opacity-100 hover:border-none rounded-4xl">


                    <div className="overlay-text">
                        <h2>Comprehensive Health Insurance</h2>
                        <p>Secure your health with our affordable medical coverage plans.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SalesPromotion;


