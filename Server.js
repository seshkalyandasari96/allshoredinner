// server.js
const https = require('https'); // Import HTTPS module
const fs = require('fs');       // Import file system module
const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { env } = require("process");
const UserRoutes = require('./Routes/UserRoutes');
const AttendanceRoutes = require('./Routes/AttendanceRoutes');

const app = express();

app.use(express.json()); // Middleware to parse JSON

// Connect to MongoDB
mongoose.connect('mongodb+srv://ManoharErra:Manohar517*@dinnerplanner.3bq5i.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// CORS setup
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(bodyParser.json());
app.get('/hello', (req, res) => { res.json({ message: "Hello World" }) });

app.use('/user', UserRoutes);
app.use('/', AttendanceRoutes);

// Load SSL Certificates
const sslOptions = {
  key: fs.readFileSync('/etc/letsencrypt/live/dinner-backend.eastus.cloudapp.azure.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/dinner-backend.eastus.cloudapp.azure.com/fullchain.pem'),
};

// Create an HTTPS server
const PORT = 443;
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`Secure server running on port ${PORT}`);
});

// Optionally, redirect HTTP to HTTPS (Optional HTTP Server on Port 80)
// const http = require('http');
// http.createServer((req, res) => {
//   res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
//   res.end();
// }).listen(80, () => {
//   console.log('HTTP server running on port 80 and redirecting to HTTPS');
// });
