"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAdmin } from "../AdminContext";
import "./admin.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const router = useRouter();
  const { isAdmin, checkAdminStatus } = useAdmin();

  useEffect(() => {
    // Check if user is admin
    const isUserAdmin = checkAdminStatus();

    if (!isUserAdmin) {
      router.push("/");
      return;
    }

    // Check screen size
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, [router, checkAdminStatus]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    window.dispatchEvent(new Event("storage"));
    router.push("/");
  };

  const navigateTo = (path: string) => {
    router.push(path);
    if (isMobile) {
      setShowMobileMenu(false);
    }
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setShowMobileMenu(!showMobileMenu);
    } else {
      setIsSidebarOpen(!isSidebarOpen);
    }
  };

  const closeMobileMenu = () => {
    setShowMobileMenu(false);
  };

  if (!isAdmin) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Mobile Overlay */}
      {isMobile && showMobileMenu && (
        <div className="mobile-overlay" onClick={closeMobileMenu}></div>
      )}

      {/* ⭐ SIDEBAR (FIXED + FULL) */}
      <div
        className={`sidebar ${isSidebarOpen ? "open" : "closed"} ${
          isMobile ? "mobile" : ""
        } ${showMobileMenu ? "mobile-open" : ""}`}
      >
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <button className="sidebar-toggle" onClick={toggleSidebar}>
            {isMobile ? (showMobileMenu ? "✕" : "☰") : isSidebarOpen ? "←" : "→"}
          </button>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item" onClick={() => navigateTo("/admin/dashboard")}>
            <span className="nav-icon">📊</span>
            <span className="nav-text">Dashboard</span>
          </button>

          <button className="nav-item" onClick={() => navigateTo("/admin/post-book")}>
            <span className="nav-icon">📚</span>
            <span className="nav-text">Post Book</span>
          </button>

          <button className="nav-item" onClick={() => navigateTo("/admin/books")}>
            <span className="nav-icon">📖</span>
            <span className="nav-text">Manage Books</span>
          </button>

          {/* ⭐ NEW ORDER MANAGEMENT MENU ITEM */}
          <button className="nav-item" onClick={() => navigateTo("/admin/order-manage")}>
            <span className="nav-icon">📦</span>
            <span className="nav-text">Order Management</span>
          </button>

          <button className="nav-item logout-btn" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span className="nav-text">Logout</span>
          </button>
        </nav>
      </div>

      {/* ⭐ MAIN CONTENT */}
      <div className="admin-main">
        <header className="admin-header">
          <div className="header-left">
            {isMobile && (
              <button className="mobile-menu-btn" onClick={toggleSidebar}>
                ☰
              </button>
            )}
            <h1>Welcome, Admin</h1>
          </div>
        </header>

        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
