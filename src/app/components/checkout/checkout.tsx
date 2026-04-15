"use client";

import React, { useState, useEffect } from "react";
import { FaLock, FaCreditCard, FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaArrowLeft, FaShieldAlt, FaSignInAlt } from "react-icons/fa";
import "./checkout.css";

interface CartItem {
  _id: string;
  bookName: string;
  authorName: string;
  salePrice: number;
  image1: string;
  quantity: number;
}

interface PriceDetails {
  subtotal: number;
  gst: number;
  shipping: number;
  total: number;
}

interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export default function Checkout() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [formData, setFormData] = useState<CheckoutForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    loadCartItems();
    checkLoginStatus();
  }, []);

  const loadCartItems = () => {
    try {
      const savedCart = localStorage.getItem("bookCart");
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkLoginStatus = () => {
    const token = localStorage.getItem("authToken");
    const name = localStorage.getItem("userName");
    
    if (token) {
      setIsLoggedIn(true);
      setUserName(name || "");
      // Pre-fill email if user is logged in
      const userEmail = localStorage.getItem("userEmail");
      if (userEmail) {
        setFormData(prev => ({
          ...prev,
          email: userEmail
        }));
      }
    } else {
      setIsLoggedIn(false);
      setShowLoginPrompt(true);
    }
  };

  const calculatePriceDetails = (): PriceDetails => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.salePrice * item.quantity), 0);
    const gst = subtotal * 0.18;
    const shipping = subtotal > 500 ? 0 : 40;
    const total = subtotal + gst + shipping;

    return { subtotal, gst, shipping, total };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    const requiredFields = ["firstName", "lastName", "email", "phone", "address", "city", "state", "pincode"];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof CheckoutForm]) {
        alert(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address");
      return false;
    }

    // Phone validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert("Please enter a valid 10-digit phone number");
      return false;
    }

    return true;
  };

  const saveOrderToLocalStorage = () => {
    const orderData = {
      customerInfo: formData,
      cartItems: cartItems,
      priceDetails: calculatePriceDetails(),
      orderDate: new Date().toISOString(),
      orderId: `ORD${Date.now()}`
    };
    localStorage.setItem("currentOrder", JSON.stringify(orderData));
  };

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is logged in
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }
    
    if (!validateForm()) return;
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setProcessing(true);

    try {
      // Save order details to localStorage for payment page
      saveOrderToLocalStorage();
      
      // Navigate to payment page after a brief delay
      setTimeout(() => {
        window.location.href = "/payment";
      }, 500);
      
    } catch (error) {
      console.error("Error proceeding to payment:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const goBackToCart = () => {
    window.history.back();
  };

  const handleLoginRedirect = () => {
    // Store current checkout URL to return after login
    localStorage.setItem("returnUrl", "/checkout");
    window.location.href = "/?showLogin=true";
  };

  const handleContinueAsGuest = () => {
    setShowLoginPrompt(false);
  };

  const priceDetails = calculatePriceDetails();

  if (loading) {
    return (
      <div className="checkout-container">
        <div className="checkout-loading">
          <div className="loading-spinner"></div>
          <p>Preparing your checkout...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if user is not logged in
  if (showLoginPrompt && !isLoggedIn) {
    return (
      <div className="checkout-container">
        <div className="login-required">
          <div className="login-required-content">
            <div className="login-icon">
              <FaSignInAlt />
            </div>
            <h2>Login Required</h2>
            <p>You need to be logged in to proceed with checkout.</p>
            <p className="login-benefits">
              Benefits of logging in:
            </p>
            <ul className="benefits-list">
              <li>✅ Faster checkout process</li>
              <li>✅ Order tracking</li>
              <li>✅ Purchase history</li>
              <li>✅ Exclusive discounts</li>
            </ul>
            
            <div className="login-actions">
              <button onClick={handleLoginRedirect} className="login-btn-primary">
                <FaSignInAlt className="btn-icon" />
                Login to Continue
              </button>
              <button onClick={goBackToCart} className="back-to-cart-btn">
                <FaArrowLeft className="btn-icon" />
                Back to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout-container">
        <div className="empty-checkout">
          <div className="empty-checkout-content">
            <div className="empty-checkout-icon">🛒</div>
            <h3>No Items to Checkout</h3>
            <p>Your cart is empty. Add some books to proceed with checkout.</p>
            <button onClick={goBackToCart} className="back-to-cart-btn">
              <FaArrowLeft className="btn-icon" />
              Back to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-page">
        {/* Header */}
        <div className="checkout-header">
          <div className="header-content">
            <h1><FaLock className="header-icon" /> Checkout</h1>
            <p>Enter your details to proceed with secure payment</p>
            {isLoggedIn && (
              <div className="user-welcome">
                Welcome, <strong>{userName}</strong>! ✅
              </div>
            )}
          </div>
          <div className="secure-badge">
            <FaShieldAlt className="badge-icon" />
            Secure Checkout
          </div>
        </div>

        <div className="checkout-content">
          {/* Checkout Form */}
          <div className="checkout-form-section">
            <form onSubmit={handleProceedToPayment} className="checkout-form">
              {/* Personal Information */}
              <div className="form-section">
                <h3 className="section-title">
                  <FaUser className="section-icon" />
                  Personal Information
                </h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">
                      <FaEnvelope className="input-icon" />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">
                      <FaPhone className="input-icon" />
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      placeholder="10-digit mobile number"
                      maxLength={10}
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="form-section">
                <h3 className="section-title">
                  <FaMapMarkerAlt className="section-icon" />
                  Shipping Address
                </h3>
                <div className="form-group">
                  <label htmlFor="address">Street Address *</label>
                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    required
                    placeholder="Enter your complete delivery address"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City *</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      placeholder="Your city"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="state">State *</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      placeholder="Your state"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="pincode">PIN Code *</label>
                    <input
                      type="text"
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      required
                      placeholder="6-digit PIN code"
                      maxLength={6}
                    />
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="form-section">
                <h3 className="section-title">
                  <FaCreditCard className="section-icon" />
                  Payment
                </h3>
                
                <div className="payment-info">
                  <div className="payment-method-card">
                    <FaShieldAlt className="payment-method-icon" />
                    <div className="payment-method-info">
                      <h4>Secure Razorpay Payment</h4>
                      <p>You will be redirected to Razorpay's secure payment gateway to complete your purchase</p>
                    </div>
                  </div>
                  
                  <div className="accepted-payments">
                    <span>Accepted Payment Methods:</span>
                    <div className="payment-icons">
                      <span>💳 Credit Cards</span>
                      <span>🏦 Debit Cards</span>
                      <span>📱 UPI</span>
                      <span>📲 Net Banking</span>
                      <span>💰 Wallets</span>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="proceed-to-payment-btn"
                disabled={processing}
              >
                {processing ? (
                  <>
                    <div className="processing-spinner"></div>
                    Preparing Payment...
                  </>
                ) : (
                  <>
                    <FaLock className="btn-icon" />
                    Proceed to Payment • ₹{priceDetails.total.toFixed(2)}
                  </>
                )}
              </button>

              <button 
                type="button"
                onClick={goBackToCart}
                className="back-to-cart-btn-form"
              >
                <FaArrowLeft className="btn-icon" />
                Back to Cart
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="checkout-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>

              {/* Order Items */}
              <div className="order-items">
                {cartItems.map((item) => (
                  <div key={item._id} className="order-item">
                    <div className="item-image">
                      <img src={item.image1} alt={item.bookName} />
                    </div>
                    <div className="item-info">
                      <h4 className="item-title">{item.bookName}</h4>
                      <p className="item-author">by {item.authorName}</p>
                      <div className="item-quantity">Qty: {item.quantity}</div>
                    </div>
                    <div className="item-price">
                      ₹{(item.salePrice * item.quantity).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="price-breakdown">
                <div className="price-row">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>₹{priceDetails.subtotal.toLocaleString()}</span>
                </div>

                <div className="price-row">
                  <span>Shipping</span>
                  <span className={priceDetails.shipping === 0 ? "free" : ""}>
                    {priceDetails.shipping === 0 ? "FREE" : `₹${priceDetails.shipping}`}
                  </span>
                </div>

                <div className="price-row">
                  <span>GST (18%)</span>
                  <span>₹{priceDetails.gst.toFixed(2)}</span>
                </div>

                <div className="price-divider"></div>

                <div className="price-row total">
                  <span>Total Amount</span>
                  <span className="total-amount">₹{priceDetails.total.toFixed(2)}</span>
                </div>
              </div>

              {priceDetails.shipping > 0 && (
                <div className="shipping-notice">
                  🚚 Add ₹{(500 - priceDetails.subtotal).toFixed(2)} more for FREE shipping!
                </div>
              )}

              <div className="security-features">
                <div className="security-item">
                  <div className="security-icon">🔒</div>
                  <span>Secure SSL Encryption</span>
                </div>
                <div className="security-item">
                  <div className="security-icon">🛡️</div>
                  <span>100% Payment Protection</span>
                </div>
                <div className="security-item">
                  <div className="security-icon">📦</div>
                  <span>Free Delivery Above ₹500</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}