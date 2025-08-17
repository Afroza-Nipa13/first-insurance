import React from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import "./SalesPromotion.css"; // Custom styles

const SalesPromotion = () => {
  const [sliderRef] = useKeenSlider({
    loop: true,
    slides: {
      perView: 2,
      spacing: 15,
    },
    breakpoints: {
      "(max-width: 768px)": {
        slides: { perView: 1, spacing: 10 },
      },
    },
  });

  return (
    <section className="py-12 bg-gray-900">
      <h2 className="text-center text-3xl font-bold text-white mb-8">
        🚀 Special Sales Promotions
      </h2>

      <div ref={sliderRef} className="keen-slider my-slider">
  <div className="keen-slider__slide keen-slider__slide--1">
    Promo Text for Banner 1
  </div>
  <div className="keen-slider__slide keen-slider__slide--2">
    Promo Text for Banner 2
  </div>
  <div className="keen-slider__slide keen-slider__slide--3">
    Promo Text for Banner 3
  </div>
  <div className="keen-slider__slide keen-slider__slide--4">
    Promo Text for Banner 4
  </div>
</div>
    </section>
  );
};

export default SalesPromotion;


