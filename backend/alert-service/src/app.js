require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { setupSocket } = require('./socket/alert.socket');
const alertRoutes = require('./routes/alert.routes');

const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: { origin: '*' }
});

setupSocket(io);

app.use(cors());
app.use(express.json());

app.post('/api/alerts', (req, res) => {
  const { message } = req.body;
  io.emit('alert', { message }); 
  res.json({ status: 'Alert sent', message });
});
app.use('/api/alerts', alertRoutes);


io.on('connection', (socket) => {
  console.log(`🟢 Client connected: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`🔴 Client disconnected: ${socket.id}`);
  });
});

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected (Alert Service)"))
  .catch((err) => console.error("MongoDB error:", err));


server.listen(process.env.PORT, () =>
  console.log(`🔔 Alert Service running on port ${process.env.PORT}`)
);
