import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import './home.css';
import SecondPage from "../SecondPage/SecondPage";



export default function Home() {
  const slides = [
    {
      img: "/assets/images/slider1.png",
      title: "Discover Your Next Favorite Book",
      desc: "Explore thousands of stories, knowledge, and imagination—all in one place.",
      cta: "Browse Collection"
    },
    {
      img: "/assets/images/slider2.png",
      title: "A World of Books Awaits You",
      desc: "From classics to modern bestsellers, dive into the universe of reading.",
      cta: "Explore Now"
    },
    {
      img: "/assets/images/slider3.jpg",
      title: "Unlock the Power of Reading",
      desc: "Nurture your mind with books that inspire, educate, and empower.",
      cta: "Start Reading"
    },
  ];

  // Add fallback background color
  const fallbackBg = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";

  return (
    <>
      <div className="home-container">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          autoplay={{ 
            delay: 4000,
            disableOnInteraction: false 
          }}
          pagination={{ 
            clickable: true,
            dynamicBullets: true 
          }}
          speed={1000}
          loop={true}
          className="hero-swiper"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div
                className="hero-slide"
                style={{ 
                  backgroundImage: `url(${slide.img}), ${fallbackBg}`,
                }}
                onError={(e) => {
                  // Fallback if image fails to load
                  e.currentTarget.style.backgroundImage = fallbackBg;
                }}
              >
                <div className="hero-overlay">
                  <div className="hero-content">
                    <h1 className="hero-title">{slide.title}</h1>
                    <p className="hero-desc">{slide.desc}</p>
                    <button className="hero-cta-btn">
                      {slide.cta}
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <SecondPage/>
    </>
  );
}