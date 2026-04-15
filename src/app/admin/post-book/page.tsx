"use client";

import React, { useState, useEffect } from "react";
import "../../admin/admin.css";

interface BookFormData {
  bookName: string;
  authorName: string;
  description: string;
  mrpPrice: string;
  salePrice: string;
  status: 'draft' | 'active';
  image1: File | null;
  image2: File | null;
}

interface Book {
  _id: string;
  bookName: string;
  authorName: string;
  description: string;
  mrpPrice: number;
  salePrice: number;
  status: 'draft' | 'active';
  image1: string;
  image2: string;
  createdAt: string;
}

export default function PostBook() {
  const [formData, setFormData] = useState<BookFormData>({
    bookName: "",
    authorName: "",
    description: "",
    mrpPrice: "",
    salePrice: "",
    status: 'draft',
    image1: null,
    image2: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [imagePreview1, setImagePreview1] = useState<string>("");
  const [imagePreview2, setImagePreview2] = useState<string>("");

  useEffect(() => {}, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, imageNumber: 1 | 2) => {
    const file = e.target.files?.[0];
    if (file) {
      if (imageNumber === 1) {
        setFormData(prev => ({ ...prev, image1: file }));
        setImagePreview1(URL.createObjectURL(file));
      } else {
        setFormData(prev => ({ ...prev, image2: file }));
        setImagePreview2(URL.createObjectURL(file));
      }
    }
  };

  const removeImage = (imageNumber: 1 | 2) => {
    if (imageNumber === 1) {
      setFormData(prev => ({ ...prev, image1: null }));
      setImagePreview1("");
      const fileInput = document.getElementById('image1') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } else {
      setFormData(prev => ({ ...prev, image2: null }));
      setImagePreview2("");
      const fileInput = document.getElementById('image2') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    if (!formData.image1 || !formData.image2) {
      setMessage("Please upload both images");
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('bookName', formData.bookName);
      formDataToSend.append('authorName', formData.authorName);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('mrpPrice', formData.mrpPrice);
      formDataToSend.append('salePrice', formData.salePrice);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('image1', formData.image1);
      formDataToSend.append('image2', formData.image2);

      const response = await fetch('/api/books', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Book posted successfully with images!");
        setFormData({
          bookName: "",
          authorName: "",
          description: "",
          mrpPrice: "",
          salePrice: "",
          status: 'draft',
          image1: null,
          image2: null
        });
        setImagePreview1("");
        setImagePreview2("");
      } else {
        setMessage(data.error || "Error posting book");
      }
    } catch (error) {
      setMessage("Network error. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="post-book">
      <h1>Post New Book</h1>

      {message && (
        <div className={`message ${message.includes("Error") ? "error" : "success"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="book-form" encType="multipart/form-data">

        {/* ⭐ ADDED GRID WRAPPER */}
        <div className="form-grid">

          <div className="form-group">
            <label htmlFor="bookName">Book Name *</label>
            <input
              type="text"
              id="bookName"
              name="bookName"
              value={formData.bookName}
              onChange={handleChange}
              required
              placeholder="Enter book name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="authorName">Author Name *</label>
            <input
              type="text"
              id="authorName"
              name="authorName"
              value={formData.authorName}
              onChange={handleChange}
              required
              placeholder="Enter author name"
            />
          </div>

          <div className="form-group full">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Enter book description"
              rows={4}
            />
          </div>

          <div className="price-row full">
            <div className="form-group">
              <label htmlFor="mrpPrice">MRP Price *</label>
              <input
                type="number"
                id="mrpPrice"
                name="mrpPrice"
                value={formData.mrpPrice}
                onChange={handleChange}
                required
                placeholder="Enter MRP price"
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label htmlFor="salePrice">Sale Price *</label>
              <input
                type="number"
                id="salePrice"
                name="salePrice"
                value={formData.salePrice}
                onChange={handleChange}
                required
                placeholder="Enter sale price"
                min="0"
                step="0.01"
              />
            </div>
          </div>

        </div>

        {/* IMAGE UPLOAD SECTION */}
        <div className="image-upload-section">
          <h3>Book Images *</h3>
          <p className="upload-help">Upload 2 images of the book (Cover and Preview)</p>

          <div className="image-upload-row">
            <div className="image-upload-group">
              <label htmlFor="image1" className="image-upload-label">
                {imagePreview1 ? (
                  <div className="image-preview">
                    <img src={imagePreview1} alt="Preview 1" />
                    <button type="button" className="remove-image-btn" onClick={() => removeImage(1)}>✕</button>
                  </div>
                ) : (
                  <div className="image-upload-placeholder">
                    <span className="upload-icon">📷</span>
                    <span className="upload-text">Upload Image 1</span>
                    <span className="upload-subtext">(Cover Image)</span>
                  </div>
                )}
              </label>
              <input
                type="file"
                id="image1"
                name="image1"
                accept="image/*"
                onChange={(e) => handleImageChange(e, 1)}
                required
                className="image-input"
              />
            </div>

            <div className="image-upload-group">
              <label htmlFor="image2" className="image-upload-label">
                {imagePreview2 ? (
                  <div className="image-preview">
                    <img src={imagePreview2} alt="Preview 2" />
                    <button type="button" className="remove-image-btn" onClick={() => removeImage(2)}>✕</button>
                  </div>
                ) : (
                  <div className="image-upload-placeholder">
                    <span className="upload-icon">📸</span>
                    <span className="upload-text">Upload Image 2</span>
                    <span className="upload-subtext">(Preview Image)</span>
                  </div>
                )}
              </label>
              <input
                type="file"
                id="image2"
                name="image2"
                accept="image/*"
                onChange={(e) => handleImageChange(e, 2)}
                required
                className="image-input"
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="status-select"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
          </select>
        </div>

        <button type="submit" className={`submit-btn ${isSubmitting ? "loading" : ""}`} disabled={isSubmitting}>
          {isSubmitting ? "Posting Book..." : "Post Book"}
        </button>

      </form>
    </div>
  );
}
