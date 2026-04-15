import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
  bookName: {
    type: String,
    required: [true, 'Book name is required'],
    trim: true,
    maxlength: [100, 'Book name cannot be more than 100 characters']
  },
  authorName: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true,
    maxlength: [50, 'Author name cannot be more than 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  mrpPrice: {
    type: Number,
    required: [true, 'MRP price is required'],
    min: [0, 'MRP price cannot be negative']
  },
  salePrice: {
    type: Number,
    required: [true, 'Sale price is required'],
    min: [0, 'Sale price cannot be negative'],
    validate: {
      validator: function(value: number) {
        return value <= (this as any).mrpPrice;
      },
      message: 'Sale price cannot be greater than MRP price'
    }
  },
  status: {
    type: String,
    enum: {
      values: ['draft', 'active'],
      message: 'Status must be either draft or active'
    },
    default: 'draft'
  },
  image1: {
    type: String,
    required: [true, 'First image is required']
  },
  image2: {
    type: String,
    required: [true, 'Second image is required']
  }
}, {
  timestamps: true
});

export default mongoose.models.Book || mongoose.model('Book', BookSchema);