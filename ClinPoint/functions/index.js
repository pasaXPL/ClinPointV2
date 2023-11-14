const functions = require("firebase-functions");

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors'); // Import the cors middleware
const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

// Set up a storage engine for multer to store files
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, './uploads'); // Change the destination path as needed
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  }
});

const upload = multer({ storage });

// Serve uploaded files statically
app.use('/uploads', ((express.static('uploads'))));

app.get('/testAPI', (req, res) => {
  res.status(200).json({ message: 'API is working totally fine'});
});

app.post('/upload', upload.single('file'), (req, res) => {
  res.status(200).json({ message: 'File uploaded successfully' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

exports.app = functions.https.onRequest(app);
