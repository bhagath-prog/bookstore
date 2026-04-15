// import { NextRequest, NextResponse } from "next/server";
// import { connectDB } from "../connectDB";
// import Book from "../models/Book";
// import { writeFile, mkdir } from "fs/promises";
// import path from "path";

// export async function GET() {
//   try {
//     await connectDB();
//     const books = await Book.find({}).sort({ createdAt: -1 });
    
//     const booksData = books.map(book => ({
//       _id: book._id.toString(),
//       bookName: book.bookName,
//       authorName: book.authorName,
//       description: book.description,
//       mrpPrice: book.mrpPrice,
//       salePrice: book.salePrice,
//       status: book.status,
//       image1: book.image1,
//       image2: book.image2,
//       createdAt: book.createdAt,
//       updatedAt: book.updatedAt
//     }));
    
//     return NextResponse.json(booksData);
//   } catch (error) {
//     console.error('GET Books Error:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch books' }, 
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     await connectDB();
    
//     const formData = await request.formData();
    
//     // Get text fields
//     const bookName = formData.get('bookName') as string;
//     const authorName = formData.get('authorName') as string;
//     const description = formData.get('description') as string;
//     const mrpPrice = parseFloat(formData.get('mrpPrice') as string);
//     const salePrice = parseFloat(formData.get('salePrice') as string);
//     const status = (formData.get('status') as string) || 'draft';
//     const image1 = formData.get('image1') as File;
//     const image2 = formData.get('image2') as File;

//     // Validate required fields
//     if (!bookName || !authorName || !description || isNaN(mrpPrice) || isNaN(salePrice)) {
//       return NextResponse.json(
//         { error: 'All fields are required' }, 
//         { status: 400 }
//       );
//     }

//     // Validate images
//     if (!image1 || image1.size === 0 || !image2 || image2.size === 0) {
//       return NextResponse.json(
//         { error: 'Both images are required' }, 
//         { status: 400 }
//       );
//     }

//     // Validate file types
//     if (!image1.type.startsWith('image/') || !image2.type.startsWith('image/')) {
//       return NextResponse.json(
//         { error: 'Only image files are allowed' }, 
//         { status: 400 }
//       );
//     }

//     // Validate file size (max 5MB per image)
//     const maxSize = 5 * 1024 * 1024;
//     if (image1.size > maxSize || image2.size > maxSize) {
//       return NextResponse.json(
//         { error: 'Image size should be less than 5MB' }, 
//         { status: 400 }
//       );
//     }

//     // Create uploads directory if it doesn't exist
//     const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
//     try {
//       await mkdir(uploadsDir, { recursive: true });
//     } catch (error) {
//       console.error('Error creating uploads directory:', error);
//     }

//     // Generate unique filenames
//     const timestamp = Date.now();
//     const random = Math.random().toString(36).substring(2, 15);
    
//     const getFileExtension = (filename: string) => {
//       return filename.split('.').pop()?.toLowerCase() || 'jpg';
//     };

//     const image1Ext = getFileExtension(image1.name);
//     const image2Ext = getFileExtension(image2.name);
    
//     const image1Filename = `book_${timestamp}_${random}_1.${image1Ext}`;
//     const image2Filename = `book_${timestamp}_${random}_2.${image2Ext}`;

//     // Convert files to buffers
//     const image1Buffer = Buffer.from(await image1.arrayBuffer());
//     const image2Buffer = Buffer.from(await image2.arrayBuffer());

//     // Save images to filesystem
//     const image1Path = path.join(uploadsDir, image1Filename);
//     const image2Path = path.join(uploadsDir, image2Filename);

//     await writeFile(image1Path, image1Buffer);
//     await writeFile(image2Path, image2Buffer);

//     // Create image URLs (relative paths from public folder)
//     const image1Url = `/uploads/${image1Filename}`;
//     const image2Url = `/uploads/${image2Filename}`;

//     console.log('Images saved at:', {
//       image1Path,
//       image2Path,
//       image1Url,
//       image2Url
//     });

//     // Create book in database
//     const book = new Book({
//       bookName,
//       authorName,
//       description,
//       mrpPrice,
//       salePrice,
//       status,
//       image1: image1Url,
//       image2: image2Url
//     });

//     const savedBook = await book.save();
    
