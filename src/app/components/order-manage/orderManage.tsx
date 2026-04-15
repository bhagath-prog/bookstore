"use client";

import React, { useMemo, useState } from "react";
import "./ordermanage.css"

type Product = {
  id: string;
  title: string;
  qty: number;
};

type Order = {
  id: string;
  userName: string;
  email: string;
  paidAmount: number;
  booksCount: number;
  products: Product[];
  paymentStatus: "success" | "failed" | "pending";
  orderDate: string;
  statuses: {
    confirmed: boolean;
    packed: boolean;
    readyForDispatch: boolean;
    outTomorrow: boolean;
    outToday: boolean;
    delivered: boolean;
    onHold: boolean;
    cancelled: boolean;
    returned: boolean;
  };
};

const demoOrdersInit: Order[] = [
  {
    id: "ORD-20251201-001",
    userName: "Ramesh Kumar",
    email: "ramesh@example.com",
    paidAmount: 499,
    booksCount: 2,
    products: [
      { id: "B001", title: "Travel Stories Vol 1", qty: 1 },
      { id: "B002", title: "Photography Basics", qty: 1 },
    ],
    paymentStatus: "success",
    orderDate: "2025-12-01",
    statuses: {
      confirmed: true,
      packed: false,
      readyForDispatch: false,
      outTomorrow: false,
      outToday: false,
      delivered: false,
      onHold: false,
      cancelled: false,
      returned: false,
    },
  },

  {
    id: "ORD-20251128-002",
    userName: "Sangeeta",
    email: "sangeeta@example.com",
    paidAmount: 249,
    booksCount: 1,
    products: [{ id: "B003", title: "Frontend Magic", qty: 1 }],
    paymentStatus: "success",
    orderDate: "2025-11-28",
    statuses: {
      confirmed: true,
      packed: true,
      readyForDispatch: true,
      outTomorrow: false,
      outToday: false,
      delivered: false,
      onHold: false,
      cancelled: false,
      returned: false,
    },
  },

  {
    id: "ORD-20251203-003",
    userName: "Aravind",
    email: "aravind@example.com",
    paidAmount: 999,
    booksCount: 4,
    products: [
      { id: "B004", title: "Advanced Node.js", qty: 2 },
      { id: "B005", title: "SysDesign Patterns", qty: 2 },
    ],
    paymentStatus: "success",
    orderDate: "2025-12-03",
    statuses: {
      confirmed: true,
      packed: true,
      readyForDispatch: false,
      outTomorrow: false,
      outToday: false,
      delivered: false,
      onHold: false,
      cancelled: false,
      returned: false,
    },
  },
];

