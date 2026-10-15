import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a post title'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please provide post content'],
    },
    imageUrl: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'General',
      enum: ['General', 'Technology', 'Web Development', 'Design', 'Career', 'Tutorials'],
    },
    readTime: {
      type: String,
      default: '3 min read',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate reading time hook
postSchema.pre('save', function (next) {
  if (this.content) {
    const wordCount = this.content.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 200));
    this.readTime = `${minutes} min read`;
  }
  next();
});

export const Post = mongoose.model('Post', postSchema);
