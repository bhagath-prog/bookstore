"use client";

import { useEffect, useState } from "react";
import "../../admin/admin.css";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // DELETE ORDER
  const deleteOrder = async (id: string) => {
    if (!confirm("Delete this order?")) return;
    await fetch(`/api/orders?id=${id}`, { method: "DELETE" });
    fetchOrders();
  };

  // UPDATE STATUS
  const updateStatus = async (id: string, newStatus: string) => {
    await fetch("/api/orders", {
      method: "PUT",
      body: JSON.stringify({ id, orderStatus: newStatus }),
    });
    fetchOrders();
  };

  if (loading) return <h2 className="dashboard">Loading orders...</h2>;

  return (
    <div className="dashboard">
      <h1>Order Management</h1>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.orderId}</td>
                <td>
                  {order.customerName}
                  <br />
                  <small>{order.customerEmail}</small>
                </td>

                <td>
                  {order.items.map((i: any) => (
                    <div key={i.bookId}>
                      {i.bookName} × {i.quantity}
                    </div>
                  ))}
                </td>

                <td>₹{order.totalAmount}</td>

                <td>
                  <select
                    value={order.orderStatus}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                  >
                    <option value="placed">Placed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>

                <td>{order.paymentStatus}</td>

                <td>{new Date(order.createdAt).toLocaleDateString()}</td>

                <td>
                  <button
                    className="view-btn"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteOrder(order._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Order Details</h2>

            <p><strong>Customer:</strong> {selectedOrder.customerName}</p>
            <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
            <p><strong>Phone:</strong> {selectedOrder.customerPhone}</p>

            <h3>Items:</h3>
            {selectedOrder.items.map((i: any) => (
              <div key={i.bookId}>
                {i.bookName} — ₹{i.price} × {i.quantity}
              </div>
            ))}

            <h3>Total: ₹{selectedOrder.totalAmount}</h3>

            <button className="close-btn" onClick={() => setSelectedOrder(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
