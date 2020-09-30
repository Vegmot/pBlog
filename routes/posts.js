// what routes/posts.js does is
// to clarify what should be done for each methods
// which are get, post, put and delete
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

const Post = require('../models/Post');

// @route   GET api/posts
// @desc    Get posts that certain user has written
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id }).sort({
      postedDate: -1,
    });
    res.json({ posts });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/posts
// @desc    Write a post
// @access  Private
router.post(
  '/',
  auth,
  [
    check('title', 'Please enter a title').not().isEmpty(),
    check('content', 'Please enter contents').not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, category } = req.body;

    try {
      const newPost = new Post({
        title,
        content,
        category,
        user: req.user.id, // ensures the user owns the posts they wrote
      });

      const post = await newPost.save();

      res.json(post);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route   PUT api/posts/:id
// @desc    Edit a post
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { title, content, category } = req.body;

  const postFields = {};
  if (title) postFields.title = title;
  if (content) postFields.content = content;
  if (category) postFields.category = category;

  try {
    let post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    // Make sure the user owns the posts they wrote
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorised' });
    }

    post = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: postFields },
      { new: true }
    );

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    // Make sure the user owns the posts they wrote
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorised' });
    }

    await Post.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Post removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
