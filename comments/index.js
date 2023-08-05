const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 4001;
const commentsByPostId = {};

const EVENT_TYPE = {
  COMMENT_CREATED: 'CommentCreated',
  COMMENT_MODERATED: 'CommentModerated',
  COMMENT_UPDATED: 'CommentUpdated',
};

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
    url: 'http://event-bus-srv:4005/events',
    data: {
      type: EVENT_TYPE.COMMENT_CREATED,
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

app.post('/events', async (req, res) => {
  console.log('Received Event: ', req.body.type);

  const { type, data } = req.body;

  if (type === EVENT_TYPE.COMMENT_MODERATED) {
    const { postId, id, status, content } = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find((comment) => {
      return comment.id === id;
    });
    comment.status = status;

    await axios({
      method: 'POST',
      url: 'http://event-bus-srv:4005/events',
      data: {
        type: EVENT_TYPE.COMMENT_UPDATED,
        data: {
          id,
          status,
          content,
          postId,
        },
      },
    });
  }

  res.send({});
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