//     // Convert to plain object for response
//     const responseBook = {
//       _id: savedBook._id.toString(),
//       bookName: savedBook.bookName,
//       authorName: savedBook.authorName,
//       description: savedBook.description,
//       mrpPrice: savedBook.mrpPrice,
//       salePrice: savedBook.salePrice,
//       status: savedBook.status,
//       image1: savedBook.image1,
//       image2: savedBook.image2,
//       createdAt: savedBook.createdAt,
//       updatedAt: savedBook.updatedAt
//     };

//     console.log('Book created successfully:', responseBook);
    
//     return NextResponse.json(responseBook, { status: 201 });
//   } catch (error: any) {
//     console.error('POST Book Error:', error);
    
//     if (error.name === 'ValidationError') {
//       const errors = Object.values(error.errors).map((err: any) => err.message);
//       return NextResponse.json(
//         { error: errors.join(', ') }, 
//         { status: 400 }
//       );
//     }
    
//     return NextResponse.json(
//       { error: 'Failed to create book' }, 
//       { status: 500 }
//     );
//   }
// }


import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../connectDB";
import Book from "../models/Book";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    await connectDB();
    const books = await Book.find({}).sort({ createdAt: -1 });
    
    const booksData = books.map(book => ({
      _id: book._id.toString(),
      bookName: book.bookName,
      authorName: book.authorName,
      description: book.description,
      mrpPrice: book.mrpPrice,
      salePrice: book.salePrice,
      status: book.status,
      image1: book.image1,
      image2: book.image2,
      createdAt: book.createdAt,
      updatedAt: book.updatedAt
    }));
    
    return NextResponse.json(booksData);
  } catch (error) {
    console.error('GET Books Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch books' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    const formData = await request.formData();
    
    // Get text fields
    const bookName = formData.get('bookName') as string;
    const authorName = formData.get('authorName') as string;
    const description = formData.get('description') as string;
    const mrpPrice = parseFloat(formData.get('mrpPrice') as string);
    const salePrice = parseFloat(formData.get('salePrice') as string);
    const status = (formData.get('status') as string) || 'draft';
    const image1 = formData.get('image1') as File;
    const image2 = formData.get('image2') as File;

    // Validate required fields
    if (!bookName || !authorName || !description || isNaN(mrpPrice) || isNaN(salePrice)) {
      return NextResponse.json(
        { error: 'All fields are required' }, 
        { status: 400 }
      );
    }

    // Validate images
    if (!image1 || image1.size === 0 || !image2 || image2.size === 0) {
      return NextResponse.json(
        { error: 'Both images are required' }, 
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      console.error('Error creating uploads directory:', error);
    }

    // Generate unique filenames
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    
    const getFileExtension = (filename: string) => {
      return filename.split('.').pop()?.toLowerCase() || 'jpg';
    };

    const image1Ext = getFileExtension(image1.name);
    const image2Ext = getFileExtension(image2.name);
    
    const image1Filename = `book_${timestamp}_${random}_1.${image1Ext}`;
    const image2Filename = `book_${timestamp}_${random}_2.${image2Ext}`;

    // Convert files to buffers
    const image1Buffer = Buffer.from(await image1.arrayBuffer());
    const image2Buffer = Buffer.from(await image2.arrayBuffer());

    // Save images to filesystem
    const image1Path = path.join(uploadsDir, image1Filename);
    const image2Path = path.join(uploadsDir, image2Filename);

    await writeFile(image1Path, image1Buffer);
    await writeFile(image2Path, image2Buffer);

    // Create image URLs
    const image1Url = `/uploads/${image1Filename}`;
    const image2Url = `/uploads/${image2Filename}`;

    // Create book in database
    const book = new Book({
      bookName,
      authorName,
      description,
      mrpPrice,
      salePrice,
      status,
      image1: image1Url,
      image2: image2Url
    });

    const savedBook = await book.save();
    
    const responseBook = {
      _id: savedBook._id.toString(),
      bookName: savedBook.bookName,
      authorName: savedBook.authorName,
      description: savedBook.description,
      mrpPrice: savedBook.mrpPrice,
      salePrice: savedBook.salePrice,
      status: savedBook.status,
      image1: savedBook.image1,
      image2: savedBook.image2,
      createdAt: savedBook.createdAt,
      updatedAt: savedBook.updatedAt
    };

    return NextResponse.json(responseBook, { status: 201 });
  } catch (error: any) {
    console.error('POST Book Error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: errors.join(', ') }, 
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create book' }, 
      { status: 500 }
    );
  }
}