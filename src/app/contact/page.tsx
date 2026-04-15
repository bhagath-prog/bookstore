"use client";

import React, { useState } from "react";
import "../components/Contact/contact.css";

interface FormData {
  name: string;
  email: string;
  message: string;
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    alert("Thank you for your message! We will get back to you soon.");

    setFormData({ name: "", email: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <div className="contact-wrapper">
      <div className="contact-container">
        <div className="contact-header">
          <h1>Get In Touch</h1>
          <p>
            We'd love to hear from you. Send us a message and we'll respond as
            soon as possible.
          </p>
        </div>

        <div className="contact-content">
          {/* LEFT SIDE INFO */}
          <div className="contact-info-section">
            <div className="contact-info">
              <h2>Contact Information</h2>
              <p className="contact-info-description">
                Fill out the form and our team will get back to you within 24
                hours.
              </p>

              <div className="info-items">
                <div className="info-item">
                  <div className="icon-wrapper">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                      <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                    </svg>
                  </div>
                  <div className="info-text">
                    <h3>Email</h3>
                    <p>hello@example.com</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="icon-wrapper">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="info-text">
                    <h3>Phone</h3>
                    <p>+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="icon-wrapper">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.54 22.351l.07.04.028.16a.76.76 0 00.723 0l.028-.015.071-.041A16.975 16.975 0 0013.574 21.4a19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282c.401.258.77.486 1.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="info-text">
                    <h3>Address</h3>
                    <p>123 Main Street, City, State 12345</p>
                  </div>
                </div>
              </div>

              {/* Social Icons */}
              <div className="social-links">
                <h3>Follow Us</h3>
                <div className="social-icons">
                  <a href="#" className="social-icon">
                    {/* facebook */}
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073C24 5.373 18.627 0 12 0S0 5.373 0 12.073c0 5.99 4.388 10.954 10.125 11.854V15.54H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.49 0-1.955.925-1.955 1.874v2.25h3.328l-.532 3.47h-2.796V23.927C19.612 23.027 24 18.062 24 12.073z"></path>
                    </svg>
                  </a>

                  {/* twitter */}
                  <a href="#" className="social-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723A10.016 10.016 0 0119.1 3.817a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06A4.923 4.923 0 003.88 14.86a4.996 4.996 0 01-2.212.085A4.936 4.936 0 006.27 18.36 9.867 9.867 0 012.168 20.4a13.995 13.995 0 007.557 2.209C18.778 22.61 23.723 15.114 23.723 9.125c0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"></path>
                    </svg>
                  </a>

                  {/* instagram */}
                  <a href="#" className="social-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163C15.204 2.163 15.584 2.175 16.85 2.233 20.102 2.381 21.621 3.924 21.769 7.152c.058 1.265.069 1.645.069 4.849s-.012 3.584-.069 4.849c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.849-.07c-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849s.013-3.583.07-4.849c.149-3.227 1.664-4.771 4.919-4.919 1.266-.058 1.645-.07 4.849-.07zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12s.014 3.668.072 4.948c.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24s3.668-.014 4.948-.072c4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948s-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324A6.162 6.162 0 0012 5.838zM18.406 4.155a1.44 1.44 0 110 2.881 1.44 1.44 0 010-2.881z"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* FORM */}
          <form className="contact-form" onSubmit={handleSubmit}>
            <h2>Send us a Message</h2>

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="message">Your Message</label>
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us how we can help you..."
              ></textarea>
            </div>

            <button
              type="submit"
              className={`submit-btn ${isSubmitting ? "submitting" : ""}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner"></div>
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
