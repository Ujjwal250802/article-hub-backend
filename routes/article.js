const express = require('express');
const multer = require('multer');
const connection = require('../connection');
const router = express.Router();
var auth = require('../services/authentication');
const path = require('path');

// Set up Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Set the directory where the images will be saved
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Initialize multer with the storage configuration
const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Serve uploaded files statically
router.use('/uploads', express.static('uploads'));

// Route to handle image uploads for the editor
router.post('/upload/editor-image', auth.autheticateToken, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Return the URL of the uploaded image
  const imageUrl = `http://localhost:8080/article/uploads/${req.file.filename}`;
  return res.status(200).json({ url: imageUrl });
});

router.post('/addNewArticle', auth.autheticateToken, (req, res) => {
  let article = req.body;
  var selectQuery = "insert into article (title, content, publication_date, categoryID, status) values(?,?,?,?,?)";
  connection.query(selectQuery, [article.title, article.content, new Date(), article.categoryID, article.status], (err, results) => {
    if (!err) {
      return res.status(200).json({ message: "Article Added Successfully" });
    } else {
      return res.status(500).json(err);
    }
  });
});

router.get('/getAllarticle', auth.autheticateToken, (req, res) => {
  var selectQuery = "select a.id, a.title, a.content, a.status, a.publication_date, c.id as categoryID, c.name as categoryName from article as a inner join category as c where a.categoryID = c.id";
  connection.query(selectQuery, (err, results) => {
    if (!err) {
      return res.status(200).json(results);
    } else {
      return res.status(500).json(err);
    }
  });
});

router.get('/getAllPublishedArticle', (req, res) => {
  var selectQuery = "select a.id, a.title, a.content, a.status, a.publication_date, c.id as categoryID, c.name as categoryName from article as a inner join category as c where a.categoryID = c.id and a.status='published'";
  connection.query(selectQuery, (err, results) => {
    if (!err) {
      return res.status(200).json(results);
    } else {
      return res.status(500).json(err);
    }
  });
});

router.post('/updateArticle', auth.autheticateToken, (req, res) => {
  let article = req.body;
  var selectQuery = "update article set title=?, content=?, categoryID=?, publication_date=?, status=? where id=?";
  connection.query(selectQuery, [article.title, article.content, article.categoryID, new Date(), article.status, article.id], (err, results) => {
    if (!err) {
      if (results.affectedRows == 0) {
        return res.status(404).json({ message: "Article Id Does not found" });
      }
      return res.status(200).json({ message: "Article Updated Successfully" });
    } else {
      return res.status(500).json(err);
    }
  });
});

router.get('/deleteArticle/:id', auth.autheticateToken, (req, res) => {
  const id = req.params.id;
  var selectQuery = "delete from article where id=?";
  connection.query(selectQuery, [id], (err, results) => {
    if (!err) {
      if (results.affectedRows == 0) {
        return res.status(404).json({ message: "Article Id Does not found" });
      }
      return res.status(200).json({ message: "Article deleted Successfully" });
    } else {
      return res.status(500).json(err);
    }
  });
});

module.exports = router;