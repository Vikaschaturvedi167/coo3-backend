const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const TelegramBot = require('node-telegram-bot-api');
const userRouter = require('./routes/userRoutes'); // Import your user router

dotenv.config();

const app = express();
const INITIAL_PORT = process.env.PORT || 5000;
let currentPort = INITIAL_PORT;


app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Basic Route
app.get('/', (req, res) => {
  res.send('TapMe Backend is running');
});

// Use the imported routes
app.use('/api', userRouter);

// Telegram Bot Setup
const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token);

// Set up webhook route
app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Set webhook to your Render.com server URL
const webhookUrl = process.env.TELEGRAM_WEBHOOK_URL;
bot.setWebHook(webhookUrl).then(() => {
  console.log(`Webhook set to ${webhookUrl}`);
}).catch(err => {
  console.error('Error setting webhook:', err);
});

// Start the server on the first available port
const startServer = (port) => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use.`);
      currentPort++;
      if (currentPort <= 65535) {
        console.log(`Trying port ${currentPort}...`);
        startServer(currentPort);
      } else {
        console.error('No available ports in the range.');
        process.exit(1);
      }
    } else {
      console.error('Uncaught exception:', err);
      process.exit(1);
    }
  });
};

startServer(currentPort);
