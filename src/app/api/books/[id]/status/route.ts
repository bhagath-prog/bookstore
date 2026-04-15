// import { NextRequest, NextResponse } from "next/server";
// import { connectDB } from "../../../connectDB";
// import Book from "../../../models/Book";

// export async function PATCH(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await connectDB();
    
//     const { status } = await request.json();
    
//     // Validate status
//     if (!['draft', 'active'].includes(status)) {
//       return NextResponse.json(
//         { error: 'Status must be either draft or active' }, 
//         { status: 400 }
//       );
//     }
    
//     const book = await Book.findByIdAndUpdate(
//       params.id,
//       { status },
//       { new: true }
//     );
    
//     if (!book) {
//       return NextResponse.json(
//         { error: 'Book not found' }, 
//         { status: 404 }
//       );
//     }
    
//     const updatedBook = {
//       _id: book._id.toString(),
//       bookName: book.bookName,
//       authorName: book.authorName,
//       status: book.status,
//       updatedAt: book.updatedAt
//     };
    
//     return NextResponse.json(updatedBook);
//   } catch (error) {
//     console.error('PATCH Status Error:', error);
//     return NextResponse.json(
//       { error: 'Failed to update status' }, 
//       { status: 500 }
//     );
//   }
// }


import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../connectDB";
import Book from "../../../models/Book";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    
    const { status } = await request.json();
    
    // Validate status
    if (!['draft', 'active'].includes(status)) {
      return NextResponse.json(
        { error: 'Status must be either draft or active' }, 
        { status: 400 }
      );
    }
    
    const book = await Book.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    );
    
    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' }, 
        { status: 404 }
      );
    }
    
    const updatedBook = {
      _id: book._id.toString(),
      bookName: book.bookName,
      authorName: book.authorName,
      status: book.status,
      updatedAt: book.updatedAt
    };
    
    return NextResponse.json(updatedBook);
  } catch (error) {
    console.error('PATCH Status Error:', error);
    return NextResponse.json(
      { error: 'Failed to update status' }, 
      { status: 500 }
    );
  }
}