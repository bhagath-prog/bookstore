// import { NextRequest, NextResponse } from "next/server";
// import { connectDB } from "../../connectDB";
// import Book from "../../models/Book";
// import { writeFile, unlink, mkdir } from "fs/promises";
// import path from "path";

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await connectDB();
//     const book = await Book.findById(params.id);
    
//     if (!book) {
//       return NextResponse.json(
//         { error: 'Book not found' }, 
//         { status: 404 }
//       );
//     }
    
//     const bookData = {
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
//     };
    
//     return NextResponse.json(bookData);
//   } catch (error) {
//     console.error('GET Book Error:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch book' }, 
//       { status: 500 }
//     );
//   }
// }

// export async function PUT(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await connectDB();
    
//     const book = await Book.findById(params.id);
//     if (!book) {
//       return NextResponse.json(
//         { error: 'Book not found' }, 
//         { status: 404 }
//       );
//     }

//     const formData = await request.formData();
    
//     // Get text fields
//     const bookName = formData.get('bookName') as string;
//     const authorName = formData.get('authorName') as string;
//     const description = formData.get('description') as string;
//     const mrpPrice = parseFloat(formData.get('mrpPrice') as string);
//     const salePrice = parseFloat(formData.get('salePrice') as string);
//     const status = formData.get('status') as string;

//     // Validate required fields
//     if (!bookName || !authorName || !description || isNaN(mrpPrice) || isNaN(salePrice)) {
//       return NextResponse.json(
//         { error: 'All fields are required' }, 
//         { status: 400 }
//       );
//     }

//     // Prepare update data
//     const updateData: any = {
//       bookName,
//       authorName,
//       description,
//       mrpPrice,
//       salePrice,
//       status
//     };

//     // Handle image updates
//     const image1 = formData.get('image1') as File;
//     const image2 = formData.get('image2') as File;

//     if (image1 && image1.size > 0) {
//       if (!image1.type.startsWith('image/')) {
//         return NextResponse.json(
//           { error: 'Only image files are allowed' }, 
//           { status: 400 }
//         );
//       }

//       const maxSize = 5 * 1024 * 1024;
//       if (image1.size > maxSize) {
//         return NextResponse.json(
//           { error: 'Image size should be less than 5MB' }, 
//           { status: 400 }
//         );
//       }

//       // Generate new filename
//       const timestamp = Date.now();
//       const random = Math.random().toString(36).substring(2, 15);
      
//       const getFileExtension = (filename: string) => {
//         return filename.split('.').pop()?.toLowerCase() || 'jpg';
//       };

//       const image1Ext = getFileExtension(image1.name);
//       const image1Filename = `book_${timestamp}_${random}_1.${image1Ext}`;

//       // Save new image
//       const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
//       await mkdir(uploadsDir, { recursive: true });

//       const image1Buffer = Buffer.from(await image1.arrayBuffer());
//       const image1Path = path.join(uploadsDir, image1Filename);

//       await writeFile(image1Path, image1Buffer);
//       updateData.image1 = `/uploads/${image1Filename}`;

//       // Delete old image if it exists and is not the default placeholder
//       if (book.image1 && !book.image1.includes('placeholder')) {
//         try {
//           const oldImagePath = path.join(process.cwd(), 'public', book.image1);
//           await unlink(oldImagePath);
//         } catch (error) {
//           console.error('Error deleting old image 1:', error);
//         }
//       }
//     }

//     if (image2 && image2.size > 0) {
//       if (!image2.type.startsWith('image/')) {
//         return NextResponse.json(
//           { error: 'Only image files are allowed' }, 
//           { status: 400 }
//         );
//       }

//       const maxSize = 5 * 1024 * 1024;
//       if (image2.size > maxSize) {
//         return NextResponse.json(
//           { error: 'Image size should be less than 5MB' }, 
//           { status: 400 }
//         );
//       }

//       // Generate new filename
//       const timestamp = Date.now();
//       const random = Math.random().toString(36).substring(2, 15);
      
//       const getFileExtension = (filename: string) => {
//         return filename.split('.').pop()?.toLowerCase() || 'jpg';
//       };

//       const image2Ext = getFileExtension(image2.name);
//       const image2Filename = `book_${timestamp}_${random}_2.${image2Ext}`;

//       // Save new image
//       const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
//       await mkdir(uploadsDir, { recursive: true });

//       const image2Buffer = Buffer.from(await image2.arrayBuffer());
//       const image2Path = path.join(uploadsDir, image2Filename);

