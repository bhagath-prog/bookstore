"use client";

import Slider from "./components/Slider/Slider";
import SecondPage from "./components/SecondPage/SecondPage";

export default function Home() {
  const slides = [
    {
      img: "/assets/images/slider1.png",
      title: "Discover Your Next Favorite Book",
      desc: "Explore thousands of stories, knowledge, and imagination—all in one place.",
      cta: "Browse Collection",
    },
    {
      img: "/assets/images/slider2.png",
      title: "A World of Books Awaits You",
      desc: "From classics to modern bestsellers, dive into the universe of reading.",
      cta: "Explore Now",
    },
    {
      img: "/assets/images/slider3.jpg",
      title: "Unlock the Power of Reading",
      desc: "Nurture your mind with books that inspire, educate, and empower.",
      cta: "Start Reading",
    },
  ];

  return (
    <>
      <Slider slides={slides} />
      <SecondPage />
    </>
  );
}
