const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

// Set up a storage engine for multer to store uploaded files
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
});

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Serve the HTML form to upload the PDF file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle file upload
app.post('/upload', upload.single('pdfFile'), (req, res) => {
  const uploadedFile = req.file;

  if (!uploadedFile) {
    return res.status(400).json({ success: false, message: 'Please upload a PDF file.' });
  }

  const fileURL = `/uploads/${uploadedFile.filename}`;
  res.json({ success: true, message: 'File uploaded successfully.', fileURL });
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
