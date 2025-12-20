const express = require('express');
const app = express();
const cors = require('cors');

const Routes = require('./routes/index.routes');
const errorHandler = require('./middlewares/errorHandler');

app.use(express.json());
app.use(cors());
// app.use(
//   cors({
//     origin: ["http://localhost:3000", "https://your-frontend-domain.com"],
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
//     credentials: true
//   })
// );
app.use('/api', Routes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);

module.exports = app;