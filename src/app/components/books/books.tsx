"use client";

import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaHeart, FaShareAlt } from "react-icons/fa";
import "./books.css"

interface Book {
  _id: string;
  bookName: string;
  authorName: string;
  description: string;
  mrpPrice: number;
  salePrice: number;
  status: string;
  image1: string;
  image2: string;
  createdAt: string;
}

interface CartItem {
  _id: string;
  bookName: string;
  authorName: string;
  salePrice: number;
  mrpPrice: number;
  image1: string;
  quantity: number;
}

export default function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hoveredBook, setHoveredBook] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    fetchBooks();
    loadCartItems();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/books");

      if (response.ok) {
        const data = await response.json();
        const activeBooks = data.filter((book: Book) => book.status === "active");
        setBooks(activeBooks);
      } else {
        setError("Failed to fetch books.");
      }
    } catch (error) {
      setError("Network error. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const loadCartItems = () => {
    const savedCart = localStorage.getItem("bookCart");
    if (savedCart) setCartItems(JSON.parse(savedCart));
  };

  const handleAddToCart = (book: Book) => {
    const existingCart = JSON.parse(localStorage.getItem("bookCart") || "[]");

    const itemIndex = existingCart.findIndex((i: CartItem) => i._id === book._id);

    if (itemIndex >= 0) {
      existingCart[itemIndex].quantity += 1;
    } else {
      existingCart.push({
        _id: book._id,
        bookName: book.bookName,
        authorName: book.authorName,
        salePrice: book.salePrice,
        mrpPrice: book.mrpPrice,
        image1: book.image1,
        quantity: 1,
      });
    }

    localStorage.setItem("bookCart", JSON.stringify(existingCart));
    setCartItems(existingCart);
  };

  const handleAddToWatchlist = (book: Book) => {
    const watchlist = JSON.parse(localStorage.getItem("bookWatchlist") || "[]");

    if (watchlist.find((b: Book) => b._id === book._id)) {
      alert("Already in wishlist!");
      return;
    }

    watchlist.push(book);
    localStorage.setItem("bookWatchlist", JSON.stringify(watchlist));
    alert("Added to wishlist ❤️");
  };

  const handleShare = async (book: Book) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: book.bookName,
          text: `${book.bookName} by ${book.authorName}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(
          `${book.bookName} by ${book.authorName} - ₹${book.salePrice}`
        );
        alert("Copied to clipboard!");
      }
    } catch {}
  };

  const calculateDiscount = (mrp: number, sale: number) =>
    Math.round(((mrp - sale) / mrp) * 100);

  const getCartCount = (id: string) => {
    const found = cartItems.find((i) => i._id === id);
    return found ? found.quantity : 0;
  };

  return (
    <div className="container4">
      <div className="headerBox4">
        <h1 className="heading4">Discover Amazing Books</h1>
        <p className="para4">Explore our curated collection</p>
      </div>

      <div className="gridWrapper4">
        {books.map((book) => {
          const qty = getCartCount(book._id);
          return (
            <div
              key={book._id}
              className="card4"
              onMouseEnter={() => setHoveredBook(book._id)}
              onMouseLeave={() => setHoveredBook(null)}
            >
              {book.salePrice < book.mrpPrice && (
                <div className="badge4">{calculateDiscount(book.mrpPrice, book.salePrice)}% OFF</div>
              )}

              <div className="imgBox4">
                <img
                  src={hoveredBook === book._id ? book.image2 : book.image1}
                  alt={book.bookName}
                  className="img4"
                />
              </div>

              <div className="content4">
                <h3 className="title4">{book.bookName}</h3>
                <p className="author4">by {book.authorName}</p>

                {/* <p className="desc4">
                  {book.description.length > 90
                    ? book.description.slice(0, 90) + "..."
                    : book.description}
                </p> */}

                <div className="priceRow4">
                  <span className="sale4">₹{book.salePrice}</span>
                  {book.salePrice < book.mrpPrice && (
                    <span className="mrp4">₹{book.mrpPrice}</span>
                  )}
                </div>

                <div className="btnRow4">
                  <button className="cartBtn4" onClick={() => handleAddToCart(book)}>
                    <FaShoppingCart /> {qty > 0 ? `Add More (${qty})` : "Add to Cart"}
                  </button>

                  <div className="iconRow4">
                    <button className="iconBtn4" onClick={() => handleAddToWatchlist(book)}>
                      <FaHeart />
                    </button>
                    <button className="iconBtn4" onClick={() => handleShare(book)}>
                      <FaShareAlt />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
