"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  ShoppingCart,
  Search,
  User,
  LogOut,
  Menu,
  X,
  BookOpen,
  Home,
  Phone,
  Info,
  FileText,
} from "lucide-react";

import Login from "../Login/login"; 
import "./header.css";

interface CartItem {
  _id: string;
  bookName: string;
  authorName: string;
  salePrice: number;
  mrpPrice: number;
  image1: string;
  quantity: number;
}

export default function Header() {
  const pathname = usePathname();

  const [openLogin, setOpenLogin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);

  // LOAD LOGIN DATA ON PAGE LOAD
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const name = localStorage.getItem("userName");

    if (token) {
      setIsLoggedIn(true);
      setUserName(name || "");
    }

    loadCartItems();
  }, []);

  // LOAD CART ITEMS
  const loadCartItems = () => {
    try {
      const savedCart = localStorage.getItem("bookCart");
      if (savedCart) {
        const items = JSON.parse(savedCart);
        setCartItems(items);
        updateCartCount(items);
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  };

  // UPDATE CART COUNT
  const updateCartCount = (items: CartItem[]) => {
    const totalItems = items.reduce((total, item) => total + item.quantity, 0);
    setCartCount(totalItems);
  };

  // LISTEN FOR CART UPDATES
  useEffect(() => {
    const handleStorageChange = () => {
      loadCartItems();
    };

    // Listen for storage events (from other tabs/windows)
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for custom cart update events
    window.addEventListener('cartUpdated', handleStorageChange);

    // Poll for changes (fallback)
    const interval = setInterval(loadCartItems, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // LOGOUT FUNCTION
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");

    setIsLoggedIn(false);
    setUserName("");
    window.location.reload();
  };

  // NAV ITEMS WITH ICONS
  const navItems = [
    { label: "Home", path: "/", icon: <Home size={18} /> },
    { label: "Books", path: "/books", icon: <BookOpen size={18} /> },
    // { label: "Blogs", path: "/blogs", icon: <FileText size={18} /> }, 
    { label: "About", path: "/about", icon: <Info size={18} /> },
    { label: "Contact", path: "/contact", icon: <Phone size={18} /> },
  ];

  const handleLoginSuccess = () => {
    setOpenLogin(false);
    // Reload user data after successful login
    const token = localStorage.getItem("authToken");
    const name = localStorage.getItem("userName");
    if (token) {
      setIsLoggedIn(true);
      setUserName(name || "");
    }
  };

  return (
    <>
      <header className="header">
        <div className="header-container">

          {/* MOBILE MENU BUTTON */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* LOGO */}
          <div className="logo">
            <Link href="/" className="logo-link">
              <img src="/assets/images/B.jpg" alt="BookStore Logo" className="logo-image" />
              <span className="logo-text">BookStore</span>
            </Link>
          </div>

          {/* DESKTOP NAV */}
          <nav className="desktop-nav">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`nav-link ${pathname === item.path ? "active" : ""}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* RIGHT ICONS */}
          <div className="right-icons">

            {/* CART ICON WITH COUNT */}
            <Link href="/cart" className="cart-icon" aria-label={`Shopping cart with ${cartCount} items`}>
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="cart-count">{cartCount > 99 ? '99+' : cartCount}</span>
              )}
            </Link>

            {/* SEARCH BUTTON */}
            <button className="search-btn" aria-label="Search">
              <Search size={22} />
            </button>

            {/* USER AUTH SECTION */}
            {!isLoggedIn ? (
              <button 
                className="login-btn" 
                onClick={() => setOpenLogin(true)}
                aria-label="Login"
              >
                <User size={22} />
                <span className="login-text">Login</span>
              </button>     
            ) : (
              <div className="user-dropdown">
                <Link href="/profile" className="user-name">
                  <User size={18} />
                  <span>Hi, {userName}</span>
                </Link>

                <button 
                  className="logout-btn" 
                  onClick={logout}
                  aria-label="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            )}
          </div>

          {/* MOBILE NAV OVERLAY */}
          {mobileMenuOpen && (
            <div className="mobile-nav-overlay" onClick={() => setMobileMenuOpen(false)}>
              <div className="mobile-nav" onClick={(e) => e.stopPropagation()}>
                <div className="mobile-nav-header">
                  <h3>Menu</h3>
                  <button 
                    className="mobile-close-btn"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close menu"
                  >
                    <X size={24} />
                  </button>
                </div>

                <nav className="mobile-nav-menu">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`mobile-nav-link ${pathname === item.path ? "active" : ""}`}
                    >
                      <span className="mobile-nav-icon">{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}

                  {/* MOBILE CART */}
                  <Link 
                    href="/cart" 
                    className="mobile-cart-link"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <ShoppingCart size={20} />
                    <span>Cart ({cartCount})</span>
                  </Link>

                  {/* MOBILE LOGIN / LOGOUT */}
                  <div className="mobile-auth-section">
                    {!isLoggedIn ? (
                      <button
                        onClick={() => {
                          setOpenLogin(true);
                          setMobileMenuOpen(false);
                        }}
                        className="mobile-login-btn"
                      >
                        <User size={20} />
                        Login / Signup
                      </button>
                    ) : (
                      <div className="mobile-user-info">
                        <div className="mobile-user-greeting">
                          <User size={20} />
                          <span>Hello, {userName}</span>
                        </div>
                        <button 
                          className="mobile-logout-btn" 
                          onClick={logout}
                        >
                          <LogOut size={20} />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </nav>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* LOGIN MODAL */}
      {openLogin && (
        <Login
          close={() => setOpenLogin(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </>
  );
}