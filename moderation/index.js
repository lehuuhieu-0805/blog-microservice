const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 4003;

app.post('/events', (req, res) => {});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
