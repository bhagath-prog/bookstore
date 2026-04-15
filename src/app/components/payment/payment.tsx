"use client";

import React, { useState, useEffect } from "react";
import { 
  FaCreditCard, 
  FaLock, 
  FaCheck, 
  FaTimes, 
  FaSpinner,
  FaShieldAlt,
  FaArrowLeft,
  FaReceipt
} from "react-icons/fa";
import "./payment.css";

declare global {
  interface Window {
    Razorpay: any;
  }
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

interface PriceDetails {
  subtotal: number;
  gst: number;
  shipping: number;
  total: number;
}

interface PaymentForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export default function Payment() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'failed'>('idle');
  const [orderDetails, setOrderDetails] = useState<any>(null);

  const [formData, setFormData] = useState<PaymentForm>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  useEffect(() => {
    loadCartItems();
    loadRazorpayScript();
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

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const calculatePriceDetails = (): PriceDetails => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.salePrice * item.quantity), 0);
    const gst = subtotal * 0.18;
    const shipping = subtotal > 500 ? 0 : 40;
    const total = subtotal + gst + shipping;

    return { subtotal, gst, shipping, total };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): boolean => {
    const requiredFields = ["name", "email", "phone", "address", "city", "state", "pincode"];
    
    for (const field of requiredFields) {
      if (!formData[field as keyof PaymentForm]) {
        alert(`Please fill in the ${field}`);
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

  const createOrder = async (amount: number) => {
    try {
      const response = await fetch('/api/payment/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      return data;
    } catch (error) {
      console.error('Order creation error:', error);
      throw error;
    }
  };

  const verifyPayment = async (paymentData: any) => {
    try {
      const response = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Payment verification error:', error);
      throw error;
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    setProcessing(true);

    try {
      const priceDetails = calculatePriceDetails();
      const order = await createOrder(priceDetails.total);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "BookStore",
        description: "Purchase of Books",
        order_id: order.id,
        handler: async function (response: any) {
          try {
            const verification = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verification.success) {
              // Payment successful
              setPaymentStatus('success');
              setOrderDetails({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                amount: priceDetails.total
              });

              // Clear cart after successful payment
              localStorage.removeItem("bookCart");
              window.dispatchEvent(new Event('cartUpdated'));
            } else {
              setPaymentStatus('failed');
            }
          } catch (error) {
            console.error('Payment handling error:', error);
            setPaymentStatus('failed');
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        notes: {
          address: formData.address,
          books: cartItems.map(item => `${item.bookName} (Qty: ${item.quantity})`).join(', ')
        },
        theme: {
          color: "#667eea",
        },
        modal: {
          ondismiss: function() {
            setProcessing(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
      
    } catch (error) {
      console.error('Payment initiation error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const goBackToCart = () => {
    window.history.back();
  };

  const continueShopping = () => {
    window.location.href = "/books";
  };

  const priceDetails = calculatePriceDetails();

  if (loading) {
    return (
      <div className="payment-container">
        <div className="payment-loading">
          <div className="loading-spinner"></div>
          <p>Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 && paymentStatus !== 'success') {
    return (
      <div className="payment-container">
        <div className="empty-payment">
          <div className="empty-payment-content">
            <div className="empty-payment-icon">🛒</div>
            <h3>No Items to Purchase</h3>
            <p>Your cart is empty. Add some books to proceed with payment.</p>
            <button onClick={goBackToCart} className="back-to-cart-btn">
              <FaArrowLeft className="btn-icon" />
              Back to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'success') {
    return (
      <div className="payment-container">
        <div className="payment-success">
          <div className="success-content">
            <div className="success-icon">
              <FaCheck />
            </div>
            <h2>Payment Successful! 🎉</h2>
            <p className="success-message">
              Thank you for your purchase. Your order has been confirmed.
            </p>
            
            <div className="order-details">
              <h3>Order Details</h3>
              <div className="detail-row">
                <span>Order ID:</span>
                <span>{orderDetails?.orderId}</span>
              </div>
              <div className="detail-row">
                <span>Payment ID:</span>
                <span>{orderDetails?.paymentId}</span>
              </div>
              <div className="detail-row">
                <span>Amount Paid:</span>
                <span className="amount">₹{orderDetails?.amount?.toFixed(2)}</span>
              </div>
            </div>

            <div className="success-actions">
              <button onClick={continueShopping} className="continue-shopping-btn">
                Continue Shopping
              </button>
              <button className="print-receipt-btn">
                <FaReceipt className="btn-icon" />
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="payment-container">
        <div className="payment-failed">
          <div className="failed-content">
            <div className="failed-icon">
              <FaTimes />
            </div>
            <h2>Payment Failed</h2>
            <p>We couldn't process your payment. Please try again.</p>
            <div className="failed-actions">
              <button onClick={() => setPaymentStatus('idle')} className="retry-btn">
                Try Again
              </button>
              <button onClick={goBackToCart} className="back-btn">
                Back to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className="payment-page">
        {/* Header */}
        <div className="payment-header">
          <div className="header-content">
            <h1><FaLock className="header-icon" /> Secure Payment</h1>
            <p>Complete your purchase with Razorpay secure payment</p>
          </div>
          <div className="secure-badge">
            <FaShieldAlt className="badge-icon" />
            100% Secure Payment
          </div>
        </div>

        <div className="payment-content">
          {/* Payment Form */}
          <div className="payment-form-section">
            <form onSubmit={handlePayment} className="payment-form">
              <div className="form-section">
                <h3 className="section-title">
                  <FaCreditCard className="section-icon" />
                  Billing Information
                </h3>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
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
                    <label htmlFor="phone">Phone Number *</label>
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

                <div className="form-group">
                  <label htmlFor="address">Delivery Address *</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your complete address"
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

              <button 
                type="submit" 
                className="pay-now-btn"
                disabled={processing}
              >
                {processing ? (
                  <>
                    <FaSpinner className="spinner" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FaLock className="btn-icon" />
                    Pay Now • ₹{priceDetails.total.toFixed(2)}
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="payment-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>

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

              <div className="security-features">
                <div className="security-item">
                  <FaShieldAlt className="security-icon" />
                  <span>256-bit SSL Secured</span>
                </div>
                <div className="security-item">
                  <FaLock className="security-icon" />
                  <span>PCI DSS Compliant</span>
                </div>
                <div className="security-item">
                  <FaCheck className="security-icon" />
                  <span>Razorpay Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}