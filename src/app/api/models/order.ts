import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },

    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },

    items: [
      {
        bookId: { type: String, required: true },
        bookName: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
      }
    ],

    paymentId: { type: String, required: true },
    orderId: { type: String, required: true },
    signature: { type: String, required: true },

    totalAmount: { type: Number, required: true },

    paymentStatus: { type: String, default: "paid" },  // paid, failed, refunded
    orderStatus: { type: String, default: "placed" },  // placed, shipped, delivered, cancelled
  },

  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
