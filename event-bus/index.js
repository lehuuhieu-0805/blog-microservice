const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 4005;

const events = [];

app.post('/events', (req, res) => {
  const { type, data } = req.body;

  events.push({ type, data });
  console.log(events);

  axios({
    method: 'POST',
    url: 'http://posts-clusterip-srv:4000/events',
    data: {
      type,
      data,
    },
  });
  axios({
    method: 'POST',
    url: 'http://comments-srv:4001/events',
    data: {
      type,
      data,
    },
  });
  axios({
    method: 'POST',
    url: 'http://query-srv:4002/events',
    data: {
      type,
      data,
    },
  }).catch((error) => {
    console.log(error);
  });
  axios({
    method: 'POST',
    url: 'http://moderation-srv:4003/events',
    data: {
      type,
      data,
    },
  });

  res.send({ status: 'OK' });
});

app.get('/events', (req, res) => {
  res.send(events);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
