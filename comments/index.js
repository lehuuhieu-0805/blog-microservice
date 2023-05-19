const express = require('express');
const { randomBytes } = require('crypto');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4001;
const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  // id post
  const { id } = req.params;

  res.send(commentsByPostId[id] || []);
});

app.post('/posts/:id/comments', (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;

  // id post
  const { id } = req.params;

  const comments = commentsByPostId[id] || [];
  comments.push({ id: commentId, content });
  commentsByPostId[id] = comments;

  res.status(201).send(comments);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
