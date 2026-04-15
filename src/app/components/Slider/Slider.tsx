"use client";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import "./Slider.css";

interface Slide {
  img: string;
  title: string;
  desc: string;
  cta: string;
}

interface SliderProps {
  slides: Slide[];
}

export default function Slider({ slides }: SliderProps) {
  return (
    <div className="slider-container">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div
              className="slider-slide"
              style={{ backgroundImage: `url(${slide.img})` }}
            >
              <div className="slider-overlay">
                <h1>{slide.title}</h1>
                <p>{slide.desc}</p>
                <button>{slide.cta}</button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