//       await writeFile(image2Path, image2Buffer);
//       updateData.image2 = `/uploads/${image2Filename}`;

//       // Delete old image if it exists and is not the default placeholder
//       if (book.image2 && !book.image2.includes('placeholder')) {
//         try {
//           const oldImagePath = path.join(process.cwd(), 'public', book.image2);
//           await unlink(oldImagePath);
//         } catch (error) {
//           console.error('Error deleting old image 2:', error);
//         }
//       }
//     }

//     const updatedBook = await Book.findByIdAndUpdate(
//       params.id,
//       updateData,
//       { new: true, runValidators: true }
//     );

//     const responseBook = {
//       _id: updatedBook!._id.toString(),
//       bookName: updatedBook!.bookName,
//       authorName: updatedBook!.authorName,
//       description: updatedBook!.description,
//       mrpPrice: updatedBook!.mrpPrice,
//       salePrice: updatedBook!.salePrice,
//       status: updatedBook!.status,
//       image1: updatedBook!.image1,
//       image2: updatedBook!.image2,
//       createdAt: updatedBook!.createdAt,
//       updatedAt: updatedBook!.updatedAt
//     };

//     return NextResponse.json(responseBook);
//   } catch (error: any) {
//     console.error('PUT Book Error:', error);
    
//     if (error.name === 'ValidationError') {
//       const errors = Object.values(error.errors).map((err: any) => err.message);
//       return NextResponse.json(
//         { error: errors.join(', ') }, 
//         { status: 400 }
//       );
//     }
    
//     return NextResponse.json(
//       { error: 'Failed to update book' }, 
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await connectDB();
//     const book = await Book.findById(params.id);
    
//     if (!book) {
//       return NextResponse.json(
//         { error: 'Book not found' }, 
//         { status: 404 }
//       );
//     }

//     // Delete associated images if they exist and are not placeholder images
//     try {
//       if (book.image1 && !book.image1.includes('placeholder')) {
//         const image1Path = path.join(process.cwd(), 'public', book.image1);
//         await unlink(image1Path);
//       }
//       if (book.image2 && !book.image2.includes('placeholder')) {
//         const image2Path = path.join(process.cwd(), 'public', book.image2);
//         await unlink(image2Path);
//       }
//     } catch (error) {
//       console.error('Error deleting book images:', error);
//       // Continue with book deletion even if image deletion fails
//     }

//     await Book.findByIdAndDelete(params.id);
    
//     return NextResponse.json({ message: 'Book deleted successfully' });
//   } catch (error) {
//     console.error('DELETE Book Error:', error);
//     return NextResponse.json(
//       { error: 'Failed to delete book' }, 
//       { status: 500 }
//     );
//   }
// }



import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../connectDB";
import Book from "../../models/Book";
import { writeFile, unlink, mkdir } from "fs/promises";
import path from "path";

// Add this to properly handle params in Next.js 13+
export async function generateStaticParams() {
  return [];
}

// Type for params
type Params = {
  id: string;
};

