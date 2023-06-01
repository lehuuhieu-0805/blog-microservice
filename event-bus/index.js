const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 4005;

app.post('/events', (req, res) => {
  const { type, data } = req.body;

  axios({
    method: 'POST',
    url: 'http://localhost:4000/events',
    data: {
      type,
      data,
    },
  });
  axios({
    method: 'POST',
    url: 'http://localhost:4001/events',
    data: {
      type,
      data,
    },
  });
  axios({
    method: 'POST',
    url: 'http://localhost:4002/events',
    data: {
      type,
      data,
    },
  });
  axios({
    method: 'POST',
    url: 'http://localhost:4003/events',
    data: {
      type,
      data,
    },
  });

  res.send({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
