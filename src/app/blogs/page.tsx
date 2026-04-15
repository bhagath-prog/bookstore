"use client";
import React from "react";
import "./blogs.css";

const blogs = [
  {
    id: 1,
    title: "How to Choose the Perfect Book for Your Reading Style",
    image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f",
    category: "Reading Tips",
    description:
      "Finding the right book keeps you engaged and helps build a long-lasting reading habit. Here are expert-backed tips.",
    date: "Dec 01, 2024",
  },
  {
    id: 2,
    title: "Top 10 Inspirational Books That Will Change Your Life",
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353",
    category: "Top Picks",
    description:
      "From timeless classics to modern masterpieces, here’s our list of must-read transformative books for every reader.",
    date: "Nov 22, 2024",
  },
  {
    id: 3,
    title: "Benefits of Reading Books Every Day — Backed by Science",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794",
    category: "Health",
    description:
      "Daily reading boosts your brain, reduces stress, improves focus, and enhances creativity. Let’s explore more.",
    date: "Oct 10, 2024",
  },
  {
    id: 4,
    title: "Top 7 Fiction Books to Read in 2024",
    image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93",
    category: "Fiction",
    description:
      "Looking for thrilling fiction? We bring you the best stories with unforgettable characters and plots.",
    date: "Aug 07, 2024",
  },
];

export default function BlogPage() {
  return (
    <div className="blog-wrapper">
      <h1 className="blog-main-title">Latest Blog Articles</h1>
      <p className="blog-sub-title">
        Discover reading tips, book recommendations, author stories and more.
      </p>

      <div className="blog-grid">
        {blogs.map((item) => (
          <div key={item.id} className="blog-card fade-in">
            <div className="blog-image">
              <img src={item.image} alt={item.title} />
              <span className="blog-category">{item.category}</span>
            </div>

            <div className="blog-info">
              <p className="blog-date">{item.date}</p>

              <h2 className="blog-heading">{item.title}</h2>

              <p className="blog-desc">{item.description}</p>

              <a className="blog-button">
                Read More <span>→</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