export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    await connectDB();
    const book = await Book.findById(params.id);
    
    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' }, 
        { status: 404 }
      );
    }
    
    const bookData = {
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
    };
    
    return NextResponse.json(bookData);
  } catch (error) {
    console.error('GET Book Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch book' }, 
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    await connectDB();
    
    const book = await Book.findById(params.id);
    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' }, 
        { status: 404 }
      );
    }

    const formData = await request.formData();
    
    // Get text fields
    const bookName = formData.get('bookName') as string;
    const authorName = formData.get('authorName') as string;
    const description = formData.get('description') as string;
    const mrpPrice = parseFloat(formData.get('mrpPrice') as string);
    const salePrice = parseFloat(formData.get('salePrice') as string);
    const status = formData.get('status') as string;

    // Validate required fields
    if (!bookName || !authorName || !description || isNaN(mrpPrice) || isNaN(salePrice)) {
      return NextResponse.json(
        { error: 'All fields are required' }, 
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {
      bookName,
      authorName,
      description,
      mrpPrice,
      salePrice,
      status
    };

    // Handle image updates
    const image1 = formData.get('image1') as File;
    const image2 = formData.get('image2') as File;

    if (image1 && image1.size > 0) {
      if (!image1.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'Only image files are allowed' }, 
          { status: 400 }
        );
      }

      const maxSize = 5 * 1024 * 1024;
      if (image1.size > maxSize) {
        return NextResponse.json(
          { error: 'Image size should be less than 5MB' }, 
          { status: 400 }
        );
      }

      // Generate new filename
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 15);
      
      const getFileExtension = (filename: string) => {
        return filename.split('.').pop()?.toLowerCase() || 'jpg';
      };

      const image1Ext = getFileExtension(image1.name);
      const image1Filename = `book_${timestamp}_${random}_1.${image1Ext}`;

      // Save new image
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadsDir, { recursive: true });

      const image1Buffer = Buffer.from(await image1.arrayBuffer());
      const image1Path = path.join(uploadsDir, image1Filename);

      await writeFile(image1Path, image1Buffer);
      updateData.image1 = `/uploads/${image1Filename}`;

      // Delete old image if it exists and is not the default placeholder
      if (book.image1 && !book.image1.includes('placeholder')) {
        try {
          const oldImagePath = path.join(process.cwd(), 'public', book.image1);
          await unlink(oldImagePath);
        } catch (error) {
          console.error('Error deleting old image 1:', error);
        }
      }
    }

    if (image2 && image2.size > 0) {
      if (!image2.type.startsWith('image/')) {
        return NextResponse.json(
          { error: 'Only image files are allowed' }, 
          { status: 400 }
        );
      }

      const maxSize = 5 * 1024 * 1024;
      if (image2.size > maxSize) {
        return NextResponse.json(
          { error: 'Image size should be less than 5MB' }, 
          { status: 400 }
        );
      }

      // Generate new filename
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 15);
      
      const getFileExtension = (filename: string) => {
        return filename.split('.').pop()?.toLowerCase() || 'jpg';
      };

      const image2Ext = getFileExtension(image2.name);
      const image2Filename = `book_${timestamp}_${random}_2.${image2Ext}`;

      // Save new image
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadsDir, { recursive: true });

      const image2Buffer = Buffer.from(await image2.arrayBuffer());
      const image2Path = path.join(uploadsDir, image2Filename);

      await writeFile(image2Path, image2Buffer);
      updateData.image2 = `/uploads/${image2Filename}`;

      // Delete old image if it exists and is not the default placeholder
      if (book.image2 && !book.image2.includes('placeholder')) {
        try {
          const oldImagePath = path.join(process.cwd(), 'public', book.image2);
          await unlink(oldImagePath);
        } catch (error) {
          console.error('Error deleting old image 2:', error);
        }
      }
    }

    const updatedBook = await Book.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true }
    );

    const responseBook = {
      _id: updatedBook!._id.toString(),
      bookName: updatedBook!.bookName,
      authorName: updatedBook!.authorName,
      description: updatedBook!.description,
      mrpPrice: updatedBook!.mrpPrice,
      salePrice: updatedBook!.salePrice,
      status: updatedBook!.status,
      image1: updatedBook!.image1,
      image2: updatedBook!.image2,
      createdAt: updatedBook!.createdAt,
      updatedAt: updatedBook!.updatedAt
    };

    return NextResponse.json(responseBook);
  } catch (error: any) {
    console.error('PUT Book Error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: errors.join(', ') }, 
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to update book' }, 
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  try {
    console.log('DELETE request received for book ID:', params.id);
    
    await connectDB();
    const book = await Book.findById(params.id);
    
    if (!book) {
      console.log('Book not found:', params.id);
      return NextResponse.json(
        { error: 'Book not found' }, 
        { status: 404 }
      );
    }

    console.log('Found book to delete:', book.bookName);

    // Delete associated images if they exist and are not placeholder images
    try {
      if (book.image1 && !book.image1.includes('placeholder')) {
        const image1Path = path.join(process.cwd(), 'public', book.image1);
        console.log('Deleting image 1:', image1Path);
        await unlink(image1Path);
      }
      if (book.image2 && !book.image2.includes('placeholder')) {
        const image2Path = path.join(process.cwd(), 'public', book.image2);
        console.log('Deleting image 2:', image2Path);
        await unlink(image2Path);
      }
    } catch (error) {
      console.error('Error deleting book images:', error);
      // Continue with book deletion even if image deletion fails
    }

    await Book.findByIdAndDelete(params.id);
    console.log('Book deleted successfully from database');
    
    return NextResponse.json({ 
      success: true,
      message: 'Book deleted successfully' 
    });
  } catch (error) {
    console.error('DELETE Book Error:', error);
    return NextResponse.json(
      { error: 'Failed to delete book' }, 
      { status: 500 }
    );
  }
}