import { Post } from '../models/Post.js';
import { Comment } from '../models/Comment.js';

// @desc    Get all posts (with search, category, author filtering and pagination)
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 9;
    const skip = (page - 1) * limit;

    const query = {};

    // Search by title or content
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { content: searchRegex }];
    }

    // Filter by category
    if (req.query.category && req.query.category !== 'All') {
      query.category = req.query.category;
    }

    // Filter by author
    if (req.query.author) {
      query.author = req.query.author;
    }

    const total = await Post.countDocuments(query);

    const posts = await Post.find(query)
      .populate('author', 'name email avatar bio')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get comment counts for each post in the current page
    const postIds = posts.map((p) => p._id);
    const commentCounts = await Comment.aggregate([
      { $match: { post: { $in: postIds } } },
      { $group: { _id: '$post', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    commentCounts.forEach((c) => {
      countMap[c._id.toString()] = c.count;
    });

    const postsWithCounts = posts.map((post) => ({
      ...post.toObject(),
      commentCount: countMap[post._id.toString()] || 0,
    }));

    res.status(200).json({
      success: true,
      count: postsWithCounts.length,
      total,
      totalPages: Math.ceil(total / limit) || 1,
      currentPage: page,
      posts: postsWithCounts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Public
export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      'author',
      'name email avatar bio createdAt'
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const commentCount = await Comment.countDocuments({ post: post._id });

    res.status(200).json({
      success: true,
      post: {
        ...post.toObject(),
        commentCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res, next) => {
  try {
    const { title, content, imageUrl, category } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both title and content for the post',
      });
    }

    const post = await Post.create({
      title,
      content,
      imageUrl: imageUrl || '',
      category: category || 'General',
      author: req.user._id,
    });

    const populatedPost = await Post.findById(post._id).populate(
      'author',
      'name email avatar'
    );

    res.status(201).json({
      success: true,
      message: 'Post published successfully',
      post: {
        ...populatedPost.toObject(),
        commentCount: 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = async (req, res, next) => {
  try {
    let post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Verify ownership
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'User not authorized to update this post',
      });
    }

    const { title, content, imageUrl, category } = req.body;

    if (title) post.title = title;
    if (content) post.content = content;
    if (imageUrl !== undefined) post.imageUrl = imageUrl;
    if (category) post.category = category;

    await post.save();

    const updatedPost = await Post.findById(post._id).populate(
      'author',
      'name email avatar bio'
    );

    const commentCount = await Comment.countDocuments({ post: post._id });

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      post: {
        ...updatedPost.toObject(),
        commentCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Verify ownership
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'User not authorized to delete this post',
      });
    }

    // Delete all comments associated with this post
    await Comment.deleteMany({ post: post._id });

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Post and associated comments removed successfully',
    });
  } catch (error) {
    next(error);
  }
};
