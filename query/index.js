const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 4002;

const EVENTS_TYPE = {
  POST_CREATED: 'PostCreated',
  COMMENT_CREATED: 'CommentCreated',
  COMMENT_UPDATED: 'CommentUpdated',
};

const posts = {};

const handleEvent = (type, data) => {
  if (type === EVENTS_TYPE.POST_CREATED) {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }
  if (type === EVENTS_TYPE.COMMENT_CREATED) {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    post.comments.push({ id, content, status });
  }
  if (type === EVENTS_TYPE.COMMENT_UPDATED) {
    const { id, content, status, postId } = data;
    const post = posts[postId];
    const comment = post.comments.find((comment) => {
      return comment.id === id;
    });

    comment.status = status;
    comment.content = content;
  }
};

app.get('/posts', (req, res) => {
  res.send(posts);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;

  handleEvent(type, data);

  res.send({});
});

app.listen(PORT, async () => {
  console.log(`Example app listening on port ${PORT}`);

  const res = await axios({
    method: 'GET',
    url: 'http://event-bus-srv:4005/events',
  });

  console.log(res.data);

  for (let event of res.data) {
    console.log(event);
    console.log('Processing event: ', event.type);

    handleEvent(event.type, event.data);
  }
});
