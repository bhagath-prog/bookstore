"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductPage() {
  const [selectedImg, setSelectedImg] = useState(0);
  const [activeTab, setActiveTab] = useState("description");

  const book = {
    title: "The Midnight Library",
    author: "Matt Haig",
    price: 24.99,
    originalPrice: 29.99,
    rating: 4.5,
    reviews: 1247,
    description:
      "Between life and death, there is a library. Every book offers you a chance to live another life you could have lived.",
    pages: 304,
    publisher: "Penguin Publishing",
    language: "English",
    isbn: "978-0-525-55948-6",
    stock: 12,
    category: "Fiction",
  };

  const images = [
    "https://picsum.photos/600/800?random=1",
    "https://picsum.photos/600/800?random=2",
    "https://picsum.photos/600/800?random=3",
    "https://picsum.photos/600/800?random=4",
  ];

  const relatedBooks = [
    {
      title: "The Invisible Life of Addie LaRue",
      author: "V.E. Schwab",
      price: 19.99,
      img: "https://picsum.photos/400/600?random=11",
    },
    {
      title: "Project Hail Mary",
      author: "Andy Weir",
      price: 28.99,
      img: "https://picsum.photos/400/600?random=10",
    },
    {
      title: "The Song of Achilles",
      author: "Madeline Miller",
      price: 17.49,
      img: "https://picsum.photos/400/600?random=12",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-6">
          Home / Books / Fiction / <span className="font-semibold">{book.title}</span>
        </nav>

        <div className="bg-white rounded-lg shadow p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left — Images */}
          <div>
            <div className="w-full aspect-[3/4] rounded-lg overflow-hidden shadow">
              <Image
                src={images[selectedImg]}
                alt="Book image"
                width={600}
                height={800}
                className="object-cover w-full h-full"
              />
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-3 mt-4">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImg(index)}
                  className={`border rounded-lg overflow-hidden ${
                    selectedImg === index ? "border-blue-600" : "border-gray-300"
                  }`}
                >
                  <Image
                    src={img}
                    alt="Thumbnail"
                    width={200}
                    height={260}
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right — Book Info */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{book.title}</h1>
            <p className="text-gray-600 text-lg">by {book.author}</p>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <p className="text-yellow-500 text-lg">⭐ {book.rating}</p>
              <p className="text-gray-500 text-sm">({book.reviews} reviews)</p>
            </div>

            {/* Price */}
            <div className="text-2xl font-bold text-blue-600">
              ${book.price}
              {book.originalPrice && (
                <span className="text-gray-400 text-lg line-through ml-3">
                  ${book.originalPrice}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-700">{book.description}</p>

            {/* Stock */}
            <p className="text-sm text-green-600 font-medium">
              {book.stock > 0 ? `In Stock (${book.stock} available)` : "Out of Stock"}
            </p>

            {/* Buttons */}
            <div className="flex gap-4 mt-5">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium">
                Add to Cart
              </button>
              <button className="border border-blue-600 text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-blue-50">
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12 bg-white p-6 rounded-lg shadow">
          <div className="flex gap-6 border-b pb-3">
            {["description", "details", "reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 capitalize ${
                  activeTab === tab
                    ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                    : "text-gray-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {activeTab === "description" && (
              <p className="text-gray-700 leading-relaxed">{book.description}</p>
            )}

            {activeTab === "details" && (
              <ul className="text-gray-700 space-y-2">
                <li><b>Pages:</b> {book.pages}</li>
                <li><b>Publisher:</b> {book.publisher}</li>
                <li><b>Language:</b> {book.language}</li>
                <li><b>ISBN:</b> {book.isbn}</li>
              </ul>
            )}

            {activeTab === "reviews" && (
              <p className="text-gray-500">Reviews section coming soon…</p>
            )}
          </div>
        </div>

        {/* Related Books */}
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6">Related Books</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {relatedBooks.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition">
                <Image
                  src={item.img}
                  alt={item.title}
                  width={400}
                  height={600}
                  className="rounded-md object-cover w-full h-[300px]"
                />
                <h3 className="mt-3 font-semibold">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.author}</p>
                <p className="text-blue-600 font-bold mt-1">${item.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
