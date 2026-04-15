"use client";

import React, { useState } from "react";
import { useAdmin } from "../../AdminContext"; // Add this import
import "./login.css";

interface LoginProps {
  close?: () => void;
  onLoginSuccess?: () => void;
}

export default function Login({ close, onLoginSuccess }: LoginProps) {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Add this line to get the admin context
  const { setIsAdmin } = useAdmin();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  // =============================
  //   ADMIN PANEL NAVIGATION
  // =============================
  const navigateToAdminPanel = () => {
    window.location.href = "/admin/dashboard";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // --------------------
    // VALIDATION
    // --------------------
    if (isSignup) {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        setIsLoading(false);
        return;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        setIsLoading(false);
        return;
      }
    }

    // --------------------
    // ADMIN LOGIN - REDIRECT TO ADMIN PANEL
    // --------------------
    if (!isSignup && formData.email === "admin@gmail.com" && formData.password === "123456") {
      const history = {
        email: formData.email,
        name: "Admin",
        timestamp: new Date().toISOString(),
        type: "login",
      };

      const oldHistory = JSON.parse(localStorage.getItem("loginHistory") || "[]");
      localStorage.setItem("loginHistory", JSON.stringify([history, ...oldHistory]));

      localStorage.setItem("authToken", "adminToken");
      localStorage.setItem("userRole", "admin");
      localStorage.setItem("userEmail", formData.email);
      localStorage.setItem("userName", "Admin");
      
      // Update admin context - this will hide Header/Footer
      setIsAdmin(true);

      alert("Admin Login Successful! Redirecting to Admin Panel...");
      setIsLoading(false);
      navigateToAdminPanel();
      return;
    }

    try {
      // --------------------
      // YOUR REAL BACKEND URL
      // --------------------
      const url = isSignup
        ? "/api/auth/signup"
        : "/api/auth/login";

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        setIsLoading(false);
        return;
      }

      // --------------------
      // SAVE LOGIN HISTORY
      // --------------------
      const history = {
        email: formData.email,
        name: data.name || formData.name,
        timestamp: new Date().toISOString(),
        type: isSignup ? "signup" : "login",
      };

      const oldHistory = JSON.parse(localStorage.getItem("loginHistory") || "[]");
      localStorage.setItem("loginHistory", JSON.stringify([history, ...oldHistory]));

      // --------------------
      // STORE USER DETAILS
      // --------------------
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userRole", data.role || "user");
      localStorage.setItem("userEmail", formData.email);
      localStorage.setItem("userName", data.name || formData.name);

      // If it's a regular user login, ensure admin context is false
      setIsAdmin(false);

      alert(isSignup ? "Signup Successful!" : "Login Successful!");
      close?.();
      onLoginSuccess?.();
      window.location.reload();

    } catch (err) {
      setError("Network error. Backend may be OFF. Start your server!");
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () =>
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

  const handleToggleMode = () => {
    setIsSignup(!isSignup);
    clearForm();
    setError("");
  };

  return (
    <div className="login-overlay">
      <div className="login-box">
        <button className="close-btn" onClick={() => close?.()}>×</button>

        <h2>{isSignup ? "Create Account" : "Welcome Back"}</h2>
        <p className="login-subtitle">
          {isSignup ? "Sign up to get started" : "Sign in to your account"}
        </p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>

          {isSignup && (
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                required
                value={formData.name}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          )}

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              required
              value={formData.email}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          {isSignup && (
            <div className="form-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-input"
              />
            </div>
          )}

          <button
            type="submit"
            className={`submit-btn ${isLoading ? "loading" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                {isSignup ? "Creating Account..." : "Signing In..."}
              </>
            ) : isSignup ? (
              "Create Account"
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="toggle-text">
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <span onClick={handleToggleMode} className="toggle-link">
            {isSignup ? " Sign In" : " Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
}