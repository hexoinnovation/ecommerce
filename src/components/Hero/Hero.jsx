import React from "react";
import Slider from "react-slick";
import Image3 from "../../assets/hero/sale.png";
import Image2 from "../../assets/hero/shopping.png";
import Image1 from "../../assets/hero/women.png";

const ImageList = [
  {
    id: 1,
    img: Image1,
    title: "Upto 50% off on all Men's Wear",
    description:
      "Shop the best of men's fashion with unbeatable prices and modern styles.",
  },
  {
    id: 2,
    img: Image2,
    title: "30% off on all Women's Wear",
    description:
      "Discover the latest trends in women's fashion. Stylish, affordable, and available now.",
  },
  {
    id: 3,
    img: Image3,
    title: "70% off on all Products Sale",
    description:
      "Don't miss out! Huge discounts on all products. Limited time offer.",
  },
];

const Hero = ({ handleOrderPopup }) => {
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 800,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "ease-in-out",
    pauseOnHover: false,
    pauseOnFocus: true,
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-gray-800 dark:bg-gray-950 min-h-[600px] flex items-center">
      <div className="absolute inset-0 bg-opacity-60 bg-black"></div>
      <div className="container mx-auto px-6 z-10">
        <Slider {...settings}>
          {ImageList.map((data) => (
            <div key={data.id} className="relative">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Text Section */}
                <div className="text-center lg:text-left">
                  <h1
                    className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 tracking-wide"
                    data-aos="fade-right"
                  >
                    {data.title}
                  </h1>
                  <p
                    className="text-lg sm:text-xl text-gray-300 mb-6"
                    data-aos="fade-right"
                    data-aos-delay="200"
                  >
                    {data.description}
                  </p>
                  <div data-aos="fade-right" data-aos-delay="400">
                    <button
                      onClick={handleOrderPopup}
                      className="inline-block bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-lg font-semibold py-3 px-8 rounded-full shadow-lg transform transition-transform hover:scale-105"
                    >
                      Shop Now
                    </button>
                  </div>
                </div>

                {/* Image Section */}
                <div
                  className="flex justify-center lg:justify-end"
                  data-aos="zoom-in"
                  data-aos-duration="1200"
                >
                  <img
                    src={data.img}
                    alt={data.title}
                    className="w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[500px] lg:h-[500px] object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-110"
                  />
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Hero;
