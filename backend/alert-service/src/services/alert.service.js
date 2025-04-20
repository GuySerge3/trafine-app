let io;
const Alert = require('../models/alert.model');

function setSocketIO(ioInstance) {
  io = ioInstance;
}

async function sendAlert(message) {
  if (!io) return console.error('Socket.IO not ready');

  const alert = await Alert.create({ message });
  io.emit('alert', { message, timestamp: alert.timestamp });

  console.log(`💾 Alert saved and emitted: ${message}`);
}

module.exports = {
  setSocketIO,
  sendAlert
};
