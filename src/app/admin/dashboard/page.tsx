"use client";

import React, { useState, useEffect } from "react";
import "../admin.css";

// ⭐ Simple Pie Chart Component
const PieChart = ({ active, draft }: { active: number; draft: number }) => {
  const total = active + draft || 1; // prevent divide by zero

  const activePercent = (active / total) * 100;
  const draftPercent = (draft / total) * 100;

  return (
    <div className="pie-chart-wrapper">
      <div
        className="pie-chart"
        style={{
          background: `conic-gradient(
            #4CAF50 ${activePercent}%,
            #F44336 ${activePercent}% ${activePercent + draftPercent}%
          )`,
        }}
      ></div>

      <div className="pie-legend">
        <div className="legend-item">
          <span className="legend-color" style={{ background: "#4CAF50" }}></span>
          Active Books ({active})
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ background: "#F44336" }}></span>
          Draft Books ({draft})
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    activeBooks: 0,
    draftBooks: 0,
    registeredUsers: 0,
    totalRevenue: 0,
    soldBooks: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch ALL BOOKS
      const booksRes = await fetch("/api/books");
      const books = await booksRes.json();

      const totalBooks = books.length;
      const activeBooks = books.filter((b: any) => b.status === "active").length;
      const draftBooks = books.filter((b: any) => b.status === "draft").length;

      // USERS (ONLY IF API EXISTS)
      let registeredUsers = 0;
      try {
        const usersRes = await fetch("/api/auth");
        if (usersRes.ok) {
          const users = await usersRes.json();
          registeredUsers = users.length || 0;
        }
      } catch {}

      // SALES + REVENUE (if orders exist)
      let totalRevenue = 0;
      let soldBooks = 0;

      try {
        const salesRes = await fetch("/api/orders");
        if (salesRes.ok) {
          const orders = await salesRes.json();
          soldBooks = orders.length;
          totalRevenue = orders.reduce((t: number, o: any) => t + o.totalAmount, 0);
        }
      } catch {}

      setStats({
        totalBooks,
        activeBooks,
        draftBooks,
        registeredUsers,
        totalRevenue,
        soldBooks,
      });

    } catch (err) {
      console.log("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard"><h2>Loading Dashboard...</h2></div>;
  }

  return (
    <div className="dashboard">

      <div className="stats-grid">

        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-info">
            <h3>Total Books</h3>
            <p className="stat-number">{stats.totalBooks}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <h3>Active Books</h3>
            <p className="stat-number">{stats.activeBooks}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-info">
            <h3>Draft Books</h3>
            <p className="stat-number">{stats.draftBooks}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <h3>Users</h3>
            <p className="stat-number">{stats.registeredUsers}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <h3>Sold Books</h3>
            <p className="stat-number">{stats.soldBooks}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💵</div>
          <div className="stat-info">
            <h3>Total Revenue</h3>
            <p className="stat-number">₹{stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>

      </div>

      {/* ⭐ PIE CHART SECTION */}
      <div className="chart-section">
        <h2>Books Status Overview</h2>
        <PieChart active={stats.activeBooks} draft={stats.draftBooks} />
      </div>

    </div>
  );
}
