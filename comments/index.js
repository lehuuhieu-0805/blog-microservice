const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 4001;
const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  // id post
  const { id } = req.params;

  res.send(commentsByPostId[id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;

  // id post
  const { id } = req.params;

  const comments = commentsByPostId[id] || [];
  comments.push({ id: commentId, content, status: 'pending' });
  commentsByPostId[id] = comments;

  await axios({
    method: 'POST',
    url: 'http://localhost:4005/events',
    data: {
      type: 'CommentCreated',
      data: {
        id: commentId,
        content,
        postId: id,
        status: 'pending',
      },
    },
  });

  res.status(201).send(comments);
});

app.post('/events', (req, res) => {
  console.log('Received Event: ', req.body.type);

  res.send({});
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