export default function OrderManage(): JSX.Element {
  const [orders, setOrders] = useState<Order[]>(demoOrdersInit);
  const [query, setQuery] = useState("");
  const [monthFilter, setMonthFilter] = useState<string>("all");

  const onlySuccessOrders = orders.filter((o) => o.paymentStatus === "success");

  const summary = useMemo(() => {
    const uniqueUsers = new Set(onlySuccessOrders.map((o) => o.email)).size;
    const totalBooks = onlySuccessOrders.reduce((s, o) => s + o.booksCount, 0);
    const totalAmount = onlySuccessOrders.reduce((s, o) => s + o.paidAmount, 0);
    return { uniqueUsers, totalBooks, totalAmount };
  }, [orders]);

  function toggleStatus(orderId: string, key: keyof Order["statuses"]) {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, statuses: { ...o.statuses, [key]: !o.statuses[key] } }
          : o
      )
    );
  }

  const filtered = onlySuccessOrders.filter((o) => {
    const q = query.toLowerCase();
    const matchesQuery =
      o.userName.toLowerCase().includes(q) ||
      o.email.toLowerCase().includes(q) ||
      o.id.toLowerCase().includes(q);

    const matchesMonth =
      monthFilter === "all" ||
      new Date(o.orderDate).toISOString().slice(0, 7) === monthFilter;

    return matchesQuery && matchesMonth;
  });

  const monthOptions = Array.from(
    new Set(onlySuccessOrders.map((o) => o.orderDate.slice(0, 7)))
  );

  return (
    <div className="container7">
      <header className="header7">
        <h1 className="heading7">Order Management</h1>
        <p className="para7">View orders & update delivery status</p>
      </header>

      <section className="topRow7">
        <div className="summaryCard7">
          <div className="label7">Registered Users</div>
          <div className="value7">{summary.uniqueUsers}</div>
        </div>
        <div className="summaryCard7">
          <div className="label7">Books Sold</div>
          <div className="value7">{summary.totalBooks}</div>
        </div>
        <div className="summaryCard7">
          <div className="label7">Total Paid</div>
          <div className="value7">₹ {summary.totalAmount.toFixed(2)}</div>
        </div>

        <div className="controls7">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email or order ID"
            className="search7"
          />
          <select
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="filter7"
          >
            <option value="all">All Months</option>
            {monthOptions.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>
      </section>

      <section className="tableWrapper7">
        <table className="table7">
          <thead>
            <tr>
              <th className="th7">User</th>
              <th className="th7">Books</th>
              <th className="th7">Paid</th>
              <th className="th7">Order ID</th>
              <th className="th7">Products</th>
              <th className="th7">Date</th>
              <th className="th7">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="tr7">
                <td className="td7">
                  <div className="userName7">{o.userName}</div>
                  <div className="userEmail7 para7">{o.email}</div>
                </td>

                <td className="td7 center7">{o.booksCount}</td>

                <td className="td7">₹ {o.paidAmount}</td>

                <td className="td7 mono7">{o.id}</td>

                <td className="td7">
                  <ul className="prodList7">
                    {o.products.map((p) => (
                      <li key={p.id} className="prodItem7">
                        {p.title} <span className="qty7">x{p.qty}</span>
                      </li>
                    ))}
                  </ul>
                </td>

                <td className="td7">{o.orderDate}</td>

                <td className="td7">
                  <details className="dropdown7">
                    <summary className="summary7">Update ▾</summary>

                    <label className="chkRow7">
                      <input
                        type="checkbox"
                        checked={o.statuses.confirmed}
                        onChange={() => toggleStatus(o.id, "confirmed")}
                        className="checkbox7"
                      />
                      <span className="text7">Confirmed</span>
                    </label>

                    <label className="chkRow7">
                      <input
                        type="checkbox"
                        checked={o.statuses.packed}
                        onChange={() => toggleStatus(o.id, "packed")}
                        className="checkbox7"
                      />
                      <span className="text7">Packed</span>
                    </label>

                    <label className="chkRow7">
                      <input
                        type="checkbox"
                        checked={o.statuses.readyForDispatch}
                        onChange={() =>
                          toggleStatus(o.id, "readyForDispatch")
                        }
                        className="checkbox7"
                      />
                      <span className="text7">Ready for Dispatch</span>
                    </label>

                    <hr className="sep7" />

                    <label className="chkRow7">
                      <input
                        type="checkbox"
                        checked={o.statuses.onHold}
                        onChange={() => toggleStatus(o.id, "onHold")}
                        className="checkbox7"
                      />
                      <span className="text7">On Hold</span>
                    </label>

                    <label className="chkRow7">
                      <input
                        type="checkbox"
                        checked={o.statuses.cancelled}
                        onChange={() => toggleStatus(o.id, "cancelled")}
                        className="checkbox7"
                      />
                      <span className="text7">Cancelled</span>
                    </label>

                    <label className="chkRow7">
                      <input
                        type="checkbox"
                        checked={o.statuses.returned}
                        onChange={() => toggleStatus(o.id, "returned")}
                        className="checkbox7"
                      />
                      <span className="text7">Returned / Refund</span>
                    </label>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
