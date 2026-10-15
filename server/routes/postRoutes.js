import express from 'express';
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/postController.js';
import {
  getCommentsByPost,
  createComment,
} from '../controllers/commentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Post routes
router.route('/').get(getPosts).post(protect, createPost);

router
  .route('/:id')
  .get(getPostById)
  .put(protect, updatePost)
  .delete(protect, deletePost);

// Nested comment routes on posts: /api/posts/:postId/comments
router
  .route('/:postId/comments')
  .get(getCommentsByPost)
  .post(protect, createComment);

export default router;
