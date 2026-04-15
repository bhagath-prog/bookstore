import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../connectDB";   // CORRECT PATH
import Order from "../models/order";         // CORRECT PATH

export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (err) {
    console.error("Orders fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const id = request.nextUrl.searchParams.get("id");
    await Order.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, orderStatus } = await request.json();
    await connectDB();

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { orderStatus },
      { new: true }
    );

    return NextResponse.json(updatedOrder);
  } catch (err) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
