"use client";

import BooksPage from "@/app/books/page";
import Books from "../books/books";
import "./SecondPage.css";

export default function SecondPage() {
  return (
    <>
    <div className="products-section">

      {/* 🔥 THREE BANNERS */}
      {/* <div className="three-banners">
        
        <div className="banner-card">
          <img src="/assets/images/banner1.jpg" alt="Banner 1" />
          <div className="banner-content">
            <h3>Top Rated Books</h3>
            <p>Best picks for this month</p>
            <a href="#">Shop Now</a>
          </div>
        </div>

        <div className="banner-card">
          <img src="/assets/images/banner2.jpg" alt="Banner 2" />
          <div className="banner-content">
            <h3>New Arrivals</h3>
            <p>Fresh stories to explore</p>
            <a href="#">Discover</a>
          </div>
        </div>

        <div className="banner-card">
          <img src="/assets/images/banner3.jpg" alt="Banner 3" />
          <div className="banner-content">
            <h3>Bestsellers</h3>
            <p>Books everyone is reading</p>
            <a href="#">View Books</a>
          </div>
        </div>

      </div> */}

      {/* 🔥 PRODUCTS TITLE
      <div className="products-title">
        <h2>Featured Books</h2>
        <p>Explore the top trending books chosen by thousands of readers.</p>
      </div> */}

      {/* 🔥 CATEGORY BUTTONS
      <div className="category-buttons">
        <button className="active">Fiction</button>
        <button>Romance</button>
        <button>Mystery</button>
        <button>Self-Help</button>
      </div> */}

      {/* 🔥 PRODUCT GRID */}
      <div className="product-grid">

        <div className="product-card">
          <div className="product-img-box">
            <img src="/assets/images/book1.jpg" alt="Book 1" />
            <span className="discount-badge">20% OFF</span>
          </div>
          <div className="product-info">
            <span className="vendor">Penguin</span>
            <h3>Book Title One</h3>
            <p className="price">12.99</p>
          </div>
        </div>

        <div className="product-card">
          <div className="product-img-box">
            <img src="/assets/images/book2.jpg" alt="Book 2" />
            <span className="discount-badge">15% OFF</span>
          </div>
          <div className="product-info">
            <span className="vendor">HarperCollins</span>
            <h3>Book Title Two</h3>
            <p className="price">₹19.99</p>
          </div>
        </div>

        <div className="product-card">
          <div className="product-img-box">
            <img src="/assets/images/book3.jpg" alt="Book 3" />
          </div>
          <div className="product-info">
            <span className="vendor">Oxford Press</span>
            <h3>Book Title Three</h3>
            <p className="price">₹9.49</p>
          </div>
        </div>

        <div className="product-card">
          <div className="product-img-box">
            <img src="/assets/images/kk.jpg" alt="Book 4" />
            <span className="discount-badge">10% OFF</span>
          </div>
          <div className="product-info">
            <span className="vendor">Scholastic</span>
            <h3>Book Title Four</h3>
            <p className="price">₹14.99</p>
          </div>
        </div>

      </div>

    </div>
  <BooksPage/>
    </>
    
  );
}
